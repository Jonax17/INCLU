import { useState, useRef, useEffect } from 'react';

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

const WELCOME_MESSAGE = { role: 'assistant', content: 'Hola, soy el asistente de INCLU. Puedo ayudarte con información sobre la app, sus módulos y cómo usar las herramientas de accesibilidad. ¿En qué puedo ayudarte?' };

const SYSTEM_PROMPT = `Eres el asistente virtual de INCLU, una aplicación de accesibilidad diseñada para personas con discapacidad. 

Sobre INCLU:
- Es una app web de tecnología asistiva con 8 módulos principales
- "Ver": Lector de texto (OCR con tesseract.js), Lupa (zoom con cámara), Escaneador de código de barras
- "Escuchar": Reconocimiento de voz y lectura de pantalla
- "Sentir": Vibración háptica con diferentes intensidades
- "Orientar": Mapa interactivo con GPS y escáner de códigos QR
- "SOS": Botón de emergencia con contactos y ubicación
- "Ajustes": Configuración de accesibilidad (modo claro/oscuro, alto contraste, tamaño de fuente, voz, vibración)

Características técnicas:
- React + Vite
- Web APIs: Speech Recognition, Speech Synthesis, Camera, Geolocation, Bluetooth, Vibration
- Tema Vento con modo oscuro/claro
- Diseño responsive y accesible (WCAG)
- Soporte para lectores de pantalla

Responde en español, sé conciso y útil. Si preguntan por funcionalidades, explica qué puede hacer cada módulo.`;

export default function Chatbot({ isOpen, onClose }) {
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'es-ES';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => prev + transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...messages.map(m => ({ role: m.role, content: m.content })),
            userMessage
          ],
          temperature: 0.7,
          max_tokens: 1024
        })
      });

      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor');
      }

      const data = await response.json();
      const assistantMessage = { role: 'assistant', content: data.choices[0].message.content };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Lo siento, hubo un error al conectar con el servidor. Por favor, intenta de nuevo.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleVoice = () => {
    if (!recognitionRef.current) {
      alert('Tu navegador no soporta reconocimiento de voz');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([WELCOME_MESSAGE]);
  };

  if (!isOpen) return null;

  return (
    <div className="chatbot-overlay" onClick={onClose}>
      <div className="chatbot-modal" onClick={e => e.stopPropagation()}>
        <div className="chatbot-header">
          <div className="chatbot-header-info">
            <img src="/img/logo-icon.svg" alt="" className="chatbot-logo" />
            <div>
              <h3>Asistente INCLU</h3>
              <span className="chatbot-status">En línea</span>
            </div>
          </div>
          <div className="chatbot-header-actions">
            <button className="chatbot-clear" onClick={clearChat} aria-label="Vaciar chat" title="Nuevo chat">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
              </svg>
            </button>
            <button className="chatbot-close" onClick={onClose} aria-label="Cerrar chat">
              ✕
            </button>
          </div>
        </div>

        <div className="chatbot-messages">
          {messages.map((msg, idx) => (
            <div key={idx} className={`chatbot-message ${msg.role}`}>
              <div className="chatbot-message-avatar">
                {msg.role === 'assistant' ? (
                  <img src="/img/logo-icon.svg" alt="" />
                ) : (
                  <span>Vous</span>
                )}
              </div>
              <div className="chatbot-message-content">
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="chatbot-message assistant">
              <div className="chatbot-message-avatar">
                <img src="/img/logo-icon.svg" alt="" />
              </div>
              <div className="chatbot-message-content typing">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chatbot-input-area">
          <button 
            className={`chatbot-voice-btn ${isListening ? 'listening' : ''}`}
            onClick={toggleVoice}
            aria-label={isListening ? 'Detener escucha' : 'Hablar'}
            title={isListening ? 'Detener escucha' : 'Hablar por voz'}
          >
            {isListening ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
              </svg>
            )}
          </button>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Escribe tu mensaje..."
            className="chatbot-input"
            disabled={isLoading}
          />
          <button 
            className="chatbot-send"
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            aria-label="Enviar mensaje"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
