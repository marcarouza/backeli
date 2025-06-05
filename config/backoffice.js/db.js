import mongoose from 'mongoose';
import { logger } from './logger.js';

/**
 * Connect to MongoDB database
 * @returns {Promise<mongoose.Connection>} Mongoose connection
 */
export const connectToDatabase = async () => {
  try {
    // MongoDB connection URL (provide as environment variable in production)
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tp-nodejs';
    
    // Configure mongoose
    mongoose.set('strictQuery', false);
    
    // Connect to MongoDB
    const connection = await mongoose.connect(MONGODB_URI);
    
    logger.info('MongoDB Connected Successfully');
    return connection;
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    throw error;
  }
};

/**
 * Close MongoDB connection
 */
export const closeDatabase = async () => {
  try {
    await mongoose.connection.close();
    logger.info('MongoDB connection closed');
  } catch (error) {
    logger.error('Error closing MongoDB connection:', error);
    throw error;
  }
};

// Monitor connection events
mongoose.connection.on('connected', () => {
  logger.info('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  logger.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  logger.info('Mongoose disconnected from MongoDB');
});

// Handle process termination
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  logger.info('MongoDB connection closed due to app termination');
  process.exit(0);
});