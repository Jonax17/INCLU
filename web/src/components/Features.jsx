const features = [
  { icon: '👁️', title: 'Ver', desc: 'Reconoce texto del entorno con la cámara o una lupa digital y léelo en voz alta.' },
  { icon: '👂', title: 'Escuchar', desc: 'Transcripción de voz en tiempo real para personas con discapacidad auditiva.' },
  { icon: '📳', title: 'Sentir', desc: 'Patrones hápticos que guían: izquierda, derecha, peligro, stop, destino y ayuda.' },
  { icon: '🗺️', title: 'Orientarme', desc: 'Geolocalización y mapa de lugares accesibles cercanos (rampas, baños, ascensores).' },
  { icon: '🛰️', title: 'NFC & BLE', desc: 'Etiquetas NFC que dan información del entorno y conexión con dispositivos INCLU.' },
  { icon: '🆘', title: 'Emergencia', desc: 'Botón de emergencia que comparte tu ubicación con el contacto de confianza.' }
];

function Features() {
  return (
    <section className="section" id="features">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Funciones</span>
          <h2>Seis formas de interactuar con el mundo</h2>
          <p>
            Cada función está pensada para cubrir una necesidad concreta y puede
            combinarse según el perfil de accesibilidad de cada persona.
          </p>
        </div>
        <div className="features-grid">
          {features.map((f) => (
            <div className="feature-card" key={f.title}>
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;
