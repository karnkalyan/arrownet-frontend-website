import { useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import NetworkBackground from '../components/shared/NetworkBackground';
import { Check, ArrowLeft, Zap, Shield, Clock, Phone, Star, ChevronRight, Activity, Download, Upload, Boxes } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function PackageDetail() {
  const { id } = useParams();
  const { packages } = useStore();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const pkg = packages.find(p => p.id === Number(id));

  useEffect(() => {
    if (!pkg) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('.package-reveal',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
      );
      gsap.fromTo('.stat-card',
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'back.out(1.7)', delay: 0.4 }
      );
      gsap.fromTo('.feature-item',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.05, ease: 'power2.out', delay: 0.6 }
      );
      gsap.fromTo('.sla-card',
        { x: -30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out', delay: 0.7 }
      );
      gsap.fromTo('.related-card',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: 'power3.out', delay: 0.3 }
      );
    }, containerRef);
    return () => ctx.revert();
  }, [pkg]);

  if (!pkg) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center p-20 bg-white rounded-3xl border border-slate-100 shadow-xl">
        <h2 className="text-4xl font-black text-slate-900 mb-6" style={{ fontFamily: 'Poppins' }}>Node Unavailable</h2>
        <p className="text-slate-400 font-medium mb-10">The requested package architecture is not found in our current deployment.</p>
        <Link to="/tariff" className="btn-premium btn-premium-primary">
          <ArrowLeft size={18} /> Return to Grid
        </Link>
      </div>
    </div>
  );

  const typeColors: Record<string, string> = {
    Home: '#E30613', SME: '#3b82f6', Corporate: '#a855f7',
  };
  const color = typeColors[pkg.type] || '#E30613';
  const relatedPkgs = packages.filter(p => p.type === pkg.type && p.id !== pkg.id).slice(0, 3);

  return (
    <div className="bg-white min-h-screen" ref={containerRef}>
      {/* Header / Back */}
      <div className="container mx-auto px-6 pt-12 pb-6">
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-primary transition-all group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Tariffs
        </button>
      </div>

      {/* Hero Section */}
      <section className="relative pt-12 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50/50 to-transparent" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-16">
              
              <div className="flex-1 package-reveal">
                 {pkg.popular && (
                  <div className="inline-flex items-center gap-2 px-5 py-2 rounded-2xl bg-primary text-white text-[10px] font-black uppercase tracking-widest mb-8 shadow-xl shadow-primary/20">
                    <Star size={14} className="fill-white" /> Recommended Deployment
                  </div>
                )}
                
                <div className="flex items-center gap-4 mb-6">
                   <div className="w-12 h-1 bg-primary rounded-full transition-all duration-700" />
                   <span className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">
                     {pkg.type} Infrastructure
                   </span>
                </div>
                
                <h1 className="text-fluid-h1 font-black text-slate-900 mb-8 leading-[0.9]" style={{ fontFamily: 'Poppins' }}>
                   {pkg.name}
                </h1>
                
                <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-2xl">
                   {pkg.description}
                </p>
              </div>

              <div className="lg:w-[420px] flex-shrink-0 package-reveal">
                 <div className="relative bg-slate-900 rounded-3xl p-10 md:p-12 shadow-2xl shadow-slate-300/50 overflow-hidden">
                    <div className="absolute inset-0">
                       <NetworkBackground variant="circuit" opacity={0.06} color="#E30613" />
                    </div>
                    <div className="absolute top-0 right-0 p-8 opacity-10 text-white">
                       <Activity size={100} />
                    </div>
                    
                    <div className="relative z-10">
                       <div className="mb-6">
                          <span className="text-7xl md:text-8xl lg:text-[90px] font-black leading-none tracking-tight text-white" style={{ fontFamily: 'Poppins' }}>
                            {pkg.speed.replace('Mbps', '')}
                          </span>
                          <span className="text-xl font-black text-primary ml-2 uppercase tracking-wide">Mbps</span>
                       </div>
                       
                       <div className="flex items-baseline gap-2 mb-8">
                          <span className="text-3xl md:text-4xl font-black text-white" style={{ fontFamily: 'Poppins' }}>Rs. {pkg.price}</span>
                          <span className="text-slate-500 font-medium text-lg">/ mo</span>
                       </div>

                       <Link to="/contact" className="w-full btn-premium btn-premium-primary justify-center !py-5 font-black text-base">
                         Get Connected <ChevronRight size={20} />
                       </Link>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Specs */}
      <section className="section-premium pt-0">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
            {[
              { label: 'Download Rate', value: pkg.speed, icon: <Download />, color: '#E30613' },
              { label: 'Upload Sync', value: pkg.uploadSpeed, icon: <Upload />, color: '#0ea5e9' },
              { label: 'Latency Map', value: '< 2ms', icon: <Activity />, color: '#10b981' },
              { label: 'Data Protocol', value: 'Unlimited', icon: <Boxes />, color: '#8b5cf6' },
            ].map((s, i) => (
              <div key={i} className="stat-card relative bg-white rounded-3xl p-10 border border-slate-100 shadow-lg shadow-slate-100/50 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-500 overflow-hidden">
                 <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-6" style={{ color: s.color }}>
                    {s.icon}
                 </div>
                 <div className="text-3xl font-black text-slate-900 mb-2" style={{ fontFamily: 'Poppins' }}>{s.value}</div>
                 <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Features */}
            <div className="package-reveal">
               <h3 className="text-2xl font-black text-slate-900 mb-10" style={{ fontFamily: 'Poppins' }}>Infrastructure Features</h3>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 {pkg.features.map((f, i) => (
                   <div key={i} className="feature-item flex items-start gap-4 p-6 rounded-3xl bg-white border border-slate-100 shadow-sm transition-all hover:shadow-lg hover:border-red-100 group">
                     <div className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0 text-primary shadow-sm group-hover:scale-110 transition-transform">
                       <Check size={16} strokeWidth={3} />
                     </div>
                     <span className="text-sm font-bold text-slate-700 leading-tight pt-1">{f}</span>
                   </div>
                 ))}
               </div>
            </div>

            {/* SLA / Quality */}
            <div className="package-reveal">
               <h3 className="text-2xl font-black text-slate-900 mb-10" style={{ fontFamily: 'Poppins' }}>Service Architecture</h3>
               <div className="space-y-6">
                 {[
                   { icon: <Shield size={20} />, label: 'Enterprise Security', desc: 'Bank-grade firewall and malware protection included.' },
                   { icon: <Clock size={20} />, label: '99.9% Uptime SLA', desc: 'Guaranteed network availability for high-priority traffic.' },
                   { icon: <Phone size={20} />, label: 'VIP Technical Support', desc: 'Direct access to senior network engineers 24/7/365.' },
                 ].map((g, i) => (
                   <div key={i} className="sla-card flex gap-6 p-8 rounded-3xl bg-white border border-slate-100 shadow-sm transition-all hover:shadow-lg hover:border-red-100">
                      <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center text-primary flex-shrink-0">
                         {g.icon}
                      </div>
                      <div>
                         <h4 className="text-lg font-black text-slate-900 mb-2" style={{ fontFamily: 'Poppins' }}>{g.label}</h4>
                         <p className="text-sm text-slate-500 font-medium leading-relaxed">{g.desc}</p>
                      </div>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Packages */}
      {relatedPkgs.length > 0 && (
        <section className="section-premium bg-slate-50/30">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center mb-16 package-reveal">
               <h3 className="text-3xl font-black text-slate-900 mb-4" style={{ fontFamily: 'Poppins' }}>Alternative Configs</h3>
               <div className="w-16 h-1 bg-primary mx-auto rounded-full" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPkgs.map(rp => (
                <Link key={rp.id} to={`/package/${rp.id}`}
                  className="related-card relative bg-white rounded-3xl p-10 border border-slate-100 shadow-lg shadow-slate-100/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 p-8 text-primary/5 group-hover:scale-110 transition-transform">
                      <Zap size={80} />
                  </div>
                  
                  <div className="relative z-10">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{rp.name}</div>
                    <div className="text-4xl font-black text-slate-900 mb-6" style={{ fontFamily: 'Poppins' }}>{rp.speed}</div>
                    <div className="flex items-center justify-between">
                       <div className="text-sm font-black text-primary">Rs. {rp.price}/mo</div>
                       <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 transition-all group-hover:bg-primary group-hover:text-white">
                         <ChevronRight size={18} />
                       </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* Bottom CTA */}
      <section className="section-premium relative overflow-hidden bg-slate-900">
         <div className="absolute inset-0">
            <NetworkBackground variant="fiber" opacity={0.07} color="#E30613" />
         </div>
         <div className="container mx-auto px-6 relative z-10 text-center py-12">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-8" style={{ fontFamily: 'Poppins' }}>
              Ready for the <span className="text-primary italic">Next Level?</span>
            </h2>
            <div className="flex flex-wrap justify-center gap-6">
                <Link to="/contact" className="btn-premium btn-premium-primary !px-12 !py-5 text-lg font-black">
                   Deploy Now
                </Link>
                <Link to="/tariff" className="btn-premium !bg-white/10 !text-white !border-white/20 border hover:!bg-white/20 !px-12 !py-5 text-lg font-black">
                   View All Plans
                </Link>
            </div>
         </div>
      </section>
    </div>
  );
}
