import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout.jsx';

export default function Orientarme() {
  const navigate = useNavigate();
  const [location, setLocation] = useState(null);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState('');

  const getLocation = () => {
    if (!('geolocation' in navigator)) { setError('Geolocalización no disponible.'); return; }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => { setLocation({ lat: pos.coords.latitude.toFixed(6), lon: pos.coords.longitude.toFixed(6) }); setLocating(false); },
      () => { setLocating(false); setError('No se pudo obtener la ubicación.'); },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <AppLayout>
      <h2>Orientarme</h2>
      <p>Encuentra lugares accesibles y muévete con confianza.</p>

      {error && <div className="error-banner">{error}</div>}

      <div className="card">
        <h3>Tu ubicación</h3>
        <button className="btn btn-p" onClick={getLocation} disabled={locating} style={{ width: 'auto', marginTop: 8 }}>
          {locating ? 'Obteniendo...' : 'Obtener ubicación'}
        </button>
        {location && (
          <div style={{ marginTop: 10 }}>
            <div className="row"><span>Latitud</span><span>{location.lat}</span></div>
            <div className="row"><span>Longitud</span><span>{location.lon}</span></div>
          </div>
        )}
      </div>

      <div className="grid">
        <div className="card" onClick={() => navigate('/app/orientarme/mapa')} style={{ cursor: 'pointer' }}>
          <div style={{ fontSize: '1.3rem', color: '#4361ee', marginBottom: 8, fontWeight: 700 }}>⊕</div>
          <h3>Mapa de Accesibilidad</h3>
          <p>Lugares accesibles cercanos</p>
        </div>
        <div className="card" onClick={() => navigate('/app/orientarme/codigo-qr')} style={{ cursor: 'pointer' }}>
          <div style={{ fontSize: '1.3rem', color: '#4361ee', marginBottom: 8, fontWeight: 700 }}>⊞</div>
          <h3>Navegación Interior (QR/NFC)</h3>
          <p>Escanea códigos para información</p>
        </div>
        <div className="card" onClick={() => navigate('/app/orientarme/mapa')} style={{ cursor: 'pointer' }}>
          <div style={{ fontSize: '1.3rem', color: '#4361ee', marginBottom: 8, fontWeight: 700 }}>◎</div>
          <h3>Navegación Exterior (GPS)</h3>
          <p>Rutas exteriores con tu ubicación</p>
        </div>
      </div>
    </AppLayout>
  );
}
