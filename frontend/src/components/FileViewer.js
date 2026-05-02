import React from 'react';
import { X, Download, FileText } from 'lucide-react';

const FileViewer = ({ file, onClose }) => {
  const isImage = file.fileType.includes('image');
  const isPdf = file.fileType.includes('pdf');
  const isWord = file.fileType.includes('word') || file.fileType.includes('document');

  // FIXED: Download using blob method
  const handleDownload = async () => {
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

  return (
    <div style={styles.overlay}>
      <div style={styles.modalContainer}>
        <div style={styles.header}>
          <div style={styles.fileInfo}>
            <h3 style={styles.fileName}>{file.originalName}</h3>
            <span style={styles.fileMeta}>
              {(file.fileSize / (1024 * 1024)).toFixed(2)} MB • {file.fileType}
            </span>
          </div>
          <div style={styles.actions}>
            <button 
              onClick={handleDownload} 
              style={styles.downloadBtn}
            >
              <Download size={18} />
              <span>Download</span>
            </button>
            <button style={styles.closeBtn} onClick={onClose}>
              <X size={24} />
            </button>
          </div>
        </div>

        <div style={styles.viewerContent}>
          {isImage && (
            <div style={styles.imageContainer}>
              <img src={file.fileUrl} alt={file.originalName} style={styles.image} />
            </div>
          )}

          {isPdf && (
            <iframe 
              src={`${file.fileUrl}#toolbar=0`} 
              style={styles.iframe} 
              title={file.originalName}
            />
          )}

          {isWord && (
            <div style={styles.unsupportedContainer}>
              <FileText size={64} color="#3182ce" style={{ marginBottom: '20px' }} />
              <h2 style={{ marginBottom: '10px', color: '#2d3748' }}>Word Document Preview</h2>
              <p style={{ color: '#718096', marginBottom: '24px', textAlign: 'center', maxWidth: '400px' }}>
                Preview is not available for Word documents. Please download the file to view its contents.
              </p>
              <button 
                onClick={handleDownload} 
                style={styles.largeDownloadBtn}
              >
                <Download size={20} />
                Download Document
              </button>
            </div>
          )}

          {!isImage && !isPdf && !isWord && (
            <div style={styles.unsupportedContainer}>
              <h2 style={{ marginBottom: '10px' }}>No Preview Available</h2>
              <p style={{ color: '#718096', marginBottom: '24px' }}>
                This file type cannot be previewed in the browser.
              </p>
              <button 
                onClick={handleDownload} 
                style={styles.largeDownloadBtn}
              >
                <Download size={20} />
                Download File
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.85)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    backdropFilter: 'blur(4px)'
  },
  modalContainer: {
    width: '90vw',
    height: '90vh',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 24px',
    backgroundColor: '#f8fafc',
    borderBottom: '1px solid #e2e8f0'
  },
  fileInfo: {
    display: 'flex',
    flexDirection: 'column'
  },
  fileName: {
    margin: 0,
    fontSize: '18px',
    fontWeight: '600',
    color: '#2d3748'
  },
  fileMeta: {
    fontSize: '13px',
    color: '#718096',
    marginTop: '4px'
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  downloadBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    backgroundColor: '#667eea',
    color: 'white',
    borderRadius: '6px',
    fontWeight: '500',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#4a5568',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4px',
    borderRadius: '50%',
    transition: 'background-color 0.2s'
  },
  viewerContent: {
    flex: 1,
    backgroundColor: '#edf2f7',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative'
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px'
  },
  image: {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
  },
  iframe: {
    width: '100%',
    height: '100%',
    border: 'none',
    backgroundColor: 'white'
  },
  unsupportedContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
  },
  largeDownloadBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 24px',
    backgroundColor: '#667eea',
    color: 'white',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '16px',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  }
};

export default FileViewer;
