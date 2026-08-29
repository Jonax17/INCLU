/**
 * GROQACC - Aplicación Principal
 * Orquesta todos los módulos incluyendo las nuevas features
 */
class GroqAccApp {
  constructor() {
    this.groq = null;
    this.voice = null;
    this.accessibility = null;
    this.ui = null;
    this.i18n = null;
    this.history = null;
    this.exportManager = null;
    this.offline = null;
    this.tutorial = null;

    this.isProcessing = false;

    this.init();
  }

  /**
   * Inicializar aplicación
   */
  async init() {
    // Inicializar módulos base
    this.i18n = new I18nManager();
    this.history = new HistoryManager();
    this.exportManager = new ExportManager();
    this.offline = new OfflineManager();
    this.tutorial = new TutorialManager();
    this.ui = new UIManager();
    this.voice = new VoiceManager();
    this.accessibility = new AccessibilityManager();

    // Inicializar export con historial
    this.exportManager.init(this.history);

    // Configurar idioma
    this.ui.setLanguage(this.i18n.getLanguage());
    this.i18n.updateUI();

    // Crear primera conversación si no hay una activa
    if (!this.history.getCurrentId()) {
      this.history.createConversation();
    }

    // API Key
    const apiKey = this.getApiKey();
    if (apiKey) {
      this.groq = new GroqAPI(apiKey);
      await this.checkApiConnection();
    } else {
      this.ui.setConnectionStatus('error', 'API Key no configurada');
    }

    // Configurar todos los callbacks
    this.setupCallbacks();
    this.setupVoiceCallbacks();
    this.setupNewFeatureCallbacks();
    this.setupOfflineCallbacks();

    // Mostrar tutorial si es primera vez
    if (!this.tutorial.hasSeenTutorial()) {
      setTimeout(() => this.tutorial.start(), 1000);
    }

    // Cargar mensajes existentes
    this.loadCurrentConversation();

    // Anuncio inicial
    const msg = this.i18n.t('welcome') + '. Presione Alt+H para escuchar los atajos de teclado.';
    this.accessibility.announce(msg);
  }

  /**
   * Obtener API Key
   */
  getApiKey() {
    const metaTag = document.querySelector('meta[name="groq-api-key"]');
    if (metaTag) return metaTag.content;

    const stored = localStorage.getItem('groq-api-key');
    if (stored) return stored;

    if (typeof GROQ_API_KEY !== 'undefined') {
      return GROQ_API_KEY;
    }

    return prompt('Ingrese su API Key de Groq (https://console.groq.com/keys):');
  }

  /**
   * Verificar conexión con la API
   */
  async checkApiConnection() {
    this.ui.setConnectionStatus('connecting', this.i18n.t('connecting'));

    const connected = await this.groq.checkConnection();

    if (connected) {
      this.ui.setConnectionStatus('connected', this.i18n.t('connected'));
      this.accessibility.announce(this.i18n.t('connected'));
    } else {
      this.ui.setConnectionStatus('error', this.i18n.t('errorConnection'));
      this.accessibility.announce(this.i18n.t('errorConnection'), 'assertive');
    }
  }

  /**
   * Configurar callbacks de UI básicos
   */
  setupCallbacks() {
    this.ui.on('sendMessage', (message) => this.handleMessage(message));
    this.ui.on('micToggle', () => this.toggleMicrophone());
    this.ui.on('speakLast', () => this.speakLastMessage());
    this.ui.on('stopSpeak', () => this.stopSpeaking());

    this.ui.on('modelChange', (model) => {
      if (this.groq) {
        this.groq.setModel(model);
        this.accessibility.announce(`Modelo cambiado a ${model}`);
      }
    });

    this.ui.on('langChange', (lang) => {
      this.i18n.setLanguage(lang);
      this.ui.setLanguage(lang);
      this.i18n.updateUI();
      this.accessibility.announce(`Idioma cambiado a ${lang}`);
    });
  }

