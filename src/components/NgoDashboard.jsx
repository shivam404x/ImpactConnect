import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  PlusCircle, 
  FolderKanban, 
  HeartHandshake, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Users, 
  IndianRupee, 
  Edit3, 
  Trash2, 
  Save, 
  ExternalLink,
  Mail,
  Phone,
  RefreshCw,
  Search,
  Sparkles,
  ShieldCheck,
  UserCheck,
  Briefcase,
  QrCode,
  FileCheck,
  Users2
} from 'lucide-react';
import { 
  fetchProjects, 
  fetchPartnershipRequests, 
  updatePartnershipStatus, 
  updateNgo, 
  deleteProject,
  fetchVolunteerApplications,
  updateVolunteerApplicationStatus
} from '../utils/api';
import confetti from 'canvas-confetti';

export default function NgoDashboard({ 
  currentUser, 
  onOpenPostProject, 
  onOpenWorkspace,
  onOpenNeedToAction,
  onOpenQrAttendance,
  onNavigate 
}) {
  const [activeTab, setActiveTab] = useState('projects'); // 'projects' | 'requests' | 'volunteers' | 'profile'
  const [projects, setProjects] = useState([]);
  const [requests, setRequests] = useState([]);
  const [volunteerApps, setVolunteerApps] = useState([]);
  const [loading, setLoading] = useState(true);

  // Profile Edit State
  const [orgName, setOrgName] = useState(currentUser?.organization_name || 'Aashray Rural & Slum Upliftment Trust');
  const [orgMission, setOrgMission] = useState('To eradicate extreme poverty and generational vulnerability through grassroots skill development and clean water.');
  const [orgTagline, setOrgTagline] = useState('Empowering underserved urban informal settlements with sustainable livelihoods');
  const [orgWebsite, setOrgWebsite] = useState('https://aashray-uplift.org');
  const [orgPhone, setOrgPhone] = useState('+91 98201 44510');
  const [orgCity, setOrgCity] = useState('Mumbai');
  const [orgCountry, setOrgCountry] = useState('India');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  // Proposal note modal
  const [decisionModal, setDecisionModal] = useState(null); // { id, action: 'accepted' | 'declined' }
  const [decisionNote, setDecisionNote] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const ngoId = currentUser?.ngo_id || 'ngo-1';

  const loadData = async () => {
    setLoading(true);
    try {
      const [projData, reqData, appData] = await Promise.all([
        fetchProjects({ ngo_id: ngoId }),
        fetchPartnershipRequests({ ngo_id: ngoId }),
        fetchVolunteerApplications({ ngo_id: ngoId }).catch(() => [])
      ]);
      setProjects(projData);
      setRequests(reqData);
      setVolunteerApps(appData);
    } catch (err) {
      console.error('Error loading NGO dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [ngoId]);

  const handleStatusChange = async (requestId, status, note) => {
    setUpdatingStatus(true);
    try {
      await updatePartnershipStatus(requestId, status, note);
      if (status === 'accepted') {
        try {
          confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
        } catch {}
      }
      setDecisionModal(null);
      setDecisionNote('');
      await loadData();
    } catch (err) {
      alert('Error updating status: ' + err.message);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleUpdateAppStatus = async (appId, status) => {
    try {
      await updateVolunteerApplicationStatus(appId, status);
      await loadData();
    } catch (err) {
      alert('Failed to update volunteer status: ' + err.message);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await updateNgo(ngoId, {
        name: orgName,
        mission: orgMission,
        tagline: orgTagline,
        website: orgWebsite,
        phone: orgPhone,
        city: orgCity,
        country: orgCountry
      });
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    } catch (err) {
      alert('Failed to save profile: ' + err.message);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleDeleteProject = async (id) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject(id);
        await loadData();
      } catch (err) {
        alert('Failed to delete project: ' + err.message);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Top Welcome Strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#16A36A] border border-emerald-200 flex items-center justify-center font-bold shrink-0">
            <Building2 className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {orgName}
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center space-x-1">
                <ShieldCheck className="w-3 h-3 text-[#16A36A]" />
                <span>Gold Verified NGO</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Organization Lead Portal • Manage active projects, inbound partners & volunteer applicants
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onOpenNeedToAction && (
            <button
              onClick={onOpenNeedToAction}
              className="px-3.5 py-2.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold flex items-center space-x-1.5 transition"
              title="Convert problem notes to structured campaign"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Need-to-Action AI</span>
            </button>
          )}

          {onOpenQrAttendance && (
            <button
              onClick={onOpenQrAttendance}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center space-x-1.5 transition"
              title="Open QR Attendance Scanner & Passes"
            >
              <QrCode className="w-3.5 h-3.5 text-slate-500" />
              <span>QR Attendance</span>
            </button>
          )}

          <button
            onClick={onOpenPostProject}
            className="px-4 py-2.5 rounded-xl btn-primary text-xs font-bold flex items-center space-x-2 shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post New Requirement</span>
          </button>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Sidebar Navigation */}
        <div className="lg:col-span-3 space-y-2">
          <button
            onClick={() => setActiveTab('projects')}
            className={`w-full text-left px-4 py-3 rounded-2xl font-bold text-xs flex items-center justify-between transition ${
              activeTab === 'projects'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <FolderKanban className="w-4 h-4 text-[#16A36A]" />
              <span>Active Projects</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[10px] font-bold text-slate-600">
              {projects.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('requests')}
            className={`w-full text-left px-4 py-3 rounded-2xl font-bold text-xs flex items-center justify-between transition ${
              activeTab === 'requests'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <HeartHandshake className="w-4 h-4 text-[#16A36A]" />
              <span>Partnership Proposals</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-800">
              {requests.filter(r => r.status === 'pending').length} new
            </span>
          </button>

          <button
            onClick={() => setActiveTab('volunteers')}
            className={`w-full text-left px-4 py-3 rounded-2xl font-bold text-xs flex items-center justify-between transition ${
              activeTab === 'volunteers'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <UserCheck className="w-4 h-4 text-sky-600" />
              <span>Volunteer Applicants</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-sky-100 text-[10px] font-bold text-sky-800">
              {volunteerApps.length}
            </span>
          </button>

          {onNavigate && (
            <>
              <button
                onClick={() => onNavigate('document-checklist')}
                className="w-full text-left px-4 py-3 rounded-2xl font-bold text-xs flex items-center justify-between text-slate-600 hover:text-slate-900 hover:bg-white/60 transition"
              >
                <div className="flex items-center space-x-2.5">
                  <FileCheck className="w-4 h-4 text-emerald-600" />
                  <span>Document Checklist</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-[10px] font-bold text-emerald-700">
                  12A/80G
                </span>
              </button>

              <button
                onClick={() => onNavigate('cross-ngo')}
                className="w-full text-left px-4 py-3 rounded-2xl font-bold text-xs flex items-center justify-between text-slate-600 hover:text-slate-900 hover:bg-white/60 transition"
              >
                <div className="flex items-center space-x-2.5">
                  <Users2 className="w-4 h-4 text-indigo-600" />
                  <span>Cross-NGO Coalitions</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-[10px] font-bold text-indigo-700">
                  Joint
                </span>
              </button>
            </>
          )}

          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full text-left px-4 py-3 rounded-2xl font-bold text-xs flex items-center space-x-2.5 transition ${
              activeTab === 'profile'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Building2 className="w-4 h-4 text-slate-500" />
            <span>Organization Profile</span>
          </button>
        </div>

        {/* Main Content Pane */}
        <div className="lg:col-span-9 space-y-6">
          
          {/* TAB 1: PROJECTS */}
          {activeTab === 'projects' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Active Community Projects</h3>
                  <p className="text-xs text-slate-500">Manage published initiatives and monitor current volunteer and funding goals.</p>
                </div>
              </div>

              {loading ? (
                <div className="p-12 text-center text-slate-400">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#16A36A] mb-2" />
                  Loading projects...
                </div>
              ) : projects.length === 0 ? (
                <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 text-slate-500">
                  <FolderKanban className="w-10 h-10 mx-auto text-slate-400 mb-2" />
                  <p className="font-bold text-slate-800">No projects published yet.</p>
                  <button onClick={onOpenPostProject} className="mt-3 px-4 py-2 rounded-xl btn-primary text-xs font-bold">
                    Create First Project
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {projects.map(proj => (
                    <div 
                      key={proj.id}
                      className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-start space-x-4">
                        <img 
                          src={proj.cover_image || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=200&q=80'} 
                          alt={proj.title}
                          className="w-16 h-16 rounded-xl object-cover shrink-0" 
                        />
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] font-bold text-[#16A36A] uppercase px-2 py-0.5 rounded-full bg-emerald-50">
                              {proj.cause_category}
                            </span>
                            <span className="text-xs text-slate-400">•</span>
                            <span className="text-xs text-slate-500">{proj.location_city}, {proj.location_country}</span>
                          </div>
                          <h4 className="font-bold text-slate-900 text-sm mt-1">{proj.title}</h4>
                          <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{proj.tagline}</p>
                          <div className="text-[11px] text-slate-400 mt-1">
                            {proj.requirements?.length || 0} resource needs published
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 self-end sm:self-center">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 uppercase">
                          {proj.status || 'Active'}
                        </span>
                        <button
                          onClick={() => handleDeleteProject(proj.id)}
                          className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                          title="Delete project"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PARTNERSHIP PROPOSALS */}
          {activeTab === 'requests' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Inbound Partnership Requests</h3>
                <p className="text-xs text-slate-500">Review collaboration offers sent by donors, corporate CSR teams, and skilled volunteers.</p>
              </div>

              {requests.length === 0 ? (
                <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 text-slate-500">
                  <HeartHandshake className="w-10 h-10 mx-auto text-slate-400 mb-2" />
                  <p className="font-bold text-slate-800">No partnership proposals received yet.</p>
                  <p className="text-xs text-slate-400 mt-1">As supporters discover your projects, their offers will appear here.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {requests.map(req => (
                    <div 
                      key={req.id}
                      className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                        <div>
                          <div className="text-xs font-bold text-[#16A36A]">{req.project_title}</div>
                          <div className="text-sm font-black text-slate-900 mt-0.5">
                            Pledge: {req.offer_value || req.offer_type}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center space-x-1 ${
                            req.status === 'accepted' 
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : req.status === 'declined'
                              ? 'bg-rose-50 text-rose-800 border border-rose-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}>
                            {req.status === 'accepted' ? <CheckCircle2 className="w-3.5 h-3.5 text-[#16A36A]" /> : null}
                            <span className="capitalize">{req.status}</span>
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div className="bg-[#F8FAFC] p-3.5 rounded-xl border border-slate-200/80 space-y-1">
                          <div className="font-bold text-slate-900">{req.supporter_name}</div>
                          {req.organization_name && <div className="text-slate-600 font-semibold">{req.organization_name}</div>}
                          <div className="text-slate-500 capitalize">Role: {req.supporter_type?.replace(/_/g, ' ')}</div>
                          <div className="pt-2 text-slate-700 flex items-center space-x-1.5">
                            <Mail className="w-3.5 h-3.5 text-[#16A36A]" />
                            <span>{req.supporter_email}</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="text-slate-500 font-semibold">Proposal Note:</div>
                          <p className="text-slate-700 italic bg-[#F8FAFC] p-3 rounded-xl border border-slate-200/80 leading-relaxed">
                            "{req.message}"
                          </p>
                          {req.ngo_response_note && (
                            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-slate-800 text-[11px]">
                              <strong>Your response:</strong> {req.ngo_response_note}
                            </div>
                          )}
                        </div>
                      </div>

                      {req.status === 'pending' && (
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-end space-x-2">
                          <button
                            onClick={() => {
                              setDecisionModal({ id: req.id, action: 'declined', title: req.project_title });
                              setDecisionNote('Thank you for your generous proposal. At this moment our capacity is focused on another priority.');
                            }}
                            className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold"
                          >
                            Decline
                          </button>
                          <button
                            onClick={() => {
                              setDecisionModal({ id: req.id, action: 'accepted', title: req.project_title });
                              setDecisionNote('We are thrilled to accept your partnership offer! Our team will contact you to schedule onboarding.');
                            }}
                            className="px-4 py-2 rounded-xl btn-primary text-xs font-bold flex items-center space-x-1.5"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Accept & Connect</span>
                          </button>
                        </div>
                      )}

                      {/* Launch Workspace if accepted */}
                      {req.status === 'accepted' && (
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-end">
                          <button
                            onClick={() => onOpenWorkspace && onOpenWorkspace(req)}
                            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center space-x-1.5 shadow-sm transition"
                          >
                            <FolderKanban className="w-3.5 h-3.5 text-[#16A36A]" />
                            <span>Launch Collaboration Workspace</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: VOLUNTEER APPLICANTS */}
          {activeTab === 'volunteers' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Volunteer & Skilled Professional Applicants</h3>
                <p className="text-xs text-slate-500">Review applications from specialists seeking to support your projects.</p>
              </div>

              {volunteerApps.length === 0 ? (
                <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 text-slate-500">
                  <UserCheck className="w-10 h-10 mx-auto text-slate-400 mb-2" />
                  <p className="font-bold text-slate-800">No volunteer applications received yet.</p>
                  <p className="text-xs text-slate-400 mt-1">Publish new roles in the Volunteer Hub to attract talent.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {volunteerApps.map(app => (
                    <div key={app.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <div>
                          <span className="text-[10px] font-bold uppercase text-[#16A36A]">{app.role_title || 'Volunteer Role'}</span>
                          <h4 className="text-sm font-bold text-slate-900">{app.applicant_name}</h4>
                          <span className="text-xs text-slate-400">{app.applicant_email}</span>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${
                          app.status === 'accepted' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {app.status}
                        </span>
                      </div>

                      <div className="text-xs space-y-1 bg-slate-50 p-3 rounded-xl">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Availability:</span>
                          <span className="font-semibold text-slate-800">{app.weekly_availability}</span>
                        </div>
                        {app.portfolio_url && (
                          <div className="flex justify-between">
                            <span className="text-slate-500">Portfolio / Profile:</span>
                            <a href={app.portfolio_url} target="_blank" rel="noreferrer" className="text-[#16A36A] font-semibold underline truncate max-w-[200px]">
                              {app.portfolio_url}
                            </a>
                          </div>
                        )}
                        <p className="pt-2 text-slate-600 italic">"{app.pitch_statement}"</p>
                      </div>

                      {app.status === 'pending' && (
                        <div className="flex items-center justify-end space-x-2 pt-2">
                          <button
                            onClick={() => handleUpdateAppStatus(app.id, 'declined')}
                            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600"
                          >
                            Decline
                          </button>
                          <button
                            onClick={() => handleUpdateAppStatus(app.id, 'accepted')}
                            className="px-3 py-1.5 rounded-xl btn-primary text-xs font-bold"
                          >
                            Accept Volunteer
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: ORGANIZATION PROFILE */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900">Organization Profile & Trust Compliance</h3>
                <p className="text-xs text-slate-500">Keep your public NGO profile accurate for prospective corporate and philanthropic partners.</p>
              </div>

              {profileSaved && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#16A36A]" />
                  <span>Organization details successfully saved and updated!</span>
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Organization Name</label>
                  <input
                    type="text"
                    required
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Impact Tagline</label>
                  <input
                    type="text"
                    value={orgTagline}
                    onChange={(e) => setOrgTagline(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mission Statement</label>
                  <textarea
                    rows="3"
                    value={orgMission}
                    onChange={(e) => setOrgMission(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 text-xs font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">City</label>
                    <input
                      type="text"
                      value={orgCity}
                      onChange={(e) => setOrgCity(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 text-xs font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Country</label>
                    <input
                      type="text"
                      value={orgCountry}
                      onChange={(e) => setOrgCountry(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 text-xs font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Official Website</label>
                    <input
                      type="url"
                      value={orgWebsite}
                      onChange={(e) => setOrgWebsite(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 text-xs font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Phone</label>
                    <input
                      type="text"
                      value={orgPhone}
                      onChange={(e) => setOrgPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 text-xs font-medium"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 flex justify-end">
                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="px-6 py-2.5 rounded-xl btn-primary text-xs font-bold flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>{savingProfile ? 'Saving...' : 'Save Profile Changes'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>

      </div>

      {/* Decision Note Modal */}
      {decisionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              {decisionModal.action === 'accepted' ? 'Accept Partnership Offer' : 'Decline Partnership Offer'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Project: <span className="font-semibold text-slate-700">{decisionModal.title}</span>
            </p>

            <div className="space-y-3 text-xs">
              <label className="block font-semibold text-slate-700">
                Message to Supporter (included in official notification)
              </label>
              <textarea
                rows="3"
                value={decisionNote}
                onChange={(e) => setDecisionNote(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 text-xs"
              ></textarea>
            </div>

            <div className="flex items-center justify-end space-x-2 mt-5">
              <button
                onClick={() => setDecisionModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                onClick={() => handleStatusChange(decisionModal.id, decisionModal.action, decisionNote)}
                disabled={updatingStatus}
                className={`px-5 py-2 rounded-xl text-xs font-bold text-white ${
                  decisionModal.action === 'accepted' ? 'bg-[#16A36A] hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                {updatingStatus ? 'Updating...' : `Confirm ${decisionModal.action === 'accepted' ? 'Acceptance' : 'Decline'}`}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
