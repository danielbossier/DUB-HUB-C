/**
 * Creates all tables if they don't exist.
 * Safe to call on every startup — uses IF NOT EXISTS.
 */
function initSchema(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS teams (
      id        INTEGER PRIMARY KEY AUTOINCREMENT,
      sport     TEXT    NOT NULL,
      name      TEXT    NOT NULL,
      abbreviation TEXT NOT NULL,
      city      TEXT    NOT NULL,
      division  TEXT,
      league    TEXT,
      external_id TEXT  NOT NULL,  -- sport-specific API team ID
      UNIQUE(sport, external_id)
    );

    CREATE TABLE IF NOT EXISTS pools (
      id                   INTEGER PRIMARY KEY AUTOINCREMENT,
      name                 TEXT    NOT NULL,
      sport                TEXT    NOT NULL DEFAULT 'mlb',
      season_year          INTEGER NOT NULL,
      teams_per_participant INTEGER NOT NULL DEFAULT 4,
      created_at           TEXT    NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS pool_members (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      pool_id      INTEGER NOT NULL REFERENCES pools(id) ON DELETE CASCADE,
      display_name TEXT    NOT NULL,
      created_at   TEXT    NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS team_assignments (
      id        INTEGER PRIMARY KEY AUTOINCREMENT,
      pool_id   INTEGER NOT NULL REFERENCES pools(id) ON DELETE CASCADE,
      member_id INTEGER NOT NULL REFERENCES pool_members(id) ON DELETE CASCADE,
      team_id   INTEGER NOT NULL REFERENCES teams(id),
      UNIQUE(pool_id, team_id)
    );

    CREATE TABLE IF NOT EXISTS win_cache (
      team_id     INTEGER NOT NULL REFERENCES teams(id),
      season_year INTEGER NOT NULL,
      wins        INTEGER NOT NULL DEFAULT 0,
      losses      INTEGER NOT NULL DEFAULT 0,
      last_updated TEXT   NOT NULL,
      PRIMARY KEY (team_id, season_year)
    );
  `);
}

module.exports = { initSchema };
