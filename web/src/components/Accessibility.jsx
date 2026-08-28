const items = [
  { icon: '🔠', title: 'Texto grande', desc: 'Tamaños de letra ajustables' },
  { icon: '🔲', title: 'Alto contraste', desc: 'Mayor legibilidad visual' },
  { icon: '🎨', title: 'Colores invertidos', desc: 'Modo de visión alternativa' },
  { icon: '📳', title: 'Intensidad háptica', desc: 'Vibraciones configurables' },
  { icon: '🔊', title: 'Voz activa', desc: 'Lectura en voz alta automática' }
];

function Accessibility() {
  return (
    <section className="section acc-cta" id="accesibilidad">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Compromiso</span>
          <h2>Accesibilidad como principio, no como extra</h2>
          <p>
            INCLU se construye pensando en cada persona. La configuración se
            adapta automáticamente a las necesidades de quien la usa.
          </p>
        </div>
        <div className="acc-grid">
          {items.map((it) => (
            <div className="acc-item" key={it.title}>
              <div className="icon">{it.icon}</div>
              <h4>{it.title}</h4>
              <p>{it.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Accessibility;
