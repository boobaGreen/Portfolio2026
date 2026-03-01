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

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${scrolled ? 'bg-pixel-black/95 border-b-3 border-pixel-green' : ''}`}>
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <a href="#" className="font-pixel text-pixel-green text-xs pixel-glow">{'>'} CD_</a>
        <div className="hidden md:flex items-center gap-6">
          {[{ l: 'QUEST', h: '#quest' }, { l: 'STATS', h: '#stats' }, { l: 'INVENTORY', h: '#inventory' }, { l: 'ACHIEVEMENTS', h: '#achievements' }, { l: 'SAVE', h: '#save' }].map(n => (
            <a key={n.h} href={n.h} className="font-pixel text-[8px] text-pixel-gray hover:text-pixel-green transition-colors tracking-wider">[{n.l}]</a>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="font-pixel text-[8px] text-pixel-yellow">HP</span>
          <div className="w-20 h-3 border-2 border-pixel-green bg-pixel-black"><div className="h-full bg-pixel-green w-full" /></div>
        </div>
      </div>
    </nav>
  )
}

function Hero() {
  const [showPress, setShowPress] = useState(true)
  useEffect(() => { const i = setInterval(() => setShowPress(s => !s), 800); return () => clearInterval(i) }, [])
  const classes = ['DEVOPS ENGINEER', 'FULL STACK DEV', 'WEB3 BUILDER', 'ETERNAL LEARNER']
  const [classIdx, setClassIdx] = useState(0)
  useEffect(() => { const i = setInterval(() => setClassIdx(c => (c + 1) % classes.length), 2000); return () => clearInterval(i) }, [classes.length])

  return (
    <section className="min-h-screen flex items-center justify-center relative grid-bg">
      <div className="absolute top-20 left-10 w-4 h-4 bg-pixel-green/20 animate-pulse" />
      <div className="absolute top-40 right-20 w-3 h-3 bg-pixel-cyan/20 animate-pulse" style={{ animationDelay: '0.5s' }} />
      <div className="absolute bottom-32 left-1/4 w-2 h-2 bg-pixel-magenta/20 animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="relative z-10 text-center px-4 pb-20">
        <div className="inline-block px-6 py-2 border-3 border-pixel-yellow bg-pixel-dark mb-8">
          <span className="font-pixel text-pixel-yellow text-[8px] tracking-widest">★ PORTFOLIO QUEST 2026 ★</span>
        </div>
        <h1 className="font-pixel text-pixel-green text-3xl md:text-5xl leading-relaxed pixel-glow" style={{ animation: 'screen-flicker 4s ease-in-out infinite' }}>
          CLAUDIO<br/>DALL'ARA
        </h1>
        <div className="mt-8 pixel-border inline-block px-6 py-3">
          <span className="font-pixel text-[9px] text-pixel-gray">CLASS:</span>
          <p className="font-pixel text-pixel-cyan text-[10px] mt-1 pixel-glow">{classes[classIdx]}</p>
        </div>
        <p className="mt-10 font-body text-xl text-pixel-white max-w-lg mx-auto leading-relaxed">
          ▸ Started coding in <span className="text-pixel-yellow">1996</span> (before it was cool)<br/>
          ▸ Survived <span className="text-pixel-red">22 years</span> of retail dungeons<br/>
          ▸ Respawned as a <span className="text-pixel-cyan">developer</span> in 2021<br/>
          ▸ Currently grinding at <span className="text-pixel-green">Agile Lab</span>
        </p>
        <div className="mt-12">
          <a href="#quest" className={`font-pixel text-pixel-yellow text-[10px] tracking-widest transition-opacity ${showPress ? 'opacity-100' : 'opacity-0'}`}>▼ PRESS START ▼</a>
        </div>
      </div>
    </section>
  )
}

function HudStat({ value, label, color }: { value: string; label: string; color: string }) {
  const { ref, visible } = useInView()
  return (
    <div ref={ref} className={`pixel-border p-4 text-center transition-all duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      <div className={`font-pixel text-2xl md:text-3xl ${color} pixel-glow`}>{value}</div>
      <div className="font-pixel text-[7px] text-pixel-gray mt-2 tracking-wider">{label}</div>
    </div>
  )
}

function HudStats() {
  return (
    <section className="py-12 border-y-3 border-pixel-green/30 bg-pixel-dark/50">
      <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        <HudStat value="20+" label="ACHIEVEMENTS" color="text-pixel-yellow" />
        <HudStat value="3" label="WORLDS" color="text-pixel-magenta" />
        <HudStat value="13+" label="QUESTS DONE" color="text-pixel-cyan" />
        <HudStat value="LV.22" label="LEADERSHIP" color="text-pixel-green" />
      </div>
    </section>
  )
}

