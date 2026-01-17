import express from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from '../controllers/cartController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get cart
router.get('/', authMiddleware, getCart);

// Add to cart
router.post('/add', authMiddleware, addToCart);

// Update cart item
router.put('/:itemId', authMiddleware, updateCartItem);

// Remove from cart
router.delete('/:itemId', authMiddleware, removeFromCart);

// Clear cart
router.delete('/', authMiddleware, clearCart);

export default router;
