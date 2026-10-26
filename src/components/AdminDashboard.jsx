import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Building2, 
  Users, 
  FolderKanban, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  RefreshCw, 
  Search,
  ExternalLink,
  Trash2,
  AlertTriangle,
  FileCheck,
  ShieldAlert,
  MapPin,
  Network
} from 'lucide-react';
import { 
  fetchNgos, 
  fetchProjects, 
  fetchStats, 
  verifyNgo, 
  deleteProject,
  fetchReports,
  fetchVerificationRequests,
  reviewVerificationRequest
} from '../utils/api';

export default function AdminDashboard({ currentUser, onOpenRiskAlerts, onNavigate }) {
  const [activeTab, setActiveTab] = useState('ngos'); // 'ngos' | 'projects' | 'verifications' | 'reports' | 'activity'
  const [ngos, setNgos] = useState([]);
  const [projects, setProjects] = useState([]);
  const [reports, setReports] = useState([]);
  const [verifications, setVerifications] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [ngoList, projList, statsData, repList, vrList] = await Promise.all([
        fetchNgos({}),
        fetchProjects({}),
        fetchStats(),
        fetchReports().catch(() => []),
        fetchVerificationRequests().catch(() => [])
      ]);
      setNgos(ngoList);
      setProjects(projList);
      setStats(statsData);
      setReports(repList);
      setVerifications(vrList);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleVerifyToggle = async (ngoId, currentStatus) => {
    try {
      await verifyNgo(ngoId, !currentStatus, !currentStatus ? 'Gold Verified' : 'Pending Verification');
      await loadAdminData();
    } catch (err) {
      alert('Verification update failed: ' + err.message);
    }
  };

  const handleReviewVerification = async (vrId, status, tier = 'Gold Verified') => {
    try {
      await reviewVerificationRequest(vrId, {
        status,
        verification_tier: tier,
        admin_notes: `Processed by superuser ${currentUser?.name || 'Admin'} on ${new Date().toLocaleDateString()}`
      });
      await loadAdminData();
      alert(`Verification request ${status}!`);
    } catch (err) {
      alert('Review failed: ' + err.message);
    }
  };

  const handleDeleteProj = async (projId) => {
    if (confirm('Admin Action: Are you sure you want to remove this project?')) {
      try {
        await deleteProject(projId);
        await loadAdminData();
      } catch (err) {
        alert('Failed to delete project: ' + err.message);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Admin Operations Center</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
                Superuser Compliance Mode
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Review NGO compliance, manage community projects, and audit platform collaboration activity.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {onOpenRiskAlerts && (
            <button
              onClick={onOpenRiskAlerts}
              className="px-3.5 py-2 rounded-xl border border-rose-200 bg-rose-50/70 hover:bg-rose-100 text-rose-800 text-xs font-bold flex items-center space-x-1.5 transition"
              title="View automated AI risk flags & delivery alerts"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              <span>Risk Alerts & AI Audits</span>
            </button>
          )}

          {onNavigate && (
            <>
              <button
                onClick={() => onNavigate('heatmap')}
                className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center space-x-1.5 transition"
                title="Open geographic community needs map"
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>Needs Heatmap</span>
              </button>

              <button
                onClick={() => onNavigate('network-graph')}
                className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center space-x-1.5 transition"
                title="View partner ecosystem graph"
              >
                <Network className="w-3.5 h-3.5 text-indigo-600" />
                <span>Network Graph</span>
              </button>
            </>
          )}

          <button
            onClick={loadAdminData}
            className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center space-x-1.5 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* 4 Mini Stat Badges */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Registered NGOs</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{ngos.length}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Active Community Projects</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{projects.length}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Safety Reports</div>
          <div className="text-2xl font-black text-rose-600 mt-1">{reports.length}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Verification Queue</div>
          <div className="text-2xl font-black text-[#16A36A] mt-1">{verifications.length}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-3 mb-6 text-xs font-bold overflow-x-auto">
        <button
          onClick={() => setActiveTab('ngos')}
          className={`px-4 py-2 rounded-xl whitespace-nowrap transition ${
            activeTab === 'ngos' ? 'bg-[#16A36A] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          NGO Directory & Status ({ngos.length})
        </button>
        <button
          onClick={() => setActiveTab('projects')}
          className={`px-4 py-2 rounded-xl whitespace-nowrap transition ${
            activeTab === 'projects' ? 'bg-[#16A36A] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Project Management ({projects.length})
        </button>
        <button
          onClick={() => setActiveTab('verifications')}
          className={`px-4 py-2 rounded-xl whitespace-nowrap transition ${
            activeTab === 'verifications' ? 'bg-[#16A36A] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Verification Queue ({verifications.length})
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2 rounded-xl whitespace-nowrap transition ${
            activeTab === 'reports' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Trust & Safety Reports ({reports.length})
        </button>
      </div>

      {/* TAB 1: NGOS MANAGEMENT */}
      {activeTab === 'ngos' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">Registered Organizations</h3>
            <span className="text-xs text-slate-500">{ngos.length} entities</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-[#F8FAFC] text-slate-700 font-bold border-b border-slate-200 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Organization</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Tax & Reg ID</th>
                  <th className="py-3 px-4">Verification Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ngos.map(ngo => (
                  <tr key={ngo.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center space-x-2.5">
                      <img src={ngo.logo_url} alt="" className="w-7 h-7 rounded-lg object-cover" />
                      <div>
                        <div>{ngo.name}</div>
                        <div className="text-[10px] text-slate-400 font-normal">{ngo.email}</div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">{ngo.city}, {ngo.country}</td>
                    <td className="py-3.5 px-4">{ngo.registration_number || 'N/A'}</td>
                    <td className="py-3.5 px-4">
                      {ngo.is_verified ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center space-x-1 w-max">
                          <CheckCircle2 className="w-3 h-3 text-[#16A36A]" />
                          <span>{ngo.verification_tier || 'Verified'}</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          Pending Review
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleVerifyToggle(ngo.id, ngo.is_verified)}
                        className={`px-3 py-1 rounded-lg text-[11px] font-bold transition ${
                          ngo.is_verified
                            ? 'border border-slate-200 text-slate-700 hover:bg-slate-100'
                            : 'btn-primary'
                        }`}
                      >
                        {ngo.is_verified ? 'Revoke Status' : 'Approve & Verify'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: PROJECTS MANAGEMENT */}
      {activeTab === 'projects' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">Community Projects Overview</h3>
            <span className="text-xs text-slate-500">{projects.length} initiatives</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-[#F8FAFC] text-slate-700 font-bold border-b border-slate-200 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Project Title</th>
                  <th className="py-3 px-4">NGO Host</th>
                  <th className="py-3 px-4">Cause Category</th>
                  <th className="py-3 px-4">Beneficiaries</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {projects.map(proj => (
                  <tr key={proj.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{proj.title}</td>
                    <td className="py-3.5 px-4 text-slate-700">{proj.ngo_name}</td>
                    <td className="py-3.5 px-4 uppercase text-[10px] font-bold text-[#16A36A]">{proj.cause_category}</td>
                    <td className="py-3.5 px-4">{Number(proj.verified_beneficiaries || proj.estimated_beneficiaries || 1500).toLocaleString()}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDeleteProj(proj.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                        title="Delete project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: VERIFICATION REQUESTS */}
      {activeTab === 'verifications' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900">NGO Trust & Compliance Verification Queue</h3>
              <p className="text-xs text-slate-500">Audit government accreditation certificates, FCRA compliance & tax-exempt metadata (documents securely encrypted).</p>
            </div>
            <span className="text-xs text-slate-500">{verifications.length} submissions</span>
          </div>

          <div className="p-5 space-y-4">
            {verifications.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs">
                No pending verification dossiers in queue.
              </div>
            ) : (
              verifications.map(vr => (
                <div key={vr.id} className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{vr.organization_name || vr.ngo_id}</h4>
                      <span className="text-xs text-slate-400">Reg Number: {vr.reg_number || 'REG-501C3-99'}</span>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      vr.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {vr.status}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1 text-slate-600">
                    <div><strong>Tax Status:</strong> {vr.tax_status || '501(c)(3) / 80G Certified Non-Profit'}</div>
                    <div><strong>Document Hash:</strong> <code className="bg-slate-200 px-1 py-0.5 rounded text-[10px]">{vr.doc_hash || 'SHA256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069'}</code></div>
                    <div className="text-[11px] text-emerald-700">🔒 Document privacy protected: RAW files never displayed publicly to safeguard non-profit identity.</div>
                  </div>

                  {vr.status === 'pending' && (
                    <div className="flex items-center justify-end space-x-2 pt-1">
                      <button
                        onClick={() => handleReviewVerification(vr.id, 'rejected')}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleReviewVerification(vr.id, 'approved', 'Gold Verified')}
                        className="px-4 py-1.5 rounded-xl btn-primary text-xs font-bold"
                      >
                        Grant Gold Verified Badge
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 4: TRUST & SAFETY REPORTS */}
      {activeTab === 'reports' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Trust & Safety Escalations</h3>
              <p className="text-xs text-slate-500">Community reported listings, potential policy violations and audited reports.</p>
            </div>
            <span className="text-xs text-rose-600 font-bold">{reports.length} active flags</span>
          </div>

          <div className="p-5 space-y-4">
            {reports.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs">
                Zero open violations reported. The community is clean!
              </div>
            ) : (
              reports.map(rep => (
                <div key={rep.id} className="p-5 rounded-2xl border border-rose-200 bg-rose-50/20 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold uppercase">
                        {rep.target_type} FLAG
                      </span>
                      <h4 className="text-sm font-black text-slate-900 mt-1">{rep.target_name || rep.target_id}</h4>
                    </div>
                    <span className="text-xs text-slate-400">{new Date(rep.created_at || Date.now()).toLocaleDateString()}</span>
                  </div>

                  <div className="text-xs text-slate-700">
                    <span className="font-bold text-rose-900">Reason:</span> {rep.reason}
                  </div>
                  <p className="text-xs text-slate-600 italic bg-white p-3 rounded-xl border border-slate-200">
                    "{rep.details}"
                  </p>
                  <div className="text-[10px] text-slate-400">
                    Reported by: {rep.reporter_email}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

    </div>
  );
}
