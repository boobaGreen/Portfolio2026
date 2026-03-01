import { useEffect, useState, useRef } from 'react'
import './App.css'

/* ───────── HOOKS ───────── */

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold })
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, visible }
}

/* ───────── NAVBAR ───────── */

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])

  const links = [
    { label: '📖 Story', href: '#story' },
    { label: '💥 Powers', href: '#powers' },
    { label: '🎯 Missions', href: '#missions' },
    { label: '📜 Training', href: '#training' },
    { label: '✉️ Contact', href: '#contact' },
  ]

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-paper/95 backdrop-blur-md border-b-3 border-ink shadow-lg' : ''}`}>
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        <a href="#" className="impact-text text-accent-red text-xl">CD</a>
        <div className="hidden md:flex items-center gap-5">
          {links.map(l => (
            <a key={l.href} href={l.href} className="font-bold text-text-mid hover:text-accent-red transition-colors text-sm">
              {l.label}
            </a>
          ))}
        </div>
        <a href="#contact" className="px-5 py-2 bg-accent-red text-white font-bold text-sm rounded-sm border-2 border-ink hover:bg-ink transition-all shadow-[3px_3px_0px_var(--color-ink)]">
          HIRE ME!
        </a>
      </div>
    </nav>
  )
}

/* ───────── HERO ───────── */

function Hero() {
  const roles = ['DevOps & Observability', 'Full Stack Developer', 'Web3 Builder', 'Eternal Learner']
  const [idx, setIdx] = useState(0)
  const [show, setShow] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setShow(false)
      setTimeout(() => { setIdx(i => (i + 1) % roles.length); setShow(true) }, 300)
    }, 2500)
    return () => clearInterval(interval)
  }, [roles.length])

  return (
    <section className="min-h-screen flex items-center justify-center speed-lines halftone relative">
      {/* SFX decorations */}
      <span className="sfx text-8xl top-20 left-8 text-accent-red">WHOOSH!</span>
      <span className="sfx text-6xl bottom-32 right-12 rotate-12 text-accent-blue">POW!</span>
      <span className="sfx text-7xl top-1/3 right-8 text-accent-yellow">BOOM!</span>

      <div className="relative z-10 text-center px-6 max-w-4xl">
        <div className="speech-bubble inline-block mb-8">
          <span className="font-mono text-xs text-accent-red font-bold">📖 CHAPTER 1 — THE ORIGIN</span>
        </div>

        <h1 className="impact-text text-6xl md:text-9xl leading-none text-ink">
          CLAUDIO<br/>DALL'ARA
        </h1>

        <div className="mt-8 h-10">
          <p className={`impact-text text-2xl text-accent-blue transition-all duration-300 ${show ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
            ★ {roles[idx]} ★
          </p>
        </div>

        <div className="thought-bubble inline-block mt-8 max-w-xl">
          <p className="text-text-mid text-lg leading-relaxed">
            After <strong className="text-accent-red">22 years</strong> in retail, I made the leap to tech.
            Now I build <strong className="text-accent-blue">cloud-native systems</strong> by day
            and <strong className="text-accent-purple">decentralized apps</strong> by night.
          </p>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="#story" className="px-8 py-3 bg-accent-red text-white font-bold text-sm border-2 border-ink shadow-[4px_4px_0px_var(--color-ink)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_var(--color-ink)] transition-all">
            READ MY STORY →
          </a>
          <a href="#missions" className="px-8 py-3 bg-speech border-2 border-ink text-ink font-bold text-sm shadow-[4px_4px_0px_var(--color-ink)] hover:bg-accent-yellow/20 transition-all">
            VIEW MISSIONS
          </a>
        </div>

        <div className="mt-16 animate-bounce text-text-light text-sm font-bold">
          ↓ SCROLL ↓
        </div>
      </div>
    </section>
  )
}

/* ───────── METRICS ───────── */

function MetricPanel({ value, label, color }: { value: string; label: string; color: string }) {
  const { ref, visible } = useInView()
  return (
    <div ref={ref} className={`manga-panel p-5 text-center transition-all duration-500 ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
      <div className={`impact-text text-4xl ${color}`}>{value}</div>
      <div className="text-text-mid text-xs font-bold mt-2 uppercase tracking-wider">{label}</div>
    </div>
  )
}

