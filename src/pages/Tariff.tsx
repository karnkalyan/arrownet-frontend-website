import { useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Wifi, ArrowRight, ShieldCheck, Zap, Globe, CreditCard, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';

export default function Tariff() {
  const { packages, setupCharges, tariffNotes, taxRate, fetchInitialData } = useStore();

  useEffect(() => {
    fetchInitialData();
    gsap.from(".tariff-card", { y: 30, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power4.out" });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="text-center mb-20">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-4 block animate-fade-in">Ultimate Connectivity</span>
          <h1 className="text-6xl font-black text-slate-900 mb-6 tracking-tight" style={{ fontFamily: 'Poppins' }}>
            Choose Your <span className="text-primary italic">Broadband</span> Plan
          </h1>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg">
            High-speed internet solutions designed for homes and businesses. 
            No hidden costs. Completely transparent.
          </p>
        </div>

        {/* Dynamic Package List */}
        <div className="space-y-12">
          {packages.map((pkg) => (
            <div key={pkg.id} className="tariff-card bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-100 shadow-xl shadow-slate-200/50 hover:border-primary/20 transition-all group overflow-hidden relative">
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32 transition-all group-hover:bg-primary/10" />
              
              <div className="relative flex flex-col lg:flex-row gap-12">
                {/* Left: Plan Summary */}
                <div className="lg:w-1/3">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                      <Wifi size={24} />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest text-slate-400">{pkg.type} Plan</span>
                  </div>
                  <h2 className="text-4xl font-black text-slate-900 mb-2 leading-tight">{pkg.name}</h2>
                  <div className="text-5xl font-black text-primary mb-6" style={{ fontFamily: 'Poppins' }}>{pkg.speed}</div>
                  <p className="text-slate-500 mb-8 leading-relaxed line-clamp-3">{pkg.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-8">
                    {(pkg.features || '').split(',').filter(Boolean).map((f: string, i: number) => (
                      <span key={i} className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100 text-[10px] font-bold text-slate-600 flex items-center gap-1.5">
                        <Zap size={10} className="text-primary" /> {f.trim()}
                      </span>
                    ))}
                  </div>

                  <Link to={`/package/${pkg.id}`} className="btn-premium btn-premium-primary !w-full !py-5 flex items-center justify-center gap-3">
                    View Package Details <ArrowRight size={20} />
                  </Link>
                </div>

                {/* Right: Pricing Table */}
                <div className="flex-1">
                  <div className="rounded-[2rem] border border-slate-100 overflow-hidden bg-slate-50/50">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-900 text-white">
                          <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest">Duration</th>
                          <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest">Standard Rate</th>
                          <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest">Inclusive Rate (VAT {taxRate}%)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pkg.pricingTiers?.map((price: any, idx: number) => (
                          <tr key={idx} className={`border-b border-slate-100 bg-white transition-all hover:bg-slate-50 ${price.isBestValue ? 'relative z-10 scale-[1.01] shadow-lg ring-1 ring-primary/20' : ''}`}>
                            <td className="px-8 py-6">
                              <span className="text-xl font-black text-slate-900">{price.duration} {price.durationUnit}</span>
                              {price.isBestValue && <span className="ml-3 px-2 py-1 rounded-md bg-primary text-white text-[8px] font-black uppercase tracking-wider">Best Value</span>}
                            </td>
                            <td className="px-8 py-6">
                              <div className="text-xs text-slate-400 font-bold mb-1">Standard</div>
                              <div className="text-xl font-black text-slate-600">Rs. {price.basePrice.toLocaleString()}</div>
                            </td>
                            <td className="px-8 py-6">
                              <div className="text-xs text-primary font-bold mb-1 italic">Total Price</div>
                              <div className="text-2xl font-black text-primary">Rs. {price.taxIncPrice.toLocaleString()}</div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-slate-400 px-4">
                    <Info size={12} /> Prices mentioned are per billing cycle. Fair Usage Policy (FUP) applies on all plans.
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Setup Charges Section */}
        <div className="mt-32">
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-3xl font-black text-slate-900" style={{ fontFamily: 'Poppins' }}>One-Time Setup Charges</h2>
            <div className="h-px flex-1 bg-slate-200" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {setupCharges.map((charge) => (
              <div key={charge.id} className="card-premium !p-8 border-slate-100 bg-white flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${charge.category === 'Internet' ? 'bg-blue-50 text-blue-500' : 'bg-purple-50 text-purple-500'}`}>
                      {charge.category} Setup
                    </span>
                    <span className="text-2xl font-black text-slate-900">{charge.price}</span>
                  </div>
                  <h3 className="text-lg font-black text-slate-800 mb-2">{charge.itemName}</h3>
                  {charge.note && <p className="text-xs text-slate-400 leading-relaxed italic">{charge.note}</p>}
                </div>
                <div className="mt-6 pt-6 border-t border-slate-50 flex items-center gap-2 text-slate-300">
                   <ShieldCheck size={16} /> <span className="text-[9px] font-bold uppercase">Industry Standard Hardware</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Notes */}
        {tariffNotes.length > 0 && (
          <div className="mt-20 p-12 rounded-[2.5rem] bg-slate-900 text-slate-400 space-y-6">
            <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8">Important Terms & Conditions</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              {tariffNotes.map((note, idx) => (
                <div key={idx} className="flex gap-4 text-sm leading-relaxed">
                  <span className="text-primary font-black">{idx + 1}.</span>
                  <p>{note.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Info({ size, className }: { size: number, className?: string }) {
  return <div className={`flex items-center justify-center rounded-full border border-current ${className}`} style={{ width: size, height: size }}>
    <span className="text-[10px] font-black">!</span>
  </div>;
}
