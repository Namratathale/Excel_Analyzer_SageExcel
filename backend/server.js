import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js'; // <-- Using a separate file for DB connection
import { notFound, errorHandler } from './middleware/errorMiddleware.js'; // <-- Importing error handlers

// Import all route files
import authRoutes from './routes/authRoutes.js';
import chartRoutes from './routes/chartRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

const app = express();

// --- CORS Configuration ---
// Setup a whitelist for allowed origins
const whitelist = ['http://localhost:5173'];
if (process.env.FRONTEND_URL) {
  whitelist.push(process.env.FRONTEND_URL);
}

const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// --- Middleware ---
// Increase the limit for JSON payloads to handle large data from files.
app.use(express.json({ limit: '50mb' }));

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/charts', chartRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/admin', adminRoutes);

// Simple test route for checking server status
app.get('/api/test', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

// --- Custom Error Handling Middleware ---
// This must be placed after your API routes.
app.use(notFound);
app.use(errorHandler);

// --- Start Server ---
const PORT = process.env.PORT || 5001;
app.listen(PORT, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
