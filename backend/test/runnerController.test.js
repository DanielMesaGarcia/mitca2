// runnerController.test.js

const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../server'); // Asegúrate de tener la ruta correcta
const Runner = require('../models/Runner');
const Message = require('../models/Message');
const Race = require('../models/Race');



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
      _id: '6097a0a7b5e9e532ec4a4c6a', // ID único inventado manualmente
      creationDate: new Date('2023-12-01'), // Fecha de creación inventada manualmente
      eventDate: new Date('2024-06-15'), // Fecha del evento inventada manualmente
      city: 'New York', // Ciudad inventada manualmente
      length: '10 kilometers', // Longitud inventada manualmente
    };

    const response = await request(app)
      .post('/race')
      .send(raceData)
      .expect(404);

    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('_id');
    expect(response.body.data.city).toBe('New York');
  });
});

