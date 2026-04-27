const express = require('express');
const mongoose = require('mongoose');
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
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.json([]);
    }
    const results = await QuizResult.find({ userId }).sort({ createdAt: -1 }).lean();
    res.json(results);
  } catch (err) {
    next(err);
  }
});

// Update quiz
router.put('/:id', async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ error: 'Invalid Quiz ID' });
    const { title, description, timeLimit, closeDate, questions } = req.body;
    const quiz = await Quiz.findByIdAndUpdate(req.params.id, { title, description, timeLimit, closeDate, questions: Array.isArray(questions) ? questions : [] }, { new: true });
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
    res.json(quiz);
  } catch (err) {
    next(err);
  }
});
    }

    res.json(quiz);
  } catch (err) {
    next(err);
  }
});

// Delete quiz
router.delete('/:id', async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ error: 'Invalid Quiz ID' });
    const quiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
    await QuizResult.deleteMany({ quizId: req.params.id });
    res.json({ message: 'Quiz deleted successfully' });
  } catch (err) {
    next(err);
  }
});
    }
    
    // Also delete associated results
    await QuizResult.deleteMany({ quizId: req.params.id });

    res.json({ message: 'Quiz deleted successfully' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
