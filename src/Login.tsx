import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('success') === 'true' && params.get('new_user') === 'true') {
      toast.success('Account created! Please check your email for your login password.', {
        duration: 6000,
        icon: '🎉',
      });
      // Clear the URL parameters without reloading the page
      window.history.replaceState({}, '', location.pathname);
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      console.log('Attempting login to:', `${import.meta.env.VITE_API_URL}/api/login/`);
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/login/`, { email, password });
      console.log('Login response:', response.status, response.data);
      
      if (response.data && response.data.access) {
        login(response.data.access);
        navigate('/dashboard');
      } else {
        setError('Login successful but no access token received.');
        console.error('Missing access token in response:', response.data);
      }
    } catch (err: any) {
      console.error('Login error:', err);
      const detail = err.response?.data?.detail;
      const message = detail || (err.response ? `Server error: ${err.response.status}` : 'Login failed. Network error or CORS issue.');
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface transition-colors duration-300 p-6">
      <Link 
        to="/" 
        className="absolute top-8 left-8 flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-black text-xs uppercase tracking-widest"
      >
        <ArrowLeft size={14} /> Home
      </Link>

      <div className="w-full max-w-sm relative">
        <div className="p-8 md:p-10 bg-surface-container-low rounded-[2.5rem] border border-outline-variant shadow-2xl relative overflow-hidden">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-on-surface tracking-tighter">Welcome <span className="text-primary italic">Back.</span></h2>
            <p className="mt-2 text-on-surface-variant font-bold text-sm">Log in to your account</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="text-red-500 text-[10px] font-black uppercase tracking-widest text-center bg-red-500/5 p-3 rounded-xl border border-red-500/20">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-2 ml-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  className="w-full px-5 py-3.5 bg-surface border border-outline-variant rounded-xl focus:border-primary outline-none transition-all text-on-surface font-bold text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2 ml-1">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Password</label>
                  <Link to="/forgot-password" university-data-link className="text-[9px] font-black uppercase tracking-widest text-primary hover:underline transition-all">Forgot?</Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    className="w-full px-5 py-3.5 bg-surface border border-outline-variant rounded-xl focus:border-primary outline-none transition-all text-on-surface font-bold text-sm pr-12"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors p-1"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-6 bg-primary text-white font-black rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20 disabled:opacity-70 flex justify-center items-center text-sm uppercase tracking-widest"
            >
              {isLoading ? 'Authenticating...' : 'Login Now'}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-outline-variant/20 text-center">
            <p className="text-on-surface-variant font-bold text-xs">
              New to Cosy Content?{' '}
              <Link to="/signup" className="text-primary font-black hover:underline ml-1">Create Account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
