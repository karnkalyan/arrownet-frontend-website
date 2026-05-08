import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Zap, Shield, Clock, Star, ArrowRight,
  Globe, Cpu, Server, Network, Lock,
  Gauge, Cloud, Layers, Activity, TrendingUp,
  CheckCircle, Play, Terminal, Database, ArrowUpRight, Home as HomeIcon,
  ChevronDown, Phone, Mail, Send, Award, Users, Headphones, Building2, Landmark, BookOpen, Tag, User,
  Wifi, MessageCircle, Music, Search, Camera
} from 'lucide-react';
import { useStore } from '../store/useStore';
import {
  FaGoogle, FaYoutube, FaTiktok, FaWhatsapp, FaViber,
  FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter
} from 'react-icons/fa6';
import ParticleNetwork from '../components/shared/ParticleNetwork';
import NetworkBackground from '../components/shared/NetworkBackground';
import FloatingElements from '../components/shared/FloatingElements';
import FiberCable from '../components/shared/FiberCable';
import toast from 'react-hot-toast';

gsap.registerPlugin(ScrollTrigger);

// ─── LIVE NODE GRID ────────────────────────────────────────────────
function LiveNodeGrid() {
  const [nodes, setNodes] = useState(() =>
    Array.from({ length: 24 }, (_, i) => ({
      id: i,
      active: Math.random() > 0.2,
      pulse: Math.random() > 0.55,
      load: 20 + Math.floor(Math.random() * 75),
    }))
  );

  useEffect(() => {
    const iv = setInterval(() => {
      setNodes(prev =>
        prev.map(n => ({
          ...n,
          active: Math.random() > 0.12,
          pulse: Math.random() > 0.48,
          load: Math.max(15, Math.min(98, n.load + (Math.random() - 0.5) * 18)),
        }))
      );
    }, 1900);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="grid grid-cols-6 gap-2.5">
      {nodes.map(node => (
        <div key={node.id} className="relative group">
          <motion.div
            animate={{
              backgroundColor: node.active
                ? node.pulse ? ['#16a34a', '#22c55e', '#16a34a'] : '#16a34a'
                : '#e2e8f0',
              boxShadow: node.active && node.pulse
                ? ['0 0 0px transparent', '0 0 14px rgba(34,197,94,0.5)', '0 0 0px transparent']
                : '0 0 0px transparent',
            }}
            transition={{ duration: 1.8, repeat: node.pulse ? Infinity : 0 }}
            className="h-9 rounded-xl border relative overflow-hidden cursor-default"
            style={{ borderColor: node.active ? 'rgba(34,197,94,0.3)' : '#e2e8f0' }}
          >
            <div
              className="absolute bottom-0 left-0 right-0 transition-all duration-[1200ms]"
              style={{
                height: `${node.load}%`,
                background: node.active ? 'rgba(255,255,255,0.20)' : 'rgba(0,0,0,0.04)',
              }}
            />
            <div
              className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
              style={{ background: node.active ? '#fff' : '#94a3b8' }}
            />
          </motion.div>
          <div className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 bg-slate-900 text-green-400 text-[9px] font-mono px-2 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-20">
            N{String(node.id).padStart(2, '0')} · {Math.round(node.load)}%
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── LIVE TERMINAL ────────────────────────────────────────────────
function LiveTerminal() {
  const lines = [
    { t: '> Fiber uplink established ✓', c: 'text-green-600' },
    { t: '> BGP sessions: 6/6 ACTIVE', c: 'text-blue-600' },
    { t: '> Round-trip latency: 0.8ms', c: 'text-green-600' },
    { t: '> DDoS shield: ENGAGED (L3+L4)', c: 'text-amber-600' },
    { t: '> Bandwidth headroom: 94.2%', c: 'text-green-600' },
    { t: '> All 24 nodes ONLINE ●', c: 'text-emerald-600' },
  ];
  return (
    <div className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50/80 font-mono text-xs">
      <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-slate-200 bg-white">
        <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
        <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
        <span className="ml-2 text-slate-400 text-[10px]">network-monitor</span>
      </div>
      <div className="p-4 space-y-1.5">
        {lines.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.45, duration: 0.35 }}
            className={`${line.c} leading-relaxed`}
          >
            {line.t}
          </motion.div>
        ))}
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="inline-block text-slate-400"
        >▌</motion.span>
      </div>
    </div>
  );
}

// ─── HERO ANIMATION (SERVER, ONT, FTTH) ──────────────────────────
function HeroAnimation() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <div ref={containerRef} className="relative w-full aspect-square max-w-[600px] mx-auto flex items-center justify-center overflow-visible">
      {/* Background Glows */}
      <div className="absolute inset-0 z-0">
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.35, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160%] h-[160%] bg-gradient-to-tr from-primary/40 via-transparent to-blue-500/20 blur-[140px] rounded-full"
        />
      </div>

      <div className="relative z-10 w-full h-full flex items-center justify-center">
        {/* Connection Paths with Flowing Particles */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 400">
          <defs>
            <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="50%" stopColor="var(--primary)" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>

          {/* Dynamic Data Flows */}
          {[
            "M 60 100 Q 200 100 200 200",
            "M 340 100 Q 200 100 200 200",
            "M 60 300 Q 200 300 200 200",
            "M 340 300 Q 200 300 200 200"
          ].map((path, i) => (
            <React.Fragment key={i}>
              <motion.path
                d={path}
                fill="none"
                stroke="rgba(227,6,19,0.1)"
                strokeWidth="2.5"
                strokeDasharray="5 5"
              />
              <motion.circle
                r="4"
                fill="var(--primary)"
                initial={{ offsetDistance: "0%" }}
                animate={{ offsetDistance: "100%" }}
                transition={{
                  duration: 4 + i,
                  repeat: Infinity,
                  ease: "linear",
                  delay: i * 0.5
                }}
                style={{
                  offsetPath: `path('${path}')`,
                  filter: 'drop-shadow(0 0 8px var(--primary))'
                }}
              />
            </React.Fragment>
          ))}
        </svg>

        {/* Social Icons Orbit */}
        {[
          { icon: <FaGoogle size={48} />, color: '#4285F4', radius: 180, speed: 25, delay: 0, yMotion: y1 },
          { icon: <FaYoutube size={48} />, color: '#FF0000', radius: 180, speed: 25, delay: 8.33, yMotion: y2 },
          { icon: <FaTiktok size={48} />, color: '#000000', radius: 180, speed: 25, delay: 16.66, yMotion: y3 },

          { icon: <FaWhatsapp size={48} />, color: '#25D366', radius: 270, speed: 35, delay: 4, yMotion: y1 },
          { icon: <FaViber size={48} />, color: '#7360f2', radius: 270, speed: 35, delay: 15.66, yMotion: y2 },
          { icon: <FaFacebookF size={48} />, color: '#1877F2', radius: 270, speed: 35, delay: 27.33, yMotion: y3 },

          { icon: <FaInstagram size={48} />, color: '#E4405F', radius: 360, speed: 45, delay: 10, yMotion: y1 },
          { icon: <FaLinkedinIn size={48} />, color: '#0077B5', radius: 360, speed: 45, delay: 25, yMotion: y2 },
          { icon: <FaXTwitter size={48} />, color: '#000000', radius: 360, speed: 45, delay: 40, yMotion: y3 },
        ].map((s, i) => (
          <motion.div
            key={i}
            animate={{ rotate: 360 }}
            transition={{ duration: s.speed, repeat: Infinity, ease: "linear", delay: -s.delay }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ width: s.radius * 2, height: s.radius * 2 }}
          >
            <motion.div
              animate={{
                rotate: -360,
                y: [0, -18, 0]
              }}
              style={{ y: s.yMotion }}
              transition={{
                rotate: { duration: s.speed, repeat: Infinity, ease: "linear", delay: -s.delay },
                y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: i * 0.9 }
              }}
              className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-[32px] bg-white shadow-2xl flex items-center justify-center border border-slate-100 cursor-pointer hover:scale-110 transition-all p-5"
              style={{ color: s.color }}
            >
              {s.icon}
            </motion.div>
          </motion.div>
        ))}

        {/* Central Arrownet Label */}
        <div className="relative z-10 flex flex-col items-center">
          <motion.div
            animate={{ scale: [0.98, 1.02, 0.98] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="w-56 md:w-64 h-auto"
          >
            <img src="/arrownet.png" alt="Arrownet" className="w-full h-auto object-contain" />
          </motion.div>
          <div className="w-28 h-2 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full mt-8 opacity-60" />
        </div>
      </div>
    </div>
  );
}

