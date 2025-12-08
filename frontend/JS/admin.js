const API_URL = "http://localhost:3000";
import { fetchAuth } from "./api.js"; 

document.addEventListener("DOMContentLoaded", () => {
    // Carrega dados iniciais
    carregarLivros();
    carregarAlunos();
    carregarReservas();

    // Configura o nome do Admin logado
    const nomeAdmin = localStorage.getItem("nomeUsuario");
    if(nomeAdmin) document.getElementById("adminNome").textContent = nomeAdmin;

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

const token = localStorage.getItem("userToken");

async function salvarLivro(e) {
    e.preventDefault();
    
    // Verificação de segurança básica
    if (!token) {
        alert("Sessão expirada. Faça login novamente.");
        window.location.href = "Login.html";
        return;
    }

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
        const res = await fetch(url, {
            method: metodo, 
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // <--- OBRIGATÓRIO: Envia o crachá
            },
            body: JSON.stringify(dados)
        });
        
        if(res.ok) {
            alert("Livro salvo com sucesso!");
            fecharModal('modalLivro');
            carregarLivros();
        } else {
            // Mostra o erro real do backend (ex: "Token expirado")
            const erro = await res.json();
            alert("Erro: " + (erro.mensagem || erro.erro));
        }
    } catch(err) { console.error(err); }
}

window.deletarLivro = async (id) => {
    if(!token) return alert("Faça login.");

    if(confirm("Tem certeza que deseja excluir?")) {
        const res = await fetch(`${API_URL}/livros/${id}`, { 
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${token}` // <--- OBRIGATÓRIO
            }
        });
        
        if(res.ok) {
            carregarLivros();
        } else {
            alert("Erro ao excluir.");
        }
    }
}
// ==========================================
// LÓGICA DE ALUNOS
// ==========================================
async function carregarAlunos() {
    try {
        const response = await fetch(`${API_URL}/usuarios`);
        const usuarios = await response.json();

        const tbody = document.getElementById("tabelaAlunosBody");
        tbody.innerHTML = "";

        // Filtra apenas ALUNOS
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


    const senhaProvisoria = "mudar123";

    const dados = {
        nome: document.getElementById("nomeAluno").value, // Adaptando nome_completo -> nome (conforme seu banco)
        email: document.getElementById("emailAluno").value,
        data_nascimento: document.getElementById("nascAluno").value,
        celular: document.getElementById("celularAluno").value,
        curso: document.getElementById("cursoAluno").value,
        senha: senhaProvisoria
    };



    // CORREÇÃO: O seu backend 'criarUsuario' espera { nome_completo ... } ou { usuario, email, senha }
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

// ==========================================
// LÓGICA DE RESERVAS
// ==========================================
async function carregarReservas() {
    try {
        // RF06: Admin lista livros reservados
        // A rota GET /reservas (listarReservas no controller) já faz um JOIN com usuários e livros
        const response = await fetch(`${API_URL}/reservas`);
        const reservas = await response.json();

        // Verifica estrutura da resposta (seu backend retorna {sucesso, dados: []} ou direto [])
        const lista = reservas.dados ? reservas.dados : reservas;

        const tbody = document.getElementById("tabelaReservasBody");
        tbody.innerHTML = "";

        if(!Array.isArray(lista)) return;

        lista.forEach(reserva => {
            const tr = document.createElement("tr");

            // Formatando datas
            const retirada = new Date(reserva.data_retirada).toLocaleDateString('pt-BR');
            const devolucao = new Date(reserva.data_devolucao).toLocaleDateString('pt-BR');

            tr.innerHTML = `
                <td>${reserva.id}</td>
                <td>${reserva.usuario_nome || 'ID: ' + reserva.usuario_id}</td>
                <td>${reserva.livro_titulo || 'ID: ' + reserva.livro_id}</td>
                <td>${retirada}</td>
                <td>${devolucao}</td>
                <td>${reserva.confirmado_email ? '✅' : '⏳'}</td>
            `;
            tbody.appendChild(tr);
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