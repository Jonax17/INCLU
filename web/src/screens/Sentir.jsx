import { useState } from 'react';
import AppLayout from '../components/AppLayout.jsx';
import { useAccessibility } from '../contexts/AccessibilityContext.jsx';

const basePatterns = [
  { id: 'left', name: 'Izquierda', desc: 'Una vibración corta', base: [100, 50], color: '#4361ee' },
  { id: 'right', name: 'Derecha', desc: 'Dos vibraciones cortas', base: [100, 50, 100, 50], color: '#10b981' },
  { id: 'danger', name: 'Peligro', desc: 'Tres vibraciones', base: [100, 50, 100, 50, 100, 50], color: '#ef4444' },
  { id: 'stop', name: 'Detener', desc: 'Vibración larga', base: [500, 100], color: '#6b7280' },
  { id: 'destination', name: 'Destino', desc: 'Dos vibraciones largas', base: [500, 100, 500, 100], color: '#8b5cf6' },
  { id: 'help', name: 'Ayuda', desc: 'Patrón de emergencia', base: [100, 50, 100, 50, 100, 50, 100, 50, 100, 50], color: '#f59e0b' },
];

export default function Sentir() {
  const { settings } = useAccessibility();
  const [active, setActive] = useState(null);
  const [vibrating, setVibrating] = useState(false);

  const triggerPattern = (pattern) => {
    setActive(pattern.id);
    setVibrating(true);

    const intensity = settings.hapticIntensity;
    const duration = settings.hapticDuration;
    const scaled = pattern.base.map((v, i) => i % 2 === 0 ? Math.round(v * intensity) : Math.min(duration, v));

    if ('vibrate' in navigator) navigator.vibrate(scaled);

    setTimeout(() => { setActive(null); setVibrating(false); }, 1200);
  };

  return (
    <AppLayout>
      <h2>Sentir</h2>
      <p>Laboratorio háptico: un lenguaje de vibraciones con significado.</p>

      <div className={`preview ${vibrating ? 'vibrating' : ''}`} style={{ minHeight: 60, marginBottom: 14 }}>
        {active ? basePatterns.find(p => p.id === active)?.name : 'Toca un patrón para vibrar'}
      </div>

      <div className="grid">
        {basePatterns.map((p) => (
          <div
            key={p.id}
            className="card"
            style={{ cursor: 'pointer', opacity: vibrating && active !== p.id ? 0.5 : 1, borderLeft: `3px solid ${p.color}` }}
            onClick={() => triggerPattern(p)}
          >
            <h3>{p.name}</h3>
            <p>{p.desc}</p>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}
