import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import {
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
      <header className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] pointer-events-none opacity-50 dark:opacity-5"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[600px] h-[600px] bg-secondary-container/10 rounded-full blur-[100px] pointer-events-none opacity-50 dark:opacity-5"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-surface-container-low border border-outline-variant/30 shadow-sm"
            >
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
              <span className="text-[10px] md:text-[11px] font-extrabold uppercase tracking-widest text-on-surface-variant">
                Modern Websites in 7 Days
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8"
            >
              Get a Modern Website <br />
              <span className="text-primary italic">Without the Hassle.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-lg md:text-2xl text-on-surface-variant leading-relaxed mb-10 max-w-2xl mx-auto font-medium px-4 md:px-0"
            >
              We build or redesign your business website in 7 days — no calls, no meetings, no stress.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-8 flex flex-col sm:flex-row justify-center gap-4 relative z-10 px-4 md:px-0"
            >
              <Link to="/signup" className="bg-primary text-white px-10 py-5 rounded-2xl font-black text-lg hover:shadow-2xl shadow-primary/30 transition-all hover:scale-105 active:scale-95">
                Get Started
              </Link>
              <a href="#services" className="bg-on-surface text-surface px-10 py-5 rounded-2xl font-black text-lg hover:bg-on-surface-variant transition-all shadow-xl active:scale-95">
                View Example
              </a>
            </motion.div>
          </div>

          <MousePerspective className="mt-20 md:mt-24 relative max-w-5xl mx-auto group">
            <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-4xl dark:shadow-primary/10 border border-outline-variant/30 p-2 bg-surface-container-low/30 backdrop-blur-md transition-all duration-700 group-hover:scale-[1.02] group-hover:border-primary/40">
              <PortfolioSlider />
            </div>
          </MousePerspective>
        </div>
      </header>

      {/* How It Works Section */}
      <section id="services" className="py-24 md:py-32 bg-surface-container-low/30 relative transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center mb-16">
            <span className="text-primary font-black text-xs tracking-[0.3em] uppercase mb-4 block">Process</span>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none mb-6">No back-and-forth. <br /><span className="text-primary italic">Just results.</span></h2>
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
                icon: <Zap className="w-8 h-8" />,
                color: 'bg-primary/10 text-primary'
              },
              {
                step: '02',
                title: 'You Preview It',
                desc: 'You get a live preview of your new site — fully designed and ready to go.',
                icon: <Monitor className="w-8 h-8" />,
                color: 'bg-secondary/10 text-secondary'
              },
              {
                step: '03',
                title: 'You Own It',
                desc: 'Love it? Purchase instantly and we transfer everything to you.',
                icon: <ShieldCheck className="w-8 h-8" />,
                color: 'bg-on-surface/10 text-on-surface'
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="group p-8 md:p-10 rounded-[2.5rem] bg-surface border border-outline-variant/20 hover:border-primary/40 transition-all duration-500 hover:shadow-4xl hover:-translate-y-2 relative overflow-hidden"
              >
                <div className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                  {item.icon}
                </div>
                <h3 className="text-2xl font-black mb-4 tracking-tight">{item.title}</h3>
                <p className="text-base text-on-surface-variant leading-relaxed font-bold">{item.desc}</p>
                <div className="absolute top-8 right-10 text-7xl font-black text-outline-variant/10 group-hover:text-primary/10 transition-colors">
                  {item.step}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>


      {/* Before & After Section */}
      <section className="py-24 md:py-32 bg-surface relative overflow-hidden transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col lg:flex-row items-center gap-16 md:gap-24">
          <motion.div
            {...fadeInUp}
            className="lg:w-1/2"
          >
            <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter leading-[0.9]">
              Outdated → <br />
              <span className="text-primary italic">Modern.</span>
            </h2>
            <p className="text-xl md:text-2xl text-on-surface-variant mb-10 leading-relaxed font-medium">
              We transform slow, outdated websites into fast, clean, mobile-friendly designs that convert visitors into customers.
            </p>

            <div className="space-y-5">
              {[
                'Modern, mobile-friendly design',
                'Fast-loading website',
                'SEO-ready structure',
                'Click-to-call & contact forms',
                'Hosting & security (if on monthly plan)'
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-primary" strokeWidth={4} />
                  </div>
                  <span className="text-lg font-black text-on-surface leading-tight">{text}</span>
                </div>
              ))}
            </div>

            <div className="mt-12">
              <button className="bg-on-surface text-surface px-10 py-5 rounded-2xl font-black text-lg hover:bg-on-surface-variant transition-all shadow-xl active:scale-95">
                View Live Demo
              </button>
            </div>
          </motion.div>

          <div className="lg:w-1/2 grid grid-cols-2 gap-6 md:gap-8">
            <div className="space-y-6 md:space-y-8">
              <div className="p-4 md:p-6 bg-surface-container-low rounded-3xl border border-outline-variant/20 grayscale opacity-40 dark:opacity-20 shadow-xl">
                <div className="text-[10px] font-black tracking-widest mb-4 opacity-40 uppercase">Outdated Site</div>
                <img
                  className="rounded-2xl w-full aspect-[3/4] object-cover"
                  alt="Old design"
                  src="https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=1000&auto=format&fit=crop"
                />
              </div>
            </div>
            <div className="space-y-6 md:space-y-8 mt-12 md:mt-20">
              <MousePerspective className="p-4 md:p-6 bg-primary/5 rounded-3xl border border-primary/20 shadow-4xl shadow-primary/10">
                <div className="text-[10px] font-black tracking-widest mb-4 text-primary uppercase">Modern (Redesigned)</div>
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

      {/* Google Reviews Section */}
      <section className="py-24 md:py-32 bg-surface-container-low/30 relative overflow-hidden transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-2 mb-4"
              >
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-on-surface font-black text-sm uppercase tracking-widest">5.0 Rating</span>
              </motion.div>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">
                Don't just take <br /><span className="text-primary italic">our word for it.</span>
              </h2>
            </div>
            <a 
              href="https://g.page/r/CcL50VdU9y65EAE/review" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-white dark:bg-surface-container-high px-6 py-4 rounded-2xl border border-outline-variant/30 shadow-sm hover:border-primary/50 transition-all hover:scale-105"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span className="text-on-surface-variant font-bold">View All Reviews</span>
            </a>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "David Richardson",
                role: "Emergency Plumber",
                text: "Cosy Content built my site in less than a week. No stress, no constant phone calls, just a great looking website that actually gets me leads. Highly recommend.",
                initials: "DR"
              },
              {
                name: "Sarah Jenkins",
                role: "Cleaning Services",
                text: "I was skeptical about the 7-day delivery but they actually did it. The design is much better than my old one and it's so much faster. The process was incredibly smooth.",
                initials: "SJ"
              },
              {
                name: "Michael Thompson",
                role: "Electrician",
                text: "The best part was not having to write any content myself. They handled everything and the local SEO setup has already started showing results. Great value for money.",
                initials: "MT"
              }
            ].map((review, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                initial="initial"
                whileInView="whileInView"
                viewport={{ once: true }}
                className="bg-surface p-8 rounded-[2rem] border border-outline-variant/20 shadow-xl shadow-black/5 flex flex-col justify-between hover:border-primary/30 transition-all group"
              >
                <div>
                  <div className="flex gap-1 mb-6">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-on-surface-variant font-bold leading-relaxed italic mb-8">"{review.text}"</p>
                </div>
                <div className="flex items-center justify-between pt-6 border-t border-outline-variant/10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-sm">
                      {review.initials}
                    </div>
                    <div>
                      <h4 className="font-black text-on-surface tracking-tight">{review.name}</h4>
                      <p className="text-xs font-bold text-on-surface-variant/60">{review.role}</p>
                    </div>
                  </div>
                  <a 
                    href="https://g.page/r/CcL50VdU9y65EAE/review"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-surface-container-low rounded-xl border border-outline-variant/20 hover:border-primary/50 transition-all group/link"
                    title="View on Google"
                  >
                    <svg className="w-4 h-4 grayscale group-hover/link:grayscale-0 transition-all" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 md:py-32 bg-surface transition-colors duration-300 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
          <div className="text-center mb-16">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-primary font-black text-xs tracking-[0.4em] uppercase mb-4 block"
            >
              Simple Pricing
            </motion.span>
            <motion.h2
              {...fadeInUp}
              className="text-4xl md:text-6xl font-black tracking-tighter mb-4"
            >
              Honest <span className="text-primary italic">Pricing.</span>
            </motion.h2>
            <p className="text-on-surface-variant font-bold text-lg md:text-xl">No hidden fees. No contracts. Cancel anytime.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-stretch max-w-5xl mx-auto">
            {/* Monthly Plan */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative group h-full"
            >
              <div className="absolute inset-0 bg-white dark:bg-surface-container-high rounded-[2.5rem] border-2 border-primary shadow-2xl shadow-primary/10 transition-all duration-500 group-hover:scale-[1.01] group-hover:shadow-4xl group-hover:shadow-primary/20"></div>

              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/30 z-10 border border-white/20 flex items-center gap-2">
                <Check className="w-3 h-3" strokeWidth={4} /> Most Popular Choice
              </div>

              <div className="relative p-8 md:p-12 flex flex-col h-full">
                <div className="mb-8 text-center">
                  <h3 className="text-3xl font-black mb-3">Monthly Plan</h3>
                  <p className="text-on-surface-variant font-bold leading-relaxed text-sm">
                    Everything handled — build, hosting, and support.
                  </p>
                </div>

                <div className="flex flex-col items-center gap-1 mb-10 p-6 rounded-2xl bg-surface/50 dark:bg-surface/5 border border-outline-variant/20 shadow-sm">
                  <div className="flex items-baseline gap-1">
                    <span className="text-6xl font-black text-on-surface tracking-tighter">{isAnnual ? '£47' : '£59'}</span>
                    <span className="text-on-surface-variant font-black text-xs uppercase tracking-widest ml-2">/month</span>
                  </div>
                  <div className="mt-6 pt-6 border-t border-outline-variant/10 w-full flex justify-center">
                    <PricingToggle isAnnual={isAnnual} onChange={setIsAnnual} />
                  </div>
                </div>

                <div className="space-y-4 mb-10 flex-grow">
                  {[
                    'Professional website design and build',
                    'All content written by our team',
                    'Local SEO setup from day one',
                    'Hosting and security — fully managed',
                    'Up to 5 updates per month',
                    'Ongoing maintenance and support',
                    'Cancel anytime — no minimum term'
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
                        <Check className="w-3 h-3" strokeWidth={4} />
                      </div>
                      <span className="text-on-surface font-black text-sm leading-tight">{item}</span>
                    </div>
                  ))}
                </div>

                <Link to="/signup" className="w-full py-5 rounded-2xl bg-primary text-white font-black shadow-xl shadow-primary/30 hover:shadow-primary/50 transition-all text-lg flex items-center justify-center gap-2 active:scale-95">
                  Get Started
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
              <div className="absolute inset-0 bg-surface-container-low rounded-[2.5rem] border border-outline-variant/30 shadow-2xl shadow-black/5 transition-all duration-500 group-hover:shadow-4xl group-hover:scale-[1.01]"></div>

              <div className="relative p-8 md:p-12 flex flex-col h-full">
                <div className="mb-8 text-center">
                  <h3 className="text-3xl font-black mb-3">One-Off Payment</h3>
                  <p className="text-on-surface-variant font-bold leading-relaxed text-sm">
                    Own your site outright. Delivered ready to use.
                  </p>
                </div>

                <div className="flex flex-col items-center gap-1 mb-10 p-6 rounded-2xl bg-surface/50 border border-outline-variant/20 shadow-sm">
                  <div className="flex items-baseline gap-1">
                    <span className="text-6xl font-black text-on-surface tracking-tighter">£349</span>
                    <span className="text-on-surface-variant font-black text-xs uppercase tracking-widest ml-2">Fixed</span>
                  </div>
                </div>

                <div className="space-y-4 mb-10 flex-grow">
                  {[
                    'Professional website design and build',
                    'All content written by our team',
                    'Local SEO setup from day one',
                    'Full ownership of the finished site',
                    'No monthly fees — ever',
                    'Hosting not included',
                    'No ongoing updates or support'
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-surface-container-high flex items-center justify-center">
                        <Check className="w-3 h-3 text-on-surface-variant" strokeWidth={4} />
                      </div>
                      <span className="text-on-surface font-black text-sm leading-tight">{item}</span>
                    </div>
                  ))}
                </div>

                <Link to="/signup" className="w-full py-5 rounded-2xl bg-on-surface text-surface hover:bg-on-surface-variant transition-all text-lg flex items-center justify-center gap-2 active:scale-95 shadow-xl">
                  Claim Ownership
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Who This Is For Section */}
      <section className="py-24 md:py-32 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter">Who This Is <span className="text-primary italic">For.</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Local Businesses', desc: 'Perfect for trades like plumbing, electrical, or construction with outdated sites.' },
              { title: 'No Website At All', desc: 'Get online instantly without having to learn complex tools.' },
              { title: 'Hassle-Free Owners', desc: 'Owners who want results without the long meetings.' }
            ].map((item, i) => (
              <div key={i} className="bg-surface-container-low p-10 rounded-[2.5rem] border border-outline-variant/20 shadow-xl shadow-black/5 hover:shadow-2xl transition-all">
                <h3 className="text-2xl font-black mb-4 tracking-tight">{item.title}</h3>
                <p className="text-base text-on-surface-variant font-bold leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 md:py-32 bg-surface-container-low/30 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl md:text-6xl font-black mb-16 text-center tracking-tighter">Common <span className="text-primary italic">Questions.</span></h2>
          <div className="space-y-6">
            {[
              { q: 'Do I own the website?', a: 'Yes — once you purchase, the website is yours.' },
              { q: 'Can I host it myself?', a: 'Yes, or you can stay on our monthly plan and we handle everything.' },
              { q: 'How fast is delivery?', a: 'Typically within 7 days.' },
              { q: 'Do I need to provide anything?', a: 'No — we handle everything.' }
            ].map((item, i) => (
              <div key={i} className="bg-surface p-8 rounded-3xl border border-outline-variant/20 shadow-lg shadow-black/5 group hover:border-primary/30 transition-all">
                <h3 className="text-lg font-black mb-3 group-hover:text-primary transition-colors">{item.q}</h3>
                <p className="text-on-surface-variant text-base font-bold leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 md:py-32 px-6 transition-colors duration-300">
        <MousePerspective className="max-w-7xl mx-auto bg-on-surface dark:bg-surface-container-high rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden shadow-4xl group transition-all">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/30 transition-colors duration-1000"></div>

          <div className="relative z-10">
            <h2 className="text-4xl sm:text-6xl md:text-8xl font-black text-surface dark:text-on-surface mb-8 tracking-tighter leading-[0.9] md:leading-[0.85]">
              Your new website is <br /><span className="text-primary italic">one step away.</span>
            </h2>
            <p className="text-surface/70 dark:text-on-surface-variant text-xl md:text-2xl mb-12 max-w-2xl mx-auto font-medium">
              See what your business could look like today.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link to="/signup" className="bg-primary text-white px-12 py-6 rounded-2xl font-black text-xl md:text-2xl hover:scale-105 transition-all shadow-3xl shadow-primary/40 active:scale-95">
                Get Started Today
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
