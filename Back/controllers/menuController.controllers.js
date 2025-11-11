import asyncHandler from 'express-async-handler';
import Restaurant from '../models/restaurant.models.js';
import { unlink } from 'fs/promises';
import path from 'path';

const uploadMenuImage = asyncHandler(async (req, res) => {
    const restaurantId = req.params.id;
    if (!req.file || !req.file.filename) {
        res.status(400);
        throw new Error('Image file is required.');
    }
    const { alt, isHeader } = req.body;
    const publicImageUrl = `/uploads/menu/${req.file.filename}`;
    const newImage = {
        url: publicImageUrl,
        alt: alt || '',
        size: req.file.size,
        isHeader: isHeader === 'true' || isHeader === true
    };
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant || restaurant.isDeleted) {
        res.status(404);
        throw new Error('Restaurant not found');
    }
    if (!restaurant.menu) {
        restaurant.menu = [];
    }
    restaurant.menu.push(newImage);
    await restaurant.save();
    res.status(201).json({
        message: 'Menu image uploaded successfully',
        image: newImage
    });
});

const deleteMenuImage = asyncHandler (async (req, res) => {
    const restaurantId = req.params.id;
    const imageId = req.params.imageId;
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant || restaurant.isDeleted) {
        res.status(404);
        throw new Error('Restaurant not found');
    }
    const image = restaurant.menu.find(img => img._id?.toString() === imageId);
    if (!image) {
        res.status(404);
        throw new Error('Image not found');
    }
    const fileName = image.url.split('/').pop();
    try{
        const filePath = path.join(process.cwd(), 'uploads', fileName);
        await unlink(filePath);
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.warn('File not found, might have been already deleted:', fileName);
        } else {
            console.error('Error deleting file:', error);
            res.status(500);
            throw new Error('Error deleting image file');
        }
    }
    const result = await Restaurant.updateOne(
        { _id: restaurantId },
        { $pull: { 'menu': { _id: imageId } } }
    );
    if (result.modifiedCount === 0) {
        res.status(404); 
        throw new Error('Image record not found in database or update failed.');
    }
    res.status(204).json({ message: 'Menu image deleted successfully' });
})

export { uploadMenuImage, deleteMenuImage };