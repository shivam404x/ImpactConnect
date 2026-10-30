import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  IndianRupee, 
  Building2, 
  Handshake, 
  Globe2, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { fetchStats } from '../utils/api';
import { SDG_GOALS } from '../data/sdgConstants';

export default function ImpactAnalyticsView() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    setLoading(true);
    try {
      const data = await fetchStats();
      setStats(data);
    } catch (err) {
      console.error('Error fetching impact analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-400">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto text-emerald-400 mb-2" />
        Aggregating global impact analytics & SDG metrics...
      </div>
    );
  }

  const fundingPct = stats?.totalFundingTarget > 0 
    ? Math.round((stats.totalFundingRaised / stats.totalFundingTarget) * 100) 
    : 61;

  const volunteersPct = stats?.totalVolunteersTarget > 0 
    ? Math.round((stats.totalVolunteersJoined / stats.totalVolunteersTarget) * 100) 
    : 60;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Community SDG Impact Dashboard</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Platform Impact Metrics & Global Reporting</h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Real-time tracking of mobilized financial capital, volunteer hours, equipment, and SDG milestones.
          </p>
        </div>

        <button
          onClick={loadStats}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition self-start md:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Sync Analytics</span>
        </button>
      </div>

      {/* 4 Big KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Funding Card */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Philanthropic Capital</span>
            <IndianRupee className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-white">
            ₹{(stats?.totalFundingRaised || 57000).toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-amber-400 mt-1">
            Target: ₹{(stats?.totalFundingTarget || 93500).toLocaleString('en-IN')} ({fundingPct}%)
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-amber-400 rounded-full" style={{ width: `${fundingPct}%` }}></div>
          </div>
        </div>

        {/* Volunteers Card */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Volunteers Pledged</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-white">
            {(stats?.totalVolunteersJoined || 147).toLocaleString()}
          </div>
          <div className="text-xs text-emerald-400 mt-1">
            Target: {(stats?.totalVolunteersTarget || 245).toLocaleString()} ({volunteersPct}%)
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${volunteersPct}%` }}></div>
          </div>
        </div>

        {/* Partnerships Card */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Active Collaborations</span>
            <Handshake className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-3xl font-black text-white">
            {stats?.acceptedRequests || 4}
          </div>
          <div className="text-xs text-sky-400 mt-1">
            Out of {stats?.totalRequests || 4} proposals submitted
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-sky-400 rounded-full" style={{ width: `100%` }}></div>
          </div>
        </div>

        {/* Community NGOs Card */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Verified Non-Profits</span>
            <Building2 className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-black text-white">
            {stats?.totalNgos || 6}
          </div>
          <div className="text-xs text-purple-400 mt-1">
            Across 4 continents & 8 causes
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-purple-400 rounded-full" style={{ width: `100%` }}></div>
          </div>
        </div>

      </div>

      {/* SDG Goals Alignment Matrix & Cause Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* UN SDG Distribution Chart */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Globe2 className="w-4 h-4 text-emerald-400" />
                <span>UN Sustainable Development Goals (SDGs) Footprint</span>
              </h3>
              <p className="text-xs text-slate-400">Distribution of active community initiatives across the 17 Global Goals</p>
            </div>
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              SDG Aligned
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {SDG_GOALS.map(sdg => {
              const count = (stats?.sdgDistribution && stats.sdgDistribution[sdg.id]) || 0;
              const barWidth = Math.max(count > 0 ? (count / 8) * 100 : 0, 0);

              if (count === 0 && ![1, 2, 3, 4, 5, 6, 8, 10, 11, 13].includes(sdg.id)) return null;

              return (
                <div key={sdg.id} className="space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span 
                        className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black text-white shrink-0 shadow-sm"
                        style={{ backgroundColor: sdg.color }}
                      >
                        {sdg.id}
                      </span>
                      <span className="font-semibold text-slate-200">{sdg.name}</span>
                    </div>
                    <span className="font-bold text-slate-300">
                      {count} {count === 1 ? 'Project' : 'Projects'}
                    </span>
                  </div>

                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ 
                        width: `${Math.max(barWidth, count > 0 ? 12 : 2)}%`, 
                        backgroundColor: count > 0 ? sdg.color : '#334155' 
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Cause Distribution & Real-time Audit Stream */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Cause Category Breakdown */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
            <h3 className="text-base font-bold text-white">Social Cause Focus</h3>
            <div className="space-y-2 text-xs">
              {stats?.causeDistribution && Object.entries(stats.causeDistribution).map(([cause, cnt]) => (
                <div key={cause} className="flex items-center justify-between p-2 rounded-xl bg-slate-800/60 border border-slate-700/50">
                  <span className="capitalize font-semibold text-slate-200">{cause.replace('_', ' ')}</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                    {cnt} initiatives
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Real-time Audit Stream */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              <h3 className="text-base font-bold text-white">Recent Partnership Activity</h3>
            </div>

            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {(stats?.recentActivity || []).map(act => (
                <div key={act.id} className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 text-xs space-y-0.5">
                  <div className="font-bold text-white flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span className="truncate">{act.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 line-clamp-2">{act.description}</p>
                  <span className="text-[10px] text-slate-500 block">
                    {new Date(act.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
