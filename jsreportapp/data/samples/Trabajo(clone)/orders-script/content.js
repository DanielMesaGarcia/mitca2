const axios = require('axios');

function fetchData() {
  // Replace 'http://localhost:3001/races' with your actual API endpoint
  const apiUrl = 'http://localhost:3001/races';

  return axios.get(apiUrl)
    .then(response => response.data)
    .catch(error => {
      console.error('Error fetching data:', error);
      throw error;
    });
}

function transformData(data) {
  // Modify data as needed for your report
  return data.data.map(race => {
    return {
      country: race._id, // Assuming 'city' is the country field
      rows: race.runners // Modify this according to your data structure
    };
  });
}

// 'beforeRender' script to fetch data and transform it before rendering the report
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
