/**
 * ImpactConnect - API Client
 */

const API_BASE = '/api';

export async function fetchHealth() {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error('Health check failed');
  return res.json();
}

export async function fetchStats() {
  const res = await fetch(`${API_BASE}/stats`);
  if (!res.ok) throw new Error('Failed to fetch stats');
  return res.json();
}

// Authentication
export async function loginUser(email) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Login failed');
  }
  return res.json();
}

export async function registerUser(userData) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Registration failed');
  }
  return res.json();
}

export async function fetchDemoUsers() {
  const res = await fetch(`${API_BASE}/auth/users`);
  if (!res.ok) return [];
  return res.json();
}

export async function toggleFavorite(userId, projectId) {
  const res = await fetch(`${API_BASE}/favorites/toggle`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, project_id: projectId })
  });
  if (!res.ok) throw new Error('Failed to toggle favorite');
  return res.json();
}

// Projects
export async function fetchProjects(filters = {}) {
  const params = new URLSearchParams();
  if (filters.cause && filters.cause !== 'all') params.append('cause', filters.cause);
  if (filters.sdg && filters.sdg !== 'all') params.append('sdg', filters.sdg);
  if (filters.location && filters.location !== 'all') params.append('location', filters.location);
  if (filters.requirementType && filters.requirementType !== 'all') params.append('requirementType', filters.requirementType);
  if (filters.urgency && filters.urgency !== 'all') params.append('urgency', filters.urgency);
  if (filters.search) params.append('search', filters.search);
  if (filters.ngo_id) params.append('ngo_id', filters.ngo_id);
  if (filters.sort) params.append('sort', filters.sort);

  const res = await fetch(`${API_BASE}/projects?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch projects');
  return res.json();
}

export async function fetchProjectById(id) {
  const res = await fetch(`${API_BASE}/projects/${id}`);
  if (!res.ok) throw new Error('Failed to fetch project');
  return res.json();
}

export async function createProject(projectData) {
  const res = await fetch(`${API_BASE}/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(projectData)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to create project');
  }
  return res.json();
}

export async function updateProject(id, projectData) {
  const res = await fetch(`${API_BASE}/projects/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(projectData)
  });
  if (!res.ok) throw new Error('Failed to update project');
  return res.json();
}

export async function deleteProject(id) {
  const res = await fetch(`${API_BASE}/projects/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete project');
  return res.json();
}

// NGOs
export async function fetchNgos(filters = {}) {
  const params = new URLSearchParams();
  if (filters.category && filters.category !== 'all') params.append('category', filters.category);
  if (filters.country && filters.country !== 'all') params.append('country', filters.country);
  if (filters.search) params.append('search', filters.search);

  const res = await fetch(`${API_BASE}/ngos?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch NGOs');
  return res.json();
}

export async function fetchNgoById(id) {
  const res = await fetch(`${API_BASE}/ngos/${id}`);
  if (!res.ok) throw new Error('Failed to fetch NGO');
  return res.json();
}

export async function updateNgo(id, ngoData) {
  const res = await fetch(`${API_BASE}/ngos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ngoData)
  });
  if (!res.ok) throw new Error('Failed to update organization profile');
  return res.json();
}

export async function verifyNgo(id, isVerified, tier = 'Gold Certified') {
  const res = await fetch(`${API_BASE}/ngos/${id}/verify`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ is_verified: isVerified, verification_tier: tier })
  });
  if (!res.ok) throw new Error('Failed to verify NGO');
  return res.json();
}

