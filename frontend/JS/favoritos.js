document.addEventListener("DOMContentLoaded", () => {
    carregarFavoritos();
});

const gridContainer = document.getElementById("gridFavoritos");
const usuarioId = localStorage.getItem("usuarioId");

async function carregarFavoritos() {
    // Verifica se tem usuário logado
    if (!usuarioId) {
        gridContainer.innerHTML = `
            <div class="empty-state">
                <p>Você precisa estar logado para ver seus favoritos.</p>
                <a href="Login.html" style="color: var(--cor-azul-turquesa); font-weight:bold;">Ir para Login</a>
            </div>`;
        return;
    }

    // 1. PEGA O TOKEN
    const token = localStorage.getItem("userToken");

    try {
        const response = await fetch(`http://bibliotec-sn.ddns.net:3000/favoritos/${usuarioId}`, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // 2. ENVIA O TOKEN
            }
        });

        // ============================================================
        // A CORREÇÃO DO ERRO ESTÁ AQUI:
        // Criamos a variável 'favoritos' a partir da resposta do servidor
        // ============================================================
        const favoritos = await response.json(); 

        gridContainer.innerHTML = ""; 

        // Se o token for inválido
        if (response.status === 401 || response.status === 403) {
            alert("Sessão expirada. Faça login novamente.");
            window.location.href = "Login.html";
            return;
        }

        // Se não tiver favoritos ou a variável estiver vazia
        if (!favoritos || favoritos.length === 0) {
            gridContainer.innerHTML = `
                <div class="empty-state">
                    <h3>Sua lista está vazia 😢</h3>
                    <p>Vá ao <a href="Catalogo.html">Catálogo</a> e adicione livros que você ama!</p>
                </div>`;
            return;
        }

        favoritos.forEach(fav => {
            const card = document.createElement("div");
            card.className = "card-favorito";
            
            const capa = fav.caminho_capa ? fav.caminho_capa : './images/capa-default.jpg';

            card.innerHTML = `
                <img src="${capa}" alt="${fav.livro_titulo}" onclick="window.location.href='detalhes-livro.html?id=${fav.livro_id}'">
                <div class="card-info">
                    <div class="card-titulo">${fav.livro_titulo}</div>
                    <div class="card-autor">${fav.livro_autor}</div>
                </div>
                <button class="btn-remover" onclick="removerFavorito(${fav.id})">
                    🗑️ Remover
                </button>
            `;
            gridContainer.appendChild(card);
        });

    } catch (error) {
        console.error("Erro:", error);
        gridContainer.innerHTML = "<p>Erro ao conectar com o servidor.</p>";
    }
}

// Função global para remover (Também precisa do Token!)
window.removerFavorito = async function(idFavorito) {
    if(!confirm("Deseja remover este livro dos favoritos?")) return;

    const token = localStorage.getItem("userToken"); // Pega o token novamente

    try {
        const response = await fetch(`http://bibliotec-sn.ddns.net:3000/favoritos/${idFavorito}`, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${token}` // Envia o token no delete
            }
        });

        if (response.ok) {
            carregarFavoritos(); // Recarrega a tela
        } else {
            alert("Erro ao remover.");
        }
    } catch (error) {
        alert("Erro de conexão.");
    }
};