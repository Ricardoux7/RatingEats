/**
 * Auth Routes
 *
 * Este módulo define las rutas para el registro y login de usuarios.
 * Incluye rutas para crear un nuevo usuario y autenticar usuarios existentes.
 *
 * Middleware:
 * - `asyncHandler`: Maneja errores en controladores asíncronos.
 *
 * Rutas:
 * - POST `/register`: Registra un nuevo usuario.
 * - POST `/login`: Inicia sesión de usuario.
 *
 * @module authRoutes
 */
import asyncHandler from 'express-async-handler';
import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.controllers.js';
const router = express.Router();

router.route('/register').post(asyncHandler(registerUser));
router.route('/login').post(asyncHandler(loginUser));

export default router;