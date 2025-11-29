import jwt from 'jsonwebtoken';
import { User } from '../models/users.models.js';
import asyncHandler from 'express-async-handler'; 

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const extractMongooseErrorMessage = (err) => {
    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern)[0];
        let capitalizedField = field.charAt(0).toUpperCase() + field.slice(1);
        if (capitalizedField === 'Lastname') {
            capitalizedField = 'Last Name';
        }
    return [`${capitalizedField} is already in use.`];
    }
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map((e) => e.message);
        return errors;
    }
    return ['An unexpected error occurred during registration.'];
};

const registerUser = asyncHandler(async (req, res) => { 
    const { name, lastName, email, password, username } = req.body;
    try {
        const newUser = await User.create({ name, lastName, email, password, username });
        const token = generateToken(newUser._id);
        res.status(201).json({
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            username: newUser.username,
            token,
        });
    } catch (error) {
        const errors = extractMongooseErrorMessage(error);
        res.status(400).json({ errors });
        return;
    }
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    
    let user = await User.findOne({ email });
    
    if (user && (await user.matchPassword(password))) {
        const token = generateToken(user._id);
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token,
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

export { registerUser, loginUser };