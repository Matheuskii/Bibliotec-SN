import express from "express";
import { postarAvaliacoes, listarAvaliacoesPorLivro } from "../controllers/avaliacoes.controller.js";

const router = express.Router();

// Rota para pegar avaliações de um livro específico
// Ex: GET http://localhost:3000/avaliacoes/livro/5
router.get("/livro/:id", listarAvaliacoesPorLivro);

// Rota para postar nova avaliação
// Ex: POST http://localhost:3000/avaliacoes
router.post("/", postarAvaliacoes);

export default router;