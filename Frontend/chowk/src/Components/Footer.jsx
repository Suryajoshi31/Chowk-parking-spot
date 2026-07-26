import React from 'react';
import { Link } from 'react-router-dom';

const scrollTo = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
};

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#f5f3ec] border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-14">

        {/* Top Row */}
        <div className="flex flex-col lg:flex-row justify-between gap-12">

          {/* Brand */}
          <div className="max-w-xs">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="bg-[#b34b3f] text-[#f5f3ec] w-9 h-9 rounded-lg flex items-center justify-center font-bold text-lg leading-none shrink-0">
                च
              </div>
              <span className="text-xl font-bold font-serif text-[#121212]">Chowk</span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed">
              Built for the valley's traffic, one spot at a time. Covering Kathmandu, Lalitpur and Bhaktapur.
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-3 gap-10 lg:gap-20 text-sm">

            {/* Product */}
            <div>
              <h4 className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-4">
                Product
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/"
                    className="text-gray-600 hover:text-[#121212] transition-colors"
                  >
                    Find parking
                  </Link>
                </li>
                <li>
                  <a
                    href="/#how-it-works"
                    onClick={(e) => {
                      if (window.location.pathname === '/') {
                        e.preventDefault();
                        scrollTo('how-it-works');
                      }
                    }}
                    className="text-gray-600 hover:text-[#121212] transition-colors cursor-pointer"
                  >
                    How it works
                  </a>
                </li>
                <li>
                  <a
                    href="/#list-your-space"
                    onClick={(e) => {
                      if (window.location.pathname === '/') {
                        e.preventDefault();
                        scrollTo('list-your-space');
                      }
                    }}
                    className="text-gray-600 hover:text-[#121212] transition-colors cursor-pointer"
                  >
                    List your space
                  </a>
                </li>
              </ul>
            </div>

            {/* Districts */}
            <div>
              <h4 className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-4">
                Districts
              </h4>
              <ul className="space-y-3">
                {['Kathmandu', 'Lalitpur', 'Bhaktapur'].map((d) => (
                  <li key={d}>
                    <span className="text-gray-600">{d}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-4">
                Company
              </h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-600 hover:text-[#121212] transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-[#121212] transition-colors">
                    Support
                  </a>
                </li>
              </ul>
            </div>

          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-400">
          <span>© {currentYear} Chowk</span>
          <span>Kathmandu Valley, Nepal</span>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
