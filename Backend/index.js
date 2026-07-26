require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS — allow frontend dev server
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
  credentials: true,
}));

app.use(express.json());

// Basic health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Chowk Parking API is running', timestamp: new Date().toISOString() });
});

// Import and use routes
const authRoutes = require('./routes/auth');
const parkingRoutes = require('./routes/parking');
app.use('/api/auth', authRoutes);
app.use('/api/parking', parkingRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.url} not found` });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`\n🅿️  Chowk Parking API running on http://localhost:${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/api/health`);
  console.log(`   Parking: http://localhost:${PORT}/api/parking`);
  console.log(`   Stats: http://localhost:${PORT}/api/parking/stats\n`);
});
