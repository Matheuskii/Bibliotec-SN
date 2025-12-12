
const API_URL = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", () => {
    // Carrega dados iniciais
    carregarLivros();
    carregarAlunos();
    carregarReservas();

    // Configura o nome do Admin logado
    const nomeAdmin = localStorage.getItem("nomeUsuario");
    if(nomeAdmin) document.getElementById("adminNome").textContent = nomeAdmin;

    // --- EVENTOS DE SUBMIT ---
    document.getElementById("formLivro").addEventListener("submit", salvarLivro);
    document.getElementById("formAluno").addEventListener("submit", salvarAluno);

    // --- LOGOUT ---
    document.getElementById("btnSairAdmin").addEventListener("click", () => {
        if(confirm("Deseja sair do painel?")) {
            localStorage.clear();
            window.location.href = "Login.html";
        }
    });
});

// ==========================================
// NAVEGAÇÃO ENTRE SEÇÕES (LIVROS/ALUNOS/RESERVAS)
// ==========================================
window.mostrarSecao = (secaoId) => {
    // Esconde todas
    document.querySelectorAll('.content-section').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.nav-link').forEach(el => el.classList.remove('active'));

    // Mostra a escolhida
    document.getElementById(`secao-${secaoId}`).style.display = 'block';

    // Atualiza título e classe active (simulação simples)
    const mapTitulos = {
        'livros': 'Gerenciar Livros',
        'alunos': 'Gerenciar Alunos',
        'reservas': 'Controle de Reservas'
    };
    document.getElementById('tituloSecao').innerText = mapTitulos[secaoId];
}

