/**
 * GROQACC - Módulo de Voz
 * Web Speech API para reconocimiento y síntesis de voz
 */
class VoiceManager {
  constructor() {
    this.recognition = null;
    this.synthesis = window.speechSynthesis;
    this.isListening = false;
    this.isSpeaking = false;
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.settings = {
      language: 'es-ES',
      rate: 1.0,
      pitch: 1.0,
      volume: 1.0
    };

    this.callbacks = {
      onResult: null,
      onInterimResult: null,
      onStart: null,
      onEnd: null,
      onError: null,
      onSpeakStart: null,
      onSpeakEnd: null
    };

    this.initRecognition();
  }

  /**
   * Inicializar reconocimiento de voz
   */
  initRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn('Reconocimiento de voz no soportado en este navegador');
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.lang = this.settings.language;
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.maxAlternatives = 1;

    this.recognition.onstart = () => {
      this.isListening = true;
      if (this.callbacks.onStart) this.callbacks.onStart();
    };

    this.recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      if (interimTranscript && this.callbacks.onInterimResult) {
        this.callbacks.onInterimResult(interimTranscript);
      }

      if (finalTranscript && this.callbacks.onResult) {
        this.callbacks.onResult(finalTranscript);
      }
    };

    this.recognition.onerror = (event) => {
      console.error('Error de reconocimiento:', event.error);
      this.isListening = false;
      if (this.callbacks.onError) {
        this.callbacks.onError(event.error);
      }
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (this.callbacks.onEnd) this.callbacks.onEnd();
    };
  }

  /**
   * Iniciar escucha con MediaRecorder para grabar audio
   */
  async startListening() {
    if (this.isListening) return;

    if (this.synthesis.speaking) {
      this.synthesis.cancel();
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      this.mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        stream.getTracks().forEach(track => track.stop());
      };

      this.mediaRecorder.start();

      if (this.recognition) {
        this.recognition.start();
      }

    } catch (error) {
      console.error('Error al acceder al micrófono:', error);
      if (this.callbacks.onError) {
        this.callbacks.onError('microphone-error');
      }
    }
  }

  /**
   * Detener escucha y devolver audio grabado
   */
  async stopListening() {
    return new Promise((resolve) => {
      if (!this.isListening && !this.mediaRecorder) {
        resolve(null);
        return;
      }

      if (this.recognition && this.isListening) {
        this.recognition.stop();
      }

      if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
        this.mediaRecorder.onstop = () => {
          const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
          this.audioChunks = [];
          resolve(audioBlob);
        };
        this.mediaRecorder.stop();
      } else {
        resolve(null);
      }
    });
  }

  /**
   * Leer texto en voz alta usando Web Speech API
   */
  speak(text, options = {}) {
    return new Promise((resolve, reject) => {
      if (!this.synthesis) {
        reject(new Error('Síntesis de voz no soportada'));
        return;
      }

      if (this.synthesis.speaking) {
        this.synthesis.cancel();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = options.language || this.settings.language;
      utterance.rate = options.rate || this.settings.rate;
      utterance.pitch = options.pitch || this.settings.pitch;
      utterance.volume = options.volume || this.settings.volume;

      const voices = this.synthesis.getVoices();
      const preferredVoice = voices.find(v =>
        v.lang.startsWith('es') && v.localService === false
      ) || voices.find(v => v.lang.startsWith('es'));

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onstart = () => {
        this.isSpeaking = true;
        if (this.callbacks.onSpeakStart) this.callbacks.onSpeakStart();
      };

      utterance.onend = () => {
        this.isSpeaking = false;
        if (this.callbacks.onSpeakEnd) this.callbacks.onSpeakEnd();
        resolve();
      };

      utterance.onerror = (event) => {
        this.isSpeaking = false;
        if (this.callbacks.onSpeakEnd) this.callbacks.onSpeakEnd();
        if (event.error !== 'canceled') {
          reject(new Error(event.error));
        } else {
          resolve();
        }
      };

      this.synthesis.speak(utterance);
    });
  }

  /**
   * Detener lectura de voz
   */
  stopSpeaking() {
    if (this.synthesis && this.synthesis.speaking) {
      this.synthesis.cancel();
      this.isSpeaking = false;
      if (this.callbacks.onSpeakEnd) this.callbacks.onSpeakEnd();
    }
  }

  /**
   * Verificar soporte de características
   */
  static getSupport() {
    return {
      recognition: !!(window.SpeechRecognition || window.webkitSpeechRecognition),
      synthesis: 'speechSynthesis' in window,
      mediaDevices: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
    };
  }

  /**
   * Configurar callbacks
   */
  on(event, callback) {
    if (this.callbacks.hasOwnProperty(`on${event.charAt(0).toUpperCase() + event.slice(1)}`)) {
      this.callbacks[`on${event.charAt(0).toUpperCase() + event.slice(1)}`] = callback;
    }
  }

  /**
   * Configurar idioma
   */
  setLanguage(lang) {
    this.settings.language = lang;
    if (this.recognition) {
      this.recognition.lang = lang;
    }
  }

  /**
   * Configurar velocidad de lectura
   */
  setRate(rate) {
    this.settings.rate = Math.max(0.5, Math.min(2, rate));
  }
}

// Exportar para uso global
window.VoiceManager = VoiceManager;
