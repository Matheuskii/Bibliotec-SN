import express from "express";
import {listarFavoritos,
        criarFavoritos,
        deletarFavorito
    }from "../controllers/favoritos.controller.js";


const router = express.Router();

router.get("/:usuario_id", listarFavoritos);
router.post("/", criarFavoritos);
router.delete("/:id", deletarFavorito);


export default router;


