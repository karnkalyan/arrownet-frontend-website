import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { gsap } from 'gsap';
import { MapPin, Clock, Briefcase, ChevronRight, Send, X, Sparkles, Building2, Users } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import NetworkBackground from '../components/shared/NetworkBackground';

const jobs = [
  { id: 1, title: 'Network Infrastructure Engineer', department: 'Engineering', type: 'Full-time', location: 'HQ / Field', description: 'Design, implement, and troubleshoot ultra-high-density network infrastructure including carrier-grade fiber optic, wireless, and enterprise core routing solutions.', requirements: ['JNCIP / CCNP certification preferred', 'Advanced knowledge of BGP, OSPF, and MPLS', 'Experience with GPON/EPON hardware', 'Proficiency in Unix-based network environments'] },
  { id: 2, title: 'Technical Account Manager', department: 'Executive Support', type: 'Full-time', location: 'Kathmandu', description: 'Act as the primary technical contact for our enterprise and corporate clients, ensuring 99.99% service availability and architectural optimization.', requirements: ['Strong technical project management skills', 'Deep understanding of enterprise network topologies', 'Bilingual (Nepali & English) excellence', 'Previous ISP or MSP experience required'] },
  { id: 3, title: 'Frontend Systems Architect', department: 'IT / Operations', type: 'Full-time', location: 'Kathmandu', description: 'Lead the development of mission-critical dashboards, customer procurement portals, and internal diagnostic tools using React and modern animation frameworks.', requirements: ['Expertise in React, TypeScript, and Framer Motion', 'Deep understanding of REST/GraphQL architectures', 'Experience with large-scale CRM integration', 'Portfolio demonstrating premium UI/UX execution'] },
  { id: 4, title: 'Strategic Sales Lead', department: 'Sales', type: 'Full-time', location: 'Kathmandu Valley', description: 'Drive high-ticket enterprise acquisitions and develop strategic partnerships with multi-national corporations and government agencies.', requirements: ['5+ years in B2B enterprise sales', 'Proven record of hitting high-growth targets', 'Extensive knowledge of the Nepali tech landscape', 'Expert level CRM and pipeline management'] },
];

