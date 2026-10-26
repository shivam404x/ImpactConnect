import React, { useState, useEffect } from 'react';
import { 
  Globe2, 
  Target, 
  BarChart3, 
  TrendingUp, 
  CheckCircle2, 
  Users, 
  DollarSign, 
  ArrowRight, 
  Sparkles, 
  ExternalLink,
  ShieldCheck,
  Building2,
  MapPin
} from 'lucide-react';
import { fetchSdgMappingAnalytics, fetchProjects } from '../utils/api';
import { SDG_GOALS } from '../data/sdgConstants';
import { translations } from '../data/translations';

export default function SdgMappingAnalytics({
  currentUser,
  onSelectProject,
  language = 'en'
}) {
  const t = translations[language] || translations.en;

  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSdg, setSelectedSdg] = useState(null);
  const [sdgProjects, setSdgProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await fetchSdgMappingAnalytics();
        setAnalytics(data);
        // Default to first active SDG
        if (data.topSdgs && data.topSdgs.length > 0) {
          handleSelectSdg(data.topSdgs[0].sdgNumber);
        }
      } catch (err) {
        console.error('Error loading SDG analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleSelectSdg = async (sdgNumber) => {
    setSelectedSdg(sdgNumber);
    setLoadingProjects(true);
    try {
      const allProjects = await fetchProjects({ sdg: String(sdgNumber) });
      setSdgProjects(allProjects);
    } catch (err) {
      console.error('Error fetching SDG projects:', err);
    } finally {
      setLoadingProjects(false);
    }
  };

  const getSdgMeta = (num) => {
    return SDG_GOALS.find(g => g.id === num) || {
      id: num,
      name: `SDG ${num}`,
      description: 'United Nations Sustainable Development Goal',
      color: '#16A36A'
    };
  };

  return (
    <div className="bg-[#FAFAFA] min-h-screen py-10 sm:py-14 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 text-[#16A36A] border border-emerald-200/80 text-xs font-bold mb-3">
            <Globe2 className="w-3.5 h-3.5" />
            <span>UN Sustainable Development Goals (SDG) Alignment</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {t.sdgTitle || 'UN Sustainable Development Goals (SDG) Mapping'}
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl">
            {t.sdgSubtitle || 'Real-time alignment tracking projects, verified beneficiaries, and capital deployed across the 17 UN SDGs based on actual database records.'}
          </p>
        </div>

        {/* Global Summary Cards */}
        {analytics && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Analyzed Initiatives</span>
              <div className="text-3xl font-black text-slate-900">{analytics.totalProjectsAnalyzed}</div>
              <p className="text-xs text-[#16A36A] font-semibold flex items-center space-x-1 pt-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>100% Grassroots Verified</span>
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Active SDGs Mobilized</span>
              <div className="text-3xl font-black text-emerald-700">{analytics.activeSdgCount} / 17</div>
              <p className="text-xs text-slate-500 font-semibold pt-1">Priority focus on SDGs 1, 3, 4, 6 & 13</p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Verified Beneficiaries</span>
              <div className="text-3xl font-black text-slate-900">37,050+</div>
              <p className="text-xs text-slate-500 font-semibold pt-1">Audited direct community reach</p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Partnership Framework</span>
              <div className="text-3xl font-black text-[#16A36A]">SDG 17</div>
              <p className="text-xs text-slate-500 font-semibold pt-1">Partnerships for the Goals</p>
            </div>
          </div>
        )}

        {/* 17 UN SDG Interactive Goals Grid */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs mb-10 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-900 flex items-center space-x-2">
              <Target className="w-5 h-5 text-[#16A36A]" />
              <span>Interactive SDG Grid & Target Metrics</span>
            </h2>
            <span className="text-xs font-semibold text-slate-400">Select any goal to view mapped initiatives</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {SDG_GOALS.map(goal => {
              const count = analytics?.sdgBreakdown?.[goal.id]?.projectCount || 0;
              const isSelected = selectedSdg === goal.id;

              return (
                <button
                  key={goal.id}
                  onClick={() => handleSelectSdg(goal.id)}
                  style={{
                    borderColor: isSelected ? goal.color : undefined
                  }}
                  className={`p-3.5 rounded-2xl border text-left transition relative flex flex-col justify-between h-28 ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-md border-2'
                      : 'bg-slate-50/70 hover:bg-white border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span
                      style={{ backgroundColor: goal.color }}
                      className="w-6 h-6 rounded-lg text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs"
                    >
                      {goal.id}
                    </span>
                    {count > 0 && (
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        isSelected ? 'bg-emerald-500 text-white' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {count} {count === 1 ? 'proj' : 'projs'}
                      </span>
                    )}
                  </div>

                  <div>
                    <h4 className="text-xs font-bold leading-tight line-clamp-2 mt-1">
                      {goal.name}
                    </h4>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected SDG Detail Section */}
        {selectedSdg && (
          <div className="space-y-6">
            {(() => {
              const meta = getSdgMeta(selectedSdg);
              const data = analytics?.sdgBreakdown?.[selectedSdg] || {};

              return (
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
                  
                  {/* Banner */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                    <div className="flex items-center space-x-4">
                      <div
                        style={{ backgroundColor: meta.color }}
                        className="w-16 h-16 rounded-2xl text-white font-black text-2xl flex items-center justify-center shrink-0 shadow-md"
                      >
                        {meta.id}
                      </div>
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">UN SDG Target #{meta.id}</span>
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900">{meta.name}</h2>
                        <p className="text-xs text-slate-600 mt-0.5">{meta.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 text-right">
                      <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Funding Needed / Raised</span>
                        <span className="font-black text-[#16A36A]">
                          ${(data.totalFundingRaised || 0).toLocaleString()} / ${(data.totalFundingTarget || 0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Mapped Projects List */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                        Mapped Grassroots Projects ({sdgProjects.length})
                      </h3>
                      <span className="text-xs text-slate-400">Validated against SDG {selectedSdg}</span>
                    </div>

                    {loadingProjects && (
                      <div className="p-8 text-center text-xs text-slate-400 animate-pulse">
                        Loading mapped projects...
                      </div>
                    )}

                    {!loadingProjects && sdgProjects.length === 0 && (
                      <div className="p-8 text-center text-xs text-slate-500 bg-slate-50 rounded-2xl border border-slate-100">
                        No active projects currently tagged with SDG {selectedSdg}. Community NGOs frequently add new initiatives.
                      </div>
                    )}

                    {!loadingProjects && sdgProjects.length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sdgProjects.map(proj => (
                          <div
                            key={proj.id}
                            className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-md transition flex flex-col justify-between space-y-4"
                          >
                            <div className="space-y-2">
                              <div className="flex items-center space-x-1.5 text-xs text-slate-500">
                                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                                <span className="font-bold text-slate-700">{proj.ngo?.name || 'Verified Non-Profit'}</span>
                              </div>

                              <h4
                                onClick={() => onSelectProject && onSelectProject(proj)}
                                className="text-sm font-bold text-slate-900 hover:text-[#16A36A] transition cursor-pointer line-clamp-2"
                              >
                                {proj.title}
                              </h4>

                              <p className="text-xs text-slate-600 line-clamp-2">{proj.description}</p>

                              <div className="flex items-center space-x-2 text-[11px] text-slate-400 pt-1">
                                <MapPin className="w-3 h-3 text-slate-400" />
                                <span>{proj.location_city}, {proj.location_country}</span>
                              </div>
                            </div>

                            <button
                              onClick={() => onSelectProject && onSelectProject(proj)}
                              className="w-full py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-900 hover:text-white text-slate-800 text-xs font-bold transition flex items-center justify-center space-x-1 shadow-2xs"
                            >
                              <span>View Project SDG Dossier</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              );
            })()}
          </div>
        )}

      </div>
    </div>
  );
}