  /**
   * Configurar callbacks de nuevas features
   */
  setupNewFeatureCallbacks() {
    // Image upload
    this.ui.on('imageUpload', (file) => this.handleImageUpload(file));

    // Export
    this.ui.on('exportTXT', () => this.exportToTXT());
    this.ui.on('exportPDF', () => this.exportToPDF());

    // History
    this.ui.on('loadHistory', (id) => this.loadConversation(id));
    this.ui.on('newChat', () => this.newChat());
    this.ui.on('clearHistory', () => this.clearHistory());
    this.ui.on('onDeleteHistory', (id) => this.deleteConversation(id));

    // Tutorial
    this.ui.on('startTutorial', () => this.tutorial.start());

    // Tutorial callbacks
    this.tutorial.on('onComplete', () => {
      this.accessibility.announce(this.i18n.t('tutorialComplete'));
    });
  }

  /**
   * Configurar callbacks de offline
   */
  setupOfflineCallbacks() {
    this.offline.on('onOnline', () => {
      this.ui.hideOfflineBanner();
      this.ui.setConnectionStatus('connected', this.i18n.t('connected'));
      this.accessibility.announce(this.i18n.t('onlineMessage'));
    });

    this.offline.on('onOffline', () => {
      this.ui.showOfflineBanner();
      this.ui.setConnectionStatus('error', this.i18n.t('offlineTitle'));
      this.accessibility.announce(this.i18n.t('offlineMessage'), 'assertive');
    });
  }

  /**
   * Configurar callbacks de voz
   */
  setupVoiceCallbacks() {
    this.voice.on('result', (text) => {
      this.ui.messageInput.value = text;
      this.ui.updateSendButton();
      this.accessibility.announce(`Texto reconocido: ${text}`);
      this.handleMessage(text);
    });

    this.voice.on('interimResult', (text) => {
      if (this.accessibility.settings.captionsEnabled) {
        this.ui.showTranscription(text);
      }
    });

    this.voice.on('start', () => {
      this.ui.setMicState(true);
      this.accessibility.announce(this.i18n.t('listening'));
    });

    this.voice.on('end', () => {
      this.ui.setMicState(false);
      this.ui.hideTranscription();
    });

    this.voice.on('error', (error) => {
      this.ui.setMicState(false);
      let message = this.i18n.t('micError');
      if (error === 'not-allowed') {
        message = this.i18n.t('micDenied');
      } else if (error === 'no-speech') {
        message = this.i18n.t('noSpeech');
      }
      this.accessibility.showVisualAlert(message, 'error');
      this.accessibility.announce(message, 'assertive');
    });

    this.voice.on('speakStart', () => {
      this.ui.setSpeaking(true);
    });

    this.voice.on('speakEnd', () => {
      this.ui.setSpeaking(false);
    });
  }

  /**
   * Manejar mensaje del usuario
   */
  async handleMessage(message) {
    if (this.isProcessing || !message.trim()) return;

    // Guardar en historial
    this.history.addMessage('user', message);

    // Si no hay API key o estamos offline, usar respuestas offline
    if (!this.groq || !this.offline.isOnline) {
      this.handleOfflineMessage(message);
      return;
    }

    this.isProcessing = true;
    this.ui.addUserMessage(message);
    this.ui.setProcessing(true);
    this.accessibility.announce(this.i18n.t('processing'));

    try {
      this.ui.startAiMessage();

      let fullResponse = '';
      await this.groq.chat(message, (chunk, full) => {
        fullResponse = full;
        this.ui.updateAiMessage(full);
      });

      this.ui.finishAiMessage(fullResponse);

      // Guardar respuesta en historial
      this.history.addMessage('assistant', fullResponse);

      this.accessibility.announce(this.i18n.t('responseReceived'));

      if (this.accessibility.settings.autoSpeak) {
        await this.speakText(fullResponse);
      }

    } catch (error) {
      console.error('Error:', error);
      const errorMessage = `Error: ${error.message}`;
      this.accessibility.showVisualAlert(errorMessage, 'error');
      this.accessibility.announce(errorMessage, 'assertive');

      const errorMsg = 'Error al procesar mensaje. Intenta de nuevo.';
      this.ui.updateAiMessage(errorMsg);
      this.ui.finishAiMessage(errorMsg);

    } finally {
      this.isProcessing = false;
      this.ui.setProcessing(false);
    }
  }

