import React from 'react';
import { 
  GraduationCap, 
  Droplet, 
  TreePine, 
  HeartPulse, 
  Utensils, 
  Accessibility, 
  Sparkles, 
  Coins, 
  Globe2 
} from 'lucide-react';

const VISUAL_CAUSES = [
  {
    id: 'all',
    name: 'All Causes',
    count: '8+ Initiatives',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=600&q=80',
    color: 'from-emerald-600/80'
  },
  {
    id: 'education',
    name: 'Quality Education',
    count: '2 Initiatives',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80',
    color: 'from-red-600/80'
  },
  {
    id: 'poverty',
    name: 'Poverty & Clean Water',
    count: '2 Initiatives',
    image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=600&q=80',
    color: 'from-cyan-600/80'
  },
  {
    id: 'environment',
    name: 'Climate & Forests',
    count: '1 Initiative',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80',
    color: 'from-emerald-700/80'
  },
  {
    id: 'healthcare',
    name: 'Healthcare & Medicine',
    count: '1 Initiative',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80',
    color: 'from-green-600/80'
  },
  {
    id: 'hunger',
    name: 'Zero Hunger & Food',
    count: '1 Initiative',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=600&q=80',
    color: 'from-amber-600/80'
  },
  {
    id: 'disability',
    name: 'Disability & Tech',
    count: '1 Initiative',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    color: 'from-purple-600/80'
  },
  {
    id: 'women_welfare',
    name: 'Women Empowerment',
    count: '1 Initiative',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
    color: 'from-pink-600/80'
  }
];

export default function VisualCauseGrid({ selectedCause, onSelectCause }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg sm:text-xl font-extrabold text-white">Explore by Social Cause</h3>
          <p className="text-xs text-slate-400">Choose a cause you care about to see active projects</p>
        </div>

        {selectedCause !== 'all' && (
          <button
            onClick={() => onSelectCause('all')}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-bold"
          >
            Show All Causes ✕
          </button>
        )}
      </div>

      {/* Horizontal visual cards slider */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {VISUAL_CAUSES.map((item) => {
          const isSelected = selectedCause === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectCause(item.id)}
              className={`group relative h-28 sm:h-32 rounded-2xl overflow-hidden border text-left transition-all duration-300 ${
                isSelected
                  ? 'border-emerald-400 ring-2 ring-emerald-500/50 shadow-lg shadow-emerald-500/20 scale-[1.02]'
                  : 'border-slate-800 hover:border-slate-600 hover:scale-[1.02]'
              }`}
            >
              {/* Background Photo */}
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
              />
              {/* Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-t ${item.color} via-slate-950/70 to-slate-950/30`} />

              {/* Text content inside card */}
              <div className="absolute inset-0 p-2.5 flex flex-col justify-end z-10">
                <div className="font-extrabold text-white text-xs leading-tight drop-shadow-md">
                  {item.name}
                </div>
                <div className="text-[10px] text-slate-200 mt-0.5 opacity-90 drop-shadow">
                  {item.count}
                </div>
              </div>

              {isSelected && (
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-400 shadow" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
