import asyncHandler from 'express-async-handler';
// Correctly import the model from 'chartModel.js' (lowercase 'c').
import Chart from '../models/chartModel.js';

// @desc    Save a new chart analysis
// @route   POST /api/charts/save
// @access  Private
const saveChart = asyncHandler(async (req, res) => {
  const { title, originalFileName, chartType, xKey, yKey, zKey, headers, rows } = req.body;

  if (!title || !originalFileName || !chartType || !headers || !rows) {
    res.status(400);
    throw new Error('Please provide all required chart data');
  }

  const chart = new Chart({
    user: req.user._id, // Link the chart to the logged-in user
    title,
    originalFileName,
    chartType,
    xKey,
    yKey,
    zKey,
    headers,
    rows,
  });

  const createdChart = await chart.save();
  res.status(201).json(createdChart);
});

// @desc    Get all charts for a user
// @route   GET /api/charts
// @access  Private
const getCharts = asyncHandler(async (req, res) => {
  // Find all charts that belong to the logged-in user
  const charts = await Chart.find({ user: req.user._id }).sort({ updatedAt: -1 }); // Sort by most recent
  res.json(charts);
});

// @desc    Delete a chart
// @route   DELETE /api/charts/:id
// @access  Private
const deleteChart = asyncHandler(async (req, res) => {
  const chart = await Chart.findById(req.params.id);

  if (chart) {
    // Make sure the user owns this chart before deleting
    if (chart.user.toString() !== req.user._id.toString()) {
      res.status(403); // Forbidden
      throw new Error('User not authorized to delete this chart');
    }

    await chart.deleteOne();
    res.json({ id: req.params.id, message: 'Chart removed' });
  } else {
    res.status(404);
    throw new Error('Chart not found');
  }
});

export { saveChart, getCharts, deleteChart };