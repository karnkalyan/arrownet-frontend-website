import { useStore } from '../../store/useStore';
import { Network, Globe, Server, Shield, Activity, Zap } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function WanInfo() {
  const { getCurrentCustomer } = useStore();
  const customer = getCurrentCustomer();
  if (!customer) return <div className="text-center text-slate-400 py-20">Please log in.</div>;
  if (!customer.wan) return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <Network size={48} className="text-slate-300 mb-4" />
      <h2 className="text-xl font-bold text-slate-700 mb-2">WAN Information Not Available</h2>
      <p className="text-sm text-slate-500">WAN details are available for Business and Corporate plans.</p>
    </div>
  );

  const wan = customer.wan;
  const wanUsageData = customer.monthlyUsage.map(d => ({ name: d.month, rx: d.download * 2.1, tx: d.upload * 1.8 }));

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'Space Grotesk' }}>WAN Information</h1>
        <p className="text-sm text-slate-500 mt-1">Your wide area network connection details and statistics.</p>
      </div>

      {/* Status Bar */}
      <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
        <div className="w-3 h-3 rounded-full animate-pulse bg-green-500" style={{ boxShadow: '0 0 10px #22c55e' }} />
        <span className="text-sm font-bold text-green-600">WAN Connected</span>
        <span className="text-sm text-slate-400">|</span>
        <span className="text-sm text-slate-500">Uptime: <span className="font-bold text-slate-700">{wan.uptime}</span></span>
        <span className="text-sm text-slate-400">|</span>
        <span className="text-sm text-slate-500">Type: <span className="font-bold text-slate-700">{wan.type}</span></span>
      </div>

      {/* Speed Indicators */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'RX Speed', value: wan.rxSpeed, color: '#22c55e', icon: <Activity size={18} /> },
          { label: 'TX Speed', value: wan.txSpeed, color: '#3b82f6', icon: <Zap size={18} /> },
          { label: 'Total Received', value: wan.totalRx, color: '#f97316', icon: <Globe size={18} /> },
          { label: 'Total Sent', value: wan.totalTx, color: '#8b5cf6', icon: <Server size={18} /> },
        ].map((s, i) => (
          <div key={i} className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all text-center">
            <div className="flex justify-center mb-3" style={{ color: s.color }}>{s.icon}</div>
            <div className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'Space Grotesk' }}>{s.value}</div>
            <div className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">{s.label}</div>
          </div>
        ))}
      </div>

      {/* WAN Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Connection Details */}
        <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-5" style={{ fontFamily: 'Space Grotesk' }}>Connection Details</h3>
          <div className="space-y-3">
            {[
              { label: 'IP Address', value: wan.ipAddress },
              { label: 'Gateway', value: wan.gateway },
              { label: 'Subnet Mask', value: wan.subnet },
              { label: 'Primary DNS', value: wan.dns1 },
              { label: 'Secondary DNS', value: wan.dns2 },
              { label: 'MAC Address', value: wan.macAddress },
              { label: 'Port', value: wan.port },
            ].map((d, i) => (
              <div key={i} className="flex justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-sm text-slate-500">{d.label}</span>
                <span className="text-sm font-bold text-slate-900 font-mono">{d.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* VLAN & Routing */}
        <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-5" style={{ fontFamily: 'Space Grotesk' }}>VLAN & Routing</h3>
          <div className="space-y-3">
            <div className="flex justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-sm text-slate-500">VLAN</span>
              <span className="text-sm font-bold text-slate-900">{wan.vlan} (ID: {wan.vlanId})</span>
            </div>
            <div className="flex justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-sm text-slate-500">SLA</span>
              <span className="text-sm font-bold text-green-600">{(wan as any).sla || 'N/A'}</span>
            </div>
            {(wan as any).bgpAs && (
              <div className="flex justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-sm text-slate-500">BGP AS</span>
                <span className="text-sm font-bold text-slate-900">{(wan as any).bgpAs}</span>
              </div>
            )}
            {(wan as any).ospfArea && (
              <div className="flex justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-sm text-slate-500">OSPF Area</span>
                <span className="text-sm font-bold text-slate-900">{(wan as any).ospfArea}</span>
              </div>
            )}
            {(wan as any).mplsEnabled !== undefined && (
              <div className="flex justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-sm text-slate-500">MPLS</span>
                <span className={`text-sm font-bold ${(wan as any).mplsEnabled ? 'text-green-600' : 'text-slate-400'}`}>
                  {(wan as any).mplsEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            )}
          </div>
          {/* Public IPs */}
          {(wan as any).publicIPs && (
            <div className="mt-5">
              <h4 className="text-sm font-bold text-slate-700 mb-3">Public IPs</h4>
              <div className="flex flex-wrap gap-2">
                {(wan as any).publicIPs.map((ip: string, i: number) => (
                  <span key={i} className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-slate-50 border border-slate-200 text-slate-700">{ip}</span>
                ))}
              </div>
            </div>
          )}
          {(wan as any).privateSubnets && (
            <div className="mt-4">
              <h4 className="text-sm font-bold text-slate-700 mb-3">Private Subnets</h4>
              <div className="flex flex-wrap gap-2">
                {(wan as any).privateSubnets.map((s: string, i: number) => (
                  <span key={i} className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-blue-50 border border-blue-100 text-blue-700">{s}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* WAN Usage Chart */}
      <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 mb-6" style={{ fontFamily: 'Space Grotesk' }}>WAN Traffic Over Time</h3>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={wanUsageData}>
            <defs>
              <linearGradient id="rxG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#22c55e" stopOpacity={0.3} /><stop offset="100%" stopColor="#22c55e" stopOpacity={0} /></linearGradient>
              <linearGradient id="txG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3b82f6" stopOpacity={0.2} /><stop offset="100%" stopColor="#3b82f6" stopOpacity={0} /></linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
            <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12 }} />
            <Area type="monotone" dataKey="rx" stroke="#22c55e" strokeWidth={2.5} fill="url(#rxG)" name="RX (GB)" />
            <Area type="monotone" dataKey="tx" stroke="#3b82f6" strokeWidth={2.5} fill="url(#txG)" name="TX (GB)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
