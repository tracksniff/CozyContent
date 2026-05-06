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
      <main className="flex-grow lg:ml-64 p-6 md:p-8 lg:p-12 transition-all duration-500 mt-16 lg:mt-0">
        <div className="max-w-5xl mx-auto">
          <header className="mb-12">
            <h1 className="text-3xl lg:text-4xl font-black font-headline text-on-surface tracking-tight mb-2">Service Add-ons</h1>
            <p className="text-on-surface-variant font-medium text-sm lg:text-base">Enhance your experience and keep your site fresh.</p>
          </header>

          {/* Current Status Card */}
          <div className="bg-primary/5 rounded-[2.5rem] border border-primary/10 p-8 mb-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-primary/5">
            <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-surface rounded-3xl flex items-center justify-center border-4 border-primary/20 shadow-lg">
                    <Clock size={32} className="text-primary animate-pulse" />
                </div>
                <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Current Balance</div>
                    <div className="text-3xl font-black text-on-surface">{totalRemaining} Updates Available</div>
                </div>
            </div>
            {user?.priority_updates_active ? (
                <div className="px-4 py-2 bg-yellow-400 text-black rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-yellow-400/20">
                    <Zap size={16} fill="black" /> Priority Support Active
                </div>
            ) : (
                <div className="text-xs font-bold text-on-surface-variant italic">
                    Standard support speeds active
                </div>
            )}
          </div>

          {/* Priority Support Section */}
          {!user?.priority_updates_active && (
            <section className="mb-16">
               <div className="flex items-center gap-4 mb-8">
                <div className="h-10 w-1.5 bg-yellow-400 rounded-full"></div>
                <h2 className="text-2xl font-black text-on-surface tracking-tight uppercase">Upgrade to Priority</h2>
              </div>
              <div className="bg-surface-container-low rounded-[2.5rem] border border-outline-variant p-8 md:p-10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Star size={180} fill="currentColor" className="text-yellow-400" />
                </div>
                <div className="relative z-10 grid md:grid-cols-2 gap-10 items-center">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-400/10 text-yellow-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 border border-yellow-400/20">
                            <Zap size={12} fill="currentColor" /> Highly Recommended
                        </div>
                        <h3 className="text-3xl font-black text-on-surface mb-4">Priority Maintenance</h3>
                        <p className="text-on-surface-variant font-medium mb-8">Skip the queue for every update request. Get your changes live faster with our dedicated priority lane.</p>
                        
                        <div className="space-y-3">
                            {[
                                'Same-day response times',
                                'Direct WhatsApp support access',
                                'Advanced performance monitoring',
                                'Priority bug fixing'
                            ].map((feature, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-yellow-400/10 flex items-center justify-center shrink-0">
                                        <Check size={12} className="text-yellow-600" strokeWidth={4} />
                                    </div>
                                    <span className="text-sm font-bold text-on-surface">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-surface p-8 rounded-[2rem] border border-outline-variant shadow-lg text-center">
                        <div className="text-sm font-black text-on-surface-variant uppercase tracking-widest mb-2">Priority Add-on</div>
                        <div className="text-5xl font-black text-on-surface mb-2">£19<span className="text-sm font-bold text-on-surface-variant">/mo</span></div>
                        <p className="text-xs font-medium text-on-surface-variant mb-8">Billed monthly, cancel anytime.</p>
                        <button 
                            onClick={() => handlePurchase('priority_monthly')}
                            disabled={!!loadingPack}
                            className="w-full py-4 bg-yellow-400 text-black rounded-2xl font-black hover:brightness-105 shadow-xl shadow-yellow-400/20 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                        >
                            {loadingPack === 'priority_monthly' ? (
                                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                            ) : (
                                <>Go Priority <ArrowRight size={18} /></>
                            )}
                        </button>
                    </div>
                </div>
              </div>
            </section>
          )}

          {/* Update Packs Section */}
          <section>
            <div className="flex items-center gap-4 mb-8">
                <div className="h-10 w-1.5 bg-primary rounded-full"></div>
                <h2 className="text-2xl font-black text-on-surface tracking-tight uppercase">Purchase Update Packs</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {packs.map((pack) => (
                <div key={pack.id} className="bg-surface-container-low p-8 rounded-[2.5rem] border border-outline-variant hover:border-primary hover:shadow-2xl hover:shadow-primary/5 transition-all group relative overflow-hidden flex flex-col">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        {React.cloneElement(pack.icon as React.ReactElement<any>, { size: 120 })}
                    </div>                    
                    <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-12 bg-surface rounded-2xl border border-outline-variant flex items-center justify-center">
                            {pack.icon}
                        </div>
                        <div className="text-3xl font-black text-on-surface">{pack.price}</div>
                    </div>

                    <div className="mb-8">
                        <h3 className="text-xl font-black text-on-surface mb-2">{pack.name}</h3>
                        <p className="text-sm font-medium text-on-surface-variant leading-relaxed">{pack.desc}</p>
                    </div>

                    <div className="mt-auto">
                        <button 
                            onClick={() => handlePurchase(pack.id)}
                            disabled={!!loadingPack}
                            className="w-full py-4 bg-primary text-white rounded-2xl font-black hover:brightness-110 shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                        >
                            {loadingPack === pack.id ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>Purchase Now <ArrowRight size={18} /></>
                            )}
                        </button>
                        <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest text-center mt-4 opacity-40">Updates never expire</p>
                    </div>
                </div>
                ))}
            </div>
          </section>

          <div className="mt-12 bg-surface-container-low p-8 rounded-[2.5rem] border border-outline-variant border-dashed text-center">
            <h3 className="text-xl font-black text-on-surface mb-2">Need a custom amount?</h3>
            <p className="text-sm font-medium text-on-surface-variant mb-6">We offer tailored packages for large portfolios and complex updates.</p>
            <button className="text-primary font-black uppercase tracking-widest hover:brightness-125 transition-all text-sm">Contact Support</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddOns;
