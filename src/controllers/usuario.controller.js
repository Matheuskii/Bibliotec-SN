import { db } from "../config/db.js";

// ============================
// Listar todos os usuários
// ============================
export async function listarUsuario(req, res) {
  try {
    // Retornamos tudo, mas em um sistema real esconderíamos a senha
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
// Atualizar usuário (por ID)
// ============================
export async function atualizarUsuario(req, res) {
  try {
    // Aceita 'nome' ou 'nome_completo' para evitar confusão
    const { nome, nome_completo, email, senha } = req.body;
    const nomeFinal = nome || nome_completo;

    if (!nomeFinal || !email)
      return res.status(400).json({ erro: "Nome e Email são obrigatórios" });

    // Se tiver senha, atualiza. Se não, mantém a antiga (lógica melhorada)
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
// Criar usuário (Cadastro)
// ============================
export async function criarUsuario(req, res) {
  try {
    // Padronizei para receber 'nome' ou 'nome_completo'
    // O 'perfil' é opcional. Se não vier, o banco define como 'Aluno' (Default)
    const { nome, nome_completo, email, senha, data_nascimento, celular, curso, perfil } = req.body;
    
    const nomeFinal = nome || nome_completo;

    if (!nomeFinal || !email || !senha || !data_nascimento || !celular || !curso)
      return res.status(400).json({ erro: "Todos os campos são obrigatórios" });

    // Validações básicas
    if ((celular.length < 10 || celular.length > 15) || !/^\d+$/.test(celular)) {
      return res.status(400).json({ erro: "Número de celular inválido (apenas números)" });
    }
    if (senha.length < 4) {
      return res.status(400).json({ erro: "A senha é muito curta" });
    }
    
    // Insere no banco (incluindo o perfil se for passado, útil pro Admin criar Admins)
    // Se perfil for undefined, o MySQL usa o DEFAULT 'Aluno'
    await db.execute(
      "INSERT INTO usuarios (nome, email, senha, data_nascimento, celular, curso, perfil) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [nomeFinal, email, senha, data_nascimento, celular, curso, perfil || 'Aluno']
    );

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
  try {
    const { usuario, email, novaSenha } = req.body;
    const identificador = usuario || email; // Aceita um ou outro

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
    
    // O front pode mandar { usuario: "..." } ou { email: "..." }
    // Vamos garantir que pegamos o identificador correto
    const identificador = email || usuario;

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

    // [SEGURANÇA] Remove a senha antes de mandar pro front
    delete usuarioLogado.senha; 

    res.status(200).json({
      sucesso: true,
      mensagem: "Login bem-sucedido!",
      usuario: usuarioLogado // Aqui vai o ID, Nome e PERFIL ('Admin' ou 'Aluno')
    });

  } catch (err) {
    res.status(500).json({
      mensagem: "Erro ao processar o login.",
      erro: err.message
    });
  }
}