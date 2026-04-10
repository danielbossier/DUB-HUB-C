const db = require('../db/index');
const mlb = require('./mlb');

const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

const fetchers = {
  mlb: mlb.fetchStandings,
  // nfl, nba, nhl will be added here as each sport is supported
};

/**
 * Refreshes the win_cache for a sport/season if data is stale or missing.
 */
async function refreshIfStale(sport, seasonYear) {
  const row = db.prepare(`
    SELECT MIN(last_updated) as oldest
    FROM win_cache wc
    JOIN teams t ON t.id = wc.team_id
    WHERE t.sport = ? AND wc.season_year = ?
  `).get(sport, seasonYear);

  const oldestMs = row?.oldest ? new Date(row.oldest).getTime() : 0;
  const isStale = Date.now() - oldestMs > CACHE_TTL_MS;
  if (!isStale) return;

  const fetcher = fetchers[sport];
  if (!fetcher) throw new Error(`No standings fetcher registered for sport: ${sport}`);

  const records = await fetcher(seasonYear);

  const getTeam = db.prepare('SELECT id FROM teams WHERE sport = ? AND external_id = ?');
  const upsert = db.prepare(`
    INSERT INTO win_cache (team_id, season_year, wins, losses, last_updated)
    VALUES (?, ?, ?, ?, datetime('now'))
    ON CONFLICT(team_id, season_year) DO UPDATE SET
      wins         = excluded.wins,
      losses       = excluded.losses,
      last_updated = excluded.last_updated
  `);

  const upsertAll = db.transaction((recs) => {
    for (const rec of recs) {
      const team = getTeam.get(sport, rec.externalId);
      if (team) upsert.run(team.id, seasonYear, rec.wins, rec.losses);
    }
  });

  upsertAll(records);
  console.log(`[standings] Refreshed ${records.length} ${sport.toUpperCase()} records for ${seasonYear}.`);
}

/**
 * Returns all teams for a sport ranked by wins, with cached win totals.
 * Triggers a cache refresh if data is stale.
 */
async function getStandings(sport, seasonYear) {
  await refreshIfStale(sport, seasonYear);

  return db.prepare(`
    SELECT
      t.id, t.name, t.abbreviation, t.city, t.division, t.league,
      COALESCE(wc.wins,   0) AS wins,
      COALESCE(wc.losses, 0) AS losses,
      wc.last_updated
    FROM teams t
    LEFT JOIN win_cache wc ON wc.team_id = t.id AND wc.season_year = ?
    WHERE t.sport = ?
    ORDER BY wins DESC, losses ASC
  `).all(seasonYear, sport);
}

module.exports = { getStandings, refreshIfStale };
