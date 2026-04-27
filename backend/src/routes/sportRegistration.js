const express = require('express');
const SportRegistration = require('../models/SportRegistration');
const Sport = require('../models/Sport');
const { authRequired } = require('../middleware/auth');

const router = express.Router();

// Get all sports list
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

// Register for a sport
router.post('/register', authRequired, async (req, res, next) => {
  try {
    const { sport, fullName, email } = req.body;
    
    // Check if already registered for this sport
    const existing = await SportRegistration.findOne({ 
      user: req.user.id, 
      sport 
    });
    
    if (existing) {
      return res.status(400).json({ error: `You have already registered for ${sport}.` });
    }

    const registration = await SportRegistration.create({
      user: req.user.id,
      fullName,
      email,
      sport,
      status: 'Pending'
    });

    res.status(201).json({
      message: 'Registration submitted successfully. Your application is pending approval.',
      registration
    });
  } catch (err) {
    next(err);
  }
});

// Get user's own registrations
router.get('/my-registrations', authRequired, async (req, res, next) => {
  try {
    const registrations = await SportRegistration.find({ user: req.user.id });
    res.json(registrations);
  } catch (err) {
    next(err);
  }
});

// Admin: Get all registrations
router.get('/all', authRequired, async (req, res, next) => {
  try {
    // Basic role check
    if (req.user.role === 'student') {
      return res.status(403).json({ error: 'Access denied.' });
    }
    const registrations = await SportRegistration.find().sort({ registrationDate: -1 });
    res.json(registrations);
  } catch (err) {
    next(err);
  }
});

// Admin: Update status
router.put('/:id/status', authRequired, async (req, res, next) => {
  try {
    console.log(`[Admin] Updating status for registration ${req.params.id}`);
    
    if (req.user.role === 'student') {
      return res.status(403).json({ error: 'Access denied.' });
    }

    const { status, scheduledDate, scheduledTime } = req.body;
    console.log('Update Data:', { status, scheduledDate, scheduledTime });

    const registration = await SportRegistration.findById(req.params.id);
    
    if (!registration) {
      return res.status(404).json({ error: 'Registration not found' });
    }

    if (status) registration.status = status;
    if (scheduledDate) registration.scheduledDate = scheduledDate;
    if (scheduledTime) registration.scheduledTime = scheduledTime;

    await registration.save();
    console.log('Successfully saved updated registration');
    
    res.json({
      message: `Registration status updated to ${status}`,
      registration
    });
  } catch (err) {
    console.error('Error updating registration status:', err);
    next(err);
  }
});

module.exports = router;
