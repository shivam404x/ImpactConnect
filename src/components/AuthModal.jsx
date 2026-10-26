import React, { useState } from 'react';
import { X, Building2, User, Mail, Lock, ArrowRight, ShieldCheck, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import Logo from './Logo';
import { loginUser, registerUser } from '../utils/api';
import { CAUSE_CATEGORIES } from '../data/sdgConstants';

export default function AuthModal({ isOpen, initialMode = 'login', initialRole = 'supporter', onClose, onLoginSuccess }) {
  if (!isOpen) return null;

  const [mode, setMode] = useState(initialMode); // 'login' | 'register'
  const [role, setRole] = useState(initialRole); // 'supporter' | 'ngo'

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  
  // Register state (Supporter)
  const [supporterName, setSupporterName] = useState('');
  const [supporterEmail, setSupporterEmail] = useState('');
  const [supporterLocation, setSupporterLocation] = useState('Chicago, USA');
  const [supporterType, setSupporterType] = useState('corporate_csr'); // corporate_csr, donor, skilled_professional, individual_volunteer
  const [supporterInterests, setSupporterInterests] = useState(['education', 'environment']);
  const [supporterSkills, setSupporterSkills] = useState('Grantmaking, Software, Management');

  // Register state (NGO)
  const [orgName, setOrgName] = useState('');
  const [orgEmail, setOrgEmail] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [orgLocation, setOrgLocation] = useState('Austin, USA');
  const [orgCauses, setOrgCauses] = useState(['poverty', 'healthcare']);
  const [orgDesc, setOrgDesc] = useState('');
  const [orgWebsite, setOrgWebsite] = useState('https://');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const toggleInterest = (causeId) => {
    if (role === 'ngo') {
      setOrgCauses(prev => prev.includes(causeId) ? prev.filter(c => c !== causeId) : [...prev, causeId]);
    } else {
      setSupporterInterests(prev => prev.includes(causeId) ? prev.filter(c => c !== causeId) : [...prev, causeId]);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginEmail.trim()) {
      setError('Please enter your email address.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const user = await loginUser(loginEmail.trim());
      onLoginSuccess(user);
      onClose();
    } catch (err) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (role === 'ngo') {
        if (!orgName.trim() || !orgEmail.trim() || !contactPerson.trim()) {
          throw new Error('Please fill in organization name, official email, and contact person.');
        }
        const payload = {
          role: 'ngo',
          name: contactPerson,
          email: orgEmail,
          organization_name: orgName,
          city: orgLocation.split(',')[0]?.trim() || orgLocation,
          country: orgLocation.split(',')[1]?.trim() || 'Global',
          description: orgDesc,
          website: orgWebsite,
          sdg_focus: [1, 4],
          category: orgCauses[0] || 'poverty'
        };
        const newUser = await registerUser(payload);
        onLoginSuccess(newUser);
      } else {
        if (!supporterName.trim() || !supporterEmail.trim()) {
          throw new Error('Please enter your full name and email address.');
        }
        const payload = {
          role: 'supporter',
          name: supporterName,
          email: supporterEmail,
          supporter_type: supporterType,
          city: supporterLocation,
          skills: supporterSkills.split(',').map(s => s.trim()).filter(Boolean),
          interests: supporterInterests
        };
        const newUser = await registerUser(payload);
        onLoginSuccess(newUser);
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  // Quick Demo Accounts
  const handleDemoLogin = async (email) => {
    setLoading(true);
    setError(null);
    try {
      const user = await loginUser(email);
      onLoginSuccess(user);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="p-6 sm:p-8 pb-4 text-center border-b border-slate-100 bg-[#F8FAFC]">
          <Logo size="md" showTagline={true} className="justify-center mb-3" />
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {mode === 'login' ? 'Welcome Back' : 'Create Your ImpactConnect Account'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {mode === 'login' 
              ? 'Log in to manage community partnerships, projects, and impact pledges.'
              : 'Join as an organization seeking support or as a partner ready to give.'}
          </p>

          {/* Toggle Login / Register */}
          <div className="mt-4 flex p-1 rounded-xl bg-slate-200/80 max-w-xs mx-auto">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
                mode === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode('register')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
                mode === 'register' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Register
            </button>
          </div>
        </div>

        {/* Error notification */}
        {error && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 sm:p-8 pt-4">
          
          {mode === 'login' ? (
            /* Login Form */
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="e.g. contact@aashray-uplift.org"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#16A36A]/40 focus:border-[#16A36A]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl btn-primary font-bold text-sm flex items-center justify-center space-x-2 shadow-sm disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Sign In with Email</span>}
              </button>

              {/* 1-Click Demo Accounts */}
              <div className="pt-4 border-t border-slate-100">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2.5 text-center flex items-center justify-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Hackathon Demo Roles (1-Click Switch):</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('contact@aashray-uplift.org')}
                    className="p-2.5 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40 text-left transition flex items-center space-x-2"
                  >
                    <Building2 className="w-4 h-4 text-[#16A36A] shrink-0" />
                    <div>
                      <div className="font-bold text-slate-900">NGO Director</div>
                      <div className="text-[10px] text-slate-500">Aashray Trust</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDemoLogin('marcus.chen@apextech.com')}
                    className="p-2.5 rounded-xl border border-slate-200 hover:border-sky-300 hover:bg-sky-50/40 text-left transition flex items-center space-x-2"
                  >
                    <User className="w-4 h-4 text-sky-600 shrink-0" />
                    <div>
                      <div className="font-bold text-slate-900">Corporate CSR</div>
                      <div className="text-[10px] text-slate-500">Apex Tech Global</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDemoLogin('priya.sharma@earthguard.org')}
                    className="p-2.5 rounded-xl border border-slate-200 hover:border-amber-300 hover:bg-amber-50/40 text-left transition flex items-center space-x-2"
                  >
                    <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                    <div>
                      <div className="font-bold text-slate-900">Volunteer / Pro</div>
                      <div className="text-[10px] text-slate-500">Priya Sharma</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDemoLogin('admin@impactconnect.org')}
                    className="p-2.5 rounded-xl border border-purple-200 bg-purple-50/40 hover:bg-purple-100/60 text-left transition flex items-center space-x-2"
                  >
                    <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0" />
                    <div>
                      <div className="font-bold text-purple-900">Platform Admin</div>
                      <div className="text-[10px] text-purple-600">Sarah Mitchell</div>
                    </div>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            /* Register Form */
            <form onSubmit={handleRegister} className="space-y-4">
              {/* Role Picker */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  I want to register as:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('supporter')}
                    className={`p-3 rounded-xl border text-left flex items-center space-x-2 transition ${
                      role === 'supporter'
                        ? 'border-[#16A36A] bg-emerald-50/50 text-[#16A36A] font-bold'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <User className="w-4 h-4" />
                    <div className="text-xs">Donor / Volunteer / CSR</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('ngo')}
                    className={`p-3 rounded-xl border text-left flex items-center space-x-2 transition ${
                      role === 'ngo'
                        ? 'border-[#16A36A] bg-emerald-50/50 text-[#16A36A] font-bold'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                    <div className="text-xs">NGO / Community Org</div>
                  </button>
                </div>
              </div>

              {role === 'ngo' ? (
                /* NGO Fields */
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Organization Name *</label>
                    <input
                      type="text"
                      required
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      placeholder="e.g. Smile Community Foundation"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#16A36A]/40"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Official Email *</label>
                      <input
                        type="email"
                        required
                        value={orgEmail}
                        onChange={(e) => setOrgEmail(e.target.value)}
                        placeholder="contact@smile.org"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Person *</label>
                      <input
                        type="text"
                        required
                        value={contactPerson}
                        onChange={(e) => setContactPerson(e.target.value)}
                        placeholder="Director Name"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Location (City, Country) *</label>
                    <input
                      type="text"
                      required
                      value={orgLocation}
                      onChange={(e) => setOrgLocation(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Causes Supported</label>
                    <div className="flex flex-wrap gap-1">
                      {CAUSE_CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => toggleInterest(cat.id)}
                          className={`px-2 py-0.5 rounded-lg text-[11px] font-medium border transition ${
                            orgCauses.includes(cat.id)
                              ? 'bg-[#16A36A] text-white border-[#16A36A]'
                              : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Organization Mission & Description</label>
                    <textarea
                      rows={2}
                      value={orgDesc}
                      onChange={(e) => setOrgDesc(e.target.value)}
                      placeholder="Briefly describe your community focus..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900"
                    />
                  </div>
                </div>
              ) : (
                /* Supporter Fields */
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={supporterName}
                        onChange={(e) => setSupporterName(e.target.value)}
                        placeholder="John Smith"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={supporterEmail}
                        onChange={(e) => setSupporterEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Supporter Type</label>
                      <select
                        value={supporterType}
                        onChange={(e) => setSupporterType(e.target.value)}
                        className="w-full px-2.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-900"
                      >
                        <option value="corporate_csr">Corporate CSR Program</option>
                        <option value="donor">Individual Donor</option>
                        <option value="skilled_professional">Skilled Professional (Pro Bono)</option>
                        <option value="individual_volunteer">Hands-on Volunteer</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Location</label>
                      <input
                        type="text"
                        value={supporterLocation}
                        onChange={(e) => setSupporterLocation(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Skills & Resources You Can Offer</label>
                    <input
                      type="text"
                      value={supporterSkills}
                      onChange={(e) => setSupporterSkills(e.target.value)}
                      placeholder="e.g. Funding, Teaching, Healthcare, Laptops, Legal"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Causes You Care About</label>
                    <div className="flex flex-wrap gap-1">
                      {CAUSE_CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => toggleInterest(cat.id)}
                          className={`px-2 py-0.5 rounded-lg text-[11px] font-medium border transition ${
                            supporterInterests.includes(cat.id)
                              ? 'bg-[#16A36A] text-white border-[#16A36A]'
                              : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl btn-primary font-bold text-sm flex items-center justify-center space-x-2 shadow-sm disabled:opacity-50 mt-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Complete Registration</span>}
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
}
