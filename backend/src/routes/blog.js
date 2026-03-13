import { Router } from 'express';
import { adminAuth } from '../middleware/adminAuth.js';
import {
  getPosts, getPostBySlug, getPostsByCategory,
  getAllPosts, createPost, updatePost, togglePublish, deletePost,
} from '../controllers/blogController.js';

const router = Router();

// ── Admin routes (must come before /:slug to avoid conflict) ─────────────────
router.get('/admin/all',       adminAuth, getAllPosts);
router.post('/',               adminAuth, createPost);
router.patch('/:id/publish',   adminAuth, togglePublish);
router.patch('/:id',           adminAuth, updatePost);
router.delete('/:id',          adminAuth, deletePost);

// ── Public routes ────────────────────────────────────────────────────────────
router.get('/',                getPosts);
router.get('/category/:cat',   getPostsByCategory);
router.get('/:slug',           getPostBySlug);

export default router;
