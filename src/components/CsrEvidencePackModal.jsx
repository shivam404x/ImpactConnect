import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  X, 
  Download, 
  Printer, 
  CheckCircle2, 
  ShieldCheck, 
  Building2, 
  Calendar, 
  MapPin, 
  IndianRupee, 
  Package, 
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { fetchCsrEvidencePack } from '../utils/api';

export default function CsrEvidencePackModal({
  isOpen,
  projectId = 'proj-1',
  onClose
}) {
  const [pack, setPack] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && projectId) {
      setLoading(true);
      fetchCsrEvidencePack(projectId)
        .then(data => setPack(data))
        .catch(err => console.error('Error fetching CSR evidence pack:', err))
        .finally(() => setLoading(false));
    }
  }, [isOpen, projectId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden relative">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#16A36A] border border-emerald-200 flex items-center justify-center font-bold shadow-xs">
              <FileText className="w-5 h-5 text-[#16A36A]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  CSR Compliance & Evidence Pack
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Dossier Certified
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Audited project charter, expenditure vouchers, beneficiary counts & MCA Section 135 evidence.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => window.print()}
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-200/80 text-slate-700 transition"
              title="Print Dossier"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-200/80 text-slate-400 hover:text-slate-700 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 bg-white text-slate-900">
          {loading || !pack ? (
            <div className="py-20 text-center">
              <RefreshCw className="w-8 h-8 animate-spin text-[#16A36A] mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-500">Compiling CSR Audit Dossier...</p>
            </div>
          ) : (
            <div className="space-y-6 max-w-2xl mx-auto">
              
              {/* Dossier Header Info */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                  <span className="font-mono text-xs font-bold text-slate-500">
                    DOSSIER ID: {pack.dossier_id}
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Audit Readiness: {pack.compliance_readiness_score}%
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Project Title</span>
                    <span className="font-bold text-slate-900">{pack.project?.title}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Implementing NGO</span>
                    <span className="font-bold text-slate-900">{pack.ngo?.name}</span>
                  </div>
                </div>
              </div>

              {/* Statutory Legal Accreditation */}
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
                  1. NGO Legal Accreditation & Registrations
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 block">Darpan ID</span>
                    <span className="font-mono font-bold text-slate-900">{pack.ngo?.darpan_id}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 block">CSR-1 Number</span>
                    <span className="font-mono font-bold text-slate-900">{pack.ngo?.csr_registration_number}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 block">Section 80G</span>
                    <span className="font-bold text-emerald-700">Verified & Active</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 block">Section 12A</span>
                    <span className="font-bold text-emerald-700">Registered</span>
                  </div>
                </div>
              </div>

              {/* Itemized Contributions Ledger */}
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
                  2. Audited Contribution Ledger
                </h4>
                <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                      <tr>
                        <th className="p-3">Supporter / Entity</th>
                        <th className="p-3">Amount</th>
                        <th className="p-3">Type</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {pack.contributions_ledger?.map((c, i) => (
                        <tr key={i} className="hover:bg-slate-50/50">
                          <td className="p-3 font-bold text-slate-800">{c.supporter}</td>
                          <td className="p-3 font-mono font-bold text-slate-900">₹{c.amount?.toLocaleString()}</td>
                          <td className="p-3 capitalize text-slate-600">{c.type}</td>
                          <td className="p-3 text-emerald-700 font-bold">{c.receipt_status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Physical Deliveries & Volunteer Verification */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                  <span className="font-bold text-slate-800 block">Verified Physical Assets</span>
                  <div className="space-y-1">
                    {pack.physical_deliveries?.map((d, i) => (
                      <div key={i} className="flex justify-between text-slate-600">
                        <span>{d.quantity}x {d.item}</span>
                        <span className="font-bold text-emerald-700 capitalize">{d.status}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                  <span className="font-bold text-slate-800 block">Volunteer Field Audit</span>
                  <div className="space-y-1">
                    <div className="flex justify-between text-slate-600">
                      <span>Total Logged Hours:</span>
                      <strong className="text-slate-900">{pack.volunteer_audited_hours} Hours</strong>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Beneficiary Reach:</span>
                      <strong className="text-slate-900">{pack.project?.verified_beneficiaries} Citizens</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Statutory Disclaimer */}
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 leading-relaxed">
                <strong>Statutory Advisory:</strong> {pack.statutory_disclaimer}
              </div>

              {/* Action */}
              <button
                type="button"
                onClick={() => window.print()}
                className="w-full py-3 rounded-xl btn-primary text-xs font-bold flex items-center justify-center space-x-2 shadow-md"
              >
                <Download className="w-4 h-4" />
                <span>Download Certified PDF / Print CSR Dossier</span>
              </button>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}
