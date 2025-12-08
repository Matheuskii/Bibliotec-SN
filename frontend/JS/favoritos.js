async function carregarFavoritos() {
    try {
        const usuarioId = localStorage.getItem('usuarioId');
        if (!usuarioId || usuarioId === null) {
            alert('Você precisa estar logado para ver seus favoritos.');
            return;
        }
        const resposta = await fetch (`http://localhost:3000/favoritos/${usuarioId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!resposta.ok) {
            throw new Error('Erro ao carregar favoritos');
        }
        const favoritos = await resposta.json();
        console.log(favoritos);
         }
        catch (erro) {
        console.error('Erro ao carregar favoritos:', erro);
        alert('Não foi possível carregar os favoritos. Tente novamente mais tarde.');
        }
}
carregarFavoritos();
document.addEventListener("DOMContentLoaded", () => {
    carregarFavoritos();
});

const gridContainer = document.getElementById("gridFavoritos");

// Recupera o ID salvo no Login (veja telas_forms.js)
const usuarioId = localStorage.getItem("usuarioId");

async function carregarFavoritos() {
    if (!usuarioId) {
        gridContainer.innerHTML = `
            <div class="empty-state">
                <p>Você precisa estar logado para ver seus favoritos.</p>
                <a href="Login.html" style="color: var(--cor-azul-turquesa); font-weight:bold;">Ir para Login</a>
            </div>`;
        return;
    }

    try {
        // Chama a rota corrigida: GET /favoritos/:id
        const response = await fetch(`http://localhost:3000/favoritos/${usuarioId}`);
        const favoritos = await response.json();

        gridContainer.innerHTML = ""; 

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

// Função global para ser chamada pelo onclick do HTML
window.removerFavorito = async function(idFavorito) {
    if(!confirm("Deseja remover este livro dos favoritos?")) return;

    try {
        const response = await fetch(`http://localhost:3000/favoritos/${idFavorito}`, {
            method: "DELETE"
        });

        if (response.ok) {
            // Remove o elemento visualmente ou recarrega a lista
            carregarFavoritos(); 
        } else {
            alert("Erro ao remover.");
        }
    } catch (error) {
        alert("Erro de conexão.");
    }
};
