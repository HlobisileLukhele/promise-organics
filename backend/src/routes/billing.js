import { Router } from 'express';
import { getBilling, saveBilling } from '../controllers/billingController.js';
import { requireAuth } from '../middleware/auth.js';
import { validateBody, billingSchema } from '../middleware/validate.js';

const router = Router();

router.use(requireAuth);

router.get('/',  getBilling);
router.post('/', validateBody(billingSchema), saveBilling);

export default router;
