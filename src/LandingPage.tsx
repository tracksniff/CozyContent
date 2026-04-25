import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import {
  CheckCircle2,
  ShieldCheck,
  Zap,
  Monitor,
  Check
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import PricingToggle from './PricingToggle';

const MousePerspective = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={className}
    >
      <div style={{ transform: "translateZ(20px)", transformStyle: "preserve-3d" }}>
        {children}
      </div>
    </motion.div>
  );
};

const PORTFOLIO_IMAGES = [
  {
    url: "https://images.unsplash.com/photo-1517292987719-0369a794ec0f?q=80&w=1974&auto=format&fit=crop",
    title: "Minimalist SaaS Platform",
    tag: "Clean Architecture"
  },
  {
    url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop",
    title: "Strategic Marketing Dashboard",
    tag: "High Conversion"
  },
  {
    url: "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=1964&auto=format&fit=crop",
    title: "Creative Portfolio Concept",
    tag: "Modern Aesthetic"
  },
  {
    url: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?q=80&w=2070&auto=format&fit=crop",
    title: "Next-Gen E-commerce Suite",
    tag: "Lightning Speed"
  }
];

const PortfolioSlider = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % PORTFOLIO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
          className="absolute inset-0"
        >
          <img
            src={PORTFOLIO_IMAGES[index].url}
            alt={PORTFOLIO_IMAGES[index].title}
            className="w-full h-full object-cover shadow-2xl"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="absolute bottom-10 left-10 text-left"
          >
            <span className="text-[10px] font-black tracking-widest uppercase text-white/70 mb-2 block">{PORTFOLIO_IMAGES[index].tag}</span>
            <h4 className="text-xl font-bold text-white tracking-tight">{PORTFOLIO_IMAGES[index].title}</h4>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-10 right-10 flex gap-2 z-30">
        {PORTFOLIO_IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-1 transition-all duration-500 rounded-full ${i === index ? 'w-8 bg-primary' : 'w-2 bg-white/30 hover:bg-white/50'}`}
          />
        ))}
      </div>
    </div>
  );
};

const LandingPage = () => {
  const [isAnnual, setIsAnnual] = useState(true);
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    initial: {},
    whileInView: { transition: { staggerChildren: 0.1 } },
    viewport: { once: true }
  };

  return (
    <div className="bg-surface text-on-surface font-body selection:bg-primary/20 selection:text-primary overflow-x-hidden transition-colors duration-300">
      <Navbar />

      {/* Hero Section */}
      <header className="relative pt-44 pb-32 overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] pointer-events-none opacity-50 dark:opacity-20"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[600px] h-[600px] bg-secondary-container/10 rounded-full blur-[100px] pointer-events-none opacity-50 dark:opacity-10"></div>

        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full bg-surface-container-low border border-outline-variant/30 shadow-sm"
            >
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-on-surface-variant">
                Modern Websites in 7 Days
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-6xl md:text-8xl font-extrabold tracking-tighter leading-[0.95] mb-8"
            >
              Get a Modern Website <br />
              <span className="text-primary italic font-light serif">Without the Hassle</span>.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-xl text-on-surface-variant leading-relaxed mb-12 max-w-2xl mx-auto font-medium"
            >
              We build or redesign your business website in 7 days — no calls, no meetings, no stress.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-12 flex flex-col sm:flex-row justify-center gap-6 relative z-10"
            >
              <Link to="/signup" className="bg-primary text-white px-10 py-5 rounded-2xl font-black text-lg hover:shadow-2xl shadow-primary/30 transition-all active:scale-95">
                Get Your Website
              </Link>
              <a href="#services" className="bg-surface-container-high text-on-surface px-10 py-5 rounded-2xl font-black text-lg hover:bg-surface-container-highest transition-all shadow-sm active:scale-95">
                View Example
              </a>
            </motion.div>
          </div>

          <MousePerspective className="mt-24 relative max-w-5xl mx-auto group">
            <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.2)] dark:shadow-primary/10 border border-outline-variant/30 dark:border-primary/20 p-2 bg-surface-container-low/30 backdrop-blur-md transition-all duration-500 group-hover:scale-[1.02] group-hover:border-primary/40">
              <PortfolioSlider />
            </div>
          </MousePerspective>
        </div>
      </header>

      {/* How It Works Section */}
      <section id="services" className="py-32 bg-surface-container-low/30 relative transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-20">
            <span className="text-primary font-bold text-sm tracking-widest uppercase mb-4 block">How It Works</span>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">No back-and-forth. <br />No long timelines. Just results.</h2>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                step: '01',
                title: 'We Build It',
                desc: 'We create a brand new or redesigned version of your website based on your business.',
                icon: <Zap className="w-6 h-6" />,
                color: 'bg-primary/10 text-primary'
              },
              {
                step: '02',
                title: 'You Preview It',
                desc: 'You get a live preview of your new site — fully designed and ready to go.',
                icon: <Monitor className="w-6 h-6" />,
                color: 'bg-secondary-container/20 text-secondary'
              },
              {
                step: '03',
                title: 'You Own It',
                desc: 'Love it? Purchase instantly and we transfer everything to you.',
                icon: <ShieldCheck className="w-6 h-6" />,
                color: 'bg-primary-fixed-dim/20 text-on-primary-fixed-variant'
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="group p-10 rounded-3xl bg-surface border border-outline-variant/10 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 relative overflow-hidden"
              >
                <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}>
                  {item.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-on-surface-variant leading-relaxed font-medium">{item.desc}</p>
                <div className="absolute top-8 right-10 text-6xl font-black text-outline-variant/5 group-hover:text-primary/10 transition-colors">
                  {item.step}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>


      {/* Before & After Section */}
      <section className="py-32 bg-surface relative overflow-hidden transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-8 flex flex-col lg:flex-row items-center gap-24">
          <motion.div
            {...fadeInUp}
            className="lg:w-1/2"
          >
            <h2 className="text-5xl md:text-6xl font-extrabold mb-8 tracking-tighter leading-tight">
              Outdated → <br />
              <span className="text-primary">Modern</span>
            </h2>
            <p className="text-xl text-on-surface-variant mb-12 leading-relaxed font-medium">
              We transform slow, outdated websites into fast, clean, mobile-friendly designs that convert visitors into customers.
            </p>

            <div className="space-y-6">
              {[
                'Modern, mobile-friendly design',
                'Fast-loading website',
                'SEO-ready structure',
                'Click-to-call & contact forms',
                'Hosting & security (if on monthly plan)'
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-lg font-semibold text-on-surface">{text}</span>
                </div>
              ))}
            </div>

            <div className="mt-12">
              <button className="bg-surface-container-high text-on-surface px-8 py-4 rounded-xl font-bold text-lg hover:bg-surface-container-highest transition-colors shadow-sm">
                View Live Demo
              </button>
            </div>
          </motion.div>

          <div className="lg:w-1/2 grid grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="p-4 bg-surface-container-low rounded-3xl border border-outline-variant/10 grayscale opacity-40 dark:opacity-20">
                <div className="text-[10px] font-black tracking-[0.2em] mb-3 opacity-40 uppercase">Outdated (Plumber Example)</div>
                <img
                  className="rounded-2xl w-full aspect-[3/4] object-cover"
                  alt="Old design"
                  src="https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=1000&auto=format&fit=crop"
                />
              </div>
            </div>
            <div className="space-y-6 mt-16">
              <MousePerspective className="p-4 bg-primary/5 rounded-3xl border border-primary/20 shadow-2xl shadow-primary/10">
                <div className="text-[10px] font-black tracking-[0.2em] mb-3 text-primary uppercase">Modern (Redesigned)</div>
                <img
                  className="rounded-2xl w-full aspect-[3/4] object-cover"
                  alt="Modern design"
                  src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1000&auto=format&fit=crop"
                />
              </MousePerspective>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 bg-surface transition-colors duration-300 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <div className="text-center mb-16">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-primary font-bold text-sm tracking-[0.3em] uppercase mb-4 block"
            >
              Simple Pricing
            </motion.span>
            <motion.h2
              {...fadeInUp}
              className="text-5xl md:text-6xl font-black tracking-tighter mb-12"
            >
              No hidden fees. <br />
              <span className="text-on-surface-variant/50 text-4xl md:text-5xl">No contracts. Cancel anytime.</span>
            </motion.h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-stretch max-w-5xl mx-auto">
            {/* Monthly Plan */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative group h-full"
            >
              <div className="absolute inset-0 bg-surface-container-low rounded-[2.5rem] border-2 border-primary shadow-xl shadow-primary/5 transition-all duration-500 group-hover:scale-[1.01]"></div>
              
              <div className="absolute -top-4 left-10 bg-primary text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 z-10 border border-white/20 flex items-center gap-2">
                <Check className="w-3 h-3" strokeWidth={4} /> Most Popular
              </div>

              <div className="relative p-10 flex flex-col h-full">
                <div className="mb-8">
                  <h3 className="text-2xl font-black mb-3">Monthly Subscription</h3>
                  <p className="text-on-surface-variant font-medium leading-relaxed text-sm">
                    Website included with hosting & maintenance.
                  </p>
                </div>

                <div className="flex flex-col gap-1 mb-8 p-6 rounded-3xl bg-surface/50 border border-outline-variant/10">
                  <div className="flex items-baseline gap-2">
                    <span className="text-6xl font-black text-on-surface">{isAnnual ? '£47' : '£59'}</span>
                    <span className="text-on-surface-variant font-bold text-sm uppercase tracking-widest">/month</span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-outline-variant/10">
                    <PricingToggle isAnnual={isAnnual} onChange={setIsAnnual} isPopular={false} />
                  </div>
                </div>
                
                <div className="space-y-4 mb-10 flex-grow">
                  {[
                    'Hosting',
                    'SSL',
                    'Security',
                    'Performance optimization',
                    'Upto 5 small updates per month (eg text changes, image swaps, contact info updates)'
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                        <Check className="w-3 h-3 text-primary" strokeWidth={4} />
                      </div>
                      <span className="text-on-surface font-bold text-sm">{item}</span>
                    </div>
                  ))}
                </div>

                <Link to="/signup" className="w-full py-4 rounded-xl bg-primary text-white font-black shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all text-base flex items-center justify-center gap-2 active:scale-95">
                  Select Monthly
                </Link>
              </div>
            </motion.div>

            {/* One-Time Payment */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative group h-full"
            >
              <div className="absolute inset-0 bg-surface-container-low rounded-[2.5rem] border border-outline-variant/30 shadow-lg transition-all duration-500 group-hover:shadow-xl group-hover:scale-[1.01]"></div>

              <div className="relative p-10 flex flex-col h-full">
                <div className="mb-8">
                  <h3 className="text-2xl font-black mb-3">One-Time Payment</h3>
                  <p className="text-on-surface-variant font-medium leading-relaxed text-sm">
                    £349 for your fully built website. Delivered ready to use.
                  </p>
                </div>

                <div className="flex items-baseline gap-2 mb-8 p-6 rounded-3xl bg-surface/50 border border-outline-variant/10">
                  <span className="text-6xl font-black text-on-surface">£349</span>
                  <span className="text-on-surface-variant font-bold text-sm uppercase tracking-widest">Fixed</span>
                </div>

                <div className="space-y-4 mb-10 flex-grow">
                  {[
                    'Fully built website',
                    'No ongoing commitment',
                    'Full source files available',
                    'Handover within 7 days',
                    'Ready to use'
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-surface-container-high flex items-center justify-center">
                        <Check className="w-3 h-3 text-on-surface-variant" strokeWidth={4} />
                      </div>
                      <span className="text-on-surface font-bold text-sm">{item}</span>
                    </div>
                  ))}
                </div>

                <Link to="/signup" className="w-full py-4 rounded-xl bg-on-surface text-surface font-black hover:bg-on-surface-variant transition-all text-base flex items-center justify-center gap-2 active:scale-95">
                  Claim Ownership
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Who This Is For Section */}
      <section className="py-32 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black tracking-tight">Who This Is For</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Local Businesses', desc: 'Perfect for trades like plumbing, electrical, or construction with outdated sites.' },
              { title: 'No Website At All', desc: 'Get online instantly without having to learn complex tools.' },
              { title: 'Hassle-Free Owners', desc: 'Owners who want results without the long meetings.' }
            ].map((item, i) => (
              <div key={i} className="bg-surface-container-low p-8 rounded-[2rem] border border-outline-variant/10">
                <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                <p className="text-on-surface-variant font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-32 bg-surface-container-low/30 transition-colors duration-300">
        <div className="max-w-3xl mx-auto px-8">
          <h2 className="text-4xl font-black mb-12 text-center">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {[
              { q: 'Do I own the website?', a: 'Yes — once you purchase, the website is yours.' },
              { q: 'Can I host it myself?', a: 'Yes, or you can stay on our monthly plan and we handle everything.' },
              { q: 'How fast is delivery?', a: 'Typically within 7 days.' },
              { q: 'Do I need to provide anything?', a: 'No — we handle everything.' }
            ].map((item, i) => (
              <div key={i} className="bg-surface p-6 rounded-2xl border border-outline-variant/10">
                <h3 className="font-bold mb-2">{item.q}</h3>
                <p className="text-on-surface-variant text-sm">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-8 transition-colors duration-300">
        <MousePerspective className="max-w-6xl mx-auto bg-surface-container-low rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl border border-outline-variant/20 transition-all">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>

          <div className="relative z-10">
            <h2 className="text-5xl md:text-7xl font-black text-on-surface mb-8 tracking-tighter leading-none">
              Your new website is <br />already one step away.
            </h2>
            <p className="text-on-surface-variant text-xl mb-12 max-w-xl mx-auto font-medium">
              See what your business could look like today.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link to="/signup" className="bg-primary text-white px-12 py-6 rounded-2xl font-black text-xl hover:scale-105 transition-all shadow-2xl shadow-primary/30 active:scale-95">
                View My Website Preview
              </Link>
            </div>
          </div>
        </MousePerspective>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
