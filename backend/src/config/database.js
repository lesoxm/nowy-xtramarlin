const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../../database.sqlite');
const db = new sqlite3.Database(dbPath);

const initializeDatabase = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Users table
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          username TEXT UNIQUE NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          role TEXT NOT NULL CHECK(role IN ('competitor', 'organizer', 'spectator')),
          full_name TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Competitions table
      db.run(`
        CREATE TABLE IF NOT EXISTS competitions (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT,
          start_date DATETIME NOT NULL,
          end_date DATETIME NOT NULL,
          status TEXT NOT NULL CHECK(status IN ('upcoming', 'active', 'completed')),
          organizer_id TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (organizer_id) REFERENCES users(id)
        )
      `);

      // Participants table
      db.run(`
        CREATE TABLE IF NOT EXISTS participants (
          id TEXT PRIMARY KEY,
          competition_id TEXT NOT NULL,
          user_id TEXT NOT NULL,
          registration_date DATETIME DEFAULT CURRENT_TIMESTAMP,
          status TEXT DEFAULT 'active',
          FOREIGN KEY (competition_id) REFERENCES competitions(id),
          FOREIGN KEY (user_id) REFERENCES users(id),
          UNIQUE(competition_id, user_id)
        )
      `);

      // Photos table (fish catches)
      db.run(`
        CREATE TABLE IF NOT EXISTS photos (
          id TEXT PRIMARY KEY,
          competition_id TEXT NOT NULL,
          participant_id TEXT NOT NULL,
          file_path TEXT NOT NULL,
          fish_species TEXT,
          length_cm REAL,
          weight_kg REAL,
          upload_time DATETIME DEFAULT CURRENT_TIMESTAMP,
          judging_status TEXT DEFAULT 'pending' CHECK(judging_status IN ('pending', 'approved', 'rejected')),
          points INTEGER DEFAULT 0,
          judge_notes TEXT,
          FOREIGN KEY (competition_id) REFERENCES competitions(id),
          FOREIGN KEY (participant_id) REFERENCES participants(id)
        )
      `);

      // Leaderboard view (calculated)
      db.run(`
        CREATE TABLE IF NOT EXISTS leaderboard (
          competition_id TEXT,
          participant_id TEXT,
          user_id TEXT,
          username TEXT,
          total_points INTEGER,
          total_fish INTEGER,
          last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (competition_id, participant_id)
        )
      `);

      console.log('Database initialized successfully');
      resolve();
    });

    db.on('error', (err) => {
      reject(err);
    });
  });
};

const getDb = () => db;

module.exports = { initializeDatabase, getDb };
