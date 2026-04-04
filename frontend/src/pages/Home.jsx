import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarOutlined, SafetyCertificateOutlined, DollarOutlined, ArrowRightOutlined, TeamOutlined, TrophyOutlined, FileProtectOutlined } from '@ant-design/icons';

const Home = () => {
  const navigate = useNavigate();

  const modules = [
    {
      icon: <CalendarOutlined style={{ fontSize: 36, color: '#14B8A6' }} />,
      title: 'Event & Club Management',
      desc: 'Create events, manage venues, and automate club approvals instantly.',
      accent: '#14B8A6',
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
      icon: <TeamOutlined style={{ fontSize: 36, color: '#1FAF9A' }} />,
      title: 'User Management',
      desc: 'Manage student profiles, roles, and access permissions from one place.',
      accent: '#1FAF9A',
    },
    {
      icon: <TrophyOutlined style={{ fontSize: 36, color: '#f59e0b' }} />,
      title: 'Sponsorships',
      desc: 'Connect events with sponsors and manage sponsorship proposals seamlessly.',
      accent: '#f59e0b',
    },
    {
      icon: <FileProtectOutlined style={{ fontSize: 36, color: '#14B8A6' }} />,
      title: 'Secure Meetings',
      desc: 'Schedule and manage secure committee meetings with full audit trails.',
      accent: '#14B8A6',
    },
  ];

  const stats = [
    { value: '500+', label: 'Students Enrolled' },
    { value: '50+', label: 'Events Hosted' },
    { value: '20+', label: 'Active Clubs' },
    { value: '100%', label: 'Digital Process' },
  ];

  return (
    <div className="min-h-screen bg-[#0F172A] text-white flex flex-col font-sans">

      {/* Navbar */}
      <nav className="px-8 md:px-16 py-4 flex justify-between items-center border-b border-white/10 bg-[#0F172A]/90 backdrop-blur-md sticky top-0 z-50">
        <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#1FAF9A] to-[#14B8A6] tracking-tight uppercase">
          UniEvents
        </span>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/login')} className="px-5 py-2 text-sm font-bold text-gray-300 hover:text-white transition-colors">
            Log in
          </button>
          <button onClick={() => navigate('/register')} className="px-5 py-2 text-sm font-bold bg-gradient-to-r from-[#0F766E] to-[#14B8A6] rounded-full text-white hover:shadow-lg hover:shadow-[#14B8A6]/30 transition-all">
            Sign Up
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 py-28 md:py-36 overflow-hidden">
        {/* Glow blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#14B8A6]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-[#F97316]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#14B8A6]/10 border border-[#14B8A6]/30 text-[#14B8A6] text-xs font-bold uppercase tracking-widest mb-8">
          🎓 University Club & Event Platform
        </div>

        <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tight mb-6 max-w-4xl">
          Manage University{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1FAF9A] via-[#14B8A6] to-[#F97316]">
            Events
          </span>{' '}
          with Ease
        </h1>

        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
          An all-in-one platform for students, clubs, and administrators. Handle event approvals, ticket sales, budgets, and certifications from a single dashboard.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/register')}
            className="px-8 py-4 bg-gradient-to-r from-[#0F766E] to-[#14B8A6] rounded-2xl font-bold text-white text-base hover:shadow-xl hover:shadow-[#14B8A6]/30 hover:-translate-y-0.5 transition-all flex items-center gap-2"
          >
            Get Started Now <ArrowRightOutlined />
          </button>
          <button
            onClick={() => navigate('/login', { state: { from: '/gallery' } })}
            className="px-8 py-4 border border-white/20 rounded-2xl font-bold text-gray-300 text-base hover:bg-white/5 hover:border-white/40 transition-all"
          >
            View Gallery
          </button>
        </div>
      </section>

      {/* Stats */}
      <section className="px-6 md:px-16 py-12 border-y border-white/10 bg-white/[0.02]">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s, i) => (
            <div key={i}>
              <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#1FAF9A] to-[#14B8A6] mb-1">{s.value}</div>
              <div className="text-gray-400 text-sm font-semibold uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Scrolling Ticker */}      <section className="py-5 bg-[#0F766E]/10 border-y border-[#14B8A6]/20 overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-0 shrink-0">
              {[
                '🎓 Student Events', '🏆 Club Championships', '🎨 Art Exhibitions',
                '💻 Hackathons', '🎵 Cultural Nights', '⚽ Sports Meets',
                '📚 Academic Workshops', '🤖 Robotics Competitions', '🎤 Talent Shows',
                '🏊 Swimming Finals', '🎯 Quiz Challenges', '🌍 Career Fairs',
              ].map((item, j) => (
                <span key={j} className="inline-flex items-center gap-3 px-6 text-sm font-bold uppercase tracking-widest text-[#14B8A6]">
                  {item}
                  <span className="text-[#F97316] text-lg">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Core Modules */}
      <section className="px-6 md:px-16 py-24 bg-[#0F172A]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1 rounded-full bg-[#1FAF9A]/10 border border-[#1FAF9A]/30 text-[#1FAF9A] text-xs font-bold uppercase tracking-widest mb-4">
              Platform Modules
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Core Modules</h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">Everything you need to run successful campus events, all in one place.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((m, i) => (
              <div
                key={i}
                className="group bg-white/[0.03] border border-white/10 rounded-2xl p-6 hover:bg-white/[0.06] hover:border-white/20 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: m.accent + '18' }}>
                  {m.icon}
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{m.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-8 py-6 text-center text-gray-600 text-sm border-t border-white/10 bg-[#0F172A]">
        University Club & Event Management System © 2026 — Designed for Presentation
      </footer>
    </div>
  );
};

export default Home;
