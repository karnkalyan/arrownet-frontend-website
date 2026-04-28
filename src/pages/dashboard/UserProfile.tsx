import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { User, Mail, Phone, MapPin, Calendar, Shield, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function UserProfile() {
  const { getCurrentCustomer } = useStore();
  const customer = getCurrentCustomer();
  const [saving, setSaving] = useState(false);

  if (!customer) return <div className="text-center text-slate-400 py-20">Please log in.</div>;

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 1500));
    setSaving(false);
    toast.success('Profile updated successfully!');
  };

  return (
    <div className="space-y-12 max-w-4xl mx-auto">
      <div>
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-2 block">Account Matrix</span>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight" style={{ fontFamily: 'Space Grotesk' }}>My Identity</h1>
        <p className="text-sm text-slate-500 mt-2">Manage your core profile and security protocols.</p>
      </div>

      {/* Profile Header */}
      <div className="card-premium !p-10 border-orange-100 shadow-xl flex flex-col md:flex-row items-center gap-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 text-primary/5">
           <User size={120} />
        </div>
        
        <div className="w-32 h-32 rounded-[40px] flex items-center justify-center text-4xl font-black text-white shadow-2xl shadow-orange-500/30 relative z-10"
          style={{ background: 'linear-gradient(135deg, #f97316, #ef4444)' }}>
          {customer.name.charAt(0)}
        </div>
        
        <div className="text-center md:text-left flex-1 relative z-10">
          <h2 className="text-3xl font-black text-slate-900 mb-2" style={{ fontFamily: 'Space Grotesk' }}>{customer.name}</h2>
          <div className="flex items-center justify-center md:justify-start gap-3 mb-6">
             <span className="text-xs font-bold text-slate-400">{customer.email}</span>
             <div className="w-1 h-1 rounded-full bg-slate-200" />
             <span className="text-xs font-mono font-black text-primary uppercase tracking-widest">{customer.id}</span>
          </div>
          
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
            <span className="badge-premium badge-premium-orange">Node: {customer.id}</span>
            <span className="badge-premium badge-premium-green">Status: {customer.status}</span>
            <span className="badge-premium badge-premium-blue">{customer.planType} Tier</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Personal Info */}
        <div className="card-premium !p-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-8">
             <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                <User size={20} />
             </div>
             <h3 className="text-xl font-black text-slate-900" style={{ fontFamily: 'Space Grotesk' }}>Registry Data</h3>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">Primary Identity</label>
              <div className="relative">
                <User size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                <input className="input-premium pl-14 font-bold" defaultValue={customer.name} />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">Digital Endpoint</label>
              <div className="relative">
                <Mail size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                <input className="input-premium pl-14 font-bold" defaultValue={customer.email} />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">Communication Link</label>
              <div className="relative">
                <Phone size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                <input className="input-premium pl-14 font-bold" defaultValue={customer.phone} />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">Physical Node</label>
              <div className="relative">
                <MapPin size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                <input className="input-premium pl-14 font-bold" defaultValue={customer.address} />
              </div>
            </div>
            <button onClick={handleSave} disabled={saving}
              className="btn-premium btn-premium-primary !w-full !py-4 mt-4">
              {saving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Save size={18} /> Update Core Registry</>}
            </button>
          </div>
        </div>

        {/* Plan & Account Details */}
        <div className="space-y-8">
          <div className="card-premium !p-8 animate-fade-in">
             <div className="flex items-center gap-3 mb-8">
               <div className="w-10 h-10 rounded-xl bg-blue-500/5 flex items-center justify-center text-blue-500">
                  <Shield size={20} />
               </div>
               <h3 className="text-xl font-black text-slate-900" style={{ fontFamily: 'Space Grotesk' }}>Subscription Protocol</h3>
            </div>
            
            <div className="space-y-4">
              {[
                { label: 'Network Tier', value: customer.plan },
                { label: 'Activation Date', value: customer.joinDate },
                { label: 'Lifecycle End', value: customer.expiryDate },
                { label: 'Operational Days', value: `${customer.daysLeft} Cycles` },
              ].map((d, i) => (
                <div key={i} className="flex justify-between items-center p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl transition-all duration-300">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{d.label}</span>
                  <span className="text-sm font-black text-slate-900" style={{ fontFamily: 'Space Grotesk' }}>{d.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Change Password */}
          <div className="card-premium !p-8 animate-fade-in">
            <div className="flex items-center gap-3 mb-8">
               <div className="w-10 h-10 rounded-xl bg-orange-500/5 flex items-center justify-center text-orange-500">
                  <Shield size={20} />
               </div>
               <h3 className="text-xl font-black text-slate-900" style={{ fontFamily: 'Space Grotesk' }}>Security Phase</h3>
            </div>
            
            <div className="space-y-4">
              <input className="input-premium" type="password" placeholder="Current encryption key" />
              <input className="input-premium" type="password" placeholder="New encryption key" />
              <input className="input-premium" type="password" placeholder="Verify new key" />
              <button onClick={() => toast.success('Security protocols updated.')}
                className="btn-premium btn-premium-secondary !w-full !py-4 mt-2">
                Update Credentials
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
