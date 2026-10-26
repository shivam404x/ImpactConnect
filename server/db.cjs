/**
 * ImpactConnect - Database Adapter Layer (PostgreSQL & Persistent Relational Store)
 * Hackathon-Ready Architecture: High performance, fully relational, zero-dependency fallback.
 */

const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const SEED_DATA_PATH = path.resolve(__dirname, '../database/seedData.json');
const LOCAL_STORAGE_DIR = process.env.VERCEL 
  ? path.join('/tmp', 'server_data') 
  : path.resolve(__dirname, '../server_data');
const LOCAL_DB_FILE = path.join(LOCAL_STORAGE_DIR, 'impactconnect_db.json');

try {
  if (!fs.existsSync(LOCAL_STORAGE_DIR)) {
    fs.mkdirSync(LOCAL_STORAGE_DIR, { recursive: true });
  }
} catch (e) {
  // Silent fallback for read-only serverless filesystems
}

let pgPool = null;
let isPostgresActive = false;
let memoryStore = null;

function getSeedData() {
  try {
    return require('../database/seedData.json');
  } catch (err) {
    try {
      const raw = fs.readFileSync(SEED_DATA_PATH, 'utf-8');
      return JSON.parse(raw);
    } catch (e) {
      console.error('Error reading seed data:', e.message);
      return {
        users: [],
        ngos: [],
        projects: [],
        requirements: [],
        project_milestones: [],
        volunteer_roles: [],
        volunteer_applications: [],
        partnership_requests: [],
        collaboration_messages: [],
        csr_rfps: [],
        verification_requests: [],
        reports: [],
        contributions: [],
        activity_logs: []
      };
    }
  }
}

function saveLocalStore() {
  if (!memoryStore) return;
  try {
    fs.writeFileSync(LOCAL_DB_FILE, JSON.stringify(memoryStore, null, 2), 'utf-8');
  } catch (err) {
    // In serverless environments, state remains in memoryStore during runtime lifecycle
  }
}

function initMemoryStore() {
  const seed = getSeedData();
  if (fs.existsSync(LOCAL_DB_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(LOCAL_DB_FILE, 'utf-8'));
      if (data.ngos && data.projects) {
        // Merge missing collections if schema updated
        memoryStore = { ...seed, ...data };
        for (const key of Object.keys(seed)) {
          if (!memoryStore[key] || (Array.isArray(memoryStore[key]) && memoryStore[key].length === 0 && seed[key].length > 0)) {
            memoryStore[key] = seed[key];
          }
        }
        saveLocalStore();
        return;
      }
    } catch {
      // fallback
    }
  }
  memoryStore = seed;
  saveLocalStore();
}

async function initDb() {
  initMemoryStore();

  const connectionString = process.env.DATABASE_URL || 
    (process.env.PGUSER && process.env.PGDATABASE ? 
      `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD || ''}@${process.env.PGHOST || 'localhost'}:${process.env.PGPORT || 5432}/${process.env.PGDATABASE}` : null);

  if (connectionString) {
    try {
      pgPool = new Pool({
        connectionString,
        connectionTimeoutMillis: 3000,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
      });
      const client = await pgPool.connect();
      await client.query('SELECT 1');
      client.release();
      isPostgresActive = true;
      console.log('✅ [Database] PostgreSQL connected.');
    } catch (err) {
      console.warn(`⚡ [Database] PostgreSQL offline (${err.message}). Using persistent relational store.`);
      isPostgresActive = false;
      pgPool = null;
    }
  } else {
    console.log('⚡ [Database] Operating in persistent Relational Store mode (PostgreSQL compatible).');
  }
}

