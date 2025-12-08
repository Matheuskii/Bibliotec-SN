// ============================
//  Dependências
// ============================
import express from "express"
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

// ============================
//  Configuração do servidor
// ============================


app.use(express.static(path.join(__dirname, "../frontend")));

app.use(cors());
app.use(bodyParser.json());

// Rota principal (teste rápido)
app.get("/", (req, res) => {
  res.send("🚀 API rodando com sucesso!");
});
app.get("/teste", authMiddleware, (req, res) => {
  res.send("🚀 Rota de teste funcionando!");
});

// Usa as rotas de usuários
app.use("/usuarios", authMiddleware, usuarioRoutes);
// Usa as rotas de livros
app.use("/livros", authMiddleware, livrosRoutes);
// Usa as rotas de avaliações
app.use("/avaliacoes",authMiddleware,avaliacoesRoutes);
// Usa as rotas de reservas
app.use("/reservas", authMiddleware,reservasRoutes);
//Usa as rotas de favoritos
app.use("/favoritos", authMiddleware,favoritosRoutes);
// Rotas protegidas podem ser acessadas após o middleware de autenticação


// ============================
//  Inicia o servidor
// ============================
const PORT = 3000;
app.listen(PORT, () => console.log(`✅ Servidor rodando na porta ${PORT}`));
