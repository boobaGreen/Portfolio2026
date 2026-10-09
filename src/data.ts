/* Contenuti del portfolio: condivisi tra le versioni di design. */

export const journeySteps = [
  {
    year: "2021",
    title: "The Professional Pivot",
    desc: "A bold transition from 22 years of leadership to my true passion — scalable engineering and systems architecture.",
    icon: "🔄",
    side: "left" as const,
    highlight: true,
  },
  {
    year: "2022–2024",
    title: "Full Stack Mastery",
    desc: "Master in Full Stack Development (MERN) @ Start2Impact. React, TypeScript, Node.js, MongoDB. Building real projects.",
    icon: "💻",
    side: "right" as const,
  },
  {
    year: "2024",
    title: "Web3 & Blockchain Deep Dive",
    desc: "Solana Bootcamp, ICP Protocol, EPICODE-Binance Scholarship. Smart contracts, DeFi, tokenization.",
    icon: "⛓️",
    side: "left" as const,
  },
  {
    year: "2025",
    title: "DevOps & Observability",
    desc: "Docker, Kubernetes, OpenShift, Prometheus, OpenTelemetry, Grafana, Linux, CI/CD. Building the ops muscle.",
    icon: "🔧",
    side: "right" as const,
    highlight: true,
  },
  {
    year: "2025–Now",
    title: "Agiler @ Agile Lab",
    desc: "Junior Application Maintenance — managing Kafka clusters and observability stacks (Prometheus, Grafana, Jaeger) in OpenShift environments.",
    icon: "🚀",
    side: "left" as const,
    highlight: true,
  },
  {
    year: "2026",
    title: "IOTA Hackathon — GiftBlitz",
    desc: "Building a decentralized gift card marketplace. 63 European teams. Featured on the official IOTA blog.",
    icon: "🏆",
    side: "right" as const,
  },
  {
    year: "2026",
    title: "Felis — First Product on Google Play",
    desc: "Designed, built and shipped an ad-free game for cats as a solo founder: canvas engine, Android TWA, Play Billing, SEO and an automated organic social pipeline.",
    icon: "🐾",
    side: "left" as const,
    highlight: true,
  },
];

export const skillCategories = [
  {
    title: "DevOps & Cloud",
    icon: "⚙️",
    color: "primary",
    skills: [
      "Docker",
      "Kubernetes",
      "OpenShift",
      "Jenkins",
      "CI/CD",
      "Linux",
      "GCP",
      "AWS",
      "Azure",
    ],
    highlight: true,
  },
  {
    title: "Observability",
    icon: "📊",
    color: "accent",
    skills: ["Prometheus", "Grafana", "OpenTelemetry", "Jaeger", "Kafka"],
    highlight: true,
  },
  {
    title: "Web3 / Blockchain",
    icon: "⛓️",
    color: "purple",
    skills: [
      "Solidity",
      "Hardhat",
      "Foundry",
      "Ethers.js",
      "IOTA",
      "Solana",
      "ICP",
      "OpenZeppelin",
    ],
  },
  {
    title: "Frontend",
    icon: "🎨",
    color: "primary",
    skills: ["React", "TypeScript", "Next.js", "TailwindCSS", "HTML5", "CSS3"],
  },
  {
    title: "Backend",
    icon: "🖥️",
    color: "accent",
    skills: [
      "Node.js",
      "Express",
      "PHP",
      "Laravel",
      "MongoDB",
      "PostgreSQL",
      "SQL",
      "Prisma",
      "Postman",
    ],
  },
  {
    title: "AI & Data",
    icon: "🤖",
    color: "purple",
    skills: ["Python", "AI Avanzata", "Data Analysis"],
  },
];

export type ProjectCategory = 'product' | 'devops' | 'web3' | 'education';

export interface Project {
  title: string;
  badge: string;
  desc: string;
  tech: string[];
  category: ProjectCategory;
  live?: string;
  github?: string;
  store?: string;
  image: string;
  featured: boolean;
  blog?: string;
  highlights?: string[];
  status?: {
    label: string;
    type: 'live' | 'testnet' | 'dev';
  };
}

