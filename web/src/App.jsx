import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AccessibilityProvider, useAccessibility } from './contexts/AccessibilityContext.jsx';
import Dashboard from './screens/Dashboard.jsx';
import Ver from './screens/Ver.jsx';
import LectorTexto from './screens/LectorTexto.jsx';
import Lupa from './screens/Lupa.jsx';
import Escaneador from './screens/Escaneador.jsx';
import Escuchar from './screens/Escuchar.jsx';
import Sentir from './screens/Sentir.jsx';
import Orientarme from './screens/Orientarme.jsx';
import Mapa from './screens/Mapa.jsx';
import CodigoQr from './screens/CodigoQr.jsx';
import Emergencia from './screens/Emergencia.jsx';
import Accesibilidad from './screens/Accesibilidad.jsx';
import Dispositivos from './screens/Dispositivos.jsx';
import Demo from './screens/Demo.jsx';

function AppContent() {
  const { settings, fontSizeMultiplier } = useAccessibility();

  useEffect(() => {
    const root = document.documentElement;

    if (settings.darkMode) {
      root.classList.add('light-mode');
    } else {
      root.classList.remove('light-mode');
    }

    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    root.style.fontSize = `${fontSizeMultiplier * 16}px`;
    root.style.filter = settings.invertColors ? 'invert(1) hue-rotate(180deg)' : '';

  }, [settings, fontSizeMultiplier]);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/app" replace />} />
      <Route path="/app" element={<Dashboard />} />
      <Route path="/app/ver" element={<Ver />} />
      <Route path="/app/ver/lector-texto" element={<LectorTexto />} />
      <Route path="/app/ver/lupa" element={<Lupa />} />
      <Route path="/app/ver/escaneador" element={<Escaneador />} />
      <Route path="/app/escuchar" element={<Escuchar />} />
      <Route path="/app/sentir" element={<Sentir />} />
      <Route path="/app/orientarme" element={<Orientarme />} />
      <Route path="/app/orientarme/mapa" element={<Mapa />} />
      <Route path="/app/orientarme/codigo-qr" element={<CodigoQr />} />
      <Route path="/app/emergencia" element={<Emergencia />} />
      <Route path="/app/accesibilidad" element={<Accesibilidad />} />
      <Route path="/app/dispositivos" element={<Dispositivos />} />
      <Route path="/app/demo" element={<Demo />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AccessibilityProvider>
        <AppContent />
      </AccessibilityProvider>
    </BrowserRouter>
  );
}
