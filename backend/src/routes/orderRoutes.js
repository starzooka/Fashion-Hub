import express from 'express';
import {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
} from '../controllers/orderController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Create order
router.post('/', authMiddleware, createOrder);

// Get user orders
router.get('/', authMiddleware, getUserOrders);

// Get order by ID
router.get('/:id', authMiddleware, getOrderById);

// Update order status (admin only)
router.put('/:id/status', authMiddleware, updateOrderStatus);

// Cancel order
router.delete('/:id/cancel', authMiddleware, cancelOrder);

export default router;
