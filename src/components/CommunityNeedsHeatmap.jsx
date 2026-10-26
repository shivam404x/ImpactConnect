import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Layers, 
  ShieldCheck, 
  AlertTriangle, 
  Filter, 
  Plus, 
  X, 
  List, 
  Eye, 
  RefreshCw,
  CheckCircle2,
  Lock,
  Search,
  Sparkles
} from 'lucide-react';
import { fetchCommunityNeedsHeatmap, reportCommunityNeed } from '../utils/api';

export default function CommunityNeedsHeatmap({
  currentUser,
  onOpenAuth,
  language = 'en'
}) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCause, setSelectedCause] = useState('all');
  const [selectedUrgency, setSelectedUrgency] = useState('all');
  const [viewMode, setViewMode] = useState('map'); // 'map' | 'list'
  const [activeReport, setActiveReport] = useState(null);

  // Report modal state
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportTitle, setReportTitle] = useState('');
  const [reportCause, setReportCause] = useState('Clean Water & Sanitation');
  const [reportDistrict, setReportDistrict] = useState('Darbhanga');
  const [reportState, setReportState] = useState('Bihar');
  const [reportUrgency, setReportUrgency] = useState('high');
  const [reportPopulation, setReportPopulation] = useState(2500);
  const [reportDesc, setReportDesc] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const loadReports = async () => {
    setLoading(true);
    try {
      const data = await fetchCommunityNeedsHeatmap({
        cause: selectedCause,
        urgency: selectedUrgency
      });
      setReports(data);
    } catch (err) {
      console.error('Error fetching heatmap reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, [selectedCause, selectedUrgency]);

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    try {
      await reportCommunityNeed({
        title: reportTitle,
        cause: reportCause,
        district: reportDistrict,
        state: reportState,
        urgency: reportUrgency,
        affected_population: Number(reportPopulation),
        description: reportDesc,
        is_verified_ngo: currentUser?.role === 'ngo',
        reporter_name: currentUser?.name || 'Citizen Volunteer'
      });
      setIsReportModalOpen(false);
      loadReports();
    } catch (err) {
      setSubmitError(err.message || 'Failed to submit report');
    } finally {
      setSubmitting(false);
    }
  };

  // Coordinates mapping to SVG viewport (800 x 600)
  // Latitude: 8°N to 35°N (Y inverted)
  // Longitude: 68°E to 97°E (X)
  const mapWidth = 750;
  const mapHeight = 520;
  const getCoordinates = (lat, lng) => {
    const x = ((lng - 68) / (97 - 68)) * mapWidth;
    const y = ((36 - lat) / (36 - 8)) * mapHeight;
    return { x: Math.max(30, Math.min(mapWidth - 30, x)), y: Math.max(30, Math.min(mapHeight - 30, y)) };
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xs relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-wider text-[#16A36A] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#16A36A]" />
                <span>Geo-Spatial Community Needs</span>
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Community Needs Heatmap
              </h1>
              <p className="text-sm text-slate-600 leading-relaxed">
                Discover unaddressed social challenges by geography and cause. Distinguishes verified NGO audit reports from citizen submissions while protecting vulnerable community privacy.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
              {/* View Switcher */}
              <div className="bg-slate-100 p-1 rounded-xl flex items-center">
                <button
                  onClick={() => setViewMode('map')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
                    viewMode === 'map' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Interactive Map</span>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
                    viewMode === 'list' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600'
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                  <span>List View</span>
                </button>
              </div>

              <button
                onClick={() => setIsReportModalOpen(true)}
                className="px-4 py-2 rounded-xl btn-primary text-xs font-bold flex items-center space-x-1.5 shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Report Community Need</span>
              </button>
            </div>
          </div>

          {/* Privacy Shield Banner */}
          <div className="mt-6 p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center space-x-2 text-xs text-slate-600">
            <Lock className="w-4 h-4 text-[#16A36A] shrink-0" />
            <span>
              <strong>Fuzzy Location Shield Active:</strong> Exact GPS coordinates of vulnerable beneficiary hamlets are shielded to district level to protect community privacy.
            </span>
          </div>

          {/* Filter Bar */}
          <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-6">
            <span className="text-xs font-bold text-slate-400 mr-2 flex items-center space-x-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Filters:</span>
            </span>
            {['all', 'Clean Water & Sanitation', 'Quality Education', 'Climate Action', 'Good Health & Well-being'].map(c => (
              <button
                key={c}
                onClick={() => setSelectedCause(c)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  selectedCause === c
                    ? 'bg-[#16A36A] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {c === 'all' ? 'All Causes' : c}
              </button>
            ))}
          </div>
        </div>

        {/* MAP VIEW */}
        {viewMode === 'map' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* SVG Visual Map Viewport */}
            <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-xs p-6 relative overflow-hidden flex flex-col items-center justify-center min-h-[500px]">
              
              <div className="absolute top-4 left-4 z-10 text-[11px] font-bold text-slate-400 bg-white/90 backdrop-blur-xs px-3 py-1 rounded-full border border-slate-200">
                Click any hotspot marker to view verified district need data
              </div>

              {loading ? (
                <div className="py-20 text-center">
                  <RefreshCw className="w-8 h-8 animate-spin text-[#16A36A] mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-500">Loading Heatmap Coordinates...</p>
                </div>
              ) : (
                <div className="w-full relative flex justify-center">
                  <svg viewBox={`0 0 ${mapWidth} ${mapHeight}`} className="w-full max-h-[500px] select-none">
                    {/* Stylized Geographic Outline Guide */}
                    <rect x="0" y="0" width={mapWidth} height={mapHeight} fill="#F8FAFC" rx="16" />
                    
                    {/* Subtle grid lines */}
                    {[100, 200, 300, 400].map(y => (
                      <line key={y} x1="0" y1={y} x2={mapWidth} y2={y} stroke="#E2E8F0" strokeDasharray="3 3" opacity={0.6} />
                    ))}
                    {[150, 300, 450, 600].map(x => (
                      <line key={x} x1={x} y1="0" x2={x} y2={mapHeight} stroke="#E2E8F0" strokeDasharray="3 3" opacity={0.6} />
                    ))}

                    {/* Regional Labels */}
                    <text x="320" y="80" fill="#94A3B8" fontSize="12" fontWeight="bold">NORTH</text>
                    <text x="180" y="220" fill="#94A3B8" fontSize="12" fontWeight="bold">WEST</text>
                    <text x="360" y="260" fill="#94A3B8" fontSize="12" fontWeight="bold">CENTRAL</text>
                    <text x="560" y="200" fill="#94A3B8" fontSize="12" fontWeight="bold">EAST</text>
                    <text x="360" y="440" fill="#94A3B8" fontSize="12" fontWeight="bold">SOUTH</text>

                    {/* Hotspot Markers */}
                    {reports.map(rep => {
                      const pos = getCoordinates(rep.lat, rep.lng);
                      const isSelected = activeReport?.id === rep.id;
                      const isHigh = rep.urgency === 'high' || rep.urgency === 'critical';

                      return (
                        <g
                          key={rep.id}
                          transform={`translate(${pos.x}, ${pos.y})`}
                          onClick={() => setActiveReport(rep)}
                          className="cursor-pointer group"
                        >
                          {/* Radial heat glow */}
                          <circle
                            r={isSelected ? 32 : isHigh ? 24 : 18}
                            fill={isHigh ? '#EF4444' : '#10B981'}
                            opacity={isSelected ? 0.35 : 0.2}
                            className="animate-pulse"
                          />
                          {/* Center Pin */}
                          <circle
                            r={isSelected ? 10 : 8}
                            fill={isHigh ? '#DC2626' : '#16A36A'}
                            stroke="#FFFFFF"
                            strokeWidth={2}
                            className="transition-transform group-hover:scale-125"
                          />
                          {/* Label */}
                          <text
                            textAnchor="middle"
                            y={20}
                            fill="#0F172A"
                            fontSize="10"
                            fontWeight="bold"
                            className="pointer-events-none bg-white px-1"
                          >
                            {rep.district}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              )}

            </div>

            {/* Hotspot Detail Drawer */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    District Need Inspector
                  </span>
                  {activeReport && (
                    <button onClick={() => setActiveReport(null)} className="p-1 rounded-full hover:bg-slate-100 text-slate-400">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {activeReport ? (
                  <div className="mt-4 space-y-4 animate-fade-in">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          activeReport.status === 'verified' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}>
                          {activeReport.status === 'verified' ? 'Field-Verified Audit' : 'Unverified Submission'}
                        </span>
                        <span className="text-xs text-rose-600 font-bold uppercase">
                          {activeReport.urgency} Urgency
                        </span>
                      </div>
                      
                      <h3 className="text-base font-black text-slate-900 mt-2">
                        {activeReport.title}
                      </h3>
                      
                      <div className="flex items-center space-x-2 text-xs text-slate-500 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-[#16A36A]" />
                        <span>{activeReport.district}, {activeReport.state}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      {activeReport.description}
                    </p>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Affected Population</span>
                        <span className="font-bold text-slate-900">{activeReport.affected_population?.toLocaleString()} Citizens</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Cause Focus</span>
                        <span className="font-bold text-[#16A36A] truncate block">{activeReport.cause}</span>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                      Verified by: <strong>{activeReport.verified_by}</strong>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-16 space-y-2 text-slate-400">
                    <MapPin className="w-10 h-10 mx-auto text-slate-300" />
                    <p className="text-xs font-bold text-slate-600">No hotspot selected</p>
                    <p className="text-[11px] text-slate-400">Click any marker pin on the map to review reported community issues and verified population needs.</p>
                  </div>
                )}
              </div>

              {activeReport && (
                <button
                  type="button"
                  onClick={() => alert(`Mobilization initiated for ${activeReport.district} community need.`)}
                  className="w-full py-2.5 rounded-xl btn-primary text-xs font-bold flex items-center justify-center space-x-1.5 shadow-sm"
                >
                  <span>Mobilize Resources for this District</span>
                </button>
              )}
            </div>

          </div>
        )}

        {/* LIST VIEW */}
        {viewMode === 'list' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map(rep => (
              <div key={rep.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    rep.status === 'verified' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}>
                    {rep.status === 'verified' ? 'Verified Audit' : 'Unverified'}
                  </span>
                  <span className="text-[11px] font-bold text-rose-600 uppercase">
                    {rep.urgency} Urgency
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-black text-slate-900">{rep.title}</h3>
                  <div className="flex items-center space-x-1.5 text-xs text-slate-500 mt-1 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-[#16A36A]" />
                    <span>{rep.district}, {rep.state}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {rep.description}
                </p>

                <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-100 text-slate-500">
                  <span>Reach: <strong>{rep.affected_population?.toLocaleString()} people</strong></span>
                  <span className="font-semibold text-[#16A36A]">{rep.cause}</span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* REPORT COMMUNITY NEED MODAL */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 relative">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#16A36A] bg-emerald-50 px-2.5 py-0.5 rounded-full">
                Citizen / NGO Report
              </span>
              <h3 className="text-base font-black text-slate-900 mt-1">Submit Community Need</h3>
            </div>

            {submitError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
                {submitError}
              </div>
            )}

            <form onSubmit={handleReportSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Issue Title</label>
                <input
                  type="text"
                  required
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  placeholder="e.g. Drinking Water Filtration Deficit"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">District</label>
                  <input
                    type="text"
                    required
                    value={reportDistrict}
                    onChange={(e) => setReportDistrict(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">State</label>
                  <input
                    type="text"
                    required
                    value={reportState}
                    onChange={(e) => setReportState(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Cause</label>
                  <select
                    value={reportCause}
                    onChange={(e) => setReportCause(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                  >
                    <option value="Clean Water & Sanitation">Clean Water</option>
                    <option value="Quality Education">Education</option>
                    <option value="Climate Action">Climate Action</option>
                    <option value="Good Health & Well-being">Healthcare</option>
                    <option value="Disaster Relief & Hunger">Disaster Relief</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Urgency</label>
                  <select
                    value={reportUrgency}
                    onChange={(e) => setReportUrgency(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Estimated Affected People</label>
                <input
                  type="number"
                  min="50"
                  value={reportPopulation}
                  onChange={(e) => setReportPopulation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description & Evidence</label>
                <textarea
                  rows={2}
                  required
                  value={reportDesc}
                  onChange={(e) => setReportDesc(e.target.value)}
                  placeholder="Detail the community challenge..."
                  className="w-full p-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsReportModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 rounded-xl btn-primary text-xs font-bold flex items-center justify-center space-x-1.5 shadow-sm"
                >
                  <span>{submitting ? 'Submitting...' : 'Submit Report'}</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
