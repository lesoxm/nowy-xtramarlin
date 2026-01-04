const express = require('express');
const { getDb } = require('../config/database');

const router = express.Router();

// Get overall platform statistics
router.get('/platform', (req, res) => {
  const db = getDb();

  db.get(`
    SELECT 
      (SELECT COUNT(*) FROM users WHERE role = 'competitor') as total_competitors,
      (SELECT COUNT(*) FROM competitions) as total_competitions,
      (SELECT COUNT(*) FROM competitions WHERE status = 'active') as active_competitions,
      (SELECT COUNT(*) FROM photos WHERE judging_status = 'approved') as total_approved_catches
  `, (err, stats) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch statistics' });
    }
    res.json(stats);
  });
});

// Get competition statistics
router.get('/competition/:id', (req, res) => {
  const { id } = req.params;
  const db = getDb();

  const queries = {
    basic: `
      SELECT 
        COUNT(DISTINCT p.id) as total_participants,
        COUNT(ph.id) as total_photos,
        COUNT(CASE WHEN ph.judging_status = 'pending' THEN 1 END) as pending_photos,
        COUNT(CASE WHEN ph.judging_status = 'approved' THEN 1 END) as approved_photos,
        COUNT(CASE WHEN ph.judging_status = 'rejected' THEN 1 END) as rejected_photos
      FROM participants p
      LEFT JOIN photos ph ON ph.participant_id = p.id
      WHERE p.competition_id = ?
    `,
    fishStats: `
      SELECT 
        fish_species,
        COUNT(*) as count,
        AVG(length_cm) as avg_length,
        MAX(length_cm) as max_length,
        AVG(weight_kg) as avg_weight,
        MAX(weight_kg) as max_weight
      FROM photos
      WHERE competition_id = ? AND judging_status = 'approved' AND fish_species IS NOT NULL
      GROUP BY fish_species
      ORDER BY count DESC
    `,
    topScorers: `
      SELECT 
        u.username,
        u.full_name,
        COUNT(ph.id) as fish_count,
        SUM(ph.points) as total_points
      FROM participants p
      JOIN users u ON p.user_id = u.id
      LEFT JOIN photos ph ON ph.participant_id = p.id AND ph.judging_status = 'approved'
      WHERE p.competition_id = ?
      GROUP BY u.id, u.username, u.full_name
      ORDER BY total_points DESC
      LIMIT 10
    `
  };

  Promise.all([
    new Promise((resolve, reject) => {
      db.get(queries.basic, [id], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    }),
    new Promise((resolve, reject) => {
      db.all(queries.fishStats, [id], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    }),
    new Promise((resolve, reject) => {
      db.all(queries.topScorers, [id], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    })
  ])
  .then(([basic, fishStats, topScorers]) => {
    res.json({
      basic,
      fish_statistics: fishStats,
      top_scorers: topScorers
    });
  })
  .catch(err => {
    res.status(500).json({ error: 'Failed to fetch statistics' });
  });
});

// Get user statistics
router.get('/user/:userId', (req, res) => {
  const { userId } = req.params;
  const db = getDb();

  db.get(`
    SELECT 
      COUNT(DISTINCT p.competition_id) as competitions_entered,
      COUNT(ph.id) as total_catches,
      COUNT(CASE WHEN ph.judging_status = 'approved' THEN 1 END) as approved_catches,
      COALESCE(SUM(ph.points), 0) as total_points,
      MAX(ph.points) as best_catch_points
    FROM participants p
    LEFT JOIN photos ph ON ph.participant_id = p.id
    WHERE p.user_id = ?
  `, [userId], (err, stats) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch user statistics' });
    }
    res.json(stats);
  });
});

// Get activity timeline for a competition
router.get('/competition/:id/timeline', (req, res) => {
  const { id } = req.params;
  const db = getDb();

  const query = `
    SELECT 
      'photo_upload' as event_type,
      ph.upload_time as event_time,
      u.username,
      ph.fish_species,
      ph.judging_status
    FROM photos ph
    JOIN participants p ON ph.participant_id = p.id
    JOIN users u ON p.user_id = u.id
    WHERE ph.competition_id = ?
    ORDER BY event_time DESC
    LIMIT 50
  `;

  db.all(query, [id], (err, timeline) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch timeline' });
    }
    res.json(timeline);
  });
});

module.exports = router;
