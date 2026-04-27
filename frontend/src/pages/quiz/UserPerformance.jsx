import React, { useEffect, useState, useCallback, useMemo, lazy, Suspense } from 'react';

// Achievement data - enhanced with more realistic data
const achievementsData = [
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
    duration: '45 minutes',
    questions: 20,
    perfectScore: true
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
    duration: '30 minutes',
    questions: 15,
    perfectScore: false
  },
  {
    id: 3,
    quiz: 'Data Science Fundamentals',
    score: 85,
    date: 'March 10, 2026',
    status: 'Passed',
    badge: '🥈',
    badgeLabel: 'Silver',
    badgeColor: '#94a3b8',
    bgGradient: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
    borderColor: '#86efac',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=datascience&backgroundColor=dcfce7',
    credential: 'CERT-DS-2026-002',
    issuer: 'Data Science Society',
    duration: '60 minutes',
    questions: 25,
    perfectScore: false
  }
];

// UI Constants
const TABS = [
  { id: 'achievements', label: '🏆 Achievements', icon: '🏆' },
  { id: 'history', label: '📋 Quiz History', icon: '📋' },
  { id: 'analytics', label: '📊 Analytics', icon: '📊' },
];

const USER_STATUS_BADGES = [
  { label: '🎓 Student', variant: 'default', tooltip: 'Student Status' },
  { label: '📅 Joined 2026', variant: 'default', tooltip: 'Member since' },
  { label: '✦ Active', variant: 'active', tooltip: 'Currently active' },
  { label: '⭐ Pro Learner', variant: 'premium', tooltip: 'Premium member' },
];

const AVATAR_BASE_URL = 'https://api.dicebear.com/7.x/avataaars/svg';

