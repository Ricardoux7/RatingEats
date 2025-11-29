import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
mongoose.connect(process.env.MONGODB_URI, {})
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.error('Error de conexión', err))

const connection = mongoose.connection;

export default connection;