function Metrics() {
  return (
    <section className="py-12 bg-paper-alt halftone">
      <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricPanel value="20+" label="Certifications" color="text-accent-yellow" />
        <MetricPanel value="3" label="Blockchain Ecosystems" color="text-accent-purple" />
        <MetricPanel value="13+" label="Projects" color="text-accent-blue" />
        <MetricPanel value="22" label="Years Leadership" color="text-accent-green" />
      </div>
    </section>
  )
}

/* ───────── STORY (journey) ───────── */

const chapters = [
  { year: '1996', title: 'THE FIRST PAGE', desc: 'IT Technical Diploma at ITIS Blaise Pascal. Turbo Pascal, Assembly, Prolog.', color: 'accent-blue', icon: '📘' },
  { year: '1999–2021', title: '22 YEAR ARC', desc: 'Retail Store Manager. A long saga of leadership, resilience, and growth.', color: 'accent-green', icon: '🏪' },
  { year: '2021', title: '★ THE PLOT TWIST ★', desc: 'Left 22 years of retail to become a developer. The biggest cliffhanger of all.', color: 'accent-red', icon: '💥', highlight: true },
  { year: '2022–2024', title: 'TRAINING ARC', desc: 'Full Stack Master at Start2Impact. React, TypeScript, Node.js, MongoDB.', color: 'accent-blue', icon: '📚' },
  { year: '2024', title: 'HIDDEN CHAPTER', desc: 'Solana Bootcamp, ICP Protocol, EPICODE-Binance Scholarship. Web3 world discovered.', color: 'accent-purple', icon: '🔮' },
  { year: '2025', title: '★ POWER UP ★', desc: 'Docker, Kubernetes, OpenShift, Prometheus, OpenTelemetry, Grafana.', color: 'accent-red', icon: '⚡', highlight: true },
  { year: 'NOW', title: '★ CURRENT ARC ★', desc: 'Junior Application Maintenance @ Agile Lab. Kafka, monitoring, cloud-native.', color: 'accent-red', icon: '🚀', highlight: true },
  { year: '2026', title: 'BOSS BATTLE', desc: 'IOTA Hackathon — GiftBlitz. 63 European teams. Featured on IOTA Foundation blog.', color: 'accent-yellow', icon: '🏆' },
]

function ChapterCard({ chapter, index }: { chapter: typeof chapters[0]; index: number }) {
  const { ref, visible } = useInView(0.2)
  return (
    <div ref={ref}
      className={`flex items-start gap-4 mb-6 transition-all duration-500 ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-6'}`}
      style={{ transitionDelay: `${index * 80}ms` }}>
      <div className="shrink-0 text-2xl mt-1">{chapter.icon}</div>
      <div className={`manga-panel p-4 flex-1 ${chapter.highlight ? `border-${chapter.color}` : ''}`}>
        <div className="flex items-center gap-3 mb-1">
          <span className="font-mono text-xs px-2 py-0.5 bg-paper-alt text-text-light border border-ink/20">{chapter.year}</span>
          {chapter.highlight && <span className="text-accent-red text-xs font-bold animate-pulse">★ KEY ARC</span>}
        </div>
        <h3 className={`impact-text text-base text-${chapter.color}`}>{chapter.title}</h3>
        <p className="text-text-mid mt-1 text-sm">{chapter.desc}</p>
      </div>
    </div>
  )
}

