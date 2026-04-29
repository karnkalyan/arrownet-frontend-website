import { useParams, Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { useEffect, useState } from 'react';
import { 
  Wifi, ShieldCheck, Zap, Globe, CreditCard, 
  ArrowLeft, ArrowRight, CheckCircle2, Clock, Headphones, 
  Signal, Lock, Star, Play
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function PackageDetail() {
  const { id } = useParams();
  const { packages, setupCharges, taxRate, fetchInitialData } = useStore();
  const [activeTier, setActiveTier] = useState<any>(null);
  const pkg = packages.find(p => p.id === Number(id));

  useEffect(() => {
    fetchInitialData();
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (packages.length > 0) {
      const timer = setTimeout(() => {
        if (document.querySelectorAll('.detail-animate').length > 0) {
          gsap.fromTo(".detail-animate", 
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power4.out" }
          );
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [packages]);

  useEffect(() => {
    if (pkg && pkg.pricingTiers?.length > 0) {
      // Default to best value or first tier
      const best = pkg.pricingTiers.find((t: any) => t.isBestValue) || pkg.pricingTiers[0];
      setActiveTier(best);
    }
  }, [pkg]);

  if (!pkg) return (
    <div className="h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <h2 className="text-2xl font-black text-slate-900 mb-4">Package not found</h2>
        <Link to="/tariff" className="btn-premium btn-premium-primary">Back to Plans</Link>
      </div>
    </div>
  );

  return (
    <div className="bg-slate-50 min-h-screen pt-32 pb-32">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Navigation & Header */}
        <div className="mb-12">
          <Link to="/tariff" className="inline-flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest hover:gap-4 transition-all mb-8">
            <ArrowLeft size={16} /> All Packages
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 detail-animate opacity-0">
            <div>
              <span className="badge-premium badge-premium-blue mb-4">{pkg.type} Connectivity</span>
              <h1 className="text-5xl font-black text-slate-900 tracking-tight" style={{ fontFamily: 'Poppins' }}>{pkg.name}</h1>
              
              <div className="flex flex-wrap gap-2 mt-6">
                {(pkg.features || '').split(',').filter(Boolean).map((f: string, i: number) => (
                  <span key={i} className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100 text-[10px] font-bold text-slate-600 flex items-center gap-1.5">
                    <Zap size={10} className="text-primary" /> {f.trim()}
                  </span>
                ))}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Standard Speed</div>
              <div className="text-5xl font-black text-primary" style={{ fontFamily: 'Poppins' }}>{pkg.speed}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 detail-animate opacity-0">
          
          {/* LEFT COLUMN: Main Specs & Pricing */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* 1. Plan Comparison / Selection */}
            <div className="card-premium !p-10 bg-white border-slate-100 shadow-2xl shadow-slate-200/50">
               <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                 <CreditCard size={24} className="text-primary" /> Plan Charges & Duration
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                 {pkg.pricingTiers?.map((tier: any, i: number) => (
                   <button 
                     key={i}
                     onClick={() => setActiveTier(tier)}
                     className={`p-6 rounded-[2rem] border-2 transition-all text-left relative overflow-hidden ${activeTier?.id === tier.id ? 'border-primary bg-primary/5 shadow-lg scale-[1.02]' : 'border-slate-100 bg-white hover:border-slate-200'}`}
                   >
                     {tier.isBestValue && <span className="absolute top-0 right-0 bg-primary text-white text-[8px] font-black uppercase px-4 py-1.5 rounded-bl-2xl">Best Value</span>}
                     <div className="text-lg font-black text-slate-900 mb-1">{tier.duration} {tier.durationUnit}</div>
                     <div className="text-2xl font-black text-primary mb-1">Rs. {tier.taxIncPrice?.toLocaleString() || '0'}</div>
                     <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Incl. VAT</div>
                   </button>
                 ))}
               </div>

               {/* Active Plan Detail Table */}
               {activeTier && (
                 <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                       <div><label className="text-[10px] font-black uppercase text-slate-400 block mb-2">Internet Speed</label><div className="text-xl font-black text-slate-900">{pkg.speed}</div></div>
                       <div><label className="text-[10px] font-black uppercase text-slate-400 block mb-2">Total Price</label><div className="text-xl font-black text-primary">Rs. {activeTier.taxIncPrice?.toLocaleString() || '0'}</div></div>
                       <div><label className="text-[10px] font-black uppercase text-slate-400 block mb-2">Duration</label><div className="text-xl font-black text-slate-900">{activeTier.duration} {activeTier.durationUnit}</div></div>
                       <div><label className="text-[10px] font-black uppercase text-slate-400 block mb-2">Router</label><div className="text-xl font-black text-slate-900">{pkg.routerInfo || 'Standard G6'}</div></div>
                    </div>
                 </div>
               )}
            </div>

            {/* 2. Descriptive Benefit Cards (WorldLink Style) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {pkg.benefits?.map((benefit: any, i: number) => (
                 <div key={i} className="card-premium bg-white border-slate-100 group hover:border-primary/20 transition-all p-10">
                    <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all mb-6">
                       {i === 0 ? <Zap size={28} /> : i === 1 ? <ShieldCheck size={28} /> : i === 2 ? <Globe size={28} /> : <Headphones size={28} />}
                    </div>
                    <h4 className="text-xl font-black text-slate-900 mb-4">{benefit.title}</h4>
                    <p className="text-slate-500 leading-relaxed text-sm">{benefit.description}</p>
                 </div>
               ))}
            </div>

          </div>

          {/* RIGHT COLUMN: Sidebar (Setup Charges & Subscribe) */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Setup Charges Summary */}
            <div className="card-premium bg-slate-900 text-white !p-8 border-none sticky top-32 shadow-2xl">
              <h3 className="text-xl font-black mb-6 border-b border-white/10 pb-4">One Time Setup Charges</h3>
              <div className="space-y-4 mb-8">
                {setupCharges.filter(c => c.category === 'Internet').map((charge) => (
                   <div key={charge.id} className="flex justify-between items-center text-sm">
                      <span className="text-slate-400 font-bold">{charge.itemName}</span>
                      <span className="font-black text-primary">{charge.price}</span>
                   </div>
                ))}
              </div>
              <div className="p-6 bg-white/5 rounded-2xl mb-8">
                <p className="text-xs text-slate-400 leading-relaxed italic">
                   * These packages are intended for residential use only. Fair Usage Policy is applicable. 
                   ONU Rental and Deposit are standard for new installations.
                </p>
              </div>
              <button className="btn-premium btn-premium-primary !w-full !py-6 text-lg tracking-tight">Subscribe Now</button>
              <div className="mt-4 text-center">
                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Fastest Deployment in Kathmandu Valley</span>
              </div>
            </div>

            {/* Support Widget */}
            <div className="card-premium !p-8 bg-white border-slate-100">
               <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-500"><Clock size={24} /></div>
                  <div><div className="text-sm font-black text-slate-900">24/7 Priority Support</div><div className="text-xs text-slate-400">Response within 30 mins</div></div>
               </div>
               <p className="text-xs text-slate-500 leading-relaxed">Our dedicated technical team is available around the clock to ensure your {pkg.speed} connection remains rock-solid.</p>
            </div>

          </div>

        </div>

        {/* Similar Packages Section */}
        <div className="mt-32">
           <div className="flex items-center gap-4 mb-12">
             <h2 className="text-3xl font-black text-slate-900" style={{ fontFamily: 'Poppins' }}>Explore More Packages</h2>
             <div className="h-px flex-1 bg-slate-200" />
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {packages.filter(p => p.id !== pkg.id).slice(0, 3).map(p => (
               <Link to={`/package/${p.id}`} key={p.id} className="card-premium bg-white border-slate-100 hover:scale-[1.02] transition-all p-8 flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-black text-primary uppercase tracking-widest mb-2">{p.speed}</div>
                    <h4 className="text-lg font-black text-slate-900 mb-4">{p.name}</h4>
                    <div className="flex flex-wrap gap-2 mb-8">
                      {(p.features || '').split(',').filter(Boolean).map((f: string, i: number) => (
                        <span key={i} className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100 text-[8px] font-bold text-slate-500">
                          {f.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-50">
                     <span className="text-xs font-bold text-slate-400">View Details</span>
                     <ArrowRight size={16} className="text-primary" />
                  </div>
               </Link>
             ))}
           </div>
        </div>

      </div>
    </div>
  );
}
