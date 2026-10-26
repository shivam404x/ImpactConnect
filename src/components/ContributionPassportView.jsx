import React, { useState, useEffect } from 'react';
import { 
  Award, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  Briefcase, 
  Share2, 
  Lock, 
  Globe2, 
  EyeOff, 
  Copy, 
  Check, 
  Sparkles,
  RefreshCw,
  X
} from 'lucide-react';
import { fetchVolunteerPassport, updateVolunteerPassportPrivacy } from '../utils/api';

export default function ContributionPassportView({
  currentUser,
  userId = 'user-supp-1',
  onClose
}) {
  const [passport, setPassport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [updatingPrivacy, setUpdatingPrivacy] = useState(false);

  const loadPassport = async () => {
    setLoading(true);
    try {
      const data = await fetchVolunteerPassport(userId);
      setPassport(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPassport();
  }, [userId]);

  const handlePrivacyChange = async (level) => {
    setUpdatingPrivacy(true);
    try {
      const updated = await updateVolunteerPassportPrivacy(userId, level);
      setPassport(updated);
    } catch (err) {
      alert(err.message || 'Failed to update privacy');
    } finally {
      setUpdatingPrivacy(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin + `?passport=${userId}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading || !passport) {
    return (
      <div className="py-20 text-center">
        <RefreshCw className="w-8 h-8 animate-spin text-[#16A36A] mx-auto mb-2" />
        <p className="text-xs font-bold text-slate-500">Loading Contribution Passport...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Passport Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden relative">
          
          {/* Top Banner Ribbon */}
          <div className="bg-gradient-to-r from-emerald-600 to-[#16A36A] p-6 sm:p-8 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <img
                src={passport.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80'}
                alt={passport.volunteer_name}
                className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-white/30 shadow-md"
              />
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-2xl font-black tracking-tight">{passport.volunteer_name}</h1>
                  <ShieldCheck className="w-5 h-5 text-emerald-200" />
                </div>
                <p className="text-xs text-emerald-100 font-mono mt-0.5">{passport.email}</p>
                <div className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-white/20 inline-block mt-2">
                  Verified Social Impact Passport
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2 self-start sm:self-auto">
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/30 text-xs font-bold transition flex items-center space-x-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Link Copied!' : 'Share Passport'}</span>
              </button>
            </div>
          </div>

          {/* Privacy Controls Bar */}
          <div className="p-4 bg-slate-50 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-2 text-slate-600">
              <Lock className="w-4 h-4 text-slate-400" />
              <span><strong>Passport Visibility:</strong> Choose who can inspect your verified service credentials</span>
            </div>

            <div className="flex items-center space-x-1 bg-white p-1 rounded-xl border border-slate-200">
              {[
                { id: 'public', label: 'Public', icon: Globe2 },
                { id: 'unlisted', label: 'Unlisted Link', icon: Share2 },
                { id: 'private', label: 'Private Only', icon: EyeOff }
              ].map(p => {
                const Icon = p.icon;
                const isActive = passport.privacy_level === p.id;
                return (
                  <button
                    key={p.id}
                    disabled={updatingPrivacy}
                    onClick={() => handlePrivacyChange(p.id)}
                    className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition flex items-center space-x-1 ${
                      isActive ? 'bg-[#16A36A] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    <span>{p.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Core Verified Stats Grid */}
          <div className="p-6 sm:p-8 space-y-8">
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100">
                <span className="text-xs font-bold text-emerald-800">Verified Service Hours</span>
                <div className="text-3xl font-black text-[#16A36A] mt-1">{passport.verified_hours} hrs</div>
                <span className="text-[10px] text-slate-400">Audited coordinator signatures</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-bold text-slate-600">Tasks Completed</span>
                <div className="text-3xl font-black text-slate-900 mt-1">{passport.completed_tasks_count}</div>
                <span className="text-[10px] text-slate-400">Micro & field deliverables</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-bold text-slate-600">Projects Supported</span>
                <div className="text-3xl font-black text-slate-900 mt-1">{passport.projects_supported_count}</div>
                <span className="text-[10px] text-slate-400">Grassroots initiatives</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-bold text-slate-600">Credential Badges</span>
                <div className="text-3xl font-black text-purple-700 mt-1">{passport.badges?.length || 0}</div>
                <span className="text-[10px] text-slate-400">Issued by verified NGOs</span>
              </div>
            </div>

            {/* Issued Credentials & Certificates */}
            <div className="space-y-3">
              <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center space-x-2">
                <Award className="w-5 h-5 text-amber-500" />
                <span>Certified Badges & Endorsements</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {passport.badges?.map(b => (
                  <div key={b.id} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2 hover:border-slate-300 transition">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center font-bold">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900 leading-snug">{b.title}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">{b.issued_by}</p>
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 border-t border-slate-100 pt-1">
                      Issued: {b.date}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Endorsed Skills */}
            <div className="space-y-3">
              <h3 className="text-base font-black text-slate-900 tracking-tight">
                Peer-Verified Social Impact Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {passport.skills_endorsed?.map((sk, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#16A36A]" />
                    <span>{sk}</span>
                  </span>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
