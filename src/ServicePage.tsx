import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Shield, ArrowRight, CheckCircle2, Monitor, Smartphone, Zap, Check } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';

const SERVICE_DATA: { [key: string]: any } = {
  plumbing: {
    niche: 'Plumbing',
    title: 'Website Design for Plumbers',
    desc: 'Modern, high-converting websites for plumbers — built to generate real leads, not just sit there looking pretty.',
    features: ['No upfront cost', 'Fully managed', 'Local SEO setup', 'Content written for you'],
    demos: [
      { id: 1, name: 'EcoFlow Plumbing', url: 'https://example.com/demo1', type: 'Premium' },
      { id: 2, name: 'Rapid Response Plumbers', url: 'https://example.com/demo2', type: 'Emergency Focus' },
      { id: 3, name: 'MasterCraft Bathrooms', url: 'https://example.com/demo3', type: 'Installation Focus' }
    ]
  },
  roofing: {
    niche: 'Roofing',
    title: 'Website Design for Roofers',
    desc: 'Modern, high-converting websites for roofers — built to generate real enquiries, not just sit there.',
    features: ['Emergency repair focus', 'Project galleries', 'Insurance visibility', 'Fully managed'],
    demos: [
      { id: 1, name: 'Peak Protection Roofing', url: 'https://example.com/demo4', type: 'Residential' },
      { id: 2, name: 'SkyLine Commercial Roofs', url: 'https://example.com/demo5', type: 'Industrial' },
      { id: 3, name: 'Heritage Tile Experts', url: 'https://example.com/demo6', type: 'Specialist' }
    ]
  },
  electrical: {
    niche: 'Electrical',
    title: 'Website Design for Electricians',
    desc: 'Modern, professionally managed websites for electricians — designed to win enquiries and showcase your credentials.',
    features: ['Credentials-first design', 'NICEIC/NAPIT visibility', 'Service-specific pages', 'Ongoing maintenance'],
    demos: [
      { id: 1, name: 'VoltSafe Electrical', url: 'https://example.com/demo7', type: 'Domestic' },
      { id: 2, name: 'GridPoint Industrial', url: 'https://example.com/demo8', type: 'Commercial' },
      { id: 3, name: 'BrightSpark Solutions', url: 'https://example.com/demo9', type: 'Smart Home' }
    ]
  },
  cleaning: {
    niche: 'Cleaning',
    title: 'Website Design for Cleaning Companies',
    desc: 'Professional cleaning company websites built to attract recurring clients and grow your business sustainably.',
    features: ['Recurring client focus', 'Domestic & Commercial', 'Frictionless enquiries', 'Trust-first layout'],
    demos: [
      { id: 1, name: 'Crystal Clear Homes', url: 'https://example.com/demo10', type: 'Residential' },
      { id: 2, name: 'Elite Office Care', url: 'https://example.com/demo11', type: 'Commercial' },
      { id: 3, name: 'EcoPure Cleaning', url: 'https://example.com/demo12', type: 'Eco-Friendly' }
    ]
  },
  removals: {
    niche: 'Removals',
    title: 'Website Design for Removal Companies',
    desc: 'Professional removal company websites that convert careful researchers into confirmed bookings.',
    features: ['Insurance & cover info', 'Streamlined quote forms', 'Review integration', 'Managed hosting'],
    demos: [
      { id: 1, name: 'SafePassage Removals', url: 'https://example.com/demo13', type: 'Long Distance' },
      { id: 2, name: 'MetroMover Express', url: 'https://example.com/demo14', type: 'Local Move' },
      { id: 3, name: 'Business Bridge Relocations', url: 'https://example.com/demo15', type: 'Corporate' }
    ]
  },
  locksmiths: {
    niche: 'Locksmith',
    title: 'Website Design for Locksmiths',
    desc: 'Fast, credible locksmith websites built to convert urgent searches into immediate phone calls.',
    features: ['Click-to-call dominance', 'Transparent pricing', 'Trust credentials', '24/7 signposting'],
    demos: [
      { id: 1, name: 'Guardian Lock & Key', url: 'https://example.com/demo16', type: 'Emergency' },
      { id: 2, name: 'Security Solutions UK', url: 'https://example.com/demo17', type: 'Commercial' },
      { id: 3, name: 'Digital Doorway Experts', url: 'https://example.com/demo18', type: 'Smart Locks' }
    ]
  }
};

const LivePreview: React.FC<{ url: string; name: string; type: string }> = ({ url, name, type }) => {
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="group bg-surface-container-low rounded-[2.5rem] border border-outline-variant overflow-hidden hover:border-primary/40 transition-all shadow-sm hover:shadow-2xl flex flex-col h-full">
      <div className="aspect-[4/3] overflow-hidden relative bg-surface-container-highest border-b border-outline-variant">
        {isInView ? (
          <div className="w-full h-full p-4">
             <div className="w-full h-full bg-surface rounded-xl border border-outline-variant/30 overflow-hidden relative group-hover:scale-[1.02] transition-transform duration-700">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
                <div className="absolute inset-0 flex items-center justify-center">
                   <Monitor className="w-12 h-12 text-primary/20" />
                </div>
             </div>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        )}
      </div>
      <div className="p-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h4 className="text-xl font-black text-on-surface mb-1">{name}</h4>
            <span className="text-xs font-black uppercase tracking-widest text-primary">{type}</span>
          </div>
          <Link to="/signup" className="p-3 bg-surface border border-outline-variant rounded-xl hover:border-primary/40 hover:text-primary transition-all">
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
};

