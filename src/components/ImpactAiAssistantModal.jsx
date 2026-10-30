import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  ArrowRight, 
  CheckCircle2, 
  Building2, 
  MapPin, 
  Users, 
  Package, 
  IndianRupee, 
  HeartHandshake,
  Bot,
  RefreshCw,
  HelpCircle
} from 'lucide-react';
import { parseNgoRequirement, createProject } from '../utils/api';

const SAMPLE_PROMPTS = [
  "We need three volunteer teachers and 50 books in Darbhanga.",
  "Urgent requirement for 20 wheelchairs and first-aid kits for rural clinic in Mumbai.",
  "Seeking corporate CSR grant of ₹15,00,000 and 40 laptops for digital literacy center in Pune."
];

export default function ImpactAiAssistantModal({
  isOpen,
  currentUser,
  onClose,
  onProjectCreated
}) {
  const [prompt, setPrompt] = useState('');
  const [parsing, setParsing] = useState(false);
  const [result, setResult] = useState(null);
  const [publishing, setPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);

  if (!isOpen) return null;

  const handleParse = async (textToParse) => {
    const query = textToParse || prompt;
    if (!query.trim()) return;
    setParsing(true);
    setResult(null);
    try {
      const res = await parseNgoRequirement(query);
      setResult(res);
    } catch (err) {
      alert('AI Assistant Error: ' + err.message);
    } finally {
      setParsing(false);
    }
  };

  const handlePublishProject = async () => {
    if (!result?.parsedData) return;
    setPublishing(true);
    try {
      const data = result.parsedData;
      const created = await createProject({
        ngo_id: currentUser?.ngo_id || 'ngo-1',
        title: data.title,
        tagline: data.tagline,
        description: data.description,
        cause_category: data.cause_category,
        location_city: data.location_city,
        location_country: data.location_country,
        urgency: data.urgency,
        is_remote: data.is_remote,
        estimated_beneficiaries: data.estimated_beneficiaries,
        requirements: data.requirements
      });
      setPublishSuccess(true);
      setTimeout(() => {
        setPublishSuccess(false);
        if (onProjectCreated) onProjectCreated(created);
        onClose();
      }, 1600);
    } catch (err) {
      alert('Error publishing AI drafted project: ' + err.message);
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden relative">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#16A36A] border border-emerald-200 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Impact AI Assistant</h2>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  NLP Parser
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Turn plain-text needs into structured SDG requirements & matching supporter recommendations.
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
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Prompt Input Box */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">
              Describe your community requirement in natural language:
            </label>
            <div className="relative">
              <textarea
                rows="3"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. We need three volunteer teachers and 50 books in Darbhanga..."
                className="w-full p-4 rounded-2xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A36A] pr-24"
              ></textarea>
              <button
                type="button"
                onClick={() => handleParse()}
                disabled={parsing || !prompt.trim()}
                className="absolute right-3 bottom-3 px-4 py-2 rounded-xl btn-primary text-xs font-bold flex items-center space-x-1.5 shadow-sm disabled:opacity-50"
              >
                {parsing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Bot className="w-3.5 h-3.5" />}
                <span>{parsing ? 'Parsing...' : 'Analyze'}</span>
              </button>
            </div>

            {/* Quick Prompt Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] font-semibold text-slate-400 mr-1">Examples:</span>
              {SAMPLE_PROMPTS.map((sample, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setPrompt(sample);
                    handleParse(sample);
                  }}
                  className="text-[11px] text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition"
                >
                  "{sample.slice(0, 32)}..."
                </button>
              ))}
            </div>
          </div>

          {/* AI Result Cards */}
          {result && (
            <div className="space-y-5 animate-fade-in border-t border-slate-100 pt-5">
              
              {/* Extraction Transparency Badge */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#16A36A]" />
                  <span>Structured entities extracted with 100% transparent rule-based logic.</span>
                </span>
                <span className="font-bold text-slate-700">Verified</span>
              </div>

              {/* Extracted Fields Grid */}
              <div className="bg-[#F8FAFC] rounded-2xl p-5 border border-slate-200 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#16A36A]">Extracted Project Draft</span>
                    <h3 className="text-base font-black text-slate-900 mt-0.5">{result.parsedData.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{result.parsedData.tagline}</p>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                    result.parsedData.urgency === 'urgent' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {result.parsedData.urgency} Urgency
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Cause Sector</span>
                    <span className="font-bold text-slate-800 capitalize">{result.parsedData.cause_category.replace('_', ' ')}</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Target Location</span>
                    <span className="font-bold text-slate-800">{result.parsedData.location_city}, {result.parsedData.location_country}</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Est. Beneficiaries</span>
                    <span className="font-bold text-slate-800">{result.parsedData.estimated_beneficiaries} persons</span>
                  </div>
                </div>

                {/* Structured Requirements */}
                <div>
                  <span className="text-xs font-bold text-slate-700 block mb-2">Disaggregated Requirements:</span>
                  <div className="space-y-2">
                    {result.parsedData.requirements.map((req, idx) => (
                      <div key={idx} className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-emerald-50 text-[#16A36A]">
                            {req.type}
                          </span>
                          <span className="font-bold text-slate-900">{req.title}</span>
                        </div>
                        <span className="font-black text-[#16A36A]">
                          {req.target_quantity} {req.unit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recommended Supporters */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                  AI-Recommended Matching Supporters
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {result.recommendedSupporters.map((supp, sIdx) => (
                    <div key={sIdx} className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-start space-x-3">
                      <img
                        src={supp.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80'}
                        alt=""
                        className="w-10 h-10 rounded-xl object-cover ring-2 ring-emerald-500/20 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h5 className="font-bold text-slate-900 text-xs truncate">{supp.name}</h5>
                          <span className="text-[10px] font-black text-[#16A36A] bg-emerald-50 px-1.5 py-0.5 rounded">
                            {supp.matchScore}%
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 block capitalize">{supp.supporter_type?.replace(/_/g, ' ')}</span>
                        <div className="text-[10px] text-slate-500 mt-1">
                          ✓ {supp.matchReasons[0]}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-[11px] text-slate-400">
            {result ? 'Review the drafted parameters before publishing.' : 'Enter text above to trigger smart structuring.'}
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>

            {result && (
              <button
                type="button"
                onClick={handlePublishProject}
                disabled={publishing || publishSuccess}
                className="px-5 py-2.5 rounded-xl btn-primary text-xs font-bold flex items-center space-x-1.5 shadow-sm"
              >
                {publishSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Project Published!</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>{publishing ? 'Publishing...' : 'Publish Project From AI Draft'}</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
