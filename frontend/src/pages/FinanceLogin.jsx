import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Lock, Mail, ChevronRight, ShieldAlert } from 'lucide-react';

export default function FinanceLogin() {
  const [email, setEmail] = useState('admin@finance.uni.edu');
  const [password, setPassword] = useState('12345678');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('http://localhost:5000/api/finance-auth/login', { email, password });
      if (response.data.token) {
        localStorage.setItem('financeToken', response.data.token);
        
        const extractedName = email.split('@')[0];
        const formattedName = extractedName.charAt(0).toUpperCase() + extractedName.slice(1);
        localStorage.setItem('userName', formattedName);
        localStorage.setItem('userRole', 'Finance Admin');
        
        navigate('/finance');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0F766E]/5 via-[#050505] to-purple-900/10 pointer-events-none z-0"></div>
      
      <div className="max-w-md w-full bg-[#FFFFFF] shadow-sm backdrop-blur-xl border border-[#E2E8F0] rounded-3xl p-8 shadow-md relative z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#14B8A6] rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none"></div>
        
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-[#14B8A6]/10 rounded-2xl border border-purple-500/20 flex items-center justify-center mx-auto mb-6 shadow-md">
            <Lock className="w-8 h-8 text-[#0F766E]" />
          </div>
          <h1 className="text-3xl font-black text-slate-800 uppercase tracking-wider mb-2">Finance Secure</h1>
          <p className="text-gray-500 text-sm font-medium">Restricted Portal Authentication</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start">
            <ShieldAlert className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
            <span className="text-red-400 text-sm font-medium">{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Admin Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="w-5 h-5 text-gray-500" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-[#E2E8F0] rounded-xl py-3.5 pl-12 pr-4 text-slate-800 placeholder-gray-600 focus:outline-none focus:border-[#14B8A6]/50 focus:bg-[#222] transition-colors"
                placeholder="admin@finance.uni.edu"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="w-5 h-5 text-gray-500" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-[#E2E8F0] rounded-xl py-3.5 pl-12 pr-4 text-slate-800 placeholder-gray-600 focus:outline-none focus:border-[#14B8A6]/50 focus:bg-[#222] transition-colors"
                placeholder="••••••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-sm flex items-center justify-center transition-all duration-300 shadow-md ${
              loading ? 'bg-purple-800 text-purple-300 cursor-not-allowed' : 'bg-gradient-to-r from-[#0F766E] to-indigo-600 hover:from-[#0F766E] hover:to-indigo-500 text-slate-800 hover:shadow-md hover:-translate-y-0.5'
            }`}
          >
            {loading ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-slate-800" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
               <>
                 Secure Login
                 <ChevronRight className="w-5 h-5 ml-2" />
               </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
