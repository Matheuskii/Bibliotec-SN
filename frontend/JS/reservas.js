document.addEventListener("DOMContentLoaded", () => {
    carregarMinhasReservas();
});

const container = document.getElementById("gridReservas");
const usuarioId = localStorage.getItem("usuarioId");

async function carregarReservas() {
    console.log("Carregando todas as reservas...");
    console.log("Token atual:", localStorage.getItem("userToken"));
    try {
       let token = localStorage.getItem("userToken");

    // --- CORREÇÃO DE SEGURANÇA ---
    if (token) {
        // Remove aspas duplas se elas existirem por acidente
        token = token.replace(/"/g, ''); 
    }
    // -----------------------------

    console.log("Token Limpo:", token);

        const response = await fetch(`${API_URL}/reservas`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // lembre-se de enviar o token
            }
        });

        if (response.status === 401 || response.status === 403) {
            console.error("Token inválido ou expirado");
            return;
        }

        const reservas = await response.json();
        
      
        const lista = reservas.dados ? reservas.dados : reservas;

        const tbody = document.getElementById("tabelaReservasBody");
        tbody.innerHTML = "";

        if(!Array.isArray(lista)) return;

        lista.forEach(reserva => {
            const tr = document.createElement("tr");

            // Formatando datas
            const retirada = new Date(reserva.data_retirada).toLocaleDateString('pt-BR');
            const devolucao = new Date(reserva.data_devolucao).toLocaleDateString('pt-BR');

            tr.innerHTML = `
                <td>${reserva.id}</td>
                <td>${reserva.usuario_nome || 'ID: ' + reserva.usuario_id}</td>
                <td>${reserva.livro_titulo || 'ID: ' + reserva.livro_id}</td>
                <td>${retirada}</td>
                <td>${devolucao}</td>
                <td>${reserva.confirmado_email ? '✅' : '⏳'}</td>
            `;
            tbody.appendChild(tr);
        });

    } catch (error) {
        console.error("Erro ao carregar reservas", error);
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