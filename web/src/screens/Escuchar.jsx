import { useState } from 'react';

export default function Escuchar() {
  const [listening, setListening] = useState(false);
  const [text, setText] = useState('');
  const [log, setLog] = useState([]);

  const start = () => {
    setListening(true);
    setText('Escuchando...');
    setTimeout(() => {
      setListening(false);
      const t = 'Hola, ¿me escuchas? INCLU está transcribiendo tu voz.';
      setText(t);
      setLog((l) => [{ time: new Date().toLocaleTimeString(), text: t }, ...l]);
    }, 2500);
  };

  const stop = () => {
    setListening(false);
    setText('');
  };

  return (
    <div>
      <h2>👂 Escuchar</h2>
      <p className="screen-desc">Transcripción de voz en tiempo real.</p>

      <div className="panel">
        <h3>🎤 Transcripción de voz</h3>
        <div
          className="status-pill listening"
          style={{ opacity: listening ? 1 : 0, marginBottom: 12 }}
        >
          ● Escuchando
        </div>
        <div className="speech-text">{text || 'Pulsa iniciar para empezar a escuchar.'}</div>
        <button className="btn-demo" onClick={start} disabled={listening}>
          🎤 Iniciar escucha
        </button>
        <button className="btn-demo danger" onClick={stop} style={{ marginTop: 8 }}>
          ⏹ Detener
        </button>
      </div>

      {log.length > 0 && (
        <div className="panel">
          <h3>📜 Historial</h3>
          <div className="phone-mock">
            {log.map((entry, i) => (
              <div className="row" key={i}>
                <span>{entry.text}</span>
                <span style={{ color: '#757575' }}>{entry.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
