/**
 * GROQACC - Respuestas Predefinidas Offline
 * Respuestas cuando no hay conexión a internet
 */
const OFFLINE_RESPONSES = {
  greeting: [
    '¡Hola! Soy INCLU, tu asistente de IA para inclusión digital. Actualmente estoy en modo offline, pero puedo ayudarte con información básica sobre accesibilidad.',
    'Bienvenido. Estás usando INCLU en modo offline. Mis respuestas serán predefinidas pero útiles.',
    '¡Hola! Noto que no tienes conexión a internet. Puedo ayudarte con información sobre discapacidad y accesibilidad mientras tanto.'
  ],

  help: [
    'Puedo ayudarte con:\n• Información sobre accesibilidad y discapacidad\n• Consejos para usar tecnologías asistivas\n• Datos generales de interés\n\nPara funciones completas de IA, necesitas conexión a internet.',
    'En modo offline con INCLU puedo:\n• Responder preguntas frecuentes sobre inclusión\n• Dar información sobre discapacidad y accesibilidad\n• Proporcionar consejos de productividad\n\nConéctate a internet para usar la IA completa.'
  ],

  accessibility: [
    'La accesibilidad digital busca que todas las personas puedan usar la tecnología, independientemente de sus capacidades.\n\nPrincipios clave:\n• Perceptible: La información debe ser presentable de formas que todos puedan percibir\n• Operable: La interfaz debe ser operable por todas las personas\n• Comprensible: La información y operación deben ser comprensibles\n• Robusta: El contenido debe ser interpretado por diversas tecnologías asistivas',
    'Consejos de accesibilidad:\n\n1. Usa lectores de pantalla como NVDA o VoiceOver\n2. Configura alto contraste en tu sistema\n3. Usa atajos de teclado para navegar\n4. Ajusta el tamaño del texto según tus necesidades\n5. Activa subtítulos en contenido multimedia'
  ],

  screenReaders: [
    'Lectores de pantalla populares:\n\n• NVDA (Windows) - Gratuito y de código abierto\n• JAWS (Windows) - Comercial, muy completo\n• VoiceOver (macOS/iOS) - Integrado en Apple\n• TalkBack (Android) - Integrado en Google\n\nTodos funcionan con GroqAcc para leer las respuestas en voz alta.',
    'Consejos para usar lectores de pantalla:\n\n1. Aprende los atajos de teclado básicos\n2. Personaliza la velocidad de lectura\n3. Usa el modo exploración para navegar\n4. Practica con aplicaciones accesibles como esta'
  ],

  keyboard: [
    'Atajos de teclado útiles:\n\nGeneral:\n• Tab: Siguiente elemento\n• Shift+Tab: Elemento anterior\n• Enter: Activar botón\n• Escape: Cerrar paneles\n\nGroqAcc:\n• Alt+M: Activar micrófono\n• Alt+S: Leer respuesta\n• Alt+H: Ayuda',
    'La navegación por teclado es esencial para personas con discapacidades motoras o visuales. Practica estos atajos para ser más eficiente.'
  ],

  vision: [
    'Tecnologías para personas con discapacidad visual:\n\n1. Lectores de pantalla (NVDA, JAWS, VoiceOver)\n2. Lupas digitales (ZoomText, lupa del sistema)\n3. Pantallas en braille (Braille Display)\n4. Asistentes de voz (Siri, Alexa, GroqAcc)\n\nGroqAcc está diseñado para funcionar con todas estas tecnologías.',
    'Consejos para baja visión:\n\n• Usa modo alto contraste (configuración de GroqAcc)\n• Aumenta el tamaño del texto\n• Usa voz para escuchar respuestas\n• Configura iluminación adecuada en tu espacio'
  ],

  hearing: [
    'Tecnologías para personas con discapacidad auditiva:\n\n1. Subtítulos y transcripciones\n2. Indicadores visuales de sonido\n3. Dispositivos de asistencia auditiva\n4. Comunicación por texto\n\nGroqAcc ofrece transcripción en tiempo real y alertas visuales.',
    'Consejos para discapacidad auditiva:\n\n• Activa subtítulos en todos los dispositivos\n• Usa indicadores visuales para notificaciones\n• Configura alertas vibrantes en tu teléfono\n• Preferir comunicación por texto cuando sea posible'
  ],

  general: [
    'Esa es una pregunta interesante. En modo offline, mi información es limitada.\n\nPara obtener una respuesta completa de la IA, necesitas conexión a internet. Mientras tanto, puedo ayudarte con temas de accesibilidad y productividad.',
    'No tengo acceso a información en tiempo real en modo offline.\n\n¿Hay algo sobre accesibilidad, tecnología asistiva o productividad en lo que pueda ayudarte?'
  ],

  thanks: [
    '¡De nada! Me alegra poder ayudar.\n\nRecuerda que para funciones completas de IA, necesitas conexión a internet. ¡Estoy aquí para ayudarte!',
    'Con gusto. Si necesitas más ayuda, no dudes en preguntar.\n\nEn modo offline, puedo asistirte con información general sobre accesibilidad y productividad.'
  ],

  weather: [
    'En modo offline no puedo obtener el clima en tiempo real.\n\nTe sugiero usar una aplicación del clima o buscar en línea cuando tengas conexión.',
  ],

  time: [
    () => {
      const now = new Date();
      return `Son las ${now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} del ${now.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.`;
    }
  ],

  joke: [
    '¿Por qué los programadores prefieren el modo oscuro?\n\nPorque la luz atrae a los bugs.\n\n(Sería mejor con conexión para contar chistes más personalizados)',
    'Un programador entra a un bar.\n\nEl barman pregunta: "¿Qué quieres beber?"\n\nEl programador responde: "¿Por qué no?="' 
  ]
};

