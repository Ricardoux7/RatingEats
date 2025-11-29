import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';


const userSchema = new mongoose.Schema({
        name: { 
            type: String, 
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 50,
            validate: {
                validator: function(v){
                    return /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü]+(?: [A-Za-zÁÉÍÓÚáéíóúÑñÜü]+)*$/.test(v);
                },
                message: props => `${props.value} is not a valid name, It must contain only letters.`
            }
        },
        lastName: {
            type: String, 
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 50,
            validate: {
                validator: function(v){
                    return RegExp(/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü]{2,30}(?: (?:de|del|la|las|los|y|e|d')? ?[A-Za-zÁÉÍÓÚáéíóúÑñÜü]{2,30}){0,2}$/).test(v);
                },
                message: props => `${props.value} is not a valid last name`
            }
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            validate: {
                validator: function(v){
                    return RegExp(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/).test(v);
                },
                message: props => `${props.value} is not a valid email`
            }
        },
        password: {
            type: String,
            required: function() {
                return this.isNew; 
            },
            minlength: 8,
            validate: {
                validator: function(v){
                    if (!this.isModified('password')) return true;
                    return RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/).test(v);
                },
                message: props => `Password must be 8-20 characters long, include uppercase and lowercase letters, a number, and a special character.`
            },
        },
        username: {
            type: String,
            required: true,
            unique: { value: true, message: 'Username already in use' },
            trim: true,
            validate: {
                validator: function(v){
                    return RegExp(/^[a-z0-9]{4,20}$/).test(v);
                },
                message: props => `Username ${props.value} is not valid. It should contain only lowercase letters and numbers (4-20 characters).`
                
            }
        },
        favoriteRestaurants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' }],
        reservations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reservation' }],
        biography: {
            type: String,
            maxlength: 500
        },
        deleted: { type: Boolean, default: false }
}, { timestamps: true });

userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
})

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export { User };