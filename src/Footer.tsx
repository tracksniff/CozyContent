import { Link } from 'react-router-dom';
import logo from './assets/Logo JPG/Cosy_Content_Ltd_-_Horizontal_2-removebg-preview.png';
import facebook from './assets/Social Media Icons/Cosy Content Ltd - Facebook.png';
import instagram from './assets/Social Media Icons/Cosy Content Ltd - Instagram.png';
import linkedin from './assets/Social Media Icons/Cosy Content Ltd - Linkedin.png';
import tiktok from './assets/Social Media Icons/Cosy Content Ltd - TikTok.png';

const Footer = () => {
  return (
    <footer className="py-16 md:py-20 border-t border-outline-variant/10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-start gap-12 md:gap-8">
        <div className="max-w-xs">
          <div className="flex items-center gap-2 mb-4 md:mb-6">
            <img src={logo} alt="Cosy Content Logo" className="h-20 w-auto object-contain dark:invert" />
          </div>
          <p className="text-on-surface-variant font-medium leading-relaxed text-sm md:text-base mb-8">
            Modern websites in 24 hours. No stress, just results.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:scale-110 transition-transform">
              <img src={facebook} alt="Facebook" className="w-6 h-6 object-contain grayscale hover:grayscale-0 transition-all" />
            </a>
            <a href="#" className="hover:scale-110 transition-transform">
              <img src={instagram} alt="Instagram" className="w-6 h-6 object-contain grayscale hover:grayscale-0 transition-all" />
            </a>
            <a href="#" className="hover:scale-110 transition-transform">
              <img src={linkedin} alt="Linkedin" className="w-6 h-6 object-contain grayscale hover:grayscale-0 transition-all" />
            </a>
            <a href="#" className="hover:scale-110 transition-transform">
              <img src={tiktok} alt="TikTok" className="w-6 h-6 object-contain grayscale hover:grayscale-0 transition-all" />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-16 w-full md:w-auto">
          <div>
            <h4 className="font-bold mb-4 md:mb-6 text-[10px] md:text-xs tracking-widest uppercase text-on-surface-variant">Navigation</h4>
            <ul className="space-y-3 md:space-y-4 text-on-surface-variant font-medium text-sm md:text-base">
              <li><Link to="/#services" className="hover:text-primary transition-colors">Services</Link></li>
              <li><Link to="/#pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link to="/our-brands" className="hover:text-primary transition-colors">Our Brands</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 md:mb-6 text-[10px] md:text-xs tracking-widest uppercase text-on-surface-variant">Legal</h4>
            <ul className="space-y-3 md:space-y-4 text-on-surface-variant font-medium text-sm md:text-base">
              <li><Link to="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms-conditions" className="hover:text-primary transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/cookie-policy" className="hover:text-primary transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-12 md:mt-20 pt-8 border-t border-outline-variant/5 text-xs md:text-sm text-on-surface-variant/60 font-medium">
        Copyright 2026 © Cosy Content Limited. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
