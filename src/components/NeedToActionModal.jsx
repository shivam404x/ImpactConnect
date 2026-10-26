import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Package, 
  Users, 
  ShieldCheck, 
  RefreshCw,
  HelpCircle,
  Clock
} from 'lucide-react';
import { convertNeedToAction, publishNeedToAction } from '../utils/api';

const SAMPLE_NEEDS = [
  {
    label: 'Flooded Village School Needs (Bihar)',
    text: 'Flash floods damaged 4 primary school buildings in Darbhanga, Bihar. Around 350 rural school children urgently need 350 notebook study kits, 20 refurbished laptops for teachers, and ₹1,20,000 for roof repair and clean drinking water purification before the semester starts in 2 weeks.'
  },
  {
    label: 'Urban Miyawaki Afforestation (Delhi NCR)',
    text: 'We want to convert a barren 3-acre civic wasteland in South Delhi into a native Miyawaki micro-forest. We need 8,000 indigenous saplings, 15 drip irrigation rolls, 25 volunteer tree planters for weekend drives, and ₹1,50,000 for soil de-compaction.'
  },
  {
    label: 'Border District Girls STEM Lab (Rajasthan)',
    text: 'In Barmer, Rajasthan, 400 high school girls have no access to computers. We need 30 laptops, 5 STEM robotics kits, 4 volunteer Python instructors for weekend workshops, and ₹2,00,000 for solar microgrid battery backup.'
  }
];

export default function NeedToActionModal({
  isOpen,
  currentUser,
  onClose,
  onSuccess
}) {
  const [prompt, setPrompt] = useState('');
  const [converting, setConverting] = useState(false);
  const [draft, setDraft] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleConvert = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!prompt.trim()) return;

    setConverting(true);
    setError(null);
    try {
      const result = await convertNeedToAction(prompt, {
        id: currentUser?.id || 'ngo-1',
        name: currentUser?.name || 'Verified Community NGO'
      });
      setDraft(result);
      setConfirmed(false);
    } catch (err) {
      setError(err.message || 'Failed to convert need statement.');
    } finally {
      setConverting(false);
    }
  };

  const handlePublish = async () => {
    if (!draft || !confirmed) return;
    setPublishing(true);
    setError(null);
    try {
      const published = await publishNeedToAction(draft);
      if (onSuccess) onSuccess(published);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to publish campaign.');
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden relative">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#16A36A] border border-emerald-200 flex items-center justify-center font-bold shadow-xs">
              <Sparkles className="w-5 h-5 text-[#16A36A]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  Need-to-Action Converter
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Rule-Based NLP
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Convert unstructured community challenges into structured, auditable impact campaigns.
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

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 bg-slate-50/50">
          
          {error && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1: NATURAL LANGUAGE INPUT */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <label className="block text-xs font-bold text-slate-800">
              Describe the Community Need in Natural Language
            </label>
            <textarea
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. 400 school children in Darbhanga have no clean drinking water after monsoon floods. We need 2 water purifiers, 400 study kits, 5 volunteer teachers and ₹1,20,000 for roof reconstruction by next month..."
              className="w-full p-3 rounded-2xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A36A] focus:border-transparent transition leading-relaxed"
            />

            {/* Quick Sample Prompts */}
            <div>
              <span className="text-[11px] font-bold text-slate-400 block mb-1.5">
                Try Sample Community Need Statements:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {SAMPLE_NEEDS.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPrompt(s.text)}
                    className="px-2.5 py-1 rounded-xl text-[11px] font-semibold bg-slate-50 hover:bg-emerald-50 hover:text-[#16A36A] border border-slate-200 hover:border-emerald-200 text-slate-600 transition text-left"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              disabled={converting || !prompt.trim()}
              onClick={handleConvert}
              className="w-full py-2.5 rounded-xl btn-primary text-xs font-bold flex items-center justify-center space-x-2 shadow-xs transition disabled:opacity-50 mt-2"
            >
              {converting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Analyzing & Structuring Campaign Draft...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Convert Need into Structured Campaign</span>
                </>
              )}
            </button>
          </div>

          {/* STEP 2: CONVERTED STRUCTURED CAMPAIGN DRAFT */}
          {draft && (
            <div className="bg-white p-5 rounded-3xl border border-emerald-200 shadow-sm space-y-4 animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    Structured Campaign Draft
                  </span>
                </div>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  {draft.budget_estimation_tag}
                </span>
              </div>

              {/* Title & Metadata */}
              <div className="space-y-1">
                <input
                  type="text"
                  value={draft.title}
                  onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                  className="w-full text-base font-black text-slate-900 border-b border-dashed border-slate-300 focus:outline-none focus:border-[#16A36A] py-1"
                />
                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-500">
                  <span className="inline-flex items-center space-x-1 font-semibold text-slate-700">
                    <MapPin className="w-3.5 h-3.5 text-[#16A36A]" />
                    <span>{draft.location}</span>
                  </span>
                  <span>•</span>
                  <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    Cause: {draft.cause} (SDG {draft.sdg_number})
                  </span>
                  <span>•</span>
                  <span className="inline-flex items-center space-x-1 font-medium text-slate-600">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Urgency: {draft.urgency_score}</span>
                  </span>
                </div>
              </div>

              {/* Estimated Budget Banner */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider block">
                    Suggested Budget Target
                  </span>
                  <div className="text-lg font-black text-slate-900 mt-0.5">
                    ₹{Number(draft.estimated_budget || 0).toLocaleString()}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                    Suggested Deadline
                  </span>
                  <span className="text-xs font-bold text-slate-800 font-mono">
                    {draft.suggested_deadline}
                  </span>
                </div>
              </div>

              {/* Extracted Itemized Resources */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 block">
                  Identified Requirements Breakdown ({draft.resources?.length || 0})
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {draft.resources?.map((res, i) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 flex items-center space-x-1">
                          {res.type === 'funding' && <DollarSign className="w-3 h-3 text-[#16A36A]" />}
                          {res.type === 'goods' && <Package className="w-3 h-3 text-blue-600" />}
                          {res.type === 'volunteers' && <Users className="w-3 h-3 text-purple-600" />}
                          <span>{res.name}</span>
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-slate-700 border border-slate-200">
                          Qty: {res.quantity}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-tight">
                        {res.notes}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* NGO Confirmation & Verification Guard */}
              <div className="pt-2 border-t border-slate-100">
                <label className="flex items-start space-x-2.5 p-3 rounded-2xl bg-slate-50 hover:bg-slate-100/70 border border-slate-200 cursor-pointer transition">
                  <input
                    type="checkbox"
                    checked={confirmed}
                    onChange={(e) => setConfirmed(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-[#16A36A] focus:ring-[#16A36A]"
                  />
                  <div className="text-xs text-slate-700 leading-snug">
                    <span className="font-bold text-slate-900 block">
                      NGO Field Verification & Confirmation Required
                    </span>
                    I confirm that this structured draft accurately reflects our on-ground community need and that estimated quantities and budget estimates have been reviewed by our authorized project lead.
                  </div>
                </label>
              </div>

              {/* Publish Action */}
              <button
                type="button"
                disabled={!confirmed || publishing}
                onClick={handlePublish}
                className="w-full py-3 rounded-xl btn-primary text-xs font-bold flex items-center justify-center space-x-2 shadow-md transition disabled:opacity-40"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>
                  {publishing ? 'Publishing Campaign Live...' : 'Confirm & Publish to Active Platform Drives'}
                </span>
              </button>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
