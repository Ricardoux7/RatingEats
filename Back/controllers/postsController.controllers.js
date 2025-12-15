/**
 * @file postsController.controllers.js
 * @module controllers/postsController
 * @description Controladores para gestión de posts de restaurantes (crear, aceptar, rechazar, eliminar, listar).
 */

import Post from "../models/posts.models.js";
import Restaurant from "../models/restaurant.models.js";
import asyncHandler from "express-async-handler";

/**
 * Crea un nuevo post para un restaurante.
 * @function createPost
 * @route POST /api/restaurants/:id/posts
 * @param {Request} req - Objeto de solicitud Express (archivo en req.file, body: content)
 * @param {Response} res - Objeto de respuesta Express
 * @returns {void} Devuelve el post creado y mensaje
 */
const createPost = asyncHandler(async (req, res) => {
  try {
    const restaurantId = req.params.id || req.params.restaurantId;
    const { content, image } = req.body;
    const authorUserId = req.user._id;
    const userRole = req.user.role;
    const userRestaurantId = req.user.restaurantId;

    if (!image) {
      res.status(400);
      throw new Error("Image URL is required");
    }
    const restaurant = await Restaurant.findOne({
      _id: restaurantId,
      isDeleted: false,
    });
    if (!restaurant) {
      res.status(404);
      throw new Error("Restaurant not found");
    }

    const imageObj = {
      url: image,
      alt: content ? content.substring(0, 200) : "Post image",
    };
    const isOperatorOfDestination =
      (userRole === "owner" || userRole === "operator") &&
      String(userRestaurantId) === String(restaurantId);
    let postState = isOperatorOfDestination ? "accepted" : "pending";

    const post = new Post({
      authorUserId: authorUserId,
      authorRestaurantId: restaurantId,
      image: imageObj,
      content: content || "",
      state: postState,
    });

    await post.save();
    await Restaurant.findOneAndUpdate(
      { _id: restaurantId },
      { $push: { posts: post._id } }
    );

    let message;
    if (isOperatorOfDestination) {
      message = "Post created and uploaded successfully";
    } else {
      message = "The post was sent and is pending acceptance.";
    }

    res.status(201).json({ message, post });
  } catch (error) {
    throw error;
  }
});

/**
 * Obtiene todos los posts aceptados de un restaurante.
 * @function getPostsByRestaurant
 * @route GET /api/restaurants/:id/posts
 * @param {Request} req - Objeto de solicitud Express (params: id)
 * @param {Response} res - Objeto de respuesta Express
 * @returns {void} Devuelve un array de posts aceptados
 */
const getPostsByRestaurant = asyncHandler(async (req, res) => {
  const restaurantId = req.params.id || req.params.restaurantId;
  const restaurant = await Restaurant.findOne({
    _id: restaurantId,
    isDeleted: false,
  });
  if (!restaurant) {
    res.status(404);
    throw new Error("Restaurant not found");
  }

  const posts = await Post.find({
    authorRestaurantId: restaurantId,
    state: "accepted",
    deleted: { $ne: true },
  });
  res.status(200).json(posts);
});

/**
 * Acepta un post pendiente.
 * @function acceptPost
 * @route PATCH /api/posts/:postId/accept
 * @param {Request} req - Objeto de solicitud Express (params: postId)
 * @param {Response} res - Objeto de respuesta Express
 * @returns {void} Devuelve el post aceptado y mensaje
 */
const acceptPost = asyncHandler(async (req, res) => {
  const postId = req.params.postId;
  const post = await Post.findById(postId);

  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }
  if (post.deleted) {
    res.status(404);
    throw new Error("Post was deleted before.");
  }
  if (post.state === "accepted") {
    return res.status(200).json({ message: "Post is already accepted." });
  }

  if (post.state === "rejected") {
    res.status(400);
    throw new Error("Cannot accept a rejected post.");
  }
  if (req.user.state === "rejected") {
    res.status(403);
    throw new Error("User is rejected and cannot accept posts.");
  }
  post.state = "accepted";
  await post.save();

  res.status(200).json({
    message: "Post accepted and visible to the public.",
    post,
  });
});

/**
 * Rechaza un post pendiente.
 * @function rejectPost
 * @route PATCH /api/posts/:postId/reject
 * @param {Request} req - Objeto de solicitud Express (params: postId)
 * @param {Response} res - Objeto de respuesta Express
 * @returns {void} Devuelve mensaje de rechazo
 */
const rejectPost = asyncHandler(async (req, res) => {
  const postId = req.params.postId;
  const post = await Post.findById(postId);
  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }
  if (post.deleted) {
    res.status(404);
    throw new Error("Post was deleted before.");
  }
  if (post.state === "rejected") {
    return res.status(200).json({ message: "Post is already rejected." });
  }
  if (post.state === "accepted") {
    res.status(400);
    throw new Error("Cannot reject an accepted post.");
  }
  post.state = "rejected";
  await post.save();
  res.status(200).json({
    message: "Post has been rejected succesfully",
  });
});

/**
 * Elimina (soft delete) un post.
 * @function deletePost
 * @route DELETE /api/posts/:postId/:restaurantId
 * @param {Request} req - Objeto de solicitud Express (params: postId, restaurantId)
 * @param {Response} res - Objeto de respuesta Express
 * @returns {void} Devuelve status 204 si se elimina correctamente
 */
const deletePost = asyncHandler(async (req, res) => {
  const postId = req.params.postId;
  const currentUserId = req.user._id;
  const post = await Post.findById(postId);
  if (!post || post.deleted) {
    res.status(404);
    throw new Error("Post not found");
  }
  const isPostAuthor = String(post.authorUserId) === String(currentUserId);
  const isOperator = req.user.role === "owner" || req.user.role === "operator";

  if (!isOperator) {
    if (!isPostAuthor || post.state !== "pending") {
      res.status(403);
      throw new Error(
        "User not authorized: Post is no longer pending or you are not the author."
      );
    }
  }
  post.deleted = true;
  await post.save();

  if (post.authorRestaurantId) {
    await Restaurant.findByIdAndUpdate(post.authorRestaurantId, {
      $pull: { posts: postId },
    });
  }

  res.status(204).send();
});

/**
 * Obtiene todos los posts pendientes de un restaurante.
 * @function getPendingPosts
 * @route GET /api/posts/:restaurantId/pending
 * @param {Request} req - Objeto de solicitud Express (params: restaurantId)
 * @param {Response} res - Objeto de respuesta Express
 * @returns {void} Devuelve un array de posts pendientes
 */
const getPendingPosts = asyncHandler(async (req, res) => {
  const restaurantId = req.params.restaurantId;
  const posts = await Post.find({
    authorRestaurantId: restaurantId,
    state: "pending",
  }).populate("authorUserId", "username");
  if (!posts) {
    res.status(404);
    throw new Error("No pending posts found for this restaurant.");
  }
  res.status(200).json(posts);
});

export {
  createPost,
  getPostsByRestaurant,
  acceptPost,
  rejectPost,
  deletePost,
  getPendingPosts,
};
