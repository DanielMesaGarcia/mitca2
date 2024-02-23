// runnerController.test.js

const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../server'); // Asegúrate de tener la ruta correcta
const Runner = require('../models/Runner');
const Message = require('../models/Message');
const Race = require('../models/Race');
const Status = require('../models/Status');
const Route = require('../models/Route');
const Subscription = require('../models/Subscription');



// Antes de los tests, conecta a la base de datos de prueba y agrega algunos datos iniciales si es necesario
beforeAll(async () => {
  await mongoose.createConnection('mongodb://127.0.0.1:27017/testDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await Runner.deleteMany({});

  // Agrega datos iniciales si es necesario
});

// Después de los tests, desconecta de la base de datos
afterAll(async () => {
  await mongoose.connection.close();
});

describe('RunnerController', () => {
  // Test para la creación de un nuevo runner
  it('should create a new runner', async () => {
    const response = await request(app)
      .post('/runners')
      .send({
        _id: '12345698A',
        name: 'Test Runner',
        phone: '123456999',
        details: 'Some details',
      });
    console.log(response)
    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('_id');
    expect(response.body.data.name).toBe('Test Runner');
  });

  describe('RunnerController', () => {
    // Test para la creación de un nuevo runner
    it('should give error 500', async () => {
      const response = await request(app)
        .post('/runners')
        .send({
          _id: '1298A',
          name: 'Test Runner',
          phone: '123456999',
          details: 'Some details',
        });
      expect(response.statusCode).toBe(500);
      expect(response.body.success).toBe(false);
    });
  });

  describe('RunnerController', () => {
    // Test para la creación de un nuevo runner
    it('should give error 500', async () => {
      const response = await request(app)
        .post('/runners')
        .send({
          _id: '44742683R',
          name: 'Test Runner',
          phone: '1k56999',
          details: 'Some details',
        });
      expect(response.statusCode).toBe(500);
      expect(response.body.success).toBe(false);
    });

    // Test para obtener todos los runners
    it('should get all runners', async () => {
      const response = await request(app)
        .get('/runners');

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
    });
  });

  describe('Update Runner', () => {
    // Test for updating a runner with valid data
    it('should update a runner with valid data', async () => {
      // First, create a runner to update
      const createResponse = await request(app)
        .post('/runners')
        .send({
          _id: '12345698A',
          name: 'Test Runner',
          phone: '123456999',
          details: 'Some details',
        });

      // Update the runner created above
      const updateResponse = await request(app)
        .put(`/runners/12345698A`)
        .send({
          name: 'Updated Runner Name',
          phone: '987654321',
          details: 'Updated details',
        });

      expect(updateResponse.statusCode).toBe(200);
      expect(updateResponse.body.success).toBe(true);
      expect(updateResponse.body.data).toHaveProperty('_id');
      expect(updateResponse.body.data.name).toBe('Updated Runner Name');
      expect(updateResponse.body.data.phone).toBe('987654321');
      expect(updateResponse.body.data.details).toBe('Updated details');
    });

    // Test for updating a runner with invalid data
    it('should give error 404 when updating a non-existent runner', async () => {
      const updateResponse = await request(app)
        .put('/runners/nonexistent_id')
        .send({
          name: 'Updated Runner Name',
          phone: '987654321',
          details: 'Updated details',
        });

      expect(updateResponse.statusCode).toBe(404);
      expect(updateResponse.body.success).toBe(false);
    });
  });

  describe('Delete Runner', () => {
    // Test for deleting a runner
    it('should delete a runner', async () => {
      // First, create a runner to delete
      const createResponse = await request(app)
        .post('/runners')
        .send({
          _id: '12345698A',
          name: 'Test Runner',
          phone: '123456999',
          details: 'Some details',
        });

      // Delete the runner created above
      const deleteResponse = await request(app)
        .delete(`/runners/12345698A`);

      expect(deleteResponse.statusCode).toBe(200);
      expect(deleteResponse.body.success).toBe(true);
    });

    // Test for deleting a non-existent runner
    it('should give error 404 when deleting a non-existent runner', async () => {
      const deleteResponse = await request(app)
        .delete('/runners/nonexistent_id');

      expect(deleteResponse.statusCode).toBe(404);
      expect(deleteResponse.body.success).toBe(false);
    });
  });

  describe('POST /messages - createMessage', () => {
    it('Debería crear un nuevo mensaje', async () => {
      const res = await request(app)
        .post('/messages')
        .send({ sender: 'Usuario1', message: 'Hola Mundo' });
      
      expect(res.statusCode).toEqual(201);
      expect(res.body.sender).toEqual('Usuario1');
      expect(res.body.message).toEqual('Hola Mundo');
      
      // Verificar si el mensaje se ha guardado en la base de datos
      const message = await Message.findOne({ sender: 'Usuario1' });
      expect(message).toBeTruthy();
    });
  });

  describe('GET /messages - getMessages', () => {
    it('Debería obtener todos los mensajes', async () => {
      const res = await request(app).get('/messages');
      
      expect(res.statusCode).toEqual(200);
      // Aquí podrías agregar más expectativas para verificar el formato de los mensajes devueltos
    });
  });

  describe('DELETE /messages/:_id - deleteMessages', () => {
    it('Debería eliminar un mensaje existente', async () => {
      // Suponiendo que tienes un mensaje existente en la base de datos
      const existingMessage = await Message.findOne();
      
      const res = await request(app).delete(`/messages/${existingMessage._id}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      
      // Verificar si el mensaje ha sido eliminado de la base de datos
      const deletedMessage = await Message.findById(existingMessage._id);
      expect(deletedMessage).toBeNull();
    });

    it('Debería devolver un error 404 si el mensaje no existe', async () => {
      const res = await request(app).delete('/messages/123'); // Suponiendo que 123 no existe
      expect(res.statusCode).toEqual(500);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toEqual('Message not found');
    });
  });


  // Función para generar un CIF aleatorio válido
function generateValidCIF() {
  const letters = 'ABCDEFGHJKLMNPQRSUVW';
  let cif = letters.charAt(Math.floor(Math.random() * letters.length));
  for (let i = 0; i < 8; i++) {
      cif += Math.floor(Math.random() * 10);
  }
  return cif;
}

// Función para generar datos aleatorios de patrocinador
function generateSponsorData() {
  return {
      _id: generateValidCIF(),
      companyName: 'Test Company',
      typeCompany: 'Test Type'
  };
}

describe('Create Sponsor', () => {
  it('should create a new sponsor', async () => {
      const sponsorData = generateSponsorData();

      const response = await request(app)
          .post('/sponsors')
          .send(sponsorData);

      expect(response.statusCode).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('_id');
      expect(response.body.data.companyName).toBe(sponsorData.companyName);
  });

  it('should give error 500 for invalid data', async () => {
      const response = await request(app)
          .post('/sponsors')
          .send({});

      expect(response.statusCode).toBe(500);
      expect(response.body.success).toBe(false);
  });
});

describe('Get Sponsors', () => {
  it('should get all sponsors', async () => {
      const response = await request(app)
          .get('/sponsors');

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
  });
});

describe('Update Sponsor', () => {
  it('should update a sponsor', async () => {
      const sponsorData = generateSponsorData();
      const createResponse = await Sponsor.create(sponsorData);

      const updateResponse = await request(app)
          .put(`/sponsors/${createResponse._id}`)
          .send({
              companyName: 'Updated Company Name',
              typeCompany: 'Updated Type'
          });

      expect(updateResponse.statusCode).toBe(200);
      expect(updateResponse.body.success).toBe(true);
      expect(updateResponse.body.data.companyName).toBe('Updated Company Name');
  });

  it('should give error 404 when updating a non-existent sponsor', async () => {
      const updateResponse = await request(app)
          .put('/sponsors/nonexistent_id')
          .send({
              companyName: 'Updated Company Name',
              typeCompany: 'Updated Type'
          });

      expect(updateResponse.statusCode).toBe(404);
      expect(updateResponse.body.success).toBe(false);
  });
});

describe('Delete Sponsor', () => {
  it('should delete a sponsor', async () => {
      const sponsorData = generateSponsorData();
      const createResponse = await Sponsor.create(sponsorData);

      const deleteResponse = await request(app)
          .delete(`/sponsors/${createResponse._id}`);

      expect(deleteResponse.statusCode).toBe(200);
      expect(deleteResponse.body.success).toBe(true);
  });

  it('should give error 404 when deleting a non-existent sponsor', async () => {
      const deleteResponse = await request(app)
          .delete('/sponsors/nonexistent_id');

      expect(deleteResponse.statusCode).toBe(404);
      expect(deleteResponse.body.success).toBe(false);
  });
});


  

})

const createTestToken = (userId) => {
  return jwt.sign({ _id: userId }, 'your_secret_key');
};

describe('Pruebas de los controladores de usuarios', () => {


  describe('POST /login - login', () => {
    it('Debería autenticar a un usuario existente', async () => {
      // Simula un cuerpo de solicitud para iniciar sesión
      const loginData = { email:"admin@admin.com", password:"admin1" };

      const res = await request(app)
        .post('/login')
        .send(loginData);

      expect(res.statusCode).toEqual(200);
      // Agrega expectativas adicionales según lo que esperas en la respuesta
    });
  });

  describe('GET /users - getUsers', () => {
    it('Debería obtener todos los usuarios', async () => {
      const res = await request(app).get('/users');

      expect(res.statusCode).toEqual(200);
      // Agrega expectativas adicionales según lo que esperas en la respuesta
    });
  });

  describe('GET /users/:_id - getUserById', () => {
    it('Debería obtener un usuario por su ID', async () => {
      // Supongamos que existe un usuario con este ID en la base de datos
      const userId = 'admin@admin.com';

      const res = await request(app).get(`/users/${userId}`);

      expect(res.statusCode).toEqual(200);
      // Agrega expectativas adicionales según lo que esperas en la respuesta
    });
  });

  describe('PUT /users/:_id - updateUser', () => {
    it('Debería actualizar un usuario existente', async () => {
      // Supongamos que existe un usuario con este ID en la base de datos
      const userId = 'admin@admin.com';
      const updatedUserData = { DNI:"44742683R" };

      const res = await request(app)
        .put(`/users/${userId}`)
        .send(updatedUserData);

      expect(res.statusCode).toEqual(200);
      // Agrega expectativas adicionales según lo que esperas en la respuesta
    });
  });

  describe('DELETE /users/:_id - deleteUser', () => {
    it('Debería eliminar un usuario existente', async () => {
      // Supongamos que existe un usuario con este ID en la base de datos
      const userId = 'admin@admin.com';

      const res = await request(app).delete(`/users/${userId}`);

      expect(res.statusCode).toEqual(200);
      // Agrega expectativas adicionales según lo que esperas en la respuesta
    });
  });

  

});




describe('POST /race', () => {
  it('should create a new race', async () => {
    const raceData = {
      _id: 'Carreratest', // ID único inventado manualmente
      eventDate: new Date('2024-06-15'), // Fecha del evento inventada manualmente
      city: 'New York', // Ciudad inventada manualmente
      length: '10', // Longitud inventada manualmente
    };

    const response = await request(app)
      .post('/races')
      .send(raceData)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('_id');
    expect(response.body.data.city).toBe('New York');
  });

  

  it('should create a new race', async () => {
    const raceData = {
      _id: 'Carreratester', // ID único inventado manualmente
      eventDate: new Date('2024-06-15'), // Fecha del evento inventada manualmente
      city: 'New York', // Ciudad inventada manualmente
      length: '10', // Longitud inventada manualmente
    };

    const response = await request(app)
      .post('/races')
      .send(raceData)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('_id');
    expect(response.body.data.city).toBe('New York');
  });
  
  it('should create a new race', async () => {
    const raceData = {
      eventDate: new Date('2024-07-15'), // Fecha del evento inventada manualmente
      city: 'New Yorky', // Ciudad inventada manualmente
      length: '11', // Longitud inventada manualmente
    };

    const response = await request(app)
      .put('/races/Carreratester')
      .send(raceData)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('_id');
    expect(response.body.data.city).toBe('New Yorky');
  });

  it('should create a new race', async () => {
    const raceData = {
      eventDate: new Date('2024-0715'), // Fecha del evento inventada manualmente
      city: 'New Yorky', // Ciudad inventada manualmente
      length: 'e', // Longitud inventada manualmente
    };

    const response = await request(app)
      .put('/races/Carreratester')
      .send(raceData)
      .expect(500);
  });

  it('should create a new race', async () => {
    const raceData = {
    };

    const response = await request(app)
      .post('/races')
      .send(raceData)
      .expect(500);

    expect(response.body.success).toBe(false);
  });

  it('should delete a new race', async () => {
    

    const response = await request(app)
      .delete('/races/Carreratest')
      .expect(200);
  });

  it('should delete a new race', async () => {
    

    const response = await request(app)
      .delete('/races')
      .send('Carreratest')
      .expect(404);
  });

  it('should update race data successfully', async () => {
    const raceData = {
      eventDate: new Date('2024-08-20'), // Fecha del evento inventada manualmente
      city: 'Los Angeles', // Ciudad inventada manualmente
      length: '15', // Longitud inventada manualmente
    };
  
    const response = await request(app)
      .put('/races/Carreratest')
      .send(raceData)
      .expect(200);
  
    expect(response.body.success).toBe(true);
    expect(response.body.data.city).toBe('Los Angeles');
  });
  
  it('should return 400 when providing invalid data for race update', async () => {
    const raceData = {
      eventDate: 'Invalid Date', // Fecha inválida
      city: 12345, // Ciudad inválida
      length: -5, // Longitud inválida
    };
  
    const response = await request(app)
      .put('/races/Carreratest')
      .send(raceData)
      .expect(400);
  });
  
  
});


describe('Status API', () => {
  

  beforeEach(async () => {
    // Borra todos los datos de las colecciones antes de cada test
    await Race.deleteMany();
    await Status.deleteMany();
  });

  describe('POST /status', () => {
    it('should create a new status', async () => {
      const raceData = {
        _id: 'Carreratest', // ID único inventado manualmente
        eventDate: new Date('2024-06-15'), // Fecha del evento inventada manualmente
        city: 'New York', // Ciudad inventada manualmente
        length: '10', // Longitud inventada manualmente
      };

      // Crea una carrera para asociarla al nuevo estado
      const race = await Race.create(raceData);

      const statusData = {
        carrera: race._id, // Asocia el estado con la carrera creada anteriormente
        statusAtTheMoment: 'No empezada',
        winner: '',
        duration: ''
      };

      const response = await request(app)
        .post('/status')
        .send(statusData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('_id');
    });
  });

  describe('GET /status', () => {
    it('should get all statuses', async () => {
      // Inserta algunos estados en la base de datos
      await Status.create([
        { carrera: 'carrera1', statusAtTheMoment: 'No empezada', winner: '', duration: '' },
        { carrera: 'carrera2', statusAtTheMoment: 'En progreso', winner: '', duration: '' }
      ]);

      const response = await request(app)
        .get('/status')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBe(2); // Asumiendo que hay 2 estados en la base de datos
    });
  });

  // Aquí puedes continuar con más tests para las otras rutas (GET /status/:_id, PUT /status/:_id, DELETE /status/:_id)
});


describe('Route API', () => {
  

  beforeEach(async () => {
    // Borra todos los datos de las colecciones antes de cada test
    await Race.deleteMany();
    await Route.deleteMany();
  });

  describe('POST /route', () => {
    it('should create a new route', async () => {
      const raceData = {
        _id: 'Carreratest', // ID único inventado manualmente
        eventDate: new Date('2024-06-15'), // Fecha del evento inventada manualmente
        city: 'New York', // Ciudad inventada manualmente
        length: '10', // Longitud inventada manualmente
      };

      // Crea una carrera para asociarla a la nueva ruta
      const race = await Race.create(raceData);

      const routeData = {
        race: race._id, // Asocia la ruta con la carrera creada anteriormente
        checkpoint: 1,
        startPoint: 'Start Point',
        goal: 'Goal Point'
      };

      const response = await request(app)
        .post('/route')
        .send(routeData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('_id');
    });
  });

  describe('GET /route', () => {
    it('should get all routes', async () => {
      // Inserta algunas rutas en la base de datos
      await Route.create([
        { race: 'Carreratest', checkpoint: 1, startPoint: 'Start Point', goal: 'Goal Point' },
        { race: 'AnotherRace', checkpoint: 2, startPoint: 'Start Point 2', goal: 'Goal Point 2' }
      ]);

      const response = await request(app)
        .get('/route')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBe(2); // Asumiendo que hay 2 rutas en la base de datos
    });
  });
  describe('GET /route/:_id', () => {
    it('should get a route by its ID', async () => {
      // Inserta una ruta en la base de datos
      const route = await Route.create({ race: 'Carreratest', checkpoint: 1, startPoint: 'Start Point', goal: 'Goal Point' });
  
      const response = await request(app)
        .get(`/route/${route._id}`)
        .expect(200);
  
      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(route._id.toString());
    });
  
    it('should return 404 if route ID does not exist', async () => {
      const nonExistentID = '2343j2i4n324'; // Crea un ID que no existe en la base de datos
  
      await request(app)
        .get(`/route/${nonExistentID}`)
        .expect(404);
    });
  });
  
  describe('PUT /route/:_id', () => {
    it('should update a route by its ID', async () => {
      // Inserta una ruta en la base de datos
      const route = await Route.create({ race: 'Carreratest', checkpoint: 1, startPoint: 'Start Point', goal: 'Goal Point' });
  
      const updatedData = {
        checkpoint: 2,
        startPoint: 'Updated Start Point',
        goal: 'Updated Goal Point'
      };
  
      const response = await request(app)
        .put(`/route/${route._id}`)
        .send(updatedData)
        .expect(200);
  
      expect(response.body.success).toBe(true);
      expect(response.body.data.checkpoint).toBe(updatedData.checkpoint);
      expect(response.body.data.startPoint).toBe(updatedData.startPoint);
      expect(response.body.data.goal).toBe(updatedData.goal);
    });
  
    it('should return 404 if route ID does not exist', async () => {
      const nonExistentID = 'afeefefca'; // Crea un ID que no existe en la base de datos
  
      await request(app)
        .put(`/route/${nonExistentID}`)
        .send({ checkpoint: 2, startPoint: 'Updated Start Point', goal: 'Updated Goal Point' })
        .expect(404);
    });
  });
  
  describe('DELETE /route/:_id', () => {
    it('should delete a route by its ID', async () => {
      // Inserta una ruta en la base de datos
      const route = await Route.create({ race: 'Carreratest', checkpoint: 1, startPoint: 'Start Point', goal: 'Goal Point' });
  
      await request(app)
        .delete(`/route/${route._id}`)
        .expect(200);
  
      // Verifica que la ruta se haya eliminado correctamente
      const deletedRoute = await Route.findById(route._id);
      expect(deletedRoute).toBeNull();
    });
  
    it('should return 404 if route ID does not exist', async () => {
      const nonExistentID = 'ertgrrg'; // Crea un ID que no existe en la base de datos
  
      await request(app)
        .delete(`/route/${nonExistentID}`)
        .expect(404);
    });
  });
  describe('Error Handling - Internal Server Error (500)', () => {
    it('should return 500 if an unexpected error occurs during route creation', async () => {
      // Forzar un error al intentar crear una ruta (por ejemplo, proporcionando un campo requerido faltante)
      await request(app)
        .post('/route')
        .send({ checkpoint: 'wefew', startPoint: 'Start Point', goal: 'Goal Point' })
        .expect(500);
    });
  });

  // Aquí puedes continuar con más tests para las otras rutas (GET /route/:_id, PUT /route/:_id, DELETE /route/:_id)
});

describe('Subscription API', () => {
  

  beforeEach(async () => {
    // Limpiar la colección de suscripciones antes de cada test
    await Subscription.deleteMany();
  });

  describe('POST /subscribe', () => {
    it('should create a new subscription', async () => {
      const subscriptionData = {
        endpoint: 'https://example.com/endpoint',
        expirationTime: Date.now() + 3600, // Expira en 1 hora
        keys: {
          p256dh: 'p256dhKey',
          auth: 'authKey',
        },
        subscriptionName: 'Test Subscription'
      };

      const response = await request(app)
        .post('/subscriptions/subscribe')
        .send({ subscription: subscriptionData })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('_id');
    });
  });

  describe('GET /subscriptions', () => {
    it('should get all subscriptions', async () => {
      // Insertar algunas suscripciones en la base de datos
      await Subscription.create([
        {
          endpoint: 'https://example.com/endpoint1',
          expirationTime: Date.now() + 3600,
          keys: { p256dh: 'p256dhKey1', auth: 'authKey1' },
          subscriptionName: 'Subscription 1'
        },
        {
          endpoint: 'https://example.com/endpoint2',
          expirationTime: Date.now() + 7200,
          keys: { p256dh: 'p256dhKey2', auth: 'authKey2' },
          subscriptionName: 'Subscription 2'
        }
      ]);

      const response = await request(app)
        .get('/subscriptions')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBe(2);
    });
  });

  describe('POST /sendNotificationToSubscriptionName', () => {
    it('should send notification to subscriptions with matching name', async () => {
      // Insertar una suscripción en la base de datos
      await Subscription.create({
        endpoint: 'https://example.com/endpoint',
        expirationTime: Date.now() + 3600,
        keys: { p256dh: 'p256dhKey', auth: 'authKey' },
        subscriptionName: 'Carreras'
      });

      const response = await request(app)
        .post('/subscriptions/sendNotificationToSubscriptionName')
        .send({ notificationMessage: 'Test notification message' })
        .expect(200);

      expect(response.text).toBe('notification sent');
      // Aquí podrías verificar si la notificación se envió correctamente
    });
  });

  // Puedes continuar con más tests para las otras rutas y funcionalidades del controlador de suscripciones
});
