/**
 * @file authMiddleware.middlewares.js
 * @module middlewares/authMiddleware
 * @description Middlewares para autenticación JWT y autorización de propietario de restaurante.
 */

import jwt from "jsonwebtoken";
import { User } from "../models/users.models.js";
import BusinessUser from "../models/businessUser.models.js";
import Restaurant from "../models/restaurant.models.js";
import mongoose from "mongoose";

/**
 * Middleware que protege rutas mediante autenticación JWT.
 * Agrega el usuario autenticado a req.user si el token es válido.
 * @function protect
 * @param {Request} req - Objeto de solicitud Express
 * @param {Response} res - Objeto de respuesta Express
 * @param {Function} next - Función next de Express
 */
const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userDocument = await User.findById(decoded.id).select("-password");
      if (!userDocument) {
        return res
          .status(401)
          .json({ message: "Not authorized, user not found in DB" });
      }
      let user = userDocument.toObject();
      const businessUser = await BusinessUser.findOne({ user: user._id });
      if (businessUser) {
        user.role = businessUser.role;
        user.restaurantId = businessUser.restaurant;
      }
      req.user = user;
      next();
    } catch (error) {
      console.error("Token verification failed:", error);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }
  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

/**
 * Middleware que verifica si el usuario autenticado es owner del restaurante indicado.
 * @function isOwner
 * @param {Request} req - Objeto de solicitud Express
 * @param {Response} res - Objeto de respuesta Express
 * @param {Function} next - Función next de Express
 */
const isOwner = async (req, res, next) => {
  try {
    const restaurantId = req.params.id || req.body.restaurantId;
    if (!restaurantId) {
      return res.status(400).json({ message: "Restaurant ID is required" });
    }
    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      return res.status(400).json({ message: "Invalid Restaurant ID format" });
    }
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    const ownerId = restaurant.ownerId ? restaurant.ownerId.toString() : null;
    if (!ownerId) {
      return res
        .status(500)
        .json({ message: "Restaurant does not have an ownerId field" });
    }
    if (`${req.user._id}` !== `${ownerId}`) {
      return res
        .status(403)
        .json({ message: "You have no permission to manage this restaurant" });
    }
    next();
  } catch (error) {
    console.error("Ownership verification failed:", error);
    return res
      .status(500)
      .json({
        message: "Server error during ownership verification",
        error: error.message,
      });
  }
};

export { protect, isOwner };
