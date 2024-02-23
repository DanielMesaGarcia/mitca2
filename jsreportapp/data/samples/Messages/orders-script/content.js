// En el archivo de lógica del servidor (server.js o donde esté implementado)
const axios = require('axios');
const https = require('https');

function fetchData() {
  const apiUrl = 'https://localhost:3001/messages';
  const httpsAgent = new https.Agent({ rejectUnauthorized: false });

  return axios.get(apiUrl, { httpsAgent })
    .then(response => response.data)
    .catch(error => {
      console.error('Error fetching data:', error);
      throw error;
    });
}

function transformData(data) {
  const transformedData = data.map(message => ({
    user: message.sender,
    description: message.message,
    time: message.timestamp,
  }));

  const totalMessages = transformedData.length;

  return {
    totalMessages: totalMessages,
    messages: transformedData,
  };
}

function beforeRender(req, res, done) {
  fetchData()
    .then(data => {
      const transformedData = transformData(data);
      req.data = {
        orders: transformedData
      };
      done();
    })
    .catch(error => {
      res.statusCode = 500;
      res.end(`Error: ${error.message}`);
    });
}
