import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Plus, Edit2, Trash2, X, Save, Wifi, Tv, FileText, Layout, Info, PlusCircle, MinusCircle, ArrowUp } from 'lucide-react';
import toast from 'react-hot-toast';

type Tab = 'packages' | 'charges' | 'notes';

export default function TariffManager() {
  const {
    packages, setupCharges, tariffNotes, taxRate,
    addPackage, updatePackage, deletePackage,
    addSetupCharge, updateSetupCharge, deleteSetupCharge,
    addTariffNote, updateTariffNote, deleteTariffNote,
  } = useStore();

  const [tab, setTab] = useState<Tab>('packages');
  const [editId, setEditId] = useState<number | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  // Unified Package Form
  const emptyPackage = {
    name: '', speed: '', type: 'FTTH', description: '', routerInfo: '', isPopular: false,
    features: '', priority: 0,
    pricingTiers: [{ duration: 1, durationUnit: 'Month', basePrice: 0, taxIncPrice: 0, isBestValue: false }],
    benefits: [{ title: '', description: '', icon: '' }]
  };
  const [packageForm, setPackageForm] = useState<any>(emptyPackage);

  // Charge & Note forms
  const emptyCharge = { category: 'Internet', itemName: '', price: '', note: '', sortOrder: 0 };
  const [chargeForm, setChargeForm] = useState<any>(emptyCharge);
  
  const emptyNote = { text: '', sortOrder: 0 };
  const [noteForm, setNoteForm] = useState<any>(emptyNote);

  const resetForms = () => { 
    setEditId(null); 
    setShowAdd(false); 
    setPackageForm(emptyPackage); 
    setChargeForm(emptyCharge);
    setNoteForm(emptyNote);
  };

  const handleSavePackage = async () => {
    if (!packageForm.name || !packageForm.speed) return toast.error('Name and speed are required');
    const ok = editId ? await updatePackage(editId, packageForm) : await addPackage(packageForm);
    if (ok) { toast.success('Saved successfully'); resetForms(); }
  };

  const handleSaveCharge = async () => {
    if (!chargeForm.itemName || !chargeForm.price) return toast.error('Item name and price are required');
    const ok = editId ? await updateSetupCharge(editId, chargeForm) : await addSetupCharge(chargeForm);
    if (ok) { toast.success('Saved successfully'); resetForms(); }
  };

  const handleSaveNote = async () => {
    if (!noteForm.text) return toast.error('Note text is required');
    const ok = editId ? await updateTariffNote(editId, noteForm) : await addTariffNote(noteForm);
    if (ok) { toast.success('Saved successfully'); resetForms(); }
  };

  const addPricingTier = () => setPackageForm({ ...packageForm, pricingTiers: [...packageForm.pricingTiers, { duration: 1, durationUnit: 'Month', basePrice: 0, taxIncPrice: 0 }] });
  const removePricingTier = (idx: number) => setPackageForm({ ...packageForm, pricingTiers: packageForm.pricingTiers.filter((_, i) => i !== idx) });
  
  const addBenefit = () => setPackageForm({ ...packageForm, benefits: [...packageForm.benefits, { title: '', description: '' }] });
  const removeBenefit = (idx: number) => setPackageForm({ ...packageForm, benefits: packageForm.benefits.filter((_, i) => i !== idx) });

  const handleAutoTax = (idx: number) => {
    const p = [...packageForm.pricingTiers];
    if (p[idx].basePrice > 0) p[idx].taxIncPrice = Math.round(p[idx].basePrice * (1 + taxRate/100));
    setPackageForm({ ...packageForm, pricingTiers: p });
  };

  const tabs = [
    { key: 'packages' as Tab, label: 'Packages & Tariffs', icon: <Wifi size={16} /> },
    { key: 'charges' as Tab, label: 'One-Time Charges', icon: <Tv size={16} /> },
    { key: 'notes' as Tab, label: 'Footer Notes', icon: <FileText size={16} /> },
  ];

  return (
    <div className="space-y-12 max-w-7xl mx-auto pb-20">
      <div className="flex justify-between items-end">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-2 block">Unified Management</span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight" style={{ fontFamily: 'Poppins' }}>Package & Tariff Manager</h1>
        </div>
        {!showAdd && !editId && (
          <button onClick={() => setShowAdd(true)} className="btn-premium btn-premium-primary !px-6">
            <Plus size={20} /> New {tab === 'packages' ? 'Package' : tab === 'charges' ? 'Charge' : 'Note'}
          </button>
        )}
      </div>

      <div className="flex gap-2 p-1.5 rounded-2xl bg-slate-50 border border-slate-100 w-fit">
        {tabs.map(t => (
          <button key={t.key} onClick={() => { setTab(t.key); resetForms(); }} className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all ${tab === t.key ? 'bg-white text-primary shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>{t.icon} {t.label}</button>
        ))}
      </div>

      {tab === 'packages' && (
        <>
          {(showAdd || editId) && (
            <div className="card-premium !p-10 border-primary/20 shadow-2xl animate-slide-up space-y-10">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-slate-900" style={{ fontFamily: 'Poppins' }}>{editId ? 'Edit Package' : 'New Package Configuration'}</h3>
                <button onClick={resetForms} className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-50"><X size={20} /></button>
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div><label className="label-premium">Package Name</label><input className="input-premium" value={packageForm.name} onChange={e => setPackageForm({ ...packageForm, name: e.target.value })} placeholder="Arrownet Home Ultra" /></div>
                <div><label className="label-premium">Network Speed</label><input className="input-premium" value={packageForm.speed} onChange={e => setPackageForm({ ...packageForm, speed: e.target.value })} placeholder="200 Mbps" /></div>
                <div><label className="label-premium">Category</label>
                  <select className="input-premium" value={packageForm.type} onChange={e => setPackageForm({ ...packageForm, type: e.target.value })}><option>FTTH</option><option>SOHO</option><option>Corporate</option></select>
                </div>
                <div><label className="label-premium">Router Info</label><input className="input-premium" value={packageForm.routerInfo} onChange={e => setPackageForm({ ...packageForm, routerInfo: e.target.value })} placeholder="Dual-Band G6 Router" /></div>
                <div><label className="label-premium">Priority (Higher = First)</label><input type="number" className="input-premium" value={packageForm.priority} onChange={e => setPackageForm({ ...packageForm, priority: e.target.value })} placeholder="0" /></div>
                <div><label className="label-premium">Quick Features (Comma separated)</label><input className="input-premium" value={packageForm.features} onChange={e => setPackageForm({ ...packageForm, features: e.target.value })} placeholder="Lowest Latency, 24/7 Support..." /></div>
                <div className="md:col-span-3"><label className="label-premium">Hero Description</label><textarea className="input-premium min-h-[100px]" value={packageForm.description} onChange={e => setPackageForm({ ...packageForm, description: e.target.value })} placeholder="Short marketing description..." /></div>
              </div>

              {/* Dynamic Pricing */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2"><Layout size={16} /> Pricing Tiers</h4>
                  <button onClick={addPricingTier} className="text-xs font-black text-primary flex items-center gap-1 hover:underline"><PlusCircle size={14} /> Add Duration</button>
                </div>
                <div className="space-y-4">
                  {packageForm.pricingTiers.map((p: any, idx: number) => (
                    <div key={idx} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100 items-end">
                      <div><label className="text-[9px] font-black uppercase text-slate-400 mb-1 block">Duration</label><input type="number" className="input-premium !py-2" value={p.duration} onChange={e => { const pt = [...packageForm.pricingTiers]; pt[idx].duration = e.target.value; setPackageForm({ ...packageForm, pricingTiers: pt }); }} /></div>
                      <div><label className="text-[9px] font-black uppercase text-slate-400 mb-1 block">Unit</label><select className="input-premium !py-2" value={p.durationUnit} onChange={e => { const pt = [...packageForm.pricingTiers]; pt[idx].durationUnit = e.target.value; setPackageForm({ ...packageForm, pricingTiers: pt }); }}><option>Month</option><option>Months</option><option>Year</option></select></div>
                      <div><label className="text-[9px] font-black uppercase text-slate-400 mb-1 block">Base Price</label><input type="number" className="input-premium !py-2" value={p.basePrice} onBlur={() => handleAutoTax(idx)} onChange={e => { const pt = [...packageForm.pricingTiers]; pt[idx].basePrice = e.target.value; setPackageForm({ ...packageForm, pricingTiers: pt }); }} /></div>
                      <div><label className="text-[9px] font-black uppercase text-slate-400 mb-1 block">Incl. Tax ({taxRate}%)</label><input type="number" className="input-premium !py-2" value={p.taxIncPrice} onChange={e => { const pt = [...packageForm.pricingTiers]; pt[idx].taxIncPrice = e.target.value; setPackageForm({ ...packageForm, pricingTiers: pt }); }} /></div>
                      <div className="flex items-center justify-between pb-3">
                        <label className="flex items-center gap-2 text-[10px] font-bold text-slate-500"><input type="checkbox" checked={p.isBestValue} onChange={e => { const pt = [...packageForm.pricingTiers]; pt[idx].isBestValue = e.target.checked; setPackageForm({ ...packageForm, pricingTiers: pt }); }} /> Best Value</label>
                        <button onClick={() => removePricingTier(idx)} className="text-red-400 hover:text-red-600"><MinusCircle size={18} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Service Benefits */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2"><Info size={16} /> Detailed Benefits</h4>
                  <button onClick={addBenefit} className="text-xs font-black text-primary flex items-center gap-1 hover:underline"><PlusCircle size={14} /> Add Benefit Card</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {packageForm.benefits.map((b: any, idx: number) => (
                    <div key={idx} className="p-6 bg-white border border-slate-200 rounded-2xl relative group">
                      <button onClick={() => removeBenefit(idx)} className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-red-400"><X size={16} /></button>
                      <input className="input-premium !bg-slate-50 mb-3 font-bold" placeholder="Benefit Title (e.g. 24/7 Support)" value={b.title} onChange={e => { const bn = [...packageForm.benefits]; bn[idx].title = e.target.value; setPackageForm({ ...packageForm, benefits: bn }); }} />
                      <textarea className="input-premium !bg-slate-50 text-sm" placeholder="Detailed description of this benefit..." value={b.description} onChange={e => { const bn = [...packageForm.benefits]; bn[idx].description = e.target.value; setPackageForm({ ...packageForm, benefits: bn }); }} />
                    </div>
                  ))}
                </div>
              </div>

              <button onClick={handleSavePackage} className="btn-premium btn-premium-primary !w-full md:!w-fit !px-12 py-5"><Save size={20} /> Save Configuration</button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {packages.map(p => (
              <div key={p.id} className="card-premium flex flex-col md:flex-row gap-6 items-start hover:border-primary/30 transition-all group">
                <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all"><Wifi size={32} /></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-black text-slate-900">{p.name}</h3>
                    <div className="flex gap-2">
                      {p.priority > 0 && <span className="badge-premium badge-premium-amber flex items-center gap-1"><ArrowUp size={10}/> {p.priority}</span>}
                      <span className="badge-premium badge-premium-blue">{p.type}</span>
                    </div>
                  </div>
                  <div className="text-4xl font-black text-slate-900 mb-4" style={{ fontFamily: 'Poppins' }}>{p.speed}</div>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {p.pricingTiers?.map((pt: any, i: number) => (
                      <span key={i} className="px-3 py-1 rounded-lg bg-slate-50 border border-slate-100 text-[10px] font-black text-slate-500">{pt.duration} {pt.durationUnit}</span>
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => { setEditId(p.id); setPackageForm({ ...p, features: p.features || '' }); setShowAdd(false); }} className="btn-premium btn-premium-secondary !py-2 !px-4 text-xs font-black">Edit Setup</button>
                    <button onClick={() => { if (confirm('Delete?')) deletePackage(p.id); }} className="p-3 rounded-xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all"><Trash2 size={16} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === 'charges' && (
        <div className="space-y-8">
           {(showAdd || editId) && (
             <div className="card-premium !p-8 border-primary/20 shadow-xl animate-slide-up space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black text-slate-900">{editId ? 'Edit Charge' : 'New One-Time Charge'}</h3>
                  <button onClick={resetForms} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div><label className="label-premium">Item Name</label><input className="input-premium" value={chargeForm.itemName} onChange={e => setChargeForm({...chargeForm, itemName: e.target.value})} placeholder="Standard Installation" /></div>
                  <div><label className="label-premium">Price</label><input className="input-premium" value={chargeForm.price} onChange={e => setChargeForm({...chargeForm, price: e.target.value})} placeholder="Rs. 500" /></div>
                  <div><label className="label-premium">Category</label>
                    <select className="input-premium" value={chargeForm.category} onChange={e => setChargeForm({...chargeForm, category: e.target.value})}>
                      <option>Internet</option><option>TV</option><option>Combined</option><option>Hardware</option>
                    </select>
                  </div>
                  <div><label className="label-premium">Sort Order</label><input type="number" className="input-premium" value={chargeForm.sortOrder} onChange={e => setChargeForm({...chargeForm, sortOrder: e.target.value})} /></div>
                  <div className="md:col-span-4"><label className="label-premium">Optional Note</label><input className="input-premium" value={chargeForm.note} onChange={e => setChargeForm({...chargeForm, note: e.target.value})} placeholder="Refundable deposit..." /></div>
                </div>
                <button onClick={handleSaveCharge} className="btn-premium btn-premium-primary"><Save size={18} /> Save Charge</button>
             </div>
           )}

           <div className="card-premium !p-0 overflow-hidden">
             <table className="table-premium w-full text-left">
               <thead className="bg-slate-900 text-white"><tr><th className="p-4">Item</th><th>Price</th><th>Category</th><th>Order</th><th>Action</th></tr></thead>
               <tbody>
                 {setupCharges.map(c => (
                   <tr key={c.id} className="border-b hover:bg-slate-50">
                     <td className="p-4 font-bold">{c.itemName}</td><td>{c.price}</td><td>{c.category}</td><td>{c.sortOrder}</td>
                     <td className="p-4 flex gap-2">
                       <button onClick={() => { setEditId(c.id); setChargeForm(c); setShowAdd(false); }} className="text-blue-400"><Edit2 size={16} /></button>
                       <button onClick={() => { if(confirm('Delete?')) deleteSetupCharge(c.id); }} className="text-red-400"><Trash2 size={16} /></button>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </div>
      )}

      {tab === 'notes' && (
        <div className="space-y-8">
           {(showAdd || editId) && (
             <div className="card-premium !p-8 border-primary/20 shadow-xl animate-slide-up space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black text-slate-900">{editId ? 'Edit Note' : 'New Footer Note'}</h3>
                  <button onClick={resetForms} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
                </div>
                <div className="grid grid-cols-1 gap-6">
                  <div><label className="label-premium">Note Text</label><textarea className="input-premium min-h-[100px]" value={noteForm.text} onChange={e => setNoteForm({...noteForm, text: e.target.value})} placeholder="* All prices are exclusive of 13% VAT..." /></div>
                  <div className="w-1/4"><label className="label-premium">Sort Order</label><input type="number" className="input-premium" value={noteForm.sortOrder} onChange={e => setNoteForm({...noteForm, sortOrder: e.target.value})} /></div>
                </div>
                <button onClick={handleSaveNote} className="btn-premium btn-premium-primary"><Save size={18} /> Save Note</button>
             </div>
           )}

           <div className="space-y-4">
             {tariffNotes.map(n => (
               <div key={n.id} className="card-premium flex items-center justify-between p-6">
                 <div className="flex-1">
                   <div className="text-xs font-bold text-slate-400 mb-1">Order: {n.sortOrder}</div>
                   <p className="text-slate-700">{n.text}</p>
                 </div>
                 <div className="flex gap-3">
                    <button onClick={() => { setEditId(n.id); setNoteForm(n); setShowAdd(false); }} className="p-2 rounded-lg bg-blue-50 text-blue-400 hover:bg-blue-500 hover:text-white transition-all"><Edit2 size={16} /></button>
                    <button onClick={() => { if(confirm('Delete?')) deleteTariffNote(n.id); }} className="p-2 rounded-lg bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all"><Trash2 size={16} /></button>
                 </div>
               </div>
             ))}
           </div>
        </div>
      )}
    </div>
  );
}
