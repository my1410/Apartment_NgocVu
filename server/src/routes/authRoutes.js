import { Router } from 'express';
import { login, logout, me, register, updateMe, verifyEmail } from '../controllers/authController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/verify-email', verifyEmail);
router.get('/me', requireAuth, me);
router.patch('/me', requireAuth, updateMe);

export default router;
