import React, { useState, useEffect } from 'react';
import { 
  HeartHandshake, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  X, 
  ArrowRight, 
  Building2, 
  ShieldCheck, 
  Sliders, 
  Info,
  RefreshCw
} from 'lucide-react';
import { checkPartnershipCompatibility, fetchNgos } from '../utils/api';

export default function PartnershipCompatibilityChecker({
  isOpen,
  currentUser,
  targetNgo,
  onClose
}) {
  const [ngos, setNgos] = useState([]);
  const [selectedNgoId, setSelectedNgoId] = useState(targetNgo?.id || 'ngo-1');
  const [partnerCause, setPartnerCause] = useState('Clean Water & Sanitation');
  const [partnerLocation, setPartnerLocation] = useState('Bihar');
  const [partnerSkills, setPartnerSkills] = useState('Solar Field Survey, Water Quality Testing, Python Mentoring');
  const [computing, setComputing] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchNgos().then(list => {
        setNgos(list);
        if (targetNgo?.id) setSelectedNgoId(targetNgo.id);
        else if (list.length > 0) setSelectedNgoId(list[0].id);
      }).catch(console.error);
    }
  }, [isOpen, targetNgo]);

  if (!isOpen) return null;

  const handleCompute = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setComputing(true);
    try {
      const skillsArray = partnerSkills.split(',').map(s => s.trim()).filter(Boolean);
      const res = await checkPartnershipCompatibility(selectedNgoId, {
        name: currentUser?.name || 'Prospective Corporate CSR Team',
        cause: partnerCause,
        location: partnerLocation,
        skills: skillsArray
      });
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setComputing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden relative">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#16A36A] border border-emerald-200 flex items-center justify-center font-bold shadow-xs">
              <HeartHandshake className="w-5 h-5 text-[#16A36A]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  Partnership Compatibility Checker
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Transparent Weights
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Calculate algorithmic alignment across causes, skillsets, geographies, and resource targets.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200/80 text-slate-400 hover:text-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 bg-slate-50/50">
          
          {/* Input Form */}
          <form onSubmit={handleCompute} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Select Target Grassroots NGO</label>
              <select
                value={selectedNgoId}
                onChange={(e) => setSelectedNgoId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
              >
                {ngos.map(n => (
                  <option key={n.id} value={n.id}>{n.name} ({n.primary_cause || 'Community'} • {n.location})</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Your Focus Cause</label>
                <input
                  type="text"
                  required
                  value={partnerCause}
                  onChange={(e) => setPartnerCause(e.target.value)}
                  placeholder="e.g. Clean Water, Education, Tree Planting"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Location</label>
                <input
                  type="text"
                  required
                  value={partnerLocation}
                  onChange={(e) => setPartnerLocation(e.target.value)}
                  placeholder="e.g. Bihar, Rajasthan, Delhi, All India"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Available Skills / Resources (Comma-separated)</label>
              <input
                type="text"
                value={partnerSkills}
                onChange={(e) => setPartnerSkills(e.target.value)}
                placeholder="e.g. Python Mentoring, Water Quality Testing, Solar Logistics"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
              />
            </div>

            <button
              type="submit"
              disabled={computing}
              className="w-full py-2.5 rounded-xl btn-primary text-xs font-bold flex items-center justify-center space-x-1.5 shadow-sm"
            >
              {computing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Computing Alignment Index...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Calculate Compatibility Index</span>
                </>
              )}
            </button>
          </form>

          {/* Results Card */}
          {result && (
            <div className="bg-white p-6 rounded-3xl border border-emerald-200 shadow-sm space-y-5 animate-fade-in">
              
              {/* Score Meter */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200">
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider block">
                    Calculated Alignment Index
                  </span>
                  <div className="text-3xl font-black text-[#16A36A] mt-0.5 tracking-tight">
                    {result.compatibility_score}%
                  </div>
                  <span className="text-xs font-bold text-slate-700">{result.rating_label}</span>
                </div>

                <div className="text-right text-xs text-slate-500">
                  <div>Comparing: <strong className="text-slate-800">{result.partner_name}</strong></div>
                  <div>With: <strong className="text-slate-800">{result.ngo_name}</strong></div>
                </div>
              </div>

              {/* Positive Factors */}
              {result.positive_factors?.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-800 flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#16A36A]" />
                    <span>Key Positive Synergies ({result.positive_factors.length})</span>
                  </span>
                  <div className="space-y-1.5">
                    {result.positive_factors.map((f, i) => (
                      <div key={i} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 font-medium">
                        {f}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Missing Requirements / Resource Gaps */}
              {result.missing_requirements?.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-amber-800 flex items-center space-x-1">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Identified Gaps / Unmet Requirements ({result.missing_requirements.length})</span>
                  </span>
                  <div className="space-y-1.5">
                    {result.missing_requirements.map((g, i) => (
                      <div key={i} className="p-2.5 rounded-xl bg-amber-50/50 border border-amber-200 text-xs text-amber-900 font-medium">
                        {g}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Mandatory Non-Guarantee Disclaimer */}
              <div className="p-3.5 rounded-2xl bg-slate-100 text-[11px] text-slate-500 leading-relaxed border border-slate-200 flex items-start space-x-2">
                <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Non-Guarantee Notice:</strong> {result.non_guarantee_notice}
                </span>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
