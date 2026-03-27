// Blog controllers — public post listing/retrieval and admin post management.
// TODO: 500 responses currently return raw `error.message` — replace with a generic message before going live.
import { supabase } from '../config/supabase.js';

// ── Public ──────────────────────────────────────────────────────────────────

// GET /api/blog
export const getPosts = async (req, res) => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('id, title, slug, excerpt, cover_image, category, author, read_time, featured, tags, created_at')
    .eq('published', true)
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ success: false, message: error.message });
  res.json({ success: true, posts: data });
};

// GET /api/blog/:slug
export const getPostBySlug = async (req, res) => {
  const { slug } = req.params;
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (error || !data) return res.status(404).json({ success: false, message: 'Post not found' });
  res.json({ success: true, post: data });
};

// GET /api/blog/category/:cat
export const getPostsByCategory = async (req, res) => {
  const { cat } = req.params;
  const { data, error } = await supabase
    .from('blog_posts')
    .select('id, title, slug, excerpt, cover_image, category, author, read_time, featured, tags, created_at')
    .eq('published', true)
    .eq('category', cat)
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ success: false, message: error.message });
  res.json({ success: true, posts: data });
};

// ── Admin ────────────────────────────────────────────────────────────────────

// GET /api/blog/admin/all
export const getAllPosts = async (req, res) => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('id, title, slug, excerpt, cover_image, category, author, read_time, published, featured, tags, created_at')
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ success: false, message: error.message });
  res.json({ success: true, posts: data });
};

// POST /api/blog
export const createPost = async (req, res) => {
  const { title, slug, excerpt, content, cover_image, category, author, author_image, read_time, published, featured, tags } = req.body;

  if (!title?.trim() || !slug?.trim()) {
    return res.status(400).json({ success: false, message: 'Title and slug are required.' });
  }

  const { data, error } = await supabase
    .from('blog_posts')
    .insert({
      title:        title.trim(),
      slug:         slug.trim(),
      excerpt:      excerpt?.trim() || null,
      content:      content?.trim() || null,
      cover_image:  cover_image?.trim() || null,
      category:     category?.trim() || null,
      author:       author?.trim() || null,
      author_image: author_image?.trim() || null,
      read_time:    read_time ? parseInt(read_time) : null,
      published:    published ?? false,
      featured:     featured  ?? false,
      tags:         Array.isArray(tags) ? tags : [],
    })
    .select()
    .single();

  if (error) return res.status(500).json({ success: false, message: error.message });
  res.status(201).json({ success: true, post: data });
};

// PATCH /api/blog/:id
export const updatePost = async (req, res) => {
  const { id } = req.params;
  const { title, slug, excerpt, content, cover_image, category, author, author_image, read_time, published, featured, tags } = req.body;

  const updates = {};
  if (title        !== undefined) updates.title        = title.trim();
  if (slug         !== undefined) updates.slug         = slug.trim();
  if (excerpt      !== undefined) updates.excerpt      = excerpt?.trim() || null;
  if (content      !== undefined) updates.content      = content?.trim() || null;
  if (cover_image  !== undefined) updates.cover_image  = cover_image?.trim() || null;
  if (category     !== undefined) updates.category     = category?.trim() || null;
  if (author       !== undefined) updates.author       = author?.trim() || null;
  if (author_image !== undefined) updates.author_image = author_image?.trim() || null;
  if (read_time    !== undefined) updates.read_time    = read_time ? parseInt(read_time) : null;
  if (published    !== undefined) updates.published    = published;
  if (featured     !== undefined) updates.featured     = featured;
  if (tags         !== undefined) updates.tags         = Array.isArray(tags) ? tags : [];

  const { data, error } = await supabase
    .from('blog_posts')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) return res.status(500).json({ success: false, message: error.message });
  res.json({ success: true, post: data });
};

// PATCH /api/blog/:id/publish
export const togglePublish = async (req, res) => {
  const { id } = req.params;

  const { data: current, error: fetchErr } = await supabase
    .from('blog_posts').select('published').eq('id', id).single();

  if (fetchErr || !current) return res.status(404).json({ success: false, message: 'Post not found' });

  const { data, error } = await supabase
    .from('blog_posts')
    .update({ published: !current.published })
    .eq('id', id)
    .select()
    .single();

  if (error) return res.status(500).json({ success: false, message: error.message });
  res.json({ success: true, post: data });
};

// DELETE /api/blog/:id
export const deletePost = async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('blog_posts').delete().eq('id', id);
  if (error) return res.status(500).json({ success: false, message: error.message });
  res.json({ success: true, message: 'Post deleted.' });
};
