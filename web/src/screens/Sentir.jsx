import { useState } from 'react';

const patterns = [
  { id: 'left', name: 'Izquierda', icon: '⬅️', desc: 'Una vibración corta' },
  { id: 'right', name: 'Derecha', icon: '➡️', desc: 'Dos vibraciones cortas' },
  { id: 'danger', name: 'Peligro', icon: '⚠️', desc: 'Tres vibraciones' },
  { id: 'stop', name: 'Detenerse', icon: '⛔', desc: 'Una vibración larga' },
  { id: 'destination', name: 'Destino cercano', icon: '✅', desc: 'Dos vibraciones largas' },
  { id: 'help', name: 'Ayuda', icon: '🆘', desc: 'Patrón de emergencia' }
];

export default function Sentir() {
  const [active, setActive] = useState(null);

  const trigger = (pattern) => {
    setActive(pattern.id);
    setTimeout(() => setActive(null), 1200);
  };

  return (
    <div>
      <h2>📳 Sentir</h2>
      <p className="screen-desc">Señales hápticas para guiarte sin mirar la pantalla.</p>

      <div className="panel">
        <h3>Vibración en vivo</h3>
        <div className={`haptic-preview ${active ? 'vibrating' : ''}`}>
          {active === 'left' ? '⬅️ Izquierda' :
           active === 'right' ? '➡️ Derecha' :
           active === 'danger' ? '⚠️ Peligro' :
           active === 'stop' ? '⛔ Detenerse' :
           active === 'destination' ? '✅ Destino' :
           active === 'help' ? '🆘 Ayuda' :
           'Toca un patrón para sentir la vibración'}
        </div>
      </div>

      <div className="app-grid">
        {patterns.map((p) => (
          <button className="app-card" key={p.id} onClick={() => trigger(p)} style={{ textAlign: 'center' }}>
            <div className="big-icon">{p.icon}</div>
            <h3>{p.name}</h3>
            <p>{p.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
