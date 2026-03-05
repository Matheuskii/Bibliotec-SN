import API_BASE_URL from "./config.js";

const API_URL = API_BASE_URL;

document.addEventListener("DOMContentLoaded", () => {
    carregarLivros();
    carregarAlunos();
    carregarReservas();

    const nomeAdmin = localStorage.getItem("nomeUsuario");
    if(nomeAdmin) {
        const adminNomeEl = document.getElementById("adminNome");
        if(adminNomeEl) adminNomeEl.textContent = nomeAdmin;
    }

    const formLivro = document.getElementById("formLivro");
    if(formLivro) formLivro.addEventListener("submit", salvarLivro);

    const formAluno = document.getElementById("formAluno");
    if(formAluno) formAluno.addEventListener("submit", salvarAluno);

    const btnSair = document.getElementById("btnSairAdmin");
    if(btnSair) {
        btnSair.addEventListener("click", () => {
            if(confirm("Deseja sair do painel?")) {
                localStorage.clear();
                window.location.href = "Login.html";
            }
        });
    }
});

// ==========================================
// NAVEGAÇÃO ENTRE SEÇÕES
// ==========================================
window.mostrarSecao = (secaoId) => {
    document.querySelectorAll('.content-section').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.nav-link').forEach(el => el.classList.remove('active'));

    const secao = document.getElementById(`secao-${secaoId}`);
    if(secao) secao.style.display = 'block';

    const mapTitulos = {
        'livros': 'Gerenciar Livros',
        'alunos': 'Gerenciar Alunos',
        'reservas': 'Controle de Reservas'
    };
    const titulo = document.getElementById('tituloSecao');
    if(titulo) titulo.innerText = mapTitulos[secaoId];
}

