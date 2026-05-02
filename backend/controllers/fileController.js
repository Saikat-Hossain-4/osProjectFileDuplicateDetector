const File = require('../models/File');
const { generateFileHash } = require('../utils/fileHelpers');
const { cloudinary } = require('../config/cloudinary');

exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { originalname, size, mimetype, path, filename } = req.file;
    const fileHash = generateFileHash(originalname, size);

    const newFile = new File({
      userId: req.user._id,
      filename: filename, // public_id from cloudinary
      originalName: originalname,
      fileType: mimetype,
      fileSize: size,
      fileUrl: path,
      publicId: filename,
      fileHash: fileHash
    });

    await newFile.save();
    res.status(201).json(newFile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during upload' });
  }
};

exports.getUserFiles = async (req, res) => {
  try {
    const files = await File.find({ userId: req.user._id }).sort({ originalName: 1 });
    res.json(files);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getDuplicateFiles = async (req, res) => {
  try {
    // Group files by fileHash where count > 1
    const duplicates = await File.aggregate([
      { $match: { userId: req.user._id } },
      { 
        $group: { 
          _id: '$fileHash', 
          files: { $push: '$$ROOT' },
          count: { $sum: 1 } 
        } 
      },
      { $match: { count: { $gt: 1 } } }
    ]);
    res.json(duplicates);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getRecentFiles = async (req, res) => {
  try {
    const files = await File.find({ userId: req.user._id }).sort({ lastAccessed: -1 });
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);

    const recentFiles = {
      today: [],
      yesterday: [],
      lastWeek: []
    };

    files.forEach(file => {
      const accessedDate = new Date(file.lastAccessed);
      if (accessedDate >= today) {
        recentFiles.today.push(file);
      } else if (accessedDate >= yesterday) {
        recentFiles.yesterday.push(file);
      } else if (accessedDate >= lastWeek) {
        recentFiles.lastWeek.push(file);
      }
    });

    res.json(recentFiles);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.renameFile = async (req, res) => {
  try {
    const { newName } = req.body;
    if (!newName) {
      return res.status(400).json({ message: 'New name is required' });
    }

    const file = await File.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { originalName: newName },
      { new: true }
    );

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.json(file);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteFile = async (req, res) => {
  try {
    const file = await File.findOne({ _id: req.params.id, userId: req.user._id });
    
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(file.publicId);

    // Delete from DB
    await File.findByIdAndDelete(req.params.id);

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateLastAccessed = async (req, res) => {
  try {
    const file = await File.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { lastAccessed: Date.now() },
      { new: true }
    );

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.json(file);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.searchFiles = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.json([]);
    }

    const files = await File.find({
      userId: req.user._id,
      originalName: { $regex: q, $options: 'i' }
    });

    res.json(files);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
