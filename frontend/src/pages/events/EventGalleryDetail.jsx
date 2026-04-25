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
      '/hackathon.png',
      '/chess.png',
      '/hackathon.png',
      '/chess.png',
      '/hackathon.png',
      '/chess.png',
    ],
    highlights: ['150+ Participants', '12 Industry Mentors', '3 Prize Categories', '48-Hour Coding Sprint'],
    achievements: [
      {
        title: 'Overall Champions',
        detail: 'Team CodeCrafters won 1st place for building an AI-powered campus navigation assistant.',
      },
      {
        title: 'Best UI/UX Solution',
        detail: 'A group of second-year students earned a special award for a polished student wellness platform.',
      },
      {
        title: 'Industry Choice Award',
        detail: 'The Robotics Club team was recognized by mentors for creating a smart lab inventory tracker.',
      },
    ],
  },
  'inter-faculty-swimming-finals': {
    title: 'Inter-Faculty Swimming Finals',
    date: '26 - 29 MAY 2026',
    venue: 'University Pool',
    category: 'Sports',
    description: 'Cheer for your faculty as the best swimmers compete for the ultimate championship trophy in various freestyle and relay events.',
    accent: '#2980b9',
    images: [
      '/swimming.png',
      '/swimming.png',
      '/swimming.png',
      '/swimming.png',
      '/swimming.png',
      '/swimming.png',
    ],
    highlights: ['8 Faculties Competed', '24 Events', '3 National Records Broken', 'Best Swimmer Award'],
    achievements: [
      {
        title: 'Champion Faculty',
        detail: 'Faculty of Computing secured the overall championship with the highest medal count.',
      },
      {
        title: 'Outstanding Swimmer',
        detail: 'Two student athletes broke meet records in freestyle and butterfly events.',
      },
      {
        title: 'Team Spirit Recognition',
        detail: 'The volunteer organizing committee received appreciation for outstanding coordination.',
      },
    ],
  },
  'university-chess-masters': {
    title: 'University Chess Masters',
    date: '06 - 07 JUN 2026',
    venue: 'Main Library',
    category: 'Sports',
    description: 'A quiet but fiercely competitive weekend of blitz and classical chess tournaments among top strategic minds on campus.',
    accent: '#8e44ad',
    images: [
      '/chess.png',
      '/chess.png',
      '/chess.png',
      '/chess.png',
      '/chess.png',
      '/chess.png',
    ],
    highlights: ['64 Players', 'Blitz & Classical Rounds', 'Grand Master Guest', 'Trophy + Scholarship'],
    achievements: [
      {
        title: 'Chess Masters Winner',
        detail: 'The university chess club captain remained unbeaten through all final rounds.',
      },
      {
        title: 'Rising Star Award',
        detail: 'A first-year participant received special recognition for reaching the semi-finals.',
      },
      {
        title: 'Best Strategic Match',
        detail: 'The final board showdown was selected as the most memorable match of the tournament.',
      },
    ],
  },
  'global-tech-symposium': {
    title: 'Global Tech Symposium',
    date: '08 - 10 JUN 2026',
    venue: 'Main Auditorium',
    category: 'Workshop',
    description: 'Three days of keynote speeches, panel discussions, and networking featuring top executives from leading tech giants.',
    accent: '#1abc9c',
    images: [
      '/hackathon.png',
      '/hackathon.png',
      '/hackathon.png',
      '/hackathon.png',
      '/hackathon.png',
      '/hackathon.png',
    ],
    highlights: ['20+ Speakers', '500 Attendees', '3-Day Program', 'Live Demos & Panels'],
    achievements: [
      {
        title: 'Top Student Research Pitch',
        detail: 'Student innovators presented a sustainable smart-city concept to the keynote panel.',
      },
      {
        title: 'Innovation Showcase Highlight',
        detail: 'The Software Engineering Society was praised for hosting the best demo booth experience.',
      },
      {
        title: 'Networking Excellence',
        detail: 'Participants secured internship opportunities through the industry networking lounge.',
      },
    ],
  },
  'annual-cultural-night': {
    title: 'Annual Cultural Night',
    date: '16 - 17 JUN 2026',
    venue: 'Open Air Theater',
    category: 'Cultural',
    description: 'Experience a vibrant showcase of music, dance, and theatrical performances representing our diverse student body.',
    accent: '#e74c3c',
    images: [
      '/music.png',
      '/art.png',
      '/music.png',
      '/art.png',
      '/music.png',
      '/art.png',
    ],
    highlights: ['30+ Performances', '15 Nationalities', 'Best Act Award', 'Live Band Night'],
    achievements: [
      {
        title: 'Best Club Performance',
        detail: 'The Performing Arts Society won the top act award for its contemporary fusion showcase.',
      },
      {
        title: 'Audience Favorite',
        detail: 'A student-led acoustic ensemble received the highest audience vote of the night.',
      },
      {
        title: 'Cultural Impact Recognition',
        detail: 'Organizers were honored for representing diverse traditions through music and dance.',
      },
    ],
  },
  'robotics-workshop-2026': {
    title: 'Robotics Workshop 2026',
    date: '22 JUN 2026',
    venue: 'Engineering Lab 4',
    category: 'Workshop',
    description: 'Hands-on session building Arduino-based autonomous line-following and maze-solving robots from scratch.',
    accent: '#f39c12',
    images: [
      '/chess.png',
      '/hackathon.png',
      '/chess.png',
      '/hackathon.png',
      '/chess.png',
      '/hackathon.png',
    ],
    highlights: ['40 Participants', 'Arduino Kits Provided', 'Line-Following Challenge', 'Maze Solver Finals'],
    achievements: [
      {
        title: 'Fastest Robot Build',
        detail: 'A beginner team assembled and calibrated the fastest line-following robot in the session.',
      },
      {
        title: 'Best Problem-Solving Team',
        detail: 'Students from the robotics club solved the final maze with the fewest retries.',
      },
      {
        title: 'Workshop Excellence',
        detail: 'Mentors recognized participants for collaborative troubleshooting and rapid prototyping.',
      },
    ],
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
          <button onClick={() => navigate('/gallery')} className="px-8 py-3 rounded-full bg-gradient-to-r from-[#43A047] to-[#4CAF50] text-white font-bold uppercase tracking-widest text-sm shadow-md shadow-green-600/20">
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
        <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#2E7D32] to-[#4CAF50] tracking-tighter uppercase">
          Uni Gallery
        </h1>
        <div className="flex gap-6 text-sm font-bold uppercase tracking-widest text-slate-500">
          <span onClick={() => navigate('/news')} className="hover:text-slate-900 cursor-pointer transition-colors">News</span>
          <span onClick={() => navigate('/meetings')} className="hover:text-slate-900 cursor-pointer transition-colors">Meetings</span>
          <span onClick={() => navigate('/gallery')} className="text-slate-900 border-b-2 border-[#4CAF50] pb-1 cursor-pointer">Gallery</span>
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
          className="mb-10 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-500 hover:text-[#2E7D32] transition-colors"
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

        <div className="mb-14">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 border-b border-slate-100 pb-3">
            Student Achievements
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {event.achievements.map((achievement, index) => (
              <div
                key={index}
                className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm"
              >
                <div
                  className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-widest text-white mb-4"
                  style={{ background: event.accent }}
                >
                  Achievement {index + 1}
                </div>
                <h4 className="text-lg font-black text-slate-900 mb-3">{achievement.title}</h4>
                <p className="text-sm leading-7 text-slate-600">{achievement.detail}</p>
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
