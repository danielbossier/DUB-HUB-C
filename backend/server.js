const express = require('express');
const cors = require('cors');

const db = require('./db/index');
const { initSchema } = require('./db/schema');
const { seedIfEmpty } = require('./db/seed');
const standingsRouter = require('./routes/standings');
const poolsRouter = require('./routes/pools');

// Initialize DB
initSchema(db);
seedIfEmpty(db);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (_req, res) => res.json({ ok: true }));

// Routes
app.use('/api/sports', standingsRouter);
app.use('/api/pools', poolsRouter);

// 404 fallback for unmatched API routes
app.use('/api', (_req, res) => res.status(404).json({ error: 'Not found.' }));

app.listen(PORT, () => {
  console.log(`DUB HUB backend running on http://localhost:${PORT}`);
});
