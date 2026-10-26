import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Calendar, 
  Building2, 
  CheckCircle2, 
  DollarSign, 
  Users, 
  Briefcase, 
  Package, 
  HeartHandshake, 
  Target, 
  ExternalLink,
  Flame,
  ShieldCheck,
  ShieldAlert,
  PieChart,
  FileCheck2,
  History
} from 'lucide-react';
import { SDG_GOALS } from '../data/sdgConstants';
import ProjectTransparencyTimeline from './ProjectTransparencyTimeline';

export default function ProjectDetailModal({ 
  project, 
  onClose, 
  onPartnerClick,
  onReportClick,
  onOpenImpactReport 
}) {
  if (!project) return null;

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'expenses' | 'milestones'

  const sdgBadges = (project.sdg_goals || []).map(sdgId => {
    return SDG_GOALS.find(g => g.id === sdgId) || { id: sdgId, name: `SDG ${sdgId}`, color: '#16A36A' };
  });

  const expenseBreakdown = project.expense_breakdown || [
    { category: "Equipment & Direct Hardware", percentage: 55, amount: 8000 },
    { category: "Community Field Outreach & Training", percentage: 30, amount: 4500 },
    { category: "Audited Logistics & Governance", percentage: 15, amount: 2500 }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 hover:bg-white text-slate-700 shadow-md transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Cover Photo */}
        <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-100">
          <img 
            src={project.cover_image || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80'} 
            alt={project.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />

          <div className="absolute bottom-5 left-6 right-6 text-white">
            <div className="flex flex-wrap gap-2 mb-2">
              {sdgBadges.map(sdg => (
                <span 
                  key={sdg.id} 
                  style={{ backgroundColor: sdg.color }}
                  className="px-2.5 py-1 rounded-full text-xs font-black text-white shadow-sm"
                >
                  SDG {sdg.id}: {sdg.name}
                </span>
              ))}
              {project.urgency === 'urgent' && (
                <span className="px-2.5 py-1 rounded-full bg-rose-600 text-white text-xs font-bold flex items-center space-x-1 shadow-sm">
                  <Flame className="w-3.5 h-3.5" />
                  <span>Immediate Need</span>
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight">
              {project.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 mt-1">
              {project.tagline}
            </p>
          </div>
        </div>

        {/* Sub-navigation tabs */}
        <div className="flex border-b border-slate-200 px-6 bg-slate-50/50">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition ${
              activeTab === 'overview'
                ? 'border-[#16A36A] text-[#16A36A]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Overview & Requirements
          </button>
          <button
            onClick={() => setActiveTab('expenses')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition flex items-center space-x-1 ${
              activeTab === 'expenses'
                ? 'border-[#16A36A] text-[#16A36A]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <PieChart className="w-3.5 h-3.5" />
            <span>Approved Expense Breakdown</span>
          </button>
          <button
            onClick={() => setActiveTab('milestones')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition flex items-center space-x-1 ${
              activeTab === 'milestones'
                ? 'border-[#16A36A] text-[#16A36A]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Milestones & Evidence</span>
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition flex items-center space-x-1 ${
              activeTab === 'timeline'
                ? 'border-[#16A36A] text-[#16A36A]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Audit Timeline</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[calc(85vh-20rem)] overflow-y-auto">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Metadata Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 text-xs">
                <div>
                  <span className="text-slate-500 block mb-0.5">Location</span>
                  <span className="font-bold text-slate-800 flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-[#16A36A]" />
                    <span>{project.is_remote ? 'Remote / Online' : `${project.location_city}, ${project.location_country}`}</span>
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 block mb-0.5">Category</span>
                  <span className="font-bold text-[#16A36A] capitalize">
                    {project.cause_category?.replace('_', ' ')}
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 block mb-0.5">Beneficiary Reach</span>
                  <span className="font-bold text-slate-900 block">
                    {project.verified_beneficiaries ? `${Number(project.verified_beneficiaries).toLocaleString()} Verified` : `${Number(project.estimated_beneficiaries || 2000).toLocaleString()} Estimated`}
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 block mb-0.5">Audit Status</span>
                  <span className="font-bold text-[#16A36A] px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 inline-block uppercase text-[10px]">
                    Verified
                  </span>
                </div>
              </div>

              {/* Description & Impact Target */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center space-x-2">
                  <Target className="w-4 h-4 text-[#16A36A]" />
                  <span>Project Mission & Intended Impact</span>
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {project.description}
                </p>

                {project.impact_target && (
                  <div className="mt-3.5 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-start space-x-3 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-[#16A36A] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-emerald-800 uppercase text-[10px]">Target Deliverable:</div>
                      <div className="text-slate-700 mt-0.5 font-medium">{project.impact_target}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Resource Requirements List */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center space-x-2">
                  <HeartHandshake className="w-4 h-4 text-[#16A36A]" />
                  <span>Partnership & Resource Needs</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(project.requirements || []).map(req => {
                    const isFunding = req.type === 'funding';
                    const isVolunteers = req.type === 'volunteers';
                    const progressPct = req.target_quantity > 0 
                      ? Math.min(100, Math.round((Number(req.current_quantity) / Number(req.target_quantity)) * 100))
                      : 0;

                    return (
                      <div key={req.id} className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-[#16A36A] uppercase text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200">
                            {req.type?.replace('_', ' ')}
                          </span>
                          <span className="font-bold text-slate-800">
                            {isFunding && `$${Number(req.current_quantity).toLocaleString()} / $${Number(req.target_quantity).toLocaleString()}`}
                            {isVolunteers && `${req.current_quantity} / ${req.target_quantity} Volunteers`}
                            {!isFunding && !isVolunteers && `${req.target_quantity} ${req.unit || 'units'}`}
                          </span>
                        </div>

                        <div className="font-bold text-slate-900 text-xs">{req.title}</div>
                        <p className="text-[11px] text-slate-500">{req.description}</p>

                        {(isFunding || isVolunteers) && (
                          <div className="pt-1">
                            <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${isFunding ? 'bg-amber-500' : 'bg-[#16A36A]'}`}
                                style={{ width: `${progressPct}%` }}
                              />
                            </div>
                            <div className="text-[10px] text-right text-slate-400 mt-0.5">{progressPct}% Met</div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: APPROVED EXPENSES */}
          {activeTab === 'expenses' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Approved Expense Allocation & Auditing</h4>
                  <p className="text-xs text-slate-500">Breakdown of capital utilization verified by certified independent accountants.</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-[#16A36A] text-[10px] font-bold border border-emerald-200">
                  Clean Audit Report
                </span>
              </div>

              <div className="space-y-3 mt-4">
                {expenseBreakdown.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800">{item.category}</span>
                      <span className="font-black text-[#16A36A]">{item.percentage}% ({item.amount ? `$${item.amount.toLocaleString()}` : ''})</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-[#16A36A] h-2 rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500">
                <strong>Notice:</strong> All financial entries on ImpactConnect are subject to transparent quarterly receipts upload and independent verification.
              </div>
            </div>
          )}

          {/* TAB 3: MILESTONES & EVIDENCE */}
          {activeTab === 'milestones' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Tracked Milestones & Field Evidence</h4>
                <p className="text-xs text-slate-500">Step-by-step deliverable tracking with photographic and field reviewer proof.</p>
              </div>

              <div className="space-y-3">
                {(project.milestones || [
                  { title: "Baseline Community Survey", is_completed: true, target_date: "2026-03-01", description: "Household registration and needs audit completed." },
                  { title: "Phase 1 Resource Deployment", is_completed: true, target_date: "2026-05-15", description: "Equipment delivered and commissioned on site." },
                  { title: "Long-term Impact Evaluation", is_completed: false, target_date: "2026-11-30", description: "Independent surveyor impact reporting and beneficiary follow-up." }
                ]).map((ms, idx) => (
                  <div key={idx} className={`p-4 rounded-2xl border ${ms.is_completed ? 'border-emerald-200 bg-emerald-50/20' : 'border-slate-200 bg-white'}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <CheckCircle2 className={`w-5 h-5 mt-0.5 ${ms.is_completed ? 'text-[#16A36A]' : 'text-slate-300'}`} />
                        <div>
                          <h5 className="text-xs font-bold text-slate-900">{ms.title}</h5>
                          <p className="text-[11px] text-slate-600 mt-0.5">{ms.description}</p>
                          <span className="text-[10px] text-slate-400 mt-1 block">Target: {ms.target_date}</span>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${ms.is_completed ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                        {ms.is_completed ? 'Verified Completed' : 'In Progress'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* NGO Profile Card */}
          {project.ngo && (
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-3.5">
                <img 
                  src={project.ngo.logo_url || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=150&h=150&q=80'} 
                  alt={project.ngo.name}
                  className="w-12 h-12 rounded-xl object-cover ring-2 ring-emerald-500/20 shrink-0" 
                />
                <div>
                  <div className="flex items-center space-x-1.5">
                    <h5 className="font-bold text-slate-900 text-sm">{project.ngo.name}</h5>
                    <CheckCircle2 className="w-4 h-4 text-[#16A36A] shrink-0" />
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{project.ngo.tagline}</p>
                  <div className="text-[11px] text-slate-400 mt-0.5 flex flex-wrap gap-x-3">
                    <span>Reg: {project.ngo.registration_number || 'Non-Profit Entity'}</span>
                    <span>Status: {project.ngo.tax_exempt_status || 'Tax-Exempt'}</span>
                  </div>
                </div>
              </div>

              {project.ngo.website && (
                <a
                  href={project.ngo.website}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center space-x-1 transition shrink-0"
                >
                  <span>Website</span>
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              )}
            </div>
          )}

          {/* TAB 4: AUDIT TRANSPARENCY TIMELINE */}
          {activeTab === 'timeline' && (
            <div className="py-2">
              <ProjectTransparencyTimeline projectId={project.id} />
            </div>
          )}

        </div>

        {/* Footer Action Bar */}
        <div className="p-6 bg-[#F8FAFC] border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            {onOpenImpactReport && (
              <button
                onClick={() => onOpenImpactReport(project)}
                className="text-slate-700 hover:text-slate-900 text-xs font-bold flex items-center space-x-1.5 transition px-3 py-2 rounded-xl border border-slate-200 bg-white shadow-sm"
              >
                <FileCheck2 className="w-3.5 h-3.5 text-[#16A36A]" />
                <span>Audited Impact PDF</span>
              </button>
            )}
            {onReportClick && (
              <button
                onClick={() => {
                  onClose();
                  onReportClick(project);
                }}
                className="text-slate-400 hover:text-rose-600 text-xs font-semibold flex items-center space-x-1 transition"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Report</span>
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2.5 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-white text-slate-700 text-xs font-semibold transition"
            >
              Close
            </button>

            <button
              onClick={() => {
                onClose();
                onPartnerClick(project);
              }}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl btn-primary text-xs font-bold flex items-center justify-center space-x-1.5 shadow-sm"
            >
              <HeartHandshake className="w-4 h-4" />
              <span>Partner With This Project</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
