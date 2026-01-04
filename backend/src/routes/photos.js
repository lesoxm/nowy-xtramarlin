const express = require('express');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../config/database');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, JPG, PNG) are allowed'));
    }
  }
});

// Upload fish photo
router.post('/upload', authenticateToken, requireRole('competitor'), upload.single('photo'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No photo uploaded' });
  }

  const { competition_id, fish_species, length_cm, weight_kg } = req.body;

  if (!competition_id) {
    return res.status(400).json({ error: 'Competition ID required' });
  }

  const db = getDb();
  const userId = req.user.id;

  // First, verify user is registered for this competition
  db.get(
    'SELECT id FROM participants WHERE competition_id = ? AND user_id = ?',
    [competition_id, userId],
    (err, participant) => {
      if (err || !participant) {
        return res.status(400).json({ error: 'Not registered for this competition' });
      }

      const photoId = uuidv4();
      const filePath = `/uploads/${req.file.filename}`;

      db.run(
        'INSERT INTO photos (id, competition_id, participant_id, file_path, fish_species, length_cm, weight_kg) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [photoId, competition_id, participant.id, filePath, fish_species, length_cm, weight_kg],
        function(err) {
          if (err) {
            return res.status(500).json({ error: 'Failed to save photo' });
          }

          res.status(201).json({
            message: 'Photo uploaded successfully',
            photo: {
              id: photoId,
              file_path: filePath,
              fish_species,
              length_cm,
              weight_kg,
              judging_status: 'pending'
            }
          });

          // Broadcast new photo to all clients
          req.app.locals.broadcast({
            type: 'new_photo',
            data: { competition_id, username: req.user.username }
          });
        }
      );
    }
  );
});

// Get photos for a competition
router.get('/competition/:competition_id', (req, res) => {
  const { competition_id } = req.params;
  const { status } = req.query;

  const db = getDb();
  let query = `
    SELECT 
      ph.*,
      u.username,
      u.full_name
    FROM photos ph
    JOIN participants p ON ph.participant_id = p.id
    JOIN users u ON p.user_id = u.id
    WHERE ph.competition_id = ?
  `;

  const params = [competition_id];

  if (status) {
    query += ' AND ph.judging_status = ?';
    params.push(status);
  }

  query += ' ORDER BY ph.upload_time DESC';

  db.all(query, params, (err, photos) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch photos' });
    }
    res.json(photos);
  });
});

// Judge a photo (organizers only)
router.put('/:id/judge', authenticateToken, requireRole('organizer'), (req, res) => {
  const { id } = req.params;
  const { judging_status, points, judge_notes } = req.body;

  if (!['approved', 'rejected'].includes(judging_status)) {
    return res.status(400).json({ error: 'Invalid judging status' });
  }

  const db = getDb();

  db.run(
    'UPDATE photos SET judging_status = ?, points = ?, judge_notes = ? WHERE id = ?',
    [judging_status, points || 0, judge_notes, id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to judge photo' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Photo not found' });
      }

      res.json({ message: 'Photo judged successfully' });

      // Get competition_id to broadcast update
      db.get('SELECT competition_id FROM photos WHERE id = ?', [id], (err, photo) => {
        if (!err && photo) {
          req.app.locals.broadcast({
            type: 'photo_judged',
            data: { photo_id: id, competition_id: photo.competition_id, status: judging_status }
          });
        }
      });
    }
  );
});

// Get user's own photos
router.get('/my-photos', authenticateToken, requireRole('competitor'), (req, res) => {
  const userId = req.user.id;
  const db = getDb();

  const query = `
    SELECT 
      ph.*,
      c.name as competition_name
    FROM photos ph
    JOIN participants p ON ph.participant_id = p.id
    JOIN competitions c ON ph.competition_id = c.id
    WHERE p.user_id = ?
    ORDER BY ph.upload_time DESC
  `;

  db.all(query, [userId], (err, photos) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch photos' });
    }
    res.json(photos);
  });
});

module.exports = router;
