import { Router } from 'express';
import { adminAuth } from '../middleware/adminAuth.js';
import {
  getOrders, getOrderById, updateOrder, updateOrderStatus, deleteOrder,
  getProducts, createProduct, updateProduct, updateStock, deleteProduct,
  getReviews, approveReview, rejectReview, deleteReview,
  getStats, testEmail,
} from '../controllers/adminController.js';

const router = Router();

// All admin routes require admin auth
router.use(adminAuth);

// Dashboard
router.get('/stats',      getStats);
router.get('/test-email', testEmail);

// Orders
router.get('/orders',              getOrders);
router.get('/orders/:id',          getOrderById);
router.patch('/orders/:id/status', updateOrderStatus);
router.patch('/orders/:id',        updateOrder);
router.delete('/orders/:id',       deleteOrder);

// Products
router.get('/products',              getProducts);
router.post('/products',             createProduct);
router.patch('/products/:id',        updateProduct);
router.patch('/products/:id/stock',  updateStock);
router.delete('/products/:id',       deleteProduct);

// Reviews
router.get('/reviews',                getReviews);
router.patch('/reviews/:id/approve',  approveReview);
router.patch('/reviews/:id/reject',   rejectReview);
router.delete('/reviews/:id',         deleteReview);

export default router;
