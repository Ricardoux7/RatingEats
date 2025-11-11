import jwt from 'jsonwebtoken';
import { User } from '../models/users.models.js';
import BusinessUser from '../models/businessUser.models.js';

const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userDocument = await User.findById(decoded.id).select('-password');
            if (!userDocument) {
                return res.status(401).json({ message: 'Not authorized, user not found in DB' }); 
            }
            let user = userDocument.toObject();
            const businessUser = await BusinessUser.findOne({ user: user._id });
            if (businessUser) {
                user.role = businessUser.role;
                user.restaurantId = businessUser.restaurant; 
            }
            req.user = user;
            next();
        } catch (error){
            console.error('Token verification failed:', error);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }
    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

export { protect };