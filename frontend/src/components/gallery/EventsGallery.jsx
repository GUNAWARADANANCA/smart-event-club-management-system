import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Hardcoded Dummy Data
const galleryData = [
  {
    id: 1,
    title: 'Spring Break Hackathon',
    category: 'Academic',
    date: '18 - 21 MAY',
    venue: 'Computing Faculty',
    details: 'A 4-day intense coding competition with industry mentors, midnight pizza, and amazing prizes for the most innovative solutions.',
    image: '/hackathon.png',
    overlay: 'from-[#4ade80]/60 to-[#1b5e20]/90'
  },
  {
    id: 2,
    title: 'Inter-Faculty Swimming Finals',
    category: 'Sports',
    date: '26 - 29 MAY',
    venue: 'University Pool',
    details: 'Cheer for your faculty as the best swimmers compete for the ultimate championship trophy in various freestyle and relay events.',
    image: '/swimming.png',
    overlay: 'from-[#2980b9]/60 to-[#154360]/90'
  },
  {
    id: 3,
    title: 'University Chess Masters',
    category: 'Sports',
    date: '06 - 07 JUN',
    venue: 'Main Library',
    details: 'A quiet but fiercely competitive weekend of blitz and classical chess tournaments among top strategic minds on campus.',
    image: '/chess.png',
    overlay: 'from-[#8e44ad]/60 to-[#4a235a]/90'
  },
  {
    id: 4,
    title: 'Global Tech Symposium',
    category: 'Workshop',
    date: '08 - 10 JUN',
    venue: 'Main Auditorium',
    details: 'Three days of keynote speeches, panel discussions, and networking featuring top executives from leading tech giants.',
    image: '/hackathon.png',
    overlay: 'from-[#1abc9c]/60 to-[#0e6251]/90'
  },
  {
    id: 5,
    title: 'Annual Cultural Night',
    category: 'Cultural',
    date: '16 - 17 JUN',
    venue: 'Open Air Theater',
    details: 'Experience a vibrant showcase of music, dance, and theatrical performances representing our diverse student body.',
    image: '/swimming.png',
    overlay: 'from-[#e74c3c]/60 to-[#78281f]/90'
  },
  {
    id: 6,
    title: 'Robotics Workshop 2026',
    category: 'Workshop',
    date: '22 JUN',
    venue: 'Engineering Lab 4',
    details: 'Hands-on session building Arduino-based autonomous line-following and maze-solving robots from scratch.',
    image: '/chess.png',
    overlay: 'from-[#f39c12]/60 to-[#7e5109]/90'
  }
];

const categories = ['All', 'Academic', 'Sports', 'Workshop', 'Cultural'];

// Reusable Card Component
const GalleryCard = ({ item, onView }) => {
  return (
    <div className="relative group w-full h-[500px] rounded-3xl overflow-hidden shadow-md cursor-pointer">
      {/* Background Image */}
      <img 
        src={item.image} 
        alt={item.title} 
        className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
      />
      {/* Colorful Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-t ${item.overlay} opacity-80 mix-blend-multiply group-hover:opacity-95 transition-opacity duration-500`}></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90"></div>
      
      {/* Content */}
      <div className="absolute inset-0 p-8 flex flex-col justify-end text-slate-800 text-left z-10 transition-transform duration-500 group-hover:-translate-y-2">
        
        {/* Category & Date Badge */}
        <div className="flex justify-between items-center mb-4 transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
          <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider border border-white/30 drop-shadow-md">
            {item.category}
          </span>
          <span className="text-yellow-400 font-black tracking-widest text-sm drop-shadow-lg">
            {item.date}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-3xl font-black uppercase leading-tight mb-2 tracking-wide drop-shadow-2xl group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all duration-300">
          {item.title}
        </h3>
        
        {/* Venue */}
        <p className="text-gray-600 font-bold mb-4 text-sm flex items-center gap-2 tracking-wider">
          📍 {item.venue}
        </p>

        {/* Details - expanding on hover */}
        <div className="overflow-hidden transition-all duration-500 max-h-0 group-hover:max-h-[150px] opacity-0 group-hover:opacity-100 delay-150">
          <p className="text-gray-200 text-sm mb-6 leading-relaxed font-medium">
            {item.details}
          </p>
        </div>

        {/* Button */}
        <button onClick={(e) => { e.stopPropagation(); onView(item); }} className="w-full mt-4 py-3 border-[2px] border-[#E2E8F0]0 rounded-xl bg-[#E2E8F0] hover:bg-white hover:text-black font-black uppercase tracking-widest text-sm backdrop-blur-md transition-all duration-300 hover:shadow-md">
          View Gallery
        </button>
      </div>
    </div>
  );
};

