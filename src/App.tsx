import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  motion,
  AnimatePresence,
  animate,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  archiveProjects,
  certGroups,
  journeySteps,
  projects,
  site,
  skillCategories,
} from "./data";
import type { Project } from "./data";
import "./App.css";

/* ───────── DESIGN TOKENS ───────── */

const tone = { primary: "#67e8f9", accent: "#c8ff4d", purple: "#a78bfa" } as const;
type Tone = keyof typeof tone;
const introColor = { cyan: "text-cyan", lime: "text-lime", violet: "text-violet" } as const;
const ease = [0.22, 1, 0.36, 1] as const;
const pad = (n: number) => String(n).padStart(2, "0");
const catLabel: Record<string, string> = { product: "Product", devops: "DevOps", web3: "Web3", education: "Learning" };

/* ───────── HOOKS & PRIMITIVES ───────── */

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => typeof window !== "undefined" && window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);
  return matches;
}

function Reveal({ children, delay = 0, y = 40, className = "" }: { children: ReactNode; delay?: number; y?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

/** Letters slide up one by one (hero). */
function SplitLetters({ text, delay = 0, className = "" }: { text: string; delay?: number; className?: string }) {
  return (
    <span className={`inline-flex overflow-hidden pb-[0.06em] pr-[0.1em] ${className}`} aria-label={text}>
      {[...text].map((ch, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="inline-block"
          initial={{ y: "110%", rotate: 8 }}
          animate={{ y: "0%", rotate: 0 }}
          transition={{ delay: delay + i * 0.045, duration: 0.9, ease }}
        >
          {ch === " " ? " " : ch}
        </motion.span>
      ))}
    </span>
  );
}

/**
 * Words slide up when the heading enters the viewport.
 * The in-view trigger sits on the outer span: the hidden words are clipped by
 * their wrappers, so they would never count as "in view" themselves.
 */
const wordVariants = {
  hidden: { y: "110%" },
  show: (i: number) => ({ y: "0%", transition: { duration: 0.8, delay: i * 0.07, ease } }),
};

function SplitWords({ text }: { text: string }) {
  return (
    <motion.span aria-label={text} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }}>
      {text.split(" ").map((w, i) => (
        <span key={i} aria-hidden className="inline-flex overflow-hidden mr-[0.25em] pb-[0.08em]">
          <motion.span className="inline-block" variants={wordVariants} custom={i}>
            {w}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

function Magnetic({ children, strength = 0.3 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15 });
  const sy = useSpring(y, { stiffness: 200, damping: 15 });
  return (
    <motion.div
      ref={ref}
      className="inline-block"
      style={{ x: sx, y: sy }}
      onPointerMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

function Tilt({ children }: { children: ReactNode }) {
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 150, damping: 15 });
  const sry = useSpring(ry, { stiffness: 150, damping: 15 });
  return (
    <motion.div
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 1200 }}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        ry.set(((e.clientX - r.left) / r.width - 0.5) * 10);
        rx.set(-((e.clientY - r.top) / r.height - 0.5) * 10);
      }}
      onPointerLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

function Marquee<T>({
  items,
  render,
  reverse = false,
  duration = 40,
  className = "",
}: {
  items: T[];
  render: (item: T, i: number) => ReactNode;
  reverse?: boolean;
  duration?: number;
  className?: string;
}) {
  const doubled = [...items, ...items];
  return (
    <div
      className={`marquee relative overflow-hidden ${className}`}
      style={{ maskImage: "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)" }}
    >
      <div
        className={`marquee-track flex w-max ${reverse ? "marquee-reverse" : ""}`}
        style={{ "--marquee-duration": `${duration}s` } as CSSProperties}
      >
        {doubled.map((it, i) => render(it, i))}
      </div>
    </div>
  );
}

function Counter({ target, suffix }: { target: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, target, { duration: 1.6, ease, onUpdate: (v) => setValue(Math.round(v)) });
    return () => controls.stop();
  }, [inView, target]);
  return (
    <span ref={ref}>
      {value}
      {suffix}
    </span>
  );
}

function LinkedInIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

/* ───────── AMBIENT LAYER ───────── */

