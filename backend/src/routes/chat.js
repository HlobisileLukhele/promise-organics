import { Router } from 'express';
import { chat } from '../controllers/chatController.js';
import { validateBody, chatSchema } from '../middleware/validate.js';

const router = Router();

// Public — no auth required
router.post('/', validateBody(chatSchema), chat);

export default router;
