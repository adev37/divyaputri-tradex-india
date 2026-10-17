import express from 'express';
import { getStats, getContacts, getUsers, getAIInsights } from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.use(protect, adminOnly);

router.get('/stats', getStats);
router.get('/contacts', getContacts);
router.get('/users', getUsers);

// ✅ Naya Route
router.get('/ai-insights', getAIInsights);

export default router;