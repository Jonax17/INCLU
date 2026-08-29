import { useState } from 'react';

const places = [
  { id: '1', name: 'Laboratorio de Sistemas', icon: '🏫', type: 'Institución', desc: 'Sala de computación, segundo piso' },
  { id: '2', name: 'Biblioteca Central', icon: '📚', type: 'Institución', desc: 'Biblioteca principal' },
  { id: '3', name: 'Rampa de Acceso Principal', icon: '♿', type: 'Rampa', desc: 'Entrada principal del edificio' },
  { id: '4', name: 'Baño Accesible', icon: '🚻', type: 'Baño', desc: 'Ala este, piso 1' },
  { id: '5', name: 'Ascensor Central', icon: '🛗', type: 'Ascensor', desc: 'Hall central' }
];

export default function Orientarme() {
  const [locating, setLocating] = useState(false);
  const [location, setLocation] = useState(null);

  const locate = () => {
    setLocating(true);
    setTimeout(() => {
      setLocating(false);
      setLocation({ lat: -34.6037, lon: -58.3816 });
    }, 1500);
  };

  return (
    <div>
      <h2>🗺️ Orientarme</h2>
      <p className="screen-desc">Geolocalización y lugares accesibles.</p>

      <div className="panel">
        <h3>📍 Mi ubicación</h3>
        <button className="btn-demo" onClick={locate} disabled={locating}>
          {locating ? '⏳ Localizando...' : '📍 Obtener ubicación'}
        </button>
        {location && (
          <div className="phone-mock">
            <div className="row"><span>Latitud</span><span>{location.lat}</span></div>
            <div className="row"><span>Longitud</span><span>{location.lon}</span></div>
          </div>
        )}
      </div>

      <div className="panel">
        <h3>🏢 Lugares accesibles cercanos</h3>
        <div className="badge-list">
          {places.map((p) => (
            <span className="chip" key={p.id}>
              {p.icon} {p.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
