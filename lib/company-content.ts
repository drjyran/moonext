export const siteBaseUrl = "https://moonext.vercel.app";

export const companyInfo = {
  name: "Moonext Constructions Pvt Ltd",
  legalName: "MOONEXT CONSTRUCTIONS PRIVATE LIMITED",
  shortName: "Moonext Constructions",
  tagline: "Reliable execution, disciplined workforce, and quality-driven construction delivery.",
  description:
    "Moonext Constructions Pvt Ltd delivers construction, civil execution, workforce coordination, and site operations support with a practical focus on safety, speed, and quality.",
  phone: ["+91 6203209812", "+91 8750186788"],
  whatsappNumber: "916203209812",
  email: "vishnu.moonext@gmail.com",
  officeAddress: [
    "C/O Asgari, Bhuneshwar Chowk",
    "RNG B. Complex, Ramnagar",
    "West Champaran, Bihar 845106, India"
  ],
  registeredOffice:
    "Asgari Bhuneshwar Chowk, RNG B. Complex, Ramnagar, West Champaran, Bihar – 845106",
  cin: "U45209BR2020PTC046852",
  statutoryAuditor: "Murmuria & Associates, Chartered Accountants, Kolkata",
  hours: [
    "Monday to Saturday: 9:00 AM - 6:30 PM",
    "Site coordination support available for active projects"
  ]
};

export const navigationLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/company-profile", label: "Company Profile" },
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projects" },
  { href: "/contact", label: "Contact" },
  { href: "/careers", label: "Careers" },
  { href: "/gallery", label: "Gallery" }
] as const;

export const heroStats = [
  { value: "120+", label: "Workforce managed across sites" },
  { value: "25+", label: "Active and completed delivery engagements" },
  { value: "98%", label: "Reporting visibility for site operations" },
  { value: "24/7", label: "Coordination support for project teams" }
];

export const companyHighlights = [
  "Civil works execution with site discipline and structured manpower control",
  "Daily attendance, wage, and settlement visibility through the internal labour management portal",
  "Construction support built for Indian site operations, contractor coordination, and practical delivery realities"
];

export const whyChooseMoonext = [
  {
    title: "Execution-Led Team",
    description:
      "We combine field execution, workforce control, and site-level reporting so delivery remains accountable from the ground up."
  },
  {
    title: "Quality With Practical Speed",
    description:
      "Moonext focuses on disciplined execution, measured planning, and realistic schedules without compromising workmanship."
  },
  {
    title: "Workforce & Site Visibility",
    description:
      "Our internal systems help track labour deployment, attendance, settlements, and site coordination in a structured way."
  },
  {
    title: "Safety & Compliance Mindset",
    description:
      "We build processes that support safer execution, cleaner documentation, and clearer operational control at site level."
  }
];

export const values = [
  {
    title: "Integrity On Site",
    description: "We communicate clearly, document practically, and execute with accountability."
  },
  {
    title: "Quality First",
    description: "We aim for durable outcomes, clean workmanship, and reliable finishing standards."
  },
  {
    title: "Workforce Respect",
    description: "We believe better labour systems create clearer settlements, safer sites, and stronger delivery."
  },
  {
    title: "Operational Discipline",
    description: "Planning, attendance, reporting, and settlement tracking are treated as part of delivery quality."
  }
];

export const leadershipTeam = [
  {
    name: "Mr. Vijay Kumar",
    role: "Director",
    description:
      "Director at MOONEXT CONSTRUCTIONS PRIVATE LIMITED. As per FY 2024–25 audited statements, holding 5,000 equity shares (50% shareholding). Role/designation beyond 'Director' to be used only as officially confirmed by the company.",
    image: "/site/director-vijay-kumar.jpg"
  },
  {
    name: "Mr. Vinay Kumar",
    role: "Director",
    description:
      "Director at MOONEXT CONSTRUCTIONS PRIVATE LIMITED. As per FY 2024–25 audited statements, holding 5,000 equity shares (50% shareholding). Role/designation beyond 'Director' to be used only as officially confirmed by the company. Photo to be updated on confirmation — placeholder visual in use.",
    image: "/site/slider-supervisors.jpg"
  }
];

