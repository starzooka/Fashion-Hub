import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const adminSchema = new mongoose.Schema(
  {
    adminId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false, // Don't return password by default
    },
    phone: {
      type: String,
    },
    role: {
      type: String,
      default: 'admin',
    },
    permissions: {
      type: [String],
      default: ['read', 'create', 'update', 'delete', 'manage_users'],
    },
    status: {
      type: String,
      default: 'active',
    },
    loginAttempts: {
      type: Number,
      default: 0,
    },
    lastLogin: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Match password with hashed password in DB
adminSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Encrypt password before saving (if you create new admins via code later)
adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

export default mongoose.model('Admin', adminSchema);