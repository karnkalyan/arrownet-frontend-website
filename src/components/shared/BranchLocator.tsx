import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Phone, Mail, ChevronDown, Navigation } from 'lucide-react';
import { useStore } from '../../store/useStore';

export default function BranchLocator() {
  const { branches } = useStore();
  const [search, setSearch] = useState('');
  const [selectedZone, setSelectedZone] = useState('');
  const [activeBranch, setActiveBranch] = useState<number | null>(null);

  const zones = useMemo(() => {
    const z = [...new Set(branches.map(b => b.zone))];
    return z.sort();
  }, [branches]);

  const filtered = useMemo(() => {
    return branches.filter(b => {
      const matchesSearch = !search || b.name.toLowerCase().includes(search.toLowerCase()) || b.address.toLowerCase().includes(search.toLowerCase()) || b.zone.toLowerCase().includes(search.toLowerCase());
      const matchesZone = !selectedZone || b.zone === selectedZone;
      return matchesSearch && matchesZone;
    });
  }, [branches, search, selectedZone]);

  // Simple lat/lon to SVG position mapping for Nepal (approximate bounding box)
  // Nepal: lat 26.3-30.5, lon 80.0-88.2
  const getMapPosition = (lat: number, lon: number) => {
    const minLat = 26.3, maxLat = 30.5, minLon = 80.0, maxLon = 88.2;
    const x = ((lon - minLon) / (maxLon - minLon)) * 100;
    const y = (1 - (lat - minLat) / (maxLat - minLat)) * 100;
    return { x: `${x}%`, y: `${y}%` };
  };

  return (
    <div className="space-y-8">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by branch name or area..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-premium !pl-12"
          />
        </div>
        <div className="relative min-w-[200px]">
          <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <select
            value={selectedZone}
            onChange={e => setSelectedZone(e.target.value)}
            className="input-premium !pr-10 appearance-none cursor-pointer"
          >
            <option value="">All Zones</option>
            {zones.map(z => (
              <option key={z} value={z}>{z}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Map + Branch List */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Nepal SVG Map */}
        <div className="lg:col-span-3 relative rounded-3xl overflow-hidden border border-slate-100 shadow-lg bg-slate-50 min-h-[400px]">
          <div className="relative w-full h-full min-h-[400px] p-4">
            {/* Nepal SVG Map Background */}
            <img
              src="/np.svg"
              alt="Nepal Map"
              className="w-full h-full object-contain opacity-90 drop-shadow-md"
            />

            {/* Branch Pins Overlay */}
            <div className="absolute inset-0">
              {filtered.map(branch => {
                const pos = getMapPosition(branch.lat, branch.lon);
                const isActive = activeBranch === branch.id;
                return (
                  <div key={branch.id} className="absolute" style={{ left: pos.x, top: pos.y, transform: 'translate(-50%, -100%)' }}>
                    <motion.button
                      whileHover={{ scale: 1.3 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setActiveBranch(isActive ? null : branch.id)}
                      className={`relative flex flex-col items-center cursor-pointer group`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-all ${isActive ? 'bg-primary text-white scale-125' : 'bg-white text-primary border-2 border-primary/30 hover:border-primary'}`}>
                        <MapPin size={16} />
                      </div>
                      {isActive && (
                        <span className="absolute -bottom-0.5 w-2 h-2 bg-primary rotate-45" />
                      )}
                    </motion.button>

                    {/* Tooltip */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, y: -5, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -5, scale: 0.9 }}
                          className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-2xl border border-slate-100 p-4 min-w-[220px] z-50"
                        >
                          <h4 className="text-sm font-bold text-slate-900 mb-1" style={{ fontFamily: 'Poppins' }}>{branch.name}</h4>
                          <p className="text-xs text-slate-500 mb-2">{branch.address}</p>
                          <a href={`tel:${branch.phone}`} className="text-xs text-primary font-medium hover:underline flex items-center gap-1">
                            <Phone size={10} /> {branch.phone}
                          </a>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {/* Map legend */}
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl p-3 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span>{filtered.length} Branch{filtered.length !== 1 ? 'es' : ''}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Branch List */}
        <div className="lg:col-span-2 space-y-4 max-h-[600px] overflow-y-auto pr-2">
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <MapPin size={32} className="mx-auto text-slate-300 mb-3" />
              <p className="text-sm text-slate-400 font-medium">No branches found</p>
            </div>
          ) : (
            filtered.map((branch, i) => (
              <motion.div
                key={branch.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setActiveBranch(activeBranch === branch.id ? null : branch.id)}
                className={`p-5 rounded-2xl border cursor-pointer transition-all duration-300 ${activeBranch === branch.id
                    ? 'border-primary/30 bg-red-50/30 shadow-lg'
                    : 'border-slate-100 bg-white shadow-sm hover:shadow-md hover:border-slate-200'
                  }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${activeBranch === branch.id ? 'bg-primary text-white' : 'bg-slate-50 text-primary'
                    }`}>
                    <MapPin size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 mb-1" style={{ fontFamily: 'Poppins' }}>{branch.name}</h4>
                    <p className="text-xs text-slate-500 mb-3">{branch.address}</p>
                    <div className="flex flex-wrap gap-3">
                      <a href={`tel:${branch.phone}`} className="flex items-center gap-1.5 text-xs font-medium text-primary hover:underline" onClick={e => e.stopPropagation()}>
                        <Phone size={12} /> {branch.phone}
                      </a>
                      <a href={`mailto:${branch.email}`} className="flex items-center gap-1.5 text-xs font-medium text-secondary hover:underline" onClick={e => e.stopPropagation()}>
                        <Mail size={12} /> Email
                      </a>
                      <a
                        href={`https://www.google.com/maps?q=${branch.lat},${branch.lon}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs font-medium text-green-600 hover:underline"
                        onClick={e => e.stopPropagation()}
                      >
                        <Navigation size={12} /> Directions
                      </a>
                    </div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-50 flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Zone:</span>
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{branch.zone}</span>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
