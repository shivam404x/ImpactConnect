import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Users, 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  ShieldCheck, 
  Download, 
  Sparkles, 
  ArrowRight, 
  AlertCircle,
  Briefcase,
  Check,
  RefreshCw
} from 'lucide-react';
import { fetchEmployeeVolunteeringPrograms, registerForEmployeeProgram, fetchEmployeeVolunteeringMetrics } from '../utils/api';

const CORPORATE_COMPANIES = [
  { domain: 'apextech.com', name: 'Apex Technologies', brandColor: '#16A36A', logo: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=120&q=80' },
  { domain: 'tcs.com', name: 'Tata Consultancy CSR', brandColor: '#2563EB', logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=120&q=80' },
  { domain: 'infosys.com', name: 'Infosys Foundation', brandColor: '#7C3AED', logo: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=120&q=80' }
];

export default function EmployeeVolunteeringPortal({
  currentUser,
  onOpenAuth,
  language = 'en'
}) {
  const [selectedCompany, setSelectedCompany] = useState(CORPORATE_COMPANIES[0]);
  const [programs, setPrograms] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  // Registration modal
  const [activeProgram, setActiveProgram] = useState(null);
  const [employeeName, setEmployeeName] = useState(currentUser?.name || 'Marcus Chen');
  const [employeeEmail, setEmployeeEmail] = useState(currentUser?.email || 'marcus.chen@apextech.com');
  const [department, setDepartment] = useState('Cloud Solutions Engineering');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [submittingReg, setSubmittingReg] = useState(false);
  const [regSuccess, setRegSuccess] = useState(false);
  const [regError, setRegError] = useState(null);

  const loadCorporateData = async () => {
    setLoading(true);
    try {
      const [progs, met] = await Promise.all([
        fetchEmployeeVolunteeringPrograms({ company_domain: selectedCompany.domain }),
        fetchEmployeeVolunteeringMetrics(selectedCompany.domain)
      ]);
      setPrograms(progs);
      setMetrics(met);
    } catch (err) {
      console.error('Error fetching corporate volunteering data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCorporateData();
  }, [selectedCompany]);

  const handleOpenRegister = (prog) => {
    setActiveProgram(prog);
    setSelectedSkill(prog.required_skills?.[0] || 'General Field Support');
    setRegSuccess(false);
    setRegError(null);
  };

  const handleSubmitRegistration = async (e) => {
    e.preventDefault();
    if (!activeProgram) return;

    setSubmittingReg(true);
    setRegError(null);
    try {
      await registerForEmployeeProgram(activeProgram.id, {
        employee_name: employeeName,
        employee_email: employeeEmail,
        department,
        selected_skill: selectedSkill
      });
      setRegSuccess(true);
      loadCorporateData();
      setTimeout(() => {
        setActiveProgram(null);
        setRegSuccess(false);
      }, 1600);
    } catch (err) {
      setRegError(err.message || 'Registration failed.');
    } finally {
      setSubmittingReg(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header with Company Selector */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-wider text-[#16A36A] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-flex items-center space-x-1.5">
                <Briefcase className="w-3.5 h-3.5 text-[#16A36A]" />
                <span>Corporate Social Responsibility</span>
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Employee Volunteering Portal
              </h1>
              <p className="text-sm text-slate-600 leading-relaxed">
                Connect your workforce directly with verified grassroots impact missions. Track corporate volunteering hours, manage employee shift allocations, and download auditable CSR reports for MCA Section 135 compliance.
              </p>
            </div>

            {/* Corporate Switcher */}
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 block px-1">
                Corporate Workplace:
              </span>
              <div className="flex flex-col sm:flex-row gap-2">
                {CORPORATE_COMPANIES.map(comp => (
                  <button
                    key={comp.domain}
                    onClick={() => setSelectedCompany(comp)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
                      selectedCompany.domain === comp.domain
                        ? 'bg-white shadow-xs text-slate-900 border border-slate-300'
                        : 'text-slate-600 hover:bg-slate-200/60'
                    }`}
                  >
                    <img src={comp.logo} alt={comp.name} className="w-5 h-5 rounded-md object-cover" />
                    <span>{comp.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Metrics Ribbon */}
          {metrics && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-8 border-t border-slate-100">
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100">
                <span className="text-xs font-bold text-emerald-800">Total Volunteer Hours Clocked</span>
                <div className="text-2xl font-black text-[#16A36A] mt-1">{metrics.totalVolunteerHours} hrs</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-bold text-slate-600">Active Employee Volunteers</span>
                <div className="text-2xl font-black text-slate-900 mt-1">{metrics.totalVolunteersParticipated}</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-bold text-slate-600">Company Programs</span>
                <div className="text-2xl font-black text-slate-900 mt-1">{metrics.totalPrograms}</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                <span className="text-xs font-bold text-slate-600">CSR Statutory Audit</span>
                <span className="inline-flex items-center space-x-1 text-xs font-bold text-emerald-700 mt-1">
                  <ShieldCheck className="w-4 h-4 text-[#16A36A]" />
                  <span>100% Verified</span>
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Available Programs List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Corporate Volunteering Drives ({programs.length})
              </h2>
              <p className="text-xs text-slate-500">
                Approved CSR programs with guaranteed spots for {selectedCompany.name} staff.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="py-20 text-center">
              <RefreshCw className="w-8 h-8 animate-spin text-[#16A36A] mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-500">Loading Corporate Programs...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {programs.map(prog => {
                const filledRatio = Math.round((prog.registered_count / prog.total_slots) * 100);
                const isFull = prog.registered_count >= prog.total_slots;

                return (
                  <div key={prog.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-5 hover:border-slate-300 transition">
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
                        <span className="text-[#16A36A] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                          {prog.cause}
                        </span>
                        <span className="text-slate-400">
                          NGO: {prog.partner_ngo}
                        </span>
                      </div>

                      <h3 className="text-base font-black text-slate-900 leading-snug">
                        {prog.title}
                      </h3>
                      
                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                        {prog.description}
                      </p>

                      <div className="space-y-1.5 text-xs text-slate-500 pt-2 border-t border-slate-100">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{prog.date} • {prog.timing}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-3.5 h-3.5 text-[#16A36A]" />
                          <span>{prog.location}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{prog.hours_per_slot} CSR Hours Credited / Person</span>
                        </div>
                      </div>

                      {/* Required Skills Badges */}
                      <div className="pt-2">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                          Preferred Employee Skills:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {prog.required_skills?.map((sk, i) => (
                            <span key={i} className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-700">
                              {sk}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Slot Capacity & Action */}
                    <div className="pt-3 border-t border-slate-100 space-y-3">
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-bold text-slate-700">Slot Availability</span>
                          <span className="font-mono text-slate-500">
                            {prog.registered_count} / {prog.total_slots} Slots
                          </span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            style={{ width: `${filledRatio}%` }}
                            className={`h-full ${isFull ? 'bg-rose-500' : 'bg-[#16A36A]'}`}
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        disabled={isFull}
                        onClick={() => handleOpenRegister(prog)}
                        className="w-full py-2.5 rounded-xl btn-primary text-xs font-bold flex items-center justify-center space-x-1.5 shadow-xs disabled:opacity-40"
                      >
                        <Users className="w-4 h-4" />
                        <span>{isFull ? 'Session Full' : 'Register as Corporate Volunteer'}</span>
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* REGISTRATION MODAL */}
      {activeProgram && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 relative">
            
            <div className="border-b border-slate-100 pb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#16A36A] bg-emerald-50 px-2.5 py-0.5 rounded-full">
                {selectedCompany.name} CSR Drive
              </span>
              <h3 className="text-base font-black text-slate-900 mt-1">
                {activeProgram.title}
              </h3>
            </div>

            {regSuccess ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-[#16A36A] mx-auto" />
                <h4 className="text-sm font-black text-emerald-900">Registration Confirmed!</h4>
                <p className="text-xs text-emerald-700">
                  Your volunteering spot is secured. An email with venue directions has been dispatched.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitRegistration} className="space-y-3">
                {regError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{regError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Employee Full Name</label>
                  <input
                    type="text"
                    required
                    value={employeeName}
                    onChange={(e) => setEmployeeName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Corporate Work Email</label>
                  <input
                    type="email"
                    required
                    value={employeeEmail}
                    onChange={(e) => setEmployeeEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Department / Team</label>
                  <input
                    type="text"
                    required
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Volunteering Skill Contribution</label>
                  <select
                    value={selectedSkill}
                    onChange={(e) => setSelectedSkill(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                  >
                    {activeProgram.required_skills?.map((sk, i) => (
                      <option key={i} value={sk}>{sk}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveProgram(null)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingReg}
                    className="flex-1 py-2.5 rounded-xl btn-primary text-xs font-bold flex items-center justify-center space-x-1.5 shadow-sm"
                  >
                    <Check className="w-4 h-4" />
                    <span>{submittingReg ? 'Booking Spot...' : 'Confirm Registration'}</span>
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
