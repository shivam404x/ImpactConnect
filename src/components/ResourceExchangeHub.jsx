import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Search, 
  Filter, 
  MapPin, 
  Plus, 
  Truck, 
  CheckCircle2, 
  Clock, 
  Box, 
  Laptop, 
  BookOpen, 
  Shirt, 
  HeartPulse, 
  Armchair, 
  Layers, 
  Building2, 
  User, 
  X,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { fetchResourceItems, createResourceItem, claimResourceItem, updateClaimStatus, fetchResourceClaims } from '../utils/api';

const CATEGORIES = [
  { id: 'all', label: 'All Categories', icon: Layers },
  { id: 'laptops', label: 'Laptops & IT', icon: Laptop },
  { id: 'books', label: 'Books & STEM', icon: BookOpen },
  { id: 'medical', label: 'Medical Supplies', icon: HeartPulse },
  { id: 'clothes', label: 'Clothes & Warmth', icon: Shirt },
  { id: 'furniture', label: 'School Furniture', icon: Armchair },
  { id: 'other', label: 'General Goods', icon: Box }
];

export default function ResourceExchangeHub({ currentUser, onOpenAuth }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('all'); // 'all' | 'supply' | 'need'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [search, setSearch] = useState('');
  
  // Listing modal state
  const [showListModal, setShowListModal] = useState(false);
  const [listType, setListType] = useState(currentUser?.role === 'ngo' ? 'need' : 'supply');
  const [listTitle, setListTitle] = useState('');
  const [listCategory, setListCategory] = useState('laptops');
  const [listQuantity, setListQuantity] = useState(10);
  const [listUnit, setListUnit] = useState('units');
  const [listCondition, setListCondition] = useState('gently_used');
  const [listCity, setListCity] = useState(currentUser?.city || 'Mumbai');
  const [listCountry, setListCountry] = useState('India');
  const [listDescription, setListDescription] = useState('');
  const [listImageUrl, setListImageUrl] = useState('');
  const [submittingList, setSubmittingList] = useState(false);

  // Claim modal state
  const [claimTarget, setClaimTarget] = useState(null);
  const [claimQuantity, setClaimQuantity] = useState(1);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [claimPhone, setClaimPhone] = useState(currentUser?.phone || '');
  const [claiming, setClaiming] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);

  const loadResources = async () => {
    setLoading(true);
    try {
      const data = await fetchResourceItems({
        type: selectedType,
        category: selectedCategory,
        search
      });
      setItems(data);
    } catch (err) {
      console.error('Error fetching resource items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResources();
  }, [selectedType, selectedCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadResources();
  };

  const handleCreateListing = async (e) => {
    e.preventDefault();
    if (!currentUser && onOpenAuth) {
      onOpenAuth('login');
      return;
    }
    setSubmittingList(true);
    try {
      await createResourceItem({
        type: listType,
        title: listTitle,
        category: listCategory,
        quantity: Number(listQuantity),
        unit: listUnit,
        condition: listCondition,
        location_city: listCity,
        location_country: listCountry,
        description: listDescription,
        image_url: listImageUrl || (listCategory === 'laptops' ? 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80' : 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80'),
        owner_type: currentUser?.role || 'supporter',
        owner_id: currentUser?.id || 'demo-user',
        owner_name: currentUser?.name || 'Community Donor',
        owner_email: currentUser?.email || 'donor@impactconnect.org'
      });
      setShowListModal(false);
      setListTitle('');
      setListDescription('');
      loadResources();
      alert('Resource listing successfully published to the Exchange Hub!');
    } catch (err) {
      alert('Error creating listing: ' + err.message);
    } finally {
      setSubmittingList(false);
    }
  };

  const handleClaimSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser && onOpenAuth) {
      onOpenAuth('login');
      return;
    }
    setClaiming(true);
    try {
      await claimResourceItem(claimTarget.id, {
        requester_id: currentUser?.id || 'demo-user',
        requester_name: currentUser?.name || 'Verified Beneficiary Lead',
        requester_email: currentUser?.email || 'beneficiary@impactconnect.org',
        requester_type: currentUser?.role || 'ngo',
        quantity_requested: Number(claimQuantity),
        delivery_address: deliveryAddress,
        contact_phone: claimPhone
      });
      setClaimSuccess(true);
      setTimeout(() => {
        setClaimSuccess(false);
        setClaimTarget(null);
        setDeliveryAddress('');
        loadResources();
      }, 1800);
    } catch (err) {
      alert('Failed to request item: ' + err.message);
    } finally {
      setClaiming(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20">
      
      {/* Header */}
      <div className="bg-white border-b border-slate-200 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#16A36A] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Circular Goods Marketplace
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
                Non-Financial Resource Exchange Hub
              </h1>
              <p className="text-sm text-slate-600 mt-2 max-w-2xl">
                A transparent, zero-waste logistics network connecting donor hardware, books, medical kits, and supplies directly with frontline NGO requirements.
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => {
                  if (!currentUser && onOpenAuth) onOpenAuth('login');
                  else setShowListModal(true);
                }}
                className="btn-primary px-5 py-3 rounded-xl text-xs font-bold flex items-center space-x-2 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>List Goods or Post Need</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <span className="text-xs text-slate-500 font-semibold block">Total Available Items</span>
              <span className="text-2xl font-black text-[#16A36A] mt-1 block">820+ units</span>
              <span className="text-[10px] text-slate-400">Inspected & ready for dispatch</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <span className="text-xs text-slate-500 font-semibold block">Active NGO Requirements</span>
              <span className="text-2xl font-black text-slate-900 mt-1 block">54 listings</span>
              <span className="text-[10px] text-slate-400">Schools, clinics, child shelters</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <span className="text-xs text-slate-500 font-semibold block">Goods Delivered</span>
              <span className="text-2xl font-black text-slate-900 mt-1 block">3,450 units</span>
              <span className="text-[10px] text-slate-400">100% verified beneficiary receipt</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <span className="text-xs text-slate-500 font-semibold block">Logistics Status</span>
              <span className="text-2xl font-black text-emerald-600 mt-1 block">Live Tracking</span>
              <span className="text-[10px] text-slate-400">Dispatch to delivery milestones</span>
            </div>
          </div>

          {/* Type Switcher & Search Bar */}
          <div className="mt-8 bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Type selector tabs */}
            <div className="flex items-center space-x-1 bg-white p-1 rounded-xl border border-slate-200 w-full md:w-auto">
              <button
                onClick={() => setSelectedType('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  selectedType === 'all' ? 'bg-[#16A36A] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Exchange Items
              </button>
              <button
                onClick={() => setSelectedType('supply')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  selectedType === 'supply' ? 'bg-[#16A36A] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Supplies Offered (Donors)
              </button>
              <button
                onClick={() => setSelectedType('need')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  selectedType === 'need' ? 'bg-[#16A36A] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Needs Requested (NGOs)
              </button>
            </div>

            {/* Keyword Search */}
            <form onSubmit={handleSearchSubmit} className="flex-1 w-full md:max-w-md relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search laptops, books, medical kits, location..."
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
              />
            </form>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 mt-4 scrollbar-none">
            {CATEGORIES.map(cat => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                    selectedCategory === cat.id
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

        </div>
      </div>

      {/* Items Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        
        <div className="flex items-center justify-between mb-6">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Displaying {items.length} Circular Listings
          </span>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-400 text-sm">
            Loading marketplace items...
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-md mx-auto">
            <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-black text-slate-800">No Resource Items Found</h3>
            <p className="text-xs text-slate-500 mt-1">Be the first to list an available physical donation or community need.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map(item => {
              const isSupply = item.type === 'supply';
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:border-[#16A36A] hover:shadow-md transition flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                      <img
                        src={item.image_url || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80'}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3 flex items-center space-x-1.5">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase shadow-sm ${
                          isSupply ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white'
                        }`}>
                          {isSupply ? 'SUPPLY AVAILABLE' : 'NEED REQUESTED'}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-white/95 text-slate-800 text-[10px] font-bold capitalize shadow-sm">
                          {item.condition?.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="absolute bottom-3 left-3 flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-[11px] font-medium">
                        <MapPin className="w-3 h-3 text-emerald-400" />
                        <span>{item.location_city}, {item.location_country}</span>
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                        <span className="font-semibold text-slate-700">{item.owner_name}</span>
                        <span className="capitalize text-[10px] font-bold text-[#16A36A] bg-emerald-50 px-2 py-0.5 rounded-full">
                          {item.category}
                        </span>
                      </div>

                      <h3 className="text-base font-black text-slate-900 leading-snug line-clamp-1">{item.title}</h3>
                      <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-slate-400">Total Quantity:</span>
                        <span className="font-black text-slate-900 text-sm">
                          {item.quantity} {item.unit}
                        </span>
                      </div>

                      <div className="mt-2 flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Delivery Status:</span>
                        <span className={`font-bold capitalize flex items-center space-x-1 ${
                          item.status === 'delivered' ? 'text-emerald-700' : item.status === 'in_transit' ? 'text-blue-700' : 'text-amber-700'
                        }`}>
                          {item.status === 'in_transit' && <Truck className="w-3 h-3 animate-pulse" />}
                          {item.status === 'delivered' && <CheckCircle2 className="w-3 h-3" />}
                          <span>{item.status?.replace('_', ' ')}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0">
                    {item.status === 'delivered' ? (
                      <div className="w-full py-2 rounded-xl bg-slate-100 text-slate-500 text-xs font-bold text-center">
                        Delivered & Verified
                      </div>
                    ) : item.status === 'in_transit' ? (
                      <div className="w-full py-2 rounded-xl bg-blue-50 text-blue-800 text-xs font-bold text-center flex items-center justify-center space-x-1">
                        <Truck className="w-3.5 h-3.5" />
                        <span>In Transit to Recipient</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setClaimTarget(item);
                          setClaimQuantity(Math.min(10, item.quantity));
                        }}
                        className="w-full py-2.5 rounded-xl btn-primary text-xs font-bold shadow-xs text-center flex items-center justify-center space-x-1"
                      >
                        <span>{isSupply ? 'Request This Resource' : 'Fulfill / Supply This Need'}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Modal: Claim / Fulfill Resource */}
      {claimTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setClaimTarget(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {claimSuccess ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-[#16A36A]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-slate-900">Exchange Claim Confirmed!</h3>
                <p className="text-xs text-slate-600 max-w-xs mx-auto">
                  A dispatch dispatch confirmation has been routed to {claimTarget.owner_name}. Logistics tracking will update as goods move.
                </p>
              </div>
            ) : (
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#16A36A] bg-emerald-50 px-2 py-0.5 rounded-full">
                  Resource Logistics Allocation
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-2">{claimTarget.title}</h3>
                <p className="text-xs text-slate-500">
                  Listed by: <span className="font-semibold text-slate-800">{claimTarget.owner_name}</span> ({claimTarget.location_city})
                </p>

                <form onSubmit={handleClaimSubmit} className="space-y-4 mt-5">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Quantity Needed</label>
                      <input
                        type="number"
                        min="1"
                        max={claimTarget.quantity}
                        required
                        value={claimQuantity}
                        onChange={(e) => setClaimQuantity(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Recipient Phone</label>
                      <input
                        type="text"
                        required
                        value={claimPhone}
                        onChange={(e) => setClaimPhone(e.target.value)}
                        placeholder="+91 / +1 ..."
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Delivery Address & Coordination Contact
                    </label>
                    <textarea
                      rows="3"
                      required
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="Specify field office, community center or school delivery instructions..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                    ></textarea>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start space-x-2 text-[11px] text-slate-600">
                    <Truck className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <span>All shipments are logged on the circular ledger. Proof of recipient signature is required upon delivery.</span>
                  </div>

                  <div className="flex items-center justify-end space-x-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setClaimTarget(null)}
                      className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={claiming}
                      className="px-5 py-2 rounded-xl btn-primary text-xs font-bold disabled:opacity-50"
                    >
                      {claiming ? 'Submitting...' : 'Confirm Allocation'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal: Post New Resource or Need */}
      {showListModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowListModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-black text-slate-900 mb-1">Post Resource Exchange Item</h3>
            <p className="text-xs text-slate-500 mb-4">List physical goods you are offering or post an urgent non-monetary requirement.</p>

            <form onSubmit={handleCreateListing} className="space-y-4">
              
              {/* Type Switcher */}
              <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setListType('supply')}
                  className={`py-2 rounded-lg text-xs font-bold transition ${
                    listType === 'supply' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600'
                  }`}
                >
                  Offering Goods (Donor)
                </button>
                <button
                  type="button"
                  onClick={() => setListType('need')}
                  className={`py-2 rounded-lg text-xs font-bold transition ${
                    listType === 'need' ? 'bg-white text-blue-800 shadow-sm' : 'text-slate-600'
                  }`}
                >
                  Requesting Goods (NGO)
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Item Title</label>
                <input
                  type="text"
                  required
                  value={listTitle}
                  onChange={(e) => setListTitle(e.target.value)}
                  placeholder="e.g. 50 Illustrated Science Readers or 20 Medical Cots"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={listCategory}
                    onChange={(e) => setListCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                  >
                    <option value="laptops">Laptops & Hardware</option>
                    <option value="books">Books & Textbooks</option>
                    <option value="medical">Medical Supplies</option>
                    <option value="clothes">Clothes & Blankets</option>
                    <option value="furniture">School Furniture</option>
                    <option value="other">General Community Goods</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Condition</label>
                  <select
                    value={listCondition}
                    onChange={(e) => setListCondition(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                  >
                    <option value="new">Brand New (Unopened)</option>
                    <option value="gently_used">Gently Used (Good Condition)</option>
                    <option value="refurbished">Refurbished & Tested</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={listQuantity}
                    onChange={(e) => setListQuantity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Unit (e.g. books, cots, boxes)</label>
                  <input
                    type="text"
                    required
                    value={listUnit}
                    onChange={(e) => setListUnit(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Location City</label>
                  <input
                    type="text"
                    required
                    value={listCity}
                    onChange={(e) => setListCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Country</label>
                  <input
                    type="text"
                    required
                    value={listCountry}
                    onChange={(e) => setListCountry(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description & Specs</label>
                <textarea
                  rows="3"
                  required
                  value={listDescription}
                  onChange={(e) => setListDescription(e.target.value)}
                  placeholder="Detail specifications, age range, packaging, or inspection certificates..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                ></textarea>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowListModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingList}
                  className="px-5 py-2 rounded-xl btn-primary text-xs font-bold disabled:opacity-50"
                >
                  {submittingList ? 'Publishing...' : 'Publish Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
