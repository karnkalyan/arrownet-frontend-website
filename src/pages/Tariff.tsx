import { useEffect, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { Wifi, ArrowRight, ShieldCheck, Zap, Globe, CreditCard, ChevronDown, Server, Activity, Monitor } from 'lucide-react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Tariff() {
  const { packages, setupCharges, tariffNotes, taxRate, fetchInitialData } = useStore();

  useEffect(() => {
    fetchInitialData();
  }, []);

  const groupedPackages = useMemo(() => {
    return {
      ftth: packages.filter(p => p.type === 'FTTH'),
      soho: packages.filter(p => p.type === 'SOHO')
    };
  }, [packages]);

  useEffect(() => {
    if (packages.length > 0) {
      const timer = setTimeout(() => {
        ScrollTrigger.getAll().forEach(t => t.kill());
        gsap.utils.toArray('.tariff-card').forEach((card: any) => {
          gsap.fromTo(card, 
            { y: 60, opacity: 0 },
            { 
              y: 0, 
              opacity: 1, 
              duration: 1, 
              ease: "power4.out",
              scrollTrigger: {
                trigger: card,
                start: "top 85%",
                toggleActions: "play none none none"
              }
            }
          );
        });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [packages]);

  const renderPackageList = (plans: any[], title: string, icon: any) => (
    <div className="mb-32">
      <div className="flex items-center gap-4 mb-12">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
        <h2 className="text-4xl font-black text-slate-900 tracking-tight" style={{ fontFamily: 'Poppins' }}>{title}</h2>
        <div className="h-px flex-1 bg-slate-200" />
      </div>
      <div className="space-y-12">
        {plans.map((pkg) => (
          <div key={pkg.id} className="tariff-card opacity-0 bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-100 shadow-xl shadow-slate-200/50 hover:border-primary/20 transition-all group overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32 transition-all group-hover:bg-primary/10" />
            <div className="relative flex flex-col lg:flex-row gap-12">
              <div className="lg:w-1/3">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-xs font-black uppercase tracking-widest text-slate-400">{pkg.type} Plan</span>
                </div>
                <h2 className="text-4xl font-black text-slate-900 mb-2 leading-tight">{pkg.name}</h2>
                <div className="text-5xl font-black text-primary mb-6" style={{ fontFamily: 'Poppins' }}>{pkg.speed}</div>
                <p className="text-slate-500 mb-8 leading-relaxed line-clamp-3 font-medium">{pkg.description}</p>
                <div className="flex flex-wrap gap-2 mb-10">
                  {(pkg.features || '').split(',').filter(Boolean).map((f: string, i: number) => (
                    <span key={i} className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100 text-[10px] font-bold text-slate-600 flex items-center gap-1.5">
                      <Zap size={10} className="text-primary" /> {f.trim()}
                    </span>
                  ))}
                </div>
                <Link to={`/package/${pkg.id}`} className="btn-premium btn-premium-primary !w-full !py-5 flex items-center justify-center gap-3 shadow-lg shadow-primary/20">
                  View Package Details <ArrowRight size={20} />
                </Link>
              </div>
              <div className="flex-1">
                <div className="rounded-[2.5rem] border border-slate-100 overflow-hidden bg-slate-50/50 shadow-inner">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-900 text-white">
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest">Duration</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-right">Inclusive Rate (VAT {taxRate}%)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pkg.pricingTiers?.map((price: any, idx: number) => (
                        <tr key={idx} className={`border-b border-slate-100 bg-white transition-all hover:bg-slate-50`}>
                          <td className="px-8 py-6">
                            <span className="text-xl font-black text-slate-900">{price.duration} {price.durationUnit}</span>
                            {price.isBestValue && <span className="ml-3 px-3 py-1 rounded-full bg-primary text-white text-[8px] font-black uppercase tracking-wider">Best Value</span>}
                          </td>
                          <td className="px-8 py-6 text-right">
                            <div className="text-3xl font-black text-primary">Rs. {price.taxIncPrice.toLocaleString()}</div>
                            <div className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">Total Price Incl. Taxes</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="text-center mb-20">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-4 block">Ultimate Connectivity</span>
          <h1 className="text-6xl font-black text-slate-900 mb-6 tracking-tight" style={{ fontFamily: 'Poppins' }}>
            Broadband <span className="text-primary italic">Solutions</span>
          </h1>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg font-medium">
            High-speed internet designed for modern homes and scaleable businesses. 
            Completely transparent, ultra-reliable.
          </p>
        </div>

        {/* Home Packages */}
        {renderPackageList(groupedPackages.ftth, 'Home FTTH Plans', <Wifi size={24} />)}

        {/* SOHO Packages */}
        {renderPackageList(groupedPackages.soho, 'Business SOHO Plans', <Server size={24} />)}

        {/* Setup Charges Section */}
        <div className="mt-32">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
               <Activity size={24} />
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight" style={{ fontFamily: 'Poppins' }}>One-Time Setup Charges</h2>
            <div className="h-px flex-1 bg-slate-200" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Internet Charges */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl hover:shadow-2xl transition-all overflow-hidden relative group p-10">
               <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl -mr-24 -mt-24 transition-all group-hover:bg-primary/10" />
               <div className="relative">
                 <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-6">
                    <div>
                      <h3 className="text-2xl font-black text-slate-900">Internet Installation</h3>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Setup & Hardware</p>
                    </div>
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Wifi size={28} />
                    </div>
                 </div>
                 <div className="space-y-6">
                    {setupCharges.filter(c => c.category === 'Internet').map((charge) => (
                      <div key={charge.id} className="flex justify-between items-center group/item">
                         <div>
                            <div className="text-slate-900 font-black text-lg group-hover/item:text-primary transition-colors">{charge.itemName}</div>
                            <div className="text-[10px] text-slate-400 font-bold uppercase mt-1">{charge.note}</div>
                         </div>
                         <div className="text-2xl font-black text-primary">{charge.price}</div>
                      </div>
                    ))}
                 </div>
               </div>
            </div>

            {/* TV Charges */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl hover:shadow-2xl transition-all overflow-hidden relative group p-10">
               <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl -mr-24 -mt-24 transition-all group-hover:bg-blue-500/10" />
               <div className="relative">
                 <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-6">
                    <div>
                      <h3 className="text-2xl font-black text-slate-900">IPTV Setup Charges</h3>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Set-Top Box & Cable</p>
                    </div>
                    <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                      <Monitor size={28} />
                    </div>
                 </div>
                 <div className="space-y-6">
                    {setupCharges.filter(c => c.category === 'TV').map((charge) => (
                      <div key={charge.id} className="flex justify-between items-center group/item">
                         <div>
                            <div className="text-slate-900 font-black text-lg group-hover/item:text-blue-500 transition-colors">{charge.itemName}</div>
                            <div className="text-[10px] text-slate-400 font-bold uppercase mt-1">{charge.note}</div>
                         </div>
                         <div className="text-2xl font-black text-slate-900">{charge.price}</div>
                      </div>
                    ))}
                 </div>
               </div>
            </div>
          </div>
        </div>

        {/* Footer Notes (Detailed Update) */}
        {tariffNotes.length > 0 && (
          <div className="mt-32 p-16 rounded-[3rem] bg-slate-900 text-slate-400 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-32 -mt-32" />
            <h4 className="text-white font-black uppercase tracking-[0.3em] text-xs mb-12 flex items-center gap-3">
              <ShieldCheck className="text-primary" size={16} /> Important Terms & Conditions
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8 relative">
              {tariffNotes.map((note, idx) => (
                <div key={idx} className="flex gap-6 text-sm leading-relaxed group">
                  <span className="text-primary font-black text-lg leading-none opacity-50 group-hover:opacity-100 transition-opacity">{String(idx + 1).padStart(2, '0')}</span>
                  <p className="font-medium">{note.text}</p>
                </div>
              ))}
            </div>
            <div className="mt-16 pt-12 border-t border-white/5 text-[10px] uppercase font-black tracking-widest text-slate-500 text-center">
               Arrownet Pvt. Ltd. © {new Date().getFullYear()} - All Rights Reserved
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
