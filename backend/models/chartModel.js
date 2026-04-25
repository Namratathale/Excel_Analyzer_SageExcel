import mongoose from 'mongoose';

// Defines the structure for each saved chart analysis in the database.
const chartSchema = mongoose.Schema(
  {
    // A reference to the User who created this chart.
    // This links the Chart document to a User document.
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // The model to link to.
    },
    title: {
      type: String,
      required: true,
    },
    originalFileName: {
      type: String,
      required: true,
    },
    chartType: {
      type: String,
      required: true,
    },
    // The keys (column names) used for the chart axes.
    xKey: { type: String },
    yKey: { type: String },
    zKey: { type: String },
    // A snapshot of the data used for this specific analysis.
    headers: {
      type: [String],
      required: true,
    },
    rows: {
      // Allows for an array of objects with any structure.
      type: [mongoose.Schema.Types.Mixed],
      required: true,
    },
  },
  {
    // Automatically adds `createdAt` and `updatedAt` timestamps.
    timestamps: true,
  }
);

const Chart = mongoose.model('Chart', chartSchema);

export default Chart;