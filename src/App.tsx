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

function useParallax() {
  const [offset, setOffset] = useState(0)
  useEffect(() => {
    const h = () => setOffset(window.scrollY)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])
  return offset
}

/* ───────── NAVBAR (compass bar) ───────── */

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])

  const destinations = [
    { label: '🏝️ Journey', href: '#journey' },
    { label: '⚔️ Arsenal', href: '#arsenal' },
    { label: '🗿 Quests', href: '#quests' },
    { label: '📜 Scrolls', href: '#scrolls' },
    { label: '🏰 Fortress', href: '#fortress' },
  ]

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-ocean-deep/95 backdrop-blur-md border-b-2 border-gold/20' : ''}`}>
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#" className="font-map text-gold text-sm tracking-widest" style={{ animation: 'treasure-glow 3s ease-in-out infinite' }}>
          ⚓ CD
        </a>
        <div className="hidden md:flex items-center gap-6">
          {destinations.map(d => (
            <a key={d.href} href={d.href} className="text-parchment/60 hover:text-gold transition-colors text-sm font-heading font-semibold tracking-wide">
              {d.label}
            </a>
          ))}
        </div>
        <a href="#fortress" className="px-5 py-2 bg-gold/20 text-gold border border-gold/40 font-heading font-bold text-xs tracking-wider rounded hover:bg-gold hover:text-ocean-deep transition-all">
          🧭 HIRE ME
        </a>
      </div>
    </nav>
  )
}

/* ───────── HERO (world map title) ───────── */

function Hero() {
  const parallax = useParallax()

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Parallax ocean layers */}
      <div className="absolute inset-0 opacity-20" style={{ transform: `translateY(${parallax * 0.1}px)` }}>
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-sapphire/20 to-transparent" />
      </div>

      {/* Stars / shimmer */}
      {[...Array(12)].map((_, i) => (
        <div key={i}
          className="absolute w-1 h-1 bg-gold/30 rounded-full animate-pulse"
          style={{
            top: `${10 + (i * 7) % 80}%`,
            left: `${5 + (i * 13) % 90}%`,
            animationDelay: `${i * 0.3}s`,
            animationDuration: `${2 + (i % 3)}s`,
          }}
        />
      ))}

      <div className="relative z-10 text-center px-6 max-w-4xl pb-20" style={{ transform: `translateY(${parallax * -0.15}px)` }}>
        {/* Map cartouche */}
        <div className="inline-block px-6 py-2 border-2 border-gold/40 bg-ocean-deep/60 backdrop-blur-sm rounded mb-8">
          <span className="font-heading text-gold text-xs tracking-[0.3em]">ANNO DOMINI MMXXVI</span>
        </div>

        <h1 className="font-map text-4xl md:text-7xl text-gold leading-tight tracking-wider" style={{ textShadow: '0 0 30px rgba(255,215,0,0.3), 0 2px 4px rgba(0,0,0,0.5)' }}>
          THE VOYAGE OF<br/>
          <span className="text-5xl md:text-8xl">CLAUDIO<br/>DALL'ARA</span>
        </h1>

        <p className="mt-8 font-heading text-parchment/70 text-sm tracking-widest uppercase">
          ⚓ DevOps Engineer · Full Stack Developer · Web3 Explorer ⚓
        </p>

        <p className="mt-8 text-lg text-parchment/60 max-w-xl mx-auto leading-relaxed italic">
          "From the shores of retail to the vast seas of technology —
          a tale of courage, curiosity, and endless discovery."
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="#journey" className="px-8 py-3 bg-gold text-ocean-deep font-heading font-bold text-sm tracking-wider rounded hover:bg-ruby hover:text-white transition-all shadow-lg shadow-gold/20">
            🗺️ BEGIN THE VOYAGE
          </a>
          <a href="#quests" className="px-8 py-3 border-2 border-parchment/30 text-parchment font-heading font-bold text-sm tracking-wider rounded hover:border-gold hover:text-gold transition-all">
            VIEW TREASURE MAP
          </a>
        </div>

        {/* Scroll wave */}
        <div className="mt-16 animate-bounce text-gold/60 text-sm font-heading tracking-widest">
          ～～～ SCROLL TO EXPLORE ～～～
        </div>
      </div>
    </section>
  )
}

/* ───────── VOYAGE STATS (metrics as treasure counts) ───────── */

