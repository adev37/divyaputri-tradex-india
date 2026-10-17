import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUploadCloud, FiFileText, FiX, FiCpu, FiCheckCircle } from 'react-icons/fi';
import './AIDocumentReader.css';
import ReactMarkdown from 'react-markdown';

export default function AIDocumentReader() {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    validateAndSetFile(selectedFile);
  };

  const validateAndSetFile = (file) => {
    setError('');
    setResult(null);
    
    if (!file) return;

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      setError('Only PDF, JPG, and PNG files are allowed.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB.');
      return;
    }

    setFile(file);
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('document', file);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${API_URL}/api/ai/analyze-document`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Analysis failed');

      setResult(data.analysis);
    } catch (err) {
      console.error(err);
      setError('AI could not read this file. Please try a smaller or clearer PDF/Image.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setResult(null);
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="ai-doc-reader">
      <div className="ai-doc-reader__header">
        <span className="ai-doc-reader__badge">
          <FiCpu /> AI Document Reader
        </span>
        <h3>Upload a document for instant AI analysis.</h3>
        <p>Supported formats: PDF, JPG, PNG (Max 5MB)</p>
      </div>

      {!result && (
        <div 
          className={`ai-dropzone ${isDragging ? 'is-dragging' : ''} ${file ? 'has-file' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !file && fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept=".pdf,.jpg,.jpeg,.png"
            style={{ display: 'none' }}
          />

          {!file ? (
            <>
              <FiUploadCloud className="ai-dropzone__icon" />
              <p className="ai-dropzone__text">
                <strong>Click to upload</strong> or drag and drop
              </p>
            </>
          ) : (
            <div className="ai-dropzone__file">
              <FiFileText className="ai-dropzone__file-icon" />
              <div className="ai-dropzone__file-info">
                <span className="ai-dropzone__file-name">{file.name}</span>
                <span className="ai-dropzone__file-size">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
              <button className="ai-dropzone__remove" onClick={(e) => { e.stopPropagation(); reset(); }}>
                <FiX />
              </button>
            </div>
          )}
        </div>
      )}

      {error && <div className="ai-doc-reader__error">{error}</div>}

      {file && !result && (
        <button 
          className="btn btn-primary ai-doc-reader__btn" 
          onClick={handleUpload}
          disabled={loading}
        >
          {loading ? 'Analyzing...' : 'Analyze Document'}
        </button>
      )}

<AnimatePresence>
  {result && (
    <motion.div 
      className="ai-doc-reader__result"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Top Header with Close Icon */}
      <div className="ai-doc-reader__result-header">
        <div className="ai-doc-reader__result-title">
          <FiCheckCircle /> Analysis Complete
        </div>
        <button 
          className="ai-doc-reader__close-icon" 
          onClick={reset} 
          aria-label="Close"
        >
          <FiX size={20} />
        </button>
      </div>
      
      {/* Content */}
      <div className="ai-doc-reader__result-content">
        <ReactMarkdown>{result}</ReactMarkdown>
      </div>
      
      {/* Bottom Action Buttons */}
      <div className="ai-doc-reader__actions">
        <button className="btn btn-outline ai-doc-reader__reset-btn" onClick={reset}>
          Close
        </button>
        <button className="btn btn-primary ai-doc-reader__upload-btn" onClick={reset}>
          <FiUploadCloud /> Upload New
        </button>
      </div>
    </motion.div>
  )}
</AnimatePresence>
    </div>
  );
}