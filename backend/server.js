const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'University Event Management API is running' });
});

// Import route modules
const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');
const eventAuthRoutes = require('./routes/eventAuthRoutes');
const financeRoutes = require('./routes/financeRoutes');
const financeAuthRoutes = require('./routes/financeAuthRoutes');
const quizRoutes = require('./routes/quizRoutes');
const meetingRoutes = require('./routes/meetingRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/event-auth', eventAuthRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/finance-auth', financeAuthRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/bookings', bookingRoutes);

// Connect MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/unidata';
mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB strictly for Finance Admin Auth'))
  .catch(err => console.error('MongoDB connection error:', err));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
