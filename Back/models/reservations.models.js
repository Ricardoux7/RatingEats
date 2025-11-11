import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema({
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    dateReservation: { type: Date, required: true },
    time: { type: String, required: true },
    numberOfGuests: { type: Number, required: true, min: 1 },
    state: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled', 'completed', 'rejected'],
        default: 'pending'
    },
    customerName: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: function(v){
                return RegExp(/^(?!.*\s{2})[A-Za-zÁÉÍÓÚáéíóúÑñÜü]{2,}(?:\s+(?:de|del|la|las|los|y|e|d'|[A-Za-zÁÉÍÓÚáéíóúÑñÜü]{2,})){1,5}$/).test(v);
            },
            message: props => `${props.value} is not a valid customer name`
        },
    },
    phoneNumber: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: function(v){
                return RegExp(/^(\+58[\s-]?)?(0?4(1[2-9]|2[0-9]|3[0-9]|4[0-8])[\s-]?[0-9]{3}[\s-]?[0-9]{4})$/).test(v);
            },
            message: props => `${props.value} is not a valid phone number`
        }
    }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

export const Reservation = mongoose.model('Reservation', reservationSchema);