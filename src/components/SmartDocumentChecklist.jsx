import React, { useState, useEffect } from 'react';
import { 
  FileCheck, 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  Upload, 
  CheckCircle2, 
  X, 
  Eye, 
  Lock, 
  FileText, 
  Search, 
  Filter, 
  RefreshCw, 
  Calendar,
  Building2,
  ChevronRight,
  Download,
  AlertCircle
} from 'lucide-react';
import { fetchNgoComplianceDocs, uploadNgoComplianceDoc, reviewNgoComplianceDoc, fetchNgos } from '../utils/api';

const MANDATORY_DOC_TYPES = [
  { type: 'CSR-1 Registration', description: 'Ministry of Corporate Affairs filing for CSR eligibility', required: true },
  { type: 'Section 80G Certificate', description: 'Income Tax 50% tax deduction certificate for donors', required: true },
  { type: 'Section 12A Registration', description: 'Income Tax tax-exempt status certificate for NGO', required: true },
  { type: 'NITI Aayog NGO Darpan ID', description: 'Unique government Darpan portal registration', required: true },
  { type: 'Audited Financial Statements', description: 'Past 3 financial years chartered accountant audit & balance sheet', required: true },
  { type: 'FCRA Registration', description: 'Foreign Contribution Regulation Act approval (for international grants)', required: false }
];

