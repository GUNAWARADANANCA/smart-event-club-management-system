const express = require('express');
const Event = require('../models/Event');

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const { title, date, description } = req.body;
    const event = await Event.create({
      title,
      date,
      description,
    });
    res.status(201).json(event);
  } catch (err) {
    next(err);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const events = await Event.find().sort({ date: 1 }).lean();
    res.json(events);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
