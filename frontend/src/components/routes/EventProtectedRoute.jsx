import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getAuthToken, getAuthRole, ROLES } from '@/lib/auth';

export default function EventProtectedRoute() {
  const token = getAuthToken();
  const role = getAuthRole();

  if (!token) {
    return <Navigate to="/event-login" replace />;
  }
  if (role !== ROLES.EVENT_ADMIN) {
    return <Navigate to="/event-login" replace />;
  }

  return <Outlet />;
}
