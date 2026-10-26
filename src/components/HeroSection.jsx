import React from 'react';
import { ArrowRight, CheckCircle2, HeartHandshake, ShieldCheck, Sparkles, Users } from 'lucide-react';

export default function HeroSection({ onExploreClick, onRegisterNgoClick }) {
  return (
    <section className="relative bg-white pt-8 pb-16 lg:pt-14 lg:pb-24 overflow-hidden border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Text & CTAs */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Mission Tagline Badge */}
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-[#16A36A] text-xs font-bold tracking-tight">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Social Impact Partnership Platform</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
              Together, We Can Make a <span className="text-[#16A36A]">Greater Impact.</span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
              Discover meaningful causes, connect with trusted organizations, and turn your resources, skills, and compassion into real-world change.
            </p>

            {/* Primary Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={onExploreClick}
                className="px-6 py-3.5 rounded-xl btn-primary font-bold text-sm flex items-center justify-center space-x-2 shadow-sm"
              >
                <span>Explore Projects</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onRegisterNgoClick}
                className="px-6 py-3.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm transition text-center shadow-xs"
              >
                Register Your NGO
              </button>
            </div>

            {/* Trust-oriented supporting line */}
            <div className="pt-4 flex items-center space-x-2 text-xs font-semibold text-slate-500">
              <CheckCircle2 className="w-4 h-4 text-[#16A36A] shrink-0" />
              <span>Connecting communities, changemakers, and organizations for a better tomorrow.</span>
            </div>

          </div>

          {/* Right Column: Visual High-Impact Photography Collage */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              
              {/* Main Feature Photo */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 aspect-[4/3] bg-slate-100">
                <img 
                  src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80" 
                  alt="Volunteers helping and empowering community children"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-5 right-5 text-white">
                  <div className="text-xs font-bold uppercase tracking-wider text-emerald-300">Grassroots Action</div>
                  <div className="text-sm sm:text-base font-extrabold mt-0.5">Empowering communities through verified local partnerships</div>
                </div>
              </div>

              {/* Floating Stat Card 1 (Bottom Left) */}
              <div className="absolute -bottom-6 -left-4 sm:-left-6 bg-white rounded-2xl p-4 shadow-xl border border-slate-200/80 flex items-center space-x-3.5 z-20">
                <div className="w-11 h-11 rounded-xl bg-emerald-100 text-[#16A36A] flex items-center justify-center shrink-0">
                  <HeartHandshake className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-medium">Partnership Success</div>
                  <div className="text-lg font-black text-slate-900">100% Transparent</div>
                </div>
              </div>

              {/* Floating Stat Card 2 (Top Right) */}
              <div className="absolute -top-5 -right-4 sm:-right-6 bg-white rounded-2xl p-3.5 shadow-xl border border-slate-200/80 flex items-center space-x-3 z-20">
                <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Verified NGOs</div>
                  <div className="text-[11px] text-slate-500">Government & 501(c)(3) Validated</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
