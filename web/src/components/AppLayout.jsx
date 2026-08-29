import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAccessibility } from '../contexts/AccessibilityContext.jsx';
import Chatbot from './Chatbot.jsx';

const navItems = [
  { path: '/app', icon: '◉', label: 'Inicio' },
  { path: '/app/ver', icon: '◎', label: 'Ver' },
  { path: '/app/escuchar', icon: '≋', label: 'Escuchar' },
  { path: '/app/sentir', icon: '⊕', label: 'Sentir' },
  { path: '/app/orientarme', icon: '◎', label: 'Orientar' },
  { path: '/app/emergencia', icon: '⚠', label: 'SOS' },
  { path: '/app/accesibilidad', icon: '⚙', label: 'Ajustes' },
];

export default function AppLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { settings, updateSetting } = useAccessibility();
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <>
      <a href="#main-content" className="skip-link">
        Saltar al contenido principal
      </a>

      <div className="app-header">
        <div className="brand" onClick={() => navigate('/app')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && navigate('/app')}>
          <img src="/img/logo-icon.svg" alt="" className="header-logo" aria-hidden="true" />
          <span>INCLU</span>
        </div>
        <div className="app-header-actions">
          <a href="https://github.com/Jonax17/INCLU" target="_blank" rel="noopener noreferrer" className="header-link">
            GitHub
          </a>
          <button
            className="chatbot-toggle"
            onClick={() => setChatOpen(true)}
            aria-label="Abrir asistente virtual"
            title="Asistente INCLU"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
            </svg>
          </button>
          <button
            className="theme-toggle"
            onClick={() => updateSetting('darkMode', !settings.darkMode)}
            aria-label={settings.darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            title={settings.darkMode ? 'Modo claro' : 'Modo oscuro'}
          >
            {settings.darkMode ? '☀' : '☾'}
          </button>
          <button className="back-btn" onClick={() => navigate('/')}>
            Inicio
          </button>
        </div>
      </div>

      <main id="main-content" className="app-body" tabIndex={-1}>
        {children}
      </main>

      <nav className="app-nav" role="navigation" aria-label="Navegación principal">
        {navItems.map((item) => (
          <button
            key={item.path}
            className={location.pathname === item.path ? 'active' : ''}
            onClick={() => navigate(item.path)}
            aria-current={location.pathname === item.path ? 'page' : undefined}
            aria-label={item.label}
          >
            <span className="nav-icon" aria-hidden="true">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>

      <Chatbot isOpen={chatOpen} onClose={() => setChatOpen(false)} />
    </>
  );
}
