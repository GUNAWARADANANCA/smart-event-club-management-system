import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getAuthToken, getAuthRole, ROLES } from '@/lib/auth';

export default function QuizProtectedRoute() {
  const token = getAuthToken();
  const role = getAuthRole();

  if (!token) {
    return <Navigate to="/quiz-login" replace />;
  }
  if (role !== ROLES.STUDENT) {
    return <Navigate to="/quiz-login" replace />;
  }

  return <Outlet />;
}