function Aurora() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const px = useSpring(mx, { stiffness: 40, damping: 20 });
  const py = useSpring(my, { stiffness: 40, damping: 20 });
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mx.set((e.clientX / window.innerWidth - 0.5) * 80);
      my.set((e.clientY / window.innerHeight - 0.5) * 80);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [mx, my]);
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden bg-ink">
      <motion.div style={{ x: px, y: py }} className="absolute inset-0">
        <div className="aurora-a absolute -top-1/4 -left-1/4 w-[70vw] h-[70vw] rounded-full bg-violet/25 blur-[140px]" />
        <div className="aurora-b absolute top-1/3 -right-1/4 w-[60vw] h-[60vw] rounded-full bg-cyan/15 blur-[140px]" />
        <div className="aurora-a absolute -bottom-1/3 left-1/4 w-[50vw] h-[50vw] rounded-full bg-lime/10 blur-[160px]" />
      </motion.div>
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(237,237,242,.25) 1px, transparent 1px), linear-gradient(90deg, rgba(237,237,242,.25) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          maskImage: "radial-gradient(ellipse at center, black 25%, transparent 75%)",
        }}
      />
    </div>
  );
}

function Cursor() {
  const fine = useMediaQuery("(pointer: fine)");
  const reduce = useReducedMotion();
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const dotX = useSpring(x, { stiffness: 700, damping: 40 });
  const dotY = useSpring(y, { stiffness: 700, damping: 40 });
  const ringX = useSpring(x, { stiffness: 160, damping: 20 });
  const ringY = useSpring(y, { stiffness: 160, damping: 20 });
  const [hover, setHover] = useState(false);
  const enabled = fine && !reduce;

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("has-custom-cursor");
    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setHover(!!(e.target as HTMLElement | null)?.closest("a, button"));
    };
    window.addEventListener("pointermove", onMove);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, [enabled, x, y]);

  if (!enabled) return null;
  return (
    <>
      <motion.div
        aria-hidden
        className="fixed z-[100] pointer-events-none w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime"
        style={{ left: dotX, top: dotY }}
      />
      <motion.div
        aria-hidden
        className="fixed z-[100] pointer-events-none -translate-x-1/2 -translate-y-1/2 rounded-full border border-paper/60 mix-blend-difference"
        style={{ left: ringX, top: ringY }}
        animate={{ width: hover ? 64 : 34, height: hover ? 64 : 34, backgroundColor: hover ? "rgba(200,255,77,0.2)" : "rgba(0,0,0,0)" }}
        transition={{ duration: 0.25 }}
      />
    </>
  );
}

function ProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed top-0 inset-x-0 h-[3px] origin-left z-[85] bg-gradient-to-r from-cyan via-lime to-violet"
    />
  );
}

/* ───────── NAVIGATION ───────── */

function Logo() {
  return (
    <a href="#top" className="font-mono text-xs sm:text-sm font-bold whitespace-nowrap">
      <span className="text-lime">{site.logo.prefix}</span> {site.logo.name}
      <span className="opacity-60">{site.logo.suffix}</span>
    </a>
  );
}

