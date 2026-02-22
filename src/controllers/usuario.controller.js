import { db } from "../config/db.js";
import { enviarEmailVerificacao } from "../services/email.services.js";
import { gerarToken } from "../middlewares/auth.js";
import bcrypt from 'bcrypt';

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
    const { nome, nome_completo, email, senha } = req.body;
    const nomeFinal = nome || nome_completo;

    if (!nomeFinal || !email) return res.status(400).json({ erro: "Nome e Email são obrigatórios" });

    if (senha) {
      // NUNCA esqueça do hash ao atualizar a senha
      const novaSenhaHash = await bcrypt.hash(senha, 12);
      await db.execute(
        "UPDATE usuarios SET nome = ?, email = ?, senha = ? WHERE id = ?",
        [nomeFinal, email, novaSenhaHash, req.params.id]
      );
    } else {
      await db.execute(
        "UPDATE usuarios SET nome = ?, email = ? WHERE id = ?",
        [nomeFinal, email, req.params.id]
      );
    }

    const [rows] = await db.execute(
      "SELECT id, nome, email, data_nascimento, celular, curso, perfil FROM usuarios WHERE id = ?",
      [req.params.id]
    );

    const usuarioAtualizado = rows[0];
    const novoToken = gerarToken(usuarioAtualizado);

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
    const { nome, nome_completo, email, senha, data_nascimento, celular, curso } = req.body;
    const nomeFinal = nome || nome_completo;

    if (!nomeFinal || !email || !senha) return res.status(400).json({ erro: "Dados incompletos" });

    // Hash da senha DEPOIS de extraí-la do body
    const senhaHash = await bcrypt.hash(senha, 12);
    
    const codigo = Math.floor(100000 + Math.random() * 900000).toString();
    const perfilSeguro = 'Aluno';

    await db.execute(
      "INSERT INTO usuarios (nome, email, senha, data_nascimento, celular, curso, perfil, codigo_verificacao, verificado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)",
      [nomeFinal, email, senhaHash, data_nascimento, celular, curso, perfilSeguro, codigo]
    );

    await enviarEmailVerificacao(email, codigo);

    res.status(201).json({
        sucesso: true,
        mensagem: "Usuário criado! Verifique seu e-mail.",
        email: email
    });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ erro: "E-mail já cadastrado." });
    res.status(500).json({ erro: err.message });
  }
}

export async function verificarCodigo(req, res) {
    try {
        const { email, codigo } = req.body;

        const [rows] = await db.execute(
            "SELECT id FROM usuarios WHERE email = ? AND codigo_verificacao = ?",
            [email, codigo]
        );

        if (rows.length === 0) {
            return res.status(400).json({ sucesso: false, mensagem: "Código inválido ou e-mail incorreto." });
        }

        // Se achou, marca como verificado e limpa o código
        await db.execute(
            "UPDATE usuarios SET verificado = 1, codigo_verificacao = NULL WHERE email = ?",
            [email]
        );

        res.json({ sucesso: true, mensagem: "Conta verificada com sucesso! Faça login." });

    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
}
// ============================
// Recuperar senha
// ============================
export async function recuperarSenha(req, res) {
  try {
    const { usuario, email, novaSenha } = req.body;
    const identificador = usuario || email;

    const [rows] = await db.execute(
      "SELECT id FROM usuarios WHERE nome = ? OR email = ?",
      [identificador, identificador]
    );

    if (rows.length === 0) return res.status(404).json({ message: "Usuário não encontrado." });

    // Criptografar a nova senha
    const novaSenhaHash = await bcrypt.hash(novaSenha, 12);

    await db.execute(
      "UPDATE usuarios SET senha = ? WHERE id = ?",
      [novaSenhaHash, rows[0].id]
    );

    res.status(200).json({ message: "Senha atualizada com sucesso." });
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

    const [rows] = await db.execute(
      "SELECT * FROM usuarios WHERE nome = ? OR email = ?",
      [identificador, identificador]
    );

    if (rows.length === 0) {
        return res.status(401).json({ sucesso: false, mensagem: "Credenciais inválidas." });
    }

    const usuarioLogado = rows[0];

    const senhaCorreta = await bcrypt.compare(senha, usuarioLogado.senha);
    if (!senhaCorreta) {
        return res.status(401).json({ sucesso: false, mensagem: "Credenciais inválidas." });
    }

    if (usuarioLogado.verificado === 0) {
      return res.status(403).json({
        sucesso: false,
        mensagem: "Conta não verificada! Verifique seu e-mail."
      });
    }

    delete usuarioLogado.senha;
    const token = gerarToken(usuarioLogado);

    res.status(200).json({
      sucesso: true,
      usuario: usuarioLogado,
      token: token
    });
  } catch (err) {
    res.status(500).json({ mensagem: "Erro interno.", erro: err.message });
  }
}