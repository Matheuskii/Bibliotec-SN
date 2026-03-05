import API_BASE_URL from "./config.js";

const API_URL = API_BASE_URL;

window.carregarReservas = async function() {
    console.log("Carregando todas as reservas...");
    
    try {
        let token = localStorage.getItem("userToken");

        if (token) {
            token = token.replace(/"/g, ''); 
        }
        
        if (!token) {
            console.error("Nenhum token encontrado");
            window.location.href = "./Login.html";
            return;
        }

        const response = await fetch(`${API_URL}/reservas`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.status === 401 || response.status === 403) {
            console.error("Token inválido ou expirado");
            localStorage.removeItem("userToken");
            window.location.href = "./Login.html";
            return;
        }

        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        const data = await response.json();
        console.log("Dados recebidos:", data);
        
        const lista = data.dados ? data.dados : data;
        
        const tbody = document.getElementById("gridReservas");
        const loading = document.getElementById("loading");
        
        if (!tbody) {
            console.error("Elemento tbody não encontrado!");
            return;
        }

        tbody.innerHTML = '';
        
        if (!Array.isArray(lista) || lista.length === 0) {
            loading.innerHTML = "<p>Nenhuma reserva encontrada.</p>";
            return;
        }

        loading.style.display = 'none';

        lista.forEach(reserva => {
            const tr = document.createElement("tr");
            
            const retirada = reserva.data_retirada 
                ? new Date(reserva.data_retirada).toLocaleDateString('pt-BR')
                : 'N/A';
                
            const devolucao = reserva.data_devolucao 
                ? new Date(reserva.data_devolucao).toLocaleDateString('pt-BR')
                : 'N/A';

            tr.innerHTML = `
                <td>${reserva.id || 'N/A'}</td>
                <td>${reserva.usuario_nome || 'ID: ' + (reserva.usuario_id || 'N/A')}</td>
                <td>${reserva.livro_titulo || 'ID: ' + (reserva.livro_id || 'N/A')}</td>
                <td>${retirada}</td>
                <td>${devolucao}</td>
                <td>${reserva.confirmado_email ? '✅' : '⏳'}</td>
                <td>
                    <button onclick="cancelarReserva(${reserva.id})" class="btn-cancelar">
                        Cancelar
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });

    } catch (error) {
        console.error("Erro ao carregar reservas", error);
        const loading = document.getElementById("loading");
        if (loading) {
            loading.innerHTML = `<p style="color: red;">Erro ao carregar reservas: ${error.message}</p>`;
        }
    }
}

window.cancelarReserva = async function(id) {
    if (!confirm("Tem certeza que deseja cancelar esta reserva?")) return;

    let token = localStorage.getItem("userToken");
    if (token) {
        token = token.replace(/"/g, '');
    }

    try {
        const response = await fetch(`${API_URL}/reservas/${id}`, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            showToast("Reserva cancelada com sucesso!", 'success');
            carregarReservas();
        } else {
            showToast("Erro ao cancelar reserva.", 'error');
        }
    } catch (error) {
        console.error("Erro:", error);
        showToast("Erro de conexão.", 'error');
    }
};

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM carregado, iniciando carregamento de reservas...");
    carregarReservas();
});

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', carregarReservas);
} else {
    carregarReservas();
}
