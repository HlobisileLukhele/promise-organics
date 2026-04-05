import { Router } from 'express';
import { sendContactEnquiry } from '../controllers/contactController.js';
import { validateBody, contactSchema } from '../middleware/validate.js';

const router = Router();

router.post('/', validateBody(contactSchema), sendContactEnquiry);

export default router;
