import React, { useState, useEffect } from 'react';
import { Search, Edit2, Trash2, Download, ExternalLink, FileImage, FileText, File } from 'lucide-react';
import { fileAPI } from '../services/api';
import FileViewer from './FileViewer';

const YourFiles = ({ refreshTrigger, onUpdate }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingFileId, setEditingFileId] = useState(null);
  const [editName, setEditName] = useState('');
  const [viewFile, setViewFile] = useState(null);

  useEffect(() => {
    fetchFiles();
  }, [refreshTrigger]);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const { data } = await fileAPI.getUserFiles();
      setFiles(data);
    } catch (error) {
      console.error('Error fetching files:', error);
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

  const startEdit = (file) => {
    setEditingFileId(file._id);
    setEditName(file.originalName);
  };

  const handleRename = async (id) => {
    if (!editName.trim()) return;
    try {
      await fileAPI.renameFile(id, editName);
      setEditingFileId(null);
      onUpdate();
    } catch (error) {
      alert('Failed to rename file');
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

  const getFilteredAndGroupedFiles = () => {
    let filtered = files;
    if (searchQuery) {
      filtered = files.filter(f => f.originalName.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    const groups = {
      images: [],
      pdfs: [],
      docs: [],
      others: []
    };

    filtered.forEach(file => {
      const type = file.fileType.toLowerCase();
      if (type.includes('image')) groups.images.push(file);
      else if (type.includes('pdf')) groups.pdfs.push(file);
      else if (type.includes('word') || type.includes('doc')) groups.docs.push(file);
      else groups.others.push(file);
    });

    // Sort alphabetically within groups
    const sortFn = (a, b) => a.originalName.localeCompare(b.originalName);
    groups.images.sort(sortFn);
    groups.pdfs.sort(sortFn);
    groups.docs.sort(sortFn);
    groups.others.sort(sortFn);

    return groups;
  };

  const groupedFiles = getFilteredAndGroupedFiles();

  const renderFileRow = (file) => (
    // ADDED: File click handler
    <div key={file._id} style={{...styles.fileRow, cursor: 'pointer'}} onClick={() => handleOpenFile(file)}>
      <div style={styles.fileIcon}>
        {file.fileType.includes('image') ? <FileImage size={20} color="#667eea" /> :
         file.fileType.includes('pdf') ? <FileText size={20} color="#e53e3e" /> :
         <File size={20} color="#3182ce" />}
      </div>
      
      <div style={styles.fileInfo}>
        {editingFileId === file._id ? (
          <div style={styles.editContainer} onClick={(e) => e.stopPropagation()}>
            <input 
              type="text" 
              value={editName} 
              onChange={(e) => setEditName(e.target.value)}
              style={styles.editInput}
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleRename(file._id)}
            />
            <button style={styles.saveBtn} onClick={() => handleRename(file._id)}>Save</button>
            <button style={styles.cancelBtn} onClick={() => setEditingFileId(null)}>Cancel</button>
          </div>
        ) : (
          <span style={styles.fileName} title={file.originalName}>{file.originalName}</span>
        )}
      </div>

      <div style={styles.fileSize}>
        {(file.fileSize / (1024 * 1024)).toFixed(2)} MB
      </div>

      <div style={styles.fileActions}>
        <button style={styles.actionIconBtn} onClick={(e) => { e.stopPropagation(); startEdit(file); }} title="Rename">
          <Edit2 size={16} />
        </button>
        {/* FIXED: Download using blob method */}
        <button 
          style={styles.actionIconBtn} 
          onClick={(e) => { e.stopPropagation(); handleDownload(file); }}
          title="Download"
        >
          <Download size={16} />
        </button>
        <button style={styles.actionIconBtn} onClick={(e) => { e.stopPropagation(); handleOpenFile(file); }} title="Open Preview">
          <ExternalLink size={16} />
        </button>
        <button style={{...styles.actionIconBtn, color: '#e53e3e'}} onClick={(e) => { e.stopPropagation(); handleDelete(file._id); }} title="Delete">
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );

  const renderGroup = (title, filesList) => {
    if (filesList.length === 0) return null;
    return (
      <div style={styles.groupContainer}>
        <h3 style={styles.groupTitle}>{title} <span style={styles.badge}>{filesList.length}</span></h3>
        <div style={styles.tableHeader}>
          <div style={{...styles.headerCell, flex: '0 0 40px'}}></div>
          <div style={{...styles.headerCell, flex: 1}}>Name</div>
          <div style={{...styles.headerCell, width: '100px'}}>Size</div>
          <div style={{...styles.headerCell, width: '150px', textAlign: 'right'}}>Actions</div>
        </div>
        <div style={styles.groupContent}>
          {filesList.map(renderFileRow)}
        </div>
      </div>
    );
  };

  if (loading) return <div>Loading files...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Your Files</h2>
        <div style={styles.searchContainer}>
          <Search size={18} color="#a0aec0" style={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Filter files..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
        </div>
      </div>

      {files.length === 0 ? (
        <div style={styles.emptyState}>
          <File size={48} color="#cbd5e0" />
          <p>No files uploaded yet.</p>
        </div>
      ) : (
        <div style={styles.content}>
          {renderGroup('Images', groupedFiles.images)}
          {renderGroup('PDF Documents', groupedFiles.pdfs)}
          {renderGroup('Word Documents', groupedFiles.docs)}
          {renderGroup('Other Files', groupedFiles.others)}
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
  groupContainer: {
    marginBottom: '32px',
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
    overflow: 'hidden',
    border: '1px solid #edf2f7'
  },
  groupTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#4a5568',
    padding: '16px 20px',
    borderBottom: '1px solid #edf2f7',
    margin: 0,
    backgroundColor: '#f8fafc',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  badge: {
    backgroundColor: '#e2e8f0',
    color: '#4a5568',
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '700'
  },
  tableHeader: {
    display: 'flex',
    padding: '12px 20px',
    borderBottom: '1px solid #edf2f7',
    fontSize: '13px',
    fontWeight: '600',
    color: '#718096',
    backgroundColor: '#fff'
  },
  headerCell: {
    // handled inline
  },
  groupContent: {
    display: 'flex',
    flexDirection: 'column'
  },
  fileRow: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 20px',
    borderBottom: '1px solid #edf2f7',
    transition: 'background-color 0.2s',
  },
  fileIcon: {
    flex: '0 0 40px',
    display: 'flex',
    alignItems: 'center'
  },
  fileInfo: {
    flex: 1,
    overflow: 'hidden',
    paddingRight: '16px'
  },
  fileName: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#2d3748',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: 'block'
  },
  editContainer: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center'
  },
  editInput: {
    flex: 1,
    padding: '6px 10px',
    border: '1px solid #cbd5e0',
    borderRadius: '4px',
    fontSize: '14px'
  },
  saveBtn: {
    padding: '6px 12px',
    backgroundColor: '#48bb78',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '12px',
    cursor: 'pointer'
  },
  cancelBtn: {
    padding: '6px 12px',
    backgroundColor: '#edf2f7',
    color: '#4a5568',
    border: 'none',
    borderRadius: '4px',
    fontSize: '12px',
    cursor: 'pointer'
  },
  fileSize: {
    width: '100px',
    fontSize: '13px',
    color: '#718096'
  },
  fileActions: {
    width: '150px',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '8px'
  },
  actionIconBtn: {
    background: 'none',
    border: 'none',
    padding: '6px',
    cursor: 'pointer',
    color: '#718096',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px',
    transition: 'background-color 0.2s, color 0.2s',
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px',
    color: '#718096'
  }
};

export default YourFiles;
