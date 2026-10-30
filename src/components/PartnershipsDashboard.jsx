import React, { useState, useEffect } from 'react';
import { 
  Handshake, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Mail, 
  Phone, 
  Building2, 
  Users, 
  IndianRupee, 
  Briefcase, 
  Package, 
  MessageSquare, 
  Search,
  Filter,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { fetchPartnershipRequests, updatePartnershipStatus } from '../utils/api';
import confetti from 'canvas-confetti';

export default function PartnershipsDashboard({ currentPersona }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [responseModal, setResponseModal] = useState(null); // { id, action: 'accepted' | 'declined' }
  const [responseText, setResponseText] = useState('');
  const [updating, setUpdating] = useState(false);

  const isNgoPersona = currentPersona.type === 'ngo';

  const loadRequests = async () => {
    setLoading(true);
    try {
      const data = await fetchPartnershipRequests({});
      setRequests(data);
    } catch (err) {
      console.error('Error loading partnership requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleUpdateStatus = async (requestId, status, note) => {
    setUpdating(true);
    try {
      await updatePartnershipStatus(requestId, status, note);
      if (status === 'accepted') {
        try {
          confetti({
            particleCount: 60,
            spread: 60,
            origin: { y: 0.7 }
          });
        } catch {}
      }
      setResponseModal(null);
      setResponseText('');
      await loadRequests();
    } catch (err) {
      alert('Error updating status: ' + err.message);
    } finally {
      setUpdating(false);
    }
  };

  const filteredRequests = requests.filter(req => {
    if (statusFilter !== 'all' && req.status !== statusFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        (req.project_title && req.project_title.toLowerCase().includes(q)) ||
        (req.supporter_name && req.supporter_name.toLowerCase().includes(q)) ||
        (req.organization_name && req.organization_name.toLowerCase().includes(q)) ||
        (req.offer_value && req.offer_value.toLowerCase().includes(q)) ||
        (req.ngo_name && req.ngo_name.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'accepted':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Partnership Formed (Accepted)</span>
          </span>
        );
      case 'declined':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center space-x-1">
            <XCircle className="w-3.5 h-3.5 text-rose-400" />
            <span>Declined</span>
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Pending NGO Review</span>
          </span>
        );
    }
  };

  const getOfferIcon = (type) => {
    switch (type) {
      case 'funding': return <IndianRupee className="w-4 h-4 text-amber-400" />;
      case 'volunteering': return <Users className="w-4 h-4 text-emerald-400" />;
      case 'resource_donation': return <Package className="w-4 h-4 text-sky-400" />;
      case 'skill_pro_bono': return <Briefcase className="w-4 h-4 text-purple-400" />;
      case 'csr_sponsorship': return <Building2 className="w-4 h-4 text-rose-400" />;
      default: return <Handshake className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
            <Handshake className="w-3.5 h-3.5" />
            <span>Stakeholder Collaboration Desk</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Partnership Proposals & Requests</h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Track, review, and initiate meaningful partnerships between community NGOs and supporters.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={loadRequests}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row gap-3 items-center justify-between">
        
        {/* Status Filter Buttons */}
        <div className="flex items-center space-x-2 text-xs w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All Requests' },
            { id: 'pending', label: 'Pending Review' },
            { id: 'accepted', label: 'Accepted / Connected' },
            { id: 'declined', label: 'Declined' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition ${
                statusFilter === tab.id
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by project, donor, NGO..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* List of Requests */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-sm">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto text-emerald-400 mb-2" />
          Loading partnership requests...
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-slate-900/60 border border-slate-800 text-slate-400">
          <Handshake className="w-10 h-10 mx-auto text-slate-600 mb-3" />
          <h4 className="text-base font-bold text-white mb-1">No Partnership Requests Found</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search query or status filter.' 
              : 'Explore community projects and submit your first partnership offer!'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map(req => (
            <div 
              key={req.id} 
              className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition shadow-lg space-y-4"
            >
              {/* Header row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-emerald-400">Project Initiative:</span>
                    <span className="text-sm font-extrabold text-white">{req.project_title}</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    NGO: <strong className="text-slate-200">{req.ngo_name}</strong>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {getStatusBadge(req.status)}
                  <span className="text-[11px] text-slate-400">
                    {new Date(req.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Supporter details & Offer Card */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                
                {/* Left: Supporter Profile */}
                <div className="md:col-span-4 p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1.5 text-xs">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Supporter / Partner</div>
                  <div className="font-bold text-white text-sm flex items-center space-x-1.5">
                    <span>{req.supporter_name}</span>
                  </div>
                  {req.organization_name && (
                    <div className="text-emerald-400 text-xs font-medium">{req.organization_name}</div>
                  )}
                  <div className="text-slate-400 capitalize">Role: {req.supporter_type.replace('_', ' ')}</div>

                  {/* Direct Contact info (unlocked for all or upon accept) */}
                  <div className="pt-2 border-t border-slate-700/60 space-y-1">
                    <div className="flex items-center space-x-1.5 text-slate-300">
                      <Mail className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span className="truncate">{req.supporter_email}</span>
                    </div>
                    {req.supporter_phone && (
                      <div className="flex items-center space-x-1.5 text-slate-300">
                        <Phone className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span>{req.supporter_phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Proposal Offer & Message */}
                <div className="md:col-span-8 space-y-3">
                  <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div className="p-2 rounded-lg bg-slate-700">
                        {getOfferIcon(req.offer_type)}
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Pledged Contribution ({req.offer_type.replace('_', ' ')})
                        </div>
                        <div className="text-base font-extrabold text-white">{req.offer_value || 'Direct Collaboration'}</div>
                      </div>
                    </div>

                    {req.timeline && (
                      <div className="text-right">
                        <div className="text-[10px] text-slate-400">Timeline</div>
                        <div className="text-xs font-semibold text-slate-200">{req.timeline}</div>
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="text-xs font-bold text-slate-400 mb-1 flex items-center space-x-1">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Collaboration Proposal Message:</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-200 bg-slate-950/40 p-3 rounded-xl border border-slate-800 leading-relaxed">
                      "{req.message}"
                    </p>
                  </div>

                  {/* NGO Response note (if any) */}
                  {req.ngo_response_note && (
                    <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-xs">
                      <div className="font-bold text-emerald-400">Note from NGO Leadership:</div>
                      <p className="text-slate-200 mt-0.5">{req.ngo_response_note}</p>
                    </div>
                  )}

                  {/* Action Buttons for NGO (or demonstration) */}
                  {req.status === 'pending' && (
                    <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
                      <button
                        onClick={() => {
                          setResponseModal({ id: req.id, action: 'declined', title: req.project_title });
                          setResponseText('Thank you for your generous proposal. At this moment our team is focusing on another area, but we will keep your contact on file.');
                        }}
                        className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-300 border border-slate-700 text-xs font-semibold transition"
                      >
                        Decline
                      </button>

                      <button
                        onClick={() => {
                          setResponseModal({ id: req.id, action: 'accepted', title: req.project_title });
                          setResponseText(`We are thrilled to accept your partnership offer! Our team will reach out directly to your email to schedule a kickoff alignment call.`);
                        }}
                        className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-emerald-600/30 transition"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Accept & Connect</span>
                      </button>
                    </div>
                  )}

                </div>

              </div>
            </div>
          ))}
        </div>
      )}

      {/* Accept / Decline Response Modal */}
      {responseModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4">
            <h4 className="text-base font-bold text-white">
              {responseModal.action === 'accepted' ? 'Accept Partnership Proposal' : 'Decline Partnership Request'}
            </h4>
            <p className="text-xs text-slate-300">
              Provide an official response note that will be dispatched to the supporter:
            </p>

            <textarea
              rows={3}
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setResponseModal(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>

              <button
                disabled={updating}
                onClick={() => handleUpdateStatus(responseModal.id, responseModal.action, responseText)}
                className={`px-4 py-1.5 rounded-lg text-white text-xs font-bold transition ${
                  responseModal.action === 'accepted' 
                    ? 'bg-emerald-600 hover:bg-emerald-500' 
                    : 'bg-rose-600 hover:bg-rose-500'
                }`}
              >
                {updating ? 'Updating...' : `Confirm ${responseModal.action === 'accepted' ? 'Acceptance' : 'Decline'}`}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
