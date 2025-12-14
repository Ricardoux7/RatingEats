/**
 * @file profileMiddleware.middlewares.js
 * @module middlewares/profileMiddleware
 * @description Middleware para manejo centralizado de errores en rutas de perfil y generales.
 */

/**
 * Middleware de manejo de errores para Express.
 * Captura errores de validación, duplicados y otros, devolviendo mensajes claros al cliente.
 * @function errorHandler
 * @param {Error} err - Objeto de error
 * @param {Request} req - Objeto de solicitud Express
 * @param {Response} res - Objeto de respuesta Express
 * @param {Function} next - Función next de Express
 */
const errorHandler = (err, req, res, next) => {
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors)
      .map((e) => e.message)
      .join(" ");
    return res.status(400).json({ message: messages });
  }
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    return res
      .status(400)
      .json({ message: `The ${field} "${value}" is already in use.` });
  }
  res
    .status(err.status || 500)
    .json({ message: err.message || "Internal server error" });
};

export default errorHandler;