// Custom Hooks
const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      localStorage.setItem(key, JSON.stringify(valueToStore));
      window.dispatchEvent(new StorageEvent('storage', { key, newValue: JSON.stringify(valueToStore) }));
    } catch (error) {
      console.error(error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
};

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

// Reusable Components
const StatCard = ({ icon, value, label, color, trend, onClick }) => (
  <div 
    onClick={onClick}
    className="rounded-2xl p-4 text-center flex-shrink-0 bg-white/80 backdrop-blur-sm border border-[#C8E6C9] shadow-sm hover:shadow-md transition-all cursor-pointer group"
  >
    <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">{icon}</div>
    <div className="text-xl font-black" style={{ color }}>{value}</div>
    <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mt-0.5">{label}</div>
    {trend && (
      <div className={`text-xs mt-1 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
        {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
      </div>
    )}
  </div>
);

const StatusBadge = ({ label, variant = 'default', tooltip, onClick }) => {
  const variants = {
    default: 'bg-white/85 text-gray-700 border-[#C8E6C9]',
    active: 'bg-[#E8F5E9]/90 text-[#2E7D32] border-[#4CAF50]/40',
    premium: 'bg-gradient-to-r from-yellow-50 to-amber-50 text-amber-700 border-amber-200',
    warning: 'bg-orange-50 text-orange-700 border-orange-200',
  };
  
  return (
    <div className="relative group">
      <span 
        onClick={onClick}
        className={`px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-sm cursor-pointer hover:scale-105 transition-transform inline-block ${variants[variant]}`}
      >
        {label}
      </span>
      {tooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
          {tooltip}
        </div>
      )}
    </div>
  );
};

const AchievementCard = ({ achievement, userName, userEmail, onShare }) => {
  const passedAchievements = achievement.status === 'Passed';
  const [isHovered, setIsHovered] = useState(false);
  
  if (!passedAchievements) return null;
  
  return (
    <div 
      className="relative rounded-3xl overflow-hidden border shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
      style={{ background: achievement.bgGradient, borderColor: achievement.borderColor }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top strip */}
      <div className="flex items-center justify-between px-6 pt-6 pb-4">
        <div className="flex items-center gap-3">
          <div 
            className="w-14 h-14 rounded-2xl overflow-hidden border-2 shadow-md flex-shrink-0 transition-all duration-300"
            style={{ borderColor: achievement.borderColor, background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(8px)' }}
          >
            <img src={achievement.avatar} alt="avatar" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="font-black text-slate-800 text-sm">{userName}</p>
            <p className="text-xs text-slate-500 font-semibold">{achievement.date}</p>
          </div>
        </div>
        <div className="text-4xl animate-bounce-slow">{achievement.badge}</div>
      </div>

      {/* Certificate body */}
      <div 
        className="mx-6 mb-6 rounded-2xl p-5 transition-all duration-300"
        style={{ 
          background: isHovered ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.55)', 
          backdropFilter: 'blur(16px)', 
          border: `1px solid ${achievement.borderColor}40`,
          transform: isHovered ? 'scale(1.02)' : 'scale(1)'
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

        {/* Additional stats */}
        <div className="mt-3 flex justify-between text-xs text-slate-500">
          <span>⏱️ {achievement.duration}</span>
          <span>📝 {achievement.questions} questions</span>
        </div>

        {achievement.credential && (
          <div className="mt-4 pt-4 border-t flex items-center justify-between" style={{ borderColor: `${achievement.borderColor}40` }}>
            <div className="flex-1">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Credential ID</p>
              <p className="text-xs font-black text-slate-600 font-mono">{achievement.credential}</p>
            </div>
            <button
              onClick={() => onShare?.(achievement)}
              className="ml-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider text-white shadow-sm hover:shadow-md transition-all"
              style={{ background: achievement.badgeColor }}
            >
              Share 🎉
            </button>
          </div>
        )}
      </div>

      {/* Decorative ribbon */}
      {achievement.perfectScore && (
        <div className="absolute top-0 right-0 w-16 h-16">
          <div className="absolute transform rotate-45 bg-yellow-400 text-xs font-bold py-1 right-[-35px] top-[18px] w-40 text-center shadow-md">
            PERFECT! 🎯
          </div>
        </div>
      )}
    </div>
  );
};

const HistoryItem = ({ achievement, onRetake }) => (
  <div 
    className="flex items-center gap-5 rounded-2xl p-5 border transition-all hover:shadow-md hover:scale-[1.02] cursor-pointer group"
    style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(12px)', borderColor: achievement.borderColor + '60' }}
  >
    <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-transform group-hover:scale-110" style={{ borderColor: achievement.borderColor }}>
      <img src={achievement.avatar} alt="avatar" className="w-full h-full object-cover" />
    </div>
    <div className="flex-1">
      <p className="font-black text-slate-800 text-sm">{achievement.quiz}</p>
      <p className="text-xs text-slate-400 mt-0.5">{achievement.date}</p>
      <p className="text-xs text-slate-400 mt-1">⏱️ {achievement.duration} • {achievement.questions} questions</p>
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
    <div className="text-2xl group-hover:scale-125 transition-transform">{achievement.badge}</div>
    {achievement.status === 'Failed' && (
      <button
        onClick={() => onRetake?.(achievement)}
        className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider bg-blue-500 text-white hover:bg-blue-600 transition-all"
      >
        Retake ↻
      </button>
    )}
  </div>
);

const AnalyticsTab = ({ achievements }) => {
  const [animationProgress, setAnimationProgress] = useState(0);
  
  const stats = useMemo(() => {
    const total = achievements.length;
    const passed = achievements.filter(a => a.status === 'Passed').length;
    const avgScore = Math.round(achievements.reduce((sum, a) => sum + a.score, 0) / total);
    const perfectScores = achievements.filter(a => a.perfectScore).length;
    
    return { total, passed, avgScore, perfectScores, passRate: Math.round((passed / total) * 100) };
  }, [achievements]);

  useEffect(() => {
    const timer = setTimeout(() => setAnimationProgress(stats.passRate), 100);
    return () => clearTimeout(timer);
  }, [stats.passRate]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Quizzes', value: stats.total, icon: '📚', color: '#6366f1' },
          { label: 'Pass Rate', value: `${stats.passRate}%`, icon: '✅', color: '#10b981' },
          { label: 'Avg Score', value: `${stats.avgScore}%`, icon: '📊', color: '#f59e0b' },
          { label: 'Perfect Scores', value: stats.perfectScores, icon: '⭐', color: '#ef4444' }
        ].map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>

      {/* Progress Circle */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-[#C8E6C9]">
        <h3 className="font-black mb-4 text-gray-800">Overall Performance</h3>
        <div className="relative w-48 h-48 mx-auto">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="#e5e7eb"
              strokeWidth="12"
              fill="none"
            />
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="url(#gradient)"
              strokeWidth="12"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 88}`}
              strokeDashoffset={`${2 * Math.PI * 88 * (1 - animationProgress / 100)}`}
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#4CAF50" />
                <stop offset="100%" stopColor="#8BC34A" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl font-black text-gray-800">{animationProgress}%</div>
              <div className="text-xs text-gray-500 mt-1">Pass Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Achievement Timeline */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-[#C8E6C9]">
        <h3 className="font-black mb-4 text-gray-800">Achievement Timeline</h3>
        <div className="space-y-3">
          {achievements.map((achievement, idx) => (
            <div key={idx} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/50 transition-all">
              <div className="text-2xl">{achievement.badge}</div>
              <div className="flex-1">
                <p className="font-bold text-sm">{achievement.quiz}</p>
                <p className="text-xs text-gray-500">{achievement.date}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-sm" style={{ color: achievement.badgeColor }}>{achievement.score}%</p>
                <p className="text-xs text-gray-500">{achievement.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Main Component
export default function UserPerformance() {
  const [activeTab, setActiveTab] = useState('achievements');
  const [profile, setProfile] = useLocalStorage('userProfile', {
    name: 'Student User',
    email: 'student@example.com'
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(profile.name);
  const [editEmail, setEditEmail] = useState(profile.email);
  const [showNotification, setShowNotification] = useState(null);
  const debouncedName = useDebounce(editName, 500);

  // Update localStorage when debounced name changes
  useEffect(() => {
    if (debouncedName !== profile.name) {
      setProfile({ ...profile, name: debouncedName });
    }
  }, [debouncedName, profile, setProfile]);

  const computedStats = useMemo(() => {
    const totalQuizzes = achievementsData.length;
    const passedQuizzes = achievementsData.filter(a => a.status === 'Passed').length;
    const avgScore = Math.round(achievementsData.reduce((sum, a) => sum + a.score, 0) / totalQuizzes);
    const certificates = achievementsData.filter(a => a.credential).length;
    
    return [
      { label: 'Quizzes Taken', value: totalQuizzes, icon: '📝', color: '#4CAF50', trend: +12 },
      { label: 'Average Score', value: `${avgScore}%`, icon: '📊', color: '#6366f1', trend: +5 },
      { label: 'Certificates', value: certificates, icon: '🎓', color: '#d4af37', trend: +2 },
      { label: 'Overall Rank', value: '#8', icon: '🏆', color: '#f97316', trend: +15 },
    ];
  }, []);

  const passedAchievements = useMemo(() => 
    achievementsData.filter(a => a.status === 'Passed'), 
    []
  );

  const handleShare = useCallback((achievement) => {
    const shareText = `🎉 I earned ${achievement.score}% on "${achievement.quiz}" quiz! Check out my achievement!`;
    navigator.clipboard.writeText(shareText);
    setShowNotification({ message: 'Copied to clipboard!', type: 'success' });
    setTimeout(() => setShowNotification(null), 3000);
  }, []);

  const handleRetake = useCallback((achievement) => {
    setShowNotification({ message: `Retaking "${achievement.quiz}"...`, type: 'info' });
    setTimeout(() => setShowNotification(null), 3000);
  }, []);

  const handleSaveProfile = useCallback(() => {
    setProfile({ name: editName, email: editEmail });
    setIsEditing(false);
    setShowNotification({ message: 'Profile updated!', type: 'success' });
    setTimeout(() => setShowNotification(null), 3000);
  }, [editName, editEmail, setProfile]);

  const avatarUrl = useMemo(() => 
    `${AVATAR_BASE_URL}/svg?seed=${encodeURIComponent(profile.name)}&backgroundColor=b6e3f4`,
    [profile.name]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-sans p-6 max-w-7xl mx-auto">
      {/* Notification Toast */}
      {showNotification && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className={`px-4 py-2 rounded-lg shadow-lg ${
            showNotification.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
          } text-white font-semibold`}>
            {showNotification.message}
          </div>
        </div>
      )}

      {/* Profile Hero Card */}
      <div
        className="relative rounded-3xl overflow-hidden mb-8 p-8 flex flex-col md:flex-row items-center gap-6 transform hover:scale-[1.01] transition-transform duration-300"
        style={{
          background: 'linear-gradient(135deg, #FFFFFF 0%, #E8F5E9 55%, #C8E6C9 100%)',
          boxShadow: '0 20px 50px rgba(46, 125, 50, 0.12)',
        }}
      >
        {/* Animated decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-20 animate-pulse pointer-events-none"
          style={{ background: 'radial-gradient(circle, #4CAF50, transparent)', filter: 'blur(60px)' }} 
        />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-10 animate-pulse delay-1000 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #8BC34A, transparent)', filter: 'blur(50px)' }} 
        />

        {/* Avatar Section */}
        <div className="relative flex-shrink-0 group">
          <div className="w-28 h-28 rounded-2xl overflow-hidden border-4 border-white shadow-xl bg-white/95 backdrop-blur-sm transition-transform group-hover:scale-105">
            <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-[#4CAF50] flex items-center justify-center text-white text-xs font-black shadow-lg transition-transform group-hover:scale-110">
            ✓
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center text-xs shadow-md hover:scale-110 transition-transform"
          >
            ✏️
          </button>
        </div>

        {/* User Info */}
        <div className="flex-1 text-center md:text-left">
          <p className="text-[#2E7D32] text-xs font-black uppercase tracking-widest mb-1">Student Portal</p>
          {isEditing ? (
            <div className="space-y-2">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="px-3 py-1 rounded-lg border border-gray-300 text-lg font-black"
                placeholder="Name"
              />
              <input
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                className="px-3 py-1 rounded-lg border border-gray-300 text-sm ml-2"
                placeholder="Email"
              />
              <button
                onClick={handleSaveProfile}
                className="ml-2 px-3 py-1 bg-green-500 text-white rounded-lg text-sm font-bold"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="ml-2 px-3 py-1 bg-gray-500 text-white rounded-lg text-sm font-bold"
              >
                Cancel
              </button>
            </div>
          ) : (
            <>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">{profile.name}</h1>
              {profile.email && (
                <p className="text-sm font-semibold text-slate-500 -mt-1 mb-2">{profile.email}</p>
              )}
            </>
          )}
          <div className="flex flex-wrap gap-2 justify-center md:justify-start mt-2">
            {USER_STATUS_BADGES.map((badge, idx) => (
              <StatusBadge key={idx} label={badge.label} variant={badge.variant} tooltip={badge.tooltip} />
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full md:w-auto">
          {computedStats.map((stat, idx) => (
            <StatCard key={idx} {...stat} onClick={() => setActiveTab('analytics')} />
          ))}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex gap-2 mb-8 bg-slate-100 rounded-2xl p-1 w-fit mx-auto md:mx-0">
        {TABS.map(({ id, label, icon }) => (
          <button 
            key={id} 
            onClick={() => setActiveTab(id)}
            className={`px-5 py-2.5 rounded-xl text-sm font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === id 
                ? 'bg-white text-slate-800 shadow-sm' 
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <span>{icon}</span>
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <Suspense fallback={<div className="text-center py-10">Loading...</div>}>
        {activeTab === 'achievements' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {passedAchievements.length > 0 ? (
              passedAchievements.map((achievement) => (
                <AchievementCard 
                  key={achievement.id} 
                  achievement={achievement} 
                  userName={profile.name}
                  userEmail={profile.email}
                  onShare={handleShare}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-16 text-slate-400">
                <div className="text-5xl mb-4 animate-bounce">🎯</div>
                <p className="font-black uppercase tracking-widest text-sm">No achievements yet — keep going!</p>
                <button className="mt-4 px-6 py-2 bg-green-500 text-white rounded-full text-sm font-bold hover:bg-green-600 transition-all">
                  Start Quiz Now →
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="flex flex-col gap-4">
            {achievementsData.map((achievement) => (
              <HistoryItem 
                key={achievement.id} 
                achievement={achievement} 
                onRetake={handleRetake}
              />
            ))}
          </div>
        )}

        {activeTab === 'analytics' && (
          <AnalyticsTab achievements={achievementsData} />
        )}
      </Suspense>

      {/* Add custom CSS for animations */}
      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}