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
import mongoose from "mongoose";
import cors from "cors";
import path from "path";

const app = express();


const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://ratingeats.vercel.app",
  "https://rating-eats.vercel.app"
];

const corsOptions = {
  origin: (origin, callback) => {
    if (
      !origin ||
      allowedOrigins.includes(origin) ||
      /^https:\/\/rating-eats.*\.vercel\.app$/.test(origin)
    ) {
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

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://";

mongoose.connect(MONGODB_URI)
  .then(() => console.log("MongoDB conectado desde Vercel"))
  .catch(err => console.error("Error MongoDB:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

export default app;