/**
 * ProfileRouter handles routes related to user profiles, including retrieving and editing profiles,
 * managing favorite restaurants, fetching reviews, and retrieving restaurants owned by the user.
 *
 * Routes:
 * - GET /: Retrieves the user's profile. Requires authentication.
 * - PATCH /: Edits the user's profile. Requires authentication.
 * - GET /favorites: Retrieves the user's favorite restaurants. Requires authentication.
 * - POST /favorites/:restaurantId: Adds a restaurant to the user's favorites. Requires authentication.
 * - DELETE /favorites/:restaurantId: Removes a restaurant from the user's favorites. Requires authentication.
 * - GET /reviews: Retrieves the user's reviews. Requires authentication.
 * - GET /:userId/my-restaurants: Retrieves restaurants owned by the specified user. Requires authentication.
 *
 * Middleware:
 * - `protect`: Ensures the user is authenticated before accessing the routes.
 *
 * Controllers:
 * - `getProfile`: Retrieves the user's profile data.
 * - `editProfile`: Updates the user's profile data.
 * - `addFavoriteRestaurants`: Adds a restaurant to the user's favorites.
 * - `removeFavoriteRestaurants`: Removes a restaurant from the user's favorites.
 * - `getFavoriteRestaurants`: Retrieves the user's favorite restaurants.
 * - `getReviews`: Retrieves the user's reviews.
 * - `getMyRestaurants`: Retrieves restaurants owned by the user.
 */
import express from "express";
import { protect } from "../middlewares/authMiddleware.middlewares.js";
import {
  getProfile,
  editProfile,
  addFavoriteRestaurants,
  removeFavoriteRestaurants,
  getFavoriteRestaurants,
  getReviews,
  getMyRestaurants,
} from "../controllers/profileController.controllers.js";

const ProfileRouter = express.Router();

ProfileRouter.route("/").get(protect, getProfile).patch(protect, editProfile);
ProfileRouter.route("/favorites").get(protect, getFavoriteRestaurants);
ProfileRouter.route("/favorites/:restaurantId")
  .post(protect, addFavoriteRestaurants)
  .delete(protect, removeFavoriteRestaurants);
ProfileRouter.route("/reviews").get(protect, getReviews);
ProfileRouter.route("/:userId/my-restaurants").get(protect, getMyRestaurants);

export default ProfileRouter;
