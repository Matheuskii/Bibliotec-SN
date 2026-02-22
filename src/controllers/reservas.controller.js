import { db } from "../config/db.js";

// ============================
// LISTAR TODAS AS RESERVAS (ADMIN)
// ============================
// reservas.controller.js — listarReservas
export async function listarReservas(req, res) {
    const { id, perfil } = req.usuario; // vem do token JWT

    let query = `SELECT r.*, u.nome as usuario_nome, l.titulo as livro_titulo
                 FROM reservas r
                 LEFT JOIN usuarios u ON r.usuario_id = u.id
                 LEFT JOIN livros l ON r.livro_id = l.id`;
    
    const params = [];

    // Aluno só vê as próprias reservas; Admin vê todas
    if (perfil !== 'Admin') {
        query += ` WHERE r.usuario_id = ?`;
        params.push(id);
    }

    query += ` ORDER BY r.criado_em DESC`;
    const [reservas] = await db.execute(query, params);
    return res.status(200).json({ sucesso: true, dados: reservas });
}

// ============================
// CRIAR NOVA RESERVA
// ============================
export async function criarReserva(req, res) {
    try {
        const { usuario_id, livro_id, data_retirada, data_devolucao } = req.body;

        // 1. Validação de Campos
        if (!usuario_id || !livro_id || !data_retirada || !data_devolucao) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Campos obrigatórios: usuario_id, livro_id, data_retirada, data_devolucao'
            });
        }

        // 2. Validação de Datas
        const retirada = new Date(data_retirada);
        const devolucao = new Date(data_devolucao);

        if (devolucao <= retirada) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'A data de devolução deve ser posterior à data de retirada'
            });
        }

        // 3. Verifica existência (Usuário e Livro)
        const [usuarios] = await db.execute('SELECT id FROM usuarios WHERE id = ?', [usuario_id]);
        if (usuarios.length === 0) return res.status(404).json({ sucesso: false, mensagem: 'Usuário não encontrado' });

        const [livros] = await db.execute('SELECT id FROM livros WHERE id = ?', [livro_id]);
        if (livros.length === 0) return res.status(404).json({ sucesso: false, mensagem: 'Livro não encontrado' });

        // 4. Verifica Conflito de Agenda (Lógica Simplificada)
        // Regra: (InícioA < FimB) E (FimA > InícioB)
        const queryConflito = `
            SELECT id, data_retirada, data_devolucao
            FROM reservas
            WHERE livro_id = ?
            AND data_retirada < ?
            AND data_devolucao > ?
        `;

        const [reservasConflitantes] = await db.execute(queryConflito, [
            livro_id,
            data_devolucao, // Fim da NOVA reserva
            data_retirada   // Início da NOVA reserva
        ]);

        if (reservasConflitantes.length > 0) {
            const conflito = reservasConflitantes[0];
            return res.status(409).json({
                sucesso: false,
                mensagem: `Livro indisponível! Já reservado de ${new Date(conflito.data_retirada).toLocaleDateString()} até ${new Date(conflito.data_devolucao).toLocaleDateString()}`
            });
        }

        // 5. Inserir Reserva
        const queryInsert = `
            INSERT INTO reservas
            (usuario_id, livro_id, data_retirada, data_devolucao, confirmado_email, criado_em)
            VALUES (?, ?, ?, ?, false, NOW())
        `;

        const [resultado] = await db.execute(queryInsert, [
            usuario_id,
            livro_id,
            data_retirada,
            data_devolucao
        ]);

        // 6. Retornar Dados Completos (opcional, mas bom para o frontend)
        const [reservaCriada] = await db.execute(
            `SELECT
                r.id, r.usuario_id, r.livro_id, r.data_retirada, r.data_devolucao, r.confirmado_email, r.criado_em,
                u.nome as usuario_nome, u.email as usuario_email,
                l.titulo as livro_titulo, l.autor as livro_autor
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

    } catch (erro) {
        console.error('Erro ao criar reserva:', erro);
        if (!res.headersSent) {
            return res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao criar reserva',
                erro: erro.message
            });
        }
    }
}

// ============================
// EXCLUIR RESERVA
// ============================
export async function excluirReserva(req, res) {
    try {
        await db.execute("DELETE FROM reservas WHERE id = ?", [req.params.id]);
        res.json({ mensagem: "Reserva deletada com sucesso!" });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
}

// ============================
// LISTAR RESERVAS POR USUÁRIO
// ============================
export async function listarReservasPorUsuario(req, res) {
    try {
        const usuarioId = req.params.usuario_id;

        const query = `
            SELECT
                r.id as reserva_id,
                r.data_retirada,
                r.data_devolucao,
                r.confirmado_email,
                l.id as livro_id,
                l.titulo,
                l.autor,
                l.caminho_capa
            FROM reservas r
            INNER JOIN livros l ON r.livro_id = l.id
            WHERE r.usuario_id = ?
            ORDER BY r.data_retirada DESC
        `;

        const [reservas] = await db.execute(query, [usuarioId]);
        res.json(reservas);

    } catch (erro) {
        console.error('Erro ao buscar reservas do usuário:', erro);
        res.status(500).json({ erro: erro.message });
    }
}


export async function confirmarReserva(req, res) {
    try {
        const id = req.params.id;

        // Atualiza o campo 'confirmado_email' para 1 (True)
        // (Ou se você tiver um campo 'status', mude para 'Ativo')
        await db.execute(
            "UPDATE reservas SET confirmado_email = 1 WHERE id = ?",
            [id]
        );

        res.json({ mensagem: "Reserva confirmada com sucesso!" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: err.message });
    }
}