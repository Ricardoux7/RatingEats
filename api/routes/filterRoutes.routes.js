/**
 * Filter Routes
 *
 * Este módulo define las rutas para filtrar y buscar restaurantes en la aplicación.
 * Incluye rutas para filtrar por criterios y búsqueda por texto libre.
 *
 * Middleware:
 * - `searchInBar`: Realiza la búsqueda en la barra de búsqueda.
 * - `verifyResults`: Verifica que existan resultados antes de responder.
 *
 * Rutas:
 * - GET `/`: Filtra restaurantes según los criterios de consulta.
 * - GET `/search`: Busca restaurantes por texto libre y devuelve resultados.
 *
 * @module filterRoutes
 */
import {
  filterRestaurants,
  searchInBar,
} from "../controllers/filterController.controllers.js";
import express from "express";
import { verifyResults } from "../middlewares/SearchMiddleware.middlewares.js";
const FilterRouter = express.Router();

FilterRouter.route("/").get(filterRestaurants);
FilterRouter.route("/search").get(searchInBar, verifyResults, (req, res) => {
  return res.status(200).json(res.locals.results);
});

export default FilterRouter;
