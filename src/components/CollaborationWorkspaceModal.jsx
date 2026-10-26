import React, { useState, useEffect } from 'react';
import { 
  X, 
  Send, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  MessageSquare, 
  FileCheck2, 
  ShieldCheck, 
  Building2, 
  User, 
  AlertCircle,
  Download,
  Share2,
  Award,
  Star,
  Printer
} from 'lucide-react';
import { 
  fetchPartnershipMessages, 
  sendPartnershipMessage, 
  fetchProjectMilestones, 
  updateMilestone, 
  updatePartnershipStatus,
  fetchPartnershipReviews
} from '../utils/api';

export default function CollaborationWorkspaceModal({
  partnership,
  currentUser,
  onClose,
  onStatusChanged,
  onOpenImpactReport,
  onOpenReview,
  onOpenAgreement
}) {
  const [activeTab, setActiveTab] = useState('milestones'); // 'milestones' | 'chat' | 'overview' | 'reviews'
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [milestones, setMilestones] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);

  if (!partnership) return null;

  const loadData = async () => {
    try {
      setLoading(true);
      const [msgs, msList, revList] = await Promise.all([
        fetchPartnershipMessages(partnership.id).catch(() => []),
        fetchProjectMilestones(partnership.project_id).catch(() => []),
        fetchPartnershipReviews({ partnership_id: partnership.id }).catch(() => [])
      ]);
      setMessages(msgs);
      setMilestones(msList);
      setReviews(revList);
    } catch (err) {
      console.error('Error loading workspace data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [partnership.id]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setSending(true);
    try {
      const msg = await sendPartnershipMessage(partnership.id, {
        sender_name: currentUser?.name || 'Authorized Collaborator',
        sender_role: currentUser?.role || 'supporter',
        message_text: newMessage.trim()
      });
      setMessages(prev => [...prev, msg]);
      setNewMessage('');
    } catch (err) {
      alert('Failed to send message: ' + err.message);
    } finally {
      setSending(false);
    }
  };

  const handleToggleMilestone = async (ms) => {
    const nextCompleted = !ms.is_completed;
    try {
      const updated = await updateMilestone(ms.id, {
        is_completed: nextCompleted
      });
      setMilestones(prev => prev.map(item => item.id === ms.id ? { ...item, is_completed: nextCompleted } : item));
    } catch (err) {
      alert('Error updating milestone: ' + err.message);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    if (!window.confirm(`Are you sure you want to mark this collaboration as ${newStatus}?`)) return;
    try {
      await updatePartnershipStatus(partnership.id, newStatus, `Status updated by ${currentUser?.name || 'authorized user'}`);
      if (onStatusChanged) onStatusChanged();
      onClose();
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    }
  };

  const completedCount = milestones.filter(m => m.is_completed).length;
  const progressPercent = milestones.length > 0 ? Math.round((completedCount / milestones.length) * 100) : 50;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden relative">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-[#16A36A] border border-emerald-200 flex items-center justify-center">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {(partnership?.status || 'active').toUpperCase()} COLLABORATION
                </span>
                <span className="text-xs text-slate-400">• ID: {partnership.id}</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                {partnership.project_title}
              </h2>
              <p className="text-xs text-slate-500">
                Partner: <span className="font-bold text-slate-700">{partnership.supporter_name}</span> ({partnership.offer_type?.replace(/_/g, ' ')})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200/80 text-slate-400 hover:text-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 px-6 bg-white overflow-x-auto">
          <button
            onClick={() => setActiveTab('milestones')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center space-x-2 whitespace-nowrap transition ${
              activeTab === 'milestones'
                ? 'border-[#16A36A] text-[#16A36A]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Milestones & Tasks ({completedCount}/{milestones.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center space-x-2 whitespace-nowrap transition ${
              activeTab === 'chat'
                ? 'border-[#16A36A] text-[#16A36A]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Encrypted In-App Chat ({messages.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center space-x-2 whitespace-nowrap transition ${
              activeTab === 'reviews'
                ? 'border-[#16A36A] text-[#16A36A]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span>Reviews & Trust ({reviews.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center space-x-2 whitespace-nowrap transition ${
              activeTab === 'overview'
                ? 'border-[#16A36A] text-[#16A36A]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Agreement & Controls</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          
          {/* TAB 1: MILESTONES & TASKS */}
          {activeTab === 'milestones' && (
            <div className="space-y-6 max-w-2xl mx-auto">
              {/* Progress Summary Card */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700">Project Milestone Completion</span>
                  <span className="text-sm font-black text-[#16A36A]">{progressPercent}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-[#16A36A] h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  Transparent deliverable verification protects all stakeholders and unlocks certified impact reports.
                </p>
              </div>

              {/* Milestones list */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Trackable Field Milestones
                </h3>

                {milestones.length === 0 ? (
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
                    No explicit milestones registered yet for this project. Initial baseline survey created.
                  </div>
                ) : (
                  milestones.map((ms, idx) => (
                    <div
                      key={ms.id || idx}
                      className={`p-4 rounded-2xl border transition bg-white ${
                        ms.is_completed ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start space-x-3">
                          <input
                            type="checkbox"
                            checked={!!ms.is_completed}
                            onChange={() => handleToggleMilestone(ms)}
                            className="w-5 h-5 rounded text-[#16A36A] focus:ring-[#16A36A] mt-0.5 cursor-pointer"
                          />
                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className={`text-sm font-bold ${ms.is_completed ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                                {ms.title}
                              </h4>
                              {ms.verified_by_reviewer && (
                                <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200">
                                  <ShieldCheck className="w-3 h-3" />
                                  <span>Reviewer Verified</span>
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-600 mt-1">{ms.description}</p>
                            
                            {ms.evidence_photo && (
                              <div className="mt-3">
                                <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Field Evidence:</span>
                                <img
                                  src={ms.evidence_photo}
                                  alt="Milestone Evidence"
                                  className="w-36 h-24 object-cover rounded-xl border border-slate-200 shadow-sm"
                                />
                              </div>
                            )}

                            <div className="flex items-center space-x-4 mt-2 text-[11px] text-slate-400">
                              <span className="flex items-center space-x-1">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>Target: {ms.target_date || 'Upcoming Q1'}</span>
                              </span>
                              {ms.completed_at && (
                                <span className="text-emerald-700 font-semibold">
                                  Completed {new Date(ms.completed_at).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 2: IN-APP ENCRYPTED CHAT */}
          {activeTab === 'chat' && (
            <div className="flex flex-col h-full max-w-2xl mx-auto bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="p-3 bg-slate-50 border-b border-slate-200 text-center text-[11px] text-slate-500 font-semibold">
                🔒 Direct channel between {partnership.ngo_name || 'NGO'} and {partnership.supporter_name}
              </div>

              {/* Message List */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 min-h-[300px]">
                {messages.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 text-xs">
                    No messages exchanged yet. Say hello and coordinate delivery schedules or kickoff meetings!
                  </div>
                ) : (
                  messages.map((m, idx) => {
                    const isMe = currentUser && m.sender_name === currentUser.name;
                    return (
                      <div
                        key={m.id || idx}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                      >
                        <div className="flex items-center space-x-1 text-[10px] text-slate-400 mb-1 px-1">
                          <span className="font-bold text-slate-600">{m.sender_name}</span>
                          <span>•</span>
                          <span>{new Date(m.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div
                          className={`max-w-md px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                            isMe
                              ? 'bg-[#16A36A] text-white rounded-br-none shadow-sm'
                              : 'bg-slate-100 text-slate-800 rounded-bl-none'
                          }`}
                        >
                          {m.message_text}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Input Bar */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 flex items-center space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type an operational update or question..."
                  className="flex-1 px-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                />
                <button
                  type="submit"
                  disabled={sending || !newMessage.trim()}
                  className="px-4 py-2 rounded-xl bg-[#16A36A] hover:bg-emerald-700 text-white font-bold text-xs flex items-center space-x-1 transition disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: REVIEWS & TRUST */}
          {activeTab === 'reviews' && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                    <Award className="w-5 h-5 text-amber-500" />
                    <span>Collaboration Trust & Feedback</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Authentic performance evaluations from completed milestones and field collaboration.
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {onOpenReview && (
                    <button
                      onClick={() => onOpenReview(partnership)}
                      className="px-4 py-2 rounded-xl bg-[#16A36A] hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition flex items-center space-x-1.5"
                    >
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>Submit Review</span>
                    </button>
                  )}
                  {onOpenImpactReport && (
                    <button
                      onClick={() => onOpenImpactReport({
                        id: partnership.project_id,
                        title: partnership.project_title,
                        ngo_name: partnership.ngo_name || 'Impact Organization',
                        cause: partnership.offer_type || 'Community Impact',
                        location: 'Field Site',
                        description: partnership.message,
                        funding_goal: 500000,
                        funding_received: 420000,
                        volunteers_needed: 20,
                        volunteers_registered: 18,
                        milestones: milestones
                      })}
                      className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition flex items-center space-x-1.5"
                    >
                      <Printer className="w-3.5 h-3.5 text-slate-500" />
                      <span>Impact PDF</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Reviews List */}
              <div className="space-y-3">
                {reviews.length === 0 ? (
                  <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-3 shadow-sm">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto">
                      <Star className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">No Performance Reviews Yet</h4>
                      <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                        Completed milestones and transparent communications can be rated to build an auditable public trust score.
                      </p>
                    </div>
                    {onOpenReview && (
                      <button
                        onClick={() => onOpenReview(partnership)}
                        className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition"
                      >
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span>Be the First to Leave Feedback</span>
                      </button>
                    )}
                  </div>
                ) : (
                  reviews.map((rev, idx) => (
                    <div key={rev.id || idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-xs text-slate-900">{rev.reviewer_name}</span>
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                              {rev.reviewer_role}
                            </span>
                            <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                              <ShieldCheck className="w-3 h-3" />
                              <span>Verified Collaboration</span>
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400">
                            {new Date(rev.created_at || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                          </span>
                        </div>

                        {/* Star Rating */}
                        <div className="flex items-center space-x-1 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200">
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                          <span className="text-xs font-black text-amber-800">{rev.rating}.0</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-700 leading-relaxed italic bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                        "{rev.review_text}"
                      </p>

                      {/* Criteria breakdown */}
                      <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100 text-[11px] text-slate-500">
                        <div className="flex items-center justify-between">
                          <span>Communication:</span>
                          <span className="font-bold text-slate-700">{rev.communication_rating || rev.rating}/5</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Timeliness:</span>
                          <span className="font-bold text-slate-700">{rev.timeliness_rating || rev.rating}/5</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Milestone Quality:</span>
                          <span className="font-bold text-slate-700">{rev.milestone_quality_rating || rev.rating}/5</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 4: PARTNERSHIP OVERVIEW & ACTIONS */}
          {activeTab === 'overview' && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Partnership Parameters & Commitments
                </h3>
                
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Offer Type</span>
                    <span className="font-bold text-slate-800 capitalize">{partnership.offer_type?.replace(/_/g, ' ')}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Offer Value / Scope</span>
                    <span className="font-bold text-[#16A36A]">{partnership.offer_value || 'Specified in message'}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">Proposal Pitch</span>
                  <p className="text-slate-700 italic">"{partnership.message}"</p>
                </div>

                {partnership.ngo_response_note && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                    <span className="text-emerald-800 block text-[10px] uppercase font-bold mb-1">NGO Response Note</span>
                    <p className="text-emerald-900">{partnership.ngo_response_note}</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Lifecycle Controls
                </h3>
                <div className="flex flex-wrap gap-3">
                  {onOpenAgreement && (
                    <button
                      onClick={() => onOpenAgreement(partnership)}
                      className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#16A36A] hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition"
                    >
                      <FileCheck2 className="w-3.5 h-3.5" />
                      <span>Review / Sign Agreement Draft</span>
                    </button>
                  )}

                  {onOpenReview && (
                    <button
                      onClick={() => onOpenReview(partnership)}
                      className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-sm transition"
                    >
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>Submit Performance Review</span>
                    </button>
                  )}

                  {onOpenImpactReport && (
                    <button
                      onClick={() => onOpenImpactReport({
                        id: partnership.project_id,
                        title: partnership.project_title,
                        ngo_name: partnership.ngo_name || 'Impact Organization',
                        cause: partnership.offer_type || 'Community Impact',
                        location: 'Field Site',
                        description: partnership.message,
                        funding_goal: 500000,
                        funding_received: 420000,
                        volunteers_needed: 20,
                        volunteers_registered: 18,
                        milestones: milestones
                      })}
                      className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold shadow-sm transition"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Download Impact Report (PDF)</span>
                    </button>
                  )}

                  <button
                    onClick={() => window.print()}
                    className="flex items-center space-x-2 px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-500" />
                    <span>Print Partnership Agreement</span>
                  </button>

                  <button
                    onClick={() => handleUpdateStatus('completed')}
                    className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Mark Collaboration Completed</span>
                  </button>

                  <button
                    onClick={() => handleUpdateStatus('declined')}
                    className="flex items-center space-x-2 px-4 py-2 rounded-xl border border-rose-200 text-xs font-bold text-rose-600 hover:bg-rose-50 transition"
                  >
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Withdraw Collaboration</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
