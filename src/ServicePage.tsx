import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Shield, ArrowRight, CheckCircle2, ExternalLink, RefreshCw, Loader2, Monitor, Smartphone } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';

const SERVICE_DATA: { [key: string]: any } = {
  plumbing: {
    title: 'Professional Plumbing Websites',
    desc: 'Custom-built websites for plumbing businesses. From emergency leak fixes to full bathroom installations, we help you win more jobs.',
    features: ['Emergency Service Focus', 'Quote Request Integration', 'Service Area Mapping', 'Customer Testimonials'],
    demos: [
      { id: 1, name: 'EcoFlow Plumbing', url: 'https://example.com/demo1', type: 'Premium' },
      { id: 2, name: 'Rapid Response Plumbers', url: 'https://example.com/demo2', type: 'Emergency Focus' },
      { id: 3, name: 'MasterCraft Bathrooms', url: 'https://example.com/demo3', type: 'Installation Focus' }
    ]
  },
  roofing: {
    title: 'High-Conversion Roofing Websites',
    desc: 'Showcase your craftsmanship with a premium roofing website. Optimized for mobile so customers can find you from their roof.',
    features: ['Project Galleries', 'Material Selection Guides', 'Drone Photo Support', 'Free Inspection CTA'],
    demos: [
      { id: 1, name: 'Peak Protection Roofing', url: 'https://example.com/demo4', type: 'Residential' },
      { id: 2, name: 'SkyLine Commercial Roofs', url: 'https://example.com/demo5', type: 'Industrial' },
      { id: 3, name: 'Heritage Tile Experts', url: 'https://example.com/demo6', type: 'Specialist' }
    ]
  },
  electrical: {
    title: 'Certified Electrician Websites',
    desc: 'Build trust with a professional online presence. Perfect for domestic, commercial, and industrial electrical contractors.',
    features: ['Accreditation Badges', 'Safety Checklist Downloads', 'Online Booking System', 'Service Specializations'],
    demos: [
      { id: 1, name: 'VoltSafe Electrical', url: 'https://example.com/demo7', type: 'Domestic' },
      { id: 2, name: 'GridPoint Industrial', url: 'https://example.com/demo8', type: 'Commercial' },
      { id: 3, name: 'BrightSpark Solutions', url: 'https://example.com/demo9', type: 'Smart Home' }
    ]
  },
  cleaning: {
    title: 'Sparkling Cleaning Service Websites',
    desc: 'Drive more bookings for your cleaning business. Sleek, clean designs that reflect the quality of your work.',
    features: ['Recurring Booking Tools', 'Price Calculators', 'Checklist Displays', 'Team Bio Sections'],
    demos: [
      { id: 1, name: 'Crystal Clear Homes', url: 'https://example.com/demo10', type: 'Residential' },
      { id: 2, name: 'Elite Office Care', url: 'https://example.com/demo11', type: 'Commercial' },
      { id: 3, name: 'EcoPure Cleaning', url: 'https://example.com/demo12', type: 'Eco-Friendly' }
    ]
  },
  removals: {
    title: 'Swift Removal Company Websites',
    desc: 'Moving made easy with a website that handles the heavy lifting. Integrated quote forms and inventory management.',
    features: ['Volume Calculators', 'Packing Service Upsells', 'Insurance Documentation', 'Live Tracking Links'],
    demos: [
      { id: 1, name: 'SafePassage Removals', url: 'https://example.com/demo13', type: 'Long Distance' },
      { id: 2, name: 'MetroMover Express', url: 'https://example.com/demo14', type: 'Local Move' },
      { id: 3, name: 'Business Bridge Relocations', url: 'https://example.com/demo15', type: 'Corporate' }
    ]
  },
  locksmiths: {
    title: '24/7 Locksmith Website Design',
    desc: 'Be the first one they call in an emergency. Ultra-fast loading websites designed for immediate conversion.',
    features: ['Click-to-Call Dominance', 'Mobile-First Layout', 'Trustpilot Integration', 'Clear Pricing Tables'],
    demos: [
      { id: 1, name: 'Guardian Lock & Key', url: 'https://example.com/demo16', type: 'Emergency' },
      { id: 2, name: 'Security Solutions UK', url: 'https://example.com/demo17', type: 'Commercial' },
      { id: 3, name: 'Digital Doorway Experts', url: 'https://example.com/demo18', type: 'Smart Locks' }
    ]
  }
};

