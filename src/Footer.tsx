import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="py-20 border-t border-outline-variant/10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-12 flex flex-col md:flex-row justify-between items-start gap-12">
        <div className="max-w-xs">
          <div className="text-2xl font-black tracking-tighter mb-6">Cosy Content</div>
          <p className="text-on-surface-variant font-medium leading-relaxed">
            Modern websites in 24 hours. No stress, just results.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-16">
          <div>
            <h4 className="font-bold mb-6 text-xs tracking-widest uppercase text-on-surface-variant">Navigation</h4>
            <ul className="space-y-4 text-on-surface-variant font-medium">
              <li><Link to="/#services" className="hover:text-primary transition-colors">Services</Link></li>
              <li><Link to="/#pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link to="/our-brands" className="hover:text-primary transition-colors">Our Brands</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-xs tracking-widest uppercase text-on-surface-variant">Legal</h4>
            <ul className="space-y-4 text-on-surface-variant font-medium">
              <li><Link to="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms-conditions" className="hover:text-primary transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/cookie-policy" className="hover:text-primary transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-12 mt-20 pt-8 border-t border-outline-variant/5 text-sm text-on-surface-variant/60 font-medium">
        Copyright 2026 © Cosy Content Limited. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
