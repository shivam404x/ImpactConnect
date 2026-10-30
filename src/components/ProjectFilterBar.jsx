import React from 'react';
import { 
  Search, 
  MapPin, 
  Flame, 
  IndianRupee, 
  Users, 
  Package, 
  Briefcase, 
  X 
} from 'lucide-react';
import { REQUIREMENT_TYPES } from '../data/sdgConstants';

export default function ProjectFilterBar({
  filters,
  onFilterChange,
  onResetFilters,
  totalResults
}) {
  const hasActiveFilters = 
    filters.cause !== 'all' || 
    filters.sdg !== 'all' || 
    filters.requirementType !== 'all' || 
    filters.location !== 'all' || 
    filters.urgency !== 'all' || 
    filters.search.trim().length > 0;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xl mb-8 space-y-4">
      
      {/* Search & Location Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            placeholder="Search projects (e.g. water, school, trees, clinic)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-800 border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          />
          {filters.search && (
            <button 
              onClick={() => onFilterChange('search', '')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Location Dropdown */}
        <div className="relative w-full sm:w-auto">
          <MapPin className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <select
            value={filters.location}
            onChange={(e) => onFilterChange('location', e.target.value)}
            className="w-full sm:w-auto pl-8 pr-7 py-2.5 rounded-2xl bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none cursor-pointer"
          >
            <option value="all">📍 All Locations</option>
            <option value="remote">🌐 Remote / Online Only</option>
            <option value="mumbai">Mumbai, India</option>
            <option value="nairobi">Nairobi, Kenya</option>
            <option value="new delhi">New Delhi, India</option>
            <option value="bangalore">Bangalore, India</option>
            <option value="chicago">Chicago, USA</option>
            <option value="austin">Austin, USA</option>
          </select>
        </div>

        {/* Urgent Button */}
        <button
          onClick={() => onFilterChange('urgency', filters.urgency === 'urgent' ? 'all' : 'urgent')}
          className={`px-4 py-2.5 rounded-2xl border text-xs font-bold flex items-center justify-center space-x-1.5 transition w-full sm:w-auto ${
            filters.urgency === 'urgent'
              ? 'bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-900/40'
              : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          <span>Urgent Only</span>
        </button>

        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="px-3 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 text-xs font-semibold"
            title="Reset Filters"
          >
            Clear
          </button>
        )}
      </div>

      {/* Support Type Pills */}
      <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-slate-400 font-semibold mr-1">Needed:</span>
          {REQUIREMENT_TYPES.map((req) => {
            const isSelected = filters.requirementType === req.id;
            return (
              <button
                key={req.id}
                onClick={() => onFilterChange('requirementType', req.id)}
                className={`px-3 py-1 rounded-xl text-xs transition font-semibold ${
                  isSelected
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {req.label}
              </button>
            );
          })}
        </div>

        <div className="text-xs text-slate-400">
          Showing <strong className="text-emerald-400">{totalResults}</strong> projects
        </div>
      </div>

    </div>
  );
}
