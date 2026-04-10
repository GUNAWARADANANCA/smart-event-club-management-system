import api, { AUTH_TOKEN_KEY } from './api';

export { AUTH_TOKEN_KEY };

/** Must match backend User.role enum */
export const ROLES = {
  STUDENT: 'student',
  EVENT_ADMIN: 'event_admin',
  FINANCE_ADMIN: 'finance_admin',
  NEWS_ADMIN: 'news_admin',
};

const AUTH_ROLE_KEY = 'authRole';

export function getAuthToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function getAuthRole() {
  return localStorage.getItem(AUTH_ROLE_KEY);
}

export function roleDisplayLabel(role) {
  switch (role) {
    case ROLES.EVENT_ADMIN:
      return 'Event Admin';
    case ROLES.FINANCE_ADMIN:
      return 'Finance Admin';
    case ROLES.NEWS_ADMIN:
      return 'News Admin';
    case ROLES.STUDENT:
    default:
      return 'Student';
  }
}

/**
 * @param {{ token: string, email?: string, authRole?: string }} opts
 */
export function persistAuthSession({ token, email, authRole }) {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  if (email) {
    localStorage.setItem('userEmail', email);
    const localPart = String(email).split('@')[0] || email;
    const formatted =
      localPart.charAt(0).toUpperCase() + localPart.slice(1);
    localStorage.setItem('userName', formatted);
  }
  const r = authRole || ROLES.STUDENT;
  localStorage.setItem(AUTH_ROLE_KEY, r);
  localStorage.setItem('userRole', roleDisplayLabel(r));
}

export function clearAuthSession() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_ROLE_KEY);
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userName');
  localStorage.removeItem('userRole');
  localStorage.removeItem('financeToken');
  localStorage.removeItem('eventToken');
  localStorage.removeItem('quizToken');
}

export function apiErrorMessage(error, fallback = 'Something went wrong.') {
  if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
    return 'Cannot reach the server. Is the backend running on port 5000?';
  }
  const d = error.response?.data;
  if (typeof d?.error === 'string') return d.error;
  if (typeof d?.message === 'string') return d.message;
  if (Array.isArray(d?.details) && d.details.length) {
    return d.details.join(' ');
  }
  return fallback;
}

export async function loginWithPassword(email, password) {
  const { data } = await api.post('/api/auth/login', { email, password });
  return data;
}

export async function signupWithPassword(email, password) {
  const { data } = await api.post('/api/auth/signup', { email, password });
  return data;
}
