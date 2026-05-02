import React, { useState, useEffect } from 'react';
import { Search, Edit2, Trash2, Download, ExternalLink, FileImage, FileText, File } from 'lucide-react';
import { fileAPI } from '../services/api';
import FileViewer from './FileViewer';
import './YourFiles.css';

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

  if (loading) return <div style={{color: 'white'}}>Loading files...</div>;

  const renderGroup = (title, filesList) => {
    if (filesList.length === 0) return null;
    return (
      <div className="file-group">
        <h3>{title} <span style={{fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)'}}>({filesList.length})</span></h3>
        <div className="file-list">
          {filesList.map(file => (
            <div key={file._id} className="file-card" onClick={() => handleOpenFile(file)}>
              <div className="file-info">
                <div className="file-icon">
                  {file.fileType.includes('image') ? <FileImage size={20} color="#667eea" /> :
                   file.fileType.includes('pdf') ? <FileText size={20} color="#f5576c" /> :
                   <File size={20} color="#4299e1" />}
                </div>
                {editingFileId === file._id ? (
                  <div style={{display: 'flex', gap: '8px', alignItems: 'center'}} onClick={(e) => e.stopPropagation()}>
                    <input 
                      type="text" 
                      value={editName} 
                      onChange={(e) => setEditName(e.target.value)}
                      style={{padding: '6px 10px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.2)', background: 'rgba(255, 255, 255, 0.1)', color: 'white', flex: 1}}
                      autoFocus
                      onKeyDown={(e) => e.key === 'Enter' && handleRename(file._id)}
                    />
                    <button style={{padding: '6px 12px', background: '#48bb78', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: '600'}} onClick={() => handleRename(file._id)}>Save</button>
                    <button style={{padding: '6px 12px', background: 'rgba(255, 255, 255, 0.2)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: '600'}} onClick={() => setEditingFileId(null)}>Cancel</button>
                  </div>
                ) : (
                  <>
                    <div className="file-name" title={file.originalName}>{file.originalName}</div>
                    <div style={{fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)'}}>{(file.fileSize / (1024 * 1024)).toFixed(2)} MB</div>
                  </>
                )}
              </div>

              <div className="file-actions">
                <button onClick={(e) => { e.stopPropagation(); startEdit(file); }} title="Rename">
                  <Edit2 size={16} />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleDownload(file); }}
                  title="Download"
                >
                  <Download size={16} />
                </button>
                <button onClick={(e) => { e.stopPropagation(); handleOpenFile(file); }} title="Open Preview">
                  <ExternalLink size={16} />
                </button>
                <button onClick={(e) => { e.stopPropagation(); handleDelete(file._id); }} title="Delete">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="your-files">
      <div className="files-header">
        <h2>Your Files</h2>
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Filter files..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {files.length === 0 ? (
        <div style={{textAlign: 'center', padding: '60px 20px', color: 'rgba(255, 255, 255, 0.7)'}}>
          <File size={48} style={{marginBottom: '16px', opacity: 0.5}} />
          <p>No files uploaded yet.</p>
        </div>
      ) : (
        <>
          {renderGroup('Images', groupedFiles.images)}
          {renderGroup('PDF Documents', groupedFiles.pdfs)}
          {renderGroup('Word Documents', groupedFiles.docs)}
          {renderGroup('Other Files', groupedFiles.others)}
        </>
      )}

      {viewFile && <FileViewer file={viewFile} onClose={() => setViewFile(null)} />}
    </div>
  );
};

export default YourFiles;
