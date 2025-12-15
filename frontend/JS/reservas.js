const API_URL = "http://localhost:3000";

// Função para carregar reservas
window.carregarReservas = async function() {
    console.log("Carregando todas as reservas...");
    
    try {
        let token = localStorage.getItem("userToken");

        // Limpar token
        if (token) {
            token = token.replace(/"/g, ''); 
        }
        
        if (!token) {
            console.error("Nenhum token encontrado");
            window.location.href = "./Login.html";
            return;
        }

        console.log("Token Limpo:", token);

        const response = await fetch(`${API_URL}/reservas`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        // Tratar erros de autenticação
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
        
        // Obter a lista de reservas
        const lista = data.dados ? data.dados : data;
        
        // Acessar o tbody após o DOM estar carregado
        const tbody = document.getElementById("gridReservas");
        const loading = document.getElementById("loading");
        
        console.log("tbody encontrado:", tbody);
        
        if (!tbody) {
            console.error("Elemento tbody não encontrado!");
            return;
        }

        // Limpar conteúdo anterior
        tbody.innerHTML = '';
        
        if (!Array.isArray(lista) || lista.length === 0) {
            loading.innerHTML = "<p>Nenhuma reserva encontrada.</p>";
            return;
        }

        // Ocultar mensagem de carregamento
        loading.style.display = 'none';

        // Adicionar cada reserva na tabela
        lista.forEach(reserva => {
            const tr = document.createElement("tr");
            
            // Formatar datas
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

// Função global para cancelar reserva
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
            carregarReservas(); // Recarrega a lista
        } else {
            showToast("Erro ao cancelar reserva.", 'error');
        }
    } catch (error) {
        console.error("Erro:", error);
        showToast("Erro de conexão.", 'error');
    }
};

// Aguardar o DOM carregar completamente
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM carregado, iniciando carregamento de reservas...");
    carregarReservas();
});

// Fallback caso o script seja carregado após o DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', carregarReservas);
} else {
    carregarReservas();
}