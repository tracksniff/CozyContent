import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';
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
        className="absolute top-8 left-8 flex items-center text-on-surface-variant hover:text-primary transition-colors font-black text-xs uppercase tracking-widest"
      >
        Home
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

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-outline-variant/30" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest">
                <span className="bg-surface-container-low px-2 text-on-surface-variant">Or continue with</span>
              </div>
            </div>

            <a
              href={`${import.meta.env.VITE_API_URL}/api/google/login/?action=login`}
              className="w-full py-4 px-6 bg-surface border border-outline-variant text-on-surface font-black rounded-xl hover:bg-surface-container transition-all flex justify-center items-center gap-3 text-sm uppercase tracking-widest shadow-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
                <path fill="none" d="M1 1h22v22H1z" />
              </svg>
              Google
            </a>
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
