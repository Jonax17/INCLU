import { useState } from 'react';

const options = [
  { id: 'big-text', label: 'Texto grande', sub: 'Aumenta el tamaño de las letras' },
  { id: 'contrast', label: 'Alto contraste', sub: 'Mayor legibilidad' },
  { id: 'invert', label: 'Colores invertidos', sub: 'Modo de visión alternativa' },
  { id: 'haptic', label: 'Vibración fuerte', sub: 'Mayor intensidad háptica' },
  { id: 'voice', label: 'Voz activa', sub: 'Lee los textos en voz alta' }
];

export default function Accesibilidad() {
  const [state, setState] = useState({ 'big-text': false, contrast: false, invert: false, haptic: false, voice: true });
  const [profile, setProfile] = useState('General');

  const toggle = (id) => setState((s) => ({ ...s, [id]: !s[id] }));

  const profiles = ['General', 'Visual', 'Baja Visión', 'Sorda', 'Sordociega', 'Movilidad'];

  return (
    <div>
      <h2>⚙️ Accesibilidad</h2>
      <p className="screen-desc">Configura la aplicación según tus necesidades.</p>

      <div className="panel">
        <h3>👤 Perfil de accesibilidad</h3>
        <div className="badge-list">
          {profiles.map((p) => (
            <button
              className="chip"
              key={p}
              onClick={() => setProfile(p)}
              style={{
                cursor: 'pointer',
                background: profile === p ? '#1A237E' : '#C5CAE9',
                color: profile === p ? '#fff' : '#1A237E'
              }}
            >
              {p}
            </button>
          ))}
        </div>
        <p className="description" style={{ marginTop: 12 }}>Perfil seleccionado: <strong>{profile}</strong></p>
      </div>

      <div className="panel">
        <h3>🌗 Preferencias visuales y hápticas</h3>
        {options.map((o) => (
          <div className="toggle-row" key={o.id}>
            <div>
              <div className="toggle-label">{o.label}</div>
              <div className="toggle-sub">{o.sub}</div>
            </div>
            <button
              className={`toggle ${state[o.id] ? 'on' : ''}`}
              onClick={() => toggle(o.id)}
              aria-label={o.label}
            >
              <span className="knob" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
