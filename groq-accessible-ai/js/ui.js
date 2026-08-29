/**
 * GROQACC - Módulo de UI
 * Renderizado de mensajes, manejo de interfaz
 */
class UIManager {
  constructor() {
    this.messagesContainer = document.getElementById('chat-messages');
    this.messageInput = document.getElementById('message-input');
    this.sendBtn = document.getElementById('send-btn');
    this.micBtn = document.getElementById('mic-btn');
    this.speakBtn = document.getElementById('speak-btn');
    this.stopBtn = document.getElementById('stop-btn');
    this.settingsBtn = document.getElementById('settings-btn');
    this.settingsPanel = document.getElementById('settings-panel');
    this.closeSettingsBtn = document.getElementById('close-settings');
    this.saveSettingsBtn = document.getElementById('save-settings');
    this.resetSettingsBtn = document.getElementById('reset-settings');
    this.transcriptionArea = document.getElementById('transcription-area');
    this.transcriptionText = document.getElementById('transcription-text');
    this.statusText = document.getElementById('status-text');
    this.connectionStatus = document.getElementById('connection-status');
    this.modelSelect = document.getElementById('model-select');
    this.langSelect = document.getElementById('lang-select');

    // New tool buttons
    this.imageBtn = document.getElementById('image-btn');
    this.imageInput = document.getElementById('image-input');
    this.exportBtn = document.getElementById('export-btn');
    this.historyBtn = document.getElementById('history-btn');
    this.tutorialBtn = document.getElementById('tutorial-btn');

    // Modals
    this.historyModal = document.getElementById('history-modal');
    this.exportModal = document.getElementById('export-modal');
    this.historyList = document.getElementById('history-list');

    this.callbacks = {
      onSendMessage: null,
      onMicToggle: null,
      onSpeakLast: null,
      onStopSpeak: null,
      onModelChange: null,
      onImageUpload: null,
      onExportTXT: null,
      onExportPDF: null,
      onLoadHistory: null,
      onNewChat: null,
      onClearHistory: null,
      onDeleteHistory: null,
      onLangChange: null,
      onStartTutorial: null
    };

    this.lastAiMessage = '';
    this.initEventListeners();
    this.autoResizeTextarea();
  }

  /**
   * Inicializar event listeners
   */
  initEventListeners() {
    document.getElementById('chat-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSendMessage();
    });

