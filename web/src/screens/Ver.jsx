import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout.jsx';

const tools = [
  { path: '/app/ver/lector-texto', icon: '▣', title: 'Lector de texto', desc: 'Lee texto con cámara y voz' },
  { path: '/app/ver/lupa', icon: '⊕', title: 'Lupa inteligente', desc: 'Amplía y mejora la visualización' },
  { path: '/app/ver/escaneador', icon: '▤', title: 'Escáner de documentos', desc: 'Captura y lee documentos' },
];

export default function Ver() {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <h2>Ver</h2>
      <p>Herramientas para personas ciegas y con baja visión.</p>
      <div className="grid">
        {tools.map((t) => (
          <div className="card" key={t.path} onClick={() => navigate(t.path)}>
            <div style={{ fontSize: '1.3rem', color: '#4361ee', marginBottom: 8, fontWeight: 700 }}>{t.icon}</div>
            <h3>{t.title}</h3>
            <p>{t.desc}</p>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}
