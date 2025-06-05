import jwt from 'jsonwebtoken';
import { ApiError } from './errorHandler.js';
// import User from '../models/user.js';

// JWT secret (should be in environment variable in production)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '30d';

/**
 * Generate JWT token
 * @param {Object} payload - Data to encode in token
 * @returns {String} JWT token
 */
export const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

/**
 * Verify JWT token
 * @param {String} token - JWT token to verify
 * @returns {Object} Decoded token payload
 */
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new ApiError('Invalid or expired token', 401);
  }
};

/**
 * Middleware to protect routes - requires authentication
 */
export const protect = async (req, res, next) => {
  try {
    let token;
    
    // Get token from headers or cookies
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }
    
    // Check if token exists
    if (!token) {
      throw new ApiError('Not authorized to access this route', 401);
    }
    
    // Verify token
    const decoded = verifyToken(token);
    
    // Find user by id
    const user = await User.findById(decoded.id);
    if (!user) {
      throw new ApiError('User not found', 404);
    }
    
    // Check if user changed password after token was issued
    if (user.passwordChangedAt && decoded.iat < user.passwordChangedAt.getTime() / 1000) {
      throw new ApiError('User recently changed password. Please log in again', 401);
    }
    
    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware to restrict access to specific roles
 * @param {...String} roles - Allowed roles
 * @returns {Function} Middleware function
 */
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError('You must be logged in to access this route', 401));
    }
    
    if (!roles.includes(req.user.role)) {
      return next(new ApiError('You do not have permission to perform this action', 403));
    }
    
    next();
  };
};

export default {
  generateToken,
  verifyToken,
  protect,
  restrictTo
};