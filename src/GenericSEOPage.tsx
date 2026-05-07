import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Shield, Rocket, Target, Globe } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import { seoPagesData } from './seoPagesData';

const GenericSEOPage: React.FC = () => {
  const location = useLocation();
  const path = location.pathname.substring(1); // remove leading slash
  const data = seoPagesData[path];

  useEffect(() => {
    if (data) {
      document.title = data.metaTitle;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', data.metaDescription);
      } else {
        const meta = document.createElement('meta');
        meta.name = 'description';
        meta.content = data.metaDescription;
        document.getElementsByTagName('head')[0].appendChild(meta);
      }
    }
    window.scrollTo(0, 0);
  }, [data]);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Page not found</h2>
          <Link to="/" className="text-primary font-bold hover:underline">Return Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-24">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
              {data.location ? `Local SEO Experts in ${data.location}` : 'Industry Specific Solutions'}
            </div>

            {/* City Switcher */}
            {!data.location && (
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mb-8 text-[11px] font-black uppercase tracking-widest text-on-surface-variant/60">
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
                  const isActive = data.location === city;

                  return (
                    <React.Fragment key={city}>
                      <Link 
                        to={`/${targetUrl}`}
                        className={`transition-colors hover:text-primary ${isActive ? 'text-primary' : ''}`}
                      >
                        {city}
                      </Link>
                      {city !== 'Watford' && <span>•</span>}
                    </React.Fragment>
                  );
                })}
              </div>
            )}

            <h1 className="text-5xl md:text-7xl font-black text-on-surface tracking-tight mb-8 leading-tight max-w-5xl mx-auto">
              {data.heroTitle ? (
                data.heroTitle.split(' ').map((word, i, arr) => (
                  <span key={i}>
                    {i === arr.length - 1 ? <span className="text-primary italic">{word}</span> : word}{' '}
                  </span>
                ))
              ) : (
                data.metaTitle.split('|')[0].trim().split(' ').map((word, i, arr) => (
                  <span key={i}>
                    {i === arr.length - 1 ? <span className="text-primary italic">{word}</span> : word}{' '}
                  </span>
                ))
              )}
            </h1>
            <p className="text-xl text-on-surface-variant max-w-3xl mx-auto font-medium leading-relaxed mb-12">
              {data.heroSubtitle || data.metaDescription}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/signup" className="px-10 py-5 bg-primary text-white font-black rounded-2xl shadow-2xl shadow-primary/30 hover:scale-105 transition-all uppercase tracking-widest text-sm">
                 Get Your Free Quote
              </Link>
              <Link to="/contact" className="px-10 py-5 bg-surface-container-high text-on-surface font-black rounded-2xl border border-outline-variant hover:bg-surface-container-highest transition-all uppercase tracking-widest text-sm">
                 Contact Us
              </Link>
            </div>
          </div>

          {/* Value Propositions */}
          <div className="grid md:grid-cols-3 gap-8 mb-24">
             <div className="p-10 bg-surface-container-low rounded-[3rem] border border-outline-variant shadow-sm hover:shadow-xl transition-all group">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                   <Target size={28} />
                </div>
                <h3 className="text-2xl font-black mb-4">Conversion Focused</h3>
                <p className="text-on-surface-variant font-medium leading-relaxed">
                   Our websites are built with one goal: turning visitors into leads. Every element is optimized for conversion.
                </p>
             </div>
             
             <div className="p-10 bg-surface-container-low rounded-[3rem] border border-outline-variant shadow-sm hover:shadow-xl transition-all group">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                   <Globe size={28} />
                </div>
                <h3 className="text-2xl font-black mb-4">Local SEO Ready</h3>
                <p className="text-on-surface-variant font-medium leading-relaxed">
                   We ensure your {data.industry} business stands out in {data.location || 'your local area'} with expert search optimization.
                </p>
             </div>

             <div className="p-10 bg-surface-container-low rounded-[3rem] border border-outline-variant shadow-sm hover:shadow-xl transition-all group">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                   <Rocket size={28} />
                </div>
                <h3 className="text-2xl font-black mb-4">Fast Delivery</h3>
                <p className="text-on-surface-variant font-medium leading-relaxed">
                   Get your new, professional website live in just 7 days. No long waits, just fast results for your business.
                </p>
             </div>
          </div>

          {/* Features Checklist (Hero Bottom) */}
          {data.checklist && (
            <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 mb-24 py-8 border-y border-outline-variant/10">
              {data.checklist.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="text-primary" size={20} />
                  <span className="font-black text-on-surface uppercase tracking-widest text-xs">{item}</span>
                </div>
              ))}
            </div>
          )}

          {/* Main Content Sections */}
          <div className="space-y-24 mb-24">
            {data.sections ? (
              data.sections.map((section, idx) => (
                <div key={idx} className={`flex flex-col ${idx % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-16`}>
                  <div className="lg:w-1/2">
                    <h2 className="text-4xl font-black text-on-surface mb-6 leading-tight">
                      {section.title}
                    </h2>
                    {section.description && (
                      <p className="text-on-surface-variant font-medium leading-relaxed mb-8">
                        {section.description}
                      </p>
                    )}
                    {section.points && (
                      <div className="space-y-4">
                        {section.points.map((point, pIdx) => (
                          <div key={pIdx} className="flex items-start gap-4">
                            <div className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                              <CheckCircle2 size={14} />
                            </div>
                            <span className="font-bold text-on-surface leading-tight">{point}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="lg:w-1/2 w-full">
                     <div className="aspect-video bg-surface-container-low rounded-[3rem] border border-outline-variant shadow-inner flex items-center justify-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        <Shield size={64} className="text-primary/10" />
                     </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-surface-container-low p-12 md:p-20 rounded-[4rem] border border-outline-variant">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                  <div>
                    <h2 className="text-4xl font-black text-on-surface mb-8 leading-tight">
                      Why choose Cosy Content for your {data.industry} website?
                    </h2>
                    <div className="space-y-6">
                      {[
                        'Bespoke designs tailored to your brand',
                        'Mobile-first, responsive layouts',
                        'Integrated contact and quote forms',
                        'High-speed performance optimization',
                        'Fully managed hosting and updates',
                        'Expert local SEO setup included'
                      ].map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-4">
                          <div className="w-6 h-6 bg-primary/20 text-primary rounded-full flex items-center justify-center flex-shrink-0">
                            <CheckCircle2 size={14} />
                          </div>
                          <span className="font-bold text-on-surface">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-12">
                      <Link to="/signup" className="inline-flex items-center gap-3 text-primary font-black uppercase tracking-widest hover:gap-5 transition-all">
                        Start your journey <ArrowRight size={20} />
                      </Link>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="aspect-square bg-primary/5 rounded-[3rem] border-2 border-dashed border-primary/20 flex items-center justify-center p-12">
                       <div className="text-center">
                          <Shield size={80} className="text-primary/20 mx-auto mb-6" />
                          <p className="text-on-surface-variant font-bold italic">
                             Detailed content for {data.keyword} is currently being prepared and will be available soon.
                          </p>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Pricing Summary (Optional) */}
          <div className="mb-24 bg-surface-container-low p-12 md:p-16 rounded-[4rem] border border-outline-variant text-center">
             <h2 className="text-3xl font-black mb-12">Simple, Local Pricing</h2>
             <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
                <div className="p-8 bg-surface rounded-[2.5rem] border border-outline-variant shadow-sm">
                   <h3 className="text-xl font-black mb-2">Monthly Concierge</h3>
                   <div className="text-4xl font-black mb-4">£59<span className="text-sm font-medium text-on-surface-variant">/mo</span></div>
                   <p className="text-sm font-medium text-on-surface-variant mb-6">Fully managed hosting, maintenance and updates included.</p>
                   <Link to="/signup" className="w-full block text-center py-4 bg-primary text-white font-black rounded-xl">Choose Monthly</Link>
                </div>
                <div className="p-8 bg-surface rounded-[2.5rem] border border-outline-variant shadow-sm">
                   <h3 className="text-xl font-black mb-2">Lifetime Owner</h3>
                   <div className="text-4xl font-black mb-4">£349<span className="text-sm font-medium text-on-surface-variant"> Fixed</span></div>
                   <p className="text-sm font-medium text-on-surface-variant mb-6">One-time payment for full ownership and source code handover.</p>
                   <Link to="/signup" className="w-full block text-center py-4 bg-on-surface text-surface font-black rounded-xl">Choose One-Time</Link>
                </div>
             </div>
          </div>

          {/* Call to Action */}
          <div className="text-center py-20 bg-primary rounded-[4rem] text-white overflow-hidden relative">
            <div className="relative z-10 px-8">
              <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">Ready to transform your online presence?</h2>
              <p className="text-white/80 text-xl font-medium max-w-2xl mx-auto mb-12 leading-relaxed">
                Join hundreds of local service businesses that trust Cosy Content to handle their digital growth.
              </p>
              <Link to="/signup" className="inline-flex items-center gap-3 bg-white text-primary px-12 py-6 rounded-2xl font-black uppercase tracking-widest shadow-2xl hover:scale-105 transition-all">
                Build My New Website Now <ArrowRight size={20} />
              </Link>
            </div>
            {/* Abstract Background Shapes */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default GenericSEOPage;
