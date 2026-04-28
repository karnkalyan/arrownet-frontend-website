import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { Eye, EyeOff, Zap, Lock, Mail, Shield, ArrowRight, User, Terminal, ChevronLeft } from 'lucide-react';
import { useStore } from '../store/useStore';
import toast, { Toaster } from 'react-hot-toast';
import ParticleNetwork from '../components/shared/ParticleNetwork';

export default function Login() {
  const [tab, setTab] = useState<'customer' | 'admin'>('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, logoUrl } = useStore();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.login-reveal', {
        x: -30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out'
      });
      gsap.from('.login-card', {
        scale: 0.95,
        opacity: 0,
        duration: 1,
        ease: 'power4.out',
        delay: 0.2
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error('Identity required.');
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));

    const ok = await login(email, password);
    if (ok) {
      if (tab === 'customer') {
        toast.success('Authentication success. Initializing dashboard...');
        setTimeout(() => navigate('/dashboard'), 1000);
      } else {
        toast.success('Terminal access granted.');
        setTimeout(() => navigate('/admin'), 1000);
      }
    } else {
      toast.error('Permission denied or invalid credentials.');
    }
    setLoading(false);
  };

  const demoAccounts = tab === 'customer'
    ? [
        { label: 'Residential', email: 'ram@arrownet.com.np', pass: 'Admin@123' },
        { label: 'SME / Pro', email: 'sita@arrownet.com.np', pass: 'Admin@123' },
        { label: 'Enterprise', email: 'nepaltech@arrownet.com.np', pass: 'Admin@123' },
      ]
    : [{ label: 'Superuser', email: 'admin@arrownet.com.np', pass: 'Admin@123' }];

  return (
    <div className="min-h-screen flex bg-white selection:bg-primary/20" ref={containerRef}>
      <Toaster position="top-right" />

      {/* Particle Sidebar (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center relative overflow-hidden bg-slate-900">
         <div className="absolute inset-0 z-0">
           <ParticleNetwork count={80} />
         </div>
         <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-red-500/5 z-10" />
         
         <div className="relative z-20 max-w-md p-12 text-center login-reveal">
            <Link to="/" className="inline-block mb-12 hover:scale-105 transition-transform duration-500">
              <img src={logoUrl} alt="Arrownet" className="h-14 brightness-0 invert" 
                   onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            </Link>
            
            <h2 className="text-4xl font-black text-white mb-8" style={{ fontFamily: 'Poppins' }}>
              The Engine Room of Your <span className="text-accent drop-shadow-md">Network.</span>
            </h2>
            <p className="text-lg text-slate-400 font-medium leading-relaxed mb-16">
              Full spectrum control over your digital infrastructure. Monitor, modify, and master your connectivity.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: <Shield size={20} />, label: 'Encrypted', val: 'AES-256' },
                { icon: <Zap size={20} />, label: 'Latency', val: '<2ms' },
                { icon: <User size={20} />, label: 'Auth', val: 'OAuth 2.0' },
                { icon: <Terminal size={20} />, label: 'Access', val: 'Root' },
              ].map((f, i) => (
                <div key={i} className="p-6 rounded-[24px] bg-white/5 border border-white/5 backdrop-blur-md text-left group hover:bg-white/10 transition-all duration-500">
                  <div className="text-accent mb-2 group-hover:scale-110 transition-transform">{f.icon}</div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{f.label}</div>
                  <div className="text-sm font-black text-white">{f.val}</div>
                </div>
              ))}
            </div>
         </div>
      </div>

      {/* Login Area */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 md:p-16 relative bg-slate-50/30">
        <div className="absolute inset-0 opacity-[0.03] z-0" style={{ 
          backgroundImage: 'radial-gradient(circle at 2px 2px, #000 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }} />
        <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/5 via-transparent to-transparent z-0" />
        
        <Link to="/" className="lg:hidden mb-12 relative z-10">
            <img src={logoUrl} alt="Arrownet" className="h-10" />
        </Link>
        
        <div className="w-full max-w-md relative z-10">
           <div className="login-card p-12 rounded-[48px] bg-white border border-slate-100 shadow-2xl shadow-slate-200/50 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 to-red-600" />
              
              <div className="mb-10">
                <h2 className="text-3xl font-black text-slate-900 mb-3" style={{ fontFamily: 'Poppins' }}>Identify.</h2>
                <p className="text-slate-400 font-medium">Please enter your protocol credentials.</p>
              </div>

              {/* Access Switcher */}
              <div className="flex p-2 rounded-[24px] bg-slate-50 mb-12 border border-slate-100">
                {(['customer', 'admin'] as const).map(t => (
                  <button 
                    key={t} 
                    onClick={() => { setTab(t); setEmail(''); setPassword(''); }}
                    className={`
                      flex-1 py-4 rounded-[18px] text-[11px] font-black uppercase tracking-widest transition-all duration-500
                      ${tab === t ? 'bg-white text-primary shadow-xl shadow-slate-200 scale-105' : 'text-slate-400 hover:text-slate-600'}
                    `}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* Demo Keys */}
              <div className="mb-12">
                 <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-4">Demo Access Vectors</div>
                 <div className="flex flex-wrap gap-2">
                    {demoAccounts.map((acc, i) => (
                      <button 
                         key={i} 
                         onClick={() => { setEmail(acc.email); setPassword(acc.pass); }}
                         className="px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl border border-slate-100 text-slate-500 hover:border-primary hover:text-primary transition-all duration-300"
                      >
                         {acc.label}
                      </button>
                    ))}
                 </div>
              </div>

              {/* Inputs */}
              <div className="space-y-6 mb-12">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Identity Vector</label>
                    <div className="relative">
                       <Mail size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                       <input 
                         className="input-premium pl-14" 
                         type="email" 
                         placeholder="username@node"
                         value={email}
                         onChange={e => setEmail(e.target.value)}
                       />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Access Passphrase</label>
                    <div className="relative">
                       <Lock size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                       <input 
                         className="input-premium px-14" 
                         type={showPass ? 'text' : 'password'} 
                         placeholder="••••••••"
                         value={password}
                         onChange={e => setPassword(e.target.value)}
                       />
                       <button 
                          onClick={() => setShowPass(!showPass)}
                          className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-primary transition-colors"
                        >
                          {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                       </button>
                    </div>
                 </div>
              </div>

              <button 
                onClick={handleLogin} 
                disabled={loading}
                className="w-full btn-premium btn-premium-primary !py-5 justify-center shadow-primary/30 group"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Grant Access <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /></>
                )}
              </button>

              <div className="mt-12 pt-8 border-t border-slate-50 text-center">
                 <Link to="/" className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all">
                    <ChevronLeft size={16} /> Decouple Session
                 </Link>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
