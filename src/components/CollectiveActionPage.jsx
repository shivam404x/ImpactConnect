import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Target, 
  CheckCircle2, 
  Clock, 
  HeartHandshake, 
  Package, 
  DollarSign, 
  MapPin, 
  Calendar, 
  AlertCircle, 
  Filter, 
  ShieldCheck, 
  ArrowRight,
  TrendingUp,
  Sparkles,
  RefreshCw,
  Plus
} from 'lucide-react';
import { fetchCollectiveCampaigns, pledgeCollectiveCampaign, confirmCollectiveDelivery } from '../utils/api';

export default function CollectiveActionPage({
  currentUser,
  onOpenAuth,
  language = 'en'
}) {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCause, setSelectedCause] = useState('all');
  const [activeModalCampaign, setActiveModalCampaign] = useState(null);

  // Pledge modal form state
  const [pledgeType, setPledgeType] = useState('monetary'); // 'monetary' | 'goods'
  const [pledgeAmount, setPledgeAmount] = useState(5000);
  const [selectedItemName, setSelectedItemName] = useState('');
  const [pledgeQuantity, setPledgeQuantity] = useState(5);
  const [backerName, setBackerName] = useState(currentUser?.name || 'Marcus Chen');
  const [backerEmail, setBackerEmail] = useState(currentUser?.email || 'marcus.chen@apextech.com');
  const [pledgeNotes, setPledgeNotes] = useState('');
  const [submittingPledge, setSubmittingPledge] = useState(false);
  const [pledgeError, setPledgeError] = useState(null);
  const [pledgeSuccess, setPledgeSuccess] = useState(false);

  const loadCampaigns = async () => {
    setLoading(true);
    try {
      const data = await fetchCollectiveCampaigns({ cause: selectedCause });
      setCampaigns(data);
    } catch (err) {
      console.error('Error fetching collective campaigns:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCampaigns();
  }, [selectedCause]);

  useEffect(() => {
    if (currentUser) {
      setBackerName(currentUser.name || 'Marcus Chen');
      setBackerEmail(currentUser.email || 'marcus.chen@apextech.com');
    }
  }, [currentUser]);

  const handleOpenPledge = (campaign) => {
    setActiveModalCampaign(campaign);
    setPledgeError(null);
    setPledgeSuccess(false);
    if (campaign.resource_targets?.length > 0) {
      setSelectedItemName(campaign.resource_targets[0].item);
    }
  };

  const handleSubmitPledge = async (e) => {
    e.preventDefault();
    if (!activeModalCampaign) return;
    setSubmittingPledge(true);
    setPledgeError(null);

    try {
      await pledgeCollectiveCampaign(activeModalCampaign.id, {
        backer_name: backerName,
        backer_email: backerEmail,
        pledge_type: pledgeType,
        amount: pledgeType === 'monetary' ? Number(pledgeAmount) : 0,
        item_name: pledgeType === 'goods' ? selectedItemName : null,
        quantity: pledgeType === 'goods' ? Number(pledgeQuantity) : 0,
        notes: pledgeNotes
      });
      setPledgeSuccess(true);
      loadCampaigns();
      setTimeout(() => {
        setActiveModalCampaign(null);
        setPledgeSuccess(false);
      }, 1800);
    } catch (err) {
      setPledgeError(err.message || 'Failed to record pledge.');
    } finally {
      setSubmittingPledge(false);
    }
  };

  const handleConfirmPledge = async (campaignId, pledgeId) => {
    try {
      await confirmCollectiveDelivery(campaignId, pledgeId);
      loadCampaigns();
    } catch (err) {
      alert(err.message || 'Failed to confirm pledge delivery');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Hero Header */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#16A36A] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-flex items-center space-x-1.5">
              <HeartHandshake className="w-3.5 h-3.5 text-[#16A36A]" />
              <span>Multi-Backer Social Mobilization</span>
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Collective Action Campaigns
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              Join forces with other citizens, corporate CSR teams, and community supporters. Pool monetary grants, donate verified physical equipment, or pledge volunteer hours toward transformative shared milestones.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-6">
            <span className="text-xs font-bold text-slate-400 mr-2 flex items-center space-x-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Filter by Cause:</span>
            </span>
            {['all', 'Clean Water', 'Education', 'Climate Action'].map(c => (
              <button
                key={c}
                onClick={() => setSelectedCause(c)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition capitalize ${
                  selectedCause === c
                    ? 'bg-[#16A36A] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {c === 'all' ? 'All Campaigns' : c}
              </button>
            ))}
          </div>
        </div>

        {/* Campaigns Grid */}
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <RefreshCw className="w-8 h-8 animate-spin text-[#16A36A] mx-auto" />
            <p className="text-xs font-bold text-slate-500">Loading Collective Action Campaigns...</p>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-2">
            <Target className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No collective campaigns found.</h3>
            <p className="text-xs text-slate-500">Check back soon or select another cause filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {campaigns.map(camp => {
              const fundingPct = Math.min(100, Math.round(((camp.pledged_amount || 0) / (camp.target_amount || 1)) * 100));
              const confirmedPct = Math.min(100, Math.round(((camp.confirmed_amount || 0) / (camp.target_amount || 1)) * 100));

              return (
                <div key={camp.id} className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition overflow-hidden flex flex-col">
                  
                  {/* Image */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                    <img
                      src={camp.image_url}
                      alt={camp.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute top-3 left-3 flex items-center space-x-2">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/95 text-slate-800 backdrop-blur-xs shadow-xs">
                        SDG {camp.sdg_number} • {camp.cause}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                    
                    <div className="space-y-2">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        By {camp.ngo_name}
                      </div>
                      <h3 className="text-base font-black text-slate-900 tracking-tight leading-snug">
                        {camp.title}
                      </h3>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {camp.story}
                      </p>
                      <div className="flex items-center space-x-3 text-[11px] text-slate-500 pt-1 font-medium">
                        <span className="flex items-center space-x-1">
                          <MapPin className="w-3.5 h-3.5 text-[#16A36A]" />
                          <span>{camp.location}</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>Deadline: {camp.deadline}</span>
                        </span>
                      </div>
                    </div>

                    {/* Progress Trackers */}
                    <div className="space-y-4 pt-3 border-t border-slate-100">
                      
                      {/* Financial Pool Progress */}
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="font-bold text-slate-800">
                            ₹{(camp.pledged_amount || 0).toLocaleString()} <span className="text-[11px] font-normal text-slate-500">pledged</span>
                          </span>
                          <span className="text-xs font-mono font-bold text-slate-500">
                            Target: ₹{camp.target_amount?.toLocaleString()}
                          </span>
                        </div>
                        {/* Dual stacked progress bar: Confirmed vs Pledged */}
                        <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden relative flex">
                          <div
                            style={{ width: `${confirmedPct}%` }}
                            className="h-full bg-[#16A36A]"
                            title={`Confirmed Received: ₹${(camp.confirmed_amount || 0).toLocaleString()}`}
                          />
                          <div
                            style={{ width: `${Math.max(0, fundingPct - confirmedPct)}%` }}
                            className="h-full bg-emerald-300"
                            title={`Pledged (Pending Delivery): ₹${((camp.pledged_amount || 0) - (camp.confirmed_amount || 0)).toLocaleString()}`}
                          />
                        </div>
                        <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1">
                          <span className="flex items-center space-x-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#16A36A]"></span>
                            <span>{confirmedPct}% Confirmed</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-300"></span>
                            <span>{fundingPct}% Total Pledged</span>
                          </span>
                        </div>
                      </div>

                      {/* Non-Monetary Target Items */}
                      {camp.resource_targets?.length > 0 && (
                        <div className="space-y-2 pt-2 border-t border-slate-100">
                          <span className="text-[11px] font-bold text-slate-700 block">
                            Shared Physical Resource Goals:
                          </span>
                          <div className="space-y-1.5">
                            {camp.resource_targets.map((res, i) => (
                              <div key={i} className="text-[11px] bg-slate-50 p-2 rounded-xl flex items-center justify-between">
                                <span className="font-medium text-slate-800">{res.item}</span>
                                <span className="font-bold text-[#16A36A]">
                                  {res.confirmed}/{res.target} {res.unit}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Recent Pledges / Backers */}
                      {camp.recent_pledges?.length > 0 && (
                        <div className="pt-2">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
                            Recent Supporters ({camp.pledges_count}):
                          </span>
                          <div className="space-y-1">
                            {camp.recent_pledges.map(p => (
                              <div key={p.id} className="text-[11px] flex items-center justify-between text-slate-600">
                                <span>{p.backer_name}</span>
                                <span className="font-bold text-slate-900">
                                  {p.pledge_type === 'monetary' ? `₹${p.amount.toLocaleString()}` : `${p.quantity}x ${p.item_name}`}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action */}
                      <button
                        type="button"
                        onClick={() => handleOpenPledge(camp)}
                        className="w-full py-2.5 rounded-xl btn-primary text-xs font-bold flex items-center justify-center space-x-1.5 shadow-xs"
                      >
                        <HeartHandshake className="w-4 h-4" />
                        <span>Pitch In / Pledge Support</span>
                      </button>

                    </div>

                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* PLEDGE MODAL */}
      {activeModalCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 relative">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#16A36A] bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  Collective Action Pledge
                </span>
                <h3 className="text-base font-black text-slate-900 mt-1">
                  {activeModalCampaign.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveModalCampaign(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {pledgeSuccess ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2 animate-fade-in">
                <CheckCircle2 className="w-10 h-10 text-[#16A36A] mx-auto" />
                <h4 className="text-sm font-black text-emerald-900">Pledge Recorded Successfully!</h4>
                <p className="text-xs text-emerald-700">
                  Thank you for contributing to this collective campaign. The coordinator will be notified.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitPledge} className="space-y-4">
                
                {pledgeError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{pledgeError}</span>
                  </div>
                )}

                {/* Contribution Type Selector */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPledgeType('monetary')}
                    className={`py-2 rounded-xl text-xs font-bold border transition flex items-center justify-center space-x-1.5 ${
                      pledgeType === 'monetary'
                        ? 'bg-emerald-50 text-[#16A36A] border-emerald-300'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>Monetary Pool</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPledgeType('goods')}
                    className={`py-2 rounded-xl text-xs font-bold border transition flex items-center justify-center space-x-1.5 ${
                      pledgeType === 'goods'
                        ? 'bg-emerald-50 text-[#16A36A] border-emerald-300'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Package className="w-3.5 h-3.5" />
                    <span>Physical Equipment</span>
                  </button>
                </div>

                {pledgeType === 'monetary' ? (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Pledge Amount (₹ INR)
                    </label>
                    <div className="grid grid-cols-4 gap-2 mb-2">
                      {[1000, 2500, 5000, 15000].map(amt => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setPledgeAmount(amt)}
                          className={`py-1.5 rounded-lg text-xs font-semibold border ${
                            pledgeAmount === amt ? 'bg-slate-900 text-white border-slate-900 font-bold' : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          ₹{amt.toLocaleString()}
                        </button>
                      ))}
                    </div>
                    <input
                      type="number"
                      min="500"
                      step="500"
                      required
                      value={pledgeAmount}
                      onChange={(e) => setPledgeAmount(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                    />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Select Needed Item</label>
                      <select
                        value={selectedItemName}
                        onChange={(e) => setSelectedItemName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                      >
                        {activeModalCampaign.resource_targets?.map((r, i) => (
                          <option key={i} value={r.item}>{r.item} (Remaining: {r.target - r.confirmed})</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Quantity Pledged</label>
                      <input
                        type="number"
                        min="1"
                        required
                        value={pledgeQuantity}
                        onChange={(e) => setPledgeQuantity(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={backerName}
                      onChange={(e) => setBackerName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Your Email</label>
                    <input
                      type="email"
                      required
                      value={backerEmail}
                      onChange={(e) => setBackerEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Pledge Note (Optional)</label>
                  <input
                    type="text"
                    value={pledgeNotes}
                    onChange={(e) => setPledgeNotes(e.target.value)}
                    placeholder="e.g. Apex Tech employee matching, delivering next week"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                  />
                </div>

                <div className="p-3 rounded-xl bg-slate-50 text-[11px] text-slate-500 leading-relaxed border border-slate-200">
                  <span className="font-bold text-slate-700">Transparency Guarantee:</span> Pledges remain tagged as "Pledged (Pending Delivery)" until the NGO verifies and countersigns on-ground arrival.
                </div>

                <button
                  type="submit"
                  disabled={submittingPledge}
                  className="w-full py-3 rounded-xl btn-primary text-xs font-bold flex items-center justify-center space-x-1.5 shadow-md"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{submittingPledge ? 'Recording Pledge...' : 'Confirm & Commit Pledge'}</span>
                </button>

              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
