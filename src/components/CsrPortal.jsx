import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Award, 
  DollarSign, 
  FileText, 
  Plus, 
  CheckCircle2, 
  Calendar, 
  MapPin, 
  Download, 
  Send,
  Layers,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Search,
  Target,
  Briefcase,
  Sliders
} from 'lucide-react';
import { fetchCsrRfps, createCsrRfp, fetchProjects } from '../utils/api';

export default function CsrPortal({
  currentUser,
  onPartnerClick,
  onSelectProject,
  onOpenCsrEvidence,
  onOpenCompatibilityChecker,
  onOpenMilestoneSponsorship,
  onNavigate
}) {
  const [rfps, setRfps] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // New RFP form state
  const [rfpTitle, setRfpTitle] = useState('');
  const [rfpCompany, setRfpCompany] = useState(currentUser?.organization_name || 'Acme Global CSR');
  const [grantPool, setGrantPool] = useState(50000);
  const [focusArea, setFocusArea] = useState('Quality Education & STEM');
  const [deadline, setDeadline] = useState('2026-12-31');
  const [criteria, setCriteria] = useState('Registered 501(c)(3) or 80G non-profits operating community digital classrooms.');

  const loadData = async () => {
    setLoading(true);
    try {
      const [rfpList, projList] = await Promise.all([
        fetchCsrRfps().catch(() => []),
        fetchProjects({}).catch(() => [])
      ]);
      setRfps(rfpList);
      setProjects(projList);
    } catch (err) {
      console.error('Error loading CSR portal data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateRfp = async (e) => {
    e.preventDefault();
    try {
      const newRfp = await createCsrRfp({
        title: rfpTitle,
        company_name: rfpCompany,
        grant_pool: Number(grantPool),
        focus_area: focusArea,
        deadline,
        criteria,
        contact_email: currentUser?.email || 'csr@company.com'
      });
      setRfps(prev => [newRfp, ...prev]);
      setShowCreateModal(false);
      setRfpTitle('');
      alert('CSR Grant Opportunity published to NGO network!');
    } catch (err) {
      alert('Error publishing RFP: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20">
      
      {/* Hero Header */}
      <div className="bg-white border-b border-slate-200 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#16A36A] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Corporate Social Responsibility (CSR) Portal
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
                Strategic CSR Grant Allocation & SDG Milestones
              </h1>
              <p className="text-sm text-slate-600 mt-2 max-w-2xl">
                Deploy capital, sponsor equipment, and track verifiable social impact metrics for corporate compliance and stakeholder ESG reporting.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {onOpenCompatibilityChecker && (
                <button
                  onClick={onOpenCompatibilityChecker}
                  className="px-3.5 py-2.5 rounded-xl border border-indigo-200 bg-indigo-50/60 hover:bg-indigo-100 text-indigo-800 text-xs font-bold flex items-center space-x-1.5 transition"
                  title="Check alignment with prospective NGO partners"
                >
                  <Sliders className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Compatibility AI</span>
                </button>
              )}

              {onOpenMilestoneSponsorship && (
                <button
                  onClick={onOpenMilestoneSponsorship}
                  className="px-3.5 py-2.5 rounded-xl border border-rose-200 bg-rose-50/60 hover:bg-rose-100 text-rose-800 text-xs font-bold flex items-center space-x-1.5 transition"
                  title="Fund specific project milestones"
                >
                  <Target className="w-3.5 h-3.5 text-rose-600" />
                  <span>Milestone Grants</span>
                </button>
              )}

              {onNavigate && (
                <button
                  onClick={() => onNavigate('corporate-volunteering')}
                  className="px-3.5 py-2.5 rounded-xl border border-blue-200 bg-blue-50/60 hover:bg-blue-100 text-blue-800 text-xs font-bold flex items-center space-x-1.5 transition"
                  title="Manage employee volunteering days"
                >
                  <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                  <span>Employee Volunteering</span>
                </button>
              )}

              {onOpenCsrEvidence && (
                <button
                  onClick={onOpenCsrEvidence}
                  className="px-3.5 py-2.5 rounded-xl border border-emerald-200 bg-emerald-50/60 hover:bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center space-x-1.5 transition"
                  title="Inspect Section 135 audited dossier"
                >
                  <FileText className="w-3.5 h-3.5 text-emerald-600" />
                  <span>CSR Evidence Pack</span>
                </button>
              )}

              <button
                onClick={() => setShowCreateModal(true)}
                className="btn-primary px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Publish Grant RFP</span>
              </button>
            </div>
          </div>

          {/* CSR Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <span className="text-xs text-slate-500 font-semibold block">Available Grant Pool</span>
              <span className="text-2xl font-black text-[#16A36A] mt-1 block">$185,000</span>
              <span className="text-[10px] text-slate-400">Targeted across 6 SDG sectors</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <span className="text-xs text-slate-500 font-semibold block">Open CSR RFPs</span>
              <span className="text-2xl font-black text-slate-900 mt-1 block">{rfps.length}</span>
              <span className="text-[10px] text-slate-400">Accepting verified NGO applications</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <span className="text-xs text-slate-500 font-semibold block">Audited Field Projects</span>
              <span className="text-2xl font-black text-slate-900 mt-1 block">{projects.length}</span>
              <span className="text-[10px] text-slate-400">100% Tax-exempt & vetted</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <span className="text-xs text-slate-500 font-semibold block">ESG Verification Tier</span>
              <span className="text-2xl font-black text-emerald-600 mt-1 block">Tier-1 Gold</span>
              <span className="text-[10px] text-slate-400">Compliant with Section 135 & IRS 501c3</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        
        {/* Active RFPs Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Active CSR Grant Opportunities (RFPs)</h2>
              <p className="text-xs text-slate-500">Corporate foundation programs open to accredited non-profit applications.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rfps.map(rfp => (
              <div key={rfp.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:border-[#16A36A]/50 transition flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span className="font-bold text-slate-700 flex items-center space-x-1">
                      <Building2 className="w-3.5 h-3.5 text-[#16A36A]" />
                      <span>{rfp.company_name}</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-[#16A36A] font-bold text-[10px]">
                      OPEN RFP
                    </span>
                  </div>

                  <h3 className="text-base font-black text-slate-900 leading-snug">{rfp.title}</h3>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-3">{rfp.criteria}</p>

                  <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Total Grant Value:</span>
                      <span className="font-black text-[#16A36A]">${Number(rfp.grant_pool).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Focus Domain:</span>
                      <span className="font-semibold text-slate-800">{rfp.focus_area}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Application Deadline:</span>
                      <span className="font-semibold text-slate-800">{rfp.deadline}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">{rfp.applications_count || 12} proposals received</span>
                  <button
                    onClick={() => alert(`To apply for "${rfp.title}", please ensure your NGO is Gold Verified and submit a project dossier to ${rfp.contact_email || 'csr@partner.com'}.`)}
                    className="text-xs font-bold text-[#16A36A] hover:text-emerald-700 flex items-center space-x-1"
                  >
                    <span>Apply Proposal</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CSR Project Sponsorship Showcase */}
        <div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Vetted NGO Initiatives Ready for CSR Sponsorship</h2>
              <p className="text-xs text-slate-500">Select an initiative to provide direct programmatic funding or corporate hardware donations.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.slice(0, 6).map(proj => (
              <div key={proj.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition">
                <div>
                  <img
                    src={proj.cover_image}
                    alt={proj.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-5">
                    <div className="flex items-center space-x-2 text-[11px] font-bold text-[#16A36A] mb-1">
                      <span>{proj.cause_category.toUpperCase()}</span>
                      <span>•</span>
                      <span className="text-slate-400">{proj.location_city}, {proj.location_country}</span>
                    </div>
                    <h3 className="text-base font-black text-slate-900 line-clamp-1">{proj.title}</h3>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2">{proj.description}</p>
                    
                    {/* Expense breakdown teaser */}
                    <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] space-y-1">
                      <span className="font-bold text-slate-700 block">Expense Transparency Audit:</span>
                      <div className="flex items-center justify-between text-slate-500">
                        <span>Direct Community Fieldwork:</span>
                        <span className="font-semibold text-slate-800">85%</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-500">
                        <span>Admin & Operations:</span>
                        <span className="font-semibold text-slate-800">15%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 flex items-center space-x-2">
                  <button
                    onClick={() => onSelectProject(proj)}
                    className="flex-1 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                  >
                    View Audit
                  </button>
                  <button
                    onClick={() => onPartnerClick(proj)}
                    className="flex-1 py-2 rounded-xl btn-primary text-xs font-bold text-center shadow-sm"
                  >
                    Sponsor Project
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Modal: Publish CSR RFP */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative">
            <h3 className="text-lg font-black text-slate-900 mb-1">Publish Corporate CSR Grant RFP</h3>
            <p className="text-xs text-slate-500 mb-4">Announce a new funding tranche to qualified NGOs across target SDGs.</p>

            <form onSubmit={handleCreateRfp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">RFP / Grant Title</label>
                <input
                  type="text"
                  required
                  value={rfpTitle}
                  onChange={(e) => setRfpTitle(e.target.value)}
                  placeholder="e.g. Clean Drinking Water Infrastructure Grant 2026"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Company / Foundation</label>
                  <input
                    type="text"
                    required
                    value={rfpCompany}
                    onChange={(e) => setRfpCompany(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Grant Pool ($ USD)</label>
                  <input
                    type="number"
                    required
                    value={grantPool}
                    onChange={(e) => setGrantPool(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Focus Domain</label>
                  <select
                    value={focusArea}
                    onChange={(e) => setFocusArea(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                  >
                    <option value="Quality Education & STEM">Quality Education & STEM</option>
                    <option value="Healthcare & Clean Water">Healthcare & Clean Water</option>
                    <option value="Climate Action & Agroforestry">Climate Action & Agroforestry</option>
                    <option value="Women Micro-Enterprise">Women Micro-Enterprise</option>
                    <option value="Disability Tech Access">Disability Tech Access</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Deadline</label>
                  <input
                    type="date"
                    required
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Eligibility Criteria</label>
                <textarea
                  rows="2"
                  value={criteria}
                  onChange={(e) => setCriteria(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                ></textarea>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl btn-primary text-xs font-bold"
                >
                  Publish RFP
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
