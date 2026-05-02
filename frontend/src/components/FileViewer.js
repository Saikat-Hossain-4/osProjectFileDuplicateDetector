import React from 'react';
import { X, Download, FileText } from 'lucide-react';
import './FileViewer.css';

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
    left: '280px',
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(7, 9, 20, 0.99) 0%, rgba(17, 19, 46, 0.99) 50%, rgba(9, 11, 26, 0.99) 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5000,
    backdropFilter: 'blur(24px)',
    overflow: 'hidden',
    padding: '24px'
  },
  modalContainer: {
    width: 'min(100%, 1600px)',
    height: '100%',
    background: 'rgba(15, 12, 41, 0.96)',
    borderRadius: '20px',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    border: '1px solid rgba(255, 255, 255, 0.14)',
    boxShadow: '0 25px 70px rgba(0, 0, 0, 0.8)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '18px 28px',
    background: 'rgba(255, 255, 255, 0.06)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
  },
  fileInfo: {
    display: 'flex',
    flexDirection: 'column'
  },
  fileName: {
    margin: 0,
    fontSize: '18px',
    fontWeight: '600',
    color: '#ffffff'
  },
  fileMeta: {
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.7)',
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
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    borderRadius: '10px',
    fontWeight: '500',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 0 20px rgba(102, 126, 234, 0.25)'
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'rgba(255, 255, 255, 0.75)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4px',
    borderRadius: '50%',
    transition: 'all 0.3s ease'
  },
  viewerContent: {
    flex: 1,
    background: 'rgba(255, 255, 255, 0.03)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
    padding: '24px'
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0
  },
  image: {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain',
    borderRadius: '12px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.35)'
  },
  iframe: {
    width: '100%',
    height: '100%',
    border: 'none',
    backgroundColor: 'white',
    borderRadius: '12px'
  },
  unsupportedContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
    background: 'rgba(255, 255, 255, 0.08)',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.35)',
    maxWidth: '500px'
  },
  largeDownloadBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontWeight: '600',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 0 20px rgba(102, 126, 234, 0.25)'
  }
};

export default FileViewer;
