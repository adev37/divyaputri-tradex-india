import { useState, useRef } from 'react';
import { FiCamera, FiUploadCloud, FiX } from 'react-icons/fi'; // ✅ FiX import kiya
import './AIVisionRecommendation.css';

export default function AIVisionRecommendation() {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState('');
  const fileRef = useRef(null);

  const handleUpload = async () => {
    if (!image) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('image', image);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${API_URL}/api/ai/recommend-product`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) setRecommendation(data.recommendation);
    } catch (err) {
      alert('Failed to analyze image');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Reset function
  const handleReset = () => {
    setImage(null);
    setRecommendation('');
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div className="ai-vision-scanner">
      <div className="ai-vision-scanner__header">
        <h2>📸 AI Product Scanner</h2>
        <p>Upload a photo of your machine to get the best product recommendation.</p>
      </div>

      <div className="ai-vision-scanner__upload-area">
        <input 
          type="file" 
          hidden 
          ref={fileRef} 
          onChange={(e) => setImage(e.target.files[0])} 
          accept="image/*" 
        />
        
        {!image ? (
          <button className="btn btn-outline" onClick={() => fileRef.current.click()}>
            <FiUploadCloud /> Select Image
          </button>
        ) : (
          <div className="ai-vision-scanner__preview">
            <img src={URL.createObjectURL(image)} alt="upload preview" />
            
            {!recommendation ? (
              <button className="btn btn-primary ai-vision-scanner__scan-btn" onClick={handleUpload} disabled={loading}>
                <FiCamera /> {loading ? 'Scanning...' : 'Scan with AI'}
              </button>
            ) : (
              <button className="btn btn-outline ai-vision-scanner__scan-btn" onClick={handleReset}>
                <FiX /> Close Result
              </button>
            )}
          </div>
        )}
      </div>

      {recommendation && (
        <div className="ai-vision-scanner__result">
          <div className="ai-vision-scanner__result-header">
            <strong>AI Recommendation:</strong>
            <button className="ai-vision-scanner__close-icon" onClick={handleReset} aria-label="Close">
              <FiX />
            </button>
          </div>
          <p>{recommendation.replace(/\*\*/g, '')}</p>
        </div>
      )}
    </div>
  );
}