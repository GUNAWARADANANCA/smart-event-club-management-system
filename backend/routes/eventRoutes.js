const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ 
    message: 'Get all events', 
    events: [
      { id: 1, title: 'Annual Tech Symposium', date: '2026-04-10', venue: 'Main Hall', capacity: 500, status: 'Approved' },
      { id: 2, title: 'AI Ethics Workshop', date: '2026-04-15', venue: 'Room 201', capacity: 50, status: 'Pending' }
    ] 
  });
});

router.post('/', (req, res) => {
  res.json({ message: 'Create an event' });
});

module.exports = router;
