const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const User = require('../models/User');
const upload = require('../middleware/upload');
const { authRequired, getJwtSecret } = require('../middleware/auth');

const router = express.Router();

const BCRYPT_ROUNDS = 12;
const JWT_EXPIRES_IN = '1d';

function signToken(userId, role) {
  const secret = getJwtSecret();
  if (!secret) {
    const err = new Error('JWT_SECRET is not configured on the server');
    err.statusCode = 500;
    throw err;
  }
  const r = role && typeof role === 'string' ? role : 'student';
  return jwt.sign(
    { sub: String(userId), role: r },
    secret,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

router.post('/signup', async (req, res, next) => {
  try {
    const { fullName, email, password, role } = req.body || {};

    if (email === undefined || email === null || String(email).trim() === '') {
      return res.status(400).json({ error: 'Email is required' });
    }

    if (password === undefined || password === null || String(password) === '') {
      return res.status(400).json({ error: 'Password is required' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const safeFullName = fullName ? String(fullName).trim() : '';

    const existing = await User.findOne({ email: normalizedEmail }).lean();
    if (existing) {
      return res
        .status(409)
        .json({ error: 'An account with this email already exists' });
    }

    const hashed = await bcrypt.hash(String(password), BCRYPT_ROUNDS);

    let user;
    try {
      user = await User.create({
        fullName: safeFullName,
        email: normalizedEmail,
        password: hashed,
        role: role || 'student',
      });
    } catch (err) {
      if (err.code === 11000) {
        return res
          .status(409)
          .json({ error: 'An account with this email already exists' });
      }
      throw err;
    }

    res.status(201).json({
      message: 'Account created successfully',
      user: {
        id: user._id.toString(),
        fullName: user.fullName || '',
        email: user.email,
        phone: user.phone || '',
        profileImage: user.profileImage || '',
        role: user.role || 'student',
      },
    });
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body || {};

    if (email === undefined || email === null || String(email).trim() === '') {
      return res.status(400).json({ error: 'Email is required' });
    }
    if (password === undefined || password === null || String(password) === '') {
      return res.status(400).json({ error: 'Password is required' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    
    // Hardcoded Admin Access
    if (normalizedEmail === 'admin@gmail.com' && String(password) === '12345678') {
      const token = signToken('admin-id-000', 'event_admin');
      return res.json({
        message: 'Login successful (Admin Override)',
        token,
        expiresIn: JWT_EXPIRES_IN,
        user: {
          id: 'admin-id-000',
          fullName: 'System Administrator',
          email: 'admin@gmail.com',
          role: 'event_admin',
        },
      });
    }

    const user = await User.findOne({ email: normalizedEmail }).select('+password');

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const match = await bcrypt.compare(String(password), user.password);
    if (!match) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const effectiveRole = user.role || 'student';
    const token = signToken(user._id.toString(), effectiveRole);

    res.json({
      message: 'Login successful',
      token,
      expiresIn: JWT_EXPIRES_IN,
      user: {
        id: user._id.toString(),
        fullName: user.fullName || '',
        email: user.email,
        phone: user.phone || '',
        profileImage: user.profileImage || '',
        role: effectiveRole,
      },
    });
  } catch (err) {
    next(err);
  }
});

/** Example protected route — use the same pattern on other routers. */
router.get('/me', authRequired, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).lean();

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user._id.toString(),
        fullName: user.fullName || '',
        email: user.email,
        phone: user.phone || '',
        profileImage: user.profileImage || '',
        role: user.role || 'student',
      },
    });
  } catch (err) {
    next(err);
  }
});

router.put('/me', authRequired, async (req, res, next) => {
  try {
    const { fullName, phone, profileImage } = req.body || {};

    const updateData = {
      fullName: fullName !== undefined ? String(fullName).trim() : '',
      phone: phone !== undefined ? String(phone).trim() : '',
    };

    if (profileImage !== undefined) {
      updateData.profileImage = String(profileImage).trim();
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    ).lean();

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id.toString(),
        fullName: user.fullName || '',
        email: user.email,
        phone: user.phone || '',
        profileImage: user.profileImage || '',
        role: user.role || 'student',
      },
    });
  } catch (err) {
    next(err);
  }
});


router.post(
  '/upload-profile-image',
  authRequired,
  (req, res, next) => {
    upload.single('profileImage')(req, res, (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'File too large. Maximum size is 5MB.' });
          }
        }
        return res.status(400).json({ error: err.message || 'File upload failed' });
      }
      next();
    });
  },
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const imageUrl = `${req.protocol}://${req.get('host')}/uploads/profile-images/${req.file.filename}`;

      res.json({
        message: 'Profile image uploaded successfully',
        imageUrl,
      });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
