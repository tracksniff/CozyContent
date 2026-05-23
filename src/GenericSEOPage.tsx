import React, { useEffect, useState, useRef } from "react";
import { useLocation, Link } from "react-router-dom";
import { 
  Shield, 
  Star, 
  Zap, 
  Clock, 
  Phone, 
  ExternalLink,
  Sparkles,
  Check
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./Navbar";
import Footer from "./Footer";
import PricingToggle from "./PricingToggle";
import type { SEOPageInfo } from "./seoPagesData";
import CoverageMap from "./CoverageMap";

interface GenericSEOPageProps {
  data: SEOPageInfo;
}

// Industry-specific accent colors and imagery
const industryConfig: Record<
  string,
  {
    gradient: string;
    accent: string;
    icon: string;
    badge: string;
    statLabel: string;
  }
> = {
  Plumbing: {
    gradient: "from-blue-600/20 via-cyan-500/10 to-transparent",
    accent: "from-blue-500 to-cyan-500",
    icon: "🔧",
    badge: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    statLabel: "Plumbing Specialists",
  },
  Electrical: {
    gradient: "from-amber-500/20 via-yellow-400/10 to-transparent",
    accent: "from-amber-500 to-yellow-400",
    icon: "⚡",
    badge: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    statLabel: "Electrical Experts",
  },
  Roofing: {
    gradient: "from-slate-500/20 via-stone-400/10 to-transparent",
    accent: "from-slate-500 to-stone-400",
    icon: "🏠",
    badge: "bg-slate-500/10 text-slate-300 border-slate-500/20",
    statLabel: "Roofing Contractors",
  },
  Locksmith: {
    gradient: "from-emerald-600/20 via-teal-500/10 to-transparent",
    accent: "from-emerald-500 to-teal-500",
    icon: "🔑",
    badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    statLabel: "Security Experts",
  },
  Cleaning: {
    gradient: "from-violet-600/20 via-purple-500/10 to-transparent",
    accent: "from-violet-500 to-purple-500",
    icon: "✨",
    badge: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    statLabel: "Cleaning Businesses",
  },
  Removals: {
    gradient: "from-orange-500/20 via-amber-400/10 to-transparent",
    accent: "from-orange-500 to-amber-400",
    icon: "📦",
    badge: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    statLabel: "Removal Companies",
  },
};

const stats = [
  { icon: <Clock className="w-5 h-5" />, value: "48h", label: "Avg. Launch Time" },
  { icon: <Star className="w-5 h-5" />, value: "5.0", label: "Client Rating" },
  { icon: <Zap className="w-5 h-5" />, value: "99%", label: "Uptime SLA" },
  { icon: <Phone className="w-5 h-5" />, value: "24/7", label: "Support Access" },
];

const GenericSEOPage: React.FC<GenericSEOPageProps> = ({ data }) => {
  const { pathname } = useLocation();
  const [activeSection, setActiveSection] = useState<number | null>(null);
  const [isAnnual, setIsAnnual] = useState(true);
  const config = industryConfig[data.industry] || industryConfig["Cleaning"];
  const pricingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Update document title
    if (data.metaTitle) {
      document.title = data.metaTitle;
    }

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", data.metaDescription);
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = data.metaDescription;
      document.getElementsByTagName("head")[0].appendChild(meta);
    }

    // Update OG tags for social sharing
    const updateOrCreateMeta = (name: string, content: string, isProperty: boolean = false) => {
      const attr = isProperty ? 'property' : 'name';
      let tag = document.querySelector(`meta[${attr}="${name}"]`);
      if (tag) {
        tag.setAttribute("content", content);
      } else {
        tag = document.createElement("meta");
        tag.setAttribute(attr, name);
        tag.setAttribute("content", content);
        document.head.appendChild(tag);
      }
    };

    updateOrCreateMeta("og:title", data.metaTitle, true);
    updateOrCreateMeta("og:description", data.metaDescription, true);
    updateOrCreateMeta("og:type", "website", true);
    updateOrCreateMeta("og:url", window.location.href, true);
  }, [pathname, data]);

  const scrollToPricing = () => {
    pricingRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

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
      hasToggle: true,
      color: 'primary'
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
      hasToggle: false,
      color: 'on-surface'
    }
  ];

  return (
    <div className="bg-surface min-h-screen text-on-surface transition-colors duration-300">
      <Navbar />

      <main className="pt-28 pb-24">
        {/* ── HERO ─────────────────────────────────────────────── */}
        <section className="relative overflow-hidden mb-28">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-5xl mx-auto text-center py-16">
              {/* Industry badge */}
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-bold uppercase tracking-[0.15em] mb-8"
              >
                <Shield className="w-3.5 h-3.5" />
                {data.industry} Web Design
              </div>

              {/* Headline */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-[-0.03em] leading-[0.93] mb-6">
                {data.heroTitle || data.keyword}
              </h1>

              {/* Subhead */}
              <p className="text-lg md:text-xl text-on-surface-variant font-medium leading-relaxed max-w-2xl mx-auto mb-10">
                {data.heroSubtitle || data.metaDescription}
              </p>

              {/* Checklist pills */}
              <div className="flex flex-wrap justify-center gap-4 mb-12">
                {(data.checklist || ["Fast Delivery", "Fully Managed", "SEO Optimised"]).map(
                  (item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3.5 px-6 py-3 bg-surface rounded-full border border-outline-variant/40 text-base font-bold shadow-sm"
                    >
                      <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_10px_rgba(0,105,109,0.5)]" />
                      {item}
                    </div>
                  ),
                )}
              </div>
              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/signup"
                  className="group inline-flex items-center px-8 py-4 bg-primary text-white font-bold rounded-2xl hover:brightness-110 active:scale-[0.97] transition-all shadow-lg shadow-primary/25 text-base"
                >
                  Get Started
                </Link>
                <button
                  onClick={scrollToPricing}
                  className="inline-flex items-center px-8 py-4 bg-surface text-on-surface font-bold rounded-2xl border border-outline-variant/50 hover:border-primary/40 hover:bg-surface active:scale-[0.97] transition-all text-base"
                >
                  View Pricing
                </button>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-px mt-16 bg-outline-variant/20 rounded-2xl overflow-hidden border border-outline-variant/20">
                {stats.map((s, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center gap-1.5 py-6 px-4 bg-surface"
                  >
                    <span className="text-primary">{s.icon}</span>
                    <span className="text-2xl font-black tracking-tight">{s.value}</span>
                    <span className="text-xs text-on-surface-variant font-medium">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── CONTENT SECTIONS ──────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-6 lg:px-8 mb-28">
          <div className="space-y-8">
            {data.sections?.map((section, idx) => (
              <div
                key={idx}
                onMouseEnter={() => setActiveSection(idx)}
                onMouseLeave={() => setActiveSection(null)}
                className={`
                  group relative overflow-hidden rounded-3xl border transition-all duration-500
                  ${
                    activeSection === idx
                      ? "border-primary/30 shadow-2xl shadow-primary/8 bg-surface"
                      : "border-outline-variant/30 bg-surface hover:border-outline-variant/60"
                  }
                `}
              >
                <div
                  className={`flex flex-col ${idx % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"} gap-0`}
                >
                  {/* Image panel */}
                  {section.image && (
                    <div className="lg:w-[42%] relative overflow-hidden min-h-[260px] lg:min-h-0">
                      <img
                        src={section.image}
                        alt={section.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      {/* Gradient overlay for text legibility */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-r ${idx % 2 === 0 ? "from-transparent to-surface/60" : "from-surface/60 to-transparent"} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                      />
                      {/* Section bullet badge */}
                      <div className="absolute top-5 left-5 w-9 h-9 rounded-xl bg-black/40 backdrop-blur-sm flex items-center justify-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_10px_rgba(0,105,109,0.6)]" />
                      </div>
                    </div>
                  )}

                  {/* Text panel */}
                  <div
                    className={`flex-1 p-8 md:p-10 lg:p-12 flex flex-col justify-center ${!section.image ? "lg:flex-row lg:gap-12 lg:items-start" : ""}`}
                  >
                    {/* If no image, show section number differently */}
                    {!section.image && (
                      <div className="lg:shrink-0 mb-4 lg:mb-0">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                          <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_12px_rgba(0,105,109,0.5)]" />
                        </div>
                      </div>
                    )}

                    <div className="flex-1">
                      <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-4 group-hover:text-primary transition-colors duration-300">
                        {section.title}
                      </h2>

                      {section.description && (
                        <p className="text-base text-on-surface-variant leading-relaxed font-medium mb-6">
                          {section.description}
                        </p>
                      )}

                      {section.points && (
                        <div
                          className={`grid gap-3 ${!section.image && section.points.length > 3 ? "sm:grid-cols-2" : ""}`}
                        >
                          {section.points.map((point, pIdx) => {
                            // Clean leading numbers/dots if they exist (e.g., "1. " or "1) ")
                            const cleanedPoint = point.replace(/^\d+[\.\)\s]+/, "");

                            // Split at first colon for styled label
                            const colonIdx = cleanedPoint.indexOf(":");
                            const hasLabel = colonIdx > 0 && colonIdx < 40;
                            const label = hasLabel ? cleanedPoint.slice(0, colonIdx) : null;
                            const body = hasLabel ? cleanedPoint.slice(colonIdx + 1).trim() : cleanedPoint;

                            return (
                              <div
                                key={pIdx}
                                className="flex items-start gap-4 p-3 rounded-xl hover:bg-surface transition-colors"
                              >
                                <div className="mt-1 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center shrink-0 font-black text-[10px] shadow-[0_0_10px_rgba(0,105,109,0.3)]">
                                  {pIdx + 1}
                                </div>
                                <span className="text-base leading-relaxed">
                                  {label && (
                                    <span className="font-bold text-on-surface">{label}: </span>
                                  )}
                                  <span className="text-on-surface-variant">{body}</span>
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Subtle active indicator */}
                <div
                  className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${config.accent} transition-opacity duration-300 ${activeSection === idx ? "opacity-100" : "opacity-0"}`}
                />
              </div>
            ))}
          </div>
        </section>

        {/* ── LIVE DEMOS ─────────────────────────────────────────── */}
        {data.demos && data.demos.length > 0 && (
          <section className="max-w-7xl mx-auto px-6 lg:px-8 mb-28">
            <div className="text-center mb-12">
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">Portfolio</p>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
                Explore Our Demos
              </h2>
              <p className="text-on-surface-variant font-medium max-w-xl mx-auto">
                Take a look at what we've built for other {data.industry.toLowerCase()} businesses. 
                Modern, fast, and lead-focused.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {data.demos.map((demo, idx) => (
                <a
                  key={idx}
                  href={demo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex flex-col bg-surface rounded-[2.5rem] border border-outline-variant/30 overflow-hidden hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500"
                >
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <img
                      src={demo.image}
                      alt={demo.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-black transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 shadow-xl">
                        <ExternalLink className="w-6 h-6" />
                      </div>
                    </div>
                  </div>
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-black group-hover:text-primary transition-colors">
                        {demo.name}
                      </h3>
                    </div>
                    <p className="text-sm text-on-surface-variant font-medium">
                      High-converting {data.industry.toLowerCase()} website demo
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* ── PRICING ─────────────────────────────────────────── */}
        <section ref={pricingRef} className="max-w-7xl mx-auto px-6 lg:px-8 mb-28 scroll-mt-24">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">Pricing</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-on-surface-variant font-medium max-w-xl mx-auto text-lg">
              Choose the perfect plan for your trade business. No setup fees, no hidden costs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {plans.map((plan, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className={`relative p-6 md:p-10 rounded-3xl border flex flex-col transition-all duration-500 hover:shadow-4xl group ${
                  plan.popular 
                    ? 'bg-white dark:bg-surface-container-high border-primary/20 ring-4 ring-primary/5 shadow-2xl shadow-primary/10' 
                    : 'bg-surface-container-low border-outline-variant/30 shadow-xl shadow-black/5'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-primary text-white rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-primary/20 z-20">
                    <Sparkles className="w-3.5 h-3.5" /> Most Popular Choice
                  </div>
                )}
                
                <div className="mb-8 text-center">
                  <h3 className="text-3xl font-black mb-3 text-on-surface">{plan.name}</h3>
                  <p className="text-sm font-medium text-on-surface-variant leading-relaxed mx-auto max-w-[240px]">{plan.desc}</p>
                </div>
                
                <div className="flex flex-col items-center gap-1 mb-8 p-6 rounded-2xl bg-surface/50 border border-outline-variant/20 relative overflow-hidden">
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${plan.popular ? 'bg-primary/5' : 'bg-on-surface/5'}`} />
                  <div className="flex items-baseline gap-1 relative z-10">
                    <span className="text-xl font-black text-on-surface-variant mb-2 self-start">£</span>
                    <AnimatePresence mode="wait">
                      <motion.span 
                        key={isAnnual ? 'annual' : 'monthly'}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-6xl font-black text-on-surface tracking-tighter"
                      >
                        {plan.hasToggle 
                          ? (isAnnual ? plan.annualPrice.replace('£', '') : plan.monthlyPrice.replace('£', '')) 
                          : plan.monthlyPrice.replace('£', '')
                        }
                      </motion.span>
                    </AnimatePresence>
                    <span className="text-xs font-black uppercase tracking-widest text-on-surface-variant ml-2">{plan.period}</span>
                  </div>

                  {plan.hasToggle && (
                    <div className="mt-6 pt-6 border-t border-outline-variant/10 w-full flex justify-center relative z-10">
                      <PricingToggle isAnnual={isAnnual} onChange={setIsAnnual} />
                    </div>
                  )}
                </div>

                <div className="space-y-4 mb-10 flex-grow">
                  {plan.features.map((feature, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-4">
                      <div className={`mt-1 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center shadow-lg transition-colors duration-500 ${
                        plan.popular 
                          ? 'bg-primary text-white shadow-primary/20' 
                          : 'bg-on-surface text-surface shadow-on-surface/10'
                      }`}>
                        <Check className="w-3 h-3" strokeWidth={4} />
                      </div>
                      <span className="text-on-surface font-black text-sm leading-tight">{feature}</span>
                    </div>
                  ))}
                </div>

                <Link 
                  to="/signup" 
                  state={{ planId: plan.id, planType: plan.type, billing: plan.hasToggle ? (isAnnual ? 'annual' : 'monthly') : 'one_time' }}
                  className={`group/btn py-4 rounded-xl font-black text-center transition-all flex items-center justify-center text-lg relative overflow-hidden ${
                    plan.popular 
                      ? 'bg-primary text-white hover:shadow-2xl hover:shadow-primary/30 active:scale-[0.98]' 
                      : 'bg-on-surface text-surface hover:bg-on-surface-variant active:scale-[0.98]'
                  }`}
                >
                  <span className="relative z-10 flex items-center transition-all">
                    {plan.cta}
                  </span>
                  <div className="absolute inset-0 bg-white/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── COVERAGE / AREAS WE SERVE ─────────────────────────── */}
        <section className="max-w-7xl mx-auto px-6 lg:px-8 mb-28">
          {data.location ? (
            <div className="flex flex-col lg:flex-row gap-12 items-center">
              <div className="lg:w-1/2">
                <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
                  Service Area
                </p>
                <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">
                  Serving {data.location} and Surroundings
                </h2>
                <p className="text-on-surface-variant font-medium text-lg leading-relaxed mb-8">
                  We provide professional {data.industry.toLowerCase()} web design services across 
                  the entire {data.location} area. Our websites are built to help local businesses 
                  like yours dominate the local search results and win more jobs.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  {[
                    "Local SEO targeting",
                    "Google Maps integration",
                    "Area-specific content",
                    "Mobile-first design"
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <div className="w-2.5 h-2.5 rounded-full bg-primary shrink-0 shadow-[0_0_10px_rgba(0,105,109,0.5)]" />
                      <span className="text-base font-bold">{item}</span>
                    </div>
                  ))}
                </div>
                <Link
                  to="/contact"
                  className="inline-flex items-center text-primary font-black transition-all"
                >
                  Check coverage in your area
                </Link>
              </div>
              <div className="lg:w-1/2 w-full">
                <CoverageMap locationName={data.location} />
              </div>
            </div>
          ) : (
            <>
              <div className="text-center mb-12">
                <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
                  Coverage
                </p>
                <h2 className="text-4xl font-black tracking-tight mb-4">Areas We Serve</h2>
                <p className="text-on-surface-variant font-medium max-w-2xl mx-auto">
                  We build professional {data.industry} websites for businesses across Luton and the
                  wider region. Each location page is individually written with unique local content.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
                {["Luton", "Bedford", "Dunstable", "Milton Keynes", "St Albans", "Watford"].map(
                  (city) => {
                    const industryToSlug: Record<string, string> = {
                      Plumbing: "plumber-web-design",
                      Electrical: "electrician-web-design",
                      Roofing: "roofer-web-design",
                      Locksmith: "locksmith-web-design",
                      Cleaning: "cleaning-company-web-design",
                      Removals: "removals-web-design",
                    };
                    const slug = industryToSlug[data.industry];
                    const citySlug = city.toLowerCase().replace(" ", "-");
                    const targetUrl = `${slug}-${citySlug}`;

                    return (
                      <Link
                        key={city}
                        to={`/${targetUrl}`}
                        className="group flex items-center justify-center p-6 bg-surface rounded-2xl border border-outline-variant/30 hover:border-primary/40 hover:bg-surface hover:shadow-lg hover:shadow-primary/5 transition-all duration-200"
                      >
                        <span className="font-bold text-sm text-center group-hover:text-primary transition-colors">
                          {city}
                        </span>
                      </Link>
                    );
                  },
                )}
              </div>

              <div className="mb-8">
                <CoverageMap />
              </div>

              <p className="mt-8 text-on-surface-variant text-center text-sm font-medium">
                Every area page is individually written — no duplicate content — designed to rank
                specifically for that town.
              </p>
            </>
          )}
        </section>

        {/* ── FINAL CTA ─────────────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-surface border border-outline-variant/20 px-8 py-20 text-center">
            {/* Decorative blobs */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/6 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/6 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/3 pointer-events-none" />

            {/* Inline grid decoration */}
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />

            <div className="relative z-10 max-w-3xl mx-auto">
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-4">
                Ready to grow?
              </p>
              <h2 className="text-4xl md:text-6xl font-black tracking-[-0.02em] leading-[0.95] mb-6">
                Transform your
                <br />
                <span className="text-primary">{data.industry.toLowerCase()}</span> business online
              </h2>
              <p className="text-on-surface-variant text-lg font-medium mb-10 leading-relaxed">
                Get a high-converting, professionally managed website that brings in new enquiries
                every day.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/signup"
                  className="group inline-flex items-center px-10 py-5 bg-primary text-white font-bold rounded-2xl hover:brightness-110 active:scale-[0.97] transition-all shadow-2xl shadow-primary/30 text-base"
                >
                  Get Started
                </Link>
                <Link
                  to="/signup"
                  className="inline-flex items-center px-10 py-5 text-on-surface font-bold rounded-2xl border border-outline-variant/60 hover:border-primary/40 hover:bg-surface active:scale-[0.97] transition-all text-base"
                >
                  Start for £59/mo
                </Link>
              </div>

              {/* Trust micro-copy */}
              <p className="mt-6 text-on-surface-variant text-sm font-medium">
                No contracts. No upfront cost on the monthly plan. Cancel any time.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default GenericSEOPage;
