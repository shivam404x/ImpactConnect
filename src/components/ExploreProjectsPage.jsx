import React, { useState } from 'react';
import { Search, MapPin, Filter, Flame, ArrowUpDown, X, RefreshCw, HeartHandshake, Map, LayoutGrid } from 'lucide-react';
import ProjectCard from './ProjectCard';
import InteractiveMapDiscovery from './InteractiveMapDiscovery';
import { CAUSE_CATEGORIES, REQUIREMENT_TYPES } from '../data/sdgConstants';

export default function ExploreProjectsPage({
  projects,
  loading,
  filters,
  onFilterChange,
  onResetFilters,
  onSelectProject,
  onPartnerClick,
  onReportProject,
  onToggleCompare,
  comparedProjectIds = []
}) {
  const [sortOption, setSortOption] = useState('default');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'map'

  const handleSortChange = (val) => {
    setSortOption(val);
    onFilterChange('sort', val);
  };

  const hasActiveFilters = 
    filters.cause !== 'all' || 
    filters.sdg !== 'all' || 
    filters.requirementType !== 'all' || 
    filters.location !== 'all' || 
    filters.urgency !== 'all' || 
    filters.search.trim().length > 0;

  return (
    <div className="bg-white min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Title & Intro */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-[#16A36A] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Social Impact Directory
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
              Explore Community Projects
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              Discover verified grassroots non-profit initiatives across poverty alleviation, rural education, healthcare, clean water, and climate action.
            </p>
          </div>

          {/* Grid vs Map Toggle */}
          <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl border border-slate-200 self-start md:self-end">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                viewMode === 'grid'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5 text-[#16A36A]" />
              <span>Grid View</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                viewMode === 'map'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Map className="w-3.5 h-3.5 text-[#16A36A]" />
              <span>Map Explorer</span>
            </button>
          </div>
        </div>

        {/* If Map View is active, render interactive map */}
        {viewMode === 'map' ? (
          <InteractiveMapDiscovery
            projects={projects}
            onSelectProject={onSelectProject}
            onPartnerClick={onPartnerClick}
          />
        ) : null}

        {/* Filter Controls Bar */}
        <div className="bg-[#F8FAFC] border border-slate-200 rounded-3xl p-5 mb-8 space-y-4">
          
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => onFilterChange('search', e.target.value)}
                placeholder="Search by project name, NGO, or keyword..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-300 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#16A36A]/40"
              />
              {filters.search && (
                <button 
                  onClick={() => onFilterChange('search', '')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Location Filter */}
            <div className="relative">
              <MapPin className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <select
                value={filters.location}
                onChange={(e) => onFilterChange('location', e.target.value)}
                className="pl-8 pr-8 py-2.5 rounded-2xl bg-white border border-slate-300 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#16A36A]/40 appearance-none cursor-pointer"
              >
                <option value="all">All Locations</option>
                <option value="remote">Remote / Online Only</option>
                <option value="mumbai">Mumbai, India</option>
                <option value="nairobi">Nairobi, Kenya</option>
                <option value="new delhi">New Delhi, India</option>
                <option value="bangalore">Bangalore, India</option>
                <option value="chicago">Chicago, USA</option>
                <option value="austin">Austin, USA</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <ArrowUpDown className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <select
                value={sortOption}
                onChange={(e) => handleSortChange(e.target.value)}
                className="pl-8 pr-8 py-2.5 rounded-2xl bg-white border border-slate-300 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#16A36A]/40 appearance-none cursor-pointer"
              >
                <option value="default">Sort: Default</option>
                <option value="urgent">Highest Urgency First</option>
                <option value="newest">Newest First</option>
              </select>
            </div>

            {hasActiveFilters && (
              <button
                onClick={onResetFilters}
                className="px-3 py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-600 border border-slate-300 text-xs font-bold"
              >
                Clear Filters
              </button>
            )}
          </div>

          {/* Cause Category Pills */}
          <div className="pt-2 border-t border-slate-200/80 flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            {CAUSE_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => onFilterChange('cause', cat.id)}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
                  filters.cause === cat.id
                    ? 'bg-[#16A36A] text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Support Type Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-slate-500 font-semibold mr-1">Seeking:</span>
              {REQUIREMENT_TYPES.map(req => (
                <button
                  key={req.id}
                  onClick={() => onFilterChange('requirementType', req.id)}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                    filters.requirementType === req.id
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-white'
                  }`}
                >
                  {req.label}
                </button>
              ))}
            </div>

            <div className="text-slate-500 font-medium text-xs">
              Showing <strong className="text-slate-900">{projects.length}</strong> active initiatives
            </div>
          </div>

        </div>

        {/* Projects Grid (always accessible or below map) */}
        {loading ? (
          <div className="p-20 text-center text-slate-400">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#16A36A] mb-3" />
            <p className="text-sm font-semibold">Loading projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="p-16 text-center rounded-3xl bg-[#F8FAFC] border border-slate-200 text-slate-500 max-w-lg mx-auto">
            <HeartHandshake className="w-12 h-12 mx-auto text-slate-400 mb-3" />
            <h3 className="text-lg font-bold text-slate-900 mb-1">No Projects Match Selected Filters</h3>
            <p className="text-xs text-slate-500 mb-5 leading-relaxed">
              We couldn't find any initiatives matching your current search parameters. Try resetting your filters to view all active community programs.
            </p>
            <button
              onClick={onResetFilters}
              className="px-5 py-2.5 rounded-xl btn-primary text-xs font-bold shadow-xs"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map(proj => (
              <ProjectCard
                key={proj.id}
                project={proj}
                onSelect={(p) => onSelectProject(p)}
                onPartnerClick={(p) => onPartnerClick(p)}
                onReport={(p) => onReportProject && onReportProject(p)}
                onToggleCompare={onToggleCompare}
                isCompared={comparedProjectIds.includes(proj.id)}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
