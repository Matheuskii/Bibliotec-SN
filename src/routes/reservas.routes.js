import express from "express";

import { listarReservas,criarReserva,excluirReserva, listarReservasPorUsuario  } from "../controllers/reservas.controller.js";
import authMiddleware, { apenasAdmin } from "../middlewares/auth.js";
import { confirmarReserva } from "../controllers/reservas.controller.js";


const router = express.Router();

router.get("/usuario/:usuario_id", listarReservasPorUsuario);
router.get("/", listarReservas);
router.post("/", criarReserva);
router.delete("/:id", excluirReserva);
router.put("/:id/confirmar", authMiddleware, apenasAdmin, confirmarReserva);

export default router;