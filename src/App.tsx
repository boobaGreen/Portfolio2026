import { useEffect, useState, useRef } from 'react'
import './App.css'

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

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])
  const links = [
    { label: '⚡ Origin', href: '#origin' },
    { label: '💪 Powers', href: '#powers' },
    { label: '🎯 Missions', href: '#missions' },
    { label: '🏅 Training', href: '#training' },
    { label: '📡 Signal', href: '#signal' },
  ]
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-bg-dark/95 backdrop-blur-lg border-b-2 border-hero-yellow/30' : ''}`}>
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#" className="action-text text-hero-yellow text-xl" style={{ animation: 'hero-glow 3s ease-in-out infinite' }}>CD</a>
        <div className="hidden md:flex items-center gap-6">
          {links.map(l => <a key={l.href} href={l.href} className="text-text-sub hover:text-hero-yellow transition-colors text-sm font-bold tracking-wide">{l.label}</a>)}
        </div>
        <a href="#signal" className="px-5 py-2 bg-hero-red text-white font-bold text-sm rounded-sm border-2 border-hero-yellow hover:bg-hero-yellow hover:text-bg-dark transition-all">⚡ RECRUIT ME</a>
      </div>
    </nav>
  )
}

function Hero() {
  const subtitles = ['DevOps & Observability', 'Full Stack Developer', 'Web3 Builder', 'Eternal Learner']
  const [idx, setIdx] = useState(0)
  const [show, setShow] = useState(true)
  useEffect(() => {
    const interval = setInterval(() => {
      setShow(false)
      setTimeout(() => { setIdx(i => (i + 1) % subtitles.length); setShow(true) }, 300)
    }, 2500)
    return () => clearInterval(interval)
  }, [subtitles.length])

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `conic-gradient(from 0deg at 50% 50%, var(--color-hero-yellow) 0deg, transparent 15deg, transparent 20deg, var(--color-hero-yellow) 20deg, transparent 35deg, transparent 40deg)` }} />
      <div className="absolute top-1/3 left-1/6 w-80 h-80 bg-hero-red/8 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-hero-blue/8 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center pb-24">
        <div className="inline-block px-5 py-1.5 mb-8 bg-hero-red/20 border-2 border-hero-red rounded-sm">
          <span className="font-mono text-hero-red text-xs font-bold tracking-widest">🦸 HERO FILE #001</span>
        </div>
        <div className="starburst inline-block">
          <h1 className="action-text text-6xl md:text-9xl leading-none" style={{ animation: 'hero-glow 3s ease-in-out infinite' }}>
            <span className="text-hero-yellow">CLAUDIO</span><br/><span className="text-white">DALL'ARA</span>
          </h1>
        </div>
        <div className="mt-8 h-10">
          <p className={`action-text text-xl md:text-2xl text-hero-sky transition-all duration-300 ${show ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>⚡ {subtitles[idx]} ⚡</p>
        </div>
        <p className="mt-8 text-lg text-text-sub max-w-2xl mx-auto leading-relaxed">
          Every hero has an origin story. Mine began with <span className="text-hero-yellow font-bold">22 years of retail leadership</span>, a burning curiosity,
          and the courage to <span className="text-hero-red font-bold">start over from zero</span>.
          Now I build <span className="text-hero-sky font-bold">cloud-native systems</span> by day
          and <span className="text-hero-purple font-bold">decentralized apps</span> by night.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="#origin" className="px-8 py-3.5 bg-hero-yellow text-bg-dark font-extrabold text-sm tracking-wider rounded-sm hover:bg-hero-red hover:text-white transition-all hover:scale-105 shadow-lg shadow-hero-yellow/20">READ ORIGIN STORY →</a>
          <a href="#missions" className="px-8 py-3.5 border-2 border-hero-yellow/40 text-hero-yellow font-bold text-sm tracking-wider rounded-sm hover:border-hero-yellow hover:bg-hero-yellow/10 transition-all">VIEW MISSIONS</a>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-hero-yellow text-xs font-mono tracking-widest">↓ SCROLL ↓</span>
        </div>
      </div>
    </section>
  )
}

function StatCard({ value, label, color, icon }: { value: string; label: string; color: string; icon: string }) {
  const { ref, visible } = useInView()
  return (
    <div ref={ref} className={`hero-card p-6 text-center transition-all duration-500 ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
      <div className="text-3xl mb-2">{icon}</div>
      <div className={`action-text text-4xl ${color}`}>{value}</div>
      <div className="text-text-sub text-xs font-bold mt-2 uppercase tracking-wider">{label}</div>
    </div>
  )
}

