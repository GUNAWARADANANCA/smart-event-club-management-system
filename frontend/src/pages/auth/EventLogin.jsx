import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Mail, ChevronRight, ShieldAlert, Lock } from 'lucide-react';
import {
  loginWithPassword,
  persistAuthSession,
  apiErrorMessage,
  ROLES,
} from '@/lib/auth';

export default function EventLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await loginWithPassword(email, password);
      if (data.user?.role !== ROLES.EVENT_ADMIN) {
        setError(
          'Only Event Administrators can sign in here. Ask your coordinator for an event admin account, or use the main Log in for a student account.'
        );
        return;
      }
      persistAuthSession({
        token: data.token,
        email: data.user?.email || email,
        authRole: ROLES.EVENT_ADMIN,
      });
      navigate('/events');
    } catch (err) {
      setError(apiErrorMessage(err, 'Failed to login. Please check your credentials.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen font-sans flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-white via-[#F7FCF7] to-[#E8F5E9]">
      <style>{`
        @keyframes float1 { 0%,100%{transform:translateY(0) translateX(0)} 50%{transform:translateY(-40px) translateX(20px)} }
        @keyframes float2 { 0%,100%{transform:translateY(0) translateX(0)} 50%{transform:translateY(30px) translateX(-25px)} }
        @keyframes float3 { 0%,100%{transform:translateY(0) translateX(0)} 50%{transform:translateY(-20px) translateX(-30px)} }
        @keyframes gridScroll { 0%{background-position:0 0} 100%{background-position:0 60px} }
      `}</style>

      {/* Animated grid */}
      <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(76,175,80,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(76,175,80,0.06) 1px,transparent 1px)', backgroundSize:'60px 60px', animation:'gridScroll 8s linear infinite', pointerEvents:'none' }} />
      <div style={{ position:'absolute', top:'8%', left:'8%', width:320, height:320, borderRadius:'50%', background:'radial-gradient(circle,rgba(76,175,80,0.12) 0%,transparent 70%)', animation:'float1 8s ease-in-out infinite', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:'8%', right:'8%', width:260, height:260, borderRadius:'50%', background:'radial-gradient(circle,rgba(249,115,22,0.08) 0%,transparent 70%)', animation:'float2 10s ease-in-out infinite', pointerEvents:'none' }} />
      <div style={{ position:'absolute', top:'50%', right:'15%', width:180, height:180, borderRadius:'50%', background:'radial-gradient(circle,rgba(139,92,246,0.06) 0%,transparent 70%)', animation:'float3 7s ease-in-out infinite', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:'30%', left:'12%', width:150, height:150, borderRadius:'50%', background:'radial-gradient(circle,rgba(76,175,80,0.08) 0%,transparent 70%)', animation:'float1 9s ease-in-out infinite 2s', pointerEvents:'none' }} />

      <div className="max-w-md w-full relative z-10">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-[#2E7D32] text-sm font-bold uppercase tracking-widest mb-6 transition-colors"
        >
          <span className="text-lg">←</span> Back
        </button>
        <div className="relative bg-white border border-[#C8E6C9] rounded-3xl p-8 shadow-xl shadow-green-900/10">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#4CAF50]/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="text-center mb-10 relative z-10">
          <div className="w-16 h-16 bg-[#E8F5E9] rounded-2xl border border-[#C8E6C9] flex items-center justify-center mx-auto mb-6">
            <Calendar className="w-8 h-8 text-[#2E7D32]" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 uppercase tracking-wider mb-2">Event Secure</h1>
          <p className="text-gray-600 text-sm font-medium">Event Management Authentication</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start">
            <ShieldAlert className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
            <span className="text-red-400 text-sm font-medium">{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-2">Admin Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-[#C8E6C9] rounded-xl py-3.5 pl-12 pr-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#4CAF50] focus:ring-2 focus:ring-[#4CAF50]/20 transition-all"
                placeholder="admin@event.uni.edu"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-2">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-[#C8E6C9] rounded-xl py-3.5 pl-12 pr-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#4CAF50] focus:ring-2 focus:ring-[#4CAF50]/20 transition-all"
                placeholder="••••••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-sm flex items-center justify-center transition-all duration-300 ${
              loading ? 'opacity-60 cursor-not-allowed bg-[#43A047]' : 'bg-gradient-to-r from-[#43A047] to-[#4CAF50] hover:shadow-lg hover:shadow-green-600/25 hover:-translate-y-0.5 text-white'
            }`}
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <> Secure Login <ChevronRight className="w-5 h-5 ml-2" /> </>
            )}
          </button>
        </form>
        </div>
      </div>
    </div>
  );
}
