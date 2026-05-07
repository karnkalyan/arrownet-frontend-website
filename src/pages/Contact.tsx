import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle, MessageSquare, Globe, ArrowRight, Shield } from 'lucide-react';
import { useStore } from '../store/useStore';
import toast, { Toaster } from 'react-hot-toast';

import NetworkBackground from '../components/shared/NetworkBackground';
import FloatingElements from '../components/shared/FloatingElements';
import BranchLocator from '../components/shared/BranchLocator';

export default function Contact() {
   const { cms, submitContactForm } = useStore();
   const { companyInfo } = cms;
   const [form, setForm] = useState({ name: '', email: '', phone: '', subject: 'Sales', message: '' });
   const [submitting, setSubmitting] = useState(false);
   const [submitted, setSubmitted] = useState(false);
   const containerRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      const ctx = gsap.context(() => {
         // Hero content
         gsap.fromTo('.contact-hero-item',
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
         );

         // Info cards
         gsap.fromTo('.contact-info-card',
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: 'power3.out', delay: 0.3 }
         );

         // Form and map sections
         gsap.fromTo('.contact-section',
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out', delay: 0.5 }
         );

         // Support cards
         gsap.fromTo('.support-card',
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: 'power3.out', delay: 0.7 }
         );

         // Career CTA
         gsap.fromTo('.career-cta',
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.9 }
         );
      }, containerRef);
      return () => ctx.revert();
   }, []);

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!form.name || !form.email || !form.message) {
         toast.error('Required fields are missing');
         return;
      }
      setSubmitting(true);
      const ok = await submitContactForm(form);
      setSubmitting(false);
      if (ok) {
         setSubmitted(true);
         toast.success('Our engineers will contact you shortly.');
      } else {
         toast.error('Failed to send message. Please try again.');
      }
   };

   return (
      <div className="bg-white min-h-screen" ref={containerRef}>
         <Toaster position="top-right" />

         {/* Hero */}
         <section className="relative py-32 overflow-hidden bg-slate-900">
            <div className="absolute inset-0">
               <NetworkBackground variant="grid" opacity={0.06} color="#E30613" />
               <FloatingElements count={10} />
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-transparent to-slate-900" />

            <div className="container mx-auto px-6 relative z-10 text-center">
               <div className="contact-hero-item inline-flex items-center gap-3 px-5 py-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl mb-10">
                  <MessageSquare size={16} className="text-secondary fill-secondary/20" />
                  <span className="text-[11px] font-black uppercase tracking-[0.3em] text-secondary">Response center</span>
               </div>
               <h1 className="contact-hero-item text-fluid-h1 font-black text-white mb-6" style={{ fontFamily: 'Poppins' }}>
                  Let's Build the <span className="text-accent italic drop-shadow-md">Next Connection.</span>
               </h1>
               <p className="contact-hero-item text-xl text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed">
                  Whether you need enterprise-level deployment or high-speed home fiber, our team of experts is ready to architect your solution.
               </p>
            </div>
         </section>

         <div className="container mx-auto px-6 -mt-16 relative z-20 pb-32">
            {/* Contact info cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
               {[
                  { icon: <Phone size={24} />, title: 'Main line', value: companyInfo.phone, sub: '8:00 AM - 10:00 PM' },
                  { icon: <Globe size={24} />, title: 'Toll free', value: companyInfo.tollFree || '16600112345', sub: 'Nepal Telecom / Ncell' },
                  { icon: <Mail size={24} />, title: 'Email address', value: companyInfo.email, sub: 'Operations Support' },
                  { icon: <MapPin size={24} />, title: 'Location', value: companyInfo.address, sub: 'Kathmandu, Nepal' },
               ].map((c, i) => (
                  <div key={i} className="contact-info-card group relative bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:-translate-y-2 hover:border-orange-200 transition-all duration-500 overflow-hidden">
                     <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-primary mb-6 transition-all duration-500 group-hover:bg-primary group-hover:text-white group-hover:scale-110">
                        {c.icon}
                     </div>
                     <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{c.title}</div>
                     <div className="text-lg font-black text-slate-900 mb-1" style={{ fontFamily: 'Poppins' }}>{c.value}</div>
                     <div className="text-sm text-slate-500 font-medium">{c.sub}</div>
                  </div>
               ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
               {/* Section 1: Form */}
               <div className="contact-section">
                  <div className="p-10 md:p-14 rounded-[40px] bg-white border border-slate-100 shadow-2xl shadow-slate-200/60 sticky top-32">
                     <h2 className="text-3xl font-black text-slate-900 mb-4" style={{ fontFamily: 'Poppins' }}>Drop a Broadcast.</h2>
                     <p className="text-slate-500 font-medium mb-12">Expect a technical follow-up within 180 minutes of submission.</p>

                     <AnimatePresence mode="wait">
                        {submitted ? (
                           <motion.div
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="text-center py-10"
                           >
                              <div className="w-20 h-20 rounded-[32px] bg-green-50 flex items-center justify-center text-green-500 mx-auto mb-8">
                                 <CheckCircle size={40} />
                              </div>
                              <h3 className="text-2xl font-black text-slate-900 mb-2" style={{ fontFamily: 'Poppins' }}>Broadcast Successful.</h3>
                              <p className="text-slate-400 font-medium mb-8">Our engagement team has been notified.</p>
                              <button
                                 onClick={() => setSubmitted(false)}
                                 className="btn-premium btn-premium-secondary"
                              >
                                 Send New Transmission
                              </button>
                           </motion.div>
                        ) : (
                           <form onSubmit={handleSubmit} className="space-y-6">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                 <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Full Identity</label>
                                    <input
                                       className="input-premium"
                                       placeholder="Jane Doe"
                                       value={form.name}
                                       onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                                    />
                                 </div>
                                 <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Contact Protocol</label>
                                    <input
                                       className="input-premium"
                                       placeholder="+977 98..."
                                       value={form.phone}
                                       onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                                    />
                                 </div>
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Digital Mailbox</label>
                                 <input
                                    className="input-premium"
                                    type="email"
                                    placeholder="jane@example.com"
                                    value={form.email}
                                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                                 />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Broadcast Intent</label>
                                 <select
                                    className="input-premium"
                                    value={form.subject}
                                    onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
                                 >
                                    <option value="">Select an option</option>
                                    <option value="Sales">New Connection / Sales</option>
                                    <option value="Support">Technical Support</option>
                                    <option value="Enterprise">Enterprise Solutions</option>
                                    <option value="Billing">Billing & Account</option>
                                 </select>
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Instruction Details</label>
                                 <textarea
                                    className="input-premium resize-none"
                                    rows={5}
                                    placeholder="Please detail your requirements..."
                                    value={form.message}
                                    onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                                 />
                              </div>
                              <button
                                 type="submit"
                                 disabled={submitting}
                                 className="w-full btn-premium btn-premium-primary !py-5 justify-center group"
                              >
                                 {submitting ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                 ) : (
                                    <>Initiate Transmission <Send size={20} className="ml-1 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></>
                                 )}
                              </button>
                           </form>
                        )}
                     </AnimatePresence>
                  </div>
               </div>

               {/* Section 2: Info & Map */}
               <div className="space-y-12">
                  <div className="contact-section rounded-[40px] overflow-hidden shadow-2xl shadow-slate-200/40 relative h-[400px] border border-slate-100">
                     <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.7329736990014!2d85.3106056!3d27.694646799999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb185265d3bf69%3A0x7fd5be999076df97!2sArrownet%20Pvt.%20Ltd.!5e0!3m2!1sen!2snp!4v1775889950901!5m2!1sen!2snp"
                        width="100%" height="100%" style={{ border: 0, filter: 'grayscale(0.1)' }} allowFullScreen loading="lazy"
                        title="Arrownet HQ Location"
                     />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
                     <div className="support-card relative bg-white rounded-3xl p-8 border border-slate-100 shadow-lg shadow-slate-100/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 overflow-hidden">
                        <div className="flex items-center gap-3 mb-4">
                           <Clock size={20} className="text-primary" />
                           <h4 className="font-bold text-slate-900" style={{ fontFamily: 'Poppins' }}>Technical Support</h4>
                        </div>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed">
                           Our NOC (Network Operations Center) operates 24/7. Call our dedicated hunting line for field assistance.
                        </p>
                        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                           <span className="text-sm font-black text-slate-900">info@arrownet.com.np</span>
                           <ArrowRight size={16} className="text-primary" />
                        </div>
                     </div>

                     {/* <div className="support-card relative bg-white rounded-3xl p-8 border border-slate-100 shadow-lg shadow-slate-100/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 overflow-hidden">
                    <div className="flex items-center gap-3 mb-4">
                       <Shield size={20} className="text-primary" />
                       <h4 className="font-bold text-slate-900" style={{ fontFamily: 'Poppins' }}>Security Center</h4>
                    </div>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed">
                       Reporting malware or network intrusions? Reach our cybersecurity team for rapid mitigation.
                    </p>
                    <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                       <span className="text-sm font-black text-slate-900">abuse@arrownet.com.np</span>
                       <ArrowRight size={16} className="text-primary" />
                    </div>
                 </div> */}
                  </div>

                  <div className="career-cta relative bg-slate-900 rounded-3xl p-10 overflow-hidden group">
                     <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-red-500/5" />
                     <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div>
                           <h4 className="text-2xl font-black text-white mb-2" style={{ fontFamily: 'Poppins' }}>Career Opportunities</h4>
                           <p className="text-slate-400 font-medium max-w-sm">
                              Pioneering the next wave of Nepal's digital infrastructure? Join our team.
                           </p>
                        </div>
                        <Link to="/career" className="btn-premium btn-premium-primary whitespace-nowrap">
                           View Openings <ArrowRight size={18} />
                        </Link>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* Branch Locator Section */}
         <section className="section-premium bg-slate-50/30">
            <div className="container mx-auto px-6">
               <div className="text-center max-w-3xl mx-auto mb-12">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/8 border border-primary/15 text-[10px] font-black uppercase tracking-widest text-primary mb-6">
                     <MapPin size={14} /> Our Branches
                  </div>
                  <h2 className="text-fluid-h2 font-black text-slate-900 mb-4" style={{ fontFamily: 'Poppins' }}>Find a Branch <span className="text-primary">Near You</span></h2>
                  <p className="text-lg text-slate-500 font-medium">Locate our offices across Nepal with the interactive map.</p>
               </div>
               <BranchLocator />
            </div>
         </section>
      </div>
   );
}