function PowerStats() {
  return (
    <section className="py-16 bg-bg-panel diagonal-top">
      <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard value="20+" label="Certifications Earned" color="text-hero-yellow" icon="🏅" />
        <StatCard value="3" label="Blockchain Ecosystems" color="text-hero-purple" icon="⛓️" />
        <StatCard value="13+" label="Missions Completed" color="text-hero-sky" icon="🎯" />
        <StatCard value="22" label="Years of Leadership" color="text-hero-green" icon="👑" />
      </div>
    </section>
  )
}

const origins = [
  { year: '1996', title: 'THE FIRST SPARK', desc: 'IT Technical Diploma at ITIS Blaise Pascal. Turbo Pascal, Assembly, Prolog.', color: 'hero-sky', icon: '⚡' },
  { year: '1999–2021', title: 'THE LONG TRAINING', desc: '22 years as Retail Store Manager. Leadership, resilience, problem solving.', color: 'hero-green', icon: '🏋️' },
  { year: '2021', title: 'THE AWAKENING', desc: 'Left 22 years of retail to chase the original dream. No safety net. Pure courage.', color: 'hero-red', icon: '🔥', highlight: true },
  { year: '2022–2024', title: 'TRAINING MONTAGE', desc: 'Full Stack Master (MERN). React, TypeScript, Node.js, MongoDB.', color: 'hero-sky', icon: '📚' },
  { year: '2024', title: 'NEW POWERS UNLOCKED', desc: 'Solana, ICP, EPICODE-Binance. Web3, smart contracts, DeFi.', color: 'hero-purple', icon: '🔮' },
  { year: '2025', title: 'THE POWER-UP', desc: 'Docker, Kubernetes, OpenShift, Prometheus, OpenTelemetry, Grafana.', color: 'hero-red', icon: '⚙️', highlight: true },
  { year: 'NOW', title: 'AGILER @ AGILE LAB', desc: 'Junior Application Maintenance. Kafka, monitoring, cloud-native.', color: 'hero-yellow', icon: '🚀', highlight: true },
  { year: '2026', title: 'BOSS BATTLE', desc: 'IOTA Hackathon — GiftBlitz. 63 European teams. IOTA Foundation blog.', color: 'hero-orange', icon: '🏆' },
]

function OriginCard({ origin, index }: { origin: typeof origins[0]; index: number }) {
  const { ref, visible } = useInView(0.2)
  return (
    <div ref={ref} className={`flex items-start gap-5 transition-all duration-700 ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`} style={{ transitionDelay: `${index * 80}ms` }}>
      <div className="shrink-0 flex flex-col items-center">
        <div className={`w-14 h-14 rounded-full border-3 border-${origin.color} flex items-center justify-center text-2xl bg-bg-dark ${origin.highlight ? 'shadow-lg shadow-hero-red/30' : ''}`}
          style={origin.highlight ? { animation: 'power-pulse 2s ease-in-out infinite', color: 'var(--color-hero-red)' } : {}}>
          {origin.icon}
        </div>
        {index < origins.length - 1 && <div className={`w-0.5 h-16 bg-gradient-to-b from-${origin.color}/50 to-transparent mt-2`} />}
      </div>
      <div className={`hero-card p-5 flex-1 mb-4 ${origin.highlight ? 'border-hero-red' : ''}`}>
        <div className="flex items-center gap-3 mb-2">
          <span className="font-mono text-xs px-2 py-0.5 bg-hero-yellow/10 text-hero-yellow border border-hero-yellow/30 rounded-sm">{origin.year}</span>
          {origin.highlight && <span className="text-hero-red text-xs font-bold animate-pulse">⚡ KEY ARC</span>}
        </div>
        <h3 className={`action-text text-lg text-${origin.color}`}>{origin.title}</h3>
        <p className="text-text-sub mt-2 text-sm leading-relaxed">{origin.desc}</p>
      </div>
    </div>
  )
}

