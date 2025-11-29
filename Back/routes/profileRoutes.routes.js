import express from 'express';
import { protect } from '../middlewares/authMiddleware.middlewares.js';
import { getProfile, editProfile, addFavoriteRestaurants, removeFavoriteRestaurants, getFavoriteRestaurants, getReviews } from '../controllers/profileController.controllers.js';

const ProfileRouter = express.Router();

ProfileRouter.route('/').get(protect, getProfile).patch(protect, editProfile);
ProfileRouter.route('/favorites').get(protect, getFavoriteRestaurants);
ProfileRouter.route('/favorites/:restaurantId')
    .post(protect, addFavoriteRestaurants)
    .delete(protect, removeFavoriteRestaurants);
ProfileRouter.route('/reviews').get(protect, getReviews);
export default ProfileRouter;