// ==========================================
// LÓGICA DE LIVROS
// ==========================================
async function carregarLivros() {
    try {
        const response = await fetch(`${API_URL}/livros`);
        const livros = await response.json();
        const tbody = document.getElementById("tabelaLivrosBody");
        if(!tbody) return;
        
        tbody.innerHTML = "";

        livros.forEach(livro => {
            const tr = document.createElement("tr");
            const ativo = Number(livro.ativo) === 1;
            const statusBadge = ativo
                ? `<span class="badge-status ativo">Ativo</span>`
                : `<span class="badge-status inativo">Inativo</span>`;

            const livroString = JSON.stringify(livro).replace(/'/g, "&#39;");

            tr.innerHTML = `
                <td>${livro.id}</td>
                <td><img src="${livro.caminho_capa || './images/capa-default.jpg'}" class="mini-capa"></td>
                <td>${livro.titulo}</td>
                <td>${livro.autor}</td>
                <td>${statusBadge}</td>
                <td>
                    <button class="btn-editar" onclick='editarLivro(${livroString})'>✏️</button>
                    <button class="btn-excluir" onclick="deletarLivro(${livro.id})">🗑️</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error("Erro ao carregar livros", error);
    }
}

window.editarLivro = (livro) => {
    document.getElementById("livroId").value = livro.id;
    document.getElementById("titulo").value = livro.titulo;
    document.getElementById("autor").value = livro.autor;
    document.getElementById("editora").value = livro.editora || "";
    document.getElementById("genero").value = livro.genero || "";
    document.getElementById("idioma").value = livro.idioma || "Português";
    document.getElementById("ano_publicacao").value = livro.ano_publicacao || "";
    document.getElementById("isbn").value = livro.isbn || "";
    document.getElementById("caminho_capa").value = livro.caminho_capa || "";
    document.getElementById("sinopse").value = livro.sinopse || "";
    document.getElementById("ativo").checked = (Number(livro.ativo) === 1);

    document.getElementById("modalTituloLivro").innerText = "Editar Livro #" + livro.id;
    document.getElementById("modalLivro").style.display = "flex";
}

async function salvarLivro(e) {
    e.preventDefault();
    const token = localStorage.getItem("userToken");
    const id = document.getElementById("livroId").value;
    const metodo = id ? "PUT" : "POST";
    const url = id ? `${API_URL}/livros/${id}` : `${API_URL}/livros`;

    const dados = {
        titulo: document.getElementById("titulo").value,
        autor: document.getElementById("autor").value,
        editora: document.getElementById("editora").value,
        genero: document.getElementById("genero").value,
        idioma: document.getElementById("idioma").value,
        ano_publicacao: document.getElementById("ano_publicacao").value,
        isbn: document.getElementById("isbn").value,
        formato: "Físico",
        caminho_capa: document.getElementById("caminho_capa").value,
        sinopse: document.getElementById("sinopse").value,
        ativo: document.getElementById("ativo").checked ? 1 : 0
    };

    try {
        const response = await fetch(url, {
            method: metodo,
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(dados)
        });
        
        if(response.ok) {
            showToast("Livro salvo com sucesso!", 'success');
            fecharModal('modalLivro');
            carregarLivros();
        } else {
            const err = await response.json();
            showToast("Erro: " + (err.erro || err.mensagem || "Falha ao salvar"), 'error');
        }
    } catch(err) { console.error(err); }
}

window.deletarLivro = async (id) => {
    if(confirm("Tem certeza que deseja excluir este livro?")) {
        const token = localStorage.getItem("userToken");
        try {
            const response = await fetch(`${API_URL}/livros/${id}`, { 
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            
            if(response.ok) {
                carregarLivros();
            } else {
                showToast("Erro ao excluir livro.", 'error');
            }
        } catch(err) { console.error(err); }
    }
}

// ==========================================
// LÓGICA DE ALUNOS
// ==========================================
async function carregarAlunos() {
    try {
        const token = localStorage.getItem("userToken");
        const response = await fetch(`${API_URL}/usuarios`, {
             headers: { "Authorization": `Bearer ${token}` }
        });
        const usuarios = await response.json();

        const tbody = document.getElementById("tabelaAlunosBody");
        if(!tbody) return;
        tbody.innerHTML = "";

        const lista = Array.isArray(usuarios) ? usuarios : (usuarios.dados || []);
        const alunos = lista.filter(u => u.perfil === 'Aluno');

        alunos.forEach(aluno => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${aluno.id}</td>
                <td>${aluno.nome}</td>
                <td>${aluno.email}</td>
                <td>${aluno.curso || '-'}</td>
                <td>${aluno.celular || '-'}</td>
                <td>
                    <button class="btn-excluir" onclick="deletarAluno(${aluno.id})">🗑️</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error(error);
    }
}

async function salvarAluno(e) {
    e.preventDefault();
    const token = localStorage.getItem("userToken");
    const senhaProvisoria = "mudar123";

    const payload = {
        nome_completo: document.getElementById("nomeAluno").value,
        usuario: document.getElementById("nomeAluno").value,
        email: document.getElementById("emailAluno").value,
        senha: senhaProvisoria,
        data_nascimento: document.getElementById("nascAluno").value,
        celular: document.getElementById("celularAluno").value,
        curso: document.getElementById("cursoAluno").value,
        perfil: 'Aluno'
    };

    try {
        const response = await fetch(`${API_URL}/usuarios/cadastrar`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        if(response.ok) {
            showToast(`Aluno cadastrado!\nSenha provisória: ${senhaProvisoria}`, 'success');
            fecharModal('modalAluno');
            carregarAlunos();
        } else {
            const err = await response.json();
            showToast("Erro: " + (err.erro || err.message), 'error');
        }
    } catch(err) {
        console.error(err);
        showToast("Erro de conexão.", 'error');
    }
}

window.deletarAluno = async (id) => {
    if(confirm("Excluir este aluno?")) {
        const token = localStorage.getItem("userToken");
        try {
            const response = await fetch(`${API_URL}/usuarios/${id}`, { 
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if(response.ok) {
                carregarAlunos();
            } else {
                showToast("Erro ao excluir aluno.", 'error');
            }
        } catch(err) { console.error(err); }
    }
}

// ==========================================
// LÓGICA DE RESERVAS
// ==========================================
async function carregarReservas() {
    try {
        const token = localStorage.getItem("userToken");
        if (!token) return;

        const response = await fetch(`${API_URL}/reservas`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const reservas = await response.json();
        const lista = reservas.dados ? reservas.dados : reservas;
        const tbody = document.getElementById("tabelaReservasBody");
        if(tbody) tbody.innerHTML = "";

        if (!Array.isArray(lista)) return;

        lista.forEach(reserva => {
            const tr = document.createElement("tr");

            const formatar = (data) => new Date(data).toLocaleDateString('pt-BR', {timeZone: 'UTC'});
            const retirada = formatar(reserva.data_retirada);
            const devolucao = formatar(reserva.data_devolucao);

            const statusVisual = reserva.confirmado_email 
                ? '<span style="color:green; font-weight:bold;">Confirmado ✅</span>' 
                : '<span style="color:orange; font-weight:bold;">Pendente ⏳</span>';

            const btnConfirmar = !reserva.confirmado_email
                ? `<button class="btn-confirmar" onclick="window.confirmarReservaAdmin(${reserva.id})" title="Confirmar Retirada">✅</button>`
                : '';

            tr.innerHTML = `
                <td>${reserva.id}</td>
                <td>${reserva.usuario_nome || 'ID: ' + reserva.usuario_id}</td>
                <td>${reserva.livro_titulo || 'ID: ' + reserva.livro_id}</td>
                <td>${retirada}</td>
                <td>${devolucao}</td>
                <td>${statusVisual}</td>
                <td class="acoes" style="display: flex; gap: 5px;">
                    ${btnConfirmar}
                    <button class="btn-excluir" onclick="window.cancelarReservaAdmin(${reserva.id})" title="Cancelar">❌</button>
                </td>
            `;
            if(tbody) tbody.appendChild(tr);
        });

    } catch (error) {
        console.error("Erro ao carregar reservas", error);
    }
}

window.confirmarReservaAdmin = async (id) => {
    if (!confirm("Confirmar a retirada deste livro pelo aluno?")) return;

    const token = localStorage.getItem("userToken");
    
    try {
        const response = await fetch(`${API_URL}/reservas/${id}/confirmar`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (response.ok) {
            showToast("Reserva confirmada com sucesso!", 'success');
            carregarReservas();
        } else {
            showToast("Erro ao confirmar reserva.", 'error');
        }
    } catch (error) {
        console.error(error);
        showToast("Erro de conexão.", 'error');
    }
}

window.cancelarReservaAdmin = async (id) => {
    if (!confirm("Tem certeza que deseja cancelar e excluir esta reserva?")) return;

    const token = localStorage.getItem("userToken");
    
    if (!token) {
        showToast("Erro de autenticação. Faça login novamente.", 'error');
        window.location.href = "Login.html";
        return;
    }

    try {
        const response = await fetch(`${API_URL}/reservas/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (response.ok) {
            showToast("Reserva cancelada com sucesso!", 'success');
            carregarReservas();
        } else {
            const erro = await response.json();
            showToast("Erro ao cancelar: " + (erro.mensagem || erro.erro), 'error');
        }

    } catch (error) {
        console.error("Erro na requisição:", error);
        showToast("Erro de conexão.", 'error');
    }
}

// ==========================================
// UTILITÁRIOS DE MODAL
// ==========================================
window.abrirModalLivro = () => {
    const form = document.getElementById("formLivro");
    if(form) form.reset();
    document.getElementById("livroId").value = "";
    document.getElementById("modalTituloLivro").innerText = "Novo Livro";
    document.getElementById("modalLivro").style.display = "flex";
}

window.abrirModalAluno = () => {
    const form = document.getElementById("formAluno");
    if(form) form.reset();
    document.getElementById("modalAluno").style.display = "flex";
}

window.fecharModal = (modalId) => {
    const modal = document.getElementById(modalId);
    if(modal) modal.style.display = "none";
}
