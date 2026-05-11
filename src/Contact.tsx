import { motion } from 'framer-motion';
import { Mail, Clock, Send } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/contact-us/`, formData);
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <div className="bg-surface text-on-surface font-body transition-colors duration-300 min-h-screen">
      <Navbar />
      <main className="pt-24 md:pt-32 pb-16 md:pb-24 px-4 md:px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-center lg:text-left"
          >
            <h1 className="text-3xl md:text-5xl font-black mb-4 md:mb-6 tracking-tighter">Contact Us</h1>
            <p className="text-lg md:text-xl text-on-surface-variant font-medium leading-relaxed mb-8 md:mb-10">
              We’re here to help. If you have any questions about our services or your website, feel free to reach out.
            </p>

            <div className="space-y-3 md:space-y-4 max-w-xl mx-auto lg:mx-0">
              <div className="flex items-center gap-3 md:gap-4 p-4 md:p-5 bg-surface-container-low rounded-xl md:rounded-2xl border border-outline-variant/10">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-sm md:text-base">Response Time</h3>
                  <p className="text-on-surface-variant text-xs md:text-sm font-medium">We aim to respond within 2-3 business days.</p>
                </div>
              </div>

              <div className="flex items-center gap-3 md:gap-4 p-4 md:p-5 bg-surface-container-low rounded-xl md:rounded-2xl border border-outline-variant/10">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary flex-shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-sm md:text-base">Business Hours</h3>
                  <p className="text-on-surface-variant text-xs md:text-sm font-medium">Monday – Friday, 9 a.m. to 5 p.m.</p>
                </div>
              </div>

              <div className="flex items-center gap-3 md:gap-4 p-4 md:p-5 bg-surface-container-low rounded-xl md:rounded-2xl border border-outline-variant/10">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-sm md:text-base">Email</h3>
                  <p className="text-on-surface-variant text-xs md:text-sm font-medium">contact@cosycontent.com</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-surface-container-low dark:bg-surface-container-high p-6 md:p-10 rounded-2xl md:rounded-3xl border border-outline-variant/20 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            
            <h2 className="text-xl md:text-2xl font-black mb-6 relative z-10">Get in Touch</h2>
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] md:text-xs font-black uppercase tracking-widest text-on-surface-variant mb-1.5 ml-3">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-surface border border-outline-variant/50 rounded-xl focus:border-primary outline-none transition-all font-medium text-sm"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-[9px] md:text-xs font-black uppercase tracking-widest text-on-surface-variant mb-1.5 ml-3">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-surface border border-outline-variant/50 rounded-xl focus:border-primary outline-none transition-all font-medium text-sm"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[9px] md:text-xs font-black uppercase tracking-widest text-on-surface-variant mb-1.5 ml-3">Message</label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 bg-surface border border-outline-variant/50 rounded-xl focus:border-primary outline-none transition-all font-medium resize-none text-sm"
                  placeholder="How can we help you?"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full bg-primary text-white py-3.5 rounded-xl font-black text-base hover:shadow-2xl shadow-primary/30 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {status === 'sending' ? 'Sending...' : (
                  <>Send Message <Send className="w-4 h-4" /></>
                )}
              </button>

              {status === 'success' && (
                <p className="text-center font-bold text-primary mt-3 text-xs md:text-sm">Message sent successfully! We'll be in touch soon.</p>
              )}
              {status === 'error' && (
                <p className="text-center font-bold text-red-500 mt-3 text-xs md:text-sm">Failed to send message. Please try again.</p>
              )}
            </form>

            <div className="mt-8 pt-8 border-t border-outline-variant/10 text-center">
              <p className="text-base md:text-lg font-bold mb-3">Want a new or upgraded website?</p>
              <Link to="/signup" className="text-primary font-black hover:underline inline-flex items-center gap-2 text-xs md:text-sm">
                Fill out the application form here →
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
