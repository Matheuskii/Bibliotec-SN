import { db } from "../config/db.js";
// Assumindo que o gerarToken está sendo importado de um local correto, como '../utils/auth.js' ou '../middlewares/auth.js'
import { gerarToken } from "../middlewares/auth.js";

// ============================
// Listar todos os usuários
// ============================
export async function listarUsuario(req, res) {
  try {
    const [rows] = await db.execute("SELECT id, nome, email, data_nascimento, celular, curso, perfil FROM usuarios");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}

// ============================
// Obter usuário pelo ID
// ============================
export async function obterUsuario(req, res) {
  // É uma boa prática de segurança garantir que o usuário logado
  // está buscando seus próprios dados ou é um Admin. (Lógica de Autorização)
  try {
    const [rows] = await db.execute(
      "SELECT id, nome, email, data_nascimento, celular, curso, perfil FROM usuarios WHERE id = ?",
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
// Atualizar usuário (por ID) - CORRIGIDO
// ============================
export async function atualizarUsuario(req, res) {
  try {
    // Aceita 'nome' ou 'nome_completo'
    const { nome, nome_completo, email, senha } = req.body;
    const nomeFinal = nome || nome_completo;

    if (!nomeFinal || !email)
      return res.status(400).json({ erro: "Nome e Email são obrigatórios" });

    if (senha) {
      await db.execute(
        "UPDATE usuarios SET nome = ?, email = ?, senha = ? WHERE id = ?",
        [nomeFinal, email, senha, req.params.id]
      );
    } else {
      await db.execute(
        "UPDATE usuarios SET nome = ?, email = ? WHERE id = ?",
        [nomeFinal, email, req.params.id]
      );
    }

    // 1. Busca os dados atualizados para gerar o novo token
    const [rows] = await db.execute(
      "SELECT id, nome, email, data_nascimento, celular, curso, perfil FROM usuarios WHERE id = ?",
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ erro: "Usuário não encontrado para gerar novo token." });
    }
    const usuarioAtualizado = rows[0];

    // 2. Gera o novo token
    const novoToken = gerarToken(usuarioAtualizado);

    res.json({
      mensagem: "Usuário atualizado com sucesso!",
      token: novoToken,
      usuario: usuarioAtualizado
    });

    res.json({
        mensagem: "Usuário atualizado com sucesso!",
        token: novoToken,
        usuario: usuarioAtualizado
    });

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
// Criar usuário (Cadastro) - CORRIGIDO
// ============================
export async function criarUsuario(req, res) {
  try {
    // ... (demais validações)


    const { nome, nome_completo, email, senha, data_nascimento, celular, curso, perfil } = req.body;
    const nomeFinal = nome || nome_completo;

    const perfilseguro = 'Aluno';

    await db.execute(
      "INSERT INTO usuarios (nome, email, senha, data_nascimento, celular, curso, perfil) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [nomeFinal, email, senha, data_nascimento, celular, curso, perfilseguro]
    );

    // Removeu a sintaxe errada e a lógica de token (que não deve estar aqui)
    res.status(201).json({ mensagem: "Usuário criado com sucesso!" });

  } catch (err) {
    // Erro de duplicidade (email já existe)
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ erro: "Este email já está cadastrado." });
    }
    res.status(500).json({ erro: err.message });
  }
}

// ============================
// Recuperar senha
// ============================
export async function recuperarSenha(req, res) {
  // ... (lógica de recuperação)
  try {
    const { usuario, email, novaSenha } = req.body;
    const identificador = usuario || email;

    const [rows] = await db.execute(
      "SELECT id FROM usuarios WHERE nome = ? OR email = ?",
      [identificador, identificador]
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
// Login
// ============================
export async function loginUsuario(req, res) {
  try {
    const { usuario, email, senha } = req.body;
    const identificador = email || usuario;

    // Lembrete CRÍTICO: Este SELECT é o que deve ser reescrito
    // para buscar a senha HASH e compará-la em JavaScript (com BCrypt).
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

    const usuarioLogado = rows[0];

    delete usuarioLogado.senha;

    const token = gerarToken(usuarioLogado); // OK: Gera o token

    res.status(200).json({
      sucesso: true,
      mensagem: "Login bem-sucedido!",
      usuario: usuarioLogado,
      token: token // OK: Retorna o token
    });

    res.status(200).json({
      sucesso: true,
      mensagem: "Login bem-sucedido!",
      usuario: usuarioLogado ,
      token: token // OK: Retorna o token
    });

  } catch (err) {
    res.status(500).json({
      mensagem: "Erro ao processar o login.",
      erro: err.message
    });
  }
}