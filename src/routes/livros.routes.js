import express from "express";
import { listarLivros, buscarLivros, criarLivro, atualizarLivro, deletarLivro } from "../controllers/livros.controller.js";
import authMiddleware, { apenasAdmin } from "../middlewares/auth.js"; // Importe os middlewares

const router = express.Router();

// -- Rotas PÚBLICAS (Qualquer um vê) --
router.get("/", listarLivros);
router.get("/:id", buscarLivros);

// -- Rotas PROTEGIDAS (Só Admin com Token) --
// Adicione os middlewares aqui
router.post("/", authMiddleware, apenasAdmin, criarLivro);
router.put("/:id", authMiddleware, apenasAdmin, atualizarLivro);
router.delete("/:id", authMiddleware, apenasAdmin, deletarLivro);

export default router;