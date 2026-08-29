import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout.jsx';

const modules = [
  { path: '/app/ver', icon: '◎', title: 'Ver', desc: 'Lector de texto, lupa y escáner', color: 'var(--accent)' },
  { path: '/app/escuchar', icon: '≋', title: 'Escuchar', desc: 'Transcripción de voz', color: 'var(--success)' },
  { path: '/app/sentir', icon: '⊕', title: 'Sentir', desc: 'Laboratorio háptico', color: 'var(--warning)' },
  { path: '/app/orientarme', icon: '◎', title: 'Orientarme', desc: 'Mapa y ubicación', color: 'var(--accent)' },
  { path: '/app/emergencia', icon: '⚠', title: 'Emergencia', desc: 'Botón SOS', color: 'var(--danger)' },
  { path: '/app/accesibilidad', icon: '⚙', title: 'Ajustes', desc: 'Accesibilidad', color: 'var(--text-muted)' },
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <h2>INCLU</h2>
      <p>Selecciona un módulo para comenzar.</p>

      <div className="grid">
        {modules.map((m, i) => (
          <div
            className="card"
            key={i}
            onClick={() => navigate(m.path)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && navigate(m.path)}
            aria-label={`${m.title}: ${m.desc}`}
          >
            <div style={{ fontSize: '1.5rem', color: m.color, marginBottom: 12, fontWeight: 700 }} aria-hidden="true">
              {m.icon}
            </div>
            <h3>{m.title}</h3>
            <p>{m.desc}</p>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}
