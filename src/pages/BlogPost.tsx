import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, User, Tag, Share2 } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { blogPosts } = useStore();
  const post = blogPosts.find(p => p.slug === slug);

  if (!post) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-black text-slate-900 mb-4" style={{ fontFamily: 'Poppins' }}>Post Not Found</h1>
          <p className="text-slate-500 mb-8">The article you're looking for doesn't exist.</p>
          <Link to="/blog" className="btn-premium btn-premium-primary">Back to Blog</Link>
        </div>
      </div>
    );
  }

  const relatedPosts = blogPosts.filter(p => p.id !== post.id && p.category === post.category).slice(0, 3);

  const renderContent = (content: string) => {
    return content.split('\n').map((line, i) => {
      if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-bold text-slate-900 mt-10 mb-4" style={{ fontFamily: 'Poppins' }}>{line.replace('## ', '')}</h2>;
      if (line.startsWith('- **')) {
        const parts = line.replace('- **', '').split('**');
        return <li key={i} className="ml-4 mb-2 text-slate-600 leading-relaxed"><strong className="text-slate-900">{parts[0]}</strong>{parts[1]}</li>;
      }
      if (line.startsWith('- ')) return <li key={i} className="ml-4 mb-2 text-slate-600 leading-relaxed">{line.replace('- ', '')}</li>;
      if (line.match(/^\d+\./)) return <li key={i} className="ml-4 mb-2 text-slate-600 leading-relaxed list-decimal">{line.replace(/^\d+\.\s*/, '')}</li>;
      if (line.trim() === '') return <br key={i} />;
      return <p key={i} className="text-slate-600 leading-relaxed mb-4">{line}</p>;
    });
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <section className="relative py-24 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-purple-950">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="container mx-auto px-6 relative z-10 max-w-4xl">
          <Link to="/blog" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium mb-8">
            <ArrowLeft size={16} /> Back to Blog
          </Link>
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 rounded-lg bg-white/10 text-[10px] font-black uppercase tracking-widest text-accent">{post.category}</span>
            <span className="text-sm text-slate-400 flex items-center gap-1.5"><Clock size={14} />{post.readTime} read</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight" style={{ fontFamily: 'Poppins' }}>{post.title}</h1>
          <div className="flex items-center gap-6 text-sm text-slate-400">
            <span className="flex items-center gap-2"><User size={14} /> {post.author}</span>
            <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="container mx-auto px-6 py-16 max-w-4xl">
        <article className="prose prose-lg max-w-none">
          <p className="text-xl text-slate-700 font-medium leading-relaxed mb-8 border-l-4 border-primary pl-6">{post.excerpt}</p>
          {renderContent(post.content)}
        </article>

        {/* Share */}
        <div className="mt-16 pt-8 border-t border-slate-100">
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Share:</span>
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
            </a>
            <a href={`https://twitter.com/intent/tweet?url=${window.location.href}&text=${post.title}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-black hover:text-white transition-all">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
            </a>
            <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-blue-700 hover:text-white transition-all">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
            </a>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-16">
            <h3 className="text-2xl font-black text-slate-900 mb-8" style={{ fontFamily: 'Poppins' }}>Related Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map(rp => (
                <Link key={rp.id} to={`/blog/${rp.slug}`} className="group p-6 rounded-2xl border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all">
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary mb-3 block">{rp.category}</span>
                  <h4 className="text-base font-bold text-slate-900 group-hover:text-primary transition-colors mb-2" style={{ fontFamily: 'Poppins' }}>{rp.title}</h4>
                  <p className="text-xs text-slate-400 font-medium">{rp.readTime} read · {new Date(rp.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
