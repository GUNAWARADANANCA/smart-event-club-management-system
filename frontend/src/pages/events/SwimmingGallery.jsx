import React, { useEffect } from 'react';
import { ArrowLeft, Trophy, Medal, Award, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SwimmingGallery() {
  const navigate = useNavigate();
  
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const achievements = [
    { name: 'Michael Chen', event: '100m Freestyle', medal: 'Gold', time: '48.5s (New Campus Record)', img: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?auto=format&fit=crop&q=80&w=200' },
    { name: 'Sarah Williams', event: '200m Butterfly', medal: 'Gold', time: '2:10.4s', img: 'https://images.unsplash.com/photo-1543615103-6fcd00bc71ee?auto=format&fit=crop&q=80&w=200' },
    { name: 'Faculty of Engineering', event: '4x100m Medley Relay', medal: 'Gold', time: '3:45.2s', img: 'https://images.unsplash.com/photo-1574629810360-7efbbcb27ae5?auto=format&fit=crop&q=80&w=200' },
    { name: 'David Kumar', event: '50m Backstroke', medal: 'Silver', time: '25.8s', img: 'https://images.unsplash.com/photo-1518611507436-f924f40d04fd?auto=format&fit=crop&q=80&w=200' },
  ];

  const photos = [
    'https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1519315901367-f34f8a9aeff5?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1564052028688-66dbdd5121b6?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1502014168019-94b8e210ac12?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1505327191481-d3ebf680459c?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1620958742469-8e426ff02897?auto=format&fit=crop&q=80&w=600'
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-800 pb-20">
      {/* Hero Section */}
      <div className="relative h-[450px] w-full bg-blue-900/40 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent z-10"></div>
        <img src="https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&q=80&w=1920" alt="Swimming Pool" className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay" />
        
        <div className="absolute top-8 left-8 z-20">
          <button onClick={() => navigate('/gallery')} className="flex items-center text-[#4CAF50] hover:text-slate-800 transition-colors bg-[#F8FAFC] px-4 py-2 rounded-full border border-[#E2E8F0] backdrop-blur-sm cursor-pointer shadow-md">
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="font-semibold tracking-wide uppercase text-xs">Back to Gallery</span>
          </button>
        </div>

        <div className="relative z-20 text-center px-4 mt-8">
          <span className="px-5 py-1.5 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-300 text-sm font-bold uppercase tracking-widest mb-6 inline-block shadow-md">Official Event Recap</span>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400 drop-shadow-md">
            Swimming Finals '26
          </h1>
          <p className="text-xl text-blue-100/80 font-medium max-w-2xl mx-auto leading-relaxed">
            Witness the splashing triumphs, shattered records, and ultimate faculty pride from this year's highly anticipated championships.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-16 relative z-20">
        {/* Achievements Section */}
        <div className="mb-24">
          <div className="flex items-center mb-12">
            <div className="p-3 bg-yellow-500/10 rounded-2xl border border-yellow-500/20 mr-5">
              <Trophy className="w-8 h-8 text-yellow-500" />
            </div>
            <h2 className="text-3xl font-black uppercase tracking-wide">Hall of Fame Achievements</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((ach, idx) => (
              <div key={idx} className="bg-gradient-to-br from-[#111116] to-[#0a0a0f] p-6 rounded-3xl border border-[#E2E8F0] shadow-2xl relative overflow-hidden group hover:-translate-y-2 transition-all duration-300">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Award className="w-24 h-24 text-blue-500" />
                </div>
                <img src={ach.img} alt={ach.name} className="w-16 h-16 rounded-full object-cover border-[3px] border-blue-500/40 mb-5 shadow-md" />
                <h3 className="text-xl font-black text-slate-800 mb-1 tracking-wide">{ach.name}</h3>
                <p className="text-[#4CAF50] font-bold text-xs uppercase tracking-widest mb-5">{ach.event}</p>
                
                <div className="flex items-center bg-[#F8FAFC] rounded-xl p-4 border border-[#E2E8F0] backdrop-blur-sm">
                  <Medal className={`w-6 h-6 mr-3 flex-shrink-0 ${ach.medal === 'Gold' ? 'text-yellow-400 drop-shadow-md' : 'text-gray-600'}`} />
                  <div>
                    <span className="block text-[10px] text-gray-500 uppercase tracking-widest font-black mb-0.5">Result</span>
                    <span className="block text-sm font-bold text-emerald-300">{ach.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Photo Gallery Grid */}
        <div>
          <div className="flex items-center mb-12">
            <div className="p-3 bg-cyan-500/10 rounded-2xl border border-cyan-500/20 mr-5">
              <Camera className="w-8 h-8 text-cyan-400" />
            </div>
            <h2 className="text-3xl font-black uppercase tracking-wide">Exclusive Photo Gallery</h2>
          </div>
          
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {photos.map((src, idx) => (
              <div key={idx} className="break-inside-avoid relative group rounded-3xl overflow-hidden shadow-md border border-[#E2E8F0] bg-[#111]">
                <img src={src} alt={`Gallery moment ${idx + 1}`} className="w-full h-auto object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out opacity-80 group-hover:opacity-100" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                  <button className="w-full py-3.5 bg-blue-500/20 hover:bg-blue-500 text-slate-800 backdrop-blur-md rounded-xl text-xs font-black uppercase tracking-widest border border-blue-400/30 hover:border-blue-400 transition-all shadow-md hover:shadow-md">
                    Enlarge Photo
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
