import express from 'express';
const router = express.Router();
// Import all necessary controller functions, including the missing deleteChart
import {
  saveChart,
  getCharts,
  deleteChart,
} from '../controllers/chartController.js';
import { protect } from '../middleware/authMiddleware.js';

// Route to get all charts for the logged-in user
router.route('/').get(protect, getCharts);

// Route to save a new chart analysis
router.route('/save').post(protect, saveChart);

// Route to delete a specific chart by its ID
// The 'deleteChart' function is now correctly imported and referenced here.
router.route('/:id').delete(protect, deleteChart);

export default router;