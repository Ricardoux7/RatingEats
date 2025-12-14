/**
 * @file review.models.js
 * @module models/review
 * @description Modelo Mongoose para reviews de restaurantes.
 */

import mongoose from "mongoose";
//import mongoosePaginate from "mongoose-paginate-v2";

/**
 * Esquema de review para la base de datos.
 * Incluye rating, comentario, estado y relaciones.
 * @constant
 */
const reviewSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

//reviewSchema.plugin(mongoosePaginate);
/**
 * Modelo Mongoose para reviews.
 * @type {mongoose.Model}
 */
export const Review = mongoose.model("Review", reviewSchema);
