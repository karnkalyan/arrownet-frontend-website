import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Plus, Edit2, Trash2, Star, X, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PackageManager() {
  const { packages, updatePackage, addPackage, deletePackage } = useStore();
  const [editId, setEditId] = useState<number | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', speed: '', price: '', type: 'FTTH', popular: false, uploadSpeed: '', data: 'Unlimited', description: '', features: '', isActive: true });

  const handleEdit = (pkg: any) => {
    setEditId(pkg.id);
    setForm({ name: pkg.name, speed: pkg.speed, price: pkg.price, type: pkg.type, popular: pkg.popular, uploadSpeed: pkg.uploadSpeed, data: pkg.data, description: pkg.description, features: pkg.features.join(', '), isActive: pkg.isActive ?? true });
  };

  const handleSave = async () => {
    if (!form.name || !form.speed || !form.price) return toast.error('Fill required fields');
    const data = { ...form, features: form.features.split(',').map(f => f.trim()).filter(Boolean) };
    if (editId) {
      const ok = await updatePackage(editId, data);
      if (ok) toast.success('Package updated!');
      else toast.error('Failed to update package');
    } else {
      const ok = await addPackage({ ...data, tv: false } as any);
      if (ok) toast.success('Package added!');
      else toast.error('Failed to add package');
    }
    setEditId(null);
    setShowAdd(false);
    setForm({ name: '', speed: '', price: '', type: 'FTTH', popular: false, uploadSpeed: '', data: 'Unlimited', description: '', features: '', isActive: true });
  };

  const handleDelete = (id: number) => {
    deletePackage(id);
    toast.success('Package deleted');
  };

  const formUI = (
    <div className="card-premium !p-8 border-red-100 shadow-xl mb-12 animate-slide-up">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-black text-slate-900" style={{ fontFamily: 'Poppins' }}>
           {editId ? 'Modify Architecture' : 'Initialize New Node'}
        </h3>
        <button onClick={() => { setEditId(null); setShowAdd(false); }} className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-all"><X size={20} /></button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div><label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">Designation Name *</label><input className="input-premium font-bold" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Ultra Fiber Fix" /></div>
        <div><label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">Bandwidth Velocity *</label><input className="input-premium font-bold" value={form.speed} onChange={e => setForm({ ...form, speed: e.target.value })} placeholder="e.g. 100Mbps" /></div>
        <div><label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">Subscription Rate *</label><input className="input-premium" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="e.g. 1500" /></div>
        <div><label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">Upstream Sync Rate</label><input className="input-premium" value={form.uploadSpeed} onChange={e => setForm({ ...form, uploadSpeed: e.target.value })} placeholder="e.g. 100Mbps" /></div>
        <div>
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">Infrastructure Type</label>
          <select className="input-premium" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
            <option>FTTH</option>
            <option>SOHO</option>
            <option>Corporate</option>
          </select>
        </div>
        <div><label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">Data Allocation</label><input className="input-premium" value={form.data} onChange={e => setForm({ ...form, data: e.target.value })} /></div>
        <div className="md:col-span-2"><label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">Deployment Description</label><textarea className="input-premium min-h-[80px]" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Brief summary of this package deployment..." /></div>
        <div className="md:col-span-2"><label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">Feature Protocols (comma-separated)</label><input className="input-premium" value={form.features} onChange={e => setForm({ ...form, features: e.target.value })} placeholder="Fiber To Home, 24/7 Support, Free Router..." /></div>
        
        <div className="flex items-center gap-3 py-2">
           <label className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" checked={form.popular} onChange={e => setForm({ ...form, popular: e.target.checked })} className="w-5 h-5 rounded-lg border-2 border-slate-200 text-primary focus:ring-primary transition-all" />
              <span className="text-sm font-bold text-slate-700 group-hover:text-primary transition-colors">Mark as Recommended deployment</span>
           </label>
           <label className="flex items-center gap-3 cursor-pointer group ml-4">
              <input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} className="w-5 h-5 rounded-lg border-2 border-slate-200 text-green-500 focus:ring-green-500 transition-all" />
              <span className="text-sm font-bold text-slate-700 group-hover:text-green-500 transition-colors">Active Package</span>
           </label>
        </div>
      </div>
      
      <button onClick={handleSave} className="btn-premium btn-premium-primary !w-full md:!w-fit !px-10 mt-8">
        <Save size={18} /> {editId ? 'Commit Changes' : 'Initialize Deployment'}
      </button>
    </div>
  );

  return (
    <div className="space-y-12 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-2 block">Infrastructure Control</span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight" style={{ fontFamily: 'Poppins' }}>Package Matrix</h1>
          <p className="text-sm text-slate-500 mt-2">Manage global internet tiers and protocol configurations.</p>
        </div>
        <button onClick={() => { setShowAdd(true); setEditId(null); setForm({ name: '', speed: '', price: '', type: 'FTTH', popular: false, uploadSpeed: '', data: 'Unlimited', description: '', features: '', isActive: true }); }}
          className="btn-premium btn-premium-primary !px-6">
          <Plus size={20} /> New Infrastructure Node
        </button>
      </div>

      {(showAdd || editId) && formUI}

      {/* Package Table */}
      <div className="card-premium !p-0 border-slate-50 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-premium">
            <thead>
              <tr>
                <th className="!pl-8">Designation</th>
                <th>Classification</th>
                <th>Bandwidth</th>
                <th>Financials</th>
                <th>Status</th>
                <th className="text-right !pr-8">Operations</th>
              </tr>
            </thead>
            <tbody>
              {packages.map(pkg => (
                <tr key={pkg.id}>
                  <td className="!pl-8">
                    <div className="text-sm font-black text-slate-900">{pkg.name}</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{pkg.data}</div>
                  </td>
                  <td>
                    <span className={`badge-premium badge-premium-${pkg.type === 'FTTH' ? 'orange' : pkg.type === 'SOHO' ? 'blue' : 'purple'}`}>
                      {pkg.type}
                    </span>
                  </td>
                  <td className="font-black text-slate-900" style={{ fontFamily: 'Poppins' }}>{pkg.speed}</td>
                  <td className="font-black text-slate-900 tracking-tight">Rs. {pkg.price} <span className="text-[10px] text-slate-400">/mo</span></td>
                  <td>
                    {pkg.popular ? 
                      <div className="flex items-center gap-1.5 text-[10px] font-black text-primary uppercase tracking-widest bg-red-50 px-3 py-1 rounded-full w-fit border border-red-100 mb-1">
                        <Star size={12} className="fill-orange-500" /> Recommended
                      </div>
                      : <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest block mb-1">Standard</span>
                    }
                    {pkg.isActive ? 
                      <span className="text-[10px] font-black text-green-600 bg-green-50 px-2 py-1 rounded-md uppercase tracking-wider">Active</span> :
                      <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-2 py-1 rounded-md uppercase tracking-wider">Inactive</span>
                    }
                  </td>
                  <td className="text-right !pr-8">
                    <div className="flex items-center justify-end gap-3">
                      <button onClick={() => handleEdit(pkg)} className="w-9 h-9 rounded-xl bg-slate-50 text-slate-400 hover:bg-primary hover:text-white transition-all border border-slate-100 flex items-center justify-center">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => handleDelete(pkg.id)} className="w-9 h-9 rounded-xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all border border-red-100 flex items-center justify-center">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
