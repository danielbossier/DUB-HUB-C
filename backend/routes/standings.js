const express = require('express');
const router = express.Router();
const { getStandings } = require('../services/standings');
const db = require('../db/index');

const SUPPORTED_SPORTS = ['mlb'];
const DEFAULT_SEASON = new Date().getFullYear();

// GET /api/sports/:sport/standings?season=2026
router.get('/:sport/standings', async (req, res) => {
  const { sport } = req.params;
  const season = parseInt(req.query.season) || DEFAULT_SEASON;

  if (!SUPPORTED_SPORTS.includes(sport)) {
    return res.status(400).json({ error: `Sport '${sport}' is not yet supported.` });
  }

  try {
    const standings = await getStandings(sport, season);
    res.json({ sport, season, standings });
  } catch (err) {
    console.error('[standings route]', err.message);
    res.status(502).json({ error: 'Failed to fetch standings. Try again shortly.' });
  }
});

// GET /api/sports/:sport/teams — all teams for a sport (no win data)
router.get('/:sport/teams', (req, res) => {
  const { sport } = req.params;

  if (!SUPPORTED_SPORTS.includes(sport)) {
    return res.status(400).json({ error: `Sport '${sport}' is not yet supported.` });
  }

  const teams = db.prepare(`
    SELECT id, name, abbreviation, city, division, league
    FROM teams WHERE sport = ?
    ORDER BY league, division, name
  `).all(sport);

  res.json({ sport, teams });
});

module.exports = router;
