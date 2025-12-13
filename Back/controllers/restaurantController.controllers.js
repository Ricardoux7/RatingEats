import Restaurant  from '../models/restaurant.models.js';
import BusinessUser from '../models/businessUser.models.js';
import { User }  from '../models/users.models.js';
import asyncHandler from 'express-async-handler';
import fs from 'fs';
import path from 'path';

const createRestaurant = asyncHandler(async (req, res) => {
    const { name, description, adress, categories, geoLocation, schedule, capacity, email, phoneNumber  } = req.body;
    const ownerId = req.user._id;

    if(!name || !description || !adress || !categories || !geoLocation || !schedule || !capacity || !email || !phoneNumber){
        throw new Error('All fields are required to create a restaurant');
    }
        const restaurant = await Restaurant.create({
            name,
            description,
            adress,
            categories,
            geoLocation,
            schedule,
            capacity,
            email,
            phoneNumber,
            ownerId: ownerId,
        });
        const businessUser = await BusinessUser.create({
            user: ownerId,
            restaurant: restaurant._id,
            role: 'owner',
            isPrimary: true,
        });
        res.status(201).json({ restaurant, businessUser });
});

const getRestaurant = asyncHandler(async (req, res) => {
    const restaurant = await Restaurant.findOne({
        _id: req.params.id,
        isDeleted: false
    });
    if (restaurant) {
        res.status(200).json(restaurant);

    } else {
        res.status(404);
        throw new Error('Restaurant not found');
    }
});

const updateRestaurant = asyncHandler(async (req, res) => {
    const restaurantId = req.params.id;
    const restaurant = await Restaurant.findOne({
        _id: restaurantId,
        isDeleted: false 
    });
    if(!restaurant){ 
        res.status(404);
        throw new Error('Restaurant not found');
    }
    const fields = [ 'name', 'description', 'adress', 'categories', 'schedule', 'capacity', 'phoneNumber' ];
    const updates = {};
    for (const field of fields) {
        const newValue = req.body[field];
        const oldValue = restaurant[field];
        if (newValue === undefined || newValue === '') continue;
        if (Array.isArray(oldValue) && Array.isArray(newValue)) {
            if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
                updates[field] = newValue;
            }
        }
        else if (typeof oldValue === 'number') {
            if (Number(newValue) !== oldValue) {
                updates[field] = newValue;
            }
        }
        else if (newValue !== oldValue) {
            updates[field] = newValue;
        }
    }
    if (Object.keys(updates).length === 0) {
        res.status(400);
        throw new Error('No changes detected to update.');
    }

    const updatedRestaurant = await Restaurant.findByIdAndUpdate(restaurantId, { $set: updates }, { new: true, runValidators: true });
    res.status(200).json(updatedRestaurant);
});

const deleteRestaurant = asyncHandler(async (req, res) => {
    const restaurant = await Restaurant.findOne({
        _id: req.params.id,
        isDeleted: false
    });
    if (restaurant) {
        restaurant.isDeleted = true;
        restaurant.deletedAt = new Date();
        await restaurant.save();
        res.status(204).json({ message: 'Restaurant deleted successfully' });
        
    } else {
        res.status(404);
        throw new Error('Restaurant not found');
    }
});

const getAllRestaurants = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) || 12; 
    const skip = (page - 1) * limit; 
    const baseFilter = { isDeleted: false };
    const restaurants = await Restaurant.find(baseFilter)
        .limit(limit)
        .skip(skip);
    const totalCount = await Restaurant.countDocuments(baseFilter);
    const totalPages = Math.ceil(totalCount / limit);
    res.status(200).json({
        restaurants: restaurants,
        page: page,
        totalPages: totalPages,
        totalCount: totalCount,
        limit: limit
    });
});

const uploadImage = asyncHandler(async (req, res) => {

    const filePath = req.file ? path.join(process.cwd(), req.file.path) : null;

    try{
        if (!req.file) {
        res.status(400);
        throw new Error('No image file provided');
    }

    const restaurantId = req.params.id;
    const { filename, size } = req.file;

    const restaurant = await Restaurant.findOne({
        _id: restaurantId,
        isDeleted: false
    });

    if (!restaurant){
        res.status(404);
        throw new Error('Restaurant not found');
    }

    const newImage = {
        url: `/uploads/${filename}`,
        alt: req.body.alt || restaurant.name + ' image', 
        size: req.file.size,
        isHeader: req.body.isHeader === 'true'
    };

    restaurant.images.push(newImage);
    await restaurant.save();

    res.status(200).json({ 
        message: 'Image uploaded successfully', 
        image: newImage 
    });
    }
    catch (error) {
        if (filePath && fs.existsSync(filePath)) {
            fs.unlinkSync(filePath); 
        }
        throw error;
    }
});

