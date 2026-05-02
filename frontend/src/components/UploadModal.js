import React, { useState, useRef } from 'react';
import { X, UploadCloud, File, AlertCircle, CheckCircle } from 'lucide-react';
import { fileAPI } from '../services/api';
import './UploadModal.css';

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
    <div className="modal-overlay">
      <div className="modal-content">
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '16px'}}>
          <h2>Upload File</h2>
          <button style={{background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255, 255, 255, 0.7)', fontSize: '24px'}} onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div>
          {!selectedFile || status === 'error' ? (
            <div 
              className={`drag-drop-area ${dragActive ? 'drag-active' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="upload-icon">
                <UploadCloud size={48} />
              </div>
              <p>Drag and drop your file here, or</p>
              <button 
                className="browse-btn" 
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
              <p style={{fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)', marginTop: '16px'}}>Supports JPG, PNG, PDF, Word (Max 10MB)</p>
            </div>
          ) : (
            <div style={{display: 'flex', alignItems: 'center', padding: '16px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.1)', marginBottom: '20px'}}>
              <div style={{width: '48px', height: '48px', borderRadius: '8px', background: 'rgba(102, 126, 234, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '16px', border: '1px solid rgba(102, 126, 234, 0.2)'}}>
                <File size={32} color="#667eea" />
              </div>
              <div style={{flex: 1, overflow: 'hidden'}}>
                <p style={{fontWeight: '500', color: 'white', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{selectedFile.name}</p>
                <p style={{fontSize: '13px', color: 'rgba(255, 255, 255, 0.5)'}}>{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
              </div>
              {status === 'idle' && (
                <button style={{background: 'none', border: 'none', color: '#f5576c', cursor: 'pointer', padding: '8px'}} onClick={() => setSelectedFile(null)}>
                  <X size={16} />
                </button>
              )}
            </div>
          )}

          {status === 'error' && (
            <div className="message error">
              <AlertCircle size={16} />
              <span>{message}</span>
            </div>
          )}

          {status === 'success' && (
            <div className="message success">
              <CheckCircle size={16} />
              <span>{message}</span>
            </div>
          )}

          {status === 'uploading' && (
            <div style={{marginTop: '20px'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: 'rgba(255, 255, 255, 0.8)'}}>
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="progress-bar-container">
                <div className="progress-bar" style={{width: `${uploadProgress}%`}}></div>
              </div>
            </div>
          )}
        </div>

        <div className="modal-buttons">
          <button onClick={onClose} disabled={status === 'uploading'}>
            Cancel
          </button>
          <button 
            onClick={handleUpload}
            disabled={!selectedFile || status === 'uploading' || status === 'success'}
            style={{opacity: (!selectedFile || status === 'uploading') ? 0.5 : 1}}
          >
            {status === 'uploading' ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
