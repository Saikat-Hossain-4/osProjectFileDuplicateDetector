import React, { useState, useEffect } from 'react';
import { Search, UploadCloud, Copy, Folder, File, FileText, FileImage, Clock } from 'lucide-react';
import { fileAPI } from '../services/api';
import FileViewer from './FileViewer';

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
    <div style={styles.fileCard} onClick={() => handleOpenFile(file)}>
      <div style={styles.fileIconWrapper}>
        {renderFileIcon(file.fileType)}
      </div>
      <div style={styles.fileInfo}>
        <div style={styles.fileName} title={file.originalName}>
          {file.originalName}
        </div>
        <div style={styles.fileSize}>
          {(file.fileSize / (1024 * 1024)).toFixed(2)} MB
        </div>
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.greeting}>Hi, {username}</h1>
          <p style={styles.subtitle}>Welcome to your file manager</p>
        </div>
        
        <div style={styles.searchContainer}>
          <Search size={20} color="#a0aec0" style={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Search files..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
        </div>
      </header>

      <div style={styles.quickActions}>
        <button style={{...styles.actionBtn, backgroundColor: '#ebf4ff', color: '#3182ce'}} onClick={onOpenUpload}>
          <UploadCloud size={24} />
          <span>Quick Upload</span>
        </button>
        <button style={{...styles.actionBtn, backgroundColor: '#f0fff4', color: '#38a169'}} onClick={() => setActivePage('duplicate-files')}>
          <Copy size={24} />
          <span>Scan Duplicates</span>
        </button>
        <button style={{...styles.actionBtn, backgroundColor: '#faf5ff', color: '#805ad5'}} onClick={() => setActivePage('your-files')}>
          <Folder size={24} />
          <span>All Files</span>
        </button>
      </div>

      {searchQuery ? (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Search Results</h2>
          {searchResults.length > 0 ? (
            <div style={styles.fileGrid}>
              {searchResults.map(file => <FileCard key={file._id} file={file} />)}
            </div>
          ) : (
            <p style={styles.emptyText}>No files found matching "{searchQuery}"</p>
          )}
        </div>
      ) : (
        <>
          {loading ? (
            <p>Loading recent files...</p>
          ) : (
            <>
              {recentFiles.today.length > 0 && (
                <div style={styles.section}>
                  <h2 style={styles.sectionTitle}>Today</h2>
                  <div style={styles.fileGrid}>
                    {recentFiles.today.map(file => <FileCard key={file._id} file={file} />)}
                  </div>
                </div>
              )}
              
              {recentFiles.yesterday.length > 0 && (
                <div style={styles.section}>
                  <h2 style={styles.sectionTitle}>Yesterday</h2>
                  <div style={styles.fileGrid}>
                    {recentFiles.yesterday.map(file => <FileCard key={file._id} file={file} />)}
                  </div>
                </div>
              )}
              
              {recentFiles.lastWeek.length > 0 && (
                <div style={styles.section}>
                  <h2 style={styles.sectionTitle}>Last Week</h2>
                  <div style={styles.fileGrid}>
                    {recentFiles.lastWeek.map(file => <FileCard key={file._id} file={file} />)}
                  </div>
                </div>
              )}

              {recentFiles.today.length === 0 && recentFiles.yesterday.length === 0 && recentFiles.lastWeek.length === 0 && (
                <div style={styles.emptyState}>
                  <div style={styles.emptyIcon}><Clock size={48} color="#cbd5e0" /></div>
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

const styles = {
  container: {
    maxWidth: '1000px',
    margin: '0 auto'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    flexWrap: 'wrap',
    gap: '20px'
  },
  greeting: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: '4px'
  },
  subtitle: {
    color: '#718096',
    fontSize: '15px'
  },
  searchContainer: {
    position: 'relative',
    width: '300px'
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)'
  },
  searchInput: {
    width: '100%',
    padding: '12px 12px 12px 40px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    fontSize: '15px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.02)',
    transition: 'border-color 0.2s',
  },
  quickActions: {
    display: 'flex',
    gap: '16px',
    marginBottom: '40px',
    flexWrap: 'wrap'
  },
  actionBtn: {
    flex: '1',
    minWidth: '150px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    padding: '24px',
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '15px',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  section: {
    marginBottom: '32px'
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#4a5568',
    marginBottom: '16px',
    paddingBottom: '8px',
    borderBottom: '1px solid #e2e8f0'
  },
  fileGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '16px'
  },
  fileCard: {
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
    border: '1px solid #edf2f7',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  fileIconWrapper: {
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    backgroundColor: '#f7fafc',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  fileInfo: {
    flex: 1,
    overflow: 'hidden'
  },
  fileName: {
    fontWeight: '500',
    fontSize: '14px',
    color: '#2d3748',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    marginBottom: '4px'
  },
  fileSize: {
    fontSize: '12px',
    color: '#a0aec0'
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    backgroundColor: 'white',
    borderRadius: '12px',
    border: '1px dashed #cbd5e0'
  },
  emptyIcon: {
    marginBottom: '16px'
  },
  emptyText: {
    color: '#718096',
    textAlign: 'center',
    padding: '20px'
  }
};

export default MainWorkspace;
