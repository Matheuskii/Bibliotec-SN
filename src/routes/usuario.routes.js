import express from "express";
import * as usuarioController from "../controllers/usuario.controller.js";
import { verificarCodigo, criarUsuario } from "../controllers/usuario.controller.js";
import {authMiddleware, apenasAdmin } from "../middlewares/auth.js";



const router = express.Router();

// ============================
// Rotas de Usuários
// ============================

// Listar todos os usuários
router.get("/", authMiddleware, apenasAdmin, usuarioController.listarUsuario);

// Rotas públicas (não precisam de token)
router.post("/cadastrar", criarUsuario);
router.post("/verificar", verificarCodigo);
router.post("/login",     usuarioController.loginUsuario);
router.post("/newpass",   usuarioController.recuperarSenha);

// Rotas protegidas (precisam de token)
router.get("/:id",    authMiddleware, usuarioController.obterUsuario);
router.put("/:id",    authMiddleware, usuarioController.atualizarUsuario);
router.delete("/:id", authMiddleware, apenasAdmin, usuarioController.deletarUsuario);

export default router;