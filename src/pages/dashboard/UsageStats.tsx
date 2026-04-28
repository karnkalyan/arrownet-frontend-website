import { useStore } from '../../store/useStore';
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { TrendingUp, Download, Upload, ArrowDown, ArrowUp } from 'lucide-react';

export default function UsageStats() {
  const { getCurrentCustomer } = useStore();
  const customer = getCurrentCustomer();
  if (!customer) return <div className="text-center text-slate-400 py-20">Please log in.</div>;

  const monthlyUsage = customer.monthlyUsage || [];
  const data = monthlyUsage.map((d: any) => ({ ...d, name: d.month || d.period || 'N/A' }));
  const totalDl = data.reduce((s: number, d: any) => s + (d.download || 0), 0);
  const totalUl = data.reduce((s: number, d: any) => s + (d.upload || 0), 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'Space Grotesk' }}>Usage & Statistics</h1>
        <p className="text-sm text-slate-500 mt-1">Monitor your bandwidth consumption over time.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500"><Download size={18} /></div>
            <span className="text-sm font-bold text-slate-500">Total Download</span>
          </div>
          <div className="text-3xl font-bold text-slate-900" style={{ fontFamily: 'Space Grotesk' }}>{totalDl.toLocaleString()} <span className="text-base text-slate-400">GB</span></div>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500"><Upload size={18} /></div>
            <span className="text-sm font-bold text-slate-500">Total Upload</span>
          </div>
          <div className="text-3xl font-bold text-slate-900" style={{ fontFamily: 'Space Grotesk' }}>{totalUl.toLocaleString()} <span className="text-base text-slate-400">GB</span></div>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-500"><TrendingUp size={18} /></div>
            <span className="text-sm font-bold text-slate-500">Total Traffic</span>
          </div>
          <div className="text-3xl font-bold text-slate-900" style={{ fontFamily: 'Space Grotesk' }}>{(totalDl + totalUl).toLocaleString()} <span className="text-base text-slate-400">GB</span></div>
        </div>
      </div>

      {/* Area Chart */}
      {data.length > 0 ? (
        <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-6" style={{ fontFamily: 'Space Grotesk' }}>Bandwidth Usage — Monthly</h3>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="dlA" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f97316" stopOpacity={0.3} /><stop offset="100%" stopColor="#f97316" stopOpacity={0} /></linearGradient>
                <linearGradient id="ulA" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3b82f6" stopOpacity={0.2} /><stop offset="100%" stopColor="#3b82f6" stopOpacity={0} /></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} unit=" GB" />
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, fontSize: 13, boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }} />
              <Area type="monotone" dataKey="download" stroke="#f97316" strokeWidth={2.5} fill="url(#dlA)" name="Download (GB)" />
              <Area type="monotone" dataKey="upload" stroke="#3b82f6" strokeWidth={2.5} fill="url(#ulA)" name="Upload (GB)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="p-12 rounded-2xl bg-white border border-slate-100 shadow-sm text-center">
          <TrendingUp size={48} className="mx-auto mb-4 text-slate-200" />
          <h3 className="text-lg font-bold text-slate-400">No Usage Data Yet</h3>
          <p className="text-sm text-slate-400 mt-1">Usage data will appear here once your billing cycle begins.</p>
        </div>
      )}

      {/* Bar Chart */}
      {data.length > 0 && (
        <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-6" style={{ fontFamily: 'Space Grotesk' }}>Download vs Upload Comparison</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data} barCategoryGap="25%">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, fontSize: 13 }} />
              <Bar dataKey="download" fill="#f97316" radius={[6, 6, 0, 0]} name="Download" />
              <Bar dataKey="upload" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Upload" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* WAN Usage (if available) */}
      {customer.wan && (
        <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-4" style={{ fontFamily: 'Space Grotesk' }}>WAN Interface Usage</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Current RX', value: customer.wan.rxSpeed, icon: <ArrowDown size={14} />, color: '#22c55e' },
              { label: 'Current TX', value: customer.wan.txSpeed, icon: <ArrowUp size={14} />, color: '#3b82f6' },
              { label: 'Total Received', value: customer.wan.totalRx, icon: <Download size={14} />, color: '#f97316' },
              { label: 'Total Sent', value: customer.wan.totalTx, icon: <Upload size={14} />, color: '#8b5cf6' },
            ].map((w, i) => (
              <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center">
                <div className="flex justify-center mb-2" style={{ color: w.color }}>{w.icon}</div>
                <div className="text-xl font-bold text-slate-900" style={{ fontFamily: 'Space Grotesk' }}>{w.value}</div>
                <div className="text-xs font-medium text-slate-400 mt-1">{w.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
