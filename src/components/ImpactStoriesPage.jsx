import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Calendar, 
  ArrowRight, 
  Plus, 
  X, 
  AlertCircle,
  Camera,
  Heart,
  TrendingUp,
  RefreshCw
} from 'lucide-react';
import { fetchImpactStories, publishImpactStory } from '../utils/api';

export default function ImpactStoriesPage({
  currentUser,
  onOpenAuth,
  language = 'en'
}) {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [cause, setCause] = useState('Clean Water & Health');
  const [beforeImage, setBeforeImage] = useState('https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=800&q=80');
  const [afterImage, setAfterImage] = useState('https://images.unsplash.com/photo-1559827291-72ee739d0d9a?auto=format&fit=crop&w=800&q=80');
  const [beforeDescription, setBeforeDescription] = useState('');
  const [afterDescription, setAfterDescription] = useState('');
  const [metricLabel, setMetricLabel] = useState('Clean Water Generated');
  const [metricValue, setMetricValue] = useState('45,000 Liters / Month');
  const [consentVerified, setConsentVerified] = useState(false);
  const [isAudited, setIsAudited] = useState(true);
  const [auditorName, setAuditorName] = useState('Independent Field Inspector');
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState(null);

  const loadStories = async () => {
    setLoading(true);
    try {
      const data = await fetchImpactStories();
      setStories(data);
    } catch (err) {
      console.error('Error fetching impact stories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStories();
  }, []);

  const handlePublishSubmit = async (e) => {
    e.preventDefault();
    if (!consentVerified) {
      setPublishError('Beneficiary consent and ethical photographic guidelines must be confirmed.');
      return;
    }

    setPublishing(true);
    setPublishError(null);
    try {
      await publishImpactStory({
        title,
        cause,
        ngo_name: currentUser?.name || 'Verified Community NGO',
        before_image: beforeImage,
        after_image: afterImage,
        before_description: beforeDescription,
        after_description: afterDescription,
        quantified_outcomes: [{ label: metricLabel, value: metricValue }],
        consent_verified: consentVerified,
        is_audited: isAudited,
        auditor_name: auditorName
      });
      setIsPublishModalOpen(false);
      loadStories();
    } catch (err) {
      setPublishError(err.message || 'Failed to publish impact story.');
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xs relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-wider text-[#16A36A] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-flex items-center space-x-1.5">
                <Camera className="w-3.5 h-3.5 text-[#16A36A]" />
                <span>Verified Visual Transformation</span>
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Before-and-After Impact Stories
              </h1>
              <p className="text-sm text-slate-600 leading-relaxed">
                Explore real, tangible change delivered on the ground. Transparent before-and-after photo comparisons, quantified beneficiary outcomes, and independent field audit confirmations.
              </p>
            </div>

            <button
              onClick={() => setIsPublishModalOpen(true)}
              className="px-5 py-3 rounded-2xl btn-primary text-xs font-bold flex items-center space-x-2 shadow-sm self-start sm:self-auto shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Publish Impact Story</span>
            </button>
          </div>
        </div>

        {/* Stories Gallery */}
        {loading ? (
          <div className="py-20 text-center">
            <RefreshCw className="w-8 h-8 animate-spin text-[#16A36A] mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-500">Loading Stories of Transformation...</p>
          </div>
        ) : (
          <div className="space-y-12">
            {stories.map(st => (
              <div key={st.id} className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
                
                {/* Header Strip */}
                <div className="p-6 sm:p-8 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center space-x-2 text-xs text-slate-500 mb-1">
                      <span className="font-bold text-[#16A36A]">{st.ngo_name}</span>
                      <span>•</span>
                      <span>{st.cause}</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      {st.title}
                    </h3>
                  </div>

                  <div className="flex items-center space-x-2">
                    {st.verification_status === 'field_audited' ? (
                      <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold inline-flex items-center space-x-1.5 shadow-xs">
                        <ShieldCheck className="w-4 h-4 text-[#16A36A]" />
                        <span>Field-Audited & Verified</span>
                      </span>
                    ) : (
                      <span className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold inline-flex items-center space-x-1.5">
                        <span>Self-Reported Claim</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Side-by-Side Photographic Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                  
                  {/* BEFORE */}
                  <div className="p-6 sm:p-8 space-y-4 bg-slate-50/40">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase tracking-wider text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
                        Before Intervention
                      </span>
                    </div>
                    
                    <div className="h-64 sm:h-72 w-full rounded-2xl overflow-hidden bg-slate-200 shadow-inner relative group">
                      <img 
                        src={st.before_image} 
                        alt="Before intervention" 
                        loading="lazy"
                        crossOrigin="anonymous"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=800&q=80';
                        }}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                      />
                      <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold">
                        Baseline Condition
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {st.before_description}
                    </p>
                  </div>

                  {/* AFTER */}
                  <div className="p-6 sm:p-8 space-y-4 bg-emerald-50/20">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase tracking-wider text-[#16A36A] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                        After Verified Completion
                      </span>
                    </div>

                    <div className="h-64 sm:h-72 w-full rounded-2xl overflow-hidden bg-slate-200 shadow-inner relative group">
                      <img 
                        src={st.after_image} 
                        alt="After intervention" 
                        loading="lazy"
                        crossOrigin="anonymous"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1559827291-72ee739d0d9a?auto=format&fit=crop&w=800&q=80';
                        }}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                      />
                      <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-lg bg-emerald-950/70 backdrop-blur-sm text-emerald-300 text-[10px] font-bold flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3 text-[#16A36A]" />
                        <span>Delivered & Verified</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed font-medium">
                      {st.after_description}
                    </p>
                  </div>

                </div>

                {/* Measurable Outcomes Ribbon */}
                <div className="p-6 sm:p-8 bg-white border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1">
                    {st.quantified_outcomes?.map((out, i) => (
                      <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                        <span className="text-[11px] font-bold text-slate-500 block uppercase tracking-wider">{out.label}</span>
                        <div className="text-lg font-black text-[#16A36A] mt-1">{out.value}</div>
                      </div>
                    ))}
                  </div>

                  <div className="text-xs text-slate-400 space-y-1 sm:text-right shrink-0">
                    <div className="font-semibold text-slate-600">Audited By: {st.auditor_name || 'Independent Assessor'}</div>
                    <div>Ethics: Beneficiary Consent Verified</div>
                    <div className="font-mono text-[10px]">Published: {st.published_date}</div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>

      {/* PUBLISH MODAL */}
      {isPublishModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 max-h-[90vh] overflow-y-auto relative">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#16A36A] bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  Impact Proof Publication
                </span>
                <h3 className="text-base font-black text-slate-900 mt-1">Publish Before-and-After Story</h3>
              </div>
              <button
                onClick={() => setIsPublishModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {publishError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
                {publishError}
              </div>
            )}

            <form onSubmit={handlePublishSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Story Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Transforming Open Waste Ground into a Community Micro-Forest"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Before Image URL</label>
                  <input
                    type="url"
                    required
                    value={beforeImage}
                    onChange={(e) => setBeforeImage(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">After Image URL</label>
                  <input
                    type="url"
                    required
                    value={afterImage}
                    onChange={(e) => setAfterImage(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Before State Narrative</label>
                <textarea
                  rows={2}
                  required
                  value={beforeDescription}
                  onChange={(e) => setBeforeDescription(e.target.value)}
                  placeholder="Describe the condition, health risks, or lack of resources prior to project start..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">After State Narrative</label>
                <textarea
                  rows={2}
                  required
                  value={afterDescription}
                  onChange={(e) => setAfterDescription(e.target.value)}
                  placeholder="Describe the verified outcome and community transformation achieved..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Key Outcome Metric Label</label>
                  <input
                    type="text"
                    value={metricLabel}
                    onChange={(e) => setMetricLabel(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Quantified Value</label>
                  <input
                    type="text"
                    value={metricValue}
                    onChange={(e) => setMetricValue(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                  />
                </div>
              </div>

              {/* Ethical Consent Guard */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <label className="flex items-start space-x-2 cursor-pointer text-xs text-slate-700">
                  <input
                    type="checkbox"
                    checked={consentVerified}
                    onChange={(e) => setConsentVerified(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-[#16A36A] focus:ring-[#16A36A]"
                  />
                  <span>
                    <strong>Beneficiary Consent Guarantee:</strong> I certify that all individuals photographed have given informed ethical consent and minor identities are protected in compliance with child protection guidelines.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={publishing || !consentVerified}
                className="w-full py-3 rounded-xl btn-primary text-xs font-bold flex items-center justify-center space-x-2 shadow-md disabled:opacity-40"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{publishing ? 'Publishing Story...' : 'Publish Verified Impact Story'}</span>
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