export const services = [
  {
    slug: "building-construction",
    title: "Building Construction",
    shortDescription: "End-to-end execution support for residential, commercial, and mixed-use structures.",
    description:
      "We support building construction with planned execution, labour deployment, site coordination, and milestone-based delivery monitoring.",
    icon: "BC",
    bullets: ["Residential and commercial construction", "Structural execution coordination", "Site productivity and crew planning"]
  },
  {
    slug: "civil-contracting",
    title: "Civil Contracting",
    shortDescription: "Civil execution support for structural, utility, and ground-level development works.",
    description:
      "Moonext manages civil contracting assignments through disciplined site workflows, contractor coordination, and labour visibility.",
    icon: "CC",
    bullets: ["Concrete and structural works", "Masonry and finishing support", "Execution planning and supervision"]
  },
  {
    slug: "labour-supply-workforce-management",
    title: "Labour Supply / Workforce Management",
    shortDescription: "Structured labour deployment, attendance tracking, settlement visibility, and workforce coordination.",
    description:
      "We integrate field operations with digital labour controls to improve attendance accuracy, payment clarity, and manpower planning.",
    icon: "LW",
    bullets: ["Attendance and wage coordination", "Labour settlement tracking", "Contractor and workforce alignment"]
  },
  {
    slug: "site-execution-support",
    title: "Site Execution Support",
    shortDescription: "On-ground execution assistance for site teams, supervisors, and delivery stakeholders.",
    description:
      "Our site execution support focuses on daily progress coordination, crew alignment, issue tracking, and delivery discipline.",
    icon: "SE",
    bullets: ["Daily site coordination", "Supervisor support workflows", "Issue escalation and execution control"]
  },
  {
    slug: "renovation-maintenance",
    title: "Renovation & Maintenance",
    shortDescription: "Planned upgrade, repair, and maintenance support for operating properties and assets.",
    description:
      "We help manage renovation and maintenance assignments with minimal operational disruption and clear site-level supervision.",
    icon: "RM",
    bullets: ["Repair and refurbishment support", "Site-safe execution planning", "Labour and material coordination"]
  },
  {
    slug: "project-supervision",
    title: "Project Supervision",
    shortDescription: "Structured supervision support for quality, progress, workforce, and reporting.",
    description:
      "Moonext strengthens site reporting and construction control through execution follow-up, supervision discipline, and operational visibility.",
    icon: "PS",
    bullets: ["Progress oversight", "Quality checkpoints", "Construction reporting discipline"]
  },
  {
    slug: "infrastructure-development",
    title: "Infrastructure Development",
    shortDescription: "Execution support for infrastructure-oriented works requiring strong coordination and labour control.",
    description:
      "We support infrastructure assignments with practical execution systems, clear labour movement tracking, and site coordination frameworks.",
    icon: "ID",
    bullets: ["Ground and utility works", "Site logistics alignment", "Labour-intensive execution support"]
  }
];

