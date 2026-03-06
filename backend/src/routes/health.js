import { Router } from 'express';
import { supabase } from '../config/supabase.js';

const router = Router();

// GET /api/health — public
router.get('/', async (req, res) => {
  try {
    const { count, error } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    if (error) throw error;

    res.json({
      status: 'ok',
      db: 'connected',
      userCount: count ?? 0,
      timestamp: new Date(),
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      db: 'disconnected',
      error: err.message,
    });
  }
});

export default router;
