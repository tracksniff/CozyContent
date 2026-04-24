import React, { useState } from 'react';
import { Check, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import PricingToggle from './PricingToggle';

const PricingPage: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(true);

  const plans = [
    {
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
                  className={`py-4 md:py-5 rounded-2xl font-black text-center transition-all flex items-center justify-center gap-2 text-lg ${plan.popular ? 'bg-primary text-white hover:brightness-110 shadow-lg shadow-primary/20 active:scale-95' : 'bg-on-surface text-surface hover:bg-on-surface-variant active:scale-95'}`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>

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
