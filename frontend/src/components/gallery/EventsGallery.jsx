import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Form, Input, Button as AntButton, message } from 'antd';
import api from '@/lib/api';
import { getAuthRole, ROLES } from '@/lib/auth';

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
const GalleryCard = ({ item, onView, onRegister }) => {
  const authRole = getAuthRole() || ROLES.STUDENT;
  const isStudent = authRole === ROLES.STUDENT;

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

        {/* Buttons */}
        <div className="flex gap-3 mt-4">
          <button 
            onClick={(e) => { e.stopPropagation(); onView(item); }} 
            className="flex-1 py-3 border-[2px] border-[#E2E8F0] rounded-xl bg-[#E2E8F0] hover:bg-white hover:text-black font-black uppercase tracking-widest text-xs backdrop-blur-md transition-all duration-300 hover:shadow-md"
          >
            Gallery
          </button>
          {item.category === 'Sports' && isStudent && (
            <button 
              onClick={(e) => { e.stopPropagation(); onRegister(item); }} 
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#10B981] to-[#059669] text-white font-black uppercase tracking-widest text-xs transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:scale-95"
            >
              Register
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default function EventsGallery() {
  const [filter, setFilter] = useState('All');
  const [headingVisible, setHeadingVisible] = useState(false);
  const [registerModalVisible, setRegisterModalVisible] = useState(false);
  const [selectedSport, setSelectedSport] = useState(null);
  const [form] = Form.useForm();
  const [liveSports, setLiveSports] = useState([]);
  const headingRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLiveSports();
  }, []);

  const fetchLiveSports = async () => {
    try {
      const response = await api.get('/api/university-sports');
      const mappedSports = response.data.map(s => ({
        id: `live-${s._id}`,
        title: s.name,
        category: 'Sports',
        date: 'Season 2026',
        venue: 'Sports Complex',
        details: s.description || 'Join the official university team for this sport. Trials and training sessions happen weekly.',
        image: '/swimming.png', // Generic fallback
        overlay: 'from-[#0B7285]/60 to-[#154360]/90'
      }));
      setLiveSports(mappedSports);
    } catch (error) {
      console.error('Failed to fetch live sports:', error);
    }
  };

  useEffect(() => {
    const el = headingRef.current;
    if (!el) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeadingVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const categoryStyles = {
    All: { from: '#2E7D32', via: '#4CAF50', to: '#F97316' },
    Academic: { from: '#1E3A8A', via: '#2563EB', to: '#60A5FA' },
    Sports: { from: '#0B7285', via: '#14B8A6', to: '#5EEAD4' },
    Workshop: { from: '#7C3AED', via: '#A855F7', to: '#C084FC' },
    Cultural: { from: '#C2410C', via: '#F97316', to: '#FCD34D' },
  };

  const currentStyle = categoryStyles[filter] || categoryStyles.All;

  const handleViewGallery = (item) => {
    const slug = item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    navigate(`/gallery/${slug}`);
  };

  const allData = [...galleryData, ...liveSports];

  const filteredData = filter === 'All' 
    ? allData 
    : allData.filter(item => item.category === filter);

  const handleOpenRegister = (item) => {
    setSelectedSport(item);
    form.setFieldsValue({
      fullName: localStorage.getItem('userName') || '',
      email: localStorage.getItem('userEmail') || '',
      sport: item.title.replace('Inter-Faculty ', '').replace('University ', '').replace(' Finals', '').replace(' Masters', '')
    });
    setRegisterModalVisible(true);
  };

  const onRegisterFinish = async (values) => {
    try {
      await api.post('/api/university-sports/register', values);
      message.success(`Application for ${values.sport} submitted! Status: PENDING.`);
      setRegisterModalVisible(false);
    } catch (error) {
      message.error(error.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-[#4CAF50]/25 rounded-3xl overflow-hidden shadow-lg shadow-green-900/5 relative">
      
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[#E8F5E9]/80 to-transparent pointer-events-none z-0" />

      <div className="relative z-10 p-6 md:p-8">
        <nav className="w-full bg-white shadow-md border border-[#C8E6C9] px-8 py-5 flex flex-col md:flex-row justify-between items-center mb-8 rounded-3xl sticky top-4 z-50">
          <style>{`
            @keyframes gradientShift {
              0%, 100% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
            }
            .dynamic-header-gradient {
              background-image: linear-gradient(90deg, #2E7D32, #43A047, #81C784, #4CAF50);
              background-size: 200% 200%;
              animation: gradientShift 8s ease infinite;
            }
          `}</style>
          <h1 className="text-2xl font-black text-transparent bg-clip-text dynamic-header-gradient tracking-tighter uppercase mb-4 md:mb-0 transition-transform duration-500 hover:-translate-y-1 hover:scale-[1.03]">
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
          <div className="text-center mb-6" ref={headingRef}>
            <h2 className={`text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6 transition-all duration-700 ${headingVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              Event <span className="text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(90deg, ${currentStyle.from}, ${currentStyle.via}, ${currentStyle.to})` }}>Showcase</span>
            </h2>
            <p className={`text-lg md:text-xl text-gray-600 max-w-3xl mx-auto font-medium transition-all duration-700 ${headingVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              Relive the most unforgettable moments, explosive hackathons, and vibrant cultural nights hosted at our university.
            </p>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-4 mb-20">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-8 py-3 rounded-full font-bold uppercase tracking-widest text-sm transition-all duration-300 transform border ${
                  filter === cat 
                  ? 'bg-gradient-to-r from-[#43A047] to-[#4CAF50] text-white border-transparent shadow-md shadow-green-600/20 scale-105 hover:-translate-y-1 hover:shadow-xl'
                  : 'bg-white text-gray-600 border-[#C8E6C9] hover:bg-[#E8F5E9] hover:text-[#2E7D32] hover:border-[#A5D6A7] hover:-translate-y-1 hover:shadow-md'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Responsive Poster Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-12">
            {filteredData.map(item => (
              <GalleryCard key={item.id} item={item} onView={handleViewGallery} onRegister={handleOpenRegister} />
            ))}
          </div>

          {/* Sports Registration CTA */}
          {filter === 'Sports' && (
            <div style={{
              marginTop: 40,
              background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
              border: '1px solid #10B981',
              borderRadius: 24,
              padding: '32px',
              textAlign: 'center',
              boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.1)'
            }}>
              <h3 style={{ color: '#065F46', fontSize: 24, fontWeight: 900, marginBottom: 12 }}>Ready to Compete?</h3>
              <p style={{ color: '#047857', fontSize: 16, marginBottom: 24, maxWidth: '600px', margin: '0 auto 24px' }}>
                Don't just watch from the sidelines. Registration for the next semester's inter-faculty trials is now open!
              </p>
              <button
                onClick={() => navigate('/users')}
                style={{
                  background: '#10B981',
                  color: 'white',
                  border: 'none',
                  borderRadius: 999,
                  padding: '12px 32px',
                  fontSize: 14,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                Go to Sports Registration Hub →
              </button>
            </div>
          )}

          {/* Empty State */}
          {filteredData.length === 0 && (
            <div className="text-center text-gray-500 py-20 text-2xl font-black uppercase tracking-widest border-2 border-dashed border-[#C8E6C9] rounded-3xl mt-12 bg-[#F7FCF7]">
              No events found for this category.
            </div>
          )}

        </main>
      </div>

      <Modal
        title={
          <div className="flex items-center gap-2">
            <span className="p-2 bg-green-50 rounded-lg text-green-600">🏆</span>
            <span className="font-extrabold uppercase tracking-tight">Sport Registration</span>
          </div>
        }
        open={registerModalVisible}
        onCancel={() => setRegisterModalVisible(false)}
        footer={null}
        centered
        width={450}
        styles={{ content: { borderRadius: '24px' } }}
      >
        <div className="mb-6">
          <p className="text-gray-500 text-sm font-medium">
            Join the <span className="text-green-600 font-bold">{selectedSport?.title}</span> trials and represent your faculty.
          </p>
        </div>
        <Form form={form} layout="vertical" onFinish={onRegisterFinish} requiredMark={false}>
          <Form.Item name="fullName" label={<span className="text-xs font-black uppercase tracking-widest text-gray-400">Full Name</span>} rules={[{ required: true }]}>
            <Input className="rounded-xl h-12 border-gray-100 bg-gray-50 focus:bg-white" placeholder="Enter your full name" />
          </Form.Item>
          <Form.Item name="email" label={<span className="text-xs font-black uppercase tracking-widest text-gray-400">Email Address</span>} rules={[{ required: true, type: 'email' }]}>
            <Input className="rounded-xl h-12 border-gray-100 bg-gray-50 focus:bg-white" placeholder="Enter your student email" />
          </Form.Item>
          <Form.Item name="sport" label={<span className="text-xs font-black uppercase tracking-widest text-gray-400">Sport Category</span>} rules={[{ required: true }]}>
            <Input className="rounded-xl h-12 border-gray-100 bg-gray-50 focus:bg-white" readOnly />
          </Form.Item>
          
          <div className="flex gap-4 mt-8">
            <AntButton onClick={() => setRegisterModalVisible(false)} className="flex-1 h-12 rounded-xl font-bold uppercase tracking-widest text-xs">
              Cancel
            </AntButton>
            <AntButton type="primary" htmlType="submit" className="flex-1 h-12 rounded-xl bg-gradient-to-r from-[#43A047] to-[#4CAF50] border-none shadow-md shadow-green-200 font-bold uppercase tracking-widest text-xs">
              Submit Application
            </AntButton>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