const quests = [
  { year: '1996', title: 'TUTORIAL ZONE', desc: 'IT Diploma — ITIS Blaise Pascal. Turbo Pascal, Assembly, Prolog.', xp: 100, color: 'pixel-cyan', icon: '📘' },
  { year: '1999', title: 'THE RETAIL DUNGEON', desc: '22 years as Store Manager. Grinding leadership and team management.', xp: 2200, color: 'pixel-orange', icon: '🏪' },
  { year: '2021', title: '★ CLASS CHANGE ★', desc: 'Left retail after 22 years. New Game+ activated.', xp: 9999, color: 'pixel-red', icon: '🔄', highlight: true },
  { year: '2022', title: 'TRAINING ARC', desc: 'Full Stack Master at Start2Impact. React, TypeScript, Node.js.', xp: 3500, color: 'pixel-cyan', icon: '⚔️' },
  { year: '2024', title: 'SECRET WORLD', desc: 'Solana, ICP, EPICODE-Binance. Blockchain dimension discovered.', xp: 4000, color: 'pixel-magenta', icon: '🔮' },
  { year: '2025', title: '★ POWER UP ★', desc: 'Docker, K8s, OpenShift, Prometheus, OpenTelemetry.', xp: 5000, color: 'pixel-red', icon: '⚡', highlight: true },
  { year: 'NOW', title: '★ CURRENT SAVE ★', desc: 'Agiler @ Agile Lab. Kafka, monitoring, cloud-native.', xp: 6000, color: 'pixel-green', icon: '🚀', highlight: true },
  { year: '2026', title: 'BOSS FIGHT', desc: 'IOTA Hackathon — GiftBlitz. 63 teams. IOTA blog feature!', xp: 7000, color: 'pixel-yellow', icon: '🏆' },
]

function QuestCard({ quest, index }: { quest: typeof quests[0]; index: number }) {
  const { ref, visible } = useInView(0.2)
  return (
    <div ref={ref} className={`flex items-start gap-4 mb-6 transition-all duration-500 ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
      style={{ transitionDelay: `${index * 80}ms` }}>
      <div className="shrink-0 text-2xl mt-2">{quest.icon}</div>
      <div className={`pixel-border p-4 flex-1`} style={quest.highlight ? { borderColor: `var(--color-${quest.color})` } : {}}>
        <div className="flex items-center gap-3 mb-1.5">
          <span className="font-pixel text-[8px] text-pixel-gray">[{quest.year}]</span>
          {quest.highlight && <span className="font-pixel text-[7px] text-pixel-red animate-pulse">! KEY EVENT</span>}
          <span className="ml-auto font-pixel text-[7px] text-pixel-yellow">+{quest.xp} XP</span>
        </div>
        <h3 className="font-pixel text-[10px]" style={{ color: `var(--color-${quest.color})` }}>{quest.title}</h3>
        <p className="font-body text-pixel-white text-base mt-2 leading-relaxed">{quest.desc}</p>
      </div>
    </div>
  )
}

function QuestLog() {
  const { ref, visible } = useInView()
  return (
    <section id="quest" className="py-20 grid-bg">
      <div className="max-w-3xl mx-auto px-4">
        <div ref={ref} className={`text-center mb-14 transition-all duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}>
          <div className="inline-block px-4 py-1 border-3 border-pixel-green bg-pixel-dark">
            <span className="font-pixel text-pixel-green text-[9px]">QUEST LOG</span>
          </div>
          <h2 className="font-pixel text-pixel-green text-lg md:text-2xl mt-6 pixel-glow">MAIN STORYLINE</h2>
        </div>
        {quests.map((q, i) => <QuestCard key={i} quest={q} index={i} />)}
      </div>
    </section>
  )
}

