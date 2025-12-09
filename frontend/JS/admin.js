const API_URL = "http://localhost:3000";

// Estado global
let listaReservas = [];
let listaLivros = [];
let listaAlunos = [];

// ==========================================
// INICIALIZAÇÃO
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ Painel Admin inicializado");
    
    // Configurar admin logado
    const nomeAdmin = localStorage.getItem("nomeUsuario") || "Administrador";
    const perfil = localStorage.getItem("perfilUsuario");
    
    if (perfil !== 'Admin') {
        alert("⚠️ Acesso restrito a administradores!");
        window.location.href = "Login.html";
        return;
    }
    
    document.getElementById("adminNome").textContent = nomeAdmin;
    
    // Carregar dados da seção ativa inicialmente
    carregarLivros();
    
    // Configurar eventos
    configurarEventos();
    
    // Verificar token periodicamente
    setInterval(verificarSessao, 300000); // 5 minutos
});

function configurarEventos() {
    // Formulários
    document.getElementById("formLivro").addEventListener("submit", salvarLivro);
    document.getElementById("formAluno").addEventListener("submit", salvarAluno);
    
    // Logout
    document.getElementById("btnSairAdmin").addEventListener("click", () => {
        if (confirm("Deseja sair do painel administrativo?")) {
            localStorage.removeItem("userToken");
            localStorage.removeItem("nomeUsuario");
            localStorage.removeItem("perfilUsuario");
            window.location.href = "Login.html";
        }
    });
    
    // Filtros de busca
    const buscaLivro = document.getElementById("buscaLivro");
    const buscaAluno = document.getElementById("buscaAluno");
    const buscaReserva = document.getElementById("buscaReserva");
    
    if (buscaLivro) buscaLivro.addEventListener("input", () => filtrarLivros(buscaLivro.value));
    if (buscaAluno) buscaAluno.addEventListener("input", () => filtrarAlunos(buscaAluno.value));
    if (buscaReserva) buscaReserva.addEventListener("input", () => filtrarReservas(buscaReserva.value));
}

function verificarSessao() {
    const token = localStorage.getItem("userToken");
    if (!token) {
        alert("Sessão expirada. Por favor, faça login novamente.");
        window.location.href = "Login.html";
    }
}

// ==========================================
// NAVEGAÇÃO
// ==========================================
window.mostrarSecao = (secaoId) => {
    console.log(`📂 Alternando para seção: ${secaoId}`);
    
    // Atualizar navegação
    document.querySelectorAll('.nav-link').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(el => {
        if (el.textContent.includes(secaoId.charAt(0).toUpperCase() + secaoId.slice(1))) {
            el.classList.add('active');
        }
    });
    
    // Esconder todas as seções
    document.querySelectorAll('.content-section').forEach(el => {
        el.style.display = 'none';
    });
    
    // Mostrar seção selecionada
    const secao = document.getElementById(`secao-${secaoId}`);
    if (secao) {
        secao.style.display = 'block';
        
        // Atualizar título
        const titulos = {
            'livros': '📚 Gerenciar Livros',
            'alunos': '🎓 Gerenciar Alunos',
            'reservas': '📅 Controle de Reservas'
        };
        document.getElementById('tituloSecao').textContent = titulos[secaoId] || 'Painel Admin';
        
        // Carregar dados da seção se necessário
        if (secaoId === 'livros' && listaLivros.length === 0) {
            carregarLivros();
        } else if (secaoId === 'alunos' && listaAlunos.length === 0) {
            carregarAlunos();
        } else if (secaoId === 'reservas' && listaReservas.length === 0) {
            carregarReservas();
        }
    }
};

