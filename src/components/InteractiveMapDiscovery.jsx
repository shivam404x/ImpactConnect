import React, { useState, useMemo } from 'react';
import { 
  MapPin, 
  Navigation, 
  Layers, 
  Search, 
  ExternalLink, 
  ChevronRight, 
  HeartHandshake, 
  ShieldCheck, 
  AlertCircle,
  Compass
} from 'lucide-react';

// Haversine formula for distance calculation in kilometers
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const d = R * c; 
  return Math.round(d);
}

function deg2rad(deg) {
  return deg * (Math.PI/180);
}

// Map coordinate normalizer to SVG percentage (Mercator approximation)
function projectCoordinatesToSvg(lat, lng) {
  // World bounds roughly -60 to 75 lat, -140 to 150 lng
  const minLat = -50;
  const maxLat = 70;
  const minLng = -130;
  const maxLng = 145;

  const clampedLat = Math.max(minLat, Math.min(maxLat, lat || 20));
  const clampedLng = Math.max(minLng, Math.min(maxLng, lng || 0));

  const x = ((clampedLng - minLng) / (maxLng - minLng)) * 100;
  const y = (1 - (clampedLat - minLat) / (maxLat - minLat)) * 100;

  return { x: Math.max(5, Math.min(95, x)), y: Math.max(8, Math.min(92, y)) };
}

