import { Router } from 'express';
import { chat } from '../controllers/chatController.js';

const router = Router();

// Public — no auth required
router.post('/', chat);

export default router;
