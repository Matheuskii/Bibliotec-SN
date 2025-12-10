class DetalhesLivro {
    constructor() {
        // Pega o ID da URL (ex: detalhes-livro.html?id=1)
        this.livroId = new URLSearchParams(window.location.search).get('id');
        this.init();
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
            this.mostrarErro('Erro ao carregar informações do livro.');
        }
    }

    renderizarLivro(livro) {
        const container = document.getElementById('detalhes-container');
        
        // Verifica se o livro está ativo (disponível)
        // O banco retorna 1 ou 0. Convertemos para booleano.
        const estaDisponivel = (livro.ativo === 1);
        const statusClass = estaDisponivel ? 'disponivel' : 'indisponivel';
        const statusText = estaDisponivel ? 'Disponível' : 'Indisponível';

        // Capa padrão caso não tenha
        const capa = livro.caminho_capa || './images/capa-default.jpg';

        container.innerHTML = `
            <a href="javascript:history.back()" class="btn-voltar">← Voltar</a>

            <div class="background-detalhes">
                <div class="background-livro">
                    <div class="capa-container">
                        <img src="${capa}"
                             alt="Capa de ${livro.titulo}"
                             onerror="this.src='./images/capa-default.jpg'">
                    </div>

                    <div class="info-container">
                        <h1>${livro.titulo}</h1>
                        <p class="autor">${livro.autor}</p>

                        <div class="meta-info-grid">
                            <div class="meta-item">
                                <strong>ISBN</strong>
                                <span>${livro.isbn || 'N/A'}</span>
                            </div>
                            <div class="meta-item">
                                <strong>Editora</strong>
                                <span>${livro.editora || 'N/A'}</span>
                            </div>
                            <div class="meta-item">
                                <strong>Ano</strong>
                                <span>${livro.ano_publicacao || 'N/A'}</span>
                            </div>
                            <div class="meta-item">
                                <strong>Gênero</strong>
                                <span>${livro.genero || 'N/A'}</span>
                            </div>
                            <div class="meta-item">
                                <strong>Status</strong>
                                <span class="status ${statusClass}">
                                    ${statusText}
                                </span>
                            </div>
                        </div>

                        <div class="acoes-livro">
                            <button class="btn-acao btn-reservar" onclick="reservarLivro(${livro.id})">
                                📅 Reservar Livro
                            </button>

                            <button class="btn-acao btn-favorito" onclick="adicionarFavoritos(${livro.id})">
                                ❤️ Adicionar aos Favoritos
                            </button>
                        </div>
                    </div>
                </div>

                <div class="livro-body">
                    <div class="sinopse">
                        <h2>Sinopse</h2>
                        <p>${livro.sinopse || 'Sem descrição disponível.'}</p>
                    </div>
                </div>
            </div>
        `;

        // Atualiza título da aba do navegador
        document.title = `${livro.titulo} | BiblioTec`;

        // === IMPORTANTE: Carrega as avaliações depois de desenhar o livro ===
        if(window.carregarAvaliacoesdoLivro) {
            window.carregarAvaliacoesdoLivro();
        }
    }

    mostrarErro(mensagem) {
        const container = document.getElementById('detalhes-container');
        container.innerHTML = `<div class="erro"><h2>Ops!</h2><p>${mensagem}</p><a href="Inicio.html" class="btn-voltar">Voltar</a></div>`;
    }
}

// ==========================================
// FUNÇÕES GLOBAIS (AVALIAÇÕES, RESERVAS, FAVORITOS)
// ==========================================

// --- 1. AVALIAÇÕES ---
window.carregarAvaliacoesdoLivro = async function() {
    const params = new URLSearchParams(window.location.search);
    const idLivro = params.get('id');
    
    // Elementos do DOM (Verifica se existem antes de usar)
    const container = document.getElementById('lista-avaliacoes');
    const elNota = document.getElementById('valor-media-grande');
    const elTotal = document.getElementById('total-votos');
    const elEstrelas = document.getElementById('estrelas-media');

    try {
        const response = await fetch(`http://localhost:3000/avaliacoes/livro/${idLivro}`);
        
        if (!response.ok) {
            console.warn("Avaliações indisponíveis.");
            if(container) container.innerHTML = "<p>Comentários indisponíveis no momento.</p>";
            return;
        }

        const dados = await response.json();

        // Atualiza Painel de Média
        if(dados.media !== undefined && elNota) {
            const mediaFormatada = parseFloat(dados.media).toFixed(1);
            elNota.textContent = mediaFormatada;
            if(elTotal) elTotal.textContent = `Baseado em ${dados.total_avaliacoes} avaliações`;
            
            // Pinta estrelas da média
            if(elEstrelas) {
                const percentual = (mediaFormatada / 5) * 100;
                elEstrelas.style.background = `linear-gradient(90deg, #ffd700 ${percentual}%, #ccc ${percentual}%)`;
                elEstrelas.style.webkitBackgroundClip = "text";
                elEstrelas.style.webkitTextFillColor = "transparent";
            }
        }

        // Atualiza Lista de Comentários
        if(container && dados.comentarios) {
            container.innerHTML = "";
            
            if (dados.comentarios.length === 0) {
                container.innerHTML = "<p>Seja o primeiro a avaliar! ⭐</p>";
                return;
            }

            dados.comentarios.forEach(review => {
                const estrelas = '★'.repeat(Math.round(review.nota)) + '☆'.repeat(5 - Math.round(review.nota));
                const data = new Date(review.data_avaliacao).toLocaleDateString('pt-BR');
                
                const div = document.createElement('div');
                div.className = 'review-item';
                div.innerHTML = `
                    <div class="review-header">
                        <span class="review-autor">${review.usuario_nome}</span>
                        <span class="review-nota" style="color: #ffd700">${estrelas}</span>
                    </div>
                    <p class="review-texto">${review.comentario}</p>
                    <span class="review-data">${data}</span>
                `;
                container.appendChild(div);
            });
        }
    } catch (erro) {
        console.error("Erro avaliações:", erro);
    }
}

