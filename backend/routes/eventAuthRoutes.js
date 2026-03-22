const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const EventAdmin = require('../models/EventAdmin');

const JWT_SECRET = process.env.JWT_SECRET || 'event_super_secret_key_2026';

// Event Admin Login Route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Temporary bypass for demonstration purposes
    if (password === '1234') {
      const token = jwt.sign(
        { adminId: 'demo_event_admin', email, role: 'event_admin' },
        JWT_SECRET,
        { expiresIn: '1d' }
      );
      return res.json({ token, message: 'Login successful (Demo)' });
    }

    const admin = await EventAdmin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { adminId: admin._id, email: admin.email, role: 'event_admin' },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token, message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const existing = await EventAdmin.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Admin already exists' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new EventAdmin({ email, password: hashedPassword });
    await newAdmin.save();
    res.status(201).json({ message: 'Event Admin created successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
