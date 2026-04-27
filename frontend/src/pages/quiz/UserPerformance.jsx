import React, { useEffect, useState, useCallback, useMemo } from 'react';

// Achievement data - extracted for better maintainability
const achievements = [
  {
    id: 1,
    quiz: 'Tech Symposium Basics',
    score: 100,
    date: 'March 19, 2026',
    status: 'Passed',
    badge: '🏆',
    badgeLabel: 'Gold',
    badgeColor: '#d4af37',
    bgGradient: 'linear-gradient(135deg, #fef9c3, #fde68a)',
    borderColor: '#d4af37',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tech&backgroundColor=b6e3f4',
    credential: 'CERT-TECH-2026-001',
    issuer: 'UNI EVENT PRO',
  },
  {
    id: 2,
    quiz: 'Art Workshop Recap',
    score: 40,
    date: 'March 15, 2026',
    status: 'Failed',
    badge: '📋',
    badgeLabel: 'Attempted',
    badgeColor: '#94a3b8',
    bgGradient: 'linear-gradient(135deg, #f1f5f9, #e2e8f0)',
    borderColor: '#cbd5e1',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=art&backgroundColor=ffdfbf',
    credential: null,
    issuer: null,
  },
];

// UI Constants
const TABS = [
  { id: 'achievements', label: '🏆 Achievements' },
  { id: 'history', label: '📋 Quiz History' },
];

const USER_STATUS_BADGES = [
  { label: '🎓 Student', variant: 'default' },
  { label: '📅 Joined 2026', variant: 'default' },
  { label: '✦ Active', variant: 'active' },
];

const AVATAR_BASE_URL = 'https://api.dicebear.com/7.x/avataaars/svg';

// Reusable Component: Stat Card
const StatCard = ({ icon, value, label, color }) => (
  <div className="rounded-2xl p-4 text-center flex-shrink-0 bg-white/80 backdrop-blur-sm border border-[#C8E6C9] shadow-sm">
    <div className="text-2xl mb-1">{icon}</div>
    <div className="text-xl font-black" style={{ color }}>{value}</div>
    <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mt-0.5">{label}</div>
  </div>
);

