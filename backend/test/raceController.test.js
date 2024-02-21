// raceController.test.js

const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../server'); // Ensure correct path to the server file
const Race = require('../models/Race');
const Route = require('../models/Route');
const Status = require('../models/Status');
require('./test-setup');
// Before all tests, connect to the test database
beforeAll(async () => {
  await mongoose.connect('mongodb://127.0.0.1:27017/testDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });
});

// After all tests, close the database connection
afterAll(async () => {
  await mongoose.connection.close();
});

describe('RaceController', () => {
  describe('Create Race', () => {
    it('should create a new race', async () => {
      const response = await request(app)
        .post('/races')
        .send({
          _id: '123456',
          eventDate: new Date(),
          city: 'Test City',
          length: 'Test Length',
        });

      expect(response.statusCode).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('_id');
    });
  });

  describe('Get Races', () => {
    it('should get all races', async () => {
      const response = await request(app).get('/races');

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
    });
  });

  describe('Get Race by ID', () => {
    it('should get a race by its ID', async () => {
      const race = await Race.findOne();
      if (!race) {
        throw new Error('No race found in the database');
      }

      const response = await request(app).get(`/races/${race._id}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(race._id.toString());
    });
  });

  describe('Update Race', () => {
    it('should update a race by its ID', async () => {
      const race = await Race.findOne();
      if (!race) {
        throw new Error('No race found in the database');
      }

      const response = await request(app)
        .put(`/races/${race._id}`)
        .send({
          city: 'Updated City',
        });

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.city).toBe('Updated City');
    });
  });

  describe('Patch Race', () => {
    it('should update a race partially by its ID', async () => {
      const race = await Race.findOne();
      if (!race) {
        throw new Error('No race found in the database');
      }

      const response = await request(app)
        .patch(`/races/${race._id}`)
        .send({
          length: 'Updated Length',
        });

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBe('Updated Length');
    });
  });

  describe('Delete Race', () => {
    it('should delete a race by its ID', async () => {
      const race = await Race.findOne();
      if (!race) {
        throw new Error('No race found in the database');
      }

      const response = await request(app).delete(`/races/${race._id}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });
});
