/**
 * @file notificationController.controllers.js
 * @module controllers/notificationController
 * @description Controladores para notificaciones de reservas y posts.
 */

import asyncHandler from "express-async-handler";
import Notifications from "../models/notifications.models.js";
import Restaurant from "../models/restaurant.models.js";
import { User } from "../models/users.models.js";
import { Reservation } from "../models/reservations.models.js";
import Post from "../models/posts.models.js";

/**
 * Obtiene todas las notificaciones de un usuario.
 * @function getNotifications
 * @route GET /api/notifications
 * @param {Request} req - Objeto de solicitud Express (usuario autenticado)
 * @param {Response} res - Objeto de respuesta Express
 * @returns {void} Devuelve un array de notificaciones
 */
const getNotifications = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  if (!userId) {
    res.status(400);
    throw new Error("User not found");
  }
  const notifications = await Notifications.find({ notifUserId: userId });
  res.status(200).json(notifications);
});

/**
 * Notifica al usuario que su reservación fue aceptada.
 * @function notiAcceptedReservation
 * @route POST /api/notifications/accepted-reservation
 * @param {Request} req - Objeto de solicitud Express (body: userId, restaurantId, reservationId)
 * @param {Response} res - Objeto de respuesta Express
 * @returns {void} Devuelve la notificación creada
 */
const notiAcceptedReservation = asyncHandler(async (req, res) => {
  const { userId, restaurantId, reservationId } = req.body;
  const restaurant = await Restaurant.findById(restaurantId);
  const user = await User.findById(userId);
  const reservation = await Reservation.findOne({
    _id: reservationId,
    userId: userId,
    restaurantId: restaurantId,
  });
  if (!restaurant) {
    throw new Error("Restaurant not found");
  }
  if (!user) {
    throw new Error("User not found");
  }
  if (!reservation) {
    throw new Error("Reservation not found");
  }
  const newNotification = new Notifications({
    notifUserId: userId,
    notifRestaurantId: restaurantId,
    type: "reservation",
    message: `Your reservation has been accepted at ${restaurant.name} on ${
      reservation.dateReservation
        ? reservation.dateReservation.toISOString().slice(0, 10)
        : ""
    } at ${reservation.time || ""} for ${
      reservation.numberOfGuests || ""
    } people for ${reservation.customerName || ""}.`,
    date: Date.now(),
  });
  res.status(200).json(await newNotification.save());
});

/**
 * Notifica al usuario que su reservación fue rechazada.
 * @function notiRejectedReservation
 * @route POST /api/notifications/rejected-reservation
 * @param {Request} req - Objeto de solicitud Express (body: userId, restaurantId, reservationId)
 * @param {Response} res - Objeto de respuesta Express
 * @returns {void} Devuelve la notificación creada
 */
const notiRejectedReservation = asyncHandler(async (req, res) => {
  const { userId, restaurantId, reservationId } = req.body;
  const restaurant = await Restaurant.findById(restaurantId);
  const user = await User.findById(userId);
  const reservation = await Reservation.findOne({
    _id: reservationId,
    userId: userId,
    restaurantId: restaurantId,
  });
  if (!restaurant) {
    throw new Error("Restaurant not found");
  }
  if (!user) {
    throw new Error("User not found");
  }
  if (!reservation) {
    throw new Error("Reservation not found");
  }
  const newNotification = new Notifications({
    notifUserId: userId,
    notifRestaurantId: restaurantId,
    type: "reservation",
    message: `Your reservation has been rejected at ${restaurant.name} on ${
      reservation.dateReservation
        ? reservation.dateReservation.toISOString().slice(0, 10)
        : ""
    } at ${reservation.time || ""} for ${
      reservation.numberOfGuests || ""
    } people for ${reservation.customerName || ""}.`,
    date: Date.now(),
  });
  res.status(200).json(await newNotification.save());
});

/**
 * Notifica al usuario que su reservación fue cancelada.
 * @function notiCanceledReservation
 * @route POST /api/notifications/canceled-reservation
 * @param {Request} req - Objeto de solicitud Express (body: userId, restaurantId, reservationId)
 * @param {Response} res - Objeto de respuesta Express
 * @returns {void} Devuelve la notificación creada
 */
