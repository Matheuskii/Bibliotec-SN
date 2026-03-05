import API_BASE_URL from "./config.js";

class DetalhesLivro {
    constructor() {
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
            const response = await fetch(`${API_BASE_URL}/livros/${this.livroId}`);

            if (!response.ok) throw new Error('Livro não encontrado');

            const livro = await response.json();
            this.renderizarLivro(livro);

        } catch (error) {
            console.error('Erro ao carregar livro:', error);
            this.mostrarErro('Erro ao carregar informações do livro.');
        }
    }

    renderizarLivro(livro) {
    const container = document.getElementById('detalhes-container');
    const estaDisponivel = (livro.ativo === 1);
    const capa = livro.caminho_capa || './images/capa-default.jpg';

    // Usando classes para controle de estado em vez de estilos inline ajuda o navegador
    container.innerHTML = `
        <a href="javascript:history.back()" class="btn-voltar">← Voltar</a>
        <div class="background-detalhes">
            <div class="background-livro">
                <div class="capa-container">
                    <img src="${capa}" 
                         alt="Capa de ${livro.titulo}" 
                         loading="eager" 
                         style="content-visibility: auto;"
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
                                <span class="status ${estaDisponivel ? 'disponivel' : 'indisponivel'}">
                                    ${estaDisponivel ? 'Disponível' : 'Indisponível'}
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

        document.title = `${livro.titulo} | BiblioTec`;

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
// AVALIAÇÕES
// ==========================================
window.carregarAvaliacoesdoLivro = async function() {
    const params = new URLSearchParams(window.location.search);
    const idLivro = params.get('id');

    const container = document.getElementById('lista-avaliacoes');
    const elNota = document.getElementById('valor-media-grande');
    const elTotal = document.getElementById('total-votos');
    const elEstrelas = document.getElementById('estrelas-media');

    try {
        const response = await fetch(`${API_BASE_URL}/avaliacoes/livro/${idLivro}`);

        if (!response.ok) {
            console.warn("Avaliações indisponíveis.");
            if(container) container.innerHTML = "<p>Comentários indisponíveis no momento.</p>";
            return;
        }

        const dados = await response.json();

        if(dados.media !== undefined && elNota) {
            const mediaFormatada = parseFloat(dados.media).toFixed(1);
            elNota.textContent = mediaFormatada;
            if(elTotal) elTotal.textContent = `Baseado em ${dados.total_avaliacoes} avaliações`;

            if(elEstrelas) {
                const percentual = (mediaFormatada / 5) * 100;
                elEstrelas.style.background = `linear-gradient(90deg, #ffd700 ${percentual}%, #ccc ${percentual}%)`;
                elEstrelas.style.webkitBackgroundClip = "text";
                elEstrelas.style.webkitTextFillColor = "transparent";
            }
        }

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
        showToast("Faça login para escrever uma avaliação!", 'warning');
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
        showToast("Por favor, selecione as estrelas!", 'warning');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/avaliacoes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ usuario_id: usuarioId, livro_id: idLivro, nota, comentario })
        });

        if (response.ok) {
            showToast("Avaliação enviada!", 'success');
            location.reload();
        } else {
            showToast("Erro ao enviar avaliação.", 'error');
        }
    } catch (error) {
        console.error(error);
        showToast("Erro de conexão.", 'error');
    }
}

// ==========================================
// RESERVAS
// ==========================================
let livroIdParaReserva = null;

window.reservarLivro = function(id) {
    const usuarioId = localStorage.getItem('usuarioId');
    const token = localStorage.getItem("userToken");

    if (!usuarioId || !token) {
        showToast("Você precisa fazer login para reservar.", 'warning');
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

    if (!dataDevolucao) {
        showToast("Por favor, selecione uma data.", 'warning');
        return;
    }

    const usuarioId = localStorage.getItem('usuarioId');
    const token = localStorage.getItem("userToken");

    if (!usuarioId || !token) {
        showToast("Sessão expirada. Faça login novamente.", 'error');
        window.location.href = "Login.html";
        return;
    }

    const dataRetirada = new Date().toISOString().split('T')[0];

    try {
        const response = await fetch(`${API_BASE_URL}/reservas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                usuario_id: usuarioId,
                livro_id: livroIdParaReserva,
                data_retirada: dataRetirada,
                data_devolucao: dataDevolucao
            })
        });

        if (response.status === 409) {
            showToast("⚠️ Você já possui uma reserva ativa para este livro!", "warning");
            fecharModalReserva(); 
            return;
        }

        if (response.status === 401 || response.status === 403) {
            showToast("🔒 Sessão expirada. Faça login novamente.", 'error');
            setTimeout(() => window.location.href = "Login.html", 2000);
            return;
        }

        if (!response.ok) {
            const erro = await response.json();
            throw new Error(erro.mensagem || 'Erro ao realizar reserva');
        }

        showToast('🎉 Livro reservado com sucesso!', 'success');
        fecharModalReserva();
        setTimeout(() => location.reload(), 1500);

    } catch (error) {
        console.error('Erro:', error);
        showToast(error.message || "Erro de conexão.", 'error');
    }
}

// ==========================================
// FAVORITOS
// ==========================================
window.adicionarFavoritos = async function(id) {
    const usuarioId = localStorage.getItem('usuarioId');
    const token = localStorage.getItem("userToken");

    if (!usuarioId || !token) {
        showToast('Faça login para adicionar favoritos.', 'error');
        window.location.href = "Login.html";
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/favoritos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ usuario_id: usuarioId, livro_id: id })
        });

        if (response.status === 409) {
            showToast('Livro já está nos favoritos!', 'warning'); 
            return;
        }
        
        if (!response.ok) throw new Error('Erro ao favoritar');

        showToast('❤️ Adicionado aos favoritos!', 'success');

    } catch (error) {
        showToast(error.message, 'error');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new DetalhesLivro();
});
