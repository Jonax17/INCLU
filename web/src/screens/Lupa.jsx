import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout.jsx';

export default function Lupa() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [error, setError] = useState('');

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setCameraActive(true);
        setError('');
      }
    } catch {
      setError('No se pudo acceder a la cámara.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(t => t.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
    setZoom(1);
  };

  return (
    <AppLayout>
      <button className="btn btn-o" onClick={() => navigate('/app/ver')} style={{ marginBottom: 16, width: 'auto' }}>← Volver</button>
      <h2>Lupa inteligente</h2>
      <p>Amplía y mejora la visualización en tiempo real.</p>

      {error && <div className="error-banner">{error}</div>}

      <div className="card">
        <video ref={videoRef} style={{ width: '100%', height: 260, background: '#000', display: cameraActive ? 'block' : 'none', borderRadius: 8, transition: 'transform 0.2s' }} playsInline muted />
        {!cameraActive && <div className="preview" style={{ minHeight: 260 }}>Lupa inactiva</div>}

        {cameraActive && (
          <div className="range-group">
            <label>Acercamiento: {Math.round(zoom * 100)}%</label>
            <input type="range" min="1" max="5" step="0.1" value={zoom}
              onChange={(e) => {
                const z = parseFloat(e.target.value);
                setZoom(z);
                if (videoRef.current) videoRef.current.style.transform = `scale(${z})`;
              }} />
          </div>
        )}

        <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
          {!cameraActive ? (
            <button className="btn btn-p" onClick={startCamera}>Activar lupa</button>
          ) : (
            <button className="btn btn-d" onClick={stopCamera}>Detener</button>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
