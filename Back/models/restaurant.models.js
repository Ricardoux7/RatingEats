import mongoose from "mongoose";

const imagesSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
        trim: true,
    },
    alt: { type: String, required: false, trim: true, maxlength: 200 },
    size: { type: Number },
    isHeader: { type: Boolean, default: false },
    uploadedAt: { type: Date, default: Date.now }
})

const restaurantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 100,
        validate: {
            validator: function(v){
                return RegExp(/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü0-9 !@#$%^&*()_+={}\[\]:;"'<>,.?\/\\|-]{2,100}$/).test(v);
            },
            message: props => `${props.value} is not a valid restaurant name`
        }
    },
    description: {
        type: String,
        required: true,
        trim: true,
        minlength: 10,
        maxlength: 500
    },
    adress: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 200
    },
    categories: {
        type: [String],
        required: true,
        validate: {
            validator: function(v) {
                if(!Array.isArray(v) || v.length === 0) return false;
                const cleaned = v.map(s => typeof s === 'string' ? s.trim() : '');
                if (cleaned.some(s => s.length === 0)) return false;
                const lower = cleaned.map(s => s.toLowerCase());
                return new Set(lower).size === lower.length;
            },
            message: props => `Categories must be non-empty strings and contain no duplicates`
        }
    },
    geoLocation: {
        type: [String],
        required: true,
        validate: {
            validator: function(v){
                if (!Array.isArray(v) || v.length === 0) return false;
                const regex = /^[-+]?([1-9]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/;
                return v.every(loc => typeof loc === 'string' && regex.test(loc.trim()));
            },
            message: props => `Each geoLocation must be a valid "lat,long" string and there must be at least one location`
        }
    },
    schedule: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 200,
        validate: {
            validator: function(v){
                return typeof v === 'string' && v.length >= 3 && v.length <= 200;
            },
            message: props => `Schedule must be a string between 3 and 200 characters`
        }
    },
    capacity: {
        type: Number,
        required: true,
        min: 1,
        max: 150,
        validate: {
            validator: Number.isInteger,
            message: props => `${props.value} is not an integer`
        }
    },
    images: {
        type: [imagesSchema],
    },
    menu: {
        type: [imagesSchema],
        default: []
    },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate: {
            validator: function(v){
                return RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).test(v);
            },
            message: props => `${props.value} is not a valid email`
        }
    },
    phoneNumber: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        validate: {
            validator: function(v){
                return RegExp(/^(\+58[\s-]?)?(0?4(1[2-9]|2[0-9]|3[0-9]|4[0-8])[\s-]?[0-9]{3}[\s-]?[0-9]{4})$/).test(v);
            },
            message: props => `${props.value} is not a valid phone number`
        }
    },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    isDeleted: {
        type: Boolean,
        default: false, 
        index: true
    },
    averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    numReviews: {
        type: Number,
        default: 0,
        min: 0
    },
    deletedAt: {
        type: Date,
        default: null
    }
}, { timestamps: true });

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

export default Restaurant;
export { imagesSchema };
