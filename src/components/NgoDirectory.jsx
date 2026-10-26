import React, { useState, useEffect } from 'react';
import { 
  Building, 
  CheckCircle2, 
  MapPin, 
  Globe2, 
  Users, 
  Search, 
  ExternalLink, 
  ArrowRight,
  PlusCircle,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { fetchNgos } from '../utils/api';
import { SDG_GOALS, CAUSE_CATEGORIES } from '../data/sdgConstants';

export default function NgoDirectory({ onSelectNgoProjects, onOpenRegisterNgo }) {
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');

  const loadNgos = async () => {
    setLoading(true);
    try {
      const data = await fetchNgos({ category, search });
      setNgos(data);
    } catch (err) {
      console.error('Failed to load NGOs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNgos();
  }, [category]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadNgos();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
            <Building className="w-3.5 h-3.5" />
            <span>Verified Non-Profit Organizations</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">NGO & Community Partner Directory</h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Browse registered grassroots and national community organizations driving SDG progress.
          </p>
        </div>

        <button
          onClick={onOpenRegisterNgo}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center space-x-2 shadow-lg shadow-emerald-600/30 transition self-start md:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Register Your Organization</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-8 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        
        {/* Cause Filter */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none text-xs">
          {CAUSE_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition ${
                category === cat.id
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by NGO name, city, mission..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </form>
      </div>

      {/* Directory Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-sm">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto text-emerald-400 mb-2" />
          Loading verified NGOs...
        </div>
      ) : ngos.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-slate-900/60 border border-slate-800 text-slate-400">
          <Building className="w-10 h-10 mx-auto text-slate-600 mb-3" />
          <h4 className="text-base font-bold text-white mb-1">No Organizations Found</h4>
          <p className="text-xs text-slate-400">Try changing the category filter or search term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ngos.map(ngo => {
            const sdgBadges = (ngo.sdg_focus || []).map(sdgId => {
              return SDG_GOALS.find(g => g.id === sdgId) || { id: sdgId, name: `SDG ${sdgId}`, color: '#10B981' };
            });

            return (
              <div 
                key={ngo.id}
                className="rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 p-6 flex flex-col justify-between shadow-lg hover:shadow-2xl transition duration-300"
              >
                <div>
                  {/* Top Logo & Status */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <img 
                      src={ngo.logo_url || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=200&h=200&q=80'} 
                      alt={ngo.name} 
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-emerald-500/30"
                    />

                    <div className="flex flex-col items-end">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center space-x-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-400" />
                        <span>{ngo.verification_tier || 'Verified NGO'}</span>
                      </span>
                      <span className="text-[10px] text-slate-400 mt-1">Est. {ngo.founded_year || '2016'}</span>
                    </div>
                  </div>

                  {/* Name & Location */}
                  <h3 className="font-extrabold text-white text-base sm:text-lg line-clamp-1">{ngo.name}</h3>
                  <div className="flex items-center space-x-1 text-xs text-slate-400 mt-1">
                    <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>{ngo.city}, {ngo.country}</span>
                  </div>

                  {/* Mission */}
                  <p className="mt-3 text-xs sm:text-sm text-slate-300 line-clamp-3 leading-relaxed">
                    {ngo.mission || ngo.tagline}
                  </p>

                  {/* Beneficiaries & Legal */}
                  <div className="mt-4 pt-3 border-t border-slate-800 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Beneficiaries</span>
                      <span className="font-bold text-white flex items-center space-x-1">
                        <Users className="w-3 h-3 text-sky-400" />
                        <span>{(ngo.beneficiaries_served || 25000).toLocaleString()}+</span>
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px]">Tax Status</span>
                      <span className="font-medium text-slate-300 text-[11px] truncate block">
                        {ngo.tax_exempt_status || 'Tax-Exempt Non-Profit'}
                      </span>
                    </div>
                  </div>

                  {/* SDG Focus Badges */}
                  <div className="mt-3 flex flex-wrap gap-1">
                    {sdgBadges.map(sdg => (
                      <span 
                        key={sdg.id}
                        style={{ backgroundColor: sdg.color }}
                        className="px-2 py-0.5 rounded text-[10px] font-black text-white"
                        title={sdg.name}
                      >
                        SDG {sdg.id}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Action */}
                <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                  {ngo.website ? (
                    <a 
                      href={ngo.website} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="text-xs text-slate-400 hover:text-white flex items-center space-x-1"
                    >
                      <Globe2 className="w-3.5 h-3.5" />
                      <span>Website</span>
                    </a>
                  ) : <span></span>}

                  <button
                    onClick={() => onSelectNgoProjects(ngo.id)}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center space-x-1.5 transition shadow-sm"
                  >
                    <span>View Projects</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
