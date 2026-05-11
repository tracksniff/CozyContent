import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { Bell, Lock, Eye, Palette, HelpCircle, KeyRound } from 'lucide-react';
import { useTheme } from './ThemeContext';
import { useAuth } from './AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const Settings: React.FC = () => {
  useTheme();
  const { user, token } = useAuth();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChanging, setIsChanging] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match.');
      return;
    }
    setIsChanging(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/change-password/`,
        { old_password: oldPassword, new_password: newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Password changed successfully!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to change password.');
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex transition-colors duration-300">
      <Sidebar />
      <main className="flex-grow lg:ml-64 p-4 md:p-8 lg:p-10 transition-all duration-500 mt-16 lg:mt-0">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8 md:mb-10">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-headline text-on-surface tracking-tight mb-1.5">Settings</h1>
            <p className="text-on-surface-variant font-medium text-[10px] sm:text-xs lg:text-sm">Customize your experience and security preferences.</p>
          </header>

          <div className="space-y-6">
            {/* Appearance */}
            <section className="bg-surface-container-low p-5 md:p-8 rounded-2xl md:rounded-3xl border border-outline-variant shadow-sm">
              <h2 className="text-base md:text-lg font-black text-on-surface mb-4 flex items-center gap-2">
                <Palette size={16} className="text-primary md:size-[18px]" /> Appearance
              </h2>
              <p className="text-xs md:text-sm text-on-surface-variant font-medium">
                  Theme controls are always available via the floating palette button on the bottom right of your screen.
              </p>
            </section>

            {/* Notifications */}
            <section className="bg-surface-container-low p-5 md:p-8 rounded-2xl md:rounded-3xl border border-outline-variant shadow-sm">
              <h2 className="text-base md:text-lg font-black text-on-surface mb-4 flex items-center gap-2">
                <Bell size={16} className="text-primary md:size-[18px]" /> Notifications
              </h2>
              <div className="space-y-2 md:space-y-3">
                {[
                  { label: 'Email Updates', desc: 'Receive emails about your website status.' },
                  { label: 'Marketing Emails', desc: 'News about new templates and features.' },
                  { label: 'Security Alerts', desc: 'Get notified about login attempts.' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 md:p-4 bg-surface rounded-xl md:rounded-2xl border border-outline-variant">
                    <div>
                      <div className="text-xs md:text-sm font-bold text-on-surface">{item.label}</div>
                      <div className="text-[9px] md:text-[10px] text-on-surface-variant">{item.desc}</div>
                    </div>
                    <div className="w-8 h-4 md:w-10 md:h-5 bg-primary/20 rounded-full relative cursor-pointer">
                        <div className="absolute right-0.5 top-0.5 w-3 h-3 md:w-4 md:h-4 bg-primary rounded-full"></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Security */}
            <section className="bg-surface-container-low p-5 md:p-8 rounded-2xl md:rounded-3xl border border-outline-variant shadow-sm">
              <h2 className="text-base md:text-lg font-black text-on-surface mb-4 md:mb-6 flex items-center gap-2">
                <Lock size={16} className="text-primary md:size-[18px]" /> Security
              </h2>

              <div className="mb-6 p-4 md:p-6 bg-surface rounded-xl md:rounded-2xl border border-outline-variant/50">
                <h3 className="text-[10px] md:text-xs font-black uppercase tracking-widest text-on-surface-variant mb-4 flex items-center gap-2">
                  <KeyRound size={12} className="md:size-[14px]" /> Change Password
                </h3>
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-[8px] md:text-[9px] font-black uppercase tracking-widest text-on-surface-variant mb-1.5 ml-1">Current Password</label>
                      <input
                        type="password"
                        required
                        className="w-full px-4 py-2 bg-surface border border-outline-variant rounded-xl focus:border-primary outline-none text-xs font-medium"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-[8px] md:text-[9px] font-black uppercase tracking-widest text-on-surface-variant mb-1.5 ml-1">New Password</label>
                      <input
                        type="password"
                        required
                        className="w-full px-4 py-2 bg-surface border border-outline-variant rounded-xl focus:border-primary outline-none text-xs font-medium"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-[8px] md:text-[9px] font-black uppercase tracking-widest text-on-surface-variant mb-1.5 ml-1">Confirm Password</label>
                      <input
                        type="password"
                        required
                        className="w-full px-4 py-2 bg-surface border border-outline-variant rounded-xl focus:border-primary outline-none text-xs font-medium"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={isChanging}
                    className="w-full md:w-auto mt-2 px-6 py-2.5 bg-primary text-white font-black rounded-lg hover:brightness-110 transition-all text-[10px] md:text-xs uppercase tracking-widest disabled:opacity-70"
                  >
                    {isChanging ? 'Updating...' : 'Update Password'}
                  </button>
                </form>
              </div>

              <div className="space-y-2 md:space-y-3">
                <button className="w-full text-left px-4 md:px-6 py-3 bg-surface border border-outline-variant rounded-xl font-bold text-xs md:text-sm hover:border-primary transition-all flex items-center justify-between">
                  2FA
                  <span className="text-[9px] md:text-[10px] font-black text-primary uppercase">Enable</span>
                </button>
                <button className="w-full text-left px-4 md:px-6 py-3 bg-surface border border-outline-variant rounded-xl font-bold text-xs md:text-sm hover:border-primary transition-all flex items-center justify-between">
                  Sessions
                  <Eye size={14} className="text-on-surface-variant" />
                </button>
              </div>
            </section>

            {/* Support */}
            <section className="bg-surface-container-low p-5 md:p-8 rounded-2xl md:rounded-3xl border border-outline-variant shadow-sm">
              <h2 className="text-base md:text-lg font-black text-on-surface mb-4 flex items-center gap-2">
                <HelpCircle size={16} className="text-primary md:size-[18px]" /> Help & Support
              </h2>
              <div className="p-4 md:p-6 bg-primary/5 border border-primary/20 rounded-xl md:rounded-2xl">
                <p className="text-xs md:text-sm text-on-surface-variant font-medium mb-4">Need help with your website or account? Send us a message.</p>
                
                <form 
                  className="space-y-4"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const target = e.target as any;
                    const data = {
                      name: `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || "User",
                      email: user?.email || "noreply@cosycontent.com",
                      message: target.message.value
                    };
                    try {
                      const btn = target.querySelector('button');
                      btn.disabled = true;
                      btn.innerText = 'Sending...';
                      
                      await axios.post(`${import.meta.env.VITE_API_URL}/api/contact-us/`, data);
                      toast.success('Support request sent! We will get back to you soon.');
                      target.reset();
                      btn.innerText = 'Send Message';
                      btn.disabled = false;
                    } catch (err) {
                      toast.error('Failed to send message.');
                      const btn = target.querySelector('button');
                      btn.innerText = 'Send Message';
                      btn.disabled = false;
                    }
                  }}
                >
                  <textarea
                    name="message"
                    required
                    rows={3}
                    placeholder="Describe your issue or question..."
                    className="w-full px-4 py-3 bg-surface border border-outline-variant/50 rounded-xl focus:border-primary outline-none transition-all text-on-surface font-medium text-xs resize-none"
                  ></textarea>
                  <button 
                    type="submit"
                    className="w-full md:w-auto bg-primary text-white px-8 py-2.5 rounded-lg font-black text-xs uppercase tracking-widest hover:shadow-lg transition-all"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
