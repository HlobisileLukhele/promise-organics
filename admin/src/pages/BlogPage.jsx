import { useEffect, useState } from 'react';
import {
  fetchAllBlogPosts, createBlogPost, updateBlogPost,
  toggleBlogPublish, deleteBlogPost,
} from '../api/adminApi';

const CATEGORIES = ['Hair Care', 'Ingredients', 'Hair Tips'];

const emptyForm = {
  title: '', slug: '', category: 'Hair Care', excerpt: '',
  cover_image: '', read_time: 5, featured: false,
  tags: '', content: '', published: false,
};

function slugify(str) {
  return str.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-[11px] font-semibold tracking-wider uppercase text-gray-400 dark:text-[#7a9e85] mb-1.5">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputCls = 'w-full border border-gray-300 dark:border-[#2d5a3d] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a7c59] bg-gray-50 dark:bg-[#162d20] dark:text-[#f0f7f2] dark:placeholder-[#7a9e85]';

function BlogFormModal({ post, onClose, onSave }) {
  const [form, setForm] = useState(post ? {
    title:       post.title       || '',
    slug:        post.slug        || '',
    category:    post.category    || 'Hair Care',
    excerpt:     post.excerpt     || '',
    cover_image: post.cover_image || '',
    read_time:   post.read_time   ?? 5,
    featured:    post.featured    ?? false,
    tags:        Array.isArray(post.tags) ? post.tags.join(', ') : '',
    content:     post.content     || '',
    published:   post.published   ?? false,
  } : { ...emptyForm });

  const [saving, setSaving] = useState(false);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleTitleChange = (e) => {
    set('title', e.target.value);
    if (!post) set('slug', slugify(e.target.value));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        read_time: parseInt(form.read_time) || 5,
      };
      await onSave(payload);
      onClose();
    } catch {
      alert('Failed to save post.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000] p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white dark:bg-[#1e3d2a] rounded-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center px-8 pt-7 pb-5 border-b border-gray-100 dark:border-[#2d5a3d]">
          <h2 className="text-2xl dark:text-[#f0f7f2]">{post ? 'Edit Post' : 'New Post'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-[#c8dece] text-xl cursor-pointer">✕</button>
        </div>

        <form onSubmit={handleSave} className="px-8 py-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Title *">
              <input
                required value={form.title}
                onChange={handleTitleChange}
                className={inputCls}
              />
            </Field>
            <Field label="Slug *">
              <input
                required value={form.slug}
                onChange={e => set('slug', e.target.value)}
                className={`${inputCls} font-mono`}
              />
            </Field>
            <Field label="Category">
              <select
                value={form.category}
                onChange={e => set('category', e.target.value)}
                className={inputCls}
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Read Time (minutes)">
              <input
                type="number" min="1" max="60"
                value={form.read_time}
                onChange={e => set('read_time', e.target.value)}
                className={inputCls}
              />
            </Field>
          </div>

          <Field label="Excerpt (max 160 chars)">
            <textarea
              rows={2} maxLength={160}
              value={form.excerpt}
              onChange={e => set('excerpt', e.target.value)}
              className={`${inputCls} resize-none`}
            />
          </Field>

          <Field label="Cover Image URL">
            <input
              value={form.cover_image}
              onChange={e => set('cover_image', e.target.value)}
              placeholder="https://…"
              className={inputCls}
            />
            {form.cover_image && (
              <img
                src={form.cover_image}
                alt="preview"
                className="mt-2 h-24 w-full object-cover rounded-lg border border-gray-200 dark:border-[#2d5a3d]"
                onError={e => { e.target.style.display = 'none'; }}
              />
            )}
          </Field>

          <Field label="Tags (comma separated)">
            <input
              value={form.tags}
              onChange={e => set('tags', e.target.value)}
              placeholder="e.g. hair growth, avocado, moisture"
              className={inputCls}
            />
          </Field>

          <Field label="Content (Markdown supported)">
            <textarea
              rows={14}
              value={form.content}
              onChange={e => set('content', e.target.value)}
              className={`${inputCls} resize-y font-mono text-xs leading-relaxed`}
              placeholder="Write your blog post content here using Markdown..."
            />
          </Field>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer text-sm dark:text-[#c8dece]">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={e => set('featured', e.target.checked)}
                className="w-4 h-4 accent-[#4a7c59]"
              />
              Featured (hero post)
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-sm dark:text-[#c8dece]">
              <input
                type="checkbox"
                checked={form.published}
                onChange={e => set('published', e.target.checked)}
                className="w-4 h-4 accent-[#4a7c59]"
              />
              Published
            </label>
          </div>

          <div className="flex gap-3 justify-end pt-2 border-t border-gray-100 dark:border-[#2d5a3d]">
            <button
              type="button" onClick={onClose}
              className="border border-gray-300 dark:border-[#2d5a3d] text-gray-600 dark:text-[#c8dece] px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-[#162d20] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit" disabled={saving}
              className="bg-[#4a7c59] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#2d5a3d] transition-colors cursor-pointer disabled:opacity-60"
            >
              {saving ? 'Saving…' : post ? 'Save Changes' : 'Create Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function BlogPage() {
  const [posts, setPosts]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [modal, setModal]     = useState(null); // null | 'create' | post object
  const [toggling, setToggling] = useState(null);
  const [toast, setToast]     = useState(null);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const { data } = await fetchAllBlogPosts();
      setPosts(data.posts || []);
    } catch {
      setError('Failed to load posts.');
    } finally {
      setLoading(false);
    }
  }

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  async function handleSave(payload) {
    if (modal === 'create') {
      const { data } = await createBlogPost(payload);
      setPosts(prev => [data.post, ...prev]);
      showToast('Post created ✅');
    } else {
      const { data } = await updateBlogPost(modal.id, payload);
      setPosts(prev => prev.map(p => p.id === modal.id ? data.post : p));
      showToast('Post updated ✅');
    }
  }

  async function handleToggle(post) {
    setToggling(post.id);
    try {
      const { data } = await toggleBlogPublish(post.id);
      setPosts(prev => prev.map(p => p.id === post.id ? data.post : p));
    } catch {
      alert('Failed to update status.');
    } finally {
      setToggling(null);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Permanently delete this post?')) return;
    try {
      await deleteBlogPost(id);
      setPosts(prev => prev.filter(p => p.id !== id));
      showToast('Post deleted.');
    } catch {
      alert('Failed to delete post.');
    }
  }

  if (loading) return <div className="text-[#7a9e85] p-8">Loading posts…</div>;
  if (error)   return <div className="text-red-600 p-8">{error}</div>;

  return (
    <div>
      {toast && (
        <div className="fixed bottom-7 right-7 z-[2000] bg-[#2d5a3d] text-white px-5 py-3 rounded-xl text-sm font-medium shadow-lg">
          {toast}
        </div>
      )}

      <div className="flex justify-between items-start mb-7">
        <div>
          <h1 className="text-3xl mb-1">Blog Posts</h1>
          <p className="text-[#7a9e85] text-sm">{posts.length} posts total</p>
        </div>
        <button
          onClick={() => setModal('create')}
          className="bg-[#4a7c59] text-white px-5 py-2.5 rounded-lg hover:bg-[#2d5a3d] transition-colors font-medium text-sm cursor-pointer"
        >
          + New Post
        </button>
      </div>

      <div className="bg-white dark:bg-[#1e3d2a] rounded-xl border border-gray-200 dark:border-[#2d5a3d] overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 dark:bg-[#162d20] text-gray-500 dark:text-[#7a9e85] uppercase text-xs">
            <tr>
              {['Title', 'Category', 'Author', 'Status', 'Date', 'Actions'].map(h => (
                <th key={h} className="px-5 py-3 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 && (
              <tr>
                <td colSpan={6} className="p-10 text-center text-[#7a9e85]">
                  No posts yet. Create your first post!
                </td>
              </tr>
            )}
            {posts.map(p => (
              <tr key={p.id} className="border-t border-gray-100 dark:border-[#2d5a3d] hover:bg-gray-50 dark:hover:bg-[#162d20] transition-colors">
                <td className="px-5 py-3.5 max-w-[260px]">
                  <div className="font-medium text-[#2d5a3d] dark:text-[#7dc49a] truncate">{p.title}</div>
                  <div className="text-xs text-gray-400 dark:text-[#7a9e85] font-mono truncate">{p.slug}</div>
                </td>
                <td className="px-5 py-3.5">
                  <span className="bg-[#e8f0eb] dark:bg-[#2d5a3d]/30 text-[#4a7c59] dark:text-[#7dc49a] px-2.5 py-0.5 rounded-full text-xs font-medium">
                    {p.category}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-gray-600 dark:text-[#c8dece] text-sm">{p.author}</td>
                <td className="px-5 py-3.5">
                  <button
                    onClick={() => handleToggle(p)}
                    disabled={toggling === p.id}
                    className={`rounded-full px-3 py-1 text-xs font-semibold cursor-pointer border-none transition-colors disabled:opacity-60
                      ${p.published ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    {toggling === p.id ? '…' : p.published ? 'Published' : 'Draft'}
                  </button>
                </td>
                <td className="px-5 py-3.5 text-xs text-[#7a9e85]">
                  {new Date(p.created_at).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })}
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setModal(p)}
                      className="bg-[#e8f0eb] text-[#4a7c59] rounded-md px-3 py-1 text-xs font-semibold cursor-pointer hover:bg-[#d0e4d6] transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="bg-red-50 text-red-600 rounded-md px-3 py-1 text-xs font-semibold cursor-pointer hover:bg-red-100 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <BlogFormModal
          post={modal === 'create' ? null : modal}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