export const projects = [
  {
    slug: "max-hospital-gurgaon",
    title: "Max Hospital, Gurgaon",
    clientName: "Max Hospital, Gurgaon",
    location: "B Block, Sushant Lok 1, Near Huda City Centre, Gurugram, Haryana",
    category: "Healthcare",
    clientCategory: "Institutional",
    industry: "Healthcare",
    status: "Ongoing",
    description:
      "Healthcare infrastructure support project in Gurugram delivered with a focus on quality execution, workforce discipline, and operational reliability.",
    summary:
      "This project at Max Hospital, Gurgaon highlights Moonext Constructions Pvt Ltd’s capability to contribute to critical healthcare infrastructure environments with professionalism, operational discipline, and execution support. Our focus remains on quality standards, workforce coordination, safety awareness, and dependable site performance.",
    image: "/site/max-hospital-gurgaon.jpeg",
    year: "Current engagement",
    metrics: [
      "Healthcare infrastructure environment",
      "Ongoing execution support",
      "Workforce coordination and site discipline"
    ],
    scopeOfWork: [
      "Project execution support aligned with live healthcare infrastructure environments",
      "Workforce coordination and disciplined manpower deployment across active work fronts",
      "Quality-focused site assistance and operational follow-through for dependable progress"
    ],
    keyHighlights: [
      "Professional project association within a major healthcare environment in Gurugram",
      "Execution support built around disciplined site operations and dependable coordination",
      "Focus on safety awareness, quality standards, and workforce reliability"
    ],
    safetyCommitment:
      "Moonext Constructions Pvt Ltd approaches healthcare and institutional projects with an emphasis on safe work practices, disciplined site conduct, quality-focused execution, and dependable coordination that supports sensitive operating environments.",
    featured: true,
    seoTitle: "Max Hospital Gurgaon Project | Moonext Constructions Pvt Ltd",
    seoDescription:
      "Explore Moonext Constructions Pvt Ltd’s ongoing project association at Max Hospital, Gurgaon, reflecting quality execution and reliable construction support in healthcare infrastructure."
  },
  {
    slug: "yashobhoomi-convention-centre-new-delhi",
    title: "Yashobhoomi Convention Centre",
    clientName: "India International Convention and Expo Centre",
    location: "Dwarka Sector 25, New Delhi",
    category: "Commercial",
    clientCategory: "Convention & Exhibition Infrastructure",
    industry: "Public Infrastructure",
    status: "Completed",
    description:
      "Electrical works labour subcontract package executed for the India International Convention and Expo Centre at Yashobhoomi, with scope covering cable laying, cable termination, and site-level electrical execution support.",
    summary:
      "Moonext Constructions Pvt Ltd worked on the Yashobhoomi Convention Centre project under a Larsen & Toubro Construction work order for ITC of electrical works, supporting a major convention and exhibition infrastructure package in New Delhi.",
    image: "/site/project-yashobhoomi.jpg",
    year: "2022-2023",
    metrics: [
      "Work order value: INR 63.83 lakh",
      "WO period: Sep 2022 to Jul 2023",
      "Scope: ITC of electrical works, cable laying and termination"
    ],
    scopeOfWork: [
      "Electrical execution support for cable laying, cable termination, and installation activities",
      "Site-level labour coordination aligned with structured work fronts",
      "Execution assistance under a major convention and exhibition infrastructure package"
    ],
    keyHighlights: [
      "Landmark convention and exhibition reference in New Delhi",
      "Work executed under a Larsen & Toubro Construction work order",
      "Electrical execution support delivered with practical site coordination"
    ],
    safetyCommitment:
      "Execution support on the Yashobhoomi package was approached with disciplined crew coordination, quality-focused site conduct, and attention to safe working practices across active electrical work fronts.",
    featured: true,
    seoTitle: "Yashobhoomi Convention Centre Project | Moonext Constructions Pvt Ltd",
    seoDescription:
      "Explore Moonext Constructions Pvt Ltd’s project contribution at Yashobhoomi Convention Centre in New Delhi, supporting landmark convention infrastructure with disciplined electrical execution."
  },
  {
    slug: "skyline-residency-bhopal",
    title: "Skyline Residency",
    clientName: "Skyline Residency",
    location: "Bhopal, Madhya Pradesh",
    category: "Residential",
    clientCategory: "Residential Development",
    industry: "Housing",
    status: "Ongoing",
    description:
      "Workforce and execution support for a mid-rise residential development with focused attention on labour coordination and reporting.",
    summary:
      "This engagement demonstrates Moonext’s approach to residential site execution, labour visibility, and milestone-focused coordination.",
    image: "/site/project-residential.svg",
    year: "2026",
    metrics: ["120+ labour records coordinated", "Attendance and settlement visibility enabled", "Phased residential delivery support"],
    scopeOfWork: [
      "Residential project execution support with structured crew coordination",
      "Daily labour visibility and attendance-linked field control",
      "Progress follow-up aligned with phased residential delivery"
    ],
    keyHighlights: [
      "Mid-rise residential work package support",
      "Operational visibility across labour deployment and site reporting",
      "Focus on disciplined execution and milestone follow-through"
    ],
    safetyCommitment:
      "Residential execution support is managed with attention to site discipline, supervised work practices, and quality standards that help maintain continuity across active build zones.",
    featured: true
  },
  {
    slug: "trade-center-fitout-ranchi",
    title: "Trade Center Fit-Out",
    clientName: "Trade Center Fit-Out",
    location: "Ranchi, Jharkhand",
    category: "Commercial",
    clientCategory: "Commercial Fit-Out",
    industry: "Commercial Interiors",
    status: "Completed",
    description:
      "Commercial execution support focused on time-bound delivery, fit-out sequencing, and disciplined crew supervision.",
    summary:
      "A commercial site assignment where fast coordination and workforce clarity were critical to maintaining delivery schedules.",
    image: "/site/project-commercial.svg",
    year: "2025",
    metrics: ["Time-sensitive commercial execution", "Multi-trade site coordination", "Completion-focused supervision support"],
    scopeOfWork: [
      "Fit-out execution support for time-sensitive commercial interiors",
      "Coordination across multiple trades and site work sequences",
      "Crew supervision assistance aligned with timely completion targets"
    ],
    keyHighlights: [
      "Commercial fit-out coordination under schedule pressure",
      "Multi-trade supervision support",
      "Focus on timely handover readiness"
    ],
    safetyCommitment:
      "Commercial fit-out work is supported with disciplined site supervision, cleaner execution sequencing, and practical attention to safe working conditions in active interior work areas.",
    featured: false
  },
  {
    slug: "district-link-road-package",
    title: "District Link Road Package",
    clientName: "District Link Road Package",
    location: "West Champaran, Bihar",
    category: "Infrastructure",
    clientCategory: "Road Infrastructure",
    industry: "Infrastructure",
    status: "Ongoing",
    description:
      "Infrastructure-oriented workforce and execution monitoring for road-linked development activity and site movement planning.",
    summary:
      "This project reflects our ability to align field teams, contractor coordination, and operational reporting for infrastructure work.",
    image: "/site/project-infrastructure.svg",
    year: "2026",
    metrics: ["Field deployment support", "Travel and crew movement tracking", "Execution reporting for multiple work fronts"],
    scopeOfWork: [
      "Infrastructure execution support across active road-linked work fronts",
      "Field deployment planning and crew movement coordination",
      "Operational reporting support for distributed site activity"
    ],
    keyHighlights: [
      "Infrastructure-focused workforce coordination",
      "Travel and movement planning for field teams",
      "Operational reporting across multiple execution zones"
    ],
    safetyCommitment:
      "Infrastructure assignments are coordinated with attention to field discipline, movement planning, and safe execution practices that support continuity across spread-out work fronts.",
    featured: false
  },
  {
    slug: "industrial-utility-upgrade",
    title: "Industrial Utility Upgrade",
    clientName: "Industrial Utility Upgrade",
    location: "Patna, Bihar",
    category: "Infrastructure",
    clientCategory: "Industrial Utilities",
    industry: "Industrial Infrastructure",
    status: "Completed",
    description:
      "Site execution support for utility-linked civil upgrades involving controlled labour allocation and safety-focused coordination.",
    summary:
      "A practical example of how Moonext brings structured site control to labour-intensive industrial work packages.",
    image: "/site/project-utility.svg",
    year: "2024",
    metrics: ["Safety-focused site supervision", "Structured execution scheduling", "Reliable labour and contractor coordination"],
    scopeOfWork: [
      "Execution support for utility-linked industrial upgrade activity",
      "Controlled labour allocation and supervision support",
      "Operational coordination aligned with reliable site scheduling"
    ],
    keyHighlights: [
      "Industrial utility upgrade support",
      "Controlled labour and contractor coordination",
      "Execution sequencing guided by practical site supervision"
    ],
    safetyCommitment:
      "Utility-linked industrial work is supported through safety-aware site discipline, structured supervision, and quality-focused execution planning.",
    featured: false
  }
];