const statGroups = [
  { name: 'DevOps & Cloud', level: 'LV.MAX', color: 'pixel-red', barColor: 'bg-pixel-red', xp: 85, skills: ['Docker', 'Kubernetes', 'OpenShift', 'Jenkins', 'CI/CD', 'Linux', 'GCP', 'AWS', 'Azure'], primary: true },
  { name: 'Observability', level: 'LV.80', color: 'pixel-orange', barColor: 'bg-pixel-orange', xp: 80, skills: ['Prometheus', 'Grafana', 'OpenTelemetry', 'Jaeger', 'Kafka'], primary: true },
  { name: 'Web3 / Blockchain', level: 'LV.75', color: 'pixel-magenta', barColor: 'bg-pixel-magenta', xp: 75, skills: ['Solidity', 'Hardhat', 'Foundry', 'Ethers.js', 'IOTA', 'Solana', 'ICP', 'OpenZeppelin'] },
  { name: 'Frontend', level: 'LV.90', color: 'pixel-cyan', barColor: 'bg-pixel-cyan', xp: 90, skills: ['React', 'TypeScript', 'Next.js', 'TailwindCSS', 'HTML5', 'CSS3'] },
  { name: 'Backend', level: 'LV.85', color: 'pixel-green', barColor: 'bg-pixel-green', xp: 85, skills: ['Node.js', 'Express', 'PHP', 'Laravel', 'MongoDB', 'PostgreSQL', 'SQL', 'Prisma', 'Postman'] },
  { name: 'AI & Data', level: 'LV.50', color: 'pixel-blue', barColor: 'bg-pixel-blue', xp: 50, skills: ['Python', 'AI Avanzata', 'Data Analysis'] },
]

function StatGroupCard({ sg, index }: { sg: typeof statGroups[0]; index: number }) {
  const { ref, visible } = useInView()
  return (
    <div ref={ref} className={`pixel-border p-4 transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      style={{ transitionDelay: `${index * 100}ms`, borderColor: sg.primary ? `var(--color-${sg.color})` : undefined }}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-pixel text-[9px]" style={{ color: `var(--color-${sg.color})` }}>{sg.name}</h3>
        <span className="font-pixel text-[8px] text-pixel-yellow">{sg.level}</span>
      </div>
      <div className="xp-bar mb-3" style={{ borderColor: `var(--color-${sg.color})` }}>
        <div className={`xp-bar-fill ${sg.barColor}`} style={{ width: visible ? `${sg.xp}%` : '0%' }} />
      </div>
      <div className="flex flex-wrap gap-1.5">
        {sg.skills.map(s => <span key={s} className="px-2 py-0.5 font-body text-sm border border-pixel-green/30 text-pixel-white hover:border-pixel-green hover:text-pixel-green transition-colors cursor-default bg-pixel-black/50">{s}</span>)}
      </div>
    </div>
  )
}

function CharacterStats() {
  const { ref, visible } = useInView()
  return (
    <section id="stats" className="py-20 bg-pixel-dark/50">
      <div className="max-w-5xl mx-auto px-4">
        <div ref={ref} className={`text-center mb-14 transition-all duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}>
          <div className="inline-block px-4 py-1 border-3 border-pixel-yellow bg-pixel-dark">
            <span className="font-pixel text-pixel-yellow text-[9px]">CHARACTER SHEET</span>
          </div>
          <h2 className="font-pixel text-pixel-green text-lg md:text-2xl mt-6 pixel-glow">STATS & SKILLS</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {statGroups.map((sg, i) => <StatGroupCard key={i} sg={sg} index={i} />)}
        </div>
      </div>
    </section>
  )
}

const items = [
  { name: 'GiftBlitz', rarity: '★ LEGENDARY', rarityColor: 'pixel-yellow', desc: 'Decentralized gift card marketplace on IOTA. 63 teams. IOTA blog.', tech: ['IOTA', 'Smart Contracts', 'Web3', 'Digital Identity'], live: 'https://gift-blitz-full.vercel.app/', blog: 'https://blog.iota.org/build-now-masterz-hackathon/', featured: true },
  { name: 'LinkedShield', rarity: '★ EPIC', rarityColor: 'pixel-magenta', desc: 'Anti-scam shield for LinkedIn. OAuth2, real-time detection.', tech: ['Node.js', 'TypeScript', 'MongoDB', 'Tailwind v4'], live: 'https://www.linkedshield.eu/', github: 'https://github.com/boobaGreen/linkedinScammers', featured: true },
  { name: 'Smart 360', rarity: 'RARE', rarityColor: 'pixel-cyan', desc: 'Full website for a moving company.', tech: ['React', 'Full Stack', 'SEO'], live: 'https://www.grouptraslochismart360.it/', github: 'https://github.com/boobaGreen/smart360' },
  { name: 'StudyBuddyHub', rarity: 'RARE', rarityColor: 'pixel-cyan', desc: 'Full SPA with RESTful APIs and auth.', tech: ['MongoDB', 'Express', 'React', 'Node.js'], live: 'https://studybuddyhub.netlify.app/cover', github: 'https://github.com/boobaGreen/S2I-STUDY_BUDDY_HUB_4COACH' },
  { name: 'Randomizer', rarity: 'UNCOMMON', rarityColor: 'pixel-green', desc: 'Deployed on ICP using Azle and DFINITY CLI.', tech: ['ICP', 'Azle', 'TypeScript', 'Blockchain'], live: 'https://kwjpy-liaaa-aaaap-ahaea-cai.raw.icp0.io/', github: 'https://github.com/boobaGreen/randomizer' },
]

