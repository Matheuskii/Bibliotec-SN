// ===============================
//  LOGIN
// ===============================
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
        window.location.href = "main.html";
      }
    } catch (erro) {
      alert("Erro ao fazer login.");
    }
  });
}

// ===============================
//  CADASTRO
// ===============================
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

// ===============================
//  RECUPERAÇÃO DE SENHA
// ===============================
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

// ===============================
//  REDIRECIONAMENTO
// ===============================
function redirecionarParaLogin() {
  window.location.href = "index.html";
}

// ===============================
//  FUNÇÃO PARA CARREGAR LIVROS
// ===============================
async function carregarLivros() {
  try {
    const resposta = await fetch("http://localhost:3000/livros");
    const livros = await resposta.json();
    return livros;
  } catch (erro) {
    console.error("Erro ao carregar livros:", erro);
    return [];
  }
}

// ===============================
//  FUNÇÃO GERADORA DE CARROSSEL
// ===============================
export async function criarCarrossel(gridId, leftBtn, rightBtn) {
  const containerGrid = document.getElementById(gridId);

  // Limpar cards estáticos
  containerGrid.innerHTML = "";

  // Carregar livros do banco
  const livros = await carregarLivros();

  if (livros.length === 0) {
    containerGrid.innerHTML = "<p>Nenhum livro disponível</p>";
    return;
  }

  // Criar cards com dados do banco
  livros.forEach((livro, index) => {
    const card = document.createElement("div");
    card.className = "book-card" + (index === 0 ? " active" : "");

    card.innerHTML = `
            <div class="book-cover">
                <img src="${livro.caminho_capa}" alt="${livro.titulo}">
            </div>
            <div class="book-info">
                <div class="book-title">${livro.titulo}</div>
                <div class="book-author">${livro.autor}</div>
            </div>
        `;

    containerGrid.appendChild(card);
  });

  const cards = document.querySelectorAll(`#${gridId} .book-card`);
  let index = 0;

  function atualizar() {
    cards.forEach((c) => c.classList.remove("active"));
    cards[index].classList.add("active");

    // Faz scroll horizontal até o card ativo
    const cardAtivo = cards[index];
    const containerGrid = document.getElementById(gridId);
    const cardPosition = cardAtivo.offsetLeft;
    const containerWidth = containerGrid.offsetWidth;
    const cardWidth = cardAtivo.offsetWidth;

    containerGrid.scrollLeft =
      cardPosition - containerWidth / 2 + cardWidth / 2;
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
