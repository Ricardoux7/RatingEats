import asyncHandler from 'express-async-handler';
import Notifications from '../models/notifications.models.js';
import Restaurant from '../models/restaurant.models.js';
import { User } from '../models/users.models.js';
import { Reservation } from '../models/reservations.models.js';
import Post from '../models/posts.models.js';

const getNotifications = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  if (!userId) {
    res.status(400);
    throw new Error('User not found');
  }
  const notifications = await Notifications.find({ notifUserId: userId });
  res.status(200).json(notifications);
});

const notiAcceptedReservation = asyncHandler(async (req, res) => {
  const { userId, restaurantId, reservationId } = req.body;
  const restaurant = await Restaurant.findById(restaurantId);
  const user = await User.findById(userId);
  const reservation = await Reservation.findOne({ _id: reservationId, userId: userId, restaurantId: restaurantId });
  if (!restaurant) {
    throw new Error('Restaurant not found');
  }
  if(!user) {
    throw new Error('User not found');
  }
  if(!reservation) {
    throw new Error('Reservation not found');
  }
  const newNotification = new Notifications({
    notifUserId: userId,
    notifRestaurantId: restaurantId,
    type: 'reservation',
    message: `Your reservation has been accepted at ${restaurant.name} on ${reservation.dateReservation ? reservation.dateReservation.toISOString().slice(0, 10) : ''} at ${reservation.time || ''} for ${reservation.numberOfGuests || ''} people for ${reservation.customerName || ''}.`,
    date: Date.now(),
  })
  res.status(200).json(await newNotification.save());
});

const notiRejectedReservation = asyncHandler(async (req, res) => {
  const { userId, restaurantId, reservationId } = req.body;
  const restaurant = await Restaurant.findById(restaurantId);
  const user = await User.findById(userId);
  const reservation = await Reservation.findOne({ _id: reservationId, userId: userId, restaurantId: restaurantId });
  if (!restaurant) {
    throw new Error('Restaurant not found');
  } 
  if(!user) {
    throw new Error('User not found');
  }
  if(!reservation) {
    throw new Error('Reservation not found');
  }
  const newNotification = new Notifications({
    notifUserId: userId,
    notifRestaurantId: restaurantId,
    type: 'reservation',
    message: `Your reservation has been rejected at ${restaurant.name} on ${reservation.dateReservation ? reservation.dateReservation.toISOString().slice(0, 10) : ''} at ${reservation.time || ''} for ${reservation.numberOfGuests || ''} people for ${reservation.customerName || ''}.`,
    date: Date.now(),
  });
  res.status(200).json(await newNotification.save());
});

const notiCanceledReservation = asyncHandler(async (req, res) => {
  const { userId, restaurantId, reservationId } = req.body;
  const restaurant = await Restaurant.findById(restaurantId);
  const user = await User.findById(userId);
  const reservation = await Reservation.findOne({ _id: reservationId, userId: userId, restaurantId: restaurantId });
  if (!restaurant) {
    throw new Error('Restaurant not found');
  }
  if(!user) {
    throw new Error('User not found');
  }
  if(!reservation) {
    throw new Error('Reservation not found');
  }
  const newNotification = new Notifications({
    notifUserId: userId,
    notifRestaurantId: restaurantId,
    type: 'reservation',
    message: `Your reservation has been canceled at ${restaurant.name} on ${reservation.dateReservation ? reservation.dateReservation.toISOString().slice(0, 10) : ''} at ${reservation.time || ''} for ${reservation.numberOfGuests || ''} people for ${reservation.customerName || ''}.`,
    date: Date.now(),
  });
  res.status(200).json(await newNotification.save());
});

const notiCompletedReservation = asyncHandler(async (req, res) => {
  const { userId, restaurantId, reservationId } = req.body;
  const restaurant = await Restaurant.findById(restaurantId);
  const user = await User.findById(userId);
  const reservation = await Reservation.findOne({ _id: reservationId, userId: userId, restaurantId: restaurantId });

  if (!restaurant) {
    throw new Error('Restaurant not found');
  }
  if(!user) {
    throw new Error('User not found');
  }
  if(!reservation) {
    throw new Error('Reservation not found');
  }
  const newNotification = new Notifications({
    notifUserId: userId,
    notifRestaurantId: restaurantId,
    type: 'reservation',
    message: `Your reservation has been completed at ${restaurant.name} on ${reservation.dateReservation ? reservation.dateReservation.toISOString().slice(0, 10) : ''} at ${reservation.time || ''} for ${reservation.numberOfGuests || ''} people for ${reservation.customerName || ''}.`,
    date: Date.now(),
  });
  res.status(200).json(await newNotification.save());
});

const notiacceptedPost = asyncHandler(async (req, res) => {
  const { userId, restaurantId, postId } = req.body;
  const restaurant = await Restaurant.findById(restaurantId);
  const user = await User.findById(userId);
  const post = await Post.findById(postId);
  if (!restaurant) {
    throw new Error('Restaurant not found');
  }
  if (!user) {
    throw new Error('User not found');
  } 
  if (!post) {
    throw new Error('Post not found');
  }
  const newNotification = new Notifications({
    notifUserId: userId,
    notifRestaurantId: restaurantId,
    notifPostId: postId,
    type: 'post',
    message: `Your post has been accepted at ${restaurant.name}.`,
    date: Date.now(),
  });
  res.status(200).json(await newNotification.save());
});

const notiRejectedPost = asyncHandler(async (req, res) => {
  const { userId, restaurantId, postId } = req.body;
  const restaurant = await Restaurant.findById(restaurantId);
  const user = await User.findById(userId);
  const post = await Post.findById(postId); 
  if (!restaurant) {
    throw new Error('Restaurant not found');
  }
  if (!user) {
    throw new Error('User not found');
  }
  if (!post) {
    throw new Error('Post not found');
  }
  const newNotification = new Notifications({
    notifUserId: userId,
    notifRestaurantId: restaurantId,
    notifPostId: postId,
    type: 'post',
    message: `Your post has been rejected at ${restaurant.name}.`,
    date: Date.now(),
  });
  res.status(200).json(await newNotification.save());
});

export { getNotifications, notiAcceptedReservation, notiRejectedReservation, notiacceptedPost, notiRejectedPost, notiCompletedReservation, notiCanceledReservation };