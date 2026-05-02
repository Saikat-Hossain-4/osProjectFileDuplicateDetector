import React, { useState, useEffect } from 'react';
import { Search, Clock, ExternalLink, FileImage, FileText, File } from 'lucide-react';
import { fileAPI } from '../services/api';
import FileViewer from './FileViewer';

const RecentFiles = ({ refreshTrigger }) => {
  const [recentFiles, setRecentFiles] = useState({ today: [], yesterday: [], lastWeek: [] });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewFile, setViewFile] = useState(null);

  useEffect(() => {
    fetchRecentFiles();
  }, [refreshTrigger]);

  const fetchRecentFiles = async () => {
    try {
      setLoading(true);
      const { data } = await fileAPI.getRecentFiles();
      setRecentFiles(data);
    } catch (error) {
      console.error('Error fetching recent files:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenFile = async (file) => {
    try {
      await fileAPI.updateLastAccessed(file._id);
      setViewFile(file);
      // We don't fetch immediately as it would re-order the list while user is viewing
    } catch (error) {
      setViewFile(file);
    }
  };

  const filterFiles = (filesList) => {
    if (!searchQuery) return filesList;
    return filesList.filter(f => f.originalName.toLowerCase().includes(searchQuery.toLowerCase()));
  };

  const renderFileIcon = (type) => {
    if (type.includes('image')) return <FileImage size={20} color="#667eea" />;
    if (type.includes('pdf')) return <FileText size={20} color="#e53e3e" />;
    return <File size={20} color="#3182ce" />;
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderFileRow = (file) => (
    <div key={file._id} style={styles.fileRow}>
      <div style={styles.fileIcon}>
        {renderFileIcon(file.fileType)}
      </div>
      <div style={styles.fileDetails}>
        <span style={styles.fileName}>{file.originalName}</span>
        <span style={styles.fileSize}>{(file.fileSize / (1024 * 1024)).toFixed(2)} MB</span>
      </div>
      <div style={styles.accessTime}>
        <Clock size={14} style={{ marginRight: '4px' }} />
        {formatTime(file.lastAccessed)}
      </div>
      <button style={styles.openBtn} onClick={() => handleOpenFile(file)}>
        <ExternalLink size={16} /> Open
      </button>
    </div>
  );

  const renderSection = (title, filesList) => {
    const filtered = filterFiles(filesList);
    if (filtered.length === 0) return null;

    return (
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>{title}</h3>
        <div style={styles.fileList}>
          {filtered.map(renderFileRow)}
        </div>
      </div>
    );
  };

  const hasFiles = recentFiles.today.length > 0 || recentFiles.yesterday.length > 0 || recentFiles.lastWeek.length > 0;

  if (loading) return <div>Loading recent files...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Recent Files</h2>
        <div style={styles.searchContainer}>
          <Search size={18} color="#a0aec0" style={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Search recent files..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
        </div>
      </div>

      {!hasFiles ? (
        <div style={styles.emptyState}>
          <Clock size={48} color="#cbd5e0" style={{ marginBottom: '16px' }} />
          <h3>No recent activity</h3>
          <p>Files you upload or open will appear here.</p>
        </div>
      ) : (
        <div style={styles.content}>
          {renderSection('Today', recentFiles.today)}
          {renderSection('Yesterday', recentFiles.yesterday)}
          {renderSection('Last Week', recentFiles.lastWeek)}
          
          {searchQuery && filterFiles([...recentFiles.today, ...recentFiles.yesterday, ...recentFiles.lastWeek]).length === 0 && (
            <p style={{textAlign: 'center', color: '#718096', padding: '40px'}}>No matching recent files found.</p>
          )}
        </div>
      )}

      {viewFile && <FileViewer file={viewFile} onClose={() => {
        setViewFile(null);
        fetchRecentFiles(); // Refresh list after viewing to update timestamps
      }} />}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
    paddingBottom: '40px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    flexWrap: 'wrap',
    gap: '16px'
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#2d3748',
    margin: 0
  },
  searchContainer: {
    position: 'relative',
    width: '250px'
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)'
  },
  searchInput: {
    width: '100%',
    padding: '10px 10px 10px 36px',
    borderRadius: '6px',
    border: '1px solid #e2e8f0',
    fontSize: '14px'
  },
  emptyState: {
    textAlign: 'center',
    padding: '80px 20px',
    backgroundColor: 'white',
    borderRadius: '12px',
    border: '1px dashed #cbd5e0',
    color: '#718096'
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '32px'
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#4a5568',
    margin: 0,
    paddingBottom: '8px',
    borderBottom: '2px solid #edf2f7'
  },
  fileList: {
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
    border: '1px solid #edf2f7',
    overflow: 'hidden'
  },
  fileRow: {
    display: 'flex',
    alignItems: 'center',
    padding: '16px 20px',
    borderBottom: '1px solid #edf2f7',
    gap: '16px',
    transition: 'background-color 0.2s'
  },
  fileIcon: {
    width: '40px',
    height: '40px',
    backgroundColor: '#f7fafc',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  fileDetails: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  fileName: {
    fontWeight: '500',
    color: '#2d3748',
    fontSize: '14px'
  },
  fileSize: {
    fontSize: '12px',
    color: '#a0aec0'
  },
  accessTime: {
    display: 'flex',
    alignItems: 'center',
    color: '#718096',
    fontSize: '13px',
    width: '120px'
  },
  openBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    backgroundColor: '#edf2f7',
    color: '#4a5568',
    border: 'none',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  }
};

export default RecentFiles;
