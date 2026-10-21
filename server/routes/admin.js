import express from 'express';
import { getStats, getContacts, getUsers, getAIInsights, getCompetitorAnalysis, getChats } from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.use(protect, adminOnly);

router.get('/stats', getStats);
router.get('/contacts', getContacts);
router.get('/users', getUsers);
router.get('/chats', getChats);

router.get('/ai-insights', getAIInsights);
router.get('/competitor-analysis', getCompetitorAnalysis);

export default router;