const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');

beforeAll(async () => {
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/eventpulse');
  }
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Events API Integration', () => {
  
  it('GET /api/events returns 200 OK with success status', async () => {
    const res = await request(app).get('/api/events');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body).toHaveProperty('data');
  });

  it('POST /api/events without token returns 401 Unauthorized', async () => {
    const res = await request(app).post('/api/events').send({ title: 'Test Event' });
    expect(res.statusCode).toBe(401);
    expect(res.body.status).toBe('fail');
  });

  it('GET /api/events/:id with invalid ObjectId returns 400 Bad Request', async () => {
    // This tests that your central error handler correctly catches Mongoose CastErrors
    const res = await request(app).get('/api/events/invalid_object_id_123');
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe('fail');
  });

});