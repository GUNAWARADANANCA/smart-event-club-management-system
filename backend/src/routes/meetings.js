const express = require('express');
const Meeting = require('../models/Meeting');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const meetings = await Meeting.find().sort({ scheduledAt: 1 }).lean();
    res.json(meetings);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { title, platform, scheduledAt, link, accessType, status } = req.body;

    const meeting = await Meeting.create({
      title,
      platform,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : new Date(),
      link,
      accessType,
      status: status || 'Upcoming',
    });

    res.status(201).json(meeting);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