// Reusable Component: Status Badge
const StatusBadge = ({ label, variant = 'default' }) => {
  const variants = {
    default: 'bg-white/85 text-gray-700 border-[#C8E6C9]',
    active: 'bg-[#E8F5E9]/90 text-[#2E7D32] border-[#4CAF50]/40',
  };
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-sm ${variants[variant]}`}>
      {label}
    </span>
  );
};

// Reusable Component: Achievement Card
const AchievementCard = ({ achievement, userName, userEmail }) => {
  const passedAchievements = achievement.status === 'Passed';
  
  if (!passedAchievements) return null;
  
  return (
    <div 
      className="relative rounded-3xl overflow-hidden border shadow-lg hover:shadow-xl transition-shadow"
      style={{ background: achievement.bgGradient, borderColor: achievement.borderColor }}
    >
      {/* Top strip */}
      <div className="flex items-center justify-between px-6 pt-6 pb-4">
        <div className="flex items-center gap-3">
          <div 
            className="w-14 h-14 rounded-2xl overflow-hidden border-2 shadow-md flex-shrink-0"
            style={{ borderColor: achievement.borderColor, background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(8px)' }}
          >
            <img src={achievement.avatar} alt="avatar" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="font-black text-slate-800 text-sm">{userName}</p>
            <p className="text-xs text-slate-500 font-semibold">{achievement.date}</p>
          </div>
        </div>
        <div className="text-4xl">{achievement.badge}</div>
      </div>

      {/* Certificate body */}
      <div 
        className="mx-6 mb-6 rounded-2xl p-5"
        style={{ 
          background: 'rgba(255,255,255,0.55)', 
          backdropFilter: 'blur(16px)', 
          border: `1px solid ${achievement.borderColor}40` 
        }}
      >
        <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: achievement.badgeColor }}>
          Certificate of Achievement
        </p>
        <h2 className="text-lg font-black text-slate-800 mb-3">{achievement.quiz}</h2>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Score</p>
            <p className="text-2xl font-black" style={{ color: achievement.badgeColor }}>{achievement.score}%</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Issued by</p>
            <p className="text-sm font-black text-slate-700">{achievement.issuer}</p>
          </div>
        </div>

        {achievement.credential && (
          <div className="mt-4 pt-4 border-t flex items-center justify-between" style={{ borderColor: `${achievement.borderColor}40` }}>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Credential ID</p>
              <p className="text-xs font-black text-slate-600 font-mono">{achievement.credential}</p>
            </div>
            <span 
              className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider text-white shadow-sm"
              style={{ background: achievement.badgeColor }}
            >
              {achievement.badgeLabel}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

// Reusable Component: History Item
const HistoryItem = ({ achievement }) => (
  <div 
    className="flex items-center gap-5 rounded-2xl p-5 border transition-all hover:shadow-md"
    style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(12px)', borderColor: achievement.borderColor + '60' }}
  >
    <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border-2" style={{ borderColor: achievement.borderColor }}>
      <img src={achievement.avatar} alt="avatar" className="w-full h-full object-cover" />
    </div>
    <div className="flex-1">
      <p className="font-black text-slate-800 text-sm">{achievement.quiz}</p>
      <p className="text-xs text-slate-400 mt-0.5">{achievement.date}</p>
    </div>
    <div className="text-center">
      <p className="text-xl font-black" style={{ color: achievement.badgeColor }}>{achievement.score}%</p>
      <p className="text-[10px] text-slate-400 font-bold uppercase">Score</p>
    </div>
    <span 
      className="px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider"
      style={{
        background: achievement.status === 'Passed' ? '#dcfce7' : '#fee2e2',
        color: achievement.status === 'Passed' ? '#16a34a' : '#dc2626',
      }}
    >
      {achievement.status}
    </span>
    <div className="text-2xl">{achievement.badge}</div>
  </div>
);

// Main Component
export default function UserPerformance() {
  const [activeTab, setActiveTab] = useState('achievements');
  const [profile, setProfile] = useState(() => ({
    name: localStorage.getItem('userName') || 'Student User',
    email: localStorage.getItem('userEmail') || '',
  }));

  // Memoized computed stats to avoid recalculation
  const computedStats = useMemo(() => [
    { label: 'Quizzes Taken', value: 1, icon: '📝', color: '#4CAF50' },
    { label: 'Average Score', value: '100%', icon: '📊', color: '#6366f1' },
    { label: 'Certificates', value: 1, icon: '🎓', color: '#d4af37' },
    { label: 'Rank', value: '#12', icon: '🏆', color: '#f97316' },
  ], []);

  // Memoized filtered achievements
  const passedAchievements = useMemo(() => 
    achievements.filter(a => a.status === 'Passed'), 
    []
  );

  // Handle storage sync with useCallback
  const syncProfile = useCallback(() => {
    setProfile({
      name: localStorage.getItem('userName') || 'Student User',
      email: localStorage.getItem('userEmail') || '',
    });
  }, []);

  useEffect(() => {
    window.addEventListener('storage', syncProfile);
    return () => window.removeEventListener('storage', syncProfile);
  }, [syncProfile]);

  // Generate avatar URL based on profile name
  const avatarUrl = useMemo(() => 
    `${AVATAR_BASE_URL}/svg?seed=${encodeURIComponent(profile.name)}&backgroundColor=b6e3f4`,
    [profile.name]
  );

  return (
    <div className="min-h-screen bg-white font-sans p-6 max-w-5xl mx-auto">
      {/* Profile Hero Card */}
      <div
        className="relative rounded-3xl overflow-hidden mb-8 p-8 flex flex-col md:flex-row items-center gap-6"
        style={{
          background: 'linear-gradient(135deg, #FFFFFF 0%, #E8F5E9 55%, #C8E6C9 100%)',
          boxShadow: '0 20px 50px rgba(46, 125, 50, 0.12)',
        }}
      >
        {/* Decorative blur orb */}
        <div 
          className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #4CAF50, transparent)', filter: 'blur(60px)' }} 
        />

        {/* Avatar Section */}
        <div className="relative flex-shrink-0">
          <div className="w-28 h-28 rounded-2xl overflow-hidden border-4 border-white shadow-xl bg-white/95 backdrop-blur-sm">
            <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-[#4CAF50] flex items-center justify-center text-white text-xs font-black shadow-lg">
            ✓
          </div>
        </div>

        {/* User Info */}
        <div className="flex-1 text-center md:text-left">
          <p className="text-[#2E7D32] text-xs font-black uppercase tracking-widest mb-1">Student Portal</p>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">{profile.name}</h1>
          {profile.email && (
            <p className="text-sm font-semibold text-slate-500 -mt-1 mb-2">{profile.email}</p>
          )}
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            {USER_STATUS_BADGES.map((badge, idx) => (
              <StatusBadge key={idx} label={badge.label} variant={badge.variant} />
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full md:w-auto">
          {computedStats.map((stat, idx) => (
            <StatCard key={idx} {...stat} />
          ))}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex gap-2 mb-8 bg-slate-100 rounded-2xl p-1 w-fit">
        {TABS.map(({ id, label }) => (
          <button 
            key={id} 
            onClick={() => setActiveTab(id)}
            className={`px-5 py-2.5 rounded-xl text-sm font-black uppercase tracking-wider transition-all ${
              activeTab === id 
                ? 'bg-white text-slate-800 shadow-sm' 
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Achievements Tab */}
      {activeTab === 'achievements' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {passedAchievements.length > 0 ? (
            passedAchievements.map((achievement) => (
              <AchievementCard 
                key={achievement.id} 
                achievement={achievement} 
                userName={profile.name}
              />
            ))
          ) : (
            <div className="col-span-2 text-center py-16 text-slate-400">
              <div className="text-5xl mb-4">🎯</div>
              <p className="font-black uppercase tracking-widest text-sm">No achievements yet — keep going!</p>
            </div>
          )}
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="flex flex-col gap-4">
          {achievements.map((achievement) => (
            <HistoryItem key={achievement.id} achievement={achievement} />
          ))}
        </div>
      )}
    </div>
  );
}