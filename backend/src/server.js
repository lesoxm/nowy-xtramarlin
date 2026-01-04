require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');

const authRoutes = require('./routes/auth');
const competitionRoutes = require('./routes/competitions');
const photoRoutes = require('./routes/photos');
const statisticsRoutes = require('./routes/statistics');
const { initializeDatabase } = require('./config/database');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files for uploaded photos
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/competitions', competitionRoutes);
app.use('/api/photos', photoRoutes);
app.use('/api/statistics', statisticsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'xTraMarlin API is running' });
});

// WebSocket for live updates
wss.on('connection', (ws) => {
  console.log('New WebSocket connection');
  
  ws.on('message', (message) => {
    console.log('Received:', message);
  });

  ws.on('close', () => {
    console.log('WebSocket connection closed');
  });
});

// Broadcast function for live updates
const broadcast = (data) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};

// Make broadcast available globally
app.locals.broadcast = broadcast;

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Initialize database and start server
const PORT = process.env.PORT || 3001;

initializeDatabase().then(() => {
  server.listen(PORT, () => {
    console.log(`xTraMarlin Backend Server running on port ${PORT}`);
    console.log(`WebSocket Server running on ws://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});
