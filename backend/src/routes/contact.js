import { Router } from 'express';
import { sendContactEnquiry } from '../controllers/contactController.js';

const router = Router();

router.post('/', sendContactEnquiry);

export default router;
