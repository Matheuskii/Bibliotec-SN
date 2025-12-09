import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
// ⚠️ IMPORTANTE: Sempre use variáveis de ambiente (process.env)
const JWT_SECRET = process.env.JWT_SECRET_KEY || 'sua_chave_secreta_aqui';
const JWT_EXPIRATION = '24h'; // Usado apenas na GERAÇÃO do token


export function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        // 401 Unauthorized (Não Autorizado)
        return res.status(401).json({ erro: "Acesso negado. Token não fornecido ou formato inválido." });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decodificado = jwt.verify(token, JWT_SECRET);

        req.usuario = decodificado;

        next();
    } catch (err) {
        // 403 Forbidden (Proibido): Token inválido, expirado, ou assinatura errada.
        return res.status(403).json({ erro: "Token inválido ou expirado." });
    }
}

// -------------------------------------------------------------------

/**
 * 🔒 Middleware de Autorização
 * Verifica se o usuário logado (anexado por authMiddleware) tem perfil 'Admin'.
 */
export function apenasAdmin(req, res, next) {
    // Verifica se os dados do usuário existem E se o perfil é 'Admin'
    if (req.usuario && req.usuario.perfil === 'Admin') {
        next();
    } else {
        // 403 Forbidden (Proibido)
        res.status(403).json({ erro: "Acesso negado. Requer perfil de Administrador." });
    }
}

// -------------------------------------------------------------------

/**
 * ⚙️ Função para Gerar um Novo Token
 * Recebe o objeto do usuário e gera o JWT.
 */
export function gerarToken(usuario) {
    // Desestrutura apenas os campos necessários para o payload
    const payload = {
        id: usuario.id,
        nome: usuario.nome, // Opcional, mas útil para logs/exibição
        perfil: usuario.perfil
    };

    // Assina o token com a chave secreta e define o tempo de expiração
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
}

// -------------------------------------------------------------------

export default authMiddleware;