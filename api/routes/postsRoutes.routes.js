/**
 * Posts Routes
 *
 * Este módulo define las rutas para la gestión de publicaciones (posts) de restaurantes y usuarios.
 * Incluye rutas para crear, obtener, aceptar, rechazar y eliminar posts, así como obtener posts pendientes.
 *
 * Middleware:
 * - `protect`: Asegura que el usuario esté autenticado.
 * - `uploadPost`: Maneja la carga de imágenes para posts.
 * - `hasRestaurantRole`: Verifica el rol del usuario sobre el restaurante/post.
 *
 * Rutas:
 * - POST `/:id/posts`: Crea un nuevo post para un restaurante (requiere autenticación y carga de imagen).
 * - GET `/:id/posts`: Obtiene los posts de un restaurante.
 * - DELETE `/posts/:postId/:restaurantId`: Elimina un post específico de un restaurante (requiere autenticación).
 * - PATCH `/posts/:postId/accept`: Acepta un post pendiente (requiere autenticación y rol adecuado).
 * - PATCH `/posts/:postId/reject`: Rechaza un post pendiente (requiere autenticación y rol adecuado).
 * - GET `/posts/:restaurantId/pending`: Obtiene los posts pendientes de un restaurante (requiere autenticación y rol adecuado).
 *
 * @module postsRoutes
 */
import express from "express";
import {
  createPost,
  getPostsByRestaurant,
  acceptPost,
  rejectPost,
  deletePost,
  getPendingPosts,
} from "../controllers/postsController.controllers.js";
import uploadPost from "../middlewares/MiddlewaresImages/multerPostConfig.middlewares.js";
import { protect } from "../middlewares/authMiddleware.middlewares.js";
import { hasRestaurantRole } from "../middlewares/roleMiddleware.middlewares.js";

const routerPosts = express.Router();

routerPosts
  .route("/:id/posts")
  .post(protect, uploadPost.single("image"), createPost)
  .get(getPostsByRestaurant);
routerPosts.route("/posts/:postId/:restaurantId").delete(protect, deletePost);
routerPosts
  .route("/posts/:postId/accept")
  .patch(
    protect,
    hasRestaurantRole(["owner", "operator"], "postId"),
    acceptPost
  );
routerPosts
  .route("/posts/:postId/reject")
  .patch(
    protect,
    hasRestaurantRole(["owner", "operator"], "postId"),
    rejectPost
  );
routerPosts
  .route("/posts/:restaurantId/pending")
  .get(
    protect,
    hasRestaurantRole(["owner", "operator"], "restaurantId"),
    getPendingPosts
  );
export default routerPosts;
