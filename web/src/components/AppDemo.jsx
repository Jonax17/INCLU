import { useState } from 'react';
import Ver from '../screens/Ver.jsx';
import Escuchar from '../screens/Escuchar.jsx';
import Sentir from '../screens/Sentir.jsx';
import Orientarme from '../screens/Orientarme.jsx';
import Emergencia from '../screens/Emergencia.jsx';
import Accesibilidad from '../screens/Accesibilidad.jsx';

const modules = [
  { id: 'ver', label: 'Ver', icon: '👁️', component: Ver },
  { id: 'escuchar', label: 'Escuchar', icon: '👂', component: Escuchar },
  { id: 'sentir', label: 'Sentir', icon: '📳', component: Sentir },
  { id: 'orientarme', label: 'Orientarme', icon: '🗺️', component: Orientarme },
  { id: 'emergencia', label: 'Emergencia', icon: '🆘', component: Emergencia },
  { id: 'accesibilidad', label: 'Accesibilidad', icon: '⚙️', component: Accesibilidad }
];

export default function AppDemo({ onExit }) {
  const [active, setActive] = useState('ver');
  const ActiveComponent = modules.find((m) => m.id === active).component;

  return (
    <div className="app-shell">
      <div className="app-header">
        <div className="title">
          <img src="/favicon.svg" alt="" style={{ width: 26, height: 26, borderRadius: 6 }} />
          <span>INCLU · Demo</span>
        </div>
        <button className="btn-app-back" onClick={onExit}>← Volver</button>
      </div>

      <div className="app-body">
        <nav className="app-nav">
          <ul>
            {modules.map((m) => (
              <li key={m.id}>
                <button
                  className={active === m.id ? 'active' : ''}
                  onClick={() => setActive(m.id)}
                >
                  <span>{m.icon}</span>
                  {m.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="app-screen">
          <ActiveComponent />
        </div>
      </div>
    </div>
  );
}
