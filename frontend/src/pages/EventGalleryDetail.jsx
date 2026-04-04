import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const galleryDetails = {
  'spring-break-hackathon': {
    title: 'Spring Break Hackathon',
    date: '18 - 21 MAY 2026',
    venue: 'Computing Faculty',
    category: 'Academic',
    description: 'A 4-day intense coding competition with industry mentors, midnight pizza, and amazing prizes for the most innovative solutions.',
    accent: '#4ade80',
    images: [
      '/gallery/hackathon.png',
      '/gallery/chess.png',
      '/gallery/hackathon.png',
      '/gallery/chess.png',
      '/gallery/hackathon.png',
      '/gallery/chess.png',
    ],
    highlights: ['150+ Participants', '12 Industry Mentors', '3 Prize Categories', '48-Hour Coding Sprint'],
  },
  'inter-faculty-swimming-finals': {
    title: 'Inter-Faculty Swimming Finals',
    date: '26 - 29 MAY 2026',
    venue: 'University Pool',
    category: 'Sports',
    description: 'Cheer for your faculty as the best swimmers compete for the ultimate championship trophy in various freestyle and relay events.',
    accent: '#2980b9',
    images: [
      '/gallery/swimming.png',
      '/gallery/swimming.png',
      '/gallery/swimming.png',
      '/gallery/swimming.png',
      '/gallery/swimming.png',
      '/gallery/swimming.png',
    ],
    highlights: ['8 Faculties Competed', '24 Events', '3 National Records Broken', 'Best Swimmer Award'],
  },
  'university-chess-masters': {
    title: 'University Chess Masters',
    date: '06 - 07 JUN 2026',
    venue: 'Main Library',
    category: 'Sports',
    description: 'A quiet but fiercely competitive weekend of blitz and classical chess tournaments among top strategic minds on campus.',
    accent: '#8e44ad',
    images: [
      '/gallery/chess.png',
      '/gallery/chess.png',
      '/gallery/chess.png',
      '/gallery/chess.png',
      '/gallery/chess.png',
      '/gallery/chess.png',
    ],
    highlights: ['64 Players', 'Blitz & Classical Rounds', 'Grand Master Guest', 'Trophy + Scholarship'],
  },
  'global-tech-symposium': {
    title: 'Global Tech Symposium',
    date: '08 - 10 JUN 2026',
    venue: 'Main Auditorium',
    category: 'Workshop',
    description: 'Three days of keynote speeches, panel discussions, and networking featuring top executives from leading tech giants.',
    accent: '#1abc9c',
    images: [
      '/gallery/hackathon.png',
      '/gallery/hackathon.png',
      '/gallery/hackathon.png',
      '/gallery/hackathon.png',
      '/gallery/hackathon.png',
      '/gallery/hackathon.png',
    ],
    highlights: ['20+ Speakers', '500 Attendees', '3-Day Program', 'Live Demos & Panels'],
  },
  'annual-cultural-night': {
    title: 'Annual Cultural Night',
    date: '16 - 17 JUN 2026',
    venue: 'Open Air Theater',
    category: 'Cultural',
    description: 'Experience a vibrant showcase of music, dance, and theatrical performances representing our diverse student body.',
    accent: '#e74c3c',
    images: [
      '/gallery/music.png',
      '/gallery/art.png',
      '/gallery/music.png',
      '/gallery/art.png',
      '/gallery/music.png',
      '/gallery/art.png',
    ],
    highlights: ['30+ Performances', '15 Nationalities', 'Best Act Award', 'Live Band Night'],
  },
  'robotics-workshop-2026': {
    title: 'Robotics Workshop 2026',
    date: '22 JUN 2026',
    venue: 'Engineering Lab 4',
    category: 'Workshop',
    description: 'Hands-on session building Arduino-based autonomous line-following and maze-solving robots from scratch.',
    accent: '#f39c12',
    images: [
      '/gallery/chess.png',
      '/gallery/hackathon.png',
      '/gallery/chess.png',
      '/gallery/hackathon.png',
      '/gallery/chess.png',
      '/gallery/hackathon.png',
    ],
    highlights: ['40 Participants', 'Arduino Kits Provided', 'Line-Following Challenge', 'Maze Solver Finals'],
  },
};

export default function EventGalleryDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const event = galleryDetails[slug];

  if (!event) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-400 text-2xl font-black uppercase tracking-widest mb-6">Gallery not found</p>
          <button onClick={() => navigate('/gallery')} className="px-8 py-3 rounded-full bg-[#1FAF9A] text-white font-bold uppercase tracking-widest text-sm">
            Back to Gallery
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Navbar */}
      <nav className="w-full bg-white shadow-md border border-[#E2E8F0] px-8 py-5 flex justify-between items-center sticky top-0 z-50">
        <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#1FAF9A] to-[#14B8A6] tracking-tighter uppercase">
          Uni Gallery
        </h1>
        <div className="flex gap-6 text-sm font-bold uppercase tracking-widest text-slate-500">
          <span onClick={() => navigate('/news')} className="hover:text-slate-900 cursor-pointer transition-colors">News</span>
          <span onClick={() => navigate('/meetings')} className="hover:text-slate-900 cursor-pointer transition-colors">Meetings</span>
          <span onClick={() => navigate('/gallery')} className="text-slate-900 border-b-2 border-[#1FAF9A] pb-1 cursor-pointer">Gallery</span>
          <span onClick={() => navigate('/ticket-sales')} className="hover:text-slate-900 cursor-pointer transition-colors">Ticket Sales</span>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative h-72 overflow-hidden">
        <img src={event.images[0]} alt={event.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        <div className="absolute bottom-8 left-8 right-8">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white mb-3 inline-block"
            style={{ background: event.accent }}>
            {event.category}
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight">{event.title}</h2>
          <p className="text-slate-300 mt-2 text-sm font-semibold">📍 {event.venue} &nbsp;·&nbsp; 📅 {event.date}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Back button */}
        <button
          onClick={() => navigate('/gallery')}
          className="mb-10 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-500 hover:text-[#1FAF9A] transition-colors"
        >
          ← Back to Gallery
        </button>

        {/* Description + Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-14">
          <div className="md:col-span-2">
            <p className="text-slate-600 text-lg leading-relaxed">{event.description}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {event.highlights.map((h, i) => (
              <div key={i} className="rounded-2xl p-4 text-center border border-slate-100 shadow-sm">
                <p className="text-xs font-black uppercase tracking-widest text-slate-400">{h}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Photo Grid */}
        <div className="mb-6">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 border-b border-slate-100 pb-3">
            Photo Album
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {event.images.map((img, i) => (
              <div key={i} className="rounded-2xl overflow-hidden aspect-video shadow-sm hover:shadow-lg transition-shadow group">
                <img
                  src={img}
                  alt={`${event.title} photo ${i + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
