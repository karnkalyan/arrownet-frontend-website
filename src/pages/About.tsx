import { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Shield, Zap, Clock, Award, Users, Globe, ArrowRight, History } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Link } from 'react-router-dom';

import NetworkBackground from '../components/shared/NetworkBackground';
import FloatingElements from '../components/shared/FloatingElements';

gsap.registerPlugin(ScrollTrigger);

// Animated card wrapper using framer-motion for guaranteed visibility
function AnimatedCard({ children, index }: { children: React.ReactNode; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.23, 1, 0.32, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function About() {
  const { cms, logoUrl, sectionImages } = useStore();
  const containerRef = useRef<HTMLDivElement>(null);

  const milestones = [
    { year: '2008', event: 'Arrownet Pvt. Ltd. founded with a vision for ubiquitous connectivity.' },
    { year: '2010', event: 'First major wireless expansion across Kathmandu Valley.' },
    { year: '2014', event: 'Pioneered hybrid entertainment bundles with Cable TV.' },
    { year: '2018', event: 'Nation-wide deployment of FTTH (Fiber to the Home) technology.' },
    { year: '2021', event: 'Reached 15,000+ satisfied customers nationwide.' },
    { year: '2024', event: 'Upgraded infrastructure to support next-gen 1Gbps fiber cores.' },
  ];

  const coreValues = [
    { icon: <Shield size={28} />, title: 'Cyber Security', desc: 'Hardware-level protection against spam, malware, and sophisticated cyber threats.', color: '#ef4444' },
    { icon: <Zap size={28} />, title: 'Hyper Speed', desc: 'Enterprise-grade fiber architecture ensuring zero signal degradation.', color: '#E30613' },
    { icon: <Users size={28} />, title: 'Human Centric', desc: 'Dedicated support hunting lines ensuring help is always just a call away.', color: '#eab308' },
    { icon: <Clock size={28} />, title: 'Active Uptime', desc: 'Continuous network monitoring to proactively resolve issues before they occur.', color: '#3b82f6' },
    { icon: <Award size={28} />, title: 'Gold Standards', desc: 'Consistently pushing the boundaries of what is possible in Nepal.', color: '#a855f7' },
    { icon: <Globe size={28} />, title: 'Hyper Local', desc: 'Deeply committed to bridging the digital divide across Kathmandu Valley.', color: '#22c55e' },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero Animation
      gsap.fromTo('.about-hero-content > *',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: 'power3.out' }
      );

      // Mission Card
      gsap.fromTo('.mission-card',
        { scale: 0.95, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: '.mission-card', start: 'top 95%' }
        }
      );

      // Timeline Animation — individual triggers per item
      const items = gsap.utils.toArray('.timeline-item');
      items.forEach((item: any) => {
        gsap.fromTo(item,
          { x: -40, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.8,
            scrollTrigger: { trigger: item, start: 'top 95%', toggleActions: 'play none none none' }
          }
        );
      });

      // Progress line animation
      gsap.fromTo('.timeline-line',
        { scaleY: 0 },
        { scaleY: 1, transformOrigin: 'top', ease: 'none',
          scrollTrigger: {
            trigger: '.timeline-container',
            start: 'top 80%',
            end: 'bottom 50%',
            scrub: 1
          }
        }
      );

      const timer1 = setTimeout(() => ScrollTrigger.refresh(), 500);
      const timer2 = setTimeout(() => ScrollTrigger.refresh(), 1500);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="bg-white overflow-hidden" ref={containerRef}>
      {/* Hero */}
      <section className="relative py-32 overflow-hidden bg-slate-900">
        <div className="absolute inset-0">
          <NetworkBackground variant="circuit" opacity={0.06} color="#E30613" />
          <FloatingElements count={10} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-transparent to-slate-900" />
        <div className="container mx-auto px-6 relative z-10 about-hero-content text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl mb-12 shadow-2xl"
          >
            <History size={16} className="text-secondary" />
            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-secondary">Our Digital Evolution</span>
          </motion.div>
          <h1 className="text-fluid-h1 font-black text-white mb-8" style={{ fontFamily: 'Poppins' }}>
            Built for the <span className="text-accent italic drop-shadow-md">Next Century.</span>
          </h1>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed text-slate-300 font-medium">
            {cms.aboutSection.marketPosition || 'Pure optical fiber to your door. Symmetric speeds, carrier-grade uptime, and 24/7 expert support — built for the demands of tomorrow.'}
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="section-premium">
        <div className="container mx-auto px-6">
          <div className="mission-card relative bg-slate-900 rounded-[40px] p-12 md:p-20 overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-orange-500/10 to-transparent" />
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-white shadow-lg shadow-secondary/20">
                    <Zap size={24} className="fill-white" />
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-[0.4em] text-secondary">Company Vision</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-white mb-8" style={{ fontFamily: 'Poppins' }}>
                  Empowering Every <span className="text-accent drop-shadow-md">Digital Hand.</span>
                </h2>
                <p className="text-lg leading-relaxed text-slate-300 font-medium">
                  {cms.aboutSection.mission || 'To provide seamless connectivity to every corner of Nepal.'}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { label: 'Network Points', val: '240+' },
                  { label: 'District Presence', val: '12+' },
                  { label: 'High Speed Port', val: '50K+' },
                  { label: 'Support Staff', val: '200+' },
                ].map((stat, i) => (
                  <div key={i} className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md">
                    <div className="text-2xl font-black text-white mb-1" style={{ fontFamily: 'Poppins' }}>{stat.val}</div>
                    <div className="text-[10px] uppercase font-black tracking-widest text-slate-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {sectionImages['about_promo'] && (
        <section className="py-12 bg-white">
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-100">
              <img src={sectionImages['about_promo']} alt="Arrownet Promotional Banner" className="w-full h-auto object-cover" />
            </div>
          </div>
        </section>
      )}

      {/* Values — Using framer-motion for per-card animation */}
      <section className="section-premium bg-slate-50/30">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-fluid-h2 font-black text-slate-900 mb-6" style={{ fontFamily: 'Poppins' }}>Core Values</h2>
            <p className="text-lg text-slate-600 font-medium tracking-tight">The principles that drive every connection we make.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreValues.map((v, i) => (
              <AnimatedCard key={i} index={i}>
                <div className="group relative bg-white rounded-3xl p-8 border border-slate-100 shadow-lg shadow-slate-100/50 hover:shadow-2xl hover:shadow-slate-200/60 hover:-translate-y-2 hover:border-orange-200 transition-all duration-500 overflow-hidden h-full">
                  {/* Hover top accent */}
                  <div className="absolute top-0 left-0 w-full h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: `linear-gradient(90deg, ${v.color}, transparent)` }} />
                  
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500"
                    style={{ background: `${v.color}15`, color: v.color }}>
                    {v.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4" style={{ fontFamily: 'Poppins' }}>{v.title}</h3>
                  <p className="text-[15px] leading-relaxed text-slate-500 font-medium">{v.desc}</p>
                  <div className="mt-8">
                    <ArrowRight size={20} className="text-slate-200 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-premium bg-white timeline-container">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center mb-24">
            <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center text-primary mb-6">
              <History size={28} />
            </div>
            <h2 className="text-fluid-h2 font-black text-slate-900" style={{ fontFamily: 'Poppins' }}>The Journey.</h2>
          </div>

          <div className="max-w-4xl mx-auto relative px-10 md:px-0">
            {/* Main vertical line */}
            <div className="absolute left-1 md:left-1/2 top-0 bottom-0 w-1 bg-slate-100 -translate-x-1/2" />
            <div className="absolute left-1 md:left-1/2 top-0 bottom-0 w-1 bg-primary timeline-line -translate-x-1/2" style={{ transformOrigin: 'top' }} />

            <div className="space-y-24">
              {milestones.map((m, i) => (
                <div key={i} className={`timeline-item relative flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-10`}>
                  {/* Point */}
                  <div className="absolute left-1 md:left-1/2 top-1 w-6 h-6 bg-white border-4 border-primary rounded-full z-10 -translate-x-1/2 shadow-lg" />

                  {/* Content side */}
                  <div className={`w-full md:w-1/2 ${i % 2 === 0 ? 'md:text-right md:pr-12' : 'md:text-left md:pl-12'}`}>
                    <div className="inline-block px-4 py-1.5 rounded-full bg-red-50 text-primary text-sm font-black mb-4 tracking-widest" style={{ fontFamily: 'Poppins' }}>
                      {m.year}
                    </div>
                    <p className="text-lg md:text-xl font-bold text-slate-800 leading-snug">
                      {m.event}
                    </p>
                  </div>

                  {/* Empty side for layout */}
                  <div className="hidden md:block w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-premium bg-slate-50">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-black text-slate-900 mb-8" style={{ fontFamily: 'Poppins' }}>
            Join the Evolution.
          </h2>
          <div className="flex justify-center gap-4">
            <Link to="/tariff" className="btn-premium btn-premium-primary px-10">
              Switch to Fiber
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