const LivePreview: React.FC<{ url: string; name: string; type: string }> = ({ url, name, type }) => {
  const [isLoading, setIsLoading] = useState(true);
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
    <div ref={containerRef} className="group bg-surface-container-low rounded-[2.5rem] border border-outline-variant overflow-hidden hover:border-primary/40 transition-all shadow-sm hover:shadow-xl flex flex-col h-full">
      <div className="aspect-[4/3] overflow-hidden relative bg-surface-container-highest border-b border-outline-variant">
        {isInView ? (
          <>
            <div className={`w-full h-full transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
              <div className="w-[400%] h-[400%] origin-top-left scale-[0.25] pointer-events-none">
                <iframe
                  src={url}
                  title={name}
                  className="w-full h-full border-none"
                  onLoad={() => setIsLoading(false)}
                />
              </div>
            </div>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-surface-container-highest">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-surface-container-highest">
            <Loader2 className="w-8 h-8 text-primary/20 animate-spin" />
          </div>
        )}
        
        {/* Mock Browser Header */}
        <div className="absolute top-0 left-0 right-0 h-8 bg-surface-container-high border-b border-outline-variant flex items-center px-4 gap-2 z-10">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-400/50" />
          </div>
          <div className="flex-grow mx-4 bg-surface/50 rounded-md h-5 flex items-center px-3">
             <div className="w-full h-1 bg-on-surface-variant/10 rounded-full" />
          </div>
        </div>

        <div className="absolute top-12 right-4 px-3 py-1 bg-surface/90 backdrop-blur rounded-full text-[10px] font-black uppercase tracking-widest text-primary border border-outline-variant z-10 shadow-sm flex items-center gap-1.5">
          <RefreshCw size={10} className="animate-spin-slow" /> Live Preview
        </div>
        
        <div className="absolute top-12 left-4 px-3 py-1 bg-primary text-white rounded-full text-[10px] font-black uppercase tracking-widest z-10 shadow-md">
          {type}
        </div>
      </div>
      
      <div className="p-8 flex flex-col flex-grow">
        <h3 className="text-xl font-black text-on-surface mb-2">{name}</h3>
        <p className="text-xs font-medium text-on-surface-variant mb-6 uppercase tracking-widest">Optimized for Conversion</p>
        
        <div className="mt-auto flex items-center justify-between">
          <div className="flex gap-2">
             <div className="w-8 h-8 rounded-lg bg-surface-container-highest flex items-center justify-center text-on-surface-variant">
                <Monitor size={14} />
             </div>
             <div className="w-8 h-8 rounded-lg bg-surface-container-highest flex items-center justify-center text-on-surface-variant">
                <Smartphone size={14} />
             </div>
          </div>
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:brightness-110 transition-all shadow-md active:scale-95"
          >
            Open Demo <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </div>
  );
};

const ServicePage: React.FC = () => {
  const { niche } = useParams<{ niche: string }>();
  const data = niche ? SERVICE_DATA[niche.toLowerCase()] : null;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [niche]);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Service not found</h2>
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
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
                Industry Specific Solutions
              </div>
              <h1 className="text-5xl md:text-6xl font-black text-on-surface tracking-tight mb-6 leading-tight">
                Websites for <span className="text-primary italic">{niche ? niche.charAt(0).toUpperCase() + niche.slice(1) : ''}</span>
              </h1>
              <p className="text-xl text-on-surface-variant font-medium mb-10 leading-relaxed">
                {data.desc}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/signup" className="px-8 py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-all">
                   Start Your Build
                </Link>
                <Link to="/pricing" className="px-8 py-4 bg-surface-container-high text-on-surface font-black rounded-2xl border border-outline-variant hover:bg-surface-container-highest transition-all">
                   View Pricing
                </Link>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
               {data.features.map((feature: string, idx: number) => (
                 <div key={idx} className="p-6 bg-surface-container-low rounded-3xl border border-outline-variant hover:border-primary/30 transition-all group">
                   <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <CheckCircle2 size={20} />
                   </div>
                   <h3 className="font-bold text-on-surface text-sm">{feature}</h3>
                 </div>
               ))}
               <div className="col-span-2 p-8 bg-primary rounded-[2.5rem] text-white relative overflow-hidden mt-4">
                  <div className="relative z-10">
                    <h3 className="text-xl font-black mb-2">Built for Growth</h3>
                    <p className="text-white/80 text-sm font-medium">Every website we build includes SEO optimization as standard.</p>
                  </div>
                  <Shield size={120} className="absolute -right-8 -bottom-8 opacity-10" />
               </div>
            </div>
          </div>

          {/* Demos Section */}
          <div className="mb-32">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black text-on-surface mb-4">Live Demos</h2>
              <p className="text-on-surface-variant font-medium">Explore some of our high-performing {niche} website templates.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {data.demos.map((demo: any) => (
                <LivePreview key={demo.id} url={demo.url} name={demo.name} type={demo.type} />
              ))}
            </div>
          </div>

          <div className="text-center bg-surface-container-low py-20 px-8 rounded-[4rem] border border-outline-variant">
            <h2 className="text-4xl font-black text-on-surface mb-6">Ready to dominate the local market?</h2>
            <p className="text-on-surface-variant max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
              Our system understands the {niche} industry. We build websites that don't just look good, but actually rank on Google and convert local leads into loyal customers.
            </p>
            <Link to="/signup" className="inline-flex items-center gap-3 bg-on-surface text-surface px-10 py-5 rounded-2xl font-black uppercase tracking-widest hover:gap-6 transition-all">
              Launch My {niche} Site <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ServicePage;
