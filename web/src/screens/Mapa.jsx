import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout.jsx';

const places = [
  { id: '1', name: 'Laboratorio de Sistemas', desc: 'Segundo piso. Acceso por rampa.', lat: -34.6037, lon: -58.3816, type: 'Institución' },
  { id: '2', name: 'Biblioteca Central', desc: 'Entrada adaptada y ascensor.', lat: -34.6040, lon: -58.3820, type: 'Institución' },
  { id: '3', name: 'Baño accesible P1', desc: 'Señalización táctil.', lat: -34.6035, lon: -58.3810, type: 'Baño' },
  { id: '4', name: 'Ascensor bloque A', desc: 'Botones en braille.', lat: -34.6038, lon: -58.3818, type: 'Ascensor' },
  { id: '5', name: 'Entrada principal', desc: 'Rampa y pasamanos.', lat: -34.6039, lon: -58.3815, type: 'Acceso' },
];

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function fmtDist(m) { return m < 1000 ? `${Math.round(m)} m` : `${(m / 1000).toFixed(1)} km`; }

export default function Mapa() {
  const navigate = useNavigate();
  const [userLoc, setUserLoc] = useState(null);
  const [locating, setLocating] = useState(false);

  const locate = () => {
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => { setUserLoc({ lat: pos.coords.latitude, lon: pos.coords.longitude }); setLocating(false); },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const sorted = userLoc
    ? [...places].sort((a, b) => haversine(userLoc.lat, userLoc.lon, a.lat, a.lon) - haversine(userLoc.lat, userLoc.lon, b.lat, b.lon))
    : places;

  return (
    <AppLayout>
      <button className="btn btn-o" onClick={() => navigate('/app/orientarme')} style={{ marginBottom: 16, width: 'auto' }}>← Volver</button>
      <h2>Mapa de Accesibilidad</h2>
      <p>Lugares accesibles cercanos a ti.</p>

      <div className="card">
        <button className="btn btn-p" onClick={locate} disabled={locating} style={{ width: 'auto' }}>
          {locating ? 'Localizando...' : 'Obtener mi ubicación'}
        </button>
        {userLoc && (
          <div style={{ marginTop: 10 }}>
            <div className="row"><span>Latitud</span><span>{userLoc.lat.toFixed(6)}</span></div>
            <div className="row"><span>Longitud</span><span>{userLoc.lon.toFixed(6)}</span></div>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 14 }}>
        {sorted.map(p => (
          <div key={p.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 40, height: 40, borderRadius: 8, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4361ee', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0 }}>
              {p.type.charAt(0)}
            </div>
            <div style={{ flex: 1 }}>
              <strong style={{ fontSize: '0.95rem' }}>{p.name}</strong>
              <p style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: 2 }}>{p.desc}</p>
            </div>
            {userLoc && (
              <span className="chip" style={{ margin: 0 }}>{fmtDist(haversine(userLoc.lat, userLoc.lon, p.lat, p.lon))}</span>
            )}
          </div>
        ))}
      </div>
    </AppLayout>
  );
}
