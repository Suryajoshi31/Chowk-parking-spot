import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllParkingLocations } from '../services/api';
import { Bike, Car } from 'lucide-react';

const SpotCard = ({ spot, userLocation }) => {
  const fillPercent = spot.totalSlots > 0 ? Math.round((spot.availableSlots / spot.totalSlots) * 100) : 0;
  const isLow = fillPercent <= 20;
  const isFree = spot.type === 'FREE';
  const isGovt = spot.type === 'GOVERNMENT';

  // Calculate distance if user location available
  let distance = null;
  if (userLocation) {
    const R = 6371;
    const dLat = ((spot.lat - userLocation.lat) * Math.PI) / 180;
    const dLng = ((spot.lng - userLocation.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((userLocation.lat * Math.PI) / 180) * Math.cos((spot.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
    distance = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col gap-3 hover:shadow-md hover:border-gray-200 transition-all duration-300 hover:-translate-y-0.5">
      {/* Name + Badge */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-base font-bold text-[#121212] leading-snug font-serif">
          {spot.name}
        </h3>
        <span
          className={`shrink-0 text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full ${
            isFree
              ? 'bg-green-50 text-green-700 border border-green-200'
              : isGovt
              ? 'bg-blue-50 text-blue-700 border border-blue-200'
              : 'bg-amber-50 text-amber-700 border border-amber-200'
          }`}
        >
          {spot.type}
        </span>
      </div>

      {/* Area + District */}
      <p className="text-xs text-gray-400 font-medium -mt-1">
        {spot.address} · <span className="text-gray-500">{spot.district}</span>
      </p>

      {/* Vehicle types */}
      <div className="flex gap-1.5">
        {spot.vehicleType?.map((type) => (
          <span key={type} className="text-[10px] bg-slate-50 text-slate-500 px-2 py-0.5 rounded-full flex items-center gap-0.5 border border-slate-100">
            {type === 'BIKE' ? <Bike size={10} /> : <Car size={10} />}
            {type}
          </span>
        ))}
      </div>

      {/* Availability + Distance */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>
            <span className="font-semibold text-[#121212]">{spot.availableSlots}</span> of {spot.totalSlots} open
          </span>
          {distance !== null && (
            <span className="font-medium text-gray-600">{distance.toFixed(1)} km</span>
          )}
        </div>
        {/* Progress bar */}
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isFree || isGovt
                ? 'bg-[#121212]'
                : isLow
                ? 'bg-red-400'
                : 'bg-[#b34b3f]'
            }`}
            style={{ width: `${fillPercent}%` }}
          />
        </div>
      </div>

      {/* Price + Get route */}
      <div className="flex items-center justify-between mt-1">
        <span className="text-sm text-gray-500">
          {isFree || isGovt ? (
            <span className="italic text-gray-400">{isGovt ? 'Government' : 'No charge'}</span>
          ) : (
            <>
              <span className="font-semibold text-[#121212]">Rs {spot.pricePerHour}</span>
              <span className="text-xs text-gray-400"> /hr</span>
            </>
          )}
        </span>
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${spot.lat},${spot.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold text-[#b34b3f] hover:text-[#9c3f35] transition-colors"
        >
          Get route →
        </a>
      </div>
    </div>
  );
};

const NearbySpots = () => {
  const [filter, setFilter] = useState('ALL');
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    const fetchSpots = async () => {
      try {
        const res = await getAllParkingLocations();
        setSpots(res.data);
      } catch (err) {
        console.error('Failed to fetch spots:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSpots();

    // Try to get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => {}
      );
    }
  }, []);

  const filtered = filter === 'ALL' ? spots : spots.filter((s) => s.type === filter);
  // Show first 6
  const displaySpots = filtered.slice(0, 6);

  return (
    <section id="nearby-spots" className="w-full bg-[#f5f3ec] pt-8 pb-20 lg:pt-12 lg:pb-28">
      <div className="max-w-7xl mx-auto px-6">

        {/* Section Label */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-px bg-gray-400" />
          <span className="text-xs font-semibold tracking-widest text-gray-500 uppercase">
            Across the Valley, right now
          </span>
        </div>

        {/* Headline */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <h2 className="text-4xl lg:text-5xl font-serif font-bold text-[#121212] leading-tight">
            {loading ? 'Loading spots...' : `${filtered.length} spots across the valley`}
          </h2>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 shrink-0">
            {['ALL', 'FREE', 'PAID', 'GOVERNMENT'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  filter === f
                    ? 'bg-[#121212] text-white'
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                {f === 'ALL' ? 'All spots' : f === 'FREE' ? '🟢 Free' : f === 'PAID' ? '🟡 Paid' : '🔵 Govt'}
              </button>
            ))}
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
          {loading
            ? [1, 2, 3].map((i) => (
                <div key={i} className="h-48 bg-white rounded-2xl border border-gray-100 animate-pulse"></div>
              ))
            : displaySpots.map((spot) => (
                <SpotCard key={spot.id} spot={spot} userLocation={userLocation} />
              ))}
        </div>

        {/* Bottom divider + CTA */}
        <div className="w-full h-px bg-gray-200 mb-10" />
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {displaySpots.length} of {filtered.length} spots · live from database
          </p>
          <Link
            to="/map"
            className="bg-[#121212] text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-[#2a2a2a] transition-colors"
          >
            Open full map →
          </Link>
        </div>

      </div>
    </section>
  );
};

export default NearbySpots;
