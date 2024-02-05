// chatSocket.js
const WebSocket = require('ws'); // Asegúrate de importar WebSocket correctamente
const chatSocket = (wss) => {
  const clients = new Set();

  wss.on('connection', (ws) => {
    console.log('Usuario conectado');

    // Agregar nuevo cliente a la lista
    clients.add(ws);

    ws.on('message', (message) => {
      try {
        const messageData = JSON.parse(message);
        console.log('Nuevo mensaje recibido:', messageData);

        // Enviar el mensaje a todos los clientes conectados
        clients.forEach((client) => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(messageData));
          }
        });
      } catch (error) {
        console.error('Error al procesar el mensaje:', error);
      }
    });

    ws.on('close', () => {
      console.log('Usuario desconectado');
      // Eliminar cliente de la lista al cerrar la conexión
      clients.delete(ws);
    });
  });
};

module.exports = chatSocket;