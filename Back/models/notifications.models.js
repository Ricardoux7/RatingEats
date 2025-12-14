/**
 * @file notifications.models.js
 * @module models/notifications
 * @description Modelo Mongoose para notificaciones de usuarios y restaurantes.
 */

import mongoose from "mongoose";
//import mongoosePaginate from "mongoose-paginate-v2";
/**
 * Esquema de notificación para la base de datos.
 * Incluye tipo, mensaje, estado de lectura y relaciones.
 * @constant
 */
const notificationSchema = new mongoose.Schema({
  notifUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  notifRestaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
  },
  type: {
    type: String,
    enum: ["reservation", "review", "post", "other"],
  },
  message: { type: String, required: true, trim: true, maxlength: 500 },
  read: { type: Boolean, default: false },
  date: { type: Date, default: Date.now },
});

//notificationSchema.plugin(mongoosePaginate);
/**
 * Modelo Mongoose para notificaciones.
 * @type {mongoose.Model}
 */
export default mongoose.model("Notification", notificationSchema);
