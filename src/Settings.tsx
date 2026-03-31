import React from 'react';
import Sidebar from './Sidebar';
import { Settings as SettingsIcon, Bell, Lock, Eye, Palette, HelpCircle } from 'lucide-react';
import { useTheme } from './ThemeContext';

const Settings: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-surface flex transition-colors duration-300">
      <Sidebar />
      <main className="flex-grow ml-20 lg:ml-64 p-8 lg:p-12 transition-all duration-500">
        <div className="max-w-4xl mx-auto">
          <header className="mb-12">
            <h1 className="text-4xl font-black font-headline text-on-surface tracking-tight mb-2">Settings</h1>
            <p className="text-on-surface-variant font-medium">Customize your experience and security preferences.</p>
          </header>

          <div className="space-y-6">
            {/* Appearance */}
            <section className="bg-surface-container-low p-8 rounded-[2.5rem] border border-outline-variant shadow-sm">
              <h2 className="text-xl font-black text-on-surface mb-6 flex items-center gap-2">
                <Palette size={20} className="text-primary" /> Appearance
              </h2>
              <div className="grid grid-cols-3 gap-4">
                {['light', 'dark', 'system'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t as any)}
                    className={`p-4 rounded-2xl border-2 transition-all capitalize font-bold ${
                      theme === t ? 'border-primary bg-primary/5 text-primary' : 'border-outline-variant hover:border-primary/50'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
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
                <p className="text-on-surface-variant font-medium mb-4">Need help with your website or account?</p>
                <button className="bg-primary text-white px-8 py-3 rounded-xl font-black text-sm hover:shadow-lg transition-all">
                  Contact Support
                </button>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