function ItemCard({ item, index }: { item: typeof items[0]; index: number }) {
  const { ref, visible } = useInView()
  return (
    <div ref={ref} className={`pixel-border p-5 transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} ${item.featured ? 'md:col-span-2' : ''}`}
      style={{ transitionDelay: `${index * 100}ms`, borderColor: item.featured ? `var(--color-${item.rarityColor})` : undefined }}>
      <span className="font-pixel text-[7px]" style={{ color: `var(--color-${item.rarityColor})` }}>{item.rarity}</span>
      <h3 className="font-pixel text-[11px] text-pixel-white mt-1">{item.name}</h3>
      <p className="font-body text-pixel-gray text-base mt-2">{item.desc}</p>
      <div className="flex flex-wrap gap-1.5 mt-3">
        {item.tech.map(t => <span key={t} className="px-2 py-0.5 font-body text-xs border border-pixel-green/30 text-pixel-gray bg-pixel-black/50">{t}</span>)}
      </div>
      <div className="flex gap-3 mt-4">
        {item.live && <a href={item.live} target="_blank" rel="noopener noreferrer" className="font-pixel text-[7px] px-4 py-2 border-2 border-pixel-green text-pixel-green bg-pixel-dark hover:bg-pixel-green hover:text-pixel-black transition-all">[PLAY] ↗</a>}
        {item.github && <a href={item.github} target="_blank" rel="noopener noreferrer" className="font-pixel text-[7px] px-4 py-2 border-2 border-pixel-gray text-pixel-gray hover:border-pixel-cyan hover:text-pixel-cyan transition-all">[SOURCE] ↗</a>}
        {item.blog && <a href={item.blog} target="_blank" rel="noopener noreferrer" className="font-pixel text-[7px] px-4 py-2 border-2 border-pixel-yellow text-pixel-yellow hover:bg-pixel-yellow hover:text-pixel-black transition-all">[BLOG] ↗</a>}
      </div>
    </div>
  )
}

