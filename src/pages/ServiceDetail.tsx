import { useEffect, useRef, ReactElement } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { gsap } from 'gsap';
import {
  ArrowLeft, ArrowRight, Check, Zap, Shield, Wifi, Cable, Radio, Globe,
  Server, Cpu, Clock, Phone, ChevronRight, Activity, Star
} from 'lucide-react';
import { useStore } from '../store/useStore';
import NetworkBackground from '../components/shared/NetworkBackground';
import FloatingElements from '../components/shared/FloatingElements';

const iconMap: Record<string, ReactElement> = {
  fiber: <Globe size={36} />,
  wifi: <Wifi size={36} />,
  cable: <Cable size={36} />,
  hotspot: <Radio size={36} />,
};

const serviceDetails: Record<string, {
  heroDesc: string;
  techSpecs: { label: string; value: string }[];
  features: string[];
  benefits: { icon: ReactElement; title: string; desc: string }[];
  bgVariant: 'circuit' | 'nodes' | 'fiber' | 'grid' | 'wave';
}> = {
  '1': {
    heroDesc: 'Our flagship FTTH service delivers pure fiber optic cables directly to your premises, ensuring symmetric gigabit speeds with zero electromagnetic interference. Experience the gold standard of internet connectivity.',
    techSpecs: [
      { label: 'Max Speed', value: '1 Gbps' },
      { label: 'Latency', value: '<2ms' },
      { label: 'Technology', value: 'GPON' },
      { label: 'Uptime SLA', value: '99.99%' },
    ],
    features: [
      'Dedicated fiber optic core to each premise',
      'Symmetric upload and download bandwidth',
      'Zero signal degradation over distance',
      'No electromagnetic interference',
      'Future-proof for 10Gbps upgrades',
      'Free ONT (Optical Network Terminal) device',
      'Professional fiber splicing and installation',
      'Real-time bandwidth monitoring dashboard',
    ],
    benefits: [
      { icon: <Zap size={22} />, title: 'Ultra-Low Latency', desc: 'Sub-2ms latency for gaming, video calls, and real-time applications.' },
      { icon: <Shield size={22} />, title: 'Fiber Security', desc: 'Optical fiber is virtually impossible to tap without detection.' },
      { icon: <Activity size={22} />, title: 'Consistent Speed', desc: 'No speed degradation during peak hours — dedicated bandwidth.' },
    ],
    bgVariant: 'fiber',
  },
  '2': {
    heroDesc: 'High-speed wireless broadband reaching areas where fiber infrastructure is still developing. Our state-of-the-art radio equipment delivers reliable connectivity across Kathmandu Valley.',
    techSpecs: [
      { label: 'Max Speed', value: '100 Mbps' },
      { label: 'Latency', value: '<10ms' },
      { label: 'Technology', value: '802.11ac' },
      { label: 'Coverage', value: 'Valley-wide' },
    ],
    features: [
      'Point-to-point and point-to-multipoint links',
      'Licensed and unlicensed spectrum operation',
      'Weather-resistant outdoor CPE equipment',
      'Quick installation within 24 hours',
      'Automatic channel selection for minimal interference',
      'Integrated surge protection',
      'Backup radio path availability',
    ],
    benefits: [
      { icon: <Wifi size={22} />, title: 'Rapid Deployment', desc: 'Get connected within 24 hours — no underground cabling required.' },
      { icon: <Globe size={22} />, title: 'Wide Coverage', desc: 'Available in areas where wired infrastructure hasn\'t reached yet.' },
      { icon: <Shield size={22} />, title: 'Encrypted Link', desc: 'AES-256 encryption on all wireless backhaul connections.' },
    ],
    bgVariant: 'wave',
  },
  '3': {
    heroDesc: 'Our hybrid cable broadband combines high-speed internet with premium Cable TV entertainment. The perfect all-in-one solution for households wanting connectivity and content.',
    techSpecs: [
      { label: 'Max Speed', value: '200 Mbps' },
      { label: 'TV Channels', value: '150+' },
      { label: 'Technology', value: 'DOCSIS 3.1' },
      { label: 'Bundle', value: 'Internet + TV' },
    ],
    features: [
      'Bundled internet + Cable TV in one connection',
      '150+ HD and SD channels',
      'Electronic Program Guide (EPG)',
      'DOCSIS 3.1 for gigabit-capable speeds',
      'Set-top box with recording capability',
      'Parental controls for content filtering',
      'Priority streaming quality',
    ],
    benefits: [
      { icon: <Cable size={22} />, title: 'All-in-One', desc: 'Single bill for internet and TV — simplified and cost-effective.' },
      { icon: <Star size={22} />, title: 'Premium Content', desc: 'Access to exclusive sports, movies, and entertainment channels.' },
      { icon: <Cpu size={22} />, title: 'Smart Features', desc: 'Record, pause, and rewind live TV with our smart set-top box.' },
    ],
    bgVariant: 'circuit',
  },
  '4': {
    heroDesc: 'Stay connected on the go with our public Wi-Fi hotspot network deployed across busy areas, cafes, and public spaces in Kathmandu. Simple authentication, reliable speeds.',
    techSpecs: [
      { label: 'Speed', value: '50 Mbps' },
      { label: 'Locations', value: '200+' },
      { label: 'Auth', value: 'Captive Portal' },
      { label: 'Security', value: 'WPA3' },
    ],
    features: [
      'Seamless roaming between hotspot locations',
      'Captive portal authentication — no app needed',
      'Usage-based or time-based billing options',
      'High-density AP deployment for crowded areas',
      'Guest and premium tier access levels',
      'Real-time usage tracking via SMS',
    ],
    benefits: [
      { icon: <Radio size={22} />, title: 'Everywhere', desc: 'Wi-Fi at malls, cafes, parks, and public transport hubs.' },
      { icon: <Clock size={22} />, title: 'Flexible Plans', desc: 'Pay per hour, per day, or get unlimited monthly access.' },
      { icon: <Phone size={22} />, title: 'Easy Access', desc: 'Connect via SMS OTP — no app downloads required.' },
    ],
    bgVariant: 'nodes',
  },
};

