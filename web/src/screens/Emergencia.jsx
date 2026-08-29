import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout.jsx';
import { useAccessibility } from '../contexts/AccessibilityContext.jsx';

export default function Emergencia() {
  const navigate = useNavigate();
  const { settings } = useAccessibility();
  const [alertActive, setAlertActive] = useState(false);
  const [step, setStep] = useState('idle');
  const [location, setLocation] = useState(null);

  const getLocation = () => new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) { reject(new Error('No disponible')); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      (err) => reject(err),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });

  const triggerAlert = async () => {
    setAlertActive(true);
    if ('vibrate' in navigator) navigator.vibrate([1000]);
    try {
      const loc = await getLocation();
      setLocation(loc);
      const message = `INCLU SOS: Necesito ayuda. Ubicación: https://www.google.com/maps?q=${loc.lat},${loc.lon}`;
      if (settings.emergencyContact) window.open(`sms:${settings.emergencyContact}?body=${encodeURIComponent(message)}`, '_blank');
      setStep('sent');
    } catch {
      setLocation(null);
      setStep('sent');
    }
  };

  const cancelAlert = () => { setAlertActive(false); setStep('idle'); setLocation(null); };

  useEffect(() => {
    if (step === 'sent') { const t = setTimeout(() => setStep('confirmed'), 2000); return () => clearTimeout(t); }
  }, [step]);

  return (
    <AppLayout>
      <h2>Emergencia</h2>
      <p>Ayuda rápida y alerta SOS.</p>

      {alertActive && (
        <div className="card" style={{ background: '#fef2f2', border: '1px solid #fecaca' }}>
          <h3 style={{ color: '#991b1b' }}>Alerta Activada</h3>
          <p style={{ color: '#dc2626' }}>Tu contacto de emergencia está siendo notificado.</p>
        </div>
      )}

      {!alertActive && (
        <div className="card">
          <h3>¿Necesitas ayuda?</h3>
          <p>Activa la alerta para avisar a tu contacto y compartir tu ubicación.</p>
        </div>
      )}

      <button className="sos-btn" onClick={alertActive ? cancelAlert : triggerAlert}>
        {alertActive ? 'Cancelar alerta' : 'Necesito ayuda'}
      </button>

      {step === 'sent' && location && (
        <div className="card">
          <h3>Ubicación compartida</h3>
          <div className="row"><span>Latitud</span><span>{location.lat.toFixed(6)}</span></div>
          <div className="row"><span>Longitud</span><span>{location.lon.toFixed(6)}</span></div>
        </div>
      )}

      {step === 'confirmed' && (
        <div className="card" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
          <h3 style={{ color: '#166534' }}>Alerta enviada</h3>
          <p style={{ color: '#15803d' }}>Tu contacto de emergencia ha sido notificado.</p>
        </div>
      )}

      <div className="card">
        <h3>Contacto de emergencia</h3>
        <div className="row">
          <span>Contacto</span>
          <span>{settings.emergencyContact || 'No configurado'}</span>
        </div>
        {!settings.emergencyContact && (
          <button className="btn btn-o" onClick={() => navigate('/app/accesibilidad')} style={{ marginTop: 10, width: 'auto' }}>
            Configurar en Ajustes
          </button>
        )}
      </div>

      <div className="card">
        <h3>Llamada de emergencia</h3>
        <button className="btn btn-d" onClick={() => window.open('tel:112', '_blank')} style={{ width: 'auto', marginTop: 6 }}>
          Llamar al 112
        </button>
      </div>
    </AppLayout>
  );
}
