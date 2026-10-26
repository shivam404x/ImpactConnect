import React from 'react';
import { Search, HeartHandshake, TrendingUp, ArrowRight } from 'lucide-react';

export default function HowItWorksSection({ onExploreClick }) {
  const steps = [
    {
      step: '01',
      title: 'Discover Causes',
      description: 'Explore verified grassroots NGOs and community projects filtered by social cause, location, or resource needs.',
      icon: Search,
      badge: 'Step 1'
    },
    {
      step: '02',
      title: 'Initiate Collaboration',
      description: 'Send a structured partnership request offering funds, equipment, pro bono skills, or volunteer hours in minutes.',
      icon: HeartHandshake,
      badge: 'Step 2'
    },
    {
      step: '03',
      title: 'Create Measurable Impact',
      description: 'NGO leadership reviews and confirms the partnership. Track on-ground milestones and celebrate tangible lives changed.',
      icon: TrendingUp,
      badge: 'Step 3'
    }
  ];

  return (
    <section className="bg-[#F8FAFC] py-16 lg:py-24 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[#16A36A] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Simple 3-Step Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
            How ImpactConnect Works
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            A seamless bridge connecting those who need support with those who have the passion and resources to help.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div 
                key={index}
                className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-xs hover:shadow-lg transition duration-200 flex flex-col justify-between relative"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200/60 text-[#16A36A] flex items-center justify-center font-bold">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-3xl font-black text-slate-200 tracking-tight">
                      {item.step}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-bold text-[#16A36A]">
                  <span>{item.badge}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Strip */}
        <div className="mt-12 text-center">
          <button
            onClick={onExploreClick}
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl btn-primary font-bold text-sm shadow-sm"
          >
            <span>Start Exploring Projects Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
}
