import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  BrainCircuit, 
  Zap, 
  Target, 
  CheckCircle2, 
  ArrowRight, 
  Handshake, 
  Loader2,
  Briefcase,
  Layers,
  MapPin
} from 'lucide-react';
import { fetchAiMatches } from '../utils/api';
import { CAUSE_CATEGORIES } from '../data/sdgConstants';

export default function AiMatchView({ currentPersona, onSelectProject, onPartnerClick }) {
  const [supporterType, setSupporterType] = useState(
    currentPersona.type === 'ngo' ? 'skilled_professional' : currentPersona.type
  );
  const [skills, setSkills] = useState(
    currentPersona.type === 'skilled_professional' ? 'ultrasound, medicine, telemedicine' :
    currentPersona.type === 'individual_volunteer' ? 'tree planting, community outreach' :
    'grant funding, corporate csr, laptops'
  );
  const [causeInterest, setCauseInterest] = useState('all');
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);

  const runSmartMatch = async () => {
    setLoading(true);
    try {
      const data = await fetchAiMatches({
        supporter_type: supporterType,
        skills,
        interests: causeInterest !== 'all' ? causeInterest : ''
      });
      setMatches(data);
    } catch (err) {
      console.error('Smart match error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runSmartMatch();
  }, [supporterType, causeInterest]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-8">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>AI-Powered Partner Matching Engine</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Smart Match: Connect with Initiatives That Need <span className="text-purple-400">Your Exact Capabilities</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-2">
          Our algorithmic matching engine pairs your skills, CSR criteria, and passion with grassroots community requirements.
        </p>
      </div>

      {/* Match Configuration Card */}
      <div className="bg-slate-900 border border-purple-500/20 rounded-3xl p-6 shadow-2xl mb-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              1. Your Supporter Role
            </label>
            <select
              value={supporterType}
              onChange={(e) => setSupporterType(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 cursor-pointer"
            >
              <option value="corporate_csr">Corporate CSR Partner</option>
              <option value="skilled_professional">Skilled Professional (Pro Bono)</option>
              <option value="individual_volunteer">Individual / Youth Volunteer</option>
              <option value="donor">Philanthropic Donor / Grantmaker</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              2. Skills, Assets or Resources Offered
            </label>
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="e.g. Python, healthcare, laptops, solar, funding"
              className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              3. Preferred Social Cause
            </label>
            <select
              value={causeInterest}
              onChange={(e) => setCauseInterest(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 cursor-pointer capitalize"
            >
              {CAUSE_CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={runSmartMatch}
            disabled={loading}
            className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center space-x-2 shadow-lg shadow-purple-600/30 transition"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Computing AI Recommendations...</span>
              </>
            ) : (
              <>
                <BrainCircuit className="w-4 h-4" />
                <span>Recalculate Best Matches</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Recommended Projects Grid */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white flex items-center space-x-2">
          <Zap className="w-4 h-4 text-amber-400" />
          <span>Top Algorithmic Matches For You:</span>
        </h3>

        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-purple-400 mb-2" />
            Matching with real-time NGO needs...
          </div>
        ) : matches.length === 0 ? (
          <div className="p-8 text-center text-slate-400">No matches found. Try broadening your keywords.</div>
        ) : (
          matches.map((proj, idx) => (
            <div 
              key={proj.id}
              className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-purple-500/40 transition duration-300 shadow-xl flex flex-col md:flex-row gap-5 items-start md:items-center justify-between"
            >
              <div className="flex items-start space-x-4">
                {/* Match Score Badge */}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex flex-col items-center justify-center text-white shrink-0 shadow-lg shadow-purple-950/40">
                  <span className="text-xl font-black">{proj.matchScore}%</span>
                  <span className="text-[9px] uppercase font-bold tracking-wider opacity-80">Match</span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-emerald-400 font-semibold">{proj.ngo_name}</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-xs text-slate-400 flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{proj.is_remote ? 'Remote' : `${proj.location_city}, ${proj.location_country}`}</span>
                    </span>
                  </div>

                  <h4 
                    onClick={() => onSelectProject(proj)}
                    className="text-base sm:text-lg font-bold text-white hover:text-purple-300 cursor-pointer transition"
                  >
                    {proj.title}
                  </h4>

                  <p className="text-xs text-slate-300 line-clamp-1 max-w-2xl">{proj.tagline}</p>

                  {/* Why it matches */}
                  <div className="pt-2 flex flex-wrap gap-1.5 items-center">
                    <span className="text-[10px] text-purple-300 font-bold uppercase mr-1">Match Reasoning:</span>
                    {(proj.matchReasons || []).map((reason, rIdx) => (
                      <span key={rIdx} className="text-[11px] px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-200 flex items-center space-x-1">
                        <CheckCircle2 className="w-2.5 h-2.5 text-purple-400" />
                        <span>{reason}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2 w-full md:w-auto self-end md:self-center shrink-0">
                <button
                  onClick={() => onSelectProject(proj)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
                >
                  View Details
                </button>

                <button
                  onClick={() => onPartnerClick(proj)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-emerald-600/30 transition"
                >
                  <Handshake className="w-3.5 h-3.5" />
                  <span>Send Proposal</span>
                </button>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}
