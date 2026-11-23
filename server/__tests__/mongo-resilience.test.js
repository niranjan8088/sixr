const request = require('supertest');
const mongoose = require('mongoose');

describe('MongoDB Connection Failure Resilience', () => {
  let app;

  beforeAll(async () => {
    // Set an invalid / unreachable MongoDB URI with 500ms timeout
    process.env.MONGODB_URI = 'mongodb://127.0.0.1:27019/unreachable_db';
    // Clear module cache to re-instantiate server with the bad URI
    jest.resetModules();
    app = require('../index');
  });

  afterAll(async () => {
    await mongoose.disconnect();
    delete process.env.MONGODB_URI;
  });

  it('does not crash when MongoDB is unreachable and continues serving /api/health', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.server).toBe('ok');
    expect(res.body.database).toBe('unavailable');
    expect(res.body.persistence).toBe('in-memory');
  });

  it('allows recording missions and reading leaderboard even when MongoDB fails to connect', async () => {
    const postRes = await request(app).post('/api/results').send({
      playerId: 'survivor-x',
      missionId: 'disaster-zone',
      score: 1750,
      survivorsRescued: 2
    });

    expect(postRes.statusCode).toBe(201);
    expect(postRes.body.data.score).toBe(1750);

    const lbRes = await request(app).get('/api/leaderboard');
    expect(lbRes.statusCode).toBe(200);
    expect(lbRes.body.some((e) => e.playerId === 'survivor-x')).toBe(true);
  });
});
