import React from 'react';
import { Scale, ArrowRight, X } from 'lucide-react';
import { translations } from '../data/translations';

export default function ProjectComparisonDock({
  comparedProjects = [],
  onOpenCompare,
  onRemoveProject,
  onClearAll,
  language = 'en'
}) {
  const t = translations[language] || translations.en;

  if (comparedProjects.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-2xl px-4 animate-fade-in print:hidden">
      <div className="bg-slate-900 text-white rounded-2xl p-3 sm:p-4 shadow-2xl border border-slate-700 flex items-center justify-between gap-3">
        
        {/* Left Side: Count & Thumbs */}
        <div className="flex items-center space-x-3 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-[#16A36A] flex items-center justify-center shrink-0 border border-emerald-500/30">
            <Scale className="w-5 h-5 text-emerald-400" />
          </div>

          <div className="flex items-center space-x-2 truncate">
            {comparedProjects.map((p) => (
              <div
                key={p.id}
                className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-slate-800 text-xs text-slate-200 border border-slate-700 shrink-0"
              >
                <span className="font-semibold truncate max-w-[120px]">{p.title}</span>
                <button
                  onClick={() => onRemoveProject(p.id)}
                  className="text-slate-400 hover:text-rose-400"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Compare Now Button */}
        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={onClearAll}
            className="text-xs text-slate-400 hover:text-slate-200 px-2 py-1"
          >
            Clear
          </button>

          <button
            onClick={onOpenCompare}
            className="px-4 py-2 rounded-xl bg-[#16A36A] hover:bg-emerald-600 text-white text-xs font-bold transition flex items-center space-x-1.5 shadow-sm"
          >
            <span>{t.compareNowBtn || 'Compare (Side-by-Side)'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}