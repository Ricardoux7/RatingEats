/**
 * @file database.js
 * @module config/database
 * @description Configuración y conexión a la base de datos MongoDB usando Mongoose.
 * @requires mongoose
 * @requires dotenv
 */


import mongoose from "mongoose";
import dotenv from "dotenv";


dotenv.config();

/**
 * Inicializa la conexión a MongoDB usando la URI definida en las variables de entorno.
 * Muestra mensajes en consola según el resultado de la conexión.
 */
mongoose
  .connect(process.env.MONGODB_URI, {})
  .then(() => console.log("Conectado a MongoDB"))
  .catch((err) => console.error("Error de conexión", err));


/**
 * Instancia de la conexión activa de Mongoose.
 * @type {mongoose.Connection}
 */
const connection = mongoose.connection;


export default connection;
