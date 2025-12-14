/**
 * @file filterController.controllers.js
 * @module controllers/filterController
 * @description Controladores para filtrar y buscar restaurantes por categorías, rating y texto.
 */

import asyncHandler from "express-async-handler";
import Restaurant from "../models/restaurant.models.js";

/**
 * Filtra restaurantes según categorías, rating y búsqueda textual.
 * @function filterRestaurants
 * @route GET /api/restaurants/filter
 * @param {Request} req - Objeto de solicitud Express (query: categories, rating, searchBar)
 * @param {Response} res - Objeto de respuesta Express
 * @returns {void} Devuelve un array de restaurantes filtrados
 */
const filterRestaurants = asyncHandler(async (req, res) => {
  const { categories, rating, searchBar } = req.query;
  let restaurants = await Restaurant.find({ isDeleted: false });

  if (categories) {
    const categoryArray = categories
      .split(",")
      .map((c) => c.trim().toLowerCase());
    restaurants = restaurants.filter((restaurant) =>
      restaurant.categories.some((category) =>
        categoryArray.includes(category.toLowerCase())
      )
    );
  }
  if (rating) {
    const ratingValue = parseFloat(rating);
    restaurants = restaurants.filter(
      (restaurant) => restaurant.averageRating >= ratingValue
    );
  }
  if (searchBar) {
    const searchTerm = searchBar.toLowerCase();
    restaurants = restaurants.filter(
      (restaurant) =>
        restaurant.name.toLowerCase().includes(searchTerm) ||
        restaurant.description.toLowerCase().includes(searchTerm) ||
        restaurant.categories.some((category) =>
          category.toLowerCase().includes(searchTerm)
        )
    );
  }
  return res.status(200).json(restaurants);
});

/**
 * Middleware para buscar restaurantes por texto en nombre, descripción o categorías.
 * @function searchInBar
 * @route GET /api/restaurants/search
 * @param {Request} req - Objeto de solicitud Express (query: searchBar)
 * @param {Response} res - Objeto de respuesta Express
 * @param {Function} next - Siguiente middleware
 * @returns {void} Devuelve resultados en res.locals.results o error si no hay término de búsqueda
 */
const searchInBar = asyncHandler(async (req, res, next) => {
  const { searchBar } = req.query;
  let restaurants = await Restaurant.find({ isDeleted: false });
  if (searchBar && searchBar.trim() !== "" && restaurants.length > 0) {
    const searchTerm = searchBar.toLowerCase();
    restaurants = restaurants.filter(
      (restaurant) =>
        restaurant.name.toLowerCase().includes(searchTerm) ||
        restaurant.description.toLowerCase().includes(searchTerm) ||
        (Array.isArray(restaurant.categories) &&
          restaurant.categories.some((category) =>
            category.includes(category.toLowerCase())
          ))
    );
    restaurants = restaurants.sort((a, b) => {
      const ratingA = a.averageRating || 0;
      const ratingB = b.averageRating || 0;
      return ratingB - ratingA;
    });
    res.locals.results = restaurants;
    return next();
  } else {
    res.status(400);
    throw new Error("Search term is required");
  }
});

export { filterRestaurants, searchInBar };