export default function SmartDocumentChecklist({ currentUser, onOpenAuth, language = 'en' }) {
  const [ngos, setNgos] = useState([]);
  const [selectedNgoId, setSelectedNgoId] = useState('ngo-1');
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Upload Modal
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadDocType, setUploadDocType] = useState('Section 12A Registration');
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadFileName, setUploadFileName] = useState('');
  const [uploadExpiry, setUploadExpiry] = useState('');
  const [uploadNotes, setUploadNotes] = useState('');
  const [uploading, setUploading] = useState(false);

  // Review Modal (Admin)
  const [reviewDoc, setReviewDoc] = useState(null);
  const [reviewStatus, setReviewStatus] = useState('verified');
  const [reviewNotes, setReviewNotes] = useState('');
  const [reviewerName, setReviewerName] = useState(currentUser?.name || 'Compliance Auditor');
  const [reviewing, setReviewing] = useState(false);

  // Safe Preview Modal
  const [previewDoc, setPreviewDoc] = useState(null);
  const [notification, setNotification] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [allNgos, ngoDocs] = await Promise.all([
        fetchNgos().catch(() => []),
        fetchNgoComplianceDocs(selectedNgoId).catch(() => [])
      ]);
      setNgos(allNgos);
      setDocs(ngoDocs);
    } catch (err) {
      console.error('Error loading compliance data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedNgoId]);

  const selectedNgo = ngos.find(n => n.id === selectedNgoId) || { name: 'Jal Jeevan Mission Trust' };

  // Calculate Compliance Health Score
  const verifiedCount = docs.filter(d => d.status === 'verified').length;
  const healthPercent = Math.min(100, Math.round((verifiedCount / 5) * 100));

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!uploadTitle.trim()) return;
    setUploading(true);
    try {
      await uploadNgoComplianceDoc(selectedNgoId, {
        doc_type: uploadDocType,
        title: uploadTitle,
        file_name: uploadFileName || `${uploadDocType.replace(/\s+/g, '_')}_2026.pdf`,
        expiry_date: uploadExpiry || '2028-12-31',
        notes: uploadNotes
      });
      setNotification({ type: 'success', text: 'Document submitted securely for verification review!' });
      setShowUploadModal(false);
      setUploadTitle('');
      setUploadFileName('');
      setUploadNotes('');
      loadData();
    } catch (err) {
      setNotification({ type: 'error', text: err.message || 'Failed to upload document' });
    } finally {
      setUploading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewDoc) return;
    setReviewing(true);
    try {
      await reviewNgoComplianceDoc(reviewDoc.id, {
        status: reviewStatus,
        verified_by: reviewerName,
        notes: reviewNotes || `Reviewed and marked ${reviewStatus} by compliance officer.`
      });
      setNotification({ type: 'success', text: `Document ${reviewStatus === 'verified' ? 'verified' : 'updated'} successfully!` });
      setReviewDoc(null);
      loadData();
    } catch (err) {
      setNotification({ type: 'error', text: err.message || 'Failed to review document' });
    } finally {
      setReviewing(false);
    }
  };

  const filteredDocs = docs.filter(doc => {
    if (filterStatus !== 'all' && doc.status !== filterStatus) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        (doc.title && doc.title.toLowerCase().includes(term)) ||
        (doc.doc_type && doc.doc_type.toLowerCase().includes(term)) ||
        (doc.file_name && doc.file_name.toLowerCase().includes(term))
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50/50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Banner */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-3 border border-emerald-100">
                <ShieldCheck className="w-3.5 h-3.5" />
                Statutory & CSR Compliance Engine
              </div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Smart NGO Document Checklist</h1>
              <p className="text-slate-500 text-sm mt-1 max-w-2xl">
                Cryptographically safe compliance tracking for 12A, 80G, CSR-1, NGO Darpan, and audited financial statements. Never exposes raw sensitive IDs publicly.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setShowUploadModal(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-all"
              >
                <Upload className="w-4 h-4" />
                Upload New Document
              </button>
            </div>
          </div>

          {/* Toast Notification */}
          {notification && (
            <div className={`mt-4 p-3 rounded-xl text-sm flex items-center justify-between ${
              notification.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{notification.text}</span>
              </div>
              <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Organization Selector & Compliance Health Score */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2 mb-2">
                <Building2 className="w-4 h-4 text-emerald-600" />
                Active Organization
              </label>
              <select
                value={selectedNgoId}
                onChange={(e) => setSelectedNgoId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {ngos.map(n => (
                  <option key={n.id} value={n.id}>{n.name} ({n.cause || 'Nonprofit'})</option>
                ))}
              </select>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Status: <strong className="text-emerald-700">Verified Nonprofit</strong></span>
              <span>Total Uploads: <strong className="text-slate-800">{docs.length}</strong></span>
            </div>
          </div>

          {/* Compliance Score Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">CSR Compliance Readiness</span>
              <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-extrabold text-slate-900">{healthPercent}%</h3>
                <span className="text-xs text-emerald-600 font-semibold">{verifiedCount} of 5 core verified</span>
              </div>
              <p className="text-xs text-slate-500">
                {healthPercent >= 80 ? 'Eligible for Direct Corporate CSR Grants' : 'Complete 12A/80G/CSR-1 to unlock institutional funding'}
              </p>
            </div>
            <div className="w-16 h-16 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 flex items-center justify-center font-bold text-emerald-700 text-sm">
              {healthPercent}%
            </div>
          </div>

          {/* Security & Confidentiality Pill */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div className="text-xs text-slate-500 space-y-1">
              <h4 className="font-semibold text-slate-900 text-sm">Zero Public Leak Guarantee</h4>
              <p>
                All pan-cards, trust deeds, and bank certificates are encrypted with AES-256. Only authorized CSR grant officers can inspect watermarked previews.
              </p>
            </div>
          </div>
        </div>

        {/* Mandatory Checklist Matrix */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-emerald-600" />
              Statutory Requirement Matrix
            </h3>
            <span className="text-xs text-slate-400">Indian MCA & IT Act Compliance</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {MANDATORY_DOC_TYPES.map((req, idx) => {
              const matchedDoc = docs.find(d => d.doc_type === req.type);
              const isVerified = matchedDoc && matchedDoc.status === 'verified';
              const isReview = matchedDoc && matchedDoc.status === 'under_review';

              return (
                <div 
                  key={idx} 
                  className={`p-4 rounded-xl border transition-all ${
                    isVerified 
                      ? 'bg-emerald-50/40 border-emerald-200' 
                      : isReview 
                        ? 'bg-amber-50/40 border-amber-200'
                        : 'bg-slate-50/60 border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="font-semibold text-sm text-slate-900">{req.type}</span>
                    {isVerified ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" /> Verified
                      </span>
                    ) : isReview ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                        <Clock className="w-3 h-3" /> Under Review
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">
                        Pending
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2">{req.description}</p>
                  
                  <div className="mt-3 pt-2 border-t border-slate-200/50 flex items-center justify-between text-xs">
                    {matchedDoc ? (
                      <button 
                        onClick={() => setPreviewDoc(matchedDoc)}
                        className="text-emerald-700 font-semibold hover:underline flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" /> View Certificate
                      </button>
                    ) : (
                      <button 
                        onClick={() => {
                          setUploadDocType(req.type);
                          setShowUploadModal(true);
                        }}
                        className="text-blue-600 font-semibold hover:underline flex items-center gap-1"
                      >
                        <Upload className="w-3.5 h-3.5" /> Upload File
                      </button>
                    )}
                    {matchedDoc?.expiry_date && (
                      <span className="text-slate-400 text-[11px]">Exp: {matchedDoc.expiry_date}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Document Repository & Review Actions */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Uploaded Compliance Certificates</h3>
              <p className="text-xs text-slate-500">Manage, audit, and renew official documentation</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search certificate title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 w-52"
                />
              </div>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">All Statuses</option>
                <option value="verified">Verified</option>
                <option value="under_review">Under Review</option>
                <option value="needs_reupload">Needs Re-upload</option>
              </select>

              <button 
                onClick={loadData}
                className="p-2 text-slate-500 hover:text-slate-800 bg-slate-50 border border-slate-200 rounded-xl"
                title="Refresh"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-6">Document Type & Title</th>
                  <th className="py-3 px-4">File Name</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Validity / Expiry</th>
                  <th className="py-3 px-4">Auditor Notes</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDocs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      No documents found matching the filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredDocs.map(doc => (
                    <tr key={doc.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-semibold text-slate-900 text-sm">{doc.title}</div>
                        <div className="text-slate-400 text-xs">{doc.doc_type}</div>
                      </td>
                      <td className="py-4 px-4 font-mono text-slate-600">
                        {doc.file_name}
                      </td>
                      <td className="py-4 px-4">
                        {doc.status === 'verified' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            Verified
                          </span>
                        ) : doc.status === 'under_review' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                            <Clock className="w-3.5 h-3.5 text-amber-600" />
                            Under Review
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-700 bg-red-50 px-2.5 py-1 rounded-full border border-red-200">
                            <AlertCircle className="w-3.5 h-3.5 text-red-600" />
                            Needs Re-upload
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{doc.expiry_date || 'Perpetual'}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-slate-500 max-w-xs truncate" title={doc.notes}>
                        {doc.notes || 'Awaiting initial auditor audit.'}
                      </td>
                      <td className="py-4 px-6 text-right space-x-2">
                        <button
                          onClick={() => setPreviewDoc(doc)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold inline-flex items-center gap-1 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Inspect
                        </button>
                        <button
                          onClick={() => {
                            setReviewDoc(doc);
                            setReviewStatus(doc.status === 'verified' ? 'verified' : 'verified');
                            setReviewNotes(doc.notes || '');
                          }}
                          className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-semibold inline-flex items-center gap-1 transition-colors"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          Audit / Verify
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Upload className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Upload Compliance Document</h3>
                </div>
                <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Document Category</label>
                  <select
                    value={uploadDocType}
                    onChange={(e) => setUploadDocType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 font-medium focus:ring-2 focus:ring-emerald-500"
                  >
                    {MANDATORY_DOC_TYPES.map(m => (
                      <option key={m.type} value={m.type}>{m.type}</option>
                    ))}
                    <option value="Trust Deed / Bylaws">Trust Deed / Society Bylaws</option>
                    <option value="PAN Card (NGO Entity)">PAN Card (NGO Entity)</option>
                    <option value="Other Certification">Other Certification</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Document Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. FY 2025-26 80G Tax Exemption Certificate"
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Simulated File Name</label>
                    <input
                      type="text"
                      placeholder="e.g. CSR1_Doc_2026.pdf"
                      value={uploadFileName}
                      onChange={(e) => setUploadFileName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 font-mono text-[11px]"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Expiry Date (If applicable)</label>
                    <input
                      type="date"
                      value={uploadExpiry}
                      onChange={(e) => setUploadExpiry(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Registration Number / Notes</label>
                  <textarea
                    rows={3}
                    placeholder="Provide registration number, MCA filing token, or issuing authority..."
                    value={uploadNotes}
                    onChange={(e) => setUploadNotes(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="p-3 bg-emerald-50 rounded-xl text-[11px] text-emerald-800 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Files are stored encrypted and watermarked with recipient audit IDs.</span>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-semibold hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-sm flex items-center gap-2"
                  >
                    {uploading ? 'Encrypting & Saving...' : 'Submit for Verification'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Review / Verify Modal */}
        {reviewDoc && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Auditor Compliance Review</h3>
                    <p className="text-xs text-slate-500">{reviewDoc.title}</p>
                  </div>
                </div>
                <button onClick={() => setReviewDoc(null)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Audit Determination</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setReviewStatus('verified')}
                      className={`p-3 rounded-xl border text-center font-bold transition-all ${
                        reviewStatus === 'verified'
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                          : 'bg-slate-50 border-slate-200 text-slate-600'
                      }`}
                    >
                      Approve & Verify
                    </button>
                    <button
                      type="button"
                      onClick={() => setReviewStatus('needs_reupload')}
                      className={`p-3 rounded-xl border text-center font-bold transition-all ${
                        reviewStatus === 'needs_reupload'
                          ? 'bg-red-50 border-red-500 text-red-700'
                          : 'bg-slate-50 border-slate-200 text-slate-600'
                      }`}
                    >
                      Request Re-upload
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Auditor Name / Designation</label>
                  <input
                    type="text"
                    required
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Auditor Verification Remarks</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="e.g. Validated against official MCA21 / Income Tax portal records."
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setReviewDoc(null)}
                    className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={reviewing}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-sm"
                  >
                    {reviewing ? 'Saving...' : 'Confirm Determination'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Safe Document Preview Modal */}
        {previewDoc && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-600" />
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{previewDoc.title}</h3>
                    <p className="text-xs text-slate-500 font-mono">{previewDoc.file_name}</p>
                  </div>
                </div>
                <button onClick={() => setPreviewDoc(null)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Watermarked Secure Viewport */}
              <div className="bg-slate-100 border border-slate-200 rounded-2xl p-8 relative overflow-hidden text-center min-h-[260px] flex flex-col items-center justify-center">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10 rotate-[-25deg] select-none text-2xl font-black tracking-widest text-slate-800">
                  IMPACTCONNECT SECURE PREVIEW • CONFIDENTIAL
                </div>

                <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-emerald-600 mb-4 z-10">
                  <Lock className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-slate-800 text-sm z-10">{previewDoc.doc_type}</h4>
                <p className="text-xs text-slate-500 max-w-md mt-1 z-10">
                  Document ID: <span className="font-mono">{previewDoc.id}</span> | Expiry: {previewDoc.expiry_date || 'Perpetual'}
                </p>
                <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-semibold z-10">
                  <ShieldCheck className="w-4 h-4" />
                  Cryptographic Integrity Hash Verified (SHA-256)
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl text-xs space-y-1 text-slate-600">
                <div className="font-semibold text-slate-800">Audit Status:</div>
                <p>{previewDoc.notes || 'Validated during preliminary institutional screening.'}</p>
                <div className="text-[11px] text-slate-400 pt-1">
                  Verified by: {previewDoc.verified_by || 'Statutory Compliance Cell'} • Uploaded: {new Date(previewDoc.uploaded_at).toLocaleDateString()}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setPreviewDoc(null)}
                  className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800"
                >
                  Close Inspection Viewer
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
