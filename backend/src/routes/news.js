const express = require('express');
const News = require('../models/News');
const { authRequired } = require('../middleware/auth');

const router = express.Router();

// Check if user is admin
function isAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  const adminRoles = ['event_admin', 'finance_admin', 'news_admin'];
  if (!adminRoles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}

// Public: Get all published news
router.get('/', async (req, res, next) => {
  try {
    const news = await News.find({ isPublished: true })
      .sort({ publishedAt: -1 })
      .lean();
    res.json(news);
  } catch (err) {
    next(err);
  }
});

// Public: Get single news by ID
router.get('/:id', async (req, res, next) => {
  try {
    const news = await News.findById(req.params.id).lean();
    if (!news) {
      return res.status(404).json({ error: 'News not found' });
    }
    res.json(news);
  } catch (err) {
    next(err);
  }
});

// Admin: Create news
router.post('/', authRequired, isAdmin, async (req, res, next) => {
  try {
    const { category, tag, title, summary, author, accent, color, isPublished } = req.body;

    // Validate required fields
    if (!category || !tag || !title || !summary || !author) {
      return res.status(400).json({
        error: 'Missing required fields: category, tag, title, summary, author'
      });
    }

    const news = await News.create({
      category,
      tag,
      title,
      summary,
      author,
      accent: accent || '#4CAF50',
      color: color || 'from-[#4CAF50] to-[#2E7D32]',
      isPublished: isPublished !== false,
      publishedAt: new Date()
    });

    res.status(201).json({
      message: 'News created successfully',
      news: news.toObject()
    });
  } catch (err) {
    next(err);
  }
});

// Admin: Update news
router.put('/:id', authRequired, isAdmin, async (req, res, next) => {
  try {
    const { category, tag, title, summary, author, accent, color, isPublished } = req.body;

    const news = await News.findByIdAndUpdate(
      req.params.id,
      {
        category,
        tag,
        title,
        summary,
        author,
        accent,
        color,
        isPublished
      },
      { new: true, runValidators: true }
    );

    if (!news) {
      return res.status(404).json({ error: 'News not found' });
    }

    res.json({
      message: 'News updated successfully',
      news: news.toObject()
    });
  } catch (err) {
    next(err);
  }
});

// Admin: Delete news
router.delete('/:id', authRequired, isAdmin, async (req, res, next) => {
  try {
    const news = await News.findByIdAndDelete(req.params.id);

    if (!news) {
      return res.status(404).json({ error: 'News not found' });
    }

    res.json({
      message: 'News deleted successfully',
      news: news.toObject()
    });
  } catch (err) {
    next(err);
  }
});

// Admin: Get all news (including unpublished)
router.get('/admin/all', authRequired, isAdmin, async (req, res, next) => {
  try {
    const news = await News.find()
      .sort({ publishedAt: -1 })
      .lean();
    res.json(news);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
