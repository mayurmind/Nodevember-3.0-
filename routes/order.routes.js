// routes/order.routes.js
import express from 'express';
import { createOrder, listOrders, getOrder } from '../controllers/order.controller.js';
import { protect, admin } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', protect, createOrder);
router.get('/', protect, listOrders); // admin sees all
router.get('/:id', protect, getOrder);

export default router;
