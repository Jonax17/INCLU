function CTA({ onLaunchApp }) {
  return (
    <section className="cta">
      <div className="container">
        <h2>¿Listo para experimentar INCLU?</h2>
        <p>
          Prueba la demo interactiva con los seis módulos directamente en tu
          navegador, incluso sin conexión.
        </p>
        <button className="btn-primary" onClick={onLaunchApp}>
          Abrir la demo
        </button>
      </div>
    </section>
  );
}

export default CTA;
