/**
 * @file restaurantController.controllers.js
 * @module controllers/restaurantController
 * @description Controladores para gestión de restaurantes, operadores e imágenes.
 */

import Restaurant from "../models/restaurant.models.js";
import BusinessUser from "../models/businessUser.models.js";
import { User } from "../models/users.models.js";
import asyncHandler from "express-async-handler";

/**
 * Crea un nuevo restaurante.
 * @function createRestaurant
 * @route POST /api/restaurants
 * @param {Request} req - Objeto de solicitud Express (usuario autenticado, body: datos del restaurante)
 * @param {Response} res - Objeto de respuesta Express
 * @returns {void} Devuelve el restaurante creado y el usuario owner
 */
const createRestaurant = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    adress,
    categories,
    geoLocation,
    schedule,
    capacity,
    email,
    phoneNumber,
  } = req.body;
  const ownerId = req.user._id;

  if (
    !name ||
    !description ||
    !adress ||
    !categories ||
    !geoLocation ||
    !schedule ||
    !capacity ||
    !email ||
    !phoneNumber
  ) {
    throw new Error("All fields are required to create a restaurant");
  }
  const restaurant = await Restaurant.create({
    name,
    description,
    adress,
    categories,
    geoLocation,
    schedule,
    capacity,
    email,
    phoneNumber,
    ownerId: ownerId,
  });
  const businessUser = await BusinessUser.create({
    user: ownerId,
    restaurant: restaurant._id,
    role: "owner",
    isPrimary: true,
  });
  res.status(201).json({ restaurant, businessUser });
});

/**
 * Obtiene un restaurante por ID.
 * @function getRestaurant
 * @route GET /api/restaurants/:id
 * @param {Request} req - Objeto de solicitud Express (params: id)
 * @param {Response} res - Objeto de respuesta Express
 * @returns {void} Devuelve el restaurante encontrado
 */
const getRestaurant = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findOne({
    _id: req.params.id,
    isDeleted: false,
  });
  if (restaurant) {
    res.status(200).json(restaurant);
  } else {
    res.status(404);
    throw new Error("Restaurant not found");
  }
});

/**
 * Actualiza los datos de un restaurante.
 * @function updateRestaurant
 * @route PATCH /api/restaurants/:id
 * @param {Request} req - Objeto de solicitud Express (params: id, body: campos a actualizar)
 * @param {Response} res - Objeto de respuesta Express
 * @returns {void} Devuelve el restaurante actualizado
 */
const updateRestaurant = asyncHandler(async (req, res) => {
  const restaurantId = req.params.id;
  const restaurant = await Restaurant.findOne({
    _id: restaurantId,
    isDeleted: false,
  });
  if (!restaurant) {
    res.status(404);
    throw new Error("Restaurant not found");
  }
  const fields = [
    "name",
    "description",
    "adress",
    "categories",
    "schedule",
    "capacity",
    "phoneNumber",
  ];
  const updates = {};
  for (const field of fields) {
    const newValue = req.body[field];
    const oldValue = restaurant[field];
    if (newValue === undefined || newValue === "") continue;
    if (Array.isArray(oldValue) && Array.isArray(newValue)) {
      if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
        updates[field] = newValue;
      }
    } else if (typeof oldValue === "number") {
      if (Number(newValue) !== oldValue) {
        updates[field] = newValue;
      }
    } else if (newValue !== oldValue) {
      updates[field] = newValue;
    }
  }
  if (Object.keys(updates).length === 0) {
    res.status(400);
    throw new Error("No changes detected to update.");
  }

  const updatedRestaurant = await Restaurant.findByIdAndUpdate(
    restaurantId,
    { $set: updates },
    { new: true, runValidators: true }
  );
  res.status(200).json(updatedRestaurant);
});

/**
 * Elimina (soft delete) un restaurante.
 * @function deleteRestaurant
 * @route DELETE /api/restaurants/:id
 * @param {Request} req - Objeto de solicitud Express (params: id)
 * @param {Response} res - Objeto de respuesta Express
 * @returns {void} Devuelve mensaje de éxito
 */
const deleteRestaurant = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findOne({
    _id: req.params.id,
    isDeleted: false,
  });
  if (restaurant) {
    restaurant.isDeleted = true;
    restaurant.deletedAt = new Date();
    await restaurant.save();
    res.status(204).json({ message: "Restaurant deleted successfully" });
  } else {
    res.status(404);
    throw new Error("Restaurant not found");
  }
});

