import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserCircle, Lock, ChevronRight, ShieldAlert } from 'lucide-react';

export default function QuizLogin() {
  const [username, setUsername] = useState('student_01');
  const [password, setPassword] = useState('1234');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please provide both username and password.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('http://localhost:5000/api/users/student-login', { username, password });
      if (response.data.token) {
        localStorage.setItem('quizToken', response.data.token);
        
        const formattedName = username.charAt(0).toUpperCase() + username.slice(1);
        localStorage.setItem('userName', formattedName);
        localStorage.setItem('userRole', 'Student');
        
        navigate('/quizzes/performance');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-900/20 via-[#050505] to-purple-900/10 pointer-events-none z-0"></div>
      
      <div className="max-w-md w-full bg-[#FFFFFF] shadow-sm backdrop-blur-xl border border-[#E2E8F0] rounded-3xl p-8 shadow-md relative z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none"></div>
        
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-fuchsia-500/10 rounded-2xl border border-fuchsia-500/20 flex items-center justify-center mx-auto mb-6 shadow-md">
            <UserCircle className="w-8 h-8 text-fuchsia-400" />
          </div>
          <h1 className="text-3xl font-black text-slate-800 uppercase tracking-wider mb-2">Student Portal</h1>
          <p className="text-gray-500 text-sm font-medium">Log in to view your quiz performance</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start">
            <ShieldAlert className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
            <span className="text-red-400 text-sm font-medium">{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <UserCircle className="w-5 h-5 text-gray-500" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-[#E2E8F0] rounded-xl py-3.5 pl-12 pr-4 text-slate-800 placeholder-gray-600 focus:outline-none focus:border-fuchsia-500/50 focus:bg-[#222] transition-colors"
                placeholder="Student Username"
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
                className="w-full bg-[#1a1a1a] border border-[#E2E8F0] rounded-xl py-3.5 pl-12 pr-4 text-slate-800 placeholder-gray-600 focus:outline-none focus:border-fuchsia-500/50 focus:bg-[#222] transition-colors"
                placeholder="••••••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-sm flex items-center justify-center transition-all duration-300 shadow-md ${
              loading ? 'bg-fuchsia-800 text-fuchsia-300 cursor-not-allowed' : 'bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-slate-800 hover:shadow-md hover:-translate-y-0.5'
            }`}
          >
            {loading ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-slate-800" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
               <>
                 Access My Performance
                 <ChevronRight className="w-5 h-5 ml-2" />
               </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
