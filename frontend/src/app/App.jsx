import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import MainLayout from '@/components/layout/MainLayout';
import Login from '@/pages/auth/Login';
import UserManagement from '@/pages/user/UserManagement';
import EventManagement from '@/pages/events/EventManagement';
import FinanceManagement from '@/pages/finance/FinanceManagement';
import QuizManagement from '@/pages/quiz/QuizManagement';
import Register from '@/pages/auth/Register';
import ForgotPassword from '@/pages/auth/ForgotPassword';
import Profile from '@/pages/user/Profile';
import Notifications from '@/pages/user/Notifications';
import Home from '@/pages/public/Home';
import EventsGallery from '@/components/gallery/EventsGallery';
import Sponsorships from '@/pages/public/Sponsorships';
import TicketSales from '@/pages/public/TicketSales';
import SwimmingGallery from '@/pages/events/SwimmingGallery';
import FinanceLogin from '@/pages/auth/FinanceLogin';
import EventLogin from '@/pages/auth/EventLogin';
import QuizLogin from '@/pages/auth/QuizLogin';
import FinanceProtectedRoute from '@/components/routes/FinanceProtectedRoute';
import EventProtectedRoute from '@/components/routes/EventProtectedRoute';
import QuizProtectedRoute from '@/components/routes/QuizProtectedRoute';
import CreateEvent from '@/pages/events/CreateEvent';
import ClubManagement from '@/pages/events/ClubManagement';
import UpcomingEventsPortal from '@/pages/events/UpcomingEventsPortal';
import MyEvents from '@/pages/events/MyEvents';
import ManageRequests from '@/pages/events/ManageRequests';
import EventApproval from '@/pages/events/EventApproval';
import EventArchive from '@/pages/events/EventArchive';
import BudgetApproval from '@/pages/finance/BudgetApproval';
import Payment from '@/pages/finance/Payment';
import QRCodeTicket from '@/pages/finance/QRCodeTicket';
import ExpenseManagement from '@/pages/finance/ExpenseManagement';
import FinanceRequests from '@/pages/finance/FinanceRequests';
import QuizAttempt from '@/pages/quiz/QuizAttempt';
import QuizResult from '@/pages/quiz/QuizResult';
import Certificate from '@/pages/quiz/Certificate';
import UserPerformance from '@/pages/quiz/UserPerformance';
import CreateQuiz from '@/pages/quiz/CreateQuiz';
import PublicMeetings from '@/pages/public/PublicMeetings';
import News from '@/pages/public/News';
import EventGalleryDetail from '@/pages/events/EventGalleryDetail';
import SecureMeetings from '@/pages/finance/SecureMeetings';
import ViewFeedback from '@/pages/public/ViewFeedback';
import LecturePanel from '@/pages/events/LecturePanel';

function App() {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#1FAF9A',
          colorBgContainer: '#111827',
          fontFamily: "'Outfit', system-ui, -apple-system, sans-serif",
        },
      }}
    >
      <div style={{ minHeight: '100vh', backgroundColor: '#0F172A' }}>
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
          <Route path="gallery/:slug" element={<EventGalleryDetail />} />
          <Route path="news" element={<News />} />
          <Route path="meetings" element={<PublicMeetings />} />
          <Route path="gallery/swimming-finals" element={<SwimmingGallery />} />
          <Route path="sponsorships" element={<Sponsorships />} />
          <Route path="ticket-sales" element={<TicketSales />} />
          <Route path="view-feedback" element={<ViewFeedback />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="manage-requests" element={<ManageRequests />} />
          <Route path="portal" element={<UpcomingEventsPortal />} />
          <Route path="events/lecture-panel" element={<LecturePanel />} />
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
            <Route path="finance/secure-meetings" element={<SecureMeetings />} />
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
