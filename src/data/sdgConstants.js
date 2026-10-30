/**
 * UN Sustainable Development Goals (SDGs) & Impact Categories Constants
 */

export const SDG_GOALS = [
  { id: 1, name: "No Poverty", color: "#E5243B", description: "End poverty in all its forms everywhere." },
  { id: 2, name: "Zero Hunger", color: "#DDA63A", description: "End hunger, achieve food security and improved nutrition." },
  { id: 3, name: "Good Health & Well-being", color: "#4C9F38", description: "Ensure healthy lives and promote well-being for all at all ages." },
  { id: 4, name: "Quality Education", color: "#C5192D", description: "Ensure inclusive and equitable quality education and promote lifelong learning." },
  { id: 5, name: "Gender Equality", color: "#FF3A21", description: "Achieve gender equality and empower all women and girls." },
  { id: 6, name: "Clean Water & Sanitation", color: "#26BDE2", description: "Ensure availability and sustainable management of water and sanitation for all." },
  { id: 7, name: "Affordable & Clean Energy", color: "#FCC30B", description: "Ensure access to affordable, reliable, sustainable and modern energy for all." },
  { id: 8, name: "Decent Work & Economic Growth", color: "#A21942", description: "Promote sustained, inclusive and sustainable economic growth and decent work." },
  { id: 9, name: "Industry, Innovation & Infrastructure", color: "#FD6925", description: "Build resilient infrastructure, promote inclusive and sustainable industrialization." },
  { id: 10, name: "Reduced Inequalities", color: "#DD1367", description: "Reduce inequality within and among countries." },
  { id: 11, name: "Sustainable Cities & Communities", color: "#FD9D24", description: "Make cities and human settlements inclusive, safe, resilient and sustainable." },
  { id: 12, name: "Responsible Consumption & Production", color: "#BF8B2E", description: "Ensure sustainable consumption and production patterns." },
  { id: 13, name: "Climate Action", color: "#3F7E44", description: "Take urgent action to combat climate change and its impacts." },
  { id: 14, name: "Life Below Water", color: "#0A97D9", description: "Conserve and sustainably use oceans, seas and marine resources." },
  { id: 15, name: "Life on Land", color: "#56C02B", description: "Protect, restore and promote sustainable use of terrestrial ecosystems." },
  { id: 16, name: "Peace, Justice & Strong Institutions", color: "#00689D", description: "Promote peaceful and inclusive societies for sustainable development." },
  { id: 17, name: "Partnerships for the Goals", color: "#19486A", description: "Strengthen the means of implementation and revitalize global partnerships." }
];

export const CAUSE_CATEGORIES = [
  { id: "all", name: "All Causes", icon: "Globe2" },
  { id: "poverty", name: "Poverty Alleviation", icon: "Coins", sdg: [1, 8] },
  { id: "education", name: "Quality Education", icon: "GraduationCap", sdg: [4] },
  { id: "healthcare", name: "Health & Medicine", icon: "HeartPulse", sdg: [3] },
  { id: "environment", name: "Environment & Climate", icon: "TreePine", sdg: [13, 15] },
  { id: "women_welfare", name: "Women & Girls Welfare", icon: "Sparkles", sdg: [5] },
  { id: "disability", name: "Disability Support", icon: "Accessibility", sdg: [10, 8] },
  { id: "hunger", name: "Zero Hunger & Food Rescue", icon: "Utensils", sdg: [2] }
];

export const REQUIREMENT_TYPES = [
  { id: "all", label: "All Needs" },
  { id: "funding", label: "Funding & Grants", icon: "IndianRupee" },
  { id: "volunteers", label: "Volunteers Needed", icon: "Users" },
  { id: "resources", label: "Goods & Supplies", icon: "Package" },
  { id: "skills", label: "Skilled Professionals", icon: "Briefcase" },
  { id: "corporate_csr", label: "Corporate CSR / Org", icon: "Building2" }
];

export const DEMO_PERSONAS = [
  {
    id: "supp-persona-1",
    name: "Horizon CSR Foundation",
    role: "Corporate CSR Partner",
    type: "corporate_csr",
    email: "csr@globalhorizon.com",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
    description: "Corporate philanthropic grants, equipment donation & corporate volunteering."
  },
  {
    id: "supp-persona-2",
    name: "Dr. Ramesh Kulkarni",
    role: "Skilled Medical Professional",
    type: "skilled_professional",
    email: "dr.kulkarni@healthnet.org",
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=150&h=150&q=80",
    description: "Offering pro-bono tele-sonography & diagnostic review."
  },
  {
    id: "supp-persona-3",
    name: "Priya Sharma",
    role: "Community Volunteer",
    type: "individual_volunteer",
    email: "priya.sharma@earthguard.org",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150&q=80",
    description: "Weekend plantation drives & grassroots outreach."
  },
  {
    id: "ngo-persona-1",
    name: "Aashray Rural Trust",
    role: "NGO Representative",
    type: "ngo",
    ngo_id: "ngo-1",
    email: "contact@aashray-uplift.org",
    avatar: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=150&h=150&q=80",
    description: "Managing projects and reviewing incoming partnership proposals."
  }
];
