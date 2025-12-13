import asyncHandler from 'express-async-handler';
import BusinessUser from '../models/businessUser.models.js';
import Post from '../models/posts.models.js';
import { Reservation } from '../models/reservations.models.js';

const hasRestaurantRole = (requiredRoles, idParamName = 'id') => asyncHandler(async (req, res, next) => {
    const userId = req.user._id;
    let restaurantId;    
    const resourceId = req.params[idParamName];

    if (!resourceId) {
        return res.status(400).json({ message: `Missing required ID parameter: ${idParamName}.` });
    }
    if (idParamName === 'postId') {
        const post = await Post.findById(resourceId).select('authorRestaurantId');
        if (!post) {
            return res.status(404).json({ message: 'Post not found.' });
        }
        restaurantId = post.authorRestaurantId;
        req.post = post; 
    }
    else if (idParamName === 'reservationId') {
        const reservation = await Reservation.findById(resourceId).select('restaurantId');
        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found.' });
        }
        restaurantId = reservation.restaurantId;
    }
    else {
        restaurantId = resourceId;
    }
    if (!restaurantId) {
        return res.status(400).json({ message: "Missing restaurant ID in request parameters." });
    }
    const businessUser = await BusinessUser.findOne({ user: userId, restaurant: restaurantId });
    if (!businessUser) {
        return res.status(403).json({ message: 'You have no permission to manage this restaurant' });
    }
    const userRole = businessUser.role;

    if (requiredRoles.includes(userRole)) {
        req.userRole = userRole; 
        return next();
    }
    return res.status(403).json({ message: 'You have no permission to perform this action' });
})

export { hasRestaurantRole };