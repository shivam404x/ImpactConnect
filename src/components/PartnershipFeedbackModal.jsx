import React, { useState } from 'react';
import { 
  Star, 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  Award, 
  Clock, 
  MessageSquare, 
  FileCheck2 
} from 'lucide-react';
import { submitPartnershipReview } from '../utils/api';

export default function PartnershipFeedbackModal({
  isOpen,
  partnership,
  currentUser,
  onClose,
  onSuccess
}) {
  const [rating, setRating] = useState(5);
  const [commRating, setCommRating] = useState(5);
  const [timeRating, setTimeRating] = useState(5);
  const [qualityRating, setQualityRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen || !partnership) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reviewText.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      await submitPartnershipReview({
        partnership_id: partnership.id,
        project_id: partnership.project_id,
        reviewer_id: currentUser?.id || 'demo-user',
        reviewer_name: currentUser?.name || 'Authorized Partner',
        reviewer_role: currentUser?.role || 'supporter',
        rating: Number(rating),
        communication_rating: Number(commRating),
        timeliness_rating: Number(timeRating),
        milestone_quality_rating: Number(qualityRating),
        review_text: reviewText.trim()
      });
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        if (onSuccess) onSuccess();
        onClose();
      }, 1800);
    } catch (err) {
      setError(err.message || 'Failed to submit feedback.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-[#16A36A]">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-slate-900">Performance Feedback Published!</h3>
            <p className="text-xs text-slate-600 max-w-xs mx-auto">
              Your authentic evaluation has been permanently recorded to calculate the transparent reliability index for this partnership.
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center space-x-2 text-[#16A36A] mb-1">
              <Award className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Partnership Performance Review</span>
            </div>
            <h3 className="text-lg font-black text-slate-900">{partnership.project_title}</h3>
            <p className="text-xs text-slate-500">
              Evaluating collaboration between <strong className="text-slate-800">{partnership.ngo_name || 'NGO'}</strong> and <strong className="text-slate-800">{partnership.supporter_name}</strong>
            </p>

            {error && (
              <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 mt-5">
              
              {/* Star Rating */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                <label className="block text-xs font-bold text-slate-700 mb-2">Overall Partnership Satisfaction</label>
                <div className="flex items-center justify-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 text-amber-400 hover:scale-110 transition"
                    >
                      <Star
                        className={`w-7 h-7 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                      />
                    </button>
                  ))}
                </div>
                <span className="text-xs font-bold text-slate-600 mt-1 block">
                  {rating === 5 ? '5.0 - Exceptional Delivery' : `${rating}.0 / 5.0 Rating`}
                </span>
              </div>

              {/* Sub-metrics */}
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-center">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Communication</span>
                  <select
                    value={commRating}
                    onChange={(e) => setCommRating(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 rounded-lg p-1 text-center font-bold text-xs"
                  >
                    <option value="5">5 ★ High</option>
                    <option value="4">4 ★ Good</option>
                    <option value="3">3 ★ Fair</option>
                  </select>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-center">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Timeliness</span>
                  <select
                    value={timeRating}
                    onChange={(e) => setTimeRating(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 rounded-lg p-1 text-center font-bold text-xs"
                  >
                    <option value="5">5 ★ On-Time</option>
                    <option value="4">4 ★ Minor Delay</option>
                    <option value="3">3 ★ Delayed</option>
                  </select>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-center">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Deliverables</span>
                  <select
                    value={qualityRating}
                    onChange={(e) => setQualityRating(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 rounded-lg p-1 text-center font-bold text-xs"
                  >
                    <option value="5">5 ★ Perfect</option>
                    <option value="4">4 ★ Good</option>
                    <option value="3">3 ★ Partial</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Qualitative Feedback & Recommendations
                </label>
                <textarea
                  rows="3"
                  required
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Detail milestone completion accuracy, responsiveness, resource management, and advice for future partners..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                ></textarea>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 flex items-start space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>ImpactConnect strictly prevents duplicate reviews. Transparent indicators are computed from genuine collaboration records only.</span>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl btn-primary text-xs font-bold disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Publish Authentic Review'}
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
