function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-brand">
          <div className="navbar-logo" style={{ color: '#fff' }}>
            <img src="/favicon.svg" alt="INCLU" />
            <span>INCLU</span>
          </div>
          <p>Tecnología que incluye. Plataforma de inclusión y accesibilidad para personas con discapacidad.</p>
        </div>
        <div>
          <h4>Producto</h4>
          <a href="#features">Funciones</a>
          <a href="#como-funciona">Cómo funciona</a>
          <a href="#accesibilidad">Accesibilidad</a>
        </div>
        <div>
          <h4>Proyecto</h4>
          <a href="#">Aplicación Android</a>
          <a href="#">Dispositivos INCLU</a>
          <a href="#">Contacto</a>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">© {new Date().getFullYear()} INCLU · Tecnología que incluye.</div>
      </div>
    </footer>
  );
}

export default Footer;
