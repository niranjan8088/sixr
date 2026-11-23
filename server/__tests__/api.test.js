const request = require('supertest');
const app = require('../index');

describe('AFTERLIGHT Backend API Test Suite', () => {
  beforeEach(() => {
    if (typeof app.resetStorage === 'function') {
      app.resetStorage();
    }
  });

  describe('GET /api/health', () => {
    it('should return 200 with server and API status', async () => {
      const res = await request(app).get('/api/health');
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('ok');
      expect(res.body.server).toBe('ok');
      expect(res.body.api).toBe('ok');
      expect(res.body).toHaveProperty('database');
      expect(res.body).toHaveProperty('persistence');
      expect(res.body).toHaveProperty('timestamp');
    });
  });

  describe('POST /api/results & POST /api/missions validation', () => {
    it('should reject request when body is empty', async () => {
      const res = await request(app).post('/api/results').send({});
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('errors');
      expect(Array.isArray(res.body.errors)).toBe(true);
    });

    it('should reject request when score is missing', async () => {
      const res = await request(app).post('/api/results').send({
        missionId: 'M-1',
        survivorsRescued: 2
      });
      expect(res.statusCode).toBe(400);
      expect(res.body.errors.some((e) => e.path === 'score' || e.msg.includes('Score'))).toBe(true);
    });

    it('should reject request when score is not a number', async () => {
      const res = await request(app).post('/api/results').send({
        missionId: 'M-1',
        score: 'not-a-number'
      });
      expect(res.statusCode).toBe(400);
      expect(res.body.errors.some((e) => e.path === 'score' || e.msg.includes('Score'))).toBe(true);
    });

    it('should reject request when score is negative', async () => {
      const res = await request(app).post('/api/results').send({
        missionId: 'M-1',
        score: -50
      });
      expect(res.statusCode).toBe(400);
      expect(res.body.errors.some((e) => e.path === 'score')).toBe(true);
    });

    it('should reject request when missionTime is negative', async () => {
      const res = await request(app).post('/api/results').send({
        missionId: 'M-1',
        score: 500,
        missionTime: -10
      });
      expect(res.statusCode).toBe(400);
      expect(res.body.errors.some((e) => e.path === 'missionTime')).toBe(true);
    });

    it('should accept request when score is zero', async () => {
      const res = await request(app).post('/api/results').send({
        missionId: 'M-1',
        score: 0
      });
      expect(res.statusCode).toBe(201);
      expect(res.body.data.score).toBe(0);
    });

    it('should accept request when missionTime is zero', async () => {
      const res = await request(app).post('/api/results').send({
        missionId: 'M-1',
        score: 100,
        missionTime: 0
      });
      expect(res.statusCode).toBe(201);
      expect(res.body.data.missionTime).toBe(0);
    });

    it('should reject request when survivorsRescued is negative', async () => {
      const res = await request(app).post('/api/results').send({
        missionId: 'M-1',
        score: 500,
        survivorsRescued: -1
      });
      expect(res.statusCode).toBe(400);
      expect(res.body.errors.some((e) => e.path === 'survivorsRescued')).toBe(true);
    });

    it('should reject request when neither missionId nor missionName is provided', async () => {
      const res = await request(app).post('/api/results').send({
        score: 1000,
        survivorsRescued: 3
      });
      expect(res.statusCode).toBe(400);
      expect(res.body.errors.some((e) => e.msg.includes('missionId or missionName'))).toBe(true);
    });
  });

  describe('POST /api/results - Successful Persistence', () => {
    it('should successfully record a complete mission result', async () => {
      const payload = {
        playerId: 'rescuer-01',
        playerName: 'Venki',
        missionName: 'AFTER THE COLLAPSE',
        survivorsRescued: 3,
        score: 1850,
        missionTime: 245.5,
        resourcesRemaining: { medicalKits: 2, foodRations: 1, waterCanteens: 3 },
        outcome: 'success'
      };

      const res = await request(app).post('/api/results').send(payload);
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('message', 'Result recorded successfully');
      expect(res.body.data.playerId).toBe('rescuer-01');
      expect(res.body.data.playerName).toBe('Venki');
      expect(res.body.data.score).toBe(1850);
      expect(res.body.data.survivorsRescued).toBe(3);
      expect(res.body.data.outcome).toBe('success');
    });

    it('should successfully record result using /api/missions alias', async () => {
      const payload = {
        playerId: 'rescuer-02',
        playerName: 'Niranjan',
        missionId: 'mission-collapse-01',
        score: 1200,
        survivorsRescued: 2,
        outcome: 'completed'
      };

      const res = await request(app).post('/api/missions').send(payload);
      expect(res.statusCode).toBe(201);
      expect(res.body.data.playerId).toBe('rescuer-02');
      expect(res.body.data.score).toBe(1200);
    });
  });

  describe('GET /api/results', () => {
    it('should retrieve list of recorded mission results', async () => {
      await request(app).post('/api/results').send({
        playerId: 'player-A',
        missionName: 'Sector 4 Search',
        score: 600,
        survivorsRescued: 1
      });

      await request(app).post('/api/results').send({
        playerId: 'player-B',
        missionName: 'Sector 7 Evac',
        score: 1400,
        survivorsRescued: 3
      });

      const res = await request(app).get('/api/results');
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(2);
    });
  });

  describe('GET /api/leaderboard and Sorting', () => {
    it('should return leaderboard sorted in descending order of score', async () => {
      await request(app).post('/api/results').send({
        playerId: 'player-low',
        playerName: 'Rookie',
        missionId: 'm1',
        score: 500,
        survivorsRescued: 1
      });

      await request(app).post('/api/results').send({
        playerId: 'player-high',
        playerName: 'Ace Rescuer',
        missionId: 'm1',
        score: 2500,
        survivorsRescued: 3
      });

      await request(app).post('/api/results').send({
        playerId: 'player-mid',
        playerName: 'Medic',
        missionId: 'm1',
        score: 1500,
        survivorsRescued: 2
      });

      const res = await request(app).get('/api/leaderboard');
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(3);

      // Verify descending order
      expect(res.body[0].score).toBe(2500);
      expect(res.body[0].playerName).toBe('Ace Rescuer');
      expect(res.body[1].score).toBe(1500);
      expect(res.body[1].playerName).toBe('Medic');
      expect(res.body[2].score).toBe(500);
      expect(res.body[2].playerName).toBe('Rookie');
    });

    it('should retain best high score, survivorsRescued, and timestamp when a lower score is submitted later', async () => {
      const firstRes = await request(app).post('/api/results').send({
        playerId: 'player-1',
        playerName: 'Venki Lead',
        missionId: 'm1',
        score: 2200,
        survivorsRescued: 5
      });
      expect(firstRes.statusCode).toBe(201);
      const originalTimestamp = firstRes.body.data.timestamp;

      // Second submission: lower score and fewer survivors
      const secondRes = await request(app).post('/api/results').send({
        playerId: 'player-1',
        playerName: 'Venki Alt',
        missionId: 'm1',
        score: 800,
        survivorsRescued: 1
      });
      expect(secondRes.statusCode).toBe(201);

      const res = await request(app).get('/api/leaderboard');
      expect(res.statusCode).toBe(200);
      const player1Entry = res.body.find((e) => e.playerId === 'player-1');
      expect(player1Entry).toBeDefined();
      expect(player1Entry.score).toBe(2200); // Retained highest score
      expect(player1Entry.survivorsRescued).toBe(5); // Retained survivors from best run
      expect(player1Entry.timestamp).toBe(originalTimestamp); // Retained timestamp from best run
      expect(player1Entry.playerName).toBe('Venki Lead'); // Retained playerName from best run
    });
  });

  describe('Fallback and Resilience', () => {
    it('operates fully in-memory when MongoDB is not connected', async () => {
      const healthRes = await request(app).get('/api/health');
      expect(healthRes.statusCode).toBe(200);
      expect(healthRes.body.database).toBe('unavailable');
      expect(healthRes.body.persistence).toBe('in-memory');

      const postRes = await request(app).post('/api/results').send({
        missionId: 'offline-test',
        score: 999
      });
      expect(postRes.statusCode).toBe(201);
    });

    it('returns 404 for nonexistent route', async () => {
      const res = await request(app).get('/api/unknown-endpoint');
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('error', 'Endpoint not found');
    });
  });
});
