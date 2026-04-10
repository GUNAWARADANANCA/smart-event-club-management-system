import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spin, Empty, App as AntdApp, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import api from '@/lib/api';

const categories = ['All', 'Sports', 'Academic', 'Winning'];

export default function News() {
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState(null);
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { message } = AntdApp.useApp();

  // Fetch news from API
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const res = await api.get('/api/news');
        setNewsData(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error(error);
        message.error('Failed to fetch news');
        setNewsData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const filtered = filter === 'All' ? newsData : newsData.filter(n => n.category === filter);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (newsData.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Empty description="No news available" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans rounded-3xl overflow-hidden shadow-lg shadow-green-900/5 relative">
      <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-[#E8F5E9]/80 to-transparent pointer-events-none z-0" />

      <div className="relative z-10 p-6 md:p-8">
        <nav className="w-full bg-white shadow-md border border-[#C8E6C9] px-8 py-5 flex flex-col md:flex-row justify-between items-center mb-16 rounded-3xl sticky top-4 z-50">
          <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#2E7D32] to-[#4CAF50] tracking-tighter uppercase mb-4 md:mb-0">
            Uni Gallery
          </h1>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm font-bold uppercase tracking-widest text-gray-600">
            <span className="text-[#2E7D32] border-b-2 border-[#4CAF50] pb-1">News</span>
            <span onClick={() => navigate('/meetings')} className="hover:text-[#2E7D32] cursor-pointer transition-colors">Meetings</span>
            <span onClick={() => navigate('/gallery')} className="hover:text-[#2E7D32] cursor-pointer transition-colors">Gallery</span>
            <span onClick={() => navigate('/ticket-sales')} className="hover:text-[#2E7D32] cursor-pointer transition-colors">Ticket Sales</span>
          </div>
        </nav>

        <main className="max-w-[1400px] mx-auto pb-20">
          {/* Heading */}
          <div className="text-center mb-16 relative">
            <div className="inline-block px-4 py-1 rounded-full bg-[#E8F5E9] border border-[#C8E6C9] text-[#2E7D32] text-xs font-bold uppercase tracking-widest mb-6">
              Latest Updates
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-gray-900 uppercase tracking-tighter mb-6">
              Campus <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2E7D32] via-[#4CAF50] to-[#F97316]">News</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto font-medium">
              Student achievements, sports victories, academic milestones, and everything happening on campus.
            </p>

            {/* Add News Button - Floating Action Button */}
            <div className="absolute top-0 right-0">
              <Button
                type="primary"
                size="large"
                icon={<PlusOutlined />}
                onClick={() => navigate('/news-login', { state: { from: '/admin/news' } })}
                className="bg-gradient-to-r from-[#43A047] to-[#4CAF50] border-none hover:from-[#2E7D32] hover:to-[#388E3C] shadow-lg shadow-green-600/20 hover:shadow-xl hover:shadow-green-600/30 transition-all duration-300 rounded-full h-14 w-14 flex items-center justify-center"
              >
                <span className="sr-only">Add News</span>
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-8 py-3 rounded-full font-bold uppercase tracking-widest text-sm transition-all duration-300 border ${
                  filter === cat
                    ? 'bg-gradient-to-r from-[#43A047] to-[#4CAF50] text-white border-transparent shadow-md shadow-green-600/20 scale-105'
                    : 'bg-white text-gray-600 border-[#C8E6C9] hover:bg-[#E8F5E9] hover:text-[#2E7D32]'
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
                key={item._id}
                onClick={() => setSelected(item)}
                className="group bg-white border border-[#C8E6C9] rounded-3xl overflow-hidden shadow-sm hover:shadow-lg hover:shadow-green-900/10 transition-all duration-300 cursor-pointer hover:-translate-y-1"
              >
                {/* Color Banner */}
                <div className={`h-3 w-full bg-gradient-to-r ${item.color}`}></div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white"
                      style={{ background: item.accent }}>
                      {item.tag}
                    </span>
                    <span className="text-xs text-gray-500 font-medium">
                      {new Date(item.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-gray-900 mb-3 leading-snug group-hover:text-[#2E7D32] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">{item.summary}</p>
                  <div className="flex justify-between items-center pt-4 border-t border-[#E8F5E9]">
                    <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">{item.author}</span>
                    <span className="text-xs font-bold text-[#2E7D32] uppercase tracking-wider group-hover:underline">Read More →</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center text-gray-500 py-20 text-2xl font-black uppercase tracking-widest border-2 border-dashed border-[#C8E6C9] rounded-3xl bg-[#F7FCF7]">
              No news found for this category.
            </div>
          )}
        </main>
      </div>

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-[#C8E6C9]" onClick={e => e.stopPropagation()}>
            <div className={`h-2 w-full bg-gradient-to-r ${selected.color}`}></div>
            <div className="p-8">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white mb-4 inline-block"
                style={{ background: selected.accent }}>
                {selected.tag}
              </span>
              <h2 className="text-2xl font-black text-gray-900 mt-3 mb-2 leading-snug">{selected.title}</h2>
              <div className="flex gap-4 text-xs text-gray-500 font-semibold uppercase tracking-wider mb-6">
                <span>{selected.date}</span>
                <span>·</span>
                <span>{selected.author}</span>
              </div>
              <p className="text-gray-700 leading-relaxed text-base">{selected.summary}</p>
              <button
                onClick={() => setSelected(null)}
                className="mt-8 w-full py-3 rounded-2xl font-bold uppercase tracking-widest text-sm text-white transition-all hover:opacity-95 shadow-md shadow-green-600/20"
                style={{ background: `linear-gradient(to right, #43A047, #4CAF50)` }}
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
