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
    url: "https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg",
    title: "Responsive Business Suite",
    tag: "Clean Architecture"
  },
  {
    url: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg",
    title: "Strategic Lead Dashboard",
    tag: "High Conversion"
  },
  {
    url: "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg",
    title: "Modern Trade Concept",
    tag: "Modern Aesthetic"
  },
  {
    url: "https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg",
    title: "Managed Service Platform",
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

  useEffect(() => {
    document.title = "Cosy Content | Modern Websites Without the Hassle";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Get a modern business website in 7 days without the hassle. We build and manage high-converting websites for trades and local businesses.");
    }
  }, []);

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
                  src="https://images.pexels.com/photos/163032/pexels-photo-163032.jpeg"
                />
              </div>
            </div>
            <div className="space-y-6 md:space-y-8 mt-12 md:mt-20">
              <MousePerspective className="p-4 md:p-6 bg-primary/5 rounded-3xl border border-primary/20 shadow-4xl shadow-primary/10">
                <div className="text-[10px] font-black tracking-widest mb-4 text-primary uppercase">Modern (Redesigned)</div>
                <img
                  className="rounded-2xl w-full aspect-[3/4] object-cover"
                  alt="Modern design"
                  src="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg"
                />
              </MousePerspective>
            </div>
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
                      <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-on-surface text-surface flex items-center justify-center shadow-lg shadow-on-surface/10">
                        <Check className="w-3 h-3" strokeWidth={4} />
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
