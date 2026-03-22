const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Get all users' });
});

router.post('/login', (req, res) => {
  res.json({ message: 'Login user', token: 'mock-jwt-token', role: 'Admin' });
});

router.post('/student-login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password required' });
  }
  if (password === '1234') {
    return res.json({ token: 'mock-student-jwt-token', message: 'Student Login Successful' });
  }
  return res.status(401).json({ message: 'Invalid username or password' });
});

router.post('/register', (req, res) => {
  res.json({ message: 'Registration successful', token: 'mock-jwt-token', role: 'User' });
});

module.exports = router;
