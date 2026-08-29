/**
 * GROQACC - Gestor de Tutorial Interactivo
 * Guía paso a paso para nuevos usuarios
 */
class TutorialManager {
  constructor() {
    this.currentStep = 0;
    this.isActive = false;
    this.overlay = null;
    this.steps = [
      {
        target: '#message-input',
        titleKey: 'tutorialStep1',
        content: 'Escribe tu mensaje aquí y presiona Enter para enviarlo a la IA.',
        position: 'bottom'
      },
      {
        target: '#mic-btn',
        titleKey: 'tutorialStep2',
        content: 'Presiona este botón para hablar. Tu voz será convertida en texto automáticamente.',
        position: 'bottom'
      },
      {
        target: '#speak-btn',
        titleKey: 'tutorialStep3',
        content: 'Haz clic aquí para que la IA lea su respuesta en voz alta.',
        position: 'bottom'
      },
      {
        target: '#settings-btn',
        titleKey: 'tutorialStep4',
        content: 'Configura el tema, velocidad de lectura y otras opciones de accesibilidad.',
        position: 'bottom'
      },
      {
        target: '#image-btn',
        titleKey: 'tutorialStep5',
        content: 'Sube una imagen para que la IA la describa detalladamente.',
        position: 'bottom'
      }
    ];

    this.callbacks = {
      onComplete: null,
      onSkip: null
    };
  }

  /**
   * Iniciar tutorial
   */
  start() {
    if (this.isActive) return;

    this.isActive = true;
    this.currentStep = 0;
    this.createOverlay();
    this.showStep(0);

    // Guardar que ya vio el tutorial
    localStorage.setItem('inclu-tutorial-seen', 'true');
  }

  /**
   * Verificar si el usuario ya vio el tutorial
   */
  hasSeenTutorial() {
    return localStorage.getItem('inclu-tutorial-seen') === 'true';
  }