export default function EventsGallery() {
  const [filter, setFilter] = useState('All');
  const navigate = useNavigate();

  const handleViewGallery = (item) => {
    const slug = item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    navigate(`/gallery/${slug}`);
  };

  const filteredData = filter === 'All' 
    ? galleryData 
    : galleryData.filter(item => item.category === filter);

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-[#4CAF50]/25 rounded-3xl overflow-hidden shadow-lg shadow-green-900/5 relative">
      
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[#E8F5E9]/80 to-transparent pointer-events-none z-0" />

      <div className="relative z-10 p-6 md:p-8">
        <nav className="w-full bg-white shadow-md border border-[#C8E6C9] px-8 py-5 flex flex-col md:flex-row justify-between items-center mb-16 rounded-3xl sticky top-4 z-50">
          <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#2E7D32] to-[#4CAF50] tracking-tighter uppercase mb-4 md:mb-0">
            Uni Gallery
          </h1>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm font-bold uppercase tracking-widest text-gray-600">
            <span onClick={() => navigate('/news')} className="hover:text-[#2E7D32] cursor-pointer transition-colors">News</span>
            <span onClick={() => navigate('/meetings')} className="hover:text-[#2E7D32] cursor-pointer transition-colors">Meetings</span>
            <span className="text-[#2E7D32] border-b-2 border-[#4CAF50] pb-1">Gallery</span>
            <span onClick={() => navigate('/events/lecture-panel')} className="hover:text-[#2E7D32] cursor-pointer transition-colors">Users</span>
            <span onClick={() => navigate('/ticket-sales')} className="hover:text-[#2E7D32] cursor-pointer transition-colors">Ticket Sales</span>
          </div>
        </nav>

        <main className="max-w-[1600px] mx-auto pb-20">
          
          {/* Page Heading */}
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1 rounded-full bg-[#E8F5E9] border border-[#C8E6C9] text-[#2E7D32] text-xs font-bold uppercase tracking-widest mb-6">
              Officially Curated Albums
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-gray-900 uppercase tracking-tighter mb-6">
              Event <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2E7D32] via-[#4CAF50] to-[#F97316]">Showcase</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto font-medium">
              Relive the most unforgettable moments, explosive hackathons, and vibrant cultural nights hosted at our university.
            </p>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-4 mb-20">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-8 py-3 rounded-full font-bold uppercase tracking-widest text-sm transition-all duration-300 border ${
                  filter === cat 
                  ? 'bg-gradient-to-r from-[#43A047] to-[#4CAF50] text-white border-transparent shadow-md shadow-green-600/20 scale-105'
                  : 'bg-white text-gray-600 border-[#C8E6C9] hover:bg-[#E8F5E9] hover:text-[#2E7D32] hover:border-[#A5D6A7]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Responsive Poster Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-12">
            {filteredData.map(item => (
              <GalleryCard key={item.id} item={item} onView={handleViewGallery} />
            ))}
          </div>

          {/* Empty State */}
          {filteredData.length === 0 && (
            <div className="text-center text-gray-500 py-20 text-2xl font-black uppercase tracking-widest border-2 border-dashed border-[#C8E6C9] rounded-3xl mt-12 bg-[#F7FCF7]">
              No events found for this category.
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
