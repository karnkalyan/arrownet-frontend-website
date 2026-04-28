import { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { Save, Plus, X, GripVertical } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CMSEditor() {
  const { cms, updateCMS, updateSettings } = useStore();
  const [heroTitle, setHeroTitle] = useState(cms.heroSection.title);
  const [heroSubtitle, setHeroSubtitle] = useState(cms.heroSection.subtitle);
  const [aboutMission, setAboutMission] = useState(cms.aboutSection.mission);
  const [marketPosition, setMarketPosition] = useState(cms.aboutSection.marketPosition);
  
  const [phone, setPhone] = useState(cms.companyInfo.phone);
  const [email, setEmail] = useState(cms.companyInfo.email);
  const [tollFree, setTollFree] = useState(cms.companyInfo.tollFree || '');
  const [address, setAddress] = useState(cms.companyInfo.address);
  
  const [announcements, setAnnouncements] = useState([...cms.announcements]);
  const [newAnnouncement, setNewAnnouncement] = useState('');
  const [primaryCTA, setPrimaryCTA] = useState(cms.heroSection.primaryCTA || 'Get Started');
  const [secondaryCTA, setSecondaryCTA] = useState(cms.heroSection.secondaryCTA || 'View Plans');

  // Sync state when CMS data is loaded/changed
  useEffect(() => {
    setHeroTitle(cms.heroSection.title);
    setHeroSubtitle(cms.heroSection.subtitle);
    setAboutMission(cms.aboutSection.mission);
    setMarketPosition(cms.aboutSection.marketPosition);
    setPhone(cms.companyInfo.phone);
    setEmail(cms.companyInfo.email);
    setTollFree(cms.companyInfo.tollFree || '');
    setAddress(cms.companyInfo.address);
    setAnnouncements([...cms.announcements]);
    setPrimaryCTA(cms.heroSection.primaryCTA || 'Get Started');
    setSecondaryCTA(cms.heroSection.secondaryCTA || 'View Plans');
  }, [cms]);

  const handleSaveHero = async () => {
    const success = await updateSettings({
      heroTitle,
      heroSubtitle,
      heroPrimaryCTA: primaryCTA,
      heroSecondaryCTA: secondaryCTA
    });
    if (success) toast.success('Hero section updated!');
  };

  const handleSaveAbout = async () => {
    const success = await updateSettings({
      aboutMission,
      aboutMarketPosition: marketPosition
    });
    if (success) toast.success('Mission & Identity updated!');
  };

  const handleSaveContact = async () => {
    const success = await updateSettings({
      contactPhone: phone,
      contactEmail: email,
      contactAddress: address,
      tollFree
    });
    if (success) toast.success('Contact grid updated!');
  };

  const handleSaveAnnouncements = async () => {
    const success = await useStore.getState().saveAnnouncements(announcements);
    if (success) toast.success('Announcements updated!');
  };

  const addAnnouncement = () => {
    if (!newAnnouncement.trim()) return;
    setAnnouncements([...announcements, newAnnouncement]);
    setNewAnnouncement('');
  };

  const removeAnnouncement = (i: number) => setAnnouncements(announcements.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'Poppins' }}>CMS Editor</h1>
        <p className="text-sm text-slate-500 mt-1">Edit your website content. Changes reflect immediately on public pages.</p>
      </div>

      {/* Announcements */}
      <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 mb-4" style={{ fontFamily: 'Poppins' }}>Announcement Bar</h3>
        <div className="space-y-2 mb-4">
          {announcements.map((a, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <GripVertical size={14} className="text-slate-300" />
              <span className="flex-1 text-sm text-slate-700">{a}</span>
              <button onClick={() => removeAnnouncement(i)} className="text-red-400 hover:text-red-600"><X size={14} /></button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input className="input-premium flex-1" placeholder="Add new announcement..." value={newAnnouncement} onChange={e => setNewAnnouncement(e.target.value)} onKeyDown={e => e.key === 'Enter' && addAnnouncement()} />
          <button onClick={addAnnouncement} className="px-4 py-2 rounded-xl bg-red-50 text-primary font-bold border border-red-100 hover:bg-orange-100"><Plus size={16} /></button>
        </div>
        <button onClick={handleSaveAnnouncements} className="mt-4 px-6 py-2.5 rounded-xl font-bold text-white flex items-center gap-2" style={{ background: 'linear-gradient(135deg, #E30613, #ef4444)' }}>
          <Save size={14} /> Save Announcements
        </button>
      </div>

      {/* Hero Section */}
      <div className="card-premium animate-fade-in">
        <div className="flex items-center gap-3 mb-8">
           <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
              <Plus size={20} />
           </div>
           <h3 className="text-xl font-black text-slate-900" style={{ fontFamily: 'Poppins' }}>Hero Configuration</h3>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">Primary Heading / Tagline</label>
            <input className="input-premium font-bold text-slate-800" value={heroTitle} onChange={e => setHeroTitle(e.target.value)} />
          </div>
          <div>
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">Supportive Subtext</label>
            <textarea className="input-premium min-h-[100px]" rows={3} value={heroSubtitle} onChange={e => setHeroSubtitle(e.target.value)} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
               <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">Primary CTA Text</label>
               <input className="input-premium" value={primaryCTA} onChange={e => setPrimaryCTA(e.target.value)} placeholder="e.g. Deploy Now" />
             </div>
             <div>
               <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">Secondary CTA Text</label>
               <input className="input-premium" value={secondaryCTA} onChange={e => setSecondaryCTA(e.target.value)} placeholder="e.g. Learn More" />
             </div>
          </div>

          <button onClick={handleSaveHero} className="btn-premium btn-premium-primary !w-full md:!w-fit !px-8">
            <Save size={16} /> Update Hero Architecture
          </button>
        </div>
      </div>

      {/* About Section */}
      <div className="card-premium animate-fade-in">
         <div className="flex items-center gap-3 mb-8">
           <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
              <Plus size={20} />
           </div>
           <h3 className="text-xl font-black text-slate-900" style={{ fontFamily: 'Poppins' }}>Mission & Identity</h3>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">Market Position / About</label>
            <textarea className="input-premium min-h-[120px]" rows={4} value={marketPosition} onChange={e => setMarketPosition(e.target.value)} />
          </div>
          <div>
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">Core Mission Protocol</label>
            <textarea className="input-premium min-h-[120px]" rows={4} value={aboutMission} onChange={e => setAboutMission(e.target.value)} />
          </div>
          <button onClick={handleSaveAbout} className="btn-premium btn-premium-primary !w-full md:!w-fit !px-8">
            <Save size={16} /> Deploy Mission Updates
          </button>
        </div>
      </div>

      {/* Contact Info */}
      <div className="card-premium animate-fade-in">
        <div className="flex items-center gap-3 mb-8">
           <div className="w-10 h-10 rounded-xl bg-red-500/5 flex items-center justify-center text-red-500">
              <Plus size={20} />
           </div>
           <h3 className="text-xl font-black text-slate-900" style={{ fontFamily: 'Poppins' }}>Global Connect Points</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">Primary Hotline</label>
            <input className="input-premium" value={phone} onChange={e => setPhone(e.target.value)} />
          </div>
          <div>
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">Operations Email</label>
            <input className="input-premium" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">Support Directive (Toll Free)</label>
            <input className="input-premium" value={tollFree} onChange={e => setTollFree(e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">Physical HQ Address</label>
            <input className="input-premium" value={address} onChange={e => setAddress(e.target.value)} />
          </div>
        </div>
        
        <button onClick={handleSaveContact} className="btn-premium btn-premium-primary !w-full md:!w-fit !px-8">
          <Save size={16} /> Update Contact Grid
        </button>
      </div>
    </div>
  );
}
