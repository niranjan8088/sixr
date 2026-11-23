// server/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || '';

// In-memory fallback storage
let missions = [];
let leaderboard = [];

// Helper to reset storage (useful for isolated tests)
function resetStorage() {
  missions = [];
  leaderboard = [];
}

let MissionModel = null;
let LeaderboardModel = null;

if (MONGODB_URI) {
  mongoose
    .connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 2000 // Fast timeout so offline DB never delays server
    })
    .then(() => {
      console.log('MongoDB connected');
    })
    .catch((err) => {
      console.warn('MongoDB connection failed, falling back to in-memory mode:', err.message);
    });

  const missionSchema = new mongoose.Schema(
    {
      playerId: { type: String, default: 'anonymous' },
      playerName: { type: String, default: 'Anonymous' },
      missionId: { type: String, required: true },
      missionName: { type: String },
      survivorsRescued: { type: Number, default: 0 },
      score: { type: Number, required: true },
      missionTime: { type: Number, default: 0 },
      resourcesRemaining: { type: Object, default: {} },
      outcome: { type: String, default: 'completed' },
      timestamp: { type: Date, default: Date.now }
    },
    { strict: false }
  );

  const leaderboardSchema = new mongoose.Schema(
    {
      playerId: { type: String, required: true, unique: true },
      playerName: { type: String, default: 'Anonymous' },
      score: { type: Number, required: true },
      survivorsRescued: { type: Number, default: 0 },
      timestamp: { type: Date, default: Date.now }
    },
    { strict: false }
  );

  MissionModel = mongoose.model('Mission', missionSchema);
  LeaderboardModel = mongoose.model('Leaderboard', leaderboardSchema);
}

// Check if MongoDB is connected and ready
function isMongoReady() {
  return Boolean(MONGODB_URI && mongoose.connection.readyState === 1 && MissionModel && LeaderboardModel);
}

// GET /api/health
app.get('/api/health', (req, res) => {
  const dbStatus = isMongoReady() ? 'connected' : 'unavailable';
  res.json({
    status: 'ok',
    server: 'ok',
    api: 'ok',
    database: dbStatus,
    persistence: isMongoReady() ? 'mongodb' : 'in-memory',
    timestamp: Date.now()
  });
});

// Validation middleware for mission results
const validateMissionResult = [
  body('score').isNumeric().withMessage('Score must be a valid number'),
  body('playerId').optional().isString().trim(),
  body('playerName').optional().isString().trim(),
  body('survivorsRescued')
    .optional()
    .isInt({ min: 0 })
    .withMessage('survivorsRescued must be an integer >= 0'),
  body('missionTime')
    .optional()
    .isNumeric()
    .withMessage('missionTime must be a number'),
  body('resourcesRemaining')
    .optional()
    .isObject()
    .withMessage('resourcesRemaining must be an object'),
  body('outcome')
    .optional()
    .isString()
    .trim(),
  (req, res, next) => {
    // Check that at least missionId or missionName is provided
    if (!req.body.missionId && !req.body.missionName) {
      return res.status(400).json({
        errors: [{ msg: 'missionId or missionName is required', path: 'missionId' }]
      });
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// Handler for storing mission results (used for both /api/results and /api/missions)
async function recordMissionResult(req, res) {
  const playerId = req.body.playerId || 'anonymous';
  const playerName = req.body.playerName || (playerId !== 'anonymous' ? playerId : 'Anonymous Survivor');
  const missionId = req.body.missionId || req.body.missionName || 'AFTER THE COLLAPSE';
  const missionName = req.body.missionName || missionId;
  const survivorsRescued = Number(req.body.survivorsRescued) || 0;
  const score = Number(req.body.score);
  const missionTime = Number(req.body.missionTime) || 0;
  const resourcesRemaining = req.body.resourcesRemaining || {};
  const outcome = req.body.outcome || (survivorsRescued > 0 ? 'success' : 'completed');
  const timestamp = Date.now();

  const record = {
    playerId,
    playerName,
    missionId,
    missionName,
    survivorsRescued,
    score,
    missionTime,
    resourcesRemaining,
    outcome,
    timestamp
  };

  // Always persist to in-memory fallback
  missions.push(record);

  // Update in-memory leaderboard (retain best score per player)
  const existingPlayerIndex = leaderboard.findIndex((item) => item.playerId === playerId);
  if (existingPlayerIndex !== -1) {
    if (score > leaderboard[existingPlayerIndex].score) {
      leaderboard[existingPlayerIndex].score = score;
      leaderboard[existingPlayerIndex].survivorsRescued = survivorsRescued;
      leaderboard[existingPlayerIndex].timestamp = timestamp;
    }
    leaderboard[existingPlayerIndex].playerName = playerName;
  } else {
    leaderboard.push({
      playerId,
      playerName,
      score,
      survivorsRescued,
      timestamp
    });
  }

  // If MongoDB is available, also persist asynchronously
  if (isMongoReady()) {
    try {
      const doc = new MissionModel(record);
      await doc.save();

      await LeaderboardModel.findOneAndUpdate(
        { playerId },
        {
          $max: { score },
          $set: {
            playerName,
            survivorsRescued,
            timestamp
          }
        },
        { upsert: true, new: true }
      );
    } catch (mongoErr) {
      console.warn('MongoDB save failed, retained in-memory:', mongoErr.message);
    }
  }

  return res.status(201).json({
    message: 'Result recorded successfully',
    data: record
  });
}

// POST /api/results and POST /api/missions (for compatibility)
app.post('/api/results', validateMissionResult, recordMissionResult);
app.post('/api/missions', validateMissionResult, recordMissionResult);

// GET /api/results – return all saved results
app.get('/api/results', async (req, res) => {
  try {
    if (isMongoReady()) {
      const mongoResults = await MissionModel.find().sort({ timestamp: -1 }).limit(50).lean();
      return res.json(mongoResults);
    }
    // Return in-memory missions (newest first)
    const reversed = missions.slice().reverse();
    return res.json(reversed);
  } catch (err) {
    console.error('Error in GET /api/results, returning in-memory:', err.message);
    return res.json(missions.slice().reverse());
  }
});

// GET /api/leaderboard – return top 20 best scores
app.get('/api/leaderboard', async (req, res) => {
  try {
    if (isMongoReady()) {
      const topMongo = await LeaderboardModel.find().sort({ score: -1 }).limit(20).lean();
      return res.json(topMongo);
    }
    // Sort in-memory leaderboard descending by score
    const sorted = leaderboard
      .slice()
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);
    return res.json(sorted);
  } catch (err) {
    console.error('Error in GET /api/leaderboard, returning in-memory:', err.message);
    const sorted = leaderboard
      .slice()
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);
    return res.json(sorted);
  }
});

// 404 handler for unmatched routes
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Central error handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`AFTERLIGHT backend listening on port ${PORT}`);
  });
}

module.exports = app;
module.exports.resetStorage = resetStorage;
