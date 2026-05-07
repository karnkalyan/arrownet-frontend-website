import React, { useEffect, useState } from 'react';
import { useStore } from '../../store/useStore';
import { 
  Phone, Mail, Calendar, CheckCircle, Clock, 
  Search, Filter, Trash2, MoreVertical, 
  MessageSquare, User, ExternalLink, 
  Eye, RefreshCw, ChevronDown, Send, Inbox
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const STATUS_CONFIG = {
  PENDING: { label: 'Pending', color: 'bg-amber-100 text-amber-700', icon: <Clock size={14} /> },
  CALLED: { label: 'Called', color: 'bg-blue-100 text-blue-700', icon: <Phone size={14} /> },
  ENQUIRED: { label: 'Enquired', color: 'bg-purple-100 text-purple-700', icon: <MessageSquare size={14} /> },
  CONVERTED: { label: 'Converted', color: 'bg-green-100 text-green-700', icon: <CheckCircle size={14} /> },
  REJECTED: { label: 'Rejected', color: 'bg-red-100 text-red-700', icon: <Trash2 size={14} /> },
};

const CONTACT_STATUS_CONFIG = {
  NEW: { label: 'New', color: 'bg-primary/10 text-primary', icon: <Inbox size={14} /> },
  READ: { label: 'Read', color: 'bg-slate-100 text-slate-600', icon: <Eye size={14} /> },
  REPLIED: { label: 'Replied', color: 'bg-green-100 text-green-700', icon: <Send size={14} /> },
};

type ViewMode = 'leads' | 'contact';

export default function LeadManager() {
  const { 
    leads, fetchLeads, updateLead, deleteLead,
    contactSubmissions, fetchContactSubmissions, updateContactStatus, deleteContactSubmission 
  } = useStore();
  
  const [viewMode, setViewMode] = useState<ViewMode>('leads');
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      if (viewMode === 'leads') await fetchLeads();
      else await fetchContactSubmissions();
      setLoading(false);
    };
    loadData();
  }, [viewMode, fetchLeads, fetchContactSubmissions]);

  const filteredData = (viewMode === 'leads' ? leads : contactSubmissions).filter(item => {
    const name = item.name || '';
    const phone = item.phone || '';
    const email = item.email || '';
    const matchesSearch = name.toLowerCase().includes(search.toLowerCase()) || 
                         phone.includes(search) || 
                         email.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'ALL' || item.status === filter;
    return matchesSearch && matchesFilter;
  });

  const handleStatusUpdate = async (id: number, status: string) => {
    const ok = viewMode === 'leads' 
      ? await updateLead(id, { status }) 
      : await updateContactStatus(id, status);
    
    if (ok) {
      toast.success(`Status updated to ${status}`);
      if (selectedItem?.id === id) setSelectedItem({ ...selectedItem, status });
    } else toast.error('Failed to update status');
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Delete this permanently?')) {
      const ok = viewMode === 'leads' 
        ? await deleteLead(id) 
        : await deleteContactSubmission(id);
      if (ok) toast.success('Removed successfully');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-[10px] font-black uppercase tracking-widest text-primary mb-4">
            <RefreshCw size={12} className={loading ? 'animate-spin' : ''} /> CRM Dashboard
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight" style={{ fontFamily: 'Poppins' }}>
            {viewMode === 'leads' ? 'Lead' : 'Contact'} <span className="text-primary">{viewMode === 'leads' ? 'Intelligence' : 'Submissions'}</span>
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            {viewMode === 'leads' 
              ? 'Manage incoming connections and track conversion lifecycle.' 
              : 'Detailed submissions from the website contact form.'}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder={`Search ${viewMode}...`} 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all w-64"
            />
          </div>
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="ALL">All Status</option>
            {viewMode === 'leads' ? (
              Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)
            ) : (
              Object.entries(CONTACT_STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)
            )}
          </select>
        </div>
      </div>

      {/* View Switcher */}
      <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl w-fit">
        <button 
          onClick={() => { setViewMode('leads'); setFilter('ALL'); }}
          className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${viewMode === 'leads' ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
        >
          Sales Leads
        </button>
        <button 
          onClick={() => { setViewMode('contact'); setFilter('ALL'); }}
          className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${viewMode === 'contact' ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
        >
          Contact Form
        </button>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Identity</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">{viewMode === 'leads' ? 'Inquiry Date' : 'Submission Date'}</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredData.map((item) => (
                <tr 
                  key={item.id} 
                  className={`group hover:bg-slate-50/80 transition-colors cursor-pointer ${item.status === 'NEW' || item.status === 'PENDING' ? 'bg-primary/[0.02]' : ''}`}
                  onClick={() => { setSelectedItem(item); if(viewMode === 'contact' && item.status === 'NEW') handleStatusUpdate(item.id, 'READ'); }}
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-white shadow-lg ${item.status === 'NEW' || item.status === 'PENDING' ? 'bg-primary' : 'bg-slate-200'}`}>
                        {item.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 leading-none">{item.name}</span>
                          {(item.status === 'NEW' || item.status === 'PENDING') && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                        </div>
                        <div className="text-xs text-slate-400 mt-1 font-medium">{item.email || item.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    {viewMode === 'leads' ? (
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${STATUS_CONFIG[item.status as keyof typeof STATUS_CONFIG]?.color}`}>
                        {STATUS_CONFIG[item.status as keyof typeof STATUS_CONFIG]?.icon}
                        {STATUS_CONFIG[item.status as keyof typeof STATUS_CONFIG]?.label}
                      </div>
                    ) : (
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${CONTACT_STATUS_CONFIG[item.status as keyof typeof CONTACT_STATUS_CONFIG]?.color}`}>
                        {CONTACT_STATUS_CONFIG[item.status as keyof typeof CONTACT_STATUS_CONFIG]?.icon}
                        {CONTACT_STATUS_CONFIG[item.status as keyof typeof CONTACT_STATUS_CONFIG]?.label}
                      </div>
                    )}
                  </td>
                  <td className="px-8 py-6 text-sm text-slate-500 font-medium">
                    {new Date(item.createdAt).toLocaleDateString('en-US', { 
                      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                    })}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {viewMode === 'leads' ? (
                         <>
                          <button onClick={(e) => { e.stopPropagation(); handleStatusUpdate(item.id, 'CALLED'); }} className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all"><Phone size={16} /></button>
                          <button onClick={(e) => { e.stopPropagation(); handleStatusUpdate(item.id, 'CONVERTED'); }} className="p-2 rounded-lg text-slate-400 hover:text-green-600 hover:bg-green-50 transition-all"><CheckCircle size={16} /></button>
                         </>
                      ) : (
                        <button onClick={(e) => { e.stopPropagation(); handleStatusUpdate(item.id, 'REPLIED'); }} className="p-2 rounded-lg text-slate-400 hover:text-green-600 hover:bg-green-50 transition-all"><Send size={16} /></button>
                      )}
                      <button onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }} className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedItem(null)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-lg bg-white rounded-[32px] shadow-2xl overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-primary via-secondary to-accent" />
              <div className="p-8">
                <div className="flex justify-between items-start mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-2xl font-black text-white shadow-xl shadow-primary/20">
                      {selectedItem.name.charAt(0)}
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-slate-900 leading-tight" style={{ fontFamily: 'Poppins' }}>{selectedItem.name}</h2>
                      <div className="flex items-center gap-2 text-slate-400 text-sm mt-1">
                        <Calendar size={14} /> 
                        {new Date(selectedItem.createdAt).toLocaleDateString()} at {new Date(selectedItem.createdAt).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setSelectedItem(null)} className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 transition-colors"><ChevronDown size={24} /></button>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <a href={`tel:${selectedItem.phone}`} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-primary/5 hover:border-primary/20 transition-all group">
                      <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 group-hover:text-primary">Phone</div>
                      <div className="font-bold text-slate-900 flex items-center gap-2"><Phone size={14} className="text-primary" /> {selectedItem.phone || 'N/A'}</div>
                    </a>
                    <a href={`mailto:${selectedItem.email}`} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-secondary/5 hover:border-secondary/20 transition-all group">
                      <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 group-hover:text-secondary">Email</div>
                      <div className="font-bold text-slate-900 flex items-center gap-2 truncate"><Mail size={14} className="text-secondary" /> {selectedItem.email || 'N/A'}</div>
                    </a>
                  </div>

                  {viewMode === 'contact' && (
                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Subject</div>
                      <div className="font-bold text-slate-900 mb-4">{selectedItem.subject || 'General Inquiry'}</div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Message</div>
                      <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{selectedItem.message}</p>
                    </div>
                  )}

                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 block">Update Status</label>
                    <div className="grid grid-cols-3 gap-2">
                      {viewMode === 'leads' ? (
                        Object.entries(STATUS_CONFIG).map(([key, config]) => (
                          <button key={key} onClick={() => handleStatusUpdate(selectedItem.id, key)} className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${selectedItem.status === key ? 'border-primary/30 bg-primary/5 text-primary' : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200'}`}>
                            {config.icon} <span className="text-[9px] font-black uppercase tracking-tight">{config.label}</span>
                          </button>
                        ))
                      ) : (
                        Object.entries(CONTACT_STATUS_CONFIG).map(([key, config]) => (
                          <button key={key} onClick={() => handleStatusUpdate(selectedItem.id, key)} className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${selectedItem.status === key ? 'border-primary/30 bg-primary/5 text-primary' : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200'}`}>
                            {config.icon} <span className="text-[9px] font-black uppercase tracking-tight">{config.label}</span>
                          </button>
                        ))
                      )}
                    </div>
                  </div>

                  {viewMode === 'leads' && (
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Administrative Notes</label>
                      <textarea className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[100px] transition-all" placeholder="Add internal notes..." value={selectedItem.notes || ''} onChange={(e) => updateLead(selectedItem.id, { notes: e.target.value })} />
                    </div>
                  )}
                </div>

                <div className="mt-8 flex gap-3">
                  <button onClick={() => handleDelete(selectedItem.id)} className="flex-1 py-3.5 rounded-xl border border-red-100 text-red-600 font-black text-xs uppercase tracking-widest hover:bg-red-50 transition-all flex items-center justify-center gap-2"><Trash2 size={16} /> Delete</button>
                  <button onClick={() => setSelectedItem(null)} className="flex-1 py-3.5 rounded-xl bg-slate-900 text-white font-black text-xs uppercase tracking-widest hover:shadow-xl transition-all">Close</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