  /**
   * Manejar mensaje offline
   */
  handleOfflineMessage(message) {
    this.ui.addUserMessage(message);
    this.ui.setProcessing(true);

    setTimeout(() => {
      const response = this.offline.getResponse(message);

      this.ui.startAiMessage();
      this.ui.updateAiMessage(response);
      this.ui.finishAiMessage(response);

      this.history.addMessage('assistant', response);

      this.ui.setProcessing(false);

      if (this.accessibility.settings.autoSpeak) {
        this.speakText(response);
      }
    }, 500);
  }

  /**
   * Manejar upload de imagen
   */
  async handleImageUpload(file) {
    if (!file || !file.type.startsWith('image/')) {
      this.accessibility.showVisualAlert('Por favor, selecciona una imagen válida', 'error');
      return;
    }

    if (!this.groq) {
      this.accessibility.showVisualAlert(this.i18n.t('apiKeyRequired'), 'error');
      return;
    }

    this.isProcessing = true;
    this.ui.setProcessing(true);
    this.accessibility.announce(this.i18n.t('describingImage'));

    try {
      const base64 = await this.fileToBase64(file);
      const description = await this.groq.describeImage(base64);

      // Agregar al chat
      const imageMsg = `[Imagen: ${file.name}]`;
      this.history.addMessage('user', imageMsg);
      this.ui.addUserMessage(imageMsg);

      this.ui.startAiMessage();
      this.ui.updateAiMessage(description);
      this.ui.finishAiMessage(description);

      this.history.addMessage('assistant', description);

      if (this.accessibility.settings.autoSpeak) {
        await this.speakText(description);
      }

    } catch (error) {
      console.error('Error describiendo imagen:', error);
      this.accessibility.showVisualAlert(this.i18n.t('imageError'), 'error');

    } finally {
      this.isProcessing = false;
      this.ui.setProcessing(false);
      if (this.ui.imageInput) this.ui.imageInput.value = '';
    }
  }

  /**
   * Convertir archivo a base64
   */
  fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /**
   * Exportar a TXT
   */
  exportToTXT() {
    const id = this.history.getCurrentId();
    if (id && this.exportManager.exportToTXT(id)) {
      this.accessibility.announce('Chat exportado como TXT');
    } else {
      this.accessibility.showVisualAlert(this.i18n.t('exportError'), 'error');
    }
  }

  /**
   * Exportar a PDF
   */
  exportToPDF() {
    const id = this.history.getCurrentId();
    if (id && this.exportManager.exportToPDF(id)) {
      this.accessibility.announce('Chat exportado como PDF');
    } else {
      this.accessibility.showVisualAlert(this.i18n.t('exportError'), 'error');
    }
  }

  /**
   * Cargar conversación del historial
   */
  loadConversation(id) {
    const conv = this.history.loadConversation(id);
    if (conv) {
      // Limpiar chat actual
      this.ui.messagesContainer.innerHTML = '';

      // Recargar mensajes
      conv.messages.forEach(msg => {
        if (msg.role === 'user') {
          this.ui.addUserMessage(msg.content);
        } else {
          this.ui.startAiMessage();
          this.ui.updateAiMessage(msg.content);
          this.ui.finishAiMessage(msg.content);
        }
      });

      this.accessibility.announce(this.i18n.t('historyLoaded'));
    }
  }

  /**
   * Cargar conversación actual al iniciar
   */
  loadCurrentConversation() {
    const conv = this.history.getCurrentConversation();
    if (conv && conv.messages.length > 0) {
      conv.messages.forEach(msg => {
        if (msg.role === 'user') {
          this.ui.addUserMessage(msg.content);
        } else {
          this.ui.startAiMessage();
          this.ui.updateAiMessage(msg.content);
          this.ui.finishAiMessage(msg.content);
        }
      });
    }
  }

  /**
   * Nueva conversación
   */
  newChat() {
    this.history.createConversation();
    this.ui.messagesContainer.innerHTML = '';
    this.accessibility.announce(this.i18n.t('historyLoaded'));
  }