export const projects: Project[] = [
  {
    title: 'Felis: Apex Hunter',
    badge: 'Android App • Google Play',
    desc: 'An ad-free hunting game for cats, built around how cats actually see: blue and green prey that move like real prey, adaptive difficulty and automatic rest breaks. Free when you play together; the one-time Pro unlock adds an "Auto-Loop" cat-sitter mode for short absences. Designed, built, shipped and marketed solo.',
    tech: ['React 19', 'TypeScript', 'Canvas Engine', 'PWA / TWA', 'Play Billing', 'Vercel'],
    category: 'product',
    live: 'https://www.apex-hunter.eu/',
    store: 'https://play.google.com/store/apps/details?id=app.clod.felis',
    image: "/assets/felis.png",
    featured: true,
    highlights: ['Live on Google Play', 'No ads, no accounts', 'One-time purchase'],
    status: { label: 'Live • Google Play', type: 'live' },
  },
  {
    title: 'DevHarbor',
    badge: 'DevOps Learning Platform',
    desc: 'An interactive, production-grade learning platform for mastering Git, Docker, and Kubernetes. Features progress tracking, modular curriculums, and hands-on labs to bridge the gap between theory and real-world infrastructure.',
    tech: ['React', 'TypeScript', 'Docker', 'Kubernetes', 'Git'],
    category: 'devops',
    live: 'https://agile.claudiodallara.it/',
    github: 'https://github.com/boobaGreen/agileCourse',
    image: "/assets/devharbor.png",
    featured: true,
    status: { label: 'Online • Real Domain', type: 'live' },
  },
  {
    title: 'GiftBlitz',
    badge: 'IOTA Hackathon 2026',
    desc: 'Decentralized P2P gift card marketplace built on IOTA. Trustless protocol featuring EVM smart contracts and Game Theory-driven security. Officially featured on the IOTA Foundation blog.',
    tech: ['IOTA', 'Solidity', 'Web3', 'Node.js'],
    category: 'web3',
    live: 'https://giftblitz.claudiodallara.it/',
    github: 'https://github.com/boobaGreen/GiftBlitzFull',
    blog: 'https://blog.iota.org/build-now-masterz-hackathon/',
    image: "/assets/giftblitz.png",
    featured: true,
    status: { label: 'Working on Testnet • Provisionary', type: 'testnet' },
  },
  {
    title: "Impara il C sul serio",
    badge: "Educational Platform",
    desc: "An interactive platform to master C programming from scratch. Features an integrated editor and low-level simulations. Content by Salvatore Sanfilippo (antirez).",
    tech: ["C", "WebAssembly", "React", "TypeScript"],
    category: 'education',
    live: "https://c.claudiodallara.it/",
    github: "https://github.com/boobaGreen/C-course---Salvatore-Sanfilippo",
    image: "/assets/c_course.png",
    featured: true,
    status: { label: 'Online • Real Domain', type: 'live' },
  },
  {
    title: "Vim Mastery: Zero to Wizard",
    badge: "Interactive WASM Course",
    desc: "Master Vim through a gamified, browser-based experience. Features a real Vim terminal powered by WebAssembly, a 12-lesson curriculum, and an achievements system. Fully responsive and bi-lingual.",
    tech: ["React 19", "Vite", "vim-wasm", "Tailwind CSS v4", "Framer Motion"],
    category: 'education',
    live: "https://vim.claudiodallara.it/",
    github: "https://github.com/boobaGreen/vim",
    image: "/assets/vim_project.png",
    featured: true,
    status: { label: 'Online • Real Domain', type: 'live' },
  },
  {
    title: 'LinuxQuest 🐧',
    badge: 'Multi-Cert Training Suite',
    desc: 'Comprehensive gamified platform for Linux certification mastery. Supports LPI Linux Essentials, LPIC-1 (Exams 101 & 102), LPIC-2, and RHCSA. Features interactive labs and real-world exam simulations.',
    tech: ['React', 'TypeScript', 'LPI', 'RHCSA', 'Vite'],
    category: 'devops',
    live: 'https://linux.claudiodallara.it/',
    github: 'https://github.com/boobaGreen/lpi_essential/tree/multi-course',
    image: "/assets/linuxquest.png",
    featured: true,
    status: { label: 'Online • Real Domain', type: 'live' },
  },
];

