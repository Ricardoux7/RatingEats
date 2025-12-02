import express from 'express';
import { createPost, getPostsByRestaurant, acceptPost, rejectPost, deletePost, getPendingPosts } from '../controllers/postsController.controllers.js';
import uploadPost from '../middlewares/MiddlewaresImages/multerPostConfig.middlewares.js';
import { protect } from '../middlewares/authMiddleware.middlewares.js';
import { hasRestaurantRole } from '../middlewares/roleMiddleware.middlewares.js';

const routerPosts = express.Router();

routerPosts.route('/:id/posts').post(protect, uploadPost.single('image'), createPost).get(getPostsByRestaurant);
routerPosts.route('/posts/:postId/:restaurantId').delete(protect, deletePost);
routerPosts.route('/posts/:postId/accept').patch(protect, hasRestaurantRole(['owner', 'operator'], 'postId'), acceptPost);
routerPosts.route('/posts/:postId/reject').patch(protect, hasRestaurantRole(['owner', 'operator'], 'postId'), rejectPost);
routerPosts.route('/posts/:restaurantId/pending').get(protect, hasRestaurantRole(['owner', 'operator'], 'restaurantId'), getPendingPosts);
export default routerPosts;