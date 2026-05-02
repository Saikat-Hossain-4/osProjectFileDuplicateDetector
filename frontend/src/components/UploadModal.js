import React, { useState, useRef } from 'react';
import { X, UploadCloud, File, AlertCircle, CheckCircle } from 'lucide-react';
import { fileAPI } from '../services/api';

const UploadModal = ({ onClose, onUploadSuccess }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [status, setStatus] = useState('idle'); // idle, uploading, success, error
  const [message, setMessage] = useState('');
  
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateFile = (file) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    if (!validTypes.includes(file.type)) {
      setStatus('error');
      setMessage('Invalid file type. Only JPG, PNG, PDF, and Word docs allowed.');
      return false;
    }
    
    if (file.size > 10 * 1024 * 1024) {
      setStatus('error');
      setMessage('File exceeds 10MB limit.');
      return false;
    }
    
    return true;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
        setStatus('idle');
      }
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
        setStatus('idle');
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);

    setStatus('uploading');
    setUploadProgress(0);

    try {
      await fileAPI.uploadFile(formData, (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(percentCompleted);
      });

      setStatus('success');
      setMessage('File uploaded successfully!');
      
      setTimeout(() => {
        onUploadSuccess();
      }, 1500);
    } catch (error) {
      console.error('Upload error:', error);
      setStatus('error');
      setMessage(error.response?.data?.message || 'Failed to upload file');
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2 style={styles.title}>Upload File</h2>
          <button style={styles.closeBtn} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div style={styles.content}>
          {!selectedFile || status === 'error' ? (
            <div 
              style={{
                ...styles.dropZone,
                ...(dragActive ? styles.dropZoneActive : {})
              }}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <UploadCloud size={48} color={dragActive ? '#667eea' : '#a0aec0'} style={{ marginBottom: '16px' }} />
              <p style={styles.dropText}>Drag and drop your file here, or</p>
              <button 
                style={styles.browseBtn} 
                onClick={() => inputRef.current.click()}
              >
                Browse Files
              </button>
              <input 
                type="file" 
                ref={inputRef}
                style={{ display: 'none' }}
                onChange={handleChange}
                accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
              />
              <p style={styles.supportText}>Supports JPG, PNG, PDF, Word (Max 10MB)</p>
            </div>
          ) : (
            <div style={styles.filePreview}>
              <div style={styles.fileIcon}>
                <File size={32} color="#667eea" />
              </div>
              <div style={styles.fileDetails}>
                <p style={styles.fileName}>{selectedFile.name}</p>
                <p style={styles.fileSize}>{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
              </div>
              {status === 'idle' && (
                <button style={styles.removeBtn} onClick={() => setSelectedFile(null)}>
                  <X size={16} />
                </button>
              )}
            </div>
          )}

          {status === 'error' && (
            <div style={styles.errorMessage}>
              <AlertCircle size={16} />
              <span>{message}</span>
            </div>
          )}

          {status === 'success' && (
            <div style={styles.successMessage}>
              <CheckCircle size={16} />
              <span>{message}</span>
            </div>
          )}

          {status === 'uploading' && (
            <div style={styles.progressContainer}>
              <div style={styles.progressHeader}>
                <span style={styles.progressText}>Uploading...</span>
                <span style={styles.progressPercent}>{uploadProgress}%</span>
              </div>
              <div style={styles.progressBar}>
                <div style={{...styles.progressFill, width: `${uploadProgress}%`}}></div>
              </div>
            </div>
          )}
        </div>

        <div style={styles.footer}>
          <button style={styles.cancelBtn} onClick={onClose} disabled={status === 'uploading'}>
            Cancel
          </button>
          <button 
            style={{...styles.uploadConfirmBtn, opacity: (!selectedFile || status === 'uploading') ? 0.5 : 1}} 
            onClick={handleUpload}
            disabled={!selectedFile || status === 'uploading' || status === 'success'}
          >
            {status === 'uploading' ? 'Uploading...' : 'Upload'}
          </button>
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
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(2px)'
  },
  modal: {
    width: '500px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    overflow: 'hidden'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 24px',
    borderBottom: '1px solid #e2e8f0'
  },
  title: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#2d3748',
    margin: 0
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#a0aec0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4px',
    borderRadius: '4px'
  },
  content: {
    padding: '24px'
  },
  dropZone: {
    border: '2px dashed #cbd5e0',
    borderRadius: '8px',
    padding: '40px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f7fafc',
    transition: 'all 0.2s ease'
  },
  dropZoneActive: {
    borderColor: '#667eea',
    backgroundColor: 'rgba(102, 126, 234, 0.05)'
  },
  dropText: {
    color: '#4a5568',
    marginBottom: '12px',
    fontSize: '15px'
  },
  browseBtn: {
    backgroundColor: 'white',
    border: '1px solid #e2e8f0',
    padding: '8px 16px',
    borderRadius: '6px',
    fontWeight: '500',
    color: '#4a5568',
    cursor: 'pointer',
    marginBottom: '16px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
  },
  supportText: {
    fontSize: '12px',
    color: '#a0aec0'
  },
  filePreview: {
    display: 'flex',
    alignItems: 'center',
    padding: '16px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    backgroundColor: '#f7fafc'
  },
  fileIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '8px',
    backgroundColor: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '16px',
    border: '1px solid #edf2f7'
  },
  fileDetails: {
    flex: 1,
    overflow: 'hidden'
  },
  fileName: {
    fontWeight: '500',
    color: '#2d3748',
    marginBottom: '4px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  fileSize: {
    fontSize: '13px',
    color: '#718096'
  },
  removeBtn: {
    background: 'none',
    border: 'none',
    color: '#e53e3e',
    cursor: 'pointer',
    padding: '8px'
  },
  progressContainer: {
    marginTop: '20px'
  },
  progressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
    fontSize: '14px',
    color: '#4a5568',
    fontWeight: '500'
  },
  progressBar: {
    height: '8px',
    backgroundColor: '#edf2f7',
    borderRadius: '4px',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#667eea',
    transition: 'width 0.2s ease',
    backgroundImage: 'linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent)'
  },
  errorMessage: {
    marginTop: '16px',
    padding: '12px',
    backgroundColor: '#fff5f5',
    color: '#c53030',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px'
  },
  successMessage: {
    marginTop: '16px',
    padding: '12px',
    backgroundColor: '#f0fff4',
    color: '#2f855a',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px'
  },
  footer: {
    padding: '16px 24px',
    borderTop: '1px solid #e2e8f0',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    backgroundColor: '#f8fafc'
  },
  cancelBtn: {
    padding: '8px 16px',
    backgroundColor: 'transparent',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    fontWeight: '500',
    color: '#4a5568',
    cursor: 'pointer'
  },
  uploadConfirmBtn: {
    padding: '8px 16px',
    backgroundColor: '#667eea',
    border: 'none',
    borderRadius: '6px',
    fontWeight: '500',
    color: 'white',
    cursor: 'pointer'
  }
};

export default UploadModal;