function Nav() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-[80]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-4 sm:py-5 flex items-center justify-between gap-3 text-paper">
          <div className="px-4 py-2 rounded-full bg-ink/40 backdrop-blur-md border border-white/10">
            <Logo />
          </div>
          <div className="flex items-center gap-3">
            <a
              href="#contact"
              className="hidden md:inline-flex px-5 py-2.5 rounded-full bg-lime text-ink text-sm font-bold hover:bg-paper transition-colors"
            >
              Let's Talk
            </a>
            <button
              onClick={() => setOpen(true)}
              className="group flex items-center gap-3 px-5 py-2.5 rounded-full bg-ink/40 backdrop-blur-md border border-white/10 font-mono text-xs uppercase tracking-[0.2em]"
              aria-label="Open menu"
            >
              Menu
              <span className="flex flex-col gap-1.5">
                <span className="block w-6 h-px bg-paper transition-all group-hover:w-4" />
                <span className="block w-4 h-px bg-paper transition-all group-hover:w-6" />
              </span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[90] bg-ink/95 backdrop-blur-2xl flex flex-col"
            initial={{ clipPath: "circle(0% at 92% 5%)" }}
            animate={{ clipPath: "circle(150% at 92% 5%)" }}
            exit={{ clipPath: "circle(0% at 92% 5%)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="max-w-7xl w-full mx-auto px-6 md:px-10 py-5 flex items-center justify-between text-paper">
              <div className="px-4 py-2">
                <Logo />
              </div>
              <button
                onClick={() => setOpen(false)}
                className="px-5 py-2.5 rounded-full border border-white/15 font-mono text-xs uppercase tracking-[0.2em] hover:bg-white/10"
                aria-label="Close menu"
              >
                Close ✕
              </button>
            </div>
            <nav className="max-w-7xl w-full mx-auto px-6 md:px-10 mt-6 md:mt-12 flex flex-col">
              {site.nav.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  initial={{ y: 80, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.25 + i * 0.07, duration: 0.6, ease }}
                  className="group flex items-baseline gap-5 py-2 md:py-3 border-b border-white/10"
                >
                  <span className="font-mono text-sm text-mute">{pad(i + 1)}</span>
                  <span className="font-display text-5xl md:text-8xl font-bold text-paper group-hover:text-lime group-hover:translate-x-4 transition-all duration-500">
                    {l.label}
                  </span>
                </motion.a>
              ))}
            </nav>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="max-w-7xl w-full mx-auto px-6 md:px-10 mt-auto pb-10 flex flex-wrap gap-6 font-mono text-sm"
            >
              <a href={site.contact.linkedin} target="_blank" rel="noopener noreferrer" className="text-paper hover:text-lime">
                LinkedIn ↗
              </a>
              <a href={site.contact.github} target="_blank" rel="noopener noreferrer" className="text-paper hover:text-lime">
                GitHub ↗
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ───────── HERO ───────── */

function RoleRotator({ roles }: { roles: string[] }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % roles.length), 2600);
    return () => clearInterval(t);
  }, [roles.length]);
  return (
    <span className="relative inline-flex h-[1.4em] overflow-hidden align-bottom">
      <AnimatePresence mode="wait">
        <motion.span
          key={roles[i]}
          initial={{ y: "100%" }}
          animate={{ y: "0%" }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.5, ease }}
          className="inline-block text-lime"
        >
          {roles[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.88]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const h = site.hero;

  return (
    <section id="top" ref={ref} className="relative min-h-[100svh] flex flex-col justify-end pt-32 pb-14 overflow-hidden">
      <motion.div style={{ y, scale, opacity }} className="max-w-7xl mx-auto w-full px-6 md:px-10 origin-bottom-left">
        <motion.a
          href={h.badge.url}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur font-mono text-xs text-mute mb-8 hover:border-lime/40"
        >
          <span className="w-2 h-2 rounded-full bg-lime animate-pulse" />
          {h.badge.text} <span className="text-paper">{h.badge.company}</span>
        </motion.a>

        <h1 className="font-display font-extrabold leading-[0.86] tracking-[-0.045em] text-[12.5vw] md:text-[13vw] lg:text-[11.5vw]">
          <SplitLetters text={h.firstName} className="text-paper" />
          <br />
          <SplitLetters text={h.lastName} delay={0.3} className="text-outline" />
        </h1>

        <div className="mt-10 grid lg:grid-cols-[1fr_auto] gap-10 items-end">
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="font-mono text-base md:text-lg text-mute"
            >
              &gt; <RoleRotator roles={h.roles} />
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.05, duration: 0.8, ease }}
              className="mt-5 max-w-2xl text-lg md:text-xl text-paper/80 leading-relaxed"
            >
              {h.intro.map((s, i) =>
                "c" in s && s.c ? (
                  <span key={i} className={`${introColor[s.c as keyof typeof introColor]} font-medium`}>
                    {s.t}
                  </span>
                ) : (
                  <span key={i}>{s.t}</span>
                ),
              )}
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8, ease }}
            className="flex flex-wrap gap-3"
          >
            <Magnetic>
              <a href={h.ctaPrimary.href} className="group inline-flex items-center gap-2 px-7 py-4 rounded-full bg-lime text-ink font-bold text-sm hover:bg-paper transition-colors">
                {h.ctaPrimary.label} <span className="transition-transform group-hover:translate-x-1">→</span>
              </a>
            </Magnetic>
            <Magnetic>
              <a href={h.ctaSecondary.href} className="inline-flex px-7 py-4 rounded-full border border-white/20 text-paper text-sm font-semibold hover:bg-white/10 transition-colors">
                {h.ctaSecondary.label}
              </a>
            </Magnetic>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="absolute bottom-6 right-6 md:right-10 hidden md:flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-mute"
      >
        scroll
        <span className="relative block w-px h-12 bg-white/15 overflow-hidden">
          <motion.span
            className="absolute inset-x-0 top-0 h-4 bg-lime"
            animate={{ y: [-16, 48] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.div>
    </section>
  );
}

