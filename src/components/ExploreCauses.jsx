import React from 'react';
import { ArrowRight, BookOpen, HeartPulse, TreePine, Sparkles, Smile, Accessibility } from 'lucide-react';

const CAUSES = [
  {
    id: 'education',
    name: 'Quality Education',
    description: 'Providing rural classrooms with digital tablets, library books, and teacher mentorship.',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
    icon: BookOpen,
    accent: 'text-red-600',
    bgAccent: 'bg-red-50'
  },
  {
    id: 'healthcare',
    name: 'Healthcare & Medicine',
    description: 'Mobile health vans, maternal sonography, and telemedicine in underserved remote villages.',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
    icon: HeartPulse,
    accent: 'text-emerald-600',
    bgAccent: 'bg-emerald-50'
  },
  {
    id: 'environment',
    name: 'Environment & Climate',
    description: 'Native Miyawaki urban forests, lake rejuvenation, and community tree planting drives.',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
    icon: TreePine,
    accent: 'text-emerald-700',
    bgAccent: 'bg-emerald-50'
  },
  {
    id: 'women_welfare',
    name: 'Women Empowerment',
    description: 'Vocational sewing cooperatives, microfinance linkages, and STEM career coaching.',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
    icon: Sparkles,
    accent: 'text-pink-600',
    bgAccent: 'bg-pink-50'
  },
  {
    id: 'poverty',
    name: 'Child & Family Welfare',
    description: 'Nutritional food rescue, warm clothing distribution, and safe shelter for vulnerable families.',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80',
    icon: Smile,
    accent: 'text-cyan-600',
    bgAccent: 'bg-cyan-50'
  },
  {
    id: 'disability',
    name: 'Disability Inclusion',
    description: 'Screen-reader coding fellowships, custom 3D prosthetics, and corporate hiring partnerships.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
    icon: Accessibility,
    accent: 'text-purple-600',
    bgAccent: 'bg-purple-50'
  }
];

export default function ExploreCauses({ onSelectCause }) {
  return (
    <section className="bg-white py-16 lg:py-24 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#16A36A] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Impact Domains
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
            Explore Causes That Need Your Support
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            Every cause represents verified grassroots community initiatives working toward United Nations Sustainable Development Goals.
          </p>
        </div>

        {/* 6 Cause Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {CAUSES.map(cause => {
            const Icon = cause.icon;
            return (
              <div 
                key={cause.id}
                onClick={() => onSelectCause(cause.id)}
                className="group bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Photo Container */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                    <img 
                      src={cause.image} 
                      alt={cause.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    
                    {/* Badge Icon on top */}
                    <div className={`absolute top-3.5 right-3.5 w-9 h-9 rounded-xl ${cause.bgAccent} ${cause.accent} shadow-md flex items-center justify-center`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#16A36A] transition">
                      {cause.name}
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {cause.description}
                    </p>
                  </div>
                </div>

                {/* Footer Link */}
                <div className="px-6 pb-6 pt-0">
                  <div className="flex items-center text-xs font-bold text-[#16A36A] group-hover:text-emerald-700 transition">
                    <span>Explore Initiatives</span>
                    <ArrowRight className="w-4 h-4 ml-1.5 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
