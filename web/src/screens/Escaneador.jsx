import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { createWorker } from 'tesseract.js';
import AppLayout from '../components/AppLayout.jsx';
import { useAccessibility } from '../contexts/AccessibilityContext.jsx';

export default function Escaneador() {
  const navigate = useNavigate();
  const { settings } = useAccessibility();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [recognized, setRecognized] = useState('');
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState('');

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } } });
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
  };

  const captureDocument = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return;
    setScanning(true);
    setProgress('Capturando documento...');
    setError('');

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);

    try {
      setProgress('Cargando motor OCR...');
      const worker = await createWorker('spa+eng', 1, {
        logger: (m) => {
          if (m.status === 'recognizing text') setProgress(`Analizando: ${Math.round(m.progress * 100)}%`);
        }
      });

      setProgress('Analizando documento...');
      const { data: { text } } = await worker.recognize(canvas.toDataURL('image/png'));
      await worker.terminate();

      const cleanText = text.trim();
      if (cleanText) {
        setRecognized(cleanText);
        setProgress('');
        if (settings.voiceEnabled && 'speechSynthesis' in window) {
          const u = new SpeechSynthesisUtterance(cleanText);
          u.lang = 'es-ES';
          u.rate = 0.9;
          window.speechSynthesis.speak(u);
        }
      } else {
        setRecognized('');
        setError('No se detectó texto en el documento.');
        setProgress('');
      }
    } catch {
      setError('Error al procesar el documento.');
      setProgress('');
    } finally {
      setScanning(false);
    }
  }, [settings.voiceEnabled]);

  return (
    <AppLayout>
      <button className="btn btn-o" onClick={() => navigate('/app/ver')} style={{ marginBottom: 16, width: 'auto' }}>← Volver</button>
      <h2>Escáner de documentos</h2>
      <p>Captura un documento y reconoce su texto con OCR real.</p>

      {error && <div className="error-banner">{error}</div>}

      <div className="card">
        <video ref={videoRef} style={{ width: '100%', height: 240, background: '#000', display: cameraActive ? 'block' : 'none', borderRadius: 8 }} playsInline muted />
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        {!cameraActive && <div className="preview" style={{ minHeight: 240 }}>Cámara inactiva</div>}

        {scanning && (
          <div style={{ marginTop: 10 }}>
            <div className="progress"><div className="progress-bar" style={{ width: '100%' }} /></div>
            <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#4361ee', fontWeight: 600 }}>{progress}</p>
          </div>
        )}

        <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
          {!cameraActive ? (
            <button className="btn btn-p" onClick={startCamera}>Activar cámara</button>
          ) : (
            <>
              <button className="btn btn-p" onClick={captureDocument} disabled={scanning}>
                {scanning ? 'Escaneando...' : 'Capturar documento'}
              </button>
              <button className="btn btn-o" onClick={stopCamera}>Detener</button>
            </>
          )}
        </div>
      </div>

      {recognized && (
        <div className="card">
          <h3>Documento capturado</h3>
          <div className="speech-text">{recognized}</div>
          <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
            <button className="btn btn-s" onClick={() => {
              window.speechSynthesis?.cancel();
              const u = new SpeechSynthesisUtterance(recognized);
              u.lang = 'es-ES';
              u.rate = 0.9;
              window.speechSynthesis.speak(u);
            }}>Leer con voz</button>
            <button className="btn btn-o" onClick={() => window.speechSynthesis?.cancel()}>Detener voz</button>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
