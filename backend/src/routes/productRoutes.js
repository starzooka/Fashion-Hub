import express from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { adminMiddleware } from '../middleware/adminAuth.js';

const router = express.Router();

// Get all products (public)
router.get('/', getAllProducts);

// Get single product (public)
router.get('/:id', getProductById);

// Create product (admin only)
router.post('/', adminMiddleware, createProduct);

// Update product (admin only)
router.put('/:id', adminMiddleware, updateProduct);

// Delete product (admin only)
router.delete('/:id', adminMiddleware, deleteProduct);

export default router;
