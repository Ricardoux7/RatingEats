/**
 * Notification Routes
 *
 * Este módulo define las rutas para la gestión de notificaciones de usuarios y restaurantes.
 * Incluye rutas para obtener notificaciones y notificar eventos de reservaciones y posts.
 *
 * Middleware:
 * - `protect`: Asegura que el usuario esté autenticado.
 *
 * Rutas:
 * - GET `/`: Obtiene todas las notificaciones del usuario autenticado.
 * - POST `/reservation/accepted`: Notifica aceptación de reservación.
 * - POST `/reservation/rejected`: Notifica rechazo de reservación.
 * - POST `/reservation/completed`: Notifica completitud de reservación.
 * - POST `/reservation/canceled`: Notifica cancelación de reservación.
 * - POST `/post/accepted`: Notifica aceptación de post.
 * - POST `/post/rejected`: Notifica rechazo de post.
 *
 * @module notificationRoutes
 */
import express from "express";
import {
  getNotifications,
  notiAcceptedReservation,
  notiRejectedReservation,
  notiacceptedPost,
  notiRejectedPost,
  notiCompletedReservation,
  notiCanceledReservation,
} from "../controllers/notificationController.controllers.js";
import { protect } from "../middlewares/authMiddleware.middlewares.js";
const routerNotifications = express.Router();

routerNotifications.route("/").get(protect, getNotifications);
routerNotifications
  .route("/reservation/accepted")
  .post(protect, notiAcceptedReservation);
routerNotifications
  .route("/reservation/rejected")
  .post(protect, notiRejectedReservation);
routerNotifications
  .route("/reservation/completed")
  .post(protect, notiCompletedReservation);
routerNotifications
  .route("/reservation/canceled")
  .post(protect, notiCanceledReservation);
routerNotifications.route("/post/accepted").post(protect, notiacceptedPost);
routerNotifications.route("/post/rejected").post(protect, notiRejectedPost);
export default routerNotifications;
