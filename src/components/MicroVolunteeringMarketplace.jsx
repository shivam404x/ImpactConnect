import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Zap, 
  MapPin, 
  Globe2, 
  Send, 
  FileText, 
  Award, 
  Filter, 
  RefreshCw,
  X,
  ExternalLink,
  ShieldCheck,
  Check,
  AlertCircle
} from 'lucide-react';
import { fetchMicroTasks, applyForMicroTask, submitMicroTaskWork, reviewMicroTask } from '../utils/api';

export default function MicroVolunteeringMarketplace({
  currentUser,
  onOpenAuth,
  language = 'en'
}) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRemote, setFilterRemote] = useState('all'); // 'all' | 'true' | 'false'

  // Application & Submission Modals
  const [selectedTaskForApply, setSelectedTaskForApply] = useState(null);
  const [volunteerName, setVolunteerName] = useState(currentUser?.name || 'Marcus Chen');
  const [volunteerEmail, setVolunteerEmail] = useState(currentUser?.email || 'marcus.chen@apextech.com');
  const [skillsNote, setSkillsNote] = useState('');
  const [submittingApply, setSubmittingApply] = useState(false);

  const [selectedTaskForSubmit, setSelectedTaskForSubmit] = useState(null);
  const [workLinkOrText, setWorkLinkOrText] = useState('');
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [submittingWork, setSubmittingWork] = useState(false);
  const [actionMessage, setActionMessage] = useState(null);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const data = await fetchMicroTasks({ is_remote: filterRemote });
      setTasks(data);
    } catch (err) {
      console.error('Error fetching micro-tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [filterRemote]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!selectedTaskForApply) return;
    setSubmittingApply(true);
    try {
      await applyForMicroTask(selectedTaskForApply.id, {
        volunteer_name: volunteerName,
        volunteer_email: volunteerEmail,
        skills_note: skillsNote
      });
      setActionMessage({ success: true, text: 'Application accepted! You are registered for this micro-task.' });
      loadTasks();
      setTimeout(() => {
        setSelectedTaskForApply(null);
        setActionMessage(null);
      }, 1500);
    } catch (err) {
      setActionMessage({ success: false, text: err.message || 'Failed to apply' });
    } finally {
      setSubmittingApply(false);
    }
  };

  const handleSubmitWork = async (e) => {
    e.preventDefault();
    if (!selectedTaskForSubmit) return;
    setSubmittingWork(true);
    try {
      await submitMicroTaskWork(selectedTaskForSubmit.id, {
        volunteer_name: volunteerName,
        volunteer_email: volunteerEmail,
        work_link_or_text: workLinkOrText,
        notes: submissionNotes
      });
      setActionMessage({ success: true, text: 'Work submitted for NGO review! Verified hours will be credited upon approval.' });
      loadTasks();
      setTimeout(() => {
        setSelectedTaskForSubmit(null);
        setActionMessage(null);
      }, 1800);
    } catch (err) {
      setActionMessage({ success: false, text: err.message || 'Failed to submit work' });
    } finally {
      setSubmittingWork(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Banner */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xs relative">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#16A36A] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-flex items-center space-x-1.5">
              <Zap className="w-3.5 h-3.5 text-[#16A36A]" />
              <span>Bite-Sized High-Impact Tasks (1-3 Hours)</span>
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Micro-Volunteering Marketplace
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              Make a tangible difference even if you only have a single lunch break or weekend hour. Proofread curriculum, digitize field lab records, design infographics, or verify local trees.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-6">
            <span className="text-xs font-bold text-slate-400 mr-2 flex items-center space-x-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Task Location:</span>
            </span>
            {[
              { id: 'all', label: 'All Tasks' },
              { id: 'true', label: '100% Remote' },
              { id: 'false', label: 'On-Site Field' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilterRemote(f.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  filterRemote === f.id
                    ? 'bg-[#16A36A] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Action feedback toast */}
        {actionMessage && (
          <div className={`p-4 rounded-2xl text-xs font-bold flex items-center space-x-2 ${
            actionMessage.success ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}>
            {actionMessage.success ? <CheckCircle2 className="w-4 h-4 text-[#16A36A]" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
            <span>{actionMessage.text}</span>
          </div>
        )}

        {/* Task Grid */}
        {loading ? (
          <div className="py-20 text-center">
            <RefreshCw className="w-8 h-8 animate-spin text-[#16A36A] mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-500">Loading Micro-Tasks...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {tasks.map(t => (
              <div key={t.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-5 hover:border-slate-300 transition">
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      {t.ngo_name}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      t.is_remote ? 'bg-blue-50 text-blue-800 border border-blue-200' : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}>
                      {t.is_remote ? 'Remote Task' : 'On-Site Field'}
                    </span>
                  </div>

                  <h3 className="text-base font-black text-slate-900 leading-snug">
                    {t.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center space-x-1 font-bold text-slate-800">
                      <Clock className="w-3.5 h-3.5 text-[#16A36A]" />
                      <span>{t.estimated_hours} Hours Est.</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <Award className="w-3.5 h-3.5 text-amber-500" />
                      <span>+{t.reward_points} Impact Points</span>
                    </span>
                    <span>•</span>
                    <span>Deadline: {t.deadline}</span>
                  </div>

                  {/* Completion Criteria */}
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Deliverable / Completion Criteria:</span>
                    <p className="text-slate-700 leading-relaxed font-medium">
                      {t.completion_criteria}
                    </p>
                  </div>

                  {/* Required Skills */}
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Skills:</span>
                    <div className="flex flex-wrap gap-1">
                      {t.required_skills?.map((sk, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-100">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setSelectedTaskForApply(t)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition flex items-center justify-center space-x-1"
                  >
                    <span>Claim / Register ({t.applicants_count || 0})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedTaskForSubmit(t)}
                    className="flex-1 py-2.5 rounded-xl btn-primary text-xs font-bold flex items-center justify-center space-x-1 shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Work</span>
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>

      {/* CLAIM / APPLY MODAL */}
      {selectedTaskForApply && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 relative">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#16A36A] bg-emerald-50 px-2 py-0.5 rounded-full">
                Claim Task
              </span>
              <h3 className="text-base font-black text-slate-900 mt-1">{selectedTaskForApply.title}</h3>
            </div>

            <form onSubmit={handleApply} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={volunteerName}
                  onChange={(e) => setVolunteerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={volunteerEmail}
                  onChange={(e) => setVolunteerEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Relevant Skills & Experience</label>
                <textarea
                  rows={2}
                  value={skillsNote}
                  onChange={(e) => setSkillsNote(e.target.value)}
                  placeholder="e.g. Fluent in Hindi, experienced in proofreading..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedTaskForApply(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingApply}
                  className="flex-1 py-2.5 rounded-xl btn-primary text-xs font-bold flex items-center justify-center space-x-1.5 shadow-sm"
                >
                  <Check className="w-4 h-4" />
                  <span>{submittingApply ? 'Claiming...' : 'Confirm Claim'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUBMIT WORK MODAL */}
      {selectedTaskForSubmit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 relative">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#16A36A] bg-emerald-50 px-2 py-0.5 rounded-full">
                Work Submission & Hour Credit
              </span>
              <h3 className="text-base font-black text-slate-900 mt-1">{selectedTaskForSubmit.title}</h3>
            </div>

            <form onSubmit={handleSubmitWork} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Work Link (Google Drive / GitHub / Sheet) or Text Output</label>
                <textarea
                  rows={3}
                  required
                  value={workLinkOrText}
                  onChange={(e) => setWorkLinkOrText(e.target.value)}
                  placeholder="Paste link to your completed deliverable or enter the translated text / data here..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Notes for NGO Reviewer</label>
                <input
                  type="text"
                  value={submissionNotes}
                  onChange={(e) => setSubmissionNotes(e.target.value)}
                  placeholder="e.g. All 15 physics terms checked with NCERT glossary."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500">
                <strong>Hour Certification:</strong> Upon approval by {selectedTaskForSubmit.ngo_name}, <strong>{selectedTaskForSubmit.estimated_hours} verified hours</strong> will be permanently added to your Volunteer Contribution Passport.
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedTaskForSubmit(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingWork}
                  className="flex-1 py-2.5 rounded-xl btn-primary text-xs font-bold flex items-center justify-center space-x-1.5 shadow-sm"
                >
                  <Send className="w-4 h-4" />
                  <span>{submittingWork ? 'Submitting...' : 'Submit Deliverable'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
