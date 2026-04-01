import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Eye, EyeOff, ArrowLeft, ShieldCheck } from 'lucide-react';

const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirm_password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirm_password) {
      setError("Passwords don't match");
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/register/`, formData);
      navigate('/login');
    } catch (err: any) {
      const errorMsg = err.response?.data ? JSON.stringify(err.response.data) : 'Signup failed. Please try again.';
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
          <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center border-4 border-surface shadow-md">
            <span className="text-white font-black text-2xl italic">C</span>
          </div>
        </div>

        <div className="p-10 pt-12 bg-surface-container-low rounded-[2.5rem] border border-outline-variant shadow-lg relative overflow-hidden">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black font-headline text-on-surface tracking-tight">Join Us</h2>
            <p className="mt-2 text-on-surface-variant font-medium text-sm">Start your digital transformation</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="text-red-500 text-xs font-bold text-center bg-red-500/5 p-3 rounded-xl border border-red-500/20">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2 ml-1">Email Address</label>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="w-full px-5 py-4 bg-surface border border-outline-variant rounded-2xl focus:border-primary outline-none transition-all text-on-surface font-medium"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2 ml-1">Create Password</label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    className="w-full px-5 py-4 bg-surface border border-outline-variant rounded-2xl focus:border-primary outline-none transition-all text-on-surface font-medium pr-12"
                    value={formData.password}
                    onChange={handleChange}
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

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2 ml-1">Confirm Password</label>
                <div className="relative">
                  <input
                    name="confirm_password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    className="w-full px-5 py-4 bg-surface border border-outline-variant rounded-2xl focus:border-primary outline-none transition-all text-on-surface font-medium pr-12"
                    value={formData.confirm_password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors p-1"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-surface p-4 rounded-2xl border border-outline-variant flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                By creating an account, you agree to our Terms of Service and Privacy Policy. Your data is encrypted and secure.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-6 bg-primary text-white font-black rounded-2xl hover:brightness-110 transition-all shadow-md active:scale-[0.98] disabled:opacity-70 flex justify-center items-center"
            >
              {isLoading ? 'Creating Account...' : 'Get Started Now'}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-outline-variant text-center">
            <p className="text-on-surface-variant font-medium text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-black hover:underline ml-1">Log in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
