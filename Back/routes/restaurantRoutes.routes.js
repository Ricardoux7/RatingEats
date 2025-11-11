import express from 'express';
import { createRestaurant, getRestaurant, updateRestaurant, deleteRestaurant, getAllRestaurants, uploadImage, deleteOperator, addOperator } from '../controllers/restaurantController.controllers.js';
import { restaurantValidationRules, validate, updateRestaurantValidationRules } from '../middlewares/restaurantValidation.middlewares.js';
import { protect } from '../middlewares/authMiddleware.middlewares.js';
import upload from '../middlewares/MiddlewaresImages/multerConfig.middlewares.js';
import { multerErrorHandler } from '../middlewares/MiddlewaresImages/multerErrorMiddleware.middlewares.js';
import { hasRestaurantRole } from '../middlewares/roleMiddleware.middlewares.js';
import { createReview, getReviewsByRestaurant, deleteReview } from '../controllers/reviewsController.controllers.js';
import { uploadMenuImage, deleteMenuImage } from '../controllers/menuController.controllers.js';
import uploadMenu from '../middlewares/MiddlewaresImages/multerMenuConfig.middlewares.js';
const router = express.Router();

router.route('/').post(protect, ...restaurantValidationRules, validate, createRestaurant).get(getAllRestaurants);
router.route('/:id')
    .get(getRestaurant)
    .patch(protect, hasRestaurantRole(['owner', 'operator']), ...updateRestaurantValidationRules, validate, updateRestaurant)
    .delete(protect, hasRestaurantRole(['owner']), deleteRestaurant);
router.route('/:id/images').post(protect, hasRestaurantRole(['owner', 'operator']), multerErrorHandler(upload.single('image')), uploadImage);
router.route('/:id/operators/:businessUserId') 
    .delete(
        protect, 
        hasRestaurantRole(['owner'], 'id'),
        deleteOperator
    );
router.route('/:id/operator').post(
    protect, 
    hasRestaurantRole(['owner'], 'id'), 
    addOperator
);
router.route('/:id/reviews').post(protect, createReview).get(getReviewsByRestaurant);
router.route('/reviews/:reviewId').delete(protect, deleteReview);
router.route('/:id/menu/images').post(protect, hasRestaurantRole(['owner', 'operator']), multerErrorHandler(uploadMenu.single('image')), uploadMenuImage);
router.route('/:id/menu/images/:imageId').delete(protect, hasRestaurantRole(['owner', 'operator']), deleteMenuImage);

export default router;