// Partnerships
export async function sendPartnershipRequest(requestData) {
  const res = await fetch(`${API_BASE}/partnership-requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestData)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to submit proposal');
  }
  return res.json();
}

export async function fetchPartnershipRequests(filters = {}) {
  const params = new URLSearchParams();
  if (filters.ngo_id) params.append('ngo_id', filters.ngo_id);
  if (filters.project_id) params.append('project_id', filters.project_id);
  if (filters.supporter_id) params.append('supporter_id', filters.supporter_id);
  if (filters.supporter_email) params.append('supporter_email', filters.supporter_email);
  if (filters.status && filters.status !== 'all') params.append('status', filters.status);

  const res = await fetch(`${API_BASE}/partnership-requests?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch partnership requests');
  return res.json();
}

export async function updatePartnershipStatus(requestId, status, note = '') {
  const res = await fetch(`${API_BASE}/partnership-requests/${requestId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, note })
  });
  if (!res.ok) throw new Error('Failed to update status');
  return res.json();
}

export async function fetchAiMatches(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/ai-matches?${query}`);
  if (!res.ok) throw new Error('Failed to get smart matches');
  return res.json();
}

// Volunteer & Skills Marketplace
export async function fetchVolunteerRoles(filters = {}) {
  const params = new URLSearchParams();
  if (filters.cause && filters.cause !== 'all') params.append('cause', filters.cause);
  if (filters.is_remote) params.append('is_remote', filters.is_remote);
  if (filters.search) params.append('search', filters.search);
  const res = await fetch(`${API_BASE}/volunteer-roles?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch volunteer roles');
  return res.json();
}

export async function createVolunteerRole(roleData) {
  const res = await fetch(`${API_BASE}/volunteer-roles`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(roleData)
  });
  if (!res.ok) throw new Error('Failed to create volunteer role');
  return res.json();
}

export async function fetchVolunteerApplications(filters = {}) {
  const params = new URLSearchParams();
  if (filters.ngo_id) params.append('ngo_id', filters.ngo_id);
  if (filters.applicant_email) params.append('applicant_email', filters.applicant_email);
  const res = await fetch(`${API_BASE}/volunteer-applications?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch volunteer applications');
  return res.json();
}

export async function applyVolunteerRole(applicationData) {
  const res = await fetch(`${API_BASE}/volunteer-applications`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(applicationData)
  });
  if (!res.ok) throw new Error('Failed to submit volunteer application');
  return res.json();
}

export async function updateVolunteerApplicationStatus(appId, status) {
  const res = await fetch(`${API_BASE}/volunteer-applications/${appId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  if (!res.ok) throw new Error('Failed to update application status');
  return res.json();
}

// Corporate CSR RFPs & Grants
export async function fetchCsrRfps() {
  const res = await fetch(`${API_BASE}/csr-rfps`);
  if (!res.ok) throw new Error('Failed to fetch CSR RFPs');
  return res.json();
}

export async function createCsrRfp(rfpData) {
  const res = await fetch(`${API_BASE}/csr-rfps`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(rfpData)
  });
  if (!res.ok) throw new Error('Failed to create CSR RFP');
  return res.json();
}

// Verification Requests & Trust Safety
export async function fetchVerificationRequests() {
  const res = await fetch(`${API_BASE}/verification-requests`);
  if (!res.ok) throw new Error('Failed to fetch verification requests');
  return res.json();
}

export async function submitVerificationRequest(data) {
  const res = await fetch(`${API_BASE}/verification-requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to submit verification request');
  return res.json();
}

export async function reviewVerificationRequest(id, reviewData) {
  const res = await fetch(`${API_BASE}/verification-requests/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reviewData)
  });
  if (!res.ok) throw new Error('Failed to review verification');
  return res.json();
}

// Reports & Moderation
export async function submitReport(reportData) {
  const res = await fetch(`${API_BASE}/reports`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reportData)
  });
  if (!res.ok) throw new Error('Failed to submit report');
  return res.json();
}

export async function fetchReports() {
  const res = await fetch(`${API_BASE}/reports`);
  if (!res.ok) throw new Error('Failed to fetch reports');
  return res.json();
}

// Milestones & Workspace Messaging
export async function fetchProjectMilestones(projectId) {
  const res = await fetch(`${API_BASE}/projects/${projectId}/milestones`);
  if (!res.ok) throw new Error('Failed to fetch project milestones');
  return res.json();
}

export async function updateMilestone(milestoneId, data) {
  const res = await fetch(`${API_BASE}/milestones/${milestoneId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to update milestone');
  return res.json();
}

export async function fetchPartnershipMessages(partnershipId) {
  const res = await fetch(`${API_BASE}/partnerships/${partnershipId}/messages`);
  if (!res.ok) throw new Error('Failed to fetch messages');
  return res.json();
}

export async function sendPartnershipMessage(partnershipId, messageData) {
  const res = await fetch(`${API_BASE}/partnerships/${partnershipId}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(messageData)
  });
  if (!res.ok) throw new Error('Failed to send message');
  return res.json();
}

export async function fetchContributions(projectId = null) {
  const url = projectId ? `${API_BASE}/contributions?project_id=${projectId}` : `${API_BASE}/contributions`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch contributions');
  return res.json();
}

// 1. IMPACT AI ASSISTANT
export async function parseNgoRequirement(prompt) {
  const res = await fetch(`${API_BASE}/ai/parse-requirement`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to parse requirements');
  }
  return res.json();
}

// 2. RESOURCE EXCHANGE HUB
export async function fetchResourceItems(filters = {}) {
  const params = new URLSearchParams();
  if (filters.type && filters.type !== 'all') params.append('type', filters.type);
  if (filters.category && filters.category !== 'all') params.append('category', filters.category);
  if (filters.status && filters.status !== 'all') params.append('status', filters.status);
  if (filters.search) params.append('search', filters.search);
  const res = await fetch(`${API_BASE}/resources?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch resource items');
  return res.json();
}

export async function createResourceItem(data) {
  const res = await fetch(`${API_BASE}/resources`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to list resource item');
  return res.json();
}

export async function claimResourceItem(resourceId, claimData) {
  const res = await fetch(`${API_BASE}/resources/${resourceId}/claim`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(claimData)
  });
  if (!res.ok) throw new Error('Failed to claim resource item');
  return res.json();
}

export async function updateClaimStatus(claimId, status, trackingNotes = '') {
  const res = await fetch(`${API_BASE}/resource-claims/${claimId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, tracking_notes: trackingNotes })
  });
  if (!res.ok) throw new Error('Failed to update claim status');
  return res.json();
}

export async function fetchResourceClaims(filters = {}) {
  const params = new URLSearchParams();
  if (filters.resource_id) params.append('resource_id', filters.resource_id);
  if (filters.requester_email) params.append('requester_email', filters.requester_email);
  const res = await fetch(`${API_BASE}/resource-claims?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch resource claims');
  return res.json();
}

// 3. URGENT COMMUNITY NEEDS
export async function fetchUrgentNeeds(filters = {}) {
  const params = new URLSearchParams();
  if (filters.cause && filters.cause !== 'all') params.append('cause', filters.cause);
  if (filters.urgency && filters.urgency !== 'all') params.append('urgency', filters.urgency);
  if (filters.status && filters.status !== 'all') params.append('status', filters.status);
  if (filters.location && filters.location !== 'all') params.append('location', filters.location);
  const res = await fetch(`${API_BASE}/urgent-needs?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch urgent needs');
  return res.json();
}

export async function createUrgentNeed(data) {
  const res = await fetch(`${API_BASE}/urgent-needs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to create urgent need');
  return res.json();
}

export async function pledgeUrgentNeed(needId, pledgeData) {
  const res = await fetch(`${API_BASE}/urgent-needs/${needId}/pledge`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pledgeData)
  });
  if (!res.ok) throw new Error('Failed to pledge support');
  return res.json();
}

export async function fetchUrgentPledges(needId) {
  const res = await fetch(`${API_BASE}/urgent-needs/${needId}/pledges`);
  if (!res.ok) throw new Error('Failed to fetch pledges');
  return res.json();
}

// 4. PARTNERSHIP PERFORMANCE & REVIEWS
export async function fetchPartnershipReviews(filters = {}) {
  const params = new URLSearchParams();
  if (filters.project_id) params.append('project_id', filters.project_id);
  if (filters.partnership_id) params.append('partnership_id', filters.partnership_id);
  const res = await fetch(`${API_BASE}/partnership-reviews?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch partnership reviews');
  return res.json();
}

export async function submitPartnershipReview(reviewData) {
  const res = await fetch(`${API_BASE}/partnership-reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reviewData)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to submit partnership review');
  }
  return res.json();
}

export async function fetchPerformanceIndicators(id) {
  const res = await fetch(`${API_BASE}/performance-indicators/${id}`);
  if (!res.ok) throw new Error('Failed to fetch performance indicators');
  return res.json();
}

// 5. GRANTS AND CSR DIRECTORY
export async function fetchGrantsDirectory(filters = {}) {
  const params = new URLSearchParams();
  if (filters.cause && filters.cause !== 'all') params.append('cause', filters.cause);
  if (filters.funder_type && filters.funder_type !== 'all') params.append('funder_type', filters.funder_type);
  if (filters.search) params.append('search', filters.search);
  const res = await fetch(`${API_BASE}/grants-directory?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch grants directory');
  return res.json();
}

export async function createGrantOpportunity(data) {
  const res = await fetch(`${API_BASE}/grants-directory`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to create grant listing');
  return res.json();
}

// 6. VOLUNTEER QR ATTENDANCE
export async function fetchVolunteerAttendance(filters = {}) {
  const params = new URLSearchParams();
  if (filters.event_id) params.append('event_id', filters.event_id);
  if (filters.project_id) params.append('project_id', filters.project_id);
  if (filters.volunteer_email) params.append('volunteer_email', filters.volunteer_email);
  const res = await fetch(`${API_BASE}/volunteer-attendance?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch attendance');
  return res.json();
}

export async function checkInVolunteer(data) {
  const res = await fetch(`${API_BASE}/volunteer-attendance/check-in`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to record volunteer check-in');
  }
  return res.json();
}

// 7. PROJECT FOLLOWING & LIVE ACTIVITY FEED
export async function toggleProjectFollow(projectId, userId) {
  const res = await fetch(`${API_BASE}/projects/${projectId}/follow`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId })
  });
  if (!res.ok) throw new Error('Failed to toggle project follow');
  return res.json();
}

export async function fetchUserFollows(userId) {
  const res = await fetch(`${API_BASE}/users/${userId}/follows`);
  if (!res.ok) return [];
  return res.json();
}

export async function fetchActivityFeed(filters = {}) {
  const params = new URLSearchParams();
  if (filters.project_id) params.append('project_id', filters.project_id);
  const res = await fetch(`${API_BASE}/activity-feed?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch activity feed');
  return res.json();
}

// 8. PERSONALIZED IMPACT FEED & SAVED PROJECTS
export async function fetchPersonalizedFeed(params = {}) {
  const q = new URLSearchParams();
  if (params.userId) q.append('userId', params.userId);
  if (params.causes) q.append('causes', Array.isArray(params.causes) ? params.causes.join(',') : params.causes);
  if (params.location) q.append('location', params.location);
  if (params.skills) q.append('skills', Array.isArray(params.skills) ? params.skills.join(',') : params.skills);
  if (params.resources) q.append('resources', Array.isArray(params.resources) ? params.resources.join(',') : params.resources);
  if (params.followedNgos) q.append('followedNgos', Array.isArray(params.followedNgos) ? params.followedNgos.join(',') : params.followedNgos);

  const res = await fetch(`${API_BASE}/projects/personalized?${q.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch personalized feed');
  return res.json();
}

export async function fetchSavedProjects(userId) {
  const res = await fetch(`${API_BASE}/projects/saved?userId=${encodeURIComponent(userId)}`);
  if (!res.ok) throw new Error('Failed to fetch saved projects');
  return res.json();
}

export async function toggleSaveProject(projectId, userId, notes = '') {
  const res = await fetch(`${API_BASE}/projects/${projectId}/save`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, notes })
  });
  if (!res.ok) throw new Error('Failed to toggle save project');
  return res.json();
}

// 9. SMART AVAILABILITY CALENDAR & SHIFTS
export async function fetchVolunteerShifts(filters = {}) {
  const params = new URLSearchParams();
  if (filters.ngo_id) params.append('ngo_id', filters.ngo_id);
  if (filters.project_id) params.append('project_id', filters.project_id);
  if (filters.status && filters.status !== 'all') params.append('status', filters.status);
  if (filters.category && filters.category !== 'all') params.append('category', filters.category);
  if (filters.date) params.append('date', filters.date);

  const res = await fetch(`${API_BASE}/volunteer-shifts?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch volunteer shifts');
  return res.json();
}

export async function createVolunteerShift(shiftData) {
  const res = await fetch(`${API_BASE}/volunteer-shifts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(shiftData)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to create volunteer shift');
  }
  return res.json();
}

export async function registerForShift(shiftId, regData) {
  const res = await fetch(`${API_BASE}/volunteer-shifts/${shiftId}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(regData)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to register for shift');
  }
  return res.json();
}

export async function fetchUserShiftCommitments(volunteerEmail) {
  const res = await fetch(`${API_BASE}/volunteer-shifts/commitments?volunteer_email=${encodeURIComponent(volunteerEmail)}`);
  if (!res.ok) throw new Error('Failed to fetch commitments');
  return res.json();
}

// 10. UN SDG MAPPING & CAUSE ANALYTICS
export async function fetchSdgMappingAnalytics() {
  const res = await fetch(`${API_BASE}/analytics/sdg-mapping`);
  if (!res.ok) throw new Error('Failed to fetch SDG analytics');
  return res.json();
}

// 11. SMART NOTIFICATIONS
export async function fetchNotifications(recipientEmail, userId) {
  const params = new URLSearchParams();
  if (recipientEmail) params.append('recipient_email', recipientEmail);
  if (userId) params.append('user_id', userId);

  const res = await fetch(`${API_BASE}/notifications?${params.toString()}`);
  if (!res.ok) return { notifications: [], unreadCount: 0 };
  return res.json();
}

export async function markNotificationAsRead(id) {
  const res = await fetch(`${API_BASE}/notifications/${id}/read`, { method: 'PATCH' });
  if (!res.ok) throw new Error('Failed to mark read');
  return res.json();
}

export async function markAllNotificationsAsRead(recipientEmail) {
  const res = await fetch(`${API_BASE}/notifications/mark-all-read`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ recipient_email: recipientEmail })
  });
  if (!res.ok) throw new Error('Failed to mark all read');
  return res.json();
}

export async function fetchNotificationPreferences(userId) {
  const res = await fetch(`${API_BASE}/notifications/preferences?user_id=${encodeURIComponent(userId)}`);
  if (!res.ok) return null;
  return res.json();
}

export async function updateNotificationPreferences(userId, data) {
  const res = await fetch(`${API_BASE}/notifications/preferences`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, ...data })
  });
  if (!res.ok) throw new Error('Failed to update notification preferences');
  return res.json();
}

// 12. PARTNERSHIP AGREEMENT DRAFT GENERATOR
export async function fetchPartnershipAgreement(partnershipId) {
  const res = await fetch(`${API_BASE}/partnership-agreements/${partnershipId}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to fetch agreement draft');
  }
  return res.json();
}

export async function savePartnershipAgreement(data) {
  const res = await fetch(`${API_BASE}/partnership-agreements`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to save agreement draft');
  return res.json();
}

export async function acknowledgePartnershipAgreement(agreementId, role, actorName) {
  const res = await fetch(`${API_BASE}/partnership-agreements/${agreementId}/acknowledge`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role, actor_name: actorName })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to acknowledge agreement');
  }
  return res.json();
}

