import express from "express";

import { listarReservas,criarReserva,excluirReserva, listarReservasPorUsuario  } from "../controllers/reservas.controller.js";

const router = express.Router();

router.get("/usuario/:usuario_id", listarReservasPorUsuario);
router.get("/", listarReservas);
router.post("/", criarReserva);
router.delete("/:id", excluirReserva);

export default router;