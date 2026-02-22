// JS/Estrutura.js
console.log("Arquivo Estrutura.js carregado");
console.log(localStorage.getItem("usuarioId"));
console.log(localStorage.getItem("userToken"));


export async function criarCarrossel(gridId, leftBtn, rightBtn, funcaoFiltro = null) {
    const containerGrid = document.getElementById(gridId);

    containerGrid.innerHTML = ""; // Limpa loading

    const livros = await carregarLivros();

    if (livros.length === 0) {
        containerGrid.innerHTML = "<p class='no-books'>Nenhum livro disponível</p>";
        return;
    }

    // 2. AQUI A MÁGICA: Se passar um filtro, usa ele. Se não, mostra todos.
    let livrosFiltrados = livros;
    if (funcaoFiltro) {
        livrosFiltrados = livros.filter(funcaoFiltro);
    }

    // Se o filtro for muito rigoroso e não sobrar nada
    if (livrosFiltrados.length === 0) {
        containerGrid.innerHTML = "<p class='no-books'>Sem itens nesta categoria</p>";
        return;
    }

    // Cria os cards com a lista filtrada
    livrosFiltrados.forEach((livro) => {
        const card = criarCardLivroClicavel(livro);
        containerGrid.appendChild(card);
    });

    const cards = Array.from(document.querySelectorAll(`#${gridId} .book-card`));
    let currentIndex = 0;

    // Função que detecta qual card está no centro e adiciona a classe
    function atualizarCardCentral() {
        const containerRect = containerGrid.getBoundingClientRect();
        const containerCenter = containerRect.left + containerRect.width / 2;

        let cardMaisProximo = null;
        let menorDistancia = Infinity;

        cards.forEach((card) => {
            const cardRect = card.getBoundingClientRect();
            const cardCenter = cardRect.left + cardRect.width / 2;
            const distancia = Math.abs(containerCenter - cardCenter);

            if (distancia < menorDistancia) {
                menorDistancia = distancia;
                cardMaisProximo = card;
            }
        });

        // Remove 'center' de todos e adiciona só no mais próximo
        cards.forEach((c) => c.classList.remove("center"));
        if (cardMaisProximo) {
            cardMaisProximo.classList.add("center");
        }
    }

    // Função que rola até um card específico
    function rolarParaCard(index) {
        if (!cards[index]) return;
        
        const card = cards[index];
        const cardLeft = card.offsetLeft;
        const cardWidth = card.offsetWidth;
        const containerWidth = containerGrid.offsetWidth;

        // Calcula posição para centralizar (ajuste fino: +10px para compensar)
        const scrollPosition = cardLeft + (cardWidth / 2) - (containerWidth / 2) - 69;

        containerGrid.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });

        currentIndex = index;
        
        // Atualiza o card central após a animação
        setTimeout(atualizarCardCentral, 300);
    }

    // Botão esquerdo - move carrossel para esquerda
    const leftButton = document.querySelector(leftBtn);
    if (leftButton) {
        leftButton.addEventListener("click", () => {
            currentIndex = (currentIndex - 1 + cards.length) % cards.length;
            rolarParaCard(currentIndex);
        });
    }

    // Botão direito - move carrossel para direita
    const rightButton = document.querySelector(rightBtn);
    if (rightButton) {
        rightButton.addEventListener("click", () => {
            currentIndex = (currentIndex + 1) % cards.length;
            rolarParaCard(currentIndex);
        });
    }

    // Atualiza o card central quando o usuário scrolla manualmente
    containerGrid.addEventListener('scroll', () => {
        requestAnimationFrame(atualizarCardCentral);
    });

    // Click no card - ABRE PÁGINA DE DETALHES
    cards.forEach((card, i) => {
        // Remove o listener antigo que apenas rolava
        // card.removeEventListener("click", () => {});
        
        // Adiciona novo listener para abrir detalhes
        card.addEventListener("click", (e) => {
            // Evita que o clique no card seja tratado como scroll
            e.stopPropagation();
            
            // Obtém o ID do livro do dataset
            const livroId = card.dataset.id;
            if (livroId) {
                // Redireciona para a página de detalhes
                window.location.href = `detalhes-livro.html?id=${livroId}`;
            }
        });
    });

    // Configurar Intersection Observer para detectar card central
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('center');
            } else {
                entry.target.classList.remove('center');
            }
        });
    }, {
        root: containerGrid,
        threshold: 0.5
    });

    // Observar todos os cards
    cards.forEach(card => {
        observer.observe(card);
    });

    // Inicializa centralizando o primeiro card
    setTimeout(() => {
        if (cards.length > 0) {
            rolarParaCard(0);
            atualizarCardCentral();
        }
    }, 100);
}

