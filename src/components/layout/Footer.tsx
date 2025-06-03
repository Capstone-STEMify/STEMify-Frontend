import React from 'react';
import { Facebook, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer 
      className="relative text-white bg-cover bg-center bg-no-repeat overflow-hidden"
      style={{
        background: "url('/images/footer.png')",
        minHeight: '400px'
      }}
    > 
      <div className="absolute top-4 left-8 z-10">
        <img 
          src="/images/balloon.png" 
          alt="Hot Air Balloon" 
          className="w-16 h-20 object-contain"
        />
      </div>

      <div className="absolute top-8 right-80 z-10">
        <img 
          src="/images/dino.png" 
          alt="Dinosaur" 
          className="w-30 h-30 object-contain"
        />
      </div>

      <div className="relative pt-36 pb-8 px-4 sm:px-6 lg:px-8 z-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Information For Parents</h3>
              <p className="text-sm leading-relaxed opacity-90">
                We provide nurturing environment with developmentally appropriate 
                activities and opportunities
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold mb-4">Info</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-blue-100 transition-colors">
                    Home page
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-100 transition-colors">
                    About us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-100 transition-colors">
                    Our news
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold mb-4">Education</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-blue-100 transition-colors">
                    Our Programs
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-100 transition-colors">
                    Our team
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-100 transition-colors">
                    Full day programs
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold mb-4">Help</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-blue-100 transition-colors">
                    Knowledge base
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-100 transition-colors">
                    Video tutorials
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-100 transition-colors">
                    Contact us
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center pt-8 border-t border-white border-opacity-20">
            <div className="text-sm opacity-90 mb-4 sm:mb-0">
              <span>© 2025 STEMH. </span>
              <a href="#" className="hover:text-blue-100 transition-colors">
                Website Development
              </a>
              <span className="mx-2">-</span>
              <a href="#" className="text-yellow-300 hover:text-yellow-200 transition-colors">
                Designed
              </a>
            </div>

            <div className="flex space-x-3">
              <a 
                href="#" 
                className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-all duration-200"
                aria-label="Facebook"
              >
                <Facebook size={20} className="text-white" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center hover:bg-pink-600 transition-all duration-200"
                aria-label="Instagram"
              >
                <Instagram size={20} className="text-white" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-black rounded-full flex items-center justify-center hover:bg-gray-800 transition-all duration-200"
                aria-label="X (Twitter)"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-white">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;