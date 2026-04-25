const express = require('express');
const cors = require('cors');
const path = require('path');
const authRouter = require('./routes/auth');
const eventsRouter = require('./routes/events');
const ticketsRouter = require('./routes/tickets');
const expensesRouter = require('./routes/expenses');
const meetingsRouter = require('./routes/meetings');
const newsRouter = require('./routes/news');
const lecturerRequestsRouter = require('./routes/lecturer-requests');
const quizRouter = require('./routes/quiz');

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || true,
    credentials: Boolean(process.env.CORS_CREDENTIALS),
  })
);
app.use(express.json({ limit: '1mb' }));

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/health', (req, res) => {
  res.json({ ok: true, service: 'itpm-backend' });
});

app.use('/api/auth', authRouter);
app.use('/api/tickets', ticketsRouter);
app.use('/api/expenses', expensesRouter);
app.use('/api/meetings', meetingsRouter);
app.use('/api/news', newsRouter);
app.use('/api/lecturer-requests', lecturerRequestsRouter);
app.use('/events', eventsRouter);
app.use('/api/feedback', require('./routes/feedback'));
app.use('/quiz', quizRouter);
app.use('/api/quiz', quizRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use((err, req, res, _next) => {
  console.error('[API]', err);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation failed',
      details: Object.values(err.errors || {}).map((e) => e.message),
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'Invalid id or value' });
  }

  const status = err.statusCode || err.status || 500;
  const message =
    process.env.NODE_ENV === 'production' && status === 500
      ? 'Internal server error'
      : err.message || 'Internal server error';

  res.status(status).json({ error: message });
});

module.exports = app;