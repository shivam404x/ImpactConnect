import React, { useState, useEffect } from 'react';
import { 
  Target, 
  X, 
  CheckCircle2, 
  DollarSign, 
  Clock, 
  ShieldCheck, 
  AlertCircle, 
  RefreshCw,
  FileCheck
} from 'lucide-react';
import { fetchMilestoneSponsorships, pledgeMilestoneSponsorship, confirmMilestoneSponsorship } from '../utils/api';

export default function MilestoneSponsorshipModal({
  isOpen,
  currentUser,
  project,
  onClose
}) {
  const [sponsorships, setSponsorships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pledgeTargetMilestone, setPledgeTargetMilestone] = useState(null);
  const [pledgeAmount, setPledgeAmount] = useState(25000);
  const [sponsorName, setSponsorName] = useState(currentUser?.name || 'Apex Technologies CSR');
  const [sponsorEmail, setSponsorEmail] = useState(currentUser?.email || 'marcus.chen@apextech.com');
  const [pledgeNotes, setPledgeNotes] = useState('');
  const [submittingPledge, setSubmittingPledge] = useState(false);

  const loadSponsorships = async () => {
    setLoading(true);
    try {
      const data = await fetchMilestoneSponsorships(project?.id || 'proj-1');
      setSponsorships(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) loadSponsorships();
  }, [isOpen, project]);

  if (!isOpen) return null;

  const handlePledgeSubmit = async (e) => {
    e.preventDefault();
    if (!pledgeTargetMilestone) return;
    setSubmittingPledge(true);
    try {
      await pledgeMilestoneSponsorship(pledgeTargetMilestone.id, {
        project_id: project?.id || 'proj-1',
        milestone_title: pledgeTargetMilestone.title,
        target_amount: pledgeTargetMilestone.target_amount,
        pledged_amount: Number(pledgeAmount),
        sponsor_name: sponsorName,
        sponsor_email: sponsorEmail,
        notes: pledgeNotes
      });
      setPledgeTargetMilestone(null);
      loadSponsorships();
    } catch (err) {
      alert(err.message || 'Failed to submit milestone sponsorship');
    } finally {
      setSubmittingPledge(false);
    }
  };

  const handleConfirmSponsorship = async (sponId) => {
    try {
      await confirmMilestoneSponsorship(sponId, {
        confirmedAmount: 50000,
        receiptId: `REC-${Date.now().toString().slice(-4)}`,
        reviewerName: currentUser?.name || 'Authorized Project Auditor'
      });
      loadSponsorships();
    } catch (err) {
      alert(err.message || 'Failed to confirm sponsorship');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden relative">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#16A36A] border border-emerald-200 flex items-center justify-center font-bold shadow-xs">
              <Target className="w-5 h-5 text-[#16A36A]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                Milestone-Based Sponsorships
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Fund specific on-ground project phases with audited milestone evidence.
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200/80 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 bg-slate-50/50">
          
          <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-slate-900">Project: {project?.title || 'Community Initiative'}</span>
              <span className="text-slate-500 block text-[11px] mt-0.5">Sponsors disburse funds in verified tranches.</span>
            </div>
            <button
              onClick={() => setPledgeTargetMilestone({ id: `ms-${Date.now()}`, title: 'Phase Construction & Field Deploy', target_amount: 50000 })}
              className="px-3.5 py-1.5 rounded-xl btn-primary text-xs font-bold shadow-xs"
            >
              + Sponsor a Milestone
            </button>
          </div>

          {loading ? (
            <div className="py-16 text-center">
              <RefreshCw className="w-8 h-8 animate-spin text-[#16A36A] mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-500">Loading Milestone Sponsorships...</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sponsorships.map(s => (
                <div key={s.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-black text-slate-900">{s.milestone_title}</h4>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          s.status === 'confirmed' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}>
                          {s.status}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        Sponsor: <strong className="text-slate-800">{s.sponsor_name}</strong>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-base font-black text-[#16A36A]">
                        ₹{s.pledged_amount?.toLocaleString()}
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {s.receipt_id}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Confirmed Tranche</span>
                      <strong className="text-slate-900">₹{s.confirmed_amount?.toLocaleString()}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Reviewer Status</span>
                      <strong className="text-slate-900">{s.reviewed_by}</strong>
                    </div>
                  </div>

                  {s.status !== 'confirmed' && currentUser?.role === 'ngo' && (
                    <button
                      type="button"
                      onClick={() => handleConfirmSponsorship(s.id)}
                      className="w-full py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#16A36A] font-bold text-xs border border-emerald-200 transition"
                    >
                      Acknowledge Payment & Complete Milestone Audit
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

        </div>

      </div>

      {/* PLEDGE FORM MODAL */}
      {pledgeTargetMilestone && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-black text-slate-900">
              Sponsor Milestone: {pledgeTargetMilestone.title}
            </h3>

            <form onSubmit={handlePledgeSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Sponsorship Amount (₹)</label>
                <input
                  type="number"
                  min="5000"
                  step="5000"
                  required
                  value={pledgeAmount}
                  onChange={(e) => setPledgeAmount(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Sponsor Organization</label>
                <input
                  type="text"
                  required
                  value={sponsorName}
                  onChange={(e) => setSponsorName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={sponsorEmail}
                  onChange={(e) => setSponsorEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPledgeTargetMilestone(null)}
                  className="flex-1 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingPledge}
                  className="flex-1 py-2 rounded-xl btn-primary text-xs font-bold"
                >
                  {submittingPledge ? 'Recording...' : 'Commit Sponsorship'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
