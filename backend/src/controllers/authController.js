import User from '../models/User.js';
import { generateToken } from '../utils/jwt.js';
import { validationResult } from 'express-validator';
import { generateVerificationToken, sendVerificationEmail, verifyToken } from '../utils/emailService.js';

// Request email verification (send verification email)
export const requestEmailVerification = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Check if user already exists with this email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Generate verification token
    const verificationToken = generateVerificationToken();
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Send verification email
    const emailSent = await sendVerificationEmail(email, 'New User', verificationToken);

    if (!emailSent) {
      return res.status(500).json({ message: 'Failed to send verification email' });
    }

    // Store token in session/response for frontend to use (or you can store in a temp collection)
    // For now, we'll just return success and the frontend will use the token from email
    res.status(200).json({
      message: 'Verification email sent successfully',
      email: email,
      token: verificationToken, // Return token so frontend can verify locally or store
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Check if email is verified (verify token from email link)
export const checkEmailVerification = async (req, res) => {
  try {
    const { token, email } = req.body;

    console.log('checkEmailVerification called - email:', email, 'token length:', token?.length);

    if (!token || !email) {
      console.log('Missing token or email');
      return res.status(400).json({ message: 'Token and email are required' });
    }

    // Verify the token against stored tokens
    console.log('Verifying token...');
    const isValid = await verifyToken(token, email);
    console.log('Token valid:', isValid);

    if (!isValid) {
      console.log('Token verification failed');
      return res.status(400).json({ message: 'Invalid or expired verification token' });
    }

    console.log('Email verification successful');
    res.status(200).json({
      message: 'Email verified successfully',
      email: email,
      isVerified: true,
    });
  } catch (error) {
    console.error('Error in checkEmailVerification:', error);
    res.status(500).json({ message: error.message });
  }
};

// Register user (after email is verified)
export const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, phone } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user with email already verified
    // (verification happened before account creation)
    user = new User({
      name,
      email,
      password,
      phone,
      isEmailVerified: true, // Email is already verified before signup
      emailVerificationToken: undefined,
      emailVerificationTokenExpiry: undefined,
    });
    await user.save();

    res.status(201).json({
      message: 'Account created successfully',
      email: user.email,
      userId: user._id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Check if user exists and get password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      return res.status(403).json({
        message: 'Please verify your email before logging in',
        email: user.email,
        isVerified: false,
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get current user
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;

    const user = await User.findByIdAndUpdate(
      req.userId,
      { name, phone, address },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Verify email
export const verifyEmail = async (req, res) => {
  try {
    const { token, email } = req.body;

    if (!token || !email) {
      return res.status(400).json({ message: 'Token and email are required' });
    }

    const user = await User.findOne({ email }).select('+emailVerificationToken +emailVerificationTokenExpiry');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ message: 'Email already verified' });
    }

    // Check if token matches and is not expired
    if (user.emailVerificationToken !== token) {
      return res.status(400).json({ message: 'Invalid verification token' });
    }

    if (new Date() > user.emailVerificationTokenExpiry) {
      return res.status(400).json({ message: 'Verification token expired' });
    }

    // Update user as verified
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationTokenExpiry = undefined;
    await user.save();

    res.status(200).json({
      message: 'Email verified successfully. You can now login.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Resend verification email
export const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ message: 'Email already verified' });
    }

    // Generate new verification token
    const verificationToken = generateVerificationToken();
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    user.emailVerificationToken = verificationToken;
    user.emailVerificationTokenExpiry = tokenExpiry;
    await user.save();

    // Send verification email
    const emailSent = await sendVerificationEmail(user.email, user.name, verificationToken);

    if (!emailSent) {
      return res.status(500).json({ message: 'Failed to send verification email' });
    }

    res.status(200).json({
      message: 'Verification email sent successfully',
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
