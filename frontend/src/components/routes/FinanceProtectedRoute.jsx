import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getAuthToken, getAuthRole, ROLES } from '@/lib/auth';

export default function FinanceProtectedRoute() {
  const token = getAuthToken();
  const role = getAuthRole();

  if (!token) {
    return <Navigate to="/finance-login" replace />;
  }
  if (role !== ROLES.FINANCE_ADMIN) {
    return <Navigate to="/finance-login" replace />;
  }

  return <Outlet />;
}
