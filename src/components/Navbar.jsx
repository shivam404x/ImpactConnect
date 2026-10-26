import React, { useState, useRef, useEffect } from 'react';
import Logo from './Logo';
import { 
  Building2, 
  User, 
  ShieldCheck, 
  LogOut, 
  Menu, 
  X, 
  ChevronDown, 
  Layers, 
  HeartHandshake, 
  Briefcase, 
  Sparkles,
  Map,
  Camera,
  Share2,
  Bell,
  CheckCircle2,
  Search,
  ExternalLink,
  Users2,
  QrCode,
  Target,
  Sliders,
  FileCheck,
  Truck,
  Calendar,
  Zap,
  AlertTriangle,
  PlusCircle,
  Eye,
  Gift
} from 'lucide-react';
import { translations } from '../data/translations';

export default function Navbar({
  activePage,
  setActivePage,
  currentUser,
  onOpenAuth,
  onLogout,
  onOpenNotifications,
  unreadCount = 0,
  language = 'en',
  setLanguage,
  onSwitchRole,
  onOpenPostProject,
  onOpenNeedToAction,
  onOpenQrAttendance,
  onOpenRiskAlerts,
  onOpenCsrEvidence,
  onOpenCompatibilityChecker,
  onOpenMilestoneSponsorship
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const navRef = useRef(null);
  const t = translations[language] || translations.en;

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
        setRoleDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (pageId) => {
    setActivePage(pageId);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    setRoleDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Determine current active role label and styling
  const getRoleDetails = () => {
    if (!currentUser) return null;
    switch (currentUser.role) {
      case 'ngo':
        return {
          label: 'NGO Command Center',
          page: 'ngo-dashboard',
          badge: 'NGO Director',
          color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          accent: '#16A36A',
          icon: <Building2 className="w-4 h-4 text-[#16A36A]" />
        };
      case 'corporate':
        return {
          label: 'Corporate CSR Hub',
          page: 'csr-portal',
          badge: 'Corporate CSR',
          color: 'bg-sky-50 text-sky-800 border-sky-200',
          accent: '#0284C7',
          icon: <Briefcase className="w-4 h-4 text-sky-600" />
        };
      case 'admin':
        return {
          label: 'Admin Operations',
          page: 'admin-dashboard',
          badge: 'Super Admin',
          color: 'bg-purple-50 text-purple-800 border-purple-200',
          accent: '#7E22CE',
          icon: <ShieldCheck className="w-4 h-4 text-purple-600" />
        };
      default:
        return {
          label: 'Volunteer Workspace',
          page: 'supporter-dashboard',
          badge: 'Skilled Volunteer',
          color: 'bg-amber-50 text-amber-800 border-amber-200',
          accent: '#D97706',
          icon: <User className="w-4 h-4 text-amber-600" />
        };
    }
  };

  const roleInfo = getRoleDetails();

  return (
    <header ref={navRef} className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* 1. BRAND LOGO & CURRENT ROLE PILL */}
          <div className="flex items-center space-x-3 select-none shrink-0">
            <div 
              onClick={() => handleNavClick(currentUser ? roleInfo?.page || 'home' : 'home')} 
              className="cursor-pointer"
            >
              <Logo size="md" showTagline={!currentUser} />
            </div>

            {currentUser && roleInfo && (
              <span className={`hidden xl:inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${roleInfo.color}`}>
                {roleInfo.icon}
                <span>{roleInfo.label}</span>
              </span>
            )}
          </div>

          {/* 2. DYNAMIC ROLE-BASED NAVIGATION (EACH ROLE HAS ITS OWN NAVBAR) */}
          <nav className="hidden lg:flex items-center space-x-1">

            {/* A. NGO COMMAND NAVBAR */}
            {currentUser?.role === 'ngo' && (
              <>
                <button
                  onClick={() => handleNavClick('ngo-dashboard')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                    activePage === 'ngo-dashboard'
                      ? 'text-[#16A36A] bg-emerald-50 border border-emerald-200 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>My NGO Dashboard</span>
                </button>

                {onOpenNeedToAction && (
                  <button
                    onClick={onOpenNeedToAction}
                    className="px-3 py-2 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50/70 hover:bg-emerald-100 transition flex items-center space-x-1.5 border border-emerald-200"
                    title="Convert problem notes to structured campaign"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Need-to-Action AI</span>
                  </button>
                )}

                {onOpenQrAttendance && (
                  <button
                    onClick={onOpenQrAttendance}
                    className="px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition flex items-center space-x-1.5"
                    title="Volunteer QR Attendance & Passes"
                  >
                    <QrCode className="w-3.5 h-3.5 text-slate-500" />
                    <span>QR Attendance</span>
                  </button>
                )}

                <button
                  onClick={() => handleNavClick('document-checklist')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                    activePage === 'document-checklist'
                      ? 'text-[#16A36A] bg-emerald-50 border border-emerald-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>12A/80G Checklist</span>
                </button>

                <button
                  onClick={() => handleNavClick('cross-ngo')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                    activePage === 'cross-ngo'
                      ? 'text-[#16A36A] bg-emerald-50 border border-emerald-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Users2 className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Joint Coalitions</span>
                </button>

                <button
                  onClick={() => handleNavClick('urgent-needs')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                    activePage === 'urgent-needs'
                      ? 'text-rose-700 bg-rose-50 border border-rose-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  <span>Urgent Needs</span>
                </button>

                {onOpenPostProject && (
                  <button
                    onClick={onOpenPostProject}
                    className="ml-1 px-3.5 py-1.5 rounded-xl btn-primary text-xs font-bold flex items-center space-x-1.5 shadow-xs"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Post Requirement</span>
                  </button>
                )}
              </>
            )}

            {/* B. CORPORATE CSR HUB NAVBAR */}
            {currentUser?.role === 'corporate' && (
              <>
                <button
                  onClick={() => handleNavClick('csr-portal')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                    activePage === 'csr-portal'
                      ? 'text-sky-800 bg-sky-50 border border-sky-200 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5 text-sky-600" />
                  <span>CSR Dashboard</span>
                </button>

                {onOpenCompatibilityChecker && (
                  <button
                    onClick={onOpenCompatibilityChecker}
                    className="px-3 py-2 rounded-xl text-xs font-bold text-indigo-700 bg-indigo-50/70 hover:bg-indigo-100 transition flex items-center space-x-1.5 border border-indigo-200"
                    title="AI Partner Alignment & Compatibility"
                  >
                    <Sliders className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Compatibility AI</span>
                  </button>
                )}

                {onOpenMilestoneSponsorship && (
                  <button
                    onClick={onOpenMilestoneSponsorship}
                    className="px-3 py-2 rounded-xl text-xs font-bold text-rose-700 hover:bg-rose-50 transition flex items-center space-x-1.5"
                    title="Fund specific project milestones & tranches"
                  >
                    <Target className="w-3.5 h-3.5 text-rose-500" />
                    <span>Milestone Grants</span>
                  </button>
                )}

                {onOpenCsrEvidence && (
                  <button
                    onClick={onOpenCsrEvidence}
                    className="px-3 py-2 rounded-xl text-xs font-bold text-emerald-800 hover:bg-emerald-50 transition flex items-center space-x-1.5"
                    title="Generate audit-ready CSR Evidence Pack"
                  >
                    <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>CSR Evidence Pack</span>
                  </button>
                )}

                <button
                  onClick={() => handleNavClick('corporate-volunteering')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                    activePage === 'corporate-volunteering'
                      ? 'text-sky-800 bg-sky-50 border border-sky-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Users2 className="w-3.5 h-3.5 text-sky-600" />
                  <span>Employee Volunteering</span>
                </button>

                <button
                  onClick={() => handleNavClick('sdg')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                    activePage === 'sdg'
                      ? 'text-sky-800 bg-sky-50 border border-sky-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <span>SDG Analytics</span>
                </button>

                <button
                  onClick={() => handleNavClick('explore')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                    activePage === 'explore'
                      ? 'text-sky-800 bg-sky-50 border border-sky-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Search className="w-3.5 h-3.5 text-slate-400" />
                  <span>Explore Projects</span>
                </button>
              </>
            )}

            {/* C. SKILLED VOLUNTEER / SUPPORTER NAVBAR */}
            {currentUser?.role === 'supporter' && (
              <>
                <button
                  onClick={() => handleNavClick('supporter-dashboard')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                    activePage === 'supporter-dashboard'
                      ? 'text-amber-800 bg-amber-50 border border-amber-200 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <User className="w-3.5 h-3.5 text-amber-600" />
                  <span>My Dashboard</span>
                </button>

                <button
                  onClick={() => handleNavClick('micro-tasks')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                    activePage === 'micro-tasks'
                      ? 'text-amber-800 bg-amber-50 border border-amber-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>Micro-Tasks (15-45m)</span>
                </button>

                <button
                  onClick={() => handleNavClick('passport')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                    activePage === 'passport'
                      ? 'text-emerald-800 bg-emerald-50 border border-emerald-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Impact Passport</span>
                </button>

                <button
                  onClick={() => handleNavClick('calendar')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                    activePage === 'calendar'
                      ? 'text-sky-800 bg-sky-50 border border-sky-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5 text-sky-600" />
                  <span>Shifts Calendar</span>
                </button>

                <button
                  onClick={() => handleNavClick('deliveries')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                    activePage === 'deliveries'
                      ? 'text-indigo-800 bg-indigo-50 border border-indigo-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Truck className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Track Deliveries</span>
                </button>

                <button
                  onClick={() => handleNavClick('personalized')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                    activePage === 'personalized'
                      ? 'text-purple-800 bg-purple-50 border border-purple-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  <span>AI Matches</span>
                </button>

                <button
                  onClick={() => handleNavClick('explore')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                    activePage === 'explore'
                      ? 'text-slate-900 bg-slate-100'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Search className="w-3.5 h-3.5 text-slate-400" />
                  <span>Find Projects</span>
                </button>
              </>
            )}

            {/* D. PLATFORM ADMIN OPERATIONS NAVBAR */}
            {currentUser?.role === 'admin' && (
              <>
                <button
                  onClick={() => handleNavClick('admin-dashboard')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                    activePage === 'admin-dashboard'
                      ? 'text-purple-800 bg-purple-50 border border-purple-200 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                  <span>Admin Operations</span>
                </button>

                {onOpenRiskAlerts && (
                  <button
                    onClick={onOpenRiskAlerts}
                    className="px-3 py-2 rounded-xl text-xs font-bold text-rose-700 bg-rose-50/70 hover:bg-rose-100 transition flex items-center space-x-1.5 border border-rose-200"
                    title="Automated risk anomaly detection & dispute flags"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    <span>Risk Alerts & AI Audits</span>
                  </button>
                )}

                <button
                  onClick={() => handleNavClick('heatmap')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                    activePage === 'heatmap'
                      ? 'text-purple-800 bg-purple-50 border border-purple-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Map className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Needs Heatmap</span>
                </button>

                <button
                  onClick={() => handleNavClick('network-graph')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                    activePage === 'network-graph'
                      ? 'text-purple-800 bg-purple-50 border border-purple-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Share2 className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Network Graph</span>
                </button>

                <button
                  onClick={() => handleNavClick('sdg')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                    activePage === 'sdg'
                      ? 'text-purple-800 bg-purple-50 border border-purple-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <span>SDG Analytics</span>
                </button>

                <button
                  onClick={() => handleNavClick('explore')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                    activePage === 'explore'
                      ? 'text-purple-800 bg-purple-50 border border-purple-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <span>All Projects</span>
                </button>
              </>
            )}

            {/* E. PUBLIC GUEST NAVBAR (NOT LOGGED IN) */}
            {!currentUser && (
              <>
                <button
                  onClick={() => handleNavClick('home')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition ${
                    activePage === 'home'
                      ? 'text-[#16A36A] bg-emerald-50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Home
                </button>

                <button
                  onClick={() => handleNavClick('explore')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                    activePage === 'explore'
                      ? 'text-[#16A36A] bg-emerald-50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Search className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Explore Projects</span>
                </button>

                <button
                  onClick={() => handleNavClick('heatmap')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                    activePage === 'heatmap'
                      ? 'text-[#16A36A] bg-emerald-50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Map className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Needs Heatmap</span>
                </button>

                <button
                  onClick={() => handleNavClick('stories')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                    activePage === 'stories'
                      ? 'text-[#16A36A] bg-emerald-50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Camera className="w-3.5 h-3.5 text-purple-600" />
                  <span>Impact Stories</span>
                </button>

                <button
                  onClick={() => handleNavClick('network-graph')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                    activePage === 'network-graph'
                      ? 'text-[#16A36A] bg-emerald-50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Share2 className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Network Graph</span>
                </button>

                <button
                  onClick={() => handleNavClick('about-us')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition ${
                    activePage === 'about-us'
                      ? 'text-[#16A36A] bg-emerald-50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  About
                </button>
              </>
            )}

          </nav>

          {/* 3. RIGHT AREA: 1-CLICK PERSONA SWITCHER & USER CONTROLS */}
          <div className="hidden lg:flex items-center space-x-3">
            
            {/* Quick 1-Click Role Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition shadow-2xs ${
                  currentUser && roleInfo 
                    ? `${roleInfo.color} hover:brightness-95` 
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                }`}
                title="Switch persona to see each role's dedicated UI & Navbar"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  {currentUser ? `Role: ${roleInfo?.badge}` : 'Switch Role (1-Click) ▾'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl border border-slate-200 shadow-xl p-2 z-50 animate-fade-in space-y-1 text-left">
                  <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Switch Active Persona & UI
                  </div>

                  <button
                    onClick={() => {
                      setRoleDropdownOpen(false);
                      if (onSwitchRole) onSwitchRole('ngo');
                      else onOpenAuth('login', 'ngo');
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition ${
                      currentUser?.role === 'ngo' ? 'bg-emerald-50 text-emerald-800' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Building2 className="w-4 h-4 text-emerald-600" />
                      <div>
                        <div>NGO Director UI</div>
                        <div className="text-[10px] text-slate-400 font-normal">Aashray Trust (Postings & Approvals)</div>
                      </div>
                    </div>
                    {currentUser?.role === 'ngo' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>

                  <button
                    onClick={() => {
                      setRoleDropdownOpen(false);
                      if (onSwitchRole) onSwitchRole('corporate');
                      else onOpenAuth('login', 'supporter');
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition ${
                      currentUser?.role === 'corporate' ? 'bg-sky-50 text-sky-800' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Briefcase className="w-4 h-4 text-sky-600" />
                      <div>
                        <div>Corporate CSR Hub UI</div>
                        <div className="text-[10px] text-slate-400 font-normal">Marcus Chen (Grants & Tranches)</div>
                      </div>
                    </div>
                    {currentUser?.role === 'corporate' && <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />}
                  </button>

                  <button
                    onClick={() => {
                      setRoleDropdownOpen(false);
                      if (onSwitchRole) onSwitchRole('supporter');
                      else onOpenAuth('login', 'supporter');
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition ${
                      currentUser?.role === 'supporter' ? 'bg-amber-50 text-amber-800' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-amber-500" />
                      <div>
                        <div>Skilled Volunteer Hub UI</div>
                        <div className="text-[10px] text-slate-400 font-normal">Priya Sharma (Micro-tasks & Passport)</div>
                      </div>
                    </div>
                    {currentUser?.role === 'supporter' && <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />}
                  </button>

                  <button
                    onClick={() => {
                      setRoleDropdownOpen(false);
                      if (onSwitchRole) onSwitchRole('admin');
                      else onOpenAuth('login', 'admin');
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition ${
                      currentUser?.role === 'admin' ? 'bg-purple-50 text-purple-800' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <ShieldCheck className="w-4 h-4 text-purple-600" />
                      <div>
                        <div>Platform Admin Center UI</div>
                        <div className="text-[10px] text-slate-400 font-normal">Sarah Mitchell (KYC & Audit Review)</div>
                      </div>
                    </div>
                    {currentUser?.role === 'admin' && <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />}
                  </button>

                  <div className="pt-1 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setRoleDropdownOpen(false);
                        if (onSwitchRole) onSwitchRole('public');
                        else onLogout();
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition"
                    >
                      <Eye className="w-4 h-4 text-slate-400" />
                      <div>
                        <div>Public Guest View</div>
                        <div className="text-[10px] text-slate-400 font-normal">Standard public explorer</div>
                      </div>
                    </button>
                  </div>

                </div>
              )}
            </div>

            {/* Notification Bell */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 transition"
              title="Open Notification Center"
            >
              <Bell className="w-4 h-4 text-slate-700" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-black flex items-center justify-center shadow-xs">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Auth Buttons / Profile Menu */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 p-1.5 rounded-2xl hover:bg-slate-100 transition border border-transparent hover:border-slate-200"
                >
                  <img
                    src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80'}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-xl object-cover ring-2 ring-emerald-500/30"
                  />
                  <div className="hidden xl:block text-left text-xs">
                    <div className="font-bold text-slate-900 leading-tight">{currentUser.name}</div>
                    <div className="text-[10px] text-slate-500 capitalize">{currentUser.organization_name || currentUser.role}</div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-slate-200 shadow-xl p-2 z-50 animate-fade-in text-xs space-y-1">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <div className="font-bold text-slate-900 truncate">{currentUser.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">{currentUser.email}</div>
                    </div>

                    {roleInfo && (
                      <button
                        onClick={() => handleNavClick(roleInfo.page)}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 font-bold text-slate-700 transition flex items-center space-x-2"
                      >
                        {roleInfo.icon}
                        <span>Open {roleInfo.label}</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-rose-50 font-bold text-rose-600 transition flex items-center space-x-1.5"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{t.signOut}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onOpenAuth('login')}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 text-xs font-bold text-slate-700 transition"
                >
                  {t.logIn}
                </button>
                <button
                  onClick={() => onOpenAuth('register')}
                  className="px-3.5 py-1.5 rounded-xl btn-primary text-xs font-bold transition shadow-xs"
                >
                  {t.getStarted}
                </button>
              </div>
            )}

          </div>

          {/* 4. MOBILE / TABLET CONTROLS */}
          <div className="flex lg:hidden items-center space-x-1.5">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* 5. MOBILE DRAWER MENU (ROLE-BASED) */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-100 space-y-4 max-h-[85vh] overflow-y-auto animate-fade-in text-left">
            
            {/* Active User Pill */}
            {currentUser && roleInfo && (
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {roleInfo.icon}
                  <div>
                    <div className="font-bold text-xs text-slate-900">{currentUser.name}</div>
                    <div className="text-[10px] text-slate-500 capitalize">{roleInfo.badge}</div>
                  </div>
                </div>
                <button
                  onClick={() => handleNavClick(roleInfo.page)}
                  className="px-3 py-1 rounded-xl bg-slate-900 text-white text-xs font-bold"
                >
                  Dashboard →
                </button>
              </div>
            )}

            {/* Role Specific Mobile Links */}
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-3">
                {currentUser ? `${roleInfo?.badge} Navigation` : 'Main Navigation'}
              </span>

              {/* NGO Mobile Links */}
              {currentUser?.role === 'ngo' && (
                <>
                  <button
                    onClick={() => handleNavClick('ngo-dashboard')}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 ${
                      activePage === 'ngo-dashboard' ? 'bg-emerald-50 text-[#16A36A]' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-emerald-600" />
                    <span>My NGO Dashboard</span>
                  </button>

                  {onOpenNeedToAction && (
                    <button
                      onClick={() => { setMobileMenuOpen(false); onOpenNeedToAction(); }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50/50 flex items-center space-x-2"
                    >
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      <span>Need-to-Action AI</span>
                    </button>
                  )}

                  {onOpenQrAttendance && (
                    <button
                      onClick={() => { setMobileMenuOpen(false); onOpenQrAttendance(); }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
                    >
                      <QrCode className="w-4 h-4 text-slate-500" />
                      <span>Volunteer QR Attendance</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleNavClick('document-checklist')}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 ${
                      activePage === 'document-checklist' ? 'bg-emerald-50 text-[#16A36A]' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <FileCheck className="w-4 h-4 text-emerald-600" />
                    <span>12A/80G Document Checklist</span>
                  </button>

                  <button
                    onClick={() => handleNavClick('cross-ngo')}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 ${
                      activePage === 'cross-ngo' ? 'bg-emerald-50 text-[#16A36A]' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Users2 className="w-4 h-4 text-indigo-600" />
                    <span>Joint Coalitions</span>
                  </button>

                  <button
                    onClick={() => handleNavClick('urgent-needs')}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 ${
                      activePage === 'urgent-needs' ? 'bg-rose-50 text-rose-700' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                    <span>Urgent Community Needs</span>
                  </button>
                </>
              )}

              {/* Corporate CSR Mobile Links */}
              {currentUser?.role === 'corporate' && (
                <>
                  <button
                    onClick={() => handleNavClick('csr-portal')}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 ${
                      activePage === 'csr-portal' ? 'bg-sky-50 text-sky-800' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Briefcase className="w-4 h-4 text-sky-600" />
                    <span>CSR Dashboard</span>
                  </button>

                  {onOpenCompatibilityChecker && (
                    <button
                      onClick={() => { setMobileMenuOpen(false); onOpenCompatibilityChecker(); }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-indigo-700 bg-indigo-50/50 flex items-center space-x-2"
                    >
                      <Sliders className="w-4 h-4 text-indigo-600" />
                      <span>Compatibility AI</span>
                    </button>
                  )}

                  {onOpenMilestoneSponsorship && (
                    <button
                      onClick={() => { setMobileMenuOpen(false); onOpenMilestoneSponsorship(); }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-rose-700 hover:bg-rose-50 flex items-center space-x-2"
                    >
                      <Target className="w-4 h-4 text-rose-500" />
                      <span>Milestone Grants</span>
                    </button>
                  )}

                  {onOpenCsrEvidence && (
                    <button
                      onClick={() => { setMobileMenuOpen(false); onOpenCsrEvidence(); }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-emerald-800 hover:bg-emerald-50 flex items-center space-x-2"
                    >
                      <FileCheck className="w-4 h-4 text-emerald-600" />
                      <span>CSR Evidence Pack</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleNavClick('corporate-volunteering')}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 ${
                      activePage === 'corporate-volunteering' ? 'bg-sky-50 text-sky-800' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Users2 className="w-4 h-4 text-sky-600" />
                    <span>Employee Volunteering</span>
                  </button>

                  <button
                    onClick={() => handleNavClick('sdg')}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 ${
                      activePage === 'sdg' ? 'bg-sky-50 text-sky-800' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>SDG Analytics</span>
                  </button>

                  <button
                    onClick={() => handleNavClick('explore')}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 ${
                      activePage === 'explore' ? 'bg-sky-50 text-sky-800' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Search className="w-4 h-4 text-slate-400" />
                    <span>Explore Projects</span>
                  </button>
                </>
              )}

              {/* Volunteer Mobile Links */}
              {currentUser?.role === 'supporter' && (
                <>
                  <button
                    onClick={() => handleNavClick('supporter-dashboard')}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 ${
                      activePage === 'supporter-dashboard' ? 'bg-amber-50 text-amber-800' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <User className="w-4 h-4 text-amber-600" />
                    <span>My Dashboard</span>
                  </button>

                  <button
                    onClick={() => handleNavClick('micro-tasks')}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 ${
                      activePage === 'micro-tasks' ? 'bg-amber-50 text-amber-800' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span>Micro-Tasks (15-45m)</span>
                  </button>

                  <button
                    onClick={() => handleNavClick('passport')}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 ${
                      activePage === 'passport' ? 'bg-emerald-50 text-emerald-800' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Impact Passport</span>
                  </button>

                  <button
                    onClick={() => handleNavClick('calendar')}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 ${
                      activePage === 'calendar' ? 'bg-sky-50 text-sky-800' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Calendar className="w-4 h-4 text-sky-600" />
                    <span>Shifts Calendar</span>
                  </button>

                  <button
                    onClick={() => handleNavClick('deliveries')}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 ${
                      activePage === 'deliveries' ? 'bg-indigo-50 text-indigo-800' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Truck className="w-4 h-4 text-indigo-600" />
                    <span>Track Deliveries</span>
                  </button>

                  <button
                    onClick={() => handleNavClick('personalized')}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 ${
                      activePage === 'personalized' ? 'bg-purple-50 text-purple-800' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span>AI Matches</span>
                  </button>

                  <button
                    onClick={() => handleNavClick('explore')}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 ${
                      activePage === 'explore' ? 'bg-slate-100' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Search className="w-4 h-4 text-slate-400" />
                    <span>Find Projects</span>
                  </button>
                </>
              )}

              {/* Admin Mobile Links */}
              {currentUser?.role === 'admin' && (
                <>
                  <button
                    onClick={() => handleNavClick('admin-dashboard')}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 ${
                      activePage === 'admin-dashboard' ? 'bg-purple-50 text-purple-800' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 text-purple-600" />
                    <span>Admin Operations</span>
                  </button>

                  {onOpenRiskAlerts && (
                    <button
                      onClick={() => { setMobileMenuOpen(false); onOpenRiskAlerts(); }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-rose-700 bg-rose-50/50 flex items-center space-x-2"
                    >
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                      <span>Risk Alerts & AI Audits</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleNavClick('heatmap')}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 ${
                      activePage === 'heatmap' ? 'bg-purple-50 text-purple-800' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Map className="w-4 h-4 text-emerald-600" />
                    <span>Needs Heatmap</span>
                  </button>

                  <button
                    onClick={() => handleNavClick('network-graph')}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 ${
                      activePage === 'network-graph' ? 'bg-purple-50 text-purple-800' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Share2 className="w-4 h-4 text-indigo-600" />
                    <span>Network Graph</span>
                  </button>

                  <button
                    onClick={() => handleNavClick('sdg')}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 ${
                      activePage === 'sdg' ? 'bg-purple-50 text-purple-800' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>SDG Analytics</span>
                  </button>

                  <button
                    onClick={() => handleNavClick('explore')}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 ${
                      activePage === 'explore' ? 'bg-purple-50 text-purple-800' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>All Projects</span>
                  </button>
                </>
              )}

              {/* Public Mobile Links */}
              {!currentUser && (
                <>
                  {[
                    { id: 'explore', label: 'Explore Projects' },
                    { id: 'heatmap', label: 'Community Needs Heatmap' },
                    { id: 'stories', label: 'Impact Stories' },
                    { id: 'network-graph', label: 'Collaboration Network Graph' },
                    { id: 'about-us', label: 'About ImpactConnect' }
                  ].map(item => (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold ${
                        activePage === item.id ? 'bg-emerald-50 text-[#16A36A]' : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </>
              )}

            </div>

            {/* 1-Click Role Portals */}
            <div className="space-y-1 pt-2 border-t border-slate-100">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-3">
                Switch Role & Persona
              </span>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onSwitchRole) onSwitchRole('ngo');
                }}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 ${
                  currentUser?.role === 'ngo' ? 'bg-emerald-100 text-emerald-900' : 'text-emerald-700 bg-emerald-50/50'
                }`}
              >
                <Building2 className="w-4 h-4 text-emerald-600" />
                <span>NGO Command Center UI</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onSwitchRole) onSwitchRole('corporate');
                }}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 ${
                  currentUser?.role === 'corporate' ? 'bg-sky-100 text-sky-900' : 'text-sky-700 bg-sky-50/50'
                }`}
              >
                <Briefcase className="w-4 h-4 text-sky-600" />
                <span>Corporate CSR Hub UI</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onSwitchRole) onSwitchRole('supporter');
                }}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 ${
                  currentUser?.role === 'supporter' ? 'bg-amber-100 text-amber-900' : 'text-amber-700 bg-amber-50/50'
                }`}
              >
                <User className="w-4 h-4 text-amber-500" />
                <span>Volunteer Workspace UI</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onSwitchRole) onSwitchRole('admin');
                }}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 ${
                  currentUser?.role === 'admin' ? 'bg-purple-100 text-purple-900' : 'text-purple-700 bg-purple-50/50'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-purple-600" />
                <span>Platform Admin Center UI</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onSwitchRole) onSwitchRole('public');
                  else onLogout();
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 text-slate-600 hover:bg-slate-100"
              >
                <Eye className="w-4 h-4 text-slate-400" />
                <span>Public Visitor View</span>
              </button>
            </div>

            {/* Auth Actions */}
            <div className="pt-3 border-t border-slate-100">
              {currentUser ? (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onLogout();
                  }}
                  className="w-full text-left px-3 py-2 text-rose-600 font-bold text-xs flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAuth('login');
                    }}
                    className="flex-1 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800"
                  >
                    Log In
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAuth('register');
                    }}
                    className="flex-1 py-2 rounded-xl btn-primary text-xs font-bold text-center"
                  >
                    Get Started
                  </button>
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </header>
  );
}
