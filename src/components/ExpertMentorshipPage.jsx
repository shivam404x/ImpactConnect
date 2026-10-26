import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Star, 
  Calendar, 
  Clock, 
  Video, 
  CheckCircle2, 
  ShieldCheck, 
  Search, 
  MessageSquare, 
  Sparkles, 
  ArrowRight,
  RefreshCw,
  X,
  ExternalLink,
  Check
} from 'lucide-react';
import { fetchExpertMentors, bookMentorshipSession, fetchMentorshipSessions, completeMentorshipSession } from '../utils/api';

export default function ExpertMentorshipPage({
  currentUser,
  onOpenAuth,
  language = 'en'
}) {
  const [mentors, setMentors] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('directory'); // 'directory' | 'my_sessions'

  // Booking Modal
  const [bookingMentor, setBookingMentor] = useState(null);
  const [consultationTopic, setConsultationTopic] = useState('FCRA Governance & Statutory Audit Review');
  const [scheduledDate, setScheduledDate] = useState(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10));
  const [timeSlot, setTimeSlot] = useState('04:00 PM - 04:45 PM IST');
  const [sessionNotes, setSessionNotes] = useState('');
  const [submittingBooking, setSubmittingBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [mList, sList] = await Promise.all([
        fetchExpertMentors({ search }),
        fetchMentorshipSessions({ ngo_id: currentUser?.ngo_id || 'ngo-1' })
      ]);
      setMentors(mList);
      setSessions(sList);
    } catch (err) {
      console.error('Error fetching mentorship data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [search]);

  const handleOpenBook = (mentor) => {
    setBookingMentor(mentor);
    setBookingSuccess(false);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!bookingMentor) return;

    setSubmittingBooking(true);
    try {
      await bookMentorshipSession(bookingMentor.id, {
        ngo_id: currentUser?.ngo_id || 'ngo-1',
        ngo_name: currentUser?.name || 'Verified Community NGO',
        topic: consultationTopic,
        scheduled_date: scheduledDate,
        time_slot: timeSlot,
        notes: sessionNotes
      });
      setBookingSuccess(true);
      loadData();
      setTimeout(() => {
        setBookingMentor(null);
        setBookingSuccess(false);
        setActiveTab('my_sessions');
      }, 1600);
    } catch (err) {
      alert(err.message || 'Failed to book session');
    } finally {
      setSubmittingBooking(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Hero */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xs relative">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#16A36A] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-flex items-center space-x-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-[#16A36A]" />
              <span>Pro-Bono Professional Network</span>
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Expert Mentorship Network
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              Connect grassroots social enterprises with senior legal advisors, chartered accountants, public health epidemiologists, and social tech architects. Schedule 1-on-1 strategic advisory sessions at zero cost.
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setActiveTab('directory')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  activeTab === 'directory' ? 'bg-[#16A36A] text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Browse Verified Mentors ({mentors.length})
              </button>
              <button
                onClick={() => setActiveTab('my_sessions')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                  activeTab === 'my_sessions' ? 'bg-[#16A36A] text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>My Advisory Sessions ({sessions.length})</span>
              </button>
            </div>

            {activeTab === 'directory' && (
              <div className="relative w-72 hidden sm:block">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search skills, FCRA, legal, audit..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                />
              </div>
            )}
          </div>
        </div>

        {/* TAB 1: MENTORS DIRECTORY */}
        {activeTab === 'directory' && (
          <div>
            {loading ? (
              <div className="py-20 text-center">
                <RefreshCw className="w-8 h-8 animate-spin text-[#16A36A] mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-500">Loading Expert Network...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {mentors.map(m => (
                  <div key={m.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-5 hover:border-slate-300 transition">
                    
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <img src={m.avatar} alt={m.name} className="w-14 h-14 rounded-2xl object-cover ring-2 ring-emerald-500/20" />
                        <div>
                          <h3 className="text-sm font-black text-slate-900 leading-snug">{m.name}</h3>
                          <div className="text-[11px] font-semibold text-[#16A36A]">{m.organization}</div>
                          <div className="flex items-center space-x-1 text-[11px] text-amber-500 font-bold mt-0.5">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span>{m.rating} ({m.completed_consultations} sessions)</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-xs font-bold text-slate-700">{m.title}</div>
                      <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-3">{m.bio}</p>

                      <div className="space-y-1 pt-2 border-t border-slate-100">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Expertise Areas:</span>
                        <div className="flex flex-wrap gap-1">
                          {m.expertise_areas?.map((ex, i) => (
                            <span key={i} className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-100">
                              {ex}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-xl flex items-center space-x-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="line-clamp-1">{m.availability}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOpenBook(m)}
                      className="w-full py-2.5 rounded-xl btn-primary text-xs font-bold flex items-center justify-center space-x-1.5 shadow-xs"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Request Pro-Bono Session</span>
                    </button>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MY ADVISORY SESSIONS */}
        {activeTab === 'my_sessions' && (
          <div className="space-y-4 max-w-3xl mx-auto">
            {sessions.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-2">
                <Video className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-800">No scheduled mentorship sessions yet.</h3>
                <p className="text-xs text-slate-500">Switch to the directory tab to request a pro-bono consultation.</p>
              </div>
            ) : (
              sessions.map(s => (
                <div key={s.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#16A36A] bg-emerald-50 px-2 py-0.5 rounded-full">
                        Advisory Session
                      </span>
                      <h3 className="text-base font-black text-slate-900 mt-1">{s.topic}</h3>
                      <p className="text-xs text-slate-500">With Advisor: <strong className="text-slate-800">{s.mentor_name}</strong></p>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider self-start sm:self-auto ${
                      s.status === 'completed' ? 'bg-slate-100 text-slate-700' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    }`}>
                      {s.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-2xl">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-[#16A36A]" />
                      <span>{s.scheduled_date} • {s.time_slot}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ShieldCheck className="w-4 h-4 text-[#16A36A]" />
                      <span>End-to-End Encrypted Consultation</span>
                    </div>
                  </div>

                  {s.notes && (
                    <p className="text-xs text-slate-500 italic">"{s.notes}"</p>
                  )}

                  {s.status === 'confirmed' && s.meeting_link && (
                    <a
                      href={s.meeting_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#16A36A] hover:bg-emerald-600 text-white font-bold text-xs transition"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Join Video Consultation Room</span>
                      <ExternalLink className="w-3.5 h-3.5 ml-1" />
                    </a>
                  )}
                </div>
              ))
            )}
          </div>
        )}

      </div>

      {/* BOOKING MODAL */}
      {bookingMentor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 relative">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#16A36A] bg-emerald-50 px-2 py-0.5 rounded-full">
                Pro-Bono Consultation Request
              </span>
              <h3 className="text-base font-black text-slate-900 mt-1">
                Book Session with {bookingMentor.name}
              </h3>
            </div>

            {bookingSuccess ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-[#16A36A] mx-auto" />
                <h4 className="text-sm font-black text-emerald-900">Session Scheduled Successfully!</h4>
                <p className="text-xs text-emerald-700">A calendar invite and secure meeting room link have been generated.</p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Advisory Topic</label>
                  <input
                    type="text"
                    required
                    value={consultationTopic}
                    onChange={(e) => setConsultationTopic(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Date</label>
                    <input
                      type="date"
                      required
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Time Slot</label>
                    <input
                      type="text"
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Describe Challenges / Agenda</label>
                  <textarea
                    rows={3}
                    value={sessionNotes}
                    onChange={(e) => setSessionNotes(e.target.value)}
                    placeholder="Provide context so the advisor can prepare specific statutory templates or budget sheets."
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                  />
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setBookingMentor(null)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingBooking}
                    className="flex-1 py-2.5 rounded-xl btn-primary text-xs font-bold flex items-center justify-center space-x-1.5 shadow-sm"
                  >
                    <Check className="w-4 h-4" />
                    <span>{submittingBooking ? 'Scheduling...' : 'Confirm Booking'}</span>
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
