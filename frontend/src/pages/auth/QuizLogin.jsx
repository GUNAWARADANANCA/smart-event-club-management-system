import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ChevronRight, GraduationCap, Lock, Eye, EyeOff } from 'lucide-react';
import {
  loginWithPassword,
  persistAuthSession,
  apiErrorMessage,
  ROLES,
} from '@/lib/auth';

export default function QuizLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please provide your email to access your performance.');
      return;
    }
    if (!password.trim()) {
      setError('Please provide your password to access your performance.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await loginWithPassword(email.trim(), password);
      if (data.user?.role !== ROLES.STUDENT) {
        setError(
          'This student portal is for regular student accounts only. Administrators should use the main Log in.'
        );
        return;
      }
      persistAuthSession({
        token: data.token,
        email: data.user?.email || email.trim(),
        authRole: ROLES.STUDENT,
      });
      navigate('/quizzes/performance');
    } catch (err) {
      setError(apiErrorMessage(err, 'Invalid email or password.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0FDF4] font-sans flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#4CAF50] rounded-full blur-[120px] -mr-48 -mt-48 opacity-15"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#81C784] rounded-full blur-[120px] -ml-48 -mb-48 opacity-20"></div>
      
      <div className="max-w-md w-full bg-white/80 backdrop-blur-2xl border border-[#D1FAE5] rounded-[2.5rem] p-10 shadow-2xl relative z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#4CAF50] rounded-full blur-3xl opacity-10 pointer-events-none"></div>
        
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-[#4CAF50]/10 rounded-3xl border border-[#C8E6C9] flex items-center justify-center mx-auto mb-6 shadow-sm rotate-3 hover:rotate-0 transition-transform duration-500">
            <GraduationCap className="w-10 h-10 text-[#2E7D32]" />
          </div>
          <h1 className="text-4xl font-black text-slate-800 uppercase tracking-tighter mb-2 italic">Student Portal</h1>
          <p className="text-gray-500 text-sm font-bold uppercase tracking-widest opacity-60">Sign in with your account</p>
        </div>

        {error && (
          <div className="mb-8 p-4 rounded-2xl bg-red-50 border border-red-100 flex items-center animate-shake">
            <span className="text-red-600 text-xs font-bold uppercase tracking-wider">{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-8">
          <div className="group">
            <label className="block text-[10px] font-black text-[#2E7D32] uppercase tracking-[0.2em] mb-3 ml-1">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <Mail className="w-5 h-5 text-[#2E7D32] opacity-40 group-focus-within:opacity-100 transition-opacity" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/50 border-2 border-[#D1FAE5] rounded-2xl py-4 pl-14 pr-6 text-slate-800 font-bold placeholder-[#2E7D32]/25 focus:outline-none focus:border-[#4CAF50] focus:bg-white transition-all shadow-sm group-hover:shadow-md"
                placeholder="you@university.edu"
              />
            </div>
          </div>

          <div className="group">
            <label className="block text-[10px] font-black text-[#2E7D32] uppercase tracking-[0.2em] mb-3 ml-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <Lock className="w-5 h-5 text-[#2E7D32] opacity-40 group-focus-within:opacity-100 transition-opacity" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/50 border-2 border-[#D1FAE5] rounded-2xl py-4 pl-14 pr-14 text-slate-800 font-bold placeholder-[#2E7D32]/25 focus:outline-none focus:border-[#4CAF50] focus:bg-white transition-all shadow-sm group-hover:shadow-md"
                placeholder="Enter Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-5 flex items-center text-[#2E7D32] opacity-40 hover:opacity-100 transition-opacity"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.15em] text-xs flex items-center justify-center transition-all duration-500 shadow-xl group relative overflow-hidden ${
              loading 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                : 'btn-teal-primary text-white hover:scale-[1.02] active:scale-[0.98]'
            }`}
          >
            <span className="relative z-10 flex items-center gap-3">
              {loading ? 'Authenticating...' : 'Access My Performance'}
              {!loading && <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
            </span>
          </button>
          
          <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-8">
            Student portal &bull; Secure authentication
          </p>
        </form>
      </div>
    </div>
  );
}
