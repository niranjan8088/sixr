// Optional backend server for AFTERLIGHT leaderboards and mission logs
import express from 'express';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// In-memory leaderboards fallback if MongoDB is not connected
const missionResults = [
  { operative: 'Echo-1', score: 1150, rank: 'S', survivorsSaved: 3, timeRemaining: 184, date: new Date().toISOString() },
  { operative: 'Vanguard-4', score: 980, rank: 'A', survivorsSaved: 3, timeRemaining: 112, date: new Date().toISOString() },
  { operative: 'Rescue-9', score: 720, rank: 'B', survivorsSaved: 2, timeRemaining: 45, date: new Date().toISOString() }
];

app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    game: 'AFTERLIGHT',
    sector: '4-B',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/leaderboard', (req, res) => {
  res.json(missionResults.sort((a, b) => b.score - a.score));
});

app.post('/api/results', (req, res) => {
  const { operative, score, rank, survivorsSaved, timeRemaining } = req.body;
  if (!score) {
    return res.status(400).json({ error: 'Missing mission score payload' });
  }

  const record = {
    operative: operative || 'Operative',
    score,
    rank: rank || 'C',
    survivorsSaved: survivorsSaved || 0,
    timeRemaining: timeRemaining || 0,
    date: new Date().toISOString()
  };

  missionResults.push(record);
  res.status(201).json({ success: true, record });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`AFTERLIGHT Mission API running on port ${PORT}`);
  });
}

export default app;
