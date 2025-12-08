document.addEventListener("DOMContentLoaded", () => {
    carregarMinhasReservas();
});

const container = document.getElementById("gridReservas");
const usuarioId = localStorage.getItem("usuarioId");

async function carregarMinhasReservas() {
    if (!usuarioId) {
        container.innerHTML = `
            <div class="empty-state">
                <p>Faça login para ver suas reservas.</p>
                <a href="Login.html" style="color:var(--azul-turquesa)">Ir para Login</a>
            </div>`;
        return;
    }

    try {
        // Chama a NOVA rota com /usuario/ID
        const response = await fetch(`http://localhost:3000/reservas/usuario/${usuarioId}`);
        const reservas = await response.json();

        container.innerHTML = "";

        if (!reservas || reservas.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <h3>Nenhuma reserva encontrada 📅</h3>
                    <p>Você ainda não reservou nenhum livro.</p>
                </div>`;
            return;
        }

        reservas.forEach(reserva => {
            const card = document.createElement("div");
            card.className = "card-reserva";

            // Formatar datas para PT-BR (DD/MM/AAAA)
            const dataRetirada = new Date(reserva.data_retirada).toLocaleDateString('pt-BR');
            // Ajuste para data de devolução (às vezes vem com timezone, new Date resolve)
            const dataDevolucao = new Date(reserva.data_devolucao).toLocaleDateString('pt-BR');
            
            const capa = reserva.caminho_capa || './images/capa-default.jpg';

            card.innerHTML = `
                <img src="${capa}" alt="Capa" class="reserva-img">
                
                <div class="reserva-info">
                    <div class="reserva-titulo">${reserva.titulo}</div>
                    <div class="reserva-autor">${reserva.autor}</div>
                    
                    <div class="reserva-datas">
                        <div class="data-item">
                            <strong>Retirada</strong>
                            <span>${dataRetirada}</span>
                        </div>
                        <div class="data-item">
                            <strong>Devolução</strong>
                            <span>${dataDevolucao}</span>
                        </div>
                    </div>

                    <button class="btn-cancelar" onclick="cancelarReserva(${reserva.reserva_id})">
                        Cancelar Reserva
                    </button>
                </div>
            `;
            container.appendChild(card);
        });

    } catch (error) {
        console.error("Erro:", error);
        container.innerHTML = "<p>Erro ao carregar reservas.</p>";
    }
}

window.cancelarReserva = async function(id) {
    if(!confirm("Tem certeza que deseja cancelar esta reserva?")) return;

    try {
        const response = await fetch(`http://localhost:3000/reservas/${id}`, {
            method: "DELETE"
        });

        if (response.ok) {
            alert("Reserva cancelada!");
            carregarMinhasReservas(); // Atualiza a lista
        } else {
            alert("Erro ao cancelar.");
        }
    } catch (error) {
        alert("Erro de conexão.");
    }
};