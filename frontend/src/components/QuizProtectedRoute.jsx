import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export default function QuizProtectedRoute() {
  const token = localStorage.getItem('quizToken');
  
  useEffect(() => {
    return () => {
      localStorage.removeItem('quizToken');
    };
  }, []);

  if (!token) {
    return <Navigate to="/quiz-login" replace />;
  }

  return <Outlet />;
}
