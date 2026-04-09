import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const meetings = [
  {
    id: 1,
    title: 'CodeRed Hackathon Kickoff',
    type: 'Event',
    date: 'April 10, 2026 — 10:00 AM',
    platform: 'Zoom',
    organizer: 'Tech Society',
    venue: 'Online',
    description: 'Opening ceremony and team formation session for the CodeRed Hackathon 2026.',
    accent: '#4CAF50',
    link: 'https://zoom.us/j/1234567890',
  },
  {
    id: 2,
    title: 'Robotics Club Weekly Sync',
    type: 'Club',
    date: 'April 11, 2026 — 3:00 PM',
    platform: 'Google Meet',
    organizer: 'Robotics Club',
    venue: 'Engineering Lab 4',
    description: 'Weekly progress update and task assignment for the upcoming inter-university robotics competition.',
    accent: '#F97316',
    link: 'https://meet.google.com/abc-defg-hij',
  },
  {
    id: 3,
    title: 'Cultural Night Planning',
    type: 'Event',
    date: 'April 14, 2026 — 2:00 PM',
    platform: 'Microsoft Teams',
    organizer: 'Arts & Culture Committee',
    venue: 'Open Air Theater',
    description: 'Coordination meeting for performance slots, costume arrangements, and stage setup.',
    accent: '#8B5CF6',
    link: 'https://teams.microsoft.com/l/meetup-join/cultural2026',
  },
  {
    id: 4,
    title: 'Swimming Finals Briefing',
    type: 'Event',
    date: 'April 18, 2026 — 9:00 AM',
    platform: 'Zoom',
    organizer: 'Sports Council',
    venue: 'University Pool',
    description: 'Pre-event briefing for all participating faculties and event marshals.',
    accent: '#2980b9',
    link: 'https://zoom.us/j/9876543210',
  },
  {
    id: 5,
    title: 'Photography Club Monthly Meet',
    type: 'Club',
    date: 'April 20, 2026 — 5:00 PM',
    platform: 'Google Meet',
    organizer: 'Photography Club',
    venue: 'Media Lab',
    description: 'Monthly showcase of member work and planning for upcoming campus event coverage.',
    accent: '#4CAF50',
    link: 'https://meet.google.com/xyz-uvwx-yz1',
  },
  {
    id: 6,
    title: 'Career Fair Organizer Sync',
    type: 'Event',
    date: 'April 22, 2026 — 11:00 AM',
    platform: 'Microsoft Teams',
    organizer: 'Career Guidance Unit',
    venue: 'University Grounds',
    description: 'Final logistics check for booth assignments, guest speakers, and student registration.',
    accent: '#f59e0b',
    link: 'https://teams.microsoft.com/l/meetup-join/careerfair2026',
  },
];

const types = ['All', 'Event', 'Club'];

const platformIcon = (p) => {
  if (p === 'Zoom') return '📹';
  if (p === 'Google Meet') return '🟢';
  return '🔵';
};

export default function PublicMeetings() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');

  const filtered = filter === 'All' ? meetings : meetings.filter(m => m.type === filter);

  return (
    <div className="min-h-screen bg-white font-sans rounded-3xl overflow-hidden shadow-lg shadow-green-900/5 relative">
      <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-[#E8F5E9]/80 to-transparent pointer-events-none z-0" />

      <div className="relative z-10 p-6 md:p-8">
        <nav className="w-full bg-white shadow-md border border-[#C8E6C9] px-8 py-5 flex flex-col md:flex-row justify-between items-center mb-16 rounded-3xl sticky top-4 z-50">
          <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#2E7D32] to-[#4CAF50] tracking-tighter uppercase mb-4 md:mb-0">
            Uni Gallery
          </h1>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm font-bold uppercase tracking-widest text-gray-600">
            <span onClick={() => navigate('/news')} className="hover:text-[#2E7D32] cursor-pointer transition-colors">News</span>
            <span className="text-[#2E7D32] border-b-2 border-[#4CAF50] pb-1">Meetings</span>
            <span onClick={() => navigate('/gallery')} className="hover:text-[#2E7D32] cursor-pointer transition-colors">Gallery</span>
            <span onClick={() => navigate('/ticket-sales')} className="hover:text-[#2E7D32] cursor-pointer transition-colors">Ticket Sales</span>
          </div>
        </nav>

        <main className="max-w-[1400px] mx-auto pb-20">
          {/* Heading */}
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1 rounded-full bg-[#E8F5E9] border border-[#C8E6C9] text-[#2E7D32] text-xs font-bold uppercase tracking-widest mb-6">
              Upcoming Schedules
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-gray-900 uppercase tracking-tighter mb-6">
              Event <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2E7D32] via-[#4CAF50] to-[#F97316]">Meetings</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto font-medium">
              Stay up to date with all upcoming event coordination and club meetings on campus.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {types.map(t => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-8 py-3 rounded-full font-bold uppercase tracking-widest text-sm transition-all duration-300 border ${
                  filter === t
                    ? 'bg-gradient-to-r from-[#43A047] to-[#4CAF50] text-white border-transparent shadow-md shadow-green-600/20 scale-105'
                    : 'bg-white text-gray-600 border-[#C8E6C9] hover:bg-[#E8F5E9] hover:text-[#2E7D32]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Meeting Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(m => (
              <div key={m.id} className="bg-white border border-[#C8E6C9] rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-[#A5D6A7] hover:-translate-y-1 transition-all duration-300">
                <div className="h-1.5 w-full" style={{ background: m.accent }}></div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                      style={{ background: m.accent + '22', border: '1px solid ' + m.accent + '55', color: m.accent }}>
                      {m.type}
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">{platformIcon(m.platform)} {m.platform}</span>
                  </div>
                  <h3 className="text-gray-900 font-black text-lg mb-2 leading-snug">{m.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-2">{m.description}</p>
                  <div className="space-y-1.5 text-xs text-gray-500 border-t border-[#E8F5E9] pt-4">
                    <div className="flex items-center gap-2">📅 <span>{m.date}</span></div>
                    <div className="flex items-center gap-2">📍 <span>{m.venue}</span></div>
                    <div className="flex items-center gap-2">👤 <span>{m.organizer}</span></div>
                  </div>
                  <a
                    href={m.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-bold text-sm uppercase tracking-widest text-white transition-all hover:-translate-y-0.5 hover:shadow-lg"
                    style={{ background: `linear-gradient(to right, ${m.accent}cc, ${m.accent})` }}
                  >
                    🔗 Join Meeting
                  </a>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center text-gray-500 py-20 text-2xl font-black uppercase tracking-widest border-2 border-dashed border-[#C8E6C9] rounded-3xl bg-[#F7FCF7]">
              No meetings found.
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
