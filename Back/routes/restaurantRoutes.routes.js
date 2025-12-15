/**
 * @fileoverview Routes for managing restaurants, including creation, updates, deletion,
 * image uploads, operator management, reviews, and menu images.
 * 
 * @module routes/restaurantRoutes
 */

import express from "express";

/**
 * POST / - Create a new restaurant.
 * GET / - Retrieve all restaurants.
 * 
 * @name /
 * @function
 * @memberof module:routes/restaurantRoutes
 * @param {Function} protect - Middleware to protect routes.
 * @param {Array} restaurantValidationRules - Validation rules for restaurant creation.
 * @param {Function} validate - Middleware to validate request data.
 * @param {Function} createRestaurant - Controller to handle restaurant creation.
 * @param {Function} getAllRestaurants - Controller to retrieve all restaurants.
 */

/**
 * GET /:id - Retrieve a specific restaurant by ID.
 * PATCH /:id - Update a specific restaurant by ID.
 * DELETE /:id - Delete a specific restaurant by ID.
 * 
 * @name /:id
 * @function
 * @memberof module:routes/restaurantRoutes
 * @param {Function} protect - Middleware to protect routes.
 * @param {Function} hasRestaurantRole - Middleware to check user roles.
 * @param {Array} updateRestaurantValidationRules - Validation rules for restaurant updates.
 * @param {Function} validate - Middleware to validate request data.
 * @param {Function} updateRestaurant - Controller to handle restaurant updates.
 * @param {Function} deleteRestaurant - Controller to handle restaurant deletion.
 */

/**
 * PATCH /:id/images/banner - Update the banner image of a restaurant.
 * 
 * @name /:id/images/banner
 * @function
 * @memberof module:routes/restaurantRoutes
 * @param {Function} protect - Middleware to protect routes.
 * @param {Function} hasRestaurantRole - Middleware to check user roles.
 * @param {Function} multerErrorHandler - Middleware to handle multer errors.
 * @param {Function} updateBannerImage - Controller to update the banner image.
 */

/**
 * POST /:id/images - Upload an image for a restaurant.
 * 
 * @name /:id/images
 * @function
 * @memberof module:routes/restaurantRoutes
 * @param {Function} protect - Middleware to protect routes.
 * @param {Function} hasRestaurantRole - Middleware to check user roles.
 * @param {Function} multerErrorHandler - Middleware to handle multer errors.
 * @param {Function} uploadImage - Controller to handle image uploads.
 */

/**
 * GET /:idRestaurant/operators - Retrieve operators for a specific restaurant.
 * 
 * @name /:idRestaurant/operators
 * @function
 * @memberof module:routes/restaurantRoutes
 * @param {Function} protect - Middleware to protect routes.
 * @param {Function} hasRestaurantRole - Middleware to check user roles.
 * @param {Function} getOperators - Controller to retrieve operators.
 */

/**
 * DELETE /:id/operators/:businessUserId - Remove an operator from a restaurant.
 * 
 * @name /:id/operators/:businessUserId
 * @function
 * @memberof module:routes/restaurantRoutes
 * @param {Function} protect - Middleware to protect routes.
 * @param {Function} hasRestaurantRole - Middleware to check user roles.
 * @param {Function} deleteOperator - Controller to remove an operator.
 */

/**
 * POST /:id/operator - Add an operator to a restaurant.
 * 
 * @name /:id/operator
 * @function
 * @memberof module:routes/restaurantRoutes
 * @param {Function} protect - Middleware to protect routes.
 * @param {Function} hasRestaurantRole - Middleware to check user roles.
 * @param {Function} addOperator - Controller to add an operator.
 */

/**
 * POST /:id/reviews - Create a review for a restaurant.
 * GET /:id/reviews - Retrieve reviews for a restaurant.
 * 
 * @name /:id/reviews
 * @function
 * @memberof module:routes/restaurantRoutes
 * @param {Function} protect - Middleware to protect routes.
 * @param {Function} createReview - Controller to create a review.
 * @param {Function} getReviewsByRestaurant - Controller to retrieve reviews.
 */

/**
 * DELETE /reviews/:reviewId - Delete a specific review.
 * 
 * @name /reviews/:reviewId
 * @function
 * @memberof module:routes/restaurantRoutes
 * @param {Function} protect - Middleware to protect routes.
 * @param {Function} deleteReview - Controller to delete a review.
 */

