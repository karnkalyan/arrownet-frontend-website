import { useStore } from '../../store/useStore';
import { CreditCard, Download, CheckCircle, Clock, AlertCircle, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

export default function BillingHistory() {
  const { getCurrentCustomer } = useStore();
  const customer = getCurrentCustomer();
  if (!customer) return <div className="text-center text-slate-400 py-20">Please log in.</div>;

  const statusBadge = (status: string) => {
    if (status === 'Paid') return <span className="badge badge-green"><CheckCircle size={10} className="inline mr-1" />Paid</span>;
    if (status === 'Pending') return <span className="badge badge-yellow"><Clock size={10} className="inline mr-1" />Pending</span>;
    return <span className="badge badge-red"><AlertCircle size={10} className="inline mr-1" />Overdue</span>;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'Space Grotesk' }}>Billing & Payments</h1>
          <p className="text-sm text-slate-500 mt-1">Invoice history and payment management.</p>
        </div>
        <button onClick={() => toast.success('Renewal request submitted! Our team will contact you.')}
          className="px-6 py-3 rounded-xl font-bold text-white flex items-center gap-2 transition-all shadow-lg"
          style={{ background: 'linear-gradient(135deg, #f97316, #ef4444)' }}>
          <Zap size={16} /> Renew Now
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500"><CreditCard size={18} /></div>
            <span className="text-sm font-bold text-slate-500">Current Plan</span>
          </div>
          <div className="text-lg font-bold text-slate-900">{customer.plan}</div>
          <div className="text-xs text-slate-400 mt-1">Rs. {(customer.invoices || [])[0]?.amount || '0'}/month</div>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-500"><CheckCircle size={18} /></div>
            <span className="text-sm font-bold text-slate-500">Payment Status</span>
          </div>
          <div className="text-lg font-bold text-green-600">All Paid</div>
          <div className="text-xs text-slate-400 mt-1">{(customer.invoices || []).length} invoices total</div>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500"><Clock size={18} /></div>
            <span className="text-sm font-bold text-slate-500">Next Due</span>
          </div>
          <div className="text-lg font-bold text-slate-900">{customer.expiryDate}</div>
          <div className="text-xs text-slate-400 mt-1">{customer.daysLeft} days remaining</div>
        </div>
      </div>

      {/* Invoice Table */}
      <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 mb-5" style={{ fontFamily: 'Space Grotesk' }}>Invoice History</h3>
        <div className="overflow-x-auto">
          <table className="w-full data-table">
            <thead><tr>
              <th className="text-left">Invoice ID</th><th className="text-left">Period</th><th className="text-left">Plan</th><th className="text-left">Amount</th><th className="text-left">Status</th><th className="text-left">Date</th><th className="text-right">Action</th>
            </tr></thead>
            <tbody>
              {(customer.invoices || []).map((inv: any) => (
                <tr key={inv.id}>
                  <td className="font-bold text-slate-800 font-mono">{inv.id}</td>
                  <td className="text-slate-600">{inv.period}</td>
                  <td className="text-slate-500 text-xs">{inv.plan}</td>
                  <td className="font-bold text-slate-900">Rs. {inv.amount}</td>
                  <td>{statusBadge(inv.status)}</td>
                  <td className="text-slate-500 text-xs">{inv.date}</td>
                  <td className="text-right">
                    <button onClick={() => toast.success('Invoice downloaded!')}
                      className="text-xs font-bold text-orange-500 hover:text-orange-600 flex items-center gap-1 ml-auto">
                      <Download size={12} /> Download
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
