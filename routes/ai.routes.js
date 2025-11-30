// routes/ai.routes.js
import express from 'express';
import { recommendSimilar, summarize } from '../controllers/ai.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/recommend', protect, recommendSimilar);
router.post('/summarize', protect, summarize);

export default router;
