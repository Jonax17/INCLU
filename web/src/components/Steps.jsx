const steps = [
  { n: '1', title: 'Configura tu perfil', desc: 'Elige tu perfil de accesibilidad: visual, baja visión, sorda, sordociega, movilidad o general.' },
  { n: '2', title: 'Conecta tus dispositivos', desc: 'Vincula la INCLU Band, el Bastón INCLU o el Guante INCLU por Bluetooth.' },
  { n: '3', title: 'Interactúa con tu entorno', desc: 'Escanea, escucha, siente y navega por espacios accesibles en tiempo real.' },
  { n: '4', title: 'Solicita ayuda si la necesitas', desc: 'Con un toque, comparte tu ubicación con tu contacto de confianza.' }
];

function Steps() {
  return (
    <section className="section steps" id="como-funciona">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Cómo funciona</span>
          <h2>Un asistente cercano en tu bolsillo</h2>
          <p>Todo funciona en el dispositivo, sin conexión a servidores externos.</p>
        </div>
        <div className="steps-grid">
          {steps.map((s) => (
            <div className="step" key={s.n}>
              <div className="step-num">{s.n}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Steps;
