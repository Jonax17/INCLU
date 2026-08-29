import AppLayout from '../components/AppLayout.jsx';
import { useAccessibility } from '../contexts/AccessibilityContext.jsx';

export default function Accesibilidad() {
  const { settings, updateSetting, fontSizeMultiplier } = useAccessibility();

  return (
    <AppLayout>
      <h2>Ajustes de accesibilidad</h2>
      <p>Configura la app según tus necesidades. Los cambios se aplican al instante.</p>

      <div className="card">
        <h3 className="section-title">Apariencia</h3>
        {[
          { key: 'darkMode', label: 'Modo claro', sub: 'Activa el tema claro para mayor contraste' },
          { key: 'highContrast', label: 'Alto contraste', sub: 'Aumenta el contraste de todos los elementos' },
          { key: 'invertColors', label: 'Invertir colores', sub: 'Invierte la paleta de colores completa' },
        ].map(o => (
          <div className="toggle-row" key={o.key}>
            <div className="label">
              <strong>{o.label}</strong>
              <small>{o.sub}</small>
            </div>
            <div
              className={`toggle ${settings[o.key] ? 'on' : ''}`}
              onClick={() => updateSetting(o.key, !settings[o.key])}
              role="switch"
              aria-checked={settings[o.key]}
              aria-label={o.label}
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); updateSetting(o.key, !settings[o.key]); } }}
            >
              <div className="knob" />
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <h3 className="section-title">Tamaño de texto</h3>
        <div className="range-group">
          <label htmlFor="font-size">Escala: {settings.fontSizeSlider.toFixed(1)}x</label>
          <input
            type="range"
            id="font-size"
            min="0.5"
            max="2.0"
            step="0.1"
            value={settings.fontSizeSlider}
            onChange={e => updateSetting('fontSizeSlider', parseFloat(e.target.value))}
            aria-label={`Tamaño de texto: ${settings.fontSizeSlider.toFixed(1)}x`}
          />
          <div className="value">{settings.fontSizeSlider.toFixed(1)}x</div>
        </div>
      </div>

      <div className="card">
        <h3 className="section-title">Audio</h3>
        <div className="toggle-row">
          <div className="label">
            <strong>Voz habilitada</strong>
            <small>Lee textos en voz alta automáticamente</small>
          </div>
          <div
            className={`toggle ${settings.voiceEnabled ? 'on' : ''}`}
            onClick={() => updateSetting('voiceEnabled', !settings.voiceEnabled)}
            role="switch"
            aria-checked={settings.voiceEnabled}
            aria-label="Voz habilitada"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); updateSetting('voiceEnabled', !settings.voiceEnabled); } }}
          >
            <div className="knob" />
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="section-title">Háptica</h3>
        <div className="range-group">
          <label htmlFor="haptic-intensity">Intensidad de vibración</label>
          <input
            type="range"
            id="haptic-intensity"
            min="0"
            max="1"
            step="0.05"
            value={settings.hapticIntensity}
            onChange={e => updateSetting('hapticIntensity', parseFloat(e.target.value))}
            aria-label={`Intensidad de vibración: ${(settings.hapticIntensity * 100).toFixed(0)}%`}
          />
          <div className="value">{(settings.hapticIntensity * 100).toFixed(0)}%</div>
        </div>
        <div className="range-group">
          <label htmlFor="haptic-duration">Duración de vibración</label>
          <input
            type="range"
            id="haptic-duration"
            min="50"
            max="500"
            step="50"
            value={settings.hapticDuration}
            onChange={e => updateSetting('hapticDuration', parseInt(e.target.value))}
            aria-label={`Duración de vibración: ${settings.hapticDuration} milisegundos`}
          />
          <div className="value">{settings.hapticDuration} ms</div>
        </div>
      </div>

      <div className="card">
        <h3 className="section-title">Contacto de emergencia</h3>
        <p style={{ marginBottom: 12 }}>Número al que se enviará la alerta SOS con tu ubicación.</p>
        <input
          type="tel"
          placeholder="+52 123 456 7890"
          value={settings.emergencyContact}
          onChange={e => updateSetting('emergencyContact', e.target.value)}
          aria-label="Número de contacto de emergencia"
        />
      </div>
    </AppLayout>
  );
}