function Story() {
  const { ref, visible } = useInView()
  return (
    <section id="story" className="py-20">
      <div className="max-w-3xl mx-auto px-6">
        <div ref={ref} className={`text-center mb-14 transition-all duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}>
          <span className="font-mono text-xs bg-accent-blue/10 text-accent-blue px-3 py-1 border border-accent-blue/30">📖 STORYLINE</span>
          <h2 className="impact-text text-4xl md:text-6xl text-ink mt-6">
            THE JOURNEY<br/>SO FAR
          </h2>
        </div>
        {chapters.map((c, i) => <ChapterCard key={i} chapter={c} index={i} />)}
      </div>
    </section>
  )
}

/* ───────── POWERS (skills) ───────── */

const powerGroups = [
  { name: 'DevOps & Cloud', level: 'MAIN POWER', color: 'accent-red', power: 85, skills: ['Docker', 'Kubernetes', 'OpenShift', 'Jenkins', 'CI/CD', 'Linux', 'GCP', 'AWS', 'Azure'], highlight: true },
  { name: 'Observability', level: 'SPECIAL', color: 'accent-yellow', power: 80, skills: ['Prometheus', 'Grafana', 'OpenTelemetry', 'Jaeger', 'Kafka'], highlight: true },
  { name: 'Web3 / Blockchain', level: 'HIDDEN', color: 'accent-purple', power: 75, skills: ['Solidity', 'Hardhat', 'Foundry', 'Ethers.js', 'IOTA', 'Solana', 'ICP', 'OpenZeppelin'] },
  { name: 'Frontend', level: 'CORE', color: 'accent-blue', power: 90, skills: ['React', 'TypeScript', 'Next.js', 'TailwindCSS', 'HTML5', 'CSS3'] },
  { name: 'Backend', level: 'CORE', color: 'accent-green', power: 85, skills: ['Node.js', 'Express', 'PHP', 'Laravel', 'MongoDB', 'PostgreSQL', 'SQL', 'Prisma', 'Postman'] },
  { name: 'AI & Data', level: 'EMERGING', color: 'accent-blue', power: 50, skills: ['Python', 'AI Avanzata', 'Data Analysis'] },
]

function PowerCard({ pg, index }: { pg: typeof powerGroups[0]; index: number }) {
  const { ref, visible } = useInView()
  return (
    <div ref={ref} className={`manga-panel p-4 transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
      style={{ transitionDelay: `${index * 100}ms` }}>
      <div className="flex items-center justify-between mb-2">
        <div>
          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 bg-${pg.color}/10 text-${pg.color} border border-${pg.color}/30`}>{pg.level}</span>
          <h3 className={`impact-text text-sm text-${pg.color} mt-1`}>{pg.name}</h3>
        </div>
        <span className={`impact-text text-xl text-${pg.color}`}>{pg.power}%</span>
      </div>
      <div className="h-2 bg-paper-alt border border-ink/20 rounded-full mb-3">
        <div className={`h-full bg-${pg.color} rounded-full transition-all duration-1000`} style={{ width: visible ? `${pg.power}%` : '0%' }} />
      </div>
      <div className="flex flex-wrap gap-1">
        {pg.skills.map(s => <span key={s} className="px-2 py-0.5 text-[11px] font-bold bg-paper-alt text-text-mid border border-ink/10 hover:border-accent-red/40 hover:text-accent-red transition-colors cursor-default">{s}</span>)}
      </div>
    </div>
  )
}

function Powers() {
  const { ref, visible } = useInView()
  return (
    <section id="powers" className="py-20 bg-paper-alt halftone">
      <div className="max-w-6xl mx-auto px-6">
        <div ref={ref} className={`text-center mb-14 transition-all duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}>
          <span className="font-mono text-xs bg-accent-red/10 text-accent-red px-3 py-1 border border-accent-red/30">💥 ABILITIES</span>
          <h2 className="impact-text text-4xl md:text-6xl text-ink mt-6">POWER<br/>STATS</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {powerGroups.map((pg, i) => <PowerCard key={i} pg={pg} index={i} />)}
        </div>
      </div>
    </section>
  )
}

/* ───────── MISSIONS (projects) ───────── */

const missions = [
  { title: 'GIFTBLITZ', codename: 'IOTA HACKATHON 2026', status: '🔴 ACTIVE', desc: 'Decentralized gift card marketplace on IOTA. 63 teams. IOTA Foundation blog.', tech: ['IOTA', 'Smart Contracts', 'Web3', 'Digital Identity'], live: 'https://gift-blitz-full.vercel.app/', blog: 'https://blog.iota.org/build-now-masterz-hackathon/', featured: true, color: 'accent-red' },
  { title: 'LINKEDSHIELD', codename: 'PROTECT OP', status: '🟢 DONE', desc: 'Anti-scam app protecting LinkedIn users. OAuth2, real-time detection.', tech: ['Node.js', 'TypeScript', 'MongoDB', 'Tailwind v4'], live: 'https://www.linkedshield.eu/', github: 'https://github.com/boobaGreen/linkedinScammers', featured: true, color: 'accent-blue' },
  { title: 'SMART 360', codename: 'CLIENT SITE', status: '🟢 DONE', desc: 'Full website for a moving company.', tech: ['React', 'Full Stack', 'SEO'], live: 'https://www.grouptraslochismart360.it/', github: 'https://github.com/boobaGreen/smart360', color: 'accent-green' },
  { title: 'STUDYBUDDYHUB', codename: 'FINAL EXAM', status: '🟢 DONE', desc: 'Full SPA with RESTful APIs and auth system.', tech: ['MongoDB', 'Express', 'React', 'Node.js'], live: 'https://studybuddyhub.netlify.app/cover', github: 'https://github.com/boobaGreen/S2I-STUDY_BUDDY_HUB_4COACH', color: 'accent-yellow' },
  { title: 'RANDOMIZER', codename: 'ICP DEPLOY', status: '🟢 DONE', desc: 'Deployed on ICP blockchain using Azle.', tech: ['ICP', 'Azle', 'TypeScript', 'Blockchain'], live: 'https://kwjpy-liaaa-aaaap-ahaea-cai.raw.icp0.io/', github: 'https://github.com/boobaGreen/randomizer', color: 'accent-purple' },
]