async function carregarLivros() {
    try {
        const API = "http://bibliotec-sn.ddns.net:3000/livros";
        const resposta = await fetch(API);
        
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

// Função para criar card de livro com link (opção 1)
export function criarCardLivro(livro) {
    const card = document.createElement('div');
    card.className = 'book-card';
    card.dataset.id = livro.id;
    
    // Crie um link que envolve todo o conteúdo do card
    const link = document.createElement('a');
    link.href = `detalhes-livro.html?id=${livro.id}`;
    link.className = 'card-link';
    
    link.innerHTML = `
        ${livro.disponivel ? '<span class="book-status">Disponível</span>' : '<span class="book-status indisponivel">Indisponível</span>'}
        <div class="book-cover">
            <img src="${livro.caminho_capa || livro.capa_url || './images/capa-default.jpg'}" 
                 alt="${livro.titulo}"
                 onerror="this.src='./images/capa-default.jpg'">
        </div>
        <div class="book-info">
            <h3 class="book-title">${livro.titulo}</h3>
            <p class="book-author">${livro.autor || 'Autor desconhecido'}</p>
            ${livro.preco ? `<span class="book-price">R$ ${livro.preco}</span>` : ''}
        </div>
    `;
    
    card.appendChild(link);
    return card;
}

// Função para criar card clicável (opção 2 - RECOMENDADA)
export function criarCardLivroClicavel(livro) {
    const card = document.createElement('div');
    card.className = 'book-card';
    card.dataset.id = livro.id;
    card.title = `Clique para ver detalhes de "${livro.titulo}"`;
    
    // ============================================================
    // CORREÇÃO AQUI: Mudamos de 'livro.disponivel' para 'livro.ativo'
    // O banco retorna 1 (true) ou 0 (false) na coluna 'ativo'
    // ============================================================
    const estaDisponivel = livro.ativo === 1;

    const statusClass = estaDisponivel ? 'disponivel' : 'indisponivel';
    const statusText = estaDisponivel ? 'Disponível' : 'Indisponível';
    
    card.innerHTML = `
        <span class="book-status ${statusClass}">${statusText}</span>
        <div class="book-cover">
            <img src="${livro.caminho_capa || livro.capa_url || './images/capa-default.jpg'}" 
                 alt="${livro.titulo}"
                 onerror="this.src='./images/capa-default.jpg'">
        </div>
        <div class="book-info">
            <h3 class="book-title">${livro.titulo}</h3>
            <p class="book-author">${livro.autor || 'Autor desconhecido'}</p>
            ${livro.preco ? `<span class="book-price">R$ ${livro.preco}</span>` : ''}
            ${livro.ano_publicacao ? `<span class="book-year">${livro.ano_publicacao}</span>` : ''}
        </div>
    `;
    
    // Adiciona evento de clique para abrir página de detalhes
    card.addEventListener('click', function(e) {
        // Verifica se o clique foi em um link ou botão dentro do card
        if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') {
            return; // Permite comportamento padrão
        }
        
        const livroId = this.dataset.id || livro.id;
        if (livroId) {
            // Adiciona efeito visual de clique
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
                // Redireciona para página de detalhes
                window.location.href = `detalhes-livro.html?id=${livroId}`;
            }, 150);
        }
    });
    
    // Adiciona evento de teclado para acessibilidade
    card.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const livroId = this.dataset.id || livro.id;
            if (livroId) {
                window.location.href = `detalhes-livro.html?id=${livroId}`;
            }
        }
    });
    
    // Torna o card focável para acessibilidade
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `Livro: ${livro.titulo} por ${livro.autor}. Clique para ver detalhes.`);
    
    return card;
}