function Inventory() {
  const { ref, visible } = useInView()
  return (
    <section id="inventory" className="py-20 grid-bg">
      <div className="max-w-5xl mx-auto px-4">
        <div ref={ref} className={`text-center mb-14 transition-all duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}>
          <div className="inline-block px-4 py-1 border-3 border-pixel-magenta bg-pixel-dark">
            <span className="font-pixel text-pixel-magenta text-[9px]">INVENTORY</span>
          </div>
          <h2 className="font-pixel text-pixel-green text-lg md:text-2xl mt-6 pixel-glow">COLLECTED ITEMS</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item, i) => <ItemCard key={i} item={item} index={i} />)}
        </div>
      </div>
    </section>
  )
}

const achievementSets = [
  { category: 'DevOps & Cloud', color: 'pixel-red', achievements: [
    { name: 'Docker Master', from: 'Udemy', date: 'Jan 2026' },
    { name: 'OpenShift Beginner', from: 'Udemy', date: 'Dec 2025' },
    { name: 'Prometheus Pro', from: 'Udemy', date: 'Sep 2025' },
    { name: 'OpenTelemetry Found.', from: 'Udemy', date: 'Sep 2025' },
    { name: 'Linux LPI', from: 'Udemy', date: 'Apr 2025' },
    { name: 'Google Cloud', from: 'Coursera', date: 'Jan 2025' },
  ]},
  { category: 'Web3 / Blockchain', color: 'pixel-magenta', achievements: [
    { name: 'IOTA Hackathon', from: 'MasterZ/IOTA', date: '2026' },
    { name: 'Binance Scholar', from: 'EPICODE', date: 'Mar 2025' },
    { name: 'Solana Bootcamp', from: 'MasterZ', date: '2024' },
    { name: 'ICP — Azle', from: 'ICP Hub', date: 'Mar 2024' },
    { name: 'Blockchain Dev', from: 'Start2Impact', date: '2024+' },
  ]},
  { category: 'Full Stack & AI', color: 'pixel-cyan', achievements: [
    { name: 'AI Avanzata', from: 'Profession AI', date: 'Sep 2025' },
    { name: 'Python Dev', from: 'Profession AI', date: 'Sep 2025' },
    { name: 'Full Stack Master', from: 'Start2Impact', date: '2022-2024' },
  ]},
]

function AchievementBlock({ set, index }: { set: typeof achievementSets[0]; index: number }) {
  const { ref, visible } = useInView()
  return (
    <div ref={ref} className={`pixel-border p-5 transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      style={{ transitionDelay: `${index * 150}ms`, borderColor: `var(--color-${set.color})` }}>
      <div className="flex items-center gap-3 mb-4">
        <span className="font-pixel text-[8px]" style={{ color: `var(--color-${set.color})` }}>◆ {set.category}</span>
        <span className="ml-auto font-pixel text-[7px] text-pixel-yellow">{set.achievements.length}/6 ★</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {set.achievements.map((a, i) => (
          <div key={i} className="flex items-center gap-2 px-3 py-2 border border-pixel-green/15 bg-pixel-black/50 hover:border-pixel-green/40 transition-colors">
            <span className="text-pixel-yellow text-sm">🏅</span>
            <div>
              <div className="font-body text-pixel-white text-sm">{a.name}</div>
              <div className="font-body text-pixel-gray text-xs">{a.from} · {a.date}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Achievements() {
  const { ref, visible } = useInView()
  return (
    <section id="achievements" className="py-20 bg-pixel-dark/50">
      <div className="max-w-5xl mx-auto px-4">
        <div ref={ref} className={`text-center mb-14 transition-all duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}>
          <div className="inline-block px-4 py-1 border-3 border-pixel-yellow bg-pixel-dark">
            <span className="font-pixel text-pixel-yellow text-[9px]">ACHIEVEMENTS</span>
          </div>
          <h2 className="font-pixel text-pixel-green text-lg md:text-2xl mt-6 pixel-glow">20+ UNLOCKED</h2>
        </div>
        <div className="space-y-5">
          {achievementSets.map((set, i) => <AchievementBlock key={i} set={set} index={i} />)}
        </div>
      </div>
    </section>
  )
}

function SavePoint() {
  const { ref, visible } = useInView()
  return (
    <section id="save" className="py-20 grid-bg">
      <div ref={ref} className={`max-w-2xl mx-auto px-4 text-center transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="pixel-border p-8 md:p-12">
          <div className="inline-block px-4 py-1 border-3 border-pixel-green bg-pixel-dark mb-6">
            <span className="font-pixel text-pixel-green text-[9px]">💾 SAVE POINT</span>
          </div>
          <h2 className="font-pixel text-pixel-green text-lg md:text-xl pixel-glow">WANT TO JOIN<br/>MY PARTY?</h2>
          <p className="font-body text-pixel-white text-lg mt-6 leading-relaxed">
            Looking for a player with <span className="text-pixel-yellow">high curiosity stats</span>,
            <span className="text-pixel-red"> 22 years of XP</span>, and
            <span className="text-pixel-cyan"> multi-class abilities</span>?
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="https://www.linkedin.com/in/claudio-dall-ara-730aa0302/" target="_blank" rel="noopener noreferrer"
              className="font-pixel text-[8px] px-6 py-3 border-3 border-pixel-cyan text-pixel-cyan bg-pixel-dark hover:bg-pixel-cyan hover:text-pixel-black transition-all flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              [LINKEDIN]
            </a>
            <a href="https://github.com/boobaGreen" target="_blank" rel="noopener noreferrer"
              className="font-pixel text-[8px] px-6 py-3 border-3 border-pixel-green text-pixel-green bg-pixel-dark hover:bg-pixel-green hover:text-pixel-black transition-all flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
              [GITHUB]
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="py-6 border-t-3 border-pixel-green/30 text-center">
      <p className="font-pixel text-[7px] text-pixel-green/60 tracking-wider">© 2026 CLAUDIO DALL'ARA — ALL RIGHTS RESERVED</p>
      <p className="font-body text-pixel-gray/40 text-sm mt-1">React + TypeScript + Tailwind v4 · Pixel Retro Edition</p>
    </footer>
  )
}

function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <HudStats />
      <QuestLog />
      <CharacterStats />
      <Inventory />
      <Achievements />
      <SavePoint />
      <Footer />
    </div>
  )
}

export default App
