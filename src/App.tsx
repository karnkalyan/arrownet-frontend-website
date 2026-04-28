import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from './store/useStore';

// Shared
import Navbar from './components/shared/Navbar';
import Footer from './components/shared/Footer';
import WhatsAppWidget from './components/shared/WhatsAppWidget';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Tariff from './pages/Tariff';
import EPayment from './pages/EPayment';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Career from './pages/Career';
import PackageDetail from './pages/PackageDetail';
import ServiceDetail from './pages/ServiceDetail';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';

// Dashboard
import DashboardLayout from './components/dashboard/DashboardLayout';
import DashboardOverview from './pages/dashboard/DashboardOverview';
import UsageStats from './pages/dashboard/UsageStats';
import WlanManager from './pages/dashboard/WlanManager';
import WanInfo from './pages/dashboard/WanInfo';
import BillingHistory from './pages/dashboard/BillingHistory';
import SupportTickets from './pages/dashboard/SupportTickets';
import UserProfile from './pages/dashboard/UserProfile';

// Admin
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import CMSEditor from './pages/admin/CMSEditor';
import PackageManager from './pages/admin/PackageManager';
import CustomerManager from './pages/admin/CustomerManager';
import TicketDesk from './pages/admin/TicketDesk';
import SettingsPage from './pages/admin/SettingsPage';
import CareerManager from './pages/admin/CareerManager';
import BlogManager from './pages/admin/BlogManager';
import FAQManager from './pages/admin/FAQManager';
import BranchManager from './pages/admin/BranchManager';
import TestimonialManager from './pages/admin/TestimonialManager';
import LeadManager from './pages/admin/LeadManager';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
    >
      {children}
    </motion.div>
  );
}

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <PageWrapper>{children}</PageWrapper>
      </main>
      <Footer />
      <WhatsAppWidget />
    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes with Navbar + Footer */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
        <Route path="/tariff" element={<PublicLayout><Tariff /></PublicLayout>} />
        <Route path="/epayment" element={<PublicLayout><EPayment /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
        <Route path="/career" element={<PublicLayout><Career /></PublicLayout>} />
        <Route path="/blog" element={<PublicLayout><Blog /></PublicLayout>} />
        <Route path="/blog/:slug" element={<PublicLayout><BlogPost /></PublicLayout>} />
        <Route path="/package/:id" element={<PublicLayout><PackageDetail /></PublicLayout>} />
        <Route path="/service/:id" element={<PublicLayout><ServiceDetail /></PublicLayout>} />

        {/* Login - standalone (no nav/footer) */}
        <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />

        {/* Dashboard Routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<PageWrapper><DashboardOverview /></PageWrapper>} />
          <Route path="usage" element={<PageWrapper><UsageStats /></PageWrapper>} />
          <Route path="wlan" element={<PageWrapper><WlanManager /></PageWrapper>} />
          <Route path="wan" element={<PageWrapper><WanInfo /></PageWrapper>} />
          <Route path="billing" element={<PageWrapper><BillingHistory /></PageWrapper>} />
          <Route path="support" element={<PageWrapper><SupportTickets /></PageWrapper>} />
          <Route path="profile" element={<PageWrapper><UserProfile /></PageWrapper>} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<PageWrapper><AdminDashboard /></PageWrapper>} />
          <Route path="cms" element={<PageWrapper><CMSEditor /></PageWrapper>} />
          <Route path="packages" element={<PageWrapper><PackageManager /></PageWrapper>} />
          <Route path="careers" element={<PageWrapper><CareerManager /></PageWrapper>} />
          <Route path="blog" element={<PageWrapper><BlogManager /></PageWrapper>} />
          <Route path="faqs" element={<PageWrapper><FAQManager /></PageWrapper>} />
          <Route path="branches" element={<PageWrapper><BranchManager /></PageWrapper>} />
          <Route path="testimonials" element={<PageWrapper><TestimonialManager /></PageWrapper>} />
          <Route path="customers" element={<PageWrapper><CustomerManager /></PageWrapper>} />
          <Route path="tickets" element={<PageWrapper><TicketDesk /></PageWrapper>} />
          <Route path="leads" element={<PageWrapper><LeadManager /></PageWrapper>} />
          <Route path="settings" element={<PageWrapper><SettingsPage /></PageWrapper>} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  const { logoUrl, updateLogo, initAuth, fetchInitialData } = useStore();

  useEffect(() => {
    initAuth();
    fetchInitialData();
  }, [initAuth, fetchInitialData]);

  useEffect(() => {
    if (logoUrl === "https://www.arrownet.com.np/images/arrownet_header.png") {
      updateLogo("/logo.png");
    }
  }, [logoUrl, updateLogo]);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'premium-toast',
          duration: 4000,
          style: {
            background: '#ffffff',
            color: '#0f172a',
            border: '1px solid #f1f5f9',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.08)',
            borderRadius: '24px',
            padding: '16px 24px',
            fontSize: '14px',
            fontWeight: 800,
            fontFamily: 'Poppins',
          },
        }}
      />

      <div className="flex flex-col min-h-screen bg-white text-slate-900 selection:bg-primary/20">
        <AnimatedRoutes />
      </div>
    </BrowserRouter>
  );
}
