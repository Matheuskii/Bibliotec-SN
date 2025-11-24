import express from "express";
import { listarLivros,buscarLivros,criarLivro,atualizarLivro,deletarLivro } from "../controllers/livros.controller.js";


const router = express.Router();

router.get("/", listarLivros);
router.get("/:id",buscarLivros);
router.post("/", criarLivro);
router.put("/:id", atualizarLivro);
router.delete("/:id",deletarLivro);

export default router;