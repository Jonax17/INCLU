/**
 * GROQACC - Cliente API Groq
 * Maneja las llamadas a la API de Groq para STT, Chat y TTS
 */
class GroqAPI {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseURL = 'https://api.groq.com/openai/v1';
    this.model = 'openai/gpt-oss-20b';
    this.sttModel = 'whisper-large-v3-turbo';
    this.ttsModel = 'canopylabs/orpheus-v1-english';
    this.ttsVoice = 'troy';
    this.conversationHistory = [];
    this.systemPrompt = `Eres un asistente de IA accesible llamado GroqAcc. Tu objetivo es ayudar a personas con discapacidades auditivas y visuales.

Características importantes:
- Responde de forma clara, concisa y bien estructurada
- Usa formato simple: listos, párrafos cortos, negritas para énfasis
- Cuando describas algo visual, sé muy descriptivo (para personas con discapacidad visual)
- Ofrece alternativas de texto para todo contenido de audio
- Sé paciente y ofrece respuestas que funcionen tanto leídas como escuchadas
- En España, responde en español
- Mantén las respuestas entre 50 y 300 palabras para legibilidad`;
  }

  /**
   * Configurar el modelo de IA
   */
  setModel(model) {
    this.model = model;
  }

  /**
   * Agregar mensaje al historial
   */
  addToHistory(role, content) {
    this.conversationHistory.push({ role, content });
    if (this.conversationHistory.length > 20) {
      this.conversationHistory = this.conversationHistory.slice(-20);
    }
  }

  /**
   * Enviar mensaje de chat
   */
  async chat(userMessage, onChunk) {
    this.addToHistory('user', userMessage);

    const messages = [
      { role: 'system', content: this.systemPrompt },
      ...this.conversationHistory
    ];

    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: this.model,
          messages: messages,
          stream: true,
          temperature: 0.7,
          max_completion_tokens: 1024
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || `Error HTTP ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop();

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              const delta = parsed.choices?.[0]?.delta?.content;
              if (delta) {
                fullResponse += delta;
                if (onChunk) onChunk(delta, fullResponse);
              }
            } catch (e) {
              // Skip malformed JSON
            }
          }
        }
      }

      this.addToHistory('assistant', fullResponse);
      return fullResponse;

    } catch (error) {
      console.error('Error en chat:', error);
      throw error;
    }
  }

  /**
   * Transcribir audio (Speech-to-Text)
   */
  async transcribeAudio(audioBlob, language = 'es') {
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.webm');
    formData.append('model', this.sttModel);
    formData.append('language', language);
    formData.append('response_format', 'verbose_json');

    try {
      const response = await fetch(`${this.baseURL}/audio/transcriptions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || `Error HTTP ${response.status}`);
      }

      return await response.json();

    } catch (error) {
      console.error('Error en transcripción:', error);
      throw error;
    }
  }

  /**
   * Generar audio de texto (Text-to-Speech)
   */
  async textToSpeech(text, options = {}) {
    const {
      voice = this.ttsVoice,
      responseFormat = 'mp3',
      speed = 1.0
    } = options;

    const truncatedText = text.substring(0, 500);

    try {
      const response = await fetch(`${this.baseURL}/audio/speech`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: this.ttsModel,
          input: truncatedText,
          voice: voice,
          response_format: responseFormat,
          speed: speed
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || `Error HTTP ${response.status}`);
      }

      return await response.blob();

    } catch (error) {
      console.error('Error en TTS:', error);
      throw error;
    }
  }

  /**
   * Describir imagen (Vision)
   */
  async describeImage(imageBase64, prompt = "Describe esta imagen en detalle para una persona con discapacidad visual. Incluye: objetos, personas, colores, ubicación, texto visible, y cualquier detalle relevante.") {
    const messages = [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: prompt
          },
          {
            type: 'image_url',
            image_url: {
              url: `data:image/jpeg;base64,${imageBase64}`
            }
          }
        ]
      }
    ];

    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.2-11b-vision-preview',
          messages: messages,
          max_tokens: 1024,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || `Error HTTP ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;

    } catch (error) {
      console.error('Error describiendo imagen:', error);
      throw error;
    }
  }

  /**
   * Verificar conexión con la API
   */
  async checkConnection() {
    try {
      const response = await fetch(`${this.baseURL}/models`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Limpiar historial
   */
  clearHistory() {
    this.conversationHistory = [];
  }
}

// Exportar para uso global
window.GroqAPI = GroqAPI;
