import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Plus, Trash2, X, Save, HelpCircle, Edit3 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function FAQManager() {
  const { faqs, addFAQ, deleteFAQ, updateFAQ } = useStore();
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ question: '', answer: '', category: 'General' });

  const categories = ['Plans', 'Installation', 'Equipment', 'Coverage', 'Billing', 'Service', 'Support', 'General'];

  const resetForm = () => { setForm({ question: '', answer: '', category: 'General' }); setShowAdd(false); setEditId(null); };

  const handleSave = () => {
    if (!form.question || !form.answer) return toast.error('Fill required fields');
    if (editId) {
      updateFAQ(editId, form);
      toast.success('FAQ updated!');
    } else {
      addFAQ({ ...form, id: Date.now() });
      toast.success('FAQ added!');
    }
    resetForm();
  };

  const handleEdit = (faq: any) => {
    setForm({ question: faq.question, answer: faq.answer, category: faq.category });
    setEditId(faq.id);
    setShowAdd(true);
  };

  return (
    <div className="space-y-12 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-2 block">Knowledge Base</span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight" style={{ fontFamily: 'Poppins' }}>FAQ Manager</h1>
          <p className="text-sm text-slate-500 mt-2">{faqs.length} questions published</p>
        </div>
        <button onClick={() => { resetForm(); setShowAdd(true); }} className="btn-premium btn-premium-primary !px-6">
          <Plus size={20} /> Add FAQ
        </button>
      </div>

      {showAdd && (
        <div className="card-premium !p-8 border-primary/20 shadow-xl animate-slide-up">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-slate-900" style={{ fontFamily: 'Poppins' }}>{editId ? 'Edit FAQ' : 'New FAQ'}</h3>
            <button onClick={resetForm} className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-50"><X size={20} /></button>
          </div>
          <div className="space-y-6">
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">Category</label>
              <select className="input-premium" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                {categories.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">Question *</label>
              <input className="input-premium font-bold" value={form.question} onChange={e => setForm({ ...form, question: e.target.value })} placeholder="e.g. What internet speeds does Arrownet offer?" />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">Answer *</label>
              <textarea className="input-premium min-h-[120px]" value={form.answer} onChange={e => setForm({ ...form, answer: e.target.value })} placeholder="Detailed answer..." />
            </div>
          </div>
          <button onClick={handleSave} className="btn-premium btn-premium-primary !w-full md:!w-fit !px-10 mt-8">
            <Save size={18} /> {editId ? 'Update FAQ' : 'Add FAQ'}
          </button>
        </div>
      )}

      <div className="space-y-4">
        {faqs.map((faq: any, i: number) => (
          <div key={faq.id} className="card-premium animate-fade-in group">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-primary flex-shrink-0 font-black text-sm" style={{ fontFamily: 'Poppins' }}>
                  {i + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded-lg bg-primary/10 text-[9px] font-black uppercase tracking-widest text-primary">{faq.category}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">{faq.question}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">{faq.answer}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(faq)} className="w-9 h-9 rounded-xl bg-blue-50 text-blue-400 hover:bg-blue-500 hover:text-white transition-all border border-blue-100 flex items-center justify-center"><Edit3 size={14} /></button>
                <button onClick={() => { deleteFAQ(faq.id); toast.success('FAQ deleted'); }} className="w-9 h-9 rounded-xl bg-red-50 text-red-300 hover:bg-red-500 hover:text-white transition-all border border-red-100 flex items-center justify-center"><Trash2 size={14} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
