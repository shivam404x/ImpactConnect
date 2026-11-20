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
  Gift,
  HelpCircle,
  FileSpreadsheet
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
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);

  const navRef = useRef(null);
  const t = translations.en;

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
        setRoleDropdownOpen(false);
        setToolsDropdownOpen(false);
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
    setToolsDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Determine current active role label and styling
  const getRoleDetails = () => {
    if (!currentUser) return null;
    switch (currentUser.role) {
      case 'ngo':
        return {
          label: 'NGO Command Center',
          shortLabel: 'NGO',
          page: 'ngo-dashboard',
          badge: 'NGO Director',
          color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          accent: '#16A36A',
          icon: <Building2 className="w-3.5 h-3.5 text-[#16A36A]" />
        };
      case 'corporate':
        return {
          label: 'Corporate CSR Hub',
          shortLabel: 'CSR',
          page: 'csr-portal',
          badge: 'Corporate CSR',
          color: 'bg-sky-50 text-sky-800 border-sky-200',
          accent: '#0284C7',
          icon: <Briefcase className="w-3.5 h-3.5 text-sky-600" />
        };
      case 'admin':
        return {
          label: 'Admin Operations',
          shortLabel: 'Admin',
          page: 'admin-dashboard',
          badge: 'Super Admin',
          color: 'bg-purple-50 text-purple-800 border-purple-200',
          accent: '#7E22CE',
          icon: <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
        };
      default:
        return {
          label: 'Volunteer Workspace',
          shortLabel: 'Volunteer',
          page: 'supporter-dashboard',
          badge: 'Volunteer',
          color: 'bg-amber-50 text-amber-800 border-amber-200',
          accent: '#D97706',
          icon: <User className="w-3.5 h-3.5 text-amber-600" />
        };
    }
  };

  const roleInfo = getRoleDetails();

  return (
    <header ref={navRef} className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* ================================================================= */}
          {/* 1. LEFT: LOGO & ROLE PILL */}
          {/* ================================================================= */}
          <div className="flex items-center space-x-2.5 select-none shrink-0">
            <div 
              onClick={() => handleNavClick(currentUser ? roleInfo?.page || 'home' : 'home')} 
              className="cursor-pointer"
            >
              <Logo size="md" showTagline={!currentUser} />
            </div>

            {currentUser && roleInfo && (
              <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-bold border ${roleInfo.color} whitespace-nowrap`}>
                {roleInfo.icon}
                <span className="hidden xl:inline">{roleInfo.label}</span>
                <span className="inline xl:hidden">{roleInfo.shortLabel}</span>
              </span>
            )}
          </div>

          {/* ================================================================= */}
          {/* 2. CENTER: STREAMLINED ROLE NAVIGATION (NO OVERLAP / CLUTTER) */}
          {/* ================================================================= */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-1.5 flex-1 justify-center max-w-2xl px-2">

            {/* A. NGO COMMAND NAVBAR */}
            {currentUser?.role === 'ngo' && (
              <>
                <button
                  onClick={() => handleNavClick('ngo-dashboard')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
                    activePage === 'ngo-dashboard'
                      ? 'text-[#16A36A] bg-emerald-50 border border-emerald-200 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Dashboard</span>
                </button>

                <button
                  onClick={() => handleNavClick('urgent-needs')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
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
                    className="px-3 py-1.5 rounded-xl btn-primary text-xs font-bold flex items-center space-x-1.5 shadow-2xs whitespace-nowrap cursor-pointer"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Post Requirement</span>
                  </button>
                )}

                {/* NGO Tools Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setToolsDropdownOpen(!toolsDropdownOpen);
                      setRoleDropdownOpen(false);
                      setUserDropdownOpen(false);
                    }}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1 whitespace-nowrap cursor-pointer ${
                      toolsDropdownOpen ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span>NGO Tools</span>
                    <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                  </button>

                  {toolsDropdownOpen && (
                    <div className="absolute left-0 mt-2 w-64 bg-white rounded-2xl border border-slate-200 shadow-xl p-2 z-50 animate-fade-in space-y-1">
                      <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Operational Utilities
                      </div>

                      {onOpenQrAttendance && (
                        <button
                          type="button"
                          onClick={() => {
                            setToolsDropdownOpen(false);
                            onOpenQrAttendance();
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 transition flex items-center space-x-2 cursor-pointer"
                        >
                          <QrCode className="w-4 h-4 text-emerald-600" />
                          <div>
                            <div>Volunteer QR Attendance</div>
                            <div className="text-[10px] text-slate-400 font-normal">Kiosk scanner & verified hours</div>
                          </div>
                        </button>
                      )}

                      {onOpenNeedToAction && (
                        <button
                          type="button"
                          onClick={() => {
                            setToolsDropdownOpen(false);
                            onOpenNeedToAction();
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 transition flex items-center space-x-2 cursor-pointer"
                        >
                          <Sparkles className="w-4 h-4 text-emerald-600" />
                          <div>
                            <div>Need-to-Action AI</div>
                            <div className="text-[10px] text-slate-400 font-normal">Prompt-to-project blueprint</div>
                          </div>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleNavClick('document-checklist')}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition flex items-center space-x-2 cursor-pointer"
                      >
                        <FileCheck className="w-4 h-4 text-indigo-600" />
                        <div>
                          <div>12A/80G Document Checklist</div>
                          <div className="text-[10px] text-slate-400 font-normal">Compliance & tax-exempt status</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleNavClick('cross-ngo')}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition flex items-center space-x-2 cursor-pointer"
                      >
                        <Users2 className="w-4 h-4 text-sky-600" />
                        <div>
                          <div>Joint NGO Coalitions</div>
                          <div className="text-[10px] text-slate-400 font-normal">Collaborative campaigns</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleNavClick('sdg')}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition flex items-center space-x-2 cursor-pointer"
                      >
                        <Layers className="w-4 h-4 text-amber-600" />
                        <div>
                          <div>UN SDG Analytics</div>
                          <div className="text-[10px] text-slate-400 font-normal">Impact goal tracking 1-17</div>
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* B. CORPORATE CSR HUB NAVBAR */}
            {currentUser?.role === 'corporate' && (
              <>
                <button
                  onClick={() => handleNavClick('csr-portal')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
                    activePage === 'csr-portal'
                      ? 'text-sky-800 bg-sky-50 border border-sky-200 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5 text-sky-600" />
                  <span>CSR Hub</span>
                </button>

                <button
                  onClick={() => handleNavClick('explore')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
                    activePage === 'explore'
                      ? 'text-sky-800 bg-sky-50 border border-sky-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Search className="w-3.5 h-3.5 text-slate-400" />
                  <span>Explore Projects</span>
                </button>

                {onOpenMilestoneSponsorship && (
                  <button
                    onClick={onOpenMilestoneSponsorship}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold text-rose-700 bg-rose-50/70 hover:bg-rose-100 transition flex items-center space-x-1.5 border border-rose-200 whitespace-nowrap cursor-pointer"
                  >
                    <Target className="w-3.5 h-3.5 text-rose-500" />
                    <span>Milestone Grants</span>
                  </button>
                )}

                {/* CSR Tools Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setToolsDropdownOpen(!toolsDropdownOpen);
                      setRoleDropdownOpen(false);
                      setUserDropdownOpen(false);
                    }}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1 whitespace-nowrap cursor-pointer ${
                      toolsDropdownOpen ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span>CSR Tools</span>
                    <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                  </button>

                  {toolsDropdownOpen && (
                    <div className="absolute left-0 mt-2 w-64 bg-white rounded-2xl border border-slate-200 shadow-xl p-2 z-50 animate-fade-in space-y-1">
                      <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Governance & Alignment
                      </div>

                      {onOpenQrAttendance && (
                        <button
                          type="button"
                          onClick={() => {
                            setToolsDropdownOpen(false);
                            onOpenQrAttendance();
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 transition flex items-center space-x-2 cursor-pointer"
                        >
                          <QrCode className="w-4 h-4 text-emerald-600" />
                          <div>
                            <div>Volunteer QR Attendance</div>
                            <div className="text-[10px] text-slate-400 font-normal">Field tracking & hours verification</div>
                          </div>
                        </button>
                      )}

                      {onOpenCompatibilityChecker && (
                        <button
                          type="button"
                          onClick={() => {
                            setToolsDropdownOpen(false);
                            onOpenCompatibilityChecker();
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-800 transition flex items-center space-x-2 cursor-pointer"
                        >
                          <Sliders className="w-4 h-4 text-indigo-600" />
                          <div>
                            <div>Compatibility AI</div>
                            <div className="text-[10px] text-slate-400 font-normal">Match CSR goals with NGOs</div>
                          </div>
                        </button>
                      )}

                      {onOpenCsrEvidence && (
                        <button
                          type="button"
                          onClick={() => {
                            setToolsDropdownOpen(false);
                            onOpenCsrEvidence();
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 transition flex items-center space-x-2 cursor-pointer"
                        >
                          <FileCheck className="w-4 h-4 text-emerald-600" />
                          <div>
                            <div>CSR Evidence Pack</div>
                            <div className="text-[10px] text-slate-400 font-normal">Audit-ready PDF compliance</div>
                          </div>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleNavClick('corporate-volunteering')}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition flex items-center space-x-2 cursor-pointer"
                      >
                        <Users2 className="w-4 h-4 text-sky-600" />
                        <div>
                          <div>Employee Volunteering</div>
                          <div className="text-[10px] text-slate-400 font-normal">Corporate team volunteering</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleNavClick('sdg')}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition flex items-center space-x-2 cursor-pointer"
                      >
                        <Layers className="w-4 h-4 text-amber-600" />
                        <div>
                          <div>SDG Analytics</div>
                          <div className="text-[10px] text-slate-400 font-normal">Target metrics & capital flow</div>
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* C. SKILLED VOLUNTEER / SUPPORTER NAVBAR */}
            {currentUser?.role === 'supporter' && (
              <>
                <button
                  onClick={() => handleNavClick('supporter-dashboard')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
                    activePage === 'supporter-dashboard'
                      ? 'text-amber-800 bg-amber-50 border border-amber-200 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <User className="w-3.5 h-3.5 text-amber-600" />
                  <span>Workspace</span>
                </button>

                <button
                  onClick={() => handleNavClick('explore')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
                    activePage === 'explore'
                      ? 'text-amber-800 bg-amber-50 border border-amber-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Search className="w-3.5 h-3.5 text-slate-400" />
                  <span>Find Projects</span>
                </button>

                {/* QR Pass is direct & prominent for Volunteers */}
                {onOpenQrAttendance && (
                  <button
                    onClick={onOpenQrAttendance}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition flex items-center space-x-1.5 whitespace-nowrap cursor-pointer"
                    title="Open Volunteer QR Attendance & Pass"
                  >
                    <QrCode className="w-3.5 h-3.5 text-emerald-600" />
                    <span>QR Pass</span>
                  </button>
                )}

                {/* Volunteer Tools Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setToolsDropdownOpen(!toolsDropdownOpen);
                      setRoleDropdownOpen(false);
                      setUserDropdownOpen(false);
                    }}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1 whitespace-nowrap cursor-pointer ${
                      toolsDropdownOpen ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span>More</span>
                    <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                  </button>

                  {toolsDropdownOpen && (
                    <div className="absolute left-0 mt-2 w-64 bg-white rounded-2xl border border-slate-200 shadow-xl p-2 z-50 animate-fade-in space-y-1">
                      <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Volunteer Activities
                      </div>

                      <button
                        type="button"
                        onClick={() => handleNavClick('micro-tasks')}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-amber-50 transition flex items-center space-x-2 cursor-pointer"
                      >
                        <Zap className="w-4 h-4 text-amber-500" />
                        <div>
                          <div>Micro-Tasks (15-45m)</div>
                          <div className="text-[10px] text-slate-400 font-normal">Quick instant contributions</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleNavClick('passport')}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-emerald-50 transition flex items-center space-x-2 cursor-pointer"
                      >
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <div>
                          <div>Impact Passport</div>
                          <div className="text-[10px] text-slate-400 font-normal">Verified certificates & hours</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleNavClick('calendar')}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-sky-50 transition flex items-center space-x-2 cursor-pointer"
                      >
                        <Calendar className="w-4 h-4 text-sky-600" />
                        <div>
                          <div>Shifts Calendar</div>
                          <div className="text-[10px] text-slate-400 font-normal">Schedule volunteering events</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleNavClick('deliveries')}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition flex items-center space-x-2 cursor-pointer"
                      >
                        <Truck className="w-4 h-4 text-indigo-600" />
                        <div>
                          <div>Track Deliveries</div>
                          <div className="text-[10px] text-slate-400 font-normal">Physical goods tracking</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleNavClick('personalized')}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-purple-50 transition flex items-center space-x-2 cursor-pointer"
                      >
                        <Sparkles className="w-4 h-4 text-purple-600" />
                        <div>
                          <div>AI Partner Matches</div>
                          <div className="text-[10px] text-slate-400 font-normal">Projects tailored to your skills</div>
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* D. PLATFORM ADMIN OPERATIONS NAVBAR */}
            {currentUser?.role === 'admin' && (
              <>
                <button
                  onClick={() => handleNavClick('admin-dashboard')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
                    activePage === 'admin-dashboard'
                      ? 'text-purple-800 bg-purple-50 border border-purple-200 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                  <span>Admin Hub</span>
                </button>

                <button
                  onClick={() => handleNavClick('explore')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
                    activePage === 'explore'
                      ? 'text-purple-800 bg-purple-50 border border-purple-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Search className="w-3.5 h-3.5 text-slate-400" />
                  <span>Projects</span>
                </button>

                {onOpenRiskAlerts && (
                  <button
                    onClick={onOpenRiskAlerts}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold text-rose-700 bg-rose-50/70 hover:bg-rose-100 transition flex items-center space-x-1.5 border border-rose-200 whitespace-nowrap cursor-pointer"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    <span>Risk Alerts</span>
                  </button>
                )}

                {/* Admin Tools Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setToolsDropdownOpen(!toolsDropdownOpen);
                      setRoleDropdownOpen(false);
                      setUserDropdownOpen(false);
                    }}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1 whitespace-nowrap cursor-pointer ${
                      toolsDropdownOpen ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span>More</span>
                    <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                  </button>

                  {toolsDropdownOpen && (
                    <div className="absolute left-0 mt-2 w-64 bg-white rounded-2xl border border-slate-200 shadow-xl p-2 z-50 animate-fade-in space-y-1">
                      <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Admin Utilities
                      </div>

                      {onOpenQrAttendance && (
                        <button
                          type="button"
                          onClick={() => {
                            setToolsDropdownOpen(false);
                            onOpenQrAttendance();
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 transition flex items-center space-x-2 cursor-pointer"
                        >
                          <QrCode className="w-4 h-4 text-emerald-600" />
                          <div>
                            <div>Volunteer QR Attendance</div>
                            <div className="text-[10px] text-slate-400 font-normal">Audit kiosk ledger</div>
                          </div>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleNavClick('heatmap')}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition flex items-center space-x-2 cursor-pointer"
                      >
                        <Map className="w-4 h-4 text-emerald-600" />
                        <div>
                          <div>Needs Heatmap</div>
                          <div className="text-[10px] text-slate-400 font-normal">Geographic crisis density</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleNavClick('network-graph')}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition flex items-center space-x-2 cursor-pointer"
                      >
                        <Share2 className="w-4 h-4 text-indigo-600" />
                        <div>
                          <div>Collaboration Graph</div>
                          <div className="text-[10px] text-slate-400 font-normal">Partnership connection nodes</div>
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* E. PUBLIC GUEST NAVBAR (NOT LOGGED IN) */}
            {!currentUser && (
              <>
                <button
                  onClick={() => handleNavClick('explore')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
                    activePage === 'explore'
                      ? 'text-[#16A36A] bg-emerald-50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Search className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Explore Projects</span>
                </button>

                <button
                  onClick={() => handleNavClick('sdg')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
                    activePage === 'sdg'
                      ? 'text-[#16A36A] bg-emerald-50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 text-emerald-600" />
                  <span>UN SDGs</span>
                </button>

                {onOpenQrAttendance && (
                  <button
                    onClick={onOpenQrAttendance}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition flex items-center space-x-1.5 whitespace-nowrap cursor-pointer"
                  >
                    <QrCode className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Volunteer QR</span>
                  </button>
                )}

                <button
                  onClick={() => handleNavClick('about-us')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                    activePage === 'about-us'
                      ? 'text-[#16A36A] bg-emerald-50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  About
                </button>

                {/* Public More Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setToolsDropdownOpen(!toolsDropdownOpen);
                      setRoleDropdownOpen(false);
                      setUserDropdownOpen(false);
                    }}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1 whitespace-nowrap cursor-pointer ${
                      toolsDropdownOpen ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span>More</span>
                    <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                  </button>

                  {toolsDropdownOpen && (
                    <div className="absolute left-0 mt-2 w-56 bg-white rounded-2xl border border-slate-200 shadow-xl p-2 z-50 animate-fade-in space-y-1">
                      <button
                        type="button"
                        onClick={() => handleNavClick('heatmap')}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition flex items-center space-x-2 cursor-pointer"
                      >
                        <Map className="w-4 h-4 text-emerald-600" />
                        <span>Needs Heatmap</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleNavClick('stories')}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition flex items-center space-x-2 cursor-pointer"
                      >
                        <Camera className="w-4 h-4 text-purple-600" />
                        <span>Impact Stories</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleNavClick('network-graph')}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition flex items-center space-x-2 cursor-pointer"
                      >
                        <Share2 className="w-4 h-4 text-indigo-600" />
                        <span>Network Graph</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleNavClick('how-it-works')}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition flex items-center space-x-2 cursor-pointer"
                      >
                        <HelpCircle className="w-4 h-4 text-sky-600" />
                        <span>How It Works</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}

          </nav>

          {/* ================================================================= */}
          {/* 3. RIGHT AREA: 1-CLICK ROLE SWITCHER & USER CONTROLS */}
          {/* ================================================================= */}
          <div className="hidden lg:flex items-center space-x-2 shrink-0">
            
            {/* Quick 1-Click Role Switcher */}
            <div className="relative">
              <button
                onClick={() => {
                  setRoleDropdownOpen(!roleDropdownOpen);
                  setUserDropdownOpen(false);
                  setToolsDropdownOpen(false);
                }}
                className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition shadow-2xs whitespace-nowrap cursor-pointer ${
                  currentUser && roleInfo 
                    ? `${roleInfo.color} hover:brightness-95` 
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                }`}
                title="Switch persona to see each role's dedicated UI & Navbar"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>{currentUser ? `${roleInfo?.badge}` : 'Switch Role'}</span>
                <ChevronDown className="w-3 h-3 opacity-60" />
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
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition cursor-pointer ${
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
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition cursor-pointer ${
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
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition cursor-pointer ${
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
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition cursor-pointer ${
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
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition cursor-pointer"
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
              className="relative p-2 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 transition cursor-pointer"
              title="Open Notification Center"
            >
              <Bell className="w-4 h-4 text-slate-700" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-black flex items-center justify-center shadow-xs">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Profile Avatar / Login Button */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => {
                    setUserDropdownOpen(!userDropdownOpen);
                    setRoleDropdownOpen(false);
                    setToolsDropdownOpen(false);
                  }}
                  className="flex items-center space-x-1.5 p-1 rounded-2xl hover:bg-slate-100 transition border border-transparent hover:border-slate-200 cursor-pointer"
                >
                  <img
                    src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80'}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-xl object-cover ring-2 ring-emerald-500/30"
                  />
                  <div className="hidden xl:block text-left text-xs max-w-[120px] truncate">
                    <div className="font-bold text-slate-900 leading-tight truncate">{currentUser.name}</div>
                  </div>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
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
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 font-bold text-slate-700 transition flex items-center space-x-2 cursor-pointer"
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
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-rose-50 font-bold text-rose-600 transition flex items-center space-x-1.5 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => onOpenAuth('login', 'supporter')}
                  className="px-3 py-1.5 rounded-xl border border-slate-300 hover:border-slate-400 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onOpenAuth('register', 'ngo')}
                  className="px-3.5 py-1.5 rounded-xl btn-primary text-xs font-bold shadow-2xs cursor-pointer"
                >
                  Join Us
                </button>
              </div>
            )}

          </div>

          {/* ================================================================= */}
          {/* 4. MOBILE HAMBURGER BUTTON (< 1024px) */}
          {/* ================================================================= */}
          <div className="flex lg:hidden items-center space-x-2">
            <button
              onClick={onOpenNotifications}
              className="relative p-2 rounded-xl border border-slate-200 text-slate-700"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-rose-600 text-white text-[9px] font-black flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 transition"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* ================================================================= */}
      {/* 5. MOBILE DRAWER MENU (< 1024px) */}
      {/* ================================================================= */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 max-h-[85vh] overflow-y-auto space-y-4 shadow-xl">
          
          {/* Role Status Banner on Mobile */}
          {currentUser && roleInfo && (
            <div className={`p-3 rounded-2xl border ${roleInfo.color} flex items-center justify-between`}>
              <div className="flex items-center space-x-2">
                {roleInfo.icon}
                <span className="font-bold text-xs">{roleInfo.label}</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/80">Active</span>
            </div>
          )}

          {/* 1-Click Role Switcher on Mobile */}
          <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 px-1">
              Switch Persona (1-Click)
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => {
                  if (onSwitchRole) onSwitchRole('ngo');
                  setMobileMenuOpen(false);
                }}
                className="p-2 rounded-xl bg-white border border-slate-200 text-left text-xs font-bold text-slate-800 flex items-center space-x-1.5"
              >
                <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>NGO Director</span>
              </button>

              <button
                onClick={() => {
                  if (onSwitchRole) onSwitchRole('corporate');
                  setMobileMenuOpen(false);
                }}
                className="p-2 rounded-xl bg-white border border-slate-200 text-left text-xs font-bold text-slate-800 flex items-center space-x-1.5"
              >
                <Briefcase className="w-3.5 h-3.5 text-sky-600" />
                <span>Corporate CSR</span>
              </button>

              <button
                onClick={() => {
                  if (onSwitchRole) onSwitchRole('supporter');
                  setMobileMenuOpen(false);
                }}
                className="p-2 rounded-xl bg-white border border-slate-200 text-left text-xs font-bold text-slate-800 flex items-center space-x-1.5"
              >
                <User className="w-3.5 h-3.5 text-amber-600" />
                <span>Volunteer</span>
              </button>

              <button
                onClick={() => {
                  if (onSwitchRole) onSwitchRole('admin');
                  setMobileMenuOpen(false);
                }}
                className="p-2 rounded-xl bg-white border border-slate-200 text-left text-xs font-bold text-slate-800 flex items-center space-x-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                <span>Super Admin</span>
              </button>
            </div>
          </div>

          {/* Primary Role Navigation on Mobile */}
          <div className="space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">
              Navigation
            </div>

            {currentUser && roleInfo && (
              <button
                onClick={() => handleNavClick(roleInfo.page)}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-800 flex items-center space-x-2"
              >
                {roleInfo.icon}
                <span>Open {roleInfo.label}</span>
              </button>
            )}

            <button
              onClick={() => handleNavClick('explore')}
              className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
            >
              <Search className="w-4 h-4 text-slate-400" />
              <span>Explore Projects</span>
            </button>

            {onOpenQrAttendance && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenQrAttendance();
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50/70 border border-emerald-200 flex items-center space-x-2"
              >
                <QrCode className="w-4 h-4 text-emerald-600" />
                <span>Volunteer QR Attendance & Pass</span>
              </button>
            )}

            <button
              onClick={() => handleNavClick('urgent-needs')}
              className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
            >
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>Urgent Community Needs</span>
            </button>

            <button
              onClick={() => handleNavClick('sdg')}
              className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
            >
              <Layers className="w-4 h-4 text-slate-400" />
              <span>UN Sustainable Development Goals (SDGs)</span>
            </button>
          </div>

          {/* Secondary Tools on Mobile */}
          <div className="pt-2 border-t border-slate-100 space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">
              Platform Features
            </div>
            
            <button
              onClick={() => handleNavClick('heatmap')}
              className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center space-x-2"
            >
              <Map className="w-3.5 h-3.5 text-emerald-600" />
              <span>Community Needs Heatmap</span>
            </button>

            <button
              onClick={() => handleNavClick('stories')}
              className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center space-x-2"
            >
              <Camera className="w-3.5 h-3.5 text-purple-600" />
              <span>Impact Stories</span>
            </button>

            <button
              onClick={() => handleNavClick('network-graph')}
              className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center space-x-2"
            >
              <Share2 className="w-3.5 h-3.5 text-indigo-600" />
              <span>Network Graph</span>
            </button>

            <button
              onClick={() => handleNavClick('about-us')}
              className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50"
            >
              About ImpactConnect
            </button>
          </div>

          {/* User Sign In / Logout on Mobile */}
          <div className="pt-3 border-t border-slate-100">
            {currentUser ? (
              <div className="space-y-2">
                <div className="flex items-center space-x-2 px-1">
                  <img
                    src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80'}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-xl object-cover"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900">{currentUser.name}</div>
                    <div className="text-[10px] text-slate-500">{currentUser.email}</div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onLogout();
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-rose-50 text-rose-600 text-xs font-bold flex items-center justify-center space-x-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth('login', 'supporter');
                  }}
                  className="w-full py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 text-center"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth('register', 'ngo');
                  }}
                  className="w-full py-2.5 rounded-xl btn-primary text-xs font-bold text-center"
                >
                  Join Us
                </button>
              </div>
            )}
          </div>

        </div>
      )}

    </header>
  );
}