// ─── ANIMATED CARD ────────────────────────────────────────────────
function AnimatedCard({ children, index, className = '' }: { children: React.ReactNode; index: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.12 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 44 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay: index * 0.09, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── STAT CARD ───────────────────────────────────────────────────
function StatCard({ value, label, suffix = '', delay = 0 }: { value: number; label: string; suffix?: string; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => {
      const dur = 1800;
      const s = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - s) / dur, 1);
        const e = 1 - Math.pow(2, -10 * p);
        setCount(Math.floor(e * value));
        if (p < 1) requestAnimationFrame(tick); else setCount(value);
      };
      requestAnimationFrame(tick);
    }, delay * 1000);
    return () => clearTimeout(t);
  }, [inView, value, delay]);

  return (
    <div ref={ref} className="text-center group py-4">
      <div className="text-5xl md:text-[3.5rem] font-black text-slate-900 mb-2 tracking-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
        {count}{suffix}
      </div>
      <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400 group-hover:text-primary transition-colors duration-300">{label}</div>
    </div>
  );
}

// ─── CORE TECH DATA ───────────────────────────────────────────────
const coreTechData = [
  { icon: <Server size={24} />, title: 'Fiber-to-the-Home', desc: 'Pure fiber to your premises — symmetric gigabit speeds, zero EMI, zero copper bottlenecks.', stats: [{ label: 'Max Speed', value: '1 Gbps' }, { label: 'Latency', value: '<2ms' }], accent: '#E30613' },
  { icon: <Network size={24} />, title: 'GPON Architecture', desc: 'Gigabit Passive Optical Network — efficient bandwidth distribution with no active field electronics.', stats: [{ label: 'Split Ratio', value: '1:64' }, { label: 'Range', value: '20km' }], accent: '#3b82f6' },
  { icon: <Lock size={24} />, title: 'Layer-3 Security', desc: 'Hardware-level DPI, real-time DDoS mitigation, and AES-256 tunneling on every packet.', stats: [{ label: 'Protection', value: 'DDoS' }, { label: 'Encryption', value: 'AES-256' }], accent: '#a855f7' },
  { icon: <Cloud size={24} />, title: 'Multi-Homed Peering', desc: 'Six upstream carriers plus direct CDN peering for maximum route diversity and resilience.', stats: [{ label: 'Upstreams', value: '6+' }, { label: 'CDN Peering', value: 'Direct' }], accent: '#22c55e' },
  { icon: <Gauge size={24} />, title: 'QoS Traffic Shaping', desc: 'Four-tier traffic prioritization for video, gaming, and streaming even at peak congestion.', stats: [{ label: 'Priority', value: '4 Tiers' }, { label: 'VoIP Jitter', value: '<1ms' }], accent: '#ef4444' },
  { icon: <Layers size={24} />, title: 'IPv6 Dual-Stack', desc: 'Native IPv6 alongside IPv4 — future-proof for next-gen devices and full IoT ecosystems.', stats: [{ label: 'Protocol', value: 'Dual Stack' }, { label: 'Ready', value: 'IoT' }], accent: '#eab308' },
];

