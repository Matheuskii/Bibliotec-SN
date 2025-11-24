import express from "express";

import{listarAvaliacoes, postarAvaliacoes} from "../controllers/avaliacoes.controller.js";

const router = express.Router();

router.get("/", listarAvaliacoes);
router.post("/",postarAvaliacoes);

export default router;