const addOperator = (asyncHandler(async (req, res) => {
    const { email } = req.body;
    const restaurantId = req.params.id;

    if (!email) {
        res.status(400);
        throw new Error('Email is required to add an operator');
    }

    const userToAdd = await User.findOne({ email });

    if (!userToAdd) {
        res.status(404);
        throw new Error('User not found');
    }

    const isOwner = await BusinessUser.findOne({ restaurant: restaurantId, user: req.user._id, role: 'owner' });

    if (!isOwner) {
        res.status(403);
        throw new Error('Only the owner can add operators');
    }

    const existingRelationship = await BusinessUser.findOne({
        restaurant: restaurantId,
        user: userToAdd._id,
    });

    if (existingRelationship) {
        return res.status(400).json({ message: 'This user is already associated with the restaurant' });
    }

    const restaurant = await Restaurant.findOne({
        _id: restaurantId,
        isDeleted: false
    });

    if (!restaurant) {
        res.status(404);
        throw new Error('Restaurant not found');
    }

    const userId = userToAdd._id;
    const businessUser = await BusinessUser.create({
        user: userId,
        restaurant: restaurantId,
        role: 'operator',
        isPrimary: false,
    });

    res.status(201).json({ businessUser });
}));

const deleteOperator = asyncHandler(async (req, res) => {
    const businessUserId = req.params.businessUserId;
    const restaurantId = req.params.id;
    const businessUser = await BusinessUser.findOne({ 
        _id: businessUserId,
        restaurant: restaurantId
    });
    if (!businessUser) {
        res.status(404);
        throw new Error('Operator relationship not found');
    }
    if (businessUser.role === 'owner') {
        res.status(400);
        throw new Error('Cannot remove owner from the restaurant');
    }
    await businessUser.deleteOne();
    res.status(204).send();
});

const getOperators = asyncHandler(async (req, res) => {
    const restaurantId = req.params.idRestaurant;
    const isOwner = await BusinessUser.findOne({ restaurant: restaurantId, user: req.user._id, role: 'owner' });

    if (!isOwner) {
        res.status(403);
        throw new Error('Only the owner can view operators');
    }
    const operators = await BusinessUser.find({ restaurant: restaurantId, role: 'operator' })
        .populate({
            path: 'user',
            select: 'email name lastName username',
        });
    const operatorData = operators.map(op => ({
        _id: op._id,
        email: op.user?.email,
        name: op.user?.name,
        lastName: op.user?.lastName,
        username: op.user?.username,
    }));
    res.status(200).json(operatorData);
})

const getRestaurantsToManage = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const restaurantId = req.params.id;
    if (!userId) {
        res.status(401);
        throw new Error('User not authenticated');
    }

    if (!restaurantId) {
        res.status(400);
        throw new Error('Restaurant ID is required');
    }

    const restaurant = await Restaurant.findOne({
        _id: restaurantId,
        isDeleted: false,
    });
    if (!restaurant) {
        res.status(404);
        throw new Error('Restaurant not found');
    }

    const businessUser = await BusinessUser.findOne({
        user: userId,
        restaurant: restaurantId,
    }).populate('restaurant');
    if (businessUser) {
        res.status(200).json(businessUser.restaurant);
    } else {
        res.status(403);
        throw new Error('No management rights for this restaurant');
    }
})

const updateBannerImage = asyncHandler(async (req, res) => {
    const restaurantId = req.params.id;
    if (!req.file) {
        res.status(400);
        throw new Error('No image uploaded for banner update.');
    }
    const restaurant = await Restaurant.findOne({
        _id: restaurantId,
        isDeleted: false,
        });
    if (!restaurant) {
        res.status(404);
        throw new Error('Restaurant not found');
    }
    if (restaurant.images && restaurant.images.length > 0) {
        restaurant.images = restaurant.images.filter(img => !img.isHeader);
    }

    const { filename } = req.file;

    const newBannerImage = {
        url: `/uploads/${filename}`,
        alt: req.body.alt || restaurant.name + ' banner image', 
        size: req.file.size,
        isHeader: true
    };
    restaurant.images.push(newBannerImage);
    await restaurant.save();
    res.status(200).json(restaurant);
});

export { createRestaurant, getRestaurant, updateRestaurant, deleteRestaurant, getAllRestaurants, uploadImage, addOperator, deleteOperator, getRestaurantsToManage, updateBannerImage, getOperators };