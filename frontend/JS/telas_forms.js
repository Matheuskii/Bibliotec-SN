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
        alert(dados.mensagem || "Erro ao fazer login.");
        return;
      }

      // --- SUCESSO NO LOGIN ---
      if (dados.sucesso) {
        // 1. Salva os dados críticos no navegador
        localStorage.setItem("nomeUsuario", dados.usuario.nome);
        localStorage.setItem("usuarioId", dados.usuario.id);
        
        // [IMPORTANTE] Salva o perfil para controlar acesso ao Admin
        localStorage.setItem("perfilUsuario", dados.usuario.perfil); 

        alert(`Bem-vindo, ${dados.usuario.nome}!`);
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
      alert("Erro ao conectar com o servidor.");
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
  // Pega os valores pelos novos IDs (Compatível com RN07)
  const nome = document.getElementById("nome").value.trim();
  const email = document.getElementById("email").value.trim();
  const data_nascimento = document.getElementById("dataNascimento").value;
  const celular = document.getElementById("celular").value.trim();
  const curso = document.getElementById("curso").value.trim();
  const senha = document.getElementById("senha").value.trim();
  const confirmarSenha = document.getElementById("confirmarSenha").value.trim();

  // Validações
  if (senha !== confirmarSenha) {
    alert("As senhas não coincidem.");
    return;
  }

  if (!email.includes("@") || !email.includes(".")) {
    alert("Por favor, insira um email válido.");
    return;
  }
  
  if (!data_nascimento) {
    alert("Por favor, insira sua data de nascimento.");
    return;
  }

  // Prepara o objeto para enviar ao backend
  // Nota: O backend espera 'nome_completo' ou 'usuario' dependendo da versão,
  // vamos enviar ambos para garantir.
  const payload = {
    nome_completo: nome, 
    usuario: nome, // Fallback
    email: email,
    data_nascimento: data_nascimento,
    celular: celular,
    curso: curso,
    senha: senha,
    perfil: 'Aluno' // Quem se cadastra pelo site é sempre Aluno (RN01 implícita)
  };

  try {
    const resposta = await fetch("http://localhost:3000/usuarios/cadastrar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const dados = await resposta.json();

    if (resposta.status === 201) {
      alert("Cadastro realizado com sucesso! Faça login.");
      window.location.href = "Login.html";
    } else {
        alert(dados.mensagem || "Erro ao cadastrar.");
    }
  } catch (erro) {
    console.error(erro);
    alert("Erro ao conectar com o servidor.");
  }
}

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
    alert("As senhas não coincidem.");
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

    alert(dados.message || dados.mensagem);

    if (resposta.status === 201) {
      alert("Nova senha registrada com sucesso, redirecionando ao login...");
      redirecionarParaLogin();
    }
  } catch (err) {
    console.error(err);
    alert("Erro ao recuperar senha.");
  }
}

function redirecionarParaLogin() {
  window.location.href = "Login.html";
}