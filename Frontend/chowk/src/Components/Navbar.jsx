import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import { Menu, X, LogOut, Shield } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useStore();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileOpen(false);
  };

  return (
    <nav className="w-full flex items-center justify-between px-6 py-4 bg-transparent relative z-50">
      {/* Logo Section */}
      <Link to="/" className="flex items-center gap-3">
        <div className="bg-[#b34b3f] text-[#f5f3ec] w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xl leading-none">
          च
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-bold font-serif leading-tight">Chowk</span>
          <span className="text-[10px] tracking-widest text-[#b34b3f] font-semibold leading-tight uppercase">
            Park The Valley
          </span>
        </div>
      </Link>
      
      {/* Center Links — Desktop */}
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">
        <Link to="/map" className="hover:text-black transition-colors">Find parking</Link>
        <a
          href="/#how-it-works"
          onClick={(e) => {
            if (window.location.pathname === '/') {
              e.preventDefault();
              document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          className="hover:text-black transition-colors cursor-pointer"
        >
          How it works
        </a>
        <a
          href="/#nearby-spots"
          onClick={(e) => {
            if (window.location.pathname === '/') {
              e.preventDefault();
              document.getElementById('nearby-spots')?.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          className="hover:text-black transition-colors cursor-pointer"
        >
          Nearby spots
        </a>
        <a
          href="/#list-your-space"
          onClick={(e) => {
            if (window.location.pathname === '/') {
              e.preventDefault();
              document.getElementById('list-your-space')?.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          className="hover:text-black transition-colors cursor-pointer"
        >
          List your space
        </a>
        {isAuthenticated && (
          <Link to="/admin" className="hover:text-black transition-colors flex items-center gap-1">
            <Shield size={14} />
            Admin
          </Link>
        )}
      </div>

      {/* Right Actions — Desktop */}
      <div className="hidden md:flex items-center gap-3">
        {isAuthenticated ? (
          <>
            <span className="text-xs text-gray-500 mr-2">{user?.email}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-red-600 transition-colors"
            >
              <LogOut size={16} />
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
          >
            Admin Login
          </Link>
        )}
        <Link 
          to="/map" 
          className="bg-[#121212] text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-black transition-colors"
        >
          Open map
        </Link>
      </div>

      {/* Mobile Hamburger */}
      <button
        className="md:hidden text-gray-700"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-xl border-t border-gray-100 p-6 flex flex-col gap-4 md:hidden z-50 animate-fade-in max-h-screen overflow-y-auto">
          <Link to="/map" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-gray-700 hover:text-black">
            Find parking
          </Link>
          <Link to="/#how-it-works" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-gray-700 hover:text-black">
            How it works
          </Link>
          <Link to="/#nearby-spots" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-gray-700 hover:text-black">
            Nearby spots
          </Link>
          {isAuthenticated && (
            <Link to="/admin" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-gray-700 hover:text-black flex items-center gap-1">
              <Shield size={14} /> Admin Dashboard
            </Link>
          )}
          <div className="h-px bg-gray-100 my-1"></div>
          {isAuthenticated ? (
            <button onClick={handleLogout} className="text-sm font-medium text-red-600 text-left flex items-center gap-1">
              <LogOut size={16} /> Logout
            </button>
          ) : (
            <Link to="/login" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-gray-600">
              Admin Login
            </Link>
          )}
          <Link 
            to="/map" 
            onClick={() => setMobileOpen(false)}
            className="bg-[#121212] text-white px-5 py-2.5 rounded-full text-sm font-medium text-center hover:bg-black transition-colors"
          >
            Open map
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
