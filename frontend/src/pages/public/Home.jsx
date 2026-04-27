import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CalendarOutlined, SafetyCertificateOutlined, DollarOutlined, ArrowRightOutlined, TeamOutlined, TrophyOutlined, FileProtectOutlined } from '@ant-design/icons';
import { getAuthToken, clearAuthSession } from '@/lib/auth';

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loggedIn, setLoggedIn] = useState(() => Boolean(getAuthToken()));

  useEffect(() => {
    setLoggedIn(Boolean(getAuthToken()));
  }, [location.pathname, location.key]);

  const displayName =
    localStorage.getItem('registeredDisplayName') ||
    localStorage.getItem('userName') ||
    'User';

  const handleLogout = () => {
    clearAuthSession();
    setLoggedIn(false);
    navigate('/', { replace: true });
  };

  const handleGalleryClick = () => {
    const token = getAuthToken();

    if (!token) {
      navigate('/login', { state: { from: '/gallery' } });
    } else {
      navigate('/gallery');
    }
  };

  const modules = [
    {
      icon: <CalendarOutlined style={{ fontSize: 36, color: '#4CAF50' }} />,
      title: 'Event & Club Management',
      desc: 'Create events, manage venues, and automate club approvals instantly.',
      accent: '#4CAF50',
    },
    {
      icon: <DollarOutlined style={{ fontSize: 36, color: '#F97316' }} />,
      title: 'Finance & Budgets',
      desc: 'Process payments, generate QR tickets, and track club budgets end-to-end.',
      accent: '#F97316',
    },
    {
      icon: <SafetyCertificateOutlined style={{ fontSize: 36, color: '#8B5CF6' }} />,
      title: 'Quiz & Certification',
      desc: 'Auto-graded quizzes with dynamic certificates for every participant.',
      accent: '#8B5CF6',
    },
    {
      icon: <TeamOutlined style={{ fontSize: 36, color: '#2E7D32' }} />,
      title: 'User Management',
      desc: 'Manage student profiles, roles, and access permissions from one place.',
      accent: '#2E7D32',
    },
    {
      icon: <TrophyOutlined style={{ fontSize: 36, color: '#f59e0b' }} />,
      title: 'Sponsorships',
      desc: 'Connect events with sponsors and manage sponsorship proposals seamlessly.',
      accent: '#f59e0b',
    },
    {
      icon: <FileProtectOutlined style={{ fontSize: 36, color: '#4CAF50' }} />,
      title: 'Secure Meetings',
      desc: 'Schedule and manage secure committee meetings with full audit trails.',
      accent: '#4CAF50',
    },
  ];

  const stats = [
    { value: '500+', label: 'Students Enrolled' },
    { value: '50+', label: 'Events Hosted' },
    { value: '20+', label: 'Active Clubs' },
    { value: '100%', label: 'Digital Process' },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col font-sans">

      <nav className="px-6 md:px-14 py-4 flex flex-wrap gap-4 justify-between items-center border-b border-[#C8E6C9] bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-sm shadow-green-900/5">
        <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#2E7D32] to-[#4CAF50] tracking-tight uppercase">
          UniEvents
        </span>
        <div className="flex items-center gap-2 sm:gap-3">
          {loggedIn ? (
            <>
              <span
                className="text-sm font-semibold text-gray-800 max-w-[140px] sm:max-w-[200px] truncate px-1"
                title={localStorage.getItem('userEmail') || displayName}
              >
                {displayName}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="px-5 py-2.5 text-sm font-semibold rounded-full text-[#2E7D32] border-2 border-[#C8E6C9] bg-white hover:bg-[#E8F5E9] hover:border-[#A5D6A7] transition-all duration-200"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:text-[#2E7D32] rounded-full transition-colors duration-200"
              >
                Log in
              </button>
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="px-5 py-2.5 text-sm font-semibold rounded-full text-white bg-gradient-to-r from-[#43A047] to-[#4CAF50] shadow-md shadow-green-600/20 hover:shadow-lg hover:shadow-green-600/25 hover:-translate-y-0.5 transition-all duration-200"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </nav>

      <section className="relative flex flex-col items-center justify-center text-center px-6 py-20 md:py-28 overflow-hidden bg-gradient-to-b from-white via-[#F7FCF7] to-white">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[min(600px,100vw)] h-[380px] bg-[#4CAF50]/[0.07] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[280px] h-[280px] bg-[#F97316]/[0.06] rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E8F5E9] border border-[#C8E6C9] text-[#2E7D32] text-xs font-bold uppercase tracking-widest mb-8">
          University Club & Event Platform
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-7xl font-black leading-tight tracking-tight mb-6 max-w-4xl text-gray-900">
          Manage University{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2E7D32] via-[#4CAF50] to-[#F97316]">
            Events
          </span>{' '}
          with Ease
        </h1>

        <p className="text-gray-600 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
          An all-in-one platform for students, clubs, and administrators. Handle event approvals, ticket sales, budgets, and certifications from a single dashboard.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md sm:max-w-none">
          <button
            type="button"
            onClick={() => navigate('/register')}
            className="px-8 py-4 bg-gradient-to-r from-[#43A047] to-[#4CAF50] rounded-2xl font-bold text-white text-base shadow-lg shadow-green-600/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
          >
            Get Started Now <ArrowRightOutlined />
          </button>
          <button
            type="button"
            onClick={handleGalleryClick}
            className="px-8 py-4 border-2 border-[#C8E6C9] rounded-2xl font-bold text-[#2E7D32] text-base bg-white hover:bg-[#E8F5E9] hover:border-[#A5D6A7] transition-all duration-200"
          >
            View Gallery
          </button>
        </div>
      </section>

      <section className="px-6 md:px-16 py-14 border-y border-[#C8E6C9] bg-[#F7FCF7]">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s, i) => (
            <div key={i}>
              <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#2E7D32] to-[#4CAF50] mb-1">{s.value}</div>
              <div className="text-gray-600 text-sm font-semibold uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-5 bg-[#E8F5E9] border-y border-[#C8E6C9] overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-0 shrink-0">
              {[
                'Student Events', 'Club Championships', 'Art Exhibitions',
                'Hackathons', 'Cultural Nights', 'Sports Meets',
                'Academic Workshops', 'Robotics Competitions', 'Talent Shows',
                'Swimming Finals', 'Quiz Challenges', 'Career Fairs',
              ].map((item, j) => (
                <span key={j} className="inline-flex items-center gap-3 px-6 text-sm font-bold uppercase tracking-widest text-[#2E7D32]">
                  {item}
                  <span className="text-[#F97316] text-lg">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 md:px-16 py-20 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14 md:mb-16">
            <div className="inline-block px-4 py-1.5 rounded-full bg-[#E8F5E9] border border-[#C8E6C9] text-[#2E7D32] text-xs font-bold uppercase tracking-widest mb-4">
              Platform Modules
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">Core Modules</h2>
            <p className="text-gray-600 text-lg max-w-xl mx-auto">Everything you need to run successful campus events, all in one place.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((m, i) => (
              <div
                key={i}
                className="group bg-white border border-[#C8E6C9] rounded-2xl p-6 shadow-sm shadow-green-900/5 hover:shadow-md hover:shadow-green-900/10 hover:border-[#A5D6A7] hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: m.accent + '20' }}>
                  {m.icon}
                </div>
                <h3 className="text-gray-900 font-bold text-lg mb-2">{m.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="px-8 py-8 text-center text-gray-500 text-sm border-t border-[#C8E6C9] bg-[#F7FCF7]">
        University Club & Event Management System © 2026 — Designed for Presentation
      </footer>
    </div>
  );
};

export default Home;
