// Auth routes — registration, login, profile, and password reset.
import { Router } from 'express';
import { register, login, getMe } from '../controllers/authController.js';
import { forgotPassword, resetPassword } from '../controllers/passwordResetController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/register',        register);
router.post('/login',           login);
router.get('/me',               requireAuth, getMe);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password',  resetPassword);

export default router;
