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


  

})
