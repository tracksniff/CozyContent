import { motion } from 'framer-motion';
import { ArrowUpRight, Music, Trophy, Layout, Cpu, Zap, Target, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const OurBrands = () => {
  const brands = [
    {
      name: 'TrackSniff',
      tagline: 'Identify music from any video — instantly.',
      description: 'TrackSniff is a tool designed to solve a common frustration: finding track IDs from mixes, livestreams, and online videos. Using audio recognition technology, TrackSniff analyses content and returns accurate track listings with timestamps.',
      delivers: [
        'Fast track identification',
        'Timestamped results',
        'Built for DJs, music lovers, and online communities'
      ],
      footer: 'A utility-focused product designed for scale and automation.',
      icon: <Music className="w-8 h-8 text-primary" />,
      color: 'bg-primary/10',
      link: 'https://tracksniff.com/'
    },
    {
      name: 'SoccerWhizz',
      tagline: 'Soccer content, simplified.',
      description: 'SoccerWhizz is a content-driven platform focused on delivering clear, engaging football insights. Built with performance and readability in mind, it’s designed to present information in a way that’s easy to consume and visually clean.',
      delivers: [
        'Structured, easy-to-read content',
        'Fast-loading pages',
        'A streamlined user experience'
      ],
      footer: 'A content platform built for clarity and consistency.',
      icon: <Trophy className="w-8 h-8 text-secondary" />,
      color: 'bg-secondary/10',
      link: 'https://soccerwhizz.com/'
    }
  ];

  const BrowserPreview = ({ siteUrl, title }: { siteUrl: string, title: string }) => {
    const screenshotUrl = `https://api.microlink.io/?url=${encodeURIComponent(siteUrl)}&screenshot=true&meta=false&embed=screenshot.url&viewport.width=1280&viewport.height=800`;
    const hostname = new URL(siteUrl).hostname.replace(/^www\./, '');
    return (
      <div className="relative group w-full">
        {/* Browser Bar */}
        <div className="bg-surface-container-highest rounded-t-xl border border-outline-variant/30 px-3 py-2 flex items-center gap-2">
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-red-400/50" />
            <div className="w-2 h-2 rounded-full bg-amber-400/50" />
            <div className="w-2 h-2 rounded-full bg-emerald-400/50" />
          </div>
          <div className="mx-auto bg-surface/50 rounded-md px-2 py-0.5 text-[8px] text-on-surface-variant font-medium border border-outline-variant/10 w-32 text-center truncate">
            {hostname}
          </div>
        </div>
        {/* Screenshot Container */}
        <div className="relative aspect-[16/10] overflow-hidden rounded-b-xl border-x border-b border-outline-variant/30 shadow-2xl transition-all duration-700 group-hover:shadow-primary/5 bg-surface-container">
          <img
            src={screenshotUrl}
            alt={`${title} live preview`}
            loading="lazy"
            className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        </div>
      </div>
    );
  };

  return (
    <div className="bg-surface text-on-surface font-body selection:bg-primary/20 selection:text-primary min-h-screen transition-colors duration-300">
      <Navbar />

      <main className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8">Our Brands</h1>
            <p className="text-xl text-on-surface-variant leading-relaxed font-medium">
              A collection of digital products built under Cosy Content. Each brand represents a different problem solved through clean design, simple user experience, and scalable thinking.
            </p>
          </motion.div>

          <div className="grid gap-20">
            {brands.map((brand, idx) => (
              <motion.div
                key={brand.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.1 }}
                className="group relative"
              >
                <div className={`flex flex-col ${idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 lg:gap-20 items-center`}>
                  {/* Brand Details */}
                  <div className="lg:w-5/12 space-y-8">
                    <div className={`w-16 h-16 ${brand.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-sm`}>
                      {brand.icon}
                    </div>
                    <div>
                      <h2 className="text-5xl font-black mb-4 tracking-tight">{brand.name}</h2>
                      <p className="text-primary font-bold text-xl mb-6">{brand.tagline}</p>
                      <p className="text-on-surface-variant leading-relaxed text-lg font-medium">
                        {brand.description}
                      </p>
                    </div>

                    <div className="grid sm:grid-cols-1 gap-4">
                      {brand.delivers.map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                            <Check className="w-3 h-3 text-primary" strokeWidth={3} />
                          </div>
                          <span className="text-on-surface-variant font-bold text-sm">{item}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4">
                      <a 
                        href={brand.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 bg-on-surface text-surface px-10 py-5 rounded-2xl font-black text-lg hover:shadow-2xl transition-all active:scale-95 group/btn"
                      >
                        Visit Site 
                        <ArrowUpRight className="w-5 h-5 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                      </a>
                    </div>
                    
                    <p className="text-xs italic text-on-surface-variant/60 font-medium">
                      {brand.footer}
                    </p>
                  </div>

                  {/* Brand Preview */}
                  <div className="lg:w-7/12 w-full">
                    <BrowserPreview siteUrl={brand.link} title={brand.name} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>


          <section className="mt-20 md:mt-32 py-16 md:py-24 px-4 md:px-8 bg-primary/5 rounded-[2rem] md:rounded-[3rem] border border-primary/10">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-black mb-8 md:mb-12 tracking-tight">Built with Purpose</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 text-left">
                {[
                  { title: 'Simplicity over complexity', icon: <Layout className="w-5 h-5" /> },
                  { title: 'Speed over unnecessary features', icon: <Zap className="w-5 h-5" /> },
                  { title: 'Design that serves function', icon: <Target className="w-5 h-5" /> },
                  { title: 'Scalable from day one', icon: <Cpu className="w-5 h-5" /> }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-5 md:p-6 bg-surface rounded-2xl border border-outline-variant/10 shadow-sm">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                      {item.icon}
                    </div>
                    <span className="font-bold text-base md:text-lg">{item.title}</span>
                  </div>
                ))}
              </div>
              <p className="mt-8 md:mt-12 text-lg md:text-xl text-on-surface-variant font-medium">
                At Cosy Content, every project is built with the same principles. We don’t just build websites — we build digital products that are designed to work.
              </p>
            </div>
          </section>

          <section className="mt-20 md:mt-32 text-center pb-20 px-4">
            <h2 className="text-2xl md:text-3xl font-black mb-4">More Coming Soon</h2>
            <p className="text-on-surface-variant font-medium mb-10 md:mb-12 max-w-2xl mx-auto text-base">
              We’re continuously building and launching new projects. Each one is an opportunity to refine our process and push our standards further.
            </p>
            <div className="bg-surface-container-high p-8 md:p-12 rounded-[2rem] md:rounded-[2.5rem] border border-outline-variant/20 inline-block w-full max-w-xl">
              <p className="text-xl md:text-2xl font-bold mb-8">🚀 Want something similar built for your business?</p>
              <Link to="/contact" className="bg-primary text-white px-8 md:px-10 py-4 md:py-5 rounded-2xl font-black text-base md:text-lg hover:shadow-2xl shadow-primary/20 transition-all inline-block w-full sm:w-auto active:scale-95">
                Get Your Website
              </Link>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OurBrands;