export const homeHeroSlides = [
  {
    eyebrow: "Flagship Delivery",
    title: "Yashobhoomi Convention Centre, New Delhi",
    description:
      "Electrical works execution support delivered for one of India’s landmark convention and exhibition infrastructure projects.",
    image: "/site/project-yashobhoomi.jpg"
  },
  {
    eyebrow: "Electrical Execution",
    title: "Wiring, fit-out readiness, and disciplined installation support",
    description:
      "Moonext supports electrical site work with practical crew coordination, installation sequencing, and progress visibility.",
    image: "/site/slider-gridwork.jpg"
  },
  {
    eyebrow: "Workforce Operations",
    title: "Labour strength aligned to active site conditions",
    description:
      "Structured labour deployment, daily tracking, and responsive coordination help teams stay productive on live construction fronts.",
    image: "/site/slider-workers.jpg"
  },
  {
    eyebrow: "Infrastructure Support",
    title: "Concrete, crane, and site activity managed with field discipline",
    description:
      "From execution zones to vertical build fronts, Moonext helps maintain clarity between manpower, supervision, and on-ground delivery.",
    image: "/site/slider-concrete.jpg"
  },
  {
    eyebrow: "Tools & Readiness",
    title: "Prepared teams, equipped crews, and practical site execution",
    description:
      "Reliable site output depends on readiness, equipment control, and teams that can move with the pace of the project.",
    image: "/site/slider-tools.jpg"
  }
] as const;

