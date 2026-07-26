import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import HowItWorks from '../Components/HowItWorks';
import NearbySpots from '../Components/Nearbyspots';
import ListYourSpace from '../Components/ListYourSpace';
import Footer from '../Components/Footer';
import { getParkingStats } from '../services/api';

const Landing = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getParkingStats();
        setStats(res.data);
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      }
    };
    fetchStats();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/map?search=${encodeURIComponent(searchValue.trim())}`);
    } else {
      navigate('/map');
    }
  };

  const handleFilterClick = (type) => {
    navigate(`/map?filter=${type}`);
  };

  return (
    <div className="min-h-screen bg-[#f5f3ec] text-[#121212] flex flex-col font-sans">
      
      {/* ── Hero Section ── */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 flex flex-col lg:flex-row items-center gap-12 lg:gap-24 relative overflow-hidden">
        
        {/* Left Side Content */}
        <div className="flex-1 w-full flex flex-col">
          <div className="flex items-center gap-4 text-xs font-semibold tracking-widest text-gray-500 mb-6 uppercase">
            <div className="w-8 h-px bg-gray-400"></div>
            KATHMANDU &middot; LALITPUR &middot; BHAKTAPUR
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-serif font-bold leading-[1.1] mb-8 text-[#121212]">
            Stop circling the <br/> block, <span className="text-[#b34b3f] italic font-medium">chowk</span> after <br/> chowk.
          </h1>
          
          <p className="text-gray-600 text-lg mb-12 max-w-lg leading-relaxed">
            Chowk maps every free and paid parking spot across the valley in real time, then routes you there — past the traffic, not through it.
          </p>
          
        {/* Search Box — wired to navigate to map */}
          <form onSubmit={handleSearch} className="bg-white rounded-full p-1.5 sm:p-2 flex items-center justify-between max-w-lg shadow-sm border border-gray-100 mb-6">
            <input 
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search an area — Thamel, Patan, Boudha..." 
              className="flex-1 bg-transparent border-none outline-none px-3 sm:px-4 text-sm sm:text-base text-gray-700 placeholder-gray-400"
            />
            <button
              type="submit"
              className="bg-[#b34b3f] text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium hover:bg-[#9c3f35] transition-colors shrink-0"
            >
              Search
            </button>
          </form>
          
          {/* Filters — navigate to map with filter */}
          <div className="flex items-center gap-2 sm:gap-3 mb-16 flex-wrap">
            <button
              onClick={() => handleFilterClick('ALL')}
              className="bg-[#121212] text-white px-3 sm:px-5 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-sm font-medium"
            >
              All spots
            </button>
            <button
              onClick={() => handleFilterClick('FREE')}
              className="bg-white border border-gray-200 text-gray-700 px-3 sm:px-5 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-sm font-medium flex items-center gap-1 sm:gap-2 hover:bg-gray-50 transition-colors"
            >
              <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-green-500"></span> Free
            </button>
            <button
              onClick={() => handleFilterClick('PAID')}
              className="bg-white border border-gray-200 text-gray-700 px-3 sm:px-5 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-sm font-medium flex items-center gap-1 sm:gap-2 hover:bg-gray-50 transition-colors"
            >
              <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-amber-500"></span> Paid
            </button>
            <button
              onClick={() => handleFilterClick('GOVERNMENT')}
              className="bg-white border border-gray-200 text-gray-700 px-3 sm:px-5 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-sm font-medium flex items-center gap-1 sm:gap-2 hover:bg-gray-50 transition-colors"
            >
              <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-blue-500"></span> Govt
            </button>
          </div>
          
          <div className="w-full h-px bg-gray-200 mb-8 max-w-lg"></div>
          
          {/* Stats — from API */}
          <div className="flex items-start gap-8 sm:gap-12 flex-wrap">
            <div>
              <div className="text-xl sm:text-2xl font-bold text-[#121212]">
                {stats ? stats.totalLocations.toLocaleString() : '—'}
              </div>
              <div className="text-xs sm:text-sm text-gray-500 mt-1">spots mapped</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-[#121212]">
                {stats ? stats.districtsCount : '—'}
              </div>
              <div className="text-xs sm:text-sm text-gray-500 mt-1">districts covered</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-[#121212]">
                {stats ? stats.totalSlots.toLocaleString() : '—'}
              </div>
              <div className="text-xs sm:text-sm text-gray-500 mt-1">total slots</div>
            </div>
          </div>
        </div>
        
        {/* Right Side Illustration */}
        <div className="flex-1 w-full lg:max-w-md relative flex justify-center mt-12 lg:mt-0">
          <div className="bg-white rounded-3xl p-4 shadow-xl w-full relative z-10 border border-gray-100 overflow-hidden">
            {/* Top header */}
            <div className="flex justify-between items-center mb-4 px-2 pt-2">
              <div className="flex items-center gap-2 text-sm font-bold">
                <span className="w-2 h-2 rounded-full border-2 border-green-500 flex items-center justify-center p-1.5"><span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span></span>
                Live near Basantapur
              </div>
              <div className="flex gap-3 text-xs text-gray-500 font-medium">
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Free</span>
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Paid</span>
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#b34b3f]"></span> You</span>
              </div>
            </div>
            
            {/* Map abstract illustration */}
            <div className="bg-[#e8e4d8] rounded-2xl h-80 relative overflow-hidden mb-4 rounded-b-none -mx-4 -mt-2 -mb-8 pb-12">
              {/* Abstract curvy road */}
              <svg viewBox="0 0 400 300" className="w-full h-full absolute inset-0 text-[#b5cbd4]" preserveAspectRatio="none">
                <path d="M-50,200 C100,100 200,250 450,150" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
              </svg>
              
              {/* Map points */}
              <div className="absolute top-[40%] left-[20%] w-3 h-3 rounded-full bg-green-600 border-2 border-white shadow-sm z-10"></div>
              <div className="absolute top-[60%] left-[30%] w-3 h-3 rounded-full bg-green-600 border-2 border-white shadow-sm z-10"></div>
              
              <div className="absolute top-[45%] left-[50%] w-3 h-3 rounded-full bg-amber-500 border-2 border-white shadow-sm z-10"></div>
              <div className="absolute top-[35%] left-[70%] w-3 h-3 rounded-full bg-amber-500 border-2 border-white shadow-sm z-10"></div>
              <div className="absolute top-[50%] left-[85%] w-3 h-3 rounded-full bg-amber-500 border-2 border-white shadow-sm z-10"></div>
              
              {/* Blue govt markers */}
              <div className="absolute top-[30%] left-[60%] w-3 h-3 rounded-full bg-blue-500 border-2 border-white shadow-sm z-10"></div>

              {/* You / Active Route */}
              <div className="absolute top-[55%] left-[22%]">
                <div className="w-4 h-4 rounded-full border-[3px] border-[#b34b3f] flex items-center justify-center relative">
                  <div className="w-1.5 h-1.5 bg-[#b34b3f] rounded-full"></div>
                  {/* Ripple effect */}
                  <div className="absolute w-8 h-8 rounded-full border border-[#b34b3f] opacity-40 animate-ping"></div>
                </div>
              </div>
              
              {/* Dashed route line */}
              <svg viewBox="0 0 400 300" className="w-full h-full absolute inset-0 pointer-events-none">
                <path d="M100,170 L200,140 L280,105 L340,150" fill="none" stroke="#a09d92" strokeWidth="2" strokeDasharray="4 4" />
              </svg>
            </div>
            
            {/* Bottom info card */}
            <div className="bg-white rounded-2xl p-4 shadow-lg flex items-center justify-between relative z-20 mx-2 mb-2">
              <div>
                <h3 className="font-bold text-[#121212] mb-1">Thamel Chowk Parking</h3>
                <p className="text-xs text-gray-500">0.4 km &middot; about 5 min &middot; Rs 50/hr</p>
              </div>
              <Link to="/map" className="bg-[#121212] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-black transition-colors">
                Start navigation
              </Link>
            </div>
          </div>
          
          {/* Decorative background shape */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] max-w-[500px] max-h-[500px] bg-[#e3decf] rounded-full mix-blend-multiply filter blur-3xl opacity-50 z-0"></div>
        </div>
      </main>

      {/* ── How It Works Section ── */}
      <HowItWorks />

      {/* ── Nearby Spots Section ── */}
      <NearbySpots />

      {/* ── List Your Space Section ── */}
      <ListYourSpace />

      {/* ── Footer ── */}
      <Footer />

    </div>
  );
};

export default Landing;