  /**
   * Crear overlay del tutorial
   */
  createOverlay() {
    this.overlay = document.createElement('div');
    this.overlay.className = 'tutorial-overlay';
    this.overlay.setAttribute('role', 'dialog');
    this.overlay.setAttribute('aria-modal', 'true');
    this.overlay.setAttribute('aria-label', 'Tutorial');
    this.overlay.innerHTML = `
      <div class="tutorial-backdrop"></div>
      <div class="tutorial-tooltip">
        <div class="tutorial-header">
          <h3 id="tutorial-title"></h3>
          <span id="tutorial-progress" class="tutorial-progress"></span>
        </div>
        <p id="tutorial-content"></p>
        <div class="tutorial-highlight" id="tutorial-highlight"></div>
        <div class="tutorial-actions">
          <button id="tutorial-skip" class="btn-secondary" aria-label="Saltar tutorial">Saltar</button>
          <div class="tutorial-nav">
            <button id="tutorial-prev" class="btn-secondary" aria-label="Paso anterior" disabled>← Anterior</button>
            <button id="tutorial-next" class="btn-primary" aria-label="Siguiente paso">Siguiente →</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(this.overlay);

    // Event listeners
    document.getElementById('tutorial-skip').addEventListener('click', () => this.skip());
    document.getElementById('tutorial-prev').addEventListener('click', () => this.prev());
    document.getElementById('tutorial-next').addEventListener('click', () => this.next());

    // Cerrar con Escape
    this.overlay.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.skip();
      }
    });

    // Agregar estilos dinámicamente
    this.addStyles();
  }

  /**
   * Agregar estilos del tutorial
   */
  addStyles() {
    if (document.getElementById('tutorial-styles')) return;

    const style = document.createElement('style');
    style.id = 'tutorial-styles';
    style.textContent = `
      .tutorial-overlay {
        position: fixed;
        inset: 0;
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .tutorial-backdrop {
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.7);
      }

      .tutorial-tooltip {
        position: relative;
        background: var(--bg-primary, #fff);
        border-radius: 12px;
        padding: 24px;
        max-width: 400px;
        width: 90%;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        z-index: 1;
      }

      .tutorial-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
      }

      .tutorial-header h3 {
        margin: 0;
        font-size: 1.25rem;
        color: var(--text-primary, #0f172a);
      }

      .tutorial-progress {
        font-size: 0.875rem;
        color: var(--text-secondary, #64748b);
      }

      .tutorial-tooltip p {
        margin: 0 0 20px 0;
        color: var(--text-secondary, #475569);
        line-height: 1.6;
      }

      .tutorial-highlight {
        display: none;
        position: absolute;
        border: 3px solid var(--color-primary, #2563eb);
        border-radius: 8px;
        pointer-events: none;
        z-index: -1;
      }

      .tutorial-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
      }

      .tutorial-nav {
        display: flex;
        gap: 8px;
      }

      .tutorial-overlay .btn-primary,
      .tutorial-overlay .btn-secondary {
        padding: 10px 20px;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        border: none;
        transition: all 0.2s;
      }

      .tutorial-overlay .btn-primary {
        background: var(--color-primary, #2563eb);
        color: white;
      }

      .tutorial-overlay .btn-primary:hover {
        background: var(--color-primary-hover, #1d4ed8);
      }

      .tutorial-overlay .btn-secondary {
        background: var(--bg-tertiary, #f1f5f9);
        color: var(--text-primary, #0f172a);
      }

      .tutorial-overlay .btn-secondary:hover {
        background: var(--border-color, #e2e8f0);
      }

      .tutorial-overlay .btn-primary:disabled,
      .tutorial-overlay .btn-secondary:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      /* High contrast support */
      [data-theme="high-contrast"] .tutorial-tooltip {
        border: 3px solid #fff;
      }

      [data-theme="high-contrast"] .tutorial-highlight {
        border-color: #ffff00;
      }

      /* Reduced motion */
      @media (prefers-reduced-motion: reduce) {
        .tutorial-overlay,
        .tutorial-tooltip,
        .tutorial-backdrop {
          animation: none !important;
          transition: none !important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  /**
   * Mostrar paso actual
   */
  showStep(index) {
    const step = this.steps[index];
    if (!step) return;

    const titleEl = document.getElementById('tutorial-title');
    const contentEl = document.getElementById('tutorial-content');
    const progressEl = document.getElementById('tutorial-progress');
    const prevBtn = document.getElementById('tutorial-prev');
    const nextBtn = document.getElementById('tutorial-next');

    if (titleEl) titleEl.textContent = this.getStepTitle(step.titleKey);
    if (contentEl) contentEl.textContent = step.content;
    if (progressEl) progressEl.textContent = `${index + 1} / ${this.steps.length}`;

    // Actualizar botones
    if (prevBtn) prevBtn.disabled = index === 0;
    if (nextBtn) {
      if (index === this.steps.length - 1) {
        nextBtn.textContent = '¡Listo!';
        nextBtn.setAttribute('aria-label', 'Finalizar tutorial');
      } else {
        nextBtn.textContent = 'Siguiente →';
        nextBtn.setAttribute('aria-label', 'Siguiente paso');
      }
    }

    // Resaltar elemento objetivo
    this.highlightTarget(step.target);

    // Anunciar para screen readers
    this.announceStep(step);
  }

  /**
   * Obtener título del paso
   */
  getStepTitle(titleKey) {
    if (window.app?.i18n) {
      return window.app.i18n.t(titleKey);
    }
    const titles = {
      tutorialStep1: 'Escribe tu mensaje aquí',
      tutorialStep2: 'Presiona para hablar',
      tutorialStep3: 'Lee la última respuesta',
      tutorialStep4: 'Configura tu experiencia',
      tutorialStep5: 'Describe imágenes'
    };
    return titles[titleKey] || titleKey;
  }

  /**
   * Resaltar elemento objetivo
   */
  highlightTarget(selector) {
    const highlight = document.getElementById('tutorial-highlight');
    const target = document.querySelector(selector);

    if (highlight && target) {
      const rect = target.getBoundingClientRect();
      highlight.style.display = 'block';
      highlight.style.top = `${rect.top - 8}px`;
      highlight.style.left = `${rect.left - 8}px`;
      highlight.style.width = `${rect.width + 16}px`;
      highlight.style.height = `${rect.height + 16}px`;

      // Scroll al elemento si es necesario
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  /**
   * Anunciar paso a screen readers
   */
  announceStep(step) {
    const announcement = `Paso ${this.currentStep + 1} de ${this.steps.length}: ${this.getStepTitle(step.titleKey)}. ${step.content}`;

    if (window.app?.accessibility) {
      window.app.accessibility.announce(announcement);
    }
  }

  /**
   * Siguiente paso
   */
  next() {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
      this.showStep(this.currentStep);
    } else {
      this.complete();
    }
  }

  /**
   * Paso anterior
   */
  prev() {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.showStep(this.currentStep);
    }
  }

  /**
   * Saltar tutorial
   */
  skip() {
    this.cleanup();
    if (this.callbacks.onSkip) {
      this.callbacks.onSkip();
    }
  }

  /**
   * Completar tutorial
   */
  complete() {
    this.cleanup();
    if (this.callbacks.onComplete) {
      this.callbacks.onComplete();
    }

    if (window.app?.accessibility) {
      window.app.accessibility.announce('Tutorial completado. ¡Ya puedes usar GroqAcc!');
    }
  }

  /**
   * Limpiar tutorial
   */
  cleanup() {
    this.isActive = false;
    this.currentStep = 0;

    if (this.overlay) {
      this.overlay.remove();
      this.overlay = null;
    }

    const highlight = document.getElementById('tutorial-highlight');
    if (highlight) {
      highlight.style.display = 'none';
    }
  }

  /**
   * Configurar callbacks
   */
  on(event, callback) {
    if (this.callbacks.hasOwnProperty(event)) {
      this.callbacks[event] = callback;
    }
  }
}

// Exportar para uso global
window.TutorialManager = TutorialManager;
