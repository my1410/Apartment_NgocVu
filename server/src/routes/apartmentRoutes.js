import { Router } from 'express';
import {
  createApartment,
  createInterest,
  deleteApartment,
  getApartment,
  listApartments,
  listFavorites,
  listInterests,
  toggleFavorite,
  updateApartment,
  updateInterest
} from '../controllers/apartmentController.js';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', listApartments);
router.get('/favorites/me', requireAuth, listFavorites);
router.get('/interests', requireAuth, requireRole('admin', 'agent'), listInterests);
router.patch('/interests/:id', requireAuth, requireRole('admin', 'agent'), updateInterest);
router.get('/:id', getApartment);
router.post('/', requireAuth, requireRole('admin', 'agent'), createApartment);
router.patch('/:id', requireAuth, requireRole('admin', 'agent'), updateApartment);
router.delete('/:id', requireAuth, requireRole('admin', 'agent'), deleteApartment);
router.post('/:id/favorite', requireAuth, toggleFavorite);
router.post('/:id/interest', requireAuth, createInterest);

export default router;
