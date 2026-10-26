import React, { useState, useEffect } from 'react';
import { 
  QrCode, 
  X, 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  ShieldCheck, 
  AlertCircle, 
  Calendar, 
  Download, 
  Scan,
  RefreshCw,
  Copy,
  Check,
  Camera,
  Sparkles,
  ArrowRight,
  Filter
} from 'lucide-react';
import { fetchVolunteerAttendance, checkInVolunteer } from '../utils/api';

// Sample events for instant selection
const AVAILABLE_EVENTS = [
  { id: 'event-1', projectId: 'proj-1', title: 'Clean Water Wells & Solar Micro-Grids Fieldwork', location: 'Darbhanga, Bihar', defaultHours: 4.5 },
  { id: 'event-2', projectId: 'proj-4', title: 'Urban Miyawaki Afforestation & Tree Plantation', location: 'South Delhi, NCR', defaultHours: 4.0 },
  { id: 'event-3', projectId: 'proj-2', title: 'Rural Youth Digital Literacy Camp', location: 'Barmer, Rajasthan', defaultHours: 3.5 },
  { id: 'event-4', projectId: 'proj-5', title: 'Free Community Health & Pediatric Checkup', location: 'Nashik, Maharashtra', defaultHours: 5.0 }
];

// Sample volunteer quick-select presets for testing
const QUICK_VOLUNTEERS = [
  { name: 'Marcus Chen', email: 'marcus.chen@apextech.com', org: 'Apex Technologies' },
  { name: 'Dr. Ramesh Kulkarni', email: 'dr.kulkarni@healthnet.org', org: 'HealthNet Global' },
  { name: 'Priya Sharma', email: 'priya.sharma@earthguard.in', org: 'EarthGuard Alliance' },
  { name: 'Ananya Roy', email: 'ananya.roy@vidyacares.org', org: 'Vidya Foundation' }
];

// SVG QR Code Generator
function QrMatrixSvg({ value = 'QR-IC-2026-VOL99', size = 180 }) {
  const gridSize = 25;
  const hash = Array.from(value).reduce((acc, char, i) => acc + char.charCodeAt(0) * (i + 1) * 31, 1337);
  const matrix = Array.from({ length: gridSize }, () => Array(gridSize).fill(false));

  const drawFinder = (startR, startC) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (
          r === 0 || r === 6 || c === 0 || c === 6 ||
          (r >= 2 && r <= 4 && c >= 2 && c <= 4)
        ) {
          matrix[startR + r][startC + c] = true;
        }
      }
    }
  };

  drawFinder(0, 0);
  drawFinder(0, gridSize - 7);
  drawFinder(gridSize - 7, 0);

  for (let i = 8; i < gridSize - 8; i++) {
    matrix[6][i] = i % 2 === 0;
    matrix[i][6] = i % 2 === 0;
  }

  for (let r = 16; r <= 20; r++) {
    for (let c = 16; c <= 20; c++) {
      if (r === 16 || r === 20 || c === 16 || c === 20 || (r === 18 && c === 18)) {
        matrix[r][c] = true;
      }
    }
  }

  let seed = hash;
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      const isTopLeftFinder = r < 8 && c < 8;
      const isTopRightFinder = r < 8 && c >= gridSize - 8;
      const isBottomLeftFinder = r >= gridSize - 8 && c < 8;
      const isTiming = r === 6 || c === 6;
      const isAlignment = r >= 16 && r <= 20 && c >= 16 && c <= 20;
      const isCenterLogo = r >= 10 && r <= 14 && c >= 10 && c <= 14;

      if (!isTopLeftFinder && !isTopRightFinder && !isBottomLeftFinder && !isTiming && !isAlignment && !isCenterLogo) {
        seed = (seed * 9301 + 49297) % 233280;
        matrix[r][c] = seed / 233280 > 0.48;
      }
    }
  }

  const cellSize = size / gridSize;

  return (
    <div className="relative inline-block bg-white p-3.5 rounded-2xl shadow-sm border border-slate-200">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rounded-lg">
        {matrix.map((row, r) =>
          row.map((filled, c) =>
            filled ? (
              <rect
                key={`${r}-${c}`}
                x={c * cellSize}
                y={r * cellSize}
                width={cellSize - 0.25}
                height={cellSize - 0.25}
                rx={cellSize * 0.2}
                fill="#0F172A"
              />
            ) : null
          )
        )}
        <circle cx={size / 2} cy={size / 2} r={cellSize * 2.8} fill="#16A36A" />
      </svg>
      <div 
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ width: size + 28, height: size + 28 }}
      >
        <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[#16A36A] font-black text-xs shadow-md">
          ✓
        </div>
      </div>
    </div>
  );
}

