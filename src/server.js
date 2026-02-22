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
    "http://localhost:3000",            
    "https://bibliotec-sn.vercel.app/"       
  ],
  credentials: true
}));



app.use(bodyParser.json());

// 1. ROTAS DE API (Sempre coloque um prefixo como /api para evitar conflitos)
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/livros", livrosRoutes);
app.use("/api/avaliacoes", avaliacoesRoutes);
app.use("/api/reservas", authMiddleware, reservasRoutes);
app.use("/api/favoritos", authMiddleware, favoritosRoutes);

app.get("/api/health", (req, res) => {
  res.send("🚀 API rodando com sucesso!");
});


const frontendPath = path.join(__dirname, "../frontend");
app.use(express.static(frontendPath));


app.use((req, res) => {
  res.sendFile(path.join(frontendPath, "Inicio.html"));
});

app.listen(PORT, () => console.log(`✅ Servidor rodando na porta ${PORT}`));