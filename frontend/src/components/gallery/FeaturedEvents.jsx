import React from 'react';
import { useNavigate } from 'react-router-dom';

const sampleData = [
  {
    id: 1,
    type: 'Event',
    title: 'CodeRed Hackathon 2026',
    description: 'A 12-hour intense coding competition. Build innovative solutions for campus problems. Food and drinks provided!',
    date: '2026-04-15',
    image: '/hackathon.png',
  },
  {
    id: 2,
    type: 'Club',
    title: 'Robotics Club',
    description: 'Join the robotics club to build and program Arduino and Raspberry Pi based robots. Open to all skill levels.',
    date: 'Meets every Friday',
    image: '/swimming.png', // Placeholder matching assets
  },
  {
    id: 3,
    type: 'Event',
    title: 'Global Career Fair',
    description: 'Meet recruiters from top tech companies. Bring your resume and prepare for on-the-spot interviews.',
    date: '2026-05-20',
    image: '/chess.png',
  }
];

export default function FeaturedEvents() {
  const navigate = useNavigate();

  return (
    <section className="py-20 px-6 md:px-12 bg-[#000] text-white border-b border-[#303030]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#0F766E] to-indigo-600">
            Featured Events & Clubs
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Discover what's happening on campus right now. From intense hackathons to creative club meetups, get involved and make your mark.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sampleData.map((item) => (
            <div 
              key={item.id} 
              className="group relative bg-[#141414] border border-[#303030] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
            >
              <div className="h-56 overflow-hidden relative">
                <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-all z-10"></div>
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
                />
                <span className="absolute top-4 left-4 z-20 px-4 py-1 bg-[#0F766E]/90 backdrop-blur-md text-sm font-bold tracking-wide rounded-full text-white shadow-lg">
                  {item.type}
                </span>
              </div>
              
              <div className="p-6">
                <p className="text-white text-sm font-semibold mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  {item.date}
                </p>
                <h3 className="text-2xl font-bold mb-3 text-white transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-300 text-sm mb-8 line-clamp-3 leading-relaxed">
                  {item.description}
                </p>
                <button 
                  onClick={() => navigate('/login', { state: { from: '/portal' } })}
                  className="w-full py-3 px-4 border border-purple-500 text-[#0F766E] rounded-xl font-bold hover:bg-[#0F766E] hover:text-slate-800 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  View Details
                  <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <button 
            onClick={() => navigate('/portal')}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-[#0F766E] to-indigo-600 px-8 py-4 rounded-xl text-lg font-bold shadow-md hover:shadow-md hover:-translate-y-1 transition-all duration-300 text-white"
          >
            See All Events
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
          </button>
        </div>
      </div>
    </section>
  );
}
