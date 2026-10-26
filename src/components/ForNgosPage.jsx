import React from 'react';
import { Building2, CheckCircle2, ArrowRight, ShieldCheck, HeartHandshake, Sparkles, FolderKanban } from 'lucide-react';

export default function ForNgosPage({ onRegisterClick, onLoginClick }) {
  const benefits = [
    {
      title: 'Showcase Diverse Resource Needs',
      desc: 'Don’t limit your outreach to monetary gifts. Request equipment, corporate sponsorships, medical supplies, or volunteer mentors in one place.'
    },
    {
      title: 'Verified Non-Profit Trust Mark',
      desc: 'Gain credibility with individual philanthropists and institutional CSR managers through our transparent verification review process.'
    },
    {
      title: 'Zero Intermediary Fees',
      desc: 'ImpactConnect is built to serve the non-profit sector. Creating your profile, publishing projects, and connecting with donors is 100% free.'
    },
    {
      title: 'Structured Proposal Desk',
      desc: 'Say goodbye to scattered emails. Review, accept, or decline collaboration offers through an organized management dashboard with official response notes.'
    }
  ];

  return (
    <div className="bg-white min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[#16A36A] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            For Non-Profits & Community Organizations
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Scale Your Community Impact With <span className="text-[#16A36A]">The Right Partners.</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Publish your active initiatives, specify your exact funding, volunteer, or material needs, and connect with individuals and corporations ready to help.
          </p>

          <div className="pt-2 flex justify-center space-x-3">
            <button
              onClick={onRegisterClick}
              className="px-6 py-3 rounded-xl btn-primary font-bold text-sm shadow-sm flex items-center space-x-2"
            >
              <span>Register Your Organization</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onLoginClick}
              className="px-6 py-3 rounded-xl border border-slate-300 hover:bg-slate-50 font-bold text-sm text-slate-800 transition"
            >
              NGO Sign In
            </button>
          </div>
        </div>

        {/* 4 Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {benefits.map((b, i) => (
            <div key={i} className="p-8 rounded-3xl bg-[#F8FAFC] border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#16A36A] flex items-center justify-center font-bold">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">{b.title}</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>

        {/* Verification Strip */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-base">Simple 2-Step Verification Process</h4>
              <p className="text-xs text-slate-500 mt-0.5 max-w-lg">
                Submit your official non-profit registration certificate or tax-exempt confirmation. Our compliance team verifies details within 48 hours.
              </p>
            </div>
          </div>

          <button
            onClick={onRegisterClick}
            className="px-5 py-2.5 rounded-xl btn-primary text-xs font-bold shrink-0"
          >
            Get Verified
          </button>
        </div>

      </div>
    </div>
  );
}
