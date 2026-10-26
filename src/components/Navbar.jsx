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
  Users2
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
  onSwitchRole
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

  // Determine current active role label and destination dashboard
  const getRoleDetails = () => {
    if (!currentUser) return null;
    switch (currentUser.role) {
      case 'ngo':
        return {
          label: 'NGO Dashboard',
          page: 'ngo-dashboard',
          badge: 'NGO Lead',
          color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          icon: <Building2 className="w-4 h-4 text-emerald-600" />
        };
      case 'corporate':
        return {
          label: 'Corporate CSR Hub',
          page: 'csr-portal',
          badge: 'Corporate CSR',
          color: 'bg-sky-50 text-sky-700 border-sky-200',
          icon: <Briefcase className="w-4 h-4 text-sky-600" />
        };
      case 'admin':
        return {
          label: 'Admin & Compliance Center',
          page: 'admin-dashboard',
          badge: 'Super Admin',
          color: 'bg-purple-50 text-purple-700 border-purple-200',
          icon: <ShieldCheck className="w-4 h-4 text-purple-600" />
        };
      default:
        return {
          label: 'Volunteer Dashboard',
          page: 'supporter-dashboard',
          badge: 'Volunteer / Supporter',
          color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          icon: <User className="w-4 h-4 text-emerald-600" />
        };
    }
  };

  const roleInfo = getRoleDetails();

  return (
    <header ref={navRef} className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* 1. BRAND LOGO */}
          <div 
            onClick={() => handleNavClick('home')} 
            className="cursor-pointer select-none shrink-0"
          >
            <Logo size="md" showTagline={true} />
          </div>

          {/* 2. STREAMLINED ESSENTIAL NAVIGATION (NO CLUTTER) */}
          <nav className="hidden lg:flex items-center space-x-1">
            
            <button
              onClick={() => handleNavClick('home')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition ${
                activePage === 'home'
                  ? 'text-[#16A36A] bg-emerald-50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {t.home || 'Home'}
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

          </nav>

          {/* 3. RIGHT AREA: DYNAMIC ROLE-BASED DASHBOARD & SWITCHER */}
          <div className="hidden lg:flex items-center space-x-3">
            
            {/* Quick 1-Click Role Switcher Dropdown (Judges & Demo) */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-xs font-bold text-slate-700 transition shadow-xs"
                title="Switch demo persona in 1-click"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>
                  {currentUser ? `Role: ${roleInfo?.badge || 'User'}` : 'View As Role ▾'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl border border-slate-200 shadow-xl p-2 z-50 animate-fade-in space-y-1 text-left">
                  <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Switch Persona (1-Click Demo)
                  </div>

                  <button
                    onClick={() => {
                      setRoleDropdownOpen(false);
                      if (onSwitchRole) onSwitchRole('ngo');
                      else onOpenAuth('login', 'ngo');
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition"
                  >
                    <Building2 className="w-4 h-4 text-emerald-600" />
                    <div>
                      <div>NGO Director</div>
                      <div className="text-[10px] text-slate-400 font-normal">Aashray Trust (Postings & Approvals)</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setRoleDropdownOpen(false);
                      if (onSwitchRole) onSwitchRole('corporate');
                      else onOpenAuth('login', 'supporter');
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 text-slate-700 hover:bg-sky-50 hover:text-sky-700 transition"
                  >
                    <Briefcase className="w-4 h-4 text-sky-600" />
                    <div>
                      <div>Corporate CSR Lead</div>
                      <div className="text-[10px] text-slate-400 font-normal">Marcus Chen (Grants & Tranches)</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setRoleDropdownOpen(false);
                      if (onSwitchRole) onSwitchRole('supporter');
                      else onOpenAuth('login', 'supporter');
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 text-slate-700 hover:bg-amber-50 hover:text-amber-700 transition"
                  >
                    <User className="w-4 h-4 text-amber-500" />
                    <div>
                      <div>Skilled Volunteer / Pro</div>
                      <div className="text-[10px] text-slate-400 font-normal">Priya Sharma (Micro-tasks & Passport)</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setRoleDropdownOpen(false);
                      if (onSwitchRole) onSwitchRole('admin');
                      else onOpenAuth('login', 'admin');
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 text-slate-700 hover:bg-purple-50 hover:text-purple-700 transition"
                  >
                    <ShieldCheck className="w-4 h-4 text-purple-600" />
                    <div>
                      <div>Platform Administrator</div>
                      <div className="text-[10px] text-slate-400 font-normal">Sarah Mitchell (KYC & Audit Review)</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* If Logged In: Dedicated Role Dashboard Button */}
            {currentUser && roleInfo && (
              <button
                onClick={() => handleNavClick(roleInfo.page)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl border font-bold text-xs transition shadow-sm ${
                  activePage === roleInfo.page
                    ? 'bg-slate-900 text-white border-slate-900'
                    : `${roleInfo.color} hover:shadow-md`
                }`}
                title="Go to your primary role workspace"
              >
                {roleInfo.icon}
                <span>{roleInfo.label}</span>
              </button>
            )}

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
                    <div className="text-[10px] text-slate-500 capitalize">{currentUser.role}</div>
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

        {/* 5. MOBILE DRAWER MENU */}
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

            {/* Public Links */}
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-3">
                Main Navigation
              </span>
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
            </div>

            {/* 1-Click Role Portals */}
            <div className="space-y-1 pt-2 border-t border-slate-100">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-3">
                Role Portals (1-Click Switch)
              </span>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onSwitchRole) onSwitchRole('ngo');
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50/50 flex items-center space-x-2"
              >
                <Building2 className="w-4 h-4 text-emerald-600" />
                <span>NGO Command Center</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onSwitchRole) onSwitchRole('corporate');
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-sky-700 bg-sky-50/50 flex items-center space-x-2"
              >
                <Briefcase className="w-4 h-4 text-sky-600" />
                <span>Corporate CSR Hub</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onSwitchRole) onSwitchRole('supporter');
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-amber-700 bg-amber-50/50 flex items-center space-x-2"
              >
                <User className="w-4 h-4 text-amber-500" />
                <span>Volunteer Dashboard</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onSwitchRole) onSwitchRole('admin');
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-purple-700 bg-purple-50/50 flex items-center space-x-2"
              >
                <ShieldCheck className="w-4 h-4 text-purple-600" />
                <span>Platform Admin Center</span>
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
