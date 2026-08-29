/**
 * GROQACC - Gestor de Exportación
 * Exporta conversaciones a TXT y PDF
 */
class ExportManager {
  constructor() {
    this.history = null;
  }

  /**
   * Inicializar con el gestor de historial
   */
  init(historyManager) {
    this.history = historyManager;
  }

  /**
   * Exportar conversación actual a TXT
   */
  exportToTXT(conversationId) {
    if (!this.history) {
      console.error('HistoryManager no inicializado');
      return false;
    }

    const text = this.history.exportToText(conversationId);
    if (!text) return false;

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const filename = `groqacc-${conversationId}-${Date.now()}.txt`;
    this.downloadBlob(blob, filename);
    return true;
  }

  /**
   * Exportar conversación actual a PDF
   */
  exportToPDF(conversationId) {
    if (!this.history) {
      console.error('HistoryManager no inicializado');
      return false;
    }

    const conversation = this.history.conversations.find(c => c.id === conversationId);
    if (!conversation) return false;

    // Generar HTML para PDF
    const html = this.generatePDFHTML(conversation);

    // Crear ventana para imprimir
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Por favor, permite las ventanas emergentes para exportar PDF');
      return false;
    }

    printWindow.document.write(html);
    printWindow.document.close();

    // Esperar a que cargue y abrir diálogo de impresión
    printWindow.onload = () => {
      printWindow.print();
    };

    return true;
  }

  /**
   * Generar HTML para PDF
   */
  generatePDFHTML(conversation) {
    const date = new Date(conversation.createdAt).toLocaleString('es-ES');
    const messagesHTML = conversation.messages.map(msg => {
      const role = msg.role === 'user' ? 'Tú' : 'GroqAcc';
      const time = new Date(msg.timestamp).toLocaleTimeString('es-ES');
      const bgColor = msg.role === 'user' ? '#dbeafe' : '#f1f5f9';
      const align = msg.role === 'user' ? 'right' : 'left';

      return `
        <div style="margin: 10px 0; text-align: ${align};">
          <div style="background: ${bgColor}; padding: 12px; border-radius: 8px; display: inline-block; max-width: 80%; text-align: left;">
            <div style="font-size: 11px; color: #666; margin-bottom: 4px;">
              <strong>${role}</strong> - ${time}
            </div>
            <div style="font-size: 14px; white-space: pre-wrap;">${this.escapeHtml(msg.content)}</div>
          </div>
        </div>
      `;
    }).join('');

    return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>${conversation.title} - INCLU</title>
        <style>
          body {
            font-family: 'Segoe UI', Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            color: #333;
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #2563eb;
            padding-bottom: 20px;
            margin-bottom: 20px;
          }
          .header h1 {
            color: #2563eb;
            margin: 0;
          }
          .meta {
            color: #666;
            font-size: 12px;
            margin-top: 10px;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            text-align: center;
            font-size: 11px;
            color: #999;
          }
          @media print {
            body { padding: 0; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>INCLU - Historial de Chat</h1>
          <div class="meta">
            <p><strong>Conversación:</strong> ${this.escapeHtml(conversation.title)}</p>
            <p><strong>Fecha:</strong> ${date}</p>
            <p><strong>Mensajes:</strong> ${conversation.messages.length}</p>
          </div>
        </div>
        ${messagesHTML}
        <div class="footer">
          Exportado desde INCLU - Asistente IA para Inclusión
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Descargar blob como archivo
   */
  downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Escape HTML
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Exportar para uso global
window.ExportManager = ExportManager;
