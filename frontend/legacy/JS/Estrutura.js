// JS/Estrutura.js
import API_BASE_URL from "./config.js";

console.log("Arquivo Estrutura.js carregado");

document.addEventListener("DOMContentLoaded", () => {
    inicializarMenuMobile();
    verificarEstadoLogin();
});



export function inicializarMenuMobile() {
    const btnMenu = document.querySelector('.hamburger');
    const nav = document.querySelector('nav');

    if (btnMenu && nav) {
        nav.classList.remove('open');
        btnMenu.textContent = '☰';

        // Lógica de clique
        btnMenu.addEventListener('click', (e) => {
            e.stopPropagation();
            const estaAberto = nav.classList.contains('open');
            
            if (estaAberto) {
                nav.classList.remove('open');
                btnMenu.textContent = '☰';
            } else {
                nav.classList.add('open');
                btnMenu.textContent = '✕';
            }
        });

        // Fecha ao clicar em um link
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('open');
                btnMenu.textContent = '☰';
            });
        });
    }
}

export async function criarCarrossel(gridId, leftBtn, rightBtn, funcaoFiltro = null) {
    const containerGrid = document.getElementById(gridId);
    if (!containerGrid) return;

    containerGrid.innerHTML = ""; 

    const livros = await carregarLivros();
    let livrosFiltrados = funcaoFiltro ? livros.filter(funcaoFiltro) : livros;

    if (livrosFiltrados.length === 0) {
        containerGrid.innerHTML = "<p class='no-books'>Sem itens nesta categoria</p>";
        return;
    }

    // Otimização: DocumentFragment evita múltiplos reflows ao inserir cards
    const fragment = document.createDocumentFragment();
    livrosFiltrados.forEach((livro) => {
        const card = criarCardLivroClicavel(livro);
        fragment.appendChild(card);
    });
    containerGrid.appendChild(fragment);

    const cards = Array.from(containerGrid.querySelectorAll('.book-card'));

    // --- INTERSECTION OBSERVER (Performance) ---
    // Substitui o atualizarCardCentral manual
    const observerOptions = {
        root: containerGrid,
        threshold: 0.6 // Só marca como "center" se 60% do card estiver visível
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove center de todos e coloca no atual
                cards.forEach(c => c.classList.remove("center"));
                entry.target.classList.add('center');
            }
        });
    }, observerOptions);

    cards.forEach(card => observer.observe(card));

    // --- NAVEGAÇÃO SIMPLIFICADA ---
    const leftButton = document.querySelector(leftBtn);
    const rightButton = document.querySelector(rightBtn);

    // scrollBy é muito mais leve que calcular offsetLeft manualmente
    if (leftButton) {
        leftButton.onclick = () => {
            containerGrid.scrollBy({ left: -300, behavior: 'smooth' });
        };
    }

    if (rightButton) {
        rightButton.onclick = () => {
            containerGrid.scrollBy({ left: 300, behavior: 'smooth' });
        };
    }
}

async function carregarLivros() {
    try {
        const resposta = await fetch(`${API_BASE_URL}/livros`);

        if (!resposta.ok) {
            throw new Error(`Erro HTTP: ${resposta.status}`);
        }

        const livros = await resposta.json();
        return Array.isArray(livros) ? livros : [];
    } catch (erro) {
        console.error("Erro ao carregar livros:", erro);
        return [];
    }
}



export function criarCardLivroClicavel(livro) {
    const card = document.createElement('div');
    card.className = 'book-card';
    card.dataset.id = livro.id;
    card.title = `Clique para ver detalhes de "${livro.titulo}"`;
    
    
    card.innerHTML = `
        <div class="book-cover">
            <img src="${livro.caminho_capa || livro.capa_url || './images/capa-default.jpg'}"
                alt="${livro.titulo}"
                width="200"
                height="280"
                loading="lazy"
                style="aspect-ratio: 2/3; object-fit: cover;"
                onerror="this.src='./images/capa-default.jpg'">
        </div>
        <div class="book-info">
            <h3 class="book-title">${livro.titulo}</h3>
            <p class="book-author">${livro.autor || 'Autor desconhecido'}</p>
            ${livro.preco ? `<span class="book-price">R$ ${livro.preco}</span>` : ''}
            ${livro.ano_publicacao ? `<span class="book-year">${livro.ano_publicacao}</span>` : ''}
        </div>
    `;

    card.addEventListener('click', function(e) {
        if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') return;

        const livroId = this.dataset.id || livro.id;
        if (livroId) {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
                window.location.href = `detalhes-livro.html?id=${livroId}`;
            }, 150);
        }
    });

    card.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const livroId = this.dataset.id || livro.id;
            if (livroId) window.location.href = `detalhes-livro.html?id=${livroId}`;
        }
    });

    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `Livro: ${livro.titulo} por ${livro.autor}. Clique para ver detalhes.`);

    return card;
}

