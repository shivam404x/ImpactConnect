import React, { useState } from 'react';
import { 
  X, 
  HeartHandshake, 
  IndianRupee, 
  Users, 
  Package, 
  Briefcase, 
  CheckCircle2, 
  Sparkles,
  Send,
  Loader2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sendPartnershipRequest } from '../utils/api';

export default function PartnershipModal({ project, currentPersona, onClose, onSuccess }) {
  if (!project) return null;

  // Simplified choice: 'funds', 'volunteer', 'supplies'
  const [supportMode, setSupportMode] = useState('funds');
  const [amountChoice, setAmountChoice] = useState('₹2,500');
  const [volunteerTimeChoice, setVolunteerTimeChoice] = useState('4 hrs/week');
  const [customValue, setCustomValue] = useState('');
  
  const [name, setName] = useState(currentPersona?.name || '');
  const [contact, setContact] = useState(currentPersona?.email || '');
  const [simpleMessage, setSimpleMessage] = useState('I would love to support this cause and collaborate!');

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !contact.trim()) {
      setError('Please provide your name and email or phone number.');
      return;
    }

    setSubmitting(true);
    setError(null);

    let offerType = 'funding';
    let offerVal = amountChoice;
    if (supportMode === 'volunteer') {
      offerType = 'volunteering';
      offerVal = customValue || volunteerTimeChoice;
    } else if (supportMode === 'supplies') {
      offerType = 'resource_donation';
      offerVal = customValue || 'Supplies / Equipment Donation';
    } else {
      offerVal = customValue ? (customValue.startsWith('₹') ? customValue : `₹${customValue.replace(/[$₹, ]/g, '')}`) : amountChoice;
    }

    try {
      const payload = {
        project_id: project.id,
        ngo_id: project.ngo_id,
        supporter_id: currentPersona?.id || `supp-${Date.now()}`,
        supporter_name: name,
        supporter_email: contact.includes('@') ? contact : `${name.toLowerCase().replace(/\s+/g, '')}@impact.org`,
        supporter_phone: contact.includes('@') ? '+1 555 0192' : contact,
        supporter_type: currentPersona?.type || 'donor',
        organization_name: currentPersona?.role || '',
        offer_type: offerType,
        offer_value: offerVal,
        message: simpleMessage,
        timeline: 'Immediate'
      };

      const res = await sendPartnershipRequest(payload);
      setSubmitted(true);

      try {
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {}

      if (onSuccess) onSuccess(res);
    } catch (err) {
      setError(err.message || 'Error sending request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Header with Project Image Snapshot */}
        <div className="relative h-28 w-full bg-slate-950 overflow-hidden">
          <img 
            src={project.cover_image || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80'} 
            alt={project.title} 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-900/80 text-slate-300 hover:text-white border border-slate-700"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="absolute bottom-3 left-5 right-5">
            <h3 className="text-base font-extrabold text-white line-clamp-1">{project.title}</h3>
            <p className="text-xs text-emerald-400 font-semibold">{project.ngo_name || 'Community NGO'}</p>
          </div>
        </div>

        {/* Content */}
        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mx-auto flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-black text-white">Thank You for Supporting!</h4>
            <p className="text-xs sm:text-sm text-slate-300">
              Your pledge has been sent directly to <strong>{project.ngo_name}</strong>. Their team will follow up via your contact info.
            </p>
            <button
              onClick={onClose}
              className="mt-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            
            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                {error}
              </div>
            )}

            {/* 3 Simple Choice Tabs */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">
                How would you like to contribute?
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSupportMode('funds')}
                  className={`py-2.5 px-2 rounded-2xl border text-center transition flex flex-col items-center space-y-1 ${
                    supportMode === 'funds'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <IndianRupee className="w-5 h-5 text-amber-400" />
                  <span className="text-xs">Donate Funds</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSupportMode('volunteer')}
                  className={`py-2.5 px-2 rounded-2xl border text-center transition flex flex-col items-center space-y-1 ${
                    supportMode === 'volunteer'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <Users className="w-5 h-5 text-emerald-400" />
                  <span className="text-xs">Volunteer Time</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSupportMode('supplies')}
                  className={`py-2.5 px-2 rounded-2xl border text-center transition flex flex-col items-center space-y-1 ${
                    supportMode === 'supplies'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <Package className="w-5 h-5 text-sky-400" />
                  <span className="text-xs">Goods / Skills</span>
                </button>
              </div>
            </div>

            {/* Quick Amount / Time Chips */}
            {supportMode === 'funds' && (
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Select Amount:</label>
                <div className="flex flex-wrap gap-2">
                  {['₹1,000', '₹2,500', '₹5,000', '₹10,000', '₹25,000'].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => { setAmountChoice(amt); setCustomValue(''); }}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition ${
                        amountChoice === amt && !customValue
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      {amt}
                    </button>
                  ))}
                  <input
                    type="text"
                    value={customValue}
                    onChange={(e) => setCustomValue(e.target.value)}
                    placeholder="Other ₹"
                    className="w-24 px-2 py-1 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                  />
                </div>
              </div>
            )}

            {supportMode === 'volunteer' && (
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Select Availability:</label>
                <div className="flex flex-wrap gap-2">
                  {['2 hrs/week', '4 hrs/week', 'Weekend drives', 'Remote coding/design'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setVolunteerTimeChoice(t)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition ${
                        volunteerTimeChoice === t
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {supportMode === 'supplies' && (
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">What can you offer?</label>
                <input
                  type="text"
                  required
                  value={customValue}
                  onChange={(e) => setCustomValue(e.target.value)}
                  placeholder="e.g. 5 Laptops, medical supplies, legal guidance..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                />
              </div>
            )}

            {/* Simple Contact Info */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Email / Phone *</label>
                <input
                  type="text"
                  required
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="john@example.com"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                />
              </div>
            </div>

            {/* Short Note */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Note to NGO (Optional)</label>
              <input
                type="text"
                value={simpleMessage}
                onChange={(e) => setSimpleMessage(e.target.value)}
                placeholder="Excited to help!"
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/25 transition disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <HeartHandshake className="w-5 h-5" />
                  <span>Confirm & Send Support Offer</span>
                </>
              )}
            </button>

          </form>
        )}

      </div>
    </div>
  );
}