// ==========================================
// FUNÇÕES DE CARREGAMENTO
// ==========================================
async function carregarLivros() {
    try {
        console.log("📚 Carregando livros...");
        
        const token = obterToken();
        const response = await fetch(`${API_URL}/livros`, {
            headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        listaLivros = Array.isArray(data) ? data : (data.dados || data.livros || []);
        
        console.log(`✅ ${listaLivros.length} livros carregados`);
        renderizarLivros(listaLivros);
        
    } catch (error) {
        console.error("❌ Erro ao carregar livros:", error);
        mostrarErro('tabelaLivrosBody', `Erro ao carregar livros: ${error.message}`);
    }
}

async function carregarAlunos() {
    try {
        console.log("🎓 Carregando alunos...");
        
        const response = await fetch(`${API_URL}/usuarios`);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        const todosUsuarios = Array.isArray(data) ? data : (data.dados || data.usuarios || []);
        
        // Filtrar apenas alunos
        listaAlunos = todosUsuarios.filter(u => 
            u.perfil && u.perfil.toLowerCase() === 'aluno'
        );
        
        console.log(`✅ ${listaAlunos.length} alunos carregados`);
        renderizarAlunos(listaAlunos);
        
    } catch (error) {
        console.error("❌ Erro ao carregar alunos:", error);
        mostrarErro('tabelaAlunosBody', `Erro ao carregar alunos: ${error.message}`);
    }
}

async function carregarReservas() {
    try {
        console.log("📅 Carregando reservas...");
        
        const token = obterToken();
        const response = await fetch(`${API_URL}/reservas`, {
            headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        listaReservas = Array.isArray(data) ? data : (data.dados || data.reservas || []);
        
        console.log(`✅ ${listaReservas.length} reservas carregadas`);
        renderizarReservas(listaReservas);
        
    } catch (error) {
        console.error("❌ Erro ao carregar reservas:", error);
        mostrarErro('tabelaReservasBody', `Erro ao carregar reservas: ${error.message}`);
    }
}

// ==========================================
// FUNÇÕES DE RENDERIZAÇÃO
// ==========================================
function renderizarLivros(livros) {
    const tbody = document.getElementById("tabelaLivrosBody");
    if (!tbody) {
        console.error("❌ Elemento tabelaLivrosBody não encontrado!");
        return;
    }
    
    if (!Array.isArray(livros) || livros.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center">
                    📭 Nenhum livro cadastrado
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = '';
    
    livros.forEach(livro => {
        const tr = document.createElement("tr");
        const ativo = Number(livro.ativo) === 1 || livro.ativo === true;
        
        tr.innerHTML = `
            <td>${livro.id || '—'}</td>
            <td>
                <img src="${livro.caminho_capa || './images/capa-default.jpg'}" 
                     class="mini-capa" 
                     alt="${livro.titulo || 'Livro'}"
                     onerror="this.src='./images/capa-default.jpg'">
            </td>
            <td>
                <strong>${livro.titulo || 'Sem título'}</strong>
                ${livro.genero ? `<br><small class="text-grey">${livro.genero}</small>` : ''}
            </td>
            <td>${livro.autor || '—'}</td>
            <td>
                <span class="badge-status ${ativo ? 'ativo' : 'inativo'}">
                    ${ativo ? 'Ativo' : 'Inativo'}
                </span>
            </td>
            <td class="acoes">
                <button class="btn-editar" onclick="editarLivro(${livro.id})" title="Editar">
                    ✏️
                </button>
                <button class="btn-excluir" onclick="deletarLivro(${livro.id})" title="Excluir">
                    🗑️
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function renderizarAlunos(alunos) {
    const tbody = document.getElementById("tabelaAlunosBody");
    if (!tbody) {
        console.error("❌ Elemento tabelaAlunosBody não encontrado!");
        return;
    }
    
    if (!Array.isArray(alunos) || alunos.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center">
                    👤 Nenhum aluno cadastrado
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = '';
    
    alunos.forEach(aluno => {
        const tr = document.createElement("tr");
        const nome = aluno.nome || aluno.nome_completo || '—';
        const email = aluno.email || '—';
        const curso = aluno.curso || '—';
        const celular = aluno.celular || aluno.telefone || '—';
        
        tr.innerHTML = `
            <td>${aluno.id || '—'}</td>
            <td>
                <strong>${nome}</strong>
                ${aluno.data_nascimento ? `<br><small>${formatarData(aluno.data_nascimento)}</small>` : ''}
            </td>
            <td>${email}</td>
            <td>${curso}</td>
            <td>${celular}</td>
            <td class="acoes">
                <button class="btn-excluir" onclick="deletarAluno(${aluno.id})" title="Excluir">
                    🗑️
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function renderizarReservas(reservas) {
    const tbody = document.getElementById("tabelaReservasBody");
    if (!tbody) {
        console.error("❌ Elemento tabelaReservasBody não encontrado!");
        return;
    }
    
    if (!Array.isArray(reservas) || reservas.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center">
                    📭 Nenhuma reserva encontrada
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = '';
    
    reservas.forEach(reserva => {
        const tr = document.createElement("tr");
        const confirmado = reserva.confirmado_email === true || reserva.confirmado_email === 1;
        
        tr.innerHTML = `
            <td>${reserva.id || '—'}</td>
            <td>
                <strong>${reserva.usuario_nome || `Usuário ${reserva.usuario_id}`}</strong>
                ${reserva.usuario_email ? `<br><small>${reserva.usuario_email}</small>` : ''}
            </td>
            <td>
                <strong>${reserva.livro_titulo || `Livro ${reserva.livro_id}`}</strong>
                ${reserva.livro_autor ? `<br><small>${reserva.livro_autor}</small>` : ''}
            </td>
            <td>${formatarData(reserva.data_retirada)}</td>
            <td>${formatarData(reserva.data_devolucao)}</td>
            <td>
                <span class="status-confirmacao ${confirmado ? 'confirmado' : 'pendente'}">
                    ${confirmado ? '✅ Confirmado' : '⏳ Pendente'}
                </span>
            </td>
            <td class="acoes">
                <button class="btn-excluir" onclick="cancelarReservaAdmin(${reserva.id})" title="Cancelar">
                    ❌ Cancelar
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// ==========================================
// FUNÇÕES DE FILTRO
// ==========================================
function filtrarLivros(termo) {
    if (!termo.trim()) {
        renderizarLivros(listaLivros);
        return;
    }
    
    const termoLower = termo.toLowerCase();
    const filtrados = listaLivros.filter(livro => 
        (livro.titulo && livro.titulo.toLowerCase().includes(termoLower)) ||
        (livro.autor && livro.autor.toLowerCase().includes(termoLower)) ||
        (livro.genero && livro.genero.toLowerCase().includes(termoLower)) ||
        (livro.isbn && livro.isbn.toLowerCase().includes(termoLower))
    );
    
    renderizarLivros(filtrados);
}

function filtrarAlunos(termo) {
    if (!termo.trim()) {
        renderizarAlunos(listaAlunos);
        return;
    }
    
    const termoLower = termo.toLowerCase();
    const filtrados = listaAlunos.filter(aluno => 
        (aluno.nome && aluno.nome.toLowerCase().includes(termoLower)) ||
        (aluno.nome_completo && aluno.nome_completo.toLowerCase().includes(termoLower)) ||
        (aluno.email && aluno.email.toLowerCase().includes(termoLower)) ||
        (aluno.curso && aluno.curso.toLowerCase().includes(termoLower))
    );
    
    renderizarAlunos(filtrados);
}

function filtrarReservas(termo) {
    if (!termo.trim()) {
        renderizarReservas(listaReservas);
        return;
    }
    
    const termoLower = termo.toLowerCase();
    const filtrados = listaReservas.filter(reserva => 
        (reserva.usuario_nome && reserva.usuario_nome.toLowerCase().includes(termoLower)) ||
        (reserva.livro_titulo && reserva.livro_titulo.toLowerCase().includes(termoLower)) ||
        (reserva.usuario_email && reserva.usuario_email.toLowerCase().includes(termoLower)) ||
        (reserva.livro_autor && reserva.livro_autor.toLowerCase().includes(termoLower))
    );
    
    renderizarReservas(filtrados);
}

// ==========================================
// CRUD LIVROS
// ==========================================
window.editarLivro = async (id) => {
    try {
        console.log(`✏️ Editando livro ID: ${id}`);
        
        const token = obterToken();
        const response = await fetch(`${API_URL}/livros/${id}`, {
            headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        
        if (!response.ok) {
            throw new Error('Livro não encontrado');
        }
        
        const livro = await response.json();
        
        // Preencher formulário
        document.getElementById("livroId").value = livro.id;
        document.getElementById("titulo").value = livro.titulo || '';
        document.getElementById("autor").value = livro.autor || '';
        document.getElementById("editora").value = livro.editora || '';
        document.getElementById("genero").value = livro.genero || '';
        document.getElementById("idioma").value = livro.idioma || 'Português';
        document.getElementById("ano_publicacao").value = livro.ano_publicacao || '';
        document.getElementById("isbn").value = livro.isbn || '';
        document.getElementById("caminho_capa").value = livro.caminho_capa || '';
        document.getElementById("sinopse").value = livro.sinopse || '';
        document.getElementById("ativo").checked = Boolean(livro.ativo);
        
        document.getElementById("modalTituloLivro").textContent = `Editar Livro #${livro.id}`;
        abrirModal('modalLivro');
        
    } catch (error) {
        console.error("❌ Erro ao buscar livro:", error);
        alert(`Erro ao carregar livro: ${error.message}`);
    }
};

async function salvarLivro(e) {
    e.preventDefault();
    
    const token = obterToken();
    if (!token) {
        alert("🔒 Sessão expirada. Faça login novamente.");
        window.location.href = "Login.html";
        return;
    }
    
    const id = document.getElementById("livroId").value;
    const metodo = id ? "PUT" : "POST";
    const url = id ? `${API_URL}/livros/${id}` : `${API_URL}/livros`;
    
    const dados = {
        titulo: document.getElementById("titulo").value.trim(),
        autor: document.getElementById("autor").value.trim(),
        editora: document.getElementById("editora").value.trim(),
        genero: document.getElementById("genero").value,
        idioma: document.getElementById("idioma").value.trim(),
        ano_publicacao: document.getElementById("ano_publicacao").value,
        isbn: document.getElementById("isbn").value.trim(),
        formato: "Físico",
        caminho_capa: document.getElementById("caminho_capa").value.trim(),
        sinopse: document.getElementById("sinopse").value.trim(),
        ativo: document.getElementById("ativo").checked ? 1 : 0
    };
    
    // Validação básica
    if (!dados.titulo || !dados.autor) {
        alert("⚠️ Título e autor são obrigatórios!");
        return;
    }
    
    try {
        const resposta = await fetch(url, {
            method: metodo,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(dados)
        });
        
        if (resposta.ok) {
            alert("✅ Livro salvo com sucesso!");
            fecharModal('modalLivro');
            await carregarLivros();
        } else {
            const erro = await resposta.json();
            throw new Error(erro.mensagem || erro.erro || 'Erro desconhecido');
        }
    } catch (erro) {
        console.error("❌ Erro ao salvar livro:", erro);
        alert(`❌ Erro ao salvar livro: ${erro.message}`);
    }
}

window.deletarLivro = async (id) => {
    if (!confirm(`⚠️ Tem certeza que deseja excluir o livro #${id}?`)) return;
    
    const token = obterToken();
    if (!token) {
        alert("🔒 Sessão expirada.");
        return;
    }
    
    try {
        const resposta = await fetch(`${API_URL}/livros/${id}`, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (resposta.ok) {
            alert("✅ Livro excluído com sucesso!");
            await carregarLivros();
        } else {
            throw new Error('Erro ao excluir livro');
        }
    } catch (erro) {
        console.error("❌ Erro ao excluir livro:", erro);
        alert("❌ Erro ao excluir livro.");
    }
};

// ==========================================
// CRUD ALUNOS
// ==========================================
async function salvarAluno(e) {
    e.preventDefault();
    
    const senhaProvisoria = "mudar123";
    const dados = {
        nome_completo: document.getElementById("nomeAluno").value.trim(),
        email: document.getElementById("emailAluno").value.trim(),
        senha: senhaProvisoria,
        data_nascimento: document.getElementById("nascAluno").value,
        celular: document.getElementById("celularAluno").value.trim(),
        curso: document.getElementById("cursoAluno").value.trim(),
        perfil: "Aluno"
    };
    
    // Validação
    if (!dados.nome_completo || !dados.email || !dados.curso) {
        alert("⚠️ Nome, email e curso são obrigatórios!");
        return;
    }
    
    try {
        const resposta = await fetch(`${API_URL}/usuarios/cadastrar`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(dados)
        });
        
        const resultado = await resposta.json();
        
        if (resposta.ok) {
            alert(`✅ Aluno cadastrado com sucesso!\n\n📧 Email: ${dados.email}\n🔑 Senha provisória: ${senhaProvisoria}`);
            fecharModal('modalAluno');
            await carregarAlunos();
        } else {
            throw new Error(resultado.erro || resultado.mensagem || 'Erro desconhecido');
        }
    } catch (erro) {
        console.error("❌ Erro ao cadastrar aluno:", erro);
        alert(`❌ Erro ao cadastrar aluno: ${erro.message}`);
    }
}

window.deletarAluno = async (id) => {
    if (!confirm(`⚠️ Excluir este aluno? Esta ação não pode ser desfeita.`)) return;
    
    try {
        const resposta = await fetch(`${API_URL}/usuarios/${id}`, { 
            method: "DELETE" 
        });
        
        if (resposta.ok) {
            alert("✅ Aluno excluído com sucesso!");
            await carregarAlunos();
        } else {
            throw new Error('Erro ao excluir aluno');
        }
    } catch (erro) {
        console.error("❌ Erro ao excluir aluno:", erro);
        alert("❌ Erro ao excluir aluno.");
    }
};

// ==========================================
// RESERVAS
// ==========================================
window.cancelarReservaAdmin = async (id) => {
    if (!confirm(`⚠️ Cancelar esta reserva #${id}?`)) return;
    
    const token = obterToken();
    
    try {
        const resposta = await fetch(`${API_URL}/reservas/${id}`, {
            method: "DELETE",
            headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        
        if (resposta.ok) {
            alert("✅ Reserva cancelada com sucesso!");
            await carregarReservas();
        } else {
            throw new Error('Erro ao cancelar reserva');
        }
    } catch (erro) {
        console.error("❌ Erro ao cancelar reserva:", erro);
        alert("❌ Erro ao cancelar reserva.");
    }
};

// ==========================================
// UTILITÁRIOS
// ==========================================
function obterToken() {
    let token = localStorage.getItem("userToken");
    if (token) {
        token = token.replace(/"/g, '');
    }
    return token;
}

function formatarData(dataString) {
    if (!dataString) return '—';
    try {
        const data = new Date(dataString);
        return data.toLocaleDateString('pt-BR');
    } catch {
        return dataString;
    }
}

function mostrarErro(elementId, mensagem) {
    const elemento = document.getElementById(elementId);
    if (elemento) {
        elemento.innerHTML = `
            <tr>
                <td colspan="${elementId.includes('Reservas') ? 7 : 6}" class="text-center erro">
                    ❌ ${mensagem}
                </td>
            </tr>
        `;
    }
}

// ==========================================
// CONTROLE DE MODAIS
// ==========================================
window.abrirModalLivro = () => {
    document.getElementById("formLivro").reset();
    document.getElementById("livroId").value = "";
    document.getElementById("ativo").checked = true;
    document.getElementById("idioma").value = "Português";
    document.getElementById("modalTituloLivro").textContent = "📚 Novo Livro";
    abrirModal('modalLivro');
};

window.abrirModalAluno = () => {
    document.getElementById("formAluno").reset();
    document.getElementById("nascAluno").valueAsDate = new Date();
    abrirModal('modalAluno');
};

function abrirModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = "flex";
        modal.style.animation = "fadeIn 0.3s ease";
    }
}

window.fecharModal = (modalId) => {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = "none";
    }
};

// Fechar modal ao clicar fora
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        e.target.style.display = 'none';
    }
});

// Fechar modal com ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay').forEach(modal => {
            modal.style.display = 'none';
        });
    }
});