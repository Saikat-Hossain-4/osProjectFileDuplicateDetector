import React, { useState, useEffect } from 'react';
import { Search, UploadCloud, Copy, Folder, File, FileText, FileImage, Clock } from 'lucide-react';
import { fileAPI } from '../services/api';
import FileViewer from './FileViewer';
import './MainWorkspace.css';

const MainWorkspace = ({ onOpenUpload, refreshTrigger, setActivePage }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [recentFiles, setRecentFiles] = useState({ today: [], yesterday: [], lastWeek: [] });
  const [loading, setLoading] = useState(true);
  const [viewFile, setViewFile] = useState(null);
  
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

  const renderFileIcon = (type) => {
    if (type.includes('image')) return <FileImage size={24} color="#667eea" />;
    if (type.includes('pdf')) return <FileText size={24} color="#e53e3e" />;
    if (type.includes('word') || type.includes('doc')) return <File size={24} color="#3182ce" />;
    return <File size={24} color="#718096" />;
  };

  const FileCard = ({ file }) => (
    <div className="recent-file" onClick={() => handleOpenFile(file)}>
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
    </div>
  );

  return (
    <div className="main-workspace">
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
          <button className="scan-btn" onClick={() => setActivePage('duplicate-files')}>
            <Copy size={20} />
            Scan Duplicates
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
            <div className="recent-group">
              {searchResults.map(file => <FileCard key={file._id} file={file} />)}
            </div>
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
                  <div className="recent-group">
                    {recentFiles.today.map(file => <FileCard key={file._id} file={file} />)}
                  </div>
                </div>
              )}
              
              {recentFiles.yesterday.length > 0 && (
                <div className="recent-files">
                  <h3>Yesterday</h3>
                  <div className="recent-group">
                    {recentFiles.yesterday.map(file => <FileCard key={file._id} file={file} />)}
                  </div>
                </div>
              )}
              
              {recentFiles.lastWeek.length > 0 && (
                <div className="recent-files">
                  <h3>Last Week</h3>
                  <div className="recent-group">
                    {recentFiles.lastWeek.map(file => <FileCard key={file._id} file={file} />)}
                  </div>
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
    </div>
  );
};

export default MainWorkspace;
