/**
 * @file profileController.controllers.js
 * @module controllers/profileController
 * @description Controladores para gestión de perfil de usuario, favoritos, reviews y restaurantes asociados.
 */

import { User } from "../models/users.models.js";
import { Review } from "../models/review.models.js";
import Restaurant from "../models/restaurant.models.js";
import BusinessUser from "../models/businessUser.models.js";
import asyncHandler from "express-async-handler";

/**
 * Obtiene el perfil del usuario autenticado.
 * @function getProfile
 * @route GET /api/profile
 * @param {Request} req - Objeto de solicitud Express (usuario autenticado)
 * @param {Response} res - Objeto de respuesta Express
 * @returns {void} Devuelve el perfil del usuario
 */
const getProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId).select("-password");
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

/**
 * Edita el perfil del usuario autenticado.
 * @function editProfile
 * @route PATCH /api/profile
 * @param {Request} req - Objeto de solicitud Express (usuario autenticado, body: campos a editar)
 * @param {Response} res - Objeto de respuesta Express
 * @returns {void} Devuelve el usuario actualizado
 */
const editProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  const fields = ["name", "lastName", "username", "biography", "email"];
  const updates = {};
  for (const field of fields) {
    if (
      req.body[field] !== user[field] &&
      req.body[field] !== undefined &&
      (field !== "password" || req.body[field] !== "")
    ) {
      updates[field] = req.body[field];
    }
  }
  if (updates.email && updates.email !== user.email) {
    const emailExists = await User.findOne({ email: updates.email, _id: { $ne: userId } });
    if (emailExists) {
      res.status(400);
      throw new Error("Email is already in use by another user.");
    }
  }

  if (Object.keys(updates).length === 0) {
    res.status(400);
    throw new Error("No changes detected to update.");
  }
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: updates },
    { new: true, runValidators: true }
  );
  if (updatedUser) {
    res.json(updatedUser);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

/**
 * Agrega un restaurante a favoritos del usuario.
 * @function addFavoriteRestaurants
 * @route POST /api/profile/favorites/:restaurantId
 * @param {Request} req - Objeto de solicitud Express (usuario autenticado, params: restaurantId)
 * @param {Response} res - Objeto de respuesta Express
 * @returns {void} Devuelve mensaje de éxito o error
 */
const addFavoriteRestaurants = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { restaurantId } = req.params;
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $addToSet: { favoriteRestaurants: restaurantId } },
    { new: true, runValidators: true }
  );

  if (updatedUser) {
    const added = updatedUser.favoriteRestaurants.some(
      (id) => id.toString() === restaurantId
    );
    if (added) {
      res.status(200).json({ message: "Restaurant added to favorites." });
    } else {
      res.status(400);
      throw new Error("Restaurant already in favorites.");
    }
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

/**
 * Elimina un restaurante de favoritos del usuario.
 * @function removeFavoriteRestaurants
 * @route DELETE /api/profile/favorites/:restaurantId
 * @param {Request} req - Objeto de solicitud Express (usuario autenticado, params: restaurantId)
 * @param {Response} res - Objeto de respuesta Express
 * @returns {void} Devuelve mensaje de éxito o error
 */
const removeFavoriteRestaurants = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { restaurantId } = req.params;
  const user = await User.findByIdAndUpdate(
    userId,
    { $pull: { favoriteRestaurants: restaurantId } },
    { new: true, runValidators: true }
  );
  if (user) {
    const stillExists = user.favoriteRestaurants.some(
      (id) => id.toString() === restaurantId
    );
    if (!stillExists) {
      res.status(200).json({ message: "Restaurant removed from favorites." });
    } else {
      res.status(400);
      throw new Error("Restaurant not found in favorites.");
    }
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

/**
 * Obtiene los restaurantes favoritos del usuario.
 * @function getFavoriteRestaurants
 * @route GET /api/profile/favorites
 * @param {Request} req - Objeto de solicitud Express (usuario autenticado)
 * @param {Response} res - Objeto de respuesta Express
 * @returns {void} Devuelve un array de restaurantes favoritos
 */
const getFavoriteRestaurants = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId).populate("favoriteRestaurants");
  if (user) {
    res.json(user.favoriteRestaurants);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

/**
 * Obtiene las reviews hechas por el usuario.
 * @function getReviews
 * @route GET /api/profile/reviews
 * @param {Request} req - Objeto de solicitud Express (usuario autenticado)
 * @param {Response} res - Objeto de respuesta Express
 * @returns {void} Devuelve un array de reviews
 */
const getReviews = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const userReviews = await Review.find({
    userId: userId,
    deleted: false,
  }).populate("restaurantId", "name");
  res.json(userReviews);
});

/**
 * Obtiene los restaurantes donde el usuario es owner u operator.
 * @function getMyRestaurants
 * @route GET /api/profile/my-restaurants
 * @param {Request} req - Objeto de solicitud Express (usuario autenticado)
 * @param {Response} res - Objeto de respuesta Express
 * @returns {void} Devuelve restaurantes como owner y como operator
 */
const getMyRestaurants = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const myRestaurantsOwner = await Restaurant.find({
    ownerId: userId,
    isDeleted: false,
  });
  const myRestaurantsOperatorRaw = await BusinessUser.find({
    user: userId,
    role: "operator",
  }).populate("restaurant");
  const myRestaurantsOperator = myRestaurantsOperatorRaw.filter(
    (op) => op.restaurant && op.restaurant.isDeleted === false
  );
  res.json({ owner: myRestaurantsOwner, operator: myRestaurantsOperator });
});

export {
  getProfile,
  editProfile,
  addFavoriteRestaurants,
  removeFavoriteRestaurants,
  getFavoriteRestaurants,
  getReviews,
  getMyRestaurants,
};
