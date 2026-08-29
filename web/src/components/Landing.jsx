import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  const features = [
    { title: 'Ver', desc: 'Lector de texto, lupa y escáner de documentos con cámara' },
    { title: 'Escuchar', desc: 'Transcripción de voz en tiempo real' },
    { title: 'Sentir', desc: 'Laboratorio háptico con 6 patrones de vibración' },
    { title: 'Orientarme', desc: 'Mapa de lugares accesibles con geolocalización' },
    { title: 'QR / NFC', desc: 'Navegación interior escaneando códigos' },
    { title: 'Emergencia', desc: 'Botón SOS con ubicación y envío de SMS' },
    { title: 'Accesibilidad', desc: 'Texto grande, alto contraste, modo oscuro, voz' },
    { title: 'Dispositivos', desc: 'Conexión Bluetooth con pulsera, bastón y guante INCLU' },
  ];

  return (
    <div className="landing">
      <h1>INCLU</h1>
      <p className="sub">Plataforma de accesibilidad para personas con discapacidad. Tecnología que incluye.</p>

      <h2>Módulos</h2>
      {features.map((f) => (
        <div className="feat" key={f.title}>
          <strong>{f.title}</strong>
          <span>{f.desc}</span>
        </div>
      ))}

      <button className="btn-app" onClick={() => navigate('/app')}>
        Abrir la App
      </button>

      <footer>INCLU © 2026 — Plataforma de inclusión y accesibilidad.</footer>
    </div>
  );
}
