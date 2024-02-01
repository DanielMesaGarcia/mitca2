const axios = require('axios');

function fetchData() {
  const apiUrl = 'http://localhost:3001/races';

  return axios.get(apiUrl)
    .then(response => response.data)
    .catch(error => {
      console.error('Error fetching data:', error);
      throw error;
    });
}

function transformData(data) {
  const transformedData = data.data.map(race => {
    const raceRunners = race.runners.map(runner => ({
      id: runner._id,
      name: runner.name,
      phone: runner.phone,
    }));

    return {
      country: race._id,
      city: race.city,
      eventDate: race.eventDate,
      length: race.length,
      runners: raceRunners,
      runnerCount: race.runners.length,
      raceNames: race._id,
      runnerCounts: race.runners.length,
    };
  });

  const nombres = transformedData.map(race => race.raceNames);
  const cuenta = transformedData.map(race => race.runnerCounts);

  console.log(nombres);
  console.log(cuenta);

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
