import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Wifi, Eye, EyeOff, Save, Shield, Smartphone, Laptop, Tv, Monitor, HelpCircle, ToggleLeft, ToggleRight, Ban, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const deviceIcons: Record<string, any> = { Phone: <Smartphone size={16} />, Laptop: <Laptop size={16} />, Tablet: <Smartphone size={16} />, TV: <Tv size={16} />, Desktop: <Monitor size={16} />, default: <HelpCircle size={16} /> };

export default function WlanManager() {
  const { getCurrentCustomer, updateWlanSSID, toggleDeviceBlock } = useStore();
  const customer = getCurrentCustomer();
  const [selectedSSID, setSelectedSSID] = useState(customer?.wlan?.ssids[0]?.id || 1);
  const [editName, setEditName] = useState('');
  const [editPass, setEditPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [saving, setSaving] = useState(false);

  if (!customer) return <div className="text-center text-slate-400 py-20">Please log in.</div>;

  if (!customer.wlan || !customer.wlan.ssids || customer.wlan.ssids.length === 0) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-2 block">Wireless Infrastructure</span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight" style={{ fontFamily: 'Space Grotesk' }}>WLAN Control</h1>
        </div>
        <div className="flex flex-col items-center justify-center py-20 text-center card-premium">
          <Wifi size={48} className="text-slate-200 mb-4" />
          <h2 className="text-xl font-bold text-slate-700 mb-2">WLAN Data Not Available</h2>
          <p className="text-sm text-slate-400 max-w-md">WLAN management will be available once your router is provisioned and connected to the network.</p>
        </div>
      </div>
    );
  }

  const ssid = customer.wlan.ssids.find(s => s.id === selectedSSID) || customer.wlan.ssids[0];

  const handleSelect = (id: number) => {
    setSelectedSSID(id);
    const s = customer.wlan.ssids.find(ss => ss.id === id);
    if (s) { setEditName(s.name); setEditPass(s.password); }
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 1500));
    updateWlanSSID(customer.id, selectedSSID, { name: editName || ssid.name, password: editPass || ssid.password });
    setSaving(false);
    toast.success('WLAN settings updated successfully!');
  };

  const passStrength = (p: string) => {
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  };
  const strength = passStrength(editPass || ssid.password);
  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['#ef4444', '#eab308', '#3b82f6', '#22c55e'];

  return (
    <div className="space-y-12 max-w-7xl mx-auto">
      <div>
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-2 block">Wireless Infrastructure</span>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight" style={{ fontFamily: 'Space Grotesk' }}>WLAN Control</h1>
        <p className="text-sm text-slate-500 mt-2">Manage SSIDs, encryption keys, and active device links.</p>
      </div>

      {/* SSID Matrix Selector */}
      <div className="card-premium !p-8 animate-fade-in">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
            <Wifi size={20} />
          </div>
          <h3 className="text-xl font-black text-slate-900" style={{ fontFamily: 'Space Grotesk' }}>Available Nodes</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {customer.wlan.ssids.map(s => (
            <button key={s.id} onClick={() => handleSelect(s.id)}
              className={`p-6 rounded-[32px] text-left transition-all duration-300 border-2 group relative overflow-hidden ${selectedSSID === s.id ? 'border-primary bg-primary/5' : 'border-slate-50 bg-white hover:border-slate-200 shadow-sm'}`}>

              <div className="flex items-center justify-between mb-4 relative z-10">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${selectedSSID === s.id ? 'bg-primary text-white' : 'bg-slate-50 text-slate-400 group-hover:bg-slate-900 group-hover:text-white'}`}>
                  <Wifi size={20} />
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: s.enabled ? '#22c55e' : '#94a3b8' }} />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{s.enabled ? 'Active' : 'Offline'}</span>
                </div>
              </div>

              <div className="relative z-10">
                <span className="text-base font-black text-slate-900 block mb-1">{s.name}</span>
                <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <span>{s.band}</span>
                  <div className="w-1 h-1 rounded-full bg-slate-200" />
                  <span>{s.connected} Links</span>
                </div>
              </div>

              {selectedSSID === s.id && (
                <div className="absolute top-0 right-0 p-4">
                  <div className="btn-premium btn-premium-primary !p-2 !rounded-lg !text-[8px]">ACTIVE NODE</div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* SSID Settings */}
        <div className="card-premium !p-8 animate-fade-in h-fit">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-orange-500/5 flex items-center justify-center text-orange-500">
              <Shield size={20} />
            </div>
            <h3 className="text-xl font-black text-slate-900" style={{ fontFamily: 'Space Grotesk' }}>Node Configuration</h3>
          </div>

          <div className="space-y-6">
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">Network Designation (SSID)</label>
              <input className="input-premium font-bold" value={editName || ssid.name} onChange={e => setEditName(e.target.value)} />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">Encryption Key</label>
              <div className="relative">
                <input className="input-premium px-6 font-mono" type={showPass ? 'text' : 'password'} style={{ paddingRight: 56 }}
                  value={editPass || ssid.password} onChange={e => setEditPass(e.target.value)} />
                <button onClick={() => setShowPass(!showPass)} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-primary transition-all">
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {/* Strength meter */}
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Entropy Level</span>
                  <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: strengthColors[strength - 1] || '#94a3b8' }}>{strengthLabels[strength - 1] || 'Vulnerable'}</span>
                </div>
                <div className="flex gap-1.5">
                  {[0, 1, 2, 3].map(i => (
                    <div key={i} className="flex-1 h-1.5 rounded-full transition-all duration-500" style={{
                      background: i < strength ? strengthColors[strength - 1] : '#f1f5f9',
                      boxShadow: i < strength ? `0 0 10px ${strengthColors[strength - 1]}40` : 'none'
                    }} />
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-900">Broadcast Signal</div>
                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Visibility to remote nodes.</div>
              </div>
              <button onClick={() => { updateWlanSSID(customer.id, ssid.id, { enabled: !ssid.enabled }); toast.success(`Node ${ssid.enabled ? 'terminated' : 'initialized'}`); }}>
                {ssid.enabled ? <ToggleRight size={32} className="text-primary" /> : <ToggleLeft size={32} className="text-slate-300" />}
              </button>
            </div>

            <button onClick={handleSave} disabled={saving}
              className="btn-premium btn-premium-primary !w-full !py-4 shadow-orange-500/20">
              {saving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Save size={18} /> Commit Changes</>}
            </button>
          </div>
        </div>

        {/* Telemetry Stats */}
        <div className="card-premium !p-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-blue-500/5 flex items-center justify-center text-blue-500">
              <Shield size={20} />
            </div>
            <h3 className="text-xl font-black text-slate-900" style={{ fontFamily: 'Space Grotesk' }}>Node Telemetry</h3>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden relative group">
              <div className="absolute -bottom-2 -right-2 text-white/5 group-hover:scale-110 transition-transform"><Wifi size={64} /></div>
              <div className="text-2xl font-black text-white mb-1" style={{ fontFamily: 'Space Grotesk' }}>{ssid.bandwidth.download}</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">↓ Downlink Mbps</div>
            </div>
            <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm overflow-hidden relative group">
              <div className="absolute -bottom-2 -right-2 text-slate-100 group-hover:scale-110 transition-transform"><Wifi size={64} /></div>
              <div className="text-2xl font-black text-slate-900 mb-1" style={{ fontFamily: 'Space Grotesk' }}>{ssid.bandwidth.upload}</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">↑ Uplink Mbps</div>
            </div>
          </div>

          <div className="space-y-4">
            {[
              { label: 'Packets Transmitted', value: ssid.packetsSent.toLocaleString(), color: 'slate' },
              { label: 'Packets Received', value: ssid.packetsReceived.toLocaleString(), color: 'slate' },
              { label: 'Signal Spectrum', value: ssid.band, color: 'primary' },
              { label: 'Active Linkage', value: `${ssid.connected} Nodes`, color: 'slate' },
            ].map((stat, i) => (
              <div key={i} className="flex justify-between items-center p-4 rounded-2xl bg-slate-50 border border-slate-100 group hover:bg-white hover:shadow-xl transition-all duration-300">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</span>
                <span className={`text-sm font-black ${stat.color === 'primary' ? 'text-primary' : 'text-slate-900'}`} style={{ fontFamily: 'Space Grotesk' }}>{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Connected Device Grid */}
      <div className="card-premium !p-0 border-slate-50 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50">
          <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight" style={{ fontFamily: 'Space Grotesk' }}>Linked Node Registry</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="table-premium">
            <thead>
              <tr>
                <th className="!pl-8">Node Descriptor</th>
                <th>MAC Address</th>
                <th>IP Protocol</th>
                <th>SSID Target</th>
                <th>Status</th>
                <th className="text-right !pr-8">Operations</th>
              </tr>
            </thead>
            <tbody>
              {customer.wlan.connectedDevices.map(d => (
                <tr key={d.id}>
                  <td className="!pl-8">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                        {deviceIcons[d.type] || deviceIcons.default}
                      </div>
                      <span className="font-black text-slate-900">{d.name}</span>
                    </div>
                  </td>
                  <td className="text-[10px] font-mono font-bold text-slate-400">{d.mac}</td>
                  <td className="text-[10px] font-mono font-bold text-slate-500">{d.ip}</td>
                  <td><span className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">{d.ssid}</span></td>
                  <td>
                    <span className={`badge-premium badge-premium-${d.blocked ? 'red' : d.status === 'Connected' ? 'green' : 'orange'}`}>
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: d.blocked ? '#ef4444' : d.status === 'Connected' ? '#22c55e' : '#eab308' }} />
                      {d.blocked ? 'BLOCKED' : d.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="text-right !pr-8">
                    <button onClick={() => { toggleDeviceBlock(customer.id, d.id); toast.success(`Node ${d.blocked ? 'restored' : 'severed'}`); }}
                      className={`btn-premium !py-2 !px-4 !text-[10px] !rounded-lg ${d.blocked ? 'btn-premium-primary !bg-green-500 !border-green-500 hover:!bg-green-600' : 'btn-premium-secondary !text-red-500 !bg-red-50 hover:!bg-red-500 hover:!text-white'}`}>
                      {d.blocked ? <><CheckCircle size={14} className="inline mr-1" /> Restore</> : <><Ban size={14} className="inline mr-1" /> Sever Link</>}
                    </button>
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
