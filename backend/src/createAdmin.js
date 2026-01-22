// seedAdmin.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js'; // Make sure this path points to your User model

dotenv.config();

const createAdmin = async () => {
  try {
    // Connect to your MongoDB
    // Ensure process.env.MONGO_URI is set in your .env file
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');

    const adminEmail = 'admin@example.com';
    const adminPassword = 'admin123'; // Change this to what you want
    const adminId = 'admin01'; // Optional custom ID if your schema has it

    // Check if admin already exists
    const userExists = await User.findOne({ email: adminEmail });

    if (userExists) {
      console.log('Admin user already exists');
      process.exit();
    }

    // Create new Admin User
    const user = await User.create({
      name: 'Super Admin',
      email: adminEmail,
      password: adminPassword,
      role: 'admin',          // CRITICAL: Sets the role to admin
      isEmailVerified: true,  // Bypasses email verification
      phone: '0000000000',    // Dummy phone if required
      // adminId: adminId     // Uncomment if you added adminId to your User Schema
    });

    console.log(`Admin created successfully!`);
    console.log(`ID/Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

createAdmin();