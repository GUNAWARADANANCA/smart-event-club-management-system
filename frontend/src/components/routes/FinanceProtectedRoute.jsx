import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export default function FinanceProtectedRoute() {
  const token = localStorage.getItem('financeToken');

  // Immediately clear token when the admin navigates away from the Finance area
  useEffect(() => {
    return () => {
      localStorage.removeItem('financeToken');
    };
  }, []);
  
  if (!token) {
    return <Navigate to="/finance-login" replace />;
  }

  return <Outlet />;
}
