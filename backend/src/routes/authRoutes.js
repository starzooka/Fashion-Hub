import express from 'express';
import { body } from 'express-validator';
import { register, login, getCurrentUser, updateProfile, requestEmailVerification, checkEmailVerification } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Request email verification (send verification email)
router.post(
  '/request-verification',
  [
    body('email').isEmail().withMessage('Valid email is required'),
  ],
  requestEmailVerification
);

// Check email verification (verify token from email)
router.post('/check-email-verification', checkEmailVerification);

// Register (after email is verified)
router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  register
);

// Login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  login
);

// Get current user
router.get('/me', authMiddleware, getCurrentUser);

// Update profile
router.put('/profile', authMiddleware, updateProfile);

export default router;
