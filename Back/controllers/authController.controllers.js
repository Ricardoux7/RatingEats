import jwt from 'jsonwebtoken';
import { User } from '../models/users.models.js';
import asyncHandler from 'express-async-handler'; 

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

const registerUser = asyncHandler(async (req, res) => { 
    const { name, lastName, email, password, username } = req.body;
    let userExists = await User.findOne({ $or: [{ email }, { username }] });
    
    if (userExists) {
        res.status(400); 
        throw new Error('Email or username already in use'); 
    }
    
    const newUser = await User.create({ name, lastName, email, password, username });

    if (newUser) {
        const token = generateToken(newUser._id);
        res.status(201).json({
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            username: newUser.username,
            token,
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
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
            token,
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

export { registerUser, loginUser };