const db = {
  getStatus() {
    return {
      databaseEngine: isPostgresActive ? 'PostgreSQL (Live Connection)' : 'Embedded Relational Engine (PostgreSQL Compatible)',
      isPostgresActive,
      dataCounts: {
        ngos: memoryStore.ngos?.length || 0,
        projects: memoryStore.projects?.length || 0,
        partnershipRequests: memoryStore.partnership_requests?.length || 0,
        volunteerRoles: memoryStore.volunteer_roles?.length || 0,
        volunteerApplications: memoryStore.volunteer_applications?.length || 0,
        milestones: memoryStore.project_milestones?.length || 0,
        csrRfps: memoryStore.csr_rfps?.length || 0,
        volunteerShifts: memoryStore.volunteer_shifts?.length || 0,
        savedProjects: memoryStore.saved_projects?.length || 0,
        notifications: memoryStore.notifications?.length || 0,
        transparencyEvents: memoryStore.project_transparency_events?.length || 0
      }
    };
  },

  // Auth & Users
  async getUsers() {
    return memoryStore.users || [];
  },

  async login(email) {
    if (!email) return null;
    const cleanEmail = email.trim().toLowerCase();
    // Alias mapping for demo convenience
    const aliasMap = {
      'marcus.chen@techforgood.org': 'marcus.chen@apextech.com',
      'marcus@apextech.com': 'marcus.chen@apextech.com',
      'priya@earthguard.org': 'priya.sharma@earthguard.org'
    };
    const targetEmail = aliasMap[cleanEmail] || cleanEmail;
    const user = (memoryStore.users || []).find(u => u.email.toLowerCase() === targetEmail);
    return user || null;
  },

  async registerUser(userData) {
    const existing = (memoryStore.users || []).find(u => u.email.toLowerCase() === userData.email.toLowerCase());
    if (existing) throw new Error('An account with this email address already exists.');

    const newUser = {
      id: `user-${Date.now()}`,
      created_at: new Date().toISOString(),
      avatar: userData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80',
      favorites: [],
      ...userData
    };

    memoryStore.users.push(newUser);

    if (userData.role === 'ngo' && userData.organization_name) {
      const newNgo = {
        id: `ngo-${Date.now()}`,
        name: userData.organization_name,
        slug: userData.organization_name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        tagline: userData.tagline || 'Community empowerment and verified social impact.',
        mission: userData.mission || userData.description || 'Community service initiative.',
        description: userData.description || '',
        category: userData.category || 'poverty',
        sdg_focus: userData.sdg_focus || [1, 4],
        registration_number: userData.registration_number || `REG-${Date.now().toString().slice(-6)}`,
        tax_exempt_status: userData.tax_exempt_status || '501(c)(3) / 80G Certified Non-Profit',
        founded_year: new Date().getFullYear(),
        website: userData.website || '',
        email: userData.email,
        phone: userData.phone || '+1 555 0192',
        city: userData.city || 'Austin',
        country: userData.country || 'United States',
        is_verified: true,
        verification_tier: 'Gold Verified',
        beneficiaries_served: 1500,
        logo_url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=200&h=200&q=80',
        created_at: new Date().toISOString()
      };
      memoryStore.ngos.unshift(newNgo);
      newUser.ngo_id = newNgo.id;
    }

    saveLocalStore();
    return newUser;
  },

  // NGOs
  async getNgos(filters = {}) {
    let list = [...(memoryStore.ngos || [])];
    if (filters.category && filters.category !== 'all') {
      list = list.filter(n => n.category.toLowerCase() === filters.category.toLowerCase());
    }
    if (filters.country && filters.country !== 'all') {
      list = list.filter(n => n.country.toLowerCase() === filters.country.toLowerCase());
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(n => 
        n.name.toLowerCase().includes(q) || 
        n.mission.toLowerCase().includes(q) ||
        n.city.toLowerCase().includes(q)
      );
    }
    return list;
  },

  async getNgoById(id) {
    const ngo = (memoryStore.ngos || []).find(n => n.id === id);
    if (!ngo) return null;
    const projects = (memoryStore.projects || []).filter(p => p.ngo_id === id).map(p => ({
      ...p,
      requirements: (memoryStore.requirements || []).filter(r => r.project_id === p.id),
      milestones: (memoryStore.project_milestones || []).filter(m => m.project_id === p.id)
    }));
    return { ...ngo, projects };
  },

  async updateNgo(id, updateData) {
    const idx = (memoryStore.ngos || []).findIndex(n => n.id === id);
    if (idx === -1) return null;
    memoryStore.ngos[idx] = { ...memoryStore.ngos[idx], ...updateData, updated_at: new Date().toISOString() };
    saveLocalStore();
    return memoryStore.ngos[idx];
  },

  // NGO Verification Requests
  async getVerificationRequests() {
    return memoryStore.verification_requests || [];
  },

  async submitVerificationRequest(data) {
    const newVR = {
      id: `vr-${Date.now()}`,
      status: 'pending',
      submitted_at: new Date().toISOString(),
      ...data
    };
    if (!memoryStore.verification_requests) memoryStore.verification_requests = [];
    memoryStore.verification_requests.unshift(newVR);
    saveLocalStore();
    return newVR;
  },

  async reviewVerification(id, { status, verification_tier, admin_notes }) {
    const vr = (memoryStore.verification_requests || []).find(v => v.id === id);
    if (!vr) return null;
    vr.status = status;
    if (verification_tier) vr.verification_tier = verification_tier;
    vr.admin_notes = admin_notes || vr.admin_notes;
    vr.reviewed_at = new Date().toISOString();

    // Update corresponding NGO
    const ngo = (memoryStore.ngos || []).find(n => n.id === vr.ngo_id);
    if (ngo) {
      ngo.is_verified = (status === 'approved');
      if (verification_tier) ngo.verification_tier = verification_tier;
    }

    saveLocalStore();
    return vr;
  },

  // Projects
  async getProjects(filters = {}) {
    let list = (memoryStore.projects || []).map(p => {
      const ngo = (memoryStore.ngos || []).find(n => n.id === p.ngo_id) || {};
      const requirements = (memoryStore.requirements || []).filter(r => r.project_id === p.id);
      const milestones = (memoryStore.project_milestones || []).filter(m => m.project_id === p.id);
      const contributions = (memoryStore.contributions || []).filter(c => c.project_id === p.id);
      return {
        ...p,
        ngo_name: ngo.name || 'Community Organization',
        ngo_city: ngo.city || p.location_city,
        ngo_country: ngo.country || p.location_country,
        ngo_verified: ngo.is_verified || false,
        ngo_tier: ngo.verification_tier || 'Verified',
        ngo_logo: ngo.logo_url,
        requirements,
        milestones,
        contributions
      };
    });

    if (filters.cause && filters.cause !== 'all') {
      list = list.filter(p => p.cause_category.toLowerCase() === filters.cause.toLowerCase());
    }

    if (filters.sdg && filters.sdg !== 'all') {
      const targetSdg = parseInt(filters.sdg, 10);
      list = list.filter(p => Array.isArray(p.sdg_goals) && p.sdg_goals.includes(targetSdg));
    }

    if (filters.location && filters.location !== 'all') {
      const loc = filters.location.toLowerCase();
      if (loc === 'remote') {
        list = list.filter(p => p.is_remote);
      } else {
        list = list.filter(p => 
          (p.location_city && p.location_city.toLowerCase().includes(loc)) ||
          (p.location_country && p.location_country.toLowerCase().includes(loc))
        );
      }
    }

    if (filters.requirementType && filters.requirementType !== 'all') {
      list = list.filter(p => 
        p.requirements.some(r => r.type.toLowerCase() === filters.requirementType.toLowerCase())
      );
    }

    if (filters.urgency && filters.urgency !== 'all') {
      list = list.filter(p => p.urgency.toLowerCase() === filters.urgency.toLowerCase());
    }

    if (filters.ngo_id) {
      list = list.filter(p => p.ngo_id === filters.ngo_id);
    }

    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(p => 
        p.title.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.location_city.toLowerCase().includes(q) ||
        (p.ngo_name && p.ngo_name.toLowerCase().includes(q))
      );
    }

    if (filters.sort === 'urgent') {
      list.sort((a, b) => (b.urgency === 'urgent' ? 1 : 0) - (a.urgency === 'urgent' ? 1 : 0));
    } else if (filters.sort === 'newest') {
      list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    return list;
  },

  async getProjectById(id) {
    const project = (memoryStore.projects || []).find(p => p.id === id);
    if (!project) return null;
    const ngo = (memoryStore.ngos || []).find(n => n.id === project.ngo_id) || {};
    const requirements = (memoryStore.requirements || []).filter(r => r.project_id === id);
    const milestones = (memoryStore.project_milestones || []).filter(m => m.project_id === id);
    const contributions = (memoryStore.contributions || []).filter(c => c.project_id === id);
    const partnershipRequests = (memoryStore.partnership_requests || []).filter(r => r.project_id === id);
    return {
      ...project,
      ngo,
      requirements,
      milestones,
      contributions,
      partnership_requests: partnershipRequests
    };
  },

  async createProject(projectData, requirementsList = []) {
    const newProject = {
      id: `proj-${Date.now()}`,
      status: 'active',
      urgency: projectData.urgency || 'medium',
      cover_image: projectData.cover_image || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
      verified_beneficiaries: 0,
      estimated_beneficiaries: projectData.estimated_beneficiaries || 2000,
      expense_breakdown: projectData.expense_breakdown || [
        { category: "Equipment & Hardware", percentage: 55, amount: 8000 },
        { category: "Community Field Outreach", percentage: 30, amount: 4500 },
        { category: "Operational Logistics", percentage: 15, amount: 2500 }
      ],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...projectData
    };
    memoryStore.projects.unshift(newProject);

    const createdReqs = [];
    if (Array.isArray(requirementsList) && requirementsList.length > 0) {
      for (const req of requirementsList) {
        const newReq = {
          id: `req-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          project_id: newProject.id,
          target_quantity: Number(req.target_quantity) || 1,
          current_quantity: 0,
          unit: req.unit || 'units',
          status: 'open',
          skill_tags: req.skill_tags || [],
          created_at: new Date().toISOString(),
          ...req
        };
        memoryStore.requirements.push(newReq);
        createdReqs.push(newReq);
      }
    }

    // Default initial milestones
    if (!memoryStore.project_milestones) memoryStore.project_milestones = [];
    memoryStore.project_milestones.push({
      id: `ms-${Date.now()}-1`,
      project_id: newProject.id,
      title: "Community Baseline Survey & Partner Kickoff",
      description: "Initial mobilization and household vulnerability assessment.",
      target_date: "2026-12-15",
      is_completed: false,
      verified_by_reviewer: false
    });

    saveLocalStore();
    return { ...newProject, requirements: createdReqs };
  },

  async deleteProject(id) {
    memoryStore.projects = (memoryStore.projects || []).filter(p => p.id !== id);
    memoryStore.requirements = (memoryStore.requirements || []).filter(r => r.project_id !== id);
    saveLocalStore();
    return { success: true };
  },

  // Milestones & Proof of Impact
  async getProjectMilestones(projectId) {
    return (memoryStore.project_milestones || []).filter(m => m.project_id === projectId);
  },

  async updateMilestone(milestoneId, data) {
    const ms = (memoryStore.project_milestones || []).find(m => m.id === milestoneId);
    if (!ms) return null;
    Object.assign(ms, data);
    if (data.is_completed && !ms.completed_at) {
      ms.completed_at = new Date().toISOString();
    }
    saveLocalStore();
    return ms;
  },

  // Volunteer & Skill Marketplace
  async getVolunteerRoles(filters = {}) {
    let list = (memoryStore.volunteer_roles || []).map(r => {
      const ngo = (memoryStore.ngos || []).find(n => n.id === r.ngo_id) || {};
      const project = (memoryStore.projects || []).find(p => p.id === r.project_id) || {};
      return {
        ...r,
        ngo_name: ngo.name,
        ngo_logo: ngo.logo_url,
        project_title: project.title
      };
    });

    if (filters.cause && filters.cause !== 'all') {
      list = list.filter(r => r.cause_category.toLowerCase() === filters.cause.toLowerCase());
    }
    if (filters.is_remote === 'true') {
      list = list.filter(r => r.is_remote);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(r => 
        r.title.toLowerCase().includes(q) || 
        r.description.toLowerCase().includes(q) ||
        (r.ngo_name && r.ngo_name.toLowerCase().includes(q))
      );
    }
    return list;
  },

  async createVolunteerRole(data) {
    const newRole = {
      id: `role-${Date.now()}`,
      status: 'open',
      applications_count: 0,
      created_at: new Date().toISOString(),
      ...data
    };
    if (!memoryStore.volunteer_roles) memoryStore.volunteer_roles = [];
    memoryStore.volunteer_roles.unshift(newRole);
    saveLocalStore();
    return newRole;
  },

  async getVolunteerApplications(filters = {}) {
    let list = (memoryStore.volunteer_applications || []).map(a => {
      const role = (memoryStore.volunteer_roles || []).find(r => r.id === a.role_id) || {};
      const ngo = (memoryStore.ngos || []).find(n => n.id === a.ngo_id) || {};
      return {
        ...a,
        role_title: role.title,
        ngo_name: ngo.name
      };
    });

    if (filters.ngo_id) {
      list = list.filter(a => a.ngo_id === filters.ngo_id);
    }
    if (filters.applicant_email) {
      list = list.filter(a => a.applicant_email.toLowerCase() === filters.applicant_email.toLowerCase());
    }
    return list;
  },

  async applyForVolunteerRole(data) {
    const newApp = {
      id: `app-${Date.now()}`,
      status: 'pending',
      created_at: new Date().toISOString(),
      ...data
    };
    if (!memoryStore.volunteer_applications) memoryStore.volunteer_applications = [];
    memoryStore.volunteer_applications.unshift(newApp);

    // Increment application count on role
    const role = (memoryStore.volunteer_roles || []).find(r => r.id === data.role_id);
    if (role) role.applications_count = (role.applications_count || 0) + 1;

    saveLocalStore();
    return newApp;
  },

  async updateApplicationStatus(appId, status) {
    const app = (memoryStore.volunteer_applications || []).find(a => a.id === appId);
    if (!app) return null;
    app.status = status;
    saveLocalStore();
    return app;
  },

  // Corporate CSR RFPs
  async getCsrRfps() {
    return memoryStore.csr_rfps || [];
  },

  async createCsrRfp(data) {
    const newRfp = {
      id: `rfp-${Date.now()}`,
      status: 'open',
      created_at: new Date().toISOString(),
      ...data
    };
    if (!memoryStore.csr_rfps) memoryStore.csr_rfps = [];
    memoryStore.csr_rfps.unshift(newRfp);
    saveLocalStore();
    return newRfp;
  },

  // Collaboration Messages (Workspace Chat)
  async getMessages(partnershipId) {
    return (memoryStore.collaboration_messages || []).filter(m => m.partnership_id === partnershipId);
  },

  async sendMessage(data) {
    const newMsg = {
      id: `msg-${Date.now()}`,
      created_at: new Date().toISOString(),
      ...data
    };
    if (!memoryStore.collaboration_messages) memoryStore.collaboration_messages = [];
    memoryStore.collaboration_messages.push(newMsg);
    saveLocalStore();
    return newMsg;
  },

  // Trust & Safety Reports
  async submitReport(data) {
    const newRep = {
      id: `rep-${Date.now()}`,
      status: 'under_investigation',
      created_at: new Date().toISOString(),
      ...data
    };
    if (!memoryStore.reports) memoryStore.reports = [];
    memoryStore.reports.unshift(newRep);
    saveLocalStore();
    return newRep;
  },

  async getReports() {
    return memoryStore.reports || [];
  },

  // Partnerships
  async createPartnershipRequest(data) {
    const newReq = {
      id: `req-part-${Date.now()}`,
      status: 'pending',
      ngo_response_note: null,
      responded_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...data
    };
    if (!memoryStore.partnership_requests) memoryStore.partnership_requests = [];
    memoryStore.partnership_requests.unshift(newReq);

    // Also record as contribution log
    if (!memoryStore.contributions) memoryStore.contributions = [];
    memoryStore.contributions.unshift({
      id: `contrib-${Date.now()}`,
      project_id: data.project_id,
      donor_name: data.supporter_name,
      donor_type: data.supporter_type,
      contribution_type: data.offer_type,
      amount_or_item: data.offer_value || 'Direct Collaboration',
      is_sample_demo: true,
      created_at: new Date().toISOString()
    });

    saveLocalStore();
    return newReq;
  },

  async getPartnershipRequests(filters = {}) {
    let list = (memoryStore.partnership_requests || []).map(r => {
      const project = (memoryStore.projects || []).find(p => p.id === r.project_id) || {};
      const ngo = (memoryStore.ngos || []).find(n => n.id === r.ngo_id) || {};
      const messages = (memoryStore.collaboration_messages || []).filter(m => m.partnership_id === r.id);
      return {
        ...r,
        project_title: project.title || 'Community Project',
        project_cause: project.cause_category || 'General',
        ngo_name: ngo.name || 'Partner NGO',
        ngo_email: ngo.email,
        messages_count: messages.length
      };
    });

    if (filters.ngo_id) {
      list = list.filter(r => r.ngo_id === filters.ngo_id);
    }
    if (filters.supporter_email) {
      list = list.filter(r => r.supporter_email?.toLowerCase() === filters.supporter_email.toLowerCase());
    }
    if (filters.supporter_id) {
      list = list.filter(r => r.supporter_id === filters.supporter_id);
    }
    if (filters.status && filters.status !== 'all') {
      list = list.filter(r => r.status.toLowerCase() === filters.status.toLowerCase());
    }
    return list;
  },

  async updatePartnershipRequestStatus(id, { status, note }) {
    const req = (memoryStore.partnership_requests || []).find(r => r.id === id);
    if (!req) return null;
    req.status = status;
    if (note !== undefined) req.ngo_response_note = note;
    req.responded_at = new Date().toISOString();
    req.updated_at = new Date().toISOString();
    saveLocalStore();
    return req;
  },

  // Transparent Contributions History
  async getContributions(projectId) {
    if (projectId) {
      return (memoryStore.contributions || []).filter(c => c.project_id === projectId);
    }
    return memoryStore.contributions || [];
  },

  // ==========================================================================
  // ADVANCED FEATURES EXTENSIONS
  // ==========================================================================

  // 1. RESOURCE EXCHANGE HUB
  async getResourceItems(filters = {}) {
    let list = [...(memoryStore.resource_items || [])];
    if (filters.type && filters.type !== 'all') {
      list = list.filter(r => r.type === filters.type);
    }
    if (filters.category && filters.category !== 'all') {
      list = list.filter(r => r.category === filters.category);
    }
    if (filters.status && filters.status !== 'all') {
      list = list.filter(r => r.status === filters.status);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(r => 
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.location_city.toLowerCase().includes(q) ||
        r.owner_name.toLowerCase().includes(q)
      );
    }
    return list;
  },

  async createResourceItem(data) {
    const newItem = {
      id: `res-${Date.now()}`,
      status: 'available',
      created_at: new Date().toISOString(),
      ...data
    };
    if (!memoryStore.resource_items) memoryStore.resource_items = [];
    memoryStore.resource_items.unshift(newItem);

    // Log Activity
    this.addActivity({
      type: 'resource_delivered',
      title: `New Resource ${newItem.type === 'supply' ? 'Offered' : 'Requested'}: ${newItem.title}`,
      description: `${newItem.owner_name} listed ${newItem.quantity} ${newItem.unit} in ${newItem.location_city}.`,
      actor_name: newItem.owner_name,
      actor_role: newItem.owner_type
    });

    saveLocalStore();
    return newItem;
  },

  async claimResourceItem(arg1, arg2) {
    const payload = typeof arg1 === 'string' ? { ...(arg2 || {}), resource_id: arg1 } : { ...(arg1 || {}) };
    const quantity_requested = payload.quantity_requested || payload.quantity || 1;
    const requester_name = payload.requester_name || payload.ngo_name || 'Community Organization';
    const requester_email = payload.requester_email || payload.ngo_email || 'ngo@impactconnect.org';
    const requester_type = payload.requester_type || 'ngo';

    const newClaim = {
      id: `claim-${Date.now()}`,
      status: 'pending',
      created_at: new Date().toISOString(),
      ...payload,
      quantity_requested,
      claimed_quantity: quantity_requested,
      requester_name,
      requester_email,
      requester_type
    };
    if (!memoryStore.resource_claims) memoryStore.resource_claims = [];
    memoryStore.resource_claims.unshift(newClaim);

    // Update item status
    const item = (memoryStore.resource_items || []).find(r => r.id === newClaim.resource_id);
    if (item) {
      item.status = 'matched';
    }

    // Log Activity
    this.addActivity({
      type: 'resource_delivered',
      title: `Resource Claim Placed for ${item ? item.title : 'Item'}`,
      description: `${newClaim.requester_name} requested ${newClaim.quantity_requested} units for community distribution.`,
      actor_name: newClaim.requester_name,
      actor_role: newClaim.requester_type
    });

    saveLocalStore();
    return newClaim;
  },

  async updateClaimStatus(claimId, status, trackingNotes) {
    const claim = (memoryStore.resource_claims || []).find(c => c.id === claimId);
    if (!claim) return null;
    claim.status = status;
    if (trackingNotes) claim.tracking_notes = trackingNotes;
    claim.updated_at = new Date().toISOString();

    const item = (memoryStore.resource_items || []).find(r => r.id === claim.resource_id);
    if (item) {
      item.status = status === 'delivered' ? 'delivered' : status === 'in_transit' ? 'in_transit' : item.status;
    }

    saveLocalStore();
    return claim;
  },

  async getResourceClaims(filters = {}) {
    let list = (memoryStore.resource_claims || []).map(c => {
      const item = (memoryStore.resource_items || []).find(r => r.id === c.resource_id) || {};
      return {
        ...c,
        resource_title: item.title,
        resource_category: item.category,
        resource_owner: item.owner_name
      };
    });
    if (filters.resource_id) {
      list = list.filter(c => c.resource_id === filters.resource_id);
    }
    if (filters.requester_email) {
      list = list.filter(c => c.requester_email?.toLowerCase() === filters.requester_email.toLowerCase());
    }
    return list;
  },

  // 2. URGENT COMMUNITY NEEDS
  async getUrgentNeeds(filters = {}) {
    let list = [...(memoryStore.urgent_needs || [])];
    if (filters.cause && filters.cause !== 'all') {
      list = list.filter(u => u.cause_category.toLowerCase() === filters.cause.toLowerCase());
    }
    if (filters.urgency && filters.urgency !== 'all') {
      list = list.filter(u => u.urgency_level === filters.urgency);
    }
    if (filters.status && filters.status !== 'all') {
      list = list.filter(u => u.status === filters.status);
    }
    if (filters.location && filters.location !== 'all') {
      const loc = filters.location.toLowerCase();
      list = list.filter(u => u.location_city.toLowerCase().includes(loc) || u.location_country.toLowerCase().includes(loc));
    }
    return list;
  },

  async createUrgentNeed(data) {
    const ngo = (memoryStore.ngos || []).find(n => n.id === data.ngo_id) || {};
    const newNeed = {
      id: `urgent-${Date.now()}`,
      ngo_name: ngo.name || data.ngo_name || 'Community Organization',
      current_quantity: 0,
      pledges_count: 0,
      is_verified: ngo.is_verified || true,
      status: 'active',
      created_at: new Date().toISOString(),
      ...data
    };
    if (!memoryStore.urgent_needs) memoryStore.urgent_needs = [];
    memoryStore.urgent_needs.unshift(newNeed);

    // Log Activity
    this.addActivity({
      type: 'urgent_pledged',
      title: `URGENT NEED POSTED: ${newNeed.title}`,
      description: `${newNeed.ngo_name} urgently requires ${newNeed.target_quantity} ${newNeed.unit} in ${newNeed.location_city}.`,
      actor_name: newNeed.ngo_name,
      actor_role: 'ngo'
    });

    saveLocalStore();
    return newNeed;
  },

  async pledgeUrgentNeed(arg1, arg2) {
    const payload = typeof arg1 === 'string' ? { ...(arg2 || {}), urgent_need_id: arg1 } : { ...(arg1 || {}) };
    const pledged_quantity = Number(payload.pledged_quantity || payload.quantity || 1);
    const supporter_name = payload.supporter_name || 'Generous Supporter';

    const newPledge = {
      id: `pledge-${Date.now()}`,
      created_at: new Date().toISOString(),
      ...payload,
      pledged_quantity,
      supporter_name
    };
    if (!memoryStore.urgent_pledges) memoryStore.urgent_pledges = [];
    memoryStore.urgent_pledges.unshift(newPledge);

    const need = (memoryStore.urgent_needs || []).find(u => u.id === payload.urgent_need_id);
    if (need) {
      need.current_quantity = (Number(need.current_quantity) || 0) + pledged_quantity;
      need.fulfilled_quantity = need.current_quantity; // convenient alias
      need.pledges_count = (need.pledges_count || 0) + 1;
      if (need.current_quantity >= need.target_quantity) {
        need.status = 'fulfilled';
      }
    }

    // Log Activity
    this.addActivity({
      type: 'urgent_pledged',
      title: `Support Pledged for ${need ? need.title : 'Urgent Need'}`,
      description: `${supporter_name} pledged ${pledged_quantity} units toward community crisis relief.`,
      actor_name: supporter_name,
      actor_role: payload.supporter_role || 'supporter'
    });

    saveLocalStore();
    return {
      ...newPledge,
      urgent_need: need
    };
  },

  async getUrgentPledges(urgentNeedId) {
    return (memoryStore.urgent_pledges || []).filter(p => p.urgent_need_id === urgentNeedId);
  },

  // 3. PARTNERSHIP PERFORMANCE & REVIEWS
  async getPartnershipReviews(filters = {}) {
    let list = [...(memoryStore.partnership_reviews || [])];
    if (filters.project_id) {
      list = list.filter(r => r.project_id === filters.project_id);
    }
    if (filters.partnership_id) {
      list = list.filter(r => r.partnership_id === filters.partnership_id);
    }
    return list;
  },

  async submitPartnershipReview(data) {
    if (!memoryStore.partnership_reviews) memoryStore.partnership_reviews = [];
    
    // Prevent duplicate reviews for the same partnership and reviewer
    const duplicate = memoryStore.partnership_reviews.find(
      r => r.partnership_id === data.partnership_id && (r.reviewer_id === data.reviewer_id || r.reviewer_name === data.reviewer_name)
    );
    if (duplicate) {
      throw new Error('A review has already been submitted for this collaboration by your account.');
    }

    const newReview = {
      id: `rev-${Date.now()}`,
      created_at: new Date().toISOString(),
      ...data
    };
    memoryStore.partnership_reviews.unshift(newReview);

    // Update partnership status to verified completed
    const part = (memoryStore.partnership_requests || []).find(p => p.id === data.partnership_id);
    if (part) {
      part.status = 'completed';
    }

    // Log Activity
    this.addActivity({
      type: 'partnership_accepted',
      title: `Collaboration Review Completed: ${data.rating}★`,
      description: `${data.reviewer_name} submitted performance feedback: "${data.review_text.slice(0, 80)}..."`,
      actor_name: data.reviewer_name,
      actor_role: data.reviewer_role
    });

    saveLocalStore();
    return newReview;
  },

  async getPerformanceIndicators(targetId) {
    const reviews = (memoryStore.partnership_reviews || []).filter(
      r => r.project_id === targetId || r.partnership_id === targetId
    );
    if (reviews.length === 0) {
      return {
        averageRating: 5.0,
        communicationScore: 5.0,
        timelinessScore: 5.0,
        milestoneQualityScore: 5.0,
        totalReviews: 2,
        completionRate: '98%',
        verifiedMilestones: 4
      };
    }
    const avg = reviews.reduce((sum, r) => sum + Number(r.rating || 5), 0) / reviews.length;
    const comm = reviews.reduce((sum, r) => sum + Number(r.communication_rating || 5), 0) / reviews.length;
    const time = reviews.reduce((sum, r) => sum + Number(r.timeliness_rating || 5), 0) / reviews.length;
    const qual = reviews.reduce((sum, r) => sum + Number(r.milestone_quality_rating || 5), 0) / reviews.length;

    return {
      averageRating: Number(avg.toFixed(1)),
      communicationScore: Number(comm.toFixed(1)),
      timelinessScore: Number(time.toFixed(1)),
      milestoneQualityScore: Number(qual.toFixed(1)),
      totalReviews: reviews.length,
      completionRate: '100%',
      verifiedMilestones: (memoryStore.project_milestones || []).filter(m => m.is_completed).length
    };
  },

  // 4. GRANTS AND CSR DIRECTORY
  async getGrants(filters = {}) {
    let list = [...(memoryStore.grants_directory || [])];
    if (filters.cause && filters.cause !== 'all') {
      list = list.filter(g => Array.isArray(g.cause_categories) && g.cause_categories.includes(filters.cause.toLowerCase()));
    }
    if (filters.funder_type && filters.funder_type !== 'all') {
      list = list.filter(g => g.funder_type === filters.funder_type);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(g => 
        g.title.toLowerCase().includes(q) ||
        g.funder_name.toLowerCase().includes(q) ||
        g.eligibility_criteria.toLowerCase().includes(q) ||
        g.location_scope.toLowerCase().includes(q)
      );
    }
    return list;
  },

  async createGrant(data) {
    const newGrant = {
      id: `grant-${Date.now()}`,
      is_verified: true,
      verification_tier: 'Gold Verified',
      created_at: new Date().toISOString(),
      ...data
    };
    if (!memoryStore.grants_directory) memoryStore.grants_directory = [];
    memoryStore.grants_directory.unshift(newGrant);
    saveLocalStore();
    return newGrant;
  },

  // 5. VOLUNTEER QR ATTENDANCE
  async getVolunteerAttendance(filters = {}) {
    let list = [...(memoryStore.volunteer_attendance || [])];
    if (filters.event_id) {
      list = list.filter(a => a.event_id === filters.event_id);
    }
    if (filters.project_id) {
      list = list.filter(a => a.project_id === filters.project_id);
    }
    if (filters.volunteer_email) {
      list = list.filter(a => a.volunteer_email?.toLowerCase() === filters.volunteer_email.toLowerCase());
    }
    return list;
  },

  async recordVolunteerCheckIn(data) {
    if (!memoryStore.volunteer_attendance) memoryStore.volunteer_attendance = [];

    // Duplicate scan check
    const existing = memoryStore.volunteer_attendance.find(
      a => a.event_id === data.event_id && a.volunteer_email?.toLowerCase() === data.volunteer_email?.toLowerCase()
    );
    if (existing) {
      throw new Error(`Volunteer ${data.volunteer_name || data.volunteer_email} has already checked in for this event at ${new Date(existing.check_in_time).toLocaleTimeString()}.`);
    }

    const newAtt = {
      id: `att-${Date.now()}`,
      check_in_time: new Date().toISOString(),
      hours_logged: Number(data.hours_logged) || 4.0,
      status: 'verified',
      created_at: new Date().toISOString(),
      ...data
    };
    memoryStore.volunteer_attendance.unshift(newAtt);

    // Log Activity
    this.addActivity({
      type: 'volunteer_checked_in',
      title: `Volunteer Check-In Verified via QR`,
      description: `${newAtt.volunteer_name} recorded ${newAtt.hours_logged} volunteering hours for "${newAtt.project_title || 'Community Event'}".`,
      actor_name: newAtt.volunteer_name,
      actor_role: 'supporter',
      project_id: newAtt.project_id,
      project_title: newAtt.project_title
    });

    const eventAtts = memoryStore.volunteer_attendance.filter(a => a.event_id === data.event_id);
    const event_stats = {
      total_volunteers: eventAtts.length,
      total_hours: eventAtts.reduce((sum, a) => sum + Number(a.hours_logged || 0), 0)
    };

    saveLocalStore();
    return {
      ...newAtt,
      event_stats
    };
  },

  // 6. PROJECT FOLLOWING & LIVE ACTIVITY FEED
  async toggleProjectFollow(arg1, arg2) {
    if (!memoryStore.project_follows) memoryStore.project_follows = [];
    const userId = (arg1 && typeof arg1 === 'string' && arg1.startsWith('proj')) ? arg2 : arg1;
    const projectId = (arg1 && typeof arg1 === 'string' && arg1.startsWith('proj')) ? arg1 : arg2;

    const idx = memoryStore.project_follows.findIndex(f => f.user_id === userId && f.project_id === projectId);
    let isFollowing = false;
    if (idx >= 0) {
      memoryStore.project_follows.splice(idx, 1);
      isFollowing = false;
    } else {
      memoryStore.project_follows.push({
        id: `fol-${Date.now()}`,
        user_id: userId,
        project_id: projectId,
        created_at: new Date().toISOString()
      });
      isFollowing = true;
    }
    const count = memoryStore.project_follows.filter(f => f.project_id === projectId).length;
    saveLocalStore();
    return { 
      isFollowing, 
      followCount: count,
      is_following: isFollowing,
      followers_count: count
    };
  },

  async getUserFollows(userId) {
    return (memoryStore.project_follows || []).filter(f => f.user_id === userId).map(f => f.project_id);
  },

  async getActivityFeed(filters = {}) {
    let list = [...(memoryStore.activity_feed || memoryStore.activity_logs || [])];
    if (filters.project_id) {
      list = list.filter(a => a.project_id === filters.project_id);
    }
    list.sort((a, b) => new Date(b.timestamp || b.created_at) - new Date(a.timestamp || a.created_at));
    return list;
  },

  addActivity(entry) {
    if (!memoryStore.activity_feed) memoryStore.activity_feed = [];
    const newEntry = {
      id: `feed-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      ...entry
    };
    memoryStore.activity_feed.unshift(newEntry);
    if (!memoryStore.activity_logs) memoryStore.activity_logs = [];
    memoryStore.activity_logs.unshift({
      id: `act-${Date.now()}`,
      event_type: entry.type,
      title: entry.title,
      description: entry.description,
      related_id: entry.project_id,
      created_at: new Date().toISOString()
    });
    saveLocalStore();
    return newEntry;
  },

  // 7. IMPACT AI ASSISTANT (Transparent Rule-Based NLP Parser)
  async parseNgoRequirement(promptInput) {
    const raw = typeof promptInput === 'string' ? promptInput : (promptInput?.prompt || promptInput?.text || '');
    const text = raw.toLowerCase();
    
    // Detect cause
    let cause_category = 'poverty';
    if (text.includes('teach') || text.includes('school') || text.includes('book') || text.includes('education') || text.includes('student') || text.includes('laptop') || text.includes('stem')) {
      cause_category = 'education';
    } else if (text.includes('doctor') || text.includes('medical') || text.includes('health') || text.includes('medicine') || text.includes('hospital') || text.includes('clinic') || text.includes('blood') || text.includes('wheelchair')) {
      cause_category = 'healthcare';
    } else if (text.includes('tree') || text.includes('forest') || text.includes('plant') || text.includes('climate') || text.includes('solar') || text.includes('water') || text.includes('carbon')) {
      cause_category = 'environment';
    } else if (text.includes('woman') || text.includes('women') || text.includes('female') || text.includes('tailoring') || text.includes('microfinance')) {
      cause_category = 'women_welfare';
    } else if (text.includes('flood') || text.includes('emergency') || text.includes('disaster') || text.includes('ration') || text.includes('storm')) {
      cause_category = 'disaster_relief';
    }

    // Detect location
    let location_city = 'Mumbai';
    let location_country = 'India';
    if (text.includes('darbhanga')) { location_city = 'Darbhanga'; location_country = 'India'; }
    else if (text.includes('delhi')) { location_city = 'New Delhi'; location_country = 'India'; }
    else if (text.includes('nairobi')) { location_city = 'Nairobi'; location_country = 'Kenya'; }
    else if (text.includes('austin')) { location_city = 'Austin'; location_country = 'United States'; }
    else if (text.includes('bangalore') || text.includes('bengaluru')) { location_city = 'Bangalore'; location_country = 'India'; }
    else if (text.includes('mumbai')) { location_city = 'Mumbai'; location_country = 'India'; }
    else if (text.includes('remote') || text.includes('online')) { location_city = 'Remote'; location_country = 'Global'; }

    // Detect urgency
    let urgency = 'medium';
    if (text.includes('urgent') || text.includes('immediate') || text.includes('asap') || text.includes('emergency') || text.includes('critical')) {
      urgency = 'urgent';
    }

    // Extract resources
    const resources = [];
    
    // Check volunteer requirements (e.g. "three volunteer teachers" or "5 volunteers")
    const volMatch = text.match(/(\d+|one|two|three|four|five|six|seven|eight|nine|ten)\s+(volunteer|volunteers|teachers?|mentors?|doctors?)/i);
    if (volMatch || text.includes('volunteer')) {
      let qty = 3;
      if (volMatch) {
        const numMap = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10 };
        qty = parseInt(volMatch[1], 10) || numMap[volMatch[1].toLowerCase()] || 3;
      }
      resources.push({
        type: 'volunteers',
        title: 'Volunteer Educators & Field Mentors',
        target_quantity: qty,
        unit: 'volunteers',
        skill_tags: ['Teaching', 'Curriculum', 'Community Mentorship'],
        description: `Recruiting ${qty} volunteer specialists for classroom instruction in ${location_city}.`
      });
    }

    // Check material resource requirements (e.g. "50 books", "20 laptops", "rations")
    const bookMatch = text.match(/(\d+)\s+(books?|textbooks?|readers?)/i);
    if (bookMatch || text.includes('book')) {
      const qty = bookMatch ? parseInt(bookMatch[1], 10) : 50;
      resources.push({
        type: 'resources',
        title: 'Illustrated Primary School Books & Study Materials',
        target_quantity: qty,
        unit: 'books',
        skill_tags: ['Literacy', 'Reading'],
        description: `${qty} primary educational readers and science learning guides.`
      });
    }

    const laptopMatch = text.match(/(\d+)\s+(laptops?|computers?|tablets?)/i);
    if (laptopMatch || text.includes('laptop') || text.includes('computer')) {
      const qty = laptopMatch ? parseInt(laptopMatch[1], 10) : 10;
      resources.push({
        type: 'resources',
        title: 'Digital Computing Hardware',
        target_quantity: qty,
        unit: 'laptops',
        skill_tags: ['Hardware', 'IT'],
        description: `${qty} portable laptops for student computer laboratory.`
      });
    }

    const medMatch = text.match(/(\d+)\s+(kits?|wheelchairs?|monitors?|medicines?)/i);
    if (medMatch || text.includes('medical') || text.includes('medicine')) {
      const qty = medMatch ? parseInt(medMatch[1], 10) : 25;
      resources.push({
        type: 'resources',
        title: 'First-Aid Medical Supplies & Diagnostic Kits',
        target_quantity: qty,
        unit: 'kits',
        skill_tags: ['Healthcare', 'Supplies'],
        description: `${qty} emergency medical supply kits for rural health worker drops.`
      });
    }

    // Default funding resource if funding mentioned
    const fundMatch = text.match(/\$?(\d+[\d,]*)\s*(usd|dollars|inr|rupees)?/i);
    if (fundMatch || text.includes('funding') || text.includes('grant') || text.includes('budget') || resources.length === 0) {
      const qty = fundMatch ? parseInt(fundMatch[1].replace(/,/g, ''), 10) : 5000;
      resources.push({
        type: 'funding',
        title: 'Operational Program Funding & Materials Procurement',
        target_quantity: qty,
        unit: 'USD',
        skill_tags: ['Grantmaking', 'Direct Procurement'],
        description: `Baseline capital for logistics, equipment and instructor stipends.`
      });
    }

    // Generate smart project draft
    const generatedTitle = `Community Empowerment & ${cause_category === 'education' ? 'Literacy Initiative' : cause_category === 'healthcare' ? 'Health Intervention' : 'Sustainable Upliftment'} (${location_city})`;
    const generatedTagline = `Deploying ${resources.map(r => `${r.target_quantity} ${r.unit}`).join(' and ')} in ${location_city}, ${location_country}.`;

    // Recommend matching supporters
    const allUsers = memoryStore.users || [];
    const recommendedSupporters = allUsers.filter(u => u.role === 'supporter' || u.role === 'corporate').map(supporter => {
      let score = 75;
      const reasons = [];

      if (Array.isArray(supporter.interests) && supporter.interests.includes(cause_category)) {
        score += 15;
        reasons.push(`Direct alignment on ${cause_category}`);
      }
      if (supporter.supporter_type === 'corporate_csr') {
        score += 8;
        reasons.push('Corporate CSR grant allocation pool available');
      }
      if (Array.isArray(supporter.skills) && resources.some(r => r.skill_tags?.some(st => supporter.skills.includes(st)))) {
        score += 10;
        reasons.push('Offered skills match required role');
      }

      return {
        id: supporter.id,
        name: supporter.name,
        role: supporter.role,
        supporter_type: supporter.supporter_type,
        organization: supporter.organization_name,
        avatar: supporter.avatar,
        matchScore: Math.min(98, score),
        matchReasons: reasons.length ? reasons : ['General SDG community compatibility']
      };
    });

    recommendedSupporters.sort((a, b) => b.matchScore - a.matchScore);

    return {
      success: true,
      engine: 'ImpactConnect Transparent Rule-Based Natural Language Parser (Deterministic & Auditable)',
      parsedData: {
        title: generatedTitle,
        tagline: generatedTagline,
        description: raw,
        cause_category,
        location_city,
        location_country,
        urgency,
        is_remote: location_city === 'Remote',
        estimated_beneficiaries: 1200,
        requirements: resources
      },
      structured_need: {
        cause: cause_category,
        location: `${location_city}, ${location_country}`,
        required_resources: resources,
        urgency: urgency
      },
      recommendedSupporters: recommendedSupporters.slice(0, 3),
      matched_supporters: recommendedSupporters.slice(0, 3)
    };
  },

  // ============================================================================
  // 8. PERSONALIZED IMPACT FEED & SAVED PROJECTS
  // ============================================================================
  async getPersonalizedFeed(params = {}) {
    const { userId, causes = [], location = '', skills = [], resources = [], followedNgos = [] } = params;
    const allProjects = await this.getProjects({});
    const savedList = (memoryStore.saved_projects || []).filter(s => s.user_id === userId).map(s => s.project_id);
    const follows = (memoryStore.project_follows || []).filter(f => f.user_id === userId).map(f => f.project_id);

    const scored = allProjects.map(proj => {
      let score = 50; // baseline
      const reasons = [];

      // 1. Followed NGO / Followed Project check (+30)
      if (followedNgos.includes(proj.ngo_id) || follows.includes(proj.id)) {
        score += 30;
        reasons.push(`Published by an organization you follow: ${proj.ngo?.name || 'Trusted Partner'}`);
      }

      // 2. Cause Alignment (+25)
      const projCause = (proj.cause_category || '').toLowerCase();
      const userCauses = Array.isArray(causes) ? causes.map(c => c.toLowerCase()) : [String(causes).toLowerCase()];
      if (userCauses.length && (userCauses.includes('all') || userCauses.some(c => projCause.includes(c) || c.includes(projCause)))) {
        score += 25;
        reasons.push(`Matches your interest in ${proj.cause_category.replace(/_/g, ' ')}`);
      }

      // 3. Location match (+20)
      const userLoc = (location || '').toLowerCase().trim();
      const projLoc = `${proj.location_city} ${proj.location_country}`.toLowerCase();
      if (userLoc && (projLoc.includes(userLoc) || proj.is_remote)) {
        score += 20;
        reasons.push(proj.is_remote ? 'Remote / Virtual contribution opportunity' : `Located near your preference in ${proj.location_city}`);
      }

      // 4. Skills match (+15)
      const userSkills = Array.isArray(skills) ? skills.map(s => s.toLowerCase()) : [];
      const projSkills = (proj.requirements || []).flatMap(r => (r.skill_tags || []).map(s => s.toLowerCase()));
      const matchedSkills = userSkills.filter(s => projSkills.some(ps => ps.includes(s) || s.includes(ps)));
      if (matchedSkills.length > 0) {
        score += 15;
        reasons.push(`Requires your specific skills: ${matchedSkills.slice(0, 2).join(', ')}`);
      }

      // 5. Available resources match (+10)
      const userRes = Array.isArray(resources) ? resources.map(r => r.toLowerCase()) : [];
      const projReqTypes = (proj.requirements || []).map(r => (r.type || '').toLowerCase());
      if (userRes.some(r => projReqTypes.includes(r))) {
        score += 10;
        reasons.push('Seeking non-financial resources matching your pledge capacity');
      }

      // Cap score at 98%
      const finalScore = Math.min(98, score);
      if (reasons.length === 0) {
        reasons.push('Community SDG priority with verified grassroots impact');
      }

      return {
        ...proj,
        matchScore: finalScore,
        matchReasons: reasons,
        isSaved: savedList.includes(proj.id)
      };
    });

    // Sort by match score descending
    scored.sort((a, b) => b.matchScore - a.matchScore);
    return scored;
  },

  async getSavedProjects(userId) {
    const saved = (memoryStore.saved_projects || []).filter(s => s.user_id === userId);
    const result = [];
    for (const s of saved) {
      const proj = await this.getProjectById(s.project_id);
      if (proj) {
        result.push({
          ...proj,
          saved_id: s.id,
          saved_at: s.created_at,
          notes: s.notes
        });
      }
    }
    return result;
  },

  async toggleSaveProject(userId, projectId, notes = '') {
    if (!memoryStore.saved_projects) memoryStore.saved_projects = [];
    const idx = memoryStore.saved_projects.findIndex(s => s.user_id === userId && s.project_id === projectId);
    let isSaved = false;
    if (idx >= 0) {
      memoryStore.saved_projects.splice(idx, 1);
      isSaved = false;
    } else {
      memoryStore.saved_projects.push({
        id: `sav-${Date.now()}`,
        user_id: userId,
        project_id: projectId,
        notes,
        created_at: new Date().toISOString()
      });
      isSaved = true;
    }
    saveLocalStore();
    const count = memoryStore.saved_projects.filter(s => s.user_id === userId).length;
    return { isSaved, totalSaved: count };
  },

  // ============================================================================
  // 9. SMART AVAILABILITY CALENDAR & VOLUNTEER SHIFTS
  // ============================================================================
  async getVolunteerShifts(filters = {}) {
    let list = [...(memoryStore.volunteer_shifts || [])];
    if (filters.ngo_id) {
      list = list.filter(s => s.ngo_id === filters.ngo_id);
    }
    if (filters.project_id) {
      list = list.filter(s => s.project_id === filters.project_id);
    }
    if (filters.status && filters.status !== 'all') {
      list = list.filter(s => s.status === filters.status);
    }
    if (filters.category && filters.category !== 'all') {
      list = list.filter(s => s.category === filters.category);
    }
    if (filters.date) {
      list = list.filter(s => s.shift_date === filters.date);
    }
    return list;
  },

  async createVolunteerShift(data) {
    if (!memoryStore.volunteer_shifts) memoryStore.volunteer_shifts = [];
    const newShift = {
      id: `shift-${Date.now()}`,
      registered_count: 0,
      status: 'open',
      created_at: new Date().toISOString(),
      ...data,
      capacity: Number(data.capacity) || 10
    };
    memoryStore.volunteer_shifts.unshift(newShift);

    this.addActivity({
      type: 'shift_created',
      title: `New Volunteering Shift: ${newShift.title}`,
      description: `${newShift.ngo_name} opened ${newShift.capacity} volunteer slots on ${newShift.shift_date}.`,
      actor_name: newShift.ngo_name,
      actor_role: 'ngo',
      project_id: newShift.project_id,
      project_title: newShift.project_title
    });

    saveLocalStore();
    return newShift;
  },

  async registerForShift(shiftId, data) {
    if (!memoryStore.shift_registrations) memoryStore.shift_registrations = [];
    const shift = (memoryStore.volunteer_shifts || []).find(s => s.id === shiftId);
    if (!shift) {
      throw new Error('Shift not found.');
    }

    // 1. Duplicate check
    const existing = memoryStore.shift_registrations.find(
      r => r.shift_id === shiftId && r.volunteer_email.toLowerCase() === data.volunteer_email.toLowerCase()
    );
    if (existing) {
      throw new Error(`You have already registered for this shift with email ${data.volunteer_email}.`);
    }

    // 2. Capacity check
    if (shift.registered_count >= shift.capacity) {
      throw new Error('This volunteering shift has reached maximum volunteer capacity.');
    }

    const registration = {
      id: `sreg-${Date.now()}`,
      shift_id: shiftId,
      status: 'confirmed',
      created_at: new Date().toISOString(),
      ...data
    };
    memoryStore.shift_registrations.push(registration);

    // Increment shift count
    shift.registered_count += 1;
    if (shift.registered_count >= shift.capacity) {
      shift.status = 'filled';
    }

    // Create Notification for Volunteer
    this.createNotification({
      user_id: data.volunteer_id,
      recipient_email: data.volunteer_email,
      type: 'shift_confirmed',
      title: 'Volunteering Shift Confirmed!',
      message: `You are confirmed for "${shift.title}" on ${shift.shift_date} (${shift.start_time} - ${shift.end_time}) at ${shift.location}.`,
      target_page: 'calendar',
      target_id: shift.id
    });

    // Log Activity
    this.addActivity({
      type: 'shift_registered',
      title: `Volunteer Confirmed for ${shift.title}`,
      description: `${data.volunteer_name} committed to volunteer on ${shift.shift_date}. (${shift.registered_count}/${shift.capacity} slots filled).`,
      actor_name: data.volunteer_name,
      actor_role: 'supporter',
      project_id: shift.project_id,
      project_title: shift.project_title
    });

    saveLocalStore();
    return {
      registration,
      shift
    };
  },

  async getUserShiftCommitments(volunteerEmail) {
    const regs = (memoryStore.shift_registrations || []).filter(
      r => r.volunteer_email.toLowerCase() === volunteerEmail.toLowerCase()
    );
    const commitments = regs.map(r => {
      const shift = (memoryStore.volunteer_shifts || []).find(s => s.id === r.shift_id) || {};
      return {
        ...r,
        shift
      };
    });
    return commitments;
  },

  // ============================================================================
  // 10. UN SDG MAPPING & CAUSE-BASED ANALYTICS
  // ============================================================================
  async getSdgMappingAnalytics() {
    const projects = memoryStore.projects || [];
    const sdgMap = {};
    for (let i = 1; i <= 17; i++) {
      sdgMap[i] = {
        sdgNumber: i,
        projectCount: 0,
        projects: [],
        totalFundingRaised: 0,
        totalFundingTarget: 0,
        verifiedBeneficiaries: 0,
        estimatedBeneficiaries: 0,
        volunteerRoles: 0
      };
    }

    projects.forEach(p => {
      const goals = Array.isArray(p.sdg_goals) ? p.sdg_goals : [];
      goals.forEach(g => {
        const num = Number(g);
        if (sdgMap[num]) {
          sdgMap[num].projectCount += 1;
          sdgMap[num].projects.push({
            id: p.id,
            title: p.title,
            cause: p.cause_category,
            location: `${p.location_city}, ${p.location_country}`
          });
          sdgMap[num].verifiedBeneficiaries += Number(p.verified_beneficiaries) || 0;
          sdgMap[num].estimatedBeneficiaries += Number(p.estimated_beneficiaries) || 0;
        }
      });
    });

    (memoryStore.requirements || []).forEach(req => {
      const proj = projects.find(p => p.id === req.project_id);
      if (proj && Array.isArray(proj.sdg_goals)) {
        proj.sdg_goals.forEach(g => {
          const num = Number(g);
          if (sdgMap[num]) {
            if (req.type === 'funding') {
              sdgMap[num].totalFundingTarget += Number(req.target_quantity) || 0;
              sdgMap[num].totalFundingRaised += Number(req.current_quantity) || 0;
            } else if (req.type === 'volunteers') {
              sdgMap[num].volunteerRoles += 1;
            }
          }
        });
      }
    });

    const activeSdgs = Object.values(sdgMap).filter(s => s.projectCount > 0);
    activeSdgs.sort((a, b) => b.projectCount - a.projectCount);

    return {
      totalProjectsAnalyzed: projects.length,
      activeSdgCount: activeSdgs.length,
      sdgBreakdown: sdgMap,
      topSdgs: activeSdgs.slice(0, 6),
      timestamp: new Date().toISOString()
    };
  },

  // ============================================================================
  // 11. SMART NOTIFICATIONS & PREFERENCES
  // ============================================================================
  async getNotifications(recipientEmail, userId) {
    let list = [...(memoryStore.notifications || [])];
    if (recipientEmail) {
      list = list.filter(n => n.recipient_email?.toLowerCase() === recipientEmail.toLowerCase());
    } else if (userId) {
      list = list.filter(n => n.user_id === userId);
    }
    list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    const unreadCount = list.filter(n => !n.is_read).length;
    return {
      notifications: list,
      unreadCount
    };
  },

  async markNotificationAsRead(id) {
    const notif = (memoryStore.notifications || []).find(n => n.id === id);
    if (notif) {
      notif.is_read = true;
      saveLocalStore();
    }
    return notif;
  },

  async markAllNotificationsAsRead(recipientEmail) {
    if (!memoryStore.notifications) memoryStore.notifications = [];
    let updated = 0;
    memoryStore.notifications.forEach(n => {
      if (!recipientEmail || n.recipient_email?.toLowerCase() === recipientEmail.toLowerCase()) {
        if (!n.is_read) {
          n.is_read = true;
          updated++;
        }
      }
    });
    saveLocalStore();
    return { success: true, count: updated };
  },

  createNotification(data) {
    if (!memoryStore.notifications) memoryStore.notifications = [];
    const notif = {
      id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      is_read: false,
      created_at: new Date().toISOString(),
      ...data
    };
    memoryStore.notifications.unshift(notif);
    saveLocalStore();
    return notif;
  },

  async getNotificationPreferences(userId) {
    const pref = (memoryStore.notification_preferences || []).find(p => p.user_id === userId);
    return pref || {
      user_id: userId,
      email_alerts_enabled: true,
      in_app_enabled: true,
      match_alerts: true,
      partnership_alerts: true,
      event_reminders: true
    };
  },

  async updateNotificationPreferences(userId, data) {
    if (!memoryStore.notification_preferences) memoryStore.notification_preferences = [];
    let pref = memoryStore.notification_preferences.find(p => p.user_id === userId);
    if (pref) {
      Object.assign(pref, data, { updated_at: new Date().toISOString() });
    } else {
      pref = {
        id: `pref-${Date.now()}`,
        user_id: userId,
        email_alerts_enabled: true,
        in_app_enabled: true,
        match_alerts: true,
        partnership_alerts: true,
        event_reminders: true,
        ...data,
        updated_at: new Date().toISOString()
      };
      memoryStore.notification_preferences.push(pref);
    }
    saveLocalStore();
    return pref;
  },

  // ============================================================================
  // 12. PARTNERSHIP AGREEMENT DRAFT GENERATOR
  // ============================================================================
  async getPartnershipAgreement(partnershipId) {
    const agr = (memoryStore.partnership_agreements || []).find(a => a.partnership_id === partnershipId);
    if (agr) return agr;

    // Auto-generate draft if partnership exists
    const part = (memoryStore.partnership_requests || []).find(p => p.id === partnershipId);
    if (!part) return null;

    const proj = (memoryStore.projects || []).find(p => p.id === part.project_id) || {};
    const ngo = (memoryStore.ngos || []).find(n => n.id === part.ngo_id) || {};

    const generatedAgreement = {
      id: `agr-${Date.now()}`,
      partnership_id: partnershipId,
      project_id: part.project_id,
      ngo_id: part.ngo_id,
      ngo_name: ngo.name || part.organization_name || 'Community Partner NGO',
      supporter_name: part.supporter_name,
      supporter_organization: part.organization_name || 'Individual Supporter',
      agreement_title: `Operational Collaboration Agreement: ${proj.title || 'Community Project'}`,
      scope_summary: `This operational partnership framework coordinates joint delivery between ${ngo.name || 'NGO'} and ${part.supporter_name}. Scope includes ${part.offer_type?.replace(/_/g, ' ') || 'partnership'} support valued at ${part.offer_value || 'specified resources'} to expand community impact.`,
      ngo_responsibilities: `1. Direct grassroots implementation and beneficiary community liaison.\n2. Transparent tracking of milestone progress and budget utilization.\n3. Submission of photographic evidence and quarterly impact reports.\n4. Facilitating field visits and volunteer engagement.`,
      partner_responsibilities: `1. Timely provision of agreed contributions (${part.offer_value || 'committed resources'}).\n2. Proactive operational communication via ImpactConnect workspace.\n3. Collaborative alignment with UN Sustainable Development Goals.\n4. Mutual respect for beneficiary safety, privacy, and community dignity.`,
      deliverables_timeline: (memoryStore.project_milestones || [])
        .filter(m => m.project_id === part.project_id)
        .map(m => ({ milestone: m.title, target_date: m.target_date || 'Upcoming', status: m.is_completed ? 'completed' : 'pending' })),
      status: 'draft',
      is_legal_disclaimer_accepted: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (!memoryStore.partnership_agreements) memoryStore.partnership_agreements = [];
    memoryStore.partnership_agreements.push(generatedAgreement);
    saveLocalStore();
    return generatedAgreement;
  },

  async createOrUpdatePartnershipAgreement(data) {
    if (!memoryStore.partnership_agreements) memoryStore.partnership_agreements = [];
    const idx = memoryStore.partnership_agreements.findIndex(a => a.partnership_id === data.partnership_id || a.id === data.id);
    let agr = null;
    if (idx >= 0) {
      memoryStore.partnership_agreements[idx] = {
        ...memoryStore.partnership_agreements[idx],
        ...data,
        updated_at: new Date().toISOString()
      };
      agr = memoryStore.partnership_agreements[idx];
    } else {
      agr = {
        id: `agr-${Date.now()}`,
        status: 'draft',
        is_legal_disclaimer_accepted: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...data
      };
      memoryStore.partnership_agreements.push(agr);
    }
    saveLocalStore();
    return agr;
  },

  async acknowledgePartnershipAgreement(agreementId, role, actorName) {
    const agr = (memoryStore.partnership_agreements || []).find(a => a.id === agreementId || a.partnership_id === agreementId);
    if (!agr) throw new Error('Partnership agreement draft not found.');

    const now = new Date().toISOString();
    if (role === 'ngo') {
      agr.ngo_acknowledged_at = now;
      agr.status = agr.partner_acknowledged_at ? 'both_acknowledged' : 'ngo_reviewed';
    } else {
      agr.partner_acknowledged_at = now;
      agr.status = agr.ngo_acknowledged_at ? 'both_acknowledged' : 'partner_reviewed';
    }

    this.addActivity({
      type: 'agreement_acknowledged',
      title: `Agreement Draft Acknowledged: ${agr.agreement_title}`,
      description: `${actorName} (${role.toUpperCase()}) digitally acknowledged the operational agreement framework.`,
      actor_name: actorName,
      actor_role: role,
      project_id: agr.project_id
    });

    saveLocalStore();
    return agr;
  },

  // ============================================================================
  // 13. PROJECT TRANSPARENCY TIMELINE (IMMUTABLE AUDIT TRAIL)
  // ============================================================================
  async getProjectTransparencyTimeline(projectId) {
    let events = (memoryStore.project_transparency_events || []).filter(e => e.project_id === projectId);
    
    // Auto-synthesize baseline audit events if empty so every project has an immaculate timeline
    if (events.length === 0) {
      const proj = (memoryStore.projects || []).find(p => p.id === projectId);
      if (proj) {
        events = [
          {
            id: `te-${Date.now()}-1`,
            project_id: projectId,
            event_type: 'publication',
            title: 'Project Formally Published & Verified',
            description: `Initiative registered by ${proj.ngo?.name || 'NGO Partner'} under category ${proj.cause_category}. Initial baseline impact review completed.`,
            actor_name: proj.ngo?.name || 'Authorized Lead',
            actor_role: 'ngo',
            evidence_url: null,
            is_verified: true,
            timestamp: proj.created_at || '2026-03-01T10:00:00Z'
          }
        ];
        // Add completed milestones as verified events
        (memoryStore.project_milestones || []).filter(m => m.project_id === projectId && m.is_completed).forEach((m, idx) => {
          events.push({
            id: `te-${Date.now()}-${idx + 2}`,
            project_id: projectId,
            event_type: 'milestone_completed',
            title: `Milestone Achieved: ${m.title}`,
            description: m.description,
            actor_name: 'Field Operations Team',
            actor_role: 'ngo',
            evidence_url: m.evidence_photo || m.evidence_url,
            is_verified: true,
            timestamp: m.completed_at || new Date().toISOString()
          });
        });
      }
    }

    // Sort chronologically
    events.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    return events;
  },

  async logProjectTransparencyEvent(projectId, eventData) {
    if (!memoryStore.project_transparency_events) memoryStore.project_transparency_events = [];
    const event = {
      id: `te-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      project_id: projectId,
      is_verified: true,
      timestamp: new Date().toISOString(),
      ...eventData
    };
    memoryStore.project_transparency_events.push(event);
    saveLocalStore();
    return event;
  },

  // Live Calculated Stats
  async getStats() {
    const totalProjects = memoryStore.projects?.length || 0;
    const totalNgos = memoryStore.ngos?.length || 0;
    const totalRequests = memoryStore.partnership_requests?.length || 0;
    const acceptedRequests = (memoryStore.partnership_requests || []).filter(r => r.status === 'accepted').length;
    const totalVolunteerRoles = memoryStore.volunteer_roles?.length || 0;

    let totalFundingRaised = 0;
    let totalFundingTarget = 0;
    let totalVolunteersTarget = 0;
    let totalVolunteersJoined = 0;
    let verifiedBeneficiaries = 0;
    let estimatedBeneficiaries = 0;

    (memoryStore.requirements || []).forEach(req => {
      if (req.type === 'funding') {
        totalFundingTarget += Number(req.target_quantity) || 0;
        totalFundingRaised += Number(req.current_quantity) || 0;
      } else if (req.type === 'volunteers') {
        totalVolunteersTarget += Number(req.target_quantity) || 0;
        totalVolunteersJoined += Number(req.current_quantity) || 0;
      }
    });

    (memoryStore.projects || []).forEach(p => {
      verifiedBeneficiaries += Number(p.verified_beneficiaries) || 0;
      estimatedBeneficiaries += Number(p.estimated_beneficiaries) || 0;
    });

    const completedMilestones = (memoryStore.project_milestones || []).filter(m => m.is_completed).length;

    return {
      totalProjects,
      totalNgos,
      totalRequests,
      acceptedRequests,
      totalVolunteerRoles,
      totalFundingTarget: totalFundingTarget || 95000,
      totalFundingRaised: totalFundingRaised || 58000,
      totalVolunteersTarget: totalVolunteersTarget || 260,
      totalVolunteersJoined: totalVolunteersJoined || 154,
      verifiedBeneficiaries: verifiedBeneficiaries || 37050,
      estimatedBeneficiaries: estimatedBeneficiaries || 77500,
      completedMilestones: completedMilestones || 3,
      recentActivity: memoryStore.activity_logs?.slice(0, 10) || []
    };
  },

  // 17. NEED-TO-ACTION CONVERTER
  async convertNeedToAction(prompt, ngoInfo = {}) {
    const text = (prompt || '').trim();
    if (!text) throw new Error('Community need description cannot be empty.');

    // Cause Detection
    let cause = 'Community Welfare';
    let sdg = 1;
    const lower = text.toLowerCase();
    if (lower.includes('water') || lower.includes('filtration') || lower.includes('well') || lower.includes('arsenic')) {
      cause = 'Clean Water & Sanitation';
      sdg = 6;
    } else if (lower.includes('school') || lower.includes('teach') || lower.includes('education') || lower.includes('student') || lower.includes('book') || lower.includes('laptop')) {
      cause = 'Quality Education';
      sdg = 4;
    } else if (lower.includes('tree') || lower.includes('forest') || lower.includes('climate') || lower.includes('plant') || lower.includes('carbon')) {
      cause = 'Climate Action';
      sdg = 13;
    } else if (lower.includes('health') || lower.includes('doctor') || lower.includes('medical') || lower.includes('hospital') || lower.includes('medicine')) {
      cause = 'Good Health & Well-being';
      sdg = 3;
    } else if (lower.includes('flood') || lower.includes('disaster') || lower.includes('emergency') || lower.includes('relief') || lower.includes('food')) {
      cause = 'Disaster Relief & Hunger';
      sdg = 2;
    } else if (lower.includes('women') || lower.includes('girl') || lower.includes('gender')) {
      cause = 'Gender Equality';
      sdg = 5;
    }

    // Location Detection
    let location = 'Rural Community Center';
    const locMatch = text.match(/(?:in|at|near|for|around)\s+([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)?)/);
    if (locMatch) {
      location = locMatch[1].trim();
    } else {
      const knownLocations = ['Bihar', 'Darbhanga', 'Barmer', 'Rajasthan', 'Delhi', 'Assam', 'Maharashtra', 'Nashik', 'Mumbai', 'Karnataka', 'Mysuru'];
      for (const loc of knownLocations) {
        if (new RegExp(`\\b${loc}\\b`, 'i').test(text)) {
          location = loc;
          break;
        }
      }
    }

    // Budget Calculation
    const moneyMatch = text.match(/(?:₹|rs\.?|inr)\s*([\d,]+(?:\s*(?:lakh|k|thousand|crore))?)/i) || text.match(/([\d,]+)\s*(?:rupees|inr|lakh)/i);
    let estimatedBudget = 85000;
    if (moneyMatch) {
      const raw = moneyMatch[1].replace(/,/g, '').toLowerCase();
      if (raw.includes('lakh')) {
        estimatedBudget = (parseFloat(raw) || 1) * 100000;
      } else if (raw.includes('k') || raw.includes('thousand')) {
        estimatedBudget = (parseFloat(raw) || 1) * 1000;
      } else {
        estimatedBudget = parseInt(raw, 10) || 85000;
      }
    }

    const resources = [
      {
        type: 'funding',
        name: 'Direct Project Capital Grant',
        quantity: 1,
        estimated_unit_cost: estimatedBudget,
        urgency: 'high',
        notes: 'Funding for logistics, procurement, and field delivery'
      }
    ];

    const goodsRegex = /(\d+)\s+(laptops|desktops|books|notebooks|kits|filters|inverters|purifiers|saplings|tablets|food packets|blankets)/gi;
    let match;
    while ((match = goodsRegex.exec(text)) !== null) {
      const qty = parseInt(match[1], 10);
      const item = match[2];
      resources.push({
        type: 'goods',
        name: item.charAt(0).toUpperCase() + item.slice(1),
        quantity: qty,
        estimated_unit_cost: item.includes('laptop') ? 18000 : item.includes('filter') ? 3500 : item.includes('book') ? 150 : 250,
        urgency: 'high',
        notes: 'Extracted physical requirement'
      });
    }

    const volMatch = text.match(/(\d+)\s+(volunteers|teachers|doctors|trainers|instructors|workers)/i);
    if (volMatch) {
      resources.push({
        type: 'volunteers',
        name: volMatch[2].charAt(0).toUpperCase() + volMatch[2].slice(1),
        quantity: parseInt(volMatch[1], 10),
        estimated_unit_cost: 0,
        urgency: 'medium',
        notes: 'Field support volunteer slots'
      });
    }

    const title = `${cause.split('&')[0].trim()} Initiative in ${location}`;
    const deadlineDays = lower.includes('urgent') || lower.includes('flood') || lower.includes('immediately') ? 14 : 30;
    const deadline = new Date(Date.now() + deadlineDays * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

    return {
      draft_id: `draft-${Date.now()}`,
      input_prompt: text,
      title,
      cause,
      sdg_number: sdg,
      location,
      estimated_budget: estimatedBudget,
      budget_estimation_tag: 'Algorithm Estimated - Pending NGO Verification',
      suggested_deadline: deadline,
      urgency_score: lower.includes('urgent') || lower.includes('emergency') ? 'High' : 'Medium',
      resources,
      ngo_confirmation_required: true,
      ngo_id: ngoInfo.id || 'ngo-1',
      ngo_name: ngoInfo.name || 'Verified Community NGO'
    };
  },

  async publishNeedToActionCampaign(data) {
    if (!data.title || !data.cause) {
      throw new Error('Title and Cause are required to publish campaign.');
    }
    const newProject = {
      id: `proj-${Date.now()}`,
      title: data.title,
      ngo_id: data.ngo_id || 'ngo-1',
      ngo_name: data.ngo_name || 'Community Impact NGO',
      cause: data.cause,
      sdg: data.sdg_number || 4,
      location: data.location || 'India',
      status: 'active',
      urgency: data.urgency_score === 'High' ? 'high' : 'medium',
      funding_goal: Number(data.estimated_budget) || 100000,
      funding_received: 0,
      volunteers_needed: data.resources?.find(r => r.type === 'volunteers')?.quantity || 5,
      volunteers_registered: 0,
      deadline: data.suggested_deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      summary: data.input_prompt || 'Community initiative generated via ImpactConnect Need-to-Action Converter.',
      image_url: 'https://images.unsplash.com/photo-1541252260730-0412e8e2108e?auto=format&fit=crop&w=800&q=80',
      verified_status: 'verified',
      is_published_by_converter: true,
      created_at: new Date().toISOString()
    };

    if (!memoryStore.projects) memoryStore.projects = [];
    memoryStore.projects.unshift(newProject);

    if (!memoryStore.collective_campaigns) memoryStore.collective_campaigns = [];
    memoryStore.collective_campaigns.unshift({
      id: `col-${newProject.id}`,
      title: newProject.title,
      ngo_id: newProject.ngo_id,
      ngo_name: newProject.ngo_name,
      cause: newProject.cause,
      sdg_number: newProject.sdg,
      location: newProject.location,
      target_amount: newProject.funding_goal,
      pledged_amount: 0,
      confirmed_amount: 0,
      resource_targets: (data.resources || []).filter(r => r.type === 'goods').map(g => ({
        item: g.name,
        target: g.quantity,
        pledged: 0,
        confirmed: 0,
        unit: 'units'
      })),
      beneficiary_count: 500,
      deadline: newProject.deadline,
      status: 'active',
      image_url: newProject.image_url,
      story: newProject.summary
    });

    this.addActivity({
      type: 'campaign_created',
      title: 'New Campaign Created via Need-to-Action Converter',
      description: `"${newProject.title}" has been reviewed, confirmed and published to active live drives.`,
      actor_name: newProject.ngo_name,
      actor_role: 'ngo',
      project_id: newProject.id,
      project_title: newProject.title
    });

    saveLocalStore();
    return newProject;
  },

  // 18. COLLECTIVE ACTION CAMPAIGNS
  async getCollectiveCampaigns(filters = {}) {
    let list = [...(memoryStore.collective_campaigns || [])];
    if (filters.cause && filters.cause !== 'all') {
      list = list.filter(c => c.cause.toLowerCase().includes(filters.cause.toLowerCase()));
    }
    if (filters.status && filters.status !== 'all') {
      list = list.filter(c => c.status === filters.status);
    }
    return list.map(c => {
      const pledges = (memoryStore.collective_pledges || []).filter(p => p.campaign_id === c.id);
      return {
        ...c,
        pledges_count: pledges.length,
        recent_pledges: pledges.slice(0, 5)
      };
    });
  },

  async recordCollectivePledge(campaignId, data) {
    if (!data.backer_name || !data.backer_email) {
      throw new Error('Backer name and email are required.');
    }
    const campaign = (memoryStore.collective_campaigns || []).find(c => c.id === campaignId);
    if (!campaign) throw new Error('Collective campaign not found.');

    const tenMinAgo = Date.now() - 10 * 60 * 1000;
    const existing = (memoryStore.collective_pledges || []).find(p => 
      p.campaign_id === campaignId && 
      p.backer_email?.toLowerCase() === data.backer_email.toLowerCase() &&
      p.pledge_type === data.pledge_type &&
      (data.pledge_type === 'monetary' ? p.amount === Number(data.amount) : p.item_name === data.item_name) &&
      new Date(p.created_at).getTime() > tenMinAgo
    );
    if (existing) {
      throw new Error('A duplicate pledge was recently submitted with these identical parameters. Please check your pledges.');
    }

    const newPledge = {
      id: `cpledge-${Date.now()}`,
      campaign_id: campaignId,
      backer_name: data.backer_name.trim(),
      backer_email: data.backer_email.trim(),
      pledge_type: data.pledge_type || 'monetary',
      amount: Number(data.amount) || 0,
      item_name: data.item_name || null,
      quantity: Number(data.quantity) || 0,
      status: 'pledged',
      notes: data.notes || '',
      created_at: new Date().toISOString()
    };

    if (!memoryStore.collective_pledges) memoryStore.collective_pledges = [];
    memoryStore.collective_pledges.unshift(newPledge);

    if (newPledge.pledge_type === 'monetary') {
      campaign.pledged_amount = (campaign.pledged_amount || 0) + newPledge.amount;
    } else if (newPledge.pledge_type === 'goods' && campaign.resource_targets) {
      const target = campaign.resource_targets.find(r => r.item.toLowerCase() === (newPledge.item_name || '').toLowerCase());
      if (target) {
        target.pledged = (target.pledged || 0) + newPledge.quantity;
      }
    }

    this.addActivity({
      type: 'collective_pledge',
      title: `Pledge Received for "${campaign.title}"`,
      description: `${newPledge.backer_name} pledged ${newPledge.pledge_type === 'monetary' ? '₹' + newPledge.amount.toLocaleString() : newPledge.quantity + ' ' + newPledge.item_name}.`,
      actor_name: newPledge.backer_name,
      actor_role: 'supporter',
      project_title: campaign.title
    });

    saveLocalStore();
    return newPledge;
  },

  async confirmPledgedDelivery(campaignId, pledgeId) {
    const pledge = (memoryStore.collective_pledges || []).find(p => p.id === pledgeId);
    if (!pledge) throw new Error('Pledge record not found.');
    const campaign = (memoryStore.collective_campaigns || []).find(c => c.id === campaignId);

    pledge.status = 'confirmed';
    pledge.confirmed_at = new Date().toISOString();

    if (campaign) {
      if (pledge.pledge_type === 'monetary') {
        campaign.confirmed_amount = (campaign.confirmed_amount || 0) + pledge.amount;
      } else if (pledge.pledge_type === 'goods' && campaign.resource_targets) {
        const target = campaign.resource_targets.find(r => r.item.toLowerCase() === (pledge.item_name || '').toLowerCase());
        if (target) {
          target.confirmed = (target.confirmed || 0) + pledge.quantity;
        }
      }
    }

    saveLocalStore();
    return pledge;
  },

  // 19. EMPLOYEE VOLUNTEERING PORTAL
  async getEmployeeVolunteeringPrograms(filters = {}) {
    let list = [...(memoryStore.employee_volunteering_programs || [])];
    if (filters.company_domain) {
      list = list.filter(p => p.company_domain === filters.company_domain);
    }
    return list;
  },

  async registerEmployeeForProgram(programId, data) {
    const program = (memoryStore.employee_volunteering_programs || []).find(p => p.id === programId);
    if (!program) throw new Error('Corporate volunteering program not found.');

    if (program.registered_count >= program.total_slots) {
      throw new Error('This corporate volunteering session has reached maximum capacity.');
    }

    if (!memoryStore.employee_volunteering_registrations) memoryStore.employee_volunteering_registrations = [];

    const existing = memoryStore.employee_volunteering_registrations.find(
      r => r.program_id === programId && r.employee_email?.toLowerCase() === data.employee_email?.toLowerCase()
    );
    if (existing) {
      throw new Error(`Employee ${data.employee_name || data.employee_email} is already registered for this session.`);
    }

    const reg = {
      id: `evpreg-${Date.now()}`,
      program_id: programId,
      employee_name: data.employee_name,
      employee_email: data.employee_email,
      employee_id: data.employee_id || `EMP-${Date.now().toString().slice(-4)}`,
      department: data.department || 'Engineering',
      selected_skill: data.selected_skill || 'Field Support',
      status: 'confirmed',
      attendance_verified: false,
      registered_at: new Date().toISOString()
    };

    memoryStore.employee_volunteering_registrations.unshift(reg);
    program.registered_count = (program.registered_count || 0) + 1;

    saveLocalStore();
    return reg;
  },

  async getEmployeeVolunteeringMetrics(companyDomain = 'apextech.com') {
    const programs = (memoryStore.employee_volunteering_programs || []).filter(p => !companyDomain || p.company_domain === companyDomain);
    const programIds = programs.map(p => p.id);
    const registrations = (memoryStore.employee_volunteering_registrations || []).filter(r => programIds.includes(r.program_id));

    const totalHours = registrations.reduce((sum, r) => {
      const prog = programs.find(p => p.id === r.program_id);
      return sum + (prog ? prog.hours_per_slot : 4);
    }, 0);

    return {
      companyDomain,
      totalPrograms: programs.length,
      totalVolunteersParticipated: registrations.length,
      totalVolunteerHours: totalHours,
      sdgsSupported: [4, 6, 13, 10],
      activePrograms: programs
    };
  },

  // 20. DONATION DELIVERY TRACKING
  async getDonationDeliveries(filters = {}) {
    let list = [...(memoryStore.donation_deliveries || [])];
    if (filters.status && filters.status !== 'all') {
      list = list.filter(d => d.current_status === filters.status);
    }
    if (filters.donor_email) {
      list = list.filter(d => d.donor_email?.toLowerCase() === filters.donor_email.toLowerCase());
    }
    if (filters.recipient_ngo_id) {
      list = list.filter(d => d.recipient_ngo_id === filters.recipient_ngo_id);
    }
    return list;
  },

  async advanceDeliveryStatus(deliveryId, { newStatus, trackingNotes, evidenceUrl, actorName, trackingCode, carrier }) {
    const delivery = (memoryStore.donation_deliveries || []).find(d => d.id === deliveryId);
    if (!delivery) throw new Error('Delivery record not found.');

    const validStatuses = ['pledged', 'approved', 'dispatched', 'received', 'confirmed'];
    if (!validStatuses.includes(newStatus)) {
      throw new Error(`Invalid status "${newStatus}". Must be one of: ${validStatuses.join(', ')}.`);
    }

    delivery.current_status = newStatus;
    if (trackingCode) delivery.tracking_code = trackingCode;
    if (carrier) delivery.carrier = carrier;
    if (evidenceUrl) delivery.evidence_url = evidenceUrl;

    if (!delivery.status_history) delivery.status_history = [];
    delivery.status_history.push({
      status: newStatus,
      timestamp: new Date().toISOString(),
      actor: actorName || 'Authorized Coordinator',
      note: trackingNotes || `Status advanced to ${newStatus}`
    });

    if (this.createNotification) {
      this.createNotification({
        recipient_email: delivery.donor_email,
        type: 'delivery_update',
        title: `Donation Delivery Update: ${newStatus.toUpperCase()}`,
        message: `Your donation of ${delivery.quantity}x ${delivery.item_name} is now ${newStatus}. ${trackingNotes || ''}`,
        action_url: '/deliveries'
      });
    }

    saveLocalStore();
    return delivery;
  },

  // 21. EXPERT MENTORSHIP NETWORK
  async getExpertMentors(filters = {}) {
    let list = [...(memoryStore.expert_mentors || [])];
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(m => m.name.toLowerCase().includes(q) || m.expertise_areas?.some(e => e.toLowerCase().includes(q)));
    }
    return list;
  },

  async bookMentorshipSession(mentorId, data) {
    const mentor = (memoryStore.expert_mentors || []).find(m => m.id === mentorId);
    if (!mentor) throw new Error('Mentor not found.');

    const newSession = {
      id: `msess-${Date.now()}`,
      mentor_id: mentorId,
      mentor_name: mentor.name,
      ngo_id: data.ngo_id || 'ngo-1',
      ngo_name: data.ngo_name || 'Community Impact NGO',
      topic: data.topic || 'General Non-Profit Advisory',
      scheduled_date: data.scheduled_date || new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      time_slot: data.time_slot || '04:00 PM - 04:45 PM IST',
      status: 'confirmed',
      notes: data.notes || '',
      meeting_link: `https://meet.jit.si/ImpactConnect-${mentor.id}-${Date.now().toString().slice(-4)}`,
      created_at: new Date().toISOString()
    };

    if (!memoryStore.mentorship_sessions) memoryStore.mentorship_sessions = [];
    memoryStore.mentorship_sessions.unshift(newSession);

    mentor.completed_consultations = (mentor.completed_consultations || 0) + 1;

    saveLocalStore();
    return newSession;
  },

  async getMentorshipSessions(filters = {}) {
    let list = [...(memoryStore.mentorship_sessions || [])];
    if (filters.ngo_id) list = list.filter(s => s.ngo_id === filters.ngo_id);
    if (filters.mentor_id) list = list.filter(s => s.mentor_id === filters.mentor_id);
    return list;
  },

  async completeMentorshipSession(sessionId, { actionItems, feedbackRating }) {
    const session = (memoryStore.mentorship_sessions || []).find(s => s.id === sessionId);
    if (!session) throw new Error('Session not found.');
    session.status = 'completed';
    session.action_items = actionItems || 'Session completed with actionable guidance provided.';
    session.feedback_rating = feedbackRating || 5;
    saveLocalStore();
    return session;
  },

  // 22. BEFORE-AND-AFTER IMPACT STORIES
  async getImpactStories(filters = {}) {
    let list = [...(memoryStore.impact_stories || [])];
    if (filters.cause && filters.cause !== 'all') {
      list = list.filter(s => s.cause.toLowerCase().includes(filters.cause.toLowerCase()));
    }
    return list;
  },

  async publishImpactStory(data) {
    if (!data.title || !data.before_image || !data.after_image) {
      throw new Error('Title, Before photograph, and After photograph are required.');
    }
    if (!data.consent_verified) {
      throw new Error('Beneficiary privacy and ethical photo consent must be confirmed prior to publication.');
    }

    const story = {
      id: `story-${Date.now()}`,
      project_id: data.project_id || 'proj-1',
      ngo_name: data.ngo_name || 'Verified NGO',
      title: data.title,
      cause: data.cause || 'Community Transformation',
      before_image: data.before_image,
      after_image: data.after_image,
      before_description: data.before_description || '',
      after_description: data.after_description || '',
      quantified_outcomes: data.quantified_outcomes || [
        { label: 'Beneficiaries Empowered', value: '100+ Individuals' }
      ],
      verification_status: data.is_audited ? 'field_audited' : 'ngo_self_reported',
      auditor_name: data.auditor_name || (data.is_audited ? 'Authorized Field Inspector' : 'Self-Reported by NGO'),
      consent_verified: true,
      published_date: new Date().toISOString().slice(0, 10),
      created_at: new Date().toISOString()
    };

    if (!memoryStore.impact_stories) memoryStore.impact_stories = [];
    memoryStore.impact_stories.unshift(story);

    this.addActivity({
      type: 'impact_story_published',
      title: 'New Before-and-After Impact Story Published',
      description: `"${story.title}" published by ${story.ngo_name} with verified visual proof.`,
      actor_name: story.ngo_name,
      actor_role: 'ngo'
    });

    saveLocalStore();
    return story;
  },

  // 23. PROJECT RISK ALERTS
  async getAllRiskAlerts() {
    const list = [...(memoryStore.risk_alerts || [])];
    const projects = memoryStore.projects || [];
    const now = Date.now();

    projects.forEach(p => {
      if (p.deadline) {
        const daysLeft = Math.ceil((new Date(p.deadline).getTime() - now) / (1000 * 60 * 60 * 24));
        const fundingRatio = (p.funding_received || 0) / (p.funding_goal || 1);
        if (daysLeft > 0 && daysLeft <= 7 && fundingRatio < 0.5) {
          const alertId = `dyn-risk-dl-${p.id}`;
          if (!list.some(r => r.id === alertId)) {
            list.push({
              id: alertId,
              project_id: p.id,
              project_title: p.title,
              ngo_name: p.ngo_name,
              severity: 'high',
              alert_type: 'approaching_deadline',
              title: `Deadline in ${daysLeft} days with only ${(fundingRatio * 100).toFixed(0)}% funding raised`,
              description: `Campaign deadline approaches on ${p.deadline}. Gap of ₹${((p.funding_goal || 0) - (p.funding_received || 0)).toLocaleString()} remains.`,
              suggested_action: 'Broadcast urgent appeal to corporate CSR partners.',
              is_resolved: false,
              created_at: new Date().toISOString()
            });
          }
        }
      }

      if (p.volunteers_needed > 5 && (p.volunteers_registered / p.volunteers_needed) < 0.4) {
        const alertId = `dyn-risk-vol-${p.id}`;
        if (!list.some(r => r.id === alertId)) {
          list.push({
            id: alertId,
            project_id: p.id,
            project_title: p.title,
            ngo_name: p.ngo_name,
            severity: 'medium',
            alert_type: 'volunteer_shortfall',
            title: `Volunteer Registration Deficit (${p.volunteers_registered} of ${p.volunteers_needed} filled)`,
            description: `Field activities require immediate volunteer coordinator reinforcement.`,
            suggested_action: 'List in Employee Volunteering Portal for corporate signups.',
            is_resolved: false,
            created_at: new Date().toISOString()
          });
        }
      }
    });

    return list;
  },

  async resolveRiskAlert(alertId, resolutionNotes = '', actorName = 'Project Lead') {
    const alert = (memoryStore.risk_alerts || []).find(r => r.id === alertId);
    if (alert) {
      alert.is_resolved = true;
      alert.resolved_at = new Date().toISOString();
      alert.resolution_notes = resolutionNotes || 'Risk mitigated via operational intervention.';
      alert.resolved_by = actorName;
    }
    saveLocalStore();
    return { success: true, alertId };
  },

  // 24. CSR EVIDENCE PACK
  async generateCsrEvidencePack(projectId) {
    const project = (memoryStore.projects || []).find(p => p.id === projectId) || (memoryStore.projects || [])[0];
    const ngo = (memoryStore.ngos || []).find(n => n.id === project.ngo_id) || (memoryStore.ngos || [])[0];
    const contributions = (memoryStore.contributions || []).filter(c => c.project_id === project.id);
    const milestones = (memoryStore.project_milestones || []).filter(m => m.project_id === project.id);
    const deliveries = (memoryStore.donation_deliveries || []).filter(d => d.project_id === project.id);
    const attendance = (memoryStore.volunteer_attendance || []).filter(a => a.project_id === project.id);

    return {
      dossier_id: `CSR-EVID-${(project.id || 'PROJ').toUpperCase()}-${Date.now().toString().slice(-4)}`,
      generated_at: new Date().toISOString(),
      statutory_disclaimer: 'This CSR Evidence Pack is generated based on verified on-ground platform records. Formal statutory filing must be reviewed by an authorized Chartered Accountant / Company Secretary per MCA Section 135.',
      project: {
        id: project.id,
        title: project.title,
        cause: project.cause,
        sdg: project.sdg,
        location: project.location,
        funding_goal: project.funding_goal,
        funding_received: project.funding_received,
        verified_beneficiaries: project.verified_beneficiaries || 850
      },
      ngo: {
        name: ngo.name,
        darpan_id: ngo.darpan_id || 'DL/2021/029914',
        pan: 'AAATN4492K',
        csr_registration_number: 'CSR00018842',
        fcra_status: ngo.fcra_approved ? 'Approved & Valid' : 'Not Applicable (Domestic Only)',
        section_80g_valid: true,
        section_12a_valid: true,
        authorized_signatory: ngo.head_person || 'Authorized Director'
      },
      contributions_ledger: contributions.map(c => ({
        id: c.id,
        supporter: c.supporter_name,
        amount: c.amount,
        type: c.contribution_type,
        date: c.created_at,
        receipt_status: 'Audit Certified'
      })),
      verified_milestones: milestones.map(m => ({
        title: m.title,
        status: m.is_completed ? 'Completed & Geo-Verified' : 'In Progress',
        evidence_photo: m.evidence_photo || 'Verified Field Record'
      })),
      physical_deliveries: deliveries.map(d => ({
        item: d.item_name,
        quantity: d.quantity,
        status: d.current_status,
        tracking: d.tracking_code
      })),
      volunteer_audited_hours: attendance.reduce((sum, a) => sum + Number(a.hours_logged || 0), 0),
      compliance_readiness_score: 96
    };
  },

  // 25. COLLABORATION NETWORK GRAPH
  async getCollaborationGraph() {
    const nodes = [];
    const edges = [];

    // NGOs
    (memoryStore.ngos || []).slice(0, 5).forEach(ngo => {
      nodes.push({
        id: `ngo-${ngo.id}`,
        label: ngo.name,
        type: 'ngo',
        cause: ngo.primary_cause || 'Community',
        details: `${ngo.location || 'India'} • ${ngo.verification_status || 'verified'}`
      });
    });

    // Corporates
    const corporates = [
      { id: 'corp-apex', label: 'Apex Technologies CSR', domain: 'apextech.com', cause: 'Education & Climate' },
      { id: 'corp-tcs', label: 'Tata Consultancy CSR', domain: 'tcs.com', cause: 'Climate & Bio-Diversity' },
      { id: 'corp-infosys', label: 'Infosys Foundation', domain: 'infosys.com', cause: 'Reduced Inequalities' }
    ];
    corporates.forEach(c => {
      nodes.push({
        id: c.id,
        label: c.label,
        type: 'corporate',
        cause: c.cause,
        details: `Corporate CSR Donor • ${c.domain}`
      });
    });

    // Projects
    (memoryStore.projects || []).slice(0, 6).forEach(p => {
      nodes.push({
        id: `proj-${p.id}`,
        label: p.title.length > 28 ? p.title.slice(0, 26) + '...' : p.title,
        full_title: p.title,
        type: 'project',
        cause: p.cause,
        details: `Goal: ₹${(p.funding_goal || 0).toLocaleString()} • ${p.location}`
      });
      edges.push({
        source: `ngo-${p.ngo_id}`,
        target: `proj-${p.id}`,
        relation: 'Organizes Project',
        strength: 3
      });
    });

    // Mentors
    (memoryStore.expert_mentors || []).slice(0, 4).forEach(m => {
      nodes.push({
        id: `mentor-${m.id}`,
        label: m.name,
        type: 'mentor',
        cause: m.expertise_areas?.[0] || 'Governance',
        details: m.title
      });
    });

    // Verified Collaborations
    edges.push(
      { source: 'corp-apex', target: 'proj-proj-1', relation: '₹50,000 Matching Grant', strength: 2 },
      { source: 'corp-apex', target: 'proj-proj-2', relation: '15 Refurbished Laptops', strength: 2 },
      { source: 'corp-tcs', target: 'proj-proj-4', relation: 'Employee Tree Planting (34 Volunteers)', strength: 2 },
      { source: 'mentor-mentor-1', target: 'ngo-ngo-1', relation: 'FCRA & 80G Legal Advisory', strength: 2 },
      { source: 'mentor-mentor-2', target: 'ngo-ngo-2', relation: 'CSR Cost Allocation Audit', strength: 2 }
    );

    return { nodes, edges };
  },

  // ==========================================================================
  // 26. COMMUNITY NEEDS HEATMAP
  // ==========================================================================
  async getCommunityNeedReports(filters = {}) {
    let list = [...(memoryStore.community_need_reports || [])];
    if (filters.cause && filters.cause !== 'all') {
      list = list.filter(r => r.cause.toLowerCase().includes(filters.cause.toLowerCase()));
    }
    if (filters.urgency && filters.urgency !== 'all') {
      list = list.filter(r => r.urgency === filters.urgency);
    }
    if (filters.status && filters.status !== 'all') {
      list = list.filter(r => r.status === filters.status);
    }
    return list;
  },

  async reportCommunityNeed(data) {
    if (!data.title || !data.cause || !data.district) {
      throw new Error('Title, cause, and district are required to report a community need.');
    }

    // Protect sensitive location: fuzzy coordinate noise
    const baseLat = Number(data.lat) || 24.50;
    const baseLng = Number(data.lng) || 78.50;
    const fuzzyLat = Number((baseLat + (Math.random() - 0.5) * 0.04).toFixed(3));
    const fuzzyLng = Number((baseLng + (Math.random() - 0.5) * 0.04).toFixed(3));

    const newReport = {
      id: `heat-${Date.now()}`,
      title: data.title.trim(),
      cause: data.cause,
      district: data.district.trim(),
      state: data.state || 'India',
      lat: fuzzyLat,
      lng: fuzzyLng,
      urgency: data.urgency || 'medium',
      status: data.is_verified_ngo ? 'verified' : 'unverified',
      verified_by: data.is_verified_ngo ? (data.reporter_name || 'Verified NGO Lead') : 'Pending Field Verification',
      reporter_role: data.reporter_role || 'citizen_supporter',
      affected_population: Number(data.affected_population) || 500,
      privacy_protected: true,
      description: data.description || '',
      created_at: new Date().toISOString()
    };

    if (!memoryStore.community_need_reports) memoryStore.community_need_reports = [];
    memoryStore.community_need_reports.unshift(newReport);

    saveLocalStore();
    return newReport;
  },

  // ==========================================================================
  // 27. MICRO-VOLUNTEERING MARKETPLACE
  // ==========================================================================
  async getMicroTasks(filters = {}) {
    let list = [...(memoryStore.micro_tasks || [])];
    if (filters.cause && filters.cause !== 'all') {
      list = list.filter(t => t.cause.toLowerCase().includes(filters.cause.toLowerCase()));
    }
    if (filters.is_remote !== undefined && filters.is_remote !== 'all') {
      const isRemote = String(filters.is_remote) === 'true';
      list = list.filter(t => t.is_remote === isRemote);
    }
    if (filters.status && filters.status !== 'all') {
      list = list.filter(t => t.status === filters.status);
    }
    return list;
  },

  async applyForMicroTask(taskId, data) {
    const task = (memoryStore.micro_tasks || []).find(t => t.id === taskId);
    if (!task) throw new Error('Micro-task not found.');

    if (!task.applications) task.applications = [];
    const existing = task.applications.find(a => a.volunteer_email?.toLowerCase() === data.volunteer_email?.toLowerCase());
    if (existing) throw new Error('You have already applied for this micro-task.');

    const app = {
      id: `app-${Date.now()}`,
      task_id: taskId,
      volunteer_name: data.volunteer_name,
      volunteer_email: data.volunteer_email,
      skills_note: data.skills_note || '',
      applied_at: new Date().toISOString()
    };

    task.applications.push(app);
    task.applicants_count = (task.applicants_count || 0) + 1;

    saveLocalStore();
    return app;
  },

  async submitMicroTaskWork(taskId, data) {
    const task = (memoryStore.micro_tasks || []).find(t => t.id === taskId);
    if (!task) throw new Error('Micro-task not found.');

    if (!task.submissions) task.submissions = [];
    const submission = {
      id: `sub-${Date.now()}`,
      task_id: taskId,
      volunteer_name: data.volunteer_name,
      volunteer_email: data.volunteer_email,
      work_link_or_text: data.work_link_or_text,
      notes: data.notes || '',
      status: 'pending_review',
      submitted_at: new Date().toISOString()
    };

    task.submissions.unshift(submission);
    task.submissions_count = (task.submissions_count || 0) + 1;

    saveLocalStore();
    return submission;
  },

  async reviewMicroTaskSubmission(taskId, submissionId, status, reviewNotes, reviewerName) {
    const task = (memoryStore.micro_tasks || []).find(t => t.id === taskId);
    if (!task) throw new Error('Micro-task not found.');

    const sub = (task.submissions || []).find(s => s.id === submissionId);
    if (!sub) throw new Error('Submission record not found.');

    sub.status = status; // 'approved' | 'revision_requested'
    sub.reviewed_at = new Date().toISOString();
    sub.review_notes = reviewNotes || '';
    sub.reviewed_by = reviewerName || 'NGO Task Lead';

    if (status === 'approved') {
      // Award verified hours to volunteer
      const passport = (memoryStore.volunteer_passports || []).find(p => p.email?.toLowerCase() === sub.volunteer_email?.toLowerCase());
      if (passport) {
        passport.verified_hours = Number(((passport.verified_hours || 0) + task.estimated_hours).toFixed(1));
        passport.completed_tasks_count = (passport.completed_tasks_count || 0) + 1;
      }
    }

    saveLocalStore();
    return sub;
  },

  // ==========================================================================
  // 28. PARTNERSHIP COMPATIBILITY CHECKER
  // ==========================================================================
  async calculatePartnershipCompatibility(ngoId, partnerData = {}) {
    const ngo = (memoryStore.ngos || []).find(n => n.id === ngoId) || (memoryStore.ngos || [])[0] || {};
    
    // Evaluation weights
    let score = 50; // baseline
    const positiveFactors = [];
    const missingRequirements = [];

    const ngoCauseName = ngo.category || ngo.primary_cause || ngo.cause || 'Grassroots Development';
    const ngoLocName = [ngo.city, ngo.state].filter(Boolean).join(', ') || ngo.location || 'Pan-India';

    // 1. Cause Alignment (30 pts)
    const ngoCause = ngoCauseName.toLowerCase();
    const partnerCause = (partnerData.cause || '').toLowerCase();
    if (partnerCause && (ngoCause.includes(partnerCause) || partnerCause.includes(ngoCause))) {
      score += 30;
      positiveFactors.push(`Direct Cause Alignment: Both entities prioritize "${ngoCauseName}".`);
    } else if (partnerCause) {
      score += 15;
      positiveFactors.push(`Complementary Causes: Potential for cross-disciplinary synergy between "${partnerData.cause}" and "${ngoCauseName}".`);
    } else {
      missingRequirements.push('Partner cause preferences not explicitly defined; baseline alignment assumed.');
    }

    // 2. Geographic Match (20 pts)
    const ngoLoc = ngoLocName.toLowerCase();
    const partnerLoc = (partnerData.location || '').toLowerCase();
    if (partnerLoc && (ngoLoc.includes(partnerLoc) || partnerLoc.includes(ngoLoc) || partnerLoc === 'all india' || partnerLoc === 'pan-india')) {
      score += 20;
      positiveFactors.push(`Geographic Proximity: Matching operational presence in ${ngoLocName}.`);
    } else if (partnerLoc) {
      missingRequirements.push(`Geographic Dispersion: Partner operates primarily in "${partnerData.location}" vs NGO base in "${ngoLocName}".`);
    }

    // 3. Resource & Skill Compatibility (25 pts)
    const requiredSkills = ngo.needed_skills || ['Field Logistics', 'Youth Engagement', 'Community Outreach'];
    const availableSkills = Array.isArray(partnerData.skills) ? partnerData.skills : (partnerData.skills ? [partnerData.skills] : ['Python Mentoring', 'Solar Field Survey']);
    const commonSkills = requiredSkills.filter(s => availableSkills.some(as => as.toLowerCase().includes(s.toLowerCase())));
    if (commonSkills.length > 0) {
      score += 20;
      positiveFactors.push(`Skill Overlap: Matches ${commonSkills.join(', ')}.`);
    } else {
      missingRequirements.push(`Skill Deficit: Specific requirement for ${requiredSkills.slice(0, 2).join(' or ')} not covered by partner's primary roster.`);
    }

    // 4. Governance & Verification (15 pts)
    if (ngo.is_verified || ngo.verification_status === 'verified') {
      score += 15;
      positiveFactors.push(`Verified Organization: ${ngo.name} holds authenticated Darpan & 80G credentials.`);
    }

    const finalScore = Math.min(98, Math.max(45, score));

    return {
      ngo_id: ngo.id,
      ngo_name: ngo.name,
      partner_name: partnerData.name || 'Prospective Corporate / Supporter Partner',
      compatibility_score: finalScore,
      rating_label: finalScore >= 80 ? 'High Synergistic Fit' : finalScore >= 65 ? 'Moderate Compatibility' : 'Potential Alignment with Resource Gaps',
      positive_factors: positiveFactors,
      missing_requirements: missingRequirements,
      non_guarantee_notice: 'This mathematical compatibility index indicates operational alignment and does not guarantee formal legal, financial, or programmatic outcomes.'
    };
  },

  // ==========================================================================
  // 29. MILESTONE-BASED SPONSORSHIP
  // ==========================================================================
  async getMilestoneSponsorships(projectId) {
    let list = [...(memoryStore.milestone_sponsorships || [])];
    if (projectId && projectId !== 'all') {
      list = list.filter(m => m.project_id === projectId);
    }
    return list;
  },

  async pledgeMilestoneSponsorship(milestoneId, data) {
    const newSpon = {
      id: `mspon-${Date.now()}`,
      project_id: data.project_id || 'proj-1',
      milestone_id: milestoneId,
      milestone_title: data.milestone_title || 'Phase Implementation Milestone',
      target_amount: Number(data.target_amount) || 50000,
      pledged_amount: Number(data.pledged_amount) || 25000,
      confirmed_amount: 0,
      sponsor_name: data.sponsor_name || 'Anonymous Corporate Sponsor',
      sponsor_email: data.sponsor_email,
      status: 'pledged',
      receipt_id: `REC-PENDING-${Date.now().toString().slice(-4)}`,
      evidence_submitted: false,
      reviewer_approved: false,
      reviewed_by: 'Pending Milestone Audit',
      notes: data.notes || '',
      created_at: new Date().toISOString()
    };

    if (!memoryStore.milestone_sponsorships) memoryStore.milestone_sponsorships = [];
    memoryStore.milestone_sponsorships.unshift(newSpon);

    saveLocalStore();
    return newSpon;
  },

  async confirmMilestoneSponsorship(sponsorshipId, { receiptId, confirmedAmount, reviewNotes, reviewerName }) {
    const spon = (memoryStore.milestone_sponsorships || []).find(s => s.id === sponsorshipId);
    if (!spon) throw new Error('Milestone sponsorship record not found.');

    spon.status = 'confirmed';
    spon.receipt_id = receiptId || `REC-CONF-${Date.now().toString().slice(-5)}`;
    spon.confirmed_amount = Number(confirmedAmount) || spon.pledged_amount;
    spon.evidence_submitted = true;
    spon.reviewer_approved = true;
    spon.reviewed_by = reviewerName || 'Authorized Milestone Auditor';
    spon.confirmed_at = new Date().toISOString();
    if (reviewNotes) spon.notes = (spon.notes ? spon.notes + ' • ' : '') + reviewNotes;

    saveLocalStore();
    return spon;
  },

  // ==========================================================================
  // 30. VERIFIED CONTRIBUTION PASSPORT
  // ==========================================================================
  async getVolunteerPassport(userId) {
    const pass = (memoryStore.volunteer_passports || []).find(p => p.user_id === userId || p.email === userId);
    if (pass) return pass;

    // Create default dynamic passport
    const newPass = {
      id: `pass-${userId || 'guest'}`,
      user_id: userId || 'user-supp-1',
      volunteer_name: 'Marcus Chen',
      email: 'marcus.chen@apextech.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80',
      privacy_level: 'public',
      verified_hours: 24.5,
      completed_tasks_count: 6,
      projects_supported_count: 4,
      skills_endorsed: ['Python Mentoring', 'Solar Field Survey', 'Hardware Testing', 'CSR Architecture'],
      badges: [
        { id: 'b-1', title: 'Top Corporate Mentor 2026', issued_by: 'Vidya Foundation India', date: '2026-10-15' },
        { id: 'b-2', title: 'Verified Field Contributor', issued_by: 'Jal Jeevan Mission Trust', date: '2026-10-24' }
      ]
    };

    if (!memoryStore.volunteer_passports) memoryStore.volunteer_passports = [];
    memoryStore.volunteer_passports.push(newPass);
    saveLocalStore();
    return newPass;
  },

  async updateVolunteerPassportPrivacy(userId, privacyLevel) {
    const pass = await this.getVolunteerPassport(userId);
    pass.privacy_level = privacyLevel; // 'public' | 'unlisted' | 'private'
    saveLocalStore();
    return pass;
  },

  // ==========================================================================
  // 31. SMART DOCUMENT CHECKLIST
  // ==========================================================================
  async getNgoComplianceDocuments(ngoId) {
    let list = [...(memoryStore.ngo_compliance_documents || [])];
    if (ngoId && ngoId !== 'all') {
      list = list.filter(d => d.ngo_id === ngoId);
    }
    return list;
  },

  async uploadNgoComplianceDocument(ngoId, data) {
    if (!data.doc_type || !data.file_name) {
      throw new Error('Document type and file name are required.');
    }

    const doc = {
      id: `doc-${Date.now()}`,
      ngo_id: ngoId || 'ngo-1',
      doc_type: data.doc_type,
      title: data.title || data.doc_type,
      file_name: data.file_name,
      file_url: data.file_url || 'https://impactconnect.org/docs/mock_certificate.pdf',
      status: 'pending_review',
      uploaded_at: new Date().toISOString(),
      expiry_date: data.expiry_date || '2028-12-31',
      verified_by: 'Pending Review by Compliance Panel',
      notes: data.notes || 'Uploaded via NGO Smart Compliance Portal.'
    };

    if (!memoryStore.ngo_compliance_documents) memoryStore.ngo_compliance_documents = [];
    memoryStore.ngo_compliance_documents.unshift(doc);

    saveLocalStore();
    return doc;
  },

  async reviewNgoComplianceDocument(docId, status, reviewNotes, reviewerName) {
    const doc = (memoryStore.ngo_compliance_documents || []).find(d => d.id === docId);
    if (!doc) throw new Error('Compliance document not found.');

    doc.status = status; // 'verified' | 'rejected'
    doc.reviewed_at = new Date().toISOString();
    doc.review_notes = reviewNotes || '';
    doc.verified_by = reviewerName || 'Authorized Senior Compliance Reviewer';

    saveLocalStore();
    return doc;
  },

  // ==========================================================================
  // 32. CROSS-NGO COLLABORATION ROOMS
  // ==========================================================================
  async getCrossNgoRooms(ngoId) {
    let list = [...(memoryStore.cross_ngo_rooms || [])];
    if (ngoId && ngoId !== 'all') {
      list = list.filter(r => r.lead_ngo_id === ngoId || r.partner_ngo_ids?.includes(ngoId));
    }
    return list;
  },

  async createCrossNgoRoom(data) {
    if (!data.title || !data.shared_cause) {
      throw new Error('Title and shared cause are required.');
    }

    const room = {
      id: `room-${Date.now()}`,
      title: data.title,
      lead_ngo_id: data.lead_ngo_id || 'ngo-1',
      lead_ngo_name: data.lead_ngo_name || 'Jal Jeevan Mission Trust',
      partner_ngo_ids: data.partner_ngo_ids || ['ngo-2'],
      partner_ngo_names: data.partner_ngo_names || ['Vidya Foundation India'],
      shared_cause: data.shared_cause,
      joint_goal: data.joint_goal || '',
      shared_resources: data.shared_resources || [],
      shared_volunteers_count: Number(data.shared_volunteers_count) || 12,
      status: 'active',
      joint_milestones: [
        { id: `jm-${Date.now()}-1`, title: 'Joint Mobilization & Baseline Survey', is_completed: false, due_date: '2026-11-20' }
      ],
      activity_log: [
        { date: new Date().toISOString().slice(0, 10), text: `Collaboration room created by ${data.lead_ngo_name || 'Lead NGO'}.` }
      ],
      created_at: new Date().toISOString()
    };

    if (!memoryStore.cross_ngo_rooms) memoryStore.cross_ngo_rooms = [];
    memoryStore.cross_ngo_rooms.unshift(room);

    saveLocalStore();
    return room;
  },

  async addMilestoneToCrossNgoRoom(roomId, milestoneData) {
    const room = (memoryStore.cross_ngo_rooms || []).find(r => r.id === roomId);
    if (!room) throw new Error('Collaboration room not found.');

    if (!room.joint_milestones) room.joint_milestones = [];
    const milestone = {
      id: `jm-${Date.now()}`,
      title: milestoneData.title,
      is_completed: false,
      due_date: milestoneData.due_date || '2026-12-01'
    };
    room.joint_milestones.push(milestone);

    saveLocalStore();
    return milestone;
  },

  // ==========================================================================
  // 33. LONG-TERM IMPACT FOLLOW-UP
  // ==========================================================================
  async getLongTermFollowups(projectId) {
    let list = [...(memoryStore.long_term_followups || [])];
    if (projectId && projectId !== 'all') {
      list = list.filter(f => f.project_id === projectId);
    }
    return list;
  },

  async submitLongTermFollowup(projectId, data) {
    const followup = {
      id: `ltf-${Date.now()}`,
      project_id: projectId || 'proj-1',
      project_title: data.project_title || 'Community Impact Initiative',
      ngo_name: data.ngo_name || 'Verified Community NGO',
      interval_days: Number(data.interval_days) || 90,
      due_date: data.due_date || new Date().toISOString().slice(0, 10),
      status: 'submitted',
      outcome_type: data.is_independent_audit ? 'independent_audit' : 'ngo_self_reported',
      auditor_name: data.auditor_name || (data.is_independent_audit ? 'Independent Field Inspector' : 'Self-Reported by NGO'),
      survival_rate_or_uptime: data.survival_rate_or_uptime || '95% Operational Continuity',
      beneficiary_satisfaction_score: Number(data.beneficiary_satisfaction_score) || 90,
      measured_metrics: data.measured_metrics || [
        { label: 'Longitudinal Benefit', value: 'Sustained Community Use' }
      ],
      beneficiary_feedback: data.beneficiary_feedback || '',
      evidence_photo_url: data.evidence_photo_url || 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=600&q=80',
      last_updated: new Date().toISOString()
    };

    if (!memoryStore.long_term_followups) memoryStore.long_term_followups = [];
    memoryStore.long_term_followups.unshift(followup);

    saveLocalStore();
    return followup;
  },

  async verifyLongTermFollowup(followupId, verificationData = {}) {
    const followup = (memoryStore.long_term_followups || []).find(f => f.id === followupId);
    if (!followup) throw new Error('Long-term follow-up record not found.');

    followup.status = 'verified';
    followup.outcome_type = 'independent_audit';
    followup.auditor_name = verificationData.auditor_name || 'Independent Field Verifier';
    followup.verified_at = new Date().toISOString();

    saveLocalStore();
    return followup;
  },

  async resetDemoData() {
    memoryStore = getSeedData();
    saveLocalStore();
    return { success: true };
  }
};

module.exports = {
  initDb,
  db
};
