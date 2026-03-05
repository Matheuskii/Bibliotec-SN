import API_BASE_URL from "./config.js";

let emailParaVerificar = "";

// ===============================================
// LÓGICA DE LOGIN
// ===============================================
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const nome_email = document.getElementById("loginInput").value.trim();
    const senha = document.getElementById("senha").value.trim();

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nome_email);

    const payload = { senha };

    if (isEmail) {
      payload.email = nome_email;
    } else {
      payload.usuario = nome_email;
    }

    try {
      const resposta = await fetch(`${API_BASE_URL}/usuarios/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const dados = await resposta.json();

      if (!dados.sucesso) {
        showToast(dados.mensagem || "Erro ao fazer login.", 'error');
        return;
      }

      if (dados.sucesso) {
        localStorage.setItem("nomeUsuario", dados.usuario.nome);
        localStorage.setItem("usuarioId", dados.usuario.id);
        localStorage.setItem("perfilUsuario", dados.usuario.perfil);
        localStorage.setItem("userToken", dados.token);

        showToast(`Bem-vindo, ${dados.usuario.nome}!`, 'success');

        if (dados.usuario.perfil === 'Admin') {
            window.location.href = "Admin.html";
        } else {
            window.location.href = "Inicio.html";
        }
      }
    } catch (erro) {
      console.error(erro);
      showToast("Erro ao conectar com o servidor.", 'error');
    }
  });
}

// ===============================================
// LÓGICA DE CADASTRO
// ===============================================
const cadastroForm = document.getElementById("cadastroForm");

if (cadastroForm) {
  cadastroForm.addEventListener("submit", (event) => {
    event.preventDefault();
    cadastrarUsuario();
  });
}

async function cadastrarUsuario() {
  const nome = document.getElementById("nome").value.trim();
  const email = document.getElementById("email").value.trim();
  const data_nascimento = document.getElementById("dataNascimento").value;
  const celular = document.getElementById("celular").value.trim();
  const curso = document.getElementById("curso").value.trim();
  const senha = document.getElementById("senha").value.trim();
  const confirmarSenha = document.getElementById("confirmarSenha").value.trim();

  if (senha !== confirmarSenha) return showToast("As senhas não coincidem.");
  if (!email.includes("@") || !email.includes(".")) return showToast("Insira um email válido.", 'error');
  if (!data_nascimento) return showToast("Insira sua data de nascimento.", 'error');

  const payload = {
    nome_completo: nome,
    usuario: nome,
    email: email,
    data_nascimento: data_nascimento,
    celular: celular,
    curso: curso,
    senha: senha,
    perfil: 'Aluno'
  };

  try {
    const resposta = await fetch(`${API_BASE_URL}/usuarios/cadastrar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const dados = await resposta.json();

    if (resposta.status === 201) {
        const modal = document.getElementById("modalVerificacao");

        if (modal) {
            emailParaVerificar = email;

            const displayEmail = document.getElementById("emailDisplay");
            if(displayEmail) displayEmail.textContent = email;

            modal.style.display = "flex";
        } else {
            showToast("Cadastro realizado, mas erro ao abrir a janela de verificação.", 'success');
        }

    } else {
        showToast(dados.erro || dados.mensagem || "Erro ao realizar cadastro.", 'error');
    }

  } catch (erro) {
    console.error("Erro de conexão:", erro);
    showToast("Erro de conexão com o servidor.", 'error');
  }
}

window.confirmarCodigo = async function() {
    const codigoInput = document.getElementById("codigoInput");
    const codigo = codigoInput ? codigoInput.value.trim() : "";

    if (!codigo) return showToast("Digite o código.", 'error');

    try {
        const resposta = await fetch(`${API_BASE_URL}/usuarios/verificar`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: emailParaVerificar, codigo: codigo })
        });

        const dados = await resposta.json();

        if (dados.sucesso) {
            showToast("✅ Conta verificada com sucesso! Faça login.", 'success');
            window.location.href = "Login.html";
        } else {
            showToast("❌ " + dados.mensagem, 'error');
        }
    } catch (error) {
        console.error(error);
        showToast("Erro ao verificar código.", 'error');
    }
}

// ===============================================
// LÓGICA DE RECUPERAÇÃO DE SENHA
// ===============================================
const newpassForm = document.getElementById("newpassForm");

if (newpassForm) {
  newpassForm.addEventListener("submit", (event) => {
    event.preventDefault();
    recuperarSenha();
  });
}

async function recuperarSenha() {
  const nome_email = document.getElementById("usuario").value.trim();
  const novaSenha = document.getElementById("senha").value.trim();
  const confirmarSenha = document.getElementById("confirmarSenha").value.trim();

  if (novaSenha !== confirmarSenha) {
    showToast("As senhas não coincidem.", 'error');
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
    const resposta = await fetch(`${API_BASE_URL}/usuarios/newpass`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const dados = await resposta.json();

    showToast(dados.message || dados.mensagem, 'success');

    if (resposta.status === 201) {
      showToast("Nova senha registrada com sucesso, redirecionando ao login...", 'success');
      redirecionarParaLogin();
    }
  } catch (err) {
    console.error(err);
    showToast("Erro ao recuperar senha.", 'error');
  }
}

function redirecionarParaLogin() {
  window.location.href = "Login.html";
}
