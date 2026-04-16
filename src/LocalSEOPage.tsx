import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Search, Globe, Rocket, ArrowRight, Star } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';

const LocalSEOPage: React.FC = () => {
  const { niche, city } = useParams<{ niche: string; city: string }>();

  // Capitalize for display
  const nicheTitle = niche ? niche.charAt(0).toUpperCase() + niche.slice(1) : '';
  const cityTitle = city ? city.charAt(0).toUpperCase() + city.slice(1) : '';

  if (!niche || !city) return null;

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
              <MapPin size={12} /> Local Service Experts in {cityTitle}
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-on-surface tracking-tight mb-8">
               Dominate {nicheTitle} in <span className="text-primary">{cityTitle}</span>
            </h1>
            <p className="text-xl text-on-surface-variant max-w-3xl mx-auto font-medium leading-relaxed mb-12">
               Looking for the best {nicheTitle} website in {cityTitle}? We specialize in building AI-driven, SEO-optimized websites for local service businesses. Win the local search game and get more customers in {cityTitle}.
            </p>
            <Link to="/signup" className="inline-flex items-center gap-3 bg-primary text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest shadow-2xl shadow-primary/30 hover:scale-105 transition-all">
               Build My {cityTitle} Business <ArrowRight size={20} />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-24">
             <div className="p-8 bg-surface-container-low rounded-[3rem] border border-outline-variant shadow-sm hover:shadow-xl transition-all">
                <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
                   <Search size={24} />
                </div>
                <h3 className="text-xl font-black mb-4">Local SEO Optimized</h3>
                <p className="text-on-surface-variant text-sm font-medium leading-relaxed">
                   We target local keywords specific to {cityTitle} to ensure your {nicheTitle} business appears at the top of Google Maps and local search results.
                </p>
             </div>
             
             <div className="p-8 bg-surface-container-low rounded-[3rem] border border-outline-variant shadow-sm hover:shadow-xl transition-all">
                <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
                   <Globe size={24} />
                </div>
                <h3 className="text-xl font-black mb-4">Industry Precision</h3>
                <p className="text-on-surface-variant text-sm font-medium leading-relaxed">
                   Our AI is trained on thousands of successful {nicheTitle} websites, ensuring your brand speaks the language of your customers.
                </p>
             </div>

             <div className="p-8 bg-surface-container-low rounded-[3rem] border border-outline-variant shadow-sm hover:shadow-xl transition-all">
                <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
                   <Rocket size={24} />
                </div>
                <h3 className="text-xl font-black mb-4">Fastest Delivery</h3>
                <p className="text-on-surface-variant text-sm font-medium leading-relaxed">
                   Get your professional website for your {cityTitle} business live in under 24 hours. No more waiting weeks for developers.
                </p>
             </div>
          </div>

          <div className="bg-surface-container-low p-12 md:p-20 rounded-[4rem] border border-outline-variant flex flex-col lg:flex-row items-center gap-12">
             <div className="lg:w-1/2">
                <h2 className="text-4xl font-black text-on-surface mb-6">Why {cityTitle} chooses Cosy Content?</h2>
                <div className="space-y-6">
                   {[
                     'Built for Mobile Conversion',
                     'Lightning Fast Page Speeds',
                     'Integrated Contact & Quote Forms',
                     'Automated Daily Backups'
                   ].map((item, idx) => (
                     <div key={idx} className="flex items-center gap-4">
                        <Star size={18} className="text-primary" fill="currentColor" />
                        <span className="font-bold text-on-surface">{item}</span>
                     </div>
                   ))}
                </div>
             </div>
             <div className="lg:w-1/2 w-full">
                <div className="bg-surface p-10 rounded-[3rem] border-2 border-primary shadow-2xl relative">
                   <div className="absolute -top-4 -right-4 bg-primary text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest">
                      Special Offer
                   </div>
                   <h3 className="text-2xl font-black mb-4">Launch in {cityTitle} Today</h3>
                   <p className="text-on-surface-variant font-medium mb-8">Start building your {nicheTitle} website now and get the first month of hosting free!</p>
                   <Link to="/signup" className="w-full py-4 bg-primary text-white rounded-2xl font-black block text-center shadow-lg shadow-primary/20 hover:brightness-110 transition-all">
                      Get Started Now
                   </Link>
                </div>
             </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LocalSEOPage;
