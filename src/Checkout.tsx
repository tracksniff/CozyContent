import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { Check, ArrowLeft, Loader2, ArrowRight } from 'lucide-react';
import logo from './assets/PNG/Cosy Content Ltd -05.png';

const Pricing: React.FC = () => {
  const location = useLocation();
  const { applicationId, email } = location.state || {};
  const [isLoading, setIsLoading] = useState<string | null>(null);

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

  const handleSelectPlan = async (planType: 'monthly' | 'one_time') => {
    setIsLoading(planType);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/create-checkout-session/`, {
        plan_type: planType,
        application_id: applicationId,
        email: email
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
          <p className="text-on-surface-variant text-center max-w-lg font-medium">
            Almost there! Select the plan that works best for your business to launch your new website.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Monthly Plan */}
          <div className="relative group h-full">
            <div className="absolute inset-0 bg-surface rounded-[2.5rem] border-2 border-primary shadow-xl transition-all duration-500 group-hover:scale-[1.01]"></div>
            <div className="relative p-10 flex flex-col h-full">
              <div className="absolute -top-4 right-8 bg-primary text-white px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                Recommended
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-bold mb-3">Monthly Subscription</h3>
                <p className="text-on-surface-variant font-medium text-sm leading-relaxed">
                  £59/month for hosting, maintenance, and unlimited updates. No setup fee.
                </p>
              </div>

              <div className="flex items-baseline gap-2 mb-8">
                <span className="text-5xl font-black text-on-surface">£59</span>
                <span className="text-on-surface-variant font-bold text-sm uppercase tracking-widest">/mo</span>
              </div>

              <div className="space-y-4 mb-10 flex-grow">
                {[
                  'Fully built website',
                  'Fast, secure hosting',
                  'Maintenance and backups',
                  'Unlimited content updates',
                  'Domain management'
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="mt-1 flex-shrink-0 w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-primary" strokeWidth={3} />
                    </div>
                    <span className="text-on-surface-variant font-bold text-xs">{item}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => handleSelectPlan('monthly')}
                disabled={isLoading !== null}
                className="w-full py-4 rounded-xl bg-primary text-white font-black shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all text-base flex items-center justify-center gap-2"
              >
                {isLoading === 'monthly' ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Subscribe Now'}
              </button>
            </div>
          </div>

          {/* One-Time Payment */}
          <div className="bg-surface-container-low p-10 rounded-[2.5rem] border border-outline-variant flex flex-col h-full shadow-lg">
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-3">One-Time Payment</h3>
              <p className="text-on-surface-variant font-medium text-sm leading-relaxed">
                £249 for your fully built website. Delivered ready to use.
              </p>
            </div>

            <div className="flex items-baseline gap-2 mb-8">
              <span className="text-5xl font-black text-on-surface">£249</span>
              <span className="text-on-surface-variant font-bold text-sm uppercase tracking-widest">Fixed</span>
            </div>

            <div className="space-y-4 mb-10 flex-grow">
              {[
                'Fully built website',
                'No ongoing commitment',
                'Full source files available',
                'Handover within 24 hours',
                'Ready to use'
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="mt-1 flex-shrink-0 w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-primary" strokeWidth={3} />
                  </div>
                  <span className="text-on-surface-variant font-bold text-xs">{item}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => handleSelectPlan('one_time')}
              disabled={isLoading !== null}
              className="w-full py-4 rounded-xl bg-surface border-2 border-primary text-primary font-black hover:bg-primary/5 transition-all text-base flex items-center justify-center gap-2"
            >
              {isLoading === 'one_time' ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Claim Ownership <ArrowRight className="w-4 h-4" /></>}
            </button>
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
