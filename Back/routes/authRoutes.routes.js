import asyncHandler from 'express-async-handler';
import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.controllers.js';
const router = express.Router();

router.route('/register').post(asyncHandler(registerUser));
router.route('/login').post(asyncHandler(loginUser));

export default router;