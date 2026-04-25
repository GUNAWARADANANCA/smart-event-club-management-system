import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getAuthToken, getAuthRole, ROLES } from '@/lib/auth';

export default function NewsProtectedRoute() {
  const token = getAuthToken();
  const role = getAuthRole();
  const location = useLocation();

  if (!token || role !== ROLES.NEWS_ADMIN) {
    return <Navigate to="/news-login" state={{ from: location.pathname }} replace />;
  }

  return <Outlet />;
}