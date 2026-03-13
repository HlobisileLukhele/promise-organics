import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || '';

const CATEGORIES = ['All', 'Hair Care', 'Ingredients', 'Hair Tips'];

function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-[#1e3d2a] rounded-2xl overflow-hidden animate-pulse">
      <div className="h-64 bg-gray-200 dark:bg-[#2d5a3d]" />
      <div className="p-6 space-y-3">
        <div className="h-4 bg-gray-200 dark:bg-[#2d5a3d] rounded w-3/4" />
        <div className="h-3 bg-gray-200 dark:bg-[#2d5a3d] rounded w-full" />
        <div className="h-3 bg-gray-200 dark:bg-[#2d5a3d] rounded w-2/3" />
      </div>
    </div>
  );
}

function BlogCard({ post, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-[#1e3d2a] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group cursor-pointer"
    >
      <div className="relative overflow-hidden h-64">
        {post.cover_image ? (
          <img
            src={post.cover_image}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#2d5a3d] to-[#4a7c59] flex items-center justify-center">
            <span className="text-4xl">🌿</span>
          </div>
        )}
        <span className="absolute top-3 left-3 bg-[#4a7c59] text-white text-xs rounded-full px-3 py-1 font-medium">
          {post.category}
        </span>
      </div>

      <div className="p-6">
        <h2 className="font-serif text-xl font-semibold text-[#1a3d28] dark:text-[#f0f7f2] leading-snug mb-3 group-hover:text-[#4a7c59] transition-colors line-clamp-2">
          {post.title}
        </h2>
        <p className="text-gray-500 dark:text-[#7a9e85] text-base line-clamp-2 mb-5">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-[#2d5a3d]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#4a7c59] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              {post.author?.charAt(0) || 'P'}
            </div>
            <span className="text-sm text-gray-500 dark:text-[#7a9e85]">{post.author}</span>
          </div>
          <span className="text-sm text-gray-400 dark:text-[#7a9e85]">{post.read_time} min read</span>
        </div>
      </div>
    </div>
  );
}

export default function Blog() {
  const [posts, setPosts]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [email, setEmail]           = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API}/api/blog`)
      .then(r => r.json())
      .then(d => setPosts(d.posts || []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  const featuredPost = posts.find(p => p.featured) || posts[0];

  const filtered = activeCategory === 'All'
    ? posts
    : posts.filter(p => p.category === activeCategory);

  const gridPosts = featuredPost
    ? filtered.filter(p => p.id !== featuredPost.id)
    : filtered;

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) setSubscribed(true);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0f1f17]">

      {/* ── Featured Hero ─────────────────────────────────────────────── */}
      {!loading && featuredPost && (
        <div
          className="relative h-96 w-full overflow-hidden cursor-pointer"
          onClick={() => navigate(`/blog/${featuredPost.slug}`)}
        >
          {featuredPost.cover_image ? (
            <img
              src={featuredPost.cover_image}
              alt={featuredPost.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#0f1f17] to-[#2d5a3d]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f1f17]/90 via-[#0f1f17]/40 to-transparent" />

          <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-14 max-w-4xl">
            <span className="bg-[#4a7c59] text-white rounded-full px-3 py-1 text-xs font-medium w-fit mb-4">
              {featuredPost.category}
            </span>
            <h1 className="font-serif text-3xl md:text-5xl font-bold text-white leading-tight mb-3">
              {featuredPost.title}
            </h1>
            <p className="text-white/80 text-sm md:text-base mb-5 max-w-xl line-clamp-2">
              {featuredPost.excerpt}
            </p>
            <div className="flex items-center gap-4">
              <button className="bg-white text-[#1a3d28] font-semibold px-5 py-2 rounded-full text-sm hover:bg-[#f0f7f2] transition-colors">
                Read Article →
              </button>
              <span className="text-white/60 text-xs">
                {featuredPost.author} · {featuredPost.read_time} min read
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── Page Header ────────────────────────────────────────────────── */}
      <div className="py-14 bg-[#f7faf8] dark:bg-[#162d20] text-center">
        <span className="text-[#4a7c59] text-xs tracking-widest uppercase font-medium">Our Journal</span>
        <h1 className="font-serif text-4xl text-[#1a3d28] dark:text-[#f0f7f2] mt-2">
          The Promise Organics Blog
        </h1>
        <p className="text-gray-500 dark:text-[#7a9e85] mt-3 max-w-md mx-auto text-sm">
          Hair care tips, ingredient insights, and natural living from our team.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">

        {/* ── Category Filter ─────────────────────────────────────────── */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-10 scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer border
                ${activeCategory === cat
                  ? 'bg-[#4a7c59] text-white border-[#4a7c59]'
                  : 'bg-white dark:bg-[#1e3d2a] border-[#4a7c59] text-[#4a7c59] hover:bg-[#4a7c59]/10'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ── Blog Grid ──────────────────────────────────────────────── */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : gridPosts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 dark:text-[#7a9e85] text-lg">No posts in this category yet.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {gridPosts.slice(0, 3).map(post => (
                <BlogCard
                  key={post.id}
                  post={post}
                  onClick={() => navigate(`/blog/${post.slug}`)}
                />
              ))}
            </div>

            {/* ── Newsletter Banner ─────────────────────────────────── */}
            <div className="my-10 bg-[#2d5a3d] rounded-2xl p-10 text-center text-white">
              <span className="text-[#9aab9e] text-xs tracking-widest uppercase font-medium">Stay in the loop</span>
              <h3 className="font-serif text-2xl mt-2 mb-2">Get Hair Care Tips in Your Inbox</h3>
              <p className="text-[#9aab9e] text-sm mb-6 max-w-md mx-auto">
                Join our community for natural hair tips, new product launches, and exclusive offers.
              </p>
              {subscribed ? (
                <p className="text-white font-medium">✅ Thanks for subscribing!</p>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-3 max-w-sm mx-auto">
                  <input
                    type="email"
                    required
                    placeholder="Your email address"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a7c59]"
                  />
                  <button
                    type="submit"
                    className="bg-[#4a7c59] hover:bg-[#4a7c59]/80 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>

            {gridPosts.length > 3 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {gridPosts.slice(3).map(post => (
                  <BlogCard
                    key={post.id}
                    post={post}
                    onClick={() => navigate(`/blog/${post.slug}`)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
