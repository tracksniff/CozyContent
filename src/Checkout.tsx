import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { Check, ArrowLeft, Loader2 } from 'lucide-react';
import logo from './assets/PNG/Cosy Content Ltd -05.png';

import PricingToggle from './PricingToggle';

const Pricing: React.FC = () => {
  const location = useLocation();
  const { applicationId, email, first_name, last_name } = location.state || {};
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [isAnnual, setIsAnnual] = useState(true);

  if (!applicationId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No application found</h2>
          <Link to="/signup" className="text-primary font-bold hover:underline">Start an application</Link>
        </div>
      </div>
    );
  }

  const handleSelectPlan = async (planType: 'monthly' | 'one_time' | 'annual') => {
    setIsLoading(planType);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/create-checkout-session/`, {
        plan_type: planType,
        application_id: applicationId,
        email: email,
        first_name: first_name,
        last_name: last_name
      });
      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (err) {
      console.error('Error creating checkout session:', err);
      alert('Failed to start checkout. Please try again.');
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-surface transition-colors duration-300 p-6 md:p-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col items-center mb-16">
          <img src={logo} alt="Cosy Content Logo" className="w-16 h-16 object-contain mb-6" />
          <h1 className="text-4xl md:text-5xl font-black text-center tracking-tight mb-4">Choose Your Plan</h1>
          <p className="text-on-surface-variant text-center max-w-lg font-medium mb-12">
            Almost there! Select the plan that works best for your business to launch your new website.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Monthly Plan */}
          <div className="relative group h-full">
            <div className="absolute inset-0 bg-surface-container-low rounded-[2.5rem] border-2 border-primary shadow-xl shadow-primary/5 transition-all duration-500 group-hover:scale-[1.01]"></div>
            
            <div className="absolute -top-4 left-10 bg-primary text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 z-10 border border-white/20 flex items-center gap-2">
              <Check className="w-3 h-3" strokeWidth={4} /> Recommended
            </div>

            <div className="relative p-10 flex flex-col h-full">
              <div className="mb-8">
                <h3 className="text-2xl font-black mb-3">Monthly Subscription</h3>
                <p className="text-on-surface-variant font-medium text-sm leading-relaxed">
                  {isAnnual ? '£47' : '£59'}/month for hosting, SSL, security and performance optimizations.
                </p>
              </div>

              <div className="flex flex-col gap-1 mb-8 p-6 rounded-3xl bg-surface/50 border border-outline-variant/10">
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl font-black text-on-surface">{isAnnual ? '£47' : '£59'}</span>
                  <span className="text-on-surface-variant font-bold text-sm uppercase tracking-widest">/month</span>
                </div>
                <div className="mt-4 pt-4 border-t border-outline-variant/10">
                  <PricingToggle isAnnual={isAnnual} onChange={setIsAnnual} isPopular={false} />
                </div>
              </div>

              <div className="space-y-4 mb-10 flex-grow">
                {[
                  'Hosting',
                  'SSL',
                  'Security',
                  'Performance optimization',
                  'Upto 5 small updates per month (eg text changes, image swaps, contact info updates)'
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                      <Check className="w-3 h-3 text-primary" strokeWidth={4} />
                    </div>
                    <span className="text-on-surface font-bold text-sm">{item}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => handleSelectPlan(isAnnual ? 'annual' : 'monthly')}
                disabled={isLoading !== null}
                className="w-full py-4 rounded-xl bg-primary text-white font-black shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all text-base flex items-center justify-center gap-2 active:scale-95"
              >
                {(isLoading === 'monthly' || isLoading === 'annual') ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Subscribe Now'}
              </button>
            </div>
          </div>

          {/* One-Time Payment */}
          <div className="relative group h-full">
            <div className="absolute inset-0 bg-surface-container-low rounded-[2.5rem] border border-outline-variant/30 shadow-lg transition-all duration-500 group-hover:shadow-xl group-hover:scale-[1.01]"></div>
            
            <div className="relative p-10 flex flex-col h-full">
              <div className="mb-8">
                <h3 className="text-2xl font-black mb-3">One-Time Payment</h3>
                <p className="text-on-surface-variant font-medium text-sm leading-relaxed">
                  £349 for your fully built website. Delivered ready to use.
                </p>
              </div>

              <div className="flex items-baseline gap-2 mb-8 p-6 rounded-3xl bg-surface/50 border border-outline-variant/10">
                <span className="text-6xl font-black text-on-surface">£349</span>
                <span className="text-on-surface-variant font-bold text-sm uppercase tracking-widest">Fixed</span>
              </div>

              <div className="space-y-4 mb-10 flex-grow">
                {[
                  'Fully built website',
                  'No ongoing commitment',
                  'Full source files available',
                  'Handover within 7 days',
                  'Ready to use'
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-surface-container-high flex items-center justify-center">
                      <Check className="w-3 h-3 text-on-surface-variant" strokeWidth={4} />
                    </div>
                    <span className="text-on-surface font-bold text-sm">{item}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => handleSelectPlan('one_time')}
                disabled={isLoading !== null}
                className="w-full py-4 rounded-xl bg-on-surface text-surface font-black hover:bg-on-surface-variant transition-all text-base flex items-center justify-center gap-2 active:scale-95"
              >
                {isLoading === 'one_time' ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Claim Ownership'}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
           <Link to="/signup" className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-bold text-sm">
             <ArrowLeft size={16} /> Back to Application
           </Link>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
