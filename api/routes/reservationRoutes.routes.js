/**
 * Reservation Routes
 * 
 * This module defines the routes for managing reservations in the application.
 * It includes routes for creating, retrieving, confirming, rejecting, canceling,
 * and completing reservations. Access to certain routes is restricted based on
 * user roles and authentication.
 * 
 * Middleware:
 * - `protect`: Ensures the user is authenticated.
 * - `hasRestaurantRole`: Verifies the user has the required role for the specified restaurant.
 * 
 * Routes:
 * - POST `/`: Create a new reservation. Requires authentication.
 * - GET `/user`: Retrieve reservations for the authenticated user.
 * - GET `/restaurant/:restaurantId`: Retrieve reservations for a specific restaurant.
 *   Requires authentication and "owner" or "operator" role for the restaurant.
 * - GET `/manage/:restaurantId`: Retrieve reservations to manage for a specific restaurant.
 *   Requires authentication and "owner" or "operator" role for the restaurant.
 * - PATCH `/:reservationId/confirm`: Confirm a reservation.
 *   Requires authentication and "owner" or "operator" role for the reservation.
 * - PATCH `/:reservationId/reject`: Reject a reservation.
 *   Requires authentication and "owner" or "operator" role for the reservation.
 * - PATCH `/:reservationId/cancel`: Cancel a reservation. Requires authentication.
 * - PATCH `/:reservationId/complete`: Mark a reservation as completed.
 *   Requires authentication and "owner" or "operator" role for the reservation.
 * 
 * @module reservationRoutes
 */
import express from "express";
import { protect } from "../middlewares/authMiddleware.middlewares.js";
import { hasRestaurantRole } from "../middlewares/roleMiddleware.middlewares.js";
import {
  createReservation,
  getReservationsToUser,
  getReservationsToRestaurant,
  confirmReservation,
  rejectReservation,
  cancelReservation,
  markAsCompleted,
  getReservationsToManage,
} from "../controllers/reservationController.controllers.js";


const reservationRoutes = express.Router();

reservationRoutes.route("/").post(protect, createReservation);
reservationRoutes.route("/user").get(protect, getReservationsToUser);
reservationRoutes
  .route("/restaurant/:restaurantId")
  .get(
    protect,
    hasRestaurantRole(["owner", "operator"], "restaurantId"),
    getReservationsToRestaurant
  );
reservationRoutes
  .route("/manage/:restaurantId")
  .get(
    protect,
    hasRestaurantRole(["owner", "operator"], "restaurantId"),
    getReservationsToManage
  );
reservationRoutes
  .route("/:reservationId/confirm")
  .patch(
    protect,
    hasRestaurantRole(["owner", "operator"], "reservationId"),
    confirmReservation
  );
reservationRoutes
  .route("/:reservationId/reject")
  .patch(
    protect,
    hasRestaurantRole(["owner", "operator"], "reservationId"),
    rejectReservation
  );
reservationRoutes
  .route("/:reservationId/cancel")
  .patch(protect, cancelReservation);
reservationRoutes
  .route("/:reservationId/complete")
  .patch(
    protect,
    hasRestaurantRole(["owner", "operator"], "reservationId"),
    markAsCompleted
  );

export default reservationRoutes;
