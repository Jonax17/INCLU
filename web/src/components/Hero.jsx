function Hero({ onLaunchApp }) {
  return (
    <header className="hero">
      <div className="container">
        <div>
          <span className="hero-badge">✨ Tecnología que incluye</span>
          <h1>
            Una plataforma de <span className="accent">inclusión</span> y
            accesibilidad para todos
          </h1>
          <p className="subtitle">
            INCLU ayuda a personas con discapacidad visual, auditiva, sordociega
            y de movilidad a interactuar con su entorno mediante visión
            artificial, voz, háptica, NFC, BLE y geolocalización.
          </p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={onLaunchApp}>
              🚀 Probar la app
            </button>
            <a className="btn-ghost" href="#features">
              Conocer más
            </a>
          </div>
        </div>
        <div className="hero-visual">
          <div className="phone-frame">
            <PhoneMock />
          </div>
        </div>
      </div>
    </header>
  );
}

function PhoneMock() {
  const screens = [
    { icon: '👁️', label: 'Ver' },
    { icon: '👂', label: 'Escuchar' },
    { icon: '📳', label: 'Sentir' }
  ];
  return (
    <div style={{ padding: 6 }}>
      {screens.map((s) => (
        <div
          key={s.label}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            background: '#F5F5F5',
            borderRadius: 12,
            padding: '12px 14px',
            marginBottom: 8
          }}
        >
          <span style={{ fontSize: 22 }}>{s.icon}</span>
          <span style={{ fontWeight: 700, color: '#1A237E' }}>{s.label}</span>
        </div>
      ))}
    </div>
  );
}

export default Hero;
