import Post from '../models/posts.models.js';
import Restaurant from '../models/restaurant.models.js';
import asyncHandler from 'express-async-handler';
import { unlink } from 'fs/promises';
import path from 'path';

const createPost = asyncHandler(async (req, res) => {
    const uploadedFile = req.file;
    try{
        const restaurantId = req.params.id || req.params.restaurantId;
        const { content } = req.body;
        const authorUserId = req.user._id;
        const userRole = req.user.role; 
        const userRestaurantId = req.user.restaurantId;

        if (!uploadedFile || !uploadedFile.filename) {
            res.status(400);
            throw new Error('Image is required');
        }
        const restaurant = await Restaurant.findOne({ _id: restaurantId, isDeleted: false });
        if (!restaurant) {
            res.status(404);
            throw new Error('Restaurant not found');
        }

        const image = {
            url: '/uploads/posts/' + uploadedFile.filename,
            alt: content ? content.substring(0, 200) : 'Post image',
            size: uploadedFile.size
        }
        const isOperatorOfDestination = (userRole === 'owner' || userRole === 'operator') && (String(userRestaurantId) === String(restaurantId));
        let postState = isOperatorOfDestination ? 'accepted' : 'pending';

        const post = new Post({
            authorUserId: authorUserId, 
            authorRestaurantId: restaurantId,
            image: image,
            content: content || '',
            state: postState
        });

        await post.save();
        await Restaurant.findOneAndUpdate({ _id: restaurantId }, { $push: { posts: post._id } });
        
        const message = postState === 'accepted' ? 'Post created successfully' : 'Post created successfully and is pending approval';

        res.status(201).json({ message: message, post });
    }
    catch (error) {
        if (uploadedFile) {
            try {
                const filePath = path.join(process.cwd(), 'uploads', 'posts', uploadedFile.filename);
                await unlink(filePath);
                console.log(`The image was deleted: ${uploadedFile.filename}`);
            } catch (unlinkError) {
                console.error("Error cleaning up image:", unlinkError);
            }
        }
        throw error;
    }
})

const getPostsByRestaurant = asyncHandler(async (req, res) => {
    const restaurantId = req.params.id || req.params.restaurantId;
    const restaurant = await Restaurant.findOne({ _id: restaurantId, isDeleted: false });
    if (!restaurant) {
        res.status(404);
        throw new Error('Restaurant not found');
    }

    const posts = await Post.find({ authorRestaurantId: restaurantId, state: 'accepted' });
    res.status(200).json(posts);
});

const acceptPost = asyncHandler(async (req, res) => {
    const postId = req.params.postId;
    const post = await Post.findById(postId);

    if (!post) {
        res.status(404);
        throw new Error('Post not found');
    }
    if (post.deleted) {
        res.status(404);
        throw new Error('Post was deleted before.');
    }
    if (post.state === 'accepted') {
        return res.status(200).json({ message: 'Post is already accepted.' });
    }
    
    if (post.state === 'rejected') {
        res.status(400);
        throw new Error('Cannot accept a rejected post.');
    }
    if (req.user.state === 'rejected') {
        res.status(403);
        throw new Error('User is rejected and cannot accept posts.');
    }
    post.state = 'accepted';
    await post.save();

    res.status(200).json({ 
        message: 'Post accepted and visible to the public.', 
        post 
    });
});

const rejectPost = asyncHandler(async (req, res) => {
    const postId = req.params.postId;
    const post = await Post.findById(postId);
    if (!post) {
        res.status(404);
        throw new Error('Post not found');
    }
    if (post.deleted) {
        res.status(404);
        throw new Error('Post was deleted before.');
    }
    if (post.state === 'rejected') {
        return res.status(200).json({ message: 'Post is already rejected.' });
    }
    if (post.state === 'accepted') {
        res.status(400);
        throw new Error('Cannot reject an accepted post.');
    }
    post.state = 'rejected';
    await post.save();
    res.status(200).json({
        message: 'Post has been rejected succesfully'
    })
})

const deletePost = asyncHandler(async (req, res) => {
    const postId = req.params.postId;
    const currentUserId = req.user._id;
    const post = await Post.findById(postId);
    if (!post || post.deleted) {
        res.status(404);
        throw new Error('Post not found');
    }
    const isPostAuthor = String(post.authorUserId) === String(currentUserId);
    const isOperator = req.user.role === 'owner' || req.user.role === 'operator';

    if (!isOperator) {
        if (!isPostAuthor || post.state !== 'pending') {
            res.status(403);
            throw new Error('User not authorized: Post is no longer pending or you are not the author.');
        }
    }
    if (post.image && post.image.url) {
        try {
            const fileName = post.image.url.split('/').pop(); 
            const filePath = path.join(process.cwd(), 'uploads', 'posts', fileName); 
            await unlink(filePath);
        } catch (error) {
            if (error.code !== 'ENOENT') {
                console.error("Error al borrar el archivo físico del post:", error);
            }
        }
    }

    post.deleted = true;
    await post.save();

    if (post.authorRestaurantId) {
        await Restaurant.findByIdAndUpdate(
            post.authorRestaurantId,
            { $pull: { posts: postId } } 
        );
    }

    res.status(204).send(); 
});

const getPendingPosts = asyncHandler(async (req, res) => {
    const restaurantId = req.params.restaurantId;
    const posts = await Post.find({authorRestaurantId: restaurantId, state: 'pending'}).populate('authorUserId', 'username');
    if (!posts) {
        res.status(404);
        throw new Error('No pending posts found for this restaurant.');
    }
    res.status(200).json(posts);
})

export { createPost, getPostsByRestaurant, acceptPost, rejectPost, deletePost, getPendingPosts };