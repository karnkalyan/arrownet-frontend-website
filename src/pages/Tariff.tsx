import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { Check, Zap, Star, ArrowRight, Info, Shield, Radio, Layers } from 'lucide-react';
import { useStore } from '../store/useStore';

type PlanType = 'FTTH' | 'SOHO' | 'Corporate';

export default function Tariff() {
  const { packages } = useStore();
  const [activeTab, setActiveTab] = useState<PlanType>('FTTH');
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = packages.filter(p => p.type === activeTab);

  const tabConfigs: Record<PlanType, { color: string; icon: any; label: string }> = {
    FTTH: { color: 'var(--primary)', icon: <Radio size={18} />, label: 'Residential (FTTH)' },
    SOHO: { color: 'var(--secondary)', icon: <Zap size={18} />, label: 'SME / Pro (SOHO)' },
    Corporate: { color: 'var(--accent)', icon: <Layers size={18} />, label: 'Enterprise' },
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero
      gsap.from('.tariff-hero > *', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out'
      });

      // Cards stagger on activeTab change
      gsap.from('.tariff-card', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: 'power4.out',
        clearProps: 'all'
      });
    }, containerRef);

    return () => ctx.revert();
  }, [activeTab]);

  return (
    <div className="bg-white min-h-screen" ref={containerRef}>
      {/* Hero */}
      <section className="relative py-24 overflow-hidden bg-slate-50/50 tariff-hero">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 via-white to-transparent" />
        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white border border-slate-100 shadow-xl shadow-slate-200/40 mb-10">
            <Zap size={16} className="text-primary fill-primary/20" />
            <span className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500">Optimized Performance</span>
          </div>
          <h1 className="text-fluid-h1 font-black text-slate-900 mb-8" style={{ fontFamily: 'Poppins' }}>
            Choose Your <span className="gradient-text">Velocity.</span>
          </h1>
          <p className="text-xl max-w-2xl mx-auto text-slate-500 font-medium leading-relaxed mb-10">
            Engineered for high-density streaming, low-latency gaming, and enterprise-grade reliability.
          </p>
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-[20px] bg-primary/5 border border-orange-500/20 shadow-inner">
            <Star size={18} className="text-primary fill-orange-500" />
            <span className="text-sm font-bold text-orange-700">
              Complimentary Upgrade: 20 Mbps → 30 Mbps for all residential plans.
            </span>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="py-12 bg-white sticky top-[72px] z-30 border-b border-slate-50">
        <div className="container mx-auto px-6">
          <div className="flex justify-center">
            <div className="flex p-2 rounded-[28px] bg-slate-50/50 border border-slate-100 backdrop-blur-md">
              {(['FTTH', 'SOHO', 'Corporate'] as PlanType[]).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`
                    relative flex items-center gap-3 px-8 py-4 rounded-[22px] text-sm font-black transition-all duration-500
                    ${activeTab === tab ? 'text-white shadow-2xl scale-105' : 'text-slate-400 hover:text-slate-600'}
                  `}
                  style={{
                    backgroundColor: activeTab === tab ? tabConfigs[tab].color : 'transparent',
                    boxShadow: activeTab === tab ? `0 15px 35px ${tabConfigs[tab].color}40` : 'none',
                  }}
                >
                  <span className={activeTab === tab ? 'text-white' : 'text-slate-300'}>
                    {tabConfigs[tab].icon}
                  </span>
                  {tabConfigs[tab].label}
                  {activeTab === tab && (
                    <motion.div
                      layoutId="active-pill"
                      className="absolute inset-0 rounded-[22px] -z-10"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="section-premium bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filtered.map((pkg, i) => (
              <div
                key={pkg.id}
                className={`
                  tariff-card card-premium overflow-initial flex flex-col relative transition-all duration-500
                  ${pkg.popular ? 'border-primary shadow-2xl shadow-primary/10' : 'hover:border-slate-200'}
                `}
              >
                {pkg.popular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-6 py-2 rounded-full text-[10px] font-black tracking-widest text-white shadow-2xl z-10"
                    style={{
                      background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                      boxShadow: '0 10px 25px -5px var(--primary)'
                    }}>
                    ELITE PERFORMANCE
                  </div>
                )}

                <div className="flex items-center justify-between mb-8">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-primary">
                    <Radio size={24} />
                  </div>
                  <div className="px-3 py-1 rounded-lg bg-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-500">
                    {pkg.type}
                  </div>
                </div>

                <h3 className="text-2xl font-black text-slate-900 mb-2 truncate" style={{ fontFamily: 'Poppins' }}>{pkg.name}</h3>
                <p className="text-[14px] text-slate-500 font-medium leading-relaxed mb-8 min-h-[40px]">{pkg.description}</p>

                <div className="mb-8">
                  <div className="text-[11px] font-black uppercase tracking-[0.2em] text-primary mb-2">Network Velocity</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-slate-900" style={{ fontFamily: 'Poppins' }}>{pkg.speed}</span>
                  </div>
                  <div className="text-[12px] font-bold text-slate-400 mt-2 flex items-center gap-2">
                    <Zap size={12} className="text-primary" />
                    Symmetric Upload Available
                  </div>
                </div>

                <div className="mb-10 pb-10 border-b border-slate-50 flex-1">
                  <div className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4">Core Benefits</div>
                  <ul className="space-y-4">
                    {pkg.features.map((feat, fi) => (
                      <li key={fi} className="flex items-start gap-3 text-[14px] font-medium text-slate-700">
                        <Check size={16} className="text-primary mt-1 flex-shrink-0" />
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-slate-900" style={{ fontFamily: 'Poppins' }}>Rs. {pkg.price}</span>
                    <span className="text-slate-500 text-sm font-bold">/ month</span>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      to={`/package/${pkg.id}`}
                      className={`
                          flex-1 btn-premium justify-center font-black uppercase tracking-widest text-[12px]
                          ${pkg.popular ? 'btn-premium-primary' : 'btn-premium-secondary'}
                        `}
                    >
                      Subscribe
                    </Link>
                    <Link
                      to={`/package/${pkg.id}`}
                      className="p-4 rounded-2xl bg-slate-50 text-slate-300 hover:bg-slate-100 hover:text-slate-600 transition-all"
                    >
                      <Info size={20} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise / Corporate Note */}
      {activeTab === 'Corporate' && (
        <section className="section-premium pt-0 bg-white">
          <div className="container mx-auto px-6">
            <div className="bg-slate-900 rounded-[40px] p-12 overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent" />
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-16 items-center">
                <div className="lg:col-span-1">
                  <h4 className="text-3xl font-black text-white mb-6" style={{ fontFamily: 'Poppins' }}>
                    Enterprise Leased Line.
                  </h4>
                  <p className="text-slate-400 font-medium leading-relaxed mb-8">
                    Designed for mission-critical operations with iron-clad SLAs and dedicated dark fiber availability.
                  </p>
                  <Link to="/contact" className="btn-premium btn-premium-primary !bg-primary shadow-primary/30">
                    Request POC
                  </Link>
                </div>
                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {[
                    { icon: <Shield size={20} />, label: 'VLAN Segmentation', val: 'Full isolation for secure internal traffic.' },
                    { icon: <Zap size={20} />, label: '99.99% Uptime SLA', val: 'Financial compensation for any downtime.' },
                    { icon: <Radio size={20} />, label: 'BGP Routing', val: 'Best path selection with global carrier peering.' },
                    { icon: <Check size={20} />, label: 'Managed NOC', val: '24/7 proactive monitoring by our engineers.' },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 flex-shrink-0">
                        {item.icon}
                      </div>
                      <div>
                        <div className="text-white font-bold mb-1" style={{ fontFamily: 'Poppins' }}>{item.label}</div>
                        <div className="text-sm text-slate-500 font-medium">{item.val}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Custom Plan CTA */}
      <section className="section-premium bg-slate-50/50">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-black text-slate-900 mb-6" style={{ fontFamily: 'Poppins' }}>Need something custom?</h2>
          <p className="text-slate-500 font-medium mb-12 max-w-xl mx-auto">
            Our solutions architects are ready to build a bespoke network architecture for your specific requirements.
          </p>
          <Link to="/contact" className="btn-premium btn-premium-secondary !px-12">
            Engineering Consultation
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
