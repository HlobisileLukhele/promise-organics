import { Router } from 'express';
import { submitReview, getReviews, applaudReview } from '../controllers/reviewsController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/',                  getReviews);
router.post('/',                 submitReview);
router.post('/:id/helpful',      requireAuth, applaudReview);

export default router;
