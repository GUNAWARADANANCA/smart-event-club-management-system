const express = require('express');
const Quiz = require('../models/Quiz');
const QuizResult = require('../models/QuizResult');

const router = express.Router();

const isoDate = (date) => date.toISOString().slice(0, 10);

// Create quiz
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

// Get all quizzes
router.get('/', async (req, res, next) => {
  try {
    const quizzes = await Quiz.find().sort({ createdAt: -1 }).lean();
    res.json(quizzes);
  } catch (err) {
    next(err);
  }
});

// Save quiz result
router.post('/results', async (req, res, next) => {
  try {
    const { userId, quizId, quizTitle, score, totalQuestions } = req.body;
    const result = await QuizResult.create({
      userId,
      quizId,
      quizTitle,
      score,
      totalQuestions
    });
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

// Get user results
router.get('/results/:userId', async (req, res, next) => {
  try {
    const results = await QuizResult.find({ userId }).sort({ createdAt: -1 }).lean();
    res.json(results);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

