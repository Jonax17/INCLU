import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import AppLayout from '../components/AppLayout.jsx';
import { useAccessibility } from '../contexts/AccessibilityContext.jsx';

const qrDB = {
  'INCLU-AULA-101': 'Aula 101: entrada sin desnivel y asiento reservado al fondo.',
  'INCLU-BANO-2': 'Baño accesible: pasamanos a ambos lados y señalización en braille.',
  'INCLU-BIBLIOTECA': 'Biblioteca: entrada adaptada, ascensor y lectores de pantalla disponibles.',
  'INCLU-LAB-01': 'Laboratorio de Sistemas: computadoras con tecnología de asistencia.',
  'INCLU-ASCENSOR-A': 'Ascensor bloque A: botones en braille y voz activada.',
};

export default function CodigoQr() {
  const navigate = useNavigate();
  const { settings } = useAccessibility();
  const scannerRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [scannedCode, setScannedCode] = useState('');
  const [info, setInfo] = useState('');
  const [error, setError] = useState('');
  const [manual, setManual] = useState('');

  const stopScanner = useCallback(async () => {
    if (scannerRef.current) {
      try { await scannerRef.current.stop(); } catch {}
      scannerRef.current = null;
    }
    setScanning(false);
  }, []);

  const processCode = useCallback((code) => {
    setScannedCode(code);
    const text = qrDB[code] || `Punto de interés: ${code}`;
    setInfo(text);
    stopScanner();
    if (settings.voiceEnabled && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'es-ES';
      u.rate = 0.9;
      window.speechSynthesis.speak(u);
    }
  }, [settings.voiceEnabled, stopScanner]);

  const startScanner = useCallback(async () => {
    setError(''); setInfo(''); setScannedCode('');
    try {
      const scanner = new Html5Qrcode('qr-reader');
      scannerRef.current = scanner;
      await scanner.start({ facingMode: 'environment' }, { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => processCode(decodedText), () => {});
      setScanning(true);
    } catch {
      setError('No se pudo acceder a la cámara para escanear QR.');
      setScanning(false);
    }
  }, [processCode]);

  useEffect(() => () => { stopScanner(); }, [stopScanner]);

  const handleManual = () => { if (manual.trim()) { processCode(manual.trim()); setManual(''); } };

  return (
    <AppLayout>
      <button className="btn btn-o" onClick={() => navigate('/app/orientarme')} style={{ marginBottom: 16, width: 'auto' }}>← Volver</button>
      <h2>Navegación Interior</h2>
      <p>Escanea códigos QR para información accesible.</p>

      {error && <div className="error-banner">{error}</div>}

      {!info ? (
        <div className="card">
          <div id="qr-reader" style={{ width: '100%', minHeight: 250 }} />
          {!scanning && <div className="preview" style={{ minHeight: 100 }}>Cámara de escaneo</div>}

          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
            {!scanning ? (
              <button className="btn btn-p" onClick={startScanner}>Escanear QR</button>
            ) : (
              <button className="btn btn-d" onClick={stopScanner}>Detener escaneo</button>
            )}
          </div>

          <div style={{ marginTop: 16 }}>
            <h4>Código manual</h4>
            <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
              <input type="text" placeholder="INCLU-AULA-101" value={manual}
                onChange={e => setManual(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleManual()} />
              <button className="btn btn-p" onClick={handleManual} disabled={!manual.trim()}>Buscar</button>
            </div>
          </div>
        </div>
      ) : (
        <div className="card">
          <h3>{scannedCode}</h3>
          <p style={{ margin: '8px 0' }}>{info}</p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button className="btn btn-s" onClick={() => {
              window.speechSynthesis?.cancel();
              const u = new SpeechSynthesisUtterance(info);
              u.lang = 'es-ES';
              u.rate = 0.9;
              window.speechSynthesis.speak(u);
            }}>Leer en voz alta</button>
            <button className="btn btn-o" onClick={() => { setInfo(''); setScannedCode(''); }}>Escanear otro</button>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
