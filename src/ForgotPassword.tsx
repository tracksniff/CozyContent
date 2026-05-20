import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Mail, Lock, CheckCircle, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import logo from './assets/PNG/Cosy Content Ltd -04.png';

const ForgotPassword: React.FC = () => {
  const [step, setStep] = useState<1 | 2>(1); // 1: Request OTP, 2: Verify & Reset
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/forgot-password/request/`, { email });
      toast.success('If an account exists, an OTP has been sent to your email.');
      setStep(2);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    
    setIsLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/forgot-password/verify/`, {
        email,
        otp,
        new_password: newPassword
      });
      toast.success('Password reset successfully! You can now log in.');
      // Redirect to login after a short delay
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to reset password. Please check your OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface transition-colors duration-300 p-6">
      <Link 
        to="/login" 
        className="absolute top-8 left-8 flex items-center text-on-surface-variant hover:text-primary transition-colors font-bold text-sm"
      >
        Back to Login
      </Link>

      <div className="w-full max-w-md relative">
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-10">
          <div className="w-16 h-16 bg-surface rounded-2xl flex items-center justify-center border-4 border-surface shadow-md p-2 transition-transform hover:scale-110 duration-500">
            <img src={logo} alt="Cosy Content Logo" className="w-full h-full object-contain" />
          </div>
        </div>

        <div className="p-10 pt-12 bg-surface-container-low rounded-[2.5rem] border border-outline-variant shadow-lg relative overflow-hidden">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black font-headline text-on-surface tracking-tight">
              {step === 1 ? 'Forgot Password?' : 'Verify OTP'}
            </h2>
            <p className="mt-2 text-on-surface-variant font-medium text-sm">
              {step === 1 
                ? "Don't worry, it happens. Enter your email to receive a recovery code." 
                : "We've sent a 6-digit code to your email. Enter it below with your new password."}
            </p>
          </div>

          {step === 1 ? (
            <form className="space-y-6" onSubmit={handleRequestOtp}>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={18} />
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    className="w-full pl-12 pr-5 py-4 bg-surface border border-outline-variant rounded-2xl focus:border-primary outline-none transition-all text-on-surface font-medium"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 px-6 bg-primary text-white font-black rounded-2xl hover:brightness-110 transition-all shadow-md active:scale-[0.98] disabled:opacity-70 flex justify-center items-center gap-2"
              >
                {isLoading ? 'Sending OTP...' : 'Send Recovery Code'}
              </button>
            </form>
          ) : (
            <form className="space-y-6" onSubmit={handleResetPassword}>
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2 ml-1">6-Digit OTP</label>
                  <div className="relative">
                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={18} />
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="000000"
                      className="w-full pl-12 pr-5 py-4 bg-surface border border-outline-variant rounded-2xl focus:border-primary outline-none transition-all text-on-surface font-medium tracking-[0.5em] text-center"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2 ml-1">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={18} />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      className="w-full pl-12 pr-5 py-4 bg-surface border border-outline-variant rounded-2xl focus:border-primary outline-none transition-all text-on-surface font-medium"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2 ml-1">Confirm New Password</label>
                  <div className="relative">
                    <CheckCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={18} />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      className="w-full pl-12 pr-5 py-4 bg-surface border border-outline-variant rounded-2xl focus:border-primary outline-none transition-all text-on-surface font-medium"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 px-6 bg-primary text-white font-black rounded-2xl hover:brightness-110 transition-all shadow-md active:scale-[0.98] disabled:opacity-70 flex justify-center items-center gap-2"
              >
                {isLoading ? 'Resetting Password...' : 'Update Password'}
              </button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-xs font-black uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors"
              >
                Resend OTP
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