// 13. PROJECT TRANSPARENCY TIMELINE
export async function fetchProjectTransparencyTimeline(projectId) {
  const res = await fetch(`${API_BASE}/projects/${projectId}/transparency-timeline`);
  if (!res.ok) throw new Error('Failed to fetch transparency timeline');
  return res.json();
}

export async function logProjectTransparencyEvent(projectId, data) {
  const res = await fetch(`${API_BASE}/projects/${projectId}/transparency-timeline`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to log audit event');
  return res.json();
}

// 14. NEED-TO-ACTION CONVERTER
export async function convertNeedToAction(prompt, ngoInfo = {}) {
  const res = await fetch(`${API_BASE}/need-to-action/convert`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, ngo_info: ngoInfo })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to convert need statement');
  }
  return res.json();
}

export async function publishNeedToAction(campaignData) {
  const res = await fetch(`${API_BASE}/need-to-action/publish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(campaignData)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to publish campaign');
  }
  return res.json();
}

// 15. COLLECTIVE ACTION CAMPAIGNS
export async function fetchCollectiveCampaigns(filters = {}) {
  const params = new URLSearchParams();
  if (filters.cause && filters.cause !== 'all') params.append('cause', filters.cause);
  if (filters.status && filters.status !== 'all') params.append('status', filters.status);
  const res = await fetch(`${API_BASE}/collective-campaigns?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch collective campaigns');
  return res.json();
}

export async function pledgeCollectiveCampaign(campaignId, pledgeData) {
  const res = await fetch(`${API_BASE}/collective-campaigns/${campaignId}/pledge`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pledgeData)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to record pledge');
  }
  return res.json();
}

