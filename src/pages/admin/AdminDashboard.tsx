import { useStore } from '../../store/useStore';
import { Users, Package, Headphones, TrendingUp, CreditCard, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function AdminDashboard() {
  const { customers, packages, tickets } = useStore();

  const revenueData = [
    { month: 'Aug', revenue: 45000 }, { month: 'Sep', revenue: 52000 }, { month: 'Oct', revenue: 48000 },
    { month: 'Nov', revenue: 61000 }, { month: 'Dec', revenue: 58000 }, { month: 'Jan', revenue: 67000 },
  ];

  const openTickets = tickets.filter(t => t.status === 'Open').length;
  const inProgressTickets = tickets.filter(t => t.status === 'In Progress').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'Poppins' }}>Admin Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Overview of your ISP operations.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: <Users size={20} />, label: 'Total Customers', value: customers.length, color: '#3b82f6', change: '+12%' },
          { icon: <Package size={20} />, label: 'Active Packages', value: packages.length, color: '#E30613', change: '+3' },
          { icon: <Headphones size={20} />, label: 'Open Tickets', value: openTickets + inProgressTickets, color: '#ef4444', change: `${openTickets} new` },
          { icon: <CreditCard size={20} />, label: 'Monthly Revenue', value: 'Rs. 67K', color: '#22c55e', change: '+15%' },
        ].map((s, i) => (
          <div key={i} className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${s.color}10`, color: s.color }}>{s.icon}</div>
              <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">{s.change}</span>
            </div>
            <div className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'Poppins' }}>{s.value}</div>
            <div className="text-xs font-medium text-slate-400 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base font-bold text-slate-900" style={{ fontFamily: 'Poppins' }}>Revenue Trend</h3>
          <div className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full"><TrendingUp size={12} /> Growing</div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={revenueData} barCategoryGap="25%">
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
            <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12 }} />
            <Bar dataKey="revenue" fill="url(#revGrad)" radius={[6, 6, 0, 0]} name="Revenue (Rs.)" />
            <defs><linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#E30613" /><stop offset="100%" stopColor="#ef4444" /></linearGradient></defs>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Tickets */}
        <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-4" style={{ fontFamily: 'Poppins' }}>Recent Tickets</h3>
          <div className="space-y-3">
            {tickets.slice(0, 4).map(t => (
              <div key={t.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-slate-800 truncate">{t.subject}</div>
                  <div className="text-xs text-slate-400">{t.customer?.name ?? 'Customer'} · {t.createdAt ? new Date(t.createdAt).toLocaleDateString() : ''}</div>
                </div>
                <span className={`badge ${t.status === 'Open' ? 'badge-blue' : t.status === 'In Progress' ? 'badge-orange' : 'badge-green'}`}>{t.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Status */}
        <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-4" style={{ fontFamily: 'Poppins' }}>Customer Status</h3>
          <div className="space-y-3">
            {customers.slice(0, 6).map(c => (
              <div key={c.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg, #E30613, #ef4444)' }}>
                    {c.name?.charAt(0) ?? '?'}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-800">{c.name}</div>
                    <div className="text-xs text-slate-400">{c.plan?.name ?? c.plan?.type ?? 'No Plan'}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: c.status === 'Online' ? '#22c55e' : '#ef4444' }} />
                  <span className="text-xs font-bold" style={{ color: c.status === 'Online' ? '#16a34a' : '#dc2626' }}>{c.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
