import React, { useState, useEffect } from 'react';
import { 
  Users2, 
  Layers, 
  Target, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Building2, 
  Briefcase, 
  Share2, 
  ArrowRight, 
  Activity, 
  X, 
  Sparkles, 
  HeartHandshake, 
  ShieldCheck, 
  Truck, 
  RefreshCw 
} from 'lucide-react';
import { fetchCrossNgoRooms, createCrossNgoRoom, addCrossNgoMilestone, fetchNgos } from '../utils/api';

export default function CrossNgoCollaborationRooms({ currentUser, onOpenAuth, language = 'en' }) {
  const [rooms, setRooms] = useState([]);
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Filter
  const [filterCause, setFilterCause] = useState('all');

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddMilestoneModal, setShowAddMilestoneModal] = useState(false);
  const [notification, setNotification] = useState(null);

  // New Room Form State
  const [newRoomTitle, setNewRoomTitle] = useState('');
  const [newRoomCause, setNewRoomCause] = useState('Clean Water & Public Health');
  const [newRoomLeadNgo, setNewRoomLeadNgo] = useState('ngo-1');
  const [newRoomPartnerNgos, setNewRoomPartnerNgos] = useState(['ngo-3']);
  const [newRoomGoal, setNewRoomGoal] = useState('');
  const [newRoomResources, setNewRoomResources] = useState([
    { item: 'Mobile Testing Vans', quantity: '2', contributed_by: 'Partner NGO' },
    { item: 'Field Relief Kits', quantity: '100', contributed_by: 'Lead NGO' }
  ]);
  const [creatingRoom, setCreatingRoom] = useState(false);

  // New Milestone Form State
  const [milestoneTitle, setMilestoneTitle] = useState('');
  const [milestoneDueDate, setMilestoneDueDate] = useState('');
  const [addingMilestone, setAddingMilestone] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [roomData, ngoData] = await Promise.all([
        fetchCrossNgoRooms().catch(() => []),
        fetchNgos().catch(() => [])
      ]);
      setRooms(roomData);
      setNgos(ngoData);
      if (roomData.length > 0 && !selectedRoom) {
        setSelectedRoom(roomData[0]);
      } else if (selectedRoom) {
        // update reference
        const current = roomData.find(r => r.id === selectedRoom.id);
        if (current) setSelectedRoom(current);
      }
    } catch (err) {
      console.error('Error fetching cross-NGO rooms:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    if (!newRoomTitle.trim() || !newRoomGoal.trim()) return;
    setCreatingRoom(true);
    try {
      const leadObj = ngos.find(n => n.id === newRoomLeadNgo) || { name: 'Jal Jeevan Mission Trust' };
      const partnerObj = ngos.find(n => n.id === newRoomPartnerNgos[0]) || { name: 'Aarogya Seva Trust' };

      const payload = {
        title: newRoomTitle,
        lead_ngo_id: newRoomLeadNgo,
        lead_ngo_name: leadObj.name,
        partner_ngo_ids: newRoomPartnerNgos,
        partner_ngo_names: [partnerObj.name],
        shared_cause: newRoomCause,
        joint_goal: newRoomGoal,
        shared_resources: newRoomResources.filter(r => r.item.trim()),
        shared_volunteers_count: 15,
        status: 'active'
      };

      const created = await createCrossNgoRoom(payload);
      setNotification({ type: 'success', text: 'Cross-NGO Coalition Room created successfully!' });
      setShowCreateModal(false);
      // Reset form
      setNewRoomTitle('');
      setNewRoomGoal('');
      await loadData();
      setSelectedRoom(created);
    } catch (err) {
      setNotification({ type: 'error', text: err.message || 'Failed to create room' });
    } finally {
      setCreatingRoom(false);
    }
  };

  const handleAddMilestone = async (e) => {
    e.preventDefault();
    if (!selectedRoom || !milestoneTitle.trim()) return;
    setAddingMilestone(true);
    try {
      const updated = await addCrossNgoMilestone(selectedRoom.id, {
        title: milestoneTitle,
        due_date: milestoneDueDate || '2026-12-31'
      });
      setNotification({ type: 'success', text: 'Milestone added to joint mission!' });
      setShowAddMilestoneModal(false);
      setMilestoneTitle('');
      setMilestoneDueDate('');
      await loadData();
      if (updated) setSelectedRoom(updated);
    } catch (err) {
      setNotification({ type: 'error', text: err.message || 'Failed to add milestone' });
    } finally {
      setAddingMilestone(false);
    }
  };

  const filteredRooms = rooms.filter(room => {
    if (filterCause !== 'all' && !room.shared_cause.toLowerCase().includes(filterCause.toLowerCase())) return false;
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
                <HeartHandshake className="w-3.5 h-3.5" />
                Inter-Organizational Coalition Hub
              </div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Cross-NGO Collaboration Rooms</h1>
              <p className="text-slate-500 text-sm mt-1 max-w-2xl">
                Pool heavy logistics, co-ordinate shared disaster missions, and execute collective SDG programs without duplicate overheads.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                Charter New Coalition Room
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

        {/* Overview Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Active Coalitions</span>
            <div className="text-2xl font-bold text-slate-900 mt-1">{rooms.length} Rooms</div>
            <span className="text-xs text-emerald-600 mt-1 inline-block">100% Verified Nonprofits</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Pooled Volunteers</span>
            <div className="text-2xl font-bold text-slate-900 mt-1">
              {rooms.reduce((acc, r) => acc + (r.shared_volunteers_count || 0), 0)} Enrolled
            </div>
            <span className="text-xs text-slate-500 mt-1 inline-block">Cross-deployed in field</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Pooled Equipment & Assets</span>
            <div className="text-2xl font-bold text-slate-900 mt-1">
              {rooms.reduce((acc, r) => acc + (r.shared_resources?.length || 0), 0)} Shared Assets
            </div>
            <span className="text-xs text-emerald-600 mt-1 inline-block">Zero resource duplication</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Milestone Execution</span>
            <div className="text-2xl font-bold text-slate-900 mt-1">
              {rooms.reduce((acc, r) => acc + (r.joint_milestones?.filter(m => m.is_completed)?.length || 0), 0)} Completed
            </div>
            <span className="text-xs text-slate-500 mt-1 inline-block">Jointly audited in real-time</span>
          </div>
        </div>

        {/* Main 2-Column Split: Room List on Left, Active Room Workspace on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Room Directory */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Joint Coalitions</h3>
              <select
                value={filterCause}
                onChange={(e) => setFilterCause(e.target.value)}
                className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700"
              >
                <option value="all">All Sectors</option>
                <option value="water">Clean Water</option>
                <option value="education">Education</option>
                <option value="health">Public Health</option>
                <option value="environment">Environment</option>
              </select>
            </div>

            <div className="space-y-3">
              {filteredRooms.map(room => {
                const isSelected = selectedRoom?.id === room.id;
                const completedCount = room.joint_milestones?.filter(m => m.is_completed)?.length || 0;
                const totalMilestones = room.joint_milestones?.length || 0;
                const percent = totalMilestones > 0 ? Math.round((completedCount / totalMilestones) * 100) : 0;

                return (
                  <div
                    key={room.id}
                    onClick={() => setSelectedRoom(room)}
                    className={`cursor-pointer p-5 rounded-2xl border transition-all text-left ${
                      isSelected
                        ? 'bg-white border-emerald-500 shadow-md ring-2 ring-emerald-500/10'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                        {room.shared_cause}
                      </span>
                      <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                        <Users2 className="w-3.5 h-3.5 text-slate-400" />
                        {room.shared_volunteers_count} Volunteers
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm mt-2 line-clamp-1">{room.title}</h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{room.joint_goal}</p>

                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                      <div>
                        Lead: <strong className="text-slate-700">{room.lead_ngo_name}</strong>
                      </div>
                      <div className="font-semibold text-emerald-600">
                        {percent}% Done ({completedCount}/{totalMilestones})
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Room Workspace Detail */}
          <div className="lg:col-span-7">
            {selectedRoom ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6">
                
                {/* Header of Active Room */}
                <div className="border-b border-slate-100 pb-5">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                      {selectedRoom.shared_cause}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-600 text-white text-xs font-semibold rounded-full">
                      <Activity className="w-3.5 h-3.5" />
                      Active Mission Room
                    </span>
                  </div>

                  <h2 className="text-2xl font-bold text-slate-900 mt-2">{selectedRoom.title}</h2>
                  <p className="text-slate-600 text-sm mt-2 leading-relaxed">{selectedRoom.joint_goal}</p>

                  <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-500">
                    <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                      <Building2 className="w-4 h-4 text-emerald-600" />
                      <span>Lead: <strong className="text-slate-800">{selectedRoom.lead_ngo_name}</strong></span>
                    </div>

                    <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                      <HeartHandshake className="w-4 h-4 text-indigo-600" />
                      <span>Coalition Partner: <strong className="text-slate-800">{selectedRoom.partner_ngo_names?.join(', ') || 'Aarogya Seva'}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Shared Resources & Assets */}
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Truck className="w-4 h-4 text-emerald-600" />
                    Pooled Resources & Equipment
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {selectedRoom.shared_resources?.map((res, i) => (
                      <div key={i} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                        <div className="font-bold text-slate-800">{res.item}</div>
                        <div className="text-emerald-700 font-semibold">Qty: {res.quantity}</div>
                        <div className="text-slate-400 text-[11px] pt-1">By: {res.contributed_by}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Joint Milestones */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Target className="w-4 h-4 text-emerald-600" />
                      Shared Coalition Milestones
                    </h4>
                    <button
                      onClick={() => setShowAddMilestoneModal(true)}
                      className="text-xs text-emerald-600 font-semibold hover:text-emerald-700 flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Milestone
                    </button>
                  </div>

                  <div className="space-y-2">
                    {selectedRoom.joint_milestones?.map((m, idx) => (
                      <div
                        key={idx}
                        className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 text-xs ${
                          m.is_completed ? 'bg-emerald-50/50 border-emerald-200' : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {m.is_completed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          ) : (
                            <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                          )}
                          <span className={`font-medium ${m.is_completed ? 'text-slate-800 line-through' : 'text-slate-900'}`}>
                            {m.title}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 shrink-0">
                          {m.is_completed ? `Done on ${m.completed_date}` : `Due: ${m.due_date || 'In progress'}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Activity Feed */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-600" />
                    Coalition Joint Activity Log
                  </h4>

                  <div className="space-y-2">
                    {selectedRoom.activity_log?.map((log, i) => (
                      <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-3 text-xs">
                        <span className="font-mono text-slate-400 text-[11px] shrink-0">{log.date}</span>
                        <span className="text-slate-700 leading-snug">{log.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400">
                Select a coalition room to inspect joint operations.
              </div>
            )}
          </div>
        </div>

        {/* Create Coalition Room Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <HeartHandshake className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-lg font-bold text-slate-900">Charter Cross-NGO Coalition Room</h3>
                </div>
                <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateRoom} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Coalition Mission Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Drought Relief & Borewell Recharging Coalition"
                    value={newRoomTitle}
                    onChange={(e) => setNewRoomTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Lead NGO</label>
                    <select
                      value={newRoomLeadNgo}
                      onChange={(e) => setNewRoomLeadNgo(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800"
                    >
                      {ngos.map(n => (
                        <option key={n.id} value={n.id}>{n.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Partner NGO</label>
                    <select
                      value={newRoomPartnerNgos[0]}
                      onChange={(e) => setNewRoomPartnerNgos([e.target.value])}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800"
                    >
                      {ngos.map(n => (
                        <option key={n.id} value={n.id}>{n.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Shared Sector / Cause</label>
                  <select
                    value={newRoomCause}
                    onChange={(e) => setNewRoomCause(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800"
                  >
                    <option value="Clean Water & Public Health">Clean Water & Public Health</option>
                    <option value="Quality Education & STEM">Quality Education & STEM</option>
                    <option value="Emergency Relief & Disaster Response">Emergency Relief & Disaster Response</option>
                    <option value="Climate Action & Agroforestry">Climate Action & Agroforestry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Joint Mission Goal</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Describe specific joint milestones, target villages, and collective impact metrics..."
                    value={newRoomGoal}
                    onChange={(e) => setNewRoomGoal(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Shared Pooled Resources (Equipment / Staff)</label>
                  <div className="space-y-2">
                    {newRoomResources.map((res, i) => (
                      <div key={i} className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Item (e.g. Water Tanker 5000L)"
                          value={res.item}
                          onChange={(e) => {
                            const copy = [...newRoomResources];
                            copy[i].item = e.target.value;
                            setNewRoomResources(copy);
                          }}
                          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
                        />
                        <input
                          type="text"
                          placeholder="Qty"
                          value={res.quantity}
                          onChange={(e) => {
                            const copy = [...newRoomResources];
                            copy[i].quantity = e.target.value;
                            setNewRoomResources(copy);
                          }}
                          className="w-20 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
                        />
                        <input
                          type="text"
                          placeholder="Contributor"
                          value={res.contributed_by}
                          onChange={(e) => {
                            const copy = [...newRoomResources];
                            copy[i].contributed_by = e.target.value;
                            setNewRoomResources(copy);
                          }}
                          className="w-36 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-semibold hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creatingRoom}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-sm"
                  >
                    {creatingRoom ? 'Chartering Room...' : 'Charter Coalition Room'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Milestone Modal */}
        {showAddMilestoneModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-base font-bold text-slate-900">Add Joint Milestone</h3>
                </div>
                <button onClick={() => setShowAddMilestoneModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddMilestone} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Milestone Description</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Conduct Joint Field Water Audits in 8 Villages"
                    value={milestoneTitle}
                    onChange={(e) => setMilestoneTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Target Completion Date</label>
                  <input
                    type="date"
                    required
                    value={milestoneDueDate}
                    onChange={(e) => setMilestoneDueDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddMilestoneModal(false)}
                    className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={addingMilestone}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-sm"
                  >
                    {addingMilestone ? 'Adding...' : 'Attach Milestone'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