function MissionCard({ mission, index }: { mission: typeof missions[0]; index: number }) {
  const { ref, visible } = useInView()
  return (
    <div ref={ref} className={`manga-panel p-5 transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'} ${mission.featured ? 'md:col-span-2 border-accent-red' : ''}`}
      style={{ transitionDelay: `${index * 100}ms` }}>
      <div className="flex items-center gap-3 mb-2">
        <span className="font-mono text-[10px] bg-paper-alt px-2 py-0.5 text-text-light border border-ink/20">{mission.codename}</span>
        <span className="text-xs font-bold">{mission.status}</span>
        {mission.featured && <span className="text-accent-red text-xs font-bold">⭐ FEATURED</span>}
      </div>
      <h3 className={`impact-text text-lg text-${mission.color}`}>{mission.title}</h3>
      <p className="text-text-mid mt-1 text-sm">{mission.desc}</p>
      <div className="flex flex-wrap gap-1 mt-3">
        {mission.tech.map(t => <span key={t} className="px-2 py-0.5 text-[11px] font-bold bg-paper-alt text-text-mid border border-ink/10">{t}</span>)}
      </div>
      <div className="flex gap-3 mt-4">
        {mission.live && <a href={mission.live} target="_blank" rel="noopener noreferrer" className="px-4 py-1.5 bg-accent-red text-white font-bold text-xs border-2 border-ink shadow-[3px_3px_0px_var(--color-ink)] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all">LIVE ↗</a>}
        {mission.github && <a href={mission.github} target="_blank" rel="noopener noreferrer" className="px-4 py-1.5 border-2 border-ink text-text-mid font-bold text-xs shadow-[3px_3px_0px_var(--color-ink)] hover:bg-accent-yellow/20 transition-all">GITHUB ↗</a>}
        {mission.blog && <a href={mission.blog} target="_blank" rel="noopener noreferrer" className="px-4 py-1.5 border-2 border-accent-yellow text-accent-yellow font-bold text-xs hover:bg-accent-yellow/10 transition-all">IOTA BLOG ↗</a>}
      </div>
    </div>
  )
}

function Missions() {
  const { ref, visible } = useInView()
  return (
    <section id="missions" className="py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div ref={ref} className={`text-center mb-14 transition-all duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}>
          <span className="font-mono text-xs bg-accent-blue/10 text-accent-blue px-3 py-1 border border-accent-blue/30">🎯 MISSIONS</span>
          <h2 className="impact-text text-4xl md:text-6xl text-ink mt-6">COMPLETED<br/>MISSIONS</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {missions.map((m, i) => <MissionCard key={i} mission={m} index={i} />)}
        </div>
      </div>
    </section>
  )
}

/* ───────── TRAINING (certs) ───────── */

const trainingArcs = [
  { area: 'DevOps & Cloud', icon: '⚙️', color: 'accent-red', certs: [
    { name: 'Docker Per Comuni Mortali', from: 'Udemy', date: 'Jan 2026' },
    { name: 'OpenShift for Beginners', from: 'Udemy', date: 'Dec 2025' },
    { name: 'Prometheus Monitoring', from: 'Udemy', date: 'Sep 2025' },
    { name: 'OpenTelemetry Foundations', from: 'Udemy', date: 'Sep 2025' },
    { name: 'Linux LPI Essentials', from: 'Udemy', date: 'Apr 2025' },
    { name: 'Google Cloud Fundamentals', from: 'Coursera', date: 'Jan 2025' },
  ]},
  { area: 'Web3 / Blockchain', icon: '⛓️', color: 'accent-purple', certs: [
    { name: 'IOTA Hackathon', from: 'MasterZ / IOTA', date: '2026' },
    { name: 'Binance Scholarship', from: 'EPICODE', date: 'Mar 2025' },
    { name: 'Solana Bootcamp', from: 'MasterZ', date: '2024' },
    { name: 'ICP — Azle', from: 'ICP Hub', date: 'Mar 2024' },
    { name: 'Blockchain Dev', from: 'Start2Impact', date: '2024+' },
  ]},
  { area: 'Full Stack & AI', icon: '🤖', color: 'accent-blue', certs: [
    { name: 'AI Avanzata', from: 'Profession AI', date: 'Sep 2025' },
    { name: 'Python Programming', from: 'Profession AI', date: 'Sep 2025' },
    { name: 'Full Stack Dev Master', from: 'Start2Impact', date: '2022-2024' },
  ]},
]

