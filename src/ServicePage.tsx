import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Shield, Zap, Clock, ThumbsUp, ArrowRight, CheckCircle2 } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';

const SERVICE_DATA: { [key: string]: any } = {
  plumbing: {
    title: 'Professional Plumbing Websites',
    desc: 'Custom-built websites for plumbing businesses. From emergency leak fixes to full bathroom installations, we help you win more jobs.',
    features: ['Emergency Service Focus', 'Quote Request Integration', 'Service Area Mapping', 'Customer Testimonials']
  },
  roofing: {
    title: 'High-Conversion Roofing Websites',
    desc: 'Showcase your craftsmanship with a premium roofing website. Optimized for mobile so customers can find you from their roof.',
    features: ['Project Galleries', 'Material Selection Guides', 'Drone Photo Support', 'Free Inspection CTA']
  },
  electrical: {
    title: 'Certified Electrician Websites',
    desc: 'Build trust with a professional online presence. Perfect for domestic, commercial, and industrial electrical contractors.',
    features: ['Accreditation Badges', 'Safety Checklist Downloads', 'Online Booking System', 'Service Specializations']
  },
  cleaning: {
    title: 'Sparkling Cleaning Service Websites',
    desc: 'Drive more bookings for your cleaning business. Sleek, clean designs that reflect the quality of your work.',
    features: ['Recurring Booking Tools', 'Price Calculators', 'Checklist Displays', 'Team Bio Sections']
  },
  removals: {
    title: 'Swift Removal Company Websites',
    desc: 'Moving made easy with a website that handles the heavy lifting. Integrated quote forms and inventory management.',
    features: ['Volume Calculators', 'Packing Service Upsells', 'Insurance Documentation', 'Live Tracking Links']
  },
  locksmiths: {
    title: '24/7 Locksmith Website Design',
    desc: 'Be the first one they call in an emergency. Ultra-fast loading websites designed for immediate conversion.',
    features: ['Click-to-Call Dominance', 'Mobile-First Layout', 'Trustpilot Integration', 'Clear Pricing Tables']
  }
};

const ServicePage: React.FC = () => {
  const { niche } = useParams<{ niche: string }>();
  const data = niche ? SERVICE_DATA[niche.toLowerCase()] : null;

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
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
                Industry Specific Solutions
              </div>
              <h1 className="text-5xl md:text-6xl font-black text-on-surface tracking-tight mb-6 leading-tight">
                {data.title}
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

          <div className="text-center bg-surface-container-low py-20 px-8 rounded-[4rem] border border-outline-variant">
            <h2 className="text-4xl font-black text-on-surface mb-6">Ready to dominate the local market?</h2>
            <p className="text-on-surface-variant max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
              Our AI understands the {niche} industry. We build websites that don't just look good, but actually rank on Google and convert local leads into loyal customers.
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