export function criarCardsLivros(livros, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';
    livros.forEach(livro => {
        const card = criarCardLivroClicavel(livro);
        container.appendChild(card);
    });
}

export async function buscarLivroPorId(id) {
    try {
        const resposta = await fetch(`${API_BASE_URL}/livros/${id}`);

        if (!resposta.ok) throw new Error(`Livro não encontrado: ${resposta.status}`);

        return await resposta.json();
    } catch (erro) {
        console.error("Erro ao buscar livro:", erro);
        return null;
    }
}

export function inicializarCarrosseis() {
    const carrosseis = [
        { gridId: 'vendidos', leftBtn: '#left-vendidos', rightBtn: '#right-vendidos' },
        { gridId: 'ofertas', leftBtn: '#left-ofertas', rightBtn: '#right-ofertas' },
    ];

    carrosseis.forEach(async (carrossel) => {
        const grid = document.getElementById(carrossel.gridId);
        if (grid) {
            await criarCarrossel(carrossel.gridId, carrossel.leftBtn, carrossel.rightBtn);
        }
    });
}

export async function pesquisarLivros(termo) {
    try {
        const livros = await carregarLivros();

        if (!termo || termo.trim() === '') return livros;

        const termoLower = termo.toLowerCase();
        return livros.filter(livro =>
            livro.titulo.toLowerCase().includes(termoLower) ||
            livro.autor.toLowerCase().includes(termoLower) ||
            livro.genero?.toLowerCase().includes(termoLower) ||
            livro.editora?.toLowerCase().includes(termoLower)
        );
    } catch (erro) {
        console.error("Erro na pesquisa:", erro);
        return [];
    }
}

if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const searchBar = document.querySelector('.search-bar');
        if (searchBar) {
            searchBar.addEventListener('input', async (e) => {
                const termo = e.target.value;
                const resultados = await pesquisarLivros(termo);
                console.log('Resultados da pesquisa:', resultados);
            });
        }

        if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
            inicializarCarrosseis();
        }
    });
}

export function verificarEstadoLogin() {
    const btnAuth = document.getElementById("btnAuth");
    const btnAdmin = document.getElementById("btnAdminPanel");
    
    if (!btnAuth) return;

    const usuarioId = localStorage.getItem("usuarioId");
    const perfil = localStorage.getItem("perfilUsuario");

    if (usuarioId) {
        btnAuth.textContent = "Sair"; 
        btnAuth.href = "#"; 
        
        if (perfil === 'Admin' && btnAdmin) {
            btnAdmin.style.display = "inline-block";
        }

        btnAuth.addEventListener("click", (e) => {
            e.preventDefault();
            if (confirm("Tem certeza que deseja sair?")) {
                localStorage.clear();
                showToast("Você saiu do sistema.", 'success');
                window.location.href = "Login.html";
            }
        });
    } else {
        btnAuth.textContent = "Login";
        btnAuth.href = "Login.html";
        if (btnAdmin) btnAdmin.style.display = "none";
    }
}


function debounce(fn, delay) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
}
const searchBarInput = document.querySelector('.search-bar');
if (searchBarInput) {
    searchBarInput.addEventListener('input', debounce(async (e) => {
        const resultados = await pesquisarLivros(e.target.value);
        console.log('Resultados filtrados:', resultados);
        // Aqui você pode chamar uma função para atualizar a tela com os resultados
    }, 300));
}