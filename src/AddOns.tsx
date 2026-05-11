import React, { useState } from 'react';
import { Package, Zap, ArrowRight, ShieldCheck, Clock, Check, Star } from 'lucide-react';
import Sidebar from './Sidebar';
import { useAuth } from './AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const AddOns: React.FC = () => {
  const { token, user } = useAuth();
  const [loadingPack, setLoadingPack] = useState<string | null>(null);

  const packs = [
    { id: 'pack_1', name: '1 Extra Update', price: '£15', desc: 'Single urgent change', icon: <Zap className="text-blue-500" /> },
    { id: 'pack_5', name: '5 Extra Updates', price: '£39', desc: 'Better value for busy sites', icon: <Package className="text-purple-500" /> },
    { id: 'pack_10', name: '10 Extra Updates', price: '£69', desc: 'Popular for growing brands', icon: <ShieldCheck className="text-green-500" /> },
    { id: 'pack_20', name: '20 Extra Updates', price: '£119', desc: 'Maximum flexibility', icon: <Zap className="text-amber-500" /> },
  ];

  const handlePurchase = async (planType: string) => {
    if (!token) return;

    setLoadingPack(planType);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/create-checkout-session/`, {
        plan_type: planType,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.url) {
        window.location.href = res.data.url;
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to initiate purchase');
    } finally {
      setLoadingPack(null);
    }
  };

  const totalRemaining = (user?.monthly_requests_remaining || 0) + (user?.purchased_requests_remaining || 0);

  return (
    <div className="min-h-screen bg-surface flex transition-colors duration-300">
      <Sidebar />
      <main className="flex-grow lg:ml-64 p-4 md:p-8 lg:p-12 transition-all duration-500 mt-16 lg:mt-0">
        <div className="max-w-5xl mx-auto">
          <header className="mb-8 md:mb-12">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-headline text-on-surface tracking-tight mb-2">Service Add-ons</h1>
            <p className="text-on-surface-variant font-medium text-xs sm:text-sm lg:text-base">Enhance your experience and keep your site fresh.</p>
          </header>

          {/* Current Status Card */}
          <div className="bg-primary/5 rounded-[1.5rem] md:rounded-[2.5rem] border border-primary/10 p-6 md:p-8 mb-8 md:mb-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-primary/5">
            <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6 text-center sm:text-left">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-surface rounded-2xl md:rounded-3xl flex items-center justify-center border-4 border-primary/20 shadow-lg">
                    <Clock size={28} className="text-primary animate-pulse md:size-[32px]" />
                </div>
                <div>
                    <div className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-primary mb-1">Current Balance</div>
                    <div className="text-xl md:text-3xl font-black text-on-surface">{totalRemaining} Updates Available</div>
                </div>
            </div>
            {user?.priority_updates_active ? (
                <div className="px-3 py-1.5 md:px-4 md:py-2 bg-yellow-400 text-black rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-yellow-400/20">
                    <Zap size={14} fill="black" className="md:size-[16px]" /> Priority Support
                </div>
            ) : (
                <div className="text-[10px] md:text-xs font-bold text-on-surface-variant italic">
                    Standard support speeds active
                </div>
            )}
          </div>

          {/* Priority Support Section */}
          {!user?.priority_updates_active && (
            <section className="mb-12 md:mb-16">
               <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
                <div className="h-8 md:h-10 w-1 md:w-1.5 bg-yellow-400 rounded-full"></div>
                <h2 className="text-xl md:text-2xl font-black text-on-surface tracking-tight uppercase">Upgrade to Priority</h2>
              </div>
              <div className="bg-surface-container-low rounded-[1.5rem] md:rounded-[2.5rem] border border-outline-variant p-6 md:p-10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Star size={120} className="md:size-[180px] text-yellow-400" fill="currentColor" />
                </div>                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-center">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-400/10 text-yellow-600 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest mb-4 border border-yellow-400/20">
                            <Zap size={10} fill="currentColor" className="md:size-[12px]" /> Recommended
                        </div>
                        <h3 className="text-2xl md:text-3xl font-black text-on-surface mb-3 md:mb-4">Priority Maintenance</h3>
                        <p className="text-sm md:text-base text-on-surface-variant font-medium mb-6 md:mb-8">Skip the queue for every update request. Get your changes live faster with our dedicated priority lane.</p>
                        
                        <div className="space-y-3">
                            {[
                                'Same-day response times',
                                'Direct WhatsApp support',
                                'Advanced monitoring',
                                'Priority bug fixing'
                            ].map((feature, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-yellow-400/10 flex items-center justify-center shrink-0">
                                        <Check size={10} className="text-yellow-600 md:size-[12px]" strokeWidth={4} />
                                    </div>
                                    <span className="text-xs md:text-sm font-bold text-on-surface">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-surface p-6 md:p-8 rounded-2xl md:rounded-[2rem] border border-outline-variant shadow-lg text-center">
                        <div className="text-[10px] md:text-sm font-black text-on-surface-variant uppercase tracking-widest mb-2">Priority Add-on</div>
                        <div className="text-4xl md:text-5xl font-black text-on-surface mb-1 md:mb-2">£19<span className="text-sm md:text-base font-bold text-on-surface-variant">/mo</span></div>
                        <p className="text-[10px] md:text-xs font-medium text-on-surface-variant mb-6 md:mb-8">Billed monthly, cancel anytime.</p>
                        <button 
                            onClick={() => handlePurchase('priority_monthly')}
                            disabled={!!loadingPack}
                            className="w-full py-3 md:py-4 bg-yellow-400 text-black rounded-xl md:rounded-2xl font-black hover:brightness-105 shadow-xl shadow-yellow-400/20 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 text-sm md:text-base"
                        >
                            {loadingPack === 'priority_monthly' ? (
                                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                            ) : (
                                <>Go Priority <ArrowRight size={16} className="md:size-[18px]" /></>
                            )}
                        </button>
                    </div>
                </div>
              </div>
            </section>
          )}

          {/* Update Packs Section */}
          <section>
            <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
                <div className="h-8 md:h-10 w-1 md:w-1.5 bg-primary rounded-full"></div>
                <h2 className="text-xl md:text-2xl font-black text-on-surface tracking-tight uppercase">Update Packs</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                {packs.map((pack) => (
                <div key={pack.id} className="bg-surface-container-low p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-outline-variant hover:border-primary hover:shadow-2xl hover:shadow-primary/5 transition-all group relative overflow-hidden flex flex-col">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        {React.cloneElement(pack.icon as React.ReactElement<any>, { size: 80 })}
                    </div>                    
                    <div className="flex justify-between items-start mb-4 md:mb-6">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-surface rounded-xl md:rounded-2xl border border-outline-variant flex items-center justify-center">
                            {pack.icon}
                        </div>
                        <div className="text-2xl md:text-3xl font-black text-on-surface">{pack.price}</div>
                    </div>

                    <div className="mb-6 md:mb-8">
                        <h3 className="text-lg md:text-xl font-black text-on-surface mb-1 md:mb-2">{pack.name}</h3>
                        <p className="text-xs md:text-sm font-medium text-on-surface-variant leading-relaxed">{pack.desc}</p>
                    </div>

                    <div className="mt-auto">
                        <button 
                            onClick={() => handlePurchase(pack.id)}
                            disabled={!!loadingPack}
                            className="w-full py-3 md:py-4 bg-primary text-white rounded-xl md:rounded-2xl font-black hover:brightness-110 shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 text-sm md:text-base"
                        >
                            {loadingPack === pack.id ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>Purchase Now <ArrowRight size={16} className="md:size-[18px]" /></>
                            )}
                        </button>
                        <p className="text-[9px] md:text-[10px] font-black text-on-surface-variant uppercase tracking-widest text-center mt-3 md:mt-4 opacity-40">Updates never expire</p>
                    </div>
                </div>
                ))}
            </div>
          </section>

          <div className="mt-8 md:mt-12 bg-surface-container-low p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-outline-variant border-dashed text-center">
            <h3 className="text-lg md:text-xl font-black text-on-surface mb-2">Need a custom amount?</h3>
            <p className="text-xs md:text-sm font-medium text-on-surface-variant mb-4 md:mb-6">We offer tailored packages for large portfolios and complex updates.</p>
            <button className="text-primary font-black uppercase tracking-widest hover:brightness-125 transition-all text-[11px] md:text-sm">Contact Support</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddOns;
