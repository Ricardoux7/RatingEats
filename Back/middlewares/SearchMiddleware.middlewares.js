/**
 * @file SearchMiddleware.middlewares.js
 * @module middlewares/SearchMiddleware
 * @description Middleware para verificar resultados de búsqueda de restaurantes.
 */

/**
 * Middleware que verifica si existen resultados de búsqueda en res.locals.results.
 * Si no hay resultados, responde con 404.
 * @function verifyResults
 * @param {Request} req - Objeto de solicitud Express
 * @param {Response} res - Objeto de respuesta Express
 * @param {Function} next - Función next de Express
 */
const verifyResults = (req, res, next) => {
  const results = res.locals.results;
  if (!Array.isArray(results) || results.length === 0) {
    return res.status(404).json({ message: "No matching restaurants found." });
  }
  next();
};

export { verifyResults };
