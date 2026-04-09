import axios from 'axios';

/** Stored by login flows; sent as Bearer for protected backend routes. */
export const AUTH_TOKEN_KEY = 'authToken';

/** Backend origin (no trailing path). Examples: /api/auth/login, /events */
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
