/**
 * @file posts.models.js
 * @module models/posts
 * @description Modelo Mongoose para publicaciones (posts) de restaurantes y usuarios.
 */

import mongoose from "mongoose";
import { imagesSchema } from "./restaurant.models.js";
//import mongoosePaginate from "mongoose-paginate-v2";
/**
 * Esquema de publicación (post) para la base de datos.
 * Incluye validaciones, imagen, estado y relaciones.
 * @constant
 */
const postSchema = new mongoose.Schema(
  {
    authorUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    authorRestaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
    },
    image: {
      type: imagesSchema,
      required: true,
    },
    content: {
      type: String,
      required: false,
      trim: true,
      maxlength: 500,
    },
    state: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    validate: {
      validator: function () {
        return !!(this.authorUserId || this.authorRestaurantId);
      },
      message: "The post must be made by a user or a restaurant.",
    },
    timestamps: true,
  }
);

//postSchema.plugin(mongoosePaginate);
/**
 * Modelo Mongoose para publicaciones (posts).
 * @type {mongoose.Model}
 */
export default mongoose.model("Post", postSchema);
