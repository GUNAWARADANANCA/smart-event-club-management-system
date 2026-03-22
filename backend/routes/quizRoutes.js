const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ 
    message: 'Get all quizzes',
    quizzes: [
      { id: 1, title: 'Tech Symposium Basics', eventId: 101, questions: 10, timeLimit: '15 mins', status: 'Active' },
      { id: 2, title: 'AI Ethics Final Quiz', eventId: 102, questions: 20, timeLimit: '30 mins', status: 'Draft' }
    ]
  });
});

router.post('/:id/attempt', (req, res) => {
  res.json({ message: 'Submit quiz attempt', score: 85 });
});

module.exports = router;
