class DetalhesLivro {
    constructor() {
        this.livroId = this.obterIdDaURL();
        this.init();
    }

    obterIdDaURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    }

    async init() {
        if (!this.livroId) {
            this.mostrarErro('Livro não encontrado');
            return;
        }

        await this.carregarLivro();
    }

    async carregarLivro() {
        try {
            const response = await fetch(`http://localhost:3000/livros/${this.livroId}`);

            if (!response.ok) {
                throw new Error('Livro não encontrado');
            }

            const livro = await response.json();
            this.renderizarLivro(livro);

        } catch (error) {
            console.error('Erro ao carregar livro:', error);
            this.usarDadosExemplo();
        }
    }

    renderizarLivro(livro) {
        const container = document.getElementById('detalhes-container');


        const statusNumber = Number(livro.ativo);
        const estaDisponivel = (statusNumber === 1);

        const statusClass = estaDisponivel ? 'disponivel' : 'indisponivel';
        const statusText = estaDisponivel ? 'Disponível' : 'Indisponível';

        container.innerHTML = `
            <a href="javascript:history.back()" class="btn-voltar">← Voltar</a>

            <div class="background-detalhes">
                <div class="background-livro">
                    <div class="capa-container">
                        <img src="${livro.caminho_capa || './images/capa-default.jpg'}"
                             alt="Capa de ${livro.titulo}"
                             onerror="this.src='./images/capa-default.jpg'">
                    </div>

                    <div class="info-container">
                        <h1>${livro.titulo}</h1>
                        <p class="autor">${livro.autor}</p>

                        <div class="meta-info-grid">
                            <div class="meta-item">
                                <strong>ISBN</strong>
                                <span>${livro.isbn || 'Não informado'}</span>
                            </div>
                            <div class="meta-item">
                                <strong>Editora</strong>
                                <span>${livro.editora || 'Não informada'}</span>
                            </div>
                            <div class="meta-item">
                                <strong>Ano de Publicação</strong>
                                <span>${livro.ano_publicacao || 'N/A'}</span>
                            </div>
                            <div class="meta-item">
                                <strong>Gênero</strong>
                                <span>${livro.genero || 'Não informado'}</span>
                            </div>
                            <div class="meta-item">
                                <strong>Formato</strong>
                                <span>${livro.formato || 'N/A'}</span>
                            </div>
                            <div class="meta-item">
                                <strong>Status</strong>
                                <span class="status ${statusClass}">
                                    ${statusText}
                                </span>
                            </div>
                        </div>

                        <div class="acoes-livro">

                                <button class="btn-acao btn-reservar">

                                <button class="btn-acao btn-emprestar" onclick="reservarLivro(${livro.id})">
                                    📚 Emprestar Livro
                                </button>


                            <button class="btn-acao btn-favorito" onclick="adicionarFavoritos(${livro.id})">
                                (👉ﾟヮﾟ)👉 Adicionar aos Favoritos
                            </button>
                        </div>
                    </div>
                </div>

                <div class="livro-body">
                    <div class="sinopse">
                        <h2>Sinopse</h2>
                        <p>${livro.sinopse || 'Sinopse não disponível para este livro.'}</p>
                    </div>

                    ${livro.observacoes ? `
                        <div class="observacoes">
                            <h2>Observações</h2>
                            <p>${livro.observacoes}</p>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;

        // Atualiza título da aba do navegador
        document.title = `${livro.titulo} - ${livro.autor} | BiblioTec`;
    }

    usarDadosExemplo() {
        const livroExemplo = {
            id: this.livroId,
            titulo: "Dom Casmurro",
            autor: "Machado de Assis",
            editora: "Editora Garnier",
            ano_publicacao: "1899",
            genero: "Romance",
            isbn: "9788525404640",
            numero_paginas: "256",
            ativo: 1,
            sinopse: "Dom Casmurro é uma das grandes obras...",
            caminho_capa: "./images/capa-default.jpg"
        };
        this.renderizarLivro(livroExemplo);
    }

    mostrarErro(mensagem) {
        const container = document.getElementById('detalhes-container');
        container.innerHTML = `
            <div class="erro">
                <h2>Ops! Algo deu errado</h2>
                <p>${mensagem}</p>
                <a href="./Inicio.html" class="btn-voltar">Voltar para a página inicial</a>
            </div>
        `;
    }
}

// ==========================================
// FUNÇÕES GLOBAIS
// ==========================================

window.emprestarLivro = function(id) {
    alert(`Funcionalidade de empréstimo (Livro ID: ${id}) em desenvolvimento!`);
}

window.reservarLivro = function(id) {
    async function processarReserva(id) {
        try {
            const input = prompt('Digite a data de devolução (YYYY-MM-DD):');
            if (!input || isNaN(new Date(input).getTime())) {
                alert('Data inválida. Reserva cancelada.');
                return;
            }

            const usuarioId = localStorage.getItem('usuarioId');
            if (!usuarioId) {
                alert("Você precisa fazer login para reservar.");
                window.location.href = "Login.html";
                return;
            }

            const livroId = id;
            const data_retirada = new Date().toISOString().split('T')[0];
            const data_devolucao = input;

            const response = await fetch(`http://localhost:3000/reservas`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usuario_id: usuarioId, livro_id: livroId, data_retirada, data_devolucao })
            });

            const dados = await response.json();

            if (!response.ok) {
                throw new Error(dados.mensagem || 'Erro ao reservar o livro');
            }
            alert('Livro reservado com sucesso!');
        } catch (error) {
            console.error('Erro:', error);
            alert(error.message);
        }
    }
    processarReserva(id);
}

window.adicionarFavoritos = function(id) {
    async function processarFavorito(id) {
        try {
            const usuarioId = localStorage.getItem('usuarioId');
            if (!usuarioId) {
                alert('Você precisa estar logado para adicionar favoritos.');
                window.location.href = "Login.html";
                return;
            }

            const response = await fetch(`http://localhost:3000/favoritos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usuario_id: usuarioId, livro_id: id })
            });

            const dados = await response.json();

            if (!response.ok) {
                if(response.status === 409) {
                    alert('Este livro já está nos seus favoritos!');
                    return;
                }
                throw new Error(dados.mensagem || 'Erro ao adicionar aos favoritos');
            }
            alert('Livro adicionado aos favoritos com sucesso!');
        } catch (error) {
            console.error('Erro:', error);
            alert(error.message);
        }
    }
    processarFavorito(id);
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    new DetalhesLivro();
});