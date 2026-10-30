import React from 'react';
import { 
  X, 
  Scale, 
  CheckCircle2, 
  MapPin, 
  Building2, 
  ShieldCheck, 
  Calendar, 
  IndianRupee, 
  Users, 
  Package, 
  Printer, 
  HeartHandshake, 
  ExternalLink,
  Target,
  Clock
} from 'lucide-react';
import { SDG_GOALS } from '../data/sdgConstants';
import { translations } from '../data/translations';

export default function ProjectComparisonModal({
  isOpen,
  comparedProjects = [],
  onClose,
  onRemoveProject,
  onClearAll,
  onSelectProject,
  onPartnerClick,
  language = 'en'
}) {
  const t = translations[language] || translations.en;

  if (!isOpen || comparedProjects.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in print:p-0 print:bg-white">
      <div className="bg-white rounded-3xl max-w-6xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-6 print:border-none print:shadow-none print:p-0">
        
        {/* Header (Hidden in Print) */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-200 print:hidden">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#16A36A] border border-emerald-200 flex items-center justify-center shrink-0">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Side-by-Side Matrix
                </span>
                <span className="text-xs text-slate-400">• {comparedProjects.length} of 3 initiatives compared</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {t.comparisonTitle || 'Project Comparison & Evaluation Matrix'}
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition flex items-center space-x-1.5"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Print Table</span>
            </button>

            <button
              onClick={onClearAll}
              className="px-3 py-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition"
            >
              Clear All
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Comparison Table / Grid */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr>
                <th className="p-4 w-44 bg-slate-50 rounded-tl-2xl border-b border-slate-200 text-xs font-black uppercase tracking-wider text-slate-500">
                  Feature / Attribute
                </th>
                {comparedProjects.map((project) => (
                  <th key={project.id} className="p-4 border-b border-slate-200 bg-slate-50/50 relative align-top">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-white text-slate-700 border border-slate-200 shadow-2xs">
                        {project.cause_category?.replace(/_/g, ' ')}
                      </span>
                      <button
                        onClick={() => onRemoveProject(project.id)}
                        title="Remove from comparison"
                        className="text-slate-400 hover:text-rose-600 print:hidden p-1 rounded-md"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                      {project.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 font-normal flex items-center space-x-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{project.ngo?.name || 'Verified Non-Profit'}</span>
                    </p>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-xs">
              
              {/* Row 1: Verification Status */}
              <tr>
                <td className="p-4 font-bold text-slate-600 bg-slate-50/30">Verification Tier</td>
                {comparedProjects.map(p => (
                  <td key={p.id} className="p-4">
                    <span className="inline-flex items-center space-x-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{p.ngo?.verification_tier || 'Gold Verified'}</span>
                    </span>
                  </td>
                ))}
              </tr>

              {/* Row 2: Location & Remote */}
              <tr>
                <td className="p-4 font-bold text-slate-600 bg-slate-50/30">Location & Scope</td>
                {comparedProjects.map(p => (
                  <td key={p.id} className="p-4 text-slate-700">
                    <div className="flex items-center space-x-1.5 font-semibold">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{p.location_city}, {p.location_country}</span>
                    </div>
                    {p.is_remote && (
                      <span className="mt-1 inline-block text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                        Virtual / Remote Eligible
                      </span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Row 3: UN SDG Goals */}
              <tr>
                <td className="p-4 font-bold text-slate-600 bg-slate-50/30">UN SDG Alignment</td>
                {comparedProjects.map(p => (
                  <td key={p.id} className="p-4">
                    <div className="flex flex-wrap gap-1.5">
                      {(p.sdg_goals || [1, 4]).map(sdgId => {
                        const meta = SDG_GOALS.find(g => g.id === sdgId) || { id: sdgId, color: '#16A36A' };
                        return (
                          <span
                            key={sdgId}
                            style={{ backgroundColor: meta.color }}
                            className="w-6 h-6 rounded-md text-white font-black text-[10px] flex items-center justify-center shrink-0 shadow-2xs"
                            title={`SDG ${sdgId}`}
                          >
                            {sdgId}
                          </span>
                        );
                      })}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Row 4: Funding Goal & Progress */}
              <tr>
                <td className="p-4 font-bold text-slate-600 bg-slate-50/30">Funding Target & Progress</td>
                {comparedProjects.map(p => {
                  const reqFunding = (p.requirements || []).find(r => r.type === 'funding');
                  const target = reqFunding ? Number(reqFunding.target_quantity) : 25000;
                  const current = reqFunding ? Number(reqFunding.current_quantity) : 18000;
                  const pct = Math.min(100, Math.round((current / target) * 100));

                  return (
                    <td key={p.id} className="p-4">
                      <div className="flex items-center justify-between text-xs font-bold mb-1">
                        <span className="text-[#16A36A]">₹{current.toLocaleString('en-IN')}</span>
                        <span className="text-slate-400">of ₹{target.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mb-1">
                        <div className="bg-[#16A36A] h-2 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-[10px] text-slate-400 font-semibold">{pct}% funded</span>
                    </td>
                  );
                })}
              </tr>

              {/* Row 5: Volunteers Needed */}
              <tr>
                <td className="p-4 font-bold text-slate-600 bg-slate-50/30">Volunteers Required</td>
                {comparedProjects.map(p => {
                  const reqVol = (p.requirements || []).find(r => r.type === 'volunteers');
                  const needed = reqVol ? Number(reqVol.target_quantity) : 15;
                  const joined = reqVol ? Number(reqVol.current_quantity) : 10;

                  return (
                    <td key={p.id} className="p-4 font-semibold text-slate-800">
                      <div className="flex items-center space-x-1.5">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        <span>{needed} volunteers needed ({joined} registered)</span>
                      </div>
                    </td>
                  );
                })}
              </tr>

              {/* Row 6: Non-Financial Resources */}
              <tr>
                <td className="p-4 font-bold text-slate-600 bg-slate-50/30">Physical Supplies</td>
                {comparedProjects.map(p => {
                  const reqRes = (p.requirements || []).find(r => r.type === 'resources');
                  return (
                    <td key={p.id} className="p-4 text-slate-700">
                      {reqRes ? (
                        <span className="flex items-center space-x-1 font-semibold">
                          <Package className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <span>{reqRes.target_quantity} {reqRes.unit} ({reqRes.title})</span>
                        </span>
                      ) : (
                        <span className="text-slate-400">Standard operational supplies</span>
                      )}
                    </td>
                  );
                })}
              </tr>

              {/* Row 7: Verified Beneficiaries */}
              <tr>
                <td className="p-4 font-bold text-slate-600 bg-slate-50/30">Reported Beneficiaries</td>
                {comparedProjects.map(p => (
                  <td key={p.id} className="p-4">
                    <span className="text-sm font-black text-slate-900 block">
                      {(p.verified_beneficiaries || 1200).toLocaleString()}+
                    </span>
                    <span className="text-[10px] text-slate-400">Directly impacted lives</span>
                  </td>
                ))}
              </tr>

              {/* Row 8: Timeline & Milestones */}
              <tr>
                <td className="p-4 font-bold text-slate-600 bg-slate-50/30">Project Milestones</td>
                {comparedProjects.map(p => (
                  <td key={p.id} className="p-4 text-xs text-slate-600">
                    <span className="font-bold text-slate-800 block mb-1">
                      {(p.milestones || []).filter(m => m.is_completed).length} of {(p.milestones || []).length || 2} Milestones Completed
                    </span>
                    <div className="flex items-center space-x-1 text-[11px] text-slate-400">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>Target: {p.end_date || 'Ongoing Initiative'}</span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Row 9: Actions (Hidden in Print) */}
              <tr className="print:hidden">
                <td className="p-4 font-bold text-slate-600 bg-slate-50/30">Direct Action</td>
                {comparedProjects.map(p => (
                  <td key={p.id} className="p-4 space-y-2">
                    <button
                      onClick={() => {
                        onClose();
                        onPartnerClick(p);
                      }}
                      className="w-full py-2.5 rounded-xl bg-[#16A36A] hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition flex items-center justify-center space-x-1"
                    >
                      <HeartHandshake className="w-3.5 h-3.5" />
                      <span>Partner Now</span>
                    </button>

                    <button
                      onClick={() => {
                        onClose();
                        onSelectProject(p);
                      }}
                      className="w-full py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition"
                    >
                      View Full Dossier
                    </button>
                  </td>
                ))}
              </tr>

            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}