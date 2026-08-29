import { useState } from 'react';

export default function Emergencia() {
  const [step, setStep] = useState('idle'); // idle | confirm | sent
  const [location, setLocation] = useState(null);

  const request = () => {
    setLocation({ lat: -34.6037, lon: -58.3816 });
    setStep('sent');
    setTimeout(() => setStep('idle'), 4000);
  };

  return (
    <div>
      <h2>🆘 Emergencia</h2>
      <p className="screen-desc">Pide ayuda con un solo toque. Tu ubicación se comparte con tu contacto de confianza.</p>

      {step === 'idle' && (
        <button className="emergency-big" onClick={() => setStep('confirm')}>
          🚨 SOLICITAR AYUDA
        </button>
      )}

      {step === 'confirm' && (
        <div className="panel">
          <h3>¿Confirmar solicitud de ayuda?</h3>
          <p className="description">Se enviará un mensaje con tu ubicación al contacto de emergencia.</p>
          <button className="btn-demo danger" onClick={request}>✅ Sí, solicitar ayuda</button>
          <button className="btn-demo outline" onClick={() => setStep('idle')} style={{ marginTop: 8 }}>Cancelar</button>
        </div>
      )}

      {step === 'sent' && (
        <div className="panel">
          <h3>✅ Ayuda solicitada</h3>
          <div className="description">Se compartió tu ubicación con el contacto de emergencia.</div>
          {location && (
            <div className="phone-mock">
              <div className="row"><span>Latitud</span><span>{location.lat}</span></div>
              <div className="row"><span>Longitud</span><span>{location.lon}</span></div>
            </div>
          )}
        </div>
      )}

      <div className="panel" style={{ marginTop: 16 }}>
        <h3>📞 Contactos</h3>
        <p className="description">Tu contacto de emergencia configurado:</p>
        <div className="phone-mock">
          <div className="row"><span>Contacto</span><span>+54 11 5555-0100</span></div>
        </div>
        <button className="btn-demo danger">Llamar emergencias</button>
      </div>
    </div>
  );
}
