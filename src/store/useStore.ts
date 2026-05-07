import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import api from '../api/axios';

export type AuthRole = 'admin' | 'editor_crm' | 'customer' | 'superadmin' | null;

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  date: string;
  readTime: string;
  featured?: boolean;
  isActive?: boolean;
  isDeleted?: boolean;
}

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
  isActive?: boolean;
  isDeleted?: boolean;
}

interface Branch {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  lat: number;
  lon: number;
  zone: string;
  isActive?: boolean;
  isDeleted?: boolean;
}

interface Testimonial {
  id: number;
  name: string;
  designation: string;
  company: string;
  type: 'corporate' | 'government';
  quote: string;
  rating: number;
  isActive?: boolean;
  isDeleted?: boolean;
}

interface AppState {
  // Auth
  authRole: AuthRole;
  currentCustomerId: string | null;
  isAuthenticated: boolean;
  currentUser: any;

  // DB State
  cms: any;
  packages: any[];
  customers: any[];
  tickets: any[];

  // Data stores
  blogPosts: BlogPost[];
  faqs: FAQ[];
  branches: Branch[];
  testimonials: Testimonial[];

  // Global Settings
  settings: any;
  logoUrl: string;
  adminLogoUrl: string;
  faviconUrl: string;
  authLoading: boolean;

  setupCharges: any[];
  tariffNotes: any[];
  taxRate: number;
  themeColors: any;
  whatsappNumber: string;
  heroImageUrl: string;
  sectionImages: Record<string, string>;

  // Actions
  fetchInitialData: () => Promise<void>;
  fetchAdminData: () => Promise<void>;
  fetchSettings: () => Promise<void>;
  initAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  fetchCustomerProfile: (customerId: string) => Promise<void>;
  getCurrentCustomer: () => any | null;

  // Settings Actions
  updateSettings: (data: FormData | any) => Promise<boolean>;

  addPackage: (data: any) => Promise<boolean>;
  updatePackage: (id: number, data: any) => Promise<boolean>;
  deletePackage: (id: number) => Promise<boolean>;

  // Setup Charges & Notes (Shared)
  fetchTariffExtras: () => Promise<void>;
  addSetupCharge: (data: any) => Promise<boolean>;
  updateSetupCharge: (id: number, data: any) => Promise<boolean>;
  deleteSetupCharge: (id: number) => Promise<boolean>;
  addTariffNote: (data: any) => Promise<boolean>;
  updateTariffNote: (id: number, data: any) => Promise<boolean>;
  deleteTariffNote: (id: number) => Promise<boolean>;

  addBlogPost: (data: any) => Promise<boolean>;
  updateBlogPost: (id: number, data: any) => Promise<boolean>;
  deleteBlogPost: (id: number) => Promise<boolean>;

  addFAQ: (data: any) => Promise<boolean>;
  updateFAQ: (id: number, data: any) => Promise<boolean>;
  deleteFAQ: (id: number) => Promise<boolean>;

  addBranch: (data: any) => Promise<boolean>;
  updateBranch: (id: number, data: any) => Promise<boolean>;
  deleteBranch: (id: number) => Promise<boolean>;

  addTestimonial: (data: any) => Promise<boolean>;
  updateTestimonial: (id: number, data: any) => Promise<boolean>;
  deleteTestimonial: (id: number) => Promise<boolean>;

  addCareer: (data: any) => Promise<boolean>;
  deleteCareer: (id: number) => Promise<boolean>;

  updateCMS: (path: string[], value: any) => void;
  saveAnnouncements: (texts: string[]) => Promise<boolean>;

  // Leads
  leads: any[];
  submitLead: (data: any) => Promise<boolean>;
  fetchLeads: (query?: any) => Promise<void>;
  updateLead: (id: number, data: any) => Promise<boolean>;
  deleteLead: (id: number) => Promise<boolean>;

  // Job Applications
  jobApplications: any[];
  fetchJobApplications: () => Promise<void>;
  submitJobApplication: (data: FormData) => Promise<boolean>;
  updateJobApplicationStatus: (id: number, status: string) => Promise<boolean>;