function TrainingBlock({ arc, index }: { arc: typeof trainingArcs[0]; index: number }) {
  const { ref, visible } = useInView()
  return (
    <div ref={ref} className={`manga-panel p-5 transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
      style={{ transitionDelay: `${index * 150}ms` }}>
      <div className="flex items-center gap-3 mb-4">
        <span className="text-xl">{arc.icon}</span>
        <h3 className={`impact-text text-sm text-${arc.color}`}>{arc.area}</h3>
        <span className="ml-auto font-mono text-xs text-text-light">{arc.certs.length} COMPLETED</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {arc.certs.map((c, i) => (
          <div key={i} className="px-3 py-2 bg-paper-alt border border-ink/10 hover:border-accent-red/30 transition-colors">
            <div className="text-sm font-bold text-text-dark">{c.name}</div>
            <div className="text-xs text-text-light">{c.from} · {c.date}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Training() {
  const { ref, visible } = useInView()
  return (
    <section id="training" className="py-20 bg-paper-alt halftone">
      <div className="max-w-6xl mx-auto px-6">
        <div ref={ref} className={`text-center mb-14 transition-all duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}>
          <span className="font-mono text-xs bg-accent-green/10 text-accent-green px-3 py-1 border border-accent-green/30">📜 TRAINING</span>
          <h2 className="impact-text text-4xl md:text-6xl text-ink mt-6">20+ ARCS<br/>COMPLETED</h2>
        </div>
        <div className="space-y-5">
          {trainingArcs.map((arc, i) => <TrainingBlock key={i} arc={arc} index={i} />)}
        </div>
      </div>
    </section>
  )
}

/* ───────── CONTACT ───────── */

function Contact() {
  const { ref, visible } = useInView()
  return (
    <section id="contact" className="py-20 speed-lines">
      <div ref={ref} className={`max-w-3xl mx-auto px-6 text-center transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <div className="manga-panel p-8 md:p-12 relative">
          <span className="sfx text-6xl top-4 right-4 text-accent-yellow">ZAP!</span>
          <span className="font-mono text-xs bg-accent-red/10 text-accent-red px-3 py-1 border border-accent-red/30 mb-4 inline-block">✉️ CONTACT</span>
          <h2 className="impact-text text-4xl md:text-5xl text-ink">LET'S TEAM UP!</h2>
          <div className="speech-bubble inline-block mt-6 max-w-lg">
            <p className="text-text-mid text-lg">
              Looking for a developer with <strong className="text-accent-red">determination</strong>,
              <strong className="text-accent-yellow"> 22 years of XP</strong>, and
              <strong className="text-accent-blue"> multi-stack powers</strong>? Let's talk!
            </p>
          </div>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="https://www.linkedin.com/in/claudio-dall-ara-730aa0302/" target="_blank" rel="noopener noreferrer"
              className="px-8 py-3 bg-accent-blue text-white font-bold text-sm border-2 border-ink shadow-[4px_4px_0px_var(--color-ink)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              LINKEDIN
            </a>
            <a href="https://github.com/boobaGreen" target="_blank" rel="noopener noreferrer"
              className="px-8 py-3 bg-speech border-2 border-ink text-ink font-bold text-sm shadow-[4px_4px_0px_var(--color-ink)] hover:bg-paper-alt transition-all flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
              GITHUB
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ───────── FOOTER ───────── */

function Footer() {
  return (
    <footer className="py-4 border-t-3 border-ink text-center bg-paper-alt">
      <p className="impact-text text-sm text-text-light">DESIGNED & BUILT BY CLAUDIO DALL'ARA · 2026</p>
      <p className="font-mono text-[10px] text-text-light/40 mt-1">React + TypeScript + Tailwind v4 · Manga Comic Edition</p>
    </footer>
  )
}

/* ───────── APP ───────── */

function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Metrics />
      <Story />
      <Powers />
      <Missions />
      <Training />
      <Contact />
      <Footer />
    </div>
  )
}

export default App
