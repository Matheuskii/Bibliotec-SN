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

    const token = localStorage.getItem("userToken"); // <--- PEGA O TOKEN

    try {
        const response = await fetch(`http://localhost:3000/reservas/usuario/${usuarioId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        // ============================================================
        // CORREÇÃO CRÍTICA AQUI:
        // Faltava essa linha para criar a variável 'reservas'
        // ============================================================
        const reservas = await response.json(); 

        container.innerHTML = "";

        // Verifica se o servidor retornou erro de token
        if (response.status === 401 || response.status === 403) {
            alert("Sessão expirada. Faça login novamente.");
            window.location.href = "Login.html";
            return;
        }

        // Verifica se reservas existe e é um array antes de checar length
        if (!reservas || !Array.isArray(reservas) || reservas.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <h3>Nenhuma reserva encontrada 📅</h3>
                    <p>Você ainda não reservou nenhum livro.</p>
                    <a href="Catalogo.html" class="btn-voltar" style="margin-top:20px; display:inline-block; text-decoration:none; color: var(--azul-turquesa);">Ir para o Catálogo</a>
                </div>`;
            return;
        }

        reservas.forEach(reserva => {
            const card = document.createElement("div");
            card.className = "card-reserva";

            // Tratamento de fuso horário para a data não voltar 1 dia
            const dataRetirada = new Date(reserva.data_retirada).toLocaleDateString('pt-BR', {timeZone: 'UTC'});
            const dataDevolucao = new Date(reserva.data_devolucao).toLocaleDateString('pt-BR', {timeZone: 'UTC'});
            
            const capa = reserva.caminho_capa || './images/capa-default.jpg';

            card.innerHTML = `
                <img src="${capa}" alt="Capa" class="reserva-img" onerror="this.src='./images/capa-default.jpg'">
                
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

// Função global para cancelar
window.cancelarReserva = async function(id) {
    if(!confirm("Tem certeza que deseja cancelar esta reserva?")) return;

    const token = localStorage.getItem("userToken"); // Token necessário aqui também

    try {
        const response = await fetch(`http://localhost:3000/reservas/${id}`, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${token}` // <--- ADICIONEI O TOKEN AQUI TAMBÉM
            }
        });

        if (response.ok) {
            alert("Reserva cancelada com sucesso!");
            carregarMinhasReservas(); // Recarrega a lista
        } else {
            alert("Erro ao cancelar.");
        }
    } catch (error) {
        alert("Erro de conexão.");
    }
};