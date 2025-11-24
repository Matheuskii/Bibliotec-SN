// ===============================
//  LOGIN
// ===============================
const loginForm = document.getElementById('loginForm');

if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const nome_email = document.getElementById('loginInput').value.trim();
        const senha = document.getElementById('senha').value.trim();

        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nome_email);

        const payload = { senha };

        if (isEmail) {
            payload.email = nome_email;
        } else {
            payload.usuario = nome_email;
        }

        try {
            const resposta = await fetch('http://localhost:3000/usuarios/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const dados = await resposta.json();

            alert(dados.mensagem || dados.message);

            if (dados.sucesso) {
                localStorage.setItem("nomeUsuario", dados.usuario.nome);
                window.location.href = 'main.html';
            }

        } catch (erro) {
            alert("Erro ao fazer login.");
        }
    });
}



// ===============================
//  CADASTRO
// ===============================
const cadastroForm = document.getElementById('cadastroForm');

if (cadastroForm) {
    cadastroForm.addEventListener('submit', (event) => {
        event.preventDefault();
        cadastrarUsuario();
    });
}

async function cadastrarUsuario() {
    const nome_email = document.getElementById('loginInput').value.trim();
    const senha = document.getElementById('senha').value.trim();
    const confirmarSenha = document.getElementById('confirmarSenha').value.trim();

    if (senha !== confirmarSenha) {
        alert('As senhas não coincidem.');
        return;
    }

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nome_email);

    const payload = { senha };

    if (isEmail) {
        payload.email = nome_email;
    } else {
        payload.usuario = nome_email;
    }

    try {
        const resposta = await fetch('http://localhost:3000/usuarios/cadastrar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const dados = await resposta.json();

        alert(dados.mensagem || dados.message);

        if (resposta.status === 201) {
            redirecionarParaLogin();
        }

    } catch (erro) {
        alert("Erro ao cadastrar usuário.");
    }
}



// ===============================
//  RECUPERAÇÃO DE SENHA
// ===============================
const newpassForm = document.getElementById('newpassForm');

if (newpassForm) {
    newpassForm.addEventListener('submit', (event) => {
        event.preventDefault();
        recuperarSenha();
    });
}

async function recuperarSenha() {
    const nome_email = document.getElementById('usuario').value.trim();
    const novaSenha = document.getElementById('senha').value.trim();
    const confirmarSenha = document.getElementById('confirmarSenha').value.trim();

    if (novaSenha !== confirmarSenha) {
        alert('As senhas não coincidem.');
        return;
    }

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nome_email);

    const payload = { novaSenha };

    if (isEmail) {
        payload.email = nome_email;
    } else {
        payload.usuario = nome_email;
    }

    try {
        const resposta = await fetch('http://localhost:3000/usuarios/newpass', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const dados = await resposta.json();

        alert(dados.message || dados.mensagem);

        if (resposta.status === 201) {
            alert("Nova senha registrada com sucesso, redirecionando ao login...");
            redirecionarParaLogin();
        }

    } catch (err) {
        alert("Erro ao recuperar senha.");
    }
}



// ===============================
//  REDIRECIONAMENTO
// ===============================
function redirecionarParaLogin() {
    window.location.href = 'index.html';
}



// ===============================
//  FUNÇÃO GERADORA DE CARROSSEL
// ===============================
export function criarCarrossel(gridId, leftBtn, rightBtn) {
    const cards = document.querySelectorAll(`#${gridId} .book-card`);

    // Encontra o card que já está com .active no HTML
    let index = [...cards].findIndex(c => c.classList.contains("active"));

    // Se não houver ativo, define o primeiro
    if (index === -1) index = 0;

    function atualizar() {
        cards.forEach(c => c.classList.remove("active"));
        cards[index].classList.add("active");
    }

    document.querySelector(leftBtn).addEventListener("click", () => {
        index = (index - 1 + cards.length) % cards.length;
        atualizar();
    });

    document.querySelector(rightBtn).addEventListener("click", () => {
        index = (index + 1) % cards.length;
        atualizar();
    });

    atualizar();
}
