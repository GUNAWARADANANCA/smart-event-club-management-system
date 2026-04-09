const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
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
    const { email, password } = req.body || {};

    if (email === undefined || email === null || String(email).trim() === '') {
      return res.status(400).json({ error: 'Email is required' });
    }
    if (password === undefined || password === null || String(password) === '') {
      return res.status(400).json({ error: 'Password is required' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

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
        email: normalizedEmail,
        password: hashed,
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
        email: user.email,
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
    const user = await User.findOne({ email: normalizedEmail }).select(
      '+password'
    );

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
        email: user.email,
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
        email: user.email,
        role: user.role || 'student',
      },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
