import { motion } from 'framer-motion';
import { Mail, Phone, Clock, Send } from 'lucide-react';
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
      <main className="pt-32 md:pt-44 pb-20 md:pb-32 px-4 md:px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-center lg:text-left"
          >
            <h1 className="text-4xl md:text-6xl font-black mb-6 md:mb-8 tracking-tighter">Contact Us</h1>
            <p className="text-xl md:text-2xl text-on-surface-variant font-medium leading-relaxed mb-10 md:mb-12">
              We’re here to help. If you have any questions about our services or your website, feel free to reach out.
            </p>

            <div className="space-y-4 md:space-y-8 max-w-xl mx-auto lg:mx-0">
              <div className="flex items-center gap-4 md:gap-6 p-5 md:p-6 bg-surface-container-low rounded-2xl md:rounded-3xl border border-outline-variant/10">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-primary/10 rounded-xl md:rounded-2xl flex items-center justify-center text-primary flex-shrink-0">
                  <Clock className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-base md:text-lg">Response Time</h3>
                  <p className="text-on-surface-variant text-sm md:text-base font-medium">We aim to respond within 2-3 business days.</p>
                </div>
              </div>

              <div className="flex items-center gap-4 md:gap-6 p-5 md:p-6 bg-surface-container-low rounded-2xl md:rounded-3xl border border-outline-variant/10">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-secondary/10 rounded-xl md:rounded-2xl flex items-center justify-center text-secondary flex-shrink-0">
                  <Clock className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-base md:text-lg">Business Hours</h3>
                  <p className="text-on-surface-variant text-sm md:text-base font-medium">Monday – Friday, 9 a.m. to 5 p.m.</p>
                </div>
              </div>

              <div className="flex items-center gap-4 md:gap-6 p-5 md:p-6 bg-surface-container-low rounded-2xl md:rounded-3xl border border-outline-variant/10">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-primary/10 rounded-xl md:rounded-2xl flex items-center justify-center text-primary flex-shrink-0">
                  <Mail className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-base md:text-lg">Email</h3>
                  <p className="text-on-surface-variant text-sm md:text-base font-medium">contact@cosycontent.com</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-surface-container-low p-6 md:p-12 rounded-[2rem] md:rounded-[3rem] border border-outline-variant/20 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            
            <h2 className="text-2xl md:text-3xl font-black mb-6 md:mb-8 relative z-10">Get in Touch</h2>
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="block text-[10px] md:text-sm font-black uppercase tracking-widest text-on-surface-variant mb-2 ml-4">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-5 md:px-6 py-3 md:py-4 bg-surface border border-outline-variant/50 rounded-xl md:rounded-2xl focus:border-primary outline-none transition-all font-medium text-sm md:text-base"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-[10px] md:text-sm font-black uppercase tracking-widest text-on-surface-variant mb-2 ml-4">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-5 md:px-6 py-3 md:py-4 bg-surface border border-outline-variant/50 rounded-xl md:rounded-2xl focus:border-primary outline-none transition-all font-medium text-sm md:text-base"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] md:text-sm font-black uppercase tracking-widest text-on-surface-variant mb-2 ml-4">Message</label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-5 md:px-6 py-3 md:py-4 bg-surface border border-outline-variant/50 rounded-xl md:rounded-2xl focus:border-primary outline-none transition-all font-medium resize-none text-sm md:text-base"
                  placeholder="How can we help you?"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full bg-primary text-white py-4 md:py-5 rounded-xl md:rounded-2xl font-black text-base md:text-lg hover:shadow-2xl shadow-primary/30 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-70"
              >
                {status === 'sending' ? 'Sending...' : (
                  <>Send Message <Send className="w-5 h-5" /></>
                )}
              </button>

              {status === 'success' && (
                <p className="text-center font-bold text-primary mt-4 text-sm md:text-base">Message sent successfully! We'll be in touch soon.</p>
              )}
              {status === 'error' && (
                <p className="text-center font-bold text-red-500 mt-4 text-sm md:text-base">Failed to send message. Please try again.</p>
              )}
            </form>

            <div className="mt-8 md:mt-12 pt-8 md:pt-12 border-t border-outline-variant/10 text-center">
              <p className="text-lg md:text-xl font-bold mb-4 md:mb-6">Want a new or upgraded website?</p>
              <Link to="/signup" className="text-primary font-black hover:underline inline-flex items-center gap-2 text-sm md:text-base">
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
