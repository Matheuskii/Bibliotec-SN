import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Carrega as variáveis de ambiente
dotenv.config();

// Tenta pegar do .env
const JWT_SECRET = process.env.JWT_SECRET_KEY;

// === DEBUG DE SEGURANÇA ===
if (!JWT_SECRET) {
    console.error("🔴 ERRO GRAVE: A variável JWT_SECRET_KEY não foi encontrada no .env!");
} else {
    // console.log("🟢 Autenticação carregada com chave segura do .env");
}
// ===========================

const JWT_EXPIRATION = '24h';

// 1. Middleware de Autenticação
export function authMiddleware(req, res, next) {
    // Libera o "Preflight" do navegador (OPTIONS)
    if (req.method === 'OPTIONS') {
        return next();
    }

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ erro: "Acesso negado. Token não fornecido." });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decodificado = jwt.verify(token, JWT_SECRET);
        req.usuario = decodificado;
        next();
    } catch (err) {
        return res.status(403).json({ erro: "Token inválido ou expirado." });
    }
}

// 2. Middleware de Admin
export function apenasAdmin(req, res, next) {
    if (req.usuario && req.usuario.perfil === 'Admin') {
        next();
    } else {
        res.status(403).json({ erro: "Acesso negado. Requer perfil de Admin." });
    }
}

export function gerarToken(usuario) {
    const payload = {
        id: usuario.id,
        nome: usuario.nome, 
        perfil: usuario.perfil
    };

    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
}

export default authMiddleware;