import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Zap, LogIn, LogOut, LayoutDashboard, ShieldCheck } from 'lucide-react';
import { useStore } from '../../store/useStore';
import AnnouncementBar from './AnnouncementBar';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Tariff', href: '/tariff' },
  { label: 'ePayment', href: '/epayment' },
  { label: 'Blog', href: '/blog' },
  { label: 'Career', href: '/career' },
  { label: 'Contact Us', href: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { logoUrl, isAuthenticated, authRole, logout } = useStore();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  return (
    <>
      <AnnouncementBar />
      <nav
        className={`sticky top-0 z-50 transition-all duration-500 ${
          scrolled ? 'py-2' : 'py-4'
        }`}
      >
        {/* Glass background */}
        <div className={`absolute inset-0 transition-all duration-500 ${
          scrolled 
            ? 'bg-white/80 backdrop-blur-2xl shadow-lg shadow-slate-200/20 border-b border-slate-100/50' 
            : 'bg-white/20 backdrop-blur-md border-b border-white/10'
        }`} />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <img
                src={logoUrl}
                alt="Arrownet"
                className="h-12 w-auto object-contain transition-transform duration-500 group-hover:scale-105"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="relative px-4 py-2.5 text-[14px] font-semibold transition-all duration-300 group rounded-xl"
                >
                  <span className={`relative z-10 transition-colors duration-300 ${
                    isActive(link.href) ? 'text-primary' : 'text-slate-600 group-hover:text-slate-900'
                  }`}>
                    {link.label}
                  </span>
                  {isActive(link.href) && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 rounded-xl -z-0"
                        style={{ background: 'color-mix(in srgb, var(--primary), transparent 94%)' }}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                  )}
                  <span className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 h-[3px] rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-300 ${
                    isActive(link.href) ? 'w-5' : 'w-0 group-hover:w-3'
                  }`} />
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="hidden lg:flex items-center gap-3">
              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <Link
                    to={authRole !== 'customer' ? '/admin' : '/dashboard'}
                    className="btn-premium btn-premium-secondary !py-2 !px-4 !text-[13px] !gap-1.5 !rounded-xl"
                  >
                    {authRole !== 'customer' ? <ShieldCheck size={16} /> : <LayoutDashboard size={16} />}
                    {authRole !== 'customer' ? 'Admin' : 'Dashboard'}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-100 hover:bg-red-50 transition-all"
                    title="Logout"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="btn-premium btn-premium-secondary !py-2 !px-4 !text-[13px] !gap-1.5 !rounded-xl"
                  >
                    <LogIn size={16} className="text-slate-400" />
                    Self-Care
                  </Link>
                  <Link
                    to="/tariff"
                    className="btn-premium btn-premium-primary !py-2 !px-5 !text-[13px] !rounded-xl shadow-primary/10"
                  >
                    <Zap size={16} className="fill-white" />
                    Explore Plans
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden w-11 h-11 rounded-xl flex items-center justify-center border border-slate-200 text-slate-600 hover:border-primary hover:text-primary transition-all"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={mobileOpen ? 'close' : 'open'}
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                </motion.div>
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden overflow-hidden bg-white/95 backdrop-blur-2xl border-b border-slate-100 shadow-2xl"
            >
              <div className="container mx-auto px-6 py-6 space-y-4">
                <div className="grid grid-cols-1 gap-1">
                  {navLinks.map((link, i) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        to={link.href}
                        className={`block p-3.5 rounded-xl text-[15px] font-bold transition-all ${
                          isActive(link.href) 
                            ? 'text-primary' 
                            : 'text-slate-600 active:bg-slate-50'
                        }`}
                        style={{ background: isActive(link.href) ? 'color-mix(in srgb, var(--primary), transparent 94%)' : 'transparent' }}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                </div>
                
                <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
                  {isAuthenticated ? (
                    <>
                      <Link
                        to={authRole !== 'customer' ? '/admin' : '/dashboard'}
                        className="btn-premium btn-premium-primary justify-center"
                      >
                        Go to {authRole !== 'customer' ? 'Admin Hub' : 'Dashboard'}
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="btn-premium btn-premium-secondary justify-center text-red-500 border-red-100"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="btn-premium btn-premium-secondary justify-center"
                      >
                        Self-Care Login
                      </Link>
                      <Link
                        to="/tariff"
                        className="btn-premium btn-premium-primary justify-center"
                      >
                        Explore Packages
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
