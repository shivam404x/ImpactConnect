import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  HeartHandshake, 
  Sparkles, 
  ArrowRight, 
  MapPin, 
  DollarSign, 
  Users 
} from 'lucide-react';

const FEATURED_SLIDES = [
  {
    id: 'proj-1',
    title: 'Clean Water & Solar Lights for 12,000 Families',
    tagline: '5 solar-powered RO water kiosks and 60 rooftop streetlights.',
    cause: 'Clean Water & Poverty',
    sdg: 'SDG 6 & SDG 1',
    sdgColor: '#26BDE2',
    ngo: 'Aashray Rural Trust',
    location: 'Mumbai, India',
    image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=1600&q=80',
    stat: '$16,500 / $28,000 Raised',
    urgency: 'High Urgency'
  },
  {
    id: 'proj-2',
    title: 'Solar STEM Micro-Labs for 25 Off-Grid Schools',
    tagline: 'Delivering 150 offline tablets loaded with science, math & coding.',
    cause: 'Quality Education',
    sdg: 'SDG 4',
    sdgColor: '#C5192D',
    ngo: 'BrightPath Literacy',
    location: 'Rift Valley, Kenya',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1600&q=80',
    stat: '12 / 20 Mentors Joined',
    urgency: 'Urgent'
  },
  {
    id: 'proj-4',
    title: 'Miyawaki Native Forests & Urban Wetland Revival',
    tagline: 'Planting 35,000 native trees to bring down city heat islands.',
    cause: 'Environment & Climate',
    sdg: 'SDG 13 & SDG 15',
    sdgColor: '#3F7E44',
    ngo: 'GreenCanopy Guild',
    location: 'Bangalore, India',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1600&q=80',
    stat: '62 / 100 Tree Volunteers',
    urgency: 'Weekend Drive'
  },
  {
    id: 'proj-3',
    title: 'Mobile Ultrasound Van for Remote Tribal Hamlets',
    tagline: 'Prenatal care and telemedicine directly to mountain villages.',
    cause: 'Healthcare & Maternal Health',
    sdg: 'SDG 3',
    sdgColor: '#4C9F38',
    ngo: 'Arogya Health',
    location: 'New Delhi / Hills',
    image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1600&q=80',
    stat: '3,200 Scans Target',
    urgency: 'Immediate'
  },
  {
    id: 'proj-6',
    title: 'City-Wide Surplus Food Rescue & Dignity Pantries',
    tagline: 'Rescuing 500,000 lbs of fresh grocery food to serve 180,000 warm meals.',
    cause: 'Zero Hunger',
    sdg: 'SDG 2',
    sdgColor: '#DDA63A',
    ngo: 'NourishNation',
    location: 'Austin, Texas',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1600&q=80',
    stat: '21 / 30 Drivers Ready',
    urgency: 'Active Daily'
  }
];

export default function HeroSlider({ onSelectProject, onPartnerClick }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto slide every 5 seconds
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % FEATURED_SLIDES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const currentSlide = FEATURED_SLIDES[currentIndex];

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? FEATURED_SLIDES.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % FEATURED_SLIDES.length);
  };

  return (
    <div 
      className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slider Frame */}
      <div className="relative h-[360px] sm:h-[420px] md:h-[460px] rounded-3xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-950 group">
        
        {/* Slide Background Images */}
        {FEATURED_SLIDES.map((slide, idx) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <img 
              src={slide.image} 
              alt={slide.title} 
              className="w-full h-full object-cover object-center transform scale-105 group-hover:scale-100 transition-transform duration-700" 
            />
            {/* Cinematic Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/20" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-transparent" />
          </div>
        ))}

        {/* Content on Current Slide */}
        <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 sm:p-10 md:p-12 max-w-3xl">
          
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span 
              className="px-3 py-1 rounded-full text-xs font-black text-white shadow-lg flex items-center space-x-1"
              style={{ backgroundColor: currentSlide.sdgColor }}
            >
              <span>{currentSlide.sdg}</span>
            </span>

            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-900/80 backdrop-blur-md border border-slate-700 text-emerald-300">
              {currentSlide.cause}
            </span>

            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-500/90 text-white shadow-md">
              {currentSlide.urgency}
            </span>
          </div>

          {/* Title & Short Tagline */}
          <h2 className="text-2xl sm:text-4xl md:text-4xl font-black text-white tracking-tight leading-tight drop-shadow-md">
            {currentSlide.title}
          </h2>

          <p className="mt-2 text-sm sm:text-base text-slate-200 line-clamp-2 max-w-xl drop-shadow">
            {currentSlide.tagline}
          </p>

          {/* Quick Info & Action Buttons */}
          <div className="mt-5 flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-3 text-xs text-slate-300 bg-slate-900/70 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-700/80">
              <span className="font-semibold text-white">{currentSlide.ngo}</span>
              <span className="text-slate-500">•</span>
              <span className="flex items-center space-x-1 text-emerald-400">
                <MapPin className="w-3.5 h-3.5" />
                <span>{currentSlide.location}</span>
              </span>
              <span className="text-slate-500">•</span>
              <span className="font-bold text-amber-300">{currentSlide.stat}</span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => onPartnerClick({ id: currentSlide.id, title: currentSlide.title, ngo_name: currentSlide.ngo, ngo_id: 'ngo-1' })}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm flex items-center space-x-1.5 shadow-xl shadow-emerald-500/30 transition transform hover:-translate-y-0.5"
              >
                <HeartHandshake className="w-4 h-4" />
                <span>Support Now</span>
              </button>

              <button
                onClick={() => onSelectProject({ id: currentSlide.id })}
                className="px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white font-semibold text-xs sm:text-sm border border-slate-700 transition"
              >
                View Story
              </button>
            </div>
          </div>

        </div>

        {/* Left Arrow Button */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-slate-900/70 hover:bg-slate-800 text-white border border-slate-700 flex items-center justify-center transition opacity-80 hover:opacity-100"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Right Arrow Button */}
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-slate-900/70 hover:bg-slate-800 text-white border border-slate-700 flex items-center justify-center transition opacity-80 hover:opacity-100"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Bottom Slide Dots */}
        <div className="absolute bottom-4 right-6 z-30 flex items-center space-x-2 bg-slate-950/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-800">
          {FEATURED_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex ? 'w-6 bg-emerald-400' : 'w-2 bg-slate-600 hover:bg-slate-400'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </div>
  );
}