export const archiveProjects = [
  {
    title: 'RoughLogic',
    desc: 'Personal dev lab and technical blog concept. Exploring complex logic and modular architecture.',
    tech: ['React', 'Node.js', 'Vercel'],
    live: 'https://www.roughlogic.eu/',
    github: 'https://github.com/boobaGreen/RoughLogic',
  },
  {
    title: 'FoosArena',
    desc: 'Platform for foosball (Calcio Balilla) tournament management and player rankings.',
    tech: ['React', 'Firebase', 'Tailwind'],
    live: 'https://www.foosarena.eu/',
    github: 'https://github.com/boobaGreen/calcio_balilla',
  },
  {
    title: 'ICP Randomizer',
    desc: 'TypeScript studio project built for the ICP Master Class. Exploring decentralized compute with Azle.',
    tech: ['ICP', 'TypeScript', 'Azle'],
    live: 'https://kwjpy-liaaa-aaaap-ahaea-cai.raw.icp0.io/',
    github: 'https://github.com/boobaGreen/randomizer',
  },
  {
    title: 'Cartellini Unieuro',
    desc: 'Internal productivity tool for price tag management in retail. My first real-world problem-solving via code.',
    tech: ['React', 'HTML', 'CSS'],
    live: 'https://eloquent-flan-e6f870.netlify.app',
  },
]

export const certGroups = [
  {
    area: "DevOps & Cloud",
    color: "primary",
    certs: [
      { name: "Docker Per Comuni Mortali", issuer: "Udemy", date: "Jan 2026" },
      {
        name: "OpenShift for the Absolute Beginners",
        issuer: "Udemy",
        date: "Dec 2025",
      },
      {
        name: "Prometheus Monitoring & Alerting",
        issuer: "Udemy",
        date: "Sep 2025",
      },
      { name: "OpenTelemetry Foundations", issuer: "Udemy", date: "Sep 2025" },
      { name: "Linux LPI Essentials", issuer: "Udemy", date: "Apr 2025" },
      {
        name: "Architecting with Google Kubernetes Engine (GKE)",
        issuer: "Coursera / Google",
        date: "2022",
      },
      {
        name: "Elastic Google Cloud Infrastructure: Scaling & Automation",
        issuer: "Coursera / Google",
        date: "2022",
      },
      {
        name: "Essential Google Cloud Infrastructure: Core Services",
        issuer: "Coursera / Google",
        date: "2022",
      },
      {
        name: "Google Cloud Fundamentals",
        issuer: "Coursera / Google",
        date: "2022",
      },
    ],
  },
  {
    area: "Web3 / Blockchain",
    color: "purple",
    certs: [
      {
        name: "MasterZ × IOTA Hackathon",
        issuer: "MasterZ / IOTA",
        date: "2026 (ongoing)",
      },
      {
        name: "EPICODE-Binance Web3 Scholarship",
        issuer: "EPICODE / Binance",
        date: "Mar 2025",
      },
      {
        name: "MasterZ × Solana Bootcamp",
        issuer: "MasterZ / Solana Foundation",
        date: "2024",
      },
      {
        name: "ICP Protocol — Azle",
        issuer: "ICP Hub Italia",
        date: "Mar 2024",
      },
      {
        name: "Master Blockchain Development",
        issuer: "Start2Impact",
        date: "2024–2025",
      },
    ],
  },
  {
    area: "Full Stack & AI",
    color: "accent",
    certs: [
      { name: "AI Avanzata", issuer: "Profession AI", date: "Sep 2025" },
      { name: "Python Programming", issuer: "Profession AI", date: "Sep 2025" },
      {
        name: "Master Full Stack Development",
        issuer: "Start2Impact",
        date: "Nov 2022 – Feb 2024",
      },
    ],
  },
];

