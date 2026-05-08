import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  LayoutDashboard, Wifi, Headphones,
  ChevronLeft, ChevronRight, Bell, LogOut, Menu, X,
  Activity, Network, CreditCard, User
} from 'lucide-react';
import { useStore } from '../../store/useStore';

const navItems = [
  { icon: <LayoutDashboard size={18} />, label: 'Overview', href: '/dashboard' },
  { icon: <Activity size={18} />, label: 'Usage & Stats', href: '/dashboard/usage' },
  { icon: <Wifi size={18} />, label: 'WLAN Manager', href: '/dashboard/wlan' },
  { icon: <Network size={18} />, label: 'WAN Info', href: '/dashboard/wan' },
  { icon: <CreditCard size={18} />, label: 'Billing', href: '/dashboard/billing' },
  { icon: <Headphones size={18} />, label: 'Support Tickets', href: '/dashboard/support' },
  { icon: <User size={18} />, label: 'Profile', href: '/dashboard/profile' },
];

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem('userSidebarCollapsed') === 'true');
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('userSidebarCollapsed', collapsed.toString());
  }, [collapsed]);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, adminLogoUrl, getCurrentCustomer, isAuthenticated, authLoading, authRole } = useStore();
  const customer = getCurrentCustomer();

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        navigate('/login', { replace: true });
      } else if (authRole !== 'customer') {
        navigate('/admin', { replace: true });
      }
    }
  }, [isAuthenticated, authRole, authLoading, navigate]);

  const handleLogout = () => { logout(); navigate('/login', { replace: true }); };

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  if (authLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Initialising Terminal</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;


  const isPlanCorporateOrSME = customer?.planType === 'Corporate' || customer?.planType === 'SME';
  const visibleItems = isPlanCorporateOrSME
    ? navItems
    : navItems.filter(n => n.href !== '/dashboard/wan');

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:relative z-50 h-full flex flex-col transition-all duration-300 ease-in-out
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
        style={{
          width: collapsed ? 80 : 280,
          background: '#ffffff',
          borderRight: '1px solid #f1f5f9',
          boxShadow: '4px 0 24px rgba(15, 23, 42, 0.02)',
        }}
      >
        {/* Logo */}
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3 px-6'} h-20 flex-shrink-0 border-b border-slate-50`}>
          <img src={adminLogoUrl} alt="Arrownet" className="h-8 w-8 object-contain flex-shrink-0"
            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          {!collapsed && (
            <div className="animate-fade-in">
              <div className="text-base font-black text-slate-900" style={{ fontFamily: 'Poppins' }}>Arrownet</div>
              <div className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] leading-none">Self-Care</div>
            </div>
          )}
        </div>

        {/* Customer info */}
        {!collapsed && customer && (
          <div className="p-5 mx-4 mt-6 rounded-2xl bg-slate-50 border border-slate-100 animate-fade-in">
            <div className="text-sm font-black text-slate-900 truncate mb-1">{customer.name}</div>
            <div className="text-[10px] font-bold text-slate-400 font-mono mb-3">{customer.id}</div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-50 w-fit shadow-sm">
              <div className="w-2 h-2 rounded-full animate-pulse" 
                style={{ 
                  background: customer.status === 'Online' ? '#22c55e' : '#ef4444', 
                  boxShadow: `0 0 10px ${customer.status === 'Online' ? '#22c55e' : '#ef4444'}` 
                }} />
              <span className="text-[10px] font-black uppercase tracking-wider" style={{ color: customer.status === 'Online' ? '#16a34a' : '#dc2626' }}>
                {customer.status}
              </span>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-8 px-4 space-y-2">
          {visibleItems.map(item => {
            const active = location.pathname === item.href;
            return (
              <Link key={item.href} to={item.href}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group ${collapsed ? 'justify-center px-0' : ''}`}
                title={collapsed ? item.label : ''}
                style={{
                  background: active ? 'var(--primary)' : 'transparent',
                  color: active ? '#ffffff' : '#64748b',
                  boxShadow: active ? '0 8px 16px -4px var(--primary)' : 'none'
                }}>
                <span className={`flex-shrink-0 transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>{item.icon}</span>
                {!collapsed && <span className="text-sm font-bold tracking-tight">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Collapse + Logout */}
        <div className="p-4 flex-shrink-0 border-t border-slate-50">
          <button onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group ${collapsed ? 'justify-center px-0' : ''}`}
            style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.04)' }}>
            <LogOut size={18} className="group-hover:translate-x-0.5 transition-transform" />
            {!collapsed && <span className="text-sm font-black">End Session</span>}
          </button>
          <button onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex w-full items-center justify-center p-3 mt-2 rounded-xl text-slate-300 hover:text-slate-500 hover:bg-slate-50 transition-all">
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-20 flex items-center justify-between px-8 flex-shrink-0 bg-white border-b border-slate-50">
          <div className="flex items-center gap-6">
            <button onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2.5 rounded-xl text-slate-500 border border-slate-100 hover:bg-slate-50 transition-all">
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-1">{customer?.plan || 'Network Access'}</span>
              <h1 className="text-lg font-black text-slate-900 tracking-tight" style={{ fontFamily: 'Poppins' }}>
                {navItems.find(n => n.href === location.pathname)?.label || 'Portal Overview'}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/" className="btn-premium btn-premium-secondary !py-2 !px-4 !text-xs !rounded-lg">
              View Website
            </Link>
            <div className="h-8 w-[1px] bg-slate-100 mx-2" />
            <button className="w-10 h-10 rounded-xl flex items-center justify-center relative bg-slate-50 border border-slate-50 hover:bg-slate-100 transition-all">
              <Bell size={18} className="text-slate-400" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-primary ring-2 ring-white" />
            </button>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black text-white shadow-lg shadow-primary/20"
              style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))' }}>
              {customer?.name?.charAt(0) || 'A'}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-8 md:p-12 bg-[#fafbfc]">
          {authRole === 'customer' ? (
            <Outlet />
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400">
               Redirecting to administrative hub...
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
