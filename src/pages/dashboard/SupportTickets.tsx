import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Plus, Send, MessageCircle, AlertCircle, CheckCircle, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SupportTickets() {
  const { getCurrentCustomer, addTicket, addTicketMessage, updateTicketStatus } = useStore();
  const customer = getCurrentCustomer();
  const [openTicket, setOpenTicket] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPriority, setNewPriority] = useState('Medium');

  if (!customer) return <div className="text-center text-slate-400 py-20">Please log in.</div>;

  const priorityColor: Record<string, string> = { Low: '#3b82f6', Medium: '#eab308', High: '#f97316', Critical: '#ef4444' };
  const statusIcon = (s: string) => {
    if (s === 'Open') return <Clock size={14} className="text-blue-500" />;
    if (s === 'In Progress') return <AlertCircle size={14} className="text-orange-500" />;
    return <CheckCircle size={14} className="text-green-500" />;
  };

  const handleCreate = () => {
    if (!newSubject.trim()) return toast.error('Please enter a subject');
    const ticket = {
      id: `TKT-${Math.floor(Math.random() * 900) + 100}`,
      userId: customer.id,
      customerName: customer.name,
      subject: newSubject,
      status: 'Open',
      priority: newPriority,
      created: new Date().toISOString().split('T')[0],
      messages: [{ id: 1, sender: 'Customer', text: newDesc || newSubject, time: new Date().toLocaleString() }],
    };
    addTicket(ticket);
    setShowNew(false);
    setNewSubject('');
    setNewDesc('');
    toast.success('Ticket created successfully!');
  };

  const handleReply = (ticketId: string) => {
    if (!replyText.trim()) return;
    addTicketMessage(ticketId, { sender: 'Customer', text: replyText, time: new Date().toLocaleString() });
    setReplyText('');
    toast.success('Reply sent!');
  };

  return (
    <div className="space-y-12 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-2 block">Technical Assistance</span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight" style={{ fontFamily: 'Space Grotesk' }}>Support Protocols</h1>
          <p className="text-sm text-slate-500 mt-2">Active transmission logs and assistance requests.</p>
        </div>
        <button onClick={() => setShowNew(!showNew)}
          className="btn-premium btn-premium-primary !px-8 !py-4 shadow-orange-500/20">
          <Plus size={20} /> Initialize New Ticket
        </button>
      </div>

      {/* New Ticket Interface */}
      {showNew && (
        <div className="card-premium !p-8 animate-slide-up border-orange-100 shadow-2xl">
          <div className="flex items-center gap-3 mb-8">
             <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                <Plus size={20} />
             </div>
             <h3 className="text-xl font-black text-slate-900" style={{ fontFamily: 'Space Grotesk' }}>New Assistance Request</h3>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">Subject Designation</label>
              <input className="input-premium font-bold" placeholder="e.g. Connection sync failure in West Node" value={newSubject} onChange={e => setNewSubject(e.target.value)} />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">Priority Protocol</label>
              <select className="input-premium" value={newPriority} onChange={e => setNewPriority(e.target.value)}>
                {['Low', 'Medium', 'High', 'Critical'].map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">Signal Description</label>
              <textarea className="input-premium min-h-[120px]" rows={4} placeholder="Detailed transmission regarding your incident..." value={newDesc} onChange={e => setNewDesc(e.target.value)} />
            </div>
            <div className="flex gap-4 pt-4">
              <button onClick={handleCreate} className="btn-premium btn-premium-primary !px-10">Deploy Protocol</button>
              <button onClick={() => setShowNew(false)} className="btn-premium btn-premium-secondary !px-10">Cancel Mission</button>
            </div>
          </div>
        </div>
      )}

      {/* Ticket Stream */}
      <div className="space-y-4">
        {(!customer.tickets || customer.tickets.length === 0) && (
          <div className="card-premium !py-24 text-center">
            <MessageCircle size={48} className="mx-auto mb-6 text-slate-200" />
            <h3 className="text-xl font-black text-slate-300 uppercase tracking-widest">Protocol Stream Empty</h3>
            <p className="text-sm text-slate-400 mt-2 max-w-xs mx-auto font-medium">No active assistance deployments found on your account.</p>
          </div>
        )}
        {(customer.tickets || []).map((ticket: any) => (
          <div key={ticket.id} className="card-premium !p-0 border-slate-100/50 shadow-sm overflow-hidden group">
            {/* Header */}
            <button onClick={() => setOpenTicket(openTicket === ticket.id ? null : ticket.id)}
              className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50/50 transition-all duration-300">
              <div className="flex items-center gap-6 flex-1">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-50 flex items-center justify-center transition-transform group-hover:scale-110">
                   {statusIcon(ticket.status)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-4 mb-1">
                    <span className="font-black text-slate-900 text-base tracking-tight">{ticket.subject}</span>
                    <span className="badge-premium" style={{ background: `${priorityColor[ticket.priority]}08`, color: priorityColor[ticket.priority], borderColor: `${priorityColor[ticket.priority]}20` }}>
                       <div className="w-1.5 h-1.5 rounded-full" style={{ background: priorityColor[ticket.priority] }} />
                       {ticket.priority}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-mono font-black text-slate-300 uppercase tracking-tighter">{ticket.id}</span>
                    <div className="w-1 h-1 rounded-full bg-slate-200" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Timestamp: {ticket.created || ticket.createdAt?.split('T')[0] || 'N/A'}</span>
                    <div className="w-1 h-1 rounded-full bg-slate-200" />
                    <span className={`text-[10px] font-black uppercase tracking-widest ${ticket.status === 'Resolved' ? 'text-green-500' : ticket.status === 'In Progress' ? 'text-orange-500' : 'text-primary'}`}>{ticket.status}</span>
                  </div>
                </div>
              </div>
              <div className={`p-2 rounded-xl border border-slate-50 transition-all ${openTicket === ticket.id ? 'bg-primary text-white border-primary rotate-180' : 'bg-slate-50 text-slate-400'}`}>
                 <ChevronDown size={20} />
              </div>
            </button>

            {/* Content / Chat */}
            {openTicket === ticket.id && (
              <div className="border-t border-slate-50 animate-fade-in bg-slate-50/30">
                <div className="p-8 space-y-6 max-h-[450px] overflow-y-auto">
                  {(ticket.messages || []).map((msg: any, idx: number) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'Customer' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] p-5 rounded-[24px] shadow-sm ${msg.sender === 'Customer' ? 'bg-slate-900 text-white rounded-br-none' : 'bg-white border border-slate-100 text-slate-800 rounded-bl-none'}`}>
                        <div className={`text-[10px] font-black uppercase tracking-widest mb-2 ${msg.sender === 'Customer' ? 'text-primary' : 'text-slate-400'}`}>{msg.sender} · {msg.time}</div>
                        <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Protocol Reply */}
                {ticket.status !== 'Resolved' && (
                  <div className="p-6 border-t border-slate-50 bg-white flex gap-4">
                    <input className="input-premium flex-1" placeholder="Transmit reply..." value={replyText} onChange={e => setReplyText(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleReply(ticket.id)} />
                    <button onClick={() => handleReply(ticket.id)}
                      className="btn-premium btn-premium-primary !px-10">
                      <Send size={18} /> Transmit
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
