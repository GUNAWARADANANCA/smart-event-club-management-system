const express = require('express');
const LecturerRequest = require('../models/LecturerRequest');
const { authRequired } = require('../middleware/auth');

const router = express.Router();

// Check if user is admin
function isAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  const adminRoles = ['event_admin', 'finance_admin'];
  if (!adminRoles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}

// Submit lecturer request
router.post('/', async (req, res, next) => {
  try {
    const { fullName, email, department, subject, bio } = req.body;

    // Validate required fields
    if (!fullName || !email || !department || !subject || !bio) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if email already has a pending request
    const existingRequest = await LecturerRequest.findOne({
      email: email.toLowerCase(),
      status: 'pending'
    });

    if (existingRequest) {
      return res.status(400).json({ error: 'You already have a pending lecturer request' });
    }

    const lecturerRequest = new LecturerRequest({
      fullName,
      email: email.toLowerCase(),
      department,
      subject,
      bio,
    });

    await lecturerRequest.save();
    res.status(201).json({
      message: 'Lecturer request submitted successfully',
      request: lecturerRequest
    });
  } catch (err) {
    next(err);
  }
});

// Admin: Get all lecturer requests
router.get('/admin', authRequired, isAdmin, async (req, res, next) => {
  try {
    const requests = await LecturerRequest.find()
      .sort({ submittedAt: -1 })
      .lean();
    res.json(requests);
  } catch (err) {
    next(err);
  }
});

// Admin: Update lecturer request status
router.put('/:id', authRequired, isAdmin, async (req, res, next) => {
  try {
    const { status, reviewNotes } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be approved or rejected' });
    }

    const request = await LecturerRequest.findByIdAndUpdate(
      req.params.id,
      {
        status,
        reviewNotes,
        reviewedAt: new Date(),
        reviewedBy: req.user._id,
      },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({ error: 'Lecturer request not found' });
    }

    res.json({
      message: `Request ${status} successfully`,
      request
    });
  } catch (err) {
    next(err);
  }
});

// Get single lecturer request by ID
router.get('/:id', authRequired, isAdmin, async (req, res, next) => {
  try {
    const request = await LecturerRequest.findById(req.params.id).lean();
    if (!request) {
      return res.status(404).json({ error: 'Lecturer request not found' });
    }
    res.json(request);
  } catch (err) {
    next(err);
  }
});

module.exports = router;