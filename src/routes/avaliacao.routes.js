import express from "express";
import { postarAvaliacoes, listarAvaliacoesPorLivro } from "../controllers/avaliacoes.controller.js";

const router = express.Router();


router.get("/livro/:id", listarAvaliacoesPorLivro);


router.post("/", postarAvaliacoes);

export default router;