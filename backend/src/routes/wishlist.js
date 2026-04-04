import { Router } from 'express';
import { getWishlist, addToWishlist, removeFromWishlist } from '../controllers/wishlistController.js';
import { requireAuth } from '../middleware/auth.js';
import { validateBody, addToWishlistSchema } from '../middleware/validate.js';

const router = Router();

router.use(requireAuth);

router.get('/',       getWishlist);
router.post('/',      validateBody(addToWishlistSchema), addToWishlist);
router.delete('/:id', removeFromWishlist);

export default router;