export const aboutPagePhotos = [
  { src: "/site/project-yashobhoomi.jpg", alt: "Yashobhoomi Convention Centre exterior" },
  { src: "/site/slider-supervisors.jpg", alt: "Site supervision and workforce presence" },
  { src: "/site/slider-site-overview.jpg", alt: "Construction site overview with active work fronts" }
] as const;

export const servicesPagePhotos = [
  { src: "/site/slider-tools.jpg", alt: "Electrical tools and execution preparation" },
  { src: "/site/slider-gridwork.jpg", alt: "Electrical wiring and installation work" },
  { src: "/site/slider-workers.jpg", alt: "Electrical wall work and fit-out preparation" }
] as const;

export const projectsPagePhotos = [
  { src: "/site/project-yashobhoomi.jpg", alt: "Moonext flagship project visual" },
  { src: "/site/slider-yellow-crane.jpg", alt: "Crane operations on a construction site" },
  { src: "/site/slider-red-crane.jpg", alt: "Urban construction tower crane" }
] as const;

export const contactPagePhotos = [
  { src: "/site/slider-concrete.jpg", alt: "Concrete pumping and structural works" },
  { src: "/site/slider-site-overview.jpg", alt: "Site progress and labour deployment" },
  { src: "/site/slider-carpentry.jpg", alt: "Carpentry and site fabrication work" }
] as const;

export const careersPagePhotos = [
  { src: "/site/slider-workers.jpg", alt: "Electrical field work and technical execution" },
  { src: "/site/slider-supervisors.jpg", alt: "Supervisors and site staff on active work" },
  { src: "/site/slider-tools.jpg", alt: "Construction tools prepared for site work" }
] as const;

export const staffAccessPhotos = [
  { src: "/site/slider-gridwork.jpg", alt: "Electrical installation support on site" },
  { src: "/site/slider-concrete.jpg", alt: "Construction execution with equipment support" },
  { src: "/site/project-yashobhoomi.jpg", alt: "Landmark project visual from Moonext" }
] as const;

const sitePhotoGallery = [
  { title: "Yashobhoomi Convention Centre Exterior", image: "/site/project-yashobhoomi.jpg", category: "Featured Project" },
  { title: "Electrical Tools and Site Preparation", image: "/site/slider-tools.jpg", category: "Electrical Works" },
  { title: "Grid and Electrical Installation Support", image: "/site/slider-gridwork.jpg", category: "Execution" },
  { title: "Wiring and Fit-Out Readiness", image: "/site/slider-workers.jpg", category: "Electrical Works" },
  { title: "Concrete Pumping and Structural Progress", image: "/site/slider-concrete.jpg", category: "Construction" },
  { title: "Supervisor Presence on Working Sites", image: "/site/slider-supervisors.jpg", category: "Site Management" },
  { title: "Crane Operations and Vertical Development", image: "/site/slider-yellow-crane.jpg", category: "Infrastructure" },
  { title: "High-Rise Crane and Build Front", image: "/site/slider-red-crane.jpg", category: "Construction" },
  { title: "Site-Wide Progress and Crew Deployment", image: "/site/slider-site-overview.jpg", category: "Execution" },
  { title: "Carpentry Activity and On-Site Fabrication", image: "/site/slider-carpentry.jpg", category: "Site Activity" }
] as const;