/* Testi delle sezioni (stessi della versione pubblicata). */
export const site = {
  logo: { prefix: "$", name: "claudio", suffix: ".dallara" },
  nav: [
    { label: "Journey", href: "#journey" },
    { label: "Skills", href: "#skills" },
    { label: "Projects", href: "#projects" },
    { label: "Certifications", href: "#certs" },
    { label: "Contact", href: "#contact" },
  ],
  hero: {
    badge: { text: "currently working @", company: "Agile Lab", url: "https://www.agilelab.it/" },
    firstName: "Claudio",
    lastName: "Dall'Ara",
    roles: [
      "DevOps & Observability Engineer",
      "Full Stack Developer",
      "Indie App Maker",
      "Web3 Builder",
      "Continuous Learner",
    ],
    intro: [
      { t: "Ensuring reliability and " },
      { t: "performance in Observability systems", c: "cyan" },
      { t: " at scale. Currently managing " },
      { t: "Kafka, OpenShift, and Jenkins-driven stacks", c: "lime" },
      { t: "—leveraging " },
      { t: "OpenTelemetry, Prometheus, and Grafana", c: "cyan" },
      { t: " for deep monitoring. In my free time I ship " },
      { t: "real products, Web3 experiments and educational side projects", c: "violet" },
      { t: " to keep evolving." },
    ],
    ctaPrimary: { label: "View My Work", href: "#projects" },
    ctaSecondary: { label: "My Journey", href: "#journey" },
    showcase: {
      label: "Latest launch",
      kicker: "Android • Google Play",
      title: "Felis: Apex Hunter",
      text: "An ad-free hunting game for cats, built around feline vision. Shipped solo, end to end.",
      image: "/assets/felis.png",
    },
    dayJob: { label: "day job", title: "Agiler @ Agile Lab", tags: ["Kafka", "OpenShift", "Grafana", "OTel"] },
  },
  metrics: [
    { target: 20, suffix: "+", label: "Courses Completed" },
    { target: 4, suffix: "", label: "Blockchain Ecosystems" },
    { target: 15, suffix: "+", label: "Projects Built" },
    { target: 4, suffix: "+", label: "Years of Code" },
  ],
  sections: {
    journey: { index: "01", tag: "My Evolution", title: "Engineering Transformation", subtitle: "Bringing years of leadership experience into the technical space to manage and optimize resilient and observable systems." },
    skills: { index: "02", tag: "Tech Stack", title: "Skills & Expertise", subtitle: "Focused on DevOps, Observability, and Cloud — while exploring and maintaining various stack components." },
    projects: { index: "03", tag: "Portfolio", title: "Selected Work", subtitle: "Real products, learning platforms and experiments across systems, infrastructure and Web3.", other: "Other Projects" },
    certs: { index: "04", tag: "Lifelong Learning", title: "Courses & Ongoing Training", subtitle: "From intensive bootcamps to specialized technical modules. Currently preparing for professional Linux certifications.", inProgressTitle: "Certifications In Progress", inProgress: ["LPI Linux Essentials", "LPIC-1 (101 & 102)"] },
  },
  contact: {
    tag: "Let's Connect",
    title: "Let's Work Together",
    text: "Looking for a curious, proactive engineer who brings both technical depth and strategic problem-solving to the table? Let's talk.",
    linkedin: "https://www.linkedin.com/in/claudio-dall-ara-730aa0302/",
    github: "https://github.com/boobaGreen",
  },
  footer: {
    line1: "designed & built by",
    name: "Claudio Dall'Ara",
    year: "2026",
    line2: "React + TypeScript + Tailwind v4 · Deployed on Vercel",
  },
};
