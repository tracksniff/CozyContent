import React, { useState } from 'react';
import { Check, Sparkles, ArrowRight, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';
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
      hasToggle: true
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
      hasToggle: false
    }
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
    <div className="min-h-screen bg-surface">
      <Navbar />
      
      <main className="pt-32 pb-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-black text-on-surface tracking-tighter mb-6">Website Pricing</h1>
            <p className="text-xl text-on-surface-variant max-w-2xl mx-auto font-medium leading-relaxed">
              Two straightforward options. No setup fees. No hidden costs. No surprises.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-32">
            {plans.map((plan, idx) => (
              <div 
                key={idx} 
                className={`relative p-10 md:p-12 rounded-[3rem] border flex flex-col transition-all duration-500 hover:shadow-2xl bg-surface-container-low border-outline-variant/30 ${plan.popular ? 'ring-2 ring-primary shadow-xl shadow-primary/5' : 'shadow-lg shadow-black/5'}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-10 px-4 py-1.5 bg-primary text-white rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-primary/20">
                    <Sparkles className="w-3 h-3" /> Recommended
                  </div>
                )}
                
                <div className="mb-8">
                  <h3 className="text-3xl font-black mb-3 text-on-surface">{plan.name}</h3>
                  <p className="text-sm font-medium text-on-surface-variant leading-relaxed max-w-[280px]">{plan.desc}</p>
                </div>
                
                <div className="flex flex-col gap-1 mb-8 p-8 rounded-[2rem] bg-surface/50 border border-outline-variant/10">
                  <div className="flex items-baseline gap-1">
                    <span className="text-7xl font-black text-on-surface tracking-tighter">{plan.hasToggle ? (isAnnual ? plan.annualPrice : plan.monthlyPrice) : plan.monthlyPrice}</span>
                    <span className="text-xs font-black uppercase tracking-widest text-on-surface-variant">{plan.period}</span>
                  </div>
                  {plan.hasToggle && (
                    <div className="mt-6 pt-6 border-t border-outline-variant/10">
                      <PricingToggle isAnnual={isAnnual} onChange={setIsAnnual} isPopular={false} />
                    </div>
                  )}
                </div>

                <div className="space-y-4 mb-12 flex-grow">
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
                  className={`py-5 rounded-2xl font-black text-center transition-all flex items-center justify-center gap-2 text-lg ${plan.popular ? 'bg-primary text-white hover:brightness-110 shadow-lg shadow-primary/20 active:scale-95' : 'bg-on-surface text-surface hover:bg-on-surface-variant active:scale-95'}`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>

          <div className="mb-32">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-on-surface tracking-tight mb-4">What Every Website Includes</h2>
              <p className="text-on-surface-variant font-medium max-w-2xl mx-auto">
                Regardless of which pricing option you choose, your website includes the following as standard.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: 'Professional Design', desc: 'A clean, modern layout built specifically for your trade — designed to look credible and professional.' },
                { title: 'Content Written for You', desc: 'We write every word — service pages, location content, FAQs, and more. No blank pages to fill in.' },
                { title: 'Local SEO Setup', desc: 'Proper site structure, XML sitemap, optimised page titles and metadata — all built in from day one.' },
                { title: 'Schema Markup', desc: 'LocalBusiness, Service, and FAQ schema implemented across your site to improve Google search visibility.' },
                { title: 'Mobile-Optimised', desc: 'Your site is designed to work perfectly on smartphones — where most local trade searches happen.' },
                { title: 'Fast Loading Speeds', desc: "Optimised performance to meet Google's Core Web Vitals — helping both search rankings and user experience." },
                { title: 'SSL Certificate', desc: 'Secure HTTPS across your entire site — standard on every build, included at no extra cost.' },
                { title: 'AI Ready', desc: 'llms.txt implementation ensuring your business remains visible as AI search behavior evolves.' }
              ].map((item, idx) => (
                <div key={idx} className="p-8 rounded-[2.5rem] bg-surface-container-low border border-outline-variant hover:border-primary/30 transition-all group">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Check className="w-6 h-6" strokeWidth={3} />
                  </div>
                  <h4 className="font-black text-lg text-on-surface mb-2 leading-tight">{item.title}</h4>
                  <p className="text-sm text-on-surface-variant font-medium leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-32 max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black text-on-surface tracking-tight mb-4">Plan Comparison</h2>
              <p className="text-on-surface-variant font-medium">A quick reference to see exactly what's included in each option.</p>
            </div>
            <div className="overflow-x-auto rounded-[3rem] border border-outline-variant bg-surface-container-low shadow-xl">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="border-b border-outline-variant">
                    <th className="p-10 text-lg font-black text-on-surface">Feature</th>
                    <th className="p-10 text-lg font-black text-on-surface text-center bg-primary/5">Monthly Plan</th>
                    <th className="p-10 text-lg font-black text-on-surface text-center">One-Off</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {[
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
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-surface-container-high transition-colors group">
                      <td className="p-8 font-bold text-on-surface group-hover:text-primary transition-colors">{row.f}</td>
                      <td className="p-8 text-center bg-primary/5">
                        {row.m === true ? <Check className="w-6 h-6 text-primary mx-auto" strokeWidth={4} /> : row.m}
                      </td>
                      <td className="p-8 text-center">
                        {row.o === true ? <Check className="w-6 h-6 text-primary mx-auto" strokeWidth={4} /> : (row.o === false ? <Minus className="w-5 h-5 text-on-surface-variant/30 mx-auto" /> : <span className="text-on-surface-variant font-bold">{row.o}</span>)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mb-32 max-w-4xl mx-auto">
            <h2 className="text-4xl font-black text-on-surface tracking-tight mb-12 text-center">Common Pricing Questions</h2>
            <div className="grid gap-6">
              {faqs.map((faq, idx) => (
                <div key={idx} className="p-10 rounded-[2.5rem] bg-surface-container-low border border-outline-variant hover:border-primary/20 transition-all group">
                  <h3 className="text-xl font-black text-on-surface mb-4 group-hover:text-primary transition-colors">{faq.q}</h3>
                  <p className="text-on-surface-variant font-medium leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
            <div className="mt-12 p-10 rounded-[3rem] bg-primary/5 border-2 border-dashed border-primary/20 text-center">
              <h3 className="text-xl font-black text-on-surface mb-4">Do you build websites for all trades?</h3>
              <p className="text-on-surface-variant font-medium leading-relaxed max-w-2xl mx-auto">
                Currently we build websites for plumbers, roofers, electricians, locksmiths, cleaning companies, and removal companies. We cover Luton, Bedford, Dunstable, Milton Keynes, St Albans, and Watford.
              </p>
            </div>
          </div>

          <div className="text-center bg-surface-container-high p-12 md:p-24 rounded-[4rem] border border-outline-variant/30 shadow-2xl relative overflow-hidden group">
            <div className="relative z-10">
              <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter leading-none text-on-surface">Ready to Get Started?</h2>
              <p className="text-on-surface-variant font-medium max-w-2xl mx-auto mb-16 text-xl leading-relaxed">
                Choose the option that suits your business, or get in touch to discuss your specific requirements. No obligation, no pressure.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-y-6 gap-x-12 max-w-3xl mx-auto text-left mb-16 px-4">
                {[
                  'Monthly plan from £59 — fully managed',
                  'One-off payment of £349 — own it outright',
                  'No setup fee on either option',
                  'Live within days of your brief'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Check className="w-4 h-4 text-primary" strokeWidth={4} />
                    </div>
                    <span className="text-lg font-bold text-on-surface">{item}</span>
                  </div>
                ))}
              </div>

              <Link to="/contact" className="inline-flex items-center gap-4 bg-primary text-white px-12 py-6 rounded-2xl font-black uppercase tracking-widest hover:gap-8 transition-all shadow-xl shadow-primary/20">
                Get in touch <ArrowRight className="w-6 h-6" />
              </Link>
            </div>
            {/* Abstract Background Decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-primary/10 transition-colors duration-1000" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl group-hover:bg-primary/10 transition-colors duration-1000" />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PricingPage;
