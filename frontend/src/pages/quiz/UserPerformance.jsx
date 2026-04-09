import React, { useState } from 'react';

const userName = localStorage.getItem('userName') || 'Student User';

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

const stats = [
  { label: 'Quizzes Taken', value: 2, icon: '📝', color: '#4CAF50' },
  { label: 'Average Score', value: '70%', icon: '📊', color: '#6366f1' },
  { label: 'Certificates', value: 1, icon: '🎓', color: '#d4af37' },
  { label: 'Rank', value: '#12', icon: '🏅', color: '#f97316' },
];

export default function UserPerformance() {
  const [activeTab, setActiveTab] = useState('achievements'); // achievements | history

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
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #4CAF50, transparent)', filter: 'blur(60px)' }} />

        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div className="w-28 h-28 rounded-2xl overflow-hidden border-4 border-white shadow-xl"
            style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)' }}>
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}&backgroundColor=b6e3f4`}
              alt="avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-[#4CAF50] flex items-center justify-center text-white text-xs font-black shadow-lg">
            ✓
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 text-center md:text-left">
          <p className="text-[#2E7D32] text-xs font-black uppercase tracking-widest mb-1">Student Portal</p>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">{userName}</h1>
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            <span className="px-3 py-1 rounded-full text-xs font-bold text-gray-700 border border-[#C8E6C9]"
              style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)' }}>
              🎓 Student
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold text-gray-700 border border-[#C8E6C9]"
              style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)' }}>
              📅 Joined 2026
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold text-[#2E7D32] border border-[#4CAF50]/40"
              style={{ background: 'rgba(232,245,233,0.9)', backdropFilter: 'blur(8px)' }}>
              ✦ Active
            </span>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full md:w-auto">
          {stats.map((s, i) => (
            <div key={i} className="rounded-2xl p-4 text-center flex-shrink-0 bg-white/80 backdrop-blur-sm border border-[#C8E6C9] shadow-sm">
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-xl font-black" style={{ color: s.color }}>{s.value}</div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 bg-slate-100 rounded-2xl p-1 w-fit">
        {[
          { id: 'achievements', label: '🏆 Achievements' },
          { id: 'history', label: '📋 Quiz History' },
        ].map(({ id, label }) => (
          <button key={id} onClick={() => setActiveTab(id)}
            className={`px-5 py-2.5 rounded-xl text-sm font-black uppercase tracking-wider transition-all ${
              activeTab === id ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'
            }`}>
            {label}
          </button>
        ))}
      </div>

      {/* Achievements Tab */}
      {activeTab === 'achievements' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {achievements.filter(a => a.status === 'Passed').map((a) => (
            <div key={a.id} className="relative rounded-3xl overflow-hidden border shadow-lg hover:shadow-xl transition-shadow"
              style={{ background: a.bgGradient, borderColor: a.borderColor }}>

              {/* Top strip */}
              <div className="flex items-center justify-between px-6 pt-6 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 shadow-md flex-shrink-0"
                    style={{ borderColor: a.borderColor, background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(8px)' }}>
                    <img src={a.avatar} alt="avatar" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-black text-slate-800 text-sm">{userName}</p>
                    <p className="text-xs text-slate-500 font-semibold">{a.date}</p>
                  </div>
                </div>
                <div className="text-4xl">{a.badge}</div>
              </div>

              {/* Certificate body */}
              <div className="mx-6 mb-6 rounded-2xl p-5"
                style={{ background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(16px)', border: `1px solid ${a.borderColor}40` }}>
                <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: a.badgeColor }}>
                  Certificate of Achievement
                </p>
                <h2 className="text-lg font-black text-slate-800 mb-3">{a.quiz}</h2>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Score</p>
                    <p className="text-2xl font-black" style={{ color: a.badgeColor }}>{a.score}%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Issued by</p>
                    <p className="text-sm font-black text-slate-700">{a.issuer}</p>
                  </div>
                </div>

                {a.credential && (
                  <div className="mt-4 pt-4 border-t flex items-center justify-between" style={{ borderColor: `${a.borderColor}40` }}>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Credential ID</p>
                      <p className="text-xs font-black text-slate-600 font-mono">{a.credential}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider text-white shadow-sm"
                      style={{ background: a.badgeColor }}>
                      {a.badgeLabel}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {achievements.filter(a => a.status === 'Passed').length === 0 && (
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
          {achievements.map((a) => (
            <div key={a.id} className="flex items-center gap-5 rounded-2xl p-5 border transition-all hover:shadow-md"
              style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(12px)', borderColor: a.borderColor + '60' }}>
              <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border-2" style={{ borderColor: a.borderColor }}>
                <img src={a.avatar} alt="avatar" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <p className="font-black text-slate-800 text-sm">{a.quiz}</p>
                <p className="text-xs text-slate-400 mt-0.5">{a.date}</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-black" style={{ color: a.badgeColor }}>{a.score}%</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Score</p>
              </div>
              <span className="px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider"
                style={{
                  background: a.status === 'Passed' ? '#dcfce7' : '#fee2e2',
                  color: a.status === 'Passed' ? '#16a34a' : '#dc2626',
                }}>
                {a.status}
              </span>
              <div className="text-2xl">{a.badge}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
