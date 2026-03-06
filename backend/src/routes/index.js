import { Router } from 'express';
import authRoutes    from './auth.js';
import productRoutes from './products.js';
import cartRoutes    from './cart.js';
import wishlistRoutes from './wishlist.js';
import billingRoutes from './billing.js';
import orderRoutes   from './orders.js';
import paymentRoutes from './payment.js';
import healthRoutes  from './health.js';
import chatRoutes    from './chat.js';
import contactRoutes from './contact.js';

const router = Router();

router.use('/auth',     authRoutes);
router.use('/products', productRoutes);
router.use('/cart',     cartRoutes);
router.use('/wishlist', wishlistRoutes);
router.use('/billing',  billingRoutes);
router.use('/orders',   orderRoutes);
router.use('/payment',  paymentRoutes);
router.use('/health',   healthRoutes);
router.use('/chat',     chatRoutes);
router.use('/contact',  contactRoutes);

export default router;
