import { Router } from 'express';
import { login, me } from '../controllers/authController.js';
import { requireAdmin } from '../middleware/auth.js';
import { loginLimiter } from '../middleware/rateLimit.js';
import { validateLogin } from '../middleware/validate.js';

const router = Router();

router.post('/login', loginLimiter, validateLogin, login);
router.get('/me', requireAdmin, me);

export default router;
