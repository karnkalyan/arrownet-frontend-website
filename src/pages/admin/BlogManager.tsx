import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Plus, Trash2, X, Save, FileText, Edit3 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function BlogManager() {
  const { blogPosts, addBlogPost, deleteBlogPost, updateBlogPost } = useStore();
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ title: '', slug: '', excerpt: '', content: '', author: 'Arrownet Team', category: 'Technology', readTime: '3 min', featured: false });

  const categories = ['Technology', 'Company News', 'Tips', 'Industry'];

  const resetForm = () => {
    setForm({ title: '', slug: '', excerpt: '', content: '', author: 'Arrownet Team', category: 'Technology', readTime: '3 min', featured: false });
    setShowAdd(false);
    setEditId(null);
  };

  const generateSlug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const handleSave = () => {
    if (!form.title || !form.excerpt || !form.content) return toast.error('Fill required fields');
    const slug = form.slug || generateSlug(form.title);
    const date = new Date().toISOString().split('T')[0];

    if (editId) {
      updateBlogPost(editId, { ...form, slug });
      toast.success('Blog post updated!');
    } else {
      addBlogPost({ ...form, slug, date, id: Date.now() });
      toast.success('Blog post published!');
    }
    resetForm();
  };

  const handleEdit = (post: any) => {
    setForm({ title: post.title, slug: post.slug, excerpt: post.excerpt, content: post.content, author: post.author, category: post.category, readTime: post.readTime, featured: post.featured || false });
    setEditId(post.id);
    setShowAdd(true);
  };

  const handleDelete = (id: number) => {
    deleteBlogPost(id);
    toast.success('Blog post deleted');
  };

  return (
    <div className="space-y-12 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-2 block">Content Management</span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight" style={{ fontFamily: 'Poppins' }}>Blog Posts</h1>
          <p className="text-sm text-slate-500 mt-2">{blogPosts.length} articles published</p>
        </div>
        <button onClick={() => { resetForm(); setShowAdd(true); }} className="btn-premium btn-premium-primary !px-6">
          <Plus size={20} /> New Blog Post
        </button>
      </div>

      {showAdd && (
        <div className="card-premium !p-8 border-primary/20 shadow-xl animate-slide-up">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-slate-900" style={{ fontFamily: 'Poppins' }}>
              {editId ? 'Edit Post' : 'New Blog Post'}
            </h3>
            <button onClick={resetForm} className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-all"><X size={20} /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">Post Title *</label>
              <input className="input-premium font-bold" value={form.title} onChange={e => setForm({ ...form, title: e.target.value, slug: generateSlug(e.target.value) })} placeholder="e.g. Why Fiber Internet is the Future" />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">URL Slug</label>
              <input className="input-premium" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} placeholder="auto-generated-from-title" />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">Category</label>
              <select className="input-premium" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                {categories.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">Author</label>
              <input className="input-premium" value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">Read Time</label>
              <input className="input-premium" value={form.readTime} onChange={e => setForm({ ...form, readTime: e.target.value })} placeholder="e.g. 5 min" />
            </div>
            <div className="md:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">Excerpt *</label>
              <textarea className="input-premium min-h-[80px]" value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} placeholder="Brief summary shown in blog cards..." />
            </div>
            <div className="md:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">Full Content *</label>
              <textarea className="input-premium min-h-[200px]" value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} placeholder="Full article content. Use ## for headings, - for bullet points..." />
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="featured" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} className="w-5 h-5 rounded-lg accent-primary" />
              <label htmlFor="featured" className="text-sm font-bold text-slate-600">Featured Post</label>
            </div>
          </div>
          <button onClick={handleSave} className="btn-premium btn-premium-primary !w-full md:!w-fit !px-10 mt-8">
            <Save size={18} /> {editId ? 'Update Post' : 'Publish Post'}
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {blogPosts.map((post: any) => (
          <div key={post.id} className="card-premium animate-fade-in group">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded-lg bg-primary/10 text-[9px] font-black uppercase tracking-widest text-primary">{post.category}</span>
                  {post.featured && <span className="px-2 py-0.5 rounded-lg bg-accent/20 text-[9px] font-black uppercase tracking-widest text-yellow-700">Featured</span>}
                </div>
                <h3 className="text-lg font-black text-slate-900 line-clamp-1" style={{ fontFamily: 'Poppins' }}>{post.title}</h3>
              </div>
              <div className="flex gap-2 ml-4">
                <button onClick={() => handleEdit(post)} className="w-9 h-9 rounded-xl bg-blue-50 text-blue-400 hover:bg-blue-500 hover:text-white transition-all border border-blue-100 flex items-center justify-center">
                  <Edit3 size={14} />
                </button>
                <button onClick={() => handleDelete(post.id)} className="w-9 h-9 rounded-xl bg-red-50 text-red-300 hover:bg-red-500 hover:text-white transition-all border border-red-100 flex items-center justify-center">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 mb-4">{post.excerpt}</p>
            <div className="flex items-center gap-4 pt-4 border-t border-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <span>{post.author}</span>
              <span>·</span>
              <span>{post.readTime}</span>
              <span>·</span>
              <span>{post.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
