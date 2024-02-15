// chatSocket.js
const WebSocket = require('ws');

const chatSocket = (wss) => {
  const clients = new Set();

  wss.on('connection', (ws) => {
    clients.add(ws);

    ws.on('message', (message) => {
      try {
        const messageData = JSON.parse(message);
        console.log('Nuevo mensaje recibido:', messageData);

        // Si el tipo de mensaje es 'delete', eliminar el mensaje en todos los clientes
        if (messageData.type === 'delete') {
          // Envía el mensaje de eliminación a todos los clientes excepto al cliente que envió el mensaje
          clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify(messageData));
            }
          });
        } else {
          // Si no es un mensaje de eliminación, enviarlo a todos los clientes
          clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify(messageData));
            }
          });
        }
      } catch (error) {
        console.error('Error al procesar el mensaje:', error);
      }
    });

    ws.on('close', () => {
      clients.delete(ws);
    });
  });
};

module.exports = chatSocket;
