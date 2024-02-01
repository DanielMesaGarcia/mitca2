// runnerController.test.js

const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../server'); // Asegúrate de tener la ruta correcta
const Runner = require('../models/Runner');


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
  });

  describe('RunnerController', () => {
    

    // Test para obtener todos los runners
    it('should get all runners', async () => {
      const response = await request(app)
        .get('/runners');

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
    });
  });

})
