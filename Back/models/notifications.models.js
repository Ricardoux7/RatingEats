import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    notifUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    notifRestaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
    type: { 
        type: String, 
        enum: ['reservation', 'review', 'post', 'other'],
    },
    message: { type: String, required: true, trim: true, maxlength: 500 },
    read: { type: Boolean, default: false },
    date: { type: Date, default: Date.now }
});

export default mongoose.model('Notification', notificationSchema);