const express = require('express');
const router = express.Router();

router.get('/budgets', (req, res) => {
  res.json({ 
    message: 'Get all budgets',
    requests: [
      { id: 'REQ-001', name: 'Annual Tech Symposium Venue Booking', type: 'Event', status: 'Pending', submittedDate: '2026-03-20', description: 'Payment for Main Hall booking.' },
      { id: 'REQ-002', name: 'Robotics Workshop Kit Purchase', type: 'Club', status: 'Approved', submittedDate: '2026-03-15', description: 'Arduino and Raspberry Pi kits for the upcoming workshop.' }
    ]
  });
});

router.post('/budgets', (req, res) => {
  res.json({ message: 'Submit a budget' });
});

module.exports = router;
