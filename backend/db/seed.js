// MLB team data — external_id matches the MLB Stats API team ID
const MLB_TEAMS = [
  // AL East
  { external_id: '110', name: 'Baltimore Orioles',    abbreviation: 'BAL', city: 'Baltimore',    division: 'AL East',    league: 'AL' },
  { external_id: '111', name: 'Boston Red Sox',       abbreviation: 'BOS', city: 'Boston',       division: 'AL East',    league: 'AL' },
  { external_id: '147', name: 'New York Yankees',     abbreviation: 'NYY', city: 'New York',     division: 'AL East',    league: 'AL' },
  { external_id: '139', name: 'Tampa Bay Rays',       abbreviation: 'TB',  city: 'Tampa Bay',    division: 'AL East',    league: 'AL' },
  { external_id: '141', name: 'Toronto Blue Jays',    abbreviation: 'TOR', city: 'Toronto',      division: 'AL East',    league: 'AL' },
  // AL Central
  { external_id: '145', name: 'Chicago White Sox',    abbreviation: 'CWS', city: 'Chicago',      division: 'AL Central', league: 'AL' },
  { external_id: '114', name: 'Cleveland Guardians',  abbreviation: 'CLE', city: 'Cleveland',    division: 'AL Central', league: 'AL' },
  { external_id: '116', name: 'Detroit Tigers',       abbreviation: 'DET', city: 'Detroit',      division: 'AL Central', league: 'AL' },
  { external_id: '118', name: 'Kansas City Royals',   abbreviation: 'KC',  city: 'Kansas City',  division: 'AL Central', league: 'AL' },
  { external_id: '142', name: 'Minnesota Twins',      abbreviation: 'MIN', city: 'Minnesota',    division: 'AL Central', league: 'AL' },
  // AL West
  { external_id: '117', name: 'Houston Astros',       abbreviation: 'HOU', city: 'Houston',      division: 'AL West',    league: 'AL' },
  { external_id: '108', name: 'Los Angeles Angels',   abbreviation: 'LAA', city: 'Los Angeles',  division: 'AL West',    league: 'AL' },
  { external_id: '133', name: 'Athletics',            abbreviation: 'ATH', city: 'Sacramento',   division: 'AL West',    league: 'AL' },
  { external_id: '136', name: 'Seattle Mariners',     abbreviation: 'SEA', city: 'Seattle',      division: 'AL West',    league: 'AL' },
  { external_id: '140', name: 'Texas Rangers',        abbreviation: 'TEX', city: 'Texas',        division: 'AL West',    league: 'AL' },
  // NL East
  { external_id: '144', name: 'Atlanta Braves',       abbreviation: 'ATL', city: 'Atlanta',      division: 'NL East',    league: 'NL' },
  { external_id: '146', name: 'Miami Marlins',        abbreviation: 'MIA', city: 'Miami',        division: 'NL East',    league: 'NL' },
  { external_id: '121', name: 'New York Mets',        abbreviation: 'NYM', city: 'New York',     division: 'NL East',    league: 'NL' },
  { external_id: '143', name: 'Philadelphia Phillies',abbreviation: 'PHI', city: 'Philadelphia', division: 'NL East',    league: 'NL' },
  { external_id: '120', name: 'Washington Nationals', abbreviation: 'WSH', city: 'Washington',   division: 'NL East',    league: 'NL' },
  // NL Central
  { external_id: '112', name: 'Chicago Cubs',         abbreviation: 'CHC', city: 'Chicago',      division: 'NL Central', league: 'NL' },
  { external_id: '113', name: 'Cincinnati Reds',      abbreviation: 'CIN', city: 'Cincinnati',   division: 'NL Central', league: 'NL' },
  { external_id: '158', name: 'Milwaukee Brewers',    abbreviation: 'MIL', city: 'Milwaukee',    division: 'NL Central', league: 'NL' },
  { external_id: '134', name: 'Pittsburgh Pirates',   abbreviation: 'PIT', city: 'Pittsburgh',   division: 'NL Central', league: 'NL' },
  { external_id: '138', name: 'St. Louis Cardinals',  abbreviation: 'STL', city: 'St. Louis',    division: 'NL Central', league: 'NL' },
  // NL West
  { external_id: '109', name: 'Arizona Diamondbacks', abbreviation: 'ARI', city: 'Arizona',      division: 'NL West',    league: 'NL' },
  { external_id: '115', name: 'Colorado Rockies',     abbreviation: 'COL', city: 'Colorado',     division: 'NL West',    league: 'NL' },
  { external_id: '119', name: 'Los Angeles Dodgers',  abbreviation: 'LAD', city: 'Los Angeles',  division: 'NL West',    league: 'NL' },
  { external_id: '135', name: 'San Diego Padres',     abbreviation: 'SD',  city: 'San Diego',    division: 'NL West',    league: 'NL' },
  { external_id: '137', name: 'San Francisco Giants', abbreviation: 'SF',  city: 'San Francisco',division: 'NL West',    league: 'NL' },
];

function seedIfEmpty(db) {
  const count = db.prepare('SELECT COUNT(*) as n FROM teams WHERE sport = ?').get('mlb').n;
  if (count > 0) return;

  const insert = db.prepare(`
    INSERT OR IGNORE INTO teams (sport, name, abbreviation, city, division, league, external_id)
    VALUES ('mlb', ?, ?, ?, ?, ?, ?)
  `);

  const insertAll = db.transaction((teams) => {
    for (const t of teams) {
      insert.run(t.name, t.abbreviation, t.city, t.division, t.league, t.external_id);
    }
  });

  insertAll(MLB_TEAMS);
  console.log(`Seeded ${MLB_TEAMS.length} MLB teams.`);
}

module.exports = { seedIfEmpty };
