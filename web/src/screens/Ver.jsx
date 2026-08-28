import { useState } from 'react';

const sampleText = 'INCLU reconoce el texto de su entorno: "Bienvenidos al Laboratorio de Sistemas, segundo piso."';

export default function Ver() {
  const [recognized, setRecognized] = useState('');
  const [scanning, setScanning] = useState(false);

  const scan = () => {
    setScanning(true);
    setRecognized('');
    setTimeout(() => {
      setRecognized(sampleText);
      setScanning(false);
    }, 1500);
  };

  return (
    <div>
      <h2>👁️ Ver</h2>
      <p className="screen-desc">Reconocimiento de texto del entorno con la cámara.</p>

      <div className="panel">
        <h3>📷 Leer texto de la cámara</h3>
        <p className="description">Apunta con la cámara a un texto escrito. INCLU lo reconoce y lo lee en voz alta.</p>
        <div className="haptic-preview" style={{ minHeight: 120 }}>
          {scanning ? 'Analizando imagen...' : 'Área de captura de cámara'}
        </div>
        <button className="btn-demo" onClick={scan} disabled={scanning}>
          {scanning ? '⏳ Analizando...' : '📷 Escanear texto'}
        </button>
      </div>

      <div className="panel">
        <h3>🔍 Lupa digital</h3>
        <p className="description">Amplía el texto para personas con baja visión.</p>
        <div className="haptic-preview" style={{ minHeight: 80 }}>
          👁️ Zoom activado
        </div>
        <button className="btn-demo outline">🔍 Activar lupa</button>
      </div>

      {recognized && (
        <div className="panel">
          <h3>📄 Texto reconocido</h3>
          <div className="speech-text">{recognized}</div>
          <button className="btn-demo success">🔊 Leer en voz alta</button>
        </div>
      )}
    </div>
  );
}