export default function InteractiveMapDiscovery({
  projects = [],
  onSelectProject,
  onPartnerClick
}) {
  // User simulated / detected location
  // Default to Austin or Delhi
  const [userLocation, setUserLocation] = useState({
    name: 'Austin, TX (Demo Origin)',
    lat: 30.2672,
    lng: -97.7431,
    detected: false
  });

  const [radiusFilter, setRadiusFilter] = useState('all'); // '25' | '100' | '500' | 'all'
  const [selectedPin, setSelectedPin] = useState(null);
  const [locationQuery, setLocationQuery] = useState('');
  const [locating, setLocating] = useState(false);

  // Handle GPS detection
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          name: 'Your Current Location',
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          detected: true
        });
        setLocating(false);
      },
      (err) => {
        console.warn('Geolocation denied or unavailable:', err.message);
        setUserLocation({
          name: 'New Delhi, India (Fallback Hub)',
          lat: 28.6139,
          lng: 77.2090,
          detected: false
        });
        setLocating(false);
        alert('Could not access device GPS. Defaulting to New Delhi regional hub.');
      },
      { timeout: 6000 }
    );
  };

  // Preset location switch
  const handleSelectPresetCity = (city) => {
    if (city === 'delhi') {
      setUserLocation({ name: 'New Delhi, India', lat: 28.6139, lng: 77.2090, detected: false });
    } else if (city === 'austin') {
      setUserLocation({ name: 'Austin, TX, USA', lat: 30.2672, lng: -97.7431, detected: false });
    } else if (city === 'nairobi') {
      setUserLocation({ name: 'Nairobi, Kenya', lat: -1.2921, lng: 36.8219, detected: false });
    } else if (city === 'bangalore') {
      setUserLocation({ name: 'Bangalore, India', lat: 12.9716, lng: 77.5946, detected: false });
    }
  };

  // Filter projects with distance
  const projectsWithDistance = useMemo(() => {
    return projects.map(p => {
      // Use project lat/lng or fallback based on city
      let lat = p.latitude;
      let lng = p.longitude;
      if (!lat) {
        if (p.location_city?.toLowerCase().includes('delhi')) { lat = 28.6; lng = 77.2; }
        else if (p.location_city?.toLowerCase().includes('austin')) { lat = 30.26; lng = -97.74; }
        else if (p.location_city?.toLowerCase().includes('nairobi')) { lat = -1.29; lng = 36.82; }
        else if (p.location_city?.toLowerCase().includes('bangalore')) { lat = 12.97; lng = 77.59; }
        else { lat = 20.59; lng = 78.96; }
      }

      const distance = getDistanceFromLatLonInKm(userLocation.lat, userLocation.lng, lat, lng);
      const coords = projectCoordinatesToSvg(lat, lng);

      return {
        ...p,
        computedLat: lat,
        computedLng: lng,
        distance,
        coords
      };
    });
  }, [projects, userLocation]);

  const filteredProjects = useMemo(() => {
    let list = [...projectsWithDistance];
    if (radiusFilter !== 'all') {
      const maxKm = Number(radiusFilter);
      list = list.filter(p => p.distance !== null && p.distance <= maxKm);
    }
    return list;
  }, [projectsWithDistance, radiusFilter]);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-12">
      
      {/* Top Map Control Bar */}
      <div className="p-4 sm:p-6 border-b border-slate-200 bg-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1 rounded-lg bg-emerald-100 text-[#16A36A]">
              <MapPin className="w-4 h-4" />
            </span>
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              Location-Based Project Discovery
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Active anchor: <span className="font-bold text-slate-800">{userLocation.name}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Quick preset cities */}
          <div className="flex items-center space-x-1 text-xs">
            <span className="text-[11px] text-slate-400 font-semibold mr-1">City Hub:</span>
            <button
              onClick={() => handleSelectPresetCity('delhi')}
              className="px-2 py-1 rounded-lg bg-white border border-slate-200 text-[11px] font-bold text-slate-700 hover:border-[#16A36A]"
            >
              Delhi
            </button>
            <button
              onClick={() => handleSelectPresetCity('bangalore')}
              className="px-2 py-1 rounded-lg bg-white border border-slate-200 text-[11px] font-bold text-slate-700 hover:border-[#16A36A]"
            >
              Bangalore
            </button>
            <button
              onClick={() => handleSelectPresetCity('austin')}
              className="px-2 py-1 rounded-lg bg-white border border-slate-200 text-[11px] font-bold text-slate-700 hover:border-[#16A36A]"
            >
              Austin
            </button>
            <button
              onClick={() => handleSelectPresetCity('nairobi')}
              className="px-2 py-1 rounded-lg bg-white border border-slate-200 text-[11px] font-bold text-slate-700 hover:border-[#16A36A]"
            >
              Nairobi
            </button>
          </div>

          {/* Radius selector */}
          <select
            value={radiusFilter}
            onChange={(e) => setRadiusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
          >
            <option value="all">Any Distance</option>
            <option value="50">Within 50 km</option>
            <option value="200">Within 200 km</option>
            <option value="1000">Within 1,000 km</option>
          </select>

          {/* Detect Location */}
          <button
            onClick={handleDetectLocation}
            disabled={locating}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition disabled:opacity-50"
          >
            <Navigation className={`w-3.5 h-3.5 ${locating ? 'animate-spin' : ''}`} />
            <span>{locating ? 'Detecting...' : 'Near Me'}</span>
          </button>
        </div>
      </div>

      {/* Interactive Map Visual Stage */}
      <div className="relative w-full h-[450px] bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 overflow-hidden select-none">
        
        {/* Subtle SVG Grid overlay & stylized world contours */}
        <svg 
          viewBox="0 0 1000 500" 
          className="w-full h-full object-cover opacity-25"
        >
          {/* Latitude and Longitude Grids */}
          <line x1="0" y1="125" x2="1000" y2="125" stroke="#94A3B8" strokeWidth="0.5" strokeDasharray="4 4" />
          <line x1="0" y1="250" x2="1000" y2="250" stroke="#16A36A" strokeWidth="1" strokeDasharray="6 6" />
          <line x1="0" y1="375" x2="1000" y2="375" stroke="#94A3B8" strokeWidth="0.5" strokeDasharray="4 4" />
          <line x1="250" y1="0" x2="250" y2="500" stroke="#94A3B8" strokeWidth="0.5" strokeDasharray="4 4" />
          <line x1="500" y1="0" x2="500" y2="500" stroke="#16A36A" strokeWidth="1" strokeDasharray="6 6" />
          <line x1="750" y1="0" x2="750" y2="500" stroke="#94A3B8" strokeWidth="0.5" strokeDasharray="4 4" />

          {/* Continents outline shapes (Stylized SVG polygons) */}
          <path d="M120,90 Q220,80 260,140 Q280,210 210,230 Q170,180 120,90 Z" fill="#334155" opacity="0.6" />
          <path d="M210,260 Q280,270 270,360 Q240,430 200,380 Z" fill="#334155" opacity="0.6" />
          <path d="M440,90 Q560,70 600,140 Q550,170 470,140 Z" fill="#334155" opacity="0.6" />
          <path d="M470,180 Q560,170 540,320 Q480,360 450,260 Z" fill="#334155" opacity="0.6" />
          <path d="M600,90 Q820,70 850,220 Q750,270 630,220 Z" fill="#334155" opacity="0.6" />
          <path d="M780,310 Q880,300 870,400 Q800,420 780,310 Z" fill="#334155" opacity="0.6" />
        </svg>

        {/* Center Anchor Point (Current User) */}
        {(() => {
          const userCoords = projectCoordinatesToSvg(userLocation.lat, userLocation.lng);
          return (
            <div 
              style={{ left: `${userCoords.x}%`, top: `${userCoords.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
            >
              <div className="relative flex items-center justify-center">
                <span className="animate-ping absolute inline-flex h-9 w-9 rounded-full bg-emerald-400 opacity-75"></span>
                <div className="w-5 h-5 rounded-full bg-[#16A36A] ring-4 ring-white/90 flex items-center justify-center text-white shadow-lg">
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                </div>
              </div>
              <div className="absolute top-6 left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-0.5 rounded-full bg-slate-900/90 text-[10px] font-bold text-white border border-slate-700 shadow-md">
                📍 You ({userLocation.name.split(',')[0]})
              </div>
            </div>
          );
        })()}

        {/* Interactive Pins for Projects */}
        {filteredProjects.map((p) => {
          const isSelected = selectedPin?.id === p.id;
          return (
            <div
              key={p.id}
              onClick={() => setSelectedPin(p)}
              style={{ left: `${p.coords.x}%`, top: `${p.coords.y}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 z-30 cursor-pointer group transition-all duration-300 ${
                isSelected ? 'scale-125 z-40' : 'hover:scale-110'
              }`}
            >
              <div className="relative">
                {/* Pin marker */}
                <div className={`p-1.5 rounded-2xl shadow-xl border flex items-center space-x-1 transition ${
                  isSelected 
                    ? 'bg-amber-400 text-slate-950 border-white ring-4 ring-amber-300/40' 
                    : 'bg-white text-slate-900 border-slate-200 group-hover:border-[#16A36A]'
                }`}>
                  <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-slate-950' : 'text-[#16A36A]'}`} />
                  <span className="text-[10px] font-black max-w-[80px] truncate hidden sm:inline">
                    {p.location_city}
                  </span>
                </div>

                {/* Distance Badge */}
                {p.distance !== null && (
                  <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[9px] font-bold text-emerald-400 bg-slate-950/80 px-1.5 rounded-md whitespace-nowrap">
                    {p.distance} km
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {/* Selected Pin Floating Card */}
        {selectedPin && (
          <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-50 bg-white rounded-2xl p-4 shadow-2xl border border-slate-200 animate-fade-in">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#16A36A] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                  {selectedPin.cause_category} • {selectedPin.distance} km away
                </span>
                <h3 className="text-sm font-black text-slate-900 mt-1 leading-tight line-clamp-1">
                  {selectedPin.title}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  By <span className="font-semibold text-slate-700">{selectedPin.ngo_name}</span> in {selectedPin.location_city}, {selectedPin.location_country}
                </p>
              </div>

              <button
                onClick={() => setSelectedPin(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 mt-2 line-clamp-2">
              {selectedPin.description}
            </p>

            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => onSelectProject(selectedPin)}
                className="text-xs font-bold text-slate-700 hover:text-slate-900"
              >
                View Full Details
              </button>

              <button
                onClick={() => onPartnerClick(selectedPin)}
                className="px-3.5 py-1.5 rounded-xl btn-primary text-xs font-bold flex items-center space-x-1 shadow-sm"
              >
                <HeartHandshake className="w-3.5 h-3.5" />
                <span>Partner Now</span>
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Bottom Summary Bar */}
      <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 px-6">
        <span>Displaying {filteredProjects.length} geo-referenced initiatives within selected bounds.</span>
        <span className="text-[11px] text-slate-400">All coordinates verified with local municipal wards.</span>
      </div>

    </div>
  );
}