// ==========================================
// LÓGICA DE LIVROS (RF02, RF03, RF04, RF11, RF12)
// ==========================================
async function carregarLivros() {
    try {
        const response = await fetch(`${API_URL}/livros`);
        const livros = await response.json();
        const tbody = document.getElementById("tabelaLivrosBody");
        tbody.innerHTML = "";

        livros.forEach(livro => {
            const tr = document.createElement("tr");
            const ativo = Number(livro.ativo) === 1;

            // RN11: Livros podem estar cadastrados porém inativos
            const statusBadge = ativo
                ? `<span class="badge-status ativo">Ativo</span>`
                : `<span class="badge-status inativo">Inativo</span>`;

            // Prepara objeto para edição
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
    document.getElementById("ano_publicacao").value = livro.ano_publicacao ? new Date(livro.ano_publicacao).getFullYear() : "";
    document.getElementById("isbn").value = livro.isbn || "";
    document.getElementById("caminho_capa").value = livro.caminho_capa || "";
    document.getElementById("sinopse").value = livro.sinopse || "";
    document.getElementById("ativo").checked = (Number(livro.ativo) === 1);

    document.getElementById("modalTituloLivro").innerText = "Editar Livro #" + livro.id;
    document.getElementById("modalLivro").style.display = "flex";
}

async function salvarLivro(e) {
    e.preventDefault();
    const id = document.getElementById("livroId").value;
    const metodo = id ? "PUT" : "POST";
    const url = id ? `${API_URL}/livros/${id}` : `${API_URL}/livros`;

    const dados = {
        titulo: document.getElementById("titulo").value,
        autor: document.getElementById("autor").value,
        editora: document.getElementById("editora").value,
        genero: document.getElementById("genero").value,
        idioma: document.getElementById("idioma").value, // RN09
        ano_publicacao: document.getElementById("ano_publicacao").value,
        isbn: document.getElementById("isbn").value,
        formato: "Físico", // Default conforme RN
        caminho_capa: document.getElementById("caminho_capa").value,
        sinopse: document.getElementById("sinopse").value,
        ativo: document.getElementById("ativo").checked ? 1 : 0
    };

    try {
        const response = await fetch(url, {
            method: metodo,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados)
        });
        if(response.ok) {
            alert("Livro salvo com sucesso!");
            fecharModal('modalLivro');
            carregarLivros();
        } else {
            alert("Erro ao salvar livro.");
        }
    } catch(err) { console.error(err); }
}

window.deletarLivro = async (id) => {
    if(confirm("Tem certeza que deseja excluir?")) {
        await fetch(`${API_URL}/livros/${id}`, { method: "DELETE" });
        carregarLivros();
    }
}

// ==========================================
// LÓGICA DE ALUNOS (RF01, RN04, RN07)
// ==========================================
async function carregarAlunos() {
    try {
        const response = await fetch(`${API_URL}/usuarios`);
        const usuarios = await response.json();

        const tbody = document.getElementById("tabelaAlunosBody");
        tbody.innerHTML = "";

        // Filtra apenas ALUNOS (RN01 diz que admin cadastra alunos)
        const alunos = usuarios.filter(u => u.perfil === 'Aluno');

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

    // RN04: Admin cadastra sem senha
    // Como o Banco (MySQL) exige senha (NOT NULL), geramos uma provisória.
    // RN05: Diz que aluno recebe email para mudar senha (simulado aqui)
    const senhaProvisoria = "mudar123";

    const dados = {
        nome: document.getElementById("nomeAluno").value, // Adaptando nome_completo -> nome (conforme seu banco)
        email: document.getElementById("emailAluno").value,
        data_nascimento: document.getElementById("nascAluno").value,
        celular: document.getElementById("celularAluno").value,
        curso: document.getElementById("cursoAluno").value,
        senha: senhaProvisoria
    };

    // Vamos enviar o objeto compátivel com o seu controller de cadastro:
    const payload = {
        nome_completo: dados.nome, // controller usa nome_completo ou usuario
        usuario: dados.nome,       // Fallback
        email: dados.email,
        senha: dados.senha,
        data_nascimento: dados.data_nascimento,
        celular: dados.celular,
        curso: dados.curso
    };

    try {
        const response = await fetch(`${API_URL}/usuarios/cadastrar`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if(response.ok) {
            alert(`Aluno cadastrado com sucesso!\nSenha provisória: ${senhaProvisoria} (RN04)`);
            fecharModal('modalAluno');
            carregarAlunos();
        } else {
            const err = await response.json();
            alert("Erro: " + (err.erro || err.message));
        }
    } catch(err) {
        console.error(err);
        alert("Erro de conexão.");
    }
}

window.deletarAluno = async (id) => {
    if(confirm("Excluir este aluno?")) {
        await fetch(`${API_URL}/usuarios/${id}`, { method: "DELETE" });
        carregarAlunos();
    }
}


async function carregarReservas() {
    try {
        console.log("📅 Carregando reservas...");

        // 1. PEGA O TOKEN REAL DO LOGIN
        const token = localStorage.getItem("userToken");

        if (!token) {
            console.warn("Sem token, redirecionando...");
            // Opcional: window.location.href = "Login.html";
            return;
        }

        // 2. ENVIA O TOKEN NO CABEÇALHO (HEADER)
        const response = await fetch(`${API_URL}/reservas`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // <--- OBRIGATÓRIO
            }
        });

        if (!response.ok) {
            if (response.status === 401) alert("Sessão expirada.");
            throw new Error(`HTTP ${response.status}`);
        }

        const reservas = await response.json();

        // Mantém sua lógica de extrair os dados
        const lista = reservas.dados ? reservas.dados : reservas;

        const tbody = document.getElementById("tabelaReservasBody");
        if(tbody) tbody.innerHTML = "";

        if (!Array.isArray(lista)) return;

        lista.forEach(reserva => {
            const tr = document.createElement("tr");

            // Formatando datas (usando UTC para evitar erro de dia anterior)
            const formatar = (data) => new Date(data).toLocaleDateString('pt-BR', {timeZone: 'UTC'});
            const retirada = formatar(reserva.data_retirada);
            const devolucao = formatar(reserva.data_devolucao);

            tr.innerHTML = `
                <td>${reserva.id}</td>
                <td>${reserva.usuario_nome || 'ID: ' + reserva.usuario_id}</td>
                <td>${reserva.livro_titulo || 'ID: ' + reserva.livro_id}</td>
                <td>${retirada}</td>
                <td>${devolucao}</td>
                <td>${reserva.confirmado_email ? '✅' : '⏳'}</td>
                 <td class="acoes">
                    <button class="btn-excluir" onclick="window.cancelarReservaAdmin(${reserva.id})" title="Cancelar">❌</button>
                </td>
            `;
            if(tbody) tbody.appendChild(tr);
        });

    } catch (error) {
        console.error("Erro ao carregar reservas", error);
    }
}

// ==========================================
// UTILITÁRIOS DE MODAL
// ==========================================
window.abrirModalLivro = () => {
    document.getElementById("formLivro").reset();
    document.getElementById("livroId").value = "";
    document.getElementById("modalTituloLivro").innerText = "Novo Livro (RF02)";
    document.getElementById("modalLivro").style.display = "flex";
}

window.abrirModalAluno = () => {
    document.getElementById("formAluno").reset();
    document.getElementById("modalAluno").style.display = "flex";
}

window.fecharModal = (modalId) => {
    document.getElementById(modalId).style.display = "none";
}