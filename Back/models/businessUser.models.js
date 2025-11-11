import mongoose from "mongoose";

const businessUserSchema = new mongoose.Schema({
    user: {
            type: String,
            required: true,
            trim: true,
    },
    restaurant: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Restaurant', required: true 
    },
    role: {
        type: String,
        enum: ['owner', 'operator'],
        required: true,
        default: 'operator'
    },

});

const BusinessUser = mongoose.model("BusinessUser", businessUserSchema);

export default BusinessUser;