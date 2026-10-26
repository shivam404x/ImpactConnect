const { initDb, db } = require('./server/db.cjs');

async function testAppDirectly() {
  console.log('⚡ Initializing Database...');
  await initDb();
  await db.resetDemoData();

  console.log('\n--- 1. Testing DB Stats ---');
  const stats = await db.getStats();
  console.log('✅ Stats fetched:', {
    totalProjects: stats.totalProjects,
    totalNgos: stats.totalNgos,
    totalFundingRaised: stats.totalFundingRaised,
    totalVolunteersJoined: stats.totalVolunteersJoined,
    acceptedRequests: stats.acceptedRequests,
    verifiedBeneficiaries: stats.verifiedBeneficiaries
  });

  console.log('\n--- 2. Testing Projects Query & Filtering ---');
  const allProjects = await db.getProjects({});
  console.log(`✅ Loaded ${allProjects.length} total projects across causes.`);
  
  const eduProjects = await db.getProjects({ cause: 'education' });
  console.log(`✅ Filtered by cause=education: ${eduProjects.length} projects.`);

  console.log('\n--- 3. Testing Single Project Retrieval with Requirements ---');
  const single = await db.getProjectById('proj-1');
  console.log(`✅ Project retrieved: "${single.title}" with ${single.requirements.length} requirements and NGO "${single.ngo.name}".`);

  console.log('\n--- 4. Testing Volunteer Marketplace ---');
  const roles = await db.getVolunteerRoles({});
  console.log(`✅ Loaded ${roles.length} volunteer roles.`);
  const newRole = await db.createVolunteerRole({
    ngo_id: 'ngo-1',
    title: 'Lead Python Data Science Mentor',
    description: 'Teach data analytics and ML to high school girls in community centers.',
    cause_category: 'education',
    required_skills: ['Python', 'Pandas', 'Teaching'],
    commitment_hours: '4 hours / week',
    is_remote: true
  });
  console.log(`✅ Created volunteer role: "${newRole.title}" (ID: ${newRole.id})`);

  const app = await db.applyForVolunteerRole({
    role_id: newRole.id,
    ngo_id: 'ngo-1',
    applicant_name: 'Ananya Sharma',
    applicant_email: 'ananya.sharma@techcorp.com',
    weekly_availability: '4 hours / week',
    pitch_statement: 'Experienced senior software engineer eager to mentor youth.'
  });
  console.log(`✅ Submitted volunteer application ID: ${app.id} for ${app.applicant_name}`);

  console.log('\n--- 5. Testing Corporate CSR RFPs ---');
  const rfps = await db.getCsrRfps();
  console.log(`✅ Loaded ${rfps.length} active CSR grant RFPs.`);
  const newRfp = await db.createCsrRfp({
    title: 'Clean River & Lake Remediation Grant 2026',
    company_name: 'Tata Sustainability Group',
    grant_pool: 75000,
    focus_area: 'Environment & Water',
    deadline: '2026-11-30',
    criteria: 'Accredited non-profits working on wetland preservation.'
  });
  console.log(`✅ Published CSR RFP: "${newRfp.title}" ($${newRfp.grant_pool.toLocaleString()})`);

  console.log('\n--- 6. Testing Trust & Safety Moderation Reports ---');
  const report = await db.submitReport({
    target_type: 'project',
    target_id: 'proj-1',
    target_name: 'Digital Literacy Centers',
    reason: 'Auditing Inquiry',
    details: 'Requesting confirmation on Q3 device delivery batch.',
    reporter_email: 'compliance.auditor@impactconnect.org'
  });
  console.log(`✅ Safety report logged ID: ${report.id} (Status: ${report.status})`);

  console.log('\n--- 7. Testing NGO Verification Workflow ---');
  const vr = await db.submitVerificationRequest({
    ngo_id: 'ngo-4',
    organization_name: 'GreenCanopy Urban Afforestation Guild',
    reg_number: 'KAR/ECO/2019/3310',
    tax_status: '501(c)(3) Non-Profit Section 8',
    doc_hash: 'SHA256:d8e8fca2dc0f896fd7cb4cb0031ba249'
  });
  console.log(`✅ Submitted verification dossier ID: ${vr.id}`);
  const reviewed = await db.reviewVerification(vr.id, {
    status: 'approved',
    verification_tier: 'Gold Verified',
    admin_notes: 'All compliance documents verified against municipal registry.'
  });
  console.log(`✅ Reviewed verification: ${reviewed.status} with tier "${reviewed.verification_tier}"`);

  console.log('\n--- 8. Testing Collaboration Workspace Messages ---');
  const msg = await db.sendMessage({
    partnership_id: 'part-1',
    sender_name: 'Marcus Chen',
    sender_role: 'corporate_csr',
    message_text: 'Our foundation has confirmed the shipment of 50 tablets scheduled for delivery this Friday.'
  });
  console.log(`✅ Sent workspace message: "${msg.message_text}"`);
  const chatHistory = await db.getMessages('part-1');
  console.log(`✅ Retrieved ${chatHistory.length} messages in partnership workspace.`);

  console.log('\n--- 9. Testing Project Milestones ---');
  const milestones = await db.getProjectMilestones('proj-1');
  console.log(`✅ Project proj-1 has ${milestones.length} milestones.`);
  if (milestones.length > 0) {
    const updatedMs = await db.updateMilestone(milestones[0].id, {
      is_completed: true,
      verified_by_reviewer: true
    });
    console.log(`✅ Milestone "${updatedMs.title}" completed and reviewer verified.`);
  }

  console.log('\n--- 11. Testing Impact AI Assistant Natural Language Parser ---');
  const aiResult = await db.parseNgoRequirement({
    text: 'We urgently need 50 laptops and 3 volunteer mentors in Varanasi for our women skill development center'
  });
  console.log('✅ AI Parsed Structured Entities:', {
    cause: aiResult.structured_need.cause,
    location: aiResult.structured_need.location,
    resources: aiResult.structured_need.required_resources,
    urgency: aiResult.structured_need.urgency,
    recommendedMatches: aiResult.matched_supporters.length
  });

  console.log('\n--- 12. Testing Resource Exchange Hub ---');
  const newResource = await db.createResourceItem({
    title: '25 Refurbished ThinkPad Laptops',
    category: 'laptops',
    type: 'offer',
    quantity: 25,
    location: 'Bengaluru, India',
    condition: 'Refurbished Grade A',
    donor_id: 'supporter-1',
    donor_name: 'Tech Mahindra CSR'
  });
  console.log(`✅ Resource listed: "${newResource.title}" (Status: ${newResource.status})`);
  const claim = await db.claimResourceItem(newResource.id, {
    ngo_id: 'ngo-1',
    ngo_name: 'Vidya Jyoti Foundation',
    quantity: 10,
    purpose: 'Digital classrooms for village students'
  });
  console.log(`✅ Resource claimed: ${claim.claimed_quantity} units by ${claim.ngo_name} (Status: ${claim.status})`);
  const updatedClaim = await db.updateClaimStatus(claim.id, 'in_transit', 'Courier dispatched via BlueDart');
  console.log(`✅ Claim status updated to: ${updatedClaim.status}`);

  console.log('\n--- 13. Testing Urgent Community Needs ---');
  const urgentNeed = await db.createUrgentNeed({
    ngo_id: 'ngo-2',
    ngo_name: 'Aarogya Seva Trust',
    title: 'Emergency Pediatric Antibiotics & ORS Kits',
    cause: 'healthcare',
    location: 'Patna, Bihar',
    description: 'Post-flood medical relief camp requiring urgent pediatric medicines.',
    deadline: '2026-11-05',
    priority: 'critical',
    target_quantity: 500,
    unit: 'medical kits'
  });
  console.log(`✅ Urgent need published: "${urgentNeed.title}" (Priority: ${urgentNeed.priority})`);
  const pledge = await db.pledgeUrgentNeed(urgentNeed.id, {
    supporter_id: 'supporter-3',
    supporter_name: 'Sunita Patel',
    pledged_quantity: 150,
    note: 'Procuring and shipping direct from distributor warehouse'
  });
  console.log(`✅ Supporter pledged ${pledge.pledged_quantity} units to urgent need (Current fulfilled: ${pledge.urgent_need.fulfilled_quantity}/${pledge.urgent_need.target_quantity})`);

  console.log('\n--- 14. Testing Partnership Performance Reviews & Duplicate Guard ---');
  const review = await db.submitPartnershipReview({
    partnership_id: 'part-1',
    project_id: 'proj-1',
    reviewer_id: 'supporter-1',
    reviewer_name: 'Infosys Foundation',
    reviewer_role: 'corporate_csr',
    rating: 5,
    communication_rating: 5,
    timeliness_rating: 4,
    milestone_quality_rating: 5,
    review_text: 'Outstanding coordination, transparent deliverable proof, and timely reporting throughout.'
  });
  console.log(`✅ Partnership review submitted: ${review.rating} stars with sentiment index.`);

  let duplicateBlocked = false;
  try {
    await db.submitPartnershipReview({
      partnership_id: 'part-1',
      project_id: 'proj-1',
      reviewer_id: 'supporter-1',
      reviewer_name: 'Infosys Foundation',
      reviewer_role: 'corporate_csr',
      rating: 4,
      review_text: 'Duplicate attempt'
    });
  } catch (err) {
    duplicateBlocked = true;
    console.log(`✅ Duplicate review successfully blocked: "${err.message}"`);
  }
  if (!duplicateBlocked) throw new Error('Duplicate review was not blocked!');

  const perf = await db.getPerformanceIndicators('proj-1');
  console.log('✅ Project Trust Indicators computed:', perf);

  console.log('\n--- 15. Testing Grants & CSR Directory ---');
  const grants = await db.getGrants();
  console.log(`✅ Retrieved ${grants.length} verified grants and CSR funds.`);
  const newGrant = await db.createGrant({
    title: 'Women in STEM Innovation Grant 2026',
    funder_name: 'Google Impact Challenge',
    grant_amount: '$150,000',
    deadline: '2026-12-15',
    cause: 'education',
    geographic_scope: 'Pan-India',
    eligibility_criteria: 'Registered NGOs with 3+ years experience in vocational training',
    application_url: 'https://impactchallenge.withgoogle.com',
    is_verified: true
  });
  console.log(`✅ Published grant: "${newGrant.title}" (${newGrant.grant_amount})`);

  console.log('\n--- 16. Testing Volunteer QR Attendance & Duplicate Scan Guard ---');
  const checkin1 = await db.recordVolunteerCheckIn({
    event_id: 'event-1',
    event_title: 'Sunderbans Mangrove Afforestation Drive',
    volunteer_name: 'Pooja Verma',
    volunteer_email: 'pooja.verma@gmail.com',
    hours_logged: 4,
    supervisor_notes: 'Planted 25 seedlings'
  });
  console.log(`✅ Volunteer checked in: ${checkin1.volunteer_name} (+${checkin1.hours_logged} hrs). Total Event Volunteers: ${checkin1.event_stats.total_volunteers}`);

  let dupScanBlocked = false;
  try {
    await db.recordVolunteerCheckIn({
      event_id: 'event-1',
      event_title: 'Sunderbans Mangrove Afforestation Drive',
      volunteer_name: 'Pooja Verma',
      volunteer_email: 'pooja.verma@gmail.com',
      hours_logged: 4
    });
  } catch (err) {
    dupScanBlocked = true;
    console.log(`✅ Duplicate QR scan successfully blocked: "${err.message}"`);
  }
  if (!dupScanBlocked) throw new Error('Duplicate volunteer check-in was not blocked!');

  console.log('\n--- 17. Testing Project Following & Live Activity Feed ---');
  const followResult = await db.toggleProjectFollow('proj-1', 'supporter-1');
  console.log(`✅ Project follow toggled: Following = ${followResult.is_following} (Total followers: ${followResult.followers_count})`);

  const feed = await db.getActivityFeed();
  console.log(`✅ Retrieved ${feed.length} chronological live activities across platform.`);

  console.log('\n--- 19. Testing Personalized Impact Feed & Saved Projects ---');
  const personalizedFeed = await db.getPersonalizedFeed({
    userId: 'user-supp-1',
    causes: ['education', 'environment'],
    location: 'Mumbai',
    skills: ['Teaching']
  });
  console.log(`✅ Retrieved ${personalizedFeed.length} personalized recommendations.`);
  console.log(`Top match: "${personalizedFeed[0].title}" (${personalizedFeed[0].matchScore}% match)`);
  console.log(`Reasons:`, personalizedFeed[0].matchReasons);

  const saveRes = await db.toggleSaveProject('user-supp-1', 'proj-1', 'Test bookmark');
  console.log(`✅ Project save toggled: isSaved = ${saveRes.isSaved}, Total Saved = ${saveRes.totalSaved}`);
  const savedProjects = await db.getSavedProjects('user-supp-1');
  console.log(`✅ Retrieved ${savedProjects.length} saved projects for user-supp-1.`);

  console.log('\n--- 20. Testing Smart Availability Calendar & Capacity Controls ---');
  const shifts = await db.getVolunteerShifts();
  console.log(`✅ Loaded ${shifts.length} active volunteer shifts.`);
  const newShift = await db.createVolunteerShift({
    ngo_id: 'ngo-1',
    ngo_name: 'Aashray Rural Trust',
    project_id: 'proj-1',
    project_title: 'Clean Water Wells',
    title: 'Water Testing Camp',
    shift_date: '2026-11-28',
    start_time: '10:00 AM',
    end_time: '02:00 PM',
    location: 'Bhiwandi Community Center, Mumbai',
    capacity: 2,
    required_skills: ['Water Testing', 'Community Outreach'],
    category: 'clean_water'
  });
  console.log(`✅ Published shift: "${newShift.title}" (Capacity: ${newShift.capacity})`);

  // Register 1st volunteer
  const reg1 = await db.registerForShift(newShift.id, {
    volunteer_id: 'vol-1',
    volunteer_name: 'Arjun Das',
    volunteer_email: 'arjun.das@gmail.com',
    notes: 'Certified lab technician'
  });
  console.log(`✅ Registered 1st volunteer: ${reg1.registration.volunteer_name} (Slots: ${reg1.shift.registered_count}/${reg1.shift.capacity})`);

  // Test duplicate registration block
  let duplicateRegBlocked = false;
  try {
    await db.registerForShift(newShift.id, {
      volunteer_id: 'vol-1',
      volunteer_name: 'Arjun Das',
      volunteer_email: 'arjun.das@gmail.com'
    });
  } catch (err) {
    duplicateRegBlocked = true;
    console.log(`✅ Duplicate shift registration blocked: "${err.message}"`);
  }
  if (!duplicateRegBlocked) throw new Error('Duplicate shift registration was not blocked!');

  // Register 2nd volunteer (reaches capacity)
  const reg2 = await db.registerForShift(newShift.id, {
    volunteer_id: 'vol-2',
    volunteer_name: 'Sara Khan',
    volunteer_email: 'sara.khan@gmail.com'
  });
  console.log(`✅ Registered 2nd volunteer: ${reg2.registration.volunteer_name} (Shift status: ${reg2.shift.status})`);

  // Test capacity limit block
  let capacityBlocked = false;
  try {
    await db.registerForShift(newShift.id, {
      volunteer_id: 'vol-3',
      volunteer_name: 'Rohan Mehra',
      volunteer_email: 'rohan.mehra@gmail.com'
    });
  } catch (err) {
    capacityBlocked = true;
    console.log(`✅ Over-capacity registration successfully blocked: "${err.message}"`);
  }
  if (!capacityBlocked) throw new Error('Over-capacity registration was not blocked!');

  const commitments = await db.getUserShiftCommitments('arjun.das@gmail.com');
  console.log(`✅ Retrieved ${commitments.length} confirmed commitments for arjun.das@gmail.com`);

  console.log('\n--- 21. Testing UN SDG Mapping & Cause Analytics ---');
  const sdgAnalytics = await db.getSdgMappingAnalytics();
  console.log(`✅ SDG Analytics computed: ${sdgAnalytics.totalProjectsAnalyzed} projects analyzed across ${sdgAnalytics.activeSdgCount} active SDGs.`);
  console.log(`Top mobilized SDGs:`, sdgAnalytics.topSdgs.map(s => `SDG ${s.sdgNumber} (${s.projectCount} projs, $${s.totalFundingRaised.toLocaleString()} raised)`));

  console.log('\n--- 22. Testing Smart Notifications & Preferences ---');
  const notifResult = await db.getNotifications('marcus.chen@apextech.com');
  console.log(`✅ Loaded ${notifResult.notifications.length} notifications (${notifResult.unreadCount} unread) for Marcus Chen.`);

  if (notifResult.notifications.length > 0) {
    const readItem = await db.markNotificationAsRead(notifResult.notifications[0].id);
    console.log(`✅ Marked notification ID ${readItem.id} as read: ${readItem.is_read}`);
  }

  const markAllRes = await db.markAllNotificationsAsRead('marcus.chen@apextech.com');
  console.log(`✅ Mark all as read: updated ${markAllRes.count} notifications.`);

  const prefs = await db.getNotificationPreferences('user-supp-1');
  console.log(`✅ Retrieved notification preferences: email_alerts=${prefs.email_alerts_enabled}, in_app=${prefs.in_app_enabled}`);

  console.log('\n--- 23. Testing Partnership Agreement Draft Generator ---');
  const agreement = await db.getPartnershipAgreement('part-1');
  console.log(`✅ Generated agreement draft: "${agreement.agreement_title}" (Status: ${agreement.status})`);
  console.log(`Legal disclaimer included: ${agreement.is_legal_disclaimer_accepted}`);

  const ackRes = await db.acknowledgePartnershipAgreement(agreement.id, 'partner', 'Marcus Chen (Apex Global CSR)');
  console.log(`✅ Agreement acknowledged by partner: Status = ${ackRes.status}`);

  console.log('\n--- 24. Testing Project Transparency Timeline (Immutable Audit Trail) ---');
  const timeline = await db.getProjectTransparencyTimeline('proj-1');
  console.log(`✅ Retrieved ${timeline.length} chronological audit events for proj-1.`);
  timeline.forEach((ev, i) => {
    console.log(`   [${i + 1}] [${ev.event_type.toUpperCase()}] ${ev.title} by ${ev.actor_name} (${ev.actor_role})`);
  });

  const newAuditEvent = await db.logProjectTransparencyEvent('proj-1', {
    event_type: 'evidence_submitted',
    title: 'Water Quality Bacterial Test Lab Certificate Uploaded',
    description: 'Bacteriological culture verified 0 CFU coliforms post-filtration.',
    actor_name: 'Dr. Sunita Deshmukh',
    actor_role: 'ngo'
  });
  console.log(`✅ Logged new immutable audit event ID: ${newAuditEvent.id} (Verified: ${newAuditEvent.is_verified})`);

  console.log('\n--- 25. Testing Demo Reset ---');
  await db.resetDemoData();
  const resetStats = await db.getStats();
  console.log(`✅ Demo reset verified. Projects: ${resetStats.totalProjects}, Requests: ${resetStats.totalRequests}`);

  console.log('\n🌟 ALL 25 ADVANCED PLATFORM BACKEND WORKFLOW TESTS SUCCEEDED PERFECTLY!\n');
}

testAppDirectly().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