/**
 * GROQACC - Gestor de Modo Offline
 * Detecta conexión y maneja respuestas offline
 */
class OfflineManager {
  constructor() {
    this.isOnline = navigator.onLine;
    this.callbacks = {
      onStatusChange: null,
      onOnline: null,
      onOffline: null
    };

    this.initEventListeners();
  }

  /**
   * Inicializar listeners de conexión
   */
  initEventListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      if (this.callbacks.onStatusChange) {
        this.callbacks.onStatusChange(true);
      }
      if (this.callbacks.onOnline) {
        this.callbacks.onOnline();
      }
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      if (this.callbacks.onStatusChange) {
        this.callbacks.onStatusChange(false);
      }
      if (this.callbacks.onOffline) {
        this.callbacks.onOffline();
      }
    });
  }

  /**
   * Obtener respuesta predefinida basada en el mensaje
   */
  getResponse(userMessage) {
    const message = userMessage.toLowerCase().trim();

    // Detectar intención del mensaje
    if (this.matchesAny(message, ['hola', 'hello', 'buenos', 'buenas', 'saludos'])) {
      return this.randomFrom(OFFLINE_RESPONSES.greeting);
    }

    if (this.matchesAny(message, ['ayuda', 'help', 'qué puedes', 'que puedes', 'funciones'])) {
      return this.randomFrom(OFFLINE_RESPONSES.help);
    }

    if (this.matchesAny(message, ['accesibilidad', 'accessibility', 'accesible'])) {
      return this.randomFrom(OFFLINE_RESPONSES.accessibility);
    }

    if (this.matchesAny(message, ['pantalla', 'screen', 'lector', 'nvda', 'jaws', 'voiceover'])) {
      return this.randomFrom(OFFLINE_RESPONSES.screenReaders);
    }

    if (this.matchesAny(message, ['teclado', 'keyboard', 'atajo', 'shortcut', 'navegar'])) {
      return this.randomFrom(OFFLINE_RESPONSES.keyboard);
    }

    if (this.matchesAny(message, ['ver', 'visual', 'ojo', 'vista', 'ciego', 'ceguera', 'baja visión'])) {
      return this.randomFrom(OFFLINE_RESPONSES.vision);
    }

    if (this.matchesAny(message, ['oído', 'oir', 'auditivo', 'sordo', 'sordera', 'baila'])) {
      return this.randomFrom(OFFLINE_RESPONSES.hearing);
    }

    if (this.matchesAny(message, ['gracias', 'thanks', 'thank'])) {
      return this.randomFrom(OFFLINE_RESPONSES.thanks);
    }

    if (this.matchesAny(message, ['clima', 'weather', 'tiempo', 'lluvia'])) {
      return this.randomFrom(OFFLINE_RESPONSES.weather);
    }

    if (this.matchesAny(message, ['hora', 'time', 'qué hora', 'que hora'])) {
      const response = OFFLINE_RESPONSES.time[0];
      return response();
    }

    if (this.matchesAny(message, ['chiste', 'joke', 'reír', 'reir'])) {
      return this.randomFrom(OFFLINE_RESPONSES.joke);
    }

    return this.randomFrom(OFFLINE_RESPONSES.general);
  }

  /**
   * Verificar si el mensaje coincide con alguna palabra clave
   */
  matchesAny(text, keywords) {
    return keywords.some(keyword => text.includes(keyword));
  }

  /**
   * Obtener elemento aleatorio de un array
   */
  randomFrom(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  /**
   * Configurar callbacks
   */
  on(event, callback) {
    if (this.callbacks.hasOwnProperty(`on${event.charAt(0).toUpperCase() + event.slice(1)}`)) {
      this.callbacks[`on${event.charAt(0).toUpperCase() + event.slice(1)}`] = callback;
    }
  }
}

// Exportar para uso global
window.OfflineManager = OfflineManager;
window.OFFLINE_RESPONSES = OFFLINE_RESPONSES;
