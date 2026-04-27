const express = require('express');
const Sport = require('../models/Sport');
const { authRequired } = require('../middleware/auth');

const router = express.Router();

// Get all sports
router.get('/', async (req, res, next) => {
  try {
    const sports = await Sport.find().sort({ name: 1 });
    res.json(sports);
  } catch (err) {
    next(err);
  }
});

// Add a new sport (Admin only)
router.post('/', authRequired, async (req, res, next) => {
  try {
    if (req.user.role === 'student') {
      return res.status(403).json({ error: 'Access denied.' });
    }

    const { name, description } = req.body;
    
    // Check if sport already exists
    const existing = await Sport.findOne({ name });
    if (existing) {
      return res.status(400).json({ error: 'Sport already exists.' });
    }

    const sport = await Sport.create({ name, description });
    res.status(201).json(sport);
  } catch (err) {
    next(err);
  }
});

// Delete a sport (Admin only)
router.delete('/:id', authRequired, async (req, res, next) => {
  try {
    if (req.user.role === 'student') {
      return res.status(403).json({ error: 'Access denied.' });
    }

    await Sport.findByIdAndDelete(req.params.id);
    res.json({ message: 'Sport deleted successfully' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
