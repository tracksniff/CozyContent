import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import Sidebar from './Sidebar';
import { User, Shield, CreditCard, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

const Profile: React.FC = () => {
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async (planType: 'one_time' | 'monthly') => {
    setLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/create-checkout-session/`, 
        { plan_type: planType },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      window.location.href = response.data.url;
    } catch (err) {
      console.error('Checkout failed', err);
      alert('Failed to initiate checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex transition-colors duration-300">
      <Sidebar />
      <main className="flex-grow lg:ml-64 p-6 md:p-8 lg:p-12 transition-all duration-500 mt-16 lg:mt-0">
        <div className="max-w-4xl mx-auto">
          <header className="mb-10 lg:mb-12">
            <h1 className="text-3xl lg:text-4xl font-black font-headline text-on-surface tracking-tight mb-2">My Profile</h1>
            <p className="text-on-surface-variant font-medium text-sm lg:text-base">Manage your personal information and subscription.</p>
          </header>

          <div className="grid gap-6 md:gap-8">
            {/* User Info Card */}
            <div className="bg-surface-container-low p-6 md:p-8 rounded-[2.5rem] border border-outline-variant shadow-sm flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
              <div className="w-20 h-20 bg-primary/10 text-primary rounded-3xl flex items-center justify-center shrink-0">
                <User size={40} />
              </div>
              <div className="overflow-hidden">
                <h2 className="text-2xl font-black text-on-surface truncate">{user?.first_name} {user?.last_name}</h2>
                <p className="text-on-surface-variant font-medium truncate">{user?.email}</p>
                {user?.is_staff && (
                  <div className="mt-2 inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/20">
                    <Shield size={12} /> Staff Member
                  </div>
                )}
              </div>
            </div>

            {/* Subscription Status Card */}
            <div className="bg-surface-container-low p-8 rounded-[2.5rem] border border-outline-variant shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <CreditCard size={120} />
              </div>
              <div className="relative z-10">
                <h3 className="text-xl font-black text-on-surface mb-6 flex items-center gap-2">
                  <CreditCard size={20} className="text-primary" /> Subscription Status
                </h3>

                {user?.is_premium ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-green-500">
                      <CheckCircle2 size={24} />
                      <span className="text-lg font-bold">Your account is Premium</span>
                    </div>
                    <p className="text-on-surface-variant font-medium">
                      Status: <span className="uppercase font-black text-xs tracking-widest">{user?.subscription_status}</span>
                    </p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div className="p-6 bg-surface border border-outline-variant rounded-2xl">
                      <p className="text-on-surface-variant font-medium mb-4">You are currently on the free plan. Upgrade to launch your website.</p>
                      <div className="grid md:grid-cols-2 gap-4">
                        <button 
                          onClick={() => handleCheckout('one_time')}
                          disabled={loading}
                          className="p-6 rounded-2xl border-2 border-primary text-left hover:bg-primary/5 transition-all group"
                        >
                          <div className="text-primary font-black text-xs uppercase tracking-widest mb-1">One-Time Asset</div>
                          <div className="text-xl font-black mb-2">The Lifetime Owner</div>
                          <div className="text-2xl font-black text-primary mb-4">£249</div>
                          <div className="text-xs font-bold text-on-surface-variant group-hover:text-primary transition-colors">Select Plan &rarr;</div>
                        </button>
                        <button 
                          onClick={() => handleCheckout('monthly')}
                          disabled={loading}
                          className="p-6 rounded-2xl border-2 border-secondary text-left hover:bg-secondary/5 transition-all group"
                        >
                          <div className="text-secondary font-black text-xs uppercase tracking-widest mb-1">Monthly Concierge</div>
                          <div className="text-xl font-black mb-2">Monthly Concierge</div>
                          <div className="text-2xl font-black text-secondary mb-4">£59<span className="text-sm font-bold">/mo</span></div>
                          <div className="text-xs font-bold text-on-surface-variant group-hover:text-secondary transition-colors">Select Plan &rarr;</div>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Account Management */}
            <div className="bg-surface-container-low p-8 rounded-[2.5rem] border border-outline-variant shadow-sm">
              <h3 className="text-xl font-black text-on-surface mb-6">Account Settings</h3>
              <div className="space-y-4">
                <button className="w-full text-left px-6 py-4 bg-surface border border-outline-variant rounded-2xl font-bold hover:border-primary transition-all">
                  Change Password
                </button>
                <button className="w-full text-left px-6 py-4 bg-surface border border-outline-variant rounded-2xl font-bold hover:border-red-500/50 text-red-500 transition-all">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
