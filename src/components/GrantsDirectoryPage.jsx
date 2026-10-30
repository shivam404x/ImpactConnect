import React, { useState, useEffect } from 'react';
import { 
  Award, 
  Search, 
  IndianRupee, 
  Calendar, 
  ExternalLink, 
  Building2, 
  MapPin, 
  CheckCircle2, 
  Plus, 
  Filter, 
  X,
  ChevronRight,
  ShieldCheck,
  Globe
} from 'lucide-react';
import { fetchGrantsDirectory, createGrantOpportunity } from '../utils/api';

export default function GrantsDirectoryPage({
  currentUser,
  onOpenAuth
}) {
  const [grants, setGrants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [causeFilter, setCauseFilter] = useState('all');
  const [funderFilter, setFunderFilter] = useState('all');
  const [search, setSearch] = useState('');

  // Submit grant modal state
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [grantTitle, setGrantTitle] = useState('');
  const [funderName, setFunderName] = useState(currentUser?.organization_name || 'Tata Community Trusts');
  const [funderType, setFunderType] = useState('corporate_csr');
  const [grantAmount, setGrantAmount] = useState(50000);
  const [grantDeadline, setGrantDeadline] = useState('2026-12-31');
  const [locationScope, setLocationScope] = useState('India & Global South');
  const [eligibility, setEligibility] = useState('Registered non-profits with valid 80G / 501(c)(3) tax-exempt status.');
  const [officialLink, setOfficialLink] = useState('https://www.tatatrusts.org');
  const [submittingGrant, setSubmittingGrant] = useState(false);

  const loadGrants = async () => {
    setLoading(true);
    try {
      const data = await fetchGrantsDirectory({
        cause: causeFilter,
        funder_type: funderFilter,
        search
      });
      setGrants(data);
    } catch (err) {
      console.error('Error fetching grants directory:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGrants();
  }, [causeFilter, funderFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadGrants();
  };

  const handleCreateGrant = async (e) => {
    e.preventDefault();
    setSubmittingGrant(true);
    try {
      await createGrantOpportunity({
        title: grantTitle,
        funder_name: funderName,
        funder_type: funderType,
        grant_amount: Number(grantAmount),
        grant_amount_formatted: `₹${Number(grantAmount).toLocaleString('en-IN')} INR`,
        cause_categories: ['education', 'healthcare'],
        eligibility_criteria: eligibility,
        deadline: grantDeadline,
        location_scope: locationScope,
        official_link: officialLink,
        is_verified: true,
        verification_tier: 'Gold Verified'
      });
      setShowSubmitModal(false);
      setGrantTitle('');
      loadGrants();
      alert('Institutional Grant Opportunity published to directory!');
    } catch (err) {
      alert('Error creating grant: ' + err.message);
    } finally {
      setSubmittingGrant(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20">
      
      {/* Header */}
      <div className="bg-white border-b border-slate-200 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#16A36A] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Grant & Capital Access Hub
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
                Verified Grants & CSR Opportunity Directory
              </h1>
              <p className="text-sm text-slate-600 mt-2 max-w-2xl">
                Discover accredited institutional grants, government schemes, and corporate foundation challenges with transparent eligibility guidelines.
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => {
                  if (!currentUser && onOpenAuth) onOpenAuth('login');
                  else setShowSubmitModal(true);
                }}
                className="btn-primary px-5 py-3 rounded-xl text-xs font-bold flex items-center space-x-2 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Submit Grant Opportunity</span>
              </button>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="mt-8 bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-center gap-4">
            <form onSubmit={handleSearchSubmit} className="flex-1 w-full relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search grants by funder, title, eligibility or keyword..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
              />
            </form>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <select
                value={causeFilter}
                onChange={(e) => setCauseFilter(e.target.value)}
                className="px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
              >
                <option value="all">All Cause Categories</option>
                <option value="education">Education & Digital Literacy</option>
                <option value="healthcare">Healthcare & Water Sanitation</option>
                <option value="environment">Climate & Environment</option>
                <option value="poverty">Livelihoods & Poverty</option>
              </select>

              <select
                value={funderFilter}
                onChange={(e) => setFunderFilter(e.target.value)}
                className="px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
              >
                <option value="all">All Funder Types</option>
                <option value="corporate_csr">Corporate CSR Foundation</option>
                <option value="philanthropic_foundation">Philanthropic Trust</option>
                <option value="government">Government & Multilateral</option>
              </select>

              <button
                onClick={loadGrants}
                className="px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition"
              >
                Filter
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Grants Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        
        <div className="flex items-center justify-between mb-6">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Displaying {grants.length} Active Grants
          </span>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-400 text-sm">
            Loading opportunities...
          </div>
        ) : grants.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-md mx-auto">
            <Award className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-black text-slate-800">No Grants Match Criteria</h3>
            <p className="text-xs text-slate-500 mt-1">Try resetting your filters or search keywords.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {grants.map(grant => (
              <div
                key={grant.id}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs hover:border-[#16A36A] hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 text-[#16A36A] border border-emerald-200 flex items-center space-x-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{grant.verification_tier || 'Gold Verified'}</span>
                    </span>

                    <span className="text-xs font-bold text-slate-500 flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Deadline: {grant.deadline}</span>
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-slate-900 leading-snug">{grant.title}</h3>
                  
                  <div className="flex items-center space-x-2 text-xs font-semibold text-slate-600 mt-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>{grant.funder_name}</span>
                    <span className="text-slate-300">•</span>
                    <span className="capitalize text-slate-500">{grant.funder_type?.replace(/_/g, ' ')}</span>
                  </div>

                  <div className="mt-4 p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Grant Budget:</span>
                      <span className="text-base font-black text-[#16A36A]">
                        {grant.grant_amount_formatted ? grant.grant_amount_formatted.replace(/\$([0-9,]+)(\s*USD)?/g, '₹$1 INR') : `₹${Number(grant.grant_amount).toLocaleString('en-IN')}`}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Geographic Scope:</span>
                      <span className="font-semibold text-slate-800">{grant.location_scope}</span>
                    </div>
                  </div>

                  <div className="mt-4 text-xs">
                    <span className="font-bold text-slate-700 block mb-1">Eligibility Criteria:</span>
                    <p className="text-slate-600 leading-relaxed">
                      {grant.eligibility_criteria}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 flex items-center space-x-1">
                    <Globe className="w-3.5 h-3.5" />
                    <span>Verified Official Application</span>
                  </span>

                  <a
                    href={grant.official_link}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl btn-primary text-xs font-bold flex items-center space-x-1.5 shadow-sm"
                  >
                    <span>Official Application</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Modal: Submit Grant Opportunity */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowSubmitModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-black text-slate-900 mb-1">Submit Institutional Grant or CSR Pool</h3>
            <p className="text-xs text-slate-500 mb-4">List an institutional funding opportunity for accredited NGOs.</p>

            <form onSubmit={handleCreateGrant} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Grant / Challenge Title</label>
                <input
                  type="text"
                  required
                  value={grantTitle}
                  onChange={(e) => setGrantTitle(e.target.value)}
                  placeholder="e.g. Google.org Digital Inclusion Challenge 2026"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Funder Name</label>
                  <input
                    type="text"
                    required
                    value={funderName}
                    onChange={(e) => setFunderName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Funder Type</label>
                  <select
                    value={funderType}
                    onChange={(e) => setFunderType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                  >
                    <option value="corporate_csr">Corporate CSR Foundation</option>
                    <option value="philanthropic_foundation">Philanthropic Trust</option>
                    <option value="government">Government & Bilateral</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Grant Pool (₹ INR)</label>
                  <input
                    type="number"
                    min="1000"
                    required
                    value={grantAmount}
                    onChange={(e) => setGrantAmount(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Deadline</label>
                  <input
                    type="date"
                    required
                    value={grantDeadline}
                    onChange={(e) => setGrantDeadline(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Official Application URL</label>
                <input
                  type="url"
                  required
                  value={officialLink}
                  onChange={(e) => setOfficialLink(e.target.value)}
                  placeholder="https://funder.org/apply..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Eligibility Criteria</label>
                <textarea
                  rows="3"
                  required
                  value={eligibility}
                  onChange={(e) => setEligibility(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                ></textarea>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingGrant}
                  className="px-5 py-2 rounded-xl btn-primary text-xs font-bold disabled:opacity-50"
                >
                  {submittingGrant ? 'Submitting...' : 'Publish Grant'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
