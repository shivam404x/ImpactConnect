import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import ImpactStats from './components/ImpactStats';
import ExploreCauses from './components/ExploreCauses';
import HowItWorksSection from './components/HowItWorksSection';
import NgoCtaSection from './components/NgoCtaSection';
import TestimonialsSection from './components/TestimonialsSection';
import Footer from './components/Footer';

import ExploreProjectsPage from './components/ExploreProjectsPage';
import AboutUsPage from './components/AboutUsPage';
import ForNgosPage from './components/ForNgosPage';
import CsrPortal from './components/CsrPortal';
import SkillMarketplace from './components/SkillMarketplace';
import ResourceExchangeHub from './components/ResourceExchangeHub';
import UrgentCommunityNeeds from './components/UrgentCommunityNeeds';
import GrantsDirectoryPage from './components/GrantsDirectoryPage';
import LiveActivityFeed from './components/LiveActivityFeed';
import PersonalizedImpactFeed from './components/PersonalizedImpactFeed';
import SmartAvailabilityCalendar from './components/SmartAvailabilityCalendar';
import SdgMappingAnalytics from './components/SdgMappingAnalytics';
import ProjectComparisonModal from './components/ProjectComparisonModal';
import ProjectComparisonDock from './components/ProjectComparisonDock';
import NotificationCenterModal from './components/NotificationCenterModal';
import PartnershipAgreementModal from './components/PartnershipAgreementModal';

import NgoDashboard from './components/NgoDashboard';
import SupporterDashboard from './components/SupporterDashboard';
import AdminDashboard from './components/AdminDashboard';

import AuthModal from './components/AuthModal';
import ProjectDetailModal from './components/ProjectDetailModal';
import PartnershipModal from './components/PartnershipModal';
import PostProjectModal from './components/PostProjectModal';
import CollaborationWorkspaceModal from './components/CollaborationWorkspaceModal';
import ReportModal from './components/ReportModal';
import ImpactAiAssistantModal from './components/ImpactAiAssistantModal';
import VolunteerQrAttendanceModal from './components/VolunteerQrAttendanceModal';
import ImpactReportModal from './components/ImpactReportModal';
import PartnershipFeedbackModal from './components/PartnershipFeedbackModal';

import NeedToActionModal from './components/NeedToActionModal';
import CollectiveActionPage from './components/CollectiveActionPage';
import EmployeeVolunteeringPortal from './components/EmployeeVolunteeringPortal';
import DonationDeliveryTracking from './components/DonationDeliveryTracking';
import ExpertMentorshipPage from './components/ExpertMentorshipPage';
import ImpactStoriesPage from './components/ImpactStoriesPage';
import ProjectRiskAlertsModal from './components/ProjectRiskAlertsModal';
import CsrEvidencePackModal from './components/CsrEvidencePackModal';
import CollaborationNetworkGraphPage from './components/CollaborationNetworkGraphPage';

import CommunityNeedsHeatmap from './components/CommunityNeedsHeatmap';
import MicroVolunteeringMarketplace from './components/MicroVolunteeringMarketplace';
import PartnershipCompatibilityChecker from './components/PartnershipCompatibilityChecker';
import MilestoneSponsorshipModal from './components/MilestoneSponsorshipModal';
import ContributionPassportView from './components/ContributionPassportView';
import SmartDocumentChecklist from './components/SmartDocumentChecklist';
import CrossNgoCollaborationRooms from './components/CrossNgoCollaborationRooms';
import LongTermImpactFollowUp from './components/LongTermImpactFollowUp';

import ProjectCard from './components/ProjectCard';
import ProjectFilterBar from './components/ProjectFilterBar';

import { fetchProjects, fetchNgos, fetchStats, fetchHealth, resetDemo, fetchNotifications } from './utils/api';
import { CheckCircle2, ArrowRight, WifiOff } from 'lucide-react';
import { translations } from './data/translations';

