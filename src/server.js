// ============================
//  Dependências
// ============================
import express from "express"
import bodyParser from "body-parser";
import cors from "cors";

import usuarioRoutes from "./routes/usuario.routes.js";
import livrosRoutes from "./routes/livros.routes.js";
import avaliacoesRoutes from "./routes/avaliacao.routes.js";
import reservasRoutes from "./routes/reservas.routes.js"
import favoritosRoutes from "./routes/favoritos.routes.js"


// ============================
//  Configuração do servidor
// ============================
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Rota principal (teste rápido)
app.get("/", (req, res) => {
  res.send("🚀 API rodando com sucesso!");
});

// Usa as rotas de usuários
app.use("/usuarios", usuarioRoutes);
// Usa as rotas de livros
app.use("/livros", livrosRoutes);
// Usa as rotas de avaliações
app.use("/avaliacoes", avaliacoesRoutes);
// Usa as rotas de reservas
app.use("/reservas", reservasRoutes);
//Usa as rotas de favoritos
app.use("/favoritos", favoritosRoutes);

// ============================
//  Inicia o servidor
// ============================
const PORT = 3000;
app.listen(PORT, () => console.log(`✅ Servidor rodando na porta ${PORT}`));
