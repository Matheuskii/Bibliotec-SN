import { db } from "../config/db.js";

// =========================================================
// LISTAR TODOS OS FAVORITOS (GERAL / ADMIN)
// =========================================================
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
                l.titulo as livro_titulo,
                l.autor as livro_autor,
                l.caminho_capa,
                l.isbn as livro_isbn
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
        console.error('Erro ao listar favoritos:', erro);
        return res.status(500).json({ erro: erro.message });
    }
}

// =========================================================
// CRIAR FAVORITO
// =========================================================
export async function criarFavoritos(req, res) {
    try {
        const { usuario_id, livro_id} = req.body;

        if (!usuario_id || !livro_id) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Campos obrigatórios: usuario, livro'
            });
        }

        // Verifica Usuário
        const [usuarios] = await db.execute('SELECT id FROM usuarios WHERE id = ?', [usuario_id]);
        if (usuarios.length === 0) return res.status(404).json({ sucesso: false, mensagem: 'Usuário não encontrado' });

        // Verifica Livro
        const [livros] = await db.execute('SELECT id FROM livros WHERE id = ?', [livro_id]);
        if (livros.length === 0) return res.status(404).json({ sucesso: false, mensagem: 'Livro não encontrado' });

        // Verifica Duplicidade
        const [favoritoExistente] = await db.execute(
            'SELECT id FROM favoritos WHERE usuario_id = ? AND livro_id = ?',
            [usuario_id, livro_id]
        );
        if (favoritoExistente.length > 0) {
            return res.status(409).json({
                sucesso: false,
                mensagem: 'Este livro já está nos Favoritos do usuário'
            });
        }

        // Insere
        const query = `INSERT INTO favoritos (usuario_id, livro_id, data_favoritado) VALUES (?, ?, NOW())`;
        const [resultado] = await db.execute(query, [usuario_id, livro_id]);

        // Retorna o criado
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
            mensagem: 'Livro adicionado aos Favoritos com sucesso',
            dados: favoritoCriado[0]
        });

    } catch (erro) {
        console.error('Erro ao criar favorito:', erro);
        return res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao adicionar livro aos Favoritos',
            erro: erro.message
        });
    }
}

// =========================================================
// DELETAR FAVORITO (POR ID DO FAVORITO)
// =========================================================
export async function deletarFavorito (req, res){
    try {
        const id_favorito = req.params.id;
        const [resultado] = await db.execute("DELETE FROM favoritos WHERE id = ?", [id_favorito]);

        if (resultado.affectedRows === 0) {
             return res.status(404).json({ mensagem: "Registro de favorito não encontrado." });
        }

        return res.status(200).json({ mensagem: "Livro removido dos Favoritos com sucesso!" });
    } catch (err) {
        console.error('Erro ao deletar favorito:', err);
        return res.status(500).json({ erro: err.message });
    }
}

// =========================================================
// DELETAR TUDO POR USUÁRIO
// =========================================================
export async function deletarFavoritosPorUsuario(req, res) {
    try {
        const usuarioId = req.params.usuario_id;
        console.log('Deletando todos os favoritos para o usuário com ID:', usuarioId);
        const [resultado] = await db.execute("DELETE FROM favoritos WHERE usuario_id = ?", [usuarioId]);
        return res.status(200).json({ mensagem: "Todos os favoritos do usuário foram removidos com sucesso!" });
    } catch (err) {
        console.error('Erro ao deletar favoritos do usuário:', err);
        return res.status(500).json({ erro: err.message });
    }
}

// =========================================================
// LISTAR FAVORITOS DE UM USUÁRIO (USADO NO FRONTEND)
// =========================================================
export async function listarFavoritosPorUsuario(req, res) {
    try {
        console.log('Listando favoritos para o usuário com ID:', req.params.id);
        const usuarioId = req.params.id;
        
        // CORREÇÃO AQUI: Adicionado f.id e l.caminho_capa
        const sql = `
            SELECT
                f.id,               -- OBRIGATÓRIO PARA PODER DELETAR
                f.usuario_id,
                f.livro_id,
                f.data_favoritado,
                l.titulo as livro_titulo,
                l.autor as livro_autor,
                l.caminho_capa,     -- OBRIGATÓRIO PARA MOSTRAR A FOTO
                l.isbn as livro_isbn,
                l.ano_publicacao as livro_ano_publicacao,
                l.ativo as livro_disponivel_ou_ativo
            FROM favoritos f
            LEFT JOIN livros l ON f.livro_id = l.id
            WHERE f.usuario_id = ?
        `;
        const [favoritos] = await db.execute(sql, [usuarioId]);
        return res.status(200).json(favoritos);
    }
    catch (erro) {
        console.error('Erro ao listar favoritos por usuário:', erro);
        return res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao listar favoritos por usuário',
            erro: erro.message
        });
    }
}