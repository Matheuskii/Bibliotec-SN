import { db } from "../config/db.js";

// ============================
// Listar todos os usuários
// ============================
export async function listarUsuario(req, res) {
  try {
    const [rows] = await db.execute("SELECT * FROM usuarios");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}

// ============================
// Obter usuário pelo ID
// ============================
export async function obterUsuario(req, res) {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM usuarios WHERE id = ?",
      [req.params.id]
    );

    if (rows.length === 0)
      return res.status(404).json({ erro: "Usuário não encontrado" });

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}

// ============================
// Atualizar usuário (por ID)
// ============================
export async function atualizarUsuario(req, res) {
  try {
    const { nome, email, senha } = req.body;
    if (!nome || !email || !senha)
      return res.status(400).json({ erro: "Nome, Email e Senha são obrigatórios" });

    await db.execute(
      "UPDATE usuarios SET nome = ?, email = ?, senha = ? WHERE id = ?",
      [nome, email, senha, req.params.id]
    );

    res.json({ mensagem: "Usuário atualizado com sucesso!" });

  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}

// ============================
// Deletar usuário
// ============================
export async function deletarUsuario(req, res) {
  try {
    await db.execute("DELETE FROM usuarios WHERE id = ?", [req.params.id]);
    res.json({ mensagem: "Usuário deletado com sucesso!" });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}

// ============================
// Criar usuário (aceita usuário OU email)
// ============================
export async function criarUsuario(req, res) {
  try {
    const { nome_completo, email, senha, data_nascimento, celular, curso } = req.body;

    if (!nome_completo || !email || !senha || !data_nascimento || !celular || !curso)
      return res.status(400).json({ erro: "Algum dos campos não foram preenchidos" });

    if ((celular.length < 10 || celular.length > 11) || !/^\d+$/.test(celular)) {
      return res.status(400).json({ erro: "Número de celular inválido" });
    }
    if (senha.length < 6) {
      return res.status(400).json({ erro: "A senha deve ter pelo menos 6 caracteres" });
    }
    
    await db.execute(
      "INSERT INTO usuarios (nome, email, senha, data_nascimento, celular, curso) VALUES (?, ?, ?, ?, ? , ?)",
      [nome_completo, email, senha, data_nascimento, celular, curso]
    );

    res.status(201).json({ mensagem: "Usuário criado com sucesso!" });

  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}

// ============================
// Recuperar senha (usuario OU email)
// ============================
export async function recuperarSenha(req, res) {
  try {
    const { usuario, email, novaSenha } = req.body;


    const [rows] = await db.execute(
      "SELECT * FROM usuarios WHERE nome = ? OR email = ?",
      [usuario, email]
    );

    if (rows.length === 0)
      return res.status(404).json({ message: "Usuário não encontrado." });

    await db.execute(
      "UPDATE usuarios SET senha = ? WHERE id = ?",
      [novaSenha, rows[0].id]
    );

    res.status(201).json({ message: "Senha atualizada com sucesso." });

  } catch (err) {
    res.status(500).json({ message: "Erro ao atualizar a senha." });
  }
}

// ============================
// Login (usuario OU email)
// ============================
export async function loginUsuario(req, res) {
  try {
    const { usuario, email, senha } = req.body;

    const identificador = usuario || email;

    const [rows] = await db.execute(
      "SELECT * FROM usuarios WHERE (nome = ? OR email = ?) AND senha = ?",
      [identificador, identificador, senha]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        sucesso: false,
        mensagem: "Credenciais inválidas."
      });
    }

    res.status(200).json({
      sucesso: true,
      mensagem: "Login bem-sucedido!",
      usuario: rows[0]
    });

  } catch (err) {
    res.status(500).json({
      mensagem: "Erro ao processar o login.",
      erro: err.message
    });
  }
}
