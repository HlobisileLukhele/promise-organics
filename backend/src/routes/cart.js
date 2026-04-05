import { Router } from 'express';
import { getCart, addToCart, updateCartItem, removeFromCart } from '../controllers/cartController.js';
import { requireAuth } from '../middleware/auth.js';
import { validateBody, addToCartSchema, updateCartSchema } from '../middleware/validate.js';

const router = Router();

router.use(requireAuth);

router.get('/',     getCart);
router.post('/',    validateBody(addToCartSchema), addToCart);
router.patch('/:id', validateBody(updateCartSchema), updateCartItem);
router.delete('/:id', removeFromCart);

export default router;
