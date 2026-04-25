import express from 'express';
const router = express.Router();
import { getUsers, getStats } from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

// All routes in this file will be protected and require admin access.
router.route('/users').get(protect, admin, getUsers);
router.route('/stats').get(protect, admin, getStats);

export default router;