const galleryImagePool = [
  "/site/gallery-structure.svg",
  "/site/gallery-concrete.svg",
  "/site/gallery-workforce.svg",
  "/site/gallery-equipment.svg",
  "/site/gallery-safety.svg",
  "/site/gallery-briefing.svg",
  "/site/project-residential.svg",
  "/site/project-commercial.svg",
  "/site/project-infrastructure.svg",
  "/site/project-utility.svg"
] as const;

const galleryTitles = [
  "Structural Progress Review",
  "Concrete & Formwork Activity",
  "Labour Coordination On Site",
  "Equipment & Material Movement",
  "Quality & Safety Walkthrough",
  "Execution Planning Huddle",
  "Site Layout Preparation",
  "Foundation Line Marking",
  "Steel Binding Inspection",
  "Column Casting Readiness",
  "Scaffolding Setup Check",
  "Blockwork Progress Zone",
  "Masonry Alignment Work",
  "Finishing Area Preparation",
  "Project Supervision Round",
  "Crew Briefing Session",
  "Site Access Monitoring",
  "Transit and Logistics Support",
  "Material Stacking Discipline",
  "Roadside Work Package",
  "Drainage Line Execution",
  "Ground Compaction Stage",
  "Labour Attendance Coordination",
  "Site Office Planning Review",
  "Progress Documentation Point",
  "Rebar and Shuttering Check",
  "Slab Preparation Stage",
  "Mechanical Movement Window",
  "Worker Safety Observation",
  "Execution Sequence Huddle",
  "Commercial Fit-Out Support",
  "Residential Block Progress",
  "Infrastructure Front Review",
  "Utility Corridor Activity",
  "Supervisor Field Follow-Up",
  "Concrete Pour Coordination",
  "Crew Deployment Snapshot",
  "Daily Site Discipline View",
  "Earthwork Support Window",
  "Surface Finishing Review",
  "Internal Movement Control",
  "Material Receipt Handling",
  "Site Readiness Observation",
  "Operational Control Point",
  "Project Area Coordination",
  "Labour Support Channel",
  "Multi-Trade Site Activity",
  "Execution Dashboard Reference",
  "Safety Barrier Monitoring",
  "Final Progress Capture"
] as const;

export const galleryItems = [
  ...sitePhotoGallery,
  ...galleryTitles.map((title, index) => ({
    title,
    image: galleryImagePool[index % galleryImagePool.length],
    category:
      index % 5 === 0
        ? "Safety"
        : index % 4 === 0
          ? "Workforce"
          : index % 3 === 0
            ? "Infrastructure"
            : index % 2 === 0
              ? "Execution"
              : "Site Activity"
  }))
];

export const careersHighlights = [
  "Growth-oriented construction environment",
  "Site execution and operations exposure",
  "Structured workforce systems and reporting mindset",
  "Opportunities across delivery, site coordination, and operations"
];

export const openRoles = [
  { title: "Site Supervisor", location: "Bihar / Jharkhand", type: "Full-time" },
  { title: "Project Coordinator", location: "Bhopal / Remote support", type: "Full-time" },
  { title: "Accounts & Payroll Executive", location: "Ramnagar, Bihar", type: "Full-time" }
];

export const faqItems = [
  {
    question: "Do you support labour-intensive construction operations?",
    answer:
      "Yes. Moonext is structured around site execution, labour deployment visibility, and coordination systems that support labour-heavy construction environments."
  },
  {
    question: "Can authorized staff access the labour management portal from the website?",
    answer:
      "Yes. The public website includes a secure staff access point that connects to the existing Labour Management System and redirects authorized users to the current dashboard."
  },
  {
    question: "Can company content be updated later?",
    answer:
      "Yes. The website content is organized in modular data structures so services, projects, contact details, and leadership information can be updated cleanly."
  }
];

