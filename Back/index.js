import express from 'express';
import connection from './config/database.js';
import 'dotenv/config';
import profileRoutes from './routes/profileRoutes.routes.js';
import authRoutes from './routes/authRoutes.routes.js'; 
import restaurantRoutes from './routes/restaurantRoutes.routes.js';
import routerPosts from './routes/postsRoutes.routes.js';
import reservationRoutes from './routes/reservationRoutes.routes.js';

const app = express();
const PORT = process.env.PORT || 3000;
import cors from 'cors';

const corsOptions = {
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.use(express.json());
app.use('/api/profile', profileRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api', routerPosts);
app.use('/api/reservations', reservationRoutes);

app.get('/', (req, res) => res.send('RatingEats API OK'));

connection.once('open', () => {
  console.log('MongoDB conectado (desde index.js)');
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
});

connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});