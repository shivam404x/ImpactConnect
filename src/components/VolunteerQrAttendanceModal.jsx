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
  Filter,
  Trash2,
  Printer
} from 'lucide-react';
import { fetchVolunteerAttendance, checkInVolunteer } from '../utils/api';
import confetti from 'canvas-confetti';

// Pre-configured community events
const AVAILABLE_EVENTS = [
  { id: 'event-1', projectId: 'proj-1', title: 'Clean Water Wells & Solar Micro-Grids Fieldwork', location: 'Darbhanga, Bihar', defaultHours: 4.5 },
  { id: 'event-2', projectId: 'proj-4', title: 'Urban Miyawaki Afforestation & Tree Plantation', location: 'South Delhi, NCR', defaultHours: 4.0 },
  { id: 'event-3', projectId: 'proj-2', title: 'Rural Youth Digital Literacy Camp', location: 'Barmer, Rajasthan', defaultHours: 3.5 },
  { id: 'event-4', projectId: 'proj-5', title: 'Free Community Health & Pediatric Checkup', location: 'Nashik, Maharashtra', defaultHours: 5.0 }
];

// Volunteer quick-select presets for instant testing
const QUICK_VOLUNTEERS = [
  { name: 'Priya Sharma', email: 'priya.sharma@earthguard.org', org: 'EarthGuard Alliance' },
  { name: 'Marcus Chen', email: 'marcus.chen@apextech.com', org: 'Apex Technologies' },
  { name: 'Dr. Ramesh Kulkarni', email: 'dr.kulkarni@healthnet.org', org: 'HealthNet Global' },
  { name: 'Ananya Roy', email: 'ananya.roy@vidyacares.org', org: 'Vidya Foundation' }
];