export default function App() {
  // Navigation & Page state
  const [activePage, setActivePage] = useState('home'); 
  // 'home' | 'explore' | 'marketplace' | 'csr-portal' | 'for-ngos' | 'how-it-works' | 'about-us' | 'ngo-dashboard' | 'supporter-dashboard' | 'admin-dashboard'

  // Language state (English / Hindi)
  const [language, setLanguage] = useState('en');
  const t = translations[language] || translations.en;

  // Current authenticated user (null initially, or demo account)
  const [currentUser, setCurrentUser] = useState(null);

  // Platform Data
  const [projects, setProjects] = useState([]);
  const [ngos, setNgos] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Search & Filters state
  const [filters, setFilters] = useState({
    cause: 'all',
    sdg: 'all',
    requirementType: 'all',
    location: 'all',
    urgency: 'all',
    search: '',
    ngo_id: '',
    sort: 'default'
  });

  // Modal states
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'login', role: 'supporter' });
  const [selectedProject, setSelectedProject] = useState(null);
  const [partnershipProject, setPartnershipProject] = useState(null);
  const [isPostProjectOpen, setIsPostProjectOpen] = useState(false);
  const [workspacePartnership, setWorkspacePartnership] = useState(null);
  const [reportTarget, setReportTarget] = useState(null); // { type: 'project' | 'ngo', target: ... }
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [isQrAttendanceOpen, setIsQrAttendanceOpen] = useState(false);
  const [impactReportProject, setImpactReportProject] = useState(null);
  const [feedbackPartnership, setFeedbackPartnership] = useState(null);

  // New Features State
  const [isNeedToActionOpen, setIsNeedToActionOpen] = useState(false);
  const [isRiskAlertsOpen, setIsRiskAlertsOpen] = useState(false);
  const [isCsrEvidenceOpen, setIsCsrEvidenceOpen] = useState(false);
  const [isCompatibilityCheckerOpen, setIsCompatibilityCheckerOpen] = useState(false);
  const [isMilestoneSponsorshipOpen, setIsMilestoneSponsorshipOpen] = useState(false);
  const [compatibilityTargetNgo, setCompatibilityTargetNgo] = useState(null);
  const [milestoneTargetProject, setMilestoneTargetProject] = useState(null);

  // Advanced Features State (Comparison, Notifications, Agreement Drafts)
  const [comparedProjects, setComparedProjects] = useState([]);
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState(false);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [agreementPartnership, setAgreementPartnership] = useState(null);

  const handleToggleCompare = (project) => {
    setComparedProjects(prev => {
      const exists = prev.some(p => p.id === project.id);
      if (exists) {
        return prev.filter(p => p.id !== project.id);
      }
      if (prev.length >= 3) {
        showToast('You can compare up to 3 projects at once.');
        return prev;
      }
      return [...prev, project];
    });
  };

  const handleRemoveCompared = (projectId) => {
    setComparedProjects(prev => prev.filter(p => p.id !== projectId));
  };

  const handleClearCompare = () => {
    setComparedProjects([]);
    setIsComparisonModalOpen(false);
  };

  const loadNotificationsCount = async () => {
    try {
      const email = currentUser?.email || 'marcus.chen@apextech.com';
      const data = await fetchNotifications(email, currentUser?.id);
      setUnreadCount(data.unreadCount || 0);
    } catch {
      // fallback
    }
  };

  useEffect(() => {
    loadNotificationsCount();
  }, [currentUser]);

  // Toast banner
  const [toast, setToast] = useState(null);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 4000);
  };

  // Initial load
  const loadPlatformData = async () => {
    try {
      const [statsData, ngosData] = await Promise.all([
        fetchStats().catch(() => null),
        fetchNgos({}).catch(() => [])
      ]);
      if (statsData) setStats(statsData);
      if (ngosData) setNgos(ngosData);
    } catch (err) {
      console.error('Error loading platform metrics:', err);
    }
  };

  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await fetchProjects(filters);
      setProjects(data);
    } catch (err) {
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlatformData();
  }, []);

  useEffect(() => {
    loadProjects();
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      cause: 'all',
      sdg: 'all',
      requirementType: 'all',
      location: 'all',
      urgency: 'all',
      search: '',
      ngo_id: '',
      sort: 'default'
    });
  };

  const handleSelectCause = (causeId) => {
    setFilters(prev => ({ ...prev, cause: causeId, search: '' }));
    setActivePage('explore');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Auth actions
  const handleOpenAuth = (mode = 'login', role = 'supporter') => {
    setAuthModal({ isOpen: true, mode, role });
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    showToast(`Welcome back, ${user.name}!`);
    if (user.role === 'ngo') {
      setActivePage('ngo-dashboard');
    } else if (user.role === 'admin') {
      setActivePage('admin-dashboard');
    } else if (user.role === 'corporate') {
      setActivePage('csr-portal');
    } else {
      setActivePage('supporter-dashboard');
    }
  };

  const handleSwitchRole = async (targetRole) => {
    const roleEmails = {
      ngo: 'contact@aashray-uplift.org',
      corporate: 'marcus.chen@apextech.com',
      supporter: 'priya.sharma@earthguard.org',
      admin: 'admin@impactconnect.org'
    };
    const email = roleEmails[targetRole] || roleEmails.ngo;
    try {
      const user = await loginUser(email);
      setCurrentUser(user);
      if (user.role === 'ngo') setActivePage('ngo-dashboard');
      else if (user.role === 'admin') setActivePage('admin-dashboard');
      else if (user.role === 'corporate') setActivePage('csr-portal');
      else setActivePage('supporter-dashboard');
      showToast(`Switched view to ${user.name} (${user.role.toUpperCase()})`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActivePage('home');
    showToast('You have been signed out.');
  };

  const handleProjectCreated = (newProj) => {
    showToast(`Project "${newProj.title}" published!`);
    loadProjects();
    loadPlatformData();
  };

  const handlePartnershipSubmitted = () => {
    showToast('Partnership proposal submitted successfully!');
    loadProjects();
    loadPlatformData();
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-[#16A36A] selection:text-white">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-4 z-50 flex items-center space-x-2 px-4 py-3 rounded-2xl bg-slate-900 text-white shadow-2xl animate-fade-in text-xs font-bold border border-slate-700">
          <CheckCircle2 className="w-4 h-4 text-[#16A36A] shrink-0" />
          <span>{toast}</span>
    </div>
      )}

      {/* Main Top Navigation */}
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        currentUser={currentUser}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
        onOpenPostProject={() => setIsPostProjectOpen(true)}
        onOpenNeedToAction={() => setIsNeedToActionOpen(true)}
        onOpenQrAttendance={() => setIsQrAttendanceOpen(true)}
        onOpenRiskAlerts={() => setIsRiskAlertsOpen(true)}
        onOpenCsrEvidence={() => setIsCsrEvidenceOpen(true)}
        onOpenNotifications={() => setIsNotificationCenterOpen(true)}
        unreadCount={unreadCount}
        language={language}
        setLanguage={setLanguage}
        onSwitchRole={handleSwitchRole}
        onOpenCompatibilityChecker={() => {
          setCompatibilityTargetNgo(ngos[0] || null);
          setIsCompatibilityCheckerOpen(true);
        }}
        onOpenMilestoneSponsorship={() => {
          setMilestoneTargetProject(projects[0] || null);
          setIsMilestoneSponsorshipOpen(true);
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        
        {/* PAGE 1: HOMEPAGE */}
        {activePage === 'home' && (
          <div>
            {/* Hero Section */}
            <HeroSection
              onExploreClick={() => {
                setActivePage('explore');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onRegisterNgoClick={() => handleOpenAuth('register', 'ngo')}
            />

            {/* Impact Statistics */}
            <ImpactStats stats={stats} />

            {/* Explore Causes */}
            <ExploreCauses onSelectCause={handleSelectCause} />

            {/* Featured Projects Grid on Homepage */}
            <section className="bg-white py-16 lg:py-24 border-b border-slate-100">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#16A36A] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                      Active Community Initiatives
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
                      Featured Projects Seeking Support
                    </h2>
                    <p className="text-sm text-slate-600 mt-1 max-w-xl">
                      Verified community initiatives with open requirements for capital, volunteers, or equipment.
                    </p>
    </div>

                  <button
                    onClick={() => {
                      setActivePage('explore');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="flex items-center space-x-2 text-xs font-bold text-[#16A36A] hover:text-emerald-700 transition"
                  >
                    <span>View All {projects.length} Projects</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
    </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {projects.slice(0, 6).map(proj => (
                    <ProjectCard
                      key={proj.id}
                      project={proj}
                      onSelect={(p) => setSelectedProject(p)}
                      onPartnerClick={(p) => setPartnershipProject(p)}
                      onReport={(p) => setReportTarget({ type: 'project', target: p })}
                      onToggleCompare={handleToggleCompare}
                      isCompared={comparedProjects.some(cp => cp.id === proj.id)}
                    />
                  ))}
    </div>
    </div>
            </section>

            {/* How It Works Section */}
            <HowItWorksSection
              onExploreClick={() => {
                setActivePage('explore');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* NGO Call to Action Section */}
            <NgoCtaSection
              onRegisterClick={() => handleOpenAuth('register', 'ngo')}
            />

            {/* Testimonials */}
            <TestimonialsSection />
    </div>
        )}

        {/* PAGE 1B: PERSONALIZED IMPACT FEED */}
        {activePage === 'personalized' && (
          <PersonalizedImpactFeed
            currentUser={currentUser}
            onSelectProject={(p) => setSelectedProject(p)}
            onPartnerClick={(p) => setPartnershipProject(p)}
            onToggleCompare={handleToggleCompare}
            comparedProjectIds={comparedProjects.map(p => p.id)}
            language={language}
            onOpenAuth={handleOpenAuth}
          />
        )}

        {/* PAGE 1C: SMART AVAILABILITY CALENDAR & SHIFTS */}
        {activePage === 'calendar' && (
          <SmartAvailabilityCalendar
            currentUser={currentUser}
            language={language}
            onOpenAuth={handleOpenAuth}
          />
        )}

        {/* PAGE 1D: UN SDG MAPPING & CAUSE ANALYTICS */}
        {activePage === 'sdg' && (
          <SdgMappingAnalytics
            currentUser={currentUser}
            onSelectProject={(p) => setSelectedProject(p)}
            language={language}
          />
        )}

        {/* PAGE 2: EXPLORE PROJECTS PAGE */}
        {activePage === 'explore' && (
          <ExploreProjectsPage
            projects={projects}
            loading={loading}
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
            onSelectProject={(p) => setSelectedProject(p)}
            onPartnerClick={(p) => setPartnershipProject(p)}
            onReportProject={(p) => setReportTarget({ type: 'project', target: p })}
            onToggleCompare={handleToggleCompare}
            comparedProjectIds={comparedProjects.map(p => p.id)}
          />
        )}

        {/* PAGE 2A1: COLLECTIVE ACTION CAMPAIGNS */}
        {activePage === 'collective' && (
          <CollectiveActionPage
            currentUser={currentUser}
            onOpenAuth={handleOpenAuth}
            language={language}
          />
        )}

        {/* PAGE 2A2: BEFORE-AND-AFTER IMPACT STORIES */}
        {activePage === 'stories' && (
          <ImpactStoriesPage
            currentUser={currentUser}
            onOpenAuth={handleOpenAuth}
            language={language}
          />
        )}

        {/* PAGE 2A3: DONATION DELIVERY TRACKING */}
        {activePage === 'deliveries' && (
          <DonationDeliveryTracking
            currentUser={currentUser}
            onOpenAuth={handleOpenAuth}
            language={language}
          />
        )}

        {/* PAGE 2A4: CORPORATE EMPLOYEE VOLUNTEERING */}
        {activePage === 'corporate-volunteering' && (
          <EmployeeVolunteeringPortal
            currentUser={currentUser}
            onOpenAuth={handleOpenAuth}
            language={language}
          />
        )}

        {/* PAGE 2A5: EXPERT MENTORSHIP NETWORK */}
        {activePage === 'mentorship' && (
          <ExpertMentorshipPage
            currentUser={currentUser}
            onOpenAuth={handleOpenAuth}
            language={language}
          />
        )}

        {/* PAGE 2A6: COLLABORATION NETWORK GRAPH */}
        {activePage === 'network-graph' && (
          <CollaborationNetworkGraphPage
            currentUser={currentUser}
            onOpenAuth={handleOpenAuth}
            language={language}
          />
        )}

        {/* 1. COMMUNITY NEEDS HEATMAP */}
        {activePage === 'heatmap' && (
          <CommunityNeedsHeatmap
            currentUser={currentUser}
            onOpenAuth={handleOpenAuth}
            language={language}
          />
        )}

        {/* 2. MICRO-VOLUNTEERING MARKETPLACE */}
        {activePage === 'micro-tasks' && (
          <MicroVolunteeringMarketplace
            currentUser={currentUser}
            onOpenAuth={handleOpenAuth}
            language={language}
          />
        )}

        {/* 5. VERIFIED CONTRIBUTION PASSPORT */}
        {activePage === 'passport' && (
          <ContributionPassportView
            currentUser={currentUser}
            onOpenAuth={handleOpenAuth}
            language={language}
          />
        )}

        {/* 6. SMART DOCUMENT CHECKLIST */}
        {activePage === 'document-checklist' && (
          <SmartDocumentChecklist
            currentUser={currentUser}
            onOpenAuth={handleOpenAuth}
            language={language}
          />
        )}

        {/* 7. CROSS-NGO COLLABORATION ROOMS */}
        {activePage === 'cross-ngo' && (
          <CrossNgoCollaborationRooms
            currentUser={currentUser}
            onOpenAuth={handleOpenAuth}
            language={language}
          />
        )}

        {/* 8. LONG-TERM IMPACT FOLLOW-UP */}
        {activePage === 'follow-ups' && (
          <LongTermImpactFollowUp
            currentUser={currentUser}
            onOpenAuth={handleOpenAuth}
            language={language}
          />
        )}

        {/* PAGE 2B: URGENT COMMUNITY NEEDS */}
        {activePage === 'urgent-needs' && (
          <UrgentCommunityNeeds
            currentUser={currentUser}
            onOpenAuth={handleOpenAuth}
          />
        )}

        {/* PAGE 2C: RESOURCE EXCHANGE HUB */}
        {activePage === 'resources' && (
          <ResourceExchangeHub
            currentUser={currentUser}
            onOpenAuth={handleOpenAuth}
          />
        )}

        {/* PAGE 2D: GRANTS & CSR DIRECTORY */}
        {activePage === 'grants' && (
          <GrantsDirectoryPage
            currentUser={currentUser}
          />
        )}

        {/* PAGE 2E: LIVE ACTIVITY FEED */}
        {activePage === 'feed' && (
          <LiveActivityFeed
            currentUser={currentUser}
            onSelectProject={(p) => setSelectedProject(p)}
          />
        )}

        {/* PAGE 3: VOLUNTEER & SKILL MARKETPLACE */}
        {activePage === 'marketplace' && (
          <SkillMarketplace
            currentUser={currentUser}
            onOpenAuth={handleOpenAuth}
          />
        )}

        {/* PAGE 4: CORPORATE CSR PORTAL */}
        {activePage === 'csr-portal' && (
          <CsrPortal
            currentUser={currentUser}
            onPartnerClick={(p) => setPartnershipProject(p)}
            onSelectProject={(p) => setSelectedProject(p)}
            onOpenCsrEvidence={() => setIsCsrEvidenceOpen(true)}
            onOpenCompatibilityChecker={() => setIsCompatibilityCheckerOpen(true)}
            onOpenMilestoneSponsorship={() => setIsMilestoneSponsorshipOpen(true)}
            onNavigate={(pageId) => {
              setActivePage(pageId);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* PAGE 5: FOR NGOS */}
        {activePage === 'for-ngos' && (
          <ForNgosPage
            onRegisterClick={() => handleOpenAuth('register', 'ngo')}
            onLoginClick={() => handleOpenAuth('login', 'ngo')}
          />
        )}

        {/* PAGE 6: HOW IT WORKS */}
        {activePage === 'how-it-works' && (
          <div className="py-6">
            <HowItWorksSection
              onExploreClick={() => {
                setActivePage('explore');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
    </div>
        )}

        {/* PAGE 7: ABOUT US */}
        {activePage === 'about-us' && (
          <AboutUsPage
            onExploreClick={() => {
              setActivePage('explore');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onRegisterNgoClick={() => handleOpenAuth('register', 'ngo')}
          />
        )}

        {/* PAGE 8: NGO DASHBOARD */}
        {activePage === 'ngo-dashboard' && (
          <NgoDashboard
            currentUser={currentUser}
            onOpenPostProject={() => setIsPostProjectOpen(true)}
            onOpenWorkspace={(p) => setWorkspacePartnership(p)}
            onOpenNeedToAction={() => setIsNeedToActionOpen(true)}
            onOpenQrAttendance={() => setIsQrAttendanceOpen(true)}
            onNavigate={(pageId) => {
              setActivePage(pageId);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* PAGE 9: SUPPORTER DASHBOARD */}
        {activePage === 'supporter-dashboard' && (
          <SupporterDashboard
            currentUser={currentUser}
            onSelectProject={(p) => setSelectedProject(p)}
            onPartnerClick={(p) => setPartnershipProject(p)}
            onOpenWorkspace={(p) => setWorkspacePartnership(p)}
            onNavigate={(pageId) => {
              setActivePage(pageId);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* PAGE 10: ADMIN DASHBOARD */}
        {activePage === 'admin-dashboard' && (
          <AdminDashboard
            currentUser={currentUser}
            onOpenRiskAlerts={() => setIsRiskAlertsOpen(true)}
            onNavigate={(pageId) => {
              setActivePage(pageId);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

      </main>

      {/* Global Footer */}
      <Footer
        onNavClick={(pageId) => {
          setActivePage(pageId);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAuth={handleOpenAuth}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModal.isOpen}
        initialMode={authModal.mode}
        initialRole={authModal.role}
        onClose={() => setAuthModal({ isOpen: false, mode: 'login', role: 'supporter' })}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Project Details Modal */}
      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onPartnerClick={(p) => setPartnershipProject(p)}
          onReportClick={(p) => setReportTarget({ type: 'project', target: p })}
          onOpenImpactReport={(p) => setImpactReportProject(p)}
        />
      )}

      {/* Partnership Proposal Modal */}
      {partnershipProject && (
        <PartnershipModal
          project={partnershipProject}
          currentPersona={currentUser}
          onClose={() => setPartnershipProject(null)}
          onSuccess={handlePartnershipSubmitted}
        />
      )}

      {/* Post Project Modal */}
      {isPostProjectOpen && (
        <PostProjectModal
          ngos={ngos}
          currentUser={currentUser}
          onClose={() => setIsPostProjectOpen(false)}
          onSuccess={handleProjectCreated}
        />
      )}

      {/* Collaboration Workspace Modal */}
      {workspacePartnership && (
        <CollaborationWorkspaceModal
          partnership={workspacePartnership}
          currentUser={currentUser}
          onClose={() => setWorkspacePartnership(null)}
          onStatusChanged={loadPlatformData}
          onOpenImpactReport={(proj) => setImpactReportProject(proj)}
          onOpenReview={(p) => setFeedbackPartnership(p)}
          onOpenAgreement={(p) => setAgreementPartnership(p)}
        />
      )}

      {/* Trust & Safety Report Modal */}
      {reportTarget && (
        <ReportModal
          isOpen={!!reportTarget}
          targetType={reportTarget.type}
          target={reportTarget.target}
          onClose={() => setReportTarget(null)}
          onSuccess={() => showToast('Report submitted for compliance review')}
        />
      )}

      {/* Impact AI Assistant Modal */}
      <ImpactAiAssistantModal
        isOpen={isAiAssistantOpen}
        onClose={() => setIsAiAssistantOpen(false)}
        currentUser={currentUser}
        onProjectCreated={(newProj) => {
          handleProjectCreated(newProj);
          setIsAiAssistantOpen(false);
          setActivePage('explore');
        }}
      />

      {/* Volunteer QR Attendance Modal */}
      <VolunteerQrAttendanceModal
        isOpen={isQrAttendanceOpen}
        onClose={() => setIsQrAttendanceOpen(false)}
        currentUser={currentUser}
        language={language}
      />

      {/* 1. Need-to-Action NLP Converter Modal */}
      <NeedToActionModal
        isOpen={isNeedToActionOpen}
        currentUser={currentUser}
        onClose={() => setIsNeedToActionOpen(false)}
        onSuccess={(pub) => {
          showToast(`Campaign "${pub.title}" published successfully!`);
          loadProjects();
          loadPlatformData();
        }}
      />

      {/* 7. Project Risk Alerts Modal */}
      <ProjectRiskAlertsModal
        isOpen={isRiskAlertsOpen}
        currentUser={currentUser}
        onClose={() => setIsRiskAlertsOpen(false)}
      />

      {/* 9. CSR Evidence Pack Dossier Modal */}
      <CsrEvidencePackModal
        isOpen={isCsrEvidenceOpen}
        projectId={selectedProject?.id || 'proj-1'}
        onClose={() => setIsCsrEvidenceOpen(false)}
      />

      {/* Audited Impact Report (PDF/Print) Modal */}
      <ImpactReportModal
        isOpen={!!impactReportProject}
        project={impactReportProject}
        stats={stats}
        onClose={() => setImpactReportProject(null)}
      />

      {/* Partnership Performance Feedback Modal */}
      <PartnershipFeedbackModal
        isOpen={!!feedbackPartnership}
        partnership={feedbackPartnership}
        currentUser={currentUser}
        onClose={() => setFeedbackPartnership(null)}
        onSuccess={() => {
          showToast('Thank you! Authentic review submitted successfully.');
          loadPlatformData();
        }}
      />

      {/* Project Comparison Dock & Modal */}
      <ProjectComparisonDock
        comparedProjects={comparedProjects}
        onOpenCompare={() => setIsComparisonModalOpen(true)}
        onRemoveProject={handleRemoveCompared}
        onClearAll={handleClearCompare}
        language={language}
      />

      <ProjectComparisonModal
        isOpen={isComparisonModalOpen}
        comparedProjects={comparedProjects}
        onClose={() => setIsComparisonModalOpen(false)}
        onRemoveProject={handleRemoveCompared}
        onClearAll={handleClearCompare}
        onSelectProject={(p) => setSelectedProject(p)}
        onPartnerClick={(p) => setPartnershipProject(p)}
        language={language}
      />

      {/* Smart Notification Center Modal */}
      <NotificationCenterModal
        isOpen={isNotificationCenterOpen}
        currentUser={currentUser}
        onClose={() => {
          setIsNotificationCenterOpen(false);
          loadNotificationsCount();
        }}
        onNavigate={(pageId) => {
          setActivePage(pageId);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        language={language}
      />

      {/* Partnership Agreement Draft Modal */}
      <PartnershipAgreementModal
        isOpen={!!agreementPartnership}
        partnership={agreementPartnership}
        currentUser={currentUser}
        onClose={() => setAgreementPartnership(null)}
        onSuccess={() => {
          showToast('Agreement draft successfully acknowledged and recorded.');
          loadPlatformData();
        }}
        language={language}
      />

      {/* 3. Partnership Compatibility Checker Modal */}
      <PartnershipCompatibilityChecker
        isOpen={isCompatibilityCheckerOpen}
        currentUser={currentUser}
        targetNgo={compatibilityTargetNgo}
        onClose={() => setIsCompatibilityCheckerOpen(false)}
      />

      {/* 4. Milestone-Based Sponsorship Modal */}
      <MilestoneSponsorshipModal
        isOpen={isMilestoneSponsorshipOpen}
        currentUser={currentUser}
        project={milestoneTargetProject || projects[0]}
        onClose={() => setIsMilestoneSponsorshipOpen(false)}
      />

    </div>
  );
}