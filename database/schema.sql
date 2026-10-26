-- ============================================================================
-- ImpactConnect - PostgreSQL Database Schema (Hackathon-Ready Production DDL)
-- Social Impact Partnership Platform (Community SDG)
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: NGOs & Community Organizations
CREATE TABLE IF NOT EXISTS ngos (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    tagline VARCHAR(300),
    mission TEXT NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    sdg_focus JSONB NOT NULL DEFAULT '[]',
    registration_number VARCHAR(100),
    tax_exempt_status VARCHAR(50),
    founded_year INTEGER,
    website VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    address VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    country VARCHAR(100) NOT NULL,
    latitude NUMERIC(10, 6),
    longitude NUMERIC(10, 6),
    is_verified BOOLEAN DEFAULT TRUE,
    verification_tier VARCHAR(50) DEFAULT 'Gold Verified',
    logo_url TEXT,
    banner_url TEXT,
    leadership_contact VARCHAR(255),
    beneficiaries_served INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: Verification Requests (NGO Compliance & Trust)
CREATE TABLE IF NOT EXISTS verification_requests (
    id VARCHAR(64) PRIMARY KEY,
    ngo_id VARCHAR(64) NOT NULL REFERENCES ngos(id) ON DELETE CASCADE,
    ngo_name VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected
    submitted_documents JSONB DEFAULT '[]', -- [{ type: "tax_exempt_80g", filename: "80G_cert.pdf", uploaded_at: "..." }]
    admin_notes TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP WITH TIME ZONE
);

-- Table: Projects
CREATE TABLE IF NOT EXISTS projects (
    id VARCHAR(64) PRIMARY KEY,
    ngo_id VARCHAR(64) NOT NULL REFERENCES ngos(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    tagline VARCHAR(300),
    description TEXT NOT NULL,
    cause_category VARCHAR(100) NOT NULL,
    sdg_goals JSONB NOT NULL DEFAULT '[]',
    location_city VARCHAR(100) NOT NULL,
    location_state VARCHAR(100),
    location_country VARCHAR(100) NOT NULL,
    latitude NUMERIC(10, 6),
    longitude NUMERIC(10, 6),
    is_remote BOOLEAN DEFAULT FALSE,
    urgency VARCHAR(50) DEFAULT 'medium',
    status VARCHAR(50) DEFAULT 'active',
    cover_image TEXT,
    start_date DATE,
    end_date DATE,
    impact_target TEXT,
    verified_beneficiaries INTEGER DEFAULT 0,
    estimated_beneficiaries INTEGER DEFAULT 0,
    expense_breakdown JSONB DEFAULT '[]', -- [{ category: "Equipment", percentage: 50, amount: 14000 }]
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: Project Requirements (Funding, Volunteers, Goods, Skills)
CREATE TABLE IF NOT EXISTS project_requirements (
    id VARCHAR(64) PRIMARY KEY,
    project_id VARCHAR(64) NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- funding, volunteers, resources, skills, corporate_csr
    title VARCHAR(255) NOT NULL,
    description TEXT,
    target_quantity NUMERIC NOT NULL DEFAULT 0,
    current_quantity NUMERIC NOT NULL DEFAULT 0,
    unit VARCHAR(50) NOT NULL,
    skill_tags JSONB DEFAULT '[]',
    status VARCHAR(50) DEFAULT 'open',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: Project Milestones (Proof of Impact & Deliverables)
CREATE TABLE IF NOT EXISTS project_milestones (
    id VARCHAR(64) PRIMARY KEY,
    project_id VARCHAR(64) NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    target_date DATE,
    is_completed BOOLEAN DEFAULT FALSE,
    verified_by_reviewer BOOLEAN DEFAULT FALSE,
    evidence_url TEXT,
    evidence_notes TEXT,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: Volunteer & Skill Marketplace Roles
CREATE TABLE IF NOT EXISTS volunteer_roles (
    id VARCHAR(64) PRIMARY KEY,
    project_id VARCHAR(64) NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    ngo_id VARCHAR(64) NOT NULL REFERENCES ngos(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    cause_category VARCHAR(100) NOT NULL,
    commitment_hours VARCHAR(100) NOT NULL, -- e.g. "4 hrs/week", "Weekend drives"
    skills_required JSONB DEFAULT '[]',
    location VARCHAR(150) NOT NULL,
    is_remote BOOLEAN DEFAULT FALSE,
    openings_count INTEGER DEFAULT 1,
    applications_count INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'open',
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: Volunteer Applications
CREATE TABLE IF NOT EXISTS volunteer_applications (
    id VARCHAR(64) PRIMARY KEY,
    role_id VARCHAR(64) NOT NULL REFERENCES volunteer_roles(id) ON DELETE CASCADE,
    project_id VARCHAR(64) NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    ngo_id VARCHAR(64) NOT NULL REFERENCES ngos(id) ON DELETE CASCADE,
    applicant_name VARCHAR(255) NOT NULL,
    applicant_email VARCHAR(255) NOT NULL,
    applicant_phone VARCHAR(50),
    skills JSONB DEFAULT '[]',
    availability VARCHAR(100),
    cover_note TEXT,
    status VARCHAR(50) DEFAULT 'pending', -- pending, accepted, waitlist, declined
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: Partnership Requests (Supporter & Corporate Collaborations)
CREATE TABLE IF NOT EXISTS partnership_requests (
    id VARCHAR(64) PRIMARY KEY,
    project_id VARCHAR(64) NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    ngo_id VARCHAR(64) NOT NULL REFERENCES ngos(id) ON DELETE CASCADE,
    supporter_id VARCHAR(64),
    supporter_name VARCHAR(255) NOT NULL,
    supporter_email VARCHAR(255) NOT NULL,
    supporter_phone VARCHAR(50),
    supporter_type VARCHAR(50) NOT NULL,
    organization_name VARCHAR(255),
    offer_type VARCHAR(50) NOT NULL,
    offer_value VARCHAR(100),
    message TEXT NOT NULL,
    timeline VARCHAR(100),
    status VARCHAR(50) DEFAULT 'pending', -- pending, accepted, declined, completed
    ngo_response_note TEXT,
    responded_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: Collaboration Workspace Messages
CREATE TABLE IF NOT EXISTS collaboration_messages (
    id VARCHAR(64) PRIMARY KEY,
    partnership_id VARCHAR(64) NOT NULL REFERENCES partnership_requests(id) ON DELETE CASCADE,
    sender_name VARCHAR(255) NOT NULL,
    sender_role VARCHAR(50) NOT NULL, -- ngo, supporter, corporate
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: Contribution History & Resource Pledges
CREATE TABLE IF NOT EXISTS contributions (
    id VARCHAR(64) PRIMARY KEY,
    project_id VARCHAR(64) NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    donor_name VARCHAR(255) NOT NULL,
    donor_type VARCHAR(50) NOT NULL,
    contribution_type VARCHAR(50) NOT NULL, -- funding, resources, hours
    amount_or_item VARCHAR(100) NOT NULL,
    is_sample_demo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: Corporate CSR RFPs (Grant Challenges)
CREATE TABLE IF NOT EXISTS csr_rfps (
    id VARCHAR(64) PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    grant_budget VARCHAR(100) NOT NULL, -- e.g. "$50,000"
    target_sdgs JSONB DEFAULT '[]',
    preferred_regions JSONB DEFAULT '[]',
    description TEXT NOT NULL,
    deadline DATE,
    status VARCHAR(50) DEFAULT 'open',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: Trust & Safety Reports
CREATE TABLE IF NOT EXISTS reports (
    id VARCHAR(64) PRIMARY KEY,
    target_type VARCHAR(50) NOT NULL, -- project, organization
    target_id VARCHAR(64) NOT NULL,
    target_title VARCHAR(255) NOT NULL,
    reporter_email VARCHAR(255),
    reason VARCHAR(100) NOT NULL,
    details TEXT,
    status VARCHAR(50) DEFAULT 'under_investigation',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: Activity Logs
CREATE TABLE IF NOT EXISTS activity_logs (
    id VARCHAR(64) PRIMARY KEY,
    event_type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    related_id VARCHAR(64),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- ADVANCED FEATURES EXTENSIONS
-- ============================================================================

-- Table: Resource Items (Resource Exchange Hub)
CREATE TABLE IF NOT EXISTS resource_items (
    id VARCHAR(64) PRIMARY KEY,
    type VARCHAR(20) NOT NULL, -- 'supply' (available from donor) | 'need' (requested by NGO)
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL, -- 'books', 'laptops', 'clothes', 'food', 'medical', 'furniture', 'other'
    quantity NUMERIC NOT NULL DEFAULT 1,
    unit VARCHAR(50) NOT NULL DEFAULT 'units',
    condition VARCHAR(50) DEFAULT 'good', -- 'new', 'gently_used', 'refurbished'
    description TEXT,
    location_city VARCHAR(100) NOT NULL,
    location_country VARCHAR(100) NOT NULL,
    owner_type VARCHAR(50) NOT NULL, -- 'supporter', 'ngo', 'corporate'
    owner_id VARCHAR(64),
    owner_name VARCHAR(255) NOT NULL,
    owner_email VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'available', -- 'available', 'matched', 'in_transit', 'delivered'
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: Resource Claims & Delivery Tracking
CREATE TABLE IF NOT EXISTS resource_claims (
    id VARCHAR(64) PRIMARY KEY,
    resource_id VARCHAR(64) NOT NULL REFERENCES resource_items(id) ON DELETE CASCADE,
    requester_id VARCHAR(64),
    requester_name VARCHAR(255) NOT NULL,
    requester_email VARCHAR(255) NOT NULL,
    requester_type VARCHAR(50) NOT NULL,
    quantity_requested NUMERIC NOT NULL DEFAULT 1,
    delivery_address TEXT NOT NULL,
    contact_phone VARCHAR(50),
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'approved', 'in_transit', 'delivered', 'rejected'
    tracking_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: Urgent Community Needs
CREATE TABLE IF NOT EXISTS urgent_needs (
    id VARCHAR(64) PRIMARY KEY,
    ngo_id VARCHAR(64) NOT NULL REFERENCES ngos(id) ON DELETE CASCADE,
    ngo_name VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    cause_category VARCHAR(100) NOT NULL,
    urgency_level VARCHAR(50) DEFAULT 'critical', -- 'critical', 'urgent'
    deadline DATE NOT NULL,
    target_quantity NUMERIC NOT NULL DEFAULT 1,
    current_quantity NUMERIC NOT NULL DEFAULT 0,
    unit VARCHAR(50) NOT NULL DEFAULT 'units',
    location_city VARCHAR(100) NOT NULL,
    location_country VARCHAR(100) NOT NULL,
    contact_phone VARCHAR(50),
    is_verified BOOLEAN DEFAULT TRUE,
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'fulfilled', 'expired'
    pledges_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: Urgent Need Pledges
CREATE TABLE IF NOT EXISTS urgent_pledges (
    id VARCHAR(64) PRIMARY KEY,
    urgent_need_id VARCHAR(64) NOT NULL REFERENCES urgent_needs(id) ON DELETE CASCADE,
    supporter_name VARCHAR(255) NOT NULL,
    supporter_email VARCHAR(255) NOT NULL,
    pledged_quantity NUMERIC NOT NULL DEFAULT 1,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: Partnership Reviews & Performance
CREATE TABLE IF NOT EXISTS partnership_reviews (
    id VARCHAR(64) PRIMARY KEY,
    partnership_id VARCHAR(64) NOT NULL REFERENCES partnership_requests(id) ON DELETE CASCADE,
    project_id VARCHAR(64) NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    reviewer_id VARCHAR(64),
    reviewer_name VARCHAR(255) NOT NULL,
    reviewer_role VARCHAR(50) NOT NULL, -- 'ngo', 'supporter', 'corporate'
    rating NUMERIC(2, 1) NOT NULL, -- 1.0 to 5.0
    communication_rating INTEGER DEFAULT 5,
    timeliness_rating INTEGER DEFAULT 5,
    milestone_quality_rating INTEGER DEFAULT 5,
    review_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_partnership_review UNIQUE (partnership_id, reviewer_id)
);

-- Table: Grants and CSR Opportunities Directory
CREATE TABLE IF NOT EXISTS grants_directory (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    funder_name VARCHAR(255) NOT NULL,
    funder_type VARCHAR(100) NOT NULL, -- 'corporate_csr', 'philanthropic_foundation', 'government', 'international_ngo'
    grant_amount NUMERIC NOT NULL DEFAULT 0,
    grant_amount_formatted VARCHAR(100) NOT NULL,
    cause_categories JSONB DEFAULT '[]',
    eligibility_criteria TEXT NOT NULL,
    deadline DATE NOT NULL,
    location_scope VARCHAR(150) NOT NULL,
    official_link TEXT NOT NULL,
    is_verified BOOLEAN DEFAULT TRUE,
    verification_tier VARCHAR(50) DEFAULT 'Gold Verified',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: Volunteer Attendance & QR Verification
CREATE TABLE IF NOT EXISTS volunteer_attendance (
    id VARCHAR(64) PRIMARY KEY,
    event_id VARCHAR(64) NOT NULL,
    project_id VARCHAR(64) NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    project_title VARCHAR(255) NOT NULL,
    volunteer_id VARCHAR(64),
    volunteer_name VARCHAR(255) NOT NULL,
    volunteer_email VARCHAR(255) NOT NULL,
    qr_token VARCHAR(255) NOT NULL,
    check_in_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    hours_logged NUMERIC(4, 1) DEFAULT 4.0,
    status VARCHAR(50) DEFAULT 'verified',
    verified_by VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_volunteer_event_checkin UNIQUE (event_id, volunteer_email)
);

-- Table: Project Following
CREATE TABLE IF NOT EXISTS project_follows (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    project_id VARCHAR(64) NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_project_follow UNIQUE (user_id, project_id)
);

-- Table: Saved Projects (Personalized Bookmarks)
CREATE TABLE IF NOT EXISTS saved_projects (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    project_id VARCHAR(64) NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_saved_project UNIQUE (user_id, project_id)
);

-- Table: Volunteer Shifts & Smart Availability Calendar
CREATE TABLE IF NOT EXISTS volunteer_shifts (
    id VARCHAR(64) PRIMARY KEY,
    ngo_id VARCHAR(64) NOT NULL REFERENCES ngos(id) ON DELETE CASCADE,
    ngo_name VARCHAR(255) NOT NULL,
    project_id VARCHAR(64) NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    project_title VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    shift_date DATE NOT NULL,
    start_time VARCHAR(20) NOT NULL,
    end_time VARCHAR(20) NOT NULL,
    location VARCHAR(255) NOT NULL,
    capacity INTEGER NOT NULL DEFAULT 10,
    registered_count INTEGER NOT NULL DEFAULT 0,
    required_skills JSONB DEFAULT '[]',
    category VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'open', -- 'open', 'filled', 'completed', 'cancelled'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: Shift Registrations (with Duplicate Guard & Capacity Check)
CREATE TABLE IF NOT EXISTS shift_registrations (
    id VARCHAR(64) PRIMARY KEY,
    shift_id VARCHAR(64) NOT NULL REFERENCES volunteer_shifts(id) ON DELETE CASCADE,
    volunteer_id VARCHAR(64),
    volunteer_name VARCHAR(255) NOT NULL,
    volunteer_email VARCHAR(255) NOT NULL,
    volunteer_phone VARCHAR(50),
    selected_skills JSONB DEFAULT '[]',
    notes TEXT,
    status VARCHAR(50) DEFAULT 'confirmed', -- 'confirmed', 'waitlisted', 'cancelled'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_shift_volunteer UNIQUE (shift_id, volunteer_email)
);

-- Table: Smart Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64),
    recipient_email VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'match_opportunity', 'partnership_update', 'shift_confirmed', 'deadline_approaching', 'milestone_reached'
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    target_page VARCHAR(100),
    target_id VARCHAR(64),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: Notification Preferences
CREATE TABLE IF NOT EXISTS notification_preferences (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL UNIQUE,
    email_alerts_enabled BOOLEAN DEFAULT TRUE,
    in_app_enabled BOOLEAN DEFAULT TRUE,
    match_alerts BOOLEAN DEFAULT TRUE,
    partnership_alerts BOOLEAN DEFAULT TRUE,
    event_reminders BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: Partnership Agreement Drafts
CREATE TABLE IF NOT EXISTS partnership_agreements (
    id VARCHAR(64) PRIMARY KEY,
    partnership_id VARCHAR(64) NOT NULL REFERENCES partnership_requests(id) ON DELETE CASCADE UNIQUE,
    project_id VARCHAR(64) NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    ngo_id VARCHAR(64) NOT NULL REFERENCES ngos(id) ON DELETE CASCADE,
    ngo_name VARCHAR(255) NOT NULL,
    supporter_name VARCHAR(255) NOT NULL,
    supporter_organization VARCHAR(255),
    agreement_title VARCHAR(255) NOT NULL,
    scope_summary TEXT NOT NULL,
    ngo_responsibilities TEXT NOT NULL,
    partner_responsibilities TEXT NOT NULL,
    deliverables_timeline JSONB DEFAULT '[]',
    status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'ngo_reviewed', 'partner_reviewed', 'both_acknowledged'
    ngo_acknowledged_at TIMESTAMP WITH TIME ZONE,
    partner_acknowledged_at TIMESTAMP WITH TIME ZONE,
    is_legal_disclaimer_accepted BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: Project Transparency Timeline (Immutable Audit Trail)
CREATE TABLE IF NOT EXISTS project_transparency_events (
    id VARCHAR(64) PRIMARY KEY,
    project_id VARCHAR(64) NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL, -- 'publication', 'partnership_accepted', 'milestone_completed', 'evidence_submitted', 'resource_delivered', 'review_logged', 'compliance_verified'
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    actor_name VARCHAR(255) NOT NULL,
    actor_role VARCHAR(50) NOT NULL,
    actor_id VARCHAR(64),
    evidence_url TEXT,
    is_verified BOOLEAN DEFAULT TRUE,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_projects_cause ON projects(cause_category);
CREATE INDEX IF NOT EXISTS idx_partnership_ngo ON partnership_requests(ngo_id);
CREATE INDEX IF NOT EXISTS idx_volunteer_roles ON volunteer_roles(project_id);
CREATE INDEX IF NOT EXISTS idx_resource_category ON resource_items(category);
CREATE INDEX IF NOT EXISTS idx_urgent_status ON urgent_needs(status);
CREATE INDEX IF NOT EXISTS idx_grants_deadline ON grants_directory(deadline);
CREATE INDEX IF NOT EXISTS idx_volunteer_shifts_date ON volunteer_shifts(shift_date);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(recipient_email);
CREATE INDEX IF NOT EXISTS idx_transparency_project ON project_transparency_events(project_id);
