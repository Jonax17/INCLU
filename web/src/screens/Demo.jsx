import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout.jsx';

const demos = [
  { path: '/app/ver/lector-texto', title: 'Demo 1', desc: 'Cámara → texto → voz', color: '#4361ee' },
  { path: '/app/sentir', title: 'Demo 2', desc: 'Evento → alerta → vibración', color: '#10b981' },
  { path: '/app/orientarme', title: 'Demo 3', desc: 'QR/NFC → información accesible', color: '#8b5cf6' },
  { path: '/app/sentir', title: 'Demo 4', desc: 'Botón → patrón háptico', color: '#f59e0b' },
  { path: '/app/dispositivos', title: 'Demo 5', desc: 'Bluetooth → dispositivo externo', color: '#ef4444' },
];

export default function Demo() {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <h2>INCLU Demo</h2>
      <p>Presentación rápida de funciones.</p>
      <div className="grid">
        {demos.map((d, i) => (
          <div className="card" key={i} onClick={() => navigate(d.path)} style={{ cursor: 'pointer', borderLeft: `3px solid ${d.color}` }}>
            <h3>{d.title}</h3>
            <p>{d.desc}</p>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}