function Origin() {
  const { ref, visible } = useInView()
  return (
    <section id="origin" className="py-24">
      <div className="max-w-3xl mx-auto px-6">
        <div ref={ref} className={`text-center mb-16 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="font-mono text-xs bg-hero-red/20 text-hero-red px-3 py-1 border border-hero-red/30 rounded-sm">ORIGIN STORY</span>
          <h2 className="action-text text-4xl md:text-6xl text-hero-yellow mt-6" style={{ animation: 'hero-glow 3s ease-in-out infinite' }}>FROM RETAIL<br/>TO HERO</h2>
          <p className="text-text-sub mt-4 text-lg">Every great hero was once just a person with a dream.</p>
        </div>
        {origins.map((o, i) => <OriginCard key={i} origin={o} index={i} />)}
      </div>
    </section>
  )
}

const powerSets = [
  { name: 'DevOps & Cloud', level: 'PRIMARY POWER', color: 'hero-red', barColor: 'bg-hero-red', power: 85, skills: ['Docker', 'Kubernetes', 'OpenShift', 'Jenkins', 'CI/CD', 'Linux', 'GCP', 'AWS', 'Azure'], highlight: true },
  { name: 'Observability', level: 'SPECIAL ABILITY', color: 'hero-orange', barColor: 'bg-hero-orange', power: 80, skills: ['Prometheus', 'Grafana', 'OpenTelemetry', 'Jaeger', 'Kafka'], highlight: true },
  { name: 'Web3 / Blockchain', level: 'HIDDEN POWER', color: 'hero-purple', barColor: 'bg-hero-purple', power: 75, skills: ['Solidity', 'Hardhat', 'Foundry', 'Ethers.js', 'IOTA', 'Solana', 'ICP', 'OpenZeppelin'] },
  { name: 'Frontend', level: 'CORE SKILL', color: 'hero-sky', barColor: 'bg-hero-sky', power: 90, skills: ['React', 'TypeScript', 'Next.js', 'TailwindCSS', 'HTML5', 'CSS3'] },
  { name: 'Backend', level: 'CORE SKILL', color: 'hero-green', barColor: 'bg-hero-green', power: 85, skills: ['Node.js', 'Express', 'PHP', 'Laravel', 'MongoDB', 'PostgreSQL', 'SQL', 'Prisma', 'Postman'] },
  { name: 'AI & Data', level: 'EMERGING', color: 'hero-pink', barColor: 'bg-hero-pink', power: 50, skills: ['Python', 'AI Avanzata', 'Data Analysis'] },
]

function PowerSetCard({ ps, index }: { ps: typeof powerSets[0]; index: number }) {
  const { ref, visible } = useInView()
  return (
    <div ref={ref} className={`hero-card p-5 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${ps.highlight ? 'border-hero-red' : ''}`}
      style={{ transitionDelay: `${index * 100}ms` }}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-sm bg-${ps.color}/20 text-${ps.color} border border-${ps.color}/30`}>{ps.level}</span>
          <h3 className={`action-text text-base text-${ps.color} mt-2`}>{ps.name}</h3>
        </div>
        <span className={`action-text text-2xl text-${ps.color}`}>{ps.power}%</span>
      </div>
      <div className="power-bar mb-4">
        <div className={`power-bar-fill ${ps.barColor}`} style={{ width: visible ? `${ps.power}%` : '0%' }} />
      </div>
      <div className="flex flex-wrap gap-1.5">
        {ps.skills.map(s => <span key={s} className="px-2.5 py-0.5 text-[11px] font-bold bg-bg-dark/80 text-text-sub border border-white/10 rounded-sm hover:border-hero-yellow/40 hover:text-hero-yellow transition-colors cursor-default">{s}</span>)}
      </div>
    </div>
  )
}

