import { useState, useRef } from 'react';
import { FiCamera, FiUploadCloud } from 'react-icons/fi';

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

  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '10px', marginTop: '40px', background: '#fff' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '10px' }}>📸 AI Product Scanner</h2>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '20px' }}>Upload a photo of your machine to get the best product recommendation.</p>
      
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
        <input type="file" hidden ref={fileRef} onChange={(e) => setImage(e.target.files[0])} accept="image/*" />
        
        {!image ? (
          <button className="btn btn-outline" onClick={() => fileRef.current.click()}>
            <FiUploadCloud /> Select Image
          </button>
        ) : (
          <>
            <img src={URL.createObjectURL(image)} alt="upload" style={{ height: '150px', objectFit: 'cover', borderRadius: '8px' }} />
            <button className="btn btn-primary" onClick={handleUpload} disabled={loading}>
              <FiCamera /> {loading ? 'Scanning...' : 'Scan with AI'}
            </button>
          </>
        )}
      </div>

      {recommendation && (
        <div style={{ marginTop: '20px', padding: '15px', background: '#f0f7ff', borderRadius: '8px' }}>
          <strong>AI Recommendation:</strong>
          <p style={{ marginTop: '8px' }}>
  {recommendation.replace(/\*\*/g, '')} 
</p>
        </div>
      )}
    </div>
  );
}