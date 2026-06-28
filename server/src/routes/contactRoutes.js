import { Router } from 'express';
import {
  createContactRequest,
  listContactRequests,
  updateContactRequest
} from '../controllers/contactController.js';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/', createContactRequest);
router.get('/', requireAuth, requireRole('admin', 'agent'), listContactRequests);
router.patch('/:id', requireAuth, requireRole('admin', 'agent'), updateContactRequest);

export default router;
