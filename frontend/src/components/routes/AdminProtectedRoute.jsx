import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getAuthToken, getAuthRole, ROLES } from '@/lib/auth';

export default function AdminProtectedRoute() {
  const token = getAuthToken();
  const role = getAuthRole();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (role === ROLES.STUDENT) {
    return <Navigate to="/quizzes" replace />;
  }

  return <Outlet />;
}
