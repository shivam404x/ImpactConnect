# 🌍 ImpactConnect — Social Impact & Community SDG Partnership Platform

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fshivam404x%2FImpactConnect)
[![GitHub Repository](https://img.shields.io/badge/GitHub-shivam404x%2FImpactConnect-181717?logo=github)](https://github.com/shivam404x/ImpactConnect)
[![UN SDGs](https://img.shields.io/badge/UN%20SDGs-1%20through%2017-00689D.svg)](https://sdgs.un.org/goals)

> **Accelerating UN Sustainable Development Goals (SDGs) by bridging the gap between grassroots NGOs, community organizations, philanthropic donors, corporate CSR programs, skilled professionals, and volunteers.**

---

## 📌 Executive Summary & Problem Context

Many non-governmental organizations (NGOs) and community initiatives work directly on critical social problems—such as **poverty alleviation, education access, preventative healthcare, environmental conservation, clean water, women & child welfare, hunger relief, and disability support**. However, they frequently struggle with:
1. Reaching beyond local geographies to secure long-term capital and funding grants.
2. Sourcing skilled volunteers (software engineers, doctors, attorneys, translators).
3. Finding equipment, physical supplies, or corporate CSR partners.
4. Coordinating and tracking formal collaboration proposals.

Concurrently, individuals, philanthropic donors, corporations with CSR mandates, and skilled professionals possess resources, capital, and expertise, but do not know which community projects need their help or how to initiate partnerships transparently.

**ImpactConnect** solves this social impact gap with a centralized, multi-stakeholder partnership platform.

---

## 🎯 Platform Objectives

1. **Centralized NGO Showcase**: Enables verified non-profits to publish organization profiles, track records, and active community projects.
2. **Multi-Stakeholder Bridge**: Connects NGOs with individual volunteers, skilled professionals (pro bono), philanthropic donors, and corporate CSR entities.
3. **Cause & Location Discovery**: Multi-faceted search and discovery engine filtering by UN Sustainable Development Goal (SDG 1–17), social cause category, geography, or remote/virtual eligibility.
4. **Structured Collaboration Proposals**: Direct proposal dispatching with offer quantification ($ amounts, volunteer hours, equipment quantities, pro bono skills).
5. **Partnership Tracking**: Real-time proposal management enabling NGOs to review, accept, or decline collaborations with transparent audit trails.
6. **Smart AI Partner Matching**: Algorithmic compatibility scoring pairing supporter skills and CSR criteria with real-time community needs.
7. **Impact Analytics & SDG Reporting**: Real-time visual metrics tracking mobilized capital, pledged volunteer hours, and geographic progress.

---

## 🛠️ Technology Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend UI** | **React.js 19** + **Tailwind CSS** | High-performance, modern, accessible UI with Lucide Icons and glassmorphism styling |
| **Animation & Effects** | **Canvas Confetti** | Celebration visual feedback upon proposal submission & acceptance |
| **Backend API** | **Node.js** + **Express.js 5** | RESTful API with structured routes, CORS, validation, and JSON payload handling |
| **Database** | **PostgreSQL** (`pg` pool) | Relational SQL database with DDL schema (`database/schema.sql`) and live/persistent store fallback |
| **Containerization** | **Docker** & **Docker Compose** | Pre-configured container orchestration with PostgreSQL 16 Alpine and Node.js app |
| **Tooling & Bundler** | **Vite 8** | Sub-second Hot Module Replacement (HMR) and optimized tree-shaken production bundles |

---

## 📊 UN Sustainable Development Goals (SDG) Alignment

ImpactConnect natively aligns with all 17 United Nations SDGs, emphasizing:
- **SDG 1: No Poverty** — Micro-livelihoods, slum upliftment, clean drinking water.
- **SDG 2: Zero Hunger** — Commercial food rescue, dignity pantries, child nutrition.
- **SDG 3: Good Health and Well-being** — Mobile diagnostic telemedicine vans, prenatal sonography.
- **SDG 4: Quality Education** — Rural solar STEM tablets, offline micro-libraries, coding bootcamps.
- **SDG 5: Gender Equality** — First-generation girl mentorship, artisan sewing cooperatives.
- **SDG 6: Clean Water and Sanitation** — Deep-bore solar reverse-osmosis purification kiosks.
- **SDG 8: Decent Work and Economic Growth** — Assistive tech career apprenticeships for disabled youth.
- **SDG 10: Reduced Inequalities** — Accessible digital bootcamps for visually impaired individuals.
- **SDG 13: Climate Action** & **SDG 15: Life on Land** — Native Miyawaki micro-forests & urban wetland revival.
- **SDG 17: Partnerships for the Goals** — The central mission of the entire ImpactConnect platform.

---

## 🗄️ Database Architecture (`database/schema.sql`)

```
+------------------------------------+          +------------------------------------+
|                ngos                |          |              projects              |
+------------------------------------+          +------------------------------------+
| id (PK)                            |<---1:N---| id (PK)                            |
| name, slug, tagline, mission       |          | ngo_id (FK -> ngos.id)             |
| category, sdg_focus (JSONB)        |          | title, tagline, description        |
| registration_number, tax_exempt    |          | cause_category, sdg_goals (JSONB)  |
| city, state, country, is_verified  |          | location_city, country, is_remote  |
| beneficiaries_served, created_at   |          | urgency, status, impact_target     |
+------------------------------------+          +------------------------------------+
                   ^                                               ^
                   |                                               |
                   | 1:N                                           | 1:N
+------------------------------------+          +------------------------------------+
|        partnership_requests        |          |        project_requirements        |
+------------------------------------+          +------------------------------------+
| id (PK)                            |          | id (PK)                            |
| project_id (FK -> projects.id)     |          | project_id (FK -> projects.id)     |
| ngo_id (FK -> ngos.id)             |          | type (funding/volunteers/skills)   |
| supporter_name, email, phone       |          | title, description                 |
| supporter_type, organization_name  |          | target_quantity, current_quantity  |
| offer_type, offer_value, message   |          | unit, skill_tags (JSONB), status   |
| status (pending/accepted/declined) |          +------------------------------------+
| ngo_response_note, created_at      |
+------------------------------------+
```

---

## 🚀 Running Locally

### Option 1: Standard Node.js & Vite (Recommended for Quick Testing)

```bash
# 1. Install dependencies
npm install

# 2. Build the production React frontend
npm run build

# 3. Start the Express API & Production Server (Port 5000)
npm start

# 4. Open in browser:
http://localhost:5000
```

For frontend development with Hot Module Replacement (HMR):
```bash
npm run dev
# Vite runs at http://localhost:5173 with proxy to backend port 5000
```

### Option 2: Full Docker Compose with PostgreSQL

```bash
# Start PostgreSQL 16 & ImpactConnect container
docker-compose up -d

# View logs
docker-compose logs -f
```

### Option 3: Running Automated Test Suite

```bash
npm test
```
*Validates database initialization, project discovery, multi-cause filtering, NGO registry, partnership submission, status updates, and AI matching with zero errors.*

---

## 🌟 Key Application Modules

### 1. 🔍 Discovery Hub (`/`)
- Real-time search query matching project titles, tags, and NGO names.
- Cause Category selector (Poverty, Education, Healthcare, Environment, Disability, Hunger, Women's Welfare).
- UN SDG interactive badge bar (SDG 1 through 17).
- Needs filters (Funding, Volunteers, Goods & Supplies, Skilled Professionals, Corporate CSR).
- Location selector (City, Country, or "Remote / Online only").
- High-urgency initiative toggle.

### 2. 🤝 Partnership Proposal Flow (`PartnershipModal.jsx`)
- Select contribution role: Corporate CSR, Philanthropic Donor, Skilled Pro, Volunteer, or Collaborating NGO.
- Quantified offer parameters ($ funding amounts, weekly volunteer hours, device units).
- Direct message to NGO executive leadership.
- Confetti celebration and instant addition to the partnership tracker.

### 3. 🏢 Verified NGO Directory (`NgoDirectory.jsx`)
- Comprehensive registry of certified grassroots organizations.
- Trust & transparency verification badges (80G, 12A, 501(c)(3)).
- Total beneficiaries served counters and direct link to explore each organization's initiatives.

### 4. 📋 Proposal Management Desk (`PartnershipsDashboard.jsx`)
- Review submitted collaboration offers.
- NGO one-click "Accept & Connect" or "Decline" with customized official response notes.
- Direct contact details exchange (Email, WhatsApp/Phone) upon collaboration confirmation.

### 5. ⚡ Smart Match AI Engine (`AiMatchView.jsx`)
- Algorithmic partner matching scoring supporters and companies against live community requirements.
- Transparent match reasoning badges ("Urgent need for your Web Dev skill", "Aligned with SDG 4 Education").

### 6. 🤖 Impact AI Assistant (`ImpactAiAssistantModal.jsx`)
- Converts plain-text requirements (e.g., *"We urgently need 50 laptops and 3 volunteer mentors in Varanasi for our women skill development center"*) into structured project blueprints.
- Extracts cause category, target city, required resources, quantities, and urgency levels.
- Recommends compatible corporate sponsors and skilled volunteers using auditable matching rules.
- 1-click publishing directly to the active project feed.

### 7. 📦 Resource Exchange Hub (`ResourceExchangeHub.jsx`)
- Two-sided marketplace for non-financial physical goods: laptops, books, clothes, food, medical supplies, and furniture.
- Enables donors to post offers and NGOs to post physical requirements.
- Full workflow: Listing -> NGO Claim -> Approval -> In-Transit Tracking -> Verified Delivery.

### 8. 🚨 Urgent Community Needs (`UrgentCommunityNeeds.jsx`)
- Real-time crisis response portal with active countdown clocks, severity tags (*Critical* / *Urgent*), and verified NGO badges.
- Supporter emergency pledging flow with real-time target-vs-fulfilled progress indicators.
- Compliance reporting and fraud mitigation safeguards.

### 9. ⭐ Partnership Performance Reviews (`PartnershipFeedbackModal.jsx`)
- Post-collaboration authentic feedback mechanism with 5-star scoring and multidimensional criteria (Communication, Timeliness, Deliverable Quality).
- Hard duplicate-submission prevention per user/collaboration.
- Feeds into transparent public trust scores and completion rate metrics.

### 10. 🎯 Grant & CSR Discovery Directory (`GrantsDirectoryPage.jsx`)
- Directory of institutional grants, philanthropic foundations, and corporate CSR allocations (e.g. Google Impact Challenge, Tata Trust, Azim Premji Philanthropy).
- Filterable by cause, geographic scope, and funder type with official application links and eligibility checklists.

### 11. 📱 Volunteer QR Attendance (`VolunteerQrAttendanceModal.jsx`)
- Event-specific QR pass generator for registered field volunteers.
- Kiosk check-in scanner with duplicate-scan prevention and tamper-proof volunteer-hour ledger.

### 12. ⚡ Live Activity Feed & Project Following (`LiveActivityFeed.jsx`)
- Chronological public audit stream capturing verified check-ins, accepted partnerships, emergency pledges, and milestone deliveries.
- 1-click project following with instant follower count updates.

### 13. 📄 Audited Impact Report Dossier (`ImpactReportModal.jsx`)
- Print-ready and downloadable PDF impact statement.
- Distinguishes verified real metrics from estimated projections.
- Features approved expense breakdowns, milestone evidence photos, and a cryptographic `SHA-256` verification hash.

### 14. 🎯 Personalized Impact Feed (`PersonalizedImpactFeed.jsx`)
- Recommends NGO projects dynamically scored against the user's selected causes, location, skills, available resources, and followed organizations.
- Explains why each project is recommended with transparent, bulleted rationale tags.
- Allows supporters to bookmark and persist saved projects with personal notes.

### 15. 📅 Smart Availability Calendar & Shifts (`SmartAvailabilityCalendar.jsx`)
- Time-slotted volunteering calendar enabling NGOs to publish community shifts with exact dates, locations, capacity limits, and required skills.
- Allows volunteers to register with instant validation, handling strict capacity caps (e.g. *8/12 slots filled*) and preventing duplicate registrations.
- Features a personal **"My Upcoming Commitments"** dashboard tracking confirmed shifts.

### 16. 🌐 UN SDG Mapping & Cause Analytics (`SdgMappingAnalytics.jsx`)
- Maps active projects to all 17 UN Sustainable Development Goals (SDG 1 No Poverty, SDG 3 Good Health, SDG 4 Quality Education, SDG 5 Gender Equality, SDG 10 Reduced Inequalities, SDG 13 Climate Action, and others).
- Generates live cause-based analytics directly from actual database records (beneficiaries reached, funding allocated, volunteer roles per goal).
- Interactive 17-goal grid where selecting any SDG instantly reveals the mapped grassroots initiatives.

### 17. 🌐 Modular Multilingual Experience (`translations.js`)
- English and Hindi (`hi`) localization covering navigation, modals, form validation, filter badges, and dashboard headers.
- Modular translation dictionary architecture prepared for effortless addition of regional languages (Marathi, Tamil, Bengali).
- Preserves authentic user-generated organization and project names as proper nouns without automated mistranslation.

### 18. ⚖️ Side-by-Side Project Comparison (`ProjectComparisonModal.jsx`)
- Compare up to 3 projects side-by-side across verification tier, primary cause, UN SDGs, location/remote mode, funding progress, volunteers needed, physical supplies, timeline, reported beneficiaries, and audit status.
- Persistent floating dock at the bottom of the screen with clear/remove options and print/export capabilities.

### 19. 🔔 Smart Notification Center (`NotificationCenterModal.jsx`)
- Real-time in-app notification center accessible via the top navigation bell with an unread badge.
- Alerts for matching opportunities, partnership proposal updates, volunteering shift confirmations, and verified milestones.
- Read/unread state controls, "Mark all as read", and customizable user notification preferences.

### 20. 📝 Partnership Agreement Generator (`PartnershipAgreementModal.jsx`)
- Generates an editable, structured operational collaboration draft covering participating parties, scope, mutual responsibilities, deliverables, and timeline.
- Requires both parties to digitally review and acknowledge the draft.
- Includes a prominent legal disclaimer: *"DRAFT OPERATIONAL FRAMEWORK: This agreement is an operational coordination document generated by ImpactConnect and does not automatically constitute licensed legal counsel."*
- Full print and PDF export styling.

### 21. 🔒 Project Transparency Timeline (`ProjectTransparencyTimeline.jsx`)
- Immutable, chronological project audit trail logging project publication, partnership acceptance, milestone completion, resource delivery, and auditor reviews.
- Server-timestamped records with verified actor roles, photographic milestone proof, and privacy safeguards protecting private contact details.

---

## 👥 Demo Personas & Pre-configured Accounts

ImpactConnect includes one-click login presets and accounts for instant testing:
- **🏢 NGO Leader**: `vidya@education.org` / `Aashray Rural Trust` (Post projects, publish urgent needs, claim resources, review proposals)
- **🤝 Corporate CSR Director**: `csr@tata.com` / `Tata Sustainability Group` (Pledge grants, list bulk surplus devices, review workspace)
- **🙋 Community Volunteer**: `priya.sharma@gmail.com` (Check in via QR code, pledge emergency items, explore skill marketplace)
- **🛡️ Platform Admin**: `admin@impactconnect.org` (Review NGO verification dossiers, moderate reported projects)
