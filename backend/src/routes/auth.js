// Auth routes — registration, login, profile, and password reset.
import { Router } from 'express';
import { register, login, getMe } from '../controllers/authController.js';
import { forgotPassword, resetPassword } from '../controllers/passwordResetController.js';
import { requireAuth } from '../middleware/auth.js';
import { validateBody, registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from '../middleware/validate.js';

const router = Router();

router.post('/register',        validateBody(registerSchema), register);
router.post('/login',           validateBody(loginSchema),    login);
router.get('/me',               requireAuth, getMe);
router.post('/forgot-password', validateBody(forgotPasswordSchema), forgotPassword);
router.post('/reset-password',  validateBody(resetPasswordSchema),  resetPassword);

export default router;
