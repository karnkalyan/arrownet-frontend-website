import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Send, MessageCircle, X } from 'lucide-react';
import toast from 'react-hot-toast';

const columns = ['Open', 'In Progress', 'Resolved'] as const;
const colColors: Record<string, { bg: string; border: string; badge: string }> = {
  Open: { bg: '#eff6ff', border: '#bfdbfe', badge: 'badge-blue' },
  'In Progress': { bg: '#fff7ed', border: '#fed7aa', badge: 'badge-orange' },
  Resolved: { bg: '#f0fdf4', border: '#bbf7d0', badge: 'badge-green' },
};
const prioColor: Record<string, string> = { Low: '#3b82f6', Medium: '#eab308', High: '#E30613', Critical: '#ef4444' };

export default function TicketDesk() {
  const { tickets, updateTicketStatus, addTicketMessage } = useStore();
  const [openChat, setOpenChat] = useState<string | null>(null);
  const [reply, setReply] = useState('');

  const handleStatusChange = (ticketId: string, newStatus: string) => {
    updateTicketStatus(ticketId, newStatus);
    toast.success(`Ticket moved to ${newStatus}`);
  };

  const handleReply = (ticketId: string) => {
    if (!reply.trim()) return;
    addTicketMessage(ticketId, { sender: 'Support', text: reply, time: new Date().toLocaleString() });
    setReply('');
    toast.success('Reply sent to customer');
  };

  return (
    <div className="space-y-12 max-w-7xl mx-auto">
      <div>
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-2 block">Support Infrastructure</span>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight" style={{ fontFamily: 'Poppins' }}>Ticket Command</h1>
        <p className="text-sm text-slate-500 mt-2">Active protocol management and incident resolution.</p>
      </div>

      {/* Chat Panel */}
      {openChat && (() => {
        const t = tickets.find(tk => tk.id === openChat);
        if (!t) return null;
        return (
          <div className="card-premium !p-8 border-red-100 shadow-2xl animate-slide-up relative overflow-visible">
            <div className="absolute -top-4 -right-4">
               <button onClick={() => setOpenChat(null)} className="w-12 h-12 rounded-2xl bg-white shadow-xl flex items-center justify-center text-slate-400 hover:text-slate-600 border border-slate-50 transition-all">
                  <X size={20} />
               </button>
            </div>
            
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-50">
              <div>
                <h3 className="text-xl font-black text-slate-900 mb-1" style={{ fontFamily: 'Poppins' }}>{t.subject}</h3>
                <div className="flex items-center gap-3">
                   <span className="text-[10px] font-mono font-bold text-slate-400">{t.id}</span>
                   <div className="w-1 h-1 rounded-full bg-slate-200" />
                   <span className="text-[10px] font-black uppercase tracking-wider text-primary">{t.customer?.name ?? 'Customer'}</span>
                </div>
              </div>
              <div className="text-right">
                 <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Created</div>
                 <div className="text-xs font-bold text-slate-800">{t.createdAt ? new Date(t.createdAt).toLocaleDateString() : ''}</div>
              </div>
            </div>

            <div className="space-y-6 max-h-[400px] overflow-y-auto p-6 bg-slate-50/50 rounded-3xl mb-8 border border-slate-100/50">
              {(t.messages || []).map((msg: any) => (
                <div key={msg.id} className={`flex ${msg.sender === 'Support' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] p-5 rounded-[24px] shadow-sm ${msg.sender === 'Support' ? 'bg-slate-900 text-white rounded-br-none' : 'bg-white border border-slate-100 text-slate-800 rounded-bl-none'}`}>
                    <div className={`text-[10px] font-black uppercase tracking-widest mb-2 ${msg.sender === 'Support' ? 'text-primary' : 'text-slate-400'}`}>{msg.sender} · {msg.time}</div>
                    <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex gap-4">
              <input className="input-premium flex-1 !bg-white" placeholder="Type transmission..." value={reply} onChange={e => setReply(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleReply(t.id)} />
              <button onClick={() => handleReply(t.id)} className="btn-premium btn-premium-primary !px-8">
                <Send size={18} /> Send Signal
              </button>
            </div>
          </div>
        );
      })()}

      {/* Kanban Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {columns.map(col => {
          const colTickets = tickets.filter(t => t.status === col);
          return (
            <div key={col} className="flex flex-col gap-6">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full" style={{ background: colColors[col].border }} />
                   <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">{col}</h3>
                </div>
                <span className="text-[10px] font-black bg-white border border-slate-100 px-3 py-1 rounded-full shadow-sm text-slate-400">{colTickets.length} Protocols</span>
              </div>
              
              <div className="space-y-4 min-h-[500px] p-2 rounded-3xl transition-all">
                {colTickets.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50 border-2 border-dashed border-slate-100 rounded-3xl">
                    <MessageCircle size={32} className="text-slate-200 mb-4" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">Quiet Sector</p>
                  </div>
                )}
                {colTickets.map(t => (
                  <div key={t.id} className="card-premium !p-6 border-slate-50 hover:border-primary/20 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
                    onClick={() => setOpenChat(t.id)}>
                    <div className="flex items-center justify-between mb-4">
                      <span className="badge-premium" style={{ background: `${prioColor[t.priority]}08`, color: prioColor[t.priority], borderColor: `${prioColor[t.priority]}20` }}>
                         <div className="w-1.5 h-1.5 rounded-full" style={{ background: prioColor[t.priority] }} />
                         {t.priority}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-slate-300 uppercase">{t.id}</span>
                    </div>
                    
                    <h4 className="text-base font-black text-slate-900 mb-2 leading-tight group-hover:text-primary transition-colors">{t.subject}</h4>
                    <div className="flex items-center gap-2 mb-6">
                       <div className="w-5 h-5 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400">{(t.customer?.name ?? 'C').charAt(0)}</div>
                       <p className="text-[10px] font-bold text-slate-400">{t.customer?.name ?? 'Customer'} · {t.createdAt ? new Date(t.createdAt).toLocaleDateString() : ''}</p>
                    </div>

                    <div className="flex gap-2 pt-4 border-t border-slate-50">
                      {columns.filter(c => c !== col).map(c => (
                        <button key={c} onClick={e => { e.stopPropagation(); handleStatusChange(t.id, c); }}
                          className="flex-1 text-[9px] font-black uppercase tracking-widest py-2 rounded-lg bg-white border border-slate-100 text-slate-400 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all">
                          → {c}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
