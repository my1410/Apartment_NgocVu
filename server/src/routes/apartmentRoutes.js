import { Router } from 'express';
import {
  createApartment,
  createInterest,
  createViewingAppointment,
  deleteApartment,
  getApartmentAnalytics,
  getApartment,
  getPersonalRecommendations,
  listApartments,
  listFavorites,
  listInterests,
  listMyViewingAppointments,
  listViewingAppointments,
  recordApartmentView,
  toggleFavorite,
  updateApartment,
  updateInterest,
  updateViewingAppointment
} from '../controllers/apartmentController.js';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', listApartments);
router.get('/favorites/me', requireAuth, listFavorites);
router.get('/recommendations/me', requireAuth, getPersonalRecommendations);
router.get('/viewings/me', requireAuth, listMyViewingAppointments);
router.get('/viewings', requireAuth, requireRole('admin', 'agent'), listViewingAppointments);
router.patch('/viewings/:id', requireAuth, requireRole('admin', 'agent'), updateViewingAppointment);
router.get('/analytics/overview', requireAuth, requireRole('admin', 'agent'), getApartmentAnalytics);
router.get('/interests', requireAuth, requireRole('admin', 'agent'), listInterests);
router.patch('/interests/:id', requireAuth, requireRole('admin', 'agent'), updateInterest);
router.get('/:id', getApartment);
router.post('/', requireAuth, requireRole('admin', 'agent'), createApartment);
router.patch('/:id', requireAuth, requireRole('admin', 'agent'), updateApartment);
router.delete('/:id', requireAuth, requireRole('admin', 'agent'), deleteApartment);
router.post('/:id/favorite', requireAuth, toggleFavorite);
router.post('/:id/interest', requireAuth, createInterest);
router.post('/:id/view', requireAuth, recordApartmentView);
router.post('/:id/viewing', requireAuth, createViewingAppointment);

export default router;
