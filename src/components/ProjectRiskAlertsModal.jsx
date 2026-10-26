import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  X, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  ArrowRight, 
  RefreshCw,
  Sliders,
  Check,
  Filter
} from 'lucide-react';
import { fetchRiskAlerts, resolveRiskAlert } from '../utils/api';

export default function ProjectRiskAlertsModal({
  isOpen,
  currentUser,
  onClose
}) {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterSeverity, setFilterSeverity] = useState('all'); // 'all' | 'high' | 'medium' | 'resolved'
  const [resolvingId, setResolvingId] = useState(null);
  const [resolutionNotes, setResolutionNotes] = useState('');

  const loadAlerts = async () => {
    setLoading(true);
    try {
      const data = await fetchRiskAlerts();
      setAlerts(data);
    } catch (err) {
      console.error('Error fetching risk alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadAlerts();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleResolve = async (alertId) => {
    try {
      await resolveRiskAlert(alertId, resolutionNotes || 'Risk mitigated via operational intervention.', currentUser?.name || 'Project Coordinator');
      setResolvingId(null);
      setResolutionNotes('');
      loadAlerts();
    } catch (err) {
      alert(err.message || 'Failed to resolve alert');
    }
  };

  const filteredAlerts = alerts.filter(a => {
    if (filterSeverity === 'resolved') return a.is_resolved;
    if (a.is_resolved && filterSeverity !== 'all') return false;
    if (filterSeverity === 'all') return true;
    return a.severity === filterSeverity;
  });

  const activeCount = alerts.filter(a => !a.is_resolved).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden relative">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center font-bold shadow-xs">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  Project Risk & Bottleneck Alerts
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                  {activeCount} Active Warnings
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Deterministic rule-based threshold analysis for approaching deadlines, volunteer shortfalls, and resource deficits.
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

        {/* Filter Strip */}
        <div className="flex items-center space-x-2 px-6 py-3 bg-white border-b border-slate-100">
          <span className="text-xs font-bold text-slate-400 mr-1 flex items-center space-x-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Severity:</span>
          </span>
          {['all', 'high', 'medium', 'resolved'].map(sev => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition capitalize ${
                filterSeverity === sev
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {sev}
            </button>
          ))}
          <button
            onClick={loadAlerts}
            className="p-1.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 ml-auto"
            title="Refresh alerts"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 bg-slate-50/50">
          {filteredAlerts.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">All Project Thresholds Healthy!</h3>
              <p className="text-xs text-slate-500">No project risk alerts matching current filter.</p>
            </div>
          ) : (
            filteredAlerts.map(a => (
              <div 
                key={a.id} 
                className={`bg-white p-5 rounded-2xl border transition shadow-xs space-y-3 ${
                  a.is_resolved 
                    ? 'border-slate-200 opacity-60' 
                    : a.severity === 'high' 
                    ? 'border-rose-300' 
                    : 'border-amber-200'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start space-x-2.5">
                    <span className={`p-1.5 rounded-xl mt-0.5 ${
                      a.is_resolved 
                        ? 'bg-slate-100 text-slate-500' 
                        : a.severity === 'high' 
                        ? 'bg-rose-100 text-rose-700' 
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      <AlertTriangle className="w-4 h-4" />
                    </span>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-black text-slate-900">{a.title}</h4>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          a.is_resolved
                            ? 'bg-slate-100 text-slate-600'
                            : a.severity === 'high'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {a.is_resolved ? 'Resolved' : `${a.severity} Priority`}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Project: <strong className="text-slate-800">{a.project_title}</strong> ({a.ngo_name})
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed pl-8">
                  {a.description}
                </p>

                <div className="pl-8 flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
                  <div className="text-slate-500 text-[11px]">
                    <strong className="text-slate-700">Mitigation Strategy:</strong> {a.suggested_action}
                  </div>

                  {!a.is_resolved && (
                    <div>
                      {resolvingId === a.id ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            placeholder="Resolution notes..."
                            value={resolutionNotes}
                            onChange={(e) => setResolutionNotes(e.target.value)}
                            className="px-2.5 py-1 text-xs border border-slate-300 rounded-lg w-48"
                          />
                          <button
                            type="button"
                            onClick={() => handleResolve(a.id)}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setResolvingId(a.id)}
                          className="px-3 py-1 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 font-bold rounded-lg text-xs transition border border-slate-200"
                        >
                          Resolve Alert
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {a.is_resolved && a.resolution_notes && (
                  <div className="pl-8 text-[11px] text-emerald-800 bg-emerald-50/50 p-2 rounded-xl">
                    Resolved by {a.resolved_by || 'Coordinator'}: {a.resolution_notes}
                  </div>
                )}

              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
