import React from 'react';
import { 
  MapPin, 
  CheckCircle2, 
  DollarSign, 
  Users, 
  Package, 
  Briefcase, 
  Building2, 
  Flame, 
  ArrowUpRight,
  HeartHandshake,
  ShieldAlert,
  ShieldCheck,
  Scale
} from 'lucide-react';
import { SDG_GOALS } from '../data/sdgConstants';

export default function ProjectCard({ 
  project, 
  onSelect, 
  onPartnerClick, 
  onReport,
  onToggleCompare,
  isCompared = false
}) {
  const fundingReq = project.requirements?.find(r => r.type === 'funding');
  const volunteerReq = project.requirements?.find(r => r.type === 'volunteers');
  const otherReq = project.requirements?.find(r => r.type !== 'funding' && r.type !== 'volunteers');

  const primarySdg = (project.sdg_goals && project.sdg_goals[0]) 
    ? SDG_GOALS.find(g => g.id === project.sdg_goals[0])
    : null;

  return (
    <div className="group bg-white rounded-3xl border border-slate-200/90 hover:border-slate-300 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between">
      
      {/* Visual Top Media */}
      <div>
        <div className="relative h-52 w-full overflow-hidden bg-slate-100">
          <img 
            src={project.cover_image || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80'} 
            alt={project.title}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80';
            }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Badges on Top */}
          <div className="absolute top-3 left-3 flex items-center space-x-1.5 z-10">
            {primarySdg && (
              <span
                style={{ backgroundColor: primarySdg.color }}
                className="px-2.5 py-0.5 rounded-full text-[11px] font-black text-white shadow-sm"
              >
                SDG {primarySdg.id}
              </span>
            )}
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/95 backdrop-blur-md text-slate-800 shadow-sm capitalize">
              {project.cause_category?.replace('_', ' ')}
            </span>
          </div>

          {/* Urgency Badge */}
          {project.urgency === 'urgent' && (
            <div className="absolute top-3 right-3 z-10 px-2.5 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-extrabold flex items-center space-x-1 shadow-md">
              <Flame className="w-3 h-3" />
              <span>Urgent Need</span>
            </div>
          )}

          {/* Location Pin on Bottom Image */}
          <div className="absolute bottom-3 left-3 z-10 flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-[11px] font-medium">
            <MapPin className="w-3 h-3 text-emerald-400" />
            <span>{project.is_remote ? 'Remote / Virtual' : `${project.location_city}, ${project.location_country}`}</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {/* NGO info with Verified Badge */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <div className="flex items-center space-x-1.5 truncate">
              <span className="font-semibold text-slate-700 truncate max-w-[200px]">{project.ngo_name}</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-[#16A36A] shrink-0" title="Verified Non-Profit" />
            </div>

            {/* Small subtle report trigger */}
            {onReport && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onReport(project);
                }}
                className="text-slate-400 hover:text-rose-500 p-1 rounded-md transition"
                title="Report this project for review"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Project Title */}
          <h3 
            onClick={() => onSelect(project)}
            className="text-base font-bold text-slate-900 group-hover:text-[#16A36A] cursor-pointer transition line-clamp-2 leading-snug"
          >
            {project.title}
          </h3>

          <p className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {project.tagline || project.description}
          </p>

          {/* Structured Resource Requirements */}
          <div className="mt-5 pt-4 border-t border-slate-100 space-y-2.5">
            {fundingReq && (
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-500 flex items-center space-x-1">
                    <DollarSign className="w-3.5 h-3.5 text-amber-600" />
                    <span>Funding Raised</span>
                  </span>
                  <span className="font-bold text-slate-900">
                    ${Number(fundingReq.current_quantity).toLocaleString()} / ${Number(fundingReq.target_quantity).toLocaleString()}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-500 rounded-full"
                    style={{ width: `${Math.min(100, Math.round((Number(fundingReq.current_quantity) / Number(fundingReq.target_quantity)) * 100))}%` }}
                  />
                </div>
              </div>
            )}

            {volunteerReq && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 flex items-center space-x-1">
                  <Users className="w-3.5 h-3.5 text-[#16A36A]" />
                  <span>Volunteers:</span>
                </span>
                <span className="font-bold text-[#16A36A]">
                  {volunteerReq.current_quantity} / {volunteerReq.target_quantity} Pledged
                </span>
              </div>
            )}

            {otherReq && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 flex items-center space-x-1 truncate max-w-[160px]">
                  <Package className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                  <span className="truncate">{otherReq.title}</span>
                </span>
                <span className="text-[11px] font-semibold text-slate-700 shrink-0">
                  {otherReq.target_quantity} {otherReq.unit}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Action Buttons */}
      <div className="p-6 pt-0 flex items-center space-x-2">
        <button
          onClick={() => onPartnerClick(project)}
          className="flex-1 py-2.5 px-3 rounded-xl btn-primary text-xs font-bold flex items-center justify-center space-x-1.5 shadow-xs"
        >
          <HeartHandshake className="w-4 h-4" />
          <span>Partner</span>
        </button>

        {onToggleCompare && (
          <button
            onClick={() => onToggleCompare(project)}
            className={`p-2.5 rounded-xl border transition ${
              isCompared
                ? 'bg-[#16A36A] text-white border-[#16A36A] shadow-xs'
                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600'
            }`}
            title={isCompared ? 'Remove from side-by-side comparison' : 'Add to side-by-side comparison'}
          >
            <Scale className="w-4 h-4" />
          </button>
        )}

        <button
          onClick={() => onSelect(project)}
          className="p-2.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 transition"
          title="View Details"
        >
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
