import React from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const PricingPage: React.FC = () => {
  const plans = [
    {
      name: 'Monthly Growth',
      price: '£59',
      period: '/mo',
      desc: 'Perfect for established businesses needing ongoing support.',
      features: [
        'AI-Powered Custom Website',
        'Fast & Secure Hosting',
        'Unlimited Content Updates',
        'Priority Technical Support',
        'Monthly Performance Reports',
        'Daily Backups'
      ],
      cta: 'Get Started',
      popular: true
    },
    {
      name: 'One-Time Launch',
      price: '£249',
      period: ' Fixed',
      desc: 'Great for businesses who want full ownership from day one.',
      features: [
        'AI-Powered Custom Website',
        'Full Source Code Handover',
        '24-Hour Delivery',
        'Vite + React + TypeScript',
        'Tailwind CSS Ready',
        'Self-Hosting Support'
      ],
      cta: 'Claim Ownership',
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-black text-on-surface tracking-tight mb-6">Simple, Transparent Pricing</h1>
            <p className="text-xl text-on-surface-variant max-w-2xl mx-auto font-medium">
              Choose the plan that fits your business goals. No hidden fees, just high-quality AI-built websites.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, idx) => (
              <div 
                key={idx} 
                className={`p-10 rounded-[3rem] border flex flex-col transition-all duration-500 hover:scale-[1.02] ${plan.popular ? 'bg-primary text-white border-primary shadow-2xl shadow-primary/30' : 'bg-surface-container-low border-outline-variant shadow-lg'}`}
              >
                {plan.popular && (
                  <div className="mb-4 inline-block px-4 py-1 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest self-start">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-black mb-2">{plan.name}</h3>
                <p className={`text-sm mb-8 font-medium ${plan.popular ? 'text-white/80' : 'text-on-surface-variant'}`}>{plan.desc}</p>
                
                <div className="flex items-baseline gap-1 mb-10">
                  <span className="text-6xl font-black">{plan.price}</span>
                  <span className={`text-sm font-black uppercase tracking-widest ${plan.popular ? 'text-white/60' : 'text-on-surface-variant'}`}>{plan.period}</span>
                </div>

                <div className="space-y-4 mb-10 flex-grow">
                  {plan.features.map((feature, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${plan.popular ? 'bg-white/20' : 'bg-primary/10'}`}>
                        <Check className={`w-3 h-3 ${plan.popular ? 'text-white' : 'text-primary'}`} strokeWidth={4} />
                      </div>
                      <span className="text-sm font-bold">{feature}</span>
                    </div>
                  ))}
                </div>

                <Link 
                  to="/signup" 
                  className={`py-4 rounded-2xl font-black text-center transition-all flex items-center justify-center gap-2 ${plan.popular ? 'bg-white text-primary hover:brightness-110' : 'bg-primary text-white hover:shadow-lg hover:shadow-primary/20'}`}
                >
                  {plan.cta} <ArrowRight size={18} />
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-20 text-center bg-surface-container-low p-12 rounded-[4rem] border border-outline-variant border-dashed">
            <h3 className="text-3xl font-black text-on-surface mb-4">Need a custom enterprise solution?</h3>
            <p className="text-on-surface-variant font-medium mb-8">We offer bulk discounts for agencies and multiple brand management.</p>
            <Link to="/contact" className="inline-flex items-center gap-2 text-primary font-black uppercase tracking-widest hover:gap-4 transition-all">
              Contact Sales <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PricingPage;
