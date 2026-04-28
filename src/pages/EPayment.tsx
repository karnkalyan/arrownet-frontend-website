import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { CreditCard, CheckCircle, X, Zap, Shield, HelpCircle, Wallet, ArrowRight } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const paymentMethods = [
  {
    id: 'esewa', name: 'eSewa', color: '#00a651', 
    icon: <img src="/esewa.png" alt="eSewa" className="w-10 h-10 object-contain" />,
    desc: 'Instant digital wallet settlement',
  },
  {
    id: 'khalti', name: 'Khalti', color: '#5c2d91', 
    icon: <img src="/khalti.png" alt="Khalti" className="w-10 h-10 object-contain" />,
    desc: 'Secure mobile payment gateway',
  },
  {
    id: 'connectips', name: 'ConnectIPS', color: '#1565c0', 
    icon: <img src="/connectips.png" alt="ConnectIPS" className="w-10 h-10 object-contain" />,
    desc: 'Direct bank-to-bank transfer',
  },
  {
    id: 'card', name: 'Card Payment', color: '#2D0A6E', 
    icon: <img src="/cards.png" alt="Cards" className="w-10 h-10 object-contain" />,
    desc: 'Visa, Mastercard & SCT',
  },
];

export default function EPayment() {
  const [selected, setSelected] = useState<string | null>(null);
  const [customerId, setCustomerId] = useState('');
  const [amount, setAmount] = useState('');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.payment-reveal', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out'
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const handlePay = async () => {
    if (!selected || !customerId || !amount) {
      toast.error('Please complete all fields');
      return;
    }
    setProcessing(true);
    await new Promise(r => setTimeout(r, 2000));
    setProcessing(false);
    setSuccess(true);
  };

  return (
    <div className="bg-white min-h-screen" ref={containerRef}>
      <Toaster position="top-right" />

      {/* Hero */}
      <section className="relative py-24 overflow-hidden bg-slate-50/50">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50/30 via-white to-transparent" />
        <div className="container mx-auto px-6 text-center relative z-10 payment-reveal">
           <div className="inline-flex items-center gap-3 px-5 py-2 rounded-2xl bg-white border border-slate-100 shadow-xl shadow-slate-200/40 mb-10">
              <Shield size={16} className="text-primary" />
              <span className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500">Secure Payment Gateway</span>
           </div>
           <h1 className="text-fluid-h1 font-black text-slate-900 mb-6" style={{ fontFamily: 'Poppins' }}>Zero Friction <span className="gradient-text">Billing.</span></h1>
           <p className="text-xl text-slate-400 font-medium max-w-xl mx-auto">Settle your account in seconds using Nepal's most trusted digital payment protocols.</p>
        </div>
      </section>

      <div className="container mx-auto px-6 pb-32">
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-12">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-3 space-y-8">
            <div className="payment-reveal p-10 rounded-[32px] bg-white border border-slate-100 shadow-2xl shadow-slate-200/50">
              <div className="flex items-center justify-between mb-10">
                 <h2 className="text-2xl font-black text-slate-900" style={{ fontFamily: 'Poppins' }}>Client Selection</h2>
                 <HelpCircle size={20} className="text-slate-300" />
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">Subscriber Identity</label>
                  <input 
                    className="input-premium" 
                    placeholder="Enter Customer ID or Username"
                    value={customerId} 
                    onChange={e => setCustomerId(e.target.value)} 
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">Recharge Amount (NPR)</label>
                  <div className="relative">
                    <input 
                      className="input-premium pl-14" 
                      type="number" 
                      placeholder="0.00"
                      value={amount} 
                      onChange={e => setAmount(e.target.value)} 
                    />
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 font-black">Rs</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="payment-reveal p-10 rounded-[32px] bg-white border border-slate-100 shadow-2xl shadow-slate-200/50">
              <h2 className="text-2xl font-black text-slate-900 mb-10" style={{ fontFamily: 'Poppins' }}>Settlement Channel</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {paymentMethods.map(m => (
                  <button 
                    key={m.id} 
                    onClick={() => setSelected(m.id)}
                    className={`
                      p-6 rounded-2xl text-left transition-all duration-500 group relative overflow-hidden
                      ${selected === m.id ? 'ring-2 ring-primary bg-red-50/20' : 'bg-slate-50 border border-transparent hover:border-slate-200'}
                    `}
                  >
                    <div className="flex items-center justify-between mb-6">
                       <div 
                         className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${selected === m.id ? 'bg-primary text-white' : 'bg-white text-slate-400 group-hover:text-primary group-hover:scale-110'}`}
                         style={{ color: selected === m.id ? 'white' : m.color }}
                       >
                         {m.icon}
                       </div>
                       {selected === m.id && (
                         <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white">
                            <CheckCircle size={14} />
                         </div>
                       )}
                    </div>
                    <div className="text-lg font-black text-slate-900 mb-1" style={{ fontFamily: 'Poppins' }}>{m.name}</div>
                    <p className="text-[12px] text-slate-400 font-medium leading-relaxed">{m.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Summary Card */}
          <div className="lg:col-span-2">
             <div className="payment-reveal sticky top-32 p-10 rounded-[32px] bg-slate-900 text-white shadow-2xl shadow-primary/10 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full" />
                
                <h3 className="text-xl font-black mb-10 pb-6 border-b border-white/5" style={{ fontFamily: 'Poppins' }}>Transaction Summary</h3>
                
                <div className="space-y-6 mb-12">
                   <div className="flex justify-between items-center text-slate-400 text-sm">
                      <span>Service Platform</span>
                      <span className="text-white font-bold">Arrownet Fiber</span>
                   </div>
                   <div className="flex justify-between items-center text-slate-400 text-sm">
                      <span>Identity</span>
                      <span className="text-white font-bold truncate max-w-[120px]">{customerId || '--'}</span>
                   </div>
                   <div className="flex justify-between items-center text-slate-400 text-sm">
                      <span>Tax / TSC</span>
                      <span className="text-white font-bold">Inclusive</span>
                   </div>
                   <div className="pt-6 border-t border-white/5 flex justify-between items-center">
                      <span className="text-slate-400 text-sm">Total Payable</span>
                      <span className="text-3xl font-black text-primary" style={{ fontFamily: 'Poppins' }}>Rs. {amount || '0'}</span>
                   </div>
                </div>

                <button 
                  onClick={handlePay} 
                  disabled={processing}
                  className="w-full btn-premium btn-premium-primary !py-5 justify-center shadow-primary/30"
                >
                  {processing ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>Settlement <ArrowRight size={20} /></>
                  )}
                </button>
                
                <div className="mt-8 flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-500">
                   <Zap size={14} className="text-primary" />
                   Military-grade Encryption Active
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Success Success Overlay */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-lg p-12 rounded-[40px] bg-white text-center relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 to-red-500" />
              
              <button 
                onClick={() => setSuccess(false)}
                className="absolute top-8 right-8 p-3 rounded-2xl bg-slate-50 text-slate-300 hover:text-slate-900 transition-all"
              >
                <X size={20} />
              </button>

              <div className="w-24 h-24 rounded-[32px] bg-green-50 flex items-center justify-center text-green-500 mx-auto mb-8 shadow-xl shadow-green-500/10">
                 <CheckCircle size={48} />
              </div>

              <h3 className="text-3xl font-black text-slate-900 mb-4" style={{ fontFamily: 'Poppins' }}>Payment Finalized.</h3>
              <p className="text-slate-400 font-medium mb-10">Your account will be reactivated within the next 300 seconds. A digital invoice has been dispatched to your primary email.</p>
              
              <div className="p-6 rounded-2xl bg-slate-50 text-left mb-12">
                 <div className="flex justify-between mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Transaction Ref</span>
                    <span className="text-xs font-black text-slate-900">ARN-{Math.random().toString(36).slice(2, 10).toUpperCase()}</span>
                 </div>
                 <div className="flex justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Timestamp</span>
                    <span className="text-xs font-black text-slate-900">{new Date().toLocaleString()}</span>
                 </div>
              </div>

              <button 
                onClick={() => { setSuccess(false); setAmount(''); setCustomerId(''); setSelected(null); }}
                className="w-full btn-premium btn-premium-primary !py-4 justify-center"
              >
                Return to Dashboard
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
