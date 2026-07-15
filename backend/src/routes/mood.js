import express from 'express';
import { analyzeMood, getMoodHistory } from '../controllers/moodController.js';
import { validateMoodEntry } from '../middleware/validator.js';

const router = express.Router();

// POST /api/moods/analyze - Analyze and stream mood suggestion
router.post('/analyze', validateMoodEntry, analyzeMood);

// GET /api/moods/history - Get mood history entries
router.history = router.get('/history', getMoodHistory);

export default router;
