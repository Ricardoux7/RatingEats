import jwt from "jsonwebtoken";
import { User } from "../models/users.models.js";
import asyncHandler from "express-async-handler";

/**
 * @file authController.controllers.js
 * @module controllers/authController
 * @description Controladores para autenticación de usuarios: registro y login.
 */

/**
 * Genera un token JWT para un usuario dado.
 * @function generateToken
 * @param {string} id - ID del usuario
 * @returns {string} Token JWT firmado
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

/**
 * Extrae y formatea mensajes de error de validación de Mongoose.
 * @function extractMongooseErrorMessage
 * @param {object} err - Objeto de error de Mongoose
 * @returns {string[]} Array de mensajes de error legibles
 */
const extractMongooseErrorMessage = (err) => {
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    let capitalizedField = field.charAt(0).toUpperCase() + field.slice(1);
    if (capitalizedField === "Lastname") {
      capitalizedField = "Last Name";
    }
    return [`${capitalizedField} is already in use.`];
  }
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e) => e.message);
    return errors;
  }
  return ["An unexpected error occurred during registration."];
};

/**
 * Registra un nuevo usuario en el sistema.
 * @function registerUser
 * @route POST /api/auth/register
 * @param {Request} req - Objeto de solicitud Express
 * @param {Response} res - Objeto de respuesta Express
 * @returns {void} Devuelve el usuario creado y el token JWT, o errores de validación
 */
const registerUser = asyncHandler(async (req, res) => {
  const { name, lastName, email, password, username } = req.body;
  try {
    const newUser = await User.create({
      name,
      lastName,
      email,
      password,
      username,
    });
    const token = generateToken(newUser._id);
    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      username: newUser.username,
      token,
    });
  } catch (error) {
    const errors = extractMongooseErrorMessage(error);
    res.status(400).json({ errors });
    return;
  }
});

/**
 * Inicia sesión de usuario con email y contraseña.
 * @function loginUser
 * @route POST /api/auth/login
 * @param {Request} req - Objeto de solicitud Express
 * @param {Response} res - Objeto de respuesta Express
 * @returns {void} Devuelve el usuario autenticado y el token JWT, o error de autenticación
 */
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  let user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    const token = generateToken(user._id);
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

export { registerUser, loginUser };
