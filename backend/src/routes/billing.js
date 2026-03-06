import { Router } from 'express';
import { getBilling, saveBilling } from '../controllers/billingController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);

router.get('/',  getBilling);
router.post('/', saveBilling);

export default router;
