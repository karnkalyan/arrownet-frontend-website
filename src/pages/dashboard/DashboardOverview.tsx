import { useStore } from '../../store/useStore';
import { Activity, Wifi, CreditCard, Clock, Zap, ArrowUpRight, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function DashboardOverview() {
  const { getCurrentCustomer } = useStore();
  const customer = getCurrentCustomer();
  if (!customer) return <div className="text-center text-slate-400 py-20">Please log in to view your dashboard.</div>;

  const usage = customer.usage || { totalGB: 0, limitGB: 100, downloadedGB: 0, uploadedGB: 0 };
  const invoices = customer.invoices || [];
  const usagePercent = usage.limitGB > 0 ? Math.round((usage.totalGB / usage.limitGB) * 100) : 0;
  const daysPercent = customer.totalDays > 0 ? Math.round(((customer.totalDays - (customer.daysLeft || 0)) / customer.totalDays) * 100) : 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'Space Grotesk' }}>
            Welcome back, {customer.name.split(' ')[0]}! 👋
          </h1>
          <p className="text-sm text-slate-500 mt-1">Here's an overview of your internet service.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-100 shadow-sm">
          <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ background: customer.status === 'Online' ? '#22c55e' : '#ef4444', boxShadow: `0 0 8px ${customer.status === 'Online' ? '#22c55e' : '#ef4444'}` }} />
          <span className="text-sm font-bold" style={{ color: customer.status === 'Online' ? '#16a34a' : '#dc2626' }}>
            Connection {customer.status}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: <Wifi size={20} />, label: 'Current Plan', value: (customer.plan || 'No Plan').split(' ').slice(0, 2).join(' '), sub: (customer.plan || '').split(' ').pop() || '', color: '#f97316' },
          { icon: <Clock size={20} />, label: 'Days Remaining', value: `${customer.daysLeft || 0}`, sub: `of ${customer.totalDays || 30} days`, color: '#3b82f6' },
          { icon: <Activity size={20} />, label: 'Data Used', value: `${usage.totalGB} GB`, sub: `of ${usage.limitGB} GB`, color: '#8b5cf6' },
          { icon: <CreditCard size={20} />, label: 'Next Bill', value: `Rs. ${invoices[0]?.amount || '0'}`, sub: `Due: ${customer.expiryDate || 'N/A'}`, color: '#22c55e' },
        ].map((s, i) => (
          <div key={i} className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${s.color}10`, color: s.color }}>
                {s.icon}
              </div>
              <ArrowUpRight size={14} className="text-slate-300" />
            </div>
            <div className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'Space Grotesk' }}>{s.value}</div>
            <div className="text-xs font-medium text-slate-400 mt-1">{s.label} · {s.sub}</div>
          </div>
        ))}
      </div>

      {/* Progress Bars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Billing Cycle */}
        <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900" style={{ fontFamily: 'Space Grotesk' }}>Billing Cycle</h3>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100">{customer.daysLeft || 0} days left</span>
          </div>
          <div className="relative w-40 h-40 mx-auto mb-4">
            <svg className="w-full h-full" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r="68" fill="none" stroke="#f1f5f9" strokeWidth="10" />
              <circle cx="80" cy="80" r="68" fill="none" stroke="url(#grad1)" strokeWidth="10" strokeLinecap="round"
                strokeDasharray={`${daysPercent * 4.27} ${427 - daysPercent * 4.27}`}
                transform="rotate(-90 80 80)" />
              <defs><linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#3b82f6" /><stop offset="100%" stopColor="#8b5cf6" /></linearGradient></defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-slate-900" style={{ fontFamily: 'Space Grotesk' }}>{daysPercent}%</span>
              <span className="text-xs text-slate-400">cycle used</span>
            </div>
          </div>
          <p className="text-center text-sm text-slate-500">Expires: <span className="font-bold text-slate-700">{customer.expiryDate || 'N/A'}</span></p>
        </div>

        {/* Data Usage */}
        <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900" style={{ fontFamily: 'Space Grotesk' }}>Data Usage</h3>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-50 text-purple-600 border border-purple-100">{usagePercent}% used</span>
          </div>
          <div className="relative w-40 h-40 mx-auto mb-4">
            <svg className="w-full h-full" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r="68" fill="none" stroke="#f1f5f9" strokeWidth="10" />
              <circle cx="80" cy="80" r="68" fill="none" stroke="url(#grad2)" strokeWidth="10" strokeLinecap="round"
                strokeDasharray={`${usagePercent * 4.27} ${427 - usagePercent * 4.27}`}
                transform="rotate(-90 80 80)" />
              <defs><linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#f97316" /><stop offset="100%" stopColor="#ef4444" /></linearGradient></defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-slate-900" style={{ fontFamily: 'Space Grotesk' }}>{usage.totalGB}</span>
              <span className="text-xs text-slate-400">GB used</span>
            </div>
          </div>
          <div className="flex justify-center gap-6 text-sm">
            <div><span className="text-slate-400">↓</span> <span className="font-bold text-slate-700">{usage.downloadedGB} GB</span></div>
            <div><span className="text-slate-400">↑</span> <span className="font-bold text-slate-700">{usage.uploadedGB} GB</span></div>
          </div>
        </div>
      </div>

      {/* Usage Chart */}
      <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base font-bold text-slate-900" style={{ fontFamily: 'Space Grotesk' }}>Monthly Usage Trend</h3>
          <div className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full">
            <TrendingUp size={12} /> Healthy
          </div>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={customer.monthlyUsage || []}>
            <defs>
              <linearGradient id="dlGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f97316" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#f97316" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="ulGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} unit=" GB" />
            <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, fontSize: 13, boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }} />
            <Area type="monotone" dataKey="download" stroke="#f97316" strokeWidth={2.5} fill="url(#dlGrad)" name="Download" />
            <Area type="monotone" dataKey="upload" stroke="#3b82f6" strokeWidth={2.5} fill="url(#ulGrad)" name="Upload" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
