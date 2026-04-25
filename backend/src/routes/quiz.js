const express = require('express');
const Quiz = require('../models/Quiz');

const router = express.Router();

const isoDate = (date) => date.toISOString().slice(0, 10);

router.post('/', async (req, res, next) => {
  try {
    const { title, description, timeLimit, eventId, closeDate, questions } = req.body || {};

    const resolvedCloseDate =
      typeof closeDate === 'string' && closeDate.trim().length > 0
        ? closeDate.trim()
        : isoDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));

    const quiz = await Quiz.create({
      title,
      description,
      timeLimit,
      eventId,
      closeDate: resolvedCloseDate,
      questions: Array.isArray(questions) ? questions : [],
    });

    res.status(201).json(quiz);
  } catch (err) {
    next(err);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const quizzes = await Quiz.find().sort({ createdAt: -1 }).lean();
    res.json(quizzes);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

