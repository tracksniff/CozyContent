import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import logo from './assets/PNG/Cosy Content Ltd -05.png';
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
        className="absolute top-8 left-8 flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-bold text-sm"
      >
        <ArrowLeft size={16} /> Back to Home
      </Link>

      <div className="w-full max-w-md relative">
        {/* Overlapping Logo - Simplified */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-10">
          <div className="w-16 h-16 bg-surface rounded-2xl flex items-center justify-center border-4 border-surface shadow-md p-2 transition-transform hover:scale-110 duration-500">
            <img src={logo} alt="Cosy Content Logo" className="w-full h-full object-contain" />
          </div>
        </div>

        <div className="p-10 pt-12 bg-surface-container-low rounded-[2.5rem] border border-outline-variant shadow-lg relative overflow-hidden">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black font-headline text-on-surface tracking-tight">Welcome Back</h2>
            <p className="mt-2 text-on-surface-variant font-medium text-sm">Log in to manage your digital assets</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="text-red-500 text-xs font-bold text-center bg-red-500/5 p-3 rounded-xl border border-red-500/20">
                {error}
              </div>
            )}
            
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2 ml-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  className="w-full px-5 py-4 bg-surface border border-outline-variant rounded-2xl focus:border-primary outline-none transition-all text-on-surface font-medium"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2 ml-1">
                  <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant">Password</label>
                  <Link to="/forgot-password" className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline transition-all">Forgot Password?</Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    className="w-full px-5 py-4 bg-surface border border-outline-variant rounded-2xl focus:border-primary outline-none transition-all text-on-surface font-medium pr-12"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors p-1"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-6 bg-primary text-white font-black rounded-2xl hover:brightness-110 transition-all shadow-md active:scale-[0.98] disabled:opacity-70 flex justify-center items-center"
            >
              {isLoading ? 'Authenticating...' : 'Login to Dashboard'}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-outline-variant text-center">
            <p className="text-on-surface-variant font-medium text-sm">
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