/**
 * Obtiene todos los restaurantes paginados.
 * @function getAllRestaurants
 * @route GET /api/restaurants
 * @param {Request} req - Objeto de solicitud Express (query: page, limit)
 * @param {Response} res - Objeto de respuesta Express
 * @returns {void} Devuelve un array de restaurantes y meta-información
 */
const getAllRestaurants = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const skip = (page - 1) * limit;
  const baseFilter = { isDeleted: false };
  const restaurants = await Restaurant.find(baseFilter).limit(limit).skip(skip);
  const totalCount = await Restaurant.countDocuments(baseFilter);
  const totalPages = Math.ceil(totalCount / limit);
  res.status(200).json({
    restaurants: restaurants,
    page: page,
    totalPages: totalPages,
    totalCount: totalCount,
    limit: limit,
  });
});

/**
 * Sube una imagen al restaurante (solo URL, no archivos locales).
 * @function uploadImage
 * @route POST /api/restaurants/:id/images
 * @param {Request} req - Objeto de solicitud Express (params: id, body: image URL)
 * @param {Response} res - Objeto de respuesta Express
 * @returns {void} Devuelve mensaje y la imagen subida
 */
const uploadImage = asyncHandler(async (req, res) => {
  const restaurantId = req.params.id;
  const { image, alt, isHeader, replaceMainImage } = req.body;

  if (!image) {
    res.status(400);
    throw new Error("No image URL provided");
  }

  const restaurant = await Restaurant.findOne({
    _id: restaurantId,
    isDeleted: false,
  });

  if (!restaurant) {
    res.status(404);
    throw new Error("Restaurant not found");
  }

  const newImage = {
    url: image,
    alt: alt || restaurant.name + " image",
    isHeader: isHeader === "true" || isHeader === true,
  };

  if (replaceMainImage) {
    // Sobrescribe la imagen principal
    restaurant.images = [newImage];
  } else {
    if (!restaurant.images) restaurant.images = [];
    restaurant.images.push(newImage);
  }
  await restaurant.save();

  res.status(200).json({
    message: replaceMainImage ? "Main image replaced successfully" : "Image uploaded successfully",
    image: newImage,
  });
});

/**
 * Agrega un operador a un restaurante.
 * @function addOperator
 * @route POST /api/restaurants/:id/operators
 * @param {Request} req - Objeto de solicitud Express (params: id, body: email)
 * @param {Response} res - Objeto de respuesta Express
 * @returns {void} Devuelve el operador creado
 */
const addOperator = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const restaurantId = req.params.id;

  if (!email) {
    res.status(400);
    throw new Error("Email is required to add an operator");
  }

  const userToAdd = await User.findOne({ email });

  if (!userToAdd) {
    res.status(404);
    throw new Error("User not found");
  }

  const isOwner = await BusinessUser.findOne({
    restaurant: restaurantId,
    user: req.user._id,
    role: "owner",
  });

  if (!isOwner) {
    res.status(403);
    throw new Error("Only the owner can add operators");
  }

  const existingRelationship = await BusinessUser.findOne({
    restaurant: restaurantId,
    user: userToAdd._id,
  });

  if (existingRelationship) {
    return res
      .status(400)
      .json({ message: "This user is already associated with the restaurant" });
  }

  const restaurant = await Restaurant.findOne({
    _id: restaurantId,
    isDeleted: false,
  });

  if (!restaurant) {
    res.status(404);
    throw new Error("Restaurant not found");
  }

  const userId = userToAdd._id;
  const businessUser = await BusinessUser.create({
    user: userId,
    restaurant: restaurantId,
    role: "operator",
    isPrimary: false,
  });

  res.status(201).json({ businessUser });
});

/**
 * Elimina un operador de un restaurante.
 * @function deleteOperator
 * @route DELETE /api/restaurants/:id/operators/:businessUserId
 * @param {Request} req - Objeto de solicitud Express (params: id, businessUserId)
 * @param {Response} res - Objeto de respuesta Express
 * @returns {void} Devuelve status 204 si se elimina correctamente
 */
