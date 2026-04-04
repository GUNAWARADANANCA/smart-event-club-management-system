import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export default function EventProtectedRoute() {
  const token = localStorage.getItem('eventToken');
  
  useEffect(() => {
    return () => {
      localStorage.removeItem('eventToken');
    };
  }, []);

  if (!token) {
    return <Navigate to="/event-login" replace />;
  }

  return <Outlet />;
}
