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
            ownerId,
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
    const { name, description, adress, categories, geoLocation, schedule, capacity, email, phoneNumber } = req.body;
    const restaurant = await Restaurant.findOne({
        _id: req.params.id,
        isDeleted: false 
    });
    if (restaurant) {
        restaurant.name = name || restaurant.name;
        restaurant.description = description || restaurant.description;
        restaurant.adress = adress || restaurant.adress;
        restaurant.categories = categories || restaurant.categories;
        restaurant.geoLocation = geoLocation || restaurant.geoLocation;
        restaurant.schedule = schedule || restaurant.schedule;
        restaurant.capacity = capacity || restaurant.capacity;
        restaurant.email = email || restaurant.email;
        restaurant.phoneNumber = phoneNumber || restaurant.phoneNumber;

        const updatedRestaurant = await restaurant.save();
        res.status(200).json(updatedRestaurant);

    } else{ 
        res.status(404);
        throw new Error('Restaurant not found');
    }
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
    const restaurants = await Restaurant.find({ isDeleted: false });
    res.status(200).json(restaurants);
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

    const existingRelationship = await BusinessUser.findOne({
        restaurant: restaurantId,
        user: userToAdd._id,
    });

    if (existingRelationship) {
        res.status(400);
        throw new Error('This user is already associated with the restaurant');
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

export { createRestaurant, getRestaurant, updateRestaurant, deleteRestaurant, getAllRestaurants, uploadImage, addOperator, deleteOperator };