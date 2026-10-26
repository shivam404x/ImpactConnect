import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Bookmark, 
  BookmarkCheck, 
  Scale, 
  Filter, 
  MapPin, 
  CheckCircle2, 
  Building2, 
  HeartHandshake, 
  ArrowRight, 
  SlidersHorizontal, 
  Layers, 
  Users, 
  DollarSign, 
  ExternalLink,
  ShieldCheck,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { fetchPersonalizedFeed, fetchSavedProjects, toggleSaveProject, fetchUserFollows } from '../utils/api';
import { translations } from '../data/translations';

export default function PersonalizedImpactFeed({
  currentUser,
  onSelectProject,
  onPartnerClick,
  onToggleCompare,
  comparedProjectIds = [],
  language = 'en',
  onOpenAuth
}) {
  const t = translations[language] || translations.en;

  const [activeTab, setActiveTab] = useState('recommended'); // 'recommended' | 'saved'
  const [projects, setProjects] = useState([]);
  const [savedProjects, setSavedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // User Profile Preferences for Recommendation Engine
  const [userPreferences, setUserPreferences] = useState({
    causes: currentUser?.interests || ['education', 'environment', 'poverty'],
    location: currentUser?.city || 'Mumbai',
    skills: currentUser?.skills || ['Teaching', 'STEM', 'Python'],
    resources: ['laptops', 'books', 'funding'],
    onlyFollowed: false
  });

  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [followedNgoIds, setFollowedNgoIds] = useState([]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      let followed = [];
      if (currentUser?.id) {
        const fList = await fetchUserFollows(currentUser.id).catch(() => []);
        followed = fList.map(f => f.ngo_id || f.project_id);
        setFollowedNgoIds(followed);
      }

      const [feedData, savedData] = await Promise.all([
        fetchPersonalizedFeed({
          userId: currentUser?.id || 'demo-user',
          causes: userPreferences.causes,
          location: userPreferences.location,
          skills: userPreferences.skills,
          resources: userPreferences.resources,
          followedNgos: userPreferences.onlyFollowed ? followed : []
        }),
        currentUser?.id ? fetchSavedProjects(currentUser.id).catch(() => []) : Promise.resolve([])
      ]);

      setProjects(feedData);
      setSavedProjects(savedData);
    } catch (err) {
      console.error('Error loading personalized feed:', err);
      setError('Unable to load personalized feed. Showing standard discovery.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [userPreferences, currentUser]);

  const handleToggleSave = async (project, e) => {
    e.stopPropagation();
    if (!currentUser) {
      if (onOpenAuth) onOpenAuth('login');
      return;
    }

    try {
      const res = await toggleSaveProject(project.id, currentUser.id);
      if (res.isSaved) {
        setSavedProjects(prev => [...prev, project]);
        setProjects(prev => prev.map(p => p.id === project.id ? { ...p, isSaved: true } : p));
      } else {
        setSavedProjects(prev => prev.filter(p => p.id !== project.id));
        setProjects(prev => prev.map(p => p.id === project.id ? { ...p, isSaved: false } : p));
      }
    } catch (err) {
      alert('Error updating bookmark: ' + err.message);
    }
  };

  const currentDisplayList = activeTab === 'recommended' ? projects : savedProjects;

  return (
    <div className="bg-[#FAFAFA] min-h-screen py-10 sm:py-14 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title & Tagline */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 text-[#16A36A] border border-emerald-200/80 text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart Recommendation Engine</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {t.personalizedTitle || 'Personalized Impact Feed'}
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              {t.personalizedSubtitle || 'Vetted NGO projects mathematically scored and matched against your preferred causes, location, skills, available resources, and followed organizations.'}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowPreferencesModal(true)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition flex items-center space-x-2 shadow-xs"
            >
              <SlidersHorizontal className="w-4 h-4 text-slate-500" />
              <span>{t.preferencesTitle || 'Impact Preferences'}</span>
            </button>
          </div>
        </div>

        {/* Tab Switcher (Recommended vs Saved) */}
        <div className="flex border-b border-slate-200 mb-8 bg-white rounded-2xl p-1 shadow-xs max-w-md">
          <button
            onClick={() => setActiveTab('recommended')}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition flex items-center justify-center space-x-2 ${
              activeTab === 'recommended'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t.recommendedForYou || 'Recommended For You'} ({projects.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('saved')}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition flex items-center justify-center space-x-2 ${
              activeTab === 'saved'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookmarkCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t.mySavedProjects || 'Saved Projects'} ({savedProjects.length})</span>
          </button>
        </div>

        {/* Active Preference Badges Summary */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs mb-8 flex flex-wrap items-center gap-2 text-xs">
          <span className="font-bold text-slate-500 uppercase tracking-wider text-[11px] mr-1">Active Criteria:</span>
          {userPreferences.causes.map(c => (
            <span key={c} className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold capitalize">
              {c.replace(/_/g, ' ')}
            </span>
          ))}
          {userPreferences.location && (
            <span className="px-2.5 py-1 rounded-full bg-sky-50 text-sky-800 border border-sky-200 font-semibold flex items-center space-x-1">
              <MapPin className="w-3 h-3" />
              <span>{userPreferences.location}</span>
            </span>
          )}
          {userPreferences.skills.slice(0, 2).map(s => (
            <span key={s} className="px-2.5 py-1 rounded-full bg-purple-50 text-purple-800 border border-purple-200 font-semibold">
              Skill: {s}
            </span>
          ))}
          <button
            onClick={() => setShowPreferencesModal(true)}
            className="text-xs text-[#16A36A] font-bold hover:underline ml-auto"
          >
            Modify Preferences →
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(n => (
              <div key={n} className="bg-white rounded-3xl p-6 border border-slate-200 h-96 animate-pulse" />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && currentDisplayList.length === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm max-w-xl mx-auto my-12 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-50 text-slate-400 border border-slate-200 flex items-center justify-center mx-auto">
              {activeTab === 'recommended' ? <Sparkles className="w-7 h-7" /> : <Bookmark className="w-7 h-7" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {activeTab === 'recommended' ? 'No Projects Found Matching All Criteria' : 'No Saved Projects Yet'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {activeTab === 'recommended'
                  ? 'Try broadening your locations or adding more cause categories in your preferences.'
                  : 'Bookmark projects by clicking the bookmark ribbon icon on any project card to review them here later.'}
              </p>
            </div>
            {activeTab === 'recommended' && (
              <button
                onClick={() => setUserPreferences({ causes: ['all'], location: '', skills: [], resources: [], onlyFollowed: false })}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition shadow-sm"
              >
                Reset to Show All Causes
              </button>
            )}
          </div>
        )}

        {/* Project Cards Grid */}
        {!loading && currentDisplayList.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentDisplayList.map(project => {
              const isSaved = savedProjects.some(s => s.id === project.id) || project.isSaved;
              const isCompared = comparedProjectIds.includes(project.id);
              const score = project.matchScore || 85;

              return (
                <div
                  key={project.id}
                  className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col group relative"
                >
                  {/* Card Cover & Image */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                    <img
                      src={project.cover_image || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80'}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                    {/* Top action overlays: Save & Compare */}
                    <div className="absolute top-3 right-3 flex items-center space-x-1.5 z-10">
                      {/* Compare toggle */}
                      {onToggleCompare && (
                        <button
                          onClick={() => onToggleCompare(project)}
                          title={isCompared ? 'Remove from comparison' : 'Add to side-by-side comparison'}
                          className={`p-2 rounded-xl backdrop-blur-md transition ${
                            isCompared
                              ? 'bg-[#16A36A] text-white shadow-md'
                              : 'bg-white/90 text-slate-700 hover:bg-white'
                          }`}
                        >
                          <Scale className="w-4 h-4" />
                        </button>
                      )}

                      {/* Bookmark toggle */}
                      <button
                        onClick={(e) => handleToggleSave(project, e)}
                        title={isSaved ? 'Remove bookmark' : 'Bookmark this project'}
                        className={`p-2 rounded-xl backdrop-blur-md transition ${
                          isSaved
                            ? 'bg-amber-500 text-white shadow-md'
                            : 'bg-white/90 text-slate-700 hover:bg-white'
                        }`}
                      >
                        <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    {/* Bottom overlay: Match score badge */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                      <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500 text-white text-xs font-black shadow-md">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{score}% Compatibility</span>
                      </div>

                      <span className="text-[11px] font-bold text-white bg-slate-900/60 backdrop-blur-md px-2.5 py-0.5 rounded-full capitalize">
                        {project.cause_category?.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      {/* NGO details */}
                      <div className="flex items-center space-x-2 text-xs text-slate-500 mb-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="font-bold text-slate-700 truncate">{project.ngo?.name || 'Verified Non-Profit'}</span>
                        {project.ngo?.is_verified && (
                          <span title="Verified Organization">
                            <ShieldCheck className="w-3.5 h-3.5 text-[#16A36A] shrink-0" />
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h3
                        onClick={() => onSelectProject(project)}
                        className="text-base font-bold text-slate-900 hover:text-[#16A36A] transition cursor-pointer line-clamp-2 leading-snug"
                      >
                        {project.title}
                      </h3>

                      {/* Tagline / Location */}
                      <div className="flex items-center space-x-3 text-[11px] text-slate-400 mt-2">
                        <span className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{project.location_city}, {project.location_country}</span>
                        </span>
                        {project.is_remote && (
                          <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 font-bold border border-purple-200">
                            Remote
                          </span>
                        )}
                      </div>

                      {/* "Why Recommended" Explanation Card */}
                      {project.matchReasons && project.matchReasons.length > 0 && (
                        <div className="mt-3.5 p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-slate-700">
                          <div className="flex items-center space-x-1 text-[10px] font-bold uppercase tracking-wider text-emerald-800 mb-1">
                            <CheckCircle2 className="w-3 h-3 text-[#16A36A]" />
                            <span>Why This Is Recommended</span>
                          </div>
                          <ul className="space-y-1">
                            {project.matchReasons.slice(0, 2).map((reason, idx) => (
                              <li key={idx} className="text-[11px] text-slate-600 flex items-start space-x-1.5">
                                <span className="text-[#16A36A] font-bold mt-0.5">•</span>
                                <span>{reason}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => onSelectProject(project)}
                        className="text-xs font-bold text-slate-600 hover:text-slate-900 transition flex items-center space-x-1"
                      >
                        <span>Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onPartnerClick(project)}
                        className="px-4 py-2 rounded-xl bg-[#16A36A] hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition flex items-center space-x-1.5"
                      >
                        <HeartHandshake className="w-3.5 h-3.5" />
                        <span>Partner Now</span>
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Preferences Refinement Modal */}
      {showPreferencesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-2">
                <SlidersHorizontal className="w-5 h-5 text-[#16A36A]" />
                <h3 className="text-lg font-bold text-slate-900">Customize Recommendation Profile</h3>
              </div>
              <button
                onClick={() => setShowPreferencesModal(false)}
                className="text-slate-400 hover:text-slate-700 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            {/* Causes Checkboxes */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                Target Causes of Interest
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {['education', 'healthcare', 'environment', 'poverty', 'women_welfare', 'disability_support'].map(c => {
                  const isChecked = userPreferences.causes.includes(c);
                  return (
                    <label
                      key={c}
                      className={`p-2.5 rounded-xl border flex items-center space-x-2 cursor-pointer transition ${
                        isChecked ? 'border-emerald-500 bg-emerald-50/50 text-emerald-900 font-bold' : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {
                          const next = isChecked
                            ? userPreferences.causes.filter(x => x !== c)
                            : [...userPreferences.causes, c];
                          setUserPreferences(prev => ({ ...prev, causes: next.length ? next : ['all'] }));
                        }}
                        className="rounded text-[#16A36A] focus:ring-[#16A36A]"
                      />
                      <span className="capitalize">{c.replace(/_/g, ' ')}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Location Preference */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                Preferred Geographical Area
              </label>
              <input
                type="text"
                value={userPreferences.location}
                onChange={(e) => setUserPreferences(prev => ({ ...prev, location: e.target.value }))}
                placeholder="e.g. Mumbai, Bengaluru, Delhi, or leave blank for Pan-India"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
              />
            </div>

            {/* Followed Only Toggle */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800 block">Prioritize Followed NGOs</span>
                <span className="text-[11px] text-slate-500">Only surface updates from organizations you currently track.</span>
              </div>
              <input
                type="checkbox"
                checked={userPreferences.onlyFollowed}
                onChange={(e) => setUserPreferences(prev => ({ ...prev, onlyFollowed: e.target.checked }))}
                className="w-5 h-5 rounded text-[#16A36A] focus:ring-[#16A36A] cursor-pointer"
              />
            </div>

            {/* Apply Button */}
            <div className="flex items-center justify-end space-x-3 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowPreferencesModal(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition shadow-sm"
              >
                Apply & Refresh Recommendations
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}