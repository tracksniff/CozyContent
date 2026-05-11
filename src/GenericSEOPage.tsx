import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Shield, Check } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import type { SEOPageInfo } from './seoPagesData';

interface GenericSEOPageProps {
  data: SEOPageInfo;
}

const GenericSEOPage: React.FC<GenericSEOPageProps> = ({ data }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="bg-surface min-h-screen text-on-surface transition-colors duration-300">
      <Navbar />

      <main className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-8">
          {/* Hero Section */}
          <div className="text-center max-w-4xl mx-auto mb-24">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-black uppercase tracking-widest mb-8">
              <Shield className="w-4 h-4" /> Professional {data.industry} Solutions
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-[0.95]">
              {data.heroTitle || data.keyword}
            </h1>
            <p className="text-xl text-on-surface-variant font-medium mb-12 leading-relaxed">
              {data.heroSubtitle || data.metaDescription}
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              {(data.checklist || ['Fast Delivery', 'Fully Managed', 'SEO Optimized']).map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 px-6 py-3 bg-surface-container-low rounded-2xl border border-outline-variant/30 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Dynamic Sections */}
          <div className="grid gap-16 mb-32">
            {data.sections?.map((section, idx) => (
              <div 
                key={idx} 
                className={`flex flex-col lg:flex-row gap-12 items-start p-12 md:p-16 rounded-[4rem] border border-outline-variant/30 bg-surface-container-low transition-all hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 group ${idx % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
              >
                <div className="lg:w-1/2">
                  <h2 className="text-4xl font-black mb-6 tracking-tight group-hover:text-primary transition-colors">{section.title}</h2>
                  <p className="text-lg text-on-surface-variant leading-relaxed font-medium mb-8">
                    {section.description}
                  </p>
                  {section.points && (
                    <div className="grid gap-4">
                      {section.points.map((point, pIdx) => (
                        <div key={pIdx} className="flex items-start gap-3">
                          <div className="mt-1.5 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3 text-primary" strokeWidth={4} />
                          </div>
                          <span className="text-on-surface font-bold text-base">{point}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="lg:w-1/2 w-full aspect-video rounded-[3rem] overflow-hidden relative">
                   <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />
                   <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-32 h-32 bg-white/10 rounded-full blur-3xl" />
                   </div>
                   <div className="absolute inset-0 border border-white/10 rounded-[3rem]" />
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Summary */}
          <div className="mb-32">
             <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-black mb-4">Simple, Local Pricing</h2>
                <p className="text-on-surface-variant font-medium">Choose the plan that fits your business goals.</p>
             </div>
             <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <div className="p-10 bg-surface-container-low rounded-[3rem] border border-outline-variant shadow-xl hover:border-primary/40 transition-all flex flex-col">
                   <h3 className="text-2xl font-black mb-2">Monthly Plan</h3>
                   <div className="text-5xl font-black mb-6">£59<span className="text-sm font-medium text-on-surface-variant">/mo</span></div>
                   <p className="text-base font-medium text-on-surface-variant mb-10 flex-grow">Fully managed hosting, security, performance and updates included.</p>
                   <Link to="/signup" className="w-full text-center py-5 bg-primary text-white font-black rounded-2xl hover:brightness-110 active:scale-95 transition-all">Get Started Monthly</Link>
                </div>
                <div className="p-10 bg-surface-container-low rounded-[3rem] border border-outline-variant shadow-xl hover:border-primary/40 transition-all flex flex-col">
                   <h3 className="text-2xl font-black mb-2">Own It Outright</h3>
                   <div className="text-5xl font-black mb-6">£349<span className="text-sm font-medium text-on-surface-variant"> Fixed</span></div>
                   <p className="text-base font-medium text-on-surface-variant mb-10 flex-grow">One-time payment for full ownership, source code handover and design files.</p>
                   <Link to="/signup" className="w-full text-center py-5 bg-on-surface text-surface font-black rounded-2xl hover:bg-on-surface-variant active:scale-95 transition-all">Claim Ownership</Link>
                </div>
             </div>
          </div>

          {/* Areas We Serve Section */}
          {!data.location && (
            <div className="mb-32">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-black text-on-surface mb-6">Areas We Serve</h2>
                <p className="text-on-surface-variant font-medium max-w-2xl mx-auto">
                  We build professional {data.industry} websites for businesses across Luton and the surrounding area. Each location page is individually written with unique local content.
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {['Luton', 'Bedford', 'Dunstable', 'Milton Keynes', 'St Albans', 'Watford'].map((city) => {
                  const industryToSlug: Record<string, string> = {
                    'Plumbing': 'plumber-web-design',
                    'Electrical': 'electrician-web-design',
                    'Roofing': 'roofer-web-design',
                    'Locksmith': 'locksmith-web-design',
                    'Cleaning': 'cleaning-company-web-design',
                    'Removals': 'removals-web-design'
                  };
                  const slug = industryToSlug[data.industry];
                  const citySlug = city.toLowerCase().replace(' ', '-');
                  const targetUrl = `${slug}-${citySlug}`;

                  return (
                    <Link 
                      key={city}
                      to={`/${targetUrl}`}
                      className="p-8 bg-surface-container-low rounded-[2rem] border border-outline-variant hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/5 transition-all font-black text-on-surface text-center"
                    >
                      {city}
                    </Link>
                  );
                })}
              </div>
              <p className="mt-12 text-on-surface-variant text-center text-sm font-medium italic">
                Each area page is individually written with unique local content — no duplicate pages — designed to rank specifically for searches in that town.
              </p>
            </div>
          )}

          {/* Final Call to Action */}
          <div className="text-center py-24 bg-surface-container-high rounded-[5rem] border border-outline-variant/30 text-on-surface overflow-hidden relative shadow-3xl group">
            <div className="relative z-10 px-8">
              <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter leading-none">Ready to transform your <br/>online presence?</h2>
              <p className="text-on-surface-variant text-xl font-medium max-w-2xl mx-auto mb-16 leading-relaxed">
                Start your {data.industry} business growth today with a high-converting, professional website.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                 <Link to="/contact" className="bg-primary text-white px-12 py-6 rounded-2xl font-black uppercase tracking-widest hover:gap-8 transition-all shadow-2xl flex items-center justify-center gap-4">
                    Get in touch <ArrowRight className="w-6 h-6" />
                 </Link>
              </div>
            </div>
            {/* Decoration */}
            <div className="absolute top-0 right-0 w-[30rem] h-[30rem] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors duration-1000" />
            <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-primary/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 group-hover:bg-primary/10 transition-colors duration-1000" />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default GenericSEOPage;
