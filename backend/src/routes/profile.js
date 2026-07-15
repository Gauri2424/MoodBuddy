import express from 'express';
import { getProfile, updateProfile } from '../controllers/profileController.js';
import { validateProfileUpdate } from '../middleware/validator.js';

const router = express.Router();

// GET /api/profile - Fetch user profile and streak metrics
router.get('/', getProfile);

// PUT /api/profile - Edit username or select new avatar
router.put('/', validateProfileUpdate, updateProfile);

export default router;
