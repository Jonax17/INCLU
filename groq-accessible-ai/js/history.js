/**
 * GROQACC - Gestor de Historial
 * Guarda y carga conversaciones en localStorage
 */
class HistoryManager {
  constructor() {
    this.storageKey = 'groqacc-history';
    this.currentConversationId = null;
    this.conversations = this.loadAll();
  }

  /**
   * Cargar todas las conversaciones
   */
  loadAll() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.warn('Error cargando historial:', e);
      return [];
    }
  }

  /**
   * Guardar todas las conversaciones
   */
  saveAll() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.conversations));
    } catch (e) {
      console.warn('Error guardando historial:', e);
    }
  }

  /**
   * Crear nueva conversación
   */
  createConversation() {
    const id = Date.now().toString(36) + Math.random().toString(36).substr(2);
    const conversation = {
      id,
      title: 'Nueva conversación',
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.conversations.unshift(conversation);
    this.currentConversationId = id;
    this.saveAll();
    return conversation;
  }

  /**
   * Obtener conversación actual
   */
  getCurrentConversation() {
    return this.conversations.find(c => c.id === this.currentConversationId);
  }

  /**
   * Agregar mensaje a la conversación actual
   */
  addMessage(role, content) {
    const conversation = this.getCurrentConversation();
    if (!conversation) return null;

    const message = {
      id: Date.now().toString(36),
      role,
      content,
      timestamp: new Date().toISOString()
    };

    conversation.messages.push(message);
    conversation.updatedAt = new Date().toISOString();

    // Actualizar título con el primer mensaje del usuario
    if (role === 'user' && conversation.messages.filter(m => m.role === 'user').length === 1) {
      conversation.title = content.substring(0, 50) + (content.length > 50 ? '...' : '');
    }

    this.saveAll();
    return message;
  }

  /**
   * Cargar conversación por ID
   */
  loadConversation(id) {
    const conversation = this.conversations.find(c => c.id === id);
    if (conversation) {
      this.currentConversationId = id;
    }
    return conversation;
  }

  /**
   * Obtener todas las conversaciones (para el selector)
   */
  getAllConversations() {
    return this.conversations.map(c => ({
      id: c.id,
      title: c.title,
      messageCount: c.messages.length,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt
    }));
  }

  /**
   * Eliminar conversación
   */
  deleteConversation(id) {
    this.conversations = this.conversations.filter(c => c.id !== id);
    if (this.currentConversationId === id) {
      this.currentConversationId = null;
    }
    this.saveAll();
  }

  /**
   * Limpiar todo el historial
   */
  clearAll() {
    this.conversations = [];
    this.currentConversationId = null;
    this.saveAll();
  }

  /**
   * Exportar conversación a texto
   */
  exportToText(id) {
    const conversation = this.conversations.find(c => c.id === id);
    if (!conversation) return null;

    let text = `=== ${conversation.title} ===\n`;
    text += `Fecha: ${new Date(conversation.createdAt).toLocaleString('es-ES')}\n`;
    text += `Mensajes: ${conversation.messages.length}\n`;
    text += '='.repeat(40) + '\n\n';

    conversation.messages.forEach(msg => {
      const role = msg.role === 'user' ? 'Tú' : 'GroqAcc';
      const time = new Date(msg.timestamp).toLocaleTimeString('es-ES');
      text += `[${time}] ${role}:\n${msg.content}\n\n`;
    });

    return text;
  }

  /**
   * Obtener ID actual
   */
  getCurrentId() {
    return this.currentConversationId;
  }
}

// Exportar para uso global
window.HistoryManager = HistoryManager;
