import asyncHandler from 'express-async-handler';
// Correctly import the models using their actual filenames
import User from '../models/userModel.js';
import Chart from '../models/chartModel.js';

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  // Find all users and exclude their passwords from the result
  const users = await User.find({}).select('-password');
  res.json(users);
});

// @desc    Get system statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getStats = asyncHandler(async (req, res) => {
  const users = await User.countDocuments();
  const analyses = await Chart.countDocuments();
  res.json({ users, analyses });
});

export { getUsers, getStats };
