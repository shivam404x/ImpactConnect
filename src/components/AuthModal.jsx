import React, { useState, useEffect } from 'react';
import { 
  X, 
  Building2, 
  User, 
  Mail, 
  KeyRound, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Loader2, 
  Sparkles, 
  Briefcase, 
  RotateCcw,
  Check,
  ChevronLeft
} from 'lucide-react';
import Logo from './Logo';
import { loginUser, registerUser, sendOtp, verifyOtp, loginWithGoogle } from '../utils/api';
import { CAUSE_CATEGORIES } from '../data/sdgConstants';

export default function AuthModal({ 
  isOpen, 
  initialMode = 'login', 
  initialRole = 'supporter', 
  onClose, 
  onLoginSuccess 
}) {
  if (!isOpen) return null;

  // View state: 'input' | 'otp' | 'complete_profile' | 'google_picker'
  const [step, setStep] = useState('input');
  
  // Input fields
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // New User Registration State (For first-time Gmail / Email registrations)
  const [selectedRole, setSelectedRole] = useState(initialRole || 'supporter'); // 'ngo' | 'corporate' | 'supporter'
  const [fullName, setFullName] = useState('');
  const [orgName, setOrgName] = useState('');
  const [locationCity, setLocationCity] = useState('Mumbai, India');
  const [selectedCauses, setSelectedCauses] = useState(['poverty', 'education']);
  const [supporterSkills, setSupporterSkills] = useState('Funding, Strategy, Mentorship');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [infoMessage, setInfoMessage] = useState(null);

  // Timer countdown for OTP
  useEffect(() => {
    let interval = null;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const toggleCause = (causeId) => {
    setSelectedCauses(prev => 
      prev.includes(causeId) ? prev.filter(c => c !== causeId) : [...prev, causeId]
    );
  };

  // 1. Send OTP to Email / Gmail
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address (e.g. name@gmail.com).');
      return;
    }
    setLoading(true);
    setError(null);
    setInfoMessage(null);

    try {
      const res = await sendOtp(email.trim().toLowerCase());
      setGeneratedOtp(res.otp || '123456');
      setStep('otp');
      setTimer(60);
      setCanResend(false);
      setInfoMessage(res.message || `Verification code sent to ${email}`);
    } catch (err) {
      setError(err.message || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Verify OTP
  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    if (!otp.trim()) {
      setError('Please enter the 6-digit verification code.');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const res = await verifyOtp(email.trim().toLowerCase(), otp.trim());
      if (res.isNew) {
        // Email is verified but brand new -> Prompt to choose role & complete profile
        setStep('complete_profile');
        setFullName(email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()));
        setInfoMessage('Email verified! Choose your role to complete setup.');
      } else if (res.user) {
        // User already registered -> Log in directly!
        onLoginSuccess(res.user);
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Invalid verification code.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Complete Registration for newly verified Email
  const handleCompleteRegistration = async (e) => {
    if (e) e.preventDefault();
    if (!fullName.trim()) {
      setError('Please provide your name.');
      return;
    }
    if (selectedRole === 'ngo' && !orgName.trim()) {
      setError('Please provide your NGO / Organization name.');
      return;
    }
    if (selectedRole === 'corporate' && !orgName.trim()) {
      setError('Please provide your Company / CSR Program name.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        name: fullName.trim(),
        email: email.trim().toLowerCase(),
        role: selectedRole,
        organization_name: orgName.trim() || (selectedRole === 'ngo' ? `${fullName}'s Trust` : selectedRole === 'corporate' ? `${fullName} CSR Foundation` : undefined),
        supporter_type: selectedRole === 'corporate' ? 'corporate_csr' : 'individual_volunteer',
        city: locationCity,
        country: 'India',
        category: selectedCauses[0] || 'poverty',
        sdg_focus: [1, 4],
        skills: supporterSkills.split(',').map(s => s.trim()).filter(Boolean)
      };

      const newUser = await registerUser(payload);
      onLoginSuccess(newUser);
      onClose();
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  // 4. Continue with Google Flow
  const handleGoogleSignIn = (googleEmail, defaultRole = null) => {
    const targetEmail = googleEmail || email.trim() || 'shivam404x@gmail.com';
    const targetName = targetEmail.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    setLoading(true);
    setError(null);

    loginWithGoogle({
      email: targetEmail.toLowerCase(),
      name: targetName,
      role: defaultRole || selectedRole || 'supporter',
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(targetName)}`
    })
    .then(res => {
      if (res.user) {
        onLoginSuccess(res.user);
        onClose();
      }
    })
    .catch(err => {
      setError(err.message || 'Google sign-in failed.');
    })
    .finally(() => setLoading(false));
  };

  // 5. 1-Click Demo Logins for Hackathon presentations
  const handleDemoLogin = async (demoEmail) => {
    setLoading(true);
    setError(null);
    try {
      const user = await loginUser(demoEmail);
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
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="p-6 sm:p-8 pb-4 text-center border-b border-slate-100 bg-slate-50/70">
          <Logo size="md" showTagline={true} className="justify-center mb-3" />
          
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {step === 'otp' && 'Verify Your Email'}
            {step === 'complete_profile' && 'Complete Your Profile & Role'}
            {step === 'input' && 'Sign In to ImpactConnect'}
          </h2>
          
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm mx-auto">
            {step === 'otp' && `Enter the 6-digit code sent to ${email}`}
            {step === 'complete_profile' && 'Select whether you represent an NGO, Corporate CSR, or Volunteer.'}
            {step === 'input' && 'Access role-based dashboards, manage SDG grants, or track community impact.'}
          </p>
        </div>

        {/* Status Alerts */}
        {error && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center space-x-2">
            <X className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        {infoMessage && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{infoMessage}</span>
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 sm:p-8 pt-4">

          {/* ================================================================= */}
          {/* STEP 1: INITIAL INPUT (Google Login OR Email + OTP) */}
          {/* ================================================================= */}
          {step === 'input' && (
            <div className="space-y-4">
              
              {/* GOOGLE SIGN-IN BUTTON */}
              <button
                type="button"
                onClick={() => setStep('google_picker')}
                className="w-full py-3 px-4 rounded-2xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm flex items-center justify-center space-x-3 transition shadow-xs hover:border-slate-400 group cursor-pointer"
              >
                {/* Official Google G Logo */}
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue with Google</span>
              </button>

              {/* DIVIDER */}
              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink mx-4 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                  Or use Email & OTP
                </span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              {/* EMAIL & OTP FORM */}
              <form onSubmit={handleSendOtp} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Email / Gmail Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. yourname@gmail.com"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#16A36A]/40 focus:border-[#16A36A]"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Registered accounts log in directly; new users select their role after verification.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl btn-primary font-bold text-sm flex items-center justify-center space-x-2 shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Get 6-Digit OTP</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* 1-CLICK HACKATHON DEMO ROLES */}
              <div className="pt-4 border-t border-slate-100">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2.5 text-center flex items-center justify-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Instant Role Switch (1-Click Demo):</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('contact@aashray-uplift.org')}
                    className="p-2.5 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40 text-left transition flex items-center space-x-2 cursor-pointer"
                  >
                    <Building2 className="w-4 h-4 text-[#16A36A] shrink-0" />
                    <div>
                      <div className="font-bold text-slate-900">NGO Director</div>
                      <div className="text-[10px] text-slate-500 truncate">Aashray Trust</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDemoLogin('marcus.chen@apextech.com')}
                    className="p-2.5 rounded-xl border border-slate-200 hover:border-sky-300 hover:bg-sky-50/40 text-left transition flex items-center space-x-2 cursor-pointer"
                  >
                    <Briefcase className="w-4 h-4 text-sky-600 shrink-0" />
                    <div>
                      <div className="font-bold text-slate-900">Corporate CSR</div>
                      <div className="text-[10px] text-slate-500 truncate">Apex Tech Global</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDemoLogin('priya.sharma@earthguard.org')}
                    className="p-2.5 rounded-xl border border-slate-200 hover:border-amber-300 hover:bg-amber-50/40 text-left transition flex items-center space-x-2 cursor-pointer"
                  >
                    <User className="w-4 h-4 text-amber-600 shrink-0" />
                    <div>
                      <div className="font-bold text-slate-900">Volunteer / Pro</div>
                      <div className="text-[10px] text-slate-500 truncate">Priya Sharma</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDemoLogin('admin@impactconnect.org')}
                    className="p-2.5 rounded-xl border border-purple-200 bg-purple-50/40 hover:bg-purple-100/60 text-left transition flex items-center space-x-2 cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0" />
                    <div>
                      <div className="font-bold text-purple-900">Super Admin</div>
                      <div className="text-[10px] text-purple-600 truncate">Sarah Mitchell</div>
                    </div>
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* ================================================================= */}
          {/* GOOGLE ACCOUNT SELECTOR DIALOG */}
          {/* ================================================================= */}
          {step === 'google_picker' && (
            <div className="space-y-4 animate-fade-in">
              <button
                type="button"
                onClick={() => setStep('input')}
                className="text-xs text-slate-500 hover:text-slate-800 flex items-center space-x-1 font-semibold cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back to options</span>
              </button>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center">
                <svg className="w-8 h-8 mx-auto mb-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <div className="font-bold text-sm text-slate-900">Choose a Google Account</div>
                <div className="text-xs text-slate-500">to continue to ImpactConnect</div>
              </div>

              {/* Sample Google Profiles */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => handleGoogleSignIn('shivam404x@gmail.com', 'corporate')}
                  className="w-full p-3 rounded-2xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/30 text-left transition flex items-center space-x-3 cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0">
                    S
                  </div>
                  <div className="flex-1 truncate">
                    <div className="text-xs font-bold text-slate-900">Shivam Roy</div>
                    <div className="text-[11px] text-slate-500 truncate">shivam404x@gmail.com</div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                    Active
                  </span>
                </button>

                <div className="pt-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Or Enter Any Custom Gmail:
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="email"
                      placeholder="custom@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900"
                    />
                    <button
                      type="button"
                      onClick={() => handleGoogleSignIn(email)}
                      className="px-4 py-2 rounded-xl btn-primary text-xs font-bold cursor-pointer"
                    >
                      Sign In
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* STEP 2: 6-DIGIT OTP VERIFICATION SCREEN */}
          {/* ================================================================= */}
          {step === 'otp' && (
            <div className="space-y-4 animate-fade-in">
              <button
                type="button"
                onClick={() => setStep('input')}
                className="text-xs text-slate-500 hover:text-slate-800 flex items-center space-x-1 font-semibold cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Change Email</span>
              </button>

              {/* DEMO AUTOFILL BANNER */}
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between">
                <div>
                  <div className="font-bold flex items-center space-x-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Demo Verification Code:</span>
                  </div>
                  <div className="font-mono text-base font-black tracking-widest text-amber-800 mt-0.5">
                    {generatedOtp || '123456'}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setOtp(generatedOtp || '123456')}
                  className="px-3 py-1.5 rounded-xl bg-amber-600 text-white font-bold text-xs hover:bg-amber-700 transition shadow-2xs cursor-pointer"
                >
                  Auto-Fill
                </button>
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Enter 6-Digit Code
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="123456"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-center font-mono text-lg font-bold tracking-widest text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#16A36A]/40 focus:border-[#16A36A]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Code expires in: <strong className="text-slate-800">{timer}s</strong></span>
                  <button
                    type="button"
                    disabled={!canResend || loading}
                    onClick={handleSendOtp}
                    className="text-[#16A36A] font-bold hover:underline disabled:opacity-40 disabled:no-underline cursor-pointer"
                  >
                    Resend Code
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.length < 6}
                  className="w-full py-2.5 rounded-xl btn-primary font-bold text-sm flex items-center justify-center space-x-2 shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Verify Code & Continue</span>}
                </button>
              </form>
            </div>
          )}

          {/* ================================================================= */}
          {/* STEP 3: FIRST-TIME REGISTRATION (CHOOSE ROLE & COMPLETE PROFILE) */}
          {/* ================================================================= */}
          {step === 'complete_profile' && (
            <form onSubmit={handleCompleteRegistration} className="space-y-4 animate-fade-in">
              
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="truncate">Email verified: <strong>{email}</strong></span>
              </div>

              {/* ROLE SELECTION */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Select Your Platform Role *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  
                  {/* Role 1: NGO */}
                  <button
                    type="button"
                    onClick={() => setSelectedRole('ngo')}
                    className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center cursor-pointer ${
                      selectedRole === 'ngo'
                        ? 'border-[#16A36A] bg-emerald-50 text-[#16A36A] ring-2 ring-[#16A36A]/20'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Building2 className="w-5 h-5 mb-1 text-[#16A36A]" />
                    <span className="text-xs font-bold block">NGO Leader</span>
                    <span className="text-[10px] text-slate-400">Post & Manage</span>
                  </button>

                  {/* Role 2: Corporate CSR */}
                  <button
                    type="button"
                    onClick={() => setSelectedRole('corporate')}
                    className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center cursor-pointer ${
                      selectedRole === 'corporate'
                        ? 'border-sky-600 bg-sky-50 text-sky-800 ring-2 ring-sky-600/20'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Briefcase className="w-5 h-5 mb-1 text-sky-600" />
                    <span className="text-xs font-bold block">Corporate CSR</span>
                    <span className="text-[10px] text-slate-400">Pledge Grants</span>
                  </button>

                  {/* Role 3: Volunteer */}
                  <button
                    type="button"
                    onClick={() => setSelectedRole('supporter')}
                    className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center cursor-pointer ${
                      selectedRole === 'supporter'
                        ? 'border-amber-500 bg-amber-50 text-amber-800 ring-2 ring-amber-500/20'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <User className="w-5 h-5 mb-1 text-amber-600" />
                    <span className="text-xs font-bold block">Volunteer</span>
                    <span className="text-[10px] text-slate-400">Pro Bono & Time</span>
                  </button>

                </div>
              </div>

              {/* Profile Inputs */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Priya Sharma"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900"
                  />
                </div>

                {(selectedRole === 'ngo' || selectedRole === 'corporate') && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {selectedRole === 'ngo' ? 'NGO / Organization Name *' : 'Company / CSR Entity *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      placeholder={selectedRole === 'ngo' ? 'e.g. Navjeevan Rural Trust' : 'e.g. Apex Tech Foundation'}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Location (City, Country) *
                  </label>
                  <input
                    type="text"
                    required
                    value={locationCity}
                    onChange={(e) => setLocationCity(e.target.value)}
                    placeholder="Mumbai, India"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900"
                  />
                </div>

                {selectedRole === 'supporter' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Skills & Resources Offered
                    </label>
                    <input
                      type="text"
                      value={supporterSkills}
                      onChange={(e) => setSupporterSkills(e.target.value)}
                      placeholder="e.g. Web Development, Teaching, First Aid, Laptops"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Focus Causes (Select any)
                  </label>
                  <div className="flex flex-wrap gap-1">
                    {CAUSE_CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => toggleCause(cat.id)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition cursor-pointer ${
                          selectedCauses.includes(cat.id)
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

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl btn-primary font-bold text-sm flex items-center justify-center space-x-2 shadow-xs disabled:opacity-50 cursor-pointer"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Complete Registration & Open Dashboard</span>}
              </button>

            </form>
          )}

        </div>

      </div>
    </div>
  );
}