import { useState, useEffect, useRef } from 'react';
import { useStore } from '../../store/useStore';
import { Palette, Image, Save, RefreshCw, MessageCircle, ImagePlus, Globe, Info, Headphones } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { settings, fetchSettings, updateSettings, logoUrl, adminLogoUrl, faviconUrl } = useStore();
  const [formData, setFormData] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const adminLogoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);
  const heroImageInputRef = useRef<HTMLInputElement>(null);
  const homeCtaImageInputRef = useRef<HTMLInputElement>(null);
  const aboutPromoImageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (key !== 'logo' && key !== 'favicon') {
        data.append(key, formData[key]);
      }
    });

    if (logoInputRef.current?.files?.[0]) {
      data.append('logo', logoInputRef.current.files[0]);
    }
    if (adminLogoInputRef.current?.files?.[0]) {
      data.append('adminLogo', adminLogoInputRef.current.files[0]);
    }
    if (faviconInputRef.current?.files?.[0]) {
      data.append('favicon', faviconInputRef.current.files[0]);
    }
    if (heroImageInputRef.current?.files?.[0]) {
      data.append('heroImage', heroImageInputRef.current.files[0]);
    }
    if (homeCtaImageInputRef.current?.files?.[0]) {
      data.append('homeCtaImage', homeCtaImageInputRef.current.files[0]);
    }
    if (aboutPromoImageInputRef.current?.files?.[0]) {
      data.append('aboutPromoImage', aboutPromoImageInputRef.current.files[0]);
    }

    const success = await updateSettings(data);
    setSaving(false);
    if (success) {
      toast.success('Settings updated successfully!');
      // Clear file inputs
      if (logoInputRef.current) logoInputRef.current.value = '';
      if (adminLogoInputRef.current) adminLogoInputRef.current.value = '';
      if (faviconInputRef.current) faviconInputRef.current.value = '';
      if (heroImageInputRef.current) heroImageInputRef.current.value = '';
      if (homeCtaImageInputRef.current) homeCtaImageInputRef.current.value = '';
      if (aboutPromoImageInputRef.current) aboutPromoImageInputRef.current.value = '';
    } else {
      toast.error('Failed to update settings');
    }
  };

  const handleReset = async () => {
    if (confirm('Reset to brand defaults?')) {
      const defaults = {
        primaryColor: "#4c08cd",
        secondaryColor: "#ed060d",
        accentColor: "#eecf00",
        heroTitle: "The Engine Room of Your Network.",
        heroSubtitle: "Full spectrum control over your digital infrastructure.",
        heroPrimaryCTA: "Get Started",
        heroSecondaryCTA: "View Plans",
        aboutMission: "To provide seamless connectivity to every corner of Nepal.",
        aboutMarketPosition: "Leading ISP in Kathmandu Valley.",
        contactPhone: "+977 1 5971333",
        contactEmail: "info@arrownet.com.np",
        contactAddress: "Kathmandu, Nepal",
        whatsappNumber: "9800000000"
      };
      setFormData((prev: any) => ({ ...prev, ...defaults }));
      await updateSettings(defaults);
      toast.success('Reset to defaults');
    }
  };

  if (!formData.siteName && !settings.siteName) return <div className="p-8 text-center">Loading settings...</div>;

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-5xl mx-auto pb-20">
      <div className="flex justify-between items-end">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-2 block">Configuration</span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight" style={{ fontFamily: 'Poppins' }}>Settings</h1>
          <p className="text-sm text-slate-500 mt-2">Manage brand identity, Hero configuration, and contact directives.</p>
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={handleReset} className="btn-premium btn-premium-secondary">
            <RefreshCw size={14} /> Reset
          </button>
          <button type="submit" disabled={saving} className="btn-premium btn-premium-primary !px-8">
            {saving ? <RefreshCw className="animate-spin" size={16} /> : <><Save size={16} /> Save All Changes</>}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Brand & Assets */}
        <div className="space-y-8">
          <div className="card-premium !p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Palette size={20} />
              </div>
              <h3 className="text-base font-bold text-slate-900" style={{ fontFamily: 'Poppins' }}>Brand Identity</h3>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">Site Name</label>
                <input name="siteName" className="input-premium" value={formData.siteName || ''} onChange={handleChange} />
              </div>

              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Primary', name: 'primaryColor' },
                  { label: 'Secondary', name: 'secondaryColor' },
                  { label: 'Accent', name: 'accentColor' },
                ].map(c => (
                  <div key={c.name}>
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">{c.label}</label>
                    <input type="color" name={c.name} value={formData[c.name] || '#000000'} onChange={handleChange}
                      className="w-full h-12 rounded-xl border-2 border-slate-200 cursor-pointer" />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">Website Logo</label>
                  <input type="file" ref={logoInputRef} className="text-xs file:btn-premium file:btn-premium-secondary file:!py-1 file:!px-3 file:mr-3" accept="image/*" />
                  <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center min-h-[60px]">
                    <img src={logoUrl} alt="Logo" className="max-h-12 object-contain" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">Admin/Square Logo</label>
                  <input type="file" ref={adminLogoInputRef} className="text-xs file:btn-premium file:btn-premium-secondary file:!py-1 file:!px-3 file:mr-3" accept="image/*" />
                  <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center min-h-[60px]">
                    <img src={adminLogoUrl} alt="Admin Logo" className="max-h-12 object-contain" />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">Update Favicon</label>
                <input type="file" ref={faviconInputRef} className="text-xs file:btn-premium file:btn-premium-secondary file:!py-1 file:!px-3 file:mr-3" accept="image/x-icon,image/png" />
                <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center min-h-[60px] w-fit px-8">
                  <img src={faviconUrl} alt="Favicon" className="w-8 h-8 object-contain" />
                </div>
              </div>
            </div>
          </div>

          <div className="card-premium !p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
                <MessageCircle size={20} />
              </div>
              <h3 className="text-base font-bold text-slate-900" style={{ fontFamily: 'Poppins' }}>Support Channels</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">WhatsApp Number</label>
                <input name="whatsappNumber" className="input-premium font-mono" value={formData.whatsappNumber || ''} onChange={handleChange} placeholder="9779800000000" />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">Primary Hotline</label>
                <input name="contactPhone" className="input-premium font-mono" value={formData.contactPhone || ''} onChange={handleChange} />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">Toll Free Number</label>
                <input name="tollFree" className="input-premium font-mono" value={formData.tollFree || ''} onChange={handleChange} />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">Operations Email</label>
                <input name="contactEmail" className="input-premium font-mono" value={formData.contactEmail || ''} onChange={handleChange} />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">Physical HQ Address</label>
                <input name="contactAddress" className="input-premium" value={formData.contactAddress || ''} onChange={handleChange} />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">VAT / Tax Rate (%)</label>
                <input name="taxRate" type="number" step="0.1" className="input-premium font-mono" value={formData.taxRate || 13} onChange={handleChange} placeholder="13" />
              </div>
            </div>
          </div>
        </div>

        {/* Hero & Content Architecture */}
        <div className="space-y-8">
          <div className="card-premium !p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                <Globe size={20} />
              </div>
              <h3 className="text-base font-bold text-slate-900" style={{ fontFamily: 'Poppins' }}>Hero Configuration</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">Primary Heading / Tagline</label>
                <input name="heroTitle" className="input-premium" value={formData.heroTitle || ''} onChange={handleChange} />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">Supportive Subtext</label>
                <textarea name="heroSubtitle" className="input-premium min-h-[80px]" value={formData.heroSubtitle || ''} onChange={handleChange} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">Primary CTA Text</label>
                  <input name="heroPrimaryCTA" className="input-premium" value={formData.heroPrimaryCTA || ''} onChange={handleChange} />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">Secondary CTA Text</label>
                  <input name="heroSecondaryCTA" className="input-premium" value={formData.heroSecondaryCTA || ''} onChange={handleChange} />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">Hero Background Image</label>
                <input type="file" ref={heroImageInputRef} className="text-xs file:btn-premium file:btn-premium-secondary file:!py-1 file:!px-3 file:mr-3" accept="image/*" />
                {formData.heroImageUrl && (
                  <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center h-32 overflow-hidden">
                    <img src={formData.heroImageUrl.startsWith('/uploads') ? `${import.meta.env.VITE_API_URL || '/api'}`.replace('/api', '') + formData.heroImageUrl : formData.heroImageUrl} alt="Hero Background" className="h-full object-cover rounded-lg" />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="card-premium !p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                <Info size={20} />
              </div>
              <h3 className="text-base font-bold text-slate-900" style={{ fontFamily: 'Poppins' }}>Mission & Identity</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">Core Mission Protocol</label>
                <textarea name="aboutMission" className="input-premium min-h-[100px]" value={formData.aboutMission || ''} onChange={handleChange} />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">Market Position / About</label>
                <input name="aboutMarketPosition" className="input-premium" value={formData.aboutMarketPosition || ''} onChange={handleChange} />
              </div>
              <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">Home CTA Image</label>
                  <input type="file" ref={homeCtaImageInputRef} className="text-xs w-full file:btn-premium file:btn-premium-secondary file:!py-1 file:!px-3 file:mr-3" accept="image/*" />
                  {formData.homeCtaImageUrl && (
                    <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center h-24 overflow-hidden">
                      <img src={formData.homeCtaImageUrl.startsWith('/uploads') ? `${import.meta.env.VITE_API_URL || '/api'}`.replace('/api', '') + formData.homeCtaImageUrl : formData.homeCtaImageUrl} alt="Home CTA" className="h-full object-cover rounded-lg" />
                    </div>
                  )}
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">About Promo Image</label>
                  <input type="file" ref={aboutPromoImageInputRef} className="text-xs w-full file:btn-premium file:btn-premium-secondary file:!py-1 file:!px-3 file:mr-3" accept="image/*" />
                  {formData.aboutPromoImageUrl && (
                    <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center h-24 overflow-hidden">
                      <img src={formData.aboutPromoImageUrl.startsWith('/uploads') ? `${import.meta.env.VITE_API_URL || '/api'}`.replace('/api', '') + formData.aboutPromoImageUrl : formData.aboutPromoImageUrl} alt="About Promo" className="h-full object-cover rounded-lg" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
