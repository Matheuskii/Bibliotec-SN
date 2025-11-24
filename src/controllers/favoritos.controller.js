import { db } from "../config/db.js";

export async function listarFavoritos(req, res) {
    try {
        const usuarioId = req.params.usuario_id;
        let sql = `
            SELECT
                f.id,
                f.usuario_id,
                f.livro_id,
                f.data_favoritado,
                u.nome as usuario_nome,
                u.email as usuario_email,
                l.titulo as livro_titulo,
                l.autor as livro_autor,
                l.isbn as livro_isbn,
                l.ano_publicacao as livro_ano_publicacao,
                l.ativo as livro_disponivel_ou_ativo
            FROM favoritos f
            LEFT JOIN usuarios u ON f.usuario_id = u.id
            LEFT JOIN livros l ON f.livro_id = l.id
        `;
        const params = [];
        if (usuarioId) {
            sql += ` WHERE f.usuario_id = ?`;
            params.push(usuarioId);
        }
        const [favoritos] = await db.execute(sql, params);
        return res.status(200).json(favoritos);
    } catch (erro) {
        console.error('Erro ao listar livros favoritos:', erro);
        return res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao listar livros favoritos',
            erro: erro.message
        });
    }
}

// ---

export async function criarFavoritos(req, res) {
    try {
        const { usuario_id, livro_id} = req.body;

        if (!usuario_id || !livro_id) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Campos obrigatórios: usuario, livro'
            });
        }

        const [usuarios] = await db.execute(
            'SELECT id FROM usuarios WHERE id = ?',
            [usuario_id]
        );
        if (usuarios.length === 0) {
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Usuário não encontrado'
            });
        }

        const [livros] = await db.execute(
            'SELECT id FROM livros WHERE id = ?',
            [livro_id]
        );
        if (livros.length === 0) {
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Livro não encontrado'
            });
        }

        const [favoritoExistente] = await db.execute(
            'SELECT id FROM favoritos WHERE usuario_id = ? AND livro_id = ?',
            [usuario_id, livro_id]
        );
        if (favoritoExistente.length > 0) {
            return res.status(409).json({
                sucesso: false,
                mensagem: 'Este livro já está nos favoritos do usuário'
            });
        }

        const query = `
            INSERT INTO favoritos
            (usuario_id, livro_id, data_favoritado)
            VALUES (?, ?, NOW())
        `;
        const [resultado] = await db.execute(query, [usuario_id, livro_id]);

        const [favoritoCriado] = await db.execute(
            `SELECT
                f.id,
                f.usuario_id,
                f.livro_id,
                f.data_favoritado,
                u.nome as usuario_nome,
                u.email as usuario_email,
                l.titulo as livro_titulo,
                l.autor as livro_autor,
                l.isbn as livro_isbn,
                l.ano_publicacao as livro_ano_publicacao,
                l.ativo as livro_disponivel_ou_ativo
            FROM favoritos f
            LEFT JOIN usuarios u ON f.usuario_id = u.id
            LEFT JOIN livros l ON f.livro_id = l.id
            WHERE f.id = ?`,
            [resultado.insertId]
        );

        return res.status(201).json({
            sucesso: true,
            mensagem: 'Livro adicionado aos favoritos com sucesso',
            dados: favoritoCriado[0]
        });

    } catch (erro) {
        console.error('Erro ao criar favorito:', erro);
        return res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao adicionar livro aos favoritos',
            erro: erro.message
        });
    }
}

// ---

export async function deletarFavorito (req, res){
    try {
        const id_favorito = req.params.id;
        const [resultado] = await db.execute("DELETE FROM favoritos WHERE id = ?", [id_favorito]);

        if (resultado.affectedRows === 0) {
             return res.status(404).json({ mensagem: "Registro de favorito não encontrado." });
        }

        return res.status(200).json({ mensagem: "Livro removido dos favoritos com sucesso!" });
    } catch (err) {
        console.error('Erro ao deletar favorito:', err);
        return res.status(500).json({ erro: err.message });
    }
}