    this.messageInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.handleSendMessage();
      }
    });

    this.messageInput?.addEventListener('input', () => {
      this.updateSendButton();
    });

    this.micBtn?.addEventListener('click', () => {
      if (this.callbacks.onMicToggle) this.callbacks.onMicToggle();
    });

    this.speakBtn?.addEventListener('click', () => {
      if (this.callbacks.onSpeakLast) this.callbacks.onSpeakLast();
    });

    this.stopBtn?.addEventListener('click', () => {
      if (this.callbacks.onStopSpeak) this.callbacks.onStopSpeak();
    });

    this.settingsBtn?.addEventListener('click', () => {
      this.toggleSettings();
    });

    this.closeSettingsBtn?.addEventListener('click', () => {
      this.hideSettings();
    });

    this.saveSettingsBtn?.addEventListener('click', () => {
      if (window.app?.accessibility) {
        window.app.accessibility.updateFromUI();
        window.app.accessibility.announce('Configuración guardada');
      }
    });

    this.resetSettingsBtn?.addEventListener('click', () => {
      if (window.app?.accessibility) {
        window.app.accessibility.resetDefaults();
      }
    });

    this.modelSelect?.addEventListener('change', (e) => {
      if (this.callbacks.onModelChange) {
        this.callbacks.onModelChange(e.target.value);
      }
    });

    // Image upload
    this.imageBtn?.addEventListener('click', () => {
      this.imageInput?.click();
    });

    this.imageInput?.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (file && this.callbacks.onImageUpload) {
        this.callbacks.onImageUpload(file);
      }
    });

    // Export
    this.exportBtn?.addEventListener('click', () => {
      this.showExportModal();
    });

    document.getElementById('export-txt-btn')?.addEventListener('click', () => {
      if (this.callbacks.onExportTXT) this.callbacks.onExportTXT();
      this.hideExportModal();
    });

    document.getElementById('export-pdf-btn')?.addEventListener('click', () => {
      if (this.callbacks.onExportPDF) this.callbacks.onExportPDF();
      this.hideExportModal();
    });

    document.getElementById('close-export')?.addEventListener('click', () => {
      this.hideExportModal();
    });

    // History
    this.historyBtn?.addEventListener('click', () => {
      this.showHistoryModal();
    });

    document.getElementById('close-history')?.addEventListener('click', () => {
      this.hideHistoryModal();
    });

    document.getElementById('new-chat-btn')?.addEventListener('click', () => {
      if (this.callbacks.onNewChat) this.callbacks.onNewChat();
      this.hideHistoryModal();
    });

    document.getElementById('clear-history-btn')?.addEventListener('click', () => {
      if (this.callbacks.onClearHistory) this.callbacks.onClearHistory();
    });

    // Tutorial
    this.tutorialBtn?.addEventListener('click', () => {
      if (this.callbacks.onStartTutorial) this.callbacks.onStartTutorial();
    });

    // Language
    this.langSelect?.addEventListener('change', (e) => {
      if (this.callbacks.onLangChange) {
        this.callbacks.onLangChange(e.target.value);
      }
    });

    // Close modals on backdrop click
    document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
      backdrop.addEventListener('click', () => {
        this.hideHistoryModal();
        this.hideExportModal();
      });
    });
  }

  /**
   * Auto-resize textarea
   */
  autoResizeTextarea() {
    if (!this.messageInput) return;

    this.messageInput.addEventListener('input', () => {
      this.messageInput.style.height = 'auto';
      this.messageInput.style.height = Math.min(this.messageInput.scrollHeight, 150) + 'px';
    });
  }

  /**
   * Manejar envío de mensaje
   */
  handleSendMessage() {
    const message = this.messageInput?.value.trim();
    if (!message) return;

    if (this.callbacks.onSendMessage) {
      this.callbacks.onSendMessage(message);
    }

    this.messageInput.value = '';
    this.messageInput.style.height = 'auto';
    this.updateSendButton();
  }

  /**
   * Actualizar estado del botón de envío
   */
  updateSendButton() {
    if (this.sendBtn) {
      this.sendBtn.disabled = !this.messageInput?.value.trim();
    }
  }

  /**
   * Agregar mensaje del usuario
   */
  addUserMessage(text) {
    this.removeWelcomeMessage();

    const messageEl = document.createElement('div');
    messageEl.className = 'message message-user';
    messageEl.setAttribute('role', 'article');
    messageEl.setAttribute('aria-label', `Tú dijiste: ${text}`);

    const time = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

    messageEl.innerHTML = `
      <div class="message-header">
        <span>Tú</span>
        <time aria-label="${time}">${time}</time>
      </div>
      <div class="message-content">
        <p>${this.escapeHtml(text)}</p>
      </div>
    `;

    this.messagesContainer?.appendChild(messageEl);
    this.scrollToBottom();
  }

  /**
   * Agregar mensaje de la IA (con streaming)
   */
  startAiMessage() {
    this.removeWelcomeMessage();
    this.removeTypingIndicator();

    const messageEl = document.createElement('div');
    messageEl.className = 'message message-ai';
    messageEl.id = 'current-ai-message';
    messageEl.setAttribute('role', 'article');
    messageEl.setAttribute('aria-label', 'Mensaje del asistente');

    const time = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

    messageEl.innerHTML = `
      <div class="message-header">
        <span>GroqAcc</span>
        <time aria-label="${time}">${time}</time>
      </div>
      <div class="message-content" id="ai-message-content"></div>
    `;

    this.messagesContainer?.appendChild(messageEl);
    this.scrollToBottom();
  }

  /**
   * Actualizar contenido del mensaje de IA (streaming)
   */
  updateAiMessage(content) {
    const contentEl = document.getElementById('ai-message-content');
    if (contentEl) {
      contentEl.innerHTML = this.formatMessage(content);
      this.scrollToBottom();
    }
  }

  /**
   * Finalizar mensaje de IA
   */
  finishAiMessage(fullContent) {
    this.lastAiMessage = fullContent;

    const messageEl = document.getElementById('current-ai-message');
    if (messageEl) {
      messageEl.removeAttribute('id');
      messageEl.setAttribute('aria-label', `Mensaje del asistente: ${fullContent.substring(0, 100)}...`);
    }

    this.speakBtn.disabled = false;
  }

  /**
   * Mostrar indicador de escritura
   */
  showTypingIndicator() {
    this.removeTypingIndicator();

    const indicator = document.createElement('div');
    indicator.className = 'typing-indicator';
    indicator.id = 'typing-indicator';
    indicator.setAttribute('aria-label', 'El asistente está escribiendo');
    indicator.innerHTML = `
      <span class="typing-dot"></span>
      <span class="typing-dot"></span>
      <span class="typing-dot"></span>
    `;

    this.messagesContainer?.appendChild(indicator);
    this.scrollToBottom();
  }

  /**
   * Remover indicador de escritura
   */
  removeTypingIndicator() {
    document.getElementById('typing-indicator')?.remove();
  }

  /**
   * Remover mensaje de bienvenida
   */
  removeWelcomeMessage() {
    this.messagesContainer?.querySelector('.welcome-message')?.remove();
  }

  /**
   * Formatear mensaje (básico: negritas, listas)
   */
  formatMessage(text) {
    let formatted = this.escapeHtml(text);

    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');

    formatted = formatted.replace(/^• (.+)$/gm, '<li>$1</li>');
    formatted = formatted.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');

    formatted = formatted.replace(/\n/g, '<br>');

    return `<p>${formatted}</p>`;
  }

  /**
   * Escape HTML
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Scroll al final
   */
  scrollToBottom() {
    if (this.messagesContainer) {
      this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
  }

  /**
   * Toggle panel de configuración
   */
  toggleSettings() {
    if (this.settingsPanel?.classList.contains('hidden')) {
      this.showSettings();
    } else {
      this.hideSettings();
    }
  }

  /**
   * Mostrar configuración
   */
  showSettings() {
    this.settingsPanel?.classList.remove('hidden');
    this.settingsBtn?.setAttribute('aria-expanded', 'true');
    document.getElementById('theme-normal')?.focus();
    if (window.app?.accessibility) {
      window.app.accessibility.announce('Panel de configuración abierto');
    }
  }

  /**
   * Ocultar configuración
   */
  hideSettings() {
    this.settingsPanel?.classList.add('hidden');
    this.settingsBtn?.setAttribute('aria-expanded', 'false');
    this.settingsBtn?.focus();
  }

  /**
   * Actualizar estado de conexión
   */
  setConnectionStatus(status, text) {
    if (this.connectionStatus) {
      this.connectionStatus.className = 'status-dot';
      if (status === 'connected') {
        this.connectionStatus.classList.add('');
      } else if (status === 'error') {
        this.connectionStatus.classList.add('error');
      } else if (status === 'connecting') {
        this.connectionStatus.classList.add('connecting');
      }
    }
    if (this.statusText) {
      this.statusText.textContent = text;
    }
  }

  /**
   * Actualizar estado del micrófono
   */
  setMicState(listening) {
    if (this.micBtn) {
      this.micBtn.setAttribute('aria-pressed', listening.toString());
      if (listening) {
        this.micBtn.classList.add('listening-indicator');
        this.micBtn.setAttribute('aria-label', 'Detener grabación');
      } else {
        this.micBtn.classList.remove('listening-indicator');
        this.micBtn.setAttribute('aria-label', 'Activar micrófono para dictado');
      }
    }
  }

  /**
   * Mostrar/ocultar transcripción
   */
  showTranscription(text) {
    if (this.transcriptionArea && this.transcriptionText) {
      this.transcriptionArea.classList.remove('hidden');
      this.transcriptionText.textContent = text;
    }
  }

  hideTranscription() {
    this.transcriptionArea?.classList.add('hidden');
  }

  /**
   * Habilitar/deshabilitar controles durante procesamiento
   */
  setProcessing(processing) {
    if (this.sendBtn) this.sendBtn.disabled = processing;
    if (this.micBtn) this.micBtn.disabled = processing;
    if (this.messageInput) this.messageInput.disabled = processing;

    if (processing) {
      this.showTypingIndicator();
    } else {
      this.removeTypingIndicator();
      this.updateSendButton();
    }
  }

  /**
   * Mostrar estado de reproducción de voz
   */
  setSpeaking(speaking) {
    if (speaking) {
      this.speakBtn.classList.add('hidden');
      this.stopBtn.classList.remove('hidden');
      this.stopBtn.disabled = false;
    } else {
      this.stopBtn.classList.add('hidden');
      this.speakBtn.classList.remove('hidden');
      this.speakBtn.disabled = !this.lastAiMessage;
    }
  }

  /**
   * Callbacks
   */
  on(event, callback) {
    if (this.callbacks.hasOwnProperty(`on${event.charAt(0).toUpperCase() + event.slice(1)}`)) {
      this.callbacks[`on${event.charAt(0).toUpperCase() + event.slice(1)}`] = callback;
    }
  }

  /**
   * Show history modal
   */
  showHistoryModal() {
    this.historyModal?.classList.remove('hidden');
    document.getElementById('close-history')?.focus();
  }

  /**
   * Hide history modal
   */
  hideHistoryModal() {
    this.historyModal?.classList.add('hidden');
    this.historyBtn?.focus();
  }

  /**
   * Show export modal
   */
  showExportModal() {
    this.exportModal?.classList.remove('hidden');
    document.getElementById('close-export')?.focus();
  }

  /**
   * Hide export modal
   */
  hideExportModal() {
    this.exportModal?.classList.add('hidden');
    this.exportBtn?.focus();
  }

  /**
   * Update history list in modal
   */
  updateHistoryList(conversations, currentId) {
    if (!this.historyList) return;

    if (!conversations || conversations.length === 0) {
      this.historyList.innerHTML = '<p class="empty-state">No hay conversaciones guardadas</p>';
      return;
    }

    this.historyList.innerHTML = conversations.map(conv => {
      const isActive = conv.id === currentId;
      const date = new Date(conv.updatedAt).toLocaleDateString('es-ES');
      return `
        <div class="history-item ${isActive ? 'active' : ''}"
             role="button"
             tabindex="0"
             data-id="${conv.id}"
             aria-label="${conv.title}, ${conv.messageCount} mensajes, ${date}">
          <div class="history-item-info">
            <div class="history-item-title">${this.escapeHtml(conv.title)}</div>
            <div class="history-item-meta">${conv.messageCount} mensajes - ${date}</div>
          </div>
          <button class="history-item-delete"
                  data-delete-id="${conv.id}"
                  aria-label="Eliminar conversación">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      `;
    }).join('');

    // Add click handlers
    this.historyList.querySelectorAll('.history-item').forEach(item => {
      item.addEventListener('click', (e) => {
        if (!e.target.closest('.history-item-delete')) {
          const id = item.dataset.id;
          if (this.callbacks.onLoadHistory) this.callbacks.onLoadHistory(id);
          this.hideHistoryModal();
        }
      });

      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          item.click();
        }
      });
    });

    this.historyList.querySelectorAll('.history-item-delete').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.deleteId;
        if (this.callbacks.onDeleteHistory) this.callbacks.onDeleteHistory(id);
      });
    });
  }

  /**
   * Set language selector
   */
  setLanguage(lang) {
    if (this.langSelect) {
      this.langSelect.value = lang;
    }
  }

  /**
   * Show offline banner
   */
  showOfflineBanner() {
    let banner = document.getElementById('offline-banner');
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'offline-banner';
      banner.className = 'offline-banner';
      banner.setAttribute('role', 'alert');
      banner.textContent = 'Sin conexión - Modo offline';
      document.querySelector('.chat-container')?.prepend(banner);
    }
    banner.classList.add('visible');
  }

  /**
   * Hide offline banner
   */
  hideOfflineBanner() {
    document.getElementById('offline-banner')?.classList.remove('visible');
  }
}

// Exportar para uso global
window.UIManager = UIManager;