function TreasureStat({ icon, value, label, color }: { icon: string; value: string; label: string; color: string }) {
  const { ref, visible } = useInView()
  return (
    <div ref={ref}
      className={`parchment-card p-5 text-center transition-all duration-500 ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
      style={visible ? { animation: 'treasure-glow 3s ease-in-out infinite' } : {}}>
      <div className="text-3xl mb-2">{icon}</div>
      <div className={`font-map text-3xl ${color}`}>{value}</div>
      <div className="font-heading text-ink-brown/60 text-xs mt-1 uppercase tracking-wider">{label}</div>
    </div>
  )
}

function VoyageStats() {
  return (
    <section className="py-14 relative">
      <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <TreasureStat icon="📜" value="20+" label="Scrolls of Knowledge" color="text-ink-brown" />
        <TreasureStat icon="⛓️" value="3" label="Blockchain Realms" color="text-amethyst" />
        <TreasureStat icon="⚔️" value="13+" label="Quests Completed" color="text-ruby" />
        <TreasureStat icon="👑" value="22" label="Years of Command" color="text-gold" />
      </div>
    </section>
  )
}

/* ───────── JOURNEY (islands on the sea) ───────── */

const islands = [
  {
    name: 'Isle of Origin',
    year: '1996',
    desc: 'IT Technical Diploma at ITIS Blaise Pascal. The journey begins here — Turbo Pascal, Assembly, Prolog.',
    skills: ['Turbo Pascal', 'Assembly', 'Prolog'],
    color: 'from-emerald/20 to-land/40',
    icon: '🏝️',
    position: 'left',
  },
  {
    name: 'The Retail Dominion',
    year: '1999–2021',
    desc: '22 years ruling the retail kingdom. Forging leadership, resilience, and customer mastery.',
    skills: ['Leadership', 'Team Management', 'Customer Experience'],
    color: 'from-bronze/20 to-mountain/40',
    icon: '🏰',
    position: 'right',
  },
  {
    name: '🔥 The Great Crossing 🔥',
    year: '2021',
    desc: 'The most daring voyage of all — leaving everything behind to sail into the unknown. From retail to code.',
    skills: ['Courage', 'Reinvention', 'Determination'],
    color: 'from-ruby/30 to-ruby/10',
    icon: '⚓',
    position: 'center',
    highlight: true,
  },
  {
    name: 'Academy Archipelago',
    year: '2022–2024',
    desc: 'Full Stack Development training at Start2Impact. Acquiring the fundamental weapons.',
    skills: ['React', 'TypeScript', 'Node.js', 'MongoDB', 'Express'],
    color: 'from-sapphire/20 to-ocean-light/40',
    icon: '📚',
    position: 'left',
  },
  {
    name: 'Blockchain Depths',
    year: '2024',
    desc: 'Diving deep into the Web3 waters. Solana Bootcamp, ICP Protocol, EPICODE-Binance.',
    skills: ['Solidity', 'Solana', 'ICP', 'Ethers.js', 'Hardhat'],
    color: 'from-amethyst/20 to-amethyst/10',
    icon: '🔮',
    position: 'right',
  },
  {
    name: '⚡ Cloud Citadel ⚡',
    year: '2025',
    desc: 'Ascending to the cloud fortress. Docker, Kubernetes, OpenShift, Prometheus, OpenTelemetry.',
    skills: ['Docker', 'Kubernetes', 'OpenShift', 'CI/CD', 'Prometheus', 'Grafana'],
    color: 'from-ruby/20 to-ruby/10',
    icon: '☁️',
    position: 'center',
    highlight: true,
  },
  {
    name: '⭐ Agile Lab Harbor ⭐',
    year: '2025–Now',
    desc: 'Current port of call. Junior Application Maintenance — Kafka, monitoring, cloud infrastructure.',
    skills: ['Kafka', 'AWS', 'Azure', 'GCP', 'Linux', 'Observability'],
    color: 'from-gold/20 to-gold/10',
    icon: '🚢',
    position: 'right',
    highlight: true,
  },
  {
    name: 'IOTA Treasure Island',
    year: '2026',
    desc: 'GiftBlitz — decentralized gift card marketplace. 63 European teams. IOTA Foundation blog feature!',
    skills: ['IOTA', 'DeFi', 'Smart Contracts', 'Digital Identity'],
    color: 'from-gold/30 to-sand/20',
    icon: '🏆',
    position: 'left',
  },
]

function IslandCard({ island, index }: { island: typeof islands[0]; index: number }) {
  const { ref, visible } = useInView(0.2)
  const parallax = useParallax()

  const alignment = island.position === 'left' ? 'md:mr-auto md:ml-12'
    : island.position === 'right' ? 'md:ml-auto md:mr-12'
    : 'mx-auto'

  return (
    <div ref={ref}
      className={`max-w-lg ${alignment} mb-12 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{
        transitionDelay: `${index * 100}ms`,
        transform: visible ? `translateY(${(parallax - (index * 300)) * 0.02}px)` : undefined,
      }}>

      {/* Dotted sea path connector */}
      {index > 0 && <div className="dotted-path w-32 mx-auto mb-6" />}

      <div className={`parchment-card p-6 relative ${island.highlight ? 'border-gold' : ''}`}
        style={island.highlight ? { animation: 'treasure-glow 3s ease-in-out infinite' } : {}}>

        {/* Island icon */}
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-3xl" style={{ animation: 'float-island 4s ease-in-out infinite' }}>
          {island.icon}
        </div>

        <div className="flex items-center justify-between mt-4 mb-3">
          <span className="font-mono text-xs px-2 py-0.5 bg-ink-brown/10 text-ink-brown/70 border border-ink-brown/20 rounded-sm">{island.year}</span>
          {island.highlight && <span className="font-heading text-ruby text-[10px] font-bold animate-pulse">★ KEY STOP</span>}
        </div>

        <h3 className={`font-heading font-bold text-lg ${island.highlight ? 'text-ruby' : 'text-ink-brown'}`}>
          {island.name}
        </h3>
        <p className="text-ink-brown/70 mt-2 text-sm leading-relaxed">{island.desc}</p>

        <div className="flex flex-wrap gap-1.5 mt-4">
          {island.skills.map(s => (
            <span key={s} className="px-2.5 py-0.5 text-[11px] font-semibold bg-sand/50 text-ink-brown border border-sand-dark/40 rounded-sm">
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

function Journey() {
  const { ref, visible } = useInView()
  return (
    <section id="journey" className="py-24 relative">
      {/* Ocean decorations */}
      <div className="absolute left-4 top-1/4 text-4xl opacity-10 animate-pulse">🌊</div>
      <div className="absolute right-8 top-2/3 text-3xl opacity-10 animate-pulse" style={{ animationDelay: '1s' }}>🌊</div>

      <div className="max-w-4xl mx-auto px-6">
        <div ref={ref} className={`text-center mb-16 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="font-heading text-xs text-gold tracking-[0.3em] uppercase">The Great Voyage</span>
          <h2 className="font-map text-3xl md:text-5xl text-gold mt-4 tracking-wider" style={{ textShadow: '0 0 20px rgba(255,215,0,0.2)' }}>
            ISLANDS OF<br/>EXPERIENCE
          </h2>
          <p className="text-parchment/50 mt-4 italic text-lg">"Each island taught me something that made me a better sailor."</p>
        </div>

        {islands.map((island, i) => (
          <IslandCard key={i} island={island} index={i} />
        ))}
      </div>
    </section>
  )
}

/* ───────── ARSENAL (skills) ───────── */

const arsenalItems = [
  {
    category: 'DevOps & Cloud',
    rarity: '⚔️ Legendary Arsenal',
    color: 'text-ruby',
    borderColor: 'border-ruby',
    skills: ['Docker', 'Kubernetes', 'OpenShift', 'Jenkins', 'CI/CD', 'Linux', 'GCP', 'AWS', 'Azure'],
    highlight: true,
  },
  {
    category: 'Observability',
    rarity: '🛡️ Epic Gear',
    color: 'text-bronze',
    borderColor: 'border-bronze',
    skills: ['Prometheus', 'Grafana', 'OpenTelemetry', 'Jaeger', 'Kafka'],
    highlight: true,
  },
  {
    category: 'Web3 / Blockchain',
    rarity: '🔮 Mystic Artifacts',
    color: 'text-amethyst',
    borderColor: 'border-amethyst',
    skills: ['Solidity', 'Hardhat', 'Foundry', 'Ethers.js', 'IOTA', 'Solana', 'ICP', 'OpenZeppelin'],
  },
  {
    category: 'Frontend',
    rarity: '⚔️ Forged Weapons',
    color: 'text-sapphire',
    borderColor: 'border-sapphire',
    skills: ['React', 'TypeScript', 'Next.js', 'TailwindCSS', 'HTML5', 'CSS3'],
  },
  {
    category: 'Backend',
    rarity: '🔧 Trusted Tools',
    color: 'text-emerald',
    borderColor: 'border-emerald',
    skills: ['Node.js', 'Express', 'PHP', 'Laravel', 'MongoDB', 'PostgreSQL', 'SQL', 'Prisma', 'Postman'],
  },
  {
    category: 'AI & Data',
    rarity: '✨ New Discovery',
    color: 'text-sapphire',
    borderColor: 'border-sapphire',
    skills: ['Python', 'AI Avanzata', 'Data Analysis'],
  },
]

function ArsenalCard({ item, index }: { item: typeof arsenalItems[0]; index: number }) {
  const { ref, visible } = useInView()
  return (
    <div ref={ref}
      className={`parchment-card p-5 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${item.highlight ? 'border-gold' : ''}`}
      style={{ transitionDelay: `${index * 100}ms` }}>
      <div className="flex items-center gap-2 mb-3">
        <span className={`font-heading text-xs font-bold ${item.color}`}>{item.rarity}</span>
      </div>
      <h3 className={`font-heading font-bold text-base ${item.color}`}>{item.category}</h3>

      <div className="flex flex-wrap gap-1.5 mt-3">
        {item.skills.map(s => (
          <span key={s} className="px-2.5 py-1 text-[11px] font-semibold bg-sand/50 text-ink-brown border border-sand-dark/50 rounded-sm hover:bg-gold/20 hover:border-gold/50 transition-colors cursor-default">
            {s}
          </span>
        ))}
      </div>
    </div>
  )
}

function Arsenal() {
  const { ref, visible } = useInView()
  return (
    <section id="arsenal" className="py-24 relative">
      <div className="max-w-6xl mx-auto px-6">
        <div ref={ref} className={`text-center mb-16 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="font-heading text-xs text-gold tracking-[0.3em] uppercase">Weapons & Tools</span>
          <h2 className="font-map text-3xl md:text-5xl text-gold mt-4 tracking-wider" style={{ textShadow: '0 0 20px rgba(255,215,0,0.2)' }}>
            THE ARSENAL
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {arsenalItems.map((item, i) => (
            <ArsenalCard key={i} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ───────── QUESTS (projects as treasure map quests) ───────── */

const questList = [
  {
    name: 'GiftBlitz',
    quest: 'The IOTA Expedition',
    status: '🔴 IN PROGRESS',
    desc: 'Decentralized gift card marketplace built on IOTA. 63 European teams. Featured on the IOTA Foundation blog.',
    tech: ['IOTA', 'Smart Contracts', 'Web3', 'Digital Identity'],
    live: 'https://gift-blitz-full.vercel.app/',
    blog: 'https://blog.iota.org/build-now-masterz-hackathon/',
    featured: true,
    treasureIcon: '💎',
  },
  {
    name: 'LinkedShield',
    quest: 'The Guardian\'s Shield',
    status: '🟢 COMPLETE',
    desc: 'Anti-scam app protecting LinkedIn users. OAuth2, real-time threat detection.',
    tech: ['Node.js', 'TypeScript', 'MongoDB', 'Tailwind v4'],
    live: 'https://www.linkedshield.eu/',
    github: 'https://github.com/boobaGreen/linkedinScammers',
    featured: true,
    treasureIcon: '🛡️',
  },
  {
    name: 'Smart 360',
    quest: 'The Merchant\'s Hall',
    status: '🟢 COMPLETE',
    desc: 'Full website for a moving company. Design, implementation, deployment.',
    tech: ['React', 'Full Stack', 'SEO'],
    live: 'https://www.grouptraslochismart360.it/',
    github: 'https://github.com/boobaGreen/smart360',
    treasureIcon: '🏠',
  },
  {
    name: 'StudyBuddyHub',
    quest: 'The Scholar\'s Tower',
    status: '🟢 COMPLETE',
    desc: 'Full-featured SPA for student coaching. RESTful APIs, auth, user management.',
    tech: ['MongoDB', 'Express', 'React', 'Node.js'],
    live: 'https://studybuddyhub.netlify.app/cover',
    github: 'https://github.com/boobaGreen/S2I-STUDY_BUDDY_HUB_4COACH',
    treasureIcon: '📖',
  },
  {
    name: 'Randomizer',
    quest: 'The Oracle\'s Portal',
    status: '🟢 COMPLETE',
    desc: 'Deployed on Internet Computer Protocol using Azle and DFINITY CLI.',
    tech: ['ICP', 'Azle', 'TypeScript', 'Blockchain'],
    live: 'https://kwjpy-liaaa-aaaap-ahaea-cai.raw.icp0.io/',
    github: 'https://github.com/boobaGreen/randomizer',
    treasureIcon: '🔮',
  },
]

function QuestCard({ quest, index }: { quest: typeof questList[0]; index: number }) {
  const { ref, visible } = useInView()
  return (
    <div ref={ref}
      className={`parchment-card p-6 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
        ${quest.featured ? 'md:col-span-2 border-gold' : ''}`}
      style={{ transitionDelay: `${index * 100}ms` }}>

      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl">{quest.treasureIcon}</span>
        <div>
          <span className="font-heading text-ink-brown/50 text-xs">{quest.quest}</span>
          <span className="ml-3 text-xs">{quest.status}</span>
        </div>
        {quest.featured && <span className="ml-auto font-heading text-ruby text-xs font-bold">★ LEGENDARY</span>}
      </div>

      <h3 className="font-heading font-bold text-xl text-ink-brown">{quest.name}</h3>
      <p className="text-ink-brown/70 mt-2 text-sm leading-relaxed">{quest.desc}</p>

      <div className="flex flex-wrap gap-1.5 mt-4">
        {quest.tech.map(t => (
          <span key={t} className="px-2 py-0.5 text-[11px] font-semibold bg-sand/50 text-ink-brown border border-sand-dark/40 rounded-sm">
            {t}
          </span>
        ))}
      </div>

      <div className="flex gap-3 mt-5">
        {quest.live && (
          <a href={quest.live} target="_blank" rel="noopener noreferrer"
            className="px-4 py-2 bg-gold text-ocean-deep font-heading font-bold text-xs tracking-wider rounded hover:bg-ruby hover:text-white transition-all">
            EXPLORE ↗
          </a>
        )}
        {quest.github && (
          <a href={quest.github} target="_blank" rel="noopener noreferrer"
            className="px-4 py-2 border border-ink-brown/30 text-ink-brown/70 font-heading font-bold text-xs tracking-wider rounded hover:border-gold hover:text-gold transition-all">
            SOURCE ↗
          </a>
        )}
        {quest.blog && (
          <a href={quest.blog} target="_blank" rel="noopener noreferrer"
            className="px-4 py-2 border border-ruby/30 text-ruby font-heading font-bold text-xs tracking-wider rounded hover:bg-ruby/10 transition-all">
            IOTA BLOG ↗
          </a>
        )}
      </div>
    </div>
  )
}

function Quests() {
  const { ref, visible } = useInView()
  return (
    <section id="quests" className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div ref={ref} className={`text-center mb-16 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="font-heading text-xs text-gold tracking-[0.3em] uppercase">Treasure Map</span>
          <h2 className="font-map text-3xl md:text-5xl text-gold mt-4 tracking-wider" style={{ textShadow: '0 0 20px rgba(255,215,0,0.2)' }}>
            LEGENDARY<br/>QUESTS
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {questList.map((q, i) => (
            <QuestCard key={i} quest={q} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ───────── SCROLLS OF KNOWLEDGE (certifications) ───────── */

const scrollSets = [
  {
    realm: 'DevOps & Cloud',
    icon: '⚙️',
    color: 'text-ruby',
    scrolls: [
      { name: 'Docker Per Comuni Mortali', from: 'Udemy', date: 'Jan 2026' },
      { name: 'OpenShift for Beginners', from: 'Udemy', date: 'Dec 2025' },
      { name: 'Prometheus Monitoring', from: 'Udemy', date: 'Sep 2025' },
      { name: 'OpenTelemetry Foundations', from: 'Udemy', date: 'Sep 2025' },
      { name: 'Linux LPI Essentials', from: 'Udemy', date: 'Apr 2025' },
      { name: 'Google Cloud Fundamentals', from: 'Coursera', date: 'Jan 2025' },
    ]
  },
  {
    realm: 'Web3 / Blockchain',
    icon: '🔮',
    color: 'text-amethyst',
    scrolls: [
      { name: 'IOTA Hackathon', from: 'MasterZ / IOTA', date: '2026' },
      { name: 'Binance Scholarship', from: 'EPICODE', date: 'Mar 2025' },
      { name: 'Solana Bootcamp', from: 'MasterZ', date: '2024' },
      { name: 'ICP — Azle', from: 'ICP Hub', date: 'Mar 2024' },
      { name: 'Blockchain Dev Master', from: 'Start2Impact', date: '2024+' },
    ]
  },
  {
    realm: 'Full Stack & AI',
    icon: '📚',
    color: 'text-sapphire',
    scrolls: [
      { name: 'AI Avanzata', from: 'Profession AI', date: 'Sep 2025' },
      { name: 'Python Programming', from: 'Profession AI', date: 'Sep 2025' },
      { name: 'Full Stack Dev Master', from: 'Start2Impact', date: '2022-2024' },
    ]
  },
]

function ScrollSet({ set, index }: { set: typeof scrollSets[0]; index: number }) {
  const { ref, visible } = useInView()
  return (
    <div ref={ref}
      className={`parchment-card p-6 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ transitionDelay: `${index * 150}ms` }}>
      <div className="flex items-center gap-3 mb-4">
        <span className="text-xl">{set.icon}</span>
        <h3 className={`font-heading font-bold text-base ${set.color}`}>{set.realm}</h3>
        <span className="ml-auto font-mono text-xs text-ink-brown/50">{set.scrolls.length} scrolls</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {set.scrolls.map((scroll, i) => (
          <div key={i} className="flex items-start gap-2 px-3 py-2 bg-sand/30 rounded-sm border border-sand-dark/20 hover:bg-sand/50 transition-colors">
            <span className="text-sm mt-0.5">📜</span>
            <div>
              <div className="text-sm font-semibold text-ink-brown">{scroll.name}</div>
              <div className="text-xs text-ink-brown/50">{scroll.from} · {scroll.date}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Scrolls() {
  const { ref, visible } = useInView()
  return (
    <section id="scrolls" className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div ref={ref} className={`text-center mb-16 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="font-heading text-xs text-gold tracking-[0.3em] uppercase">Ancient Library</span>
          <h2 className="font-map text-3xl md:text-5xl text-gold mt-4 tracking-wider" style={{ textShadow: '0 0 20px rgba(255,215,0,0.2)' }}>
            SCROLLS OF<br/>KNOWLEDGE
          </h2>
          <p className="text-parchment/50 mt-4 italic">"A wise sailor collects knowledge at every port."</p>
        </div>

        <div className="space-y-6">
          {scrollSets.map((set, i) => (
            <ScrollSet key={i} set={set} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ───────── FORTRESS (contact) ───────── */

function Fortress() {
  const { ref, visible } = useInView()
  return (
    <section id="fortress" className="py-24 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[400px] h-[400px] bg-gold/5 rounded-full blur-[150px]" />
      </div>

      <div ref={ref} className={`relative z-10 max-w-3xl mx-auto px-6 text-center transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="parchment-card p-8 md:p-12" style={{ animation: 'treasure-glow 3s ease-in-out infinite' }}>
          <span className="text-4xl">🏰</span>

          <h2 className="font-map text-3xl md:text-4xl text-ink-brown mt-4 tracking-wider">
            OPEN<br/>FOR ALLIANCE
          </h2>

          <p className="text-ink-brown/70 mt-6 text-lg italic max-w-xl mx-auto">
            "Every great expedition needs allies. If you seek a sailor with
            <strong className="text-ruby"> unwavering curiosity</strong>,
            <strong className="text-gold"> 22 years of leadership</strong>, and
            <strong className="text-emerald"> multi-realm expertise</strong> — let us chart a course together."
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="https://www.linkedin.com/in/claudio-dall-ara-730aa0302/"
              target="_blank" rel="noopener noreferrer"
              className="px-8 py-3.5 bg-gold text-ocean-deep font-heading font-bold text-sm tracking-wider rounded hover:bg-ruby hover:text-white transition-all shadow-lg shadow-gold/20 flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              LINKEDIN
            </a>
            <a href="https://github.com/boobaGreen"
              target="_blank" rel="noopener noreferrer"
              className="px-8 py-3.5 border-2 border-ink-brown/30 text-ink-brown font-heading font-bold text-sm tracking-wider rounded hover:border-gold hover:text-gold hover:bg-gold/5 transition-all flex items-center gap-2">
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
    <footer className="py-6 border-t border-gold/10 text-center">
      <p className="font-heading text-parchment/30 text-xs tracking-wider">
        ⚓ CHARTED BY CLAUDIO DALL'ARA · MMXXVI ⚓
      </p>
      <p className="font-mono text-parchment/15 text-[10px] mt-1">
        React + TypeScript + Tailwind v4 · Adventure Map Edition
      </p>
    </footer>
  )
}

/* ───────── APP ───────── */

function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <VoyageStats />
      <Journey />
      <Arsenal />
      <Quests />
      <Scrolls />
      <Fortress />
      <Footer />
    </div>
  )
}

export default App