function AnimatedCard({ children, index }: { children: React.ReactNode; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.23, 1, 0.32, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function Career() {
  const [selectedJob, setSelectedJob] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.career-hero-item',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: 'power3.out' }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const onSubmit = () => {
    toast.success('Your application has been logged into our recruitment system.');
    setShowForm(false);
    reset();
  };

  return (
    <div className="bg-white min-h-screen" ref={containerRef}>
      <Toaster position="top-right" />
      
      {/* Hero */}
      <section className="relative py-32 overflow-hidden bg-slate-900">
        <div className="absolute inset-0">
          <NetworkBackground variant="nodes" opacity={0.06} color="#E30613" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-slate-900/80" />
        <div className="container mx-auto px-6 relative z-10 text-center">
           <div className="career-hero-item inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl mb-10">
              <Sparkles size={16} className="text-secondary fill-secondary/20" />
              <span className="text-[11px] font-black uppercase tracking-[0.3em] text-secondary">Talent Acquisition</span>
           </div>
           <h1 className="career-hero-item text-fluid-h1 font-black text-white mb-6" style={{ fontFamily: 'Poppins' }}>
             Engineer the <span className="text-accent drop-shadow-md">Future Grid.</span>
           </h1>
           <p className="career-hero-item text-xl text-slate-300 font-medium max-w-2xl mx-auto">
             Join a team of elite engineers and visionaries dedicated to building Nepal's premier digital backbone.
           </p>
        </div>
      </section>

      {/* Stats/Culture */}
      <section className="py-16">
         <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 -mt-20 relative z-20">
               {[
                 { icon: <Users size={24} />, title: '200+ Team', desc: 'Expert engineers working across the nation.' },
                 { icon: <Building2 size={24} />, title: 'Modern HQ', desc: 'State of the art operations in Kathmandu.' },
                 { icon: <Clock size={24} />, title: 'Growth Mindset', desc: 'Continuous learning and career progression.' },
               ].map((item, i) => (
                 <AnimatedCard key={i} index={i}>
                   <div className="bg-white rounded-3xl p-10 border border-slate-100 shadow-2xl shadow-slate-200/50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500">
                      <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-all">
                         {item.icon}
                      </div>
                      <h3 className="text-xl font-black text-slate-900 mb-2" style={{ fontFamily: 'Poppins' }}>{item.title}</h3>
                      <p className="text-sm text-slate-500 font-medium">{item.desc}</p>
                   </div>
                 </AnimatedCard>
               ))}
            </div>
         </div>
      </section>

      {/* Job Listings */}
      <section className="section-premium bg-white">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black text-slate-900 mb-4" style={{ fontFamily: 'Poppins' }}>Open Access Roles</h2>
            <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
          </div>

          <div className="space-y-6">
            {jobs.map((job, i) => (
              <AnimatedCard key={job.id} index={i}>
                <div 
                  className={`
                    bg-white rounded-3xl border border-slate-100 shadow-lg shadow-slate-100/50 overflow-hidden transition-all duration-500
                    ${selectedJob === job.id ? 'ring-2 ring-primary/20 shadow-xl' : 'hover:shadow-xl hover:border-red-100'}
                  `}
                >
                  <button 
                    onClick={() => setSelectedJob(selectedJob === job.id ? null : job.id)}
                    className="w-full px-10 py-8 text-left flex flex-col sm:flex-row sm:items-center justify-between gap-6"
                  >
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-4 mb-3">
                        <h3 className="text-2xl font-black text-slate-900" style={{ fontFamily: 'Poppins' }}>{job.title}</h3>
                        <span className="px-3 py-1 rounded-lg bg-red-50 text-[10px] font-black uppercase tracking-widest text-primary">
                          {job.department}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-6 text-xs font-bold text-slate-400 uppercase tracking-widest">
                        <span className="flex items-center gap-2"><Briefcase size={16} className="text-slate-300" />{job.type}</span>
                        <span className="flex items-center gap-2"><MapPin size={16} className="text-slate-300" />{job.location}</span>
                      </div>
                    </div>
                    <div className={`w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 transition-all ${selectedJob === job.id ? 'rotate-90 bg-primary text-white' : ''}`}>
                      <ChevronRight size={20} />
                    </div>
                  </button>

                  <AnimatePresence>
                    {selectedJob === job.id && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-10 pb-10 border-t border-slate-50 pt-10 bg-slate-50/30">
                          <p className="text-slate-500 font-medium leading-relaxed mb-8 max-w-3xl">{job.description}</p>
                          
                          <div className="mb-10">
                            <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-6">Execution Requirements</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {job.requirements.map((r, i) => (
                                <div key={i} className="flex items-center gap-3 text-sm font-medium text-slate-600">
                                  <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" /> 
                                  {r}
                                </div>
                              ))}
                            </div>
                          </div>

                          <button 
                            onClick={() => setShowForm(true)}
                            className="btn-premium btn-premium-primary"
                          >
                            Submit Application <Send size={18} />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* Application Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-xl"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-xl rounded-[32px] bg-white p-10 md:p-14 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-orange-500 to-red-500" />
              
              <button 
                onClick={() => setShowForm(false)} 
                className="absolute top-8 right-8 p-3 rounded-xl bg-slate-50 text-slate-300 hover:text-slate-900 transition-all"
              >
                <X size={20} />
              </button>

              <div className="mb-10">
                <h3 className="text-3xl font-black text-slate-900 mb-2" style={{ fontFamily: 'Poppins' }}>Candidate Portal</h3>
                <p className="text-slate-400 font-medium">Applying for: <span className="text-primary">{jobs.find(j => j.id === selectedJob)?.title}</span></p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Full Name</label>
                  <input {...register('name', { required: true })} className="input-premium" placeholder="Enter your full name" />
                  {errors.name && <p className="text-xs text-red-500 mt-1.5 ml-1">This field is required</p>}
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Email Address</label>
                    <input {...register('email', { required: true })} className="input-premium" type="email" placeholder="email@address.com" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Phone Number</label>
                    <input {...register('phone')} className="input-premium" placeholder="+977 98..." />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Experience Summary</label>
                  <textarea {...register('coverLetter')} className="input-premium resize-none" rows={4} placeholder="Briefly describe your core competencies..." />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Upload CV / Resume</label>
                  <input type="file" accept=".pdf,.doc,.docx" className="w-full text-sm text-slate-500 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 file:cursor-pointer file:transition-colors cursor-pointer border border-slate-200 rounded-xl p-2" />
                  <p className="text-[11px] text-slate-400 mt-1.5 ml-1">Accepted formats: PDF, DOC, DOCX (max 5MB)</p>
                </div>

                <div className="pt-4 space-y-3">
                   <button type="submit" className="w-full btn-premium btn-premium-primary !py-5 justify-center shadow-primary/30 font-black text-base">
                     Deploy Application
                   </button>
                   <a href="https://www.linkedin.com/company/arrownet/jobs/" target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 py-4 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all">
                     <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                     View Jobs on LinkedIn
                   </a>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
