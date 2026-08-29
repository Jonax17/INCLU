/**
 * GROQACC - Módulo de Accesibilidad
 * Gestiona temas, atajos de teclado, anuncios para screen readers
 */
class AccessibilityManager {
  constructor() {
    this.announcer = document.getElementById('aria-announcer');
    this.currentTheme = 'normal';
    this.settings = {
      autoSpeak: true,
      visualAlerts: true,
      captionsEnabled: true,
      speechRate: 1.0,
      fontSize: 100
    };

    this.loadSettings();
    this.initKeyboardShortcuts();
    this.initThemeDetection();
  }

  /**
   * Cargar configuración guardada
   */
  loadSettings() {
    try {
      const saved = localStorage.getItem('groqacc-settings');
      if (saved) {
        this.settings = { ...this.settings, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Error cargando configuración:', e);
    }
    this.applySettings();
  }

  /**
   * Guardar configuración
   */
  saveSettings() {
    try {
      localStorage.setItem('groqacc-settings', JSON.stringify(this.settings));
    } catch (e) {
      console.warn('Error guardando configuración:', e);
    }
  }

  /**
   * Aplicar configuración actual
   */
  applySettings() {
    document.documentElement.setAttribute('data-theme', this.currentTheme);
    document.documentElement.style.fontSize = `${this.settings.fontSize}%`;

    const speechRateInput = document.getElementById('speech-rate');
    const fontSizeInput = document.getElementById('font-size');
    const autoSpeakCheckbox = document.getElementById('auto-speak');
    const visualAlertsCheckbox = document.getElementById('visual-alerts');
    const captionsCheckbox = document.getElementById('captions-enabled');

    if (speechRateInput) speechRateInput.value = this.settings.speechRate;
    if (fontSizeInput) fontSizeInput.value = this.settings.fontSize;
    if (autoSpeakCheckbox) autoSpeakCheckbox.checked = this.settings.autoSpeak;
    if (visualAlertsCheckbox) visualAlertsCheckbox.checked = this.settings.visualAlerts;
    if (captionsCheckbox) captionsCheckbox.checked = this.settings.captionsEnabled;

    const rateValue = document.getElementById('rate-value');
    const fontSizeValue = document.getElementById('font-size-value');
    if (rateValue) rateValue.textContent = this.settings.speechRate.toFixed(1);
    if (fontSizeValue) fontSizeValue.textContent = this.settings.fontSize;
  }

  /**
   * Cambiar tema
   */
  setTheme(theme) {
    this.currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    this.announce(`Tema cambiado a ${this.getThemeName(theme)}`);
  }

  /**
   * Obtener nombre legible del tema
   */
  getThemeName(theme) {
    const names = {
      'normal': 'normal',
      'dark': 'modo oscuro',
      'high-contrast': 'alto contraste'
    };
    return names[theme] || theme;
  }

  /**
   * Anunciar mensaje a screen readers
   */
  announce(message, priority = 'polite') {
    if (!this.announcer) return;

    this.announcer.setAttribute('aria-live', priority);
    this.announcer.textContent = '';

    setTimeout(() => {
      this.announcer.textContent = message;
    }, 100);

    if (this.settings.visualAlerts && priority === 'assertive') {
      this.showVisualAlert(message);
    }
  }

  /**
   * Mostrar alerta visual
   */
  showVisualAlert(message, type = 'info') {
    const notificationArea = document.getElementById('notification-area');
    if (!notificationArea) return;

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.setAttribute('role', 'alert');
    notification.innerHTML = `
      <span class="notification-icon" aria-hidden="true">${this.getNotificationIcon(type)}</span>
      <div class="notification-content">
        <div class="notification-message">${message}</div>
      </div>
    `;

    notificationArea.appendChild(notification);

    notification.addEventListener('click', () => {
      notification.remove();
    });

    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => notification.remove(), 300);
      }
    }, 5000);
  }

  /**
   * Obtener icono de notificación
   */
  getNotificationIcon(type) {
    const icons = {
      'success': '✓',
      'error': '✗',
      'warning': '⚠',
      'info': 'ℹ'
    };
    return icons[type] || icons.info;
  }

  /**
   * Inicializar atajos de teclado
   */
  initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      if (e.altKey && e.key === 'm') {
        e.preventDefault();
        this.toggleMicrophone();
      }

      if (e.altKey && e.key === 's') {
        e.preventDefault();
        this.readLastResponse();
      }

      if (e.altKey && e.key === 'h') {
        e.preventDefault();
        this.readHelp();
      }

      if (e.key === 'Escape') {
        this.closeAllPanels();
      }
    });
  }

  /**
   * Detectar preferencias del sistema
   */
  initThemeDetection() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      if (this.currentTheme === 'normal') {
        this.setTheme('dark');
      }
    }

    if (window.matchMedia && window.matchMedia('(prefers-contrast: high)').matches) {
      this.setTheme('high-contrast');
    }

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (this.currentTheme === 'normal') {
        this.setTheme(e.matches ? 'dark' : 'normal');
      }
    });

    window.matchMedia('(prefers-contrast: high)').addEventListener('change', (e) => {
      if (e.matches) {
        this.setTheme('high-contrast');
      }
    });
  }

  /**
   * Toggle micrófono (placeholder - conectado en app.js)
   */
  toggleMicrophone() {
    document.getElementById('mic-btn')?.click();
  }

  /**
   * Leer última respuesta (placeholder - conectado en app.js)
   */
  readLastResponse() {
    document.getElementById('speak-btn')?.click();
  }

  /**
   * Leer ayuda
   */
  readHelp() {
    const helpText = `
      Atajos de teclado disponibles de INCLU:
      Alt + M para activar o desactivar el micrófono.
      Alt + S para leer la última respuesta.
      Alt + H para escuchar esta ayuda.
      Escape para cerrar paneles.
      Enter para enviar mensajes.
      Shift + Enter para nueva línea.
    `;
    if (window.app?.voice) {
      window.app.voice.speak(helpText);
    }
    this.announce(helpText);
  }

  /**
   * Cerrar todos los paneles abiertos
   */
  closeAllPanels() {
    const settingsPanel = document.getElementById('settings-panel');
    const settingsBtn = document.getElementById('settings-btn');

    if (settingsPanel && !settingsPanel.classList.contains('hidden')) {
      settingsPanel.classList.add('hidden');
      settingsBtn?.setAttribute('aria-expanded', 'false');
      settingsBtn?.focus();
      this.announce('Panel de configuración cerrado');
    }
  }

  /**
   * Actualizar configuración desde UI
   */
  updateFromUI() {
    const autoSpeak = document.getElementById('auto-speak');
    const visualAlerts = document.getElementById('visual-alerts');
    const captions = document.getElementById('captions-enabled');
    const speechRate = document.getElementById('speech-rate');
    const fontSize = document.getElementById('font-size');

    if (autoSpeak) this.settings.autoSpeak = autoSpeak.checked;
    if (visualAlerts) this.settings.visualAlerts = visualAlerts.checked;
    if (captions) this.settings.captionsEnabled = captions.checked;
    if (speechRate) this.settings.speechRate = parseFloat(speechRate.value);
    if (fontSize) this.settings.fontSize = parseInt(fontSize.value);

    this.applySettings();
    this.saveSettings();
  }

  /**
   * Restablecer configuración por defecto
   */
  resetDefaults() {
    this.settings = {
      autoSpeak: true,
      visualAlerts: true,
      captionsEnabled: true,
      speechRate: 1.0,
      fontSize: 100
    };
    this.currentTheme = 'normal';
    this.applySettings();
    this.saveSettings();
    this.announce('Configuración restablecida a valores predeterminados');
  }
}

// Exportar para uso global
window.AccessibilityManager = AccessibilityManager;
