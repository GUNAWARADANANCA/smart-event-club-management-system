import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import MainLayout from './components/MainLayout';
import Login from './pages/Login';
import UserManagement from './pages/UserManagement';
import EventManagement from './pages/EventManagement';
import FinanceManagement from './pages/FinanceManagement';
import QuizManagement from './pages/QuizManagement';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import Home from './pages/Home';
import EventsGallery from './components/EventsGallery';
import Sponsorships from './pages/Sponsorships';
import TicketSales from './pages/TicketSales';
import SwimmingGallery from './pages/SwimmingGallery';
import FinanceLogin from './pages/FinanceLogin';
import EventLogin from './pages/EventLogin';
import QuizLogin from './pages/QuizLogin';
import FinanceProtectedRoute from './components/FinanceProtectedRoute';
import EventProtectedRoute from './components/EventProtectedRoute';
import QuizProtectedRoute from './components/QuizProtectedRoute';
import CreateEvent from './pages/CreateEvent';
import ClubManagement from './pages/ClubManagement';
import UpcomingEventsPortal from './pages/UpcomingEventsPortal';
import MyEvents from './pages/MyEvents';
import ManageRequests from './pages/ManageRequests';
import EventApproval from './pages/EventApproval';
import EventArchive from './pages/EventArchive';
import BudgetApproval from './pages/BudgetApproval';
import Payment from './pages/Payment';
import QRCodeTicket from './pages/QRCodeTicket';
import ExpenseManagement from './pages/ExpenseManagement';
import FinanceRequests from './pages/FinanceRequests';
import QuizAttempt from './pages/QuizAttempt';
import QuizResult from './pages/QuizResult';
import Certificate from './pages/Certificate';
import UserPerformance from './pages/UserPerformance';
import CreateQuiz from './pages/CreateQuiz';

function App() {
  return (
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm, token: { colorPrimary: '#8b5cf6', colorBgContainer: '#141414' } }}>
      <div style={{ minHeight: '100vh', backgroundColor: '#000' }}>
        <BrowserRouter>
          <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/finance-login" element={<FinanceLogin />} />
        <Route path="/event-login" element={<EventLogin />} />
        <Route path="/quiz-login" element={<QuizLogin />} />
        
        <Route element={<MainLayout />}>
          <Route path="gallery" element={<EventsGallery />} />
          <Route path="gallery/swimming-finals" element={<SwimmingGallery />} />
          <Route path="sponsorships" element={<Sponsorships />} />
          <Route path="ticket-sales" element={<TicketSales />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="manage-requests" element={<ManageRequests />} />
          <Route path="portal" element={<UpcomingEventsPortal />} />
          <Route path="my-events" element={<MyEvents />} />
          
          <Route element={<EventProtectedRoute />}>
            <Route path="events" element={<EventManagement />} />
            <Route path="events/create" element={<CreateEvent />} />
            <Route path="clubs" element={<ClubManagement />} />
            <Route path="approvals" element={<EventApproval />} />
            <Route path="archives" element={<EventArchive />} />
          </Route>
          
          <Route element={<FinanceProtectedRoute />}>
            <Route path="finance" element={<FinanceManagement />} />
            <Route path="finance/budget-approval" element={<BudgetApproval />} />
            <Route path="finance/payment" element={<Payment />} />
            <Route path="finance/ticket" element={<QRCodeTicket />} />
            <Route path="finance/expenses" element={<ExpenseManagement />} />
            <Route path="finance/requests" element={<FinanceRequests />} />
          </Route>
          
          <Route path="quizzes" element={<QuizManagement />} />
          <Route path="quizzes/attempt" element={<QuizAttempt />} />
          <Route path="quizzes/result" element={<QuizResult />} />
          <Route path="quizzes/certificate" element={<Certificate />} />
          <Route path="quizzes/create" element={<CreateQuiz />} />
          
          <Route element={<QuizProtectedRoute />}>
             <Route path="quizzes/performance" element={<UserPerformance />} />
          </Route>
          
          <Route path="profile" element={<Profile />} />
          <Route path="notifications" element={<Notifications />} />
        </Route>
      </Routes>
    </BrowserRouter>
      </div>
    </ConfigProvider>
  );
}

export default App;
