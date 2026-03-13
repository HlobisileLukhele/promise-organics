import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

const API = import.meta.env.VITE_API_URL || '';

const mdComponents = {
  h2: ({ children }) => (
    <h2 className="text-2xl font-serif font-semibold text-[#1a3d28] dark:text-[#f0f7f2] mt-10 mb-4">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-xl font-serif font-medium text-[#2d5a3d] dark:text-[#c8dece] mt-8 mb-3">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="text-gray-700 dark:text-[#c8dece] leading-relaxed mb-4">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-[#c8dece] mb-4 ml-4">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-[#c8dece] mb-4 ml-4">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="text-gray-700 dark:text-[#c8dece]">{children}</li>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-[#1a3d28] dark:text-[#f0f7f2]">{children}</strong>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-[#4a7c59] pl-4 italic text-[#4a7c59] dark:text-[#7a9e85] my-6 py-1">{children}</blockquote>
  ),
  hr: () => (
    <hr className="border-[#e8f0eb] dark:border-[#2d5a3d] my-8" />
  ),
  code: ({ children }) => (
    <code className="bg-[#f7faf8] dark:bg-[#162d20] text-[#2d5a3d] dark:text-[#4a7c59] px-1 rounded text-sm">{children}</code>
  ),
};

function RelatedCard({ post, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-[#1e3d2a] rounded-xl overflow-hidden border border-gray-100 dark:border-[#2d5a3d] hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 cursor-pointer group flex flex-col"
    >
      <div className="relative h-40 overflow-hidden flex-shrink-0">
        {post.cover_image ? (
          <img
            src={post.cover_image}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#2d5a3d] to-[#4a7c59]" />
        )}
        <span className="absolute top-2 left-2 bg-[#4a7c59] text-white text-xs rounded-full px-2.5 py-0.5">
          {post.category}
        </span>
      </div>
      <div className="p-4">
        <h4 className="font-serif text-base font-semibold text-[#1a3d28] dark:text-[#f0f7f2] leading-snug mb-1 group-hover:text-[#4a7c59] transition-colors line-clamp-2">
          {post.title}
        </h4>
        <p className="text-xs text-gray-400 dark:text-[#7a9e85]">{post.read_time} min read</p>
      </div>
    </div>
  );
}

export default function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost]       = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    fetch(`${API}/api/blog/${slug}`)
      .then(r => {
        if (!r.ok) { setNotFound(true); return null; }
        return r.json();
      })
      .then(d => {
        if (!d) return;
        setPost(d.post);
        // fetch related posts by same category
        return fetch(`${API}/api/blog/category/${encodeURIComponent(d.post.category)}`);
      })
      .then(r => r?.json())
      .then(d => {
        if (d?.posts) {
          setRelated(d.posts.filter(p => p.slug !== slug).slice(0, 3));
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0f1f17] flex items-center justify-center">
        <div className="space-y-4 w-full max-w-2xl px-4 animate-pulse">
          <div className="h-[480px] bg-gray-200 dark:bg-[#1e3d2a] rounded-xl" />
          <div className="h-6 bg-gray-200 dark:bg-[#2d5a3d] rounded w-3/4 mx-auto" />
          <div className="h-4 bg-gray-200 dark:bg-[#2d5a3d] rounded w-full" />
          <div className="h-4 bg-gray-200 dark:bg-[#2d5a3d] rounded w-5/6" />
        </div>
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0f1f17] flex flex-col items-center justify-center gap-4">
        <p className="text-2xl font-serif text-[#1a3d28] dark:text-[#f0f7f2]">Post not found</p>
        <button
          onClick={() => navigate('/blog')}
          className="text-[#4a7c59] hover:text-[#2d5a3d] text-sm font-medium"
        >
          ← Back to Blog
        </button>
      </div>
    );
  }

  const formattedDate = new Date(post.created_at).toLocaleDateString('en-ZA', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-white dark:bg-[#0f1f17]">

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <div className="relative h-[480px] w-full overflow-hidden">
        {post.cover_image ? (
          <img
            src={post.cover_image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#0f1f17] to-[#2d5a3d]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f1f17]/90 via-[#0f1f17]/40 to-transparent" />

        <div className="absolute inset-0 flex flex-col justify-end px-6 pb-10 md:px-16 max-w-4xl mx-auto left-0 right-0">
          <span className="bg-[#4a7c59] text-white rounded-full px-3 py-1 text-xs font-medium w-fit mb-4">
            {post.category}
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-white leading-tight mb-4">
            {post.title}
          </h1>
          <div className="flex items-center gap-3 text-white/70 text-sm flex-wrap">
            <div className="w-7 h-7 rounded-full bg-[#4a7c59] flex items-center justify-center text-white text-xs font-bold">
              {post.author?.charAt(0) || 'P'}
            </div>
            <span>{post.author}</span>
            <span>·</span>
            <span>{formattedDate}</span>
            <span>·</span>
            <span>{post.read_time} min read</span>
          </div>
        </div>
      </div>

      {/* ── Article Body ──────────────────────────────────────────────── */}
      <div className="max-w-2xl mx-auto px-4 py-12">

        {/* Back button */}
        <button
          onClick={() => navigate('/blog')}
          className="flex items-center gap-2 text-[#4a7c59] hover:text-[#2d5a3d] text-sm mb-8 transition-colors"
        >
          ← Back to Blog
        </button>

        {/* Markdown content */}
        <article>
          <ReactMarkdown components={mdComponents}>
            {post.content || ''}
          </ReactMarkdown>
        </article>

        {/* ── Author Bio ──────────────────────────────────────────────── */}
        <div className="mt-12 p-6 bg-[#f7faf8] dark:bg-[#1e3d2a] rounded-2xl border border-[#e8f0eb] dark:border-[#2d5a3d] flex gap-4 items-center">
          <div className="w-14 h-14 rounded-full bg-[#4a7c59] flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
            {post.author?.charAt(0) || 'S'}
          </div>
          <div>
            <p className="font-semibold text-[#1a3d28] dark:text-[#f0f7f2]">{post.author || 'Sphilile Thwala'}</p>
            <p className="text-sm text-gray-500 dark:text-[#7a9e85]">Founder, Promise Organics</p>
            <p className="text-sm text-gray-600 dark:text-[#c8dece] mt-1">
              Passionate about natural haircare and helping women embrace their natural beauty with organic products crafted with love.
            </p>
          </div>
        </div>

        {/* ── Tags ──────────────────────────────────────────────────────── */}
        {post.tags?.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <span
                key={tag}
                className="bg-[#e8f0eb] dark:bg-[#162d20] text-[#4a7c59] text-xs rounded-full px-3 py-1"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ── Related Posts ─────────────────────────────────────────────── */}
      {related.length > 0 && (
        <div className="bg-[#f7faf8] dark:bg-[#162d20] py-14">
          <div className="max-w-4xl mx-auto px-4">
            <h3 className="font-serif text-2xl text-[#1a3d28] dark:text-[#f0f7f2] mb-6">
              You Might Also Like
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {related.map(p => (
                <RelatedCard
                  key={p.id}
                  post={p}
                  onClick={() => navigate(`/blog/${p.slug}`)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
