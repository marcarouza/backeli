import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { ApiError } from './errorHandler.js';

// Get directory name using ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Accept image files only
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new ApiError('Not an image! Please upload only images.', 400), false);
  }
};

// Initialize multer upload
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB
  },
  fileFilter: fileFilter
});

// Single file upload middleware
export const uploadSingle = (fieldName) => upload.single(fieldName);

// Multiple files upload middleware
export const uploadMultiple = (fieldName, maxCount) => upload.array(fieldName, maxCount);

// Multiple fields upload middleware
export const uploadFields = (fields) => upload.fields(fields);

export default {
  upload,
  uploadSingle,
  uploadMultiple,
  uploadFields
};