import express from 'express';
import { analyzeSituation, allocateProfessional, getAssignedProfessionals, markFirstLoginComplete, getAssignedVictims, transferChat } from '../controllers/aiController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Protected routes - user must be logged in
router.post('/analyze', authenticate, analyzeSituation);
router.post('/allocate', authenticate, allocateProfessional);
router.get('/assignments', authenticate, getAssignedProfessionals);
router.post('/mark-first-login-complete', authenticate, markFirstLoginComplete);
router.get('/assigned-victims', authenticate, getAssignedVictims);
router.post('/transfer', authenticate, transferChat);

export default router;
