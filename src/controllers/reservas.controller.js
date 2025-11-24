import {db} from "../config/db.js";

export async function listarReservas(req, res) {
    try {
        try {
            // Query SQL para listar todas as reservas com informações relacionadas
            const query = `
                SELECT
                    r.id,
                    r.usuario_id,
                    r.livro_id,
                    r.data_retirada,
                    r.data_devolucao,
                    r.confirmado_email,
                    r.criado_em,
                    u.nome as usuario_nome,
                    u.email as usuario_email,
                    l.titulo as livro_titulo,
                    l.autor as livro_autor
                FROM reservas r
                LEFT JOIN usuarios u ON r.usuario_id = u.id
                LEFT JOIN livros l ON r.livro_id = l.id
                ORDER BY r.criado_em DESC
            `;

            const [reservas] = await db.execute(query);

            // Retornar sucesso com a lista de reservas
            return res.status(200).json({
                sucesso: true,
                mensagem: 'Reservas listadas com sucesso',
                total: reservas.length,
                dados: reservas
            });

        } finally {
            // Liberar a conexão
            db.release();
        }

    } catch (erro) {
        console.error('Erro ao listar reservas:', erro);
        return res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao listar reservas',
            erro: erro.message
        });
    }
}

//insere uma nova reserva no banco
export async function criarReserva(req, res) {
    try {
        // Extrair dados do corpo da requisição
        const { usuario_id, livro_id, data_retirada, data_devolucao } = req.body;

        // Validação dos campos obrigatórios
        if (!usuario_id || !livro_id || !data_retirada || !data_devolucao) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Campos obrigatórios: usuario_id, livro_id, data_retirada, data_devolucao'
            });
        }

        // Validar se a data de devolução é posterior à data de retirada
        if (new Date(data_devolucao) <= new Date(data_retirada)) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'A data de devolução deve ser posterior à data de retirada'
            });
        }

        try {
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

            const [reservasConflitantes] = await db.execute(
                `SELECT id FROM reservas
                 WHERE livro_id = ?
                 AND (
                     (data_retirada <= ? AND data_devolucao >= ?) OR
                     (data_retirada <= ? AND data_devolucao >= ?) OR
                     (data_retirada >= ? AND data_devolucao <= ?)
                 )`,
                [
                    livro_id,
                    data_devolucao, data_retirada,
                    data_retirada, data_retirada,
                    data_retirada, data_devolucao
                ]
            );

            if (reservasConflitantes.length > 0) {
                return res.status(409).json({
                    sucesso: false,
                    mensagem: 'Já existe uma reserva para este livro no período solicitado'
                });
            }

            const query = `
                INSERT INTO reservas
                (usuario_id, livro_id, data_retirada, data_devolucao, confirmado_email, criado_em)
                VALUES (?, ?, ?, ?, false, NOW())
            `;

            const [resultado] = await db.execute(query, [
                usuario_id,
                livro_id,
                data_retirada,
                data_devolucao
            ]);

            const [reservaCriada] = await db.execute(
                `SELECT
                    r.id,
                    r.usuario_id,
                    r.livro_id,
                    r.data_retirada,
                    r.data_devolucao,
                    r.confirmado_email,
                    r.criado_em,
                    u.nome as usuario_nome,
                    u.email as usuario_email,
                    l.titulo as livro_titulo,
                    l.autor as livro_autor
                FROM reservas r
                LEFT JOIN usuarios u ON r.usuario_id = u.id
                LEFT JOIN livros l ON r.livro_id = l.id
                WHERE r.id = ?`,
                [resultado.insertId]
            );

            return res.status(201).json({
                sucesso: true,
                mensagem: 'Reserva criada com sucesso',
                dados: reservaCriada[0]
            });

        } finally {
            db.release();
        }

    } catch (erro) {
        console.error('Erro ao criar reserva:', erro);
        return res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao criar reserva',
            erro: erro.message
        });
    }
}

export async function excluirReserva (req, res){
    try {
    await db.execute("DELETE FROM reservas WHERE id = ?", [req.params.id]);
    res.json({ mensagem: "Reserva deletada com sucesso!" });
    } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}