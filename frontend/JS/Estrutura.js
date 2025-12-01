export async function criarCarrossel(gridId, leftBtn, rightBtn) {
  const containerGrid = document.getElementById(gridId);

  // Limpar cards estáticos
  containerGrid.innerHTML = "";

  // Carregar livros do banco
  const livros = await carregarLivros();

  if (livros.length === 0) {
    containerGrid.innerHTML = "<p>Nenhum livro disponível</p>";
    return;
  }

  // Criar cards com dados do banco
  livros.forEach((livro) => {
    const card = document.createElement("div");
    card.className = "book-card";

    card.innerHTML = `
      <div class="book-cover">
        <img src="${livro.caminho_capa}" alt="${livro.titulo}">
      </div>
      <div class="book-info">
        <div class="book-title">${livro.titulo}</div>
        <div class="book-author">${livro.autor}</div>
      </div>
    `;

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
  }

  // Botão esquerdo - move carrossel para esquerda
  document.querySelector(leftBtn).addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + cards.length) % cards.length;
    rolarParaCard(currentIndex);
  });

  // Botão direito - move carrossel para direita
  document.querySelector(rightBtn).addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % cards.length;
    rolarParaCard(currentIndex);
  });

  // Atualiza o card central quando o usuário scrolla manualmente
  containerGrid.addEventListener('scroll', () => {
    atualizarCardCentral();
  });

  // Click no card rola até ele
  cards.forEach((card, i) => {
    card.addEventListener("click", () => {
      rolarParaCard(i);
    });
  });

  // Inicializa centralizando o primeiro card
  setTimeout(() => {
    rolarParaCard(0);
    atualizarCardCentral();
  }, 100);
}

async function carregarLivros() {
  try {
    const API = "http://localhost:3000/livros";
    const resposta = await fetch(API);
    const livros = await resposta.json();
    return livros;
  } catch (erro) {
    console.error("Erro ao carregar livros:", erro);
    return [];
  }
}