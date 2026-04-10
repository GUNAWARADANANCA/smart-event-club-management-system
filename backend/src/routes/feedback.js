const express = require('express');
const Feedback = require('../models/Feedback');
const { analyzeFeedbackEmotion } = require('../services/emotionService');

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const { name, rating, category, subject, message } = req.body;
    if (!rating || !category || !subject || !message) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    let emotionData = null;
    try {
      emotionData = await analyzeFeedbackEmotion(
        `Subject: ${subject}. Message: ${message}`, rating
      );
    } catch (aiErr) {
      console.error('Emotion analysis failed (non-fatal):', aiErr.message);
    }

    const feedback = await Feedback.create({
      name: name || 'Anonymous', rating, category, subject, message,
      emotionScore: emotionData?.score ?? null,
      sentiment: emotionData?.sentiment ?? null,
      emotions: emotionData?.emotions ?? null,
      dominantEmotion: emotionData?.dominantEmotion ?? null,
      emotionSummary: emotionData?.summary ?? null,
      recommendation: emotionData?.recommendation ?? null,
    });

    res.status(201).json({ message: 'Feedback submitted successfully', feedback, emotionAnalysis: emotionData });
  } catch (err) { next(err); }
});

router.get('/', async (req, res, next) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 }).lean();
    res.json({ feedbacks });
  } catch (err) { next(err); }
});

router.get('/stats', async (req, res, next) => {
  try {
    const feedbacks = await Feedback.find().lean();
    const total = feedbacks.length;
    const avgRating = total > 0
      ? (feedbacks.reduce((s, f) => s + f.rating, 0) / total).toFixed(1) : 0;
    const withScore = feedbacks.filter(f => f.emotionScore != null);
    const avgEmotionScore = withScore.length > 0
      ? Math.round(withScore.reduce((s, f) => s + f.emotionScore, 0) / withScore.length) : null;
    const sentimentCounts = feedbacks.reduce(
      (acc, f) => { if (f.sentiment) acc[f.sentiment] = (acc[f.sentiment] || 0) + 1; return acc; },
      { positive: 0, neutral: 0, negative: 0 }
    );
    res.json({ totalFeedbacks: total, averageRating: Number(avgRating), responseRate: '100%', avgEmotionScore, sentimentCounts });
  } catch (err) { next(err); }
});

// Edit feedback — re-runs emotion analysis on updated content
router.put('/:id', async (req, res, next) => {
  try {
    const { name, rating, category, subject, message } = req.body;
    if (!rating || !category || !subject || !message) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    let emotionData = null;
    try {
      emotionData = await analyzeFeedbackEmotion(
        `Subject: ${subject}. Message: ${message}`, rating
      );
    } catch (aiErr) {
      console.error('Emotion analysis failed (non-fatal):', aiErr.message);
    }

    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      {
        name: name || 'Anonymous', rating, category, subject, message,
        emotionScore: emotionData?.score ?? null,
        sentiment: emotionData?.sentiment ?? null,
        emotions: emotionData?.emotions ?? null,
        dominantEmotion: emotionData?.dominantEmotion ?? null,
        emotionSummary: emotionData?.summary ?? null,
        recommendation: emotionData?.recommendation ?? null,
      },
      { new: true, runValidators: true }
    );

    if (!feedback) return res.status(404).json({ message: 'Feedback not found' });
    res.json({ message: 'Feedback updated successfully', feedback, emotionAnalysis: emotionData });
  } catch (err) { next(err); }
});

// Delete feedback
router.delete('/:id', async (req, res, next) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);
    if (!feedback) return res.status(404).json({ message: 'Feedback not found' });
    res.json({ message: 'Feedback deleted successfully' });
  } catch (err) { next(err); }
});

module.exports = router;