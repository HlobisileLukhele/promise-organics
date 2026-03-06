import { Router } from 'express';
import { getCart, addToCart, updateCartItem, removeFromCart } from '../controllers/cartController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);

router.get('/',     getCart);
router.post('/',    addToCart);
router.patch('/:id', updateCartItem);
router.delete('/:id', removeFromCart);

export default router;
