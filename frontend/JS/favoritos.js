document.addEventListener("DOMContentLoaded", () => {
    carregarFavoritos();
});

async function carregarFavoritos() {
    // 1. Definições dentro da função para garantir que o HTML já existe
    const gridContainer = document.getElementById("gridFavoritos");
    const usuarioId = localStorage.getItem("usuarioId");
    const token = localStorage.getItem("userToken");

    console.log("Carregando favoritos para usuário:", usuarioId);

    // 2. Validação se o elemento HTML existe na tela
    if (!gridContainer) return;

    // 3. Validação de Login
    if (!usuarioId || !token) {
        gridContainer.innerHTML = `
            <div class="empty-state">
                <p>Você precisa estar logado para ver seus favoritos.</p>
                <a href="Login.html" style="color: var(--cor-azul-turquesa); font-weight:bold;">Ir para Login</a>
            </div>`;
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/favoritos/${usuarioId}`, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Envia o token
            }
        });

        // 4. Tratamento de Sessão Expirada
        if (response.status === 401 || response.status === 403) {
            showToast("Sessão expirada. Faça login novamente.");
            window.location.href = "Login.html";
            return;
        }

        const favoritos = await response.json(); 
        gridContainer.innerHTML = ""; 

        // 5. Lista Vazia
        if (!favoritos || favoritos.length === 0) {
            gridContainer.innerHTML = `
                <div class="empty-state">
                    <h3>Sua lista está vazia 😢</h3>
                    <p>Vá ao <a href="Catalogo.html">Catálogo</a> e adicione livros que você ama!</p>
                </div>`;
            return;
        }

        // 6. Gera os Cards
        favoritos.forEach(fav => {
            const card = document.createElement("div");
            card.className = "card-favorito";
            
            // Tratamento de imagem quebrada/vazia
            const capa = fav.caminho_capa || './images/capa-default.jpg';

            card.innerHTML = `
                <img src="${capa}" alt="${fav.livro_titulo}" onclick="window.location.href='detalhes-livro.html?id=${fav.livro_id}'" style="cursor: pointer;">
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

// Função de Remover (Global)
window.removerFavorito = async function(idFavorito) {
    if(!confirm("Deseja remover este livro dos favoritos?")) return;

    const token = localStorage.getItem("userToken");

    try {
        const response = await fetch(`http://localhost:3000/favoritos/${idFavorito}`, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            carregarFavoritos(); // Recarrega a lista
        } else {
            showToast("Erro ao remover.");
        }
    } catch (error) {
        console.error(error);
        showToast("Erro de conexão.");
    }
}; 