const notiCanceledReservation = asyncHandler(async (req, res) => {
  const { userId, restaurantId, reservationId } = req.body;
  const restaurant = await Restaurant.findById(restaurantId);
  const user = await User.findById(userId);
  const reservation = await Reservation.findOne({
    _id: reservationId,
    userId: userId,
    restaurantId: restaurantId,
  });
  if (!restaurant) {
    throw new Error("Restaurant not found");
  }
  if (!user) {
    throw new Error("User not found");
  }
  if (!reservation) {
    throw new Error("Reservation not found");
  }
  const newNotification = new Notifications({
    notifUserId: userId,
    notifRestaurantId: restaurantId,
    type: "reservation",
    message: `Your reservation has been canceled at ${restaurant.name} on ${
      reservation.dateReservation
        ? reservation.dateReservation.toISOString().slice(0, 10)
        : ""
    } at ${reservation.time || ""} for ${
      reservation.numberOfGuests || ""
    } people for ${reservation.customerName || ""}.`,
    date: Date.now(),
  });
  res.status(200).json(await newNotification.save());
});

/**
 * Notifica al usuario que su reservación fue completada.
 * @function notiCompletedReservation
 * @route POST /api/notifications/completed-reservation
 * @param {Request} req - Objeto de solicitud Express (body: userId, restaurantId, reservationId)
 * @param {Response} res - Objeto de respuesta Express
 * @returns {void} Devuelve la notificación creada
 */
const notiCompletedReservation = asyncHandler(async (req, res) => {
  const { userId, restaurantId, reservationId } = req.body;
  const restaurant = await Restaurant.findById(restaurantId);
  const user = await User.findById(userId);
  const reservation = await Reservation.findOne({
    _id: reservationId,
    userId: userId,
    restaurantId: restaurantId,
  });

  if (!restaurant) {
    throw new Error("Restaurant not found");
  }
  if (!user) {
    throw new Error("User not found");
  }
  if (!reservation) {
    throw new Error("Reservation not found");
  }
  const newNotification = new Notifications({
    notifUserId: userId,
    notifRestaurantId: restaurantId,
    type: "reservation",
    message: `Your reservation has been completed at ${restaurant.name} on ${
      reservation.dateReservation
        ? reservation.dateReservation.toISOString().slice(0, 10)
        : ""
    } at ${reservation.time || ""} for ${
      reservation.numberOfGuests || ""
    } people for ${reservation.customerName || ""}.`,
    date: Date.now(),
  });
  res.status(200).json(await newNotification.save());
});

/**
 * Notifica al usuario que su post fue aceptado.
 * @function notiacceptedPost
 * @route POST /api/notifications/accepted-post
 * @param {Request} req - Objeto de solicitud Express (body: userId, restaurantId, postId)
 * @param {Response} res - Objeto de respuesta Express
 * @returns {void} Devuelve la notificación creada
 */
const notiacceptedPost = asyncHandler(async (req, res) => {
  const { userId, restaurantId, postId } = req.body;
  const restaurant = await Restaurant.findById(restaurantId);
  const user = await User.findById(userId);
  const post = await Post.findById(postId);
  if (!restaurant) {
    throw new Error("Restaurant not found");
  }
  if (!user) {
    throw new Error("User not found");
  }
  if (!post) {
    throw new Error("Post not found");
  }
  const newNotification = new Notifications({
    notifUserId: userId,
    notifRestaurantId: restaurantId,
    notifPostId: postId,
    type: "post",
    message: `Your post has been accepted at ${restaurant.name}.`,
    date: Date.now(),
  });
  res.status(200).json(await newNotification.save());
});

/**
 * Notifica al usuario que su post fue rechazado.
 * @function notiRejectedPost
 * @route POST /api/notifications/rejected-post
 * @param {Request} req - Objeto de solicitud Express (body: userId, restaurantId, postId)
 * @param {Response} res - Objeto de respuesta Express
 * @returns {void} Devuelve la notificación creada
 */
const notiRejectedPost = asyncHandler(async (req, res) => {
  const { userId, restaurantId, postId } = req.body;
  const restaurant = await Restaurant.findById(restaurantId);
  const user = await User.findById(userId);
  const post = await Post.findById(postId);
  if (!restaurant) {
    throw new Error("Restaurant not found");
  }
  if (!user) {
    throw new Error("User not found");
  }
  if (!post) {
    throw new Error("Post not found");
  }
  const newNotification = new Notifications({
    notifUserId: userId,
    notifRestaurantId: restaurantId,
    notifPostId: postId,
    type: "post",
    message: `Your post has been rejected at ${restaurant.name}.`,
    date: Date.now(),
  });
  res.status(200).json(await newNotification.save());
});

export {
  getNotifications,
  notiAcceptedReservation,
  notiRejectedReservation,
  notiacceptedPost,
  notiRejectedPost,
  notiCompletedReservation,
  notiCanceledReservation,
};
