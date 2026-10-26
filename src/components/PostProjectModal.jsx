import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  DollarSign, 
  Users, 
  Package, 
  Briefcase, 
  Building2, 
  CheckCircle2,
  Loader2,
  Sparkles,
  Image as ImageIcon
} from 'lucide-react';
import { CAUSE_CATEGORIES, SDG_GOALS } from '../data/sdgConstants';
import { createProject } from '../utils/api';

const PRESET_COVERS = [
  { label: 'Child Education & Tablets', url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80' },
  { label: 'Clean Drinking Water', url: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=800&q=80' },
  { label: 'Tree Planting & Forest', url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80' },
  { label: 'Mobile Healthcare & Clinics', url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80' },
  { label: 'Surplus Food Rescue', url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80' },
  { label: 'Women Artisan Workshops', url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80' }
];

export default function PostProjectModal({ ngos, currentUser, onClose, onSuccess }) {
  const [selectedNgoId, setSelectedNgoId] = useState(
    currentUser?.ngo_id || (ngos[0] ? ngos[0].id : 'ngo-1')
  );
  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [causeCategory, setCauseCategory] = useState('education');
  const [selectedSdgs, setSelectedSdgs] = useState([4]);
  const [city, setCity] = useState(currentUser?.city || 'Austin');
  const [country, setCountry] = useState(currentUser?.country || 'United States');
  const [isRemote, setIsRemote] = useState(false);
  const [urgency, setUrgency] = useState('medium');
  const [impactTarget, setImpactTarget] = useState('');
  const [coverImage, setCoverImage] = useState(PRESET_COVERS[0].url);

  const [requirements, setRequirements] = useState([
    {
      type: 'funding',
      title: 'Community Project Operational Grant',
      description: 'Covers equipment, local logistics, and volunteer kits.',
      target_quantity: 10000,
      unit: 'USD',
      skill_tags: ['Grant Funding']
    },
    {
      type: 'volunteers',
      title: 'Field Survey & Outreach Volunteers',
      description: 'Hands-on weekend coordination and direct family assistance.',
      target_quantity: 15,
      unit: 'volunteers',
      skill_tags: ['Community Outreach']
    }
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const toggleSdg = (sdgId) => {
    if (selectedSdgs.includes(sdgId)) {
      if (selectedSdgs.length > 1) setSelectedSdgs(selectedSdgs.filter(id => id !== sdgId));
    } else {
      setSelectedSdgs([...selectedSdgs, sdgId]);
    }
  };

  const addRequirement = () => {
    setRequirements([
      ...requirements,
      {
        type: 'skills',
        title: '',
        description: '',
        target_quantity: 2,
        unit: 'mentors',
        skill_tags: []
      }
    ]);
  };

  const updateRequirement = (index, field, value) => {
    const updated = [...requirements];
    updated[index][field] = value;
    setRequirements(updated);
  };

  const removeRequirement = (index) => {
    if (requirements.length > 1) {
      setRequirements(requirements.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError('Please provide a project title and description.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        ngo_id: selectedNgoId,
        title,
        tagline,
        description,
        cause_category: causeCategory,
        sdg_goals: selectedSdgs,
        location_city: city,
        location_country: country,
        is_remote: isRemote,
        urgency,
        impact_target: impactTarget,
        cover_image: coverImage,
        requirements
      };

      const res = await createProject(payload);
      if (onSuccess) onSuccess(res);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="p-6 bg-[#F8FAFC] border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Publish Community Project Need</h3>
            <p className="text-xs text-slate-500">Call for funding grants, volunteers, equipment, or skilled professionals</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 text-slate-500 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5 max-h-[calc(85vh-10rem)] overflow-y-auto text-xs">
          
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-semibold">
              {error}
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Project Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Solar STEM Literacy Labs for 25 Rural Primary Schools"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#16A36A]/40"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Short Tagline *</label>
            <input
              type="text"
              required
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. Providing 3,000 children with interactive math & science tablets"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Cause Category *</label>
              <select
                value={causeCategory}
                onChange={(e) => setCauseCategory(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs font-medium capitalize"
              >
                {CAUSE_CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Urgency Priority</label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs font-medium"
              >
                <option value="normal">Normal Need</option>
                <option value="medium">Medium Priority</option>
                <option value="urgent">Urgent / Immediate Need</option>
              </select>
            </div>
          </div>

          {/* Location */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">City *</label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Country *</label>
              <input
                type="text"
                required
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 text-xs"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isRemote"
              checked={isRemote}
              onChange={(e) => setIsRemote(e.target.checked)}
              className="rounded text-[#16A36A] focus:ring-[#16A36A]"
            />
            <label htmlFor="isRemote" className="text-slate-600 font-medium cursor-pointer">
              Remote / Virtual friendly (Online mentorship, digital volunteers accepted)
            </label>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Full Mission Narrative *</label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the community context, current baseline, and planned interventions..."
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs leading-relaxed"
            />
          </div>

          {/* Cover Photo Presets */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">Choose Cover Photo:</label>
            <div className="grid grid-cols-3 gap-2">
              {PRESET_COVERS.map((cov, idx) => (
                <div
                  key={idx}
                  onClick={() => setCoverImage(cov.url)}
                  className={`h-16 rounded-xl overflow-hidden cursor-pointer border-2 transition relative ${
                    coverImage === cov.url ? 'border-[#16A36A] ring-2 ring-emerald-500/20' : 'border-slate-200 hover:border-slate-400'
                  }`}
                >
                  <img src={cov.url} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/30 flex items-end p-1 text-[9px] text-white font-bold truncate">
                    {cov.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Requirements Builder */}
          <div className="pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="font-bold text-slate-900 text-xs">Required Resources & Partnerships</h4>
                <p className="text-[11px] text-slate-500">Specify exactly what help you are requesting</p>
              </div>
              <button
                type="button"
                onClick={addRequirement}
                className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-[#16A36A] font-bold text-xs flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Need</span>
              </button>
            </div>

            <div className="space-y-2">
              {requirements.map((req, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-[#F8FAFC] border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <select
                      value={req.type}
                      onChange={(e) => updateRequirement(idx, 'type', e.target.value)}
                      className="px-2 py-1 rounded-lg border border-slate-300 bg-white font-bold text-slate-800 text-[11px]"
                    >
                      <option value="funding">Funding / Grant ($)</option>
                      <option value="volunteers">Volunteers</option>
                      <option value="resources">Supplies / Goods</option>
                      <option value="skills">Pro Bono Professional</option>
                      <option value="corporate_csr">Corporate CSR Program</option>
                    </select>
                    {requirements.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRequirement(idx)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                    <input
                      type="text"
                      required
                      value={req.title}
                      onChange={(e) => updateRequirement(idx, 'title', e.target.value)}
                      placeholder="Title of need (e.g. 50 Tablets or 15 Volunteers)"
                      className="sm:col-span-8 px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs text-slate-900"
                    />
                    <input
                      type="number"
                      required
                      min="1"
                      value={req.target_quantity}
                      onChange={(e) => updateRequirement(idx, 'target_quantity', e.target.value)}
                      placeholder="Target Qty"
                      className="sm:col-span-4 px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs text-slate-900"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Bar */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl btn-primary font-bold shadow-sm"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Publish Project</span>}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