const deleteOperator = asyncHandler(async (req, res) => {
  const businessUserId = req.params.businessUserId;
  const restaurantId = req.params.id;
  const businessUser = await BusinessUser.findOne({
    _id: businessUserId,
    restaurant: restaurantId,
  });
  if (!businessUser) {
    res.status(404);
    throw new Error("Operator relationship not found");
  }
  if (businessUser.role === "owner") {
    res.status(400);
    throw new Error("Cannot remove owner from the restaurant");
  }
  await businessUser.deleteOne();
  res.status(204).send();
});

/**
 * Obtiene los operadores de un restaurante.
 * @function getOperators
 * @route GET /api/restaurants/:idRestaurant/operators
 * @param {Request} req - Objeto de solicitud Express (params: idRestaurant)
 * @param {Response} res - Objeto de respuesta Express
 * @returns {void} Devuelve un array de operadores
 */
const getOperators = asyncHandler(async (req, res) => {
  const restaurantId = req.params.idRestaurant;
  const isOwner = await BusinessUser.findOne({
    restaurant: restaurantId,
    user: req.user._id,
    role: "owner",
  });

  if (!isOwner) {
    res.status(403);
    throw new Error("Only the owner can view operators");
  }
  const operators = await BusinessUser.find({
    restaurant: restaurantId,
    role: "operator",
  }).populate({
    path: "user",
    select: "email name lastName username",
  });
  const operatorData = operators.map((op) => ({
    _id: op._id,
    email: op.user?.email,
    name: op.user?.name,
    lastName: op.user?.lastName,
    username: op.user?.username,
  }));
  res.status(200).json(operatorData);
});

/**
 * Obtiene el restaurante que el usuario puede gestionar.
 * @function getRestaurantsToManage
 * @route GET /api/restaurants/:id/manage
 * @param {Request} req - Objeto de solicitud Express (usuario autenticado, params: id)
 * @param {Response} res - Objeto de respuesta Express
 * @returns {void} Devuelve el restaurante gestionado
 */
const getRestaurantsToManage = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const restaurantId = req.params.id;
  if (!userId) {
    res.status(401);
    throw new Error("User not authenticated");
  }

  if (!restaurantId) {
    res.status(400);
    throw new Error("Restaurant ID is required");
  }

  const restaurant = await Restaurant.findOne({
    _id: restaurantId,
    isDeleted: false,
  });
  if (!restaurant) {
    res.status(404);
    throw new Error("Restaurant not found");
  }

  const businessUser = await BusinessUser.findOne({
    user: userId,
    restaurant: restaurantId,
  }).populate("restaurant");
  if (businessUser) {
    res.status(200).json(businessUser.restaurant);
  } else {
    res.status(403);
    throw new Error("No management rights for this restaurant");
  }
});

/**
 * Sube o actualiza la imagen de banner del restaurante (solo URL, no archivos locales).
 * @function updateBannerImage
 * @route PATCH /api/restaurants/:id/images/banner
 * @param {Request} req - Objeto de solicitud Express (params: id, body: image URL)
 * @param {Response} res - Objeto de respuesta Express
 * @returns {void} Devuelve el restaurante actualizado con el nuevo banner
 */
const updateBannerImage = asyncHandler(async (req, res) => {
  const restaurantId = req.params.id;
  const { image, alt } = req.body;

  if (!image) {
    res.status(400);
    throw new Error("No image URL provided for banner update.");
  }

  const restaurant = await Restaurant.findOne({
    _id: restaurantId,
    isDeleted: false,
  });
  if (!restaurant) {
    res.status(404);
    throw new Error("Restaurant not found");
  }
  if (restaurant.images && restaurant.images.length > 0) {
    restaurant.images = restaurant.images.filter((img) => !img.isHeader);
  } else {
    restaurant.images = [];
  }

  const newBannerImage = {
    url: image,
    alt: alt || restaurant.name + " banner image",
    isHeader: true,
  };
  restaurant.images.push(newBannerImage);
  await restaurant.save();
  res.status(200).json({
    message: "Banner image updated successfully",
    bannerUrl: newBannerImage.url,
    restaurant,
  });
});

export {
  createRestaurant,
  getRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getAllRestaurants,
  uploadImage,
  addOperator,
  deleteOperator,
  getRestaurantsToManage,
  updateBannerImage,
  getOperators,
};
