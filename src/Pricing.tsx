import React, { useState } from 'react';
import { 
  Check, 
  Sparkles, 
  ArrowRight, 
  Minus, 
  Layout, 
  FileText, 
  Search, 
  Zap, 
  Smartphone, 
  ShieldCheck, 
  Code, 
  Globe,
  Star
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';
import PricingToggle from './PricingToggle';

const PricingPage: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(true);

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

  const coreFeatures = [
    { title: 'Professional Design', desc: 'A clean, modern layout built specifically for your trade — designed to look credible and professional.', icon: Layout },
    { title: 'Content Written for You', desc: 'We write every word — service pages, location content, FAQs, and more. No blank pages to fill in.', icon: FileText },
    { title: 'Local SEO Setup', desc: 'Proper site structure, XML sitemap, optimised page titles and metadata — all built in from day one.', icon: Search },
    { title: 'Schema Markup', desc: 'LocalBusiness, Service, and FAQ schema implemented across your site to improve Google search visibility.', icon: Code },
    { title: 'Mobile-Optimised', desc: 'Your site is designed to work perfectly on smartphones — where most local trade searches happen.', icon: Smartphone },
    { title: 'Fast Loading Speeds', desc: "Optimised performance to meet Google's Core Web Vitals — helping both search rankings and user experience.", icon: Zap },
    { title: 'SSL Certificate', desc: 'Secure HTTPS across your entire site — standard on every build, included at no extra cost.', icon: ShieldCheck },
    { title: 'AI Ready', desc: 'llms.txt implementation ensuring your business remains visible as AI search behavior evolves.', icon: Globe }
  ];

  const comparisonRows = [
    { f: 'Professional website design & build', m: true, o: true },
    { f: 'Content written by our team', m: true, o: true },
    { f: 'Local SEO setup', m: true, o: true },
    { f: 'Managed hosting included', m: true, o: false },
    { f: 'Security & maintenance', m: true, o: false },
    { f: 'Up to 5 updates per month', m: true, o: false },
    { f: 'Ongoing support', m: true, o: false },
    { f: 'Full site ownership', m: false, o: true },
    { f: 'No monthly fees', m: false, o: true },
    { f: 'Cancel anytime', m: true, o: 'n/a' }
  ];

  const faqs = [
    {
      q: "Is there a setup fee?",
      a: "No. There is no setup fee on either option. The monthly plan starts at £59 per month from the point your site goes live, and the one-off payment is a single fixed cost of £349 with nothing additional."
    },
    {
      q: "What does 'fully managed' mean on the monthly plan?",
      a: "It means we take care of everything after your site goes live — hosting, security updates, performance monitoring, and regular content updates. You don't need to log into anything or deal with any technical side of running the website."
    },
    {
      q: "What happens if I cancel the monthly plan?",
      a: "You can cancel at any time with no penalty. There is no minimum contract period. If you cancel, your website will remain live until the end of the period you've paid for, at which point it will be taken offline."
    },
    {
      q: "Can I upgrade from the one-off payment to the monthly plan later?",
      a: "Yes. If you've purchased the one-off option and later decide you'd like ongoing hosting, maintenance, and updates managed for you, you can switch to the monthly plan at any point."
    },
    {
      q: "Does the one-off payment include hosting?",
      a: "No. The £349 one-off payment covers the design, build, content, and SEO setup of your website. You would need to arrange your own hosting separately, which typically costs between £5 and £20 per month depending on the provider you choose."
    },
    {
      q: "How quickly will my website be live?",
      a: "Most websites are live within five to seven working days of us receiving your brief. You'll have the opportunity to review the site and request changes before it goes live."
    },
    {
      q: "Are updates really included — or are there limits?",
      a: "Monthly plan customers receive up to five updates per month as standard. Updates include text changes, image swaps, adding new services, updating contact details, and similar amendments. Larger structural changes may be quoted separately."
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

      <main className="pt-24 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-6xl font-black text-on-surface tracking-tighter mb-4">
              Simple, Honest <span className="text-primary italic">Pricing.</span>
            </h1>
            <p className="text-lg text-on-surface-variant max-w-xl mx-auto font-medium leading-relaxed">
              Choose the perfect plan for your trade business. No setup fees, no hidden costs.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-24">
            {plans.map((plan, idx) => (
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

                <Link 
                  to="/signup" 
                  state={{ planId: plan.id, planType: plan.type, billing: plan.hasToggle ? (isAnnual ? 'annual' : 'monthly') : 'one_time' }}
                  className={`group/btn py-4 rounded-xl font-black text-center transition-all flex items-center justify-center text-lg relative overflow-hidden ${
                    plan.popular 
                      ? 'bg-primary text-white hover:shadow-2xl hover:shadow-primary/30 active:scale-[0.98]' 
                      : 'bg-on-surface text-surface hover:bg-on-surface-variant active:scale-[0.98]'
                  }`}
                >
                  <span className="relative z-10 flex items-center transition-all">
                    {plan.cta}
                  </span>
                  <div className="absolute inset-0 bg-white/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="mb-24">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-black text-on-surface tracking-tight mb-4">Standard with Every Build</h2>
              <p className="text-on-surface-variant font-medium max-w-xl mx-auto text-lg">
                High-performance features baked into every single website we build.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {coreFeatures.map((item, idx) => (
                <motion.div 
                  key={idx} 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className="p-8 rounded-2xl bg-surface-container-low border border-outline-variant hover:border-primary/50 transition-all group hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/5"
                >
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                    <item.icon className="w-6 h-6" strokeWidth={2} />
                  </div>
                  <h4 className="font-black text-lg text-on-surface mb-2 leading-tight">{item.title}</h4>
                  <p className="text-sm text-on-surface-variant font-medium leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mb-24 max-w-6xl mx-auto px-4 sm:px-0">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-black text-on-surface tracking-tight mb-4">Compare Plans</h2>
              <p className="text-on-surface-variant font-medium text-lg">A detailed look at what you get with each option.</p>
            </div>
            <div className="overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-low shadow-3xl relative">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-high/90 border-b border-outline-variant sticky top-0 z-30 backdrop-blur-md">
                      <th className="p-4 md:p-8 text-sm md:text-lg font-black text-on-surface">Feature</th>
                      <th className="p-4 md:p-8 text-sm md:text-lg font-black text-on-surface text-center bg-primary/5 relative">
                        Monthly Plan
                        <div className="absolute top-0 left-0 right-0 h-1 bg-primary" />
                      </th>
                      <th className="p-4 md:p-8 text-sm md:text-lg font-black text-on-surface text-center">One-Off Payment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/20">
                    {comparisonRows.map((row, i) => (
                      <tr key={i} className="hover:bg-surface-container-high/50 transition-colors group">
                        <td className="p-4 md:p-8 font-bold text-on-surface group-hover:text-primary transition-colors text-xs md:text-base leading-snug">
                          {row.f}
                        </td>
                        <td className="p-4 md:p-8 text-center bg-primary/5 border-x border-primary/5">
                          {row.m === true ? (
                            <motion.div 
                              initial={{ scale: 0.8, opacity: 0 }}
                              whileInView={{ scale: 1, opacity: 1 }}
                              viewport={{ once: true }}
                              transition={{ delay: i * 0.05 }}
                              className="bg-primary text-white w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-primary/20"
                            >
                              <Check className="w-4 h-4 md:w-5 md:h-5" strokeWidth={4} />
                            </motion.div>
                          ) : (
                            <span className="text-on-surface-variant/40 font-black text-xs md:text-base">{row.m}</span>
                          )}
                        </td>
                        <td className="p-4 md:p-8 text-center">
                          {row.o === true ? (
                            <motion.div 
                              initial={{ scale: 0.8, opacity: 0 }}
                              whileInView={{ scale: 1, opacity: 1 }}
                              viewport={{ once: true }}
                              transition={{ delay: i * 0.05 + 0.1 }}
                              className="bg-on-surface text-surface w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center mx-auto opacity-80"
                            >
                              <Check className="w-4 h-4 md:w-5 md:h-5" strokeWidth={4} />
                            </motion.div>
                          ) : (
                            row.o === false ? (
                              <Minus className="w-5 h-5 text-on-surface-variant/20 mx-auto" />
                            ) : (
                              <span className="text-on-surface-variant font-black text-xs md:text-base">{row.o}</span>
                            )
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="mb-24 max-w-5xl mx-auto">
            <div className="flex items-center justify-center gap-4 mb-12">
              <div className="h-px bg-outline-variant flex-grow" />
              <h2 className="text-3xl md:text-5xl font-black text-on-surface tracking-tight px-4 md:px-8">Common Questions</h2>
              <div className="h-px bg-outline-variant flex-grow" />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {faqs.map((faq, idx) => (
                <motion.div 
                  key={idx} 
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="p-6 md:p-8 rounded-2xl bg-surface-container-low border border-outline-variant hover:border-primary/30 transition-all group shadow-xl shadow-black/5 hover:shadow-2xl"
                >
                  <div className="flex items-start gap-3 mb-4">
                    <div className="mt-1 w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 font-black text-xs">?</div>
                    <h3 className="text-xl font-black text-on-surface group-hover:text-primary transition-colors leading-tight">{faq.q}</h3>
                  </div>
                  <p className="text-sm text-on-surface-variant font-medium leading-relaxed pl-9">{faq.a}</p>
                </motion.div>
              ))}
            </div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-12 p-8 md:p-12 rounded-3xl bg-primary text-white text-center shadow-3xl relative overflow-hidden"
            >
              <div className="relative z-10">
                <Star className="w-10 h-10 mx-auto mb-6 opacity-50" />
                <h3 className="text-2xl font-black mb-4">Do you build websites for all trades?</h3>
                <p className="text-white/80 font-medium leading-relaxed max-w-3xl mx-auto text-lg">
                  Currently we build websites for plumbers, roofers, electricians, locksmiths, cleaning companies, and removal companies. We cover Luton, Bedford, Dunstable, Milton Keynes, St Albans, and Watford.
                </p>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center bg-on-surface dark:bg-surface-container-high p-8 md:p-16 rounded-3xl shadow-4xl relative overflow-hidden group"
          >
            <div className="relative z-10">
              <h2 className="text-4xl md:text-7xl font-black mb-8 tracking-tighter leading-none text-surface dark:text-on-surface">
                Ready to <span className="text-primary italic">Grow?</span>
              </h2>
              <p className="text-surface/70 dark:text-on-surface-variant font-medium max-w-xl mx-auto mb-12 text-xl leading-relaxed">
                Choose the option that suits your business, or get in touch to discuss your specific requirements.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-y-6 gap-x-12 max-w-4xl mx-auto text-left mb-16 px-4">
                {[
                  'Monthly plan from £47 — fully managed',
                  'One-off payment of £349 — own it outright',
                  'No setup fee on either option',
                  'Live within 7 working days'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
                      <Check className="w-5 h-5 text-white" strokeWidth={4} />
                    </div>
                    <span className="text-lg font-bold text-surface dark:text-on-surface">{item}</span>
                  </div>
                ))}
              </div>

              <Link to="/contact" className="inline-flex items-center gap-4 bg-primary text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest hover:gap-8 transition-all shadow-3xl shadow-primary/40 text-lg hover:scale-105 active:scale-95">
                Get started today <ArrowRight className="w-6 h-6" />
              </Link>
            </div>
            {/* Dark Mode Gradient Decor */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px] group-hover:bg-primary/30 transition-colors duration-1000" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-[100px] group-hover:bg-primary/30 transition-colors duration-1000" />
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PricingPage;
