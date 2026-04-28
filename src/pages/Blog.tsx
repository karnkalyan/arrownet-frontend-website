import { useState, useMemo, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { gsap } from 'gsap';
import { Search, Clock, ArrowRight, User, Tag, BookOpen, TrendingUp } from 'lucide-react';
import { useStore } from '../store/useStore';

function AnimatedCard({ children, index }: { children: React.ReactNode; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: index * 0.08, ease: [0.23, 1, 0.32, 1] }}>
      {children}
    </motion.div>
  );
}

const categories = ['All', 'Technology', 'Company News', 'Tips', 'Industry'];

export default function Blog() {
  const { blogPosts } = useStore();
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    return blogPosts.filter(post => {
      const matchCat = activeCategory === 'All' || post.category === activeCategory;
      const matchSearch = !search || post.title.toLowerCase().includes(search.toLowerCase()) || post.excerpt.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [blogPosts, activeCategory, search]);

  const featuredPost = blogPosts.find(p => p.featured);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.blog-hero-item', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out' });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div className="bg-white min-h-screen" ref={containerRef}>
      {/* Hero */}
      <section className="relative py-28 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-purple-950">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="blog-hero-item inline-flex items-center gap-3 px-5 py-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl mb-10">
            <BookOpen size={16} className="text-accent" />
            <span className="text-[11px] font-black uppercase tracking-[0.3em] text-yellow-400">Insights & Updates</span>
          </div>
          <h1 className="blog-hero-item text-fluid-h1 font-black text-white mb-6" style={{ fontFamily: 'Poppins' }}>
            The Arrownet <span className="text-accent italic">Blog.</span>
          </h1>
          <p className="blog-hero-item text-xl text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed">
            Stay updated with the latest in fiber technology, company news, and expert tips for maximizing your internet experience.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-6 py-16">
        {/* Featured Post */}
        {featuredPost && (
          <Link to={`/blog/${featuredPost.slug}`} className="block mb-16 group">
            <div className="relative rounded-3xl overflow-hidden border border-slate-100 shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-r from-primary/5 to-secondary/5">
              <div className="p-10 md:p-14">
                <div className="flex items-center gap-3 mb-6">
                  <span className="px-3 py-1 rounded-lg bg-primary/10 text-[10px] font-black uppercase tracking-widest text-primary">Featured</span>
                  <span className="px-3 py-1 rounded-lg bg-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-500">{featuredPost.category}</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 group-hover:text-primary transition-colors" style={{ fontFamily: 'Poppins' }}>
                  {featuredPost.title}
                </h2>
                <p className="text-lg text-slate-500 font-medium leading-relaxed mb-8 max-w-3xl">{featuredPost.excerpt}</p>
                <div className="flex items-center gap-6 text-sm text-slate-400">
                  <span className="flex items-center gap-2"><User size={14} /> {featuredPost.author}</span>
                  <span className="flex items-center gap-2"><Clock size={14} /> {featuredPost.readTime} read</span>
                  <span>{new Date(featuredPost.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-6 mb-12">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search articles..." value={search} onChange={e => setSearch(e.target.value)} className="input-premium !pl-12" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${activeCategory === cat ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((post, i) => (
            <AnimatedCard key={post.id} index={i}>
              <Link to={`/blog/${post.slug}`} className="group block h-full">
                <div className="h-full bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 overflow-hidden">
                  {/* Color band */}
                  <div className="h-1.5 bg-gradient-to-r from-primary via-secondary to-accent" />
                  <div className="p-8">
                    <div className="flex items-center gap-3 mb-5">
                      <span className="px-3 py-1 rounded-lg bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-500">
                        <Tag size={10} className="inline mr-1" />{post.category}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1"><Clock size={10} />{post.readTime}</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors leading-tight" style={{ fontFamily: 'Poppins' }}>
                      {post.title}
                    </h3>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6 line-clamp-3">{post.excerpt}</p>
                    <div className="flex items-center justify-between pt-5 border-t border-slate-50">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <User size={12} /> {post.author}
                      </div>
                      <span className="text-xs text-slate-400">{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </AnimatedCard>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <TrendingUp size={48} className="mx-auto text-slate-200 mb-4" />
            <h3 className="text-xl font-bold text-slate-400 mb-2" style={{ fontFamily: 'Poppins' }}>No articles found</h3>
            <p className="text-sm text-slate-400">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
