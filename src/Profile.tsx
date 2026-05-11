import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import Sidebar from './Sidebar';
import { User, Shield, CreditCard, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

import PricingToggle from './PricingToggle';

const Profile: React.FC = () => {
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isAnnual, setIsAnnual] = useState(true);

  const handleCheckout = async (planType: 'one_time' | 'monthly' | 'annual') => {
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
      <main className="flex-grow lg:ml-64 p-4 md:p-8 lg:p-12 transition-all duration-500 mt-16 lg:mt-0">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8 md:mb-10 lg:mb-12">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-headline text-on-surface tracking-tight mb-2">My Profile</h1>
            <p className="text-on-surface-variant font-medium text-xs sm:text-sm lg:text-base">Manage your personal information and subscription.</p>
          </header>

          <div className="grid gap-6 md:gap-8">
            {/* User Info Card */}
            <div className="bg-surface-container-low p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-outline-variant shadow-sm flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-primary/10 text-primary rounded-2xl md:rounded-3xl flex items-center justify-center shrink-0">
                <User size={32} className="md:size-[40px]" />
              </div>
              <div className="overflow-hidden w-full">
                <h2 className="text-xl md:text-2xl font-black text-on-surface truncate">{user?.first_name} {user?.last_name}</h2>
                <p className="text-sm md:text-base text-on-surface-variant font-medium truncate">{user?.email}</p>
                {user?.is_staff && (
                  <div className="mt-2 inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/20">
                    <Shield size={10} className="md:size-[12px]" /> Staff Member
                  </div>
                )}
              </div>
            </div>

            {/* Subscription Status Card */}
            <div className="bg-surface-container-low p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-outline-variant shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 md:p-8 opacity-5">
                <CreditCard size={80} className="md:size-[120px]" />
              </div>
              <div className="relative z-10">
                <h3 className="text-lg md:text-xl font-black text-on-surface mb-4 md:mb-6 flex items-center gap-2">
                  <CreditCard size={18} className="text-primary md:size-[20px]" /> Subscription Status
                </h3>

                {user?.is_premium ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-green-500">
                      <CheckCircle2 size={20} className="md:size-[24px]" />
                      <span className="text-base md:text-lg font-bold">
                        {user.plan_type === 'one_time' ? 'Lifetime Owner' : 
                         user.plan_type === 'annual' ? 'Annual Concierge' : 
                         user.plan_type === 'monthly' ? 'Monthly Concierge' : 
                         'Premium Account'}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4">
                      <p className="text-xs md:text-sm text-on-surface-variant font-medium">
                        Status: <span className="uppercase font-black text-[9px] md:text-xs tracking-widest bg-green-500/10 text-green-500 px-2 py-1 rounded-md">{user?.subscription_status}</span>
                      </p>
                      {user.plan_type && (
                        <p className="text-xs md:text-sm text-on-surface-variant font-medium">
                          Plan: <span className="uppercase font-black text-[9px] md:text-xs tracking-widest bg-primary/10 text-primary px-2 py-1 rounded-md">{user.plan_type.replace('_', ' ')}</span>
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6 md:space-y-8">
                    <div className="p-6 md:p-8 bg-surface border border-outline-variant/30 rounded-[1.5rem] md:rounded-[2.5rem] shadow-sm">
                      <p className="text-sm md:text-base text-on-surface-variant font-medium mb-8 md:mb-10 text-center">You are currently on the free plan. Upgrade to launch your website.</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        {/* Monthly Plan */}
                        <div className="relative group">
                          <div className="absolute inset-0 bg-surface-container-low rounded-2xl md:rounded-3xl border-2 border-primary shadow-lg shadow-primary/5 transition-all group-hover:scale-[1.01]"></div>
                          <div className="relative p-5 md:p-6 flex flex-col h-full">
                            <div className="mb-4">
                              <h4 className="text-base md:text-lg font-black text-on-surface">Monthly Concierge</h4>
                              <p className="text-[10px] md:text-xs font-medium text-on-surface-variant">Best for ongoing support</p>
                            </div>
                            <div className="flex flex-col gap-1 mb-6 p-4 rounded-xl md:rounded-2xl bg-surface/50 border border-outline-variant/10">
                              <div className="text-2xl md:text-3xl font-black text-on-surface">
                                {isAnnual ? '£47' : '£59'}<span className="text-xs md:text-sm font-bold">/month</span>
                              </div>
                              <div className="mt-2 pt-2 border-t border-outline-variant/5">
                                <PricingToggle isAnnual={isAnnual} onChange={setIsAnnual} />
                              </div>
                            </div>
                            <button 
                              onClick={() => handleCheckout(isAnnual ? 'annual' : 'monthly')}
                              disabled={loading}
                              className="w-full py-2.5 md:py-3 rounded-xl bg-primary text-white font-black hover:brightness-110 transition-all text-xs md:text-sm active:scale-95"
                            >
                              Select Monthly
                            </button>
                          </div>
                        </div>

                        {/* One-Time Plan */}
                        <div className="relative group">
                          <div className="absolute inset-0 bg-surface-container-low rounded-2xl md:rounded-3xl border border-outline-variant/30 shadow-md transition-all group-hover:scale-[1.01]"></div>
                          <div className="relative p-5 md:p-6 flex flex-col h-full">
                            <div className="mb-4">
                              <h4 className="text-base md:text-lg font-black text-on-surface">Lifetime Owner</h4>
                              <p className="text-[10px] md:text-xs font-medium text-on-surface-variant">One-time payment</p>
                            </div>
                            <div className="text-2xl md:text-3xl font-black text-on-surface mb-6 p-4 rounded-xl md:rounded-2xl bg-surface/50 border border-outline-variant/10">
                              £349<span className="text-xs md:text-sm font-bold"> Fixed</span>
                            </div>
                            <button 
                              onClick={() => handleCheckout('one_time')}
                              disabled={loading}
                              className="w-full py-2.5 md:py-3 rounded-xl bg-on-surface text-surface font-black hover:bg-on-surface-variant transition-all text-xs md:text-sm active:scale-95"
                            >
                              Select One-Time
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Account Management */}
            <div className="bg-surface-container-low p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-outline-variant shadow-sm">
              <h3 className="text-lg md:text-xl font-black text-on-surface mb-4 md:mb-6">Account Settings</h3>
              <div className="space-y-3 md:space-y-4">
                <button className="w-full text-left px-5 md:px-6 py-3.5 md:py-4 bg-surface border border-outline-variant rounded-xl md:rounded-2xl font-bold text-sm md:text-base hover:border-primary transition-all">
                  Change Password
                </button>
                <button className="w-full text-left px-5 md:px-6 py-3.5 md:py-4 bg-surface border border-outline-variant rounded-xl md:rounded-2xl font-bold text-sm md:text-base hover:border-red-500/50 text-red-500 transition-all">
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
