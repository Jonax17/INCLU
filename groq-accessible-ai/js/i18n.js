/**
 * GROQACC - Sistema de Internacionalización (i18n)
 * Soporte para Español, Inglés y Portugués
 */
class I18nManager {
  constructor() {
    this.currentLang = 'es';
    this.translations = {
      es: {
        // UI General
        appName: 'INCLU',
        tagline: 'Inclusión Digital con Inteligencia Artificial',
        welcome: 'Bienvenido a INCLU',
        welcomeDesc: 'Tu asistente de IA para inclusión digital. Puede escribir un mensaje o usar el micrófono para hablar.',
        shortcuts: 'Atajos de teclado:',
        send: 'Enviar',
        typeMessage: 'Escriba su mensaje o presione el micrófono para hablar...',
        writing: 'Escribiendo...',

        // Botones
        micLabel: 'Activar micrófono para dictado',
        micRecording: 'Detener grabación',
        speakLabel: 'Leer última respuesta en voz alta',
        stopLabel: 'Detener reproducción de voz',
        sendLabel: 'Enviar mensaje',
        settingsLabel: 'Configuración de accesibilidad',
        closeSettings: 'Cerrar configuración',

        // Estados
        connected: 'Conectado',
        connecting: 'Conectando...',
        errorConnection: 'Error de conexión',
        processing: 'Procesando mensaje...',
        responseReceived: 'Respuesta recibida del asistente',
        playingResponse: 'Reproduciendo respuesta...',
        listening: 'Micrófono activado. Escuchando...',

        // Configuración
        accessibilitySettings: 'Configuración de Accesibilidad',
        displayMode: 'Modo de visualización',
        normal: 'Normal',
        darkMode: 'Modo oscuro',
        highContrast: 'Alto contraste',
        voiceAudio: 'Voz y audio',
        autoSpeak: 'Leer respuestas automáticamente',
        visualAlerts: 'Alertas visuales para sonidos',
        showCaptions: 'Mostrar transcripción en tiempo real',
        speechRate: 'Velocidad de lectura',
        textSize: 'Tamaño de texto',
        aiModel: 'Modelo de IA',
        saveSettings: 'Guardar configuración',
        resetSettings: 'Restablecer valores',
        settingsSaved: 'Configuración guardada',
        settingsReset: 'Configuración restablecida a valores predeterminados',

        // Herramientas
        imageDescription: 'Describir imagen',
        exportChat: 'Exportar chat',
        exportTXT: 'Exportar como TXT',
        exportPDF: 'Exportar como PDF',
        chatHistory: 'Historial de chat',
        newChat: 'Nueva conversación',
        clearHistory: 'Limpiar historial',
        historySaved: 'Conversación guardada',
        historyLoaded: 'Conversación cargada',
        historyCleared: 'Historial limpiado',
        noHistory: 'No hay conversaciones guardadas',

        // Tutorial
        tutorial: 'Tutorial',
        startTutorial: 'Iniciar tutorial',
        tutorialStep1: 'Escribe tu mensaje aquí',
        tutorialStep2: 'Presiona para hablar',
        tutorialStep3: 'Lee la última respuesta',
        tutorialStep4: 'Configura tu experiencia',
        tutorialStep5: 'Describe imágenes para obtener información visual',
        tutorialSkip: 'Saltar tutorial',
        tutorialNext: 'Siguiente',
        tutorialPrev: 'Anterior',
        tutorialFinish: '¡Listo!',
        tutorialComplete: 'Tutorial completado. ¡Ya puedes usar INCLU!',

        // Errores
        apiKeyRequired: 'Para usar la aplicación, configure su API Key de Groq',
        micError: 'Error de reconocimiento de voz',
        micDenied: 'Permiso de micrófono denegado. Habilite el acceso en la configuración del navegador.',
        noSpeech: 'No se detectó voz. Intente de nuevo.',
        transcriptionError: 'Error al transcribir el audio',
        noAudioDetected: 'No se detectó voz en el audio',
        imageError: 'Error al describir la imagen',
        exportError: 'Error al exportar el chat',
        offlineMode: 'Modo offline - Usando respuestas predefinidas',

        // Imagen
        uploadImage: 'Subir imagen para describir',
        dragDropImage: 'Arrastra una imagen aquí o haz clic para seleccionar',
        describingImage: 'Describiendo imagen...',
        imageDescriptionResult: 'Descripción de la imagen:',

        // Offline
        offlineTitle: 'Sin conexión',
        offlineMessage: 'Estás en modo offline. Las respuestas serán predefinidas.',
        onlineMessage: 'Conexión restaurada. Modo online activado.',

        // Atajos
        shortcutsHelp: `Atajos de teclado disponibles:
Alt + M para activar o desactivar el micrófono.
Alt + S para leer la última respuesta.
Alt + H para escuchar esta ayuda.
Escape para cerrar paneles.
Enter para enviar mensajes.
Shift + Enter para nueva línea.`,

        // Time
        youSaid: 'Tú dijiste',
        assistantSaid: 'Mensaje del asistente',
        timePrefix: 'a las'
      },

      en: {
        appName: 'INCLU',
        tagline: 'Digital Inclusion with Artificial Intelligence',
        welcome: 'Welcome to INCLU',
        welcomeDesc: 'Your AI assistant for digital inclusion. You can type a message or use the microphone to speak.',
        shortcuts: 'Keyboard shortcuts:',
        send: 'Send',
        typeMessage: 'Type your message or press the microphone to speak...',
        writing: 'Writing...',

        micLabel: 'Activate microphone for dictation',
        micRecording: 'Stop recording',
        speakLabel: 'Read last response aloud',
        stopLabel: 'Stop voice playback',
        sendLabel: 'Send message',
        settingsLabel: 'Accessibility settings',
        closeSettings: 'Close settings',

        connected: 'Connected',
        connecting: 'Connecting...',
        errorConnection: 'Connection error',
        processing: 'Processing message...',
        responseReceived: 'Response received from assistant',
        playingResponse: 'Playing response...',
        listening: 'Microphone activated. Listening...',

        accessibilitySettings: 'Accessibility Settings',
        displayMode: 'Display mode',
        normal: 'Normal',
        darkMode: 'Dark mode',
        highContrast: 'High contrast',
        voiceAudio: 'Voice and audio',
        autoSpeak: 'Read responses automatically',
        visualAlerts: 'Visual alerts for sounds',
        showCaptions: 'Show real-time transcription',
        speechRate: 'Reading speed',
        textSize: 'Text size',
        aiModel: 'AI Model',
        saveSettings: 'Save settings',
        resetSettings: 'Reset values',
        settingsSaved: 'Settings saved',
        settingsReset: 'Settings reset to default values',

        imageDescription: 'Describe image',
        exportChat: 'Export chat',
        exportTXT: 'Export as TXT',
        exportPDF: 'Export as PDF',
        chatHistory: 'Chat history',
        newChat: 'New conversation',
        clearHistory: 'Clear history',
        historySaved: 'Conversation saved',
        historyLoaded: 'Conversation loaded',
        historyCleared: 'History cleared',
        noHistory: 'No saved conversations',

        tutorial: 'Tutorial',
        startTutorial: 'Start tutorial',
        tutorialStep1: 'Type your message here',
        tutorialStep2: 'Press to speak',
        tutorialStep3: 'Read the last response',
        tutorialStep4: 'Configure your experience',
        tutorialStep5: 'Describe images to get visual information',
        tutorialSkip: 'Skip tutorial',
        tutorialNext: 'Next',
        tutorialPrev: 'Previous',
        tutorialFinish: 'Ready!',
        tutorialComplete: 'Tutorial completed. You can now use INCLU!',

        apiKeyRequired: 'To use the application, configure your Groq API Key',
        micError: 'Voice recognition error',
        micDenied: 'Microphone permission denied. Enable access in browser settings.',
        noSpeech: 'No speech detected. Try again.',
        transcriptionError: 'Error transcribing audio',
        noAudioDetected: 'No voice detected in audio',
        imageError: 'Error describing the image',
        exportError: 'Error exporting chat',
        offlineMode: 'Offline mode - Using predefined responses',

        uploadImage: 'Upload image to describe',
        dragDropImage: 'Drag an image here or click to select',
        describingImage: 'Describing image...',
        imageDescriptionResult: 'Image description:',

        offlineTitle: 'No connection',
        offlineMessage: 'You are in offline mode. Responses will be predefined.',
        onlineMessage: 'Connection restored. Online mode activated.',

        shortcutsHelp: `Available keyboard shortcuts:
Alt + M to toggle microphone.
Alt + S to read the last response.
Alt + H to hear this help.
Escape to close panels.
Enter to send messages.
Shift + Enter for new line.`,

        youSaid: 'You said',
        assistantSaid: 'Assistant message',
        timePrefix: 'at'
      },

      pt: {
        appName: 'INCLU',
        tagline: 'Inclusão Digital com Inteligência Artificial',
        welcome: 'Bem-vindo ao INCLU',
        welcomeDesc: 'Seu assistente de IA para inclusão digital. Você pode digitar uma mensagem ou usar o microfone para falar.',
        shortcuts: 'Atalhos de teclado:',
        send: 'Enviar',
        typeMessage: 'Digite sua mensagem ou pressione o microfone para falar...',
        writing: 'Escrevendo...',

        micLabel: 'Ativar microfone para ditado',
        micRecording: 'Parar gravação',
        speakLabel: 'Ler última resposta em voz alta',
        stopLabel: 'Parar reprodução de voz',
        sendLabel: 'Enviar mensagem',
        settingsLabel: 'Configurações de acessibilidade',
        closeSettings: 'Fechar configurações',

        connected: 'Conectado',
        connecting: 'Conectando...',
        errorConnection: 'Erro de conexão',
        processing: 'Processando mensagem...',
        responseReceived: 'Resposta recebida do assistente',
        playingResponse: 'Reproduzindo resposta...',
        listening: 'Microfone ativado. Ouvindo...',

        accessibilitySettings: 'Configurações de Acessibilidade',
        displayMode: 'Modo de exibição',
        normal: 'Normal',
        darkMode: 'Modo escuro',
        highContrast: 'Alto contraste',
        voiceAudio: 'Voz e áudio',
        autoSpeak: 'Ler respostas automaticamente',
        visualAlerts: 'Alertas visuais para sons',
        showCaptions: 'Mostrar transcrição em tempo real',
        speechRate: 'Velocidade de leitura',
        textSize: 'Tamanho do texto',
        aiModel: 'Modelo de IA',
        saveSettings: 'Salvar configurações',
        resetSettings: 'Redefinir valores',
        settingsSaved: 'Configurações salvas',
        settingsReset: 'Configurações redefinidas para valores padrão',

        imageDescription: 'Descrever imagem',
        exportChat: 'Exportar conversa',
        exportTXT: 'Exportar como TXT',
        exportPDF: 'Exportar como PDF',
        chatHistory: 'Histórico de conversas',
        newChat: 'Nova conversa',
        clearHistory: 'Limpar histórico',
        historySaved: 'Conversa salva',
        historyLoaded: 'Conversa carregada',
        historyCleared: 'Histórico limpo',
        noHistory: 'Nenhuma conversa salva',

        tutorial: 'Tutorial',
        startTutorial: 'Iniciar tutorial',
        tutorialStep1: 'Digite sua mensagem aqui',
        tutorialStep2: 'Pressione para falar',
        tutorialStep3: 'Leia a última resposta',
        tutorialStep4: 'Configure sua experiência',
        tutorialStep5: 'Descreva imagens para obter informações visuais',
        tutorialSkip: 'Pular tutorial',
        tutorialNext: 'Próximo',
        tutorialPrev: 'Anterior',
        tutorialFinish: 'Pronto!',
        tutorialComplete: 'Tutorial concluído. Você pode usar o INCLU!',

        apiKeyRequired: 'Para usar o应用, configure sua Chave API do Groq',
        micError: 'Erro de reconhecimento de voz',
        micDenied: 'Permissão de microfone negada. Habilite o acesso nas configurações do navegador.',
        noSpeech: 'Nenhuma voz detectada. Tente novamente.',
        transcriptionError: 'Erro ao transcrever áudio',
        noAudioDetected: 'Nenhuma voz detectada no áudio',
        imageError: 'Erro ao descrever a imagem',
        exportError: 'Erro ao exportar conversa',
        offlineMode: 'Modo offline - Usando respostas predefinidas',

        uploadImage: 'Carregar imagem para descrever',
        dragDropImage: 'Arraste uma imagem aqui ou clique para selecionar',
        describingImage: 'Descrevendo imagem...',
        imageDescriptionResult: 'Descrição da imagem:',

        offlineTitle: 'Sem conexão',
        offlineMessage: 'Você está no modo offline. As respostas serão predefinidas.',
        onlineMessage: 'Conexão restaurada. Modo online ativado.',

        shortcutsHelp: `Atalhos de teclado disponíveis:
Alt + M para ativar/desativar o microfone.
Alt + S para ler a última resposta.
Alt + H para ouvir esta ajuda.
Escape para fechar painéis.
Enter para enviar mensagens.
Shift + Enter para nova linha.`,

        youSaid: 'Você disse',
        assistantSaid: 'Mensagem do assistente',
        timePrefix: 'às'
      }
    };

    this.loadLanguage();
  }

