// ============================
//  Dependências
// ============================
import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import authMiddleware from "./middlewares/auth.js";
import usuarioRoutes from "./routes/usuario.routes.js";
import livrosRoutes from "./routes/livros.routes.js";
import avaliacoesRoutes from "./routes/avaliacao.routes.js";
import reservasRoutes from "./routes/reservas.routes.js"
import favoritosRoutes from "./routes/favoritos.routes.js"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3000;
// ============================
//  Configuração do servidor
// ============================
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://localhost:5176",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "http://127.0.0.1:5175",
    "http://127.0.0.1:5176",
    "https://bibliotec-sn.vercel.app"
  ],
  credentials: true
}));

app.use(bodyParser.json());

// Servir arquivos estáticos (como as capas dos livros)
const publicPath = path.join(__dirname, "../frontend/public");
app.use(express.static(publicPath));

// 1. ROTAS DE API (Sempre coloque um prefixo como /api para evitar conflitos)
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/livros", livrosRoutes);
app.use("/api/avaliacoes", avaliacoesRoutes);
app.use("/api/reservas", authMiddleware, reservasRoutes);
app.use("/api/favoritos", authMiddleware, favoritosRoutes);

app.get("/api/health", (req, res) => {
  res.send("🚀 API rodando com sucesso!");
});

app.get("/", (req, res) => {
  res.json({ status: "online", message: "Servidor da Biblioteca ativo" });
});

app.use((req, res) => {
  res.status(404).json({ error: "Rota não encontrada no backend" });
});

app.listen(PORT, () => console.log(`✅ Servidor rodando na porta ${PORT}`));