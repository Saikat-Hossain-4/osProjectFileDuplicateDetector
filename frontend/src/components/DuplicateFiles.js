import React, { useState, useEffect } from 'react';
import { Search, Trash2, ExternalLink, File, Copy, AlertTriangle, Download } from 'lucide-react';
import { fileAPI } from '../services/api';
import FileViewer from './FileViewer';
import './DuplicateFiles.css';

const DuplicateFiles = ({ refreshTrigger, onUpdate }) => {
  const [duplicateGroups, setDuplicateGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewFile, setViewFile] = useState(null);

  useEffect(() => {
    fetchDuplicates();
  }, [refreshTrigger]);

  const fetchDuplicates = async () => {
    try {
      setLoading(true);
      const { data } = await fileAPI.getDuplicateFiles();
      setDuplicateGroups(data);
    } catch (error) {
      console.error('Error fetching duplicates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this file? This action cannot be undone.')) {
      try {
        await fileAPI.deleteFile(id);
        onUpdate();
      } catch (error) {
        alert('Failed to delete file');
      }
    }
  };

  const handleOpenFile = async (file) => {
    try {
      await fileAPI.updateLastAccessed(file._id);
      setViewFile(file);
      onUpdate();
    } catch (error) {
      setViewFile(file);
    }
  };

  // FIXED: Download using blob method
  const handleDownload = async (file) => {
    try {
      const downloadUrl = file.fileUrl.replace('/upload/', '/upload/fl_attachment/');
      const response = await fetch(downloadUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = file.originalName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download file. Please try again.');
    }
  };

  const filteredGroups = duplicateGroups.map(group => {
    if (!searchQuery) return group;
    const filteredFiles = group.files.filter(f => 
      f.originalName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return { ...group, files: filteredFiles };
  }).filter(group => group.files.length > 0);

  const calculateTotalWastedSpace = () => {
    let totalWasted = 0;
    duplicateGroups.forEach(group => {
      // If there are N identical files, N-1 are wasting space
      if (group.files.length > 1) {
        const fileSize = group.files[0].fileSize;
        totalWasted += fileSize * (group.files.length - 1);
      }
    });
    return (totalWasted / (1024 * 1024)).toFixed(2);
  };

  if (loading) return <div style={{color: 'white'}}>Scanning for duplicates...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Duplicate Files</h2>
          <p style={styles.subtitle}>
            {duplicateGroups.length > 0 
              ? `Found ${duplicateGroups.length} groups of duplicates. You can save ${calculateTotalWastedSpace()} MB by deleting them.`
              : 'Great job! Your workspace is free of duplicates.'}
          </p>
        </div>
        <div style={styles.searchContainer}>
          <Search size={18} color="#a0aec0" style={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Search duplicates..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
        </div>
      </div>

      {filteredGroups.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}><Copy size={48} color="#cbd5e0" /></div>
          <h3>No duplicates found</h3>
          <p>We couldn't find any identical files in your storage.</p>
        </div>
      ) : (
        <div style={styles.content}>
          {filteredGroups.map((group, index) => (
            <div key={group._id} style={styles.groupCard}>
              <div style={styles.groupHeader}>
                <div style={styles.groupInfo}>
                  <AlertTriangle size={18} color="#ed8936" />
                  <span style={styles.groupTitle}>Duplicate Group {index + 1}</span>
                  <span style={styles.badge}>{group.count} copies</span>
                </div>
                <div style={styles.groupSize}>
                  Size per file: {(group.files[0].fileSize / (1024 * 1024)).toFixed(2)} MB
                </div>
              </div>
              
              <div style={styles.fileList}>
                {group.files.map((file, fileIndex) => (
                  // ADDED: File click handler
                  <div key={file._id} style={{...styles.fileRow, cursor: 'pointer'}} onClick={() => handleOpenFile(file)}>
                    <div style={styles.fileIcon}>
                      <File size={20} color="#718096" />
                    </div>
                    <div style={styles.fileDetails}>
                      <span style={styles.fileName}>{file.originalName}</span>
                      <span style={styles.uploadDate}>
                        Uploaded: {new Date(file.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div style={styles.statusBadge}>
                      {fileIndex === 0 ? 'Original (Keep)' : 'Duplicate'}
                    </div>
                    <div style={styles.actions}>
                      {/* FIXED: Download using blob method */}
                      <button 
                        style={styles.actionBtn} 
                        onClick={(e) => { e.stopPropagation(); handleDownload(file); }}
                        title="Download"
                      >
                        <Download size={16} />
                      </button>
                      <button style={styles.actionBtn} onClick={(e) => { e.stopPropagation(); handleOpenFile(file); }} title="Open">
                        <ExternalLink size={16} />
                      </button>
                      <button 
                        style={{...styles.actionBtn, color: '#e53e3e'}} 
                        onClick={(e) => { e.stopPropagation(); handleDelete(file._id); }}
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {viewFile && <FileViewer file={viewFile} onClose={() => setViewFile(null)} />}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
    paddingBottom: '40px',
    color: '#ffffff'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '30px',
    flexWrap: 'wrap',
    gap: '20px'
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#ffffff',
    margin: 0,
    marginBottom: '8px'
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '14px',
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
    borderRadius: '10px',
    border: '1px solid rgba(255, 255, 255, 0.16)',
    fontSize: '14px',
    background: 'rgba(255, 255, 255, 0.08)',
    color: '#ffffff',
    backdropFilter: 'blur(8px)'
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px',
    color: 'rgba(255, 255, 255, 0.7)'
  },
  emptyIcon: {
    marginBottom: '16px'
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  groupCard: {
    marginBottom: '16px',
    borderRadius: '16px',
    overflow: 'hidden',
    border: '1px solid rgba(255, 255, 255, 0.08)'
  },
  groupHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
  },
  groupInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  groupTitle: {
    fontWeight: '600',
    color: '#ffffff'
  },
  badge: {
    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    color: 'white',
    padding: '4px 10px',
    borderRadius: '999px',
    fontSize: '12px',
    fontWeight: '700'
  },
  groupSize: {
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.65)',
    fontWeight: '500'
  },
  fileList: {
    display: 'flex',
    flexDirection: 'column'
  },
  fileRow: {
    display: 'flex',
    alignItems: 'center',
    padding: '14px 16px',
    background: 'rgba(255, 255, 255, 0.07)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    borderRadius: '12px',
    gap: '16px',
    transition: 'all 0.3s ease',
    marginBottom: '8px'
  },
  fileIcon: {
    width: '40px',
    height: '40px',
    background: 'rgba(255, 255, 255, 0.08)',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid rgba(255, 255, 255, 0.12)'
  },
  fileDetails: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  fileName: {
    fontWeight: '500',
    color: '#ffffff',
    fontSize: '14px'
  },
  uploadDate: {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.55)'
  },
  statusBadge: {
    padding: '4px 8px',
    borderRadius: '999px',
    fontSize: '12px',
    fontWeight: '500',
    background: 'rgba(255, 255, 255, 0.08)',
    color: 'rgba(255, 255, 255, 0.8)',
    width: '120px',
    textAlign: 'center'
  },
  actions: {
    display: 'flex',
    gap: '8px'
  },
  actionBtn: {
    background: 'rgba(255, 255, 255, 0.08)',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    padding: '8px',
    cursor: 'pointer',
    color: 'rgba(255, 255, 255, 0.75)',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease'
  }
};

export default DuplicateFiles;
