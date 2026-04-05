import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { initiatePayment, handleWebhook } from '../controllers/paymentController.js';
import { validateBody, initiatePaymentSchema } from '../middleware/validate.js';

const router = Router();

// Protected: authenticated users only
router.post('/initiate', requireAuth, validateBody(initiatePaymentSchema), initiatePayment);

// Public: PayFast ITN callback (no auth header from PayFast)
router.post('/webhook', handleWebhook);

export default router;
