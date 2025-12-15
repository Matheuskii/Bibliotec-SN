import express from "express";
import {listarFavoritos,
        criarFavoritos,
        deletarFavorito,
        listarFavoritosPorUsuario
    }from "../controllers/favoritos.controller.js";


const router = express.Router();

router.get("/", listarFavoritos);
router.get("/:id", listarFavoritosPorUsuario);
router.post("/", criarFavoritos);
router.delete("/:id", deletarFavorito);


export default router;


