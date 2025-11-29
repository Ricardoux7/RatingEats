import express from 'express';
import connection from './config/database.js';
import 'dotenv/config';
import profileRoutes from './routes/profileRoutes.routes.js';
import authRoutes from './routes/authRoutes.routes.js'; 
import restaurantRoutes from './routes/restaurantRoutes.routes.js';
import routerPosts from './routes/postsRoutes.routes.js';
import reservationRoutes from './routes/reservationRoutes.routes.js';
import errorHandler from './middlewares/profileMiddleware.middlewares.js';
import cors from 'cors';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
];

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin) return callback(null, true); 
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'), false); 
        }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use('/api/profile', profileRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api', routerPosts);
app.use('/api/reservations', reservationRoutes);
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use(errorHandler);



app.get('/', (req, res) => res.send('RatingEats API OK'));

connection.once('open', () => {
  console.log('MongoDB conectado (desde index.js)');
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
});

connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});