function AnimatedSection({ children, index, delay = 0 }: { children: React.ReactNode; index: number; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay: (index * 0.1) + delay, ease: [0.23, 1, 0.32, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function ServiceDetail() {
  const { id } = useParams();
  const { cms } = useStore();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  const service = cms.services.find(s => s.id === Number(id));
  const details = serviceDetails[id || '1'];

  useEffect(() => {
    if (!service) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('.sd-hero > *',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: 'power3.out' }
      );
    }, containerRef);
    return () => ctx.revert();
  }, [service]);

  if (!service || !details) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center p-20 bg-white rounded-3xl border border-slate-100 shadow-xl">
        <h2 className="text-4xl font-black text-slate-900 mb-6" style={{ fontFamily: 'Poppins' }}>Service Not Found</h2>
        <p className="text-slate-400 font-medium mb-10">The requested service is not available.</p>
        <Link to="/" className="btn-premium btn-premium-primary">
          <ArrowLeft size={18} /> Return Home
        </Link>
      </div>
    </div>
  );

  const icon = iconMap[service.icon] || <Globe size={36} />;
  const relatedServices = cms.services.filter(s => s.id !== service.id).slice(0, 3);

  return (
    <div className="bg-white min-h-screen" ref={containerRef}>
      {/* Back */}
      <div className="container mx-auto px-6 pt-12 pb-4">
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-primary transition-all group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back
        </button>
      </div>

      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <NetworkBackground variant={details.bgVariant} opacity={0.06} color="#E30613" />
          <FloatingElements count={8} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-transparent to-white" />
        <div className="container mx-auto px-6 relative z-10 sd-hero">
          <div className="max-w-4xl">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center text-primary shadow-xl shadow-primary/10">
                {icon}
              </div>
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-1">{service.name}</div>
                <h1 className="text-fluid-h1 font-black text-slate-900" style={{ fontFamily: 'Poppins' }}>
                  {service.title}
                </h1>
              </div>
            </div>
            <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-3xl">
              {details.heroDesc}
            </p>
          </div>
        </div>
      </section>

      {/* Tech Specs */}
      <section className="section-premium pt-0">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            {details.techSpecs.map((spec, i) => (
              <AnimatedSection key={i} index={i}>
                <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-lg shadow-slate-100/50 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
                  <div className="text-3xl font-black text-slate-900 mb-2" style={{ fontFamily: 'Poppins' }}>
                    {spec.value}
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">{spec.label}</div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Features */}
            <AnimatedSection index={0}>
              <h3 className="text-2xl font-black text-slate-900 mb-10" style={{ fontFamily: 'Poppins' }}>
                Service Features
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {details.features.map((f, i) => (
                  <AnimatedSection key={i} index={i} delay={0.2}>
                    <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-red-100 transition-all group">
                      <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0 text-primary group-hover:scale-110 transition-transform">
                        <Check size={14} strokeWidth={3} />
                      </div>
                      <span className="text-sm font-bold text-slate-700 leading-tight pt-0.5">{f}</span>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            </AnimatedSection>

            {/* Benefits */}
            <AnimatedSection index={1}>
              <h3 className="text-2xl font-black text-slate-900 mb-10" style={{ fontFamily: 'Poppins' }}>
                Key Benefits
              </h3>
              <div className="space-y-6">
                {details.benefits.map((b, i) => (
                  <AnimatedSection key={i} index={i} delay={0.4}>
                    <div className="flex gap-6 p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-lg hover:border-red-100 transition-all">
                      <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center text-primary flex-shrink-0">
                        {b.icon}
                      </div>
                      <div>
                        <h4 className="text-lg font-black text-slate-900 mb-2" style={{ fontFamily: 'Poppins' }}>{b.title}</h4>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed">{b.desc}</p>
                      </div>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Related Services */}
      <section className="section-premium bg-slate-50/30 relative overflow-hidden">
        <div className="absolute inset-0">
          <NetworkBackground variant="grid" opacity={0.03} color="#94a3b8" />
        </div>
        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-black text-slate-900 mb-4" style={{ fontFamily: 'Poppins' }}>
              Other Services
            </h3>
            <div className="w-16 h-1 bg-primary mx-auto rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedServices.map((rs, i) => (
              <AnimatedSection key={rs.id} index={i}>
                <Link to={`/service/${rs.id}`}
                  className="block bg-white rounded-3xl p-8 border border-slate-100 shadow-lg shadow-slate-100/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group h-full">
                  <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                    {iconMap[rs.icon] || <Globe size={28} />}
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 mb-3" style={{ fontFamily: 'Poppins' }}>{rs.title}</h4>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6">{rs.description}</p>
                  <div className="flex items-center text-primary text-sm font-black uppercase tracking-widest">
                    Learn more <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-premium relative overflow-hidden bg-slate-900">
        <div className="absolute inset-0">
          <NetworkBackground variant="circuit" opacity={0.08} color="#E30613" />
        </div>
        <div className="container mx-auto px-6 relative z-10 text-center py-8">
          <h2 className="text-4xl font-black text-white mb-6" style={{ fontFamily: 'Poppins' }}>
            Ready for <span className="text-primary">{service.title}?</span>
          </h2>
          <p className="text-lg text-slate-400 font-medium max-w-2xl mx-auto mb-10">
            Get connected within 24 hours. Our technical team will handle everything from installation to configuration.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link to="/contact" className="btn-premium btn-premium-primary !px-12 !py-5 text-lg">Get Connected</Link>
            <Link to="/tariff" className="btn-premium !bg-white/10 !text-white !border-white/20 border hover:!bg-white/20 !px-12 !py-5 text-lg">View Plans</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