/**
 * POST /:id/menu/images - Upload menu images for a restaurant.
 * GET /:id/menu/images - Retrieve menu images for a restaurant.
 * 
 * @name /:id/menu/images
 * @function
 * @memberof module:routes/restaurantRoutes
 * @param {Function} protect - Middleware to protect routes.
 * @param {Function} hasRestaurantRole - Middleware to check user roles.
 * @param {Function} multerErrorHandler - Middleware to handle multer errors.
 * @param {Function} uploadMenuImage - Controller to upload menu images.
 * @param {Function} getMenuImages - Controller to retrieve menu images.
 */

/**
 * DELETE /:id/menu/images/:imageId - Delete a specific menu image.
 * PATCH /:id/menu/images/:imageId - Update a specific menu image.
 * 
 * @name /:id/menu/images/:imageId
 * @function
 * @memberof module:routes/restaurantRoutes
 * @param {Function} protect - Middleware to protect routes.
 * @param {Function} hasRestaurantRole - Middleware to check user roles.
 * @param {Function} multerErrorHandler - Middleware to handle multer errors.
 * @param {Function} deleteMenuImage - Controller to delete a menu image.
 * @param {Function} changeThisImage - Controller to update a menu image.
 */

/**
 * GET /manage/restaurant/:id - Retrieve restaurants to manage for a specific user.
 * 
 * @name /manage/restaurant/:id
 * @function
 * @memberof module:routes/restaurantRoutes
 * @param {Function} protect - Middleware to protect routes.
 * @param {Function} hasRestaurantRole - Middleware to check user roles.
 * @param {Function} getRestaurantsToManage - Controller to retrieve restaurants to manage.
 */
import {
  createRestaurant,
  getRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getAllRestaurants,
  uploadImage,
  deleteOperator,
  addOperator,
  getRestaurantsToManage,
  updateBannerImage,
  getOperators,
} from "../controllers/restaurantController.controllers.js";
import {
  restaurantValidationRules,
  validate,
  updateRestaurantValidationRules,
} from "../middlewares/restaurantValidation.middlewares.js";
import { protect, isOwner } from "../middlewares/authMiddleware.middlewares.js";
import { hasRestaurantRole } from "../middlewares/roleMiddleware.middlewares.js";
import {
  createReview,
  getReviewsByRestaurant,
  deleteReview,
} from "../controllers/reviewsController.controllers.js";
import {
  uploadMenuImage,
  deleteMenuImage,
  getMenuImages,
  changeThisImage,
} from "../controllers/menuController.controllers.js";
import uploadMenu from "../middlewares/MiddlewaresImages/multerMenuConfig.middlewares.js";
const router = express.Router();

router
  .route("/")
  .post(protect, ...restaurantValidationRules, validate, createRestaurant)
  .get(getAllRestaurants);
router
  .route("/:id")
  .get(getRestaurant)
  .patch(
    protect,
    hasRestaurantRole(["owner", "operator"]),
    ...updateRestaurantValidationRules,
    validate,
    updateRestaurant
  )
  .delete(protect, hasRestaurantRole(["owner"]), isOwner, deleteRestaurant);
router
  .route("/:id/images/banner")
  .patch(
    protect,
    hasRestaurantRole(["owner", "operator"]),
    updateBannerImage
  );
router
  .route("/:id/images")
  .post(
    protect,
    hasRestaurantRole(["owner", "operator"]),
    uploadImage
  );
router
  .route("/:idRestaurant/operators")
  .get(protect, hasRestaurantRole(["owner"], "idRestaurant"), getOperators);
router
  .route("/:id/operators/:businessUserId")
  .delete(protect, hasRestaurantRole(["owner"], "id"), deleteOperator);
router
  .route("/:id/operator")
  .post(protect, hasRestaurantRole(["owner"], "id"), addOperator);
router
  .route("/:id/reviews")
  .post(protect, createReview)
  .get(getReviewsByRestaurant);
router.route("/reviews/:reviewId").delete(protect, deleteReview);
router
  .route("/:id/menu/images")
  .post(
    protect,
    hasRestaurantRole(["owner", "operator"]),
    uploadMenuImage
  );
router
  .route("/:id/menu/images/:imageId")
  .delete(protect, hasRestaurantRole(["owner", "operator"]), deleteMenuImage)
  .patch(
    protect,
    hasRestaurantRole(["owner", "operator"]),
    changeThisImage
  );
router
  .route("/:id/menu/images")
  .get(protect, hasRestaurantRole(["owner", "operator"]), getMenuImages);
router
  .route("/manage/restaurant/:id")
  .get(
    protect,
    hasRestaurantRole(["owner", "operator"]),
    getRestaurantsToManage
  );
export default router;