window.selecionarEstrela = function(nota) {
    document.getElementById('notaInput').value = nota;
    document.querySelectorAll('.star-icon').forEach((s, i) => {
        if (i < nota) s.classList.add('active');
        else s.classList.remove('active');
    });
}

window.toggleFormulario = function() {
    const form = document.getElementById('form-avaliacao-box');
    const token = localStorage.getItem("userToken");
    
    if (!token) {
        alert("Faça login para escrever uma avaliação!");
        window.location.href = "Login.html";
        return;
    }

    form.style.display = (form.style.display === 'none') ? 'block' : 'none';
}

window.enviarAvaliacao = async function() {
    const idLivro = new URLSearchParams(window.location.search).get('id');
    const usuarioId = localStorage.getItem('usuarioId');
    const token = localStorage.getItem('userToken');
    const nota = document.getElementById('notaInput').value;
    const comentario = document.getElementById('comentarioInput').value;

    if (nota == "0") {
        alert("Por favor, selecione as estrelas!");
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/avaliacoes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ usuario_id: usuarioId, livro_id: idLivro, nota, comentario })
        });

        if (response.ok) {
            alert("Avaliação enviada!");
            location.reload();
        } else {
            alert("Erro ao enviar avaliação.");
        }
    } catch (error) {
        console.error(error);
        alert("Erro de conexão.");
    }
}

// --- 2. RESERVAS ---
let livroIdParaReserva = null;

window.reservarLivro = function(id) {
    const usuarioId = localStorage.getItem('usuarioId');
    const token = localStorage.getItem("userToken");

    if (!usuarioId || !token) {
        alert("Você precisa fazer login para reservar.");
        window.location.href = "Login.html";
        return;
    }

    livroIdParaReserva = id;
    
    const inputData = document.getElementById("dataDevolucao");
    const amanha = new Date();
    amanha.setDate(amanha.getDate() + 1);
    const dataMinima = amanha.toISOString().split("T")[0];
    
    inputData.min = dataMinima; 
    inputData.value = dataMinima;
    document.getElementById("modalReserva").style.display = "flex";
}

window.fecharModalReserva = function() {
    document.getElementById("modalReserva").style.display = "none";
}

window.confirmarReserva = async function() {
    const dataDevolucao = document.getElementById("dataDevolucao").value;
    const usuarioId = localStorage.getItem('usuarioId');
    const token = localStorage.getItem("userToken"); 
    const dataRetirada = new Date().toISOString().split('T')[0];

    try {
        const response = await fetch(`http://localhost:3000/reservas`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ usuario_id: usuarioId, livro_id: livroIdParaReserva, data_retirada: dataRetirada, data_devolucao: dataDevolucao })
        });

        if (!response.ok) throw new Error('Erro ao reservar');
        
        alert('🎉 Livro reservado com sucesso!');
        fecharModalReserva();
        location.reload();

    } catch (error) {
        alert(error.message);
    }
}

// --- 3. FAVORITOS ---
window.adicionarFavoritos = async function(id) {
    const usuarioId = localStorage.getItem('usuarioId');
    const token = localStorage.getItem("userToken");

    if (!usuarioId || !token) {
        alert('Faça login para adicionar favoritos.');
        window.location.href = "Login.html";
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/favoritos`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ usuario_id: usuarioId, livro_id: id })
        });

        if (response.status === 409) return alert('Livro já está nos favoritos!');
        if (!response.ok) throw new Error('Erro ao favoritar');
        
        alert('❤️ Adicionado aos favoritos!');
        
    } catch (error) {
        alert(error.message);
    }
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    new DetalhesLivro();
});