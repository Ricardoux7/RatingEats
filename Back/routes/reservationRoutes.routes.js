import express from 'express';
import { protect } from '../middlewares/authMiddleware.middlewares.js';
import { hasRestaurantRole } from '../middlewares/roleMiddleware.middlewares.js';
import { createReservation, getReservationsToUser, getReservationsToRestaurant, confirmReservation, rejectReservation, cancelReservation, markAsCompleted, getReservationsToManage } from '../controllers/reservationController.controllers.js';

const reservationRoutes = express.Router();

reservationRoutes.route('/').post(protect, createReservation);
reservationRoutes.route('/user').get(protect, getReservationsToUser);
reservationRoutes.route('/restaurant/:restaurantId').get(protect, hasRestaurantRole(['owner', 'operator'], 'restaurantId'), getReservationsToRestaurant);
reservationRoutes.route('/manage/:restaurantId').get(protect, hasRestaurantRole(['owner', 'operator'], 'restaurantId'), getReservationsToManage);
reservationRoutes.route('/:reservationId/confirm').patch(protect, hasRestaurantRole(['owner', 'operator'], 'reservationId'), confirmReservation);
reservationRoutes.route('/:reservationId/reject').patch(protect, hasRestaurantRole(['owner', 'operator'], 'reservationId'), rejectReservation);
reservationRoutes.route('/:reservationId/cancel').patch(protect, cancelReservation);
reservationRoutes.route('/:reservationId/complete').patch(protect, hasRestaurantRole(['owner', 'operator'], 'reservationId'), markAsCompleted);

export default reservationRoutes;