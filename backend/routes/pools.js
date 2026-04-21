const express = require('express');
const router = express.Router();
const db = require('../db/index');
const { getStandings } = require('../services/standings');

const DEFAULT_SEASON = new Date().getFullYear();

// GET /api/pools — list all pools
router.get('/', (req, res) => {
  const pools = db.prepare(`
    SELECT p.*, COUNT(pm.id) AS member_count
    FROM pools p
    LEFT JOIN pool_members pm ON pm.pool_id = p.id
    GROUP BY p.id
    ORDER BY p.created_at DESC
  `).all();
  res.json({ pools });
});

// POST /api/pools — create a pool
router.post('/', (req, res) => {
  const { name, sport = 'mlb', season_year = DEFAULT_SEASON, teams_per_participant = 4 } = req.body;

  if (!name || typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ error: 'Pool name is required.' });
  }

  const result = db.prepare(`
    INSERT INTO pools (name, sport, season_year, teams_per_participant)
    VALUES (?, ?, ?, ?)
  `).run(name.trim(), sport, season_year, teams_per_participant);

  const pool = db.prepare('SELECT * FROM pools WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json({ pool });
});

// GET /api/pools/:id — pool details + leaderboard with win totals
router.get('/:id', async (req, res) => {
  const pool = db.prepare('SELECT * FROM pools WHERE id = ?').get(req.params.id);
  if (!pool) return res.status(404).json({ error: 'Pool not found.' });

  try {
    // Ensure win cache is fresh
    const { refreshIfStale } = require('../services/standings');
    await refreshIfStale(pool.sport, pool.season_year);

    const members = db.prepare(`
      SELECT pm.id, pm.display_name
      FROM pool_members pm
      WHERE pm.pool_id = ?
      ORDER BY pm.created_at
    `).all(pool.id);

    const leaderboard = members.map((member) => {
      const teams = db.prepare(`
        SELECT t.id, t.name, t.abbreviation, t.city, t.external_id,
               COALESCE(wc.wins,   0) AS wins,
               COALESCE(wc.losses, 0) AS losses,
               wc.points,
               COALESCE(wc.points, wc.wins, 0) AS score
        FROM team_assignments ta
        JOIN teams t ON t.id = ta.team_id
        LEFT JOIN win_cache wc ON wc.team_id = t.id AND wc.season_year = ?
        WHERE ta.pool_id = ? AND ta.member_id = ?
        ORDER BY score DESC
      `).all(pool.season_year, pool.id, member.id);

      const totalScore = teams.reduce((sum, t) => sum + t.score, 0);
      return { ...member, totalScore, teams };
    });

    // Sort by totalWins descending
    leaderboard.sort((a, b) => b.totalScore - a.totalScore);

    res.json({ pool, leaderboard });
  } catch (err) {
    console.error('[pools route]', err.message);
    res.status(502).json({ error: 'Failed to load pool data. Try again shortly.' });
  }
});

// POST /api/pools/:id/members — add a participant
router.post('/:id/members', (req, res) => {
  const pool = db.prepare('SELECT * FROM pools WHERE id = ?').get(req.params.id);
  if (!pool) return res.status(404).json({ error: 'Pool not found.' });

  const { display_name } = req.body;
  if (!display_name || typeof display_name !== 'string' || !display_name.trim()) {
    return res.status(400).json({ error: 'display_name is required.' });
  }

  const result = db.prepare(`
    INSERT INTO pool_members (pool_id, display_name) VALUES (?, ?)
  `).run(pool.id, display_name.trim());

  const member = db.prepare('SELECT * FROM pool_members WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json({ member });
});

// POST /api/pools/:id/members/:memberId/assignments
// Body: { team_ids: [1, 2, 3, 4] }
// Replaces all current assignments for this member in this pool.
router.post('/:id/members/:memberId/assignments', (req, res) => {
  const pool = db.prepare('SELECT * FROM pools WHERE id = ?').get(req.params.id);
  if (!pool) return res.status(404).json({ error: 'Pool not found.' });

  const member = db.prepare(
    'SELECT * FROM pool_members WHERE id = ? AND pool_id = ?'
  ).get(req.params.memberId, pool.id);
  if (!member) return res.status(404).json({ error: 'Member not found in this pool.' });

  const { team_ids } = req.body;
  if (!Array.isArray(team_ids)) {
    return res.status(400).json({ error: 'team_ids must be an array.' });
  }
  if (team_ids.length > pool.teams_per_participant) {
    return res.status(400).json({
      error: `Pool allows at most ${pool.teams_per_participant} teams per participant.`,
    });
  }

  // Validate all team IDs exist and belong to the right sport
  for (const teamId of team_ids) {
    const team = db.prepare('SELECT id FROM teams WHERE id = ? AND sport = ?').get(teamId, pool.sport);
    if (!team) {
      return res.status(400).json({ error: `Team ID ${teamId} is not valid for sport '${pool.sport}'.` });
    }
  }

  const replaceAssignments = db.transaction((memberId, poolId, teamIds) => {
    db.prepare('DELETE FROM team_assignments WHERE pool_id = ? AND member_id = ?').run(poolId, memberId);
    const insert = db.prepare(
      'INSERT INTO team_assignments (pool_id, member_id, team_id) VALUES (?, ?, ?)'
    );
    for (const teamId of teamIds) {
      insert.run(poolId, memberId, teamId);
    }
  });

  try {
    replaceAssignments(member.id, pool.id, team_ids);
    const assigned = db.prepare(`
      SELECT t.id, t.name, t.abbreviation FROM team_assignments ta
      JOIN teams t ON t.id = ta.team_id
      WHERE ta.pool_id = ? AND ta.member_id = ?
    `).all(pool.id, member.id);
    res.json({ member, assigned_teams: assigned });
  } catch (err) {
    if (err.message.includes('UNIQUE constraint')) {
      return res.status(409).json({ error: 'One or more teams are already assigned to another participant in this pool.' });
    }
    throw err;
  }
});

// DELETE /api/pools/:id — delete a pool
router.delete('/:id', (req, res) => {
  const pool = db.prepare('SELECT * FROM pools WHERE id = ?').get(req.params.id);
  if (!pool) return res.status(404).json({ error: 'Pool not found.' });

  db.prepare('DELETE FROM pools WHERE id = ?').run(pool.id);
  res.json({ deleted: true });
});

module.exports = router;
