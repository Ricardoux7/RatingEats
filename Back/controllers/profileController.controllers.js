import { User } from '../models/users.models.js';
import { Review } from '../models/review.models.js';
import asyncHandler from 'express-async-handler'; 

const getProfile = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const user = await User.findById(userId).select('-password');
    if (user) {
        res.json(user);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

const editProfile = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }
    const fields = ['name', 'lastName', 'username', 'biography'];
    const updates = {};
    for (const field of fields){
        if (req.body[field] !== user[field] && req.body[field] !== undefined && (field !== 'password' || req.body[field] !== '')) {
            updates[field] = req.body[field];
        }
    }
    if (Object.keys(updates).length === 0) {
        res.status(400);
        throw new Error('No changes detected to update.');
    }
    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: updates },
        { new: true, runValidators: true }
    );
    if (updatedUser) {
        res.json(updatedUser);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

const addFavoriteRestaurants = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { restaurantId } = req.params;
    const user = await User.findById(userId);
    if (user) {
        if (!user.favoriteRestaurants.includes(restaurantId)) {
            user.favoriteRestaurants.push(restaurantId);
            await user.save();
            res.status(200).json({ message: 'Restaurant added to favorites.' });
        } else {
            res.status(400);
            throw new Error('Restaurant already in favorites.');
        }
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

const removeFavoriteRestaurants = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { restaurantId } = req.params;
    const user = await User.findById(userId);
    if (user) {
        const index = user.favoriteRestaurants.indexOf(restaurantId);
        if (index > -1 ){
            user.favoriteRestaurants.splice(index, 1);
            await user.save();
            res.status(200).json({ message: 'Restaurant removed from favorites.' });
        } else {
            res.status(400);
            throw new Error('Restaurant not found in favorites.');
        }
    } else {
        res.status(404);
        throw new Error('User not found');
    }
})

const getFavoriteRestaurants = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const user = await User.findById(userId).populate('favoriteRestaurants');
    if (user) {
        res.json(user.favoriteRestaurants);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
})

const getReviews = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const userReviews = await Review.find({ userId: userId }).populate('restaurantId', 'name');
    if (userReviews && userReviews.length > 0) {
        res.json(userReviews);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
})

export { getProfile, editProfile, addFavoriteRestaurants, removeFavoriteRestaurants, getFavoriteRestaurants, getReviews };