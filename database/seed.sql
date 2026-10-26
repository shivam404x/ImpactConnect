-- ============================================================================
-- ImpactConnect - PostgreSQL Seed Data Script
-- ============================================================================

INSERT INTO ngos (
    id, name, slug, tagline, mission, description, category, sdg_focus,
    registration_number, tax_exempt_status, founded_year, website, email, phone,
    address, city, state, country, is_verified, verification_tier, logo_url, banner_url,
    leadership_contact, beneficiaries_served
) VALUES 
(
    'ngo-1',
    'Aashray Rural & Slum Upliftment Trust',
    'aashray-trust',
    'Empowering underserved urban informal settlements with sustainable livelihoods and clean water',
    'To eradicate extreme poverty and generational vulnerability through grassroots skill development, clean drinking water access, and community micro-enterprises.',
    'Founded in 2014, Aashray Trust works with over 35,000 families across 18 slum clusters. We operate mobile community centres, vocational tailoring and electrical repair hubs, and solar-powered community purification stations.',
    'poverty',
    '[1, 6, 8]'::jsonb,
    'TRUST/MAH/2014/8912',
    '80G & 12A Certified (India) / 501(c)(3) Equivalent',
    2014,
    'https://aashray-uplift.org',
    'contact@aashray-uplift.org',
    '+91 98201 44510',
    '402 Seva Sadan, Dharavi Link Road',
    'Mumbai',
    'Maharashtra',
    'India',
    true,
    'Gold Certified NGO',
    'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=200&h=200&q=80',
    'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&h=400&q=80',
    'Dr. Sunita Deshmukh, Executive Director',
    42000
),
(
    'ngo-2',
    'BrightPath Global Literacy Foundation',
    'brightpath-literacy',
    'Democratizing foundational literacy & STEM education for rural children and girls',
    'Ensuring no child drops out of education due to poverty, lack of school infrastructure, or gender inequality by providing tech-enabled micro-libraries and scholarship sponsorships.',
    'BrightPath builds solar-powered digital classrooms in off-grid rural schools. Over 180 schools have been equipped with open-source offline digital encyclopedias, interactive mathematics software, and reading kits.',
    'education',
    '[4, 5, 10]'::jsonb,
    'NGO-KE-2018-04192',
    'East Africa PBO Certified & US 501(c)(3) Partner',
    2018,
    'https://brightpathliteracy.org',
    'partnerships@brightpathliteracy.org',
    '+254 711 892015',
    'Kilimani Innovation Hub, Argwings Kodhek Rd',
    'Nairobi',
    'Nairobi County',
    'Kenya',
    true,
    'Platinum Verified NGO',
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=200&h=200&q=80',
    'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&h=400&q=80',
    'Amina Mwangi, Founder & Lead Educator',
    68000
),
(
    'ngo-3',
    'Arogya Community Health Initiative',
    'arogya-health',
    'Bringing preventative healthcare, maternal wellness, and telemedicine to remote villages',
    'Bridging rural healthcare deserts with mobile medical vans, trained frontline ASHA workers, telemedicine kiosks, and essential medicine drops.',
    'Operating across 94 villages in semi-arid and tribal districts, Arogya provides free maternal checkups, pediatric immunization tracking, and chronic disease management directly at doorsteps.',
    'healthcare',
    '[3, 10]'::jsonb,
    'DEL/SOC/2016/5421',
    'Registered Society & FCRA Cleared',
    2016,
    'https://arogyahealth.org',
    'info@arogyahealth.org',
    '+91 11 2689 3301',
    '22 Institutional Area, Vasant Kunj',
    'New Delhi',
    'Delhi',
    'India',
    true,
    'Gold Certified NGO',
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=200&h=200&q=80',
    'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&h=400&q=80',
    'Dr. Rajeshwar Sen, Chief Medical Officer',
    54000
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO projects (
    id, ngo_id, title, tagline, description, cause_category, sdg_goals,
    location_city, location_state, location_country, is_remote, urgency, status,
    cover_image, start_date, end_date, impact_target
) VALUES
(
    'proj-1',
    'ngo-1',
    'Clean Water Wells & Solar Micro-Grids for 5 Informal Settlements',
    'Bringing potable drinking water and reliable solar lighting to 12,000 residents',
    'Residents of these five peri-urban informal settlements spend up to 3 hours daily waiting in line for unsafe tanker water or walking long distances. This initiative will install 5 deep-bore solar community water filtration kiosks and 60 rooftop solar streetlamps.',
    'poverty',
    '[1, 6, 7]'::jsonb,
    'Mumbai',
    'Maharashtra',
    'India',
    false,
    'high',
    'active',
    'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=800&q=80',
    '2026-11-01',
    '2027-04-30',
    'Provide uninterrupted clean drinking water to 2,400 households and prevent waterborne cholera & typhoid.'
),
(
    'proj-2',
    'ngo-2',
    'Solar STEM Micro-Labs for 25 Rural Schools',
    'Equipping 6,000 rural students with offline digital tablets, science kits, and mentor sessions',
    'Rural primary and secondary schools in the Rift Valley lack electricity and internet access. This project delivers ruggedized, solar-rechargeable digital literacy kits packed with preloaded Khan Academy, Wikipedia, and Python playgrounds.',
    'education',
    '[4, 5, 9]'::jsonb,
    'Nairobi',
    'Rift Valley Region',
    'Kenya',
    true,
    'urgent',
    'active',
    'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
    '2026-11-15',
    '2027-05-15',
    'Boost math and scientific literacy by 45% among 6,000 grade 4-8 students.'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO project_requirements (
    id, project_id, type, title, description, target_quantity, current_quantity, unit, skill_tags, status
) VALUES
(
    'req-1',
    'proj-1',
    'funding',
    'Capital Expenditure for 5 Deep-Bore Solar RO Filtration Plants',
    'Procurement of high-capacity reverse osmosis filtration systems, solar submersible pumps, and 5000L food-grade overhead tanks.',
    28000,
    16500,
    'USD',
    '["Grant Funding", "CSR Sponsorship"]'::jsonb,
    'in_progress'
),
(
    'req-2',
    'proj-1',
    'volunteers',
    'Community Water Quality Testing & Health Survey Volunteers',
    'On-ground volunteers to visit households, test domestic water samples using colorimetric kits, and log data.',
    25,
    14,
    'volunteers',
    '["Field Survey", "Community Outreach"]'::jsonb,
    'open'
)
ON CONFLICT (id) DO NOTHING;
