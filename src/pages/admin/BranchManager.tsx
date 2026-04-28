import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Plus, Trash2, X, Save, MapPin, Edit3, Phone, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

export default function BranchManager() {
  const { branches, addBranch, deleteBranch, updateBranch } = useStore();
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: '', address: '', phone: '', email: '', lat: '', lon: '', zone: '' });

  const resetForm = () => { setForm({ name: '', address: '', phone: '', email: '', lat: '', lon: '', zone: '' }); setShowAdd(false); setEditId(null); };

  const handleSave = () => {
    if (!form.name || !form.address || !form.lat || !form.lon || !form.zone) return toast.error('Fill required fields (name, address, lat, lon, zone)');
    const lat = parseFloat(form.lat);
    const lon = parseFloat(form.lon);
    if (isNaN(lat) || isNaN(lon)) return toast.error('Latitude and Longitude must be valid numbers');
    if (lat < 26 || lat > 31 || lon < 79 || lon > 89) return toast.error('Coordinates must be within Nepal boundaries');

    const branchData = { name: form.name, address: form.address, phone: form.phone, email: form.email, lat, lon, zone: form.zone };

    if (editId) {
      updateBranch(editId, branchData);
      toast.success('Branch updated!');
    } else {
      addBranch({ ...branchData, id: Date.now() });
      toast.success('Branch added!');
    }
    resetForm();
  };

  const handleEdit = (branch: any) => {
    setForm({ name: branch.name, address: branch.address, phone: branch.phone, email: branch.email, lat: String(branch.lat), lon: String(branch.lon), zone: branch.zone });
    setEditId(branch.id);
    setShowAdd(true);
  };

  return (
    <div className="space-y-12 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-2 block">Network Coverage</span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight" style={{ fontFamily: 'Poppins' }}>Branch Manager</h1>
          <p className="text-sm text-slate-500 mt-2">{branches.length} branches configured for the map locator</p>
        </div>
        <button onClick={() => { resetForm(); setShowAdd(true); }} className="btn-premium btn-premium-primary !px-6">
          <Plus size={20} /> Add Branch
        </button>
      </div>

      {showAdd && (
        <div className="card-premium !p-8 border-primary/20 shadow-xl animate-slide-up">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-slate-900" style={{ fontFamily: 'Poppins' }}>{editId ? 'Edit Branch' : 'Add New Branch'}</h3>
            <button onClick={resetForm} className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-50"><X size={20} /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">Branch Name *</label>
              <input className="input-premium font-bold" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Arrownet Lalitpur Branch" />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">Zone / District *</label>
              <input className="input-premium" value={form.zone} onChange={e => setForm({ ...form, zone: e.target.value })} placeholder="e.g. Kathmandu, Lalitpur, Bhaktapur" />
            </div>
            <div className="md:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">Full Address *</label>
              <input className="input-premium" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="e.g. Kupondole, Lalitpur" />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">Phone Number</label>
              <input className="input-premium" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+977 1 XXXXXXX" />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">Email</label>
              <input className="input-premium" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="branch@arrownet.com.np" />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">Latitude * <span className="text-slate-300 normal-case">(e.g. 27.6946)</span></label>
              <input className="input-premium" type="number" step="0.0001" value={form.lat} onChange={e => setForm({ ...form, lat: e.target.value })} placeholder="27.6946" />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">Longitude * <span className="text-slate-300 normal-case">(e.g. 85.3106)</span></label>
              <input className="input-premium" type="number" step="0.0001" value={form.lon} onChange={e => setForm({ ...form, lon: e.target.value })} placeholder="85.3106" />
            </div>
          </div>
          <div className="mt-4 p-4 rounded-xl bg-blue-50 border border-blue-100">
            <p className="text-xs text-blue-600 font-medium">💡 <strong>Tip:</strong> Get coordinates by right-clicking on Google Maps and selecting "What's here?" The latitude and longitude determine where the pin appears on the Nepal map in the Branch Locator.</p>
          </div>
          <button onClick={handleSave} className="btn-premium btn-premium-primary !w-full md:!w-fit !px-10 mt-8">
            <Save size={18} /> {editId ? 'Update Branch' : 'Add Branch'}
          </button>
        </div>
      )}

      {/* Branch Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {branches.map((branch: any) => (
          <div key={branch.id} className="card-premium animate-fade-in group">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                <MapPin size={20} />
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(branch)} className="w-8 h-8 rounded-lg bg-blue-50 text-blue-400 hover:bg-blue-500 hover:text-white transition-all flex items-center justify-center"><Edit3 size={13} /></button>
                <button onClick={() => { deleteBranch(branch.id); toast.success('Branch deleted'); }} className="w-8 h-8 rounded-lg bg-red-50 text-red-300 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"><Trash2 size={13} /></button>
              </div>
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1" style={{ fontFamily: 'Poppins' }}>{branch.name}</h3>
            <p className="text-xs text-slate-500 mb-4">{branch.address}</p>
            <div className="space-y-2 pt-4 border-t border-slate-50">
              {branch.phone && (
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Phone size={12} className="text-slate-400" /> {branch.phone}
                </div>
              )}
              {branch.email && (
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Mail size={12} className="text-slate-400" /> {branch.email}
                </div>
              )}
              <div className="flex items-center gap-4 pt-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Zone: {branch.zone}</span>
                <span className="text-[10px] font-mono text-slate-300">{branch.lat.toFixed(4)}, {branch.lon.toFixed(4)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