export const socialPlaceholders = [
  { label: "LinkedIn", href: "#" },
  { label: "Facebook", href: "#" },
  { label: "Instagram", href: "#" }
];

export const legalIdentity = {
  legalName: "MOONEXT CONSTRUCTIONS PRIVATE LIMITED",
  displayName: "Moonext Constructions Pvt Ltd",
  cin: "U45209BR2020PTC046852",
  registeredOffice:
    "Asgari Bhuneshwar Chowk, RNG B. Complex, Ramnagar, West Champaran, Bihar – 845106",
  statutoryAuditor: "Murmuria & Associates, Chartered Accountants, Kolkata",
  verificationNote:
    "Website pe naam / CIN / registered office jaise legal details dalne se pehle MCA record se verify kar lena — documents me legal name MOONEXT CONSTRUCTIONS PRIVATE LIMITED diya gaya hai."
};

export const auditedFinancialSummary = [
  { fy: "FY 2021–22", revenue: "Nil", pbt: "−₹49,237", pat: "−₹49,237" },
  { fy: "FY 2022–23", revenue: "₹16.29 lakh", pbt: "₹91,646", pat: "₹58,094" },
  { fy: "FY 2023–24", revenue: "₹25.74 lakh", pbt: "₹1.43 lakh", pat: "₹91,190" },
  { fy: "FY 2024–25", revenue: "₹21.98 lakh", pbt: "₹1.22 lakh", pat: "₹77,450" }
];

export const auditedFinancialDetail = {
  fy202425: {
    revenueFromOperations: "₹21,97,765.05",
    profitAfterTax: "₹77,450.16",
    shareCapital: "₹1,00,000",
    reservesAndSurplus: "₹2,98,690.05",
    tradeReceivables: "₹17,08,673.69",
    currentInvestments: "₹12,013",
    cashAndEquivalents: "₹2,062.42",
    shortTermBorrowing: "₹2,50,000",
    tradePayables: "₹9,21,512.70"
  },
  positioningLine:
    "A growing company with a demonstrated operating track record and positive profitability across recent financial years.",
  cautionLine:
    "Note: FY 2024–25 revenue FY 2023–24 se kam hai, isliye website par “continuous exponential growth” jaisa claim nahi kiya gaya hai."
};

export const complianceHighlights = [
  "Audited Financial Reporting — statutory audit ke saath financial statements",
  "Auditor’s report me koi qualification, reservation ya adverse remark nahi bataya gaya",
  "FY 2024–25 Directors’ Report ke anusar auditor’s report me koi qualification/reservation/adverse remark nahi tha",
  "Financial compliance aur transparency ko trust element ki tarah present kiya gaya hai"
];

export const shareholdingFY2425 = [
  { name: "Vijay Kumar", shares: "5,000 equity shares", holding: "50%" },
  { name: "Vinay Kumar", shares: "5,000 equity shares", holding: "50%" }
];

export const companyAtAGlance = [
  "Years of financial reporting",
  "Revenue generated",
  "Profitability",
  "Share capital",
  "Directors",
  "Registered office",
  "Statutory audit",
  "Financial compliance",
  "Business activities",
  "Financial ratios",
  "Year-on-year financial performance"
];

export const profileInfoGap = {
  title: "Civil / Mechanical project portfolio — abhi documents se available nahi",
  description:
    "Audited financial statements + Directors’ Reports + Auditor’s Reports se project-wise civil/mechanical portfolio nahi ban sakta. Website par project names, client names, locations, contract value, duration, status, scope, equipment, manpower, certifications, work orders ya completion certificates tabhi add karein jab company profile / project list / work orders / completion certificates / capability document mile.",
  needed: [
    "Civil Engineering Services",
    "Mechanical Engineering Services",
    "Electrical / MEP, agar applicable ho",
    "Infrastructure work",
    "Buildings",
    "Roads",
    "Bridges",
    "Industrial projects",
    "Government projects",
    "Private projects",
    "Project names",
    "Client names",
    "Project locations",
    "Contract value",
    "Project duration",
    "Completed / ongoing status",
    "Scope of work",
    "Equipment / machinery",
    "Manpower",
    "Certifications",
    "Work orders",
    "Completion certificates"
  ]
};
