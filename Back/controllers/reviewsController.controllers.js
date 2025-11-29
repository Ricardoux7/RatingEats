import asyncHandler from "express-async-handler";
import { Review } from "../models/review.models.js";
import Restaurant from "../models/restaurant.models.js";


const createReview = asyncHandler(async (req, res) => {
    const restaurantId = req.params.id;
    const { rating, comment } = req.body;
    const userId = req.user._id;
    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) {
        res.status(404);
        throw new Error('Restaurant not found');
    }

    if(rating < 1 || rating > 5) {
        res.status(400);
        throw new Error('Rating must be between 1 and 5');
    }

    try {
        const review = new Review({
            restaurantId,
            userId,
            rating,
            comment
        });
        await review.save();
        
        await updateRating(restaurantId);
        
        res.status(201).json({ message: 'Review created and rating updated.', review });

    } catch (error) {
        if (error.code === 11000) {
            res.status(409);
            throw new Error('You have already submitted a review for this restaurant');
        }
        throw error;
    }
});
const getReviewsByRestaurant = asyncHandler(async (req, res) => {
    const restaurantId = req.params.id;
    const reviews = await Review.find({ restaurantId, deleted: false }).populate('userId', 'username');
    res.json(reviews);
});
const deleteReview = asyncHandler(async (req, res) => {
    const { reviewId } = req.params;
    const userId = req.user._id;
    const review = await Review.findById(reviewId);
    if (!review || review.deleted) {
        res.status(404);
        throw new Error('Review not found');
    }
    if (review.userId.toString() !== userId.toString()) {
        res.status(403);
        throw new Error('Not authorized to delete this review');
    }
    review.deleted = true;
    await review.save();
    await updateRating(review.restaurantId);
    res.status(204).send();
});

const updateRating = (async (restaurantId) => {
    const reviews = await Review.find({ restaurantId, deleted: false });
    if (reviews.length === 0) {
        await Restaurant.findByIdAndUpdate(restaurantId, { averageRating: 0, numReviews: 0 });
        return;
    }
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const average = Math.round((totalRating / reviews.length) * 10) / 10;
    await Restaurant.findByIdAndUpdate(restaurantId, { averageRating: average, numReviews: reviews.length });
})
export { createReview, getReviewsByRestaurant, deleteReview, updateRating };