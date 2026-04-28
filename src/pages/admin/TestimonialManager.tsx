import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Plus, Trash2, X, Save, Star, Edit3, Building2, Landmark } from 'lucide-react';
import toast from 'react-hot-toast';

export default function TestimonialManager() {
  const { testimonials, addTestimonial, deleteTestimonial, updateTestimonial } = useStore();
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: '', designation: '', company: '', type: 'corporate' as 'corporate' | 'government', quote: '', rating: 5 });

  const resetForm = () => { setForm({ name: '', designation: '', company: '', type: 'corporate', quote: '', rating: 5 }); setShowAdd(false); setEditId(null); };

  const handleSave = () => {
    if (!form.name || !form.company || !form.quote) return toast.error('Fill required fields');
    if (editId) {
      updateTestimonial(editId, form);
      toast.success('Testimonial updated!');
    } else {
      addTestimonial({ ...form, id: Date.now() });
      toast.success('Testimonial added!');
    }
    resetForm();
  };

  const handleEdit = (t: any) => {
    setForm({ name: t.name, designation: t.designation, company: t.company, type: t.type, quote: t.quote, rating: t.rating });
    setEditId(t.id);
    setShowAdd(true);
  };

  return (
    <div className="space-y-12 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-2 block">Social Proof</span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight" style={{ fontFamily: 'Poppins' }}>Testimonials</h1>
          <p className="text-sm text-slate-500 mt-2">{testimonials.length} testimonials · {testimonials.filter(t => t.type === 'corporate').length} Corporate · {testimonials.filter(t => t.type === 'government').length} Government</p>
        </div>
        <button onClick={() => { resetForm(); setShowAdd(true); }} className="btn-premium btn-premium-primary !px-6">
          <Plus size={20} /> Add Testimonial
        </button>
      </div>

      {showAdd && (
        <div className="card-premium !p-8 border-primary/20 shadow-xl animate-slide-up">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-slate-900" style={{ fontFamily: 'Poppins' }}>{editId ? 'Edit Testimonial' : 'New Testimonial'}</h3>
            <button onClick={resetForm} className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-50"><X size={20} /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">Full Name *</label>
              <input className="input-premium font-bold" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Rajesh Hamal" />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">Designation</label>
              <input className="input-premium" value={form.designation} onChange={e => setForm({ ...form, designation: e.target.value })} placeholder="e.g. IT Director" />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">Company / Organization *</label>
              <input className="input-premium" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} placeholder="e.g. Nepal Tech Corp" />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">Type *</label>
              <select className="input-premium" value={form.type} onChange={e => setForm({ ...form, type: e.target.value as any })}>
                <option value="corporate">Corporate</option>
                <option value="government">Government</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">Rating (1-5)</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map(r => (
                  <button key={r} onClick={() => setForm({ ...form, rating: r })} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${r <= form.rating ? 'bg-accent text-yellow-900' : 'bg-slate-50 text-slate-300'}`}>
                    <Star size={16} className={r <= form.rating ? 'fill-current' : ''} />
                  </button>
                ))}
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">Testimonial Quote *</label>
              <textarea className="input-premium min-h-[120px]" value={form.quote} onChange={e => setForm({ ...form, quote: e.target.value })} placeholder="What the client says about Arrownet..." />
            </div>
          </div>
          <button onClick={handleSave} className="btn-premium btn-premium-primary !w-full md:!w-fit !px-10 mt-8">
            <Save size={18} /> {editId ? 'Update' : 'Add Testimonial'}
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials.map((t: any) => (
          <div key={t.id} className="card-premium animate-fade-in group">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-lg ${t.type === 'corporate' ? 'bg-secondary' : 'bg-primary'}`} style={{ fontFamily: 'Poppins' }}>
                  {t.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{t.name}</h3>
                  <p className="text-xs text-slate-500">{t.designation} · {t.company}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(t)} className="w-8 h-8 rounded-lg bg-blue-50 text-blue-400 hover:bg-blue-500 hover:text-white transition-all flex items-center justify-center"><Edit3 size={13} /></button>
                <button onClick={() => { deleteTestimonial(t.id); toast.success('Deleted'); }} className="w-8 h-8 rounded-lg bg-red-50 text-red-300 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"><Trash2 size={13} /></button>
              </div>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed italic mb-4">"{t.quote}"</p>
            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map(r => (
                  <Star key={r} size={12} className={r <= t.rating ? 'text-accent fill-accent' : 'text-slate-200'} />
                ))}
              </div>
              <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${t.type === 'corporate' ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary'}`}>
                {t.type === 'corporate' ? <><Building2 size={10} className="inline mr-1" />Corporate</> : <><Landmark size={10} className="inline mr-1" />Government</>}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