// Função auxiliar para criar múltiplos cards
export function criarCardsLivros(livros, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    
    livros.forEach(livro => {
        const card = criarCardLivroClicavel(livro);
        container.appendChild(card);
    });
}

// Função para buscar livro por ID (útil para página de detalhes)
export async function buscarLivroPorId(id) {
    try {
        const API = `http://bibliotec-sn.ddns.net:3000/livros/${id}`;
        const resposta = await fetch(API);
        
        if (!resposta.ok) {
            throw new Error(`Livro não encontrado: ${resposta.status}`);
        }
        
        return await resposta.json();
    } catch (erro) {
        console.error("Erro ao buscar livro:", erro);
        return null;
    }
}

// Função para inicializar todos os carrosséis da página
export function inicializarCarrosseis() {
    // Inicializa todos os carrosséis definidos na página
    const carrosseis = [
        { gridId: 'vendidos', leftBtn: '#left-vendidos', rightBtn: '#right-vendidos' },
        { gridId: 'ofertas', leftBtn: '#left-ofertas', rightBtn: '#right-ofertas' },
        // Adicione mais carrosséis conforme necessário
    ];
    
    carrosseis.forEach(async (carrossel) => {
        const grid = document.getElementById(carrossel.gridId);
        if (grid) {
            await criarCarrossel(carrossel.gridId, carrossel.leftBtn, carrossel.rightBtn);
        }
    });
}

// Função para filtrar livros por pesquisa
export async function pesquisarLivros(termo) {
    try {
        const livros = await carregarLivros();
        
        if (!termo || termo.trim() === '') {
            return livros;
        }
        
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

// Inicialização automática quando o DOM estiver carregado
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        // Inicializa a pesquisa se houver barra de pesquisa
        const searchBar = document.querySelector('.search-bar');
        if (searchBar) {
            searchBar.addEventListener('input', async (e) => {
                const termo = e.target.value;
                const resultados = await pesquisarLivros(termo);
                
                // Aqui você pode atualizar a exibição dos resultados
                console.log('Resultados da pesquisa:', resultados);
            });
        }
        
        // Inicializa os carrosséis se estiver na página inicial
        if (window.location.pathname.includes('index.html') || 
            window.location.pathname === '/') {
            inicializarCarrosseis();
        }
    });
}

export function verificarEstadoLogin() {
    const btnAuth = document.getElementById("btnAuth");
    const btnAdmin = document.getElementById("btnAdminPanel"); // Novo botão
    
    if (!btnAuth) return;

    const usuarioId = localStorage.getItem("usuarioId");
    const perfil = localStorage.getItem("perfilUsuario"); // Pega se é Aluno ou Admin

    if (usuarioId) {
        // --- USUÁRIO LOGADO ---
        btnAuth.textContent = "Sair"; 
        btnAuth.href = "#"; 
        
        // Se for Admin, mostra o botão do Painel
        if (perfil === 'Admin' && btnAdmin) {
            btnAdmin.style.display = "inline-block";
        }

        // Lógica de Logout
        btnAuth.addEventListener("click", (e) => {
            e.preventDefault();
            if (confirm("Tem certeza que deseja sair?")) {
                localStorage.clear(); // Limpa ID, Nome e Perfil
                alert("Você saiu do sistema.");
                window.location.href = "Login.html";
            }
        });
    } else {
        // --- USUÁRIO NÃO LOGADO ---
        btnAuth.textContent = "Login";
        btnAuth.href = "Login.html";
        if (btnAdmin) btnAdmin.style.display = "none";
    }
}