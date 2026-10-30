import React from 'react';
import { Heart, Target, ShieldCheck, Globe, Users, ArrowRight } from 'lucide-react';
import Logo from './Logo';

export default function AboutUsPage({ onExploreClick, onRegisterNgoClick }) {
  return (
    <div className="bg-white min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Hero Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[#16A36A] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Our Purpose & Vision
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Bridging the Social Impact Gap.
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            We believe that every community problem has willing supporters. Our mission is to eliminate the friction between grassroots organizations solving urgent issues and the partners who can help them expand their work.
          </p>
        </div>

        {/* 2-Column Story Section with Photography */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="rounded-3xl overflow-hidden shadow-xl border border-slate-200 aspect-[4/3] bg-slate-100">
            <img 
              src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1000&q=80" 
              alt="Community reforestation and environmental action"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Why We Built ImpactConnect
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Thousands of dedicated NGOs work daily on poverty alleviation, rural education, accessible healthcare, clean water, and climate conservation. Yet, they often struggle in isolation to discover corporate CSR grants, equipment donations, or pro bono professionals.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              Simultaneously, socially conscious companies, donors, and skilled volunteers want to give back but lack visibility into which community projects are authentic, verified, and in need of their specific skills.
            </p>
            <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-4 text-xs">
              <div>
                <div className="font-black text-slate-900 text-base text-[#16A36A]">100% Transparent</div>
                <p className="text-slate-500 mt-0.5">Direct communication without intermediary markups.</p>
              </div>
              <div>
                <div className="font-black text-slate-900 text-base text-sky-600">UN SDG Aligned</div>
                <p className="text-slate-500 mt-0.5">Tracking verifiable contributions across the 17 Global Goals.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Core Values 3 Cards */}
        <div className="bg-[#F8FAFC] rounded-3xl p-8 sm:p-12 border border-slate-200">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h3 className="text-2xl font-black text-slate-900">Our Guiding Values</h3>
            <p className="text-xs text-slate-500 mt-1">The principles that steer every line of code and partnership on ImpactConnect.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#16A36A] flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm mb-1.5">Uncompromising Trust</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                We rigorously verify legal non-profit registrations, 501(c)(3) and 80G tax exemptions to ensure supporters give with complete peace of mind.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-4">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm mb-1.5">Radical Accessibility</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Whether you have ₹500 to donate, 2 hours a week to mentor, or 50 laptops to recycle, everyone has something valuable to contribute.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                <Target className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm mb-1.5">Measurable Change</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every project defines concrete metrics—such as households supplied with potable water or girls completing coding bootcamps.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