function Powers() {
  const { ref, visible } = useInView()
  return (
    <section id="powers" className="py-24 bg-bg-panel diagonal-top">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div ref={ref} className={`text-center mb-16 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="font-mono text-xs bg-hero-yellow/20 text-hero-yellow px-3 py-1 border border-hero-yellow/30 rounded-sm">HERO ABILITIES</span>
          <h2 className="action-text text-4xl md:text-6xl text-hero-yellow mt-6" style={{ animation: 'hero-glow 3s ease-in-out infinite' }}>POWERS &<br/>ABILITIES</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {powerSets.map((ps, i) => <PowerSetCard key={i} ps={ps} index={i} />)}
        </div>
      </div>
    </section>
  )
}

const missions = [
  { title: 'GIFTBLITZ', codename: 'IOTA HACKATHON 2026', status: '🔴 ACTIVE', desc: 'Decentralized gift card marketplace on IOTA. 63 teams. IOTA Foundation blog.', tech: ['IOTA', 'Smart Contracts', 'Web3', 'Digital Identity'], live: 'https://gift-blitz-full.vercel.app/', blog: 'https://blog.iota.org/build-now-masterz-hackathon/', featured: true, color: 'hero-red' },
  { title: 'LINKEDSHIELD', codename: 'OPERATION PROTECT', status: '🟢 COMPLETE', desc: 'Anti-scam app for LinkedIn. OAuth2, real-time threat detection.', tech: ['Node.js', 'TypeScript', 'MongoDB', 'Tailwind v4'], live: 'https://www.linkedshield.eu/', github: 'https://github.com/boobaGreen/linkedinScammers', featured: true, color: 'hero-sky' },
  { title: 'SMART 360', codename: 'CLIENT OPS', status: '🟢 COMPLETE', desc: 'Full website for a moving company.', tech: ['React', 'Full Stack', 'SEO'], live: 'https://www.grouptraslochismart360.it/', github: 'https://github.com/boobaGreen/smart360', color: 'hero-green' },
  { title: 'STUDYBUDDYHUB', codename: 'FINAL EXAM', status: '🟢 COMPLETE', desc: 'Full SPA with RESTful APIs and auth.', tech: ['MongoDB', 'Express', 'React', 'Node.js'], live: 'https://studybuddyhub.netlify.app/cover', github: 'https://github.com/boobaGreen/S2I-STUDY_BUDDY_HUB_4COACH', color: 'hero-orange' },
  { title: 'RANDOMIZER', codename: 'OPERATION ICP', status: '🟢 COMPLETE', desc: 'Deployed on ICP blockchain using Azle.', tech: ['ICP', 'Azle', 'TypeScript', 'Blockchain'], live: 'https://kwjpy-liaaa-aaaap-ahaea-cai.raw.icp0.io/', github: 'https://github.com/boobaGreen/randomizer', color: 'hero-purple' },
]

function MissionCard({ mission, index }: { mission: typeof missions[0]; index: number }) {
  const { ref, visible } = useInView()
  return (
    <div ref={ref} className={`hero-card p-6 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${mission.featured ? 'md:col-span-2' : ''}`}
      style={{ transitionDelay: `${index * 100}ms`, borderColor: mission.featured ? 'var(--color-hero-red)' : undefined }}>
      <div className="flex items-center gap-3 mb-3">
        <span className="font-mono text-[10px] bg-bg-dark px-2 py-0.5 text-hero-yellow border border-hero-yellow/30 rounded-sm">{mission.codename}</span>
        <span className="text-xs font-bold">{mission.status}</span>
        {mission.featured && <span className="text-hero-yellow text-xs font-bold">⭐ FEATURED</span>}
      </div>
      <h3 className={`action-text text-xl text-${mission.color}`}>{mission.title}</h3>
      <p className="text-text-sub mt-2 text-sm leading-relaxed">{mission.desc}</p>
      <div className="flex flex-wrap gap-1.5 mt-4">
        {mission.tech.map(t => <span key={t} className="px-2 py-0.5 text-[11px] font-bold bg-bg-dark/80 text-text-sub border border-white/10 rounded-sm">{t}</span>)}
      </div>
      <div className="flex gap-3 mt-5">
        {mission.live && <a href={mission.live} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-hero-yellow text-bg-dark font-bold text-xs tracking-wider rounded-sm hover:bg-hero-red hover:text-white transition-all">LIVE DEMO ↗</a>}
        {mission.github && <a href={mission.github} target="_blank" rel="noopener noreferrer" className="px-4 py-2 border border-white/20 text-text-sub font-bold text-xs tracking-wider rounded-sm hover:border-hero-yellow/50 hover:text-hero-yellow transition-all">GITHUB ↗</a>}
        {mission.blog && <a href={mission.blog} target="_blank" rel="noopener noreferrer" className="px-4 py-2 border border-hero-orange/30 text-hero-orange font-bold text-xs tracking-wider rounded-sm hover:bg-hero-orange/10 transition-all">IOTA BLOG ↗</a>}
      </div>
    </div>
  )
}

function Missions() {
  const { ref, visible } = useInView()
  return (
    <section id="missions" className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div ref={ref} className={`text-center mb-16 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="font-mono text-xs bg-hero-sky/20 text-hero-sky px-3 py-1 border border-hero-sky/30 rounded-sm">MISSION LOG</span>
          <h2 className="action-text text-4xl md:text-6xl text-hero-yellow mt-6" style={{ animation: 'hero-glow 3s ease-in-out infinite' }}>COMPLETED<br/>MISSIONS</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {missions.map((m, i) => <MissionCard key={i} mission={m} index={i} />)}
        </div>
      </div>
    </section>
  )
}

const trainingArcs = [
  { area: 'DevOps & Cloud', icon: '⚙️', color: 'hero-red', certs: [
    { name: 'Docker Per Comuni Mortali', from: 'Udemy', date: 'Jan 2026' },
    { name: 'OpenShift for Beginners', from: 'Udemy', date: 'Dec 2025' },
    { name: 'Prometheus Monitoring', from: 'Udemy', date: 'Sep 2025' },
    { name: 'OpenTelemetry Foundations', from: 'Udemy', date: 'Sep 2025' },
    { name: 'Linux LPI Essentials', from: 'Udemy', date: 'Apr 2025' },
    { name: 'Google Cloud Fundamentals', from: 'Coursera / Google', date: 'Jan 2025' },
  ]},
  { area: 'Web3 / Blockchain', icon: '⛓️', color: 'hero-purple', certs: [
    { name: 'MasterZ × IOTA Hackathon', from: 'MasterZ / IOTA', date: '2026' },
    { name: 'EPICODE-Binance Scholarship', from: 'EPICODE / Binance', date: 'Mar 2025' },
    { name: 'MasterZ × Solana Bootcamp', from: 'MasterZ / Solana', date: '2024' },
    { name: 'ICP Protocol — Azle', from: 'ICP Hub Italia', date: 'Mar 2024' },
    { name: 'Master Blockchain Dev', from: 'Start2Impact', date: '2024–Present' },
  ]},
  { area: 'Full Stack & AI', icon: '🤖', color: 'hero-sky', certs: [
    { name: 'AI Avanzata', from: 'Profession AI', date: 'Sep 2025' },
    { name: 'Python Programming', from: 'Profession AI', date: 'Sep 2025' },
    { name: 'Master Full Stack Dev', from: 'Start2Impact', date: 'Nov 2022 – Feb 2024' },
  ]},
]

function TrainingSection({ arc, index }: { arc: typeof trainingArcs[0]; index: number }) {
  const { ref, visible } = useInView()
  return (
    <div ref={ref} className={`hero-card p-6 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ transitionDelay: `${index * 150}ms` }}>
      <div className="flex items-center gap-3 mb-5">
        <span className="text-2xl">{arc.icon}</span>
        <h3 className={`action-text text-base text-${arc.color}`}>{arc.area}</h3>
        <span className="ml-auto font-mono text-xs text-text-sub">{arc.certs.length} COMPLETED</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {arc.certs.map((cert, ci) => (
          <div key={ci} className="px-3 py-2.5 bg-bg-dark/60 rounded-sm border border-white/5 hover:border-hero-yellow/20 transition-colors">
            <div className="text-sm font-bold text-text-hero">{cert.name}</div>
            <div className="text-xs text-text-sub mt-0.5">{cert.from} · {cert.date}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Training() {
  const { ref, visible } = useInView()
  return (
    <section id="training" className="py-24 bg-bg-panel diagonal-top">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div ref={ref} className={`text-center mb-16 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="font-mono text-xs bg-hero-green/20 text-hero-green px-3 py-1 border border-hero-green/30 rounded-sm">TRAINING ARCS</span>
          <h2 className="action-text text-4xl md:text-6xl text-hero-yellow mt-6" style={{ animation: 'hero-glow 3s ease-in-out infinite' }}>20+ ARCS<br/>COMPLETED</h2>
        </div>
        <div className="space-y-6">
          {trainingArcs.map((arc, i) => <TrainingSection key={i} arc={arc} index={i} />)}
        </div>
      </div>
    </section>
  )
}

function Signal() {
  const { ref, visible } = useInView()
  return (
    <section id="signal" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[500px] h-[500px] bg-hero-yellow/5 rounded-full blur-[150px]" />
      </div>
      <div ref={ref} className={`relative z-10 max-w-3xl mx-auto px-6 text-center transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="hero-card p-8 md:p-12">
          <div className="inline-block px-4 py-1 bg-hero-red/20 border border-hero-red/30 rounded-sm mb-6">
            <span className="font-mono text-hero-red text-xs font-bold">📡 HERO SIGNAL</span>
          </div>
          <h2 className="action-text text-4xl md:text-5xl text-hero-yellow" style={{ animation: 'hero-glow 3s ease-in-out infinite' }}>NEED A HERO?</h2>
          <p className="text-text-sub mt-6 text-lg max-w-xl mx-auto">
            Looking for a curious, proactive developer who brings technical skills <strong className="text-hero-yellow">and</strong> 22 years of real-world problem solving? Send the signal.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="https://www.linkedin.com/in/claudio-dall-ara-730aa0302/" target="_blank" rel="noopener noreferrer"
              className="px-8 py-3.5 bg-hero-yellow text-bg-dark font-extrabold text-sm tracking-wider rounded-sm hover:bg-hero-red hover:text-white transition-all hover:scale-105 shadow-lg shadow-hero-yellow/20 flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              LINKEDIN
            </a>
            <a href="https://github.com/boobaGreen" target="_blank" rel="noopener noreferrer"
              className="px-8 py-3.5 border-2 border-hero-yellow/40 text-hero-yellow font-bold text-sm tracking-wider rounded-sm hover:border-hero-yellow hover:bg-hero-yellow/10 transition-all flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
              GITHUB
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="py-6 border-t-2 border-hero-yellow/20 text-center">
      <p className="action-text text-sm text-hero-yellow/60">DESIGNED & BUILT BY CLAUDIO DALL'ARA · 2026</p>
      <p className="font-mono text-[10px] text-text-sub/40 mt-1">React + TypeScript + Tailwind v4 · Comic Book Hero Edition</p>
    </footer>
  )
}

function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <PowerStats />
      <Origin />
      <Powers />
      <Missions />
      <Training />
      <Signal />
      <Footer />
    </div>
  )
}

export default App
