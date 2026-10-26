import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  Package, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ArrowRight, 
  ShieldCheck, 
  ExternalLink, 
  Search, 
  RefreshCw,
  AlertCircle,
  FileText,
  UploadCloud,
  Check
} from 'lucide-react';
import { fetchDonationDeliveries, advanceDonationDelivery } from '../utils/api';

const STAGES = [
  { id: 'pledged', label: 'Pledged', desc: 'Supporter commits resources' },
  { id: 'approved', label: 'Approved', desc: 'NGO verifies need & destination' },
  { id: 'dispatched', label: 'Dispatched', desc: 'Shipped with courier / tracking' },
  { id: 'received', label: 'Received', desc: 'Arrived at NGO field depot' },
  { id: 'confirmed', label: 'Confirmed', desc: 'Inventory certified & distributed' }
];

export default function DonationDeliveryTracking({
  currentUser,
  onOpenAuth,
  language = 'en'
}) {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Advance Status Modal
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [nextStatus, setNextStatus] = useState('dispatched');
  const [trackingCode, setTrackingCode] = useState('');
  const [carrier, setCarrier] = useState('BlueDart Surface Express');
  const [trackingNotes, setTrackingNotes] = useState('');
  const [advancing, setAdvancing] = useState(false);
  const [advanceError, setAdvanceError] = useState(null);

  const loadDeliveries = async () => {
    setLoading(true);
    try {
      const data = await fetchDonationDeliveries({ status: statusFilter });
      setDeliveries(data);
    } catch (err) {
      console.error('Error fetching deliveries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDeliveries();
  }, [statusFilter]);

  const handleOpenAdvance = (delivery) => {
    setSelectedDelivery(delivery);
    const currIdx = STAGES.findIndex(s => s.id === delivery.current_status);
    const nxt = STAGES[Math.min(STAGES.length - 1, currIdx + 1)]?.id || 'confirmed';
    setNextStatus(nxt);
    setTrackingCode(delivery.tracking_code || '');
    setCarrier(delivery.carrier || 'BlueDart Express');
    setTrackingNotes('');
    setAdvanceError(null);
  };

  const handleAdvanceSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDelivery) return;
    setAdvancing(true);
    setAdvanceError(null);

    try {
      await advanceDonationDelivery(selectedDelivery.id, {
        newStatus: nextStatus,
        trackingNotes: trackingNotes || `Advanced status to ${nextStatus}`,
        actorName: currentUser?.name || 'Field Officer',
        trackingCode: trackingCode || selectedDelivery.tracking_code,
        carrier: carrier || selectedDelivery.carrier
      });
      setSelectedDelivery(null);
      loadDeliveries();
    } catch (err) {
      setAdvanceError(err.message || 'Failed to advance status');
    } finally {
      setAdvancing(false);
    }
  };

  const filteredDeliveries = deliveries.filter(d => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      d.item_name?.toLowerCase().includes(q) ||
      d.tracking_code?.toLowerCase().includes(q) ||
      d.donor_name?.toLowerCase().includes(q) ||
      d.recipient_ngo_name?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50/50 py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Banner */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xs relative">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#16A36A] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-flex items-center space-x-1.5">
              <Truck className="w-3.5 h-3.5 text-[#16A36A]" />
              <span>Real-Time Logistics Workflow</span>
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Donation Delivery Tracking
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              Track physical donations with complete audit transparency. From initial pledge through dispatch, field depot arrival, and coordinator countersignature, every handoff is timestamped and certified.
            </p>
          </div>

          {/* Search & Filters */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 pt-6">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by item, tracking code, NGO..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
              {['all', 'pledged', 'approved', 'dispatched', 'received', 'confirmed'].map(st => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition capitalize ${
                    statusFilter === st
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Deliveries List */}
        {loading ? (
          <div className="py-20 text-center">
            <RefreshCw className="w-8 h-8 animate-spin text-[#16A36A] mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-500">Loading Delivery Pipelines...</p>
          </div>
        ) : filteredDeliveries.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-2">
            <Package className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No matching donation deliveries found.</h3>
            <p className="text-xs text-slate-500">Try adjusting your search query or status filter.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredDeliveries.map(del => {
              const currentStageIdx = STAGES.findIndex(s => s.id === del.current_status);

              return (
                <div key={del.id} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
                  
                  {/* Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#16A36A] border border-emerald-200 flex items-center justify-center font-bold shrink-0">
                        <Package className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="text-base font-black text-slate-900">
                            {del.quantity}x {del.item_name}
                          </h3>
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                            {del.category}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-x-2">
                          <span>Donor: <strong className="text-slate-800">{del.donor_name}</strong> ({del.donor_organization || 'Citizen Supporter'})</span>
                          <span>•</span>
                          <span>Recipient: <strong className="text-slate-800">{del.recipient_ngo_name}</strong></span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 self-start sm:self-auto">
                      <button
                        type="button"
                        onClick={() => handleOpenAdvance(del)}
                        className="px-3.5 py-2 rounded-xl btn-primary text-xs font-bold flex items-center space-x-1.5 shadow-xs"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Update / Advance Status</span>
                      </button>
                    </div>
                  </div>

                  {/* 5-Step Pipeline Progress Bar */}
                  <div className="py-2">
                    <div className="grid grid-cols-5 gap-2 relative">
                      {STAGES.map((stg, idx) => {
                        const isPast = idx < currentStageIdx;
                        const isCurrent = idx === currentStageIdx;

                        return (
                          <div key={stg.id} className="flex flex-col items-center text-center space-y-2 relative">
                            {/* Circle Indicator */}
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition z-10 ${
                              isCurrent
                                ? 'bg-[#16A36A] text-white ring-4 ring-emerald-100'
                                : isPast
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-100 text-slate-400'
                            }`}>
                              {isPast || isCurrent ? <Check className="w-4 h-4" /> : idx + 1}
                            </div>
                            
                            <div>
                              <span className={`text-xs font-bold block ${isCurrent ? 'text-slate-900 font-black' : isPast ? 'text-emerald-700' : 'text-slate-400'}`}>
                                {stg.label}
                              </span>
                              <span className="text-[10px] text-slate-400 hidden sm:block">
                                {stg.desc}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Bottom Meta & Audit Log */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-3.5 h-3.5 text-[#16A36A]" />
                        <span className="font-semibold text-slate-800">Depot Address:</span>
                        <span className="text-slate-600">{del.destination_address}</span>
                      </div>
                      <div className="flex items-center space-x-3 text-slate-500 font-mono text-[11px] pt-1">
                        <span>CARRIER: {del.carrier || 'Pending Dispatch'}</span>
                        <span>•</span>
                        <span>TRACKING: {del.tracking_code || 'Pending'}</span>
                      </div>
                    </div>

                    <div className="text-right flex items-center justify-end space-x-2">
                      <span className="inline-flex items-center space-x-1 font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
                        <ShieldCheck className="w-4 h-4 text-[#16A36A]" />
                        <span>Verified Field Chain</span>
                      </span>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* ADVANCE STATUS MODAL */}
      {selectedDelivery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 relative">
            <h3 className="text-base font-black text-slate-900">
              Advance Delivery Status: {selectedDelivery.item_name}
            </h3>

            {advanceError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
                {advanceError}
              </div>
            )}

            <form onSubmit={handleAdvanceSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">New Delivery Status</label>
                <select
                  value={nextStatus}
                  onChange={(e) => setNextStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                >
                  {STAGES.map(s => (
                    <option key={s.id} value={s.id}>{s.label} — {s.desc}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Courier Carrier</label>
                <input
                  type="text"
                  value={carrier}
                  onChange={(e) => setCarrier(e.target.value)}
                  placeholder="e.g. BlueDart, DTDC, Delhivery"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Waybill / Tracking Code</label>
                <input
                  type="text"
                  value={trackingCode}
                  onChange={(e) => setTrackingCode(e.target.value)}
                  placeholder="e.g. BLUEDART-EXP-9921448"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tracking Notes / Verification Remarks</label>
                <textarea
                  rows={2}
                  value={trackingNotes}
                  onChange={(e) => setTrackingNotes(e.target.value)}
                  placeholder="e.g. Package inspected at central depot, seal intact."
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedDelivery(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={advancing}
                  className="flex-1 py-2.5 rounded-xl btn-primary text-xs font-bold flex items-center justify-center space-x-1.5 shadow-sm"
                >
                  <Check className="w-4 h-4" />
                  <span>{advancing ? 'Updating...' : 'Confirm Update'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
