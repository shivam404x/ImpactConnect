import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  Globe, 
  CheckCircle2, 
  Plus, 
  Search, 
  UserCheck, 
  Filter, 
  Building2, 
  ArrowRight,
  X,
  Sparkles
} from 'lucide-react';
import { fetchVolunteerRoles, applyVolunteerRole, createVolunteerRole } from '../utils/api';

export default function SkillMarketplace({
  currentUser,
  onOpenAuth
}) {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [causeFilter, setCauseFilter] = useState('all');
  const [remoteOnly, setRemoteOnly] = useState(false);

  // Application Modal state
  const [selectedRole, setSelectedRole] = useState(null);
  const [applicantName, setApplicantName] = useState(currentUser?.name || '');
  const [applicantEmail, setApplicantEmail] = useState(currentUser?.email || '');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [availability, setAvailability] = useState('4-6 hours / week');
  const [pitch, setPitch] = useState('');
  const [submittingApp, setSubmittingApp] = useState(false);
  const [appSuccess, setAppSuccess] = useState(false);

  // Post Role Modal state (for NGOs)
  const [showPostModal, setShowPostModal] = useState(false);
  const [roleTitle, setRoleTitle] = useState('');
  const [roleDesc, setRoleDesc] = useState('');
  const [roleCause, setRoleCause] = useState('education');
  const [roleSkills, setRoleSkills] = useState('Python, Teaching, Curriculum Development');
  const [roleLocation, setRoleLocation] = useState('Remote');
  const [isRemote, setIsRemote] = useState(true);
  const [commitment, setCommitment] = useState('5 hours / week');

  const loadRoles = async () => {
    setLoading(true);
    try {
      const data = await fetchVolunteerRoles({
        cause: causeFilter,
        is_remote: remoteOnly ? 'true' : undefined,
        search
      });
      setRoles(data);
    } catch (err) {
      console.error('Error fetching volunteer roles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoles();
  }, [causeFilter, remoteOnly]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadRoles();
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!applicantEmail || !applicantName) return;
    setSubmittingApp(true);
    try {
      await applyVolunteerRole({
        role_id: selectedRole.id,
        ngo_id: selectedRole.ngo_id,
        applicant_name: applicantName,
        applicant_email: applicantEmail,
        portfolio_url: portfolioUrl,
        weekly_availability: availability,
        pitch_statement: pitch
      });
      setAppSuccess(true);
      setTimeout(() => {
        setAppSuccess(false);
        setSelectedRole(null);
        setPitch('');
        loadRoles();
      }, 1800);
    } catch (err) {
      alert('Failed to submit application: ' + err.message);
    } finally {
      setSubmittingApp(false);
    }
  };

  const handleCreateRole = async (e) => {
    e.preventDefault();
    try {
      const skillsArray = roleSkills.split(',').map(s => s.trim());
      await createVolunteerRole({
        ngo_id: currentUser?.ngo_id || 'ngo-1',
        title: roleTitle,
        description: roleDesc,
        cause_category: roleCause,
        required_skills: skillsArray,
        location: roleLocation,
        is_remote: isRemote,
        commitment_hours: commitment
      });
      setShowPostModal(false);
      setRoleTitle('');
      setRoleDesc('');
      loadRoles();
      alert('New volunteer role published to marketplace!');
    } catch (err) {
      alert('Error creating role: ' + err.message);
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
                Volunteer & Professional Skill Marketplace
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
                Donate Your Expertise to Impactful Causes
              </h1>
              <p className="text-sm text-slate-600 mt-2 max-w-2xl">
                Connect your engineering, legal, medical, pedagogical, or creative talent directly with grassroots initiatives worldwide.
              </p>
            </div>

            <div className="flex items-center space-x-3">
              {currentUser?.role === 'ngo' ? (
                <button
                  onClick={() => setShowPostModal(true)}
                  className="btn-primary px-5 py-3 rounded-xl text-xs font-bold flex items-center space-x-2 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Post Volunteer Role</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    if (!currentUser && onOpenAuth) onOpenAuth('register', 'supporter');
                    else alert('Your volunteer profile is active! Browse roles below.');
                  }}
                  className="btn-primary px-5 py-3 rounded-xl text-xs font-bold flex items-center space-x-2 shadow-sm"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>{currentUser ? 'Volunteer Profile Active' : 'Join as a Skilled Volunteer'}</span>
                </button>
              )}
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
                placeholder="Search by role title, skill (e.g. Python, Medical, Legal, GIS)..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
              />
            </form>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <select
                value={causeFilter}
                onChange={(e) => setCauseFilter(e.target.value)}
                className="px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
              >
                <option value="all">All SDG Causes</option>
                <option value="education">Education</option>
                <option value="healthcare">Healthcare</option>
                <option value="environment">Environment</option>
                <option value="poverty">Poverty Alleviation</option>
                <option value="women_welfare">Women Empowerment</option>
              </select>

              <label className="flex items-center space-x-2 text-xs font-semibold text-slate-700 cursor-pointer bg-white px-3 py-2.5 rounded-xl border border-slate-200">
                <input
                  type="checkbox"
                  checked={remoteOnly}
                  onChange={(e) => setRemoteOnly(e.target.checked)}
                  className="rounded text-[#16A36A] focus:ring-[#16A36A]"
                />
                <span>Remote Only</span>
              </label>

              <button
                onClick={loadRoles}
                className="px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition"
              >
                Filter
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Roles Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="flex items-center justify-between mb-6">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Showing {roles.length} Open Roles
          </span>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-400 text-sm">
            Loading opportunities...
          </div>
        ) : roles.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-md mx-auto">
            <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-black text-slate-800">No Volunteer Roles Found</h3>
            <p className="text-xs text-slate-500 mt-1">Try resetting your filters or search keywords.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roles.map(role => (
              <div
                key={role.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:border-[#16A36A] hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 text-[#16A36A] border border-emerald-100">
                      {role.cause_category}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400 flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{role.commitment_hours || '4 hrs/wk'}</span>
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-slate-900 leading-tight">{role.title}</h3>
                  <div className="flex items-center space-x-1.5 text-xs text-slate-500 font-semibold mt-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>{role.ngo_name}</span>
                  </div>

                  <p className="text-xs text-slate-600 mt-3 line-clamp-3 leading-relaxed">
                    {role.description}
                  </p>

                  {/* Required Skill Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {Array.isArray(role.required_skills) && role.required_skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-xs text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{role.is_remote ? 'Remote / Online' : role.location || 'Field Location'}</span>
                  </div>

                  <button
                    onClick={() => setSelectedRole(role)}
                    className="px-4 py-2 rounded-xl btn-primary text-xs font-bold shadow-sm"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Application Modal */}
      {selectedRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setSelectedRole(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {appSuccess ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-[#16A36A]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-slate-900">Application Submitted!</h3>
                <p className="text-xs text-slate-600 max-w-xs mx-auto">
                  Your profile and availability statement have been sent to {selectedRole.ngo_name}. They will reach out to schedule a brief intro call.
                </p>
              </div>
            ) : (
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#16A36A] bg-emerald-50 px-2 py-0.5 rounded-full">
                  Volunteer Application
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-2">{selectedRole.title}</h3>
                <p className="text-xs text-slate-500">Organization: {selectedRole.ngo_name}</p>

                <form onSubmit={handleApply} className="space-y-4 mt-5">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name</label>
                      <input
                        type="text"
                        required
                        value={applicantName}
                        onChange={(e) => setApplicantName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        value={applicantEmail}
                        onChange={(e) => setApplicantEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">LinkedIn / Portfolio URL</label>
                      <input
                        type="url"
                        value={portfolioUrl}
                        onChange={(e) => setPortfolioUrl(e.target.value)}
                        placeholder="https://linkedin.com/in/..."
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Availability</label>
                      <select
                        value={availability}
                        onChange={(e) => setAvailability(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                      >
                        <option value="2-4 hours / week">2-4 hours / week</option>
                        <option value="5-8 hours / week">5-8 hours / week</option>
                        <option value="10+ hours / week">10+ hours / week</option>
                        <option value="Full-time Sabbatical">Full-time Sabbatical</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Brief Statement of Motivation & Skills</label>
                    <textarea
                      rows="3"
                      required
                      value={pitch}
                      onChange={(e) => setPitch(e.target.value)}
                      placeholder="Why would you like to contribute to this initiative and what experience do you bring?"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                    ></textarea>
                  </div>

                  <div className="flex items-center justify-end space-x-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedRole(null)}
                      className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submittingApp}
                      className="px-5 py-2 rounded-xl btn-primary text-xs font-bold disabled:opacity-50"
                    >
                      {submittingApp ? 'Submitting...' : 'Submit Application'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Post Role Modal (For NGOs) */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setShowPostModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-black text-slate-900 mb-1">Publish Volunteer / Skill Role</h3>
            <p className="text-xs text-slate-500 mb-4">Post an open requirement for skilled professionals or volunteer champions.</p>

            <form onSubmit={handleCreateRole} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Role Title</label>
                <input
                  type="text"
                  required
                  value={roleTitle}
                  onChange={(e) => setRoleTitle(e.target.value)}
                  placeholder="e.g. Lead STEM Curriculum Mentor"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Cause Domain</label>
                  <select
                    value={roleCause}
                    onChange={(e) => setRoleCause(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                  >
                    <option value="education">Education</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="environment">Environment</option>
                    <option value="poverty">Poverty Alleviation</option>
                    <option value="women_welfare">Women Welfare</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Time Commitment</label>
                  <input
                    type="text"
                    value={commitment}
                    onChange={(e) => setCommitment(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Required Skills (Comma-separated)</label>
                <input
                  type="text"
                  value={roleSkills}
                  onChange={(e) => setRoleSkills(e.target.value)}
                  placeholder="Python, Public Health, Figma, Auditing..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Role Description & Responsibilities</label>
                <textarea
                  rows="3"
                  required
                  value={roleDesc}
                  onChange={(e) => setRoleDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                ></textarea>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remoteCheckbox"
                  checked={isRemote}
                  onChange={(e) => setIsRemote(e.target.checked)}
                  className="rounded text-[#16A36A] focus:ring-[#16A36A]"
                />
                <label htmlFor="remoteCheckbox" className="text-xs font-bold text-slate-700 cursor-pointer">
                  This role can be performed 100% remotely
                </label>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPostModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl btn-primary text-xs font-bold"
                >
                  Publish Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
