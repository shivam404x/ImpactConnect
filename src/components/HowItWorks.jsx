import React from 'react';
import { Search, HeartHandshake, Sparkles, CheckCircle2 } from 'lucide-react';

export default function HowItWorks({ onExploreClick }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-6 sm:p-8 shadow-xl">
        
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            Simple 3-Step Process
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-white mt-2">
            How ImpactConnect Works
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Connecting supporters with real grassroots community needs in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Step 1 */}
          <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-start space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-lg shrink-0 border border-emerald-500/30">
              1
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Discover Projects</h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Browse verified projects by photo, cause, or city. Filter by funding, volunteers, or equipment needed.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-start space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-black text-lg shrink-0 border border-sky-500/30">
              2
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Send Partnership Offer</h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Click "Support Now" to pledge funds ($), volunteer hours, or supplies with 1-click simplicity.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-start space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-lg shrink-0 border border-amber-500/30">
              3
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">NGO Confirms & Delivers</h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                NGO leadership reviews your offer, connects directly with you, and drives on-ground community change.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