// ═══════════════════════════════════════════════════════════════════
// FTTH ANIMATION COMPONENT
// ═══════════════════════════════════════════════════════════════════
function FTTHAnimation() {
  return (
    <div className="relative w-full aspect-square md:aspect-video lg:aspect-square bg-white rounded-[40px] overflow-hidden shadow-2xl shadow-orange-100 flex items-center justify-center border border-slate-100">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle, #E30613 1px, transparent 1px)',
        backgroundSize: '24px 24px'
      }} />

      {/* Connector Path */}
      <svg className="absolute w-full h-full pointer-events-none" viewBox="0 0 600 600">
        <motion.path
          d="M 150 300 Q 300 150 450 300"
          fill="none"
          stroke="rgba(249, 115, 22, 0.1)"
          strokeWidth="6"
          strokeDasharray="12 12"
        />
        <motion.path
          d="M 150 300 Q 300 150 450 300"
          fill="none"
          stroke="#E30613"
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />

        {/* Particles */}
        {[...Array(6)].map((_, i) => (
          <motion.circle
            key={i}
            r="4"
            fill="#E30613"
            initial={{ offsetDistance: "0%" }}
            animate={{ offsetDistance: "100%" }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "linear",
              delay: i * 0.4
            }}
            style={{
              offsetPath: "path('M 150 300 Q 300 150 450 300')",
              filter: 'drop-shadow(0 0 8px #E30613)'
            }}
          />
        ))}
      </svg>

      {/* Floating Icons */}
      <div className="relative z-10 flex items-center justify-between w-full px-12 md:px-20">
        {/* Server (Arrownet Core) */}
        <motion.div
          animate={{ y: [-15, 15, -15] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-5"
        >
          <div className="w-16 h-16 md:w-24 md:h-24 rounded-[32px] bg-primary flex items-center justify-center text-white shadow-2xl shadow-primary/30 ring-8 ring-orange-50">
            <Server size={32} />
          </div>
          <div className="text-center">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Core Network</span>
            <div className="text-xs md:text-sm font-black text-slate-900 uppercase tracking-tight">Arrownet NOC</div>
          </div>
        </motion.div>

        {/* Home (Customer) */}
        <motion.div
          animate={{ y: [15, -15, 15] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="flex flex-col items-center gap-5"
        >
          <div className="w-16 h-16 md:w-24 md:h-24 rounded-[32px] bg-blue-500 flex items-center justify-center text-white shadow-2xl shadow-blue-500/30 ring-8 ring-blue-50">
            <HomeIcon size={32} />
          </div>
          <div className="text-center">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Smart Living</span>
            <div className="text-xs md:text-sm font-black text-slate-900 uppercase tracking-tight">Customer Premise</div>
          </div>
        </motion.div>
      </div>

      {/* Speed Metrics Floating */}
      <div className="absolute top-12 inset-x-0 flex justify-center gap-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="px-6 py-3 bg-white/80 backdrop-blur-md rounded-2xl border border-slate-100 shadow-lg text-center"
        >
          <div className="text-2xl font-black text-slate-900" style={{ fontFamily: 'Poppins' }}>0.8<span className="text-xs ml-1 opacity-50">ms</span></div>
          <div className="text-[8px] font-black uppercase tracking-widest text-primary">Latency</div>
        </motion.div>
      </div>

      <div className="absolute bottom-12 inset-x-0 flex justify-center gap-6 md:gap-12">
        <div className="text-center">
          <div className="text-2xl md:text-3xl font-black text-slate-900" style={{ fontFamily: 'Poppins' }}>987<span className="text-sm opacity-50">Mbps</span></div>
          <div className="text-[8px] font-black uppercase tracking-widest text-primary">Downstream</div>
        </div>
        <div className="w-px h-10 bg-slate-100 self-center" />
        <div className="text-center">
          <div className="text-2xl md:text-3xl font-black text-slate-900" style={{ fontFamily: 'Poppins' }}>981<span className="text-sm opacity-50">Mbps</span></div>
          <div className="text-[8px] font-black uppercase tracking-widest text-blue-500">Upstream</div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// WAVING LINES COMPONENT
// ═══════════════════════════════════════════════════════════════════
function WavingLines() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
      <svg className="w-full h-full" viewBox="0 0 1440 600">
        {[...Array(5)].map((_, i) => (
          <motion.path
            key={i}
            d={`M 0 ${150 + i * 80} Q 360 ${50 + i * 40} 720 ${150 + i * 80} T 1440 ${150 + i * 80}`}
            fill="none"
            stroke={i % 2 === 0 ? "#E30613" : "#ef4444"}
            strokeWidth="0.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: 1,
              opacity: [0.1, 0.4, 0.1],
              d: [
                `M 0 ${150 + i * 80} Q 360 ${50 + i * 40} 720 ${150 + i * 80} T 1440 ${150 + i * 80}`,
                `M 0 ${150 + i * 80} Q 360 ${250 + i * 40} 720 ${150 + i * 80} T 1440 ${150 + i * 80}`,
                `M 0 ${150 + i * 80} Q 360 ${50 + i * 40} 720 ${150 + i * 80} T 1440 ${150 + i * 80}`
              ]
            }}
            transition={{
              duration: 10 + i * 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </svg>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════

// ─── TESTIMONIALS CAROUSEL ────────────────────────────────────────
function TestimonialsSection() {
  const { testimonials } = useStore();
  const [activeIdx, setActiveIdx] = useState(0);
  const len = testimonials.length;

  useEffect(() => {
    if (len <= 1) return;
    const timer = setInterval(() => {
      setActiveIdx(prev => (prev + 1) % len);
    }, 4000);
    return () => clearInterval(timer);
  }, [len]);

  const getVisible = () => {
    if (len === 0) return [];
    if (len === 1) return [{ item: testimonials[0], pos: 'center' as const }];
    if (len === 2) return [
      { item: testimonials[activeIdx], pos: 'center' as const },
      { item: testimonials[(activeIdx + 1) % len], pos: 'right' as const },
    ];
    return [
      { item: testimonials[(activeIdx - 1 + len) % len], pos: 'left' as const },
      { item: testimonials[activeIdx], pos: 'center' as const },
      { item: testimonials[(activeIdx + 1) % len], pos: 'right' as const },
    ];
  };

  return (
    <section className="section-premium bg-slate-50/50 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/8 border border-primary/15 text-[10px] font-black uppercase tracking-widest text-primary mb-6">
            <Star size={14} className="fill-primary" /> Client Stories
          </div>
          <h2 className="text-fluid-h2 font-black text-slate-900 mb-4" style={{ fontFamily: 'Poppins' }}>Trusted by <span className="text-primary">Leaders.</span></h2>
          <p className="text-lg text-slate-500 font-medium">What our corporate and government clients say about us.</p>
        </div>

        <div className="flex items-stretch justify-center gap-5 md:gap-8 max-w-6xl mx-auto px-4 relative min-h-[350px]">
          <AnimatePresence mode="popLayout">
            {getVisible().map(({ item: t, pos }) => {
              const isCenter = pos === 'center';
              return (
                <motion.div
                  key={t.id}
                  layout="position"
                  initial={{ opacity: 0, scale: 0.8, x: pos === 'right' ? 50 : pos === 'left' ? -50 : 0 }}
                  animate={{
                    opacity: isCenter ? 1 : 0.5,
                    scale: isCenter ? 1 : 0.9,
                    y: isCenter ? 0 : 15,
                    x: 0,
                    zIndex: isCenter ? 10 : 0,
                  }}
                  exit={{ opacity: 0, scale: 0.8, x: pos === 'left' ? -50 : 50, transition: { duration: 0.4, ease: 'easeOut' } }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className={`rounded-3xl border relative overflow-hidden transition-colors duration-500 origin-center ${isCenter
                    ? 'bg-white border-primary/30 shadow-2xl shadow-primary/10 flex-[1.5] min-w-0 p-9 z-10'
                    : 'bg-white/80 border-slate-100 shadow-sm flex-1 min-w-0 p-7 hidden md:block'
                    }`}
                >
                  {isCenter && <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-secondary to-accent" />}
                  <div className="flex gap-0.5 mb-5">
                    {[1, 2, 3, 4, 5].map(r => (
                      <Star key={r} size={isCenter ? 16 : 13} className={r <= t.rating ? 'text-accent fill-accent' : 'text-slate-200'} />
                    ))}
                  </div>
                  <p className={`text-slate-600 font-medium leading-relaxed italic ${isCenter ? 'text-base mb-8' : 'text-sm mb-5 line-clamp-3'}`}>
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className={`flex items-center gap-4 border-t border-slate-100 ${isCenter ? 'pt-6' : 'pt-4'}`}>
                    <div
                      className={`rounded-xl flex items-center justify-center text-white font-black ${isCenter ? 'w-12 h-12 text-lg' : 'w-10 h-10 text-sm'
                        } ${t.type === 'corporate' ? 'bg-primary' : 'bg-secondary'}`}
                      style={{ fontFamily: 'Poppins' }}
                    >
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <div className={`font-bold text-slate-900 ${isCenter ? 'text-sm' : 'text-xs'}`}>{t.name}</div>
                      <div className={`text-slate-400 ${isCenter ? 'text-xs' : 'text-[10px]'}`}>{t.designation}, {t.company}</div>
                    </div>
                    {isCenter && (
                      <div className="ml-auto">
                        {t.type === 'corporate' ? <Building2 size={16} className="text-primary/30" /> : <Landmark size={16} className="text-secondary/30" />}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Carousel Dots */}
        <div className="flex items-center justify-center gap-2 mt-10">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              className={`rounded-full transition-all duration-300 ${i === activeIdx ? 'w-8 h-2.5 bg-primary' : 'w-2.5 h-2.5 bg-slate-200 hover:bg-slate-300'
                }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FAQ SECTION ──────────────────────────────────────────────────
function FAQSection() {
  const { faqs } = useStore();
  const [openId, setOpenId] = useState<number | null>(null);
  return (
    <section className="section-premium bg-white">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/15 border border-accent/25 text-[10px] font-black uppercase tracking-widest text-yellow-700 mb-6">
            <CheckCircle size={14} /> Common Questions
          </div>
          <h2 className="text-fluid-h2 font-black text-slate-900 mb-4" style={{ fontFamily: 'Poppins' }}>Frequently Asked <span className="text-primary">Questions</span></h2>
        </div>
        <div className="space-y-4">
          {faqs.slice(0, 8).map((faq, i) => (
            <motion.div key={faq.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className={`rounded-2xl border transition-all duration-300 overflow-hidden ${openId === faq.id ? 'border-primary/20 bg-red-50/20 shadow-lg' : 'border-slate-100 bg-white shadow-sm'}`}>
              <button onClick={() => setOpenId(openId === faq.id ? null : faq.id)} className="w-full flex items-center justify-between p-6 text-left">
                <span className="text-base font-bold text-slate-900 pr-4">{faq.question}</span>
                <ChevronDown size={20} className={`text-slate-400 flex-shrink-0 transition-transform duration-300 ${openId === faq.id ? 'rotate-180 text-primary' : ''}`} />
              </button>
              {openId === faq.id && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="px-6 pb-6">
                  <p className="text-sm text-slate-500 font-medium leading-relaxed border-t border-slate-100 pt-4">{faq.answer}</p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── GET IN TOUCH SECTION ─────────────────────────────────────────
function GetInTouchSection() {
  const { submitLead } = useStore();
  const [form, setForm] = useState({ name: '', phone: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) return;

    setLoading(true);
    const ok = await submitLead(form);
    setLoading(false);

    if (ok) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setForm({ name: '', phone: '', email: '' });
      }, 4000);
    } else {
      toast.error('Transmission failed. Please try again or call us.');
    }
  };
  return (
    <section className="section-premium bg-gradient-to-br from-slate-900 via-slate-900 to-purple-950 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-accent mb-8">
              <Phone size={14} /> Get in Touch
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6" style={{ fontFamily: 'Poppins' }}>Let's Get You <span className="text-accent italic">Connected.</span></h2>
            <p className="text-lg text-slate-400 font-medium leading-relaxed mb-10">Leave your details and our team will get back to you within 24 hours with the perfect internet plan for your needs.</p>
            <div className="space-y-5">
              <a href="tel:+97715971333" className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-slate-900 transition-all"><Phone size={20} /></div>
                <div><div className="text-xs text-slate-500 font-bold uppercase tracking-widest">Call</div><div className="text-white font-bold">+977 1 5971333</div></div>
              </a>
              <a href="mailto:info@arrownet.com.np" className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-all"><Mail size={20} /></div>
                <div><div className="text-xs text-slate-500 font-bold uppercase tracking-widest">Email</div><div className="text-white font-bold">info@arrownet.com.np</div></div>
              </a>
            </div>
          </div>
          <div>
            {submitted ? (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-12 text-center">
                <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 mx-auto mb-6"><CheckCircle size={40} /></div>
                <h3 className="text-2xl font-black text-white mb-3" style={{ fontFamily: 'Poppins' }}>Request Received!</h3>
                <p className="text-slate-400 font-medium">Our team will contact you within 24 hours.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-10 space-y-5">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Full Name</label>
                  <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-white placeholder-slate-500 focus:border-accent focus:outline-none transition-colors" placeholder="Your full name" required />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Phone Number</label>
                    <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-white placeholder-slate-500 focus:border-accent focus:outline-none transition-colors" placeholder="+977 98..." required />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Email</label>
                    <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} type="email" className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-white placeholder-slate-500 focus:border-accent focus:outline-none transition-colors" placeholder="email@example.com" required />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-secondary to-accent text-slate-900 font-black text-sm uppercase tracking-widest hover:shadow-lg hover:shadow-secondary/30 transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send size={18} /> Get in Touch
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── BLOG PREVIEW SECTION ─────────────────────────────────────────
function BlogPreviewSection() {
  const { blogPosts } = useStore();
  const latest = blogPosts.slice(0, 3);
  return (
    <section className="section-premium bg-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/8 border border-secondary/15 text-[10px] font-black uppercase tracking-widest text-secondary mb-4">
              <BookOpen size={14} /> Latest Insights
            </div>
            <h2 className="text-fluid-h2 font-black text-slate-900" style={{ fontFamily: 'Poppins' }}>From Our <span className="text-primary">Blog</span></h2>
          </div>
          <Link to="/blog" className="btn-premium btn-premium-secondary mt-4 md:mt-0">View All Articles <ArrowRight size={16} /></Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {latest.map((post, i) => (
            <motion.div key={post.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <Link to={`/blog/${post.slug}`} className="group block h-full">
                <div className="h-full bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 overflow-hidden">
                  <div className="h-1.5 bg-gradient-to-r from-primary via-secondary to-accent" />
                  <div className="p-8">
                    <div className="flex items-center gap-3 mb-5">
                      <span className="px-3 py-1 rounded-lg bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-500"><Tag size={10} className="inline mr-1" />{post.category}</span>
                      <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1"><Clock size={10} />{post.readTime}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors leading-tight" style={{ fontFamily: 'Poppins' }}>{post.title}</h3>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed line-clamp-2 mb-6">{post.excerpt}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-400 pt-5 border-t border-slate-50">
                      <User size={12} /> {post.author} · {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════
export default function Home() {
  const { cms, heroImageUrl, sectionImages, packages } = useStore();
  const { companyInfo } = cms;

  const homePackages = useMemo(() => {
    return [...packages]
      .sort((a, b) => (b.priority || 0) - (a.priority || 0))
      .slice(0, 3);
  }, [packages]);

  const pageRef = useRef<HTMLDivElement>(null);

  // ── GSAP ScrollTrigger + entrance animations ──────────────────
  useEffect(() => {
    if (!pageRef.current) return;

    const ctx = gsap.context(() => {
      // Helper to safely get elements
      const select = (s: string) => gsap.utils.toArray<Element>(s);

      // Hero word-by-word clip reveal
      const heroWords = select('.hero-word');
      if (heroWords.length > 0) {
        gsap.fromTo(heroWords,
          { yPercent: 108, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 1.05, stagger: 0.13, ease: 'expo.out', delay: 0.25 }
        );
      }

      const heroSub = select('.hero-sub');
      if (heroSub.length > 0) {
        gsap.fromTo(heroSub,
          { y: 22, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.95, ease: 'power3.out', delay: 0.8 }
        );
      }

      const heroCta = select('.hero-cta');
      if (heroCta.length > 0) {
        gsap.fromTo(heroCta,
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.13, ease: 'back.out(1.8)', delay: 1.05 }
        );
      }

      const heroBadge = select('.hero-badge');
      if (heroBadge.length > 0) {
        gsap.fromTo(heroBadge,
          { scale: 0.82, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.65, ease: 'back.out(2)', delay: 0.1 }
        );
      }

      const heroPanel = select('.hero-panel');
      if (heroPanel.length > 0) {
        gsap.fromTo(heroPanel,
          { x: 55, opacity: 0 },
          { x: 0, opacity: 1, duration: 1.15, ease: 'expo.out', delay: 0.5 }
        );
      }

      const heroTrust = select('.hero-trust-item');
      if (heroTrust.length > 0) {
        gsap.fromTo(heroTrust,
          { y: 14, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: 'power2.out', delay: 1.35 }
        );
      }

      const heroMetric = select('.hero-metric');
      if (heroMetric.length > 0) {
        gsap.fromTo(heroMetric,
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.6, stagger: 0.12, ease: 'back.out(2)', delay: 1.55 }
        );
      }

      // Generic scroll reveal
      select('.st-reveal').forEach(el => {
        gsap.fromTo(el,
          { y: 52, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 1.0, ease: 'power4.out',
            scrollTrigger: { trigger: el, start: 'top 95%', toggleActions: 'play none none none' }
          }
        );
      });

      // Staggered card groups via ScrollTrigger
      select('.st-card-group').forEach(group => {
        const cards = group.querySelectorAll('.st-card');
        if (cards.length > 0) {
          gsap.fromTo(cards,
            { y: 48, opacity: 0 },
            {
              y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: 'power3.out',
              scrollTrigger: { trigger: group, start: 'top 92%', toggleActions: 'play none none none' }
            }
          );
        }
      });

      // Server pool panel slide in from sides
      const serverSection = select('.server-section')[0];
      if (serverSection) {
        const serverLeft = select('.server-left');
        if (serverLeft.length > 0) {
          gsap.fromTo(serverLeft,
            { x: -48, opacity: 0 },
            {
              x: 0, opacity: 1, duration: 1.05, ease: 'expo.out',
              scrollTrigger: { trigger: serverSection, start: 'top 85%' }
            }
          );
        }
        const serverRight = select('.server-right');
        if (serverRight.length > 0) {
          gsap.fromTo(serverRight,
            { x: 48, opacity: 0 },
            {
              x: 0, opacity: 1, duration: 1.05, ease: 'expo.out',
              scrollTrigger: { trigger: serverSection, start: 'top 85%' }
            }
          );
        }
      }

      // Decorative lines scale from left
      select('.st-line').forEach(el => {
        gsap.fromTo(el,
          { scaleX: 0, transformOrigin: 'left center' },
          {
            scaleX: 1, duration: 0.75, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 95%' }
          }
        );
      });

      // Refresh ScrollTrigger to account for any layout shifts after initial render
      const timer1 = setTimeout(() => ScrollTrigger.refresh(), 500);
      const timer2 = setTimeout(() => ScrollTrigger.refresh(), 1500);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }, pageRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div className="bg-white overflow-hidden" ref={pageRef}>

      {/* ════════════════════════════════════════════════════════════
          HERO — LIGHT MODE, MODERN RADIAL MESH GRADIENT
          Inspired by Next.js / Vercel / Linear landing pages:
          Layered radial blobs on white, dot grid, noise grain
      ════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-white">

        {/* ── Mesh gradient background ── */}
        <div className="absolute inset-0 z-0 pointer-events-none select-none">
          {/* Warm orange radial — top-left anchor */}
          <div
            className="absolute -top-[25%] -left-[12%] w-[70%] h-[70%] rounded-full"
            style={{ background: 'radial-gradient(ellipse at 40% 40%, color-mix(in srgb, var(--primary), transparent 80%) 0%, color-mix(in srgb, var(--secondary), transparent 90%) 40%, transparent 72%)' }}
          />
          {/* Coral tint — top-right */}
          <div
            className="absolute -top-[12%] right-[-5%] w-[55%] h-[60%] rounded-full"
            style={{ background: 'radial-gradient(ellipse at 60% 30%, rgba(239,68,68,0.10) 0%, rgba(251,113,133,0.05) 50%, transparent 75%)' }}
          />
          {/* Sky blue — bottom-left */}
          <div
            className="absolute bottom-[-8%] -left-[8%] w-[50%] h-[50%] rounded-full"
            style={{ background: 'radial-gradient(ellipse at 30% 70%, rgba(59,130,246,0.10) 0%, transparent 68%)' }}
          />
          {/* Amber center glow */}
          <div
            className="absolute top-[35%] left-[35%] w-[35%] h-[35%] rounded-full"
            style={{ background: 'radial-gradient(ellipse at center, rgba(251,191,36,0.07) 0%, transparent 70%)' }}
          />
          {/* Fine dot grid overlay — the Next.js signature look */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.10) 1px, transparent 1px)',
              backgroundSize: '28px 28px',
              opacity: 0.38,
            }}
          />
          {/* SVG noise grain for depth */}
          <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.022 }} xmlns="http://www.w3.org/2000/svg">
            <filter id="grain">
              <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
              <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#grain)" />
          </svg>
        </div>

        <div className="container mx-auto px-6 relative z-10 pt-24 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-[82vh]">

            {/* ── LEFT: Headline + CTAs ── */}
            <div className="lg:col-span-6 space-y-8">

              {/* Live badge */}
              <div className="hero-badge inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-50 border border-slate-200">
                <motion.div
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ repeat: Infinity, duration: 2.2 }}
                  className="w-2 h-2 rounded-full bg-primary"
                />
                <span className="text-[10px] font-black uppercase tracking-[0.42em] text-slate-500">
                  Gigabit Fiber · Live Network
                </span>
              </div>

              {/* Headline — each word clips up via GSAP */}
              <div className="space-y-0.5">
                {(cms.heroSection.title || 'ULTRA-FAST FIBER INTERNET.').split(' ').map((word: string, i: number, arr: string[]) => (
                  <div key={i} className="overflow-hidden leading-[0.88]">
                    <div
                      className={`hero-word text-[clamp(2.5rem,7vw,6.5rem)] font-black tracking-[-0.03em] ${i === 0 ? 'gradient-text' : i === arr.length - 1 ? 'text-slate-900/40' : 'text-slate-900'}`}
                      style={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                      {word.toUpperCase()}
                    </div>
                  </div>
                ))}
              </div>

              {/* Subtext */}
              <p className="hero-sub text-slate-500 text-lg font-medium leading-relaxed max-w-lg">
                {cms.heroSection.subtitle || 'Pure optical fiber to your door. Symmetric speeds, carrier-grade uptime, and 24/7 expert support — built for the demands of tomorrow.'}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4 items-center">
                <Link
                  to="/tariff"
                  className="hero-cta btn-premium btn-premium-primary !px-8 !py-4 shadow-lg shadow-primary/20"
                >
                  {cms.heroSection.primaryCTA || 'Explore Plans'}
                  <ArrowRight size={15} />
                </Link>
                <Link
                  to="/contact"
                  className="hero-cta btn-premium btn-premium-secondary !px-8 !py-4"
                >
                  <Play size={13} className="fill-orange-500 text-sm" />
                  {cms.heroSection.secondaryCTA || 'Talk to Sales'}
                </Link>
              </div>

              {/* Trust strip */}
              <div className="flex flex-wrap items-center gap-6 pt-5 border-t border-slate-100">
                {[
                  { val: '20+', label: 'Branches' },
                  { val: '12', label: 'Cities' },
                  { val: '2008', label: 'Est.' },
                ].map(s => (
                  <div key={s.label} className="hero-trust-item">
                    <div className="text-2xl font-black text-slate-900 leading-none" style={{ fontFamily: 'Poppins, sans-serif' }}>{s.val}</div>
                    <div className="text-[9px] font-bold uppercase tracking-[0.25em] text-slate-400 mt-0.5">{s.label}</div>
                  </div>
                ))}
                <div className="hero-trust-item flex items-center gap-1 ml-auto">
                  {[1, 2, 3, 4, 5].map(i => <Star key={i} size={11} className="fill-amber-400 text-amber-400" />)}
                  <span className="text-[11px] text-slate-400 ml-1.5 font-medium">4.9 / 5</span>
                </div>
              </div>
            </div>

            {/* ── RIGHT: Animated Brand + Social Icons ── */}
            <div className="lg:col-span-6 hero-panel relative flex items-center justify-center min-h-[600px]">
              <HeroAnimation />
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ repeat: Infinity, duration: 2.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        >
          <div className="w-5 h-8 rounded-full border-2 border-slate-200 flex justify-center pt-1.5">
            <div className="w-1 h-2 rounded-full bg-slate-300" />
          </div>
        </motion.div>
      </section>

      {/* ═══ FIBER CABLE TRANSITION ══════════════════════════════ */}
      <FiberCable />

      {/* ═══ STATS ═══════════════════════════════════════════════ */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-100 border border-slate-100 rounded-3xl overflow-hidden shadow-sm st-reveal">
            {[
              { v: 20, l: 'Branches', s: '+' },
              { v: 16, l: 'Years Presence', s: '+' },
              { v: 99, l: 'SLA Uptime', s: '.9%' },
              { v: 150, l: 'Support Staff', s: '+' },
            ].map((item, i) => (
              <div key={i} className="py-10 px-6 bg-white hover:bg-slate-50/60 transition-colors">
                <StatCard value={item.v} label={item.l} suffix={item.s} delay={i * 0.12} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PARTICLE WAVE ═══════════════════════════════════════ */}
      <section className="relative py-28 flex items-center justify-center overflow-hidden bg-slate-50">
        {/* Subtle radial on the bg-slate-50 */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 60% 50%, rgba(251,146,60,0.10) 0%, rgba(59,130,246,0.05) 55%, transparent 80%)' }}
        />
        <div className="absolute inset-0 opacity-[0.28]" style={{
          backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.07) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }} />
        <div className="absolute inset-0 z-0">
          <NetworkBackground variant="wave" opacity={0.05} color="#E30613" />
          <ParticleNetwork count={45} />
        </div>
        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto st-reveal">
          <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-white border border-red-100 shadow-sm mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.35em] text-orange-600">Infrastructure Scale</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-slate-900 mb-5 leading-[0.92] tracking-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Expanding the<br /><em className="text-primary not-italic">Digital Horizon.</em>
          </h2>
          <p className="text-slate-500 text-lg font-medium leading-relaxed">
            Carrier-grade infrastructure that grows with your ambition — from last-mile to backbone.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          CARRIER-GRADE SERVER POOLS
          ── NO ugly separators. Clean transition: bg-white,
             only a centred accent dot-line at top, mesh gradient.
      ═══════════════════════════════════════════════════════════ */}
      {/* <section className="server-section relative py-32 bg-white overflow-hidden">
        <div className="st-line absolute top-0 left-1/2 -translate-x-1/2 w-20 h-[2px] bg-gradient-to-r from-transparent via-orange-300 to-transparent rounded-full" />

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse at 85% 15%, rgba(34,197,94,0.07) 0%, transparent 52%),
              radial-gradient(ellipse at 15% 85%, rgba(59,130,246,0.06) 0%, transparent 52%)
            `,
          }}
        />

        <div className="container mx-auto px-6 relative z-10">

          <div className="max-w-xl mb-20 server-left">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-green-50 border border-green-200 mb-6">
              <motion.div
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ repeat: Infinity, duration: 1.6 }}
                className="w-2 h-2 rounded-full bg-green-500"
              />
              <span className="text-[10px] font-black uppercase tracking-[0.35em] text-green-700">Live Infrastructure</span>
            </div>
            <h2 className="text-5xl font-black text-slate-900 mb-4 leading-tight tracking-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Carrier-Grade<br /><span className="text-green-600">Server Pools.</span>
            </h2>
            <p className="text-slate-500 text-lg font-medium leading-relaxed">
              Tier-3 data centers with high-density server clusters — redundant cooling, power, and multi-gigabit backhaul.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

            <div className="server-left space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: '99.9%', label: 'Uptime Record', icon: <TrendingUp size={16} />, bg: 'bg-green-50', border: 'border-green-200', ic: 'text-green-600', vl: 'text-green-800' },
                  { value: '< 1ms', label: 'Intra-Node Latency', icon: <Activity size={16} />, bg: 'bg-blue-50', border: 'border-blue-200', ic: 'text-blue-600', vl: 'text-blue-800' },
                  { value: 'Tier-3', label: 'Data Center Grade', icon: <Database size={16} />, bg: 'bg-purple-50', border: 'border-purple-200', ic: 'text-purple-600', vl: 'text-purple-800' },
                  { value: '10 GbE', label: 'Backbone Uplink', icon: <Network size={16} />, bg: 'bg-red-50', border: 'border-orange-200', ic: 'text-orange-600', vl: 'text-orange-800' },
                ].map((s, i) => (
                  <AnimatedCard key={i} index={i}>
                    <div className={`${s.bg} border ${s.border} rounded-2xl p-5 h-full`}>
                      <div className={`${s.ic} mb-3`}>{s.icon}</div>
                      <div className={`text-3xl font-black ${s.vl} mb-1`} style={{ fontFamily: 'Poppins, sans-serif' }}>{s.value}</div>
                      <div className={`text-[9px] font-black uppercase tracking-widest ${s.ic} opacity-70`}>{s.label}</div>
                    </div>
                  </AnimatedCard>
                ))}
              </div>

              <div className="space-y-3">
                {[
                  'N+1 redundant power with UPS and generator failover',
                  'Precision cooling maintained at 18°C ±1°C',
                  'Multi-homed BGP with 6+ upstream carriers',
                  'Biometric physical security with 24/7 on-site staff',
                ].map((f, i) => (
                  <AnimatedCard key={i} index={i}>
                    <div className="flex items-center gap-3">
                      <CheckCircle size={15} className="text-green-500 shrink-0" />
                      <span className="text-slate-600 font-medium text-sm">{f}</span>
                    </div>
                  </AnimatedCard>
                ))}
              </div>

              <LiveTerminal />
            </div>

            <div className="server-right space-y-5">
              <div className="rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-100 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <Server size={14} className="text-slate-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Node Status · 24 Units</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <motion.div
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ repeat: Infinity, duration: 1.4 }}
                      className="w-2 h-2 rounded-full bg-green-500"
                    />
                    <span className="text-[9px] font-black uppercase tracking-widest text-green-600">Live</span>
                  </div>
                </div>

                <div className="p-6">
                  <LiveNodeGrid />
                </div>

                <div className="px-6 pb-5 flex items-center gap-5 border-t border-slate-50 pt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-md bg-green-500" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Active</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-md bg-slate-200" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Standby</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-md bg-green-400 animate-pulse" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">High Load</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Total Nodes', value: '24', sub: 'All online' },
                  { label: 'Avg Load', value: '61%', sub: 'Cluster-wide' },
                  { label: 'Backhaul', value: '40G', sub: 'Multi-path' },
                ].map((m, i) => (
                  <div key={i} className="rounded-2xl border border-slate-100 bg-slate-50/60 px-4 py-5 text-center">
                    <div className="text-2xl font-black text-slate-900 mb-0.5" style={{ fontFamily: 'Poppins, sans-serif' }}>{m.value}</div>
                    <div className="text-[9px] font-black uppercase tracking-widest text-slate-400">{m.label}</div>
                    <div className="text-[9px] text-slate-400 mt-0.5">{m.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* ═══ FTTH CONCEPT ════════════════════════════════════════ */}
      <section className="py-28 relative overflow-hidden bg-slate-50">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 25% 50%, rgba(227,6,19,0.08) 0%, transparent 58%)' }}
        />
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="st-reveal">
              <div className="st-line h-px w-10 bg-orange-300 mb-6" />
              <div className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-3">Pure Optics</div>
              <h2 className="text-5xl font-black text-slate-900 mb-5 leading-tight tracking-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
                FTTH<br /><span className="text-primary">Evolution.</span>
              </h2>
              <p className="text-slate-500 font-medium leading-relaxed text-lg mb-8">
                Laser-focused connectivity via micro-fiber to your smart-ONT. Zero interference, zero limits — pure photon-speed data.
              </p>
              <div className="space-y-3.5">
                {['No copper — end-to-end pure glass', 'Symmetric 1 Gbps up and down', 'GPON 2.0 with intelligent wavelength division'].map((f, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    </div>
                    <span className="text-slate-600 font-medium text-sm">{f}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative st-reveal lg:pl-10">
              <FTTHAnimation />
              {/* Background Glow */}
              <div className="absolute -inset-10 bg-primary/5 blur-[100px] rounded-full -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CORE TECHNOLOGIES ═══════════════════════════════════ */}
      <section className="py-28 bg-white relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 75% 60%, rgba(168,85,247,0.05) 0%, transparent 55%)' }}
        />
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16 st-reveal">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 mb-6">
              <Cpu size={14} className="text-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Network Architecture</span>
            </div>
            <h2 className="text-5xl font-black text-slate-900 mb-4 tracking-tight leading-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
              The Power Behind<br /><span className="text-primary">Your Connection.</span>
            </h2>
            <div className="st-line h-1 w-14 bg-primary mx-auto rounded-full mt-5" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 st-card-group">
            {coreTechData.map((tech, i) => (
              <div key={i} className="st-card group relative bg-white rounded-3xl p-8 border border-slate-100 shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500 h-full overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-3xl" style={{ backgroundColor: tech.accent }} />
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6" style={{ backgroundColor: tech.accent + '14', color: tech.accent }}>
                  {tech.icon}
                </div>
                <h3 className="text-lg font-black text-slate-900 mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>{tech.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed text-sm mb-7">{tech.desc}</p>
                <div className="grid grid-cols-2 gap-4 pt-5 border-t border-slate-50">
                  {tech.stats.map((s, idx) => (
                    <div key={idx}>
                      <div className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1">{s.label}</div>
                      <div className="text-base font-black" style={{ color: tech.accent, fontFamily: 'Poppins, sans-serif' }}>{s.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SERVICES ════════════════════════════════════════════ */}
      <section className="py-28 bg-slate-50 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-2xl mb-16 st-reveal">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="st-line h-px w-8 bg-red-400" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-red-500">Service Catalog</span>
            </div>
            <h2 className="text-5xl font-black text-slate-900 mb-4 tracking-tight leading-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Solutions For<br />Every Scale.
            </h2>
            <p className="text-lg text-slate-500 font-medium leading-relaxed">
              From home streamers to corporate enterprises — connectivity that scales with your ambition.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 st-card-group">
            {cms.services.map((s, i) => (
              <div key={i} className="st-card group relative bg-white rounded-3xl p-7 border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-400 overflow-hidden h-full">
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-orange-400 to-red-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <Zap size={22} />
                </div>
                <div className="inline-flex px-2.5 py-1 rounded-lg bg-red-50 text-[9px] font-black uppercase tracking-widest text-orange-600 mb-4">
                  {s.name}
                </div>
                <h3 className="text-lg font-black text-slate-900 mb-2.5" style={{ fontFamily: 'Poppins, sans-serif' }}>{s.title}</h3>
                <p className="text-slate-500 font-medium text-sm leading-relaxed">{s.description}</p>
                <div className="mt-7 pt-5 border-t border-slate-50">
                  <Link to={`/service/${s.id}`} className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest text-primary hover:text-orange-600 transition-colors">
                    Explore <ArrowUpRight size={13} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ WHY US ══════════════════════════════════════════════ */}
      <section className="py-28 bg-white relative overflow-hidden">
        <WavingLines />
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="st-reveal">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="st-line h-px w-8 bg-red-400" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-red-500">The Edge</span>
              </div>
              <h2 className="text-5xl font-black text-slate-900 mb-6 leading-tight tracking-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Why Leading Enterprises<br />Choose <span className="text-primary">Arrow</span><span className="text-secondary">Net.</span>
              </h2>
              <p className="text-lg text-slate-500 font-medium leading-relaxed mb-10">{cms.aboutSection.description}</p>
              <div className="grid grid-cols-2 gap-8 mb-10">
                {[{ v: '365', l: 'Day Technical Support' }, { v: '24/7', l: 'Proactive Monitoring' }].map(s => (
                  <div key={s.l}>
                    <div className="text-4xl font-black text-slate-900 mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>{s.v}</div>
                    <div className="text-[9px] uppercase font-black tracking-widest text-slate-400">{s.l}</div>
                  </div>
                ))}
              </div>
              <Link to="/about" className="inline-flex items-center gap-2.5 px-7 py-4 rounded-full bg-slate-900 text-white font-black text-[13px] uppercase tracking-widest hover:bg-primary transition-all duration-300">
                Our Story <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 st-card-group">
              {[
                { icon: <Zap size={18} />, title: 'Latency Focus', desc: 'Direct peering with major content providers.', offset: true },
                { icon: <Shield size={18} />, title: 'Cyber Resilience', desc: 'Hardware-level DDoS protection.', offset: false },
                { icon: <Clock size={18} />, title: 'No Buffering', desc: 'Optimised OTT delivery for 4K.', offset: true },
                { icon: <Star size={18} />, title: 'Top Rated', desc: 'Ranked #1 in customer satisfaction.', offset: false },
              ].map((item, i) => (
                <div key={i} className={`st-card p-7 rounded-3xl bg-slate-50 border border-slate-100 hover:border-orange-200 hover:bg-red-50/30 transition-all duration-300 ${item.offset ? 'lg:translate-y-6' : ''}`}>
                  <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-primary mb-5">
                    {item.icon}
                  </div>
                  <h4 className="font-black text-slate-900 mb-2 text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>{item.title}</h4>
                  <p className="text-xs text-slate-500 font-medium">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* ═══ NETWORK MESH INTERLUDE ══════════════════════════════ */}
      <section className="relative py-24 flex items-center justify-center overflow-hidden bg-slate-900">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(59,130,246,0.14) 0%, transparent 68%)' }}
        />
        <div className="absolute inset-0 opacity-[0.15]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100'%3E%3Cpath d='M28 66L0 50V16L28 0l28 16v34L28 66zm0-2l26-15V18L28 2 2 18v31L28 64z' fill='%233b82f6'/%3E%3C/svg%3E")`,
          backgroundSize: '40px 70px'
        }} />
        <div className="absolute inset-0 z-0">
          <NetworkBackground variant="nodes" opacity={0.07} color="#3b82f6" />
          <ParticleNetwork count={30} />
        </div>
        <div className="relative z-10 text-center px-6 max-w-2xl st-reveal">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-[10px] font-black uppercase tracking-widest text-blue-400 mb-6">
            Next-Gen Topology
          </div>
          <h2 className="text-5xl font-black text-white mb-4 leading-tight tracking-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Interconnected <span className="text-blue-400 italic">Nodes.</span>
          </h2>
          <p className="text-slate-400 text-base font-medium max-w-md mx-auto leading-relaxed">
            Distributed architecture ensuring multi-path resilience across all metropolitan areas.
          </p>
          {sectionImages['home_cta'] && (
            <div className="mt-12 mx-auto max-w-lg rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">
              <img src={sectionImages['home_cta']} alt="Network Call to action" className="w-full h-auto object-cover" />
            </div>
          )}
        </div>
      </section>

      {/* ═══ WHY CHOOSE ARROWNET ══════════════════════════════════ */}
      <section className="section-premium bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/8 border border-primary/15 text-[10px] font-black uppercase tracking-widest text-primary mb-6">
              <Award size={14} /> Why Arrownet
            </div>
            <h2 className="text-fluid-h2 font-black text-slate-900 mb-6" style={{ fontFamily: 'Poppins' }}>Why Choose <span className="text-primary">Arrow</span><span className="text-secondary">Net?</span></h2>
            <p className="text-lg text-slate-500 font-medium">Nepal's premier ISP delivering unmatched speed, reliability, and customer satisfaction since 2008.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: <Zap size={28} />, title: 'Blazing Speed', desc: 'Fiber optic connections up to 1 Gbps with symmetric upload and download speeds.', color: '#E30613' },
              { icon: <Shield size={28} />, title: 'Network Security', desc: 'Enterprise-grade DDoS protection and DNS filtering on every connection.', color: '#2D0A6E' },
              { icon: <Clock size={28} />, title: '99.99% Uptime', desc: '24/7 NOC monitoring with proactive issue detection and resolution.', color: '#FFD700' },
              { icon: <Headphones size={28} />, title: '24/7 Support', desc: 'Dedicated support team available around the clock via phone, email, and WhatsApp.', color: '#E30613' },
              { icon: <Globe size={28} />, title: 'Wide Coverage', desc: 'Extensive fiber network covering Kathmandu Valley and expanding across Nepal.', color: '#2D0A6E' },
              { icon: <Star size={28} />, title: 'Best Value', desc: 'Competitive pricing with unlimited data on all plans. No hidden charges.', color: '#FFD700' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="group relative bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: `linear-gradient(90deg, ${item.color}, transparent)` }} />
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110" style={{ background: `${item.color}15`, color: item.color }}>{item.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3" style={{ fontFamily: 'Poppins' }}>{item.title}</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═════════════════════════════════════════ */}
      <TestimonialsSection />

      {/* ═══ FAQ ════════════════════════════════════════════════════ */}
      <FAQSection />

      {/* ═══ GET IN TOUCH ════════════════════════════════════════ */}
      <GetInTouchSection />

      {/* ═══ BLOG PREVIEW ════════════════════════════════════════ */}
      <BlogPreviewSection />

      {/* ═══ CTA ══════════════════════════════════════════════════ */}
      <section className="py-28 bg-white">
        <div className="container mx-auto px-6">
          <div
            className="relative rounded-[40px] overflow-hidden st-reveal"
            style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `
                  radial-gradient(ellipse at 18% 50%, rgba(227,6,19,0.16) 0%, transparent 52%),
                  radial-gradient(ellipse at 82% 50%, rgba(59,130,246,0.08) 0%, transparent 52%)
                `
              }}
            />
            <div className="absolute inset-0 opacity-[0.035]" style={{
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
              backgroundSize: '22px 22px',
            }} />
            <div className="relative z-10 text-center py-24 px-12 flex flex-col items-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-secondary/25 bg-secondary/10 mb-8">
                <Zap size={11} className="text-secondary" />
                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-secondary">24hr Installation</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-black text-white mb-5 leading-tight tracking-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Ready for<br /><span className="text-accent">Real Speed?</span>
              </h2>
              <p className="text-xl text-slate-400 font-medium max-w-xl mb-12 leading-relaxed">
                Join 15,000+ satisfied users who have elevated their digital life with Arrownet.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link to="/tariff" className="px-10 py-4 rounded-full bg-secondary text-white font-black text-[13px] uppercase tracking-widest hover:brightness-110 transition-colors shadow-lg shadow-secondary/25">
                  Order Connection
                </Link>
                <Link to="/contact" className="px-10 py-4 rounded-full border border-white/20 text-white font-black text-[13px] uppercase tracking-widest hover:border-white/40 hover:bg-white/5 transition-colors">
                  Talk to Sales
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
