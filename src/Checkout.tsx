import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Check, 
  ArrowLeft, 
  Loader2, 
  Sparkles, 
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from './assets/PNG/Cosy Content Ltd -05.png';

import PricingToggle from './PricingToggle';
import Navbar from './Navbar';
import Footer from './Footer';

const Checkout: React.FC = () => {
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

  const plans = [
    {
      id: 'monthly_growth',
      type: 'monthly',
      name: 'Monthly Plan',
      monthlyPrice: '£59',
      annualPrice: '£47',
      period: ' /month',
      desc: 'Everything handled — build, hosting, updates, and support — for one low monthly cost.',
      features: [
        'Professional website design and build',
        'All content written by our team',
        'Local SEO setup from day one',
        'Hosting and security — fully managed',
        'Up to 5 updates per month',
        'Ongoing maintenance and support',
        'Cancel anytime — no minimum term'
      ],
      cta: 'Get Started',
      popular: true,
      hasToggle: true,
      color: 'primary'
    },
    {
      id: 'one_time_launch',
      type: 'one_time',
      name: 'One-Off Payment',
      monthlyPrice: '£349',
      annualPrice: '£349',
      period: ' Fixed',
      desc: 'Own your site outright and handle hosting and updates yourself.',
      features: [
        'Professional website design and build',
        'All content written by our team',
        'Local SEO setup from day one',
        'Full ownership of the finished site',
        'No monthly fees — ever',
        'Hosting not included',
        'No ongoing updates or support'
      ],
      cta: 'Claim Ownership',
      popular: false,
      hasToggle: false,
      color: 'on-surface'
    }
  ];

  return (
    <div className="min-h-screen bg-surface overflow-hidden transition-colors duration-300">
      <Navbar />
      
      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[120px]" />
      </div>

      <main className="pt-32 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="flex justify-center mb-6">
              <img src={logo} alt="Cosy Content Logo" className="w-16 h-16 object-contain" />
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-on-surface tracking-tighter mb-4">
              Choose Your <span className="text-primary italic">Plan.</span>
            </h1>
            <p className="text-lg text-on-surface-variant max-w-xl mx-auto font-medium leading-relaxed">
              Almost there! Select the plan that works best for your business to launch your new website.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-16">
            {plans.map((plan, idx) => {
              const currentLoading = (plan.type === 'monthly' && (isLoading === 'monthly' || isLoading === 'annual')) || 
                                     (plan.type === 'one_time' && isLoading === 'one_time');
              
              return (
                <motion.div 
                  key={idx} 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`relative p-6 md:p-10 rounded-3xl border flex flex-col transition-all duration-500 hover:shadow-4xl group ${
                    plan.popular 
                      ? 'bg-white dark:bg-surface-container-high border-primary/20 ring-4 ring-primary/5 shadow-2xl shadow-primary/10' 
                      : 'bg-surface-container-low border-outline-variant/30 shadow-xl shadow-black/5'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-primary text-white rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-primary/20 z-20">
                      <Sparkles className="w-3.5 h-3.5" /> Most Popular Choice
                    </div>
                  )}
                  
                  <div className="mb-8 text-center">
                    <h3 className="text-3xl font-black mb-3 text-on-surface">{plan.name}</h3>
                    <p className="text-sm font-medium text-on-surface-variant leading-relaxed mx-auto max-w-[240px]">{plan.desc}</p>
                  </div>
                  
                  <div className="flex flex-col items-center gap-1 mb-8 p-6 rounded-2xl bg-surface/50 border border-outline-variant/20 relative overflow-hidden">
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${plan.popular ? 'bg-primary/5' : 'bg-on-surface/5'}`} />
                    <div className="flex items-baseline gap-1 relative z-10">
                      <span className="text-xl font-black text-on-surface-variant mb-2 self-start">£</span>
                      <AnimatePresence mode="wait">
                        <motion.span 
                          key={isAnnual ? 'annual' : 'monthly'}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="text-6xl font-black text-on-surface tracking-tighter"
                        >
                          {plan.hasToggle 
                            ? (isAnnual ? plan.annualPrice.replace('£', '') : plan.monthlyPrice.replace('£', '')) 
                            : plan.monthlyPrice.replace('£', '')
                          }
                        </motion.span>
                      </AnimatePresence>
                      <span className="text-xs font-black uppercase tracking-widest text-on-surface-variant ml-2">{plan.period}</span>
                    </div>

                    {plan.hasToggle && (
                      <div className="mt-6 pt-6 border-t border-outline-variant/10 w-full flex justify-center relative z-10">
                        <PricingToggle isAnnual={isAnnual} onChange={setIsAnnual} />
                      </div>
                    )}
                  </div>

                  <div className="space-y-4 mb-10 flex-grow">
                    {plan.features.map((feature, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-3">
                        <div className={`mt-1 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                          plan.popular ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-surface-container-high text-on-surface-variant'
                        }`}>
                          <Check className="w-3 h-3" strokeWidth={4} />
                        </div>
                        <span className="text-sm font-bold text-on-surface leading-tight">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => handleSelectPlan(plan.type === 'monthly' ? (isAnnual ? 'annual' : 'monthly') : 'one_time')}
                    disabled={isLoading !== null}
                    className={`group/btn py-4 rounded-xl font-black text-center transition-all flex items-center justify-center text-lg relative overflow-hidden ${
                      plan.popular 
                        ? 'bg-primary text-white hover:shadow-2xl hover:shadow-primary/30 active:scale-[0.98]' 
                        : 'bg-on-surface text-surface hover:bg-on-surface-variant active:scale-[0.98]'
                    } disabled:opacity-70 disabled:cursor-not-allowed`}
                  >
                    <span className="relative z-10 flex items-center transition-all">
                      {currentLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        plan.cta
                      )}
                    </span>
                    <div className="absolute inset-0 bg-white/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                  </button>
                </motion.div>
              );
            })}
          </div>

          <div className="text-center">
             <Link to="/signup" className="inline-flex items-center text-on-surface-variant hover:text-primary transition-colors font-bold text-sm">
               Back to Application
             </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
