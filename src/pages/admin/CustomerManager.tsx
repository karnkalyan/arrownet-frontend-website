import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Search, UserCheck, UserX, RotateCcw, Eye, X, Trash2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

export default function CustomerManager() {
  const { customers, updateCustomerStatus, deleteCustomer } = useStore();
  const [search, setSearch] = useState('');
  const [viewId, setViewId] = useState<string | null>(null);

  const filtered = customers.filter(c => {
    const searchStr = search.toLowerCase();
    return (
      (c.name || '').toLowerCase().includes(searchStr) ||
      (c.id || '').toLowerCase().includes(searchStr) ||
      (c.user?.email || '').toLowerCase().includes(searchStr)
    );
  });

  const viewCustomer = customers.find(c => c.id === viewId);

  return (
    <div className="space-y-12 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-2 block">Subscriber Registry</span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight" style={{ fontFamily: 'Poppins' }}>Customer Control</h1>
          <p className="text-sm text-slate-500 mt-2">Manage and monitor active network subscribers.</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input className="input-premium pl-12" placeholder="Scan by Name, ID, or Email..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {/* Detail View */}
      {viewCustomer && (
        <div className="card-premium !p-8 animate-slide-up relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 text-primary/5">
              <UserCheck size={120} />
           </div>
           
          <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-50 relative z-10">
            <div>
              <h3 className="text-2xl font-black text-slate-900 mb-1" style={{ fontFamily: 'Poppins' }}>{viewCustomer.name}</h3>
              <div className="flex items-center gap-3">
                 <span className="text-xs font-mono font-bold text-slate-400 tracking-widest">{viewCustomer.id}</span>
                 <div className="w-1 h-1 rounded-full bg-slate-200" />
                 <span className="text-xs font-bold text-primary">{viewCustomer.user?.email || viewCustomer.email}</span>
              </div>
            </div>
            <button onClick={() => setViewId(null)} className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all">
               <X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12 relative z-10">
            {[
              { label: 'Bandwidth Consumed', val: `${viewCustomer.usage?.reduce((acc: number, curr: any) => acc + curr.totalGB, 0) || 0} GB`, icon: <RotateCcw size={14} />, color: 'orange' },
              { label: 'Contract Lifecycle', val: `30 Days`, icon: <RotateCcw size={14} />, color: 'blue' },
              { label: 'Connectivity State', val: viewCustomer.status, icon: <div className="w-2 h-2 rounded-full" style={{ background: viewCustomer.status === 'Online' ? '#22c55e' : '#ef4444' }} />, color: viewCustomer.status === 'Online' ? 'green' : 'red' },
              { label: 'Active Incidents', val: viewCustomer.tickets?.length || 0, icon: <RotateCcw size={14} />, color: 'purple' },
            ].map((stat, i) => (
              <div key={i} className="p-6 rounded-3xl bg-slate-50/50 border border-slate-100/50 text-center flex flex-col items-center">
                <div className="text-2xl font-black text-slate-900 mb-2" style={{ fontFamily: 'Poppins' }}>{stat.val}</div>
                <div className="flex items-center gap-2">
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="relative z-10 p-6 rounded-3xl bg-white border border-slate-50 shadow-sm">
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={viewCustomer.usage?.map((u: any) => ({ month: u.period, download: u.downloadedGB })) || []}>
                <defs>
                  <linearGradient id="custDL" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--primary)" stopOpacity={0.2} /><stop offset="100%" stopColor="var(--primary)" stopOpacity={0} /></linearGradient>
                </defs>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 700 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 700 }} />
                <Tooltip 
                   contentStyle={{ background: '#fff', border: 'none', borderRadius: 16, boxShadow: '0 10px 30px rgba(0,0,0,0.05)', padding: '12px 16px' }} 
                   labelStyle={{ fontWeight: 900, fontSize: 12, marginBottom: 4 }}
                />
                <Area type="monotone" dataKey="download" stroke="var(--primary)" strokeWidth={3} fill="url(#custDL)" name="Download Velocity" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Customer Registry */}
      <div className="card-premium !p-0 border-slate-50 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-premium">
            <thead>
              <tr>
                <th className="!pl-8">Node / Identity</th>
                <th>Classification</th>
                <th>Connectivity</th>
                <th>Metric Usage</th>
                <th className="text-right !pr-8">Protocol Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id}>
                  <td className="!pl-8">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black text-white shadow-lg shadow-primary/20" style={{ background: 'linear-gradient(135deg, #E30613, #ef4444)' }}>{c.name.charAt(0)}</div>
                      <div>
                         <div className="font-black text-slate-900">{c.name}</div>
                         <div className="text-[10px] font-mono text-slate-400 uppercase tracking-tighter">{c.id}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`badge-premium badge-premium-${c.plan?.type === 'FTTH' ? 'orange' : c.plan?.type === 'SOHO' ? 'blue' : 'purple'}`}>
                       {c.plan?.type || c.planType || 'N/A'}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: c.status === 'Online' ? '#22c55e' : '#ef4444', boxShadow: `0 0 10px ${c.status === 'Online' ? '#22c55e' : '#ef4444'}` }} />
                      <span className="text-[10px] font-black uppercase tracking-wider" style={{ color: c.status === 'Online' ? '#16a34a' : '#dc2626' }}>{c.status}</span>
                    </div>
                  </td>
                  <td className="text-sm font-black text-slate-700">{c.usage?.reduce((acc: number, curr: any) => acc + curr.totalGB, 0) || 0} <span className="text-[10px] text-slate-400 uppercase">GB</span></td>
                  <td className="text-right !pr-8">
                    <div className="flex items-center justify-end gap-3">
                      <button onClick={() => setViewId(c.id)} className="w-9 h-9 rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white transition-all border border-slate-100 flex items-center justify-center" title="Analyze Node"><Eye size={14} /></button>
                      {c.status === 'Online' ? (
                        <button onClick={() => { updateCustomerStatus(c.id, 'Suspended'); toast.success(`${c.name} Suspended`); }} className="w-9 h-9 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all border border-red-100 flex items-center justify-center" title="Terminate Signal"><UserX size={14} /></button>
                      ) : (
                        <button onClick={() => { updateCustomerStatus(c.id, 'Online'); toast.success(`${c.name} Initialized`); }} className="w-9 h-9 rounded-xl bg-green-50 text-green-500 hover:bg-green-500 hover:text-white transition-all border border-green-100 flex items-center justify-center" title="Restore Link"><UserCheck size={14} /></button>
                      )}
                      <button onClick={() => toast.success(`Recovery sequence transmitted to ${c.email}`)} className="w-9 h-9 rounded-xl bg-red-50 text-primary hover:bg-primary hover:text-white transition-all border border-red-100 flex items-center justify-center" title="Reset Credentials"><RotateCcw size={14} /></button>
                      <button onClick={() => { deleteCustomer(c.id); toast.success(`${c.name} Archived`); }} className="w-9 h-9 rounded-xl bg-slate-50 text-slate-400 hover:bg-red-500 hover:text-white transition-all border border-slate-100 flex items-center justify-center" title="Archive Node"><Trash2 size={14} /></button>
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
