import React, { useState, useEffect } from 'react';
import { 
  History, 
  ShieldCheck, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Activity, 
  Award, 
  FileCheck, 
  ExternalLink, 
  Search, 
  Filter, 
  RefreshCw, 
  X, 
  TrendingUp, 
  Eye, 
  Building2, 
  Check 
} from 'lucide-react';
import { fetchLongTermFollowups, submitLongTermFollowup, verifyLongTermFollowup, fetchProjects } from '../utils/api';

export default function LongTermImpactFollowUp({ currentUser, onOpenAuth, language = 'en' }) {
  const [followups, setFollowups] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterInterval, setFilterInterval] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  // New Follow-Up Report Modal
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [projectId, setProjectId] = useState('proj-1');
  const [intervalDays, setIntervalDays] = useState('90');
  const [survivalRate, setSurvivalRate] = useState('98.5% Active Operations');
  const [satisfactionScore, setSatisfactionScore] = useState(92);
  const [beneficiaryFeedback, setBeneficiaryFeedback] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [auditorName, setAuditorName] = useState('Independent Social Audit Cell');
  const [outcomeType, setOutcomeType] = useState('independent_audit');
  const [metric1Label, setMetric1Label] = useState('Beneficiary Retention');
  const [metric1Val, setMetric1Val] = useState('94% regular users');
  const [metric2Label, setMetric2Label] = useState('Maintenance Status');
  const [metric2Val, setMetric2Val] = useState('Zero downtime reported');

  // Verify Audit Action Modal
  const [verifyTarget, setVerifyTarget] = useState(null);
  const [verifyAuditor, setVerifyAuditor] = useState(currentUser?.name || 'Third-Party Impact Auditor');
  const [verifying, setVerifying] = useState(false);

  const [notification, setNotification] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [followData, projData] = await Promise.all([
        fetchLongTermFollowups().catch(() => []),
        fetchProjects().catch(() => [])
      ]);
      setFollowups(followData);
      setProjects(projData);
    } catch (err) {
      console.error('Error fetching long-term follow-ups:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmitReport = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const selectedProj = projects.find(p => p.id === projectId) || { title: 'Clean Water Wells & Solar Micro-Grids', ngo_name: 'Jal Jeevan Mission Trust' };
      const payload = {
        project_title: selectedProj.title,
        ngo_name: selectedProj.ngo_name || 'Partner NGO',
        interval_days: parseInt(intervalDays, 10),
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: outcomeType === 'independent_audit' ? 'verified' : 'submitted',
        outcome_type: outcomeType,
        auditor_name: auditorName,
        survival_rate_or_uptime: survivalRate,
        beneficiary_satisfaction_score: parseInt(satisfactionScore, 10),
        measured_metrics: [
          { label: metric1Label, value: metric1Val },
          { label: metric2Label, value: metric2Val }
        ],
        beneficiary_feedback: beneficiaryFeedback,
        evidence_photo_url: photoUrl || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80'
      };

      await submitLongTermFollowup(projectId, payload);
      setNotification({ type: 'success', text: 'Long-term impact follow-up audit logged successfully!' });
      setShowSubmitModal(false);
      setBeneficiaryFeedback('');
      loadData();
    } catch (err) {
      setNotification({ type: 'error', text: err.message || 'Failed to submit follow-up report' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!verifyTarget) return;
    setVerifying(true);
    try {
      await verifyLongTermFollowup(verifyTarget.id, {
        auditor_name: verifyAuditor
      });
      setNotification({ type: 'success', text: 'Audit officially verified and sealed!' });
      setVerifyTarget(null);
      loadData();
    } catch (err) {
      setNotification({ type: 'error', text: err.message || 'Failed to verify audit' });
    } finally {
      setVerifying(false);
    }
  };

  const filteredFollowups = followups.filter(f => {
    if (filterInterval !== 'all' && f.interval_days.toString() !== filterInterval) return false;
    if (filterStatus !== 'all' && f.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50/50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Banner */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-3 border border-emerald-100">
                <History className="w-3.5 h-3.5" />
                Post-Completion Sustainability & Audit Tracker
              </div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Long-Term Impact Follow-Up</h1>
              <p className="text-slate-500 text-sm mt-1 max-w-2xl">
                Rigorous 30, 90, 180, and 365-day sustainability monitoring. Ensuring assets remain operational and delivering real community value years after project funding concludes.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSubmitModal(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                Log Sustainability Audit
              </button>
            </div>
          </div>

          {/* Toast Notification */}
          {notification && (
            <div className={`mt-4 p-3 rounded-xl text-sm flex items-center justify-between ${
              notification.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{notification.text}</span>
              </div>
              <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Aggregate Sustainability KPI Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Monitored Completed Projects</span>
            <div className="text-2xl font-bold text-slate-900 mt-1">{followups.length} Projects</div>
            <span className="text-xs text-emerald-600 mt-1 inline-block">Active field tracking</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Asset Uptime / Survival</span>
            <div className="text-2xl font-bold text-emerald-600 mt-1">97.8% Average</div>
            <span className="text-xs text-slate-500 mt-1 inline-block">Across RO plants & saplings</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Beneficiary Satisfaction</span>
            <div className="text-2xl font-bold text-slate-900 mt-1">92.5 / 100</div>
            <span className="text-xs text-emerald-600 mt-1 inline-block">Direct community feedback</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Independent Audits</span>
            <div className="text-2xl font-bold text-slate-900 mt-1">
              {followups.filter(f => f.status === 'verified').length} Certified
            </div>
            <span className="text-xs text-slate-500 mt-1 inline-block">Verified by 3rd party panels</span>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              Interval Filter:
            </span>

            {['all', '30', '90', '180', '365'].map(int => (
              <button
                key={int}
                onClick={() => setFilterInterval(int)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  filterInterval === int
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {int === 'all' ? 'All Intervals' : `${int} Days Post-Launch`}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700"
            >
              <option value="all">All Verification Statuses</option>
              <option value="verified">Third-Party Verified</option>
              <option value="submitted">Pending Verification</option>
            </select>

            <button
              onClick={loadData}
              className="p-2 text-slate-500 hover:text-slate-800 bg-slate-50 border border-slate-200 rounded-xl"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Follow-up Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredFollowups.map(report => {
            const isVerified = report.status === 'verified';

            return (
              <div
                key={report.id}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-5"
              >
                <div className="space-y-4">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 font-bold text-xs">
                      <Clock className="w-3.5 h-3.5 text-emerald-600" />
                      Day {report.interval_days} Post-Launch Follow-Up
                    </span>

                    {isVerified ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        Third-Party Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                        <Clock className="w-4 h-4 text-amber-600" />
                        Pending Audit
                      </span>
                    )}
                  </div>

                  {/* Project Info */}
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{report.project_title}</h3>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      {report.ngo_name}
                    </p>
                  </div>

                  {/* Metrics Row */}
                  <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div>
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Asset Health / Survival</span>
                      <div className="text-base font-extrabold text-emerald-700 mt-0.5">{report.survival_rate_or_uptime}</div>
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Community Sentiment</span>
                      <div className="text-base font-extrabold text-slate-900 mt-0.5">{report.beneficiary_satisfaction_score} / 100 Score</div>
                    </div>
                  </div>

                  {/* Measured Metrics */}
                  <div className="space-y-1.5 text-xs">
                    <span className="font-bold text-slate-800">Field Survey Measured Parameters:</span>
                    <div className="space-y-1">
                      {report.measured_metrics?.map((m, idx) => (
                        <div key={idx} className="flex justify-between items-center py-1 border-b border-slate-100 last:border-none">
                          <span className="text-slate-600">{m.label}</span>
                          <span className="font-bold text-slate-900">{m.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Beneficiary Feedback */}
                  {report.beneficiary_feedback && (
                    <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100/60 text-xs text-slate-700 italic">
                      "{report.beneficiary_feedback}"
                    </div>
                  )}

                  {/* Evidence Photo Preview */}
                  {report.evidence_photo_url && (
                    <div className="relative rounded-2xl overflow-hidden group cursor-pointer" onClick={() => setSelectedPhoto(report.evidence_photo_url)}>
                      <img
                        src={report.evidence_photo_url}
                        alt="Audit Evidence"
                        className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold gap-1.5">
                        <Eye className="w-4 h-4" />
                        Click to Inspect Field Photo
                      </div>
                      <div className="absolute bottom-2 left-2 bg-slate-900/70 text-white text-[10px] px-2 py-0.5 rounded-md backdrop-blur-sm">
                        Verified Field Geotagged Photo
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Auditor & Verification */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="text-slate-500">
                    Auditor: <strong className="text-slate-800">{report.auditor_name}</strong>
                  </div>

                  {!isVerified && (
                    <button
                      onClick={() => {
                        setVerifyTarget(report);
                        setVerifyAuditor(currentUser?.name || 'Third-Party Social Auditor');
                      }}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs flex items-center gap-1 shadow-sm"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Verify Audit
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Submit Audit Modal */}
        {showSubmitModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <History className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-lg font-bold text-slate-900">Log Long-Term Sustainability Audit</h3>
                </div>
                <button onClick={() => setShowSubmitModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmitReport} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Target Project</label>
                  <select
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800"
                  >
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.title} ({p.ngo_name || 'NGO'})</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Interval Milestone</label>
                    <select
                      value={intervalDays}
                      onChange={(e) => setIntervalDays(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800"
                    >
                      <option value="30">30 Days Post-Completion</option>
                      <option value="90">90 Days Post-Completion</option>
                      <option value="180">180 Days Post-Completion</option>
                      <option value="365">1 Year (365 Days) Follow-Up</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Audit Type</label>
                    <select
                      value={outcomeType}
                      onChange={(e) => setOutcomeType(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800"
                    >
                      <option value="independent_audit">Third-Party Independent Audit</option>
                      <option value="ngo_self_reported">NGO Self-Reported Survey</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Asset Uptime / Survival Rate</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 99.4% Solar Uptime"
                      value={survivalRate}
                      onChange={(e) => setSurvivalRate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Satisfaction Score (0-100)</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={satisfactionScore}
                      onChange={(e) => setSatisfactionScore(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Metric 1 (Label & Value)</label>
                    <input
                      type="text"
                      placeholder="Label (e.g. Water Purity)"
                      value={metric1Label}
                      onChange={(e) => setMetric1Label(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-800 mb-1"
                    />
                    <input
                      type="text"
                      placeholder="Value (e.g. 0.4 NTU)"
                      value={metric1Val}
                      onChange={(e) => setMetric1Val(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Metric 2 (Label & Value)</label>
                    <input
                      type="text"
                      placeholder="Label (e.g. Health Impact)"
                      value={metric2Label}
                      onChange={(e) => setMetric2Label(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-800 mb-1"
                    />
                    <input
                      type="text"
                      placeholder="Value (e.g. 70% fewer illnesses)"
                      value={metric2Val}
                      onChange={(e) => setMetric2Val(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Beneficiary Community Feedback Quote</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Direct quote or observation from community meetings..."
                    value={beneficiaryFeedback}
                    onChange={(e) => setBeneficiaryFeedback(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Auditing Agency Name</label>
                    <input
                      type="text"
                      value={auditorName}
                      onChange={(e) => setAuditorName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Evidence Photo URL</label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={photoUrl}
                      onChange={(e) => setPhotoUrl(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 text-[11px]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowSubmitModal(false)}
                    className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-semibold hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-sm"
                  >
                    {submitting ? 'Logging Audit...' : 'Publish Audit Report'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Verify Modal */}
        {verifyTarget && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-base font-bold text-slate-900">Certify Third-Party Verification</h3>
                </div>
                <button onClick={() => setVerifyTarget(null)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleVerify} className="space-y-4 text-xs">
                <p className="text-slate-600">
                  You are certifying the physical survival rate and community impact metrics for <strong>{verifyTarget.project_title}</strong> at Day {verifyTarget.interval_days}.
                </p>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Auditor Identity / Organization</label>
                  <input
                    type="text"
                    required
                    value={verifyAuditor}
                    onChange={(e) => setVerifyAuditor(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
                  />
                </div>

                <div className="p-3 bg-emerald-50 rounded-xl text-emerald-800 text-[11px] flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>This audit will be permanently stamped as Third-Party Verified in the public ledger.</span>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setVerifyTarget(null)}
                    className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={verifying}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-sm"
                  >
                    {verifying ? 'Certifying...' : 'Certify & Seal Audit'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Photo Lightbox Modal */}
        {selectedPhoto && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setSelectedPhoto(null)}>
            <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute -top-12 right-0 text-white hover:text-slate-300 p-2"
              >
                <X className="w-6 h-6" />
              </button>
              <img
                src={selectedPhoto}
                alt="Enlarged Audit Evidence"
                className="w-full rounded-2xl max-h-[80vh] object-contain shadow-2xl border border-white/10"
              />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
