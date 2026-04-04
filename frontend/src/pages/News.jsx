import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const newsData = [
  {
    id: 1,
    category: 'Sports',
    tag: '🏆 Achievement',
    title: 'Swimming Team Wins National Championship',
    summary: 'Our university swimming team clinched gold at the National Inter-University Swimming Championship, with three students breaking national records.',
    date: 'March 28, 2026',
    author: 'Sports Desk',
    color: 'from-[#2980b9] to-[#154360]',
    accent: '#2980b9',
  },
  {
    id: 2,
    category: 'Academic',
    tag: '🎓 Excellence',
    title: 'Students Win International AI Research Award',
    summary: 'A team of final-year computing students took first place at the Global AI Innovation Summit, impressing judges with their healthcare prediction model.',
    date: 'March 25, 2026',
    author: 'Academic Affairs',
    color: 'from-[#1FAF9A] to-[#0e6251]',
    accent: '#1FAF9A',
  },
  {
    id: 3,
    category: 'Sports',
    tag: '⚽ Sports',
    title: 'Football Club Advances to Regional Finals',
    summary: 'The university football club secured a dramatic last-minute victory to advance to the regional finals, scheduled for next month.',
    date: 'March 22, 2026',
    author: 'Sports Desk',
    color: 'from-[#4ade80] to-[#1b5e20]',
    accent: '#4ade80',
  },
  {
    id: 4,
    category: 'Academic',
    tag: '📚 Academic',
    title: 'Dean\'s List 2026 Announced — Record Number of Honorees',
    summary: 'This semester saw a record-breaking number of students make the Dean\'s List, reflecting the rising academic standards across all faculties.',
    date: 'March 20, 2026',
    author: 'Registrar Office',
    color: 'from-[#f59e0b] to-[#7e5109]',
    accent: '#f59e0b',
  },
  {
    id: 5,
    category: 'Winning',
    tag: '🥇 Winner',
    title: 'CodeRed Hackathon Champions Announced',
    summary: 'Team ByteForce won the 48-hour CodeRed Hackathon, building a real-time campus safety alert system that impressed all five industry judges.',
    date: 'March 18, 2026',
    author: 'Events Team',
    color: 'from-[#8e44ad] to-[#4a235a]',
    accent: '#8e44ad',
  },
  {
    id: 6,
    category: 'Winning',
    tag: '🎨 Arts',
    title: 'Art Club Student Wins National Design Competition',
    summary: 'Second-year student Aisha Malik won the National Student Design Award for her digital art series exploring cultural identity and modern technology.',
    date: 'March 15, 2026',
    author: 'Arts & Culture',
    color: 'from-[#e74c3c] to-[#78281f]',
    accent: '#e74c3c',
  },
  {
    id: 7,
    category: 'Academic',
    tag: '🔬 Research',
    title: 'University Research Paper Published in Nature Journal',
    summary: 'A groundbreaking research paper by the Biology department on sustainable biofuels has been accepted and published in the prestigious Nature journal.',
    date: 'March 12, 2026',
    author: 'Research Office',
    color: 'from-[#1abc9c] to-[#0e6251]',
    accent: '#1abc9c',
  },
  {
    id: 8,
    category: 'Sports',
    tag: '🏸 Sports',
    title: 'Badminton Team Sweeps Inter-University Tournament',
    summary: 'The university badminton team won all five categories at the Inter-University Badminton Tournament, bringing home the overall championship trophy.',
    date: 'March 10, 2026',
    author: 'Sports Desk',
    color: 'from-[#3498db] to-[#1a5276]',
    accent: '#3498db',
  },
];

const categories = ['All', 'Sports', 'Academic', 'Winning'];

export default function News() {
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  const filtered = filter === 'All' ? newsData : newsData.filter(n => n.category === filter);

  return (
    <div className="min-h-screen bg-white font-sans rounded-3xl overflow-hidden shadow-2xl relative">
      <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-[#14B8A6]/5 to-transparent pointer-events-none z-0"></div>

      <div className="relative z-10 p-6 md:p-8">
        {/* Navbar */}
        <nav className="w-full bg-white shadow-md border border-[#E2E8F0] px-8 py-5 flex flex-col md:flex-row justify-between items-center mb-16 rounded-3xl sticky top-4 z-50">
          <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#1FAF9A] to-[#14B8A6] tracking-tighter uppercase mb-4 md:mb-0">
            Uni Gallery
          </h1>
          <div className="flex gap-6 text-sm font-bold uppercase tracking-widest text-slate-500">
            <span className="text-slate-900 border-b-2 border-[#1FAF9A] pb-1">News</span>
            <span onClick={() => navigate('/portal')} className="hover:text-slate-900 cursor-pointer transition-colors">Events</span>
            <span onClick={() => navigate('/gallery')} className="hover:text-slate-900 cursor-pointer transition-colors">Gallery</span>
            <span onClick={() => navigate('/ticket-sales')} className="hover:text-slate-900 cursor-pointer transition-colors">Ticket Sales</span>
          </div>
        </nav>

        <main className="max-w-[1400px] mx-auto pb-20">
          {/* Heading */}
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1 rounded-full bg-[#1FAF9A]/10 border border-[#1FAF9A]/30 text-[#1FAF9A] text-xs font-bold uppercase tracking-widest mb-6">
              Latest Updates
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-slate-900 uppercase tracking-tighter mb-6">
              Campus <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1FAF9A] via-[#14B8A6] to-[#F97316]">News</span>
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
              Student achievements, sports victories, academic milestones, and everything happening on campus.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-8 py-3 rounded-full font-bold uppercase tracking-widest text-sm transition-all duration-300 border ${
                  filter === cat
                    ? 'bg-gradient-to-r from-[#1FAF9A] to-[#14B8A6] text-white border-transparent shadow-md scale-105'
                    : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* News Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map(item => (
              <div
                key={item.id}
                onClick={() => setSelected(item)}
                className="group bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1"
              >
                {/* Color Banner */}
                <div className={`h-3 w-full bg-gradient-to-r ${item.color}`}></div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white"
                      style={{ background: item.accent }}>
                      {item.tag}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">{item.date}</span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mb-3 leading-snug group-hover:text-[#1FAF9A] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-3">{item.summary}</p>
                  <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                    <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">{item.author}</span>
                    <span className="text-xs font-bold text-[#1FAF9A] uppercase tracking-wider group-hover:underline">Read More →</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center text-slate-400 py-20 text-2xl font-black uppercase tracking-widest border-2 border-dashed border-slate-200 rounded-3xl">
              No news found for this category.
            </div>
          )}
        </main>
      </div>

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className={`h-2 w-full bg-gradient-to-r ${selected.color}`}></div>
            <div className="p-8">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white mb-4 inline-block"
                style={{ background: selected.accent }}>
                {selected.tag}
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-3 mb-2 leading-snug">{selected.title}</h2>
              <div className="flex gap-4 text-xs text-slate-400 font-semibold uppercase tracking-wider mb-6">
                <span>{selected.date}</span>
                <span>·</span>
                <span>{selected.author}</span>
              </div>
              <p className="text-slate-600 leading-relaxed text-base">{selected.summary}</p>
              <button
                onClick={() => setSelected(null)}
                className="mt-8 w-full py-3 rounded-2xl font-bold uppercase tracking-widest text-sm text-white transition-all"
                style={{ background: `linear-gradient(to right, #1FAF9A, #14B8A6)` }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
