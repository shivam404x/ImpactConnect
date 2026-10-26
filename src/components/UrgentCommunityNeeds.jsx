import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  Clock, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  Plus, 
  HeartHandshake, 
  ShieldCheck, 
  ShieldAlert, 
  Building2, 
  Phone, 
  X,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { fetchUrgentNeeds, createUrgentNeed, pledgeUrgentNeed } from '../utils/api';

export default function UrgentCommunityNeeds({
  currentUser,
  onOpenAuth,
  onReport
}) {
  const [needs, setNeeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCause, setSelectedCause] = useState('all');
  const [selectedUrgency, setSelectedUrgency] = useState('all');

  // Pledge modal state
  const [pledgeTarget, setPledgeTarget] = useState(null);
  const [pledgedQty, setPledgedQty] = useState(10);
  const [supporterName, setSupporterName] = useState(currentUser?.name || '');
  const [supporterEmail, setSupporterEmail] = useState(currentUser?.email || '');
  const [pledgeNotes, setPledgeNotes] = useState('');
  const [pledging, setPledging] = useState(false);
  const [pledgeSuccess, setPledgeSuccess] = useState(false);

  // Post Urgent Need Modal state (Authorized NGOs)
  const [showPostModal, setShowPostModal] = useState(false);
  const [needTitle, setNeedTitle] = useState('');
  const [needDesc, setNeedDesc] = useState('');
  const [needCause, setNeedCause] = useState('disaster_relief');
  const [needUrgency, setNeedUrgency] = useState('critical');
  const [needDeadline, setNeedDeadline] = useState('2026-11-15');
  const [needTargetQty, setNeedTargetQty] = useState(200);
  const [needUnit, setNeedUnit] = useState('ration kits');
  const [needCity, setNeedCity] = useState(currentUser?.city || 'Mumbai');
  const [needCountry, setNeedCountry] = useState('India');
  const [needPhone, setNeedPhone] = useState(currentUser?.phone || '+91 98201 44510');
  const [submittingNeed, setSubmittingNeed] = useState(false);

  const loadNeeds = async () => {
    setLoading(true);
    try {
      const data = await fetchUrgentNeeds({
        cause: selectedCause,
        urgency: selectedUrgency
      });
      setNeeds(data);
    } catch (err) {
      console.error('Error fetching urgent needs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNeeds();
  }, [selectedCause, selectedUrgency]);

  // Calculate days remaining
  const calculateDaysLeft = (deadlineDate) => {
    if (!deadlineDate) return 5;
    const diff = new Date(deadlineDate) - new Date();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const handlePledgeSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser && onOpenAuth) {
      onOpenAuth('login');
      return;
    }
    setPledging(true);
    try {
      await pledgeUrgentNeed(pledgeTarget.id, {
        supporter_name: supporterName || 'Anonymous Supporter',
        supporter_email: supporterEmail || 'supporter@impactconnect.org',
        pledged_quantity: Number(pledgedQty),
        notes: pledgeNotes
      });
      setPledgeSuccess(true);
      setTimeout(() => {
        setPledgeSuccess(false);
        setPledgeTarget(null);
        setPledgeNotes('');
        loadNeeds();
      }, 1800);
    } catch (err) {
      alert('Failed to pledge: ' + err.message);
    } finally {
      setPledging(false);
    }
  };

  const handleCreateNeed = async (e) => {
    e.preventDefault();
    setSubmittingNeed(true);
    try {
      await createUrgentNeed({
        ngo_id: currentUser?.ngo_id || 'ngo-1',
        ngo_name: currentUser?.organization_name || 'Aashray Rural Trust',
        title: needTitle,
        description: needDesc,
        cause_category: needCause,
        urgency_level: needUrgency,
        deadline: needDeadline,
        target_quantity: Number(needTargetQty),
        unit: needUnit,
        location_city: needCity,
        location_country: needCountry,
        contact_phone: needPhone
      });
      setShowPostModal(false);
      setNeedTitle('');
      setNeedDesc('');
      loadNeeds();
      alert('Urgent Community Need published and broadcast to partner network!');
    } catch (err) {
      alert('Error creating urgent need: ' + err.message);
    } finally {
      setSubmittingNeed(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20">
      
      {/* Header */}
      <div className="bg-white border-b border-slate-200 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200 flex items-center space-x-1">
                  <Flame className="w-3.5 h-3.5" />
                  <span>Time-Critical Action</span>
                </span>
                <span className="text-xs text-slate-400 font-semibold">• Live Verification</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
                Urgent Community Crisis Relief
              </h1>
              <p className="text-sm text-slate-600 mt-2 max-w-2xl">
                Direct frontline requirements with strict completion deadlines. Connect immediately with vetted NGO coordinators to avert crisis bottlenecks.
              </p>
            </div>

            <div className="flex items-center space-x-3">
              {currentUser?.role === 'ngo' ? (
                <button
                  onClick={() => setShowPostModal(true)}
                  className="px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center space-x-2 shadow-sm transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publish Urgent Need</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    if (!currentUser && onOpenAuth) onOpenAuth('register', 'ngo');
                    else alert('NGO Lead credentials required to publish crisis requirements.');
                  }}
                  className="px-4 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition"
                >
                  NGO Verification Access
                </button>
              )}
            </div>
          </div>

          {/* Filter Bar */}
          <div className="mt-8 bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-500 mr-2">Filter By:</span>
              <select
                value={selectedCause}
                onChange={(e) => setSelectedCause(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
              >
                <option value="all">All Cause Domains</option>
                <option value="disaster_relief">Disaster & Flood Relief</option>
                <option value="healthcare">Urgent Healthcare</option>
                <option value="education">Education & Shelters</option>
                <option value="poverty">Poverty & Hunger</option>
              </select>

              <select
                value={selectedUrgency}
                onChange={(e) => setSelectedUrgency(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
              >
                <option value="all">All Priority Levels</option>
                <option value="critical">Critical Priority Only</option>
                <option value="urgent">Urgent Priority</option>
              </select>
            </div>

            <div className="text-xs text-slate-500 font-semibold">
              Showing <strong className="text-slate-900">{needs.length}</strong> active urgent appeals
            </div>
          </div>

        </div>
      </div>

      {/* Urgent Needs Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        
        {loading ? (
          <div className="text-center py-20 text-slate-400 text-sm">
            Loading urgent appeals...
          </div>
        ) : needs.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-md mx-auto">
            <ShieldCheck className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h3 className="text-base font-black text-slate-800">No Critical Appeals at this Moment</h3>
            <p className="text-xs text-slate-500 mt-1">All current urgent community drives have reached their fulfillment goals.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {needs.map(need => {
              const daysLeft = calculateDaysLeft(need.deadline);
              const progressPct = need.target_quantity > 0 
                ? Math.min(100, Math.round((Number(need.current_quantity) / Number(need.target_quantity)) * 100))
                : 0;

              return (
                <div
                  key={need.id}
                  className="bg-white rounded-3xl border border-rose-200/90 hover:border-rose-400 shadow-xs hover:shadow-lg transition flex flex-col justify-between overflow-hidden"
                >
                  <div className="p-6">
                    {/* Header Strip */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center space-x-1.5">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center space-x-1 ${
                          need.urgency_level === 'critical'
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}>
                          <Flame className="w-3 h-3 text-rose-600" />
                          <span>{need.urgency_level} Priority</span>
                        </span>
                      </div>

                      <div className="flex items-center space-x-1 text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-100">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{daysLeft} days left</span>
                      </div>
                    </div>

                    <h3 className="text-base font-black text-slate-900 leading-snug">{need.title}</h3>
                    
                    <div className="flex items-center space-x-1.5 text-xs text-slate-500 mt-1.5 font-medium">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-semibold text-slate-700">{need.ngo_name}</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#16A36A]" title="Verified NGO" />
                    </div>

                    <p className="text-xs text-slate-600 mt-3 line-clamp-3 leading-relaxed">
                      {need.description}
                    </p>

                    <div className="mt-4 flex items-center space-x-1 text-xs text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{need.location_city}, {need.location_country}</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-5 pt-4 border-t border-slate-100 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-700">Fulfilled:</span>
                        <span className="font-black text-slate-900">
                          {need.current_quantity} / {need.target_quantity} {need.unit}
                        </span>
                      </div>

                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-rose-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${progressPct}%` }}
                        ></div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>{progressPct}% target met</span>
                        <span>{need.pledges_count || 0} donors pledged</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-6 pt-0 border-t border-slate-100 flex items-center justify-between gap-2 mt-2">
                    {onReport && (
                      <button
                        onClick={() => onReport({ type: 'urgent_need', target: need })}
                        className="text-slate-400 hover:text-rose-600 p-2 rounded-xl transition"
                        title="Report suspicious or inaccurate appeal"
                      >
                        <ShieldAlert className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setPledgeTarget(need);
                        setPledgedQty(Math.min(25, need.target_quantity - need.current_quantity || 10));
                      }}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center justify-center space-x-1.5 shadow-sm transition"
                    >
                      <HeartHandshake className="w-4 h-4" />
                      <span>Pledge Emergency Help</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Modal: Pledge Support */}
      {pledgeTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setPledgeTarget(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {pledgeSuccess ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-[#16A36A]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-slate-900">Emergency Support Pledged!</h3>
                <p className="text-xs text-slate-600 max-w-xs mx-auto">
                  Thank you for stepping up. {pledgeTarget.ngo_name}'s emergency relief team will contact you directly to arrange dropoff.
                </p>
              </div>
            ) : (
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                  Emergency Pledge Authorization
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-2">{pledgeTarget.title}</h3>
                <p className="text-xs text-slate-500">
                  Targeted by: <span className="font-bold text-slate-800">{pledgeTarget.ngo_name}</span> in {pledgeTarget.location_city}
                </p>

                <form onSubmit={handlePledgeSubmit} className="space-y-4 mt-5">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name</label>
                      <input
                        type="text"
                        required
                        value={supporterName}
                        onChange={(e) => setSupporterName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Your Email</label>
                      <input
                        type="email"
                        required
                        value={supporterEmail}
                        onChange={(e) => setSupporterEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Pledged Quantity ({pledgeTarget.unit})
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={pledgedQty}
                      onChange={(e) => setPledgedQty(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Dispatch or Contribution Notes
                    </label>
                    <textarea
                      rows="3"
                      value={pledgeNotes}
                      onChange={(e) => setPledgeNotes(e.target.value)}
                      placeholder="e.g. We have 50 kits ready in our warehouse, available for immediate pickup or courier..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                    ></textarea>
                  </div>

                  <div className="flex items-center justify-end space-x-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setPledgeTarget(null)}
                      className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={pledging}
                      className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm disabled:opacity-50"
                    >
                      {pledging ? 'Pledging...' : 'Confirm Emergency Pledge'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal: Publish Urgent Need (NGOs) */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowPostModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 text-rose-600 mb-1">
              <Flame className="w-4 h-4" />
              <h3 className="text-lg font-black text-slate-900">Publish Urgent Community Need</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">Broadcast an emergency supply or relief requirement to registered donors and companies.</p>

            <form onSubmit={handleCreateNeed} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Requirement Title</label>
                <input
                  type="text"
                  required
                  value={needTitle}
                  onChange={(e) => setNeedTitle(e.target.value)}
                  placeholder="e.g. Flash Flood Drinking Water Purification Sachets"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Cause Category</label>
                  <select
                    value={needCause}
                    onChange={(e) => setNeedCause(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                  >
                    <option value="disaster_relief">Disaster Relief</option>
                    <option value="healthcare">Healthcare Emergency</option>
                    <option value="education">Shelter & Education</option>
                    <option value="poverty">Hunger Alleviation</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Priority</label>
                  <select
                    value={needUrgency}
                    onChange={(e) => setNeedUrgency(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                  >
                    <option value="critical">Critical (Immediate 48-72h)</option>
                    <option value="urgent">Urgent (Within 7-10 days)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Quantity</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={needTargetQty}
                    onChange={(e) => setNeedTargetQty(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Unit (e.g. kits, packets)</label>
                  <input
                    type="text"
                    required
                    value={needUnit}
                    onChange={(e) => setNeedUnit(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={needCity}
                    onChange={(e) => setNeedCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Fulfillment Deadline</label>
                  <input
                    type="date"
                    required
                    value={needDeadline}
                    onChange={(e) => setNeedDeadline(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Situation Briefing</label>
                <textarea
                  rows="3"
                  required
                  value={needDesc}
                  onChange={(e) => setNeedDesc(e.target.value)}
                  placeholder="Explain the crisis situation, affected families, and exact drop point..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                ></textarea>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPostModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingNeed}
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm disabled:opacity-50"
                >
                  {submittingNeed ? 'Publishing...' : 'Publish Urgent Appeal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
