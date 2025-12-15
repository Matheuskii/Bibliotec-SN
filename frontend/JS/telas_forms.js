// Variável global para guardar o e-mail enquanto o usuário digita o código
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
      const resposta = await fetch("http://localhost:3000/usuarios/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const dados = await resposta.json();

      if (!dados.sucesso) {
        showToast(dados.mensagem || "Erro ao fazer login.", 'error');
        return;
      }

      // --- SUCESSO NO LOGIN ---
      if (dados.sucesso) {
        // 1. Salva os dados críticos no navegador
        localStorage.setItem("nomeUsuario", dados.usuario.nome);
        localStorage.setItem("usuarioId", dados.usuario.id);

        // [IMPORTANTE] Salva o perfil para controlar acesso ao Admin
        localStorage.setItem("perfilUsuario", dados.usuario.perfil);
        localStorage.setItem("userToken", dados.token);

        showToast(`Bem-vindo, ${dados.usuario.nome}!`, 'success');
        console.log("Login realizado. Perfil:", dados.usuario.perfil);

        if (dados.usuario.perfil === 'Admin') {
            window.location.href = "Admin.html";
        } else {
            // Se for Aluno, vai para a loja
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
  // 1. Pega os valores
  const nome = document.getElementById("nome").value.trim();
  const email = document.getElementById("email").value.trim();
  const data_nascimento = document.getElementById("dataNascimento").value;
  const celular = document.getElementById("celular").value.trim();
  const curso = document.getElementById("curso").value.trim();
  const senha = document.getElementById("senha").value.trim();
  const confirmarSenha = document.getElementById("confirmarSenha").value.trim();

  // 2. Validações
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
    const resposta = await fetch("http://localhost:3000/usuarios/cadastrar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const dados = await resposta.json();

    // 3. Verifica o Status da Resposta
    if (resposta.status === 201) {
        // --- SUCESSO ---
        console.log("✅ SUCESSO! Backend respondeu 201.");

        const modal = document.getElementById("modalVerificacao");

        if (modal) {
            console.log("✅ Modal encontrado no HTML!");

            // Define a variável global para usar na confirmação
            emailParaVerificar = email;

            // Preenche o email no texto do modal
            const displayEmail = document.getElementById("emailDisplay");
            if(displayEmail) displayEmail.textContent = email;

            // Mostra o modal
            modal.style.display = "flex";
        } else {
            console.error("❌ ERRO CRÍTICO: O elemento <div id='modalVerificacao'> não existe no Cadastro.html!");
            showToast("Cadastro realizado, mas erro ao abrir a janela de verificação. Verifique o console.", 'success');
        }

    } else {
        // --- ERRO (Ex: Email duplicado) ---
        console.warn("⚠️ Backend retornou erro:", dados);
        showToast(dados.erro || dados.mensagem || "Erro ao realizar cadastro.", 'error');
    }

  } catch (erro) {
    console.error("❌ Erro de conexão:", erro);
    showToast("Erro de conexão com o servidor.", 'error');
  }
}

// NOVA FUNÇÃO: CHAMADA PELO BOTÃO DO MODAL
window.confirmarCodigo = async function() {
    const codigoInput = document.getElementById("codigoInput");
    const codigo = codigoInput ? codigoInput.value.trim() : "";

    if (!codigo) return showToast("Digite o código.", 'error');

    try {
        const resposta = await fetch("http://localhost:3000/usuarios/verificar", {
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
    const resposta = await fetch("http://localhost:3000/usuarios/newpass", {
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