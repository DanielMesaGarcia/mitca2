const axios = require('axios');

function fetchData() {
    const apiUrl = 'http://localhost:3001/messages';

    return axios.get(apiUrl)
        .then(response => response.data)
        .catch(error => {
            console.error('Error fetching data:', error);
            throw error;
        });
}

function transformData(data) {
    const transformedData = data.data.map(messages => {
        return {
            message: messages._id,
            sender: messages.sender,
            description: messages.message,
            time: messages.timestamp,
        };
    });
    const nombres = transformedData.map(message => message.messageNames);
    const cuenta = transformedData.map(message => message.messageCounts);
    return {
        nombres: nombres,
        cuenta: cuenta,
        info: transformedData,
    };
}


function beforeRender(req, res, done) {
    fetchData()
        .then(data => {
            const transformedData = transformData(data);
            // Assign the transformed data to the 'orders' variable in the template
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