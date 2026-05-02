import React, { useState, useEffect } from 'react';
import { Search, UploadCloud, Copy, Folder, File, FileText, FileImage, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fileAPI } from '../services/api';
import FileViewer from './FileViewer';
import './MainWorkspace.css';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.4, ease: "easeOut" } }
};

const MainWorkspace = ({ onOpenUpload, refreshTrigger, setActivePage }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [recentFiles, setRecentFiles] = useState({ today: [], yesterday: [], lastWeek: [] });
  const [loading, setLoading] = useState(true);
  const [viewFile, setViewFile] = useState(null);
  
  // Scanning state
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const username = user.email?.split('@')[0] || 'User';

  useEffect(() => {
    fetchRecentFiles();
  }, [refreshTrigger]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery) {
        try {
          const { data } = await fileAPI.searchFiles(searchQuery);
          setSearchResults(data);
        } catch (error) {
          console.error('Error searching files', error);
        }
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const fetchRecentFiles = async () => {
    try {
      const { data } = await fileAPI.getRecentFiles();
      setRecentFiles(data);
    } catch (error) {
      console.error('Error fetching recent files', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenFile = async (file) => {
    try {
      await fileAPI.updateLastAccessed(file._id);
      setViewFile(file);
      // Refresh to update last accessed time if needed
      fetchRecentFiles();
    } catch (error) {
      console.error('Error updating access time', error);
      setViewFile(file);
    }
  };

  const handleScanDuplicates = () => {
    setIsScanning(true);
    setScanProgress(0);
    
    // Simulate scan progress for premium UX
    const duration = 2500; // 2.5 seconds
    const interval = 40; // update every 40ms
    const step = 100 / (duration / interval);
    
    const timer = setInterval(() => {
      setScanProgress((prev) => {
        if (prev + step >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setIsScanning(false);
            setActivePage('duplicate-files');
          }, 400); // Brief pause at 100%
          return 100;
        }
        return prev + step;
      });
    }, interval);
  };

  const renderFileIcon = (type) => {
    if (type.includes('image')) return <FileImage size={24} color="#667eea" />;
    if (type.includes('pdf')) return <FileText size={24} color="#e53e3e" />;
    if (type.includes('word') || type.includes('doc')) return <File size={24} color="#3182ce" />;
    return <File size={24} color="#718096" />;
  };

  const FileCard = ({ file }) => (
    <motion.div 
      className="recent-file" 
      onClick={() => handleOpenFile(file)}
      variants={itemVariants}
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="file-icon-wrapper">
        {renderFileIcon(file.fileType)}
      </div>
      <div className="file-info">
        <div className="file-name" title={file.originalName}>
          {file.originalName}
        </div>
        <div className="file-size">
          {(file.fileSize / (1024 * 1024)).toFixed(2)} MB
        </div>
      </div>
    </motion.div>
  );

  return (
    <motion.div 
      className="main-workspace"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="workspace-header">
        <h1>Hi, {username}</h1>
      </div>
      
      <div className="search-section">
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Search files..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button 
            className="scan-btn" 
            onClick={handleScanDuplicates}
            disabled={isScanning}
          >
            <Copy size={20} />
            {isScanning ? 'Scanning...' : 'Scan Duplicates'}
          </button>
        </div>
      </div>

      <div className="quick-upload">
        <button className="upload-btn" onClick={onOpenUpload}>
          <UploadCloud size={20} />
          <span>Quick Upload</span>
        </button>
      </div>

      {searchQuery ? (
        <div className="recent-files">
          <h3>Search Results</h3>
          {searchResults.length > 0 ? (
            <motion.div 
              className="recent-group"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {searchResults.map(file => <FileCard key={file._id} file={file} />)}
            </motion.div>
          ) : (
            <p style={{color: 'rgba(255, 255, 255, 0.7)', textAlign: 'center', padding: '20px'}}>
              No files found matching "{searchQuery}"
            </p>
          )}
        </div>
      ) : (
        <>
          {loading ? (
            <p style={{color: 'white'}}>Loading recent files...</p>
          ) : (
            <>
              {recentFiles.today.length > 0 && (
                <div className="recent-files">
                  <h3>Today</h3>
                  <motion.div 
                    className="recent-group"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {recentFiles.today.map(file => <FileCard key={file._id} file={file} />)}
                  </motion.div>
                </div>
              )}
              
              {recentFiles.yesterday.length > 0 && (
                <div className="recent-files">
                  <h3>Yesterday</h3>
                  <motion.div 
                    className="recent-group"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {recentFiles.yesterday.map(file => <FileCard key={file._id} file={file} />)}
                  </motion.div>
                </div>
              )}
              
              {recentFiles.lastWeek.length > 0 && (
                <div className="recent-files">
                  <h3>Last Week</h3>
                  <motion.div 
                    className="recent-group"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {recentFiles.lastWeek.map(file => <FileCard key={file._id} file={file} />)}
                  </motion.div>
                </div>
              )}

              {recentFiles.today.length === 0 && recentFiles.yesterday.length === 0 && recentFiles.lastWeek.length === 0 && (
                <div style={{
                  textAlign: 'center',
                  padding: '60px 20px',
                  borderRadius: '12px',
                  border: '1px dashed rgba(255, 255, 255, 0.2)',
                  color: 'rgba(255, 255, 255, 0.7)'
                }}>
                  <div style={{marginBottom: '16px'}}>
                    <Clock size={48} color="rgba(255, 255, 255, 0.4)" />
                  </div>
                  <h3>No recent files</h3>
                  <p>Upload a file or open existing ones to see them here.</p>
                </div>
              )}
            </>
          )}
        </>
      )}

      {viewFile && <FileViewer file={viewFile} onClose={() => setViewFile(null)} />}

      {/* Scanning Overlay */}
      <AnimatePresence>
        {isScanning && (
          <motion.div 
            className="scan-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="scan-loader-container">
              <svg className="scan-circle" width="160" height="160" viewBox="0 0 160 160">
                <defs>
                  <linearGradient id="scan-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
                <circle 
                  className="scan-circle-bg" 
                  cx="80" cy="80" r="70" 
                  strokeWidth="8" 
                />
                <motion.circle 
                  className="scan-circle-progress" 
                  cx="80" cy="80" r="70" 
                  strokeWidth="8" 
                  strokeDasharray={2 * Math.PI * 70}
                  strokeDashoffset={2 * Math.PI * 70 * (1 - scanProgress / 100)}
                  strokeLinecap="round"
                  style={{ stroke: "url(#scan-gradient)" }}
                />
              </svg>
              <div className="scan-percentage">
                {Math.round(scanProgress)}%
              </div>
              <div className="scan-text">
                {scanProgress < 50 ? 'Scanning files...' : 'Detecting duplicates...'}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MainWorkspace;
