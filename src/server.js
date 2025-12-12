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
const PORT = process.env.PORT || 3000;
// ============================
//  Configuração do servidor
// ============================
app.use(cors());


app.use(express.static(path.join(__dirname, "../frontend")));

app.use(bodyParser.json());

// Rota principal (teste rápido)
app.get("/", (req, res) => {
  res.send("🚀 API rodando com sucesso!");
});
app.get("/teste", authMiddleware, (req, res) => {
  res.send("🚀 Rota de teste funcionando!");
});

// ... (imports e configs) ...

// Rota de teste pública
app.get("/", (req, res) => {
  res.send("🚀 API rodando com sucesso!");
});

// === ROTAS PÚBLICAS (NÃO PRECISAM DE TOKEN) ===
// Login e Cadastro devem ser livres
app.use("/usuarios", usuarioRoutes);

// === ROTAS MISTAS (A lógica de proteção fica NO ARQUIVO DE ROTAS) ===
// Precisamos liberar o GET /livros para o catálogo funcionar sem login
app.use("/livros", livrosRoutes);

// === ROTAS PROTEGIDAS (PRECISAM DE TOKEN) ===
// Reservar e Favoritar exigem login sempre
app.use("/avaliacoes", avaliacoesRoutes);
app.use("/reservas", authMiddleware, reservasRoutes);
app.use("/favoritos", authMiddleware, favoritosRoutes);
// ============================
//  Inicia o servidor
// ============================
app.listen(PORT, () => console.log(`✅ Servidor rodando na porta ${PORT}`));
