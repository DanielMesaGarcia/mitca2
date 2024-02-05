// chatSocket.js
const chatSocket = (wss) => {
    wss.on('connection', (ws) => {
      console.log('Usuario conectado');
  
      // Manejar mensajes del cliente
      ws.on('message', (message) => {
        // Aquí puedes guardar el mensaje en la base de datos o realizar cualquier otra lógica
        console.log('Nuevo mensaje recibido:', message);
  
        // Enviar el mensaje a todos los clientes conectados
        wss.clients.forEach((client) => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(message);
          }
        });
      });
  
      // Manejar eventos de desconexión
      ws.on('close', () => {
        console.log('Usuario desconectado');
      });
    });
  };
  
  module.exports = chatSocket;
  