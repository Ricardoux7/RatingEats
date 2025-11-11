import mongoose from 'mongoose';

mongoose.connect('mongodb://localhost:27017/rating_eats')
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.error('Error de conexión', err))

const connection = mongoose.connection;

export default connection;