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

      alert(dados.mensagem || dados.message);

      if (dados.sucesso) {
        localStorage.setItem("nomeUsuario", dados.usuario.nome);
        alert(`Bem-vindo, ${dados.usuario.nome}!`);
        console.log("Dados do usuário:", dados.usuario);

        if (dados.usuario.id) {
          localStorage.setItem("usuarioId", dados.usuario.id);
        }
        console.log("ID do usuário armazenado:", dados.usuario.id);
        window.location.href = "Inicio.html";
      }
    } catch (erro) {
      alert("Erro ao fazer login.");
    }
  });
}

const cadastroForm = document.getElementById("cadastroForm");

if (cadastroForm) {
  cadastroForm.addEventListener("submit", (event) => {
    event.preventDefault();
    cadastrarUsuario();
  });
}

async function cadastrarUsuario() {
  const nome_email = document.getElementById("loginInput").value.trim();
  const senha = document.getElementById("senha").value.trim();
  const confirmarSenha = document.getElementById("confirmarSenha").value.trim();

  if (senha !== confirmarSenha) {
    alert("As senhas não coincidem.");
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
    const resposta = await fetch("http://localhost:3000/usuarios/cadastrar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
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
    alert("Erro ao recuperar senha.");
  }
}

function redirecionarParaLogin() {
  window.location.href = "Login.html";
}
