import { useState } from 'react';
import AppLayout from '../components/AppLayout.jsx';

export default function Dispositivos() {
  const [scanning, setScanning] = useState(false);
  const [devices, setDevices] = useState([]);
  const [error, setError] = useState('');

  const startScan = async () => {
    if (!('bluetooth' in navigator)) { setError('Bluetooth no disponible en este navegador.'); return; }
    setScanning(true); setDevices([]); setError('');
    try {
      const device = await navigator.bluetooth.requestDevice({ acceptAllDevices: true });
      setDevices([{ id: device.id || 'unknown', name: device.name || 'Dispositivo INCLU', connected: true }]);
    } catch (e) {
      if (e.name !== 'NotFoundError') setError('Error al buscar dispositivos.');
    } finally { setScanning(false); }
  };

  const simulate = () => {
    setScanning(true); setDevices([]); setError('');
    setTimeout(() => {
      setDevices([
        { id: 'BAND-001', name: 'INCLU Band', connected: false, type: 'Pulsera' },
        { id: 'CANE-002', name: 'INCLU Cane', connected: false, type: 'Bastón' },
      ]);
      setScanning(false);
    }, 1500);
  };

  const toggle = (id) => setDevices(prev => prev.map(d => d.id === id ? { ...d, connected: !d.connected } : d));

  return (
    <AppLayout>
      <h2>Mis dispositivos</h2>
      <p>Conecta tus dispositivos INCLU por Bluetooth.</p>

      {error && <div className="error-banner">{error}</div>}

      <div className="card">
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className="btn btn-p" onClick={startScan} disabled={scanning} style={{ width: 'auto' }}>
            {scanning ? 'Buscando...' : 'Buscar dispositivos'}
          </button>
          <button className="btn btn-o" onClick={simulate} disabled={scanning} style={{ width: 'auto' }}>
            Simular
          </button>
        </div>
      </div>

      <div className="card">
        <h3>Dispositivos cercanos</h3>
        {devices.length === 0 && !scanning && <p style={{ color: '#9ca3af', marginTop: 6 }}>Pulsa "Buscar" o "Simular" para detectar dispositivos INCLU.</p>}
        {scanning && <div className="preview">Buscando dispositivos...</div>}
        {devices.map(d => (
          <div key={d.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f3f4f6' }}>
            <div>
              <strong style={{ fontSize: '0.95rem' }}>{d.name}</strong>
              <p style={{ fontSize: '0.82rem', color: '#9ca3af', marginTop: 2 }}>
                {d.connected ? 'Conectado' : d.id} {d.type && `· ${d.type}`}
              </p>
            </div>
            <button className={`btn ${d.connected ? 'btn-d' : 'btn-s'}`} onClick={() => toggle(d.id)} style={{ width: 'auto', padding: '8px 16px' }}>
              {d.connected ? 'Desconectar' : 'Conectar'}
            </button>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}