export async function confirmCollectiveDelivery(campaignId, pledgeId) {
  const res = await fetch(`${API_BASE}/collective-campaigns/${campaignId}/confirm-delivery`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pledge_id: pledgeId })
  });
  if (!res.ok) throw new Error('Failed to confirm delivery');
  return res.json();
}

// 16. EMPLOYEE VOLUNTEERING PORTAL
export async function fetchEmployeeVolunteeringPrograms(filters = {}) {
  const params = new URLSearchParams();
  if (filters.company_domain) params.append('company_domain', filters.company_domain);
  const res = await fetch(`${API_BASE}/employee-volunteering/programs?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch employee volunteering programs');
  return res.json();
}

export async function registerForEmployeeProgram(programId, regData) {
  const res = await fetch(`${API_BASE}/employee-volunteering/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ program_id: programId, ...regData })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to register for corporate program');
  }
  return res.json();
}

export async function fetchEmployeeVolunteeringMetrics(companyDomain) {
  const params = new URLSearchParams();
  if (companyDomain) params.append('company_domain', companyDomain);
  const res = await fetch(`${API_BASE}/employee-volunteering/metrics?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch corporate metrics');
  return res.json();
}

// 17. DONATION DELIVERY TRACKING
export async function fetchDonationDeliveries(filters = {}) {
  const params = new URLSearchParams();
  if (filters.status && filters.status !== 'all') params.append('status', filters.status);
  if (filters.donor_email) params.append('donor_email', filters.donor_email);
  if (filters.recipient_ngo_id) params.append('recipient_ngo_id', filters.recipient_ngo_id);
  const res = await fetch(`${API_BASE}/delivery-tracking?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch donation deliveries');
  return res.json();
}

export async function advanceDonationDelivery(deliveryId, data) {
  const res = await fetch(`${API_BASE}/delivery-tracking/${deliveryId}/advance-status`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to advance delivery status');
  }
  return res.json();
}

// 18. EXPERT MENTORSHIP NETWORK
export async function fetchExpertMentors(filters = {}) {
  const params = new URLSearchParams();
  if (filters.search) params.append('search', filters.search);
  const res = await fetch(`${API_BASE}/mentors?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch mentors');
  return res.json();
}

export async function bookMentorshipSession(mentorId, sessionData) {
  const res = await fetch(`${API_BASE}/mentors/${mentorId}/book-session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(sessionData)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to book mentorship session');
  }
  return res.json();
}

export async function fetchMentorshipSessions(filters = {}) {
  const params = new URLSearchParams();
  if (filters.ngo_id) params.append('ngo_id', filters.ngo_id);
  if (filters.mentor_id) params.append('mentor_id', filters.mentor_id);
  const res = await fetch(`${API_BASE}/mentorship-sessions?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch mentorship sessions');
  return res.json();
}

export async function completeMentorshipSession(sessionId, data) {
  const res = await fetch(`${API_BASE}/mentorship-sessions/${sessionId}/complete`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to complete session');
  return res.json();
}

// 19. BEFORE-AND-AFTER IMPACT STORIES
export async function fetchImpactStories(filters = {}) {
  const params = new URLSearchParams();
  if (filters.cause && filters.cause !== 'all') params.append('cause', filters.cause);
  const res = await fetch(`${API_BASE}/impact-stories?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch impact stories');
  return res.json();
}

export async function publishImpactStory(data) {
  const res = await fetch(`${API_BASE}/impact-stories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to publish impact story');
  }
  return res.json();
}

// 20. PROJECT RISK ALERTS
export async function fetchRiskAlerts() {
  const res = await fetch(`${API_BASE}/risk-alerts`);
  if (!res.ok) throw new Error('Failed to fetch risk alerts');
  return res.json();
}

export async function resolveRiskAlert(alertId, resolutionNotes = '', actorName = '') {
  const res = await fetch(`${API_BASE}/risk-alerts/${alertId}/resolve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resolution_notes: resolutionNotes, actor_name: actorName })
  });
  if (!res.ok) throw new Error('Failed to resolve risk alert');
  return res.json();
}

