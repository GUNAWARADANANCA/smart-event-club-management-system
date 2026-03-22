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

router.post('/', (req, res) => {
  const { title, description, timeLimit, eventId, questions } = req.body;
  
  // Logic to save to database would go here
  console.log('Creating new quiz:', { title, eventId, questionCount: questions.length });
  
  res.status(201).json({ 
    message: 'Quiz created successfully', 
    quiz: { id: Date.now(), title, eventId, questions: questions.length, timeLimit, status: 'Active' } 
  });
});

module.exports = router;
