import React, { useState, useEffect } from 'react';
import { 
  User, 
  HeartHandshake, 
  Bookmark, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  MapPin, 
  DollarSign, 
  Building2, 
  ArrowRight,
  RefreshCw,
  Mail,
  FolderKanban,
  Zap,
  ShieldCheck,
  Calendar,
  Truck
} from 'lucide-react';
import { fetchPartnershipRequests, fetchProjects, fetchAiMatches, toggleFavorite } from '../utils/api';

export default function SupporterDashboard({ 
  currentUser, 
  onSelectProject, 
  onPartnerClick,
  onOpenWorkspace,
  onNavigate 
}) {
  const [activeTab, setActiveTab] = useState('requests'); // 'requests' | 'recommended' | 'profile'
  const [myRequests, setMyRequests] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [allProjects, setAllProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Profile preferences state
  const [skills, setSkills] = useState(
    Array.isArray(currentUser?.skills) ? currentUser.skills.join(', ') : 'Grant Funding, Healthcare, Laptops'
  );
  const [location, setLocation] = useState(currentUser?.city || 'San Francisco, USA');

  const loadData = async () => {
    setLoading(true);
    try {
      const [reqData, projs, aiData] = await Promise.all([
        fetchPartnershipRequests({ 
          supporter_email: currentUser?.email,
          supporter_id: currentUser?.id 
        }),
        fetchProjects({}),
        fetchAiMatches({ 
          supporter_type: currentUser?.supporter_type || 'corporate_csr',
          skills: skills 
        })
      ]);
      setMyRequests(reqData);
      setAllProjects(projs);
      setRecommended(aiData);
    } catch (err) {
      console.error('Error loading supporter dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentUser]);

  const acceptedRequests = myRequests.filter(r => r.status === 'accepted');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Welcome Banner */}
      <div className="bg-[#F8FAFC] border border-slate-200 rounded-3xl p-6 sm:p-8 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <img 
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80'} 
            alt={currentUser?.name} 
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-500/20" 
          />
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">{currentUser?.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 capitalize">
                {currentUser?.supporter_type?.replace('_', ' ') || 'Partner Supporter'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {currentUser?.organization_name || 'Individual Contributor'} • Pledging resources for community progress
            </p>
          </div>
        </div>

        {/* Quick summary stats */}
        <div className="flex items-center space-x-6 text-xs border-t md:border-t-0 md:border-l border-slate-200 pt-4 md:pt-0 md:pl-6">
          <div>
            <div className="text-slate-500">Proposals Sent</div>
            <div className="text-xl font-black text-slate-900">{myRequests.length}</div>
          </div>
          <div>
            <div className="text-slate-500">Active Collaborations</div>
            <div className="text-xl font-black text-[#16A36A]">{acceptedRequests.length}</div>
          </div>
        </div>
      </div>

      {/* Volunteer Action Hub / Toolbelt */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-8">
        <button
          onClick={() => onNavigate && onNavigate('micro-tasks')}
          className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-amber-300 hover:shadow-sm text-left transition group"
        >
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2.5 group-hover:scale-105 transition">
            <Zap className="w-5 h-5" />
          </div>
          <div className="font-black text-slate-900 text-xs flex items-center justify-between">
            <span>Micro-Tasks</span>
            <span className="text-[10px] text-amber-600 font-bold bg-amber-50 px-1.5 py-0.5 rounded">15-45m</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">Quick tasks & instant impact</p>
        </button>

        <button
          onClick={() => onNavigate && onNavigate('passport')}
          className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-sm text-left transition group"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2.5 group-hover:scale-105 transition">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="font-black text-slate-900 text-xs flex items-center justify-between">
            <span>Impact Passport</span>
            <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">Verified</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">Hours, skills & credentials</p>
        </button>

        <button
          onClick={() => onNavigate && onNavigate('calendar')}
          className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-sky-300 hover:shadow-sm text-left transition group"
        >
          <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-2.5 group-hover:scale-105 transition">
            <Calendar className="w-5 h-5" />
          </div>
          <div className="font-black text-slate-900 text-xs flex items-center justify-between">
            <span>Shifts Calendar</span>
            <span className="text-[10px] text-sky-600 font-bold bg-sky-50 px-1.5 py-0.5 rounded">Schedule</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">Volunteer event slots</p>
        </button>

        <button
          onClick={() => onNavigate && onNavigate('deliveries')}
          className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-sm text-left transition group"
        >
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2.5 group-hover:scale-105 transition">
            <Truck className="w-5 h-5" />
          </div>
          <div className="font-black text-slate-900 text-xs flex items-center justify-between">
            <span>Track Deliveries</span>
            <span className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-1.5 py-0.5 rounded">Logistics</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">Pledges & delivery receipts</p>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-3 mb-6 text-xs font-bold overflow-x-auto">
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-4 py-2 rounded-xl whitespace-nowrap transition ${
            activeTab === 'requests'
              ? 'bg-[#16A36A] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          My Proposals & Requests ({myRequests.length})
        </button>

        <button
          onClick={() => setActiveTab('recommended')}
          className={`px-4 py-2 rounded-xl whitespace-nowrap transition flex items-center space-x-1.5 ${
            activeTab === 'recommended'
              ? 'bg-[#16A36A] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Smart Recommendations ({recommended.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 rounded-xl whitespace-nowrap transition ${
            activeTab === 'profile'
              ? 'bg-[#16A36A] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Profile & Skills
        </button>

        {onNavigate && (
          <>
            <button
              onClick={() => onNavigate('personalized')}
              className="px-4 py-2 rounded-xl whitespace-nowrap text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
            >
              Personalized Feed
            </button>
            <button
              onClick={() => onNavigate('resources')}
              className="px-4 py-2 rounded-xl whitespace-nowrap text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
            >
              Exchange Hub
            </button>
          </>
        )}
      </div>

      {/* TAB 1: MY REQUESTS */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          {loading ? (
            <div className="p-12 text-center text-slate-400">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#16A36A] mb-2" />
              Loading your proposals...
            </div>
          ) : myRequests.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 text-slate-500">
              <HeartHandshake className="w-10 h-10 mx-auto text-slate-400 mb-2" />
              <h4 className="font-bold text-slate-800 text-base">You haven't submitted any partnership proposals yet.</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Discover grassroots community projects and pledge funding, volunteering, or supplies in 1 click.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {myRequests.map(req => (
                <div 
                  key={req.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div>
                      <div className="text-xs font-bold text-slate-400">Project Initiative</div>
                      <h4 className="font-extrabold text-slate-900 text-base">{req.project_title}</h4>
                      <div className="text-xs text-slate-500">NGO: <strong className="text-slate-800">{req.ngo_name}</strong></div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1.5 ${
                        req.status === 'accepted'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : req.status === 'declined'
                          ? 'bg-rose-50 text-rose-800 border border-rose-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        {req.status === 'accepted' && <CheckCircle2 className="w-3.5 h-3.5 text-[#16A36A]" />}
                        {req.status === 'pending' && <Clock className="w-3.5 h-3.5 text-amber-600" />}
                        {req.status === 'declined' && <XCircle className="w-3.5 h-3.5 text-rose-600" />}
                        <span className="capitalize">{req.status === 'accepted' ? 'Partnership Confirmed' : req.status}</span>
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
                    <div className="md:col-span-5 bg-[#F8FAFC] p-4 rounded-2xl border border-slate-200/80 space-y-1">
                      <div className="text-[10px] font-bold uppercase text-slate-400">Your Pledged Contribution:</div>
                      <div className="font-black text-slate-900 text-sm text-[#16A36A]">{req.offer_value || req.offer_type}</div>
                      <div className="text-slate-500">Timeline: {req.timeline || 'Immediate'}</div>
                    </div>

                    <div className="md:col-span-7 space-y-2">
                      <div className="text-slate-500 font-semibold">Your Message to NGO:</div>
                      <p className="text-slate-700 italic bg-[#F8FAFC] p-3 rounded-2xl border border-slate-200/80">
                        "{req.message}"
                      </p>

                      {/* Official NGO Response & Next Steps */}
                      {req.ngo_response_note && (
                        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-slate-800 space-y-1">
                          <div className="font-bold text-emerald-800">Official Note from {req.ngo_name}:</div>
                          <p className="text-xs text-slate-700">{req.ngo_response_note}</p>
                          {req.ngo_email && (
                            <div className="pt-1 text-slate-600 flex items-center space-x-1.5 font-semibold text-[11px]">
                              <Mail className="w-3 h-3 text-[#16A36A]" />
                              <span>Direct Contact: {req.ngo_email}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Launch Collaboration Workspace Button when Accepted */}
                  {req.status === 'accepted' && (
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
                      <button
                        onClick={() => onOpenWorkspace && onOpenWorkspace(req)}
                        className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center space-x-1.5 shadow-sm transition"
                      >
                        <FolderKanban className="w-3.5 h-3.5 text-[#16A36A]" />
                        <span>Open Collaboration Workspace</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: RECOMMENDED INITIATIVES */}
      {activeTab === 'recommended' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recommended.map(proj => (
            <div 
              key={proj.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-lg transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="px-2.5 py-0.5 rounded-full font-bold bg-emerald-50 text-[#16A36A] border border-emerald-200">
                    {proj.matchScore}% Match Score
                  </span>
                  <span className="text-slate-400">{proj.location_city}, {proj.location_country}</span>
                </div>

                <h4 className="font-bold text-slate-900 text-base">{proj.title}</h4>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1">{proj.tagline || proj.description}</p>

                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-1.5">
                  {(proj.matchReasons || []).map((reason, i) => (
                    <span key={i} className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-emerald-50/60 text-emerald-800 border border-emerald-100">
                      ✓ {reason}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => onSelectProject(proj)}
                  className="text-xs font-bold text-slate-600 hover:text-slate-900"
                >
                  View Details
                </button>

                <button
                  onClick={() => onPartnerClick(proj)}
                  className="px-4 py-2 rounded-xl btn-primary text-xs font-bold flex items-center space-x-1"
                >
                  <span>Connect Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: SUPPORTER PROFILE */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs max-w-2xl space-y-4">
          <h3 className="text-base font-bold text-slate-900">Contribution Persona & Skill Interests</h3>
          <p className="text-xs text-slate-500">Fine-tune your skills and causes to train our transparent matching engine.</p>

          <div className="space-y-4 text-xs pt-2">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Your Skills & Resource Offerings (Comma-separated)</label>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Preferred Location / Focus Region</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => {
                  loadData();
                  alert('Preferences updated! Smart recommendations refreshed.');
                }}
                className="px-5 py-2.5 rounded-xl btn-primary text-xs font-bold"
              >
                Update Recommendations
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
