import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ListYourSpace = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <section id="list-your-space" className="w-full bg-[#f5f3ec] py-10 lg:py-14 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-[#121212] rounded-3xl px-10 py-14 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">

          {/* Left — Text */}
          <div className="max-w-md">
            <h2 className="text-3xl lg:text-4xl font-serif font-bold text-white leading-snug mb-4">
              Own a lot, driveway or courtyard?
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              List it on Chowk and set your own hours and rate. Owners in{' '}
              <span className="text-white font-medium">Thamel</span> and{' '}
              <span className="text-white font-medium">Patan</span> earn from
              spots that would otherwise sit empty after 6pm.
            </p>
          </div>

          {/* Right — Buttons */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 rounded-full bg-white text-[#121212] text-sm font-semibold hover:bg-gray-100 transition-colors"
            >
              List your space
            </button>
            <button
              className="px-6 py-3 rounded-full border border-gray-600 text-white text-sm font-semibold hover:border-white transition-colors"
            >
              See how payouts work
            </button>
          </div>
        </div>

        {/* Inline Form (appears on click) */}
        {showForm && (
          <div className="mt-6 bg-white rounded-3xl border border-gray-100 p-8 shadow-sm animate-fade-in">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-1">
                  List your space
                </p>
                <h3 className="text-2xl font-serif font-bold text-[#121212]">
                  Tell us about your spot
                </h3>
              </div>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-gray-700 transition-colors text-2xl leading-none"
              >
                ×
              </button>
            </div>

            <form className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Space Name */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Space name / description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Thamel courtyard, New Road underground lot"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#b34b3f] transition-colors"
                />
              </div>

              {/* Address */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Address / area
                </label>
                <input
                  type="text"
                  placeholder="Neighbourhood, chowk or landmark"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#b34b3f] transition-colors"
                />
              </div>

              {/* Total Slots */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Number of slots
                </label>
                <input
                  type="number"
                  min="1"
                  placeholder="e.g. 10"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#b34b3f] transition-colors"
                />
              </div>

              {/* Rate */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Rate (Rs / hr) — 0 for free
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="e.g. 40"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#b34b3f] transition-colors"
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Space type
                </label>
                <select className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:border-[#b34b3f] transition-colors bg-white">
                  <option value="">Select type</option>
                  <option>Outdoor lot</option>
                  <option>Underground / covered</option>
                  <option>Driveway</option>
                  <option>Courtyard</option>
                  <option>Roadside</option>
                </select>
              </div>

              {/* Vehicle type */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Accepts vehicles
                </label>
                <select className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:border-[#b34b3f] transition-colors bg-white">
                  <option value="">Select</option>
                  <option>Bikes only</option>
                  <option>Cars only</option>
                  <option>Bikes &amp; Cars</option>
                </select>
              </div>

              {/* Contact */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Your phone number
                </label>
                <input
                  type="tel"
                  placeholder="+977 98XXXXXXXX"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#b34b3f] transition-colors"
                />
              </div>

              {/* Submit */}
              <div className="sm:col-span-2 flex items-center gap-4 pt-2">
                <button
                  type="submit"
                  className="bg-[#121212] text-white px-8 py-3 rounded-full text-sm font-semibold hover:bg-[#2a2a2a] transition-colors"
                >
                  Submit listing
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </section>
  );
};

export default ListYourSpace;
