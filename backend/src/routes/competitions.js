const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../config/database');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get all competitions
router.get('/', (req, res) => {
  const db = getDb();
  const { status } = req.query;

  let query = 'SELECT c.*, u.username as organizer_name FROM competitions c JOIN users u ON c.organizer_id = u.id';
  const params = [];

  if (status) {
    query += ' WHERE c.status = ?';
    params.push(status);
  }

  query += ' ORDER BY c.start_date DESC';

  db.all(query, params, (err, competitions) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch competitions' });
    }
    res.json(competitions);
  });
});

// Get single competition
router.get('/:id', (req, res) => {
  const db = getDb();
  const { id } = req.params;

  db.get(
    'SELECT c.*, u.username as organizer_name FROM competitions c JOIN users u ON c.organizer_id = u.id WHERE c.id = ?',
    [id],
    (err, competition) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (!competition) {
        return res.status(404).json({ error: 'Competition not found' });
      }
      res.json(competition);
    }
  );
});

// Create competition (organizers only)
router.post('/', authenticateToken, requireRole('organizer'), (req, res) => {
  const { name, description, start_date, end_date } = req.body;
  const organizer_id = req.user.id;

  if (!name || !start_date || !end_date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const db = getDb();
  const competitionId = uuidv4();
  const status = new Date(start_date) > new Date() ? 'upcoming' : 'active';

  db.run(
    'INSERT INTO competitions (id, name, description, start_date, end_date, status, organizer_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [competitionId, name, description, start_date, end_date, status, organizer_id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to create competition' });
      }

      res.status(201).json({
        message: 'Competition created successfully',
        competition: {
          id: competitionId,
          name,
          description,
          start_date,
          end_date,
          status,
          organizer_id
        }
      });

      // Broadcast new competition to all clients
      req.app.locals.broadcast({ type: 'new_competition', data: { id: competitionId, name } });
    }
  );
});

// Register for competition
router.post('/:id/register', authenticateToken, requireRole('competitor'), (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const db = getDb();
  const participantId = uuidv4();

  db.run(
    'INSERT INTO participants (id, competition_id, user_id) VALUES (?, ?, ?)',
    [participantId, id, userId],
    function(err) {
      if (err) {
        if (err.message.includes('UNIQUE')) {
          return res.status(409).json({ error: 'Already registered for this competition' });
        }
        return res.status(500).json({ error: 'Failed to register' });
      }

      res.json({
        message: 'Successfully registered for competition',
        participant_id: participantId
      });

      // Broadcast registration update
      req.app.locals.broadcast({ type: 'new_participant', data: { competition_id: id } });
    }
  );
});

// Get competition leaderboard
router.get('/:id/leaderboard', (req, res) => {
  const { id } = req.params;
  const db = getDb();

  const query = `
    SELECT 
      u.id as user_id,
      u.username,
      u.full_name,
      COUNT(ph.id) as total_fish,
      COALESCE(SUM(ph.points), 0) as total_points,
      MAX(ph.upload_time) as last_catch
    FROM participants p
    JOIN users u ON p.user_id = u.id
    LEFT JOIN photos ph ON ph.participant_id = p.id AND ph.judging_status = 'approved'
    WHERE p.competition_id = ?
    GROUP BY u.id, u.username, u.full_name
    ORDER BY total_points DESC, total_fish DESC
  `;

  db.all(query, [id], (err, leaderboard) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch leaderboard' });
    }
    res.json(leaderboard);
  });
});

module.exports = router;
