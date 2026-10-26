import React, { useState, useEffect } from 'react';
import { 
  History, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  User, 
  ExternalLink, 
  Image, 
  Calendar, 
  Building2,
  FileCheck2,
  Lock
} from 'lucide-react';
import { fetchProjectTransparencyTimeline } from '../utils/api';
import { translations } from '../data/translations';

export default function ProjectTransparencyTimeline({
  projectId,
  language = 'en'
}) {
  const t = translations[language] || translations.en;

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedPhoto, setExpandedPhoto] = useState(null);

  useEffect(() => {
    if (projectId) {
      loadTimeline();
    }
  }, [projectId]);

  const loadTimeline = async () => {
    setLoading(true);
    try {
      const data = await fetchProjectTransparencyTimeline(projectId);
      setEvents(data);
    } catch (err) {
      console.error('Error fetching transparency timeline:', err);
    } finally {
      setLoading(false);
    }
  };

  const getEventBadge = (type) => {
    switch (type) {
      case 'publication':
        return { label: 'PROJECT PUBLISHED', color: 'bg-emerald-100 text-emerald-800' };
      case 'partnership_accepted':
        return { label: 'PARTNERSHIP RATIFIED', color: 'bg-sky-100 text-sky-800' };
      case 'milestone_completed':
        return { label: 'MILESTONE ACHIEVED', color: 'bg-purple-100 text-purple-800' };
      case 'compliance_verified':
        return { label: 'AUDITOR VERIFIED', color: 'bg-blue-100 text-blue-800' };
      case 'resource_delivered':
        return { label: 'RESOURCE DELIVERED', color: 'bg-amber-100 text-amber-800' };
      default:
        return { label: 'AUDIT EVENT', color: 'bg-slate-100 text-slate-800' };
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-xs text-slate-400 animate-pulse space-y-2">
        <Clock className="w-5 h-5 mx-auto text-slate-300" />
        <p>Loading immutable transparency timeline...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Title & Privacy Badge */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center space-x-2">
          <History className="w-4 h-4 text-[#16A36A]" />
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
            {t.timelineTitle || 'Immutable Project Transparency Timeline'}
          </h3>
        </div>
        <div className="flex items-center space-x-1 text-[11px] text-slate-400 font-medium">
          <Lock className="w-3 h-3 text-slate-400" />
          <span>Server-Timestamped • Privacy Preserved</span>
        </div>
      </div>

      {events.length === 0 ? (
        <div className="p-8 text-center text-xs text-slate-500 bg-slate-50 rounded-2xl border border-slate-200">
          Project timeline baseline initialized. Operational events will be permanently logged here as milestones are completed.
        </div>
      ) : (
        <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {events.map((ev, idx) => {
            const badge = getEventBadge(ev.event_type);

            return (
              <div key={ev.id || idx} className="relative group">
                
                {/* Node icon */}
                <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-white border-2 border-[#16A36A] flex items-center justify-center shadow-xs">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#16A36A]" />
                </div>

                {/* Event Card */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:border-slate-300 transition space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${badge.color}`}>
                        {badge.label}
                      </span>
                      <span className="text-xs font-bold text-slate-900">{ev.title}</span>
                    </div>

                    <div className="flex items-center space-x-1 text-[11px] text-slate-400">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(ev.timestamp).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {ev.description}
                  </p>

                  {/* Actor details (Publicly safe metadata) */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <div className="flex items-center space-x-1.5">
                      <User className="w-3 h-3 text-slate-400" />
                      <span className="font-semibold text-slate-700">{ev.actor_name}</span>
                      <span className="text-slate-400">({ev.actor_role?.toUpperCase()})</span>
                    </div>

                    {ev.is_verified && (
                      <span className="inline-flex items-center space-x-1 text-emerald-700 font-bold text-[10px]">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Verified Log</span>
                      </span>
                    )}
                  </div>

                  {/* Photographic Field Evidence (if attached) */}
                  {ev.evidence_url && (
                    <div className="pt-2">
                      <button
                        onClick={() => setExpandedPhoto(ev.evidence_url)}
                        className="inline-flex items-center space-x-1.5 text-xs text-[#16A36A] font-bold hover:underline"
                      >
                        <Image className="w-3.5 h-3.5" />
                        <span>View Attached Field Photo Evidence</span>
                      </button>
                    </div>
                  )}

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Expanded Photo Evidence Modal */}
      {expandedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-4 shadow-2xl border border-slate-200 space-y-3 relative">
            <button
              onClick={() => setExpandedPhoto(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white text-slate-700 shadow-md transition z-10"
            >
              ✕
            </button>
            <div className="text-xs font-bold text-slate-700 px-2">Field Milestone Verification Photo</div>
            <div className="rounded-2xl overflow-hidden aspect-video bg-slate-100">
              <img
                src={expandedPhoto}
                alt="Field Verification Evidence"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}