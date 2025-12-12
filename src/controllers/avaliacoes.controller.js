import { db } from "../config/db.js";

// ============================
// POSTAR AVALIAÇÃO (Corrigido)
// ============================
export async function postarAvaliacoes(req, res) {
  try {
    const { usuario_id, livro_id, nota, comentario } = req.body;

    if (!usuario_id || !livro_id || !nota) {
      return res.status(400).json({ erro: "Campos obrigatórios (usuario, livro, nota)" });
    }

    // CORREÇÃO: Eram 5 interrogações, agora são 4 para bater com as 4 variáveis
    await db.execute(
      "INSERT INTO avaliacoes (usuario_id, livro_id, nota, comentario) VALUES (?, ?, ?, ?)",
      [usuario_id, livro_id, nota, comentario]
    );

    res.json({ mensagem: "Avaliação postada com sucesso!" });
  } catch (err) {
    console.error("Erro ao postar avaliação:", err);
    res.status(500).json({ erro: err.message });
  }
}

// ============================
// LISTAR AVALIAÇÕES DE UM LIVRO
// ============================
export async function listarAvaliacoesPorLivro(req, res) {
    try {
        const { id } = req.params; // ID do Livro

        // 1. Busca os comentários com o nome do usuário
        const [comentarios] = await db.execute(`
            SELECT
                a.id, a.nota, a.comentario, a.data_avaliacao,
                u.nome as usuario_nome
            FROM avaliacoes a
            JOIN usuarios u ON a.usuario_id = u.id
            WHERE a.livro_id = ?
            ORDER BY a.data_avaliacao DESC
        `, [id]);

        // 2. Calcula a média e o total
        const [stats] = await db.execute(`
            SELECT AVG(nota) as media, COUNT(*) as total
            FROM avaliacoes
            WHERE livro_id = ?
        `, [id]);

        // Retorna no formato que o Frontend espera
        res.json({
            media: stats[0].media || 0,
            total_avaliacoes: stats[0].total || 0,
            comentarios: comentarios
        });

    } catch (err) {
        console.error("Erro ao listar avaliações:", err);
        res.status(500).json({ erro: err.message });
    }
}