import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';

// Middleware to protect routes that require a logged-in user.
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check if the request has an Authorization header with a Bearer token.
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract the token from the 'Bearer <token>' string.
      token = req.headers.authorization.split(' ')[1];

      // Verify the token using the secret key.
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user associated with the token's ID and attach it to the request object.
      // We exclude the password from the user object for security.
      req.user = await User.findById(decoded.id).select('-password');

      // If the user is found, proceed to the next middleware or the route handler.
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  // If no token is found in the header, the user is not authorized.
  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

// Middleware to protect routes that require an admin user.
const admin = (req, res, next) => {
  // This middleware should run *after* the 'protect' middleware.
  if (req.user && req.user.role === 'admin') {
    // If the user exists and has the 'admin' role, proceed.
    next();
  } else {
    // Otherwise, the user is forbidden from accessing the resource.
    res.status(403);
    throw new Error('Not authorized as an admin');
  }
};

export { protect, admin };
