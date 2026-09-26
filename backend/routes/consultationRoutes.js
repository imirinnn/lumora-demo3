import { Router } from 'express';
import {
  consultationStats,
  createConsultation,
  getConsultation,
  listConsultations,
  updateConsultationStatus,
} from '../controllers/consultationController.js';
import { requireAdmin } from '../middleware/auth.js';
import { enquiryLimiter } from '../middleware/rateLimit.js';
import { validateConsultation, validateStatus } from '../middleware/validate.js';

const router = Router();

// Public
router.post('/', enquiryLimiter, validateConsultation, createConsultation);

// Admin only
router.get('/', requireAdmin, listConsultations);
router.get('/stats', requireAdmin, consultationStats);
router.get('/:id', requireAdmin, getConsultation);
router.patch('/:id/status', requireAdmin, validateStatus, updateConsultationStatus);

export default router;
