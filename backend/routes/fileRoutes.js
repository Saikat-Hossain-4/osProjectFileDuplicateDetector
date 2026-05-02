const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { upload } = require('../config/cloudinary');
const {
  uploadFile,
  getUserFiles,
  getDuplicateFiles,
  getRecentFiles,
  renameFile,
  deleteFile,
  updateLastAccessed,
  searchFiles
} = require('../controllers/fileController');

// All file routes are protected
router.use(auth);

// Search files (must be before /:id to avoid matching 'search' as an ID)
router.get('/search', searchFiles);

// Get duplicate and recent files
router.get('/duplicates', getDuplicateFiles);
router.get('/recent', getRecentFiles);

// Core file operations
router.post('/upload', upload.single('file'), uploadFile);
router.get('/', getUserFiles);
router.put('/:id/rename', renameFile);
router.delete('/:id', deleteFile);
router.put('/:id/access', updateLastAccessed);

module.exports = router;
