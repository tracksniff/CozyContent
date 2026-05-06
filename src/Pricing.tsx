import React, { useState } from 'react';
import { Check, Sparkles, Zap, Package } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import PricingToggle from './PricingToggle';
import { useAuth } from './AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const PricingPage: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(true);
  const { token } = useAuth();
  const navigate = useNavigate();
  const [loadingPack, setLoadingPack] = useState<string | null>(null);

  const handlePurchasePack = async (packType: string) => {
    if (!token) {
      navigate('/signup');
      return;
    }

    setLoadingPack(packType);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/create-checkout-session/`, {
        plan_type: packType,
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

  const packs = [
    { id: 'pack_1', name: '1 Extra Update', price: '£15', desc: 'Single urgent change' },
    { id: 'pack_5', name: '5 Extra Updates', price: '£39', desc: 'Better value for busy sites' },
    { id: 'pack_10', name: '10 Extra Updates', price: '£69', desc: 'Popular for growing brands' },
    { id: 'pack_20', name: '20 Extra Updates', price: '£119', desc: 'Maximum flexibility' },
  ];

  const plans = [
    {
      id: 'monthly_growth',
      type: 'monthly',
      name: 'Monthly Growth',
      monthlyPrice: '£59',
      annualPrice: '£47',
      period: '/month',
      desc: 'Perfect for established businesses needing ongoing support.',
      features: [
        'Hosting',
        'SSL',
        'Security',
        'Performance optimization',
        'Upto 5 small updates per month (eg text changes, image swaps, contact info updates)'
      ],
      cta: 'Get Started',
      popular: true,
      hasToggle: true
    },
    {
      id: 'one_time_launch',
      type: 'one_time',
      name: 'One-Time Launch',
      monthlyPrice: '£349',
      annualPrice: '£349',
      period: ' Fixed',
      desc: 'Great for businesses who want full ownership from day one.',
      features: [
        'Custom Built Website',
        'Full Source Code Handover',
        '7-Day Delivery',
        'Vite + React + TypeScript',
        'Tailwind CSS Ready',
        'Self-Hosting Support'
      ],
      cta: 'Claim Ownership',
      popular: false,
      hasToggle: false
    }
  ];

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      
      <main className="pt-32 pb-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-black text-on-surface tracking-tight mb-6">Simple, Transparent Pricing</h1>
            <p className="text-xl text-on-surface-variant max-w-2xl mx-auto font-medium mb-12">
              Choose the plan that fits your business goals. No hidden fees, just high-quality custom-built websites.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, idx) => (
              <div 
                key={idx} 
                className={`relative p-8 md:p-10 rounded-[2.5rem] border flex flex-col transition-all duration-500 hover:shadow-2xl bg-surface-container-low border-outline-variant/30 ${plan.popular ? 'ring-2 ring-primary shadow-xl shadow-primary/5' : 'shadow-lg shadow-black/5'}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-10 px-4 py-1.5 bg-primary text-white rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-primary/20">
                    <Sparkles className="w-3 h-3" /> Most Popular
                  </div>
                )}
                
                <div className="mb-8">
                  <h3 className="text-2xl font-black mb-2 text-on-surface">{plan.name}</h3>
                  <p className="text-sm font-medium text-on-surface-variant leading-relaxed">{plan.desc}</p>
                </div>
                
                <div className="flex flex-col gap-1 mb-8 p-6 rounded-3xl bg-surface/50 border border-outline-variant/10">
                  <div className="flex items-baseline gap-1">
                    <span className="text-6xl font-black text-on-surface tracking-tight">{plan.hasToggle ? (isAnnual ? plan.annualPrice : plan.monthlyPrice) : plan.monthlyPrice}</span>
                    <span className="text-sm font-black uppercase tracking-widest text-on-surface-variant">{plan.period}</span>
                  </div>
                  {plan.hasToggle && (
                    <div className="mt-4 pt-4 border-t border-outline-variant/10">
                      <PricingToggle isAnnual={isAnnual} onChange={setIsAnnual} isPopular={false} />
                    </div>
                  )}
                </div>

                <div className="space-y-4 mb-10 flex-grow">
                  {plan.features.map((feature, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-3">
                      <div className={`mt-1 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${plan.popular ? 'bg-primary/10' : 'bg-surface-container-high'}`}>
                        <Check className={`w-3 h-3 ${plan.popular ? 'text-primary' : 'text-on-surface-variant'}`} strokeWidth={4} />
                      </div>
                      <span className="text-sm font-bold text-on-surface">{feature}</span>
                    </div>
                  ))}
                </div>

                <Link 
                  to="/signup" 
                  state={{ planId: plan.id, planType: plan.type, billing: plan.hasToggle ? (isAnnual ? 'annual' : 'monthly') : 'one_time' }}
                  className={`py-4 md:py-5 rounded-2xl font-black text-center transition-all flex items-center justify-center gap-2 text-lg ${plan.popular ? 'bg-primary text-white hover:brightness-110 shadow-lg shadow-primary/20 active:scale-95' : 'bg-on-surface text-surface hover:bg-on-surface-variant active:scale-95'}`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>

          {/* Update Packs Section - Only for logged in users */}
          {token && (
            <>
              <div className="mt-32">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-xs font-black uppercase tracking-widest mb-6">
                        <Package className="w-4 h-4" /> Power Up Your Presence
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-on-surface tracking-tight mb-4">Update Packs</h2>
                    <p className="text-on-surface-variant font-medium max-w-xl mx-auto">
                        Need more than 5 updates? Grab a pack that never expires. Use them whenever you need a change.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                    {packs.map((pack) => (
                        <div key={pack.id} className="bg-surface-container-low p-8 rounded-[2.5rem] border border-outline-variant hover:border-primary transition-all group flex flex-col">
                            <div className="text-2xl font-black mb-1">{pack.name}</div>
                            <div className="text-sm font-medium text-on-surface-variant mb-6">{pack.desc}</div>
                            <div className="mt-auto">
                                <div className="text-4xl font-black text-on-surface mb-6">{pack.price}</div>
                                <button 
                                    onClick={() => handlePurchasePack(pack.id)}
                                    disabled={!!loadingPack}
                                    className="w-full py-4 bg-on-surface text-surface rounded-2xl font-black hover:bg-primary hover:text-white transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {loadingPack === pack.id ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : 'Buy Pack'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
              </div>

              {/* Priority Updates Section */}
              <div className="mt-12 max-w-6xl mx-auto">
                <div className="bg-surface-container-high text-on-surface p-8 md:p-12 rounded-[3rem] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group border border-outline-variant/10">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
                    
                    <div className="relative">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-xs font-black uppercase tracking-widest mb-6">
                            <Zap className="w-4 h-4 text-yellow-500 fill-yellow-500" /> Fast Track Everything
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-2">Priority Updates</h2>
                        <p className="text-on-surface-variant font-medium">Skip the queue and get your changes processed in 24-48 hours.</p>
                    </div>

                    <div className="flex flex-col items-center md:items-end gap-4 relative">
                        <div className="flex items-baseline gap-1">
                            <span className="text-5xl font-black">£19</span>
                            <span className="text-sm font-bold uppercase opacity-60">/month</span>
                        </div>
                        <button 
                            onClick={() => handlePurchasePack('priority_monthly')}
                            disabled={!!loadingPack}
                            className="px-8 py-4 bg-primary text-white rounded-2xl font-black hover:scale-105 transition-all shadow-xl active:scale-95 disabled:opacity-50 min-w-[200px] flex items-center justify-center gap-2"
                        >
                            {loadingPack === 'priority_monthly' ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : 'Upgrade to Priority'}
                        </button>
                    </div>
                </div>
              </div>
            </>
          )}

          <div className="mt-20 text-center bg-surface-container-low p-12 rounded-[3rem] border border-outline-variant border-dashed max-w-5xl mx-auto">
            <h3 className="text-3xl font-black text-on-surface mb-4">Need a custom enterprise solution?</h3>
            <p className="text-on-surface-variant font-medium mb-8">We offer bulk discounts for agencies and multiple brand management.</p>
            <Link to="/contact" className="inline-flex items-center gap-2 text-primary font-black uppercase tracking-widest hover:brightness-110 transition-all">
              Contact Sales
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PricingPage;