  /**
   * Cargar idioma guardado
   */
  loadLanguage() {
    const saved = localStorage.getItem('groqacc-lang');
    if (saved && this.translations[saved]) {
      this.currentLang = saved;
    }
  }

  /**
   * Obtener traducción
   */
  t(key) {
    return this.translations[this.currentLang]?.[key] ||
           this.translations['es']?.[key] ||
           key;
  }

  /**
   * Cambiar idioma
   */
  setLanguage(lang) {
    if (this.translations[lang]) {
      this.currentLang = lang;
      localStorage.setItem('groqacc-lang', lang);
      this.updateUI();
      return true;
    }
    return false;
  }

  /**
   * Obtener idioma actual
   */
  getLanguage() {
    return this.currentLang;
  }

  /**
   * Obtener todos los idiomas disponibles
   */
  getAvailableLanguages() {
    return [
      { code: 'es', name: 'Español', flag: '🇪🇸' },
      { code: 'en', name: 'English', flag: '🇺🇸' },
      { code: 'pt', name: 'Português', flag: '🇧🇷' }
    ];
  }

  /**
   * Actualizar todos los textos de la UI
   */
  updateUI() {
    // Header
    this.updateElement('#header-title', this.t('appName'));
    this.updateElement('.tagline', this.t('tagline'));

    // Chat
    this.updateElement('.welcome-message h3', this.t('welcome'));
    this.updateElement('.welcome-message p:first-of-type', this.t('welcomeDesc'));
    this.updateElement('.welcome-message strong', this.t('shortcuts'));

    // Botones
    this.updateAriaLabel('#mic-btn', this.t('micLabel'));
    this.updateAriaLabel('#speak-btn', this.t('speakLabel'));
    this.updateAriaLabel('#stop-btn', this.t('stopLabel'));
    this.updateAriaLabel('#send-btn', this.t('sendLabel'));
    this.updateAriaLabel('#settings-btn', this.t('settingsLabel'));

    // Input
    this.updatePlaceholder('#message-input', this.t('typeMessage'));

    // Configuración
    this.updateElement('.settings-header h2', this.t('accessibilitySettings'));
    this.updateElement('legend:has(#theme-normal)', this.t('displayMode'));
    this.updateElement('label[for="theme-normal"]', this.t('normal'));
    this.updateElement('label[for="theme-dark"]', this.t('darkMode'));
    this.updateElement('label[for="theme-high-contrast"]', this.t('highContrast'));
    this.updateElement('label[for="auto-speak"]', this.t('autoSpeak'));
    this.updateElement('label[for="visual-alerts"]', this.t('visualAlerts'));
    this.updateElement('label[for="captions-enabled"]', this.t('showCaptions'));
    this.updateElement('#save-settings', this.t('saveSettings'));
    this.updateElement('#reset-settings', this.t('resetSettings'));

    // Botones de herramientas
    this.updateElement('#image-btn', this.t('imageDescription'));
    this.updateElement('#export-btn', this.t('exportChat'));
    this.updateElement('#history-btn', this.t('chatHistory'));
    this.updateElement('#tutorial-btn', this.t('tutorial'));

    // Notificaciones de estado
    const statusEl = document.getElementById('status-text');
    if (statusEl) {
      const currentText = statusEl.textContent;
      if (currentText === 'Conectado' || currentText === 'Connected' || currentText === 'Conectado') {
        statusEl.textContent = this.t('connected');
      }
    }
  }

  /**
   * Actualizar texto de un elemento
   */
  updateElement(selector, text) {
    const el = document.querySelector(selector);
    if (el) el.textContent = text;
  }

  /**
   * Actualizar aria-label
   */
  updateAriaLabel(selector, label) {
    const el = document.querySelector(selector);
    if (el) el.setAttribute('aria-label', label);
  }

  /**
   * Actualizar placeholder
   */
  updatePlaceholder(selector, placeholder) {
    const el = document.querySelector(selector);
    if (el) el.placeholder = placeholder;
  }
}

// Exportar para uso global
window.I18nManager = I18nManager;
