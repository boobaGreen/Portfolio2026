import { useEffect, useState, useRef } from "react";
import { Background3D } from "./components/Background3D";
import { LaserCard } from "./components/LaserCard";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import "./App.css";

/* ───────── SHARED COMPONENTS ───────── */

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  // Scroll-spy: track active section
  useEffect(() => {
    const sectionIds = ["journey", "skills", "projects", "certs", "contact"];
    const observers: IntersectionObserver[] = [];
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(`#${id}`); },
        { rootMargin: "-40% 0px -55% 0px" },
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const links = [
    { label: "Journey", href: "#journey" },
    { label: "Skills", href: "#skills" },
    { label: "Projects", href: "#projects" },
    { label: "Certifications", href: "#certs" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <>
      <nav className="fixed top-4 inset-x-0 z-50 px-4">
        <div
          className={`max-w-5xl mx-auto flex items-center justify-between rounded-full border pl-5 pr-2 py-2 transition-all duration-500 ${scrolled ? "bg-dark-900/75 backdrop-blur-xl border-white/10 shadow-2xl shadow-black/40" : "bg-dark-900/30 backdrop-blur-md border-white/5"}`}
        >
          <a
            href="#"
            className="font-mono font-bold text-primary text-base tracking-tight"
          >
            <span className="text-accent">$</span> claudio
            <span className="text-text-dim">.dallara</span>
          </a>
          <div className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${
                  activeSection === l.href
                    ? "bg-white/10 text-white"
                    : "text-text-dim hover:text-white hover:bg-white/5"
                }`}
              >
                {l.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <a
              href="#contact"
              className="hidden md:inline-flex px-5 py-2 bg-gradient-to-r from-primary to-accent rounded-full text-dark-900 text-sm font-bold hover:shadow-lg hover:shadow-primary/30 transition-all"
            >
              Let's Talk
            </a>
            {/* Hamburger button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden flex flex-col gap-1.5 p-2"
              aria-label="Toggle menu"
            >
              <span className={`block w-6 h-0.5 bg-primary transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`block w-6 h-0.5 bg-primary transition-all duration-300 ${mobileOpen ? "opacity-0" : ""}`} />
              <span className={`block w-6 h-0.5 bg-primary transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-40 bg-dark-900/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setMobileOpen(false)}
      />
      {/* Mobile drawer */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-72 bg-dark-800 border-l border-white/5 shadow-2xl transition-transform duration-300 md:hidden ${mobileOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex flex-col pt-20 px-8 gap-6">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className={`text-lg font-medium tracking-wide uppercase transition-colors ${
                activeSection === l.href ? "text-primary" : "text-text-dim hover:text-primary"
              }`}
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setMobileOpen(false)}
            className="mt-4 text-center px-5 py-3 bg-primary/10 border border-primary/30 rounded-full text-primary text-sm font-semibold hover:bg-primary/20 transition-all"
          >
            Let's Talk
          </a>
        </div>
      </div>
    </>
  );
}

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setVisible(true);
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function ScrambleText({ text, visible }: { text: string; visible: boolean }) {
  const [displayText, setDisplayText] = useState(visible ? text : "");
  
  useEffect(() => {
    if (!visible) return;

    const chars = "!<>-_\\\\/[]{}—=+*^?#_";
    let iteration = 0;
    let frameId: number;
    
    const animate = () => {
      setDisplayText(
        text
          .split("")
          .map((char, index) => {
            if (index < iteration) {
              return char;
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );

      // Increase the speed of deciphering by adding more than 1 to iteration per frame
      iteration += 1 / 3;

      if (iteration < text.length) {
        frameId = requestAnimationFrame(animate);
      } else {
        setDisplayText(text);
      }
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [text, visible]);

  return <span>{displayText}</span>;
}

function SectionTitle({
  tag,
  title,
  subtitle,
  index,
}: {
  tag: string;
  title: string;
  subtitle?: string;
  index?: string;
}) {
  const { ref, visible } = useInView();
  return (
    <div
      ref={ref}
      className={`max-w-6xl mx-auto px-6 mb-14 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
    >
      <div className="flex items-center gap-3 font-mono text-xs tracking-[0.25em] uppercase">
        {index && <span className="text-text-dim">{index}</span>}
        <span className="h-px w-10 bg-gradient-to-r from-accent to-transparent" />
        <span className="text-accent">{tag}</span>
      </div>
      <h2 className="font-display text-4xl md:text-6xl font-bold mt-4 tracking-tight text-white">
        <ScrambleText text={title} visible={visible} />
      </h2>
      {subtitle && (
        <p className="text-text-dim mt-4 max-w-2xl text-lg leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}

/* ───────── HERO ───────── */

function TypingText({ texts }: { texts: string[] }) {
  const [idx, setIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const target = texts[idx];
    const speed = deleting ? 30 : 60;

    if (!deleting && displayed === target) {
      const t = setTimeout(() => setDeleting(true), 2000);
      return () => clearTimeout(t);
    }
    
    if (deleting && displayed === "") {
      const t = setTimeout(() => {
        setDeleting(false);
        setIdx((idx + 1) % texts.length);
      }, 500);
      return () => clearTimeout(t);
    }

    const t = setTimeout(() => {
      setDisplayed(prev => 
        deleting
          ? prev.slice(0, prev.length - 1)
          : target.slice(0, prev.length + 1)
      );
    }, speed);
    return () => clearTimeout(t);
  }, [displayed, deleting, idx, texts]);

  return (
    <span className="font-mono text-accent">
      {displayed}
      <span className="animate-pulse">▍</span>
    </span>
  );
}

function ScrollIndicator() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 3000);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className={`absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-opacity duration-1000 ${visible ? "opacity-100 animate-bounce" : "opacity-0 pointer-events-none"}`}>
      <span className="text-text-dim text-xs font-mono">scroll</span>
      <div className="w-px h-8 bg-gradient-to-b from-primary/50 to-transparent" />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative min-h-screen flex items-start lg:items-center justify-center overflow-hidden">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,212,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] animate-pulse" />
      <div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple/5 rounded-full blur-[120px] animate-pulse"
        style={{ animationDelay: "1s" }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-32 pb-28 w-full grid lg:grid-cols-[1.2fr_1fr] gap-14 items-center">
        <div>
          {/* Terminal badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dark-700/80 border border-white/5 mb-8">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="font-mono text-xs text-text-dim">
              currently working @ <a href="https://www.agilelab.it/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline transition-all">Agile Lab</a>
            </span>
          </div>

          <h1 className="font-display text-6xl sm:text-7xl md:text-8xl font-bold leading-[0.95] tracking-tight">
            <span className="text-white">Claudio</span>
            <br />
            <span className="bg-gradient-to-r from-primary via-accent to-purple bg-clip-text text-transparent">
              Dall'Ara
            </span>
          </h1>

          <div className="mt-7 text-xl md:text-2xl text-text-dim font-light h-8">
            <TypingText
              texts={[
                "DevOps & Observability Engineer",
                "Full Stack Developer",
                "Indie App Maker",
                "Web3 Builder",
                "Continuous Learner",
              ]}
            />
          </div>

          <p className="mt-7 text-lg text-text-dim max-w-xl leading-relaxed">
            Ensuring reliability and <span className="text-primary font-semibold">performance in Observability systems</span> at scale.
            Currently managing <span className="text-accent font-semibold">Kafka, OpenShift, and Jenkins-driven stacks</span>—leveraging <span className="text-primary font-semibold">OpenTelemetry, Prometheus, and Grafana</span> for deep monitoring.
            In my free time I ship <span className="text-purple font-semibold">real products, Web3 experiments and educational side projects</span> to keep evolving.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <a
              href="#projects"
              className="group px-8 py-3.5 bg-gradient-to-r from-primary to-accent rounded-full text-dark-900 font-bold text-sm tracking-wide hover:shadow-lg hover:shadow-primary/25 transition-all hover:scale-105"
            >
              View My Work <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
            </a>
            <a
              href="#journey"
              className="px-8 py-3.5 border border-white/10 rounded-full text-text font-medium text-sm hover:border-primary/40 hover:text-primary transition-all"
            >
              My Journey
            </a>
          </div>
        </div>

        <HeroShowcase />
      </div>
      <ScrollIndicator />
    </section>
  );
}

function HeroShowcase() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 0.3, ease: "easeOut" }}
      className="relative hidden md:block"
    >
      {/* Latest launch */}
      <a
        href="#projects"
        className="group block rounded-3xl p-px bg-gradient-to-br from-primary/60 via-purple/40 to-accent/50 shadow-2xl shadow-purple/20"
      >
        <div className="rounded-[calc(1.5rem-1px)] bg-dark-800/95 backdrop-blur-xl overflow-hidden">
          <div className="relative aspect-[16/10] overflow-hidden">
            <img
              src="/assets/felis.png"
              alt="Felis: Apex Hunter app screens"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-800 via-transparent to-transparent" />
            <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-dark-900/70 backdrop-blur border border-emerald-500/30 text-emerald-400 text-[11px] font-mono font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              LATEST LAUNCH
            </span>
          </div>
          <div className="p-6">
            <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">Android • Google Play</div>
            <div className="font-display text-2xl font-bold text-white mt-1">Felis: Apex Hunter</div>
            <p className="text-text-dim text-sm mt-2">An ad-free hunting game for cats, built around feline vision. Shipped solo, end to end.</p>
          </div>
        </div>
      </a>

      {/* Day job card */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative mt-5 ml-auto -mr-4 w-64 rounded-2xl border border-white/10 bg-dark-800/90 backdrop-blur-xl p-4 shadow-2xl shadow-black/50"
      >
        <div className="flex items-center gap-2 font-mono text-[11px] text-text-dim">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" /> day job
        </div>
        <div className="text-white font-semibold mt-1">Agiler @ Agile Lab</div>
        <div className="flex flex-wrap gap-1 mt-2">
          {["Kafka", "OpenShift", "Grafana", "OTel"].map((t) => (
            <span key={t} className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-primary/10 text-primary border border-primary/20">{t}</span>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ───────── METRICS ───────── */

function AnimatedCounter({
  target,
  label,
  suffix = "",
}: {
  target: number;
  label: string;
  suffix?: string;
}) {
  const { ref, visible } = useInView();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const step = Math.max(1, Math.ceil(target / 40));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else setCount(start);
    }, 30);
    return () => clearInterval(timer);
  }, [visible, target]);

  return (
    <div ref={ref} className="text-center p-6">
      <div className="text-4xl md:text-5xl font-black text-primary font-mono">
        {visible ? count : 0}
        {suffix}
      </div>
      <div className="mt-2 text-text-dim text-sm font-medium uppercase tracking-wider">
        {label}
      </div>
    </div>
  );
}

function Metrics() {
  return (
    <section className="py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px rounded-3xl overflow-hidden border border-white/10 bg-white/10 backdrop-blur-xl [&>*]:bg-dark-900/85">
          <AnimatedCounter target={20} suffix="+" label="Courses Completed" />
          <AnimatedCounter target={4} label="Blockchain Ecosystems" />
          <AnimatedCounter target={15} suffix="+" label="Projects Built" />
          <AnimatedCounter target={4} suffix="+" label="Years of Code" />
        </div>
      </div>
    </section>
  );
}

/* ───────── JOURNEY TIMELINE ───────── */

const journeySteps = [
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

function JourneyItem({ step, i }: { step: typeof journeySteps[0], i: number }) {
  const { ref, visible } = useInView(0.2);
  return (
    <div
      ref={ref}
      className={`relative mb-12 md:mb-16 flex flex-col md:flex-row items-center gap-4 md:gap-8
        transition-all duration-700
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
        ${step.side === "right" ? "md:flex-row-reverse" : ""}`}
      style={{ transitionDelay: `${i * 150}ms` }}
    >
      <div className="flex-1">
        <LaserCard colorType="primary" className={`p-6 ${step.highlight ? "border-primary/20 shadow-lg shadow-primary/5" : ""}`}>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">{step.icon}</span>
            <span className="font-mono text-primary text-sm font-bold">{step.year}</span>
          </div>
          <h3 className={`text-lg font-bold ${step.highlight ? "text-primary" : "text-white"}`}>{step.title}</h3>
          <p className="text-text-dim mt-2 text-sm leading-relaxed">{step.desc}</p>
        </LaserCard>
      </div>
      <div className={`hidden md:flex w-4 h-4 rounded-full border-2 shrink-0 ${step.highlight ? "border-primary bg-primary/30 shadow-lg shadow-primary/50" : "border-dark-600 bg-dark-800"}`} />
      <div className="flex-1 hidden md:block" />
    </div>
  );
}

function Journey() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const pathHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  
  return (
    <section id="journey" className="py-24 relative" ref={containerRef}>
      <SectionTitle
        index="01"
        tag="My Evolution"
        title="Engineering Transformation"
        subtitle="Bringing years of leadership experience into the technical space to manage and optimize resilient and observable systems."
      />

      <div className="max-w-4xl mx-auto px-6 relative">
        {/* Background dark track */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/5 hidden md:block" />
        
        {/* Glowing Data Flow line */}
        <motion.div 
          className="absolute left-[calc(50%-1px)] top-0 w-[2px] bg-gradient-to-b from-primary via-accent to-primary hidden md:block origin-top shadow-[0_0_15px_rgba(0,255,136,0.6)]"
          style={{ height: pathHeight }}
        />
        
        {journeySteps.map((step, i) => (
          <JourneyItem key={i} step={step} i={i} />
        ))}
      </div>
    </section>
  );
}

/* ───────── SKILLS ───────── */

const skillCategories = [
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

function SkillCard({ cat, i }: { cat: typeof skillCategories[0], i: number }) {
  const { ref, visible } = useInView();
  const colorMap: Record<string, string> = {
    primary: "text-primary border-primary/20 shadow-primary/10",
    accent: "text-accent border-accent/20 shadow-accent/10",
    purple: "text-purple border-purple/20 shadow-purple/10",
  };
  const tagColorMap: Record<string, string> = {
    primary: "bg-primary/10 text-primary border-primary/20",
    accent: "bg-accent/10 text-accent border-accent/20",
    purple: "bg-purple/10 text-purple border-purple/20",
  };
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      style={{ transitionDelay: `${i * 100}ms` }}
    >
      <LaserCard 
        colorType={cat.color as "primary" | "accent" | "purple"}
        className={`p-6 h-full ${cat.highlight ? `border-primary/20 shadow-lg ${colorMap[cat.color]}` : ""}`}
      >
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">{cat.icon}</span>
          <h3 className={`font-bold text-lg ${cat.highlight ? colorMap[cat.color]?.split(" ")[0] : "text-white"}`}>
            {cat.title}
          </h3>
          {cat.highlight && (
            <span className="ml-auto text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border bg-primary/10 text-primary border-primary/30">
              FOCUS
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {cat.skills.map((s) => (
            <span key={s} className={`px-3 py-1 rounded-full text-xs font-medium border ${tagColorMap[cat.color]}`}>
              {s}
            </span>
          ))}
        </div>
      </LaserCard>
    </div>
  );
}

function Skills() {
  return (
    <section id="skills" className="py-24 bg-dark-800/30">
      <SectionTitle
        index="02"
        tag="Tech Stack"
        title="Skills & Expertise"
        subtitle="Focused on DevOps, Observability, and Cloud — while exploring and maintaining various stack components."
      />
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skillCategories.map((cat, i) => (
          <SkillCard key={i} cat={cat} i={i} />
        ))}
      </div>
    </section>
  );
}

/* ───────── PROJECTS ───────── */

type ProjectCategory = 'product' | 'devops' | 'web3' | 'education';

interface Project {
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

const projects: Project[] = [
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

const archiveProjects = [
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

const projectFilters: { key: "all" | ProjectCategory; label: string }[] = [
  { key: "all", label: "All" },
  { key: "product", label: "Products" },
  { key: "devops", label: "DevOps" },
  { key: "web3", label: "Web3" },
  { key: "education", label: "Learning" },
];

function ProjectCard({ p, i, large }: { p: Project; i: number; large: boolean }) {
  const href = p.live || p.store || p.github;
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.45, delay: i * 0.05 }}
      className={`group relative rounded-3xl p-px bg-gradient-to-b from-white/15 via-white/5 to-white/[0.02] hover:from-primary/50 hover:via-purple/25 transition-colors duration-500 ${large ? "md:col-span-2 lg:row-span-2" : ""}`}
    >
      <div className="h-full rounded-[calc(1.5rem-1px)] bg-dark-800/90 backdrop-blur-xl overflow-hidden flex flex-col">
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={`relative block overflow-hidden shrink-0 ${large ? "aspect-[16/10] lg:aspect-auto lg:grow lg:min-h-[340px]" : "aspect-[16/10]"}`}
        >
          <img
            src={p.image}
            alt={p.title}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-800 via-dark-800/10 to-transparent" />
          {p.status && (
            <span
              className={`absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-dark-900/70 backdrop-blur border text-[10px] font-mono font-bold ${
                p.status.type === "live"
                  ? "border-emerald-500/30 text-emerald-400"
                  : "border-amber-500/30 text-amber-400"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${p.status.type === "live" ? "bg-emerald-400" : "bg-amber-400"} animate-pulse`} />
              {p.status.label}
            </span>
          )}
        </a>
        <div className={`flex flex-col ${large ? "p-7 md:p-9" : "p-6 grow"}`}>
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">{p.badge}</span>
          <h3 className={`font-display font-bold text-white mt-2 tracking-tight ${large ? "text-3xl md:text-4xl" : "text-2xl"}`}>
            {p.title}
          </h3>
          <p className={`text-text-dim leading-relaxed mt-3 ${large ? "text-base" : "text-sm"}`}>{p.desc}</p>
          {p.highlights && (
            <ul className="mt-5 flex flex-wrap gap-2">
              {p.highlights.map((h) => (
                <li key={h} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-medium">
                  <span aria-hidden>✓</span> {h}
                </li>
              ))}
            </ul>
          )}
          <div className="flex flex-wrap gap-1.5 mt-5">
            {p.tech.map((t) => (
              <span key={t} className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-dark-700 text-primary/90 border border-primary/15">
                {t}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 mt-auto pt-6">
            {p.live && (
              <a href={p.live} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 rounded-full bg-gradient-to-r from-primary to-accent text-dark-900 text-xs font-bold hover:shadow-lg hover:shadow-primary/25 transition-all">
                {p.category === "product" ? "Visit Website ↗" : "Launch App ↗"}
              </a>
            )}
            {p.store && (
              <a href={p.store} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 rounded-full border border-emerald-500/30 text-emerald-400 text-xs font-bold hover:bg-emerald-500/10 transition-all">
                Google Play ↗
              </a>
            )}
            {p.github && (
              <a href={p.github} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 rounded-full border border-white/10 text-text-dim text-xs font-bold hover:border-white/30 hover:text-white transition-all">
                Source
              </a>
            )}
            {p.blog && (
              <a href={p.blog} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 rounded-full border border-accent/20 text-accent text-xs font-bold hover:bg-accent/10 transition-all">
                IOTA Blog ↗
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function Projects() {
  const [filter, setFilter] = useState<"all" | ProjectCategory>("all");
  const shown = projects.filter((p) => filter === "all" || p.category === filter);
  return (
    <section id="projects" className="py-28">
      <SectionTitle
        index="03"
        tag="Portfolio"
        title="Selected Work"
        subtitle="Real products, learning platforms and experiments across systems, infrastructure and Web3."
      />
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-wrap gap-2 mb-10" role="tablist" aria-label="Filter projects">
          {projectFilters.map((f) => {
            const count = f.key === "all" ? projects.length : projects.filter((p) => p.category === f.key).length;
            if (count === 0) return null;
            const active = filter === f.key;
            return (
              <button
                key={f.key}
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(f.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  active
                    ? "bg-white text-dark-900 shadow-lg shadow-white/10"
                    : "bg-white/5 text-text-dim border border-white/10 hover:text-white hover:border-white/25"
                }`}
              >
                {f.label}
                <span className={`ml-2 font-mono text-xs ${active ? "text-dark-900/60" : "text-text-dim/60"}`}>{count}</span>
              </button>
            );
          })}
        </div>
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {shown.map((p, i) => (
              <ProjectCard key={p.title} p={p} i={i} large={i === 0} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Archive / Other section */}
      <div className="max-w-6xl mx-auto px-6 mt-20 pt-16 border-t border-white/5">
        <h3 className="font-display text-2xl font-bold text-white mb-8 flex items-center gap-3">
          <span className="text-accent font-mono text-sm">/</span> Other Projects
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {archiveProjects.map((p, i) => (
            <LaserCard key={i} colorType="accent" className="p-5 h-full flex flex-col group">
              <h4 className="font-bold text-white group-hover:text-primary transition-colors text-base">{p.title}</h4>
              <p className="text-text-dim text-sm mt-2 mb-4 leading-relaxed">{p.desc}</p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {p.tech.map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded-full text-[11px] font-mono bg-dark-700 text-text-dim border border-white/10">
                    {t}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-3 mt-auto pt-4 border-t border-white/5">
                {p.live && (
                  <a href={p.live} target="_blank" rel="noopener noreferrer" className="text-accent text-xs font-medium hover:underline">
                    Live ↗
                  </a>
                )}
                {p.github && (
                  <a href={p.github} target="_blank" rel="noopener noreferrer" className="text-text-dim text-xs font-medium hover:text-white hover:underline">
                    Source
                  </a>
                )}
              </div>
            </LaserCard>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── CERTIFICATIONS ───────── */

const certGroups = [
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

function CertGroup({ group, gi }: { group: typeof certGroups[0], gi: number }) {
  const { ref, visible } = useInView();
  const colors: Record<string, { border: string; text: string; bg: string }> = {
    primary: { border: "border-primary/20", text: "text-primary", bg: "bg-primary/5" },
    accent: { border: "border-accent/20", text: "text-accent", bg: "bg-accent/5" },
    purple: { border: "border-purple/20", text: "text-purple", bg: "bg-purple/5" },
  };
  const c = colors[group.color];
  return (
    <div
      ref={ref}
      className={`glass-card p-6 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      style={{ transitionDelay: `${gi * 150}ms` }}
    >
      <h3 className={`font-bold text-lg ${c.text} mb-4 flex items-center gap-2`}>
        <span className={`w-2 h-2 rounded-full ${c.bg} ${c.border} border`} style={{ backgroundColor: group.color === "primary" ? "#00d4ff" : group.color === "accent" ? "#00ff88" : "#7c3aed" }} />
        {group.area}
        <span className="ml-auto text-xs font-mono text-text-dim">{group.certs.length} items</span>
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {group.certs.map((cert, ci) => (
          <div key={ci} className={`px-4 py-3 rounded-xl ${c.bg} border ${c.border} hover:scale-[1.02] transition-transform`}>
            <div className="text-sm font-semibold text-white">{cert.name}</div>
            <div className="text-xs text-text-dim mt-1">{cert.issuer} · {cert.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Education() {
  return (
    <section id="certs" className="py-24 bg-dark-800/30">
      <SectionTitle
        index="04"
        tag="Lifelong Learning"
        title="Courses & Ongoing Training"
        subtitle="From intensive bootcamps to specialized technical modules. Currently preparing for professional Linux certifications."
      />

      <div className="max-w-6xl mx-auto px-6 mb-12">
        <div className="glass-card p-8 border-accent/20 bg-accent/5">
          <h3 className="text-xl font-bold text-accent mb-4 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-accent animate-ping" />
            Certifications In Progress
          </h3>
          <div className="flex flex-wrap gap-4">
            {["LPI Linux Essentials", "LPIC-1 (101 & 102)"].map((cert) => (
              <span key={cert} className="px-4 py-2 rounded-lg bg-dark-700 border border-accent/30 text-white font-mono text-sm">
                &gt; {cert}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 space-y-8">
        {certGroups.map((group, gi) => (
          <CertGroup key={gi} group={group} gi={gi} />
        ))}
      </div>
    </section>
  );
}

/* ───────── CONTACT CTA ───────── */

function Contact() {
  const { ref, visible } = useInView();
  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px]" />
      </div>

      <div
        ref={ref}
        className={`relative z-10 max-w-4xl mx-auto px-6 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      >
        <div className="rounded-[2rem] p-px bg-gradient-to-br from-primary/50 via-purple/30 to-accent/50 shadow-2xl shadow-primary/10">
        <div className="rounded-[calc(2rem-1px)] bg-dark-800/90 backdrop-blur-xl px-6 py-16 md:px-16 text-center">
        <span className="font-mono text-accent text-sm tracking-widest uppercase">
          // Let's Connect
        </span>
        <h2 className="font-display text-4xl md:text-6xl font-bold mt-4 tracking-tight bg-gradient-to-r from-primary via-white to-accent bg-clip-text text-transparent">
          Let's Work Together
        </h2>
        <p className="text-text-dim mt-6 text-lg">
          Looking for a curious, proactive engineer who brings both technical
          depth and strategic problem-solving to the table? Let's talk.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="https://www.linkedin.com/in/claudio-dall-ara-730aa0302/"
            target="_blank"
            rel="noopener noreferrer"
            className="group px-8 py-3.5 bg-gradient-to-r from-primary to-accent rounded-full text-dark-900 font-bold text-sm tracking-wide hover:shadow-lg hover:shadow-primary/25 transition-all hover:scale-105 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            Connect on LinkedIn
          </a>
          <a
            href="https://github.com/boobaGreen"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3.5 border border-white/10 rounded-full text-text font-medium text-sm hover:border-primary/40 hover:text-primary transition-all flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
            View GitHub
          </a>
        </div>
        </div>
        </div>
      </div>
    </section>
  );
}

/* ───────── FOOTER ───────── */

function Footer() {
  return (
    <footer className="py-8 border-t border-white/5 text-center">
      <div className="max-w-6xl mx-auto px-6">
        <p className="font-mono text-text-dim text-xs">
          <span className="text-accent">$</span> designed & built by{" "}
          <span className="text-primary">Claudio Dall'Ara</span> · 2026
        </p>
        <p className="text-text-dim/50 text-[10px] mt-2 font-mono">
          React + TypeScript + Tailwind v4 · Deployed on Vercel
        </p>
      </div>
    </footer>
  );
}

/* ───────── APP ───────── */

function App() {
  return (
    <div className="min-h-screen relative">
      <Background3D />
      <div className="relative z-10 w-full h-full pointer-events-none">
         <div className="pointer-events-auto">
          <Navbar />
          <Hero />
          <Metrics />
          <Journey />
          <Skills />
          <Projects />
          <Education />
          <Contact />
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default App;
