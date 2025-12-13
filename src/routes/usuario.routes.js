import express from "express";
import * as usuarioController from "../controllers/usuario.controller.js";
import { verificarCodigo, criarUsuario } from "../controllers/usuario.controller.js";


const router = express.Router();

// ============================
// Rotas de Usuários
// ============================

// Listar todos os usuários
router.get("/", usuarioController.listarUsuario);

// Obter usuário pelo ID
router.get("/:id", usuarioController.obterUsuario);

// Criar usuário
router.post("/cadastrar", criarUsuario);
router.post("/verificar", verificarCodigo);

// Login
router.post("/login", usuarioController.loginUsuario);

// Atualizar usuário
router.put("/:id", usuarioController.atualizarUsuario);

// Deletar usuário
router.delete("/:id", usuarioController.deletarUsuario);

// Recuperar senha
router.post("/newpass", usuarioController.recuperarSenha);

export default router;
