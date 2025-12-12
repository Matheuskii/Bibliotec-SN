import {db} from "../config/db.js";

// ============================
//  Rotas CRUD
// ============================

export async function listarAvaliacoesPorLivro(req, res) {
    try {
        const livroId = req.params.livro_id;

        // 1. Busca os comentários detalhados
        const queryComentarios = `
            SELECT a.*, u.nome as usuario_nome
            FROM avaliacoes a
            JOIN usuarios u ON a.usuario_id = u.id
            WHERE a.livro_id = ?
            ORDER BY a.data_avaliacao DESC
        `;
        const [comentarios] = await db.execute(queryComentarios, [livroId]);

        // 2. Calcula a média usando SQL (MUITO mais eficiente)
        const queryMedia = `
            SELECT AVG(nota) as media, COUNT(id) as total
            FROM avaliacoes
            WHERE livro_id = ?
        `;
        const [dadosMedia] = await db.execute(queryMedia, [livroId]);

        // Retorna tudo num objeto só
        res.json({
            media: dadosMedia[0].media || 0, // Se for null, retorna 0
            total_avaliacoes: dadosMedia[0].total,
            comentarios: comentarios
        });

    } catch (err) {
        console.error("Erro ao buscar avaliações:", err);
        res.status(500).json({ erro: err.message });
    }
}

export async function postarAvaliacoes(req, res) {
  try {
    const { usuario_id, livro_id, nota, comentario } = req.body;

    if (!usuario_id || !livro_id || !nota ) {
      return res.status(400).json({ erro: "Campos obrigatórios" });
    }

    await db.execute(
      "INSERT INTO avaliacoes (usuario_id, livro_id, nota, comentario) VALUES (?, ?, ?, ?, ?)",
      [usuario_id, livro_id, nota, comentario]
    );

    res.json({ mensagem: "Avaliação postada com sucesso!" });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}