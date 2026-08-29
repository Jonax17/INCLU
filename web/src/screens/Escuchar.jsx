import { useState, useRef, useCallback } from 'react';
import AppLayout from '../components/AppLayout.jsx';

export default function Escuchar() {
  const [listening, setListening] = useState(false);
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [language, setLanguage] = useState('es-ES');
  const recognitionRef = useRef(null);

  const startListening = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError('Reconocimiento de voz no disponible en este navegador.');
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = language;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.onstart = () => { setListening(true); setError(''); };
    recognition.onresult = (event) => {
      let final = '', interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) final += t; else interim += t;
      }
      if (final) setText(p => p ? p + ' ' + final : final);
      else if (interim) setText(p => p ? p + ' ' + interim : interim);
    };
    recognition.onerror = (e) => {
      setListening(false);
      if (e.error === 'not-allowed') setError('Permiso de micrófono denegado.');
      else if (e.error === 'no-speech') setError('No se detectó voz.');
      else setError(`Error: ${e.error}`);
    };
    recognition.onend = () => setListening(false);
    recognition.start();
  }, [language]);

  const stopListening = () => { recognitionRef.current?.stop(); setListening(false); };

  const speakText = () => {
    if (text && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = language;
      window.speechSynthesis.speak(u);
    }
  };

  return (
    <AppLayout>
      <h2>Escuchar</h2>
      <p>Convierte voz en texto en tiempo real.</p>

      {error && <div className="error-banner">{error}</div>}

      <div className="card">
        <h4>Idioma</h4>
        <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
          {[{ code: 'es-ES', label: 'Español' }, { code: 'en-US', label: 'English' }].map(l => (
            <button key={l.code} className={`chip ${language === l.code ? 'active' : ''}`} onClick={() => setLanguage(l.code)}>{l.label}</button>
          ))}
        </div>
      </div>

      <div className="card">
        <h3>Texto reconocido</h3>
        {listening && (
          <div className="status-pill" style={{ marginBottom: 10 }}>
            <span className="status-dot" /> Escuchando
          </div>
        )}
        <div className="speech-text">{text || 'Presiona "Escuchar" y habla para convertir tu voz en texto.'}</div>
        <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
          {!listening ? (
            <button className="btn btn-p" onClick={startListening}>Escuchar</button>
          ) : (
            <button className="btn btn-d" onClick={stopListening}>Detener</button>
          )}
          <button className="btn btn-s" onClick={speakText} disabled={!text}>Repetir con voz</button>
          <button className="btn btn-o" onClick={() => window.speechSynthesis?.cancel()}>Detener voz</button>
          <button className="btn btn-o" onClick={() => { setText(''); setError(''); }}>Limpiar</button>
        </div>
      </div>
    </AppLayout>
  );
}