// 21. CSR EVIDENCE PACK
export async function fetchCsrEvidencePack(projectId) {
  const res = await fetch(`${API_BASE}/csr-evidence-pack/${projectId}`);
  if (!res.ok) throw new Error('Failed to fetch CSR evidence pack');
  return res.json();
}

// 22. COLLABORATION NETWORK GRAPH
export async function fetchCollaborationGraph() {
  const res = await fetch(`${API_BASE}/collaboration-graph`);
  if (!res.ok) throw new Error('Failed to fetch collaboration network graph');
  return res.json();
}

// 23. COMMUNITY NEEDS HEATMAP
export async function fetchCommunityNeedsHeatmap(filters = {}) {
  const params = new URLSearchParams();
  if (filters.cause && filters.cause !== 'all') params.append('cause', filters.cause);
  if (filters.urgency && filters.urgency !== 'all') params.append('urgency', filters.urgency);
  if (filters.status && filters.status !== 'all') params.append('status', filters.status);
  const res = await fetch(`${API_BASE}/community-needs/heatmap?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch community needs heatmap');
  return res.json();
}

export async function reportCommunityNeed(data) {
  const res = await fetch(`${API_BASE}/community-needs/report`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to submit community need report');
  }
  return res.json();
}

// 24. MICRO-VOLUNTEERING MARKETPLACE
export async function fetchMicroTasks(filters = {}) {
  const params = new URLSearchParams();
  if (filters.cause && filters.cause !== 'all') params.append('cause', filters.cause);
  if (filters.is_remote !== undefined && filters.is_remote !== 'all') params.append('is_remote', filters.is_remote);
  if (filters.status && filters.status !== 'all') params.append('status', filters.status);
  const res = await fetch(`${API_BASE}/micro-tasks?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch micro-tasks');
  return res.json();
}

export async function applyForMicroTask(taskId, data) {
  const res = await fetch(`${API_BASE}/micro-tasks/${taskId}/apply`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to apply for micro-task');
  }
  return res.json();
}

export async function submitMicroTaskWork(taskId, data) {
  const res = await fetch(`${API_BASE}/micro-tasks/${taskId}/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to submit work for micro-task');
  }
  return res.json();
}

export async function reviewMicroTask(taskId, data) {
  const res = await fetch(`${API_BASE}/micro-tasks/${taskId}/review`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to review micro-task submission');
  return res.json();
}

// 25. PARTNERSHIP COMPATIBILITY CHECKER
export async function checkPartnershipCompatibility(ngoId, partnerData) {
  const res = await fetch(`${API_BASE}/partnerships/compatibility-check`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ngo_id: ngoId, partner_data: partnerData })
  });
  if (!res.ok) throw new Error('Failed to calculate compatibility score');
  return res.json();
}

// 26. MILESTONE-BASED SPONSORSHIP
export async function fetchMilestoneSponsorships(projectId) {
  const res = await fetch(`${API_BASE}/milestone-sponsorships?project_id=${encodeURIComponent(projectId || '')}`);
  if (!res.ok) throw new Error('Failed to fetch milestone sponsorships');
  return res.json();
}

export async function pledgeMilestoneSponsorship(milestoneId, data) {
  const res = await fetch(`${API_BASE}/milestone-sponsorships/${milestoneId}/pledge`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to pledge milestone sponsorship');
  return res.json();
}

export async function confirmMilestoneSponsorship(sponsorshipId, data) {
  const res = await fetch(`${API_BASE}/milestone-sponsorships/${sponsorshipId}/confirm`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to confirm milestone sponsorship');
  return res.json();
}

// 27. VERIFIED CONTRIBUTION PASSPORT
export async function fetchVolunteerPassport(userId) {
  const res = await fetch(`${API_BASE}/volunteer-passports/${encodeURIComponent(userId || 'user-supp-1')}`);
  if (!res.ok) throw new Error('Failed to fetch volunteer passport');
  return res.json();
}

export async function updateVolunteerPassportPrivacy(userId, privacyLevel) {
  const res = await fetch(`${API_BASE}/volunteer-passports/${encodeURIComponent(userId || 'user-supp-1')}/privacy`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ privacy_level: privacyLevel })
  });
  if (!res.ok) throw new Error('Failed to update passport privacy');
  return res.json();
}

// 28. SMART DOCUMENT CHECKLIST
export async function fetchNgoComplianceDocs(ngoId) {
  const res = await fetch(`${API_BASE}/ngo-compliance/${encodeURIComponent(ngoId || 'ngo-1')}`);
  if (!res.ok) throw new Error('Failed to fetch NGO compliance documents');
  return res.json();
}

export async function uploadNgoComplianceDoc(ngoId, data) {
  const res = await fetch(`${API_BASE}/ngo-compliance/${encodeURIComponent(ngoId || 'ngo-1')}/upload`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to upload compliance document');
  return res.json();
}

export async function reviewNgoComplianceDoc(docId, data) {
  const res = await fetch(`${API_BASE}/ngo-compliance/${encodeURIComponent(docId)}/review`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to review compliance document');
  return res.json();
}

// 29. CROSS-NGO COLLABORATION ROOMS
export async function fetchCrossNgoRooms(ngoId) {
  const params = new URLSearchParams();
  if (ngoId) params.append('ngo_id', ngoId);
  const res = await fetch(`${API_BASE}/cross-ngo-rooms?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch collaboration rooms');
  return res.json();
}

export async function createCrossNgoRoom(data) {
  const res = await fetch(`${API_BASE}/cross-ngo-rooms`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to create cross-NGO room');
  return res.json();
}

export async function addCrossNgoMilestone(roomId, data) {
  const res = await fetch(`${API_BASE}/cross-ngo-rooms/${roomId}/milestones`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to add milestone to collaboration room');
  return res.json();
}

// 30. LONG-TERM IMPACT FOLLOW-UP
export async function fetchLongTermFollowups(projectId) {
  const res = await fetch(`${API_BASE}/long-term-followups?project_id=${encodeURIComponent(projectId || '')}`);
  if (!res.ok) throw new Error('Failed to fetch long-term followups');
  return res.json();
}

export async function submitLongTermFollowup(projectId, data) {
  const res = await fetch(`${API_BASE}/long-term-followups/${encodeURIComponent(projectId || 'proj-1')}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to submit long-term followup');
  return res.json();
}

export async function verifyLongTermFollowup(followupId, data) {
  const res = await fetch(`${API_BASE}/long-term-followups/${followupId}/verify`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to verify long-term followup');
  return res.json();
}

export async function resetDemo() {
  const res = await fetch(`${API_BASE}/reset-demo`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to reset demo');
  return res.json();
}
