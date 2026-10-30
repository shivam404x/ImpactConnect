import React from 'react';
import { 
  HeartHandshake, 
  Sparkles, 
  ShieldCheck, 
  TrendingUp, 
  Users, 
  IndianRupee, 
  Building2,
  ArrowRight
} from 'lucide-react';
import { SDG_GOALS } from '../data/sdgConstants';

export default function HeroBanner({ 
  stats, 
  selectedSdg, 
  onSelectSdg, 
  onExploreClick, 
  onPostProjectClick 
}) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 pt-8 pb-10 border-b border-slate-800">
      {/* Background glowing orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2"></div>
      <div className="absolute top-1/2 right-10 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Tagline */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Community SDG Social Impact Partnership Platform</span>
          </div>

          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Verified Non-Profits & Transparent Collaboration</span>
          </div>
        </div>

        {/* Hero Title & Pitch */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8">
            <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Bridge the Gap Between <br className="hidden sm:inline" />
              <span className="gradient-text">Grassroots NGOs</span> & Purpose-Driven Supporters
            </h1>
            <p className="mt-4 text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed">
              NGOs work tirelessly on poverty, education, healthcare, clean water, and climate action. 
              <strong> ImpactConnect</strong> unites them with donors, corporate CSR, skilled professionals, and volunteers to scale community solutions.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={onExploreClick}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-lg shadow-emerald-600/30 flex items-center space-x-2 transition"
              >
                <span>Discover Community Projects</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onPostProjectClick}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 text-slate-200 border border-slate-700 font-semibold text-sm transition"
              >
                Post an NGO Project Need
              </button>
            </div>
          </div>

          {/* Quick Metrics Cards */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 backdrop-blur-sm">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>Active Projects</span>
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold text-white">
                {stats?.totalProjects || '8+'}
              </div>
              <div className="text-[11px] text-emerald-400 mt-0.5">Across 8 Social Causes</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 backdrop-blur-sm">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>Verified NGOs</span>
                <Building2 className="w-3.5 h-3.5 text-sky-400" />
              </div>
              <div className="text-2xl font-bold text-white">
                {stats?.totalNgos || '6+'}
              </div>
              <div className="text-[11px] text-sky-400 mt-0.5">Grassroots & Global</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 backdrop-blur-sm">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>Funding Pledged</span>
                <IndianRupee className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div className="text-2xl font-bold text-white">
                ₹{(stats?.totalFundingRaised || 57000).toLocaleString('en-IN')}
              </div>
              <div className="text-[11px] text-amber-400 mt-0.5">Target: ₹{(stats?.totalFundingTarget || 93500).toLocaleString('en-IN')}</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 backdrop-blur-sm">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>Volunteers Active</span>
                <Users className="w-3.5 h-3.5 text-rose-400" />
              </div>
              <div className="text-2xl font-bold text-white">
                {stats?.totalVolunteersJoined || 147}+
              </div>
              <div className="text-[11px] text-rose-400 mt-0.5">{stats?.acceptedRequests || 4} Partnerships Formed</div>
            </div>
          </div>
        </div>

        {/* UN Sustainable Development Goals (SDG) Horizontal Quick-Filter Bar */}
        <div className="mt-8 pt-6 border-t border-slate-800/80">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
              <span>UN Sustainable Development Goals (SDGs)</span>
              <span className="text-[10px] text-slate-500 font-normal">(Click any SDG to filter initiatives)</span>
            </span>

            {selectedSdg !== 'all' && (
              <button
                onClick={() => onSelectSdg('all')}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-medium"
              >
                Clear SDG filter ✕
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => onSelectSdg('all')}
              className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition border ${
                selectedSdg === 'all'
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              All 17 SDGs
            </button>

            {SDG_GOALS.map(sdg => {
              const isSelected = selectedSdg === String(sdg.id);
              return (
                <button
                  key={sdg.id}
                  onClick={() => onSelectSdg(isSelected ? 'all' : String(sdg.id))}
                  title={`SDG ${sdg.id}: ${sdg.name} - ${sdg.description}`}
                  style={{
                    backgroundColor: isSelected ? sdg.color : 'rgba(30, 41, 59, 0.7)',
                    borderColor: isSelected ? sdg.color : 'rgba(51, 65, 85, 0.8)',
                    color: isSelected ? '#ffffff' : '#cbd5e1'
                  }}
                  className={`shrink-0 px-2.5 py-1.5 rounded-lg text-xs font-bold transition border flex items-center space-x-1.5 hover:opacity-95 ${
                    isSelected ? 'ring-2 ring-white/50 shadow-md' : ''
                  }`}
                >
                  <span 
                    className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black text-white"
                    style={{ backgroundColor: isSelected ? 'rgba(0,0,0,0.3)' : sdg.color }}
                  >
                    {sdg.id}
                  </span>
                  <span className="whitespace-nowrap">{sdg.name}</span>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
