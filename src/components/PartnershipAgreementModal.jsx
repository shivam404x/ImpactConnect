import React, { useState, useEffect } from 'react';
import { 
  FileCheck2, 
  X, 
  Printer, 
  Building2, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  Edit3, 
  Save, 
  ShieldCheck, 
  Award, 
  HeartHandshake,
  Clock
} from 'lucide-react';
import { 
  fetchPartnershipAgreement, 
  savePartnershipAgreement, 
  acknowledgePartnershipAgreement 
} from '../utils/api';
import Logo from './Logo';
import { translations } from '../data/translations';

export default function PartnershipAgreementModal({
  isOpen,
  partnership,
  currentUser,
  onClose,
  onSuccess,
  language = 'en'
}) {
  const t = translations[language] || translations.en;

  const [agreement, setAgreement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    agreement_title: '',
    scope_summary: '',
    ngo_responsibilities: '',
    partner_responsibilities: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && partnership) {
      loadAgreement();
    }
  }, [isOpen, partnership]);

  const loadAgreement = async () => {
    setLoading(true);
    try {
      const data = await fetchPartnershipAgreement(partnership.id);
      setAgreement(data);
      setFormData({
        agreement_title: data.agreement_title,
        scope_summary: data.scope_summary,
        ngo_responsibilities: data.ngo_responsibilities,
        partner_responsibilities: data.partner_responsibilities
      });
    } catch (err) {
      console.error('Error loading agreement:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !partnership) return null;

  const handleSaveEdits = async () => {
    setSubmitting(true);
    try {
      const updated = await savePartnershipAgreement({
        id: agreement.id,
        partnership_id: partnership.id,
        project_id: partnership.project_id,
        ngo_id: partnership.ngo_id,
        ngo_name: agreement.ngo_name,
        supporter_name: agreement.supporter_name,
        ...formData
      });
      setAgreement(updated);
      setIsEditing(false);
    } catch (err) {
      alert('Failed to save agreement draft: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAcknowledge = async () => {
    const role = currentUser?.role === 'ngo' ? 'ngo' : 'partner';
    const actorName = currentUser?.name || (role === 'ngo' ? agreement.ngo_name : agreement.supporter_name);
    setSubmitting(true);
    try {
      const res = await acknowledgePartnershipAgreement(agreement.id, role, actorName);
      setAgreement(res);
      alert('Partnership agreement draft digitally acknowledged!');
      if (onSuccess) onSuccess();
    } catch (err) {
      alert('Error acknowledging agreement: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const isNgo = currentUser?.role === 'ngo';
  const hasMyRoleSigned = isNgo ? !!agreement?.ngo_acknowledged_at : !!agreement?.partner_acknowledged_at;
  const isBothSigned = agreement?.status === 'both_acknowledged';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in print:p-0 print:bg-white">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-10 shadow-2xl border border-slate-200 relative my-6 print:border-none print:shadow-none print:p-0">
        
        {/* Controls Bar (Hidden in Print) */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-200 print:hidden">
          <div className="flex items-center space-x-3">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              isBothSigned ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
            }`}>
              {isBothSigned ? 'Both Parties Ratified' : 'Draft Collaboration Framework'}
            </span>
            <span className="text-xs text-slate-400">• Doc ID: {agreement?.id || 'AGR-2026-DRAFT'}</span>
          </div>

          <div className="flex items-center space-x-2">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center space-x-1"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Terms</span>
              </button>
            ) : (
              <button
                onClick={handleSaveEdits}
                disabled={submitting}
                className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold flex items-center space-x-1"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            )}

            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center space-x-1"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Agreement</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Legal Disclaimer Alert Banner */}
        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 mb-8 flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 leading-relaxed">
            <span className="font-bold block uppercase tracking-wider text-[11px] text-amber-800 mb-0.5">
              Draft Operational Collaboration Framework
            </span>
            <span>
              {t.legalDisclaimer || 'This document is an operational collaboration agreement template generated by ImpactConnect to facilitate transparent coordination between community partners. It is a working draft and does not constitute formal legal counsel.'}
            </span>
          </div>
        </div>

        {/* Printable Document Body */}
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400 animate-pulse">
            Generating structured agreement draft...
          </div>
        ) : (
          <div className="space-y-8 text-slate-800">
            
            {/* Document Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b-2 border-slate-900 pb-6 gap-4">
              <div>
                <Logo size="md" showTagline={false} />
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-3">
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.agreement_title}
                      onChange={(e) => setFormData({ ...formData, agreement_title: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-lg font-bold"
                    />
                  ) : (
                    agreement.agreement_title
                  )}
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Reference: ImpactConnect Protocol SDG-17 Collaboration Framework
                </p>
              </div>

              <div className="text-right text-xs text-slate-500 shrink-0">
                <span className="block font-bold text-slate-800">Effective Date</span>
                <span>{new Date(agreement.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            </div>

            {/* Participating Parties */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
              <div className="space-y-1">
                <span className="font-bold uppercase tracking-wider text-[10px] text-slate-400 block">Party A (Lead Community NGO)</span>
                <div className="font-black text-slate-900 text-sm">{agreement.ngo_name}</div>
                <div className="text-slate-600">Verified Section 8 Non-Profit Partner</div>
                <div className="text-[11px] text-[#16A36A] font-semibold flex items-center space-x-1 pt-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Gold Verified Organization</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="font-bold uppercase tracking-wider text-[10px] text-slate-400 block">Party B (Collaborating Partner / Supporter)</span>
                <div className="font-black text-slate-900 text-sm">{agreement.supporter_name}</div>
                <div className="text-slate-600">{agreement.supporter_organization || 'Individual Philanthropic Supporter'}</div>
                <div className="text-[11px] text-slate-500 font-semibold pt-1">
                  Offer: {partnership.offer_type?.replace(/_/g, ' ')} ({partnership.offer_value || 'Direct Contribution'})
                </div>
              </div>
            </div>

            {/* Section 1: Scope & Purpose */}
            <div className="space-y-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">
                1. Scope of Community Collaboration
              </h3>
              {isEditing ? (
                <textarea
                  rows={4}
                  value={formData.scope_summary}
                  onChange={(e) => setFormData({ ...formData, scope_summary: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs leading-relaxed"
                />
              ) : (
                <p className="text-xs text-slate-700 leading-relaxed bg-white p-4 rounded-xl border border-slate-100">
                  {agreement.scope_summary}
                </p>
              )}
            </div>

            {/* Section 2: Joint Responsibilities */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">
                  2. NGO Responsibilities & Deliverables
                </h3>
                {isEditing ? (
                  <textarea
                    rows={6}
                    value={formData.ngo_responsibilities}
                    onChange={(e) => setFormData({ ...formData, ngo_responsibilities: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs leading-relaxed"
                  />
                ) : (
                  <div className="text-xs text-slate-700 whitespace-pre-line leading-relaxed bg-white p-4 rounded-xl border border-slate-100">
                    {agreement.ngo_responsibilities}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">
                  3. Partner Responsibilities & Support
                </h3>
                {isEditing ? (
                  <textarea
                    rows={6}
                    value={formData.partner_responsibilities}
                    onChange={(e) => setFormData({ ...formData, partner_responsibilities: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs leading-relaxed"
                  />
                ) : (
                  <div className="text-xs text-slate-700 whitespace-pre-line leading-relaxed bg-white p-4 rounded-xl border border-slate-100">
                    {agreement.partner_responsibilities}
                  </div>
                )}
              </div>
            </div>

            {/* Section 3: Deliverables & Milestones */}
            {agreement.deliverables_timeline && agreement.deliverables_timeline.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">
                  4. Trackable Field Milestones & Timeline
                </h3>
                <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100 text-xs">
                  {agreement.deliverables_timeline.map((m, idx) => (
                    <div key={idx} className="p-3.5 flex items-center justify-between bg-white">
                      <div className="flex items-center space-x-2">
                        <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 font-bold text-[10px] flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="font-bold text-slate-900">{m.milestone}</span>
                      </div>
                      <div className="flex items-center space-x-4 text-slate-500">
                        <span>Target: {m.target_date}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          m.status === 'completed' || m.status === 'verified'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {m.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Signatures & Acknowledgment Block */}
            <div className="pt-6 border-t-2 border-slate-900 grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs">
              
              {/* Party A Sign */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                <span className="font-bold uppercase tracking-wider text-[10px] text-slate-400 block">Party A Ratification</span>
                <div className="h-10 border-b border-dashed border-slate-300 flex items-end pb-1 font-serif text-slate-800 italic">
                  {agreement.ngo_acknowledged_at ? agreement.ngo_name : 'Awaiting NGO Digital Sign-off'}
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Authorized NGO Signatory</span>
                  <span className="font-semibold">
                    {agreement.ngo_acknowledged_at
                      ? `Signed ${new Date(agreement.ngo_acknowledged_at).toLocaleDateString()}`
                      : 'Pending'}
                  </span>
                </div>
              </div>

              {/* Party B Sign */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                <span className="font-bold uppercase tracking-wider text-[10px] text-slate-400 block">Party B Ratification</span>
                <div className="h-10 border-b border-dashed border-slate-300 flex items-end pb-1 font-serif text-slate-800 italic">
                  {agreement.partner_acknowledged_at ? agreement.supporter_name : 'Awaiting Partner Digital Sign-off'}
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Authorized Collaborator</span>
                  <span className="font-semibold">
                    {agreement.partner_acknowledged_at
                      ? `Signed ${new Date(agreement.partner_acknowledged_at).toLocaleDateString()}`
                      : 'Pending'}
                  </span>
                </div>
              </div>

            </div>

            {/* Acknowledgment Action CTA (Hidden in Print) */}
            <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
              <div className="text-xs text-slate-500">
                {hasMyRoleSigned ? (
                  <span className="text-[#16A36A] font-bold flex items-center space-x-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Your account has digitally acknowledged this collaboration framework.</span>
                  </span>
                ) : (
                  <span>Review the draft and click acknowledge to confirm alignment.</span>
                )}
              </div>

              {!hasMyRoleSigned && (
                <button
                  onClick={handleAcknowledge}
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-[#16A36A] hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition flex items-center justify-center space-x-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{t.acknowledgeDraft || 'Digitally Acknowledge Draft'}</span>
                </button>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}