function RolesStrip() {
  return (
    <div className="relative py-5 bg-lime text-ink -rotate-[1.5deg] scale-[1.03] shadow-2xl shadow-lime/10">
      <Marquee
        items={site.hero.roles}
        duration={30}
        render={(r, i) => (
          <span key={i} className="shrink-0 flex items-center gap-8 pr-8 font-display text-2xl md:text-4xl font-bold uppercase tracking-tight">
            {r} <span aria-hidden>✦</span>
          </span>
        )}
      />
    </div>
  );
}

/* ───────── NOW (latest launch, day job, numbers) ───────── */

function Now() {
  const h = site.hero;
  return (
    <section className="relative py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-10 grid lg:grid-cols-[1.35fr_1fr] gap-6">
        <Reveal>
          <Tilt>
            <a href="#projects" className="group relative block rounded-[2rem] overflow-hidden border border-white/10 bg-ink-2 shadow-2xl shadow-violet/10">
              {/* On phones the text sits under the image; from md up it overlays the image. */}
              <div className="relative md:aspect-[16/10]">
                <div className="relative aspect-[16/10] overflow-hidden md:absolute md:inset-0 md:aspect-auto">
                  <img
                    src={h.showcase.image}
                    alt="Felis: Apex Hunter app screens"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-2 via-transparent to-transparent md:from-ink md:via-ink/30" />
                  <span className="absolute top-4 left-4 md:top-5 md:left-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-ink/70 backdrop-blur border border-lime/30 text-lime font-mono text-[11px] font-bold uppercase tracking-widest">
                    <span className="w-1.5 h-1.5 rounded-full bg-lime animate-pulse" />
                    {h.showcase.label}
                  </span>
                </div>
                <div className="relative px-6 pb-7 pt-2 md:absolute md:bottom-0 md:inset-x-0 md:p-9">
                  <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-lime">{h.showcase.kicker}</div>
                  <div className="font-display text-3xl md:text-5xl font-bold text-paper mt-2 tracking-tight">{h.showcase.title}</div>
                  <p className="text-paper/75 mt-3 max-w-lg">{h.showcase.text}</p>
                </div>
              </div>
            </a>
          </Tilt>
        </Reveal>

        <div className="grid gap-6">
          <Reveal delay={0.1}>
            <div className="h-full rounded-[2rem] border border-white/10 bg-ink-2/80 backdrop-blur p-7">
              <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-mute">
                <span className="w-2 h-2 rounded-full bg-cyan animate-pulse" /> {h.dayJob.label}
              </div>
              <div className="font-display text-2xl md:text-3xl font-bold text-paper mt-3">{h.dayJob.title}</div>
              <div className="flex flex-wrap gap-2 mt-5">
                {h.dayJob.tags.map((t) => (
                  <span key={t} className="px-3 py-1 rounded-full text-xs font-mono bg-cyan/10 text-cyan border border-cyan/20">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="grid grid-cols-2 gap-px rounded-[2rem] overflow-hidden border border-white/10 bg-white/10">
              {site.metrics.map((m) => (
                <div key={m.label} className="bg-ink-2 p-6">
                  <div className="font-display text-4xl md:text-5xl font-bold text-paper">
                    <Counter target={m.target} suffix={m.suffix} />
                  </div>
                  <div className="mt-2 font-mono text-[11px] uppercase tracking-widest text-mute">{m.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ───────── SECTION HEAD ───────── */

function SectionHead({ index, tag, title, subtitle }: { index: string; tag: string; title: string; subtitle?: string }) {
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 mb-16 md:mb-24">
      <Reveal>
        <div className="flex items-center gap-4 font-mono text-xs uppercase tracking-[0.3em] text-mute">
          <span className="text-lime">({index})</span>
          <span className="h-px w-16 bg-white/20" />
          <span>{tag}</span>
        </div>
      </Reveal>
      <h2 className="mt-6 font-display font-bold text-5xl md:text-7xl lg:text-8xl tracking-[-0.035em] leading-[0.95] text-paper">
        <SplitWords text={title} />
      </h2>
      {subtitle && (
        <Reveal delay={0.2}>
          <p className="mt-6 max-w-2xl text-lg text-mute leading-relaxed">{subtitle}</p>
        </Reveal>
      )}
    </div>
  );
}

/* ───────── JOURNEY (stacking cards) ───────── */

function Journey() {
  return (
    <section id="journey" className="py-24 md:py-32">
      <SectionHead {...site.sections.journey} />
      <div className="max-w-5xl mx-auto px-6 md:px-10">
        {journeySteps.map((step, i) => (
          <div key={i} className="sticky" style={{ top: `${96 + i * 26}px` }}>
            <motion.article
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, ease }}
              className={`mb-10 rounded-[2rem] border ${step.highlight ? "border-lime/30" : "border-white/10"} bg-ink-2 p-8 md:p-12 shadow-[0_-24px_60px_-24px_rgba(0,0,0,0.9)] grid md:grid-cols-[170px_1fr] gap-6 md:gap-10 min-h-[240px]`}
            >
              <div>
                <div className="font-mono text-sm text-mute">{pad(i + 1)}</div>
                <div className={`font-display text-3xl md:text-4xl font-bold mt-2 ${step.highlight ? "text-lime" : "text-paper"}`}>{step.year}</div>
                <div className="text-4xl mt-4" aria-hidden>
                  {step.icon}
                </div>
              </div>
              <div>
                <h3 className="font-display text-2xl md:text-4xl font-bold text-paper tracking-tight">{step.title}</h3>
                <p className="mt-4 text-mute text-lg leading-relaxed">{step.desc}</p>
              </div>
            </motion.article>
          </div>
        ))}
        <div className="h-[20vh]" />
      </div>
    </section>
  );
}

/* ───────── SKILLS (marquees + grid) ───────── */

function Skills() {
  const all = skillCategories.flatMap((c) => c.skills.map((s) => ({ s, color: c.color as Tone })));
  const half = Math.ceil(all.length / 2);
  return (
    <section id="skills" className="py-24 md:py-32 overflow-hidden">
      <SectionHead {...site.sections.skills} />
      <div className="space-y-2 mb-20 md:mb-28 -rotate-2 scale-[1.04]">
        <Marquee
          items={all.slice(0, half)}
          duration={55}
          render={(it, i) => (
            <span key={i} className="shrink-0 flex items-center font-display text-4xl md:text-6xl font-bold text-paper/90">
              {it.s}
              <span className="mx-6 md:mx-8 text-2xl md:text-3xl" style={{ color: tone[it.color] }} aria-hidden>
                ✦
              </span>
            </span>
          )}
        />
        <Marquee
          items={all.slice(half)}
          reverse
          duration={55}
          render={(it, i) => (
            <span key={i} className="shrink-0 flex items-center font-display text-4xl md:text-6xl font-bold text-outline">
              {it.s}
              <span className="mx-6 md:mx-8 text-2xl md:text-3xl" style={{ color: tone[it.color] }} aria-hidden>
                ✦
              </span>
            </span>
          )}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10 rounded-[2rem] overflow-hidden border border-white/10">
        {skillCategories.map((c, i) => {
          const color = tone[c.color as Tone];
          return (
            <Reveal key={c.title} delay={i * 0.06} y={20} className="bg-ink-2 h-full">
              <div className="group relative p-8 h-full overflow-hidden">
                <div
                  className="absolute -right-12 -top-12 w-44 h-44 rounded-full blur-3xl opacity-0 group-hover:opacity-40 transition-opacity duration-700"
                  style={{ background: color }}
                />
                <div className="relative flex items-center gap-3">
                  <span className="text-2xl" aria-hidden>
                    {c.icon}
                  </span>
                  <h3 className="font-display text-xl font-bold text-paper">{c.title}</h3>
                  {c.highlight && (
                    <span className="ml-auto font-mono text-[10px] font-bold px-2 py-0.5 rounded-full border" style={{ color, borderColor: `${color}66` }}>
                      FOCUS
                    </span>
                  )}
                </div>
                <div className="relative mt-6 flex flex-wrap gap-2">
                  {c.skills.map((s) => (
                    <span key={s} className="px-3 py-1 rounded-full text-xs border border-white/10 text-paper/80 transition-colors group-hover:border-white/25">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

/* ───────── PROJECTS (horizontal scroll on desktop) ───────── */

function ProjectLinks({ p }: { p: Project }) {
  return (
    <div className="flex flex-wrap gap-3 mt-auto pt-7">
      {p.live && (
        <Magnetic strength={0.2}>
          <a href={p.live} target="_blank" rel="noopener noreferrer" className="inline-flex px-6 py-3 rounded-full bg-lime text-ink text-xs font-bold hover:bg-paper transition-colors">
            {p.category === "product" ? "Visit Website ↗" : "Launch App ↗"}
          </a>
        </Magnetic>
      )}
      {p.store && (
        <a href={p.store} target="_blank" rel="noopener noreferrer" className="inline-flex px-6 py-3 rounded-full border border-lime/40 text-lime text-xs font-bold hover:bg-lime/10 transition-colors">
          Google Play ↗
        </a>
      )}
      {p.github && (
        <a href={p.github} target="_blank" rel="noopener noreferrer" className="inline-flex px-6 py-3 rounded-full border border-white/15 text-paper/80 text-xs font-bold hover:bg-white/10 transition-colors">
          Source
        </a>
      )}
      {p.blog && (
        <a href={p.blog} target="_blank" rel="noopener noreferrer" className="inline-flex px-6 py-3 rounded-full border border-violet/40 text-violet text-xs font-bold hover:bg-violet/10 transition-colors">
          IOTA Blog ↗
        </a>
      )}
    </div>
  );
}

function ProjectPanel({ p, i, horizontal = false }: { p: Project; i: number; horizontal?: boolean }) {
  const href = p.live || p.store || p.github;
  return (
    <article
      className={`group relative rounded-[2rem] overflow-hidden border border-white/10 bg-ink-2 ${
        horizontal ? "grid grid-cols-[1.1fr_1fr] min-h-[68vh]" : "flex flex-col"
      }`}
    >
      <a href={href} target="_blank" rel="noopener noreferrer" className={`relative block overflow-hidden ${horizontal ? "h-full min-h-[340px]" : "aspect-[16/10]"}`}>
        <img
          src={p.image}
          alt={p.title}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-[1200ms] ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-ink/80 via-transparent to-transparent" />
        <span className="absolute top-4 left-6 font-display text-7xl md:text-8xl font-extrabold text-paper/90 mix-blend-overlay select-none" aria-hidden>
          {pad(i + 1)}
        </span>
        {p.status && (
          <span
            className={`absolute bottom-5 left-5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ink/75 backdrop-blur border font-mono text-[10px] font-bold ${
              p.status.type === "live" ? "border-lime/30 text-lime" : "border-amber-400/30 text-amber-300"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${p.status.type === "live" ? "bg-lime" : "bg-amber-300"}`} />
            {p.status.label}
          </span>
        )}
      </a>
      <div className="flex flex-col p-7 md:p-10">
        <div className="flex items-center justify-between gap-3 font-mono text-[11px] uppercase tracking-[0.2em]">
          <span className="text-lime">{p.badge}</span>
          <span className="text-mute">{catLabel[p.category]}</span>
        </div>
        <h3 className="mt-4 font-display text-3xl md:text-5xl font-bold text-paper tracking-tight leading-none">{p.title}</h3>
        <p className="mt-5 text-mute leading-relaxed">{p.desc}</p>
        {p.highlights && (
          <ul className="mt-5 flex flex-wrap gap-2">
            {p.highlights.map((hl) => (
              <li key={hl} className="px-3 py-1 rounded-full bg-lime/10 border border-lime/25 text-lime text-xs font-medium">
                ✓ {hl}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-5 flex flex-wrap gap-1.5">
          {p.tech.map((t) => (
            <span key={t} className="px-2.5 py-0.5 rounded-full text-[10px] font-mono text-paper/70 border border-white/10">
              {t}
            </span>
          ))}
        </div>
        <ProjectLinks p={p} />
      </div>
    </article>
  );
}

function HorizontalProjects() {
  const target = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const measure = () => {
      if (track.current) setDistance(Math.max(0, track.current.scrollWidth - window.innerWidth));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const { scrollYProgress } = useScroll({ target, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  const smoothX = useSpring(x, { stiffness: 140, damping: 30, mass: 0.4 });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActive(Math.min(projects.length - 1, Math.round(v * (projects.length - 1))));
  });

  return (
    <div ref={target} className="relative" style={{ height: `${projects.length * 85}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center">
        <motion.div
          ref={track}
          style={{ x: smoothX }}
          className="flex gap-8 w-max pl-[max(1.5rem,calc((100vw-80rem)/2+2.5rem))] pr-[10vw] pt-16"
        >
          {projects.map((p, i) => (
            <div key={p.title} className="w-[78vw] max-w-[1100px] shrink-0">
              <ProjectPanel p={p} i={i} horizontal />
            </div>
          ))}
        </motion.div>
        <div className="max-w-7xl mx-auto w-full px-10 mt-8 flex items-center gap-6 font-mono text-xs text-mute">
          <span className="text-paper">{pad(active + 1)}</span>
          <div className="relative h-px flex-1 bg-white/15 overflow-hidden">
            <motion.div className="absolute inset-0 bg-lime origin-left" style={{ scaleX: scrollYProgress }} />
          </div>
          <span>{pad(projects.length)}</span>
          <span className="uppercase tracking-[0.3em]">scroll →</span>
        </div>
      </div>
    </div>
  );
}

function Archive() {
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-24 md:py-32">
      <Reveal>
        <h3 className="font-display text-3xl md:text-5xl font-bold text-paper mb-10 tracking-tight">
          {site.sections.projects.other}
          <span className="text-lime">.</span>
        </h3>
      </Reveal>
      <div className="border-t border-white/10">
        {archiveProjects.map((p, i) => (
          <Reveal key={p.title} delay={i * 0.05} y={20}>
            <div className="group grid md:grid-cols-[1fr_1.4fr_auto] gap-3 md:gap-10 items-center py-7 px-2 md:px-4 border-b border-white/10 hover:bg-white/[0.03] transition-colors">
              <div className="flex items-center gap-4">
                <span className="font-mono text-xs text-mute">{pad(i + 1)}</span>
                <h4 className="font-display text-2xl font-bold text-paper group-hover:text-lime group-hover:translate-x-2 transition-all duration-500">{p.title}</h4>
              </div>
              <div>
                <p className="text-mute text-sm leading-relaxed">{p.desc}</p>
                <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[11px] text-paper/50">
                  {p.tech.map((t) => (
                    <span key={t}>#{t}</span>
                  ))}
                </div>
              </div>
              <div className="flex gap-5 font-mono text-xs">
                {p.live && (
                  <a href={p.live} target="_blank" rel="noopener noreferrer" className="text-lime hover:underline">
                    Live ↗
                  </a>
                )}
                {"github" in p && p.github && (
                  <a href={p.github} target="_blank" rel="noopener noreferrer" className="text-paper/70 hover:text-paper hover:underline">
                    Source
                  </a>
                )}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

function Projects() {
  const desktop = useMediaQuery("(min-width: 1024px)");
  const reduce = useReducedMotion();
  return (
    <section id="projects" className="pt-24 md:pt-32">
      <SectionHead {...site.sections.projects} />
      {desktop && !reduce ? (
        <HorizontalProjects />
      ) : (
        <div className="max-w-7xl mx-auto px-6 md:px-10 grid gap-8">
          {projects.map((p, i) => (
            <Reveal key={p.title} y={30}>
              <ProjectPanel p={p} i={i} />
            </Reveal>
          ))}
        </div>
      )}
      <Archive />
    </section>
  );
}

/* ───────── CERTIFICATIONS ───────── */

function Certs() {
  const s = site.sections.certs;
  return (
    <section id="certs" className="py-24 md:py-32">
      <SectionHead {...s} />
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <Reveal>
          <div className="flex flex-wrap items-center gap-4 rounded-[2rem] border border-lime/25 bg-lime/[0.05] p-6 md:p-8 mb-10">
            <span className="flex items-center gap-3 font-display text-xl font-bold text-lime mr-2">
              <span className="relative flex w-3 h-3">
                <span className="absolute inset-0 rounded-full bg-lime animate-ping opacity-60" />
                <span className="relative w-3 h-3 rounded-full bg-lime" />
              </span>
              {s.inProgressTitle}
            </span>
            {s.inProgress.map((c) => (
              <span key={c} className="px-4 py-2 rounded-full bg-ink border border-lime/30 text-paper font-mono text-sm">
                &gt; {c}
              </span>
            ))}
          </div>
        </Reveal>
        <div className="grid lg:grid-cols-3 gap-6">
          {certGroups.map((g, gi) => {
            const color = tone[g.color as Tone];
            return (
              <Reveal key={g.area} delay={gi * 0.1} className="h-full">
                <div className="rounded-[2rem] border border-white/10 bg-ink-2/80 backdrop-blur p-7 h-full">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-display text-2xl font-bold" style={{ color }}>
                      {g.area}
                    </h3>
                    <span className="font-mono text-xs text-mute">{g.certs.length} items</span>
                  </div>
                  <ul className="mt-6 divide-y divide-white/5">
                    {g.certs.map((c, ci) => (
                      <li key={ci} className="group py-3.5 flex items-start gap-3">
                        <span className="mt-2 w-1.5 h-1.5 rounded-full shrink-0 transition-transform group-hover:scale-150" style={{ background: color }} />
                        <div>
                          <div className="text-paper text-sm font-medium">{c.name}</div>
                          <div className="text-mute text-xs mt-0.5">
                            {c.issuer} · {c.date}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ───────── CONTACT & FOOTER ───────── */

function Contact() {
  const c = site.contact;
  const f = site.footer;
  return (
    <section id="contact" className="relative pt-24 md:pt-40 pb-12 overflow-hidden">
      <h2 className="sr-only">{c.title}</h2>
      <Marquee
        items={[c.title, c.title]}
        duration={28}
        render={(t, i) => (
          <span
            key={i}
            aria-hidden
            className={`shrink-0 flex items-center gap-8 pr-8 font-display font-extrabold text-[17vw] md:text-[11vw] leading-none tracking-[-0.045em] ${i % 2 ? "text-outline" : "text-paper"}`}
          >
            {t} <span className="text-lime text-[0.5em]">✦</span>
          </span>
        )}
      />
      <div className="max-w-7xl mx-auto px-6 md:px-10 mt-16 grid lg:grid-cols-[1.3fr_1fr] gap-10 items-end">
        <Reveal>
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-lime">// {c.tag}</div>
          <p className="mt-5 text-2xl md:text-3xl text-paper leading-snug font-light">{c.text}</p>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <Magnetic>
              <a href={c.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-lime text-ink font-bold text-sm hover:bg-paper transition-colors">
                <LinkedInIcon /> Connect on LinkedIn
              </a>
            </Magnetic>
            <Magnetic>
              <a href={c.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-7 py-4 rounded-full border border-white/20 text-paper font-semibold text-sm hover:bg-white/10 transition-colors">
                <GitHubIcon /> View GitHub
              </a>
            </Magnetic>
          </div>
        </Reveal>
      </div>
      <footer className="max-w-7xl mx-auto px-6 md:px-10 mt-24 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between gap-3 font-mono text-xs text-mute">
        <p>
          <span className="text-lime">$</span> {f.line1} <span className="text-paper">{f.name}</span> · {f.year}
        </p>
        <p>{f.line2}</p>
      </footer>
    </section>
  );
}

/* ───────── APP ───────── */

function App() {
  return (
    <div className="grain relative min-h-screen text-paper font-sans selection:bg-lime selection:text-ink">
      <Aurora />
      <Cursor />
      <ProgressBar />
      <Nav />
      <main className="overflow-x-clip">
        <Hero />
        <RolesStrip />
        <Now />
        <Journey />
        <Skills />
        <Projects />
        <Certs />
        <Contact />
      </main>
    </div>
  );
}

export default App;