  addTicket: (data: any) => Promise<boolean>;
  updateTicketStatus: (id: string, status: string) => Promise<boolean>;
  addTicketMessage: (id: string, msg: any) => Promise<boolean>;

  updateWlanSSID: (customerId: string, ssidId: number, data: any) => void;
  toggleDeviceBlock: (customerId: string, deviceId: string) => void;

  updateCustomerStatus: (id: string, status: string) => Promise<boolean>;
  deleteCustomer: (id: string) => Promise<boolean>;
  updateTheme: (colors: any) => void;
  updateLogo: (url: string) => void;
  updateWhatsappNumber: (number: string) => void;
  updateHeroImage: (url: string) => void;
  updateSectionImage: (key: string, url: string) => void;
  applySettings: (settings: any) => void;

  // Contact Submissions
  contactSubmissions: any[];
  fetchContactSubmissions: () => Promise<void>;
  submitContactForm: (data: any) => Promise<boolean>;
  updateContactStatus: (id: number, status: string) => Promise<boolean>;
  deleteContactSubmission: (id: number) => Promise<boolean>;
}

const defaultCMS = {
  companyInfo: {
    phone: '+977 1 5971333',
    email: 'info@arrownet.com.np',
    address: 'Kathmandu, Nepal',
    tollFree: '16600112345'
  },
  theme: {},
  announcements: [],
  heroSection: {
    title: 'THE NEW ARROWNET ERA',
    subtitle: 'Full spectrum control over your digital infrastructure.',
    primaryCTA: 'Get Started',
    secondaryCTA: 'View Plans'
  },
  aboutSection: {
    mission: 'To provide seamless connectivity to every corner of Nepal.',
    marketPosition: 'Leading ISP in Kathmandu Valley.'
  },
  services: [],
  footerLinks: { quickLinks: [], socialMedia: {} },
  careers: [],
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // State
      authRole: null,
      isAuthenticated: false,
      currentUser: null,
      currentCustomerId: null,
      authLoading: true,
      cms: defaultCMS,
      packages: [],
      setupCharges: [],
      tariffNotes: [],
      taxRate: 13,
      logoUrl: "/logo.png",
      adminLogoUrl: "/logo.png",
      faviconUrl: "/favicon.ico",
      whatsappNumber: "9801000000",
      heroImageUrl: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=2070&auto=format&fit=crop",
      sectionImages: {},
      contactSubmissions: [],
      blogs: [],
      blogPosts: [],
      faqs: [],
      branches: [],
      testimonials: [],
      announcements: [],
      settings: {},
      customers: [],
      leads: [],
      jobApplications: [],
      tickets: [],
      themeColors: {
        primary: '#4c08cd',
        secondary: '#ed060d',
        accent: '#eecf00',
      },

      // Contact Submission Actions
      submitContactForm: async (data: any) => {
        try {
          await api.post('/contact/submit', data);
          return true;
        } catch (error) { console.error(error); return false; }
      },
      fetchContactSubmissions: async () => {
        try {
          const res = await api.get('/contact/submissions');
          set({ contactSubmissions: res.data });
        } catch (error) { console.error(error); }
      },
      updateContactStatus: async (id: number, status: string) => {
        try {
          const res = await api.put(`/contact/submissions/${id}/status`, { status });
          set(state => ({
            contactSubmissions: state.contactSubmissions.map(s => s.id === id ? res.data : s)
          }));
          return true;
        } catch (error) { console.error(error); return false; }
      },
      deleteContactSubmission: async (id: number) => {
        try {
          await api.delete(`/contact/submissions/${id}`);
          set(state => ({
            contactSubmissions: state.contactSubmissions.filter(s => s.id !== id)
          }));
          return true;
        } catch (error) { console.error(error); return false; }
      },

      fetchInitialData: async () => {
        try {
          const [blogsRes, faqsRes, branchesRes, testimonialsRes, packagesRes, careersRes, annRes, settingsRes, chargesRes, notesRes] = await Promise.all([
            api.get('/cms/blogs'),
            api.get('/cms/faqs'),
            api.get('/cms/branches'),
            api.get('/cms/testimonials'),
            api.get('/packages'),
            api.get('/cms/careers'),
            api.get('/cms/announcements'),
            api.get('/settings').catch(() => ({ data: null })),
            api.get('/tariffs/setup-charges').catch(() => ({ data: [] })),
            api.get('/tariffs/notes').catch(() => ({ data: [] })),
          ]);
          
          if (settingsRes.data) {
            get().applySettings(settingsRes.data);
          }

          set((state) => ({
            blogPosts: blogsRes.data,
            faqs: faqsRes.data,
            branches: branchesRes.data,
            testimonials: testimonialsRes.data,
            packages: packagesRes.data,
            setupCharges: chargesRes.data,
            tariffNotes: notesRes.data,
            taxRate: settingsRes.data?.taxRate || 13,
            cms: {
              ...state.cms,
              careers: careersRes.data,
              announcements: annRes.data.map((a: any) => a.text),
            }
          }));
        } catch (error) {
          console.error("Failed to fetch initial data from API", error);
        }
      },

      fetchSettings: async () => {
        try {
          const res = await api.get('/settings');
          if (res.data) {
            get().applySettings(res.data);
          }
        } catch (error) { console.error(error); }
      },

      updateSettings: async (data) => {
        try {
          const isFormData = data instanceof FormData;
          const res = await api.put('/settings', data, {
            headers: { 'Content-Type': isFormData ? 'multipart/form-data' : 'application/json' }
          });
          if (res.data) {
            get().applySettings(res.data);
            return true;
          }
          return false;
        } catch (error) { 
          console.error("Update settings error:", error); 
          return false; 
        }
      },

      applySettings: (settings: any) => {
        if (!settings) return;

        // Apply theme colors
        if (settings.primaryColor) {
          document.documentElement.style.setProperty('--primary', settings.primaryColor);
          document.documentElement.style.setProperty('--secondary', settings.secondaryColor);
          document.documentElement.style.setProperty('--accent', settings.accentColor);
        }

        const API_HOST = (import.meta.env.VITE_API_URL || '/api').replace('/api', '');
        const formatUrl = (url: string) => url?.startsWith('/uploads') ? `${API_HOST}${url}` : (url || '/logo.png');
        const formatFav = (url: string) => url?.startsWith('/uploads') ? `${API_HOST}${url}` : (url || '/favicon.ico');

        set((state) => ({
          settings,
          logoUrl: formatUrl(settings.logoUrl),
          adminLogoUrl: formatUrl(settings.adminLogoUrl),
          faviconUrl: formatFav(settings.faviconUrl),
          heroImageUrl: settings.heroImageUrl?.startsWith('/uploads') ? `${API_HOST}${settings.heroImageUrl}` : (settings.heroImageUrl || state.heroImageUrl),
          sectionImages: {
            ...state.sectionImages,
            home_cta: settings.homeCtaImageUrl?.startsWith('/uploads') ? `${API_HOST}${settings.homeCtaImageUrl}` : (settings.homeCtaImageUrl || state.sectionImages.home_cta),
            about_promo: settings.aboutPromoImageUrl?.startsWith('/uploads') ? `${API_HOST}${settings.aboutPromoImageUrl}` : (settings.aboutPromoImageUrl || state.sectionImages.about_promo),
          },
          cms: {
            ...state.cms,
            heroSection: {
              title: settings.heroTitle || state.cms.heroSection.title,
              subtitle: settings.heroSubtitle || state.cms.heroSection.subtitle,
              primaryCTA: settings.heroPrimaryCTA || state.cms.heroSection.primaryCTA,
              secondaryCTA: settings.heroSecondaryCTA || state.cms.heroSection.secondaryCTA
            },
            aboutSection: {
              mission: settings.aboutMission || state.cms.aboutSection.mission,
              marketPosition: settings.aboutMarketPosition || state.cms.aboutSection.marketPosition
            },
            companyInfo: {
              ...state.cms.companyInfo,
              phone: settings.contactPhone || state.cms.companyInfo.phone,
              email: settings.contactEmail || state.cms.companyInfo.email,
              address: settings.contactAddress || state.cms.companyInfo.address,
              tollFree: settings.tollFree || state.cms.companyInfo.tollFree
            }
          },
          whatsappNumber: settings.whatsappNumber || state.whatsappNumber
        }));
      },

      fetchAdminData: async () => {
        try {
          const [customersRes, ticketsRes, leadsRes] = await Promise.all([
            api.get('/customers'),
            api.get('/tickets'),
            api.get('/leads'),
          ]);
          set({
            customers: customersRes.data,
            tickets: ticketsRes.data,
            leads: leadsRes.data,
          });
        } catch (error) {
          console.error("Failed to fetch admin data", error);
        }
      },

      initAuth: async () => {
        set({ authLoading: true });
        try {
          let token = localStorage.getItem('accessToken');
          
          // Seamless session recovery via refresh token cookie
          if (!token) {
            try {
              const refreshRes = await axios.post(`${import.meta.env.VITE_API_URL || '/api'}/auth/refresh`, {}, { withCredentials: true });
              token = refreshRes.data.accessToken;
              localStorage.setItem('accessToken', token);
              api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            } catch (e) {
              set({ isAuthenticated: false, authRole: null, currentUser: null, authLoading: false });
              return; // No active session
            }
          }

          const res = await api.get('/auth/me');
          const user = res.data;
          const role = user.role.toLowerCase() as AuthRole;
          const custId = user.customerId || user.profile?.id || null;
          set({
            isAuthenticated: true,
            authRole: role,
            currentUser: user,
            currentCustomerId: custId,
            authLoading: false,
          });
          if (role === 'customer' && custId) {
            await get().fetchCustomerProfile(custId);
          } else if (role !== 'customer') {
            await get().fetchAdminData();
          }
        } catch (error) {
          console.error("Failed to restore session", error);
          localStorage.removeItem('accessToken');
          set({ isAuthenticated: false, authRole: null, currentUser: null, authLoading: false });
        }
      },

      login: async (email, password) => {
        try {
          const res = await api.post('/auth/login', { email, password });
          const { user, accessToken } = res.data;
          
          localStorage.setItem('accessToken', accessToken);
          
          const role = user.role.toLowerCase() as AuthRole;
          const custId = user.customerId || user.profile?.id || null;
          set({
            isAuthenticated: true,
            authRole: role,
            currentUser: user,
            currentCustomerId: custId,
          });

          if (role === 'customer' && custId) {
            await get().fetchCustomerProfile(custId);
          } else if (role !== 'customer') {
            await get().fetchAdminData();
          }

          return true;
        } catch (error) {
          console.error("Login failed", error);
          return false;
        }
      },

      logout: async () => {
        try {
          await api.post('/auth/logout');
        } catch (error) {
          console.error("Logout request failed, cleaning local state anyway");
        } finally {
          localStorage.removeItem('accessToken');
          set({ authRole: null, isAuthenticated: false, currentUser: null, currentCustomerId: null, customers: [], tickets: [] });
        }
      },

      getCurrentCustomer: () => {
        const { currentCustomerId, customers } = get();
        if (!currentCustomerId) return null;
        return customers.find(c => c.id === currentCustomerId) || null;
      },

      fetchCustomerProfile: async (customerId: string) => {
        try {
          const res = await api.get(`/customers/${customerId}`);
          const raw = res.data;

          // Compute aggregate usage from usage records
          const usageRecords = raw.usage || [];
          const latestUsage = usageRecords.length > 0
            ? usageRecords.reduce((a: any, b: any) => new Date(a.createdAt) > new Date(b.createdAt) ? a : b)
            : null;

          const totalDownloaded = usageRecords.reduce((sum: number, u: any) => sum + (u.downloadedGB || 0), 0);
          const totalUploaded = usageRecords.reduce((sum: number, u: any) => sum + (u.uploadedGB || 0), 0);

          // Compute days left from expiryDate
          const now = new Date();
          const expiry = raw.expiryDate ? new Date(raw.expiryDate) : null;
          const join = raw.joinDate ? new Date(raw.joinDate) : now;
          const totalDays = expiry ? Math.max(1, Math.ceil((expiry.getTime() - join.getTime()) / (1000 * 60 * 60 * 24))) : 30;
          const daysLeft = expiry ? Math.max(0, Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))) : 0;

          // Build monthlyUsage for chart from MONTHLY usage records
          const monthlyUsage = usageRecords
            .filter((u: any) => u.type === 'MONTHLY')
            .map((u: any) => ({
              month: u.period,
              download: u.downloadedGB || 0,
              upload: u.uploadedGB || 0,
            }));

          const profile = {
            id: raw.id,
            userId: raw.userId,
            name: raw.name,
            email: raw.user?.email || '',
            phone: raw.phone,
            address: raw.address,
            status: raw.status || 'Offline',
            plan: raw.plan?.name || 'No Plan',
            planType: raw.plan?.type || 'Home',
            planSpeed: raw.plan?.speed || '',
            joinDate: raw.joinDate,
            expiryDate: expiry ? expiry.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A',
            totalDays,
            daysLeft,
            usage: {
              totalGB: latestUsage?.totalGB || parseFloat((totalDownloaded + totalUploaded).toFixed(1)),
              limitGB: latestUsage?.limitGB || 100,
              downloadedGB: parseFloat(totalDownloaded.toFixed(1)),
              uploadedGB: parseFloat(totalUploaded.toFixed(1)),
            },
            monthlyUsage: monthlyUsage.length > 0 ? monthlyUsage : [
              { month: 'Current', download: totalDownloaded, upload: totalUploaded },
            ],
            invoices: (raw.invoices || []).map((inv: any) => ({
              id: inv.id,
              date: inv.date,
              amount: inv.amount,
              status: inv.status,
              planName: inv.planName,
              period: inv.period,
            })),
            tickets: (raw.tickets || []).map((t: any) => ({
              id: t.id,
              userId: t.customerId,
              customerName: raw.name,
              subject: t.subject,
              status: t.status,
              priority: t.priority,
              created: t.createdAt ? new Date(t.createdAt).toISOString().split('T')[0] : 'N/A',
              messages: (t.messages || []).map((m: any) => ({
                id: m.id,
                sender: m.sender,
                text: m.text,
                time: m.time || (m.createdAt ? new Date(m.createdAt).toLocaleString() : 'N/A'),
              })),
            })),
            wlan: raw.wlan || null,
          };

          set((state) => {
            const exists = state.customers.some(c => c.id === customerId);
            return {
              customers: exists
                ? state.customers.map(c => c.id === customerId ? profile : c)
                : [...state.customers, profile],
            };
          });
        } catch (error) {
          console.error('Failed to fetch customer profile', error);
        }
      },

      updateTheme: (colors) => {
        set(state => ({ themeColors: { ...state.themeColors, ...colors } }));
      },
      updateLogo: (url) => { set({ logoUrl: url }); },
      updateWhatsappNumber: (number) => { set({ whatsappNumber: number }); },
      updateHeroImage: (url) => { set({ heroImageUrl: url }); },
      updateSectionImage: (key, url) => {
        set(state => ({ sectionImages: { ...state.sectionImages, [key]: url } }));
      },

      // Unified Package CRUD
      addPackage: async (data) => {
        try {
          const res = await api.post('/packages', data);
          set(state => ({ packages: [res.data, ...state.packages] }));
          return true;
        } catch (error) { console.error(error); return false; }
      },
      updatePackage: async (id, data) => {
        try {
          const res = await api.put(`/packages/${id}`, data);
          set(state => ({ packages: state.packages.map(p => p.id === id ? res.data : p) }));
          return true;
        } catch (error) { console.error(error); return false; }
      },
      deletePackage: async (id) => {
        try {
          await api.delete(`/packages/${id}`);
          set(state => ({ packages: state.packages.filter(p => p.id !== id) }));
          return true;
        } catch (error) { console.error(error); return false; }
      },

      fetchTariffExtras: async () => {
        try {
          const [chargesRes, notesRes] = await Promise.all([
            api.get('/tariffs/setup-charges'),
            api.get('/tariffs/notes'),
          ]);
          set({ setupCharges: chargesRes.data, tariffNotes: notesRes.data });
        } catch (error) { console.error(error); }
      },
      addSetupCharge: async (data) => {
        try {
          const res = await api.post('/tariffs/setup-charges', data);
          set(state => ({ setupCharges: [...state.setupCharges, res.data] }));
          return true;
        } catch (error) { console.error(error); return false; }
      },
      updateSetupCharge: async (id, data) => {
        try {
          const res = await api.put(`/tariffs/setup-charges/${id}`, data);
          set(state => ({ setupCharges: state.setupCharges.map(c => c.id === id ? res.data : c) }));
          return true;
        } catch (error) { console.error(error); return false; }
      },
      deleteSetupCharge: async (id) => {
        try {
          await api.delete(`/tariffs/setup-charges/${id}`);
          set(state => ({ setupCharges: state.setupCharges.filter(c => c.id !== id) }));
          return true;
        } catch (error) { console.error(error); return false; }
      },
      addTariffNote: async (data) => {
        try {
          const res = await api.post('/tariffs/notes', data);
          set(state => ({ tariffNotes: [...state.tariffNotes, res.data] }));
          return true;
        } catch (error) { console.error(error); return false; }
      },
      updateTariffNote: async (id, data) => {
        try {
          const res = await api.put(`/tariffs/notes/${id}`, data);
          set(state => ({ tariffNotes: state.tariffNotes.map(n => n.id === id ? res.data : n) }));
          return true;
        } catch (error) { console.error(error); return false; }
      },
      deleteTariffNote: async (id) => {
        try {
          await api.delete(`/tariffs/notes/${id}`);
          set(state => ({ tariffNotes: state.tariffNotes.filter(n => n.id !== id) }));
          return true;
        } catch (error) { console.error(error); return false; }
      },

      // CRUD Blogs
      addBlogPost: async (data) => {
        try {
          const res = await api.post('/cms/blogs', data);
          set(state => ({ blogPosts: [...state.blogPosts, res.data] }));
          return true;
        } catch (error) { console.error(error); return false; }
      },
      updateBlogPost: async (id, data) => {
        try {
          const res = await api.put(`/cms/blogs/${id}`, data);
          set(state => ({ blogPosts: state.blogPosts.map(p => p.id === id ? res.data : p) }));
          return true;
        } catch (error) { console.error(error); return false; }
      },
      deleteBlogPost: async (id) => {
        try {
          await api.delete(`/cms/blogs/${id}`);
          set(state => ({ blogPosts: state.blogPosts.filter(p => p.id !== id) }));
          return true;
        } catch (error) { console.error(error); return false; }
      },

      // CRUD FAQs
      addFAQ: async (data) => {
        try {
          const res = await api.post('/cms/faqs', data);
          set(state => ({ faqs: [...state.faqs, res.data] }));
          return true;
        } catch (error) { console.error(error); return false; }
      },
      updateFAQ: async (id, data) => {
        try {
          const res = await api.put(`/cms/faqs/${id}`, data);
          set(state => ({ faqs: state.faqs.map(p => p.id === id ? res.data : p) }));
          return true;
        } catch (error) { console.error(error); return false; }
      },
      deleteFAQ: async (id) => {
        try {
          await api.delete(`/cms/faqs/${id}`);
          set(state => ({ faqs: state.faqs.filter(p => p.id !== id) }));
          return true;
        } catch (error) { console.error(error); return false; }
      },

      // CRUD Branches
      addBranch: async (data) => {
        try {
          const res = await api.post('/cms/branches', data);
          set(state => ({ branches: [...state.branches, res.data] }));
          return true;
        } catch (error) { console.error(error); return false; }
      },
      updateBranch: async (id, data) => {
        try {
          const res = await api.put(`/cms/branches/${id}`, data);
          set(state => ({ branches: state.branches.map(p => p.id === id ? res.data : p) }));
          return true;
        } catch (error) { console.error(error); return false; }
      },
      deleteBranch: async (id) => {
        try {
          await api.delete(`/cms/branches/${id}`);
          set(state => ({ branches: state.branches.filter(p => p.id !== id) }));
          return true;
        } catch (error) { console.error(error); return false; }
      },

      // CRUD Testimonials
      addTestimonial: async (data) => {
        try {
          const res = await api.post('/cms/testimonials', data);
          set(state => ({ testimonials: [...state.testimonials, res.data] }));
          return true;
        } catch (error) { console.error(error); return false; }
      },
      updateTestimonial: async (id, data) => {
        try {
          const res = await api.put(`/cms/testimonials/${id}`, data);
          set(state => ({ testimonials: state.testimonials.map(p => p.id === id ? res.data : p) }));
          return true;
        } catch (error) { console.error(error); return false; }
      },
      deleteTestimonial: async (id) => {
        try {
          await api.delete(`/cms/testimonials/${id}`);
          set(state => ({ testimonials: state.testimonials.filter(p => p.id !== id) }));
          return true;
        } catch (error) { console.error(error); return false; }
      },

      // CRUD Careers
      addCareer: async (data) => {
        try {
          const res = await api.post('/cms/careers', data);
          set(state => ({ cms: { ...state.cms, careers: [...state.cms.careers, res.data] } }));
          return true;
        } catch (error) { console.error(error); return false; }
      },
      deleteCareer: async (id) => {
        try {
          await api.delete(`/cms/careers/${id}`);
          set(state => ({ cms: { ...state.cms, careers: state.cms.careers.filter((c: any) => c.id !== id) } }));
          return true;
        } catch (error) { console.error(error); return false; }
      },

      // CMS Updates
      updateCMS: (path, value) => {
        set(state => {
          const newCms = { ...state.cms };
          let current = newCms;
          for (let i = 0; i < path.length - 1; i++) {
            current = current[path[i]];
          }
          current[path[path.length - 1]] = value;
          return { cms: newCms };
        });
      },
      saveAnnouncements: async (texts) => {
        try {
          const res = await api.put('/cms/announcements/bulk', { announcements: texts });
          set(state => ({
            cms: {
              ...state.cms,
              announcements: res.data.map((a: any) => a.text)
            }
          }));
          return true;
        } catch (error) {
          console.error("Failed to save announcements", error);
          return false;
        }
      },

      // Lead Actions
      submitLead: async (data) => {
        try {
          await api.post('/leads', data);
          return true;
        } catch (error) { console.error(error); return false; }
      },
      fetchLeads: async (query) => {
        try {
          const res = await api.get('/leads', { params: query });
          set({ leads: res.data });
        } catch (error) { console.error(error); }
      },
      updateLead: async (id, data) => {
        try {
          const res = await api.patch(`/leads/${id}`, data);
          set(state => ({ leads: state.leads.map(l => l.id === id ? res.data : l) }));
          return true;
        } catch (error) { console.error(error); return false; }
      },
      deleteLead: async (id) => {
        try {
          await api.delete(`/leads/${id}`);
          set(state => ({ leads: state.leads.filter(l => l.id !== id) }));
          return true;
        } catch (error) { console.error(error); return false; }
      },

      // Job Application Actions
      fetchJobApplications: async () => {
        try {
          const res = await api.get('/job-applications');
          set({ jobApplications: res.data });
        } catch (error) { console.error(error); }
      },
      submitJobApplication: async (data: FormData) => {
        try {
          await api.post('/job-applications/apply', data, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          return true;
        } catch (error) { console.error(error); return false; }
      },
      updateJobApplicationStatus: async (id: number, status: string) => {
        try {
          const res = await api.put(`/job-applications/${id}/status`, { status });
          set(state => ({
            jobApplications: state.jobApplications.map(app => app.id === id ? res.data : app)
          }));
          return true;
        } catch (error) { console.error(error); return false; }
      },

      // Ticket Actions
      addTicket: async (data) => {
        try {
          const res = await api.post('/tickets', {
            customerId: data.userId,
            subject: data.subject,
            priority: data.priority,
            message: data.messages?.[0]?.text || data.subject,
          });
          const newTicket = {
            id: res.data.id,
            userId: res.data.customerId,
            customerName: data.customerName,
            subject: res.data.subject,
            status: res.data.status,
            priority: res.data.priority,
            created: new Date(res.data.createdAt).toISOString().split('T')[0],
            messages: (res.data.messages || []).map((m: any) => ({
              id: m.id,
              sender: m.sender,
              text: m.text,
              time: m.time || new Date(m.createdAt).toLocaleString(),
            })),
          };
          set(state => ({
            tickets: [...state.tickets, newTicket],
            customers: state.customers.map(c =>
              c.id === data.userId
                ? { ...c, tickets: [...(c.tickets || []), newTicket] }
                : c
            ),
          }));
          return true;
        } catch (error) { console.error(error); return false; }
      },
      updateTicketStatus: async (id, status) => {
        try {
          const res = await api.put(`/tickets/${id}/status`, { status });
          set(state => ({ tickets: state.tickets.map(t => t.id === id ? { ...t, status: res.data.status } : t) }));
          return true;
        } catch (error) { console.error(error); return false; }
      },
      addTicketMessage: async (id, msg) => {
        try {
          const res = await api.post(`/tickets/${id}/messages`, msg);
          const newMsg = {
            id: res.data.id,
            sender: res.data.sender,
            text: res.data.text,
            time: res.data.time || new Date(res.data.createdAt).toLocaleString(),
          };
          set(state => ({
            tickets: state.tickets.map(t => 
              t.id === id ? { ...t, messages: [...(t.messages || []), newMsg] } : t
            ),
            customers: state.customers.map(c => ({
              ...c,
              tickets: (c.tickets || []).map((t: any) =>
                t.id === id ? { ...t, messages: [...(t.messages || []), newMsg] } : t
              ),
            })),
          }));
          return true;
        } catch (error) { console.error(error); return false; }
      },

      // WLAN Actions (local-only — WLAN data is not in the DB schema yet)
      updateWlanSSID: (customerId, ssidId, data) => {
        set(state => ({
          customers: state.customers.map(c =>
            c.id === customerId && c.wlan
              ? { ...c, wlan: { ...c.wlan, ssids: c.wlan.ssids.map((s: any) => s.id === ssidId ? { ...s, ...data } : s) } }
              : c
          )
        }));
      },
      toggleDeviceBlock: (customerId, deviceId) => {
        set(state => ({
          customers: state.customers.map(c =>
            c.id === customerId && c.wlan
              ? { ...c, wlan: { ...c.wlan, connectedDevices: c.wlan.connectedDevices.map((d: any) => d.id === deviceId ? { ...d, blocked: !d.blocked } : d) } }
              : c
          )
        }));
      },

      // Customer Actions
      updateCustomerStatus: async (id, status) => {
        try {
          await api.put(`/customers/${id}`, { status });
          set(state => ({ customers: state.customers.map(c => c.id === id ? { ...c, status } : c) }));
          return true;
        } catch (error) { console.error(error); return false; }
      },
      deleteCustomer: async (id) => {
        try {
          await api.delete(`/customers/${id}`);
          set(state => ({ customers: state.customers.filter(c => c.id !== id) }));
          return true;
        } catch (error) { console.error(error); return false; }
      },


    }),
    {
      name: 'arrownet-store',
      partialize: (state) => ({
        authRole: state.authRole,
        isAuthenticated: state.isAuthenticated,
        currentUser: state.currentUser,
        currentCustomerId: state.currentCustomerId,
        themeColors: state.themeColors,
        logoUrl: state.logoUrl,
        adminLogoUrl: state.adminLogoUrl,
        faviconUrl: state.faviconUrl,
        whatsappNumber: state.whatsappNumber,
        heroImageUrl: state.heroImageUrl,
        sectionImages: state.sectionImages,
      }),
    }
  )
);