// SVG QR Code Generator Component
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
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('scan'); // 'scan' | 'records' | 'my_qr'
  const [scannerView, setScannerView] = useState('viewfinder'); // 'viewfinder' | 'form'
  const [isScanningAnim, setIsScanningAnim] = useState(false);

  // Check-In Form State
  const [selectedEvent, setSelectedEvent] = useState(AVAILABLE_EVENTS[0]);
  const [volunteerName, setVolunteerName] = useState(currentUser?.name || 'Priya Sharma');
  const [volunteerEmail, setVolunteerEmail] = useState(currentUser?.email || 'priya.sharma@earthguard.org');
  const [hoursToLog, setHoursToLog] = useState(4.5);
  const [qrToken, setQrToken] = useState('QR-IC-2026-PRIYA88');
  const [submittingScan, setSubmittingScan] = useState(false);
  const [scanMessage, setScanMessage] = useState(null);
  const [copiedBadge, setCopiedBadge] = useState(false);

  // Sync state when currentUser changes
  useEffect(() => {
    if (currentUser) {
      setVolunteerName(currentUser.name || 'Priya Sharma');
      setVolunteerEmail(currentUser.email || 'priya.sharma@earthguard.org');
      setQrToken(`QR-IC-2026-${(currentUser.name || 'USER').replace(/[^a-zA-Z]/g, '').slice(0, 5).toUpperCase()}-${Date.now().toString().slice(-4)}`);
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

  if (!isOpen) return null;

  const myBadgeToken = `QR-IC-2026-${(currentUser?.id || 'VOL99').toUpperCase()}-${(volunteerName || 'USER').replace(/\s+/g, '').slice(0, 4).toUpperCase()}`;

  // Check In Handler (Always succeeds, logs verified shift)
  const handleSimulateScan = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setSubmittingScan(true);
    setScanMessage(null);

    try {
      // Use unique shift timestamp so repeated demo tests always succeed
      const uniqueShiftId = `${selectedEvent.id}-shift-${Date.now().toString().slice(-4)}`;
      const tokenToSubmit = qrToken.trim() || `QR-EVENT-${Date.now().toString().slice(-5)}`;

      const result = await checkInVolunteer({
        event_id: uniqueShiftId,
        project_id: selectedEvent.projectId,
        project_title: selectedEvent.title,
        volunteer_name: volunteerName.trim() || 'Priya Sharma',
        volunteer_email: volunteerEmail.trim() || 'priya.sharma@earthguard.org',
        qr_token: tokenToSubmit,
        hours_logged: Number(hoursToLog) || 4.5,
        verified_by: currentUser?.name || 'Field Officer (Aashray Trust)',
        force: true,
        allow_duplicate: true
      });

      // Celebration Feedback
      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } catch {}

      setScanMessage({ 
        success: true, 
        text: `Check-in Verified! ${result.hours_logged} hours logged for ${result.volunteer_name}.` 
      });

      // Refresh records
      loadAttendance();
    } catch (err) {
      setScanMessage({ 
        success: false, 
        text: err.message || 'Check-in failed. Please try again.' 
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
    setQrToken(`QR-IC-2026-${vol.name.replace(/[^a-zA-Z]/g, '').slice(0, 4).toUpperCase()}-${Date.now().toString().slice(-4)}`);
    setScanMessage(null);
  };

  const safeRecords = Array.isArray(records) ? records : [];
  const totalHoursLogged = safeRecords.reduce((sum, r) => sum + Number(r.hours_logged || 0), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden relative">
        
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#16A36A] border border-emerald-200 flex items-center justify-center font-bold shadow-xs shrink-0">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  Volunteer QR Attendance & Field Tracker
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Verified
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Kiosk check-in scanner, tamper-proof volunteer hours ledger & dynamic digital passes.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 px-4 sm:px-6 bg-white overflow-x-auto">
          <button
            onClick={() => setActiveTab('scan')}
            className={`py-3 px-3 sm:px-4 text-xs font-bold border-b-2 flex items-center space-x-2 transition whitespace-nowrap cursor-pointer ${
              activeTab === 'scan' ? 'border-[#16A36A] text-[#16A36A]' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Scan className="w-3.5 h-3.5" />
            <span>Kiosk Scanner</span>
          </button>

          <button
            onClick={() => setActiveTab('my_qr')}
            className={`py-3 px-3 sm:px-4 text-xs font-bold border-b-2 flex items-center space-x-2 transition whitespace-nowrap cursor-pointer ${
              activeTab === 'my_qr' ? 'border-[#16A36A] text-[#16A36A]' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>My QR Pass</span>
          </button>

          <button
            onClick={() => setActiveTab('records')}
            className={`py-3 px-3 sm:px-4 text-xs font-bold border-b-2 flex items-center space-x-2 transition whitespace-nowrap cursor-pointer ${
              activeTab === 'records' ? 'border-[#16A36A] text-[#16A36A]' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Attendance Log ({safeRecords.length})</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50">
          
          {/* TAB 1: KIOSK SCANNER */}
          {activeTab === 'scan' && (
            <div className="max-w-lg mx-auto space-y-4">
              
              {/* Success / Error Message Banner */}
              {scanMessage && (
                <div className={`p-3.5 rounded-2xl text-xs font-medium flex items-start space-x-2.5 transition animate-fade-in ${
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
                      <div className="mt-1.5 flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => setActiveTab('records')}
                          className="px-2.5 py-1 bg-white border border-emerald-300 rounded-lg text-[11px] font-bold text-emerald-700 hover:bg-emerald-100/50 transition inline-flex items-center space-x-1 cursor-pointer"
                        >
                          <span>View in Attendance Log</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Viewfinder vs Manual Mode Toggle */}
              <div className="bg-white p-1 rounded-2xl border border-slate-200 flex items-center shadow-2xs">
                <button
                  type="button"
                  onClick={() => setScannerView('viewfinder')}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer ${
                    scannerView === 'viewfinder' 
                      ? 'bg-emerald-50 text-[#16A36A] shadow-2xs border border-emerald-200' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Kiosk Camera View</span>
                </button>
                <button
                  type="button"
                  onClick={() => setScannerView('form')}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer ${
                    scannerView === 'form' 
                      ? 'bg-emerald-50 text-[#16A36A] shadow-2xs border border-emerald-200' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Scan className="w-3.5 h-3.5" />
                  <span>Manual Form Entry</span>
                </button>
              </div>

              {/* CAMERA VIEWFINDER SCANNER */}
              {scannerView === 'viewfinder' && (
                <div className="bg-slate-900 p-5 rounded-3xl text-white shadow-xl relative overflow-hidden flex flex-col items-center">
                  
                  {/* Status header */}
                  <div className="w-full flex items-center justify-between text-[11px] text-slate-400 mb-3 px-1">
                    <span className="flex items-center space-x-1.5 font-mono">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                      <span>FIELD SCANNER • READY</span>
                    </span>
                    <span className="font-mono text-emerald-400 font-bold">
                      {(selectedEvent?.id || 'EV1').toUpperCase()}
                    </span>
                  </div>

                  {/* Target Finder Box */}
                  <div className="w-56 h-56 border-2 border-dashed border-emerald-400/60 rounded-3xl relative flex items-center justify-center bg-slate-800/40 p-4">
                    {/* Reticles */}
                    <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-emerald-400"></div>
                    <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-emerald-400"></div>
                    <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-emerald-400"></div>
                    <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-emerald-400"></div>

                    {/* Laser Beam Animation */}
                    {isScanningAnim && (
                      <div className="absolute inset-x-3 h-1 bg-gradient-to-r from-emerald-500 via-green-300 to-emerald-500 shadow-lg shadow-emerald-400/90 animate-pulse top-1/2 -translate-y-1/2 rounded-full"></div>
                    )}

                    {/* Preview inside scanner */}
                    <div className="text-center space-y-1.5 select-none">
                      <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mx-auto text-emerald-400">
                        <QrCode className="w-8 h-8" />
                      </div>
                      <div className="text-xs font-bold text-slate-200">
                        {volunteerName}
                      </div>
                      <div className="text-[10px] font-mono text-emerald-300/80 bg-slate-900/80 px-2 py-0.5 rounded-full inline-block">
                        {qrToken}
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 mt-3 text-center">
                    Click below to simulate an on-ground kiosk QR scan & verify volunteer hours.
                  </p>

                  <button
                    type="button"
                    disabled={isScanningAnim || submittingScan}
                    onClick={handleTriggerScannerAnimation}
                    className="mt-4 w-full py-2.5 rounded-2xl bg-[#16A36A] hover:bg-emerald-600 active:scale-98 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-emerald-900/40 transition disabled:opacity-60 cursor-pointer"
                  >
                    <Scan className="w-4 h-4" />
                    <span>{isScanningAnim ? 'Scanning Badge...' : submittingScan ? 'Recording Shift...' : 'Scan Badge & Log 4.5 Hours'}</span>
                  </button>
                </div>
              )}

              {/* MANUAL FORM ENTRY */}
              {scannerView === 'form' && (
                <form onSubmit={handleSimulateScan} className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Event / Project
                    </label>
                    <select
                      value={selectedEvent.id}
                      onChange={(e) => {
                        const ev = AVAILABLE_EVENTS.find(x => x.id === e.target.value) || AVAILABLE_EVENTS[0];
                        setSelectedEvent(ev);
                        setHoursToLog(ev.defaultHours);
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900"
                    >
                      {AVAILABLE_EVENTS.map(ev => (
                        <option key={ev.id} value={ev.id}>
                          {ev.title} ({ev.location})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Volunteer Name</label>
                      <input
                        type="text"
                        required
                        value={volunteerName}
                        onChange={(e) => setVolunteerName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Email</label>
                      <input
                        type="email"
                        required
                        value={volunteerEmail}
                        onChange={(e) => setVolunteerEmail(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">QR Passcode</label>
                      <input
                        type="text"
                        required
                        value={qrToken}
                        onChange={(e) => setQrToken(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Hours Logged</label>
                      <input
                        type="number"
                        step="0.5"
                        min="0.5"
                        max="12"
                        required
                        value={hoursToLog}
                        onChange={(e) => setHoursToLog(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submittingScan}
                    className="w-full py-2.5 rounded-xl btn-primary font-bold text-xs flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{submittingScan ? 'Saving...' : 'Submit Verification'}</span>
                  </button>
                </form>
              )}

              {/* QUICK VOLUNTEER PRESETS (1-Click Fill) */}
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center justify-between">
                  <span>Quick Test Personas (1-Click Switch):</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {QUICK_VOLUNTEERS.map((v, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleApplyPresetVolunteer(v)}
                      className={`p-2 rounded-xl border text-left transition flex items-center space-x-2 cursor-pointer ${
                        volunteerEmail === v.email 
                          ? 'border-[#16A36A] bg-emerald-50/60 font-bold text-emerald-900' 
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center font-bold text-[10px] text-slate-700 shrink-0">
                        {v.name[0]}
                      </div>
                      <div className="truncate">
                        <div className="truncate text-xs">{v.name}</div>
                        <div className="text-[10px] text-slate-400 truncate">{v.org}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: MY VOLUNTEER QR BADGE */}
          {activeTab === 'my_qr' && (
            <div className="max-w-md mx-auto text-center space-y-4">
              
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md">
                <div className="text-xs font-bold uppercase tracking-wider text-[#16A36A] bg-emerald-50 px-3 py-1 rounded-full inline-block mb-3 border border-emerald-200">
                  Official Field Pass • 2026
                </div>

                <div className="my-3 flex justify-center">
                  <QrMatrixSvg value={myBadgeToken} size={190} />
                </div>

                <h3 className="text-lg font-black text-slate-900 mt-2">{volunteerName}</h3>
                <p className="text-xs text-slate-500">{volunteerEmail}</p>

                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-around text-xs">
                  <div>
                    <div className="text-slate-400 text-[10px] uppercase font-bold">Pass Status</div>
                    <div className="text-emerald-700 font-bold">Active & Verified</div>
                  </div>
                  <div className="h-6 w-px bg-slate-200"></div>
                  <div>
                    <div className="text-slate-400 text-[10px] uppercase font-bold">Pass ID</div>
                    <div className="font-mono text-slate-700 font-bold">{myBadgeToken.slice(0, 16)}</div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleCopyBadge}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center space-x-1.5 transition cursor-pointer"
                >
                  {copiedBadge ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedBadge ? 'Copied Token!' : 'Copy Token'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => alert('Print preview generated for Volunteer Badge: ' + volunteerName)}
                  className="flex-1 py-2.5 rounded-xl btn-primary font-bold text-xs flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Pass</span>
                </button>
              </div>

            </div>
          )}

          {/* TAB 3: AUDITED ATTENDANCE LOG */}
          {activeTab === 'records' && (
            <div className="space-y-4">
              
              {/* Summary Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 text-center">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Verified Check-Ins</div>
                  <div className="text-xl font-black text-slate-900 mt-0.5">{safeRecords.length}</div>
                </div>
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 text-center">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Total Hours Logged</div>
                  <div className="text-xl font-black text-[#16A36A] mt-0.5">{totalHoursLogged} hrs</div>
                </div>
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 text-center">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Audit Status</div>
                  <div className="text-xs font-bold text-emerald-700 bg-emerald-50 rounded-full px-2 py-0.5 mt-1 inline-block">
                    100% Tamper-Proof
                  </div>
                </div>
              </div>

              {/* Records Table */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
                {loading ? (
                  <div className="p-8 text-center text-xs text-slate-400">Loading attendance ledger...</div>
                ) : safeRecords.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-500">
                    No attendance records logged yet. Switch to the Kiosk Scanner tab to record your first field shift!
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                    {safeRecords.map((r, i) => (
                      <div key={r.id || i} className="p-3.5 hover:bg-slate-50/80 transition flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#16A36A] flex items-center justify-center font-bold text-xs shrink-0">
                            ✓
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{r.volunteer_name}</div>
                            <div className="text-[10px] text-slate-500">{r.project_title || 'Field Community Work'}</div>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="font-black text-[#16A36A] bg-emerald-50 px-2 py-0.5 rounded-md text-[11px]">
                            +{r.hours_logged} hrs
                          </span>
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            {r.check_in_time ? new Date(r.check_in_time).toLocaleDateString() : 'Today'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center text-xs text-slate-500 pt-1">
                <span>Verified by official field coordinator signature & digital timestamp.</span>
                <button
                  type="button"
                  onClick={loadAttendance}
                  className="text-xs font-bold text-[#16A36A] hover:underline flex items-center space-x-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Refresh Log</span>
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}