export default function VolunteerQrAttendanceModal({
  isOpen,
  currentUser,
  onClose,
  language = 'en'
}) {
  // All hooks must be defined before any conditional return
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('scan'); // 'scan' | 'records' | 'my_qr'
  const [scannerView, setScannerView] = useState('viewfinder'); // 'viewfinder' | 'form'
  const [isScanningAnim, setIsScanningAnim] = useState(false);

  // Check-In Form State
  const [selectedEvent, setSelectedEvent] = useState(AVAILABLE_EVENTS[0]);
  const [sessionSuffix, setSessionSuffix] = useState('');
  const [volunteerName, setVolunteerName] = useState(currentUser?.name || 'Marcus Chen');
  const [volunteerEmail, setVolunteerEmail] = useState(currentUser?.email || 'marcus.chen@apextech.com');
  const [hoursToLog, setHoursToLog] = useState(4.5);
  const [qrToken, setQrToken] = useState('QR-IC-2026-MC8812');
  const [submittingScan, setSubmittingScan] = useState(false);
  const [scanMessage, setScanMessage] = useState(null);
  const [copiedBadge, setCopiedBadge] = useState(false);

  // Sync state when currentUser changes
  useEffect(() => {
    if (currentUser) {
      setVolunteerName(currentUser.name || 'Marcus Chen');
      setVolunteerEmail(currentUser.email || 'marcus.chen@apextech.com');
      setQrToken(`QR-IC-2026-${(currentUser.id || 'MC88').toUpperCase()}`);
    }
  }, [currentUser]);

  // Load attendance records
  const loadAttendance = async () => {
    setLoading(true);
    try {
      const data = await fetchVolunteerAttendance({});
      setRecords(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching attendance records:', err);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadAttendance();
      setScanMessage(null);
    }
  }, [isOpen]);

  // If modal is not open, return null only after all hooks are declared
  if (!isOpen) return null;

  const myBadgeToken = `QR-IC-2026-${(currentUser?.id || 'VOL99').toUpperCase()}-${(currentUser?.name || 'USER').replace(/\s+/g, '').slice(0, 4).toUpperCase()}`;

  const handleSimulateScan = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setSubmittingScan(true);
    setScanMessage(null);

    try {
      // Create session key that allows fresh testing without duplicate error if needed
      const effectiveEventId = sessionSuffix 
        ? `${selectedEvent.id}-${sessionSuffix.trim().toLowerCase()}`
        : `${selectedEvent.id}-${new Date().toISOString().slice(0, 10)}`;

      const tokenToSubmit = qrToken.trim() || `QR-EVENT-${Date.now().toString().slice(-5)}`;

      const result = await checkInVolunteer({
        event_id: effectiveEventId,
        project_id: selectedEvent.projectId,
        project_title: selectedEvent.title,
        volunteer_name: volunteerName.trim(),
        volunteer_email: volunteerEmail.trim(),
        qr_token: tokenToSubmit,
        hours_logged: Number(hoursToLog) || 4.0,
        verified_by: currentUser?.name || 'Authorized Field Coordinator'
      });

      setScanMessage({ 
        success: true, 
        text: `Verified! ${result.hours_logged} hours successfully logged for ${result.volunteer_name}.` 
      });
      loadAttendance();
    } catch (err) {
      const isDuplicate = err.message && err.message.toLowerCase().includes('already checked in');
      setScanMessage({ 
        success: false, 
        text: err.message || 'Check-in failed.',
        isDuplicate
      });
    } finally {
      setSubmittingScan(false);
    }
  };

  const handleTriggerScannerAnimation = () => {
    setIsScanningAnim(true);
    setScanMessage(null);
    setTimeout(async () => {
      setIsScanningAnim(false);
      await handleSimulateScan();
    }, 1200);
  };

  const handleCopyBadge = () => {
    navigator.clipboard.writeText(myBadgeToken);
    setCopiedBadge(true);
    setTimeout(() => setCopiedBadge(false), 2000);
  };

  const handleApplyPresetVolunteer = (vol) => {
    setVolunteerName(vol.name);
    setVolunteerEmail(vol.email);
    setQrToken(`QR-IC-2026-${vol.name.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`);
    setScanMessage(null);
  };

  const safeRecords = Array.isArray(records) ? records : [];
  const totalHoursLogged = safeRecords.reduce((sum, r) => sum + Number(r.hours_logged || 0), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden relative">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#16A36A] border border-emerald-200 flex items-center justify-center font-bold shadow-xs">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  Volunteer QR Attendance & Field Tracker
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Live Verified
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Instant digital kiosk scan, duplicate prevention & transparent community service certification.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200/80 text-slate-400 hover:text-slate-700 transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Strip */}
        <div className="flex border-b border-slate-200 px-6 bg-white overflow-x-auto">
          <button
            onClick={() => setActiveTab('scan')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center space-x-2 transition whitespace-nowrap ${
              activeTab === 'scan' ? 'border-[#16A36A] text-[#16A36A]' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Scan className="w-3.5 h-3.5" />
            <span>Event QR Scanner</span>
          </button>

          <button
            onClick={() => setActiveTab('my_qr')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center space-x-2 transition whitespace-nowrap ${
              activeTab === 'my_qr' ? 'border-[#16A36A] text-[#16A36A]' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>My Volunteer QR Badge</span>
          </button>

          <button
            onClick={() => setActiveTab('records')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center space-x-2 transition whitespace-nowrap ${
              activeTab === 'records' ? 'border-[#16A36A] text-[#16A36A]' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Audited Attendance Log ({safeRecords.length})</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-slate-50/50">
          
          {/* TAB 1: SCAN / CHECK-IN */}
          {activeTab === 'scan' && (
            <div className="max-w-lg mx-auto space-y-5">
              
              {/* Status Message Banner */}
              {scanMessage && (
                <div className={`p-4 rounded-2xl text-xs font-medium flex items-start space-x-2.5 transition ${
                  scanMessage.success 
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' 
                    : 'bg-rose-50 border border-rose-200 text-rose-800'
                }`}>
                  {scanMessage.success ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-[#16A36A] mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <span className="font-bold">{scanMessage.text}</span>
                    {scanMessage.success && (
                      <div className="mt-2 flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => setActiveTab('records')}
                          className="px-2.5 py-1 bg-white border border-emerald-300 rounded-lg text-[11px] font-bold text-emerald-700 hover:bg-emerald-100/50 transition inline-flex items-center space-x-1"
                        >
                          <span>View in Attendance Log</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                    {scanMessage.isDuplicate && (
                      <div className="mt-2 flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => {
                            setSessionSuffix(`session-${Date.now().toString().slice(-3)}`);
                            setScanMessage(null);
                          }}
                          className="px-2.5 py-1 bg-white border border-rose-300 rounded-lg text-[11px] font-bold text-rose-700 hover:bg-rose-100/50 transition"
                        >
                          Create New Session Suffix & Retry
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* View Mode Toggle: Interactive Camera Scanner vs Detailed Manual Input */}
              <div className="bg-white p-1.5 rounded-2xl border border-slate-200 flex items-center shadow-xs">
                <button
                  type="button"
                  onClick={() => setScannerView('viewfinder')}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
                    scannerView === 'viewfinder' 
                      ? 'bg-emerald-50 text-[#16A36A] shadow-xs border border-emerald-200' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Kiosk Camera Viewfinder</span>
                </button>
                <button
                  type="button"
                  onClick={() => setScannerView('form')}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
                    scannerView === 'form' 
                      ? 'bg-emerald-50 text-[#16A36A] shadow-xs border border-emerald-200' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Scan className="w-3.5 h-3.5" />
                  <span>Passkey Entry Form</span>
                </button>
              </div>

              {/* VIEW 1: LIVE VIEWFINDER SCANNER SIMULATION */}
              {scannerView === 'viewfinder' && (
                <div className="bg-slate-900 p-6 rounded-3xl text-white shadow-xl relative overflow-hidden flex flex-col items-center">
                  
                  {/* Camera Top Status */}
                  <div className="w-full flex items-center justify-between text-[11px] text-slate-400 mb-4 px-1">
                    <span className="flex items-center space-x-1.5 font-mono">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                      <span>KIOSK CAMERA • ACTIVE</span>
                    </span>
                    <span className="font-mono text-slate-300">
                      EVENT: {(selectedEvent?.id || 'EV1').toUpperCase()}
                    </span>
                  </div>

                  {/* Target Finder Box */}
                  <div className="w-64 h-64 border-2 border-dashed border-emerald-400/60 rounded-3xl relative flex items-center justify-center bg-slate-800/40 p-4">
                    {/* Corner Reticles */}
                    <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-emerald-400"></div>
                    <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-emerald-400"></div>
                    <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-emerald-400"></div>
                    <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-emerald-400"></div>

                    {/* Animated Scanning Laser Beam */}
                    {isScanningAnim && (
                      <div className="absolute inset-x-3 h-1 bg-gradient-to-r from-emerald-500 via-green-400 to-emerald-500 shadow-lg shadow-emerald-500/80 animate-pulse top-1/2 -translate-y-1/2 rounded-full"></div>
                    )}

                    {/* Target preview */}
                    <div className="text-center space-y-2 select-none">
                      <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto text-emerald-400">
                        <QrCode className="w-10 h-10" />
                      </div>
                      <div className="text-xs font-bold text-slate-200">
                        {volunteerName}
                      </div>
                      <div className="text-[10px] font-mono text-emerald-300/80 bg-slate-900/80 px-2 py-0.5 rounded-full inline-block">
                        {qrToken}
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 mt-4 text-center max-w-xs">
                    Align volunteer badge or mobile screen in viewfinder to record attendance.
                  </p>

                  <button
                    type="button"
                    disabled={isScanningAnim || submittingScan}
                    onClick={handleTriggerScannerAnimation}
                    className="mt-5 w-full py-3 rounded-2xl bg-[#16A36A] hover:bg-emerald-600 active:scale-98 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-emerald-900/40 transition disabled:opacity-60"
                  >
                    <Scan className="w-4 h-4" />
                    <span>
                      {isScanningAnim 
                        ? 'Decoding Badge & Verifying...' 
                        : submittingScan 
                        ? 'Recording...' 
                        : `Scan Badge & Log ${hoursToLog} Hours`}
                    </span>
                  </button>
                </div>
              )}

              {/* VIEW 2: DETAILED FORM */}
              <div className={`bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4 ${scannerView === 'viewfinder' ? 'block' : 'block'}`}>
                
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                    <UserCheck className="w-4 h-4 text-[#16A36A]" />
                    <span>Volunteer & Event Details</span>
                  </span>
                  <span className="text-[11px] text-slate-400">Verified Field Drive</span>
                </div>

                {/* Event Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Select Active Community Project / Drive
                  </label>
                  <select
                    value={selectedEvent.id}
                    onChange={(e) => {
                      const found = AVAILABLE_EVENTS.find(ev => ev.id === e.target.value);
                      if (found) {
                        setSelectedEvent(found);
                        setHoursToLog(found.defaultHours);
                      }
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                  >
                    {AVAILABLE_EVENTS.map(ev => (
                      <option key={ev.id} value={ev.id}>
                        {ev.title} ({ev.location})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Preset 1-Click Volunteers */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1.5">
                    1-Click Test Volunteer Presets:
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {QUICK_VOLUNTEERS.map(vol => (
                      <button
                        key={vol.email}
                        type="button"
                        onClick={() => handleApplyPresetVolunteer(vol)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition border ${
                          volunteerEmail === vol.email
                            ? 'bg-emerald-50 text-[#16A36A] border-emerald-300 font-bold'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {vol.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Form Fields */}
                <form onSubmit={handleSimulateScan} className="space-y-3 pt-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Volunteer Name</label>
                      <input
                        type="text"
                        required
                        value={volunteerName}
                        onChange={(e) => setVolunteerName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Hours Completed</label>
                      <input
                        type="number"
                        step="0.5"
                        min="0.5"
                        max="12"
                        required
                        value={hoursToLog}
                        onChange={(e) => setHoursToLog(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Volunteer Email</label>
                    <input
                      type="email"
                      required
                      value={volunteerEmail}
                      onChange={(e) => setVolunteerEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Scanned QR Passkey / Token
                    </label>
                    <input
                      type="text"
                      value={qrToken}
                      onChange={(e) => setQrToken(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                    />
                  </div>

                  {scannerView === 'form' && (
                    <button
                      type="submit"
                      disabled={submittingScan}
                      className="w-full py-2.5 rounded-xl btn-primary text-xs font-bold flex items-center justify-center space-x-1.5 shadow-sm mt-3"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{submittingScan ? 'Verifying...' : 'Validate & Credit Volunteer Hours'}</span>
                    </button>
                  )}
                </form>

              </div>
            </div>
          )}

          {/* TAB 2: MY QR BADGE */}
          {activeTab === 'my_qr' && (
            <div className="max-w-sm mx-auto bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm text-center space-y-4 animate-fade-in">
              
              <div className="inline-flex items-center space-x-1.5 text-[10px] font-bold uppercase tracking-wider text-[#16A36A] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>ImpactConnect Verified Volunteer</span>
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">
                  {currentUser?.name || volunteerName || 'Dr. Ramesh Kulkarni'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {currentUser?.email || volunteerEmail || 'dr.kulkarni@healthnet.org'}
                </p>
              </div>

              {/* Dynamic SVG QR Matrix */}
              <div className="py-2 flex justify-center">
                <QrMatrixSvg value={myBadgeToken} size={170} />
              </div>

              {/* Passkey Pill with Copy Button */}
              <div className="flex items-center justify-between bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 text-left">
                <div>
                  <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 block">Volunteer Passkey</span>
                  <span className="text-xs font-mono font-bold text-slate-800">{myBadgeToken}</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyBadge}
                  className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition"
                  title="Copy passkey"
                >
                  {copiedBadge ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed">
                Present this digital QR badge at the field kiosk during community projects to automatically authenticate your identity and clock verified service hours.
              </p>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setVolunteerName(currentUser?.name || volunteerName);
                    setVolunteerEmail(currentUser?.email || volunteerEmail);
                    setQrToken(myBadgeToken);
                    setActiveTab('scan');
                  }}
                  className="w-full py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#16A36A] font-bold text-xs border border-emerald-200 flex items-center justify-center space-x-1 transition"
                >
                  <Scan className="w-3.5 h-3.5" />
                  <span>Test Scan Badge</span>
                </button>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="w-full py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center justify-center space-x-1 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Print Pass</span>
                </button>
              </div>

            </div>
          )}

          {/* TAB 3: RECORDS LOG */}
          {activeTab === 'records' && (
            <div className="space-y-4 max-w-xl mx-auto animate-fade-in">
              
              {/* Summary Stats Banner */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center justify-between shadow-xs">
                <div>
                  <span className="text-xs text-slate-500 font-medium">Total Audited Volunteer Hours</span>
                  <div className="text-2xl font-black text-[#16A36A] mt-0.5 tracking-tight">
                    {totalHoursLogged.toFixed(1)} hrs
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">
                    Backed by immutable field coordinator signatures
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={loadAttendance}
                    disabled={loading}
                    className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition"
                    title="Refresh attendance records"
                  >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#16A36A]' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Records List */}
              {safeRecords.length === 0 ? (
                <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500 text-xs">
                  <Clock className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                  <p className="font-bold text-slate-700">No attendance check-ins recorded yet.</p>
                  <p className="mt-1 text-slate-400">Switch to the "Event QR Scanner" tab to record your first field attendance.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {safeRecords.map(r => (
                    <div 
                      key={r.id || `${r.volunteer_email}-${r.check_in_time}`} 
                      className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2 hover:border-slate-300 transition shadow-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-slate-900">{r.volunteer_name}</span>
                          <span className="text-[11px] text-slate-400 font-mono">({r.volunteer_email})</span>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-50 text-emerald-800 border border-emerald-200">
                          +{r.hours_logged || 4.0} Hours
                        </span>
                      </div>

                      <div className="text-xs text-slate-700 font-medium">
                        Project: <span className="font-bold text-slate-900">{r.project_title || 'Community Field Drive'}</span>
                      </div>

                      <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100 gap-2">
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>{r.check_in_time ? new Date(r.check_in_time).toLocaleString() : 'Just now'}</span>
                        </span>
                        <span className="text-slate-500 font-mono text-[10px]">
                          Token: {r.qr_token || 'QR-VERIFIED'}
                        </span>
                        <span className="text-emerald-700 font-medium bg-emerald-50/60 px-2 py-0.5 rounded-md">
                          Verified by: {r.verified_by || 'Coordinator'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
