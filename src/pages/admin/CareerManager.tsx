import { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { Plus, Trash2, X, Save, Briefcase, FileText, Download, CheckCircle, Mail, Phone, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function CareerManager() {
  const { cms, addCareer, deleteCareer, jobApplications, fetchJobApplications, updateJobApplicationStatus } = useStore();
  const careers = cms.careers || [];
  const [showAdd, setShowAdd] = useState(false);
  const [activeTab, setActiveTab] = useState<'vacancies' | 'applications'>('vacancies');
  const [form, setForm] = useState({ title: '', department: '', type: 'Full-time', location: 'Kathmandu', status: 'Open', description: '', requirements: '' });

  useEffect(() => {
    fetchJobApplications();
  }, [fetchJobApplications]);

  const handleSave = () => {
    if (!form.title || !form.department || !form.description) return toast.error('Fill required fields');

    addCareer({ ...form, id: Date.now() });
    toast.success('Vacancy added!');

    setShowAdd(false);
    setForm({ title: '', department: '', type: 'Full-time', location: 'Kathmandu', status: 'Open', description: '', requirements: '' });
  };

  const handleDelete = (id: number) => {
    deleteCareer(id);
    toast.success('Vacancy removed');
  };

  const formUI = (
    <div className="card-premium !p-8 border-red-100 shadow-xl mb-12 animate-slide-up">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-black text-slate-900" style={{ fontFamily: 'Poppins' }}>
          Post New Vacancy
        </h3>
        <button onClick={() => setShowAdd(false)} className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-all"><X size={20} /></button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div><label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">Position Title *</label><input className="input-premium font-bold" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Senior Network Engineer" /></div>
        <div>
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">Department *</label>
          <select className="input-premium" value={form.department} onChange={e => setForm({ ...form, department: e.target.value })}>
            <option value="">Select Department</option>
            <option>Infrastructure</option>
            <option>Support</option>
            <option>Sales & Marketing</option>
            <option>Administration</option>
            <option>Human Resources</option>
          </select>
        </div>
        <div><label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">Job Type</label><input className="input-premium" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} placeholder="e.g. Full-time" /></div>
        <div><label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">Location</label><input className="input-premium" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="e.g. Kathmandu" /></div>

        <div className="md:col-span-2"><label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">Job Description *</label><textarea className="input-premium min-h-[120px]" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Brief summary of responsibilities..." /></div>
        <div className="md:col-span-2"><label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">Requirements (one per line)</label><textarea className="input-premium min-h-[120px]" value={form.requirements} onChange={e => setForm({ ...form, requirements: e.target.value })} placeholder="JNCIP / CCNP certification preferred..." /></div>
      </div>

      <button onClick={handleSave} className="btn-premium btn-premium-primary !w-full md:!w-fit !px-10 mt-8">
        <Save size={18} /> Publish Vacancy
      </button>
    </div>
  );

  return (
    <div className="space-y-12 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-2 block">Talent Management</span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight" style={{ fontFamily: 'Poppins' }}>Career Opportunities</h1>
          <p className="text-sm text-slate-500 mt-2">Post new vacancies and review candidate applications.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex bg-slate-50 p-1 rounded-2xl border border-slate-100">
            <button
              onClick={() => setActiveTab('vacancies')}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'vacancies' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Vacancies
            </button>
            <button
              onClick={() => setActiveTab('applications')}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'applications' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Applications
              {jobApplications.length > 0 && <span className="w-5 h-5 rounded-full bg-primary text-white text-[10px] flex items-center justify-center">{jobApplications.length}</span>}
            </button>
          </div>
          {activeTab === 'vacancies' && (
            <button onClick={() => setShowAdd(true)}
              className="btn-premium btn-premium-primary !px-6">
              <Plus size={20} /> Add New Vacancy
            </button>
          )}
        </div>
      </div>

      {activeTab === 'vacancies' && showAdd && formUI}

      {activeTab === 'vacancies' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {careers.length > 0 ? (
            careers.map((career: any) => (
              <div key={career.id} className="card-premium animate-fade-in group">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                      <Briefcase size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-900" style={{ fontFamily: 'Poppins' }}>{career.title}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{career.department}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-200" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{career.type}</span>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => handleDelete(career.id)} className="w-9 h-9 rounded-xl bg-red-50 text-red-300 hover:bg-red-500 hover:text-white transition-all border border-red-100 flex items-center justify-center">
                    <Trash2 size={14} />
                  </button>
                </div>
                <p className="text-sm text-slate-500 mt-4 leading-relaxed line-clamp-2">{career.description}</p>
                <div className="flex items-center gap-2 mt-6 pt-6 border-t border-slate-50">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Location:</span>
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{career.location}</span>
                  <span className="ml-auto badge-premium badge-premium-green">Active</span>
                </div>
              </div>
            ))
          ) : (
            <div className="md:col-span-2 py-20 text-center">
              <div className="w-16 h-16 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-300 mx-auto mb-4">
                <Briefcase size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-400">No active vacancies</h3>
              <p className="text-sm text-slate-400 mt-1">Post your first job opening to find new talent.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {jobApplications.map((app: any) => (
            <div key={app.id} className="card-premium animate-fade-in group">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 flex-shrink-0">
                    <FileText size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-3 mb-2 items-center">
                      <h3 className="text-xl font-black text-slate-900" style={{ fontFamily: 'Poppins' }}>{app.fullName}</h3>
                      <span className={`badge-premium ${app.status === 'NEW' ? 'badge-premium-blue' : 'badge-premium-green'}`}>
                        {app.status}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-primary mb-4 flex items-center gap-2">
                      <Briefcase size={14} /> Applied for: {app.jobTitle}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                      <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                        <Mail size={16} className="text-slate-400" /> {app.email}
                      </div>
                      {app.phone && (
                        <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                          <Phone size={16} className="text-slate-400" /> {app.phone}
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                        <Calendar size={16} className="text-slate-400" /> {format(new Date(app.createdAt), 'MMM dd, yyyy')}
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Experience Summary</h4>
                      <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{app.experienceSummary || 'No summary provided.'}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 min-w-[140px]">
                  <a href={`${import.meta.env.VITE_API_BASE_URL}${app.cvUrl}`} target="_blank" rel="noopener noreferrer" className="btn-premium !py-3 !px-4 text-sm font-bold bg-slate-50 text-slate-700 hover:bg-slate-100 flex items-center justify-center gap-2 border border-slate-200">
                    <Download size={16} /> View CV
                  </a>
                  {app.status === 'NEW' && (
                    <button
                      onClick={() => {
                        updateJobApplicationStatus(app.id, 'REVIEWED');
                        toast.success('Application marked as reviewed');
                      }}
                      className="btn-premium btn-premium-primary !py-3 !px-4 text-sm font-bold flex items-center justify-center gap-2"
                    >
                      <CheckCircle size={16} /> Mark Reviewed
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          {jobApplications.length === 0 && (
            <div className="py-20 text-center bg-white rounded-[32px] border border-slate-100">
              <div className="w-16 h-16 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-300 mx-auto mb-4">
                <FileText size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-400">No applications yet</h3>
              <p className="text-sm text-slate-400 mt-1">When candidates apply, they will appear here.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
