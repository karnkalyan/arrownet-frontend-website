import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, ArrowRight, Globe2 } from 'lucide-react';
import { useStore } from '../../store/useStore';

export default function Footer() {
  const { cms, logoUrl } = useStore();
  const { companyInfo } = cms;

  const socialLinks = [
    { name: 'Facebook', href: 'https://www.facebook.com/www.arrownet.com.np', icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg> },
    { name: 'Instagram', href: 'https://www.instagram.com/arrownetpvtltd', icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg> },
    { name: 'LinkedIn', href: 'https://www.linkedin.com/company/arrownet-pvt-ltd-nepal', icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg> },
    // { name: 'YouTube', href: 'https://www.youtube.com/@arrownetnepal', icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg> },
    // { name: 'TikTok', href: 'https://www.tiktok.com/@arrownetnepal', icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg> },
  ];

  return (
    <footer className="bg-white border-t border-slate-100">
      <div className="section-premium !pb-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16">
            {/* Branding Column */}
            <div className="lg:col-span-4 max-w-sm">
              <Link to="/" className="flex items-center mb-8 group">
                <img src={logoUrl} alt="Arrownet" className="h-14 object-contain opacity-90 group-hover:opacity-100 transition-all duration-500" />
              </Link>
              <p className="text-slate-500 font-medium leading-relaxed mb-10">
                Pioneering the next wave of Nepal's digital infrastructure. Ultra-high-speed fiber technology for the modern enterprise.
              </p>
              {/* Social Media Links */}
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white hover:scale-110 transition-all duration-300"
                    title={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="lg:col-span-2">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900 mb-8" style={{ fontFamily: 'Poppins' }}>Ecosystem</h4>
              <ul className="space-y-4">
                {[
                  { label: 'Network Tariff', href: '/tariff' },
                  { label: 'About Us', href: '/about' },
                  { label: 'Payment Hub', href: '/epayment' },
                  { label: 'Blog', href: '/blog' },
                  { label: 'Careers', href: '/career' },
                  { label: 'Contact Us', href: '/contact' }
                ].map(link => (
                  <li key={link.label}>
                    <Link to={link.href} className="text-[13px] font-bold text-slate-400 hover:text-primary transition-colors flex items-center gap-2 group">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-primary transition-colors" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support — Clickable */}
            <div className="lg:col-span-3">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900 mb-8" style={{ fontFamily: 'Poppins' }}>Get in Touch</h4>
              <ul className="space-y-6">
                <li className="group">
                  <a href={`tel:${companyInfo.phone.replace(/\s/g, '')}`} className="flex gap-4 items-start hover:opacity-80 transition-opacity">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                      <Phone size={18} />
                    </div>
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Call Us</div>
                      <div className="text-sm font-black text-slate-900">{companyInfo.phone}</div>
                      <div className="text-xs text-slate-400 mt-0.5">Toll-free: {companyInfo.tollFree}</div>
                    </div>
                  </a>
                </li>
                <li className="group">
                  <a href={`mailto:${companyInfo.email}`} className="flex gap-4 items-start hover:opacity-80 transition-opacity">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                      <Mail size={18} />
                    </div>
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Email Us</div>
                      <div className="text-sm font-black text-slate-900">{companyInfo.email}</div>
                    </div>
                  </a>
                </li>
              </ul>
            </div>

            {/* Location — Clickable */}
            <div className="lg:col-span-3">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900 mb-8" style={{ fontFamily: 'Poppins' }}>Visit Us</h4>
              <a
                href="https://www.google.com/maps?q=27.694646799999997,85.3106056"
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-4 group hover:opacity-80 transition-opacity"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-primary flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-sm font-black text-slate-900 mb-2">{companyInfo.address}</p>
                  <p className="text-[12px] text-slate-400 font-medium">Click to open in Google Maps</p>
                </div>
              </a>
              <div className="mt-8 pt-8 border-t border-slate-50">
                <div className="flex items-center gap-3">
                  <Globe2 size={16} className="text-slate-300" />
                  <span className="text-[12px] font-bold text-slate-400">Operating across 32 zones in Nepal</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-50 bg-slate-50/30">
        <div className="container mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[13px] font-bold text-slate-400">
            © {new Date().getFullYear()} Arrownet Pvt. Ltd. Engineered in Nepal.
          </p>
          <div className="flex gap-8">
            {['Privacy Policy', 'Terms of Service', 'SLA'].map(item => (
              <a key={item} href="#" className="text-[13px] font-bold text-slate-400 hover:text-primary transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
