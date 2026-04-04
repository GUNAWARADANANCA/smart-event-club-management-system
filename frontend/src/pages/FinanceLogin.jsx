import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Lock, Mail, ChevronRight, ShieldAlert } from 'lucide-react';

export default function FinanceLogin() {
  const [email, setEmail] = useState('admin@finance.uni.edu');
  const [password, setPassword] = useState('admin123');
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

    setTimeout(() => {
      if (email === 'admin@finance.uni.edu' && password === 'admin123') {
        localStorage.setItem('financeToken', 'dummy-token-finance');

        const extractedName = email.split('@')[0];
        const formattedName = extractedName.charAt(0).toUpperCase() + extractedName.slice(1);
        localStorage.setItem('userName', formattedName);
        localStorage.setItem('userRole', 'Finance Admin');

        navigate('/finance');
      } else {
        setError('Failed to login. Please check your credentials.');
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen font-sans flex items-center justify-center p-4 relative overflow-hidden" style={{ background: '#0F172A' }}>
      <style>{`
        @keyframes float1 { 0%,100%{transform:translateY(0) translateX(0)} 50%{transform:translateY(-40px) translateX(20px)} }
        @keyframes float2 { 0%,100%{transform:translateY(0) translateX(0)} 50%{transform:translateY(30px) translateX(-25px)} }
        @keyframes float3 { 0%,100%{transform:translateY(0) translateX(0)} 50%{transform:translateY(-20px) translateX(-30px)} }
        @keyframes gridScroll { 0%{background-position:0 0} 100%{background-position:0 60px} }
      `}</style>

      {/* Animated grid */}
      <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(20,184,166,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(20,184,166,0.05) 1px,transparent 1px)', backgroundSize:'60px 60px', animation:'gridScroll 8s linear infinite', pointerEvents:'none' }} />
      {/* Floating orbs */}
      <div style={{ position:'absolute', top:'8%', left:'8%', width:320, height:320, borderRadius:'50%', background:'radial-gradient(circle,rgba(20,184,166,0.18) 0%,transparent 70%)', animation:'float1 8s ease-in-out infinite', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:'8%', right:'8%', width:260, height:260, borderRadius:'50%', background:'radial-gradient(circle,rgba(249,115,22,0.12) 0%,transparent 70%)', animation:'float2 10s ease-in-out infinite', pointerEvents:'none' }} />
      <div style={{ position:'absolute', top:'50%', right:'15%', width:180, height:180, borderRadius:'50%', background:'radial-gradient(circle,rgba(139,92,246,0.1) 0%,transparent 70%)', animation:'float3 7s ease-in-out infinite', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:'30%', left:'12%', width:150, height:150, borderRadius:'50%', background:'radial-gradient(circle,rgba(20,184,166,0.1) 0%,transparent 70%)', animation:'float1 9s ease-in-out infinite 2s', pointerEvents:'none' }} />

      <div className="max-w-md w-full relative z-10">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-white text-sm font-bold uppercase tracking-widest mb-6 transition-colors"
        >
          <span className="text-lg">←</span> Back
        </button>
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#14B8A6] rounded-full mix-blend-multiply filter blur-3xl opacity-10 pointer-events-none"></div>

          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-[#14B8A6]/10 rounded-2xl border border-[#14B8A6]/20 flex items-center justify-center mx-auto mb-6">
              <Lock className="w-8 h-8 text-[#0F766E]" />
            </div>
            <h1 className="text-3xl font-black text-white uppercase tracking-wider mb-2">Finance Secure</h1>
            <p className="text-slate-400 text-sm font-medium">Restricted Portal Authentication</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start">
              <ShieldAlert className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
              <span className="text-red-400 text-sm font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Admin Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-slate-500" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-[#14B8A6]/50 transition-colors"
                  placeholder="admin@finance.uni.edu"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-slate-500" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-[#14B8A6]/50 transition-colors"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-sm flex items-center justify-center transition-all duration-300 ${
                loading ? 'opacity-60 cursor-not-allowed bg-[#0F766E]' : 'bg-gradient-to-r from-[#0F766E] to-[#14B8A6] hover:shadow-lg hover:shadow-[#14B8A6]/30 hover:-translate-y-0.5 text-white'
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
