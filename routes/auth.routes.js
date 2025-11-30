import express from 'express';
import { loginUser, registerUser, getMe } from '../controllers/user.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.post('/login', loginUser);
router.post('/register', registerUser);

// Protected route - requires valid JWT token
router.get('/me', protect, getMe);

export default router;  