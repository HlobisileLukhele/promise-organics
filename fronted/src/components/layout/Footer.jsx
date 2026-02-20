import { BsEnvelopeAt } from "react-icons/bs";
import { FiPhoneCall } from "react-icons/fi";
import { Link } from 'react-router-dom';

import PromiseLogo from "@/assets/promise-logo.png";

const Footer = () => {

  const linkClass = "text-sm text-white/90 mb-2 hover:text-[#C9B8A8] hover:translate-x-1 duration-200 transition-all inline-block";

  return (
    <div className="w-full" id="footer">
      <footer className="w-full bg-gradient-to-br from-[#7a8c72] via-[#8B9D83] to-[#9a9f8e]">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Brand Section */}
            <div className="text-center md:text-left">
              <a className="flex items-center justify-center md:justify-start mb-4">
                <img 
                  src={PromiseLogo} 
                  alt="promise organics logo" 
                  className="w-40 h-auto " 
                />
              </a>
              <p className="text-sm text-white/80 leading-relaxed">
                Nourish your hair with our organic haircare collection. Infused with avocado and rosemary, crafted with love and 100% natural ingredients.
              </p>
              
              {/* Trust Badges */}
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#C9B8A8]/20 border border-[#C9B8A8]/30 rounded-full backdrop-blur-sm">
                  <svg className="w-3.5 h-3.5 text-[#C9B8A8]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2z"/>
                  </svg>
                  <span className="text-xs text-white font-medium">100% Natural</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#C9B8A8]/20 border border-[#C9B8A8]/30 rounded-full backdrop-blur-sm">
                  <span className="text-xs text-white font-medium">Eco Packaging</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="text-center md:text-left text-white">
              <h2 className="text-base md:text-lg font-semibold tracking-wide mb-6 relative inline-block">
                Quick Links
                <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-[#C9B8A8] to-transparent -mb-2"></span>
              </h2>
              <nav className="flex flex-col space-y-2.5">
                <Link to="#" className={linkClass}>Privacy Policy</Link>
                <Link to="#" className={linkClass}>Returns Policy</Link>
                <Link to="#" className={linkClass}>Terms & Conditions</Link>
                <Link to="#" className={linkClass}>Contact Us</Link>
              </nav>
            </div>

            {/* Products */}
            <div className="text-center md:text-left">
              <h2 className="text-base md:text-lg text-white font-semibold tracking-wide mb-6 relative inline-block">
                Products
                <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-[#C9B8A8] to-transparent -mb-2"></span>
              </h2>
              <nav className="flex flex-col space-y-2.5">
                <Link to="#" className={linkClass}>Shampoo</Link>
                <Link to="#" className={linkClass}>Hair Oil</Link>
                <Link to="#" className={linkClass}>Butter</Link>
                <Link to="#" className={linkClass}>Conditioner</Link>
              </nav>
            </div>

            {/* Contact */}
            <div className="text-center md:text-left">
              <h2 className="text-base md:text-lg font-semibold text-white tracking-wide mb-6 relative inline-block">
                Contact
                <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-[#C9B8A8] to-transparent -mb-2"></span>
              </h2>
              <nav className="flex flex-col space-y-4">
                <a 
                  href="mailto:promiseorganics.co.za" 
                  className="flex items-center justify-center md:justify-start text-sm text-white/90 group"
                >
                  <div className="w-8 h-8 rounded-full bg-[#C9B8A8]/20 border border-[#C9B8A8]/30 flex items-center justify-center mr-3 group-hover:bg-[#C9B8A8] group-hover:border-[#C9B8A8] transition-colors">
                    <BsEnvelopeAt className="w-4 h-4 group-hover:text-white transition-colors" />
                  </div>
                  <span className="group-hover:text-[#C9B8A8] duration-200">info@promiseorganics.co.za</span>
                </a>
                
                <a 
                  href="tel:+27796161262" 
                  className="flex items-center justify-center md:justify-start text-sm text-white/90 group"
                >
                  <div className="w-8 h-8 rounded-full bg-[#C9B8A8]/20 border border-[#C9B8A8]/30 flex items-center justify-center mr-3 group-hover:bg-[#C9B8A8] group-hover:border-[#C9B8A8] transition-colors">
                    <FiPhoneCall className="w-4 h-4 group-hover:text-white transition-colors" />
                  </div>
                  <span className="group-hover:text-[#C9B8A8] duration-200">+27 79 616 1262</span>
                </a>
                
                {/* Social Media */}
                <div className="pt-2">
                  <p className="text-md text-[#ffff]/80  mb-3 text-center md:text-left font-medium">Follow Us</p>
                  <div className="flex justify-center md:justify-start space-x-3">
                    <a 
                      href="https://www.facebook.com/share/1DZKCKsd5y/?mibextid=wwXIfr" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-[#C9B8A8]/20 border border-[#C9B8A8]/30 flex items-center justify-center text-white hover:bg-[#C9B8A8] hover:border-[#C9B8A8] hover:scale-110 transition-all duration-200 group"
                    >
                      <svg fill="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                      </svg>
                    </a>
                    <a 
                      href="https://www.instagram.com/promise_organics/" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-[#C9B8A8]/20 border border-[#C9B8A8]/30 flex items-center justify-center text-white hover:bg-[#C9B8A8] hover:border-[#C9B8A8] hover:scale-110 transition-all duration-200 group"
                    >
                      <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                        <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                        <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path>
                      </svg>
                    </a>
                    
                  </div>
                </div>
              </nav>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="bg-[#6d7c6e]/40 border-t border-[#C9B8A8]/20 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-5">
            <div className="flex flex-col md:flex-row justify-center items-center gap-3">
              <p className="text-sm text-white/80 text-center md:text-left">
                &copy; 2026 Promise Organics. All Rights Reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;