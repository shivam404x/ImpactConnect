/**
 * ImpactConnect - Express.js REST API Server
 * Architecture: Clean REST endpoints with PostgreSQL connection & persistent fallback.
 */

const express = require('express');
const path = require('path');
const fs = require('fs');
const { initDb, db } = require('./server/db.cjs');

const app = express();
const PORT = process.env.PORT || 5000;
const DIST_DIR = path.resolve(__dirname, 'dist');

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request Logger
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  }
  next();
});

// Initialize database
initDb().catch(err => console.error('Database initialization error:', err));

// ============================================================================
// 1. HEALTH & METRICS
// ============================================================================
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    platform: 'ImpactConnect — Connecting People. Creating Impact.',
    version: '2.0.0',
    ...db.getStatus(),
    timestamp: new Date().toISOString()
  });
});

app.get('/api/stats', async (req, res) => {
  try {
    const stats = await db.getStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================================
// 2. AUTHENTICATION & USERS
// ============================================================================
app.get('/api/auth/users', async (req, res) => {
  try {
    const users = await db.getUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });
    const user = await db.login(email);
    if (!user) return res.status(404).json({ error: 'No account found with this email. Please register.' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, role, name } = req.body;
    if (!email || !name) return res.status(400).json({ error: 'Name and email are required.' });
    const newUser = await db.registerUser(req.body);
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/favorites/toggle', async (req, res) => {
  try {
    const { user_id, project_id } = req.body;
    if (!user_id || !project_id) return res.status(400).json({ error: 'user_id and project_id required' });
    const result = await db.toggleFavorite(user_id, project_id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================================
// 3. NGOS & VERIFICATION
// ============================================================================
app.get('/api/ngos', async (req, res) => {
  try {
    const { category, country, search } = req.query;
    const ngos = await db.getNgos({ category, country, search });
    res.json(ngos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/ngos/:id', async (req, res) => {
  try {
    const ngo = await db.getNgoById(req.params.id);
    if (!ngo) return res.status(404).json({ error: 'NGO not found' });
    res.json(ngo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/ngos/:id', async (req, res) => {
  try {
    const updated = await db.updateNgo(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'NGO not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/ngos/:id/verify', async (req, res) => {
  try {
    const { is_verified, verification_tier } = req.body;
    const updated = await db.verifyNgo(req.params.id, { is_verified, verification_tier });
    if (!updated) return res.status(404).json({ error: 'NGO not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================================
// 4. PROJECTS & REQUIREMENTS
// ============================================================================
app.get('/api/projects', async (req, res) => {
  try {
    const { cause, sdg, location, requirementType, urgency, search, ngo_id, sort } = req.query;
    const projects = await db.getProjects({
      cause,
      sdg,
      location,
      requirementType,
      urgency,
      search,
      ngo_id,
      sort
    });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Specific project sub-routes must precede parameterized /:id route
app.get('/api/projects/personalized', async (req, res) => {
  try {
    const { userId, causes, location, skills, resources, followedNgos } = req.query;
    const parsedCauses = causes ? (Array.isArray(causes) ? causes : causes.split(',')) : [];
    const parsedSkills = skills ? (Array.isArray(skills) ? skills : skills.split(',')) : [];
    const parsedResources = resources ? (Array.isArray(resources) ? resources : resources.split(',')) : [];
    const parsedNgos = followedNgos ? (Array.isArray(followedNgos) ? followedNgos : followedNgos.split(',')) : [];

    const feed = await db.getPersonalizedFeed({
      userId,
      causes: parsedCauses,
      location,
      skills: parsedSkills,
      resources: parsedResources,
      followedNgos: parsedNgos
    });
    res.json(feed);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/projects/saved', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId is required' });
    const saved = await db.getSavedProjects(userId);
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/projects/:id', async (req, res) => {
  try {
    const project = await db.getProjectById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/projects', async (req, res) => {
  try {
    const { title, description, cause_category, ngo_id, location_city, location_country, requirements } = req.body;
    if (!title || !description || !cause_category || !ngo_id || !location_city || !location_country) {
      return res.status(400).json({ error: 'Missing required project fields.' });
    }
    const newProject = await db.createProject(req.body, requirements || []);
    res.status(201).json(newProject);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/projects/:id', async (req, res) => {
  try {
    const updated = await db.updateProject(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Project not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/projects/:id', async (req, res) => {
  try {
    const result = await db.deleteProject(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================================
// 5. PARTNERSHIP REQUESTS
// ============================================================================
app.get('/api/partnership-requests', async (req, res) => {
  try {
    const { ngo_id, project_id, supporter_id, supporter_email, status } = req.query;
    const requests = await db.getPartnershipRequests({ ngo_id, project_id, supporter_id, supporter_email, status });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/partnership-requests', async (req, res) => {
  try {
    const { project_id, ngo_id, supporter_name, supporter_email, offer_type } = req.body;
    if (!project_id || !ngo_id || !supporter_name || !supporter_email || !offer_type) {
      return res.status(400).json({ error: 'Missing required fields for proposal.' });
    }
    const newReq = await db.createPartnershipRequest(req.body);
    res.status(201).json(newReq);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/partnership-requests/:id/status', async (req, res) => {
  try {
    const { status, note } = req.body;
    if (!['pending', 'accepted', 'declined', 'under_review'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    const updated = await db.updatePartnershipRequestStatus(req.params.id, { status, note });
    if (!updated) return res.status(404).json({ error: 'Partnership request not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================================
// 6. VOLUNTEER & SKILL MARKETPLACE
// ============================================================================
app.get('/api/volunteer-roles', async (req, res) => {
  try {
    const { cause, is_remote, search } = req.query;
    const roles = await db.getVolunteerRoles({ cause, is_remote, search });
    res.json(roles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/volunteer-roles', async (req, res) => {
  try {
    const { title, ngo_id, required_skills } = req.body;
    if (!title || !ngo_id) {
      return res.status(400).json({ error: 'Title and NGO ID are required.' });
    }
    const role = await db.createVolunteerRole(req.body);
    res.status(201).json(role);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/volunteer-applications', async (req, res) => {
  try {
    const { ngo_id, applicant_email } = req.query;
    const apps = await db.getVolunteerApplications({ ngo_id, applicant_email });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/volunteer-applications', async (req, res) => {
  try {
    const { role_id, applicant_name, applicant_email } = req.body;
    if (!role_id || !applicant_name || !applicant_email) {
      return res.status(400).json({ error: 'role_id, applicant_name and applicant_email required.' });
    }
    const newApp = await db.applyForVolunteerRole(req.body);
    res.status(201).json(newApp);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/volunteer-applications/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await db.updateApplicationStatus(req.params.id, status);
    if (!updated) return res.status(404).json({ error: 'Application not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================================
// 7. CORPORATE CSR RFPS & GRANTS
// ============================================================================
app.get('/api/csr-rfps', async (req, res) => {
  try {
    const rfps = await db.getCsrRfps();
    res.json(rfps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/csr-rfps', async (req, res) => {
  try {
    const { title, company_name, grant_pool } = req.body;
    if (!title || !company_name) {
      return res.status(400).json({ error: 'title and company_name required.' });
    }
    const newRfp = await db.createCsrRfp(req.body);
    res.status(201).json(newRfp);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================================
// 8. VERIFICATION REQUESTS & TRUST SAFETY
// ============================================================================
app.get('/api/verification-requests', async (req, res) => {
  try {
    const requests = await db.getVerificationRequests();
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/verification-requests', async (req, res) => {
  try {
    const newVR = await db.submitVerificationRequest(req.body);
    res.status(201).json(newVR);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/verification-requests/:id', async (req, res) => {
  try {
    const { status, verification_tier, admin_notes } = req.body;
    const updated = await db.reviewVerification(req.params.id, { status, verification_tier, admin_notes });
    if (!updated) return res.status(404).json({ error: 'Verification request not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/reports', async (req, res) => {
  try {
    const reports = await db.getReports();
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/reports', async (req, res) => {
  try {
    const { target_type, target_id, reason, details } = req.body;
    if (!target_type || !target_id || !reason) {
      return res.status(400).json({ error: 'target_type, target_id, and reason required' });
    }
    const report = await db.submitReport(req.body);
    res.status(201).json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================================
// 9. MILESTONES, EVIDENCE & WORKSPACE CHAT
// ============================================================================
app.get('/api/projects/:id/milestones', async (req, res) => {
  try {
    const milestones = await db.getProjectMilestones(req.params.id);
    res.json(milestones);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/milestones/:id', async (req, res) => {
  try {
    const updated = await db.updateMilestone(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Milestone not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/partnerships/:id/messages', async (req, res) => {
  try {
    const messages = await db.getMessages(req.params.id);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/partnerships/:id/messages', async (req, res) => {
  try {
    const { sender_name, sender_role, message_text } = req.body;
    if (!message_text) return res.status(400).json({ error: 'Message text required' });
    const msg = await db.sendMessage({
      partnership_id: req.params.id,
      sender_name,
      sender_role,
      message_text
    });
    res.status(201).json(msg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/contributions', async (req, res) => {
  try {
    const contributions = await db.getContributions(req.query.project_id);
    res.json(contributions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================================
// 10. IMPACT AI ASSISTANT (NLP REQUIREMENT PARSER)
// ============================================================================
app.post('/api/ai/parse-requirement', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Requirement description prompt is required.' });
    const parsed = await db.parseNgoRequirement(prompt);
    res.json(parsed);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================================
// 11. RESOURCE EXCHANGE HUB (GOODS & EQUIPMENT MARKETPLACE)
// ============================================================================
app.get('/api/resources', async (req, res) => {
  try {
    const { type, category, status, search } = req.query;
    const items = await db.getResourceItems({ type, category, status, search });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/resources', async (req, res) => {
  try {
    const { title, category, quantity, location_city, owner_name, owner_email } = req.body;
    if (!title || !category || !quantity || !location_city || !owner_name || !owner_email) {
      return res.status(400).json({ error: 'Missing required resource listing fields.' });
    }
    const item = await db.createResourceItem(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/resources/:id/claim', async (req, res) => {
  try {
    const { requester_name, requester_email, quantity_requested, delivery_address } = req.body;
    if (!requester_name || !requester_email || !quantity_requested || !delivery_address) {
      return res.status(400).json({ error: 'Missing required claim parameters.' });
    }
    const claim = await db.claimResourceItem({ ...req.body, resource_id: req.params.id });
    res.status(201).json(claim);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/resource-claims/:id/status', async (req, res) => {
  try {
    const { status, tracking_notes } = req.body;
    const updated = await db.updateClaimStatus(req.params.id, status, tracking_notes);
    if (!updated) return res.status(404).json({ error: 'Claim record not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/resource-claims', async (req, res) => {
  try {
    const { resource_id, requester_email } = req.query;
    const claims = await db.getResourceClaims({ resource_id, requester_email });
    res.json(claims);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================================
// 12. URGENT COMMUNITY NEEDS & PLEDGES
// ============================================================================
app.get('/api/urgent-needs', async (req, res) => {
  try {
    const { cause, urgency, status, location } = req.query;
    const needs = await db.getUrgentNeeds({ cause, urgency, status, location });
    res.json(needs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/urgent-needs', async (req, res) => {
  try {
    const { title, description, cause_category, deadline, target_quantity, location_city } = req.body;
    if (!title || !description || !cause_category || !deadline || !target_quantity || !location_city) {
      return res.status(400).json({ error: 'Missing required fields for urgent need.' });
    }
    const need = await db.createUrgentNeed(req.body);
    res.status(201).json(need);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/urgent-needs/:id/pledge', async (req, res) => {
  try {
    const { supporter_name, supporter_email, pledged_quantity } = req.body;
    if (!supporter_name || !supporter_email || !pledged_quantity) {
      return res.status(400).json({ error: 'supporter_name, supporter_email and pledged_quantity required.' });
    }
    const pledge = await db.pledgeUrgentNeed({ ...req.body, urgent_need_id: req.params.id });
    res.status(201).json(pledge);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/urgent-needs/:id/pledges', async (req, res) => {
  try {
    const pledges = await db.getUrgentPledges(req.params.id);
    res.json(pledges);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================================
// 13. PARTNERSHIP PERFORMANCE & TRANSPARENT REVIEWS
// ============================================================================
app.get('/api/partnership-reviews', async (req, res) => {
  try {
    const { project_id, partnership_id } = req.query;
    const reviews = await db.getPartnershipReviews({ project_id, partnership_id });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/partnership-reviews', async (req, res) => {
  try {
    const { partnership_id, project_id, reviewer_name, reviewer_role, rating, review_text } = req.body;
    if (!partnership_id || !project_id || !reviewer_name || !rating || !review_text) {
      return res.status(400).json({ error: 'Missing required review fields.' });
    }
    const review = await db.submitPartnershipReview(req.body);
    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/performance-indicators/:id', async (req, res) => {
  try {
    const indicators = await db.getPerformanceIndicators(req.params.id);
    res.json(indicators);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================================
// 14. GRANTS AND CSR OPPORTUNITY DIRECTORY
// ============================================================================
app.get('/api/grants-directory', async (req, res) => {
  try {
    const { cause, funder_type, search } = req.query;
    const grants = await db.getGrants({ cause, funder_type, search });
    res.json(grants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/grants-directory', async (req, res) => {
  try {
    const { title, funder_name, grant_amount, deadline, official_link } = req.body;
    if (!title || !funder_name || !grant_amount || !deadline || !official_link) {
      return res.status(400).json({ error: 'Missing required grant fields.' });
    }
    const grant = await db.createGrant(req.body);
    res.status(201).json(grant);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================================
// 15. VOLUNTEER QR ATTENDANCE
// ============================================================================
app.get('/api/volunteer-attendance', async (req, res) => {
  try {
    const { event_id, project_id, volunteer_email } = req.query;
    const records = await db.getVolunteerAttendance({ event_id, project_id, volunteer_email });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/volunteer-attendance/check-in', async (req, res) => {
  try {
    const { event_id, volunteer_name, volunteer_email, qr_token } = req.body;
    if (!event_id || !volunteer_name || !volunteer_email || !qr_token) {
      return res.status(400).json({ error: 'event_id, volunteer_name, volunteer_email and qr_token required.' });
    }
    const record = await db.recordVolunteerCheckIn(req.body);
    res.status(201).json(record);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ============================================================================
// 16. PROJECT FOLLOWING & LIVE ACTIVITY FEED
// ============================================================================
app.post('/api/projects/:id/follow', async (req, res) => {
  try {
    const { user_id } = req.body;
    if (!user_id) return res.status(400).json({ error: 'user_id is required' });
    const result = await db.toggleProjectFollow(user_id, req.params.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/users/:id/follows', async (req, res) => {
  try {
    const follows = await db.getUserFollows(req.params.id);
    res.json(follows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/activity-feed', async (req, res) => {
  try {
    const { project_id } = req.query;
    const feed = await db.getActivityFeed({ project_id });
    res.json(feed);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================================
// 10. AI SMART MATCH & DEMO RESET
// ============================================================================
app.get('/api/ai-matches', async (req, res) => {
  try {
    const { supporter_type, skills, interests } = req.query;
    const projects = await db.getProjects({});
    
    const parsedSkills = skills ? skills.split(',').map(s => s.trim().toLowerCase()) : [];
    const parsedInterests = interests ? interests.split(',').map(i => i.trim().toLowerCase()) : [];

    const scored = projects.map(proj => {
      let matchScore = 70;
      const reasons = [];

      if (parsedInterests.length > 0 && parsedInterests.includes(proj.cause_category.toLowerCase())) {
        matchScore += 18;
        reasons.push(`Direct alignment with your focus on ${proj.cause_category}`);
      }

      if (parsedSkills.length > 0 && proj.requirements) {
        proj.requirements.forEach(req => {
          if (Array.isArray(req.skill_tags)) {
            req.skill_tags.forEach(st => {
              if (parsedSkills.some(skill => st.toLowerCase().includes(skill) || skill.includes(st.toLowerCase()))) {
                matchScore += 12;
                reasons.push(`Matches requirement: "${req.title}"`);
              }
            });
          }
        });
      }

      if (supporter_type === 'corporate_csr' && proj.requirements.some(r => r.type === 'corporate_csr' || r.type === 'funding')) {
        matchScore += 10;
        reasons.push('High suitability for Corporate CSR grant sponsorship');
      } else if (supporter_type === 'skilled_professional' && proj.requirements.some(r => r.type === 'skills')) {
        matchScore += 10;
        reasons.push('Urgent demand for your professional skillset');
      }

      return {
        ...proj,
        matchScore: Math.min(99, matchScore),
        matchReasons: reasons.length ? reasons : ['General community SDG compatibility']
      };
    });

    scored.sort((a, b) => b.matchScore - a.matchScore);
    res.json(scored.slice(0, 6));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================================
// 17. PERSONALIZED IMPACT FEED & SAVED PROJECTS
// ============================================================================
app.post('/api/projects/:id/save', async (req, res) => {
  try {
    const { userId, notes } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId is required' });
    const result = await db.toggleSaveProject(userId, req.params.id, notes);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================================
// 18. SMART AVAILABILITY CALENDAR & VOLUNTEER SHIFTS
// ============================================================================
app.get('/api/volunteer-shifts', async (req, res) => {
  try {
    const { ngo_id, project_id, status, category, date } = req.query;
    const shifts = await db.getVolunteerShifts({ ngo_id, project_id, status, category, date });
    res.json(shifts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/volunteer-shifts', async (req, res) => {
  try {
    const { title, shift_date, start_time, end_time, location, capacity, ngo_id, project_id } = req.body;
    if (!title || !shift_date || !start_time || !end_time || !location || !capacity) {
      return res.status(400).json({ error: 'Missing required volunteering shift fields.' });
    }
    const shift = await db.createVolunteerShift(req.body);
    res.status(201).json(shift);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/volunteer-shifts/:id/register', async (req, res) => {
  try {
    const { volunteer_name, volunteer_email } = req.body;
    if (!volunteer_name || !volunteer_email) {
      return res.status(400).json({ error: 'Volunteer name and email are required.' });
    }
    const result = await db.registerForShift(req.params.id, req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/volunteer-shifts/commitments', async (req, res) => {
  try {
    const { volunteer_email } = req.query;
    if (!volunteer_email) return res.status(400).json({ error: 'volunteer_email is required' });
    const commitments = await db.getUserShiftCommitments(volunteer_email);
    res.json(commitments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================================
// 19. UN SDG MAPPING & CAUSE-BASED ANALYTICS
// ============================================================================
app.get('/api/analytics/sdg-mapping', async (req, res) => {
  try {
    const analytics = await db.getSdgMappingAnalytics();
    res.json(analytics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================================
// 20. SMART NOTIFICATIONS & PREFERENCES
// ============================================================================
app.get('/api/notifications', async (req, res) => {
  try {
    const { recipient_email, user_id } = req.query;
    const result = await db.getNotifications(recipient_email, user_id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/notifications/:id/read', async (req, res) => {
  try {
    const notif = await db.markNotificationAsRead(req.params.id);
    res.json(notif);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/notifications/mark-all-read', async (req, res) => {
  try {
    const { recipient_email } = req.body;
    const result = await db.markAllNotificationsAsRead(recipient_email);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/notifications/preferences', async (req, res) => {
  try {
    const { user_id } = req.query;
    if (!user_id) return res.status(400).json({ error: 'user_id is required' });
    const prefs = await db.getNotificationPreferences(user_id);
    res.json(prefs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/notifications/preferences', async (req, res) => {
  try {
    const { user_id } = req.body;
    if (!user_id) return res.status(400).json({ error: 'user_id is required' });
    const updated = await db.updateNotificationPreferences(user_id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================================
// 21. PARTNERSHIP AGREEMENT DRAFT GENERATOR
// ============================================================================
app.get('/api/partnership-agreements/:partnership_id', async (req, res) => {
  try {
    const agreement = await db.getPartnershipAgreement(req.params.partnership_id);
    if (!agreement) return res.status(404).json({ error: 'Partnership record not found' });
    res.json(agreement);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/partnership-agreements', async (req, res) => {
  try {
    const agreement = await db.createOrUpdatePartnershipAgreement(req.body);
    res.json(agreement);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/partnership-agreements/:id/acknowledge', async (req, res) => {
  try {
    const { role, actor_name } = req.body;
    if (!role || !actor_name) {
      return res.status(400).json({ error: 'role and actor_name are required' });
    }
    const updated = await db.acknowledgePartnershipAgreement(req.params.id, role, actor_name);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================================
// 22. PROJECT TRANSPARENCY TIMELINE (IMMUTABLE AUDIT TRAIL)
// ============================================================================
app.get('/api/projects/:id/transparency-timeline', async (req, res) => {
  try {
    const timeline = await db.getProjectTransparencyTimeline(req.params.id);
    res.json(timeline);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/projects/:id/transparency-timeline', async (req, res) => {
  try {
    const { title, description, actor_name, actor_role } = req.body;
    if (!title || !description || !actor_name || !actor_role) {
      return res.status(400).json({ error: 'Missing required audit event fields.' });
    }
    const event = await db.logProjectTransparencyEvent(req.params.id, req.body);
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================================
// 17. NEED-TO-ACTION CONVERTER
// ============================================================================
app.post('/api/need-to-action/convert', async (req, res) => {
  try {
    const { prompt, ngo_info } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Need statement prompt is required' });
    const draft = await db.convertNeedToAction(prompt, ngo_info);
    res.json(draft);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/need-to-action/publish', async (req, res) => {
  try {
    const project = await db.publishNeedToActionCampaign(req.body);
    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ============================================================================
// 18. COLLECTIVE ACTION CAMPAIGNS
// ============================================================================
app.get('/api/collective-campaigns', async (req, res) => {
  try {
    const campaigns = await db.getCollectiveCampaigns(req.query);
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/collective-campaigns/:id/pledge', async (req, res) => {
  try {
    const pledge = await db.recordCollectivePledge(req.params.id, req.body);
    res.status(201).json(pledge);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.patch('/api/collective-campaigns/:id/confirm-delivery', async (req, res) => {
  try {
    const { pledge_id } = req.body;
    const result = await db.confirmPledgedDelivery(req.params.id, pledge_id);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ============================================================================
// 19. EMPLOYEE VOLUNTEERING PORTAL
// ============================================================================
app.get('/api/employee-volunteering/programs', async (req, res) => {
  try {
    const programs = await db.getEmployeeVolunteeringPrograms(req.query);
    res.json(programs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/employee-volunteering/register', async (req, res) => {
  try {
    const { program_id } = req.body;
    const registration = await db.registerEmployeeForProgram(program_id, req.body);
    res.status(201).json(registration);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/employee-volunteering/metrics', async (req, res) => {
  try {
    const metrics = await db.getEmployeeVolunteeringMetrics(req.query.company_domain);
    res.json(metrics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================================
// 20. DONATION DELIVERY TRACKING
// ============================================================================
app.get('/api/delivery-tracking', async (req, res) => {
  try {
    const deliveries = await db.getDonationDeliveries(req.query);
    res.json(deliveries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/delivery-tracking/:id/advance-status', async (req, res) => {
  try {
    const delivery = await db.advanceDeliveryStatus(req.params.id, req.body);
    res.json(delivery);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ============================================================================
// 21. EXPERT MENTORSHIP NETWORK
// ============================================================================
app.get('/api/mentors', async (req, res) => {
  try {
    const mentors = await db.getExpertMentors(req.query);
    res.json(mentors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/mentors/:id/book-session', async (req, res) => {
  try {
    const session = await db.bookMentorshipSession(req.params.id, req.body);
    res.status(201).json(session);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/mentorship-sessions', async (req, res) => {
  try {
    const sessions = await db.getMentorshipSessions(req.query);
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/mentorship-sessions/:id/complete', async (req, res) => {
  try {
    const session = await db.completeMentorshipSession(req.params.id, req.body);
    res.json(session);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ============================================================================
// 22. BEFORE-AND-AFTER IMPACT STORIES
// ============================================================================
app.get('/api/impact-stories', async (req, res) => {
  try {
    const stories = await db.getImpactStories(req.query);
    res.json(stories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/impact-stories', async (req, res) => {
  try {
    const story = await db.publishImpactStory(req.body);
    res.status(201).json(story);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ============================================================================
// 23. PROJECT RISK ALERTS
// ============================================================================
app.get('/api/risk-alerts', async (req, res) => {
  try {
    const alerts = await db.getAllRiskAlerts();
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/risk-alerts/:id/resolve', async (req, res) => {
  try {
    const { resolution_notes, actor_name } = req.body;
    const result = await db.resolveRiskAlert(req.params.id, resolution_notes, actor_name);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================================
// 24. CSR EVIDENCE PACK
// ============================================================================
app.get('/api/csr-evidence-pack/:projectId', async (req, res) => {
  try {
    const pack = await db.generateCsrEvidencePack(req.params.projectId);
    res.json(pack);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================================
// 25. COLLABORATION NETWORK GRAPH
// ============================================================================
app.get('/api/collaboration-graph', async (req, res) => {
  try {
    const graph = await db.getCollaborationGraph();
    res.json(graph);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================================
// 26. COMMUNITY NEEDS HEATMAP
// ============================================================================
app.get('/api/community-needs/heatmap', async (req, res) => {
  try {
    const reports = await db.getCommunityNeedReports(req.query);
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/community-needs/report', async (req, res) => {
  try {
    const report = await db.reportCommunityNeed(req.body);
    res.status(201).json(report);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ============================================================================
// 27. MICRO-VOLUNTEERING MARKETPLACE
// ============================================================================
app.get('/api/micro-tasks', async (req, res) => {
  try {
    const tasks = await db.getMicroTasks(req.query);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/micro-tasks/:id/apply', async (req, res) => {
  try {
    const appRecord = await db.applyForMicroTask(req.params.id, req.body);
    res.status(201).json(appRecord);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/micro-tasks/:id/submit', async (req, res) => {
  try {
    const subRecord = await db.submitMicroTaskWork(req.params.id, req.body);
    res.status(201).json(subRecord);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.patch('/api/micro-tasks/:id/review', async (req, res) => {
  try {
    const { submission_id, status, review_notes, reviewer_name } = req.body;
    const reviewRecord = await db.reviewMicroTaskSubmission(req.params.id, submission_id, status, review_notes, reviewer_name);
    res.json(reviewRecord);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ============================================================================
// 28. PARTNERSHIP COMPATIBILITY CHECKER
// ============================================================================
app.post('/api/partnerships/compatibility-check', async (req, res) => {
  try {
    const { ngo_id, partner_data } = req.body;
    const result = await db.calculatePartnershipCompatibility(ngo_id, partner_data);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================================
// 29. MILESTONE-BASED SPONSORSHIP
// ============================================================================
app.get('/api/milestone-sponsorships', async (req, res) => {
  try {
    const sponsorships = await db.getMilestoneSponsorships(req.query.project_id);
    res.json(sponsorships);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/milestone-sponsorships/:milestoneId/pledge', async (req, res) => {
  try {
    const spon = await db.pledgeMilestoneSponsorship(req.params.milestoneId, req.body);
    res.status(201).json(spon);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.patch('/api/milestone-sponsorships/:id/confirm', async (req, res) => {
  try {
    const result = await db.confirmMilestoneSponsorship(req.params.id, req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ============================================================================
// 30. VERIFIED CONTRIBUTION PASSPORT
// ============================================================================
app.get('/api/volunteer-passports/:userId', async (req, res) => {
  try {
    const passport = await db.getVolunteerPassport(req.params.userId);
    res.json(passport);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/volunteer-passports/:userId/privacy', async (req, res) => {
  try {
    const { privacy_level } = req.body;
    const passport = await db.updateVolunteerPassportPrivacy(req.params.userId, privacy_level);
    res.json(passport);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ============================================================================
// 31. SMART DOCUMENT CHECKLIST
// ============================================================================
app.get('/api/ngo-compliance/:ngoId', async (req, res) => {
  try {
    const docs = await db.getNgoComplianceDocuments(req.params.ngoId);
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/ngo-compliance/:ngoId/upload', async (req, res) => {
  try {
    const doc = await db.uploadNgoComplianceDocument(req.params.ngoId, req.body);
    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.patch('/api/ngo-compliance/:docId/review', async (req, res) => {
  try {
    const { status, review_notes, reviewer_name } = req.body;
    const doc = await db.reviewNgoComplianceDocument(req.params.docId, status, review_notes, reviewer_name);
    res.json(doc);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ============================================================================
// 32. CROSS-NGO COLLABORATION ROOMS
// ============================================================================
app.get('/api/cross-ngo-rooms', async (req, res) => {
  try {
    const rooms = await db.getCrossNgoRooms(req.query.ngo_id);
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/cross-ngo-rooms', async (req, res) => {
  try {
    const room = await db.createCrossNgoRoom(req.body);
    res.status(201).json(room);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/cross-ngo-rooms/:id/milestones', async (req, res) => {
  try {
    const ms = await db.addMilestoneToCrossNgoRoom(req.params.id, req.body);
    res.status(201).json(ms);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ============================================================================
// 33. LONG-TERM IMPACT FOLLOW-UP
// ============================================================================
app.get('/api/long-term-followups', async (req, res) => {
  try {
    const followups = await db.getLongTermFollowups(req.query.project_id);
    res.json(followups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/long-term-followups/:projectId', async (req, res) => {
  try {
    const followup = await db.submitLongTermFollowup(req.params.projectId, req.body);
    res.status(201).json(followup);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.patch('/api/long-term-followups/:id/verify', async (req, res) => {
  try {
    const result = await db.verifyLongTermFollowup(req.params.id, req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/reset-demo', async (req, res) => {
  try {
    await db.resetDemoData();
    res.json({ success: true, message: 'Platform data restored to default demo state.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Production static assets & SPA fallback with anti-stale caching
if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR, {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
      }
    }
  }));
  app.use((req, res) => {
    if (!req.path.startsWith('/api')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      res.sendFile(path.join(DIST_DIR, 'index.html'));
    }
  });
}

if (require.main === module && !process.env.VERCEL) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`=======================================================`);
    console.log(`🌍 ImpactConnect Server running on http://localhost:${PORT}`);
    console.log(`Connecting People. Creating Impact.`);
    console.log(`=======================================================`);
  });
}

module.exports = app;
