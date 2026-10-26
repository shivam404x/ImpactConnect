import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Users, 
  CheckCircle2, 
  Plus, 
  X, 
  AlertCircle, 
  Sparkles, 
  Building2, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  Check,
  HeartHandshake
} from 'lucide-react';
import { 
  fetchVolunteerShifts, 
  createVolunteerShift, 
  registerForShift, 
  fetchUserShiftCommitments 
} from '../utils/api';
import { translations } from '../data/translations';

export default function SmartAvailabilityCalendar({
  currentUser,
  language = 'en',
  onOpenAuth
}) {
  const t = translations[language] || translations.en;

  const [activeTab, setActiveTab] = useState('browse'); // 'browse' | 'my-commitments'
  const [shifts, setShifts] = useState([]);
  const [myCommitments, setMyCommitments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Registration Modal
  const [registeringShift, setRegisteringShift] = useState(null);
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    selected_skills: '',
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [regError, setRegError] = useState(null);
  const [regSuccess, setRegSuccess] = useState(false);

  // Publish Shift Modal (for NGOs)
  const [isPublishingShift, setIsPublishingShift] = useState(false);
  const [newShiftData, setNewShiftData] = useState({
    title: '',
    project_id: 'proj-1',
    project_title: 'Clean Water Wells & Solar Micro-Grids',
    ngo_id: currentUser?.ngo_id || 'ngo-1',
    ngo_name: currentUser?.organization_name || 'Aashray Rural Trust',
    description: '',
    shift_date: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
    start_time: '09:00 AM',
    end_time: '01:00 PM',
    location: 'Ward 17 Community Center, Mumbai',
    capacity: 10,
    required_skills: 'Teaching, Mentoring, Community Outreach',
    category: 'education'
  });
  const [publishing, setPublishing] = useState(false);

  const loadShifts = async () => {
    setLoading(true);
    try {
      const [allShifts, commitments] = await Promise.all([
        fetchVolunteerShifts({ category: selectedCategory }),
        currentUser?.email ? fetchUserShiftCommitments(currentUser.email).catch(() => []) : Promise.resolve([])
      ]);
      setShifts(allShifts);
      setMyCommitments(commitments);
    } catch (err) {
      console.error('Error loading shifts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShifts();
  }, [selectedCategory, currentUser]);

  const handleOpenRegister = (shift) => {
    if (!currentUser) {
      if (onOpenAuth) onOpenAuth('login');
      return;
    }
    setRegisteringShift(shift);
    setFormData({
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      phone: currentUser?.phone || '+91 98200 12345',
      selected_skills: currentUser?.skills ? currentUser.skills.join(', ') : 'Community outreach',
      notes: ''
    });
    setRegError(null);
    setRegSuccess(false);
  };

  const handleSubmitRegistration = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      setRegError('Name and email are required');
      return;
    }
    setSubmitting(true);
    setRegError(null);
    try {
      await registerForShift(registeringShift.id, {
        volunteer_id: currentUser?.id || 'demo-vol',
        volunteer_name: formData.name,
        volunteer_email: formData.email,
        volunteer_phone: formData.phone,
        selected_skills: formData.selected_skills.split(',').map(s => s.trim()),
        notes: formData.notes
      });
      setRegSuccess(true);
      setTimeout(() => {
        setRegisteringShift(null);
        setRegSuccess(false);
        loadShifts();
      }, 1600);
    } catch (err) {
      setRegError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePublishShift = async (e) => {
    e.preventDefault();
    if (!newShiftData.title || !newShiftData.location || !newShiftData.capacity) {
      alert('Please fill out all mandatory shift fields.');
      return;
    }
    setPublishing(true);
    try {
      await createVolunteerShift({
        ...newShiftData,
        capacity: Number(newShiftData.capacity),
        required_skills: newShiftData.required_skills.split(',').map(s => s.trim())
      });
      setIsPublishingShift(false);
      loadShifts();
    } catch (err) {
      alert('Failed to publish shift: ' + err.message);
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="bg-[#FAFAFA] min-h-screen py-10 sm:py-14 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 text-[#16A36A] border border-emerald-200/80 text-xs font-bold mb-3">
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Smart Availability & Shift Management</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {t.calendarTitle || 'Smart Volunteering Calendar & Shifts'}
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              {t.calendarSubtitle || 'Browse time-slotted community shifts, select your availability, avoid scheduling conflicts, and register with real-time capacity validation.'}
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {currentUser?.role === 'ngo' && (
              <button
                onClick={() => setIsPublishingShift(true)}
                className="px-4 py-2.5 rounded-xl bg-[#16A36A] hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center space-x-2 shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>{t.publishShift || 'Publish Shift'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab & Category Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          {/* Tabs */}
          <div className="flex bg-white rounded-2xl p-1 shadow-xs border border-slate-200 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('browse')}
              className={`px-5 py-2.5 text-xs font-bold rounded-xl transition flex items-center space-x-2 ${
                activeTab === 'browse'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>{t.upcomingShifts || 'Available Shifts'} ({shifts.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('my-commitments')}
              className={`px-5 py-2.5 text-xs font-bold rounded-xl transition flex items-center space-x-2 ${
                activeTab === 'my-commitments'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.myCommitments || 'My Commitments'} ({myCommitments.length})</span>
            </button>
          </div>

          {/* Category Dropdown Filter */}
          {activeTab === 'browse' && (
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-500">Cause:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
              >
                <option value="all">All Causes</option>
                <option value="education">Education</option>
                <option value="environment">Environment</option>
                <option value="healthcare">Healthcare</option>
                <option value="clean_water">Clean Water</option>
              </select>
            </div>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(n => (
              <div key={n} className="bg-white rounded-3xl p-6 border border-slate-200 h-64 animate-pulse" />
            ))}
          </div>
        )}

        {/* Tab 1: Available Shifts Grid */}
        {!loading && activeTab === 'browse' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shifts.map(shift => {
              const remaining = Math.max(0, shift.capacity - shift.registered_count);
              const isFull = remaining === 0 || shift.status === 'filled';
              const capacityPercent = Math.min(100, Math.round((shift.registered_count / shift.capacity) * 100));

              return (
                <div
                  key={shift.id}
                  className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:shadow-lg transition flex flex-col justify-between space-y-5"
                >
                  <div className="space-y-3">
                    {/* Header info */}
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {shift.category?.replace(/_/g, ' ')}
                      </span>

                      {/* Status / Remaining slots */}
                      {isFull ? (
                        <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                          {t.shiftFull || 'Shift Full'}
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-sky-50 text-sky-800 border border-sky-200">
                          {remaining} {t.slotsRemaining || 'slots left'}
                        </span>
                      )}
                    </div>

                    {/* NGO Name */}
                    <div className="flex items-center space-x-1.5 text-xs text-slate-500">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-bold text-slate-700 truncate">{shift.ngo_name}</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      {shift.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2">{shift.description}</p>

                    {/* Time & Location Details */}
                    <div className="space-y-1.5 pt-2 text-xs text-slate-600">
                      <div className="flex items-center space-x-2">
                        <CalendarIcon className="w-3.5 h-3.5 text-[#16A36A] shrink-0" />
                        <span className="font-semibold text-slate-800">{new Date(shift.shift_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{shift.start_time} - {shift.end_time}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{shift.location}</span>
                      </div>
                    </div>

                    {/* Capacity Progress Bar */}
                    <div className="pt-2">
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="text-slate-500 font-semibold">Volunteer Capacity</span>
                        <span className="font-bold text-slate-800">{shift.registered_count} / {shift.capacity} Filled</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            isFull ? 'bg-slate-400' : capacityPercent > 75 ? 'bg-amber-500' : 'bg-[#16A36A]'
                          }`}
                          style={{ width: `${capacityPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Required Skills */}
                    {shift.required_skills && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {shift.required_skills.slice(0, 3).map(sk => (
                          <span key={sk} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                            {sk}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Register Button */}
                  <button
                    disabled={isFull}
                    onClick={() => handleOpenRegister(shift)}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
                      isFull
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                        : 'bg-[#16A36A] hover:bg-emerald-700 text-white shadow-xs'
                    }`}
                  >
                    <HeartHandshake className="w-4 h-4" />
                    <span>{isFull ? (t.shiftFull || 'Shift Full') : (t.registerShift || 'Register for Shift')}</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 2: My Commitments */}
        {!loading && activeTab === 'my-commitments' && (
          <div className="space-y-4 max-w-3xl mx-auto">
            {myCommitments.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-3">
                <CalendarIcon className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-800">No Volunteer Shifts Registered Yet</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Browse available shifts and register to help community organizations near you.
                </p>
                <button
                  onClick={() => setActiveTab('browse')}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-black transition shadow-sm"
                >
                  Explore Available Shifts
                </button>
              </div>
            ) : (
              myCommitments.map(com => (
                <div
                  key={com.id}
                  className="bg-white rounded-3xl border border-emerald-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold uppercase">
                        {(com?.status || 'confirmed').toUpperCase()} CONFIRMATION
                      </span>
                      <span className="text-xs text-slate-400">• Reg ID: {com.id}</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900">{com.shift?.title || 'Community Shift'}</h3>
                    <p className="text-xs text-slate-500">{com.shift?.ngo_name} • {com.shift?.location}</p>
                    <div className="flex items-center space-x-4 text-xs font-semibold text-slate-700 pt-1">
                      <span className="flex items-center space-x-1">
                        <CalendarIcon className="w-3.5 h-3.5 text-[#16A36A]" />
                        <span>{com.shift?.shift_date}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{com.shift?.start_time} - {com.shift?.end_time}</span>
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-emerald-50 text-[#16A36A] font-bold text-xs border border-emerald-200">
                      <Check className="w-4 h-4" />
                      <span>{t.confirmedBadge || 'Confirmed Slot'}</span>
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

      </div>

      {/* Register Shift Modal */}
      {registeringShift && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setRegisteringShift(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 text-xs font-bold"
            >
              ✕
            </button>

            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#16A36A] mb-1">
              <CalendarIcon className="w-4 h-4" />
              <span>Shift Registration</span>
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-1">{registeringShift.title}</h3>
            <p className="text-xs text-slate-500 mb-4">{registeringShift.ngo_name} • {registeringShift.shift_date} ({registeringShift.start_time})</p>

            {regError && (
              <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{regError}</span>
              </div>
            )}

            {regSuccess ? (
              <div className="p-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-[#16A36A] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="text-base font-bold text-slate-900">Shift Confirmed!</h4>
                <p className="text-xs text-slate-500">Your volunteer shift registration has been recorded and a confirmation has been dispatched to your notification center.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitRegistration} className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">Volunteer Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">Notes / Equipment you can bring</label>
                  <textarea
                    rows={2}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="e.g. Bringing personal teaching aids, water bottle, gloves..."
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                  />
                </div>

                <div className="flex items-center justify-end space-x-3 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setRegisteringShift(null)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 rounded-xl bg-[#16A36A] hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition disabled:opacity-50"
                  >
                    {submitting ? 'Registering...' : 'Confirm Registration'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Publish Shift Modal (NGO only) */}
      {isPublishingShift && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsPublishingShift(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 text-xs font-bold"
            >
              ✕
            </button>

            <h3 className="text-lg font-black text-slate-900 mb-1">Publish New Volunteering Shift</h3>
            <p className="text-xs text-slate-500 mb-4">Set dates, physical capacity, and skill requirements for community volunteers.</p>

            <form onSubmit={handlePublishShift} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">Shift Title *</label>
                <input
                  type="text"
                  required
                  value={newShiftData.title}
                  onChange={(e) => setNewShiftData({ ...newShiftData, title: e.target.value })}
                  placeholder="e.g. Weekend Tree Plantation Drive"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">Description *</label>
                <textarea
                  rows={2}
                  required
                  value={newShiftData.description}
                  onChange={(e) => setNewShiftData({ ...newShiftData, description: e.target.value })}
                  placeholder="Explain volunteer responsibilities during this time slot..."
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={newShiftData.shift_date}
                    onChange={(e) => setNewShiftData({ ...newShiftData, shift_date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">Capacity (Max Volunteers) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newShiftData.capacity}
                    onChange={(e) => setNewShiftData({ ...newShiftData, capacity: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">Start Time *</label>
                  <input
                    type="text"
                    required
                    value={newShiftData.start_time}
                    onChange={(e) => setNewShiftData({ ...newShiftData, start_time: e.target.value })}
                    placeholder="09:00 AM"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">End Time *</label>
                  <input
                    type="text"
                    required
                    value={newShiftData.end_time}
                    onChange={(e) => setNewShiftData({ ...newShiftData, end_time: e.target.value })}
                    placeholder="01:00 PM"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">Location Address *</label>
                <input
                  type="text"
                  required
                  value={newShiftData.location}
                  onChange={(e) => setNewShiftData({ ...newShiftData, location: e.target.value })}
                  placeholder="Street, Community hall, Ward, City"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">Required Skills (Comma separated)</label>
                <input
                  type="text"
                  value={newShiftData.required_skills}
                  onChange={(e) => setNewShiftData({ ...newShiftData, required_skills: e.target.value })}
                  placeholder="Teaching, Gardening, Vital Signs, Logistics"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsPublishingShift(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={publishing}
                  className="px-6 py-2.5 rounded-xl bg-[#16A36A] hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition"
                >
                  {publishing ? 'Publishing...' : 'Publish Shift to Platform'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}