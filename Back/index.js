/**
 * API Principal de RatingEats
 *
 * Este archivo inicializa y configura el servidor Express para la API de RatingEats.
 * Incluye la configuración de CORS, rutas principales, manejo de errores y conexión a MongoDB.
 *
 * Middlewares:
 * - `cors`: Permite solicitudes desde orígenes permitidos.
 * - `express.json()`: Parsea JSON en las solicitudes.
 * - `errorHandler`: Manejo centralizado de errores.
 *
 * Rutas principales:
 * - `/api/profile`: Gestión de perfil de usuario.
 * - `/api/auth`: Registro y autenticación de usuarios.
 * - `/api/restaurants`: Gestión de restaurantes.
 * - `/api`: Publicaciones (posts).
 * - `/api/reservations`: Reservaciones de restaurantes.
 * - `/api/filter` y `/search`: Filtrado y búsqueda de restaurantes.
 * - `/api/notifications`: Notificaciones de usuario y restaurante.
 * - `/uploads`: Archivos estáticos de imágenes.
 *
 * Conexión:
 * - Conecta a MongoDB y levanta el servidor en el puerto especificado.
 *
 * @module index
 */

import express from "express";
import connection from "./config/database.js";
import "dotenv/config";
import profileRoutes from "./routes/profileRoutes.routes.js";
import authRoutes from "./routes/authRoutes.routes.js";
import restaurantRoutes from "./routes/restaurantRoutes.routes.js";
import FilterRouter from "./routes/filterRoutes.routes.js";
import routerPosts from "./routes/postsRoutes.routes.js";
import reservationRoutes from "./routes/reservationRoutes.routes.js";
import errorHandler from "./middlewares/profileMiddleware.middlewares.js";
import routerNotifications from "./routes/notificationRoutes.routes.js";
import cors from "cors";
import path from "path";

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = ["http://localhost:3000", "http://localhost:5173"];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"), false);
    }
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use("/api/profile", profileRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api", routerPosts);
app.use("/api/reservations", reservationRoutes);
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/api/filter", FilterRouter);
app.use("/search", FilterRouter);
app.use("/api/notifications", routerNotifications);
app.use(errorHandler);

app.get("/", (req, res) => res.send("RatingEats API OK"));

connection.once("open", () => {
  console.log("MongoDB conectado (desde index.js)");
  app.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`)
  );
});

connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});
