function Navbar({ onLaunchApp }) {
  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-logo">
          <img src="/favicon.svg" alt="INCLU" />
          <span>INCLU</span>
        </div>
        <div className="navbar-links">
          <a href="#features">Funciones</a>
          <a href="#como-funciona">Cómo funciona</a>
          <a href="#accesibilidad">Accesibilidad</a>
          <button className="btn-launch" onClick={onLaunchApp}>Probar app</button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
