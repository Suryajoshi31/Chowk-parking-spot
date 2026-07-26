import React from 'react';
import { Link } from 'react-router-dom';
import { Search, BarChart2, Navigation } from 'lucide-react';

const steps = [
  {
    number: '01',
    tag: 'Search',
    title: "Tell it where you're headed",
    description: (
      <>
        Enter a neighbourhood, landmark, or drop a pin —{' '}
        <span className="text-[#b34b3f] font-medium">Chowk pulls</span> every
        mapped spot within walking distance.
      </>
    ),
    icon: Search,
  },
  {
    number: '02',
    tag: 'Compare',
    title: 'Weigh price against distance',
    description:
      "See rate per hour, how full each lot is, and whether it's covered — free stands sit right next to paid ones.",
    icon: BarChart2,
  },
  {
    number: '03',
    tag: 'Navigate',
    title: 'Follow the route in',
    description:
      "One tap draws the fastest way in for your vehicle, built for the valley's one-ways and narrow chowks.",
    icon: Navigation,
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="w-full bg-[#f5f3ec] py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6">

        {/* Section Label */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-px bg-gray-400" />
          <span className="text-xs font-semibold tracking-widest text-gray-500 uppercase">
            How Chowk Works
          </span>
        </div>

        {/* Headline */}
        <h2 className="text-4xl lg:text-6xl font-serif font-bold leading-[1.15] mb-6 max-w-2xl text-[#121212]">
          Three steps between you and an open spot
        </h2>

        {/* Sub-headline */}
        <p className="text-gray-600 text-lg mb-16 max-w-xl leading-relaxed">
          No scanning side streets,{' '}
          <span className="text-[#b34b3f] font-medium">no guessing</span> if a
          lot is full.{' '}
          <span className="text-[#b34b3f] font-medium">Chowk shows</span>{' '}
          what's open before you get there.
        </p>

        {/* Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-20">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={i}
                className="group bg-white rounded-2xl border border-gray-100 p-8 hover:shadow-lg hover:border-gray-200 transition-all duration-300 hover:-translate-y-1 flex flex-col gap-5"
              >
                {/* Step tag */}
                <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-gray-400 uppercase">
                  <span>{step.number}</span>
                  <span className="w-4 h-px bg-gray-300" />
                  <span>{step.tag}</span>
                </div>

                {/* Icon */}
                <div className="w-10 h-10 rounded-xl bg-[#f5f3ec] flex items-center justify-center text-[#b34b3f] group-hover:bg-[#b34b3f] group-hover:text-white transition-colors duration-300">
                  <Icon size={20} strokeWidth={1.8} />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-[#121212] leading-snug font-serif">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-500 leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gray-200" />

        {/* Bottom CTA */}


      </div>
    </section>
  );
};

export default HowItWorks;
