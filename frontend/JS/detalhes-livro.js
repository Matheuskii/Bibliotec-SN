class DetalhesLivro {
  constructor() {
    this.livroId = this.obterIdDaURL();
    this.init();
  }

  obterIdDaURL() {
    // Obtém o ID da URL (ex: detalhes-livro.html?id=123)
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("id");
  }

  async init() {
    if (!this.livroId) {
      this.mostrarErro("Livro não encontrado");
      return;
    }

    await this.carregarLivro();
  }

  async carregarLivro() {
    try {
      // Aqui você precisa conectar com seu backend/API
      // Exemplo com fetch:
      const response = await fetch(
        `http://localhost:3000/livros/${this.livroId}`
      );

      if (!response.ok) {
        throw new Error("Livro não encontrado");
      }

      const livro = await response.json();
      this.renderizarLivro(livro);
    } catch (error) {
      console.error("Erro ao carregar livro:", error);
      // Se não tiver API, use dados de exemplo
      this.usarDadosExemplo();
    }
  }

  renderizarLivro(livro) {
    const container = document.getElementById("detalhes-container");

    container.innerHTML = `
            <a href="javascript:history.back()" class="btn-voltar">← Voltar</a>

            <div class="livro-detalhes">
                <div class="livro-header">
                    <div class="capa-container">
                        <img src="${
                          livro.caminho_capa || "./images/capa-default.jpg"
                        }"
                             alt="Capa de ${livro.titulo}">
                    </div>

                    <div class="info-container">
                        <h1>${livro.titulo}</h1>
                        <p class="autor">${livro.autor}</p>

                        <div class="meta-info-grid">
                            <div class="meta-item">
                                <strong>ISBN</strong>
                                <span>${livro.isbn || "Não informado"}</span>
                            </div>
                            <div class="meta-item">
                                <strong>Editora</strong>
                                <span>${livro.editora || "Não informada"}</span>
                            </div>
                            <div class="meta-item">
                                <strong>Ano de Publicação</strong>
                                <span>${
                                  livro.ano_publicacao
                                    ? new Date(
                                        livro.ano_publicacao
                                      ).getFullYear()
                                    : "N/A"
                                }</span>
                            </div>
                            <div class="meta-item">
                                <strong>Gênero</strong>
                                <span>${livro.genero || "Não informado"}</span>
                            </div>
                            <div class="meta-item">
                                <strong>Páginas</strong>
                                <span>${livro.numero_paginas || "N/A"}</span>
                            </div>
                            <div class="meta-item">
                                <strong>Status</strong>
                                <span class="status ${
                                 livro.ativo == 1
                                        ? "Disponível"
                                        : "Indisponível"

                                }">
                                    ${
                                      livro.ativo == 1
                                        ? "Disponível"
                                        : "Indisponível"
                                    }
                                </span>
                            </div>
                        </div>

                        <div class="acoes-livro">
                            ${
                              livro.disponivel
                                ? `<button class="btn-acao btn-emprestar" onclick="emprestarLivro(${livro.id})">
                                    📚 Emprestar Livro
                                </button>`
                                : `<button class="btn-acao btn-reservar" onclick="reservarLivro(${livro.id})">
                                    ⏰ Reservar Livro
                                </button>`
                            }
                            <button class="btn-acao btn-favorito" onclick="adicionarFavoritos(${
                              livro.id
                            })">
                                ❤️ Adicionar aos Favoritos
                            </button>
                        </div>
                    </div>
                </div>

                <div class="livro-body">
                    <div class="sinopse">
                        <h2>Sinopse</h2>
                        <p>${
                          livro.sinopse ||
                          "Sinopse não disponível para este livro."
                        }</p>
                    </div>

                    ${
                      livro.observacoes
                        ? `
                        <div class="observacoes">
                            <h2>Observações</h2>
                            <p>${livro.observacoes}</p>
                        </div>
                    `
                        : ""
                    }
                </div>
            </div>
        `;

    // Atualiza título da página
    document.title = `${livro.titulo} - ${livro.autor} | BiblioTec`;
  }

  usarDadosExemplo() {
    // Dados de exemplo para testes (substitua pelos seus dados reais)
    const livroExemplo = {
      id: this.livroId,
      titulo: "Dom Casmurro",
      autor: "Machado de Assis",
      editora: "Editora Garnier",
      ano_publicacao: "1899",
      genero: "Romance",
      isbn: "9788525404640",
      numero_paginas: "256",
      disponivel: true,
      sinopse:
        "Dom Casmurro é uma das grandes obras de Machado de Assis e um clássico da literatura brasileira. O romance conta a história de Bentinho e Capitu, das suas desconfianças e do ciúme que arruína uma relação.",
      capa_url: "./images/capa-default.jpg",
    };

    this.renderizarLivro(livroExemplo);
  }

  mostrarErro(mensagem) {
    const container = document.getElementById("detalhes-container");
    container.innerHTML = `
            <div class="erro">
                <h2>Ops! Algo deu errado</h2>
                <p>${mensagem}</p>
                <a href="./index.html" class="btn-voltar">Voltar para a página inicial</a>
            </div>
        `;
  }
}


function reservarLivro(id) {
  alert(`Reservando livro ID: ${id}`);
  async function reservarLivro(id) {
    try {
      const input = prompt("Digite a data de devolução (YYYY-MM-DD):");
      if (!input || isNaN(new Date(input).getTime())) {
        alert("Reserva cancelada.");
        return;
      }

      const usuarioId = localStorage.getItem("usuarioId");
      const livroId = id;
      const data_retirada = new Date().toISOString().split("T")[0];
      const data_devolucao = input; // Exemplo: 7 dias depois
      const response = await fetch(`http://localhost:3000/reservas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuario_id: usuarioId,
          livro_id: livroId,
          data_retirada,
          data_devolucao,
        }),
      });
      if (!response.ok) {
        throw new Error("Erro ao reservar o livro");
      }
      alert("Livro reservado com sucesso!");
    } catch (error) {
      console.error("Erro ao reservar livro:", error);
      alert("Não foi possível reservar o livro. Tente novamente mais tarde.");
    }
  }
  reservarLivro(id);
}

function adicionarFavoritos(id) {
  alert(`Adicionando livro ID: ${id} aos favoritos`);

  async function adicionarFavoritos(id) {
    try {
      const usuarioId = localStorage.getItem("usuarioId");
      if (!usuarioId) {
        alert("Você precisa estar logado para adicionar favoritos.");
        return;
      }

      const livroId = id;

      const response = await fetch(`http://localhost:3000/favoritos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario_id: usuarioId, livro_id: livroId }),
      });
      if (!response.ok) {
        throw new Error("Erro ao adicionar aos favoritos");
      }
      alert("Livro adicionado aos favoritos com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar aos favoritos:", error);
      alert(
        "Não foi possível adicionar o livro aos favoritos. Tente novamente mais tarde."
      );
    }
  }
  adicionarFavoritos(id);
}

// Inicializar quando a página carregar
document.addEventListener("DOMContentLoaded", () => {
  new DetalhesLivro();
});
