/**
 * @file menuController.controllers.js
 * @module controllers/menuController
 * @description Controladores para gestión de imágenes del menú de restaurantes.
 */

import asyncHandler from "express-async-handler";
import Restaurant from "../models/restaurant.models.js";
import { unlink } from "fs/promises";
import path from "path";

/**
 * Sube imágenes al menú de un restaurante.
 * @function uploadMenuImage
 * @route POST /api/restaurants/:id/menu
 * @param {Request} req - Objeto de solicitud Express (archivos en req.files)
 * @param {Response} res - Objeto de respuesta Express
 * @returns {void} Devuelve mensaje y las imágenes subidas
 */
const uploadMenuImage = asyncHandler(async (req, res) => {
  const restaurantId = req.params.id;
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "No images uploaded" });
  }
  const { alt, isHeader } = req.body;
  const images = req.files.map((file) => ({
    url: `/uploads/menu/${file.filename}`,
    alt: alt || "",
    size: file.size,
    isHeader: isHeader === "true" || isHeader === true,
  }));
  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant || restaurant.isDeleted) {
    res.status(404);
    throw new Error("Restaurant not found");
  }
  if (!restaurant.menu) {
    restaurant.menu = [];
  }
  restaurant.menu.push(...images);
  await restaurant.save();
  res.status(201).json({
    message: "Menu images uploaded successfully",
    images,
  });
});

/**
 * Elimina una imagen del menú de un restaurante.
 * @function deleteMenuImage
 * @route DELETE /api/restaurants/:id/menu/:imageId
 * @param {Request} req - Objeto de solicitud Express (params: id, imageId)
 * @param {Response} res - Objeto de respuesta Express
 * @returns {void} Devuelve mensaje de éxito o error
 */
const deleteMenuImage = asyncHandler(async (req, res) => {
  const restaurantId = req.params.id;
  const imageId = req.params.imageId;
  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant || restaurant.isDeleted) {
    res.status(404);
    throw new Error("Restaurant not found");
  }
  const image = restaurant.menu.find((img) => img._id?.toString() === imageId);
  if (!image) {
    res.status(404);
    throw new Error("Image not found");
  }
  const fileName = image.url.split("/").pop();
  try {
    const filePath = path.join(process.cwd(), "uploads", fileName);
    await unlink(filePath);
  } catch (error) {
    if (error.code === "ENOENT") {
      console.warn(
        "File not found, might have been already deleted:",
        fileName
      );
    } else {
      console.error("Error deleting file:", error);
      res.status(500);
      throw new Error("Error deleting image file");
    }
  }
  const result = await Restaurant.updateOne(
    { _id: restaurantId },
    { $pull: { menu: { _id: imageId } } }
  );
  if (result.modifiedCount === 0) {
    res.status(404);
    throw new Error("Image record not found in database or update failed.");
  }
  res.status(204).json({ message: "Menu image deleted successfully" });
});

/**
 * Obtiene todas las imágenes del menú de un restaurante.
 * @function getMenuImages
 * @route GET /api/restaurants/:id/menu
 * @param {Request} req - Objeto de solicitud Express (params: id)
 * @param {Response} res - Objeto de respuesta Express
 * @returns {void} Devuelve un array de imágenes del menú
 */
const getMenuImages = asyncHandler(async (req, res) => {
  const restaurantId = req.params.id;
  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant || restaurant.isDeleted) {
    res.status(404);
    throw new Error("Restaurant not found");
  }
  res.status(200).json(restaurant.menu);
});

/**
 * Reemplaza una imagen existente del menú de un restaurante.
 * @function changeThisImage
 * @route PUT /api/restaurants/:id/menu/:imageId
 * @param {Request} req - Objeto de solicitud Express (params: id, imageId, archivo en req.file)
 * @param {Response} res - Objeto de respuesta Express
 * @returns {void} Devuelve mensaje y la nueva imagen
 */
const changeThisImage = asyncHandler(async (req, res) => {
  const restaurantId = req.params.id;
  const imageId = req.params.imageId;
  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant || restaurant.isDeleted) {
    res.status(404);
    throw new Error("Restaurant not found");
  }
  const imageIndex = restaurant.menu.findIndex(
    (img) => img._id?.toString() === imageId
  );
  if (imageIndex === -1) {
    res.status(404);
    throw new Error("Image not found");
  }
  const oldImage = restaurant.menu[imageIndex];
  const oldFileName = oldImage.url.split("/").pop();

  try {
    const filePath = path.join(process.cwd(), "uploads", "menu", oldFileName);
    await unlink(filePath);
  } catch (error) {
    if (error.code === "ENOENT") {
      console.warn(
        "File not found, might have been already deleted:",
        oldFileName
      );
    }
  }

  if (!req.file) {
    res.status(400);
    throw new Error("No image uploaded to replace the existing one.");
  }

  const { alt, isHeader } = req.body;
  const newImage = {
    url: `/uploads/menu/${req.file.filename}`,
    alt: alt || oldImage.alt,
    size: req.file.size,
    isHeader: isHeader === "true" || isHeader === true,
  };

  restaurant.menu[imageIndex] = {
    ...restaurant.menu[imageIndex]._doc,
    ...newImage,
  };
  await restaurant.save();
  res
    .status(200)
    .json({ message: "Menu image replaced successfully", newImage });
});

export { uploadMenuImage, deleteMenuImage, getMenuImages, changeThisImage };