const ServicePage = () => {
  const { niche } = useParams<{ niche: string }>();
  const data = SERVICE_DATA[niche || 'plumbing'] || SERVICE_DATA.plumbing;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [niche]);

  return (
    <div className="min-h-screen bg-surface transition-colors duration-300">
      <Navbar />
      
      <main className="pt-32 pb-32">
        <div className="max-w-7xl mx-auto px-8">
          {/* Hero Section */}
          <div className="flex flex-col lg:flex-row gap-16 items-center mb-32">
            <div className="lg:w-1/2">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-black uppercase tracking-widest mb-8">
                <Shield className="w-4 h-4" /> Trusted by {data.niche}s
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-on-surface tracking-tighter mb-8 leading-[0.95]">
                {data.title}
              </h1>
              <p className="text-xl text-on-surface-variant font-medium mb-12 leading-relaxed max-w-xl">
                {data.desc}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
                {data.features.map((feature: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary" strokeWidth={4} />
                    </div>
                    <span className="font-bold text-on-surface">{feature}</span>
                  </div>
                ))}
              </div>
              <Link to="/contact" className="inline-flex items-center gap-4 bg-primary text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest hover:gap-8 transition-all shadow-xl shadow-primary/20">
                Get My Free Preview <ArrowRight size={20} />
              </Link>
            </div>
            
            <div className="lg:w-1/2 relative">
               <div className="relative z-10 bg-surface-container-low rounded-[3rem] border border-outline-variant/30 p-4 shadow-3xl">
                  <div className="aspect-video bg-surface rounded-[2rem] border border-outline-variant/20 overflow-hidden relative">
                     <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
                     <div className="absolute bottom-8 left-8 right-8">
                        <div className="h-4 w-1/2 bg-on-surface/5 rounded-full mb-4" />
                        <div className="h-4 w-1/3 bg-on-surface/5 rounded-full" />
                     </div>
                  </div>
               </div>
               <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
               <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-secondary/10 rounded-full blur-3xl" />
            </div>
          </div>

          {/* Demos Section */}
          <div className="mb-32">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-on-surface tracking-tight mb-4">Example Designs</h2>
              <p className="text-on-surface-variant font-medium">Explore how we tailor designs for the {data.niche} industry.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {data.demos.map((demo: any) => (
                <LivePreview key={demo.id} {...demo} />
              ))}
            </div>
          </div>

          {/* Areas We Serve Section */}
          <div className="mb-32">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black text-on-surface mb-6">Areas We Serve</h2>
              <p className="text-on-surface-variant font-medium max-w-2xl mx-auto">
                We build professional {data.niche} websites for businesses across Luton and the surrounding area. Each location page is individually written with unique local content.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {['Luton', 'Bedford', 'Dunstable', 'Milton Keynes', 'St Albans', 'Watford'].map((city) => {
                const nicheToSlug: Record<string, string> = {
                  'Plumbing': 'plumber-web-design',
                  'Electrical': 'electrician-web-design',
                  'Roofing': 'roofer-web-design',
                  'Locksmith': 'locksmith-web-design',
                  'Cleaning': 'cleaning-company-web-design',
                  'Removals': 'removals-web-design'
                };
                const baseSlug = nicheToSlug[data.niche] || 'plumber-web-design';
                const citySlug = city.toLowerCase().replace(' ', '-');
                return (
                  <Link 
                    key={city}
                    to={`/${baseSlug}-${citySlug}`}
                    className="p-8 bg-surface-container-low rounded-[2rem] border border-outline-variant hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/5 transition-all font-black text-on-surface text-center"
                  >
                    {city}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Final CTA */}
          <div className="bg-surface-container-high rounded-[4rem] p-12 md:p-24 text-center border border-outline-variant/30 relative overflow-hidden shadow-2xl">
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-black text-on-surface mb-8 tracking-tighter">Ready to dominate your local area?</h2>
              <p className="text-on-surface-variant text-xl mb-12 max-w-xl mx-auto font-medium">
                Get a modern {data.niche} website that ranks, converts, and helps you grow.
              </p>
              <Link to="/signup" className="inline-flex items-center gap-4 bg-primary text-white px-12 py-6 rounded-2xl font-black uppercase tracking-widest hover:gap-8 transition-all shadow-xl shadow-primary/20">
                Launch My {data.niche} Site <ArrowRight size={20} />
              </Link>
            </div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ServicePage;
