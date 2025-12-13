import express from 'express';
import { getNotifications, notiAcceptedReservation, notiRejectedReservation, notiacceptedPost, notiRejectedPost, notiCompletedReservation, notiCanceledReservation } from '../controllers/notificationController.controllers.js';
import { protect } from '../middlewares/authMiddleware.middlewares.js';
const routerNotifications = express.Router();

routerNotifications.route('/').get(protect, getNotifications);
routerNotifications.route('/reservation/accepted').post(protect, notiAcceptedReservation);
routerNotifications.route('/reservation/rejected').post(protect, notiRejectedReservation);
routerNotifications.route('/reservation/completed').post(protect, notiCompletedReservation);
routerNotifications.route('/reservation/canceled').post(protect, notiCanceledReservation);
routerNotifications.route('/post/accepted').post(protect, notiacceptedPost);
routerNotifications.route('/post/rejected').post(protect, notiRejectedPost);
export default routerNotifications;