import React from 'react';
import { ArrowRight, Building2, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function NgoCtaSection({ onRegisterClick }) {
  return (
    <section className="bg-white py-16 lg:py-24 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#F8FAFC] border border-slate-200/90 p-8 sm:p-12 lg:p-16 overflow-hidden relative">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Text */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[#16A36A] text-xs font-bold">
                <Building2 className="w-3.5 h-3.5" />
                <span>Dedicated Non-Profit Program</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Your Mission Deserves the <span className="text-[#16A36A]">Right Partners.</span>
              </h2>

              <p className="text-base text-slate-600 leading-relaxed max-w-xl">
                Whether you need grant funding for clean water wells, digital equipment for rural schools, or specialized medical volunteers, ImpactConnect connects your organization directly with vetted supporters and corporate CSR initiatives.
              </p>

              {/* Benefits Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {[
                  '100% Free Organization Profile',
                  'Publish Multi-Resource Needs',
                  'Verified Trust & Compliance Badge',
                  'Direct In-App Proposal Reviews'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-2 text-xs font-semibold text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-[#16A36A] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <div className="pt-4">
                <button
                  onClick={onRegisterClick}
                  className="px-7 py-3.5 rounded-xl btn-primary font-bold text-sm flex items-center space-x-2 shadow-sm"
                >
                  <span>Register Your NGO</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Column: Inspiring NGO Team Photo */}
            <div className="lg:col-span-5 relative">
              <div className="rounded-2xl overflow-hidden shadow-xl border border-slate-200 aspect-[4/3] bg-slate-200">
                <img 
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80" 
                  alt="NGO field team working directly with local communities"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-3 -right-3 sm:-bottom-4 sm:-right-4 bg-white p-3 rounded-xl shadow-lg border border-slate-200 flex items-center space-x-2 text-xs font-bold text-slate-800">
                <ShieldCheck className="w-4 h-4 text-[#16A36A]" />
                <span>Verified Non-Profit Community</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
