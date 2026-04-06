import React from 'react';
import Sidebar from './Sidebar';
import { Bell, Lock, Eye, Palette, HelpCircle } from 'lucide-react';
import { useTheme } from './ThemeContext';
import { useAuth } from './AuthContext';
import axios from 'axios';

const Settings: React.FC = () => {
  useTheme();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-surface flex transition-colors duration-300">
      <Sidebar />
      <main className="flex-grow lg:ml-64 p-6 md:p-8 lg:p-12 transition-all duration-500 mt-16 lg:mt-0">
        <div className="max-w-4xl mx-auto">
          <header className="mb-10 lg:mb-12">
            <h1 className="text-3xl lg:text-4xl font-black font-headline text-on-surface tracking-tight mb-2">Settings</h1>
            <p className="text-on-surface-variant font-medium text-sm lg:text-base">Customize your experience and security preferences.</p>
          </header>

          <div className="space-y-6">
            {/* Appearance */}
            <section className="bg-surface-container-low p-8 rounded-[2.5rem] border border-outline-variant shadow-sm">
              <h2 className="text-xl font-black text-on-surface mb-6 flex items-center gap-2">
                <Palette size={20} className="text-primary" /> Appearance
              </h2>
              <p className="text-on-surface-variant font-medium">
                  Theme controls are always available via the floating palette button on the bottom right of your screen.
              </p>
            </section>

            {/* Notifications */}
            <section className="bg-surface-container-low p-8 rounded-[2.5rem] border border-outline-variant shadow-sm">
              <h2 className="text-xl font-black text-on-surface mb-6 flex items-center gap-2">
                <Bell size={20} className="text-primary" /> Notifications
              </h2>
              <div className="space-y-4">
                {[
                  { label: 'Email Updates', desc: 'Receive emails about your website status.' },
                  { label: 'Marketing Emails', desc: 'News about new templates and features.' },
                  { label: 'Security Alerts', desc: 'Get notified about login attempts.' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-surface rounded-2xl border border-outline-variant">
                    <div>
                      <div className="font-bold text-on-surface">{item.label}</div>
                      <div className="text-xs text-on-surface-variant">{item.desc}</div>
                    </div>
                    <div className="w-12 h-6 bg-primary/20 rounded-full relative cursor-pointer">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-primary rounded-full"></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Security */}
            <section className="bg-surface-container-low p-8 rounded-[2.5rem] border border-outline-variant shadow-sm">
              <h2 className="text-xl font-black text-on-surface mb-6 flex items-center gap-2">
                <Lock size={20} className="text-primary" /> Security
              </h2>
              <div className="space-y-4">
                <button className="w-full text-left px-6 py-4 bg-surface border border-outline-variant rounded-2xl font-bold hover:border-primary transition-all flex items-center justify-between">
                  Two-Factor Authentication
                  <span className="text-xs font-black text-primary uppercase">Enable</span>
                </button>
                <button className="w-full text-left px-6 py-4 bg-surface border border-outline-variant rounded-2xl font-bold hover:border-primary transition-all flex items-center justify-between">
                  Active Sessions
                  <Eye size={16} className="text-on-surface-variant" />
                </button>
              </div>
            </section>

            {/* Support */}
            <section className="bg-surface-container-low p-8 rounded-[2.5rem] border border-outline-variant shadow-sm">
              <h2 className="text-xl font-black text-on-surface mb-6 flex items-center gap-2">
                <HelpCircle size={20} className="text-primary" /> Help & Support
              </h2>
              <div className="p-6 bg-primary/5 border border-primary/20 rounded-3xl">
                <p className="text-on-surface-variant font-medium mb-6">Need help with your website or account? Send us a message.</p>
                
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
                      alert('Support request sent! We will get back to you soon.');
                      target.reset();
                      btn.innerText = 'Send Message';
                      btn.disabled = false;
                    } catch (err) {
                      alert('Failed to send message.');
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
                    className="w-full px-5 py-4 bg-surface border border-outline-variant/50 rounded-2xl focus:border-primary outline-none transition-all text-on-surface font-medium text-sm resize-none"
                  ></textarea>
                  <button 
                    type="submit"
                    className="bg-primary text-white px-8 py-3 rounded-xl font-black text-sm hover:shadow-lg transition-all"
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
