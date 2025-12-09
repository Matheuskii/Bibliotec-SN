import express from "express";
import { listarAvaliacoesPorLivro, postarAvaliacoes } from "../controllers/avaliacoes.controller.js";
import authMiddleware from "../middlewares/auth.js"; 

const router = express.Router();

// --- ROTA PÚBLICA (SEM authMiddleware) ---
// Todo mundo pode ler, mesmo sem estar logado
router.get("/livro/:livro_id", listarAvaliacoesPorLivro);

// --- ROTA PROTEGIDA (COM authMiddleware) ---
// Só quem tem token pode postar
router.post("/", authMiddleware, postarAvaliacoes);

export default router;