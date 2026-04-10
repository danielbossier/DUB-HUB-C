# DUB HUB — Wins Pool App

## Project Overview

DUB HUB is a "Wins Pool" web app where users can track the total number of wins accumulated by a selected group of sports teams across a season. Users pick a set of teams at the start of a season and watch their cumulative win totals grow over time.

Supported leagues: **MLB** (live) · NFL, NBA, NHL (planned)

## Core Concept

- A **pool** is a private group of competing users, each assigned a fixed set of teams for the season
- Each pool is scoped to a single sport/league and season (e.g., 7 users × 4 MLB teams = 28 teams assigned)
- Team assignments are exclusive within a pool — no two participants own the same team
- The app tracks win totals for every assigned team
- A participant's score = the **sum of wins** across all their assigned teams
- Leaderboard ranks all participants in the pool by their total win count

## Key Features

1. **Pool Management** — Create a pool with a name, sport, season year, and teams-per-participant count
2. **Team Assignment** — Assign N teams per participant from a two-column (AL / NL) team picker; teams already assigned to another participant are grayed out and unselectable
3. **Pool Leaderboard** — Participants ranked by total wins; each row is expandable to show individual team win/loss breakdown
4. **League Standings View** — All 30 MLB teams ranked by wins; shows an Owner column when a pool is selected; unassigned teams show "—" in the Owner column
5. **Win Cache** — Win totals fetched from the MLB Stats API and cached in SQLite for 15 minutes; stale cache is refreshed automatically on the next request

## Tech Stack

- **Frontend**: React 18 + Vite 5, React Router v6, Tailwind CSS v3
- **Backend**: Node.js 18+ / Express 4
- **Database**: SQLite via `better-sqlite3` (file at `backend/data/dubhub.sqlite`)
- **MLB Data**: MLB Stats API (free, no key required)
- **Auth**: Not yet implemented — no login required currently
- **Hosting**: TBD

## Running Locally

```bash
npm run dev          # from project root — starts both servers via concurrently
```

- Backend: `http://localhost:3001`
- Frontend: `http://localhost:5173`

The Vite dev server proxies all `/api/*` requests to the backend, so the frontend always uses relative URLs.

## Sports Data APIs

Each league has its own service module. All fetching goes through `backend/services/standings.js` — routes and UI never call external APIs directly.

### MLB (implemented)
- **API**: MLB Stats API (free, no key required)
- Base URL: `https://statsapi.mlb.com/api/v1`
- Standings: `GET /standings?leagueId=103,104&season={year}&standingsTypes=regularSeason`

### NFL (planned)
- **API**: ESPN public API (unofficial, no key required)
- Standings: `GET https://site.api.espn.com/apis/v2/sports/football/nfl/standings`
- Note: only 17 games per season — win totals will be much lower than other sports

### NBA (planned)
- **API**: ESPN public API
- Standings: `GET https://site.api.espn.com/apis/v2/sports/basketball/nba/standings`

### NHL (planned)
- **API**: NHL Stats API (free, no key required)
- Base URL: `https://api-web.nhle.com/v1`
- Standings: `GET /standings/{YYYY-MM-DD}`
- Open question: whether overtime losses (OTL) count as losses or partial wins for scoring

> Note: ESPN's unofficial API endpoints may change without notice. If they become unreliable, consider the SportsDB API (`https://www.thesportsdb.com/api.php`) as a fallback — free tier with an API key.

## Actual Data Model (implemented)

```
teams
  id (autoincrement), sport, name, abbreviation, city,
  division, league, external_id   -- UNIQUE(sport, external_id)

pools
  id, name, sport, season_year, teams_per_participant, created_at

pool_members
  id, pool_id, display_name, created_at

team_assignments
  id, pool_id, member_id, team_id
  UNIQUE(pool_id, team_id)         -- enforces exclusive ownership within a pool

win_cache
  team_id, season_year, wins, losses, last_updated
  PRIMARY KEY(team_id, season_year)
```

- No `User` table yet — pool members are display names only, no login
- Score = `SUM(win_cache.wins)` for a member's assigned teams in a pool
- `sport` on `Pool` drives which API service is used; scoring logic is sport-agnostic above that layer

## Project Structure

```
/
├── CLAUDE.md
├── package.json               # root — runs both servers via concurrently
├── backend/
│   ├── package.json
│   ├── server.js              # Express entry point; initializes DB on startup
│   ├── data/
│   │   └── dubhub.sqlite      # SQLite DB file (gitignored)
│   ├── db/
│   │   ├── index.js           # DB connection (WAL mode, foreign keys on)
│   │   ├── schema.js          # CREATE TABLE IF NOT EXISTS statements
│   │   └── seed.js            # 30 MLB teams seeded on first run
│   ├── services/
│   │   ├── mlb.js             # MLB Stats API fetcher
│   │   └── standings.js       # Cache refresh logic + sport-agnostic getStandings()
│   └── routes/
│       ├── standings.js       # GET /api/sports/:sport/standings|teams
│       └── pools.js           # Full pool CRUD, members, team assignments
└── frontend/
    ├── package.json
    ├── vite.config.js         # proxies /api/* to localhost:3001
    ├── tailwind.config.js
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx            # routing: /mlb, /mlb/pools/:id, /mlb/pools/new, etc.
        ├── index.css
        ├── components/
        │   └── SportTabs.jsx  # MLB active; NFL/NBA/NHL shown as coming soon
        ├── pages/
        │   ├── LeagueStandings.jsx   # all teams ranked by wins; owner column with pool selected
        │   ├── PoolLeaderboard.jsx   # participants ranked by total wins; expandable rows
        │   └── PoolSetup.jsx         # create pool; add members; assign teams (AL/NL two-column picker)
        └── services/
            └── api.js         # all fetch calls to the backend API
```

## Development Guidelines

- To add a new sport: (1) create `backend/services/{sport}.js` with a `fetchStandings(year)` function, (2) register it in the `fetchers` map in `standings.js`, (3) seed teams via `db/seed.js`, (4) enable the sport tab in `SportTabs.jsx`
- Win totals are the single source of truth for scoring — never derive scores any other way
- Season year and sport are stored per pool — never hardcode them
- Cache TTL is 15 minutes (`CACHE_TTL_MS` in `services/standings.js`) — adjust if needed for game-day freshness
- All data persists in `backend/data/dubhub.sqlite` across server restarts; only the win cache goes stale (auto-refreshes on next request)

## Out of Scope (for now)

- Real-money wagering or prize management
- Live play-by-play or inning-by-inning updates (daily final win totals are sufficient)
- Support for college sports or international leagues
- Cross-sport pools (mixing teams from different leagues in a single pool)
- User authentication / login

## Open Questions

- Should unassigned teams be visually distinguished (e.g., grayed out) in the League Standings View?
- Should a live snake draft mechanic be supported, or is manual admin assignment sufficient?
- Should users be able to belong to multiple pools simultaneously?
- What does the invite/share flow look like — shareable link, email, or username lookup?
