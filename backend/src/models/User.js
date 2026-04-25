const mongoose = require('mongoose');
const upload = require('../middleware/upload');

const ROLES = ['student', 'event_admin', 'finance_admin', 'news_admin'];

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      default: '',
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
    },
    phone: {
      type: String,
      default: '',
      trim: true,
    },
    profileImage: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      enum: ROLES,
      default: 'student',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);