  /**
   * Limpiar historial
   */
  clearHistory() {
    if (confirm('¿Estás seguro de que quieres limpiar todo el historial?')) {
      this.history.clearAll();
      this.history.createConversation();
      this.ui.messagesContainer.innerHTML = '';
      this.accessibility.announce(this.i18n.t('historyCleared'));
    }
  }

  /**
   * Eliminar conversación
   */
  deleteConversation(id) {
    this.history.deleteConversation(id);
    if (this.history.getAllConversations().length === 0) {
      this.history.createConversation();
    }
    this.ui.updateHistoryList(
      this.history.getAllConversations(),
      this.history.getCurrentId()
    );
  }

  /**
   * Toggle micrófono
   */
  async toggleMicrophone() {
    if (this.voice.isListening) {
      const audioBlob = await this.voice.stopListening();
      this.ui.setMicState(false);

      if (audioBlob && audioBlob.size > 0) {
        await this.processAudioInput(audioBlob);
      }
    } else {
      const support = VoiceManager.getSupport();
      if (!support.mediaDevices) {
        this.accessibility.showVisualAlert('Los dispositivos de audio no están disponibles', 'error');
        return;
      }
      await this.voice.startListening();
    }
  }

  /**
   * Procesar audio grabado con Whisper
   */
  async processAudioInput(audioBlob) {
    if (!this.groq) {
      this.accessibility.showVisualAlert(this.i18n.t('apiKeyRequired'), 'error');
      return;
    }

    this.ui.setProcessing(true);
    this.accessibility.announce('Procesando audio...');

    try {
      const result = await this.groq.transcribeAudio(audioBlob, 'es');
      const text = result.text;

      if (text && text.trim()) {
        this.accessibility.announce(`Audio transcrito: ${text}`);
        await this.handleMessage(text);
      } else {
        this.accessibility.showVisualAlert(this.i18n.t('noAudioDetected'), 'warning');
      }

    } catch (error) {
      console.error('Error de transcripción:', error);
      this.accessibility.showVisualAlert(this.i18n.t('transcriptionError'), 'error');

    } finally {
      this.ui.setProcessing(false);
    }
  }

  /**
   * Leer último mensaje en voz alta
   */
  async speakLastMessage() {
    const text = this.ui.lastAiMessage;
    if (!text) return;
    await this.speakText(text);
  }

  /**
   * Leer texto con Groq TTS o Web Speech API
   */
  async speakText(text) {
    if (!text) return;

    const cleanText = text.replace(/[*_`#\[\]]/g, '').replace(/\n+/g, '. ');

    if (this.groq && this.groq.apiKey && this.offline.isOnline) {
      try {
        this.ui.setSpeaking(true);
        this.accessibility.announce(this.i18n.t('playingResponse'));

        const audioBlob = await this.groq.textToSpeech(cleanText, {
          voice: 'troy',
          speed: this.accessibility.settings.speechRate
        });

        const url = URL.createObjectURL(audioBlob);
        const audio = new Audio(url);

        audio.onended = () => {
          URL.revokeObjectURL(url);
          this.ui.setSpeaking(false);
        };

        audio.onerror = () => {
          URL.revokeObjectURL(url);
          this.ui.setSpeaking(false);
          this.fallbackSpeak(cleanText);
        };

        await audio.play();

      } catch (error) {
        console.warn('Error con Groq TTS, usando fallback:', error);
        this.fallbackSpeak(cleanText);
      }
    } else {
      this.fallbackSpeak(cleanText);
    }
  }

  /**
   * Fallback con Web Speech API
   */
  async fallbackSpeak(text) {
    try {
      this.ui.setSpeaking(true);
      await this.voice.speak(text, {
        rate: this.accessibility.settings.speechRate
      });
    } catch (error) {
      console.error('Error en síntesis de voz:', error);
      this.ui.setSpeaking(false);
    }
  }

  /**
   * Detener reproducción de voz
   */
  stopSpeaking() {
    this.voice.stopSpeaking();
    this.ui.setSpeaking(false);
  }
}

// Iniciar aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  window.app = new GroqAccApp();
});
