/**
 * @file businessUser.models.js
 * @module models/businessUser
 * @description Modelo Mongoose para relación usuario-restaurante y roles (owner/operator).
 */

import mongoose from "mongoose";
//import mongoosePaginate from "mongoose-paginate-v2";
/**
 * Esquema de usuario de negocio para la base de datos.
 * Relaciona usuarios con restaurantes y define su rol.
 * @constant
 */
const businessUserSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    trim: true,
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
  },
  role: {
    type: String,
    enum: ["owner", "operator"],
    required: true,
    default: "operator",
  },
});

//businessUserSchema.plugin(mongoosePaginate);
/**
 * Modelo Mongoose para usuarios de negocio (owner/operator).
 * @type {mongoose.Model}
 */
const BusinessUser = mongoose.model("BusinessUser", businessUserSchema);

//businessUserSchema.plugin(mongoosePaginate);
export default BusinessUser;
