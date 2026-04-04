import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Mock Node.js backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
