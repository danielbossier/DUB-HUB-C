// external_id values:
//   MLB  — MLB Stats API numeric team ID
//   NFL  — ESPN API numeric team ID (verify against ESPN API when implementing service)
//   NBA  — ESPN API numeric team ID (verify against ESPN API when implementing service)
//   NHL  — NHL Stats API team abbreviation

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

const NFL_TEAMS = [
  // AFC East
  { external_id: '2',  name: 'Buffalo Bills',           abbreviation: 'BUF', city: 'Buffalo',        division: 'AFC East',     league: 'AFC' },
  { external_id: '15', name: 'Miami Dolphins',           abbreviation: 'MIA', city: 'Miami',          division: 'AFC East',     league: 'AFC' },
  { external_id: '17', name: 'New England Patriots',     abbreviation: 'NE',  city: 'New England',    division: 'AFC East',     league: 'AFC' },
  { external_id: '20', name: 'New York Jets',            abbreviation: 'NYJ', city: 'New York',       division: 'AFC East',     league: 'AFC' },
  // AFC North
  { external_id: '33', name: 'Baltimore Ravens',         abbreviation: 'BAL', city: 'Baltimore',      division: 'AFC North',    league: 'AFC' },
  { external_id: '4',  name: 'Cincinnati Bengals',       abbreviation: 'CIN', city: 'Cincinnati',     division: 'AFC North',    league: 'AFC' },
  { external_id: '5',  name: 'Cleveland Browns',         abbreviation: 'CLE', city: 'Cleveland',      division: 'AFC North',    league: 'AFC' },
  { external_id: '23', name: 'Pittsburgh Steelers',      abbreviation: 'PIT', city: 'Pittsburgh',     division: 'AFC North',    league: 'AFC' },
  // AFC South
  { external_id: '34', name: 'Houston Texans',           abbreviation: 'HOU', city: 'Houston',        division: 'AFC South',    league: 'AFC' },
  { external_id: '11', name: 'Indianapolis Colts',       abbreviation: 'IND', city: 'Indianapolis',   division: 'AFC South',    league: 'AFC' },
  { external_id: '30', name: 'Jacksonville Jaguars',     abbreviation: 'JAX', city: 'Jacksonville',   division: 'AFC South',    league: 'AFC' },
  { external_id: '10', name: 'Tennessee Titans',         abbreviation: 'TEN', city: 'Tennessee',      division: 'AFC South',    league: 'AFC' },
  // AFC West
  { external_id: '7',  name: 'Denver Broncos',           abbreviation: 'DEN', city: 'Denver',         division: 'AFC West',     league: 'AFC' },
  { external_id: '12', name: 'Kansas City Chiefs',       abbreviation: 'KC',  city: 'Kansas City',    division: 'AFC West',     league: 'AFC' },
  { external_id: '13', name: 'Las Vegas Raiders',        abbreviation: 'LV',  city: 'Las Vegas',      division: 'AFC West',     league: 'AFC' },
  { external_id: '24', name: 'Los Angeles Chargers',     abbreviation: 'LAC', city: 'Los Angeles',    division: 'AFC West',     league: 'AFC' },
  // NFC East
  { external_id: '6',  name: 'Dallas Cowboys',           abbreviation: 'DAL', city: 'Dallas',         division: 'NFC East',     league: 'NFC' },
  { external_id: '19', name: 'New York Giants',          abbreviation: 'NYG', city: 'New York',       division: 'NFC East',     league: 'NFC' },
  { external_id: '21', name: 'Philadelphia Eagles',      abbreviation: 'PHI', city: 'Philadelphia',   division: 'NFC East',     league: 'NFC' },
  { external_id: '28', name: 'Washington Commanders',    abbreviation: 'WSH', city: 'Washington',     division: 'NFC East',     league: 'NFC' },
  // NFC North
  { external_id: '3',  name: 'Chicago Bears',            abbreviation: 'CHI', city: 'Chicago',        division: 'NFC North',    league: 'NFC' },
  { external_id: '8',  name: 'Detroit Lions',            abbreviation: 'DET', city: 'Detroit',        division: 'NFC North',    league: 'NFC' },
  { external_id: '9',  name: 'Green Bay Packers',        abbreviation: 'GB',  city: 'Green Bay',      division: 'NFC North',    league: 'NFC' },
  { external_id: '16', name: 'Minnesota Vikings',        abbreviation: 'MIN', city: 'Minnesota',      division: 'NFC North',    league: 'NFC' },
  // NFC South
  { external_id: '1',  name: 'Atlanta Falcons',          abbreviation: 'ATL', city: 'Atlanta',        division: 'NFC South',    league: 'NFC' },
  { external_id: '29', name: 'Carolina Panthers',        abbreviation: 'CAR', city: 'Carolina',       division: 'NFC South',    league: 'NFC' },
  { external_id: '18', name: 'New Orleans Saints',       abbreviation: 'NO',  city: 'New Orleans',    division: 'NFC South',    league: 'NFC' },
  { external_id: '27', name: 'Tampa Bay Buccaneers',     abbreviation: 'TB',  city: 'Tampa Bay',      division: 'NFC South',    league: 'NFC' },
  // NFC West
  { external_id: '22', name: 'Arizona Cardinals',        abbreviation: 'ARI', city: 'Arizona',        division: 'NFC West',     league: 'NFC' },
  { external_id: '14', name: 'Los Angeles Rams',         abbreviation: 'LAR', city: 'Los Angeles',    division: 'NFC West',     league: 'NFC' },
  { external_id: '25', name: 'San Francisco 49ers',      abbreviation: 'SF',  city: 'San Francisco',  division: 'NFC West',     league: 'NFC' },
  { external_id: '26', name: 'Seattle Seahawks',         abbreviation: 'SEA', city: 'Seattle',        division: 'NFC West',     league: 'NFC' },
];

const NBA_TEAMS = [
  // Eastern - Atlantic
  { external_id: '2',  name: 'Boston Celtics',           abbreviation: 'BOS', city: 'Boston',         division: 'Atlantic',     league: 'East' },
  { external_id: '17', name: 'Brooklyn Nets',            abbreviation: 'BKN', city: 'Brooklyn',       division: 'Atlantic',     league: 'East' },
  { external_id: '18', name: 'New York Knicks',          abbreviation: 'NYK', city: 'New York',       division: 'Atlantic',     league: 'East' },
  { external_id: '20', name: 'Philadelphia 76ers',       abbreviation: 'PHI', city: 'Philadelphia',   division: 'Atlantic',     league: 'East' },
  { external_id: '28', name: 'Toronto Raptors',          abbreviation: 'TOR', city: 'Toronto',        division: 'Atlantic',     league: 'East' },
  // Eastern - Central
  { external_id: '4',  name: 'Chicago Bulls',            abbreviation: 'CHI', city: 'Chicago',        division: 'Central',      league: 'East' },
  { external_id: '5',  name: 'Cleveland Cavaliers',      abbreviation: 'CLE', city: 'Cleveland',      division: 'Central',      league: 'East' },
  { external_id: '8',  name: 'Detroit Pistons',          abbreviation: 'DET', city: 'Detroit',        division: 'Central',      league: 'East' },
  { external_id: '11', name: 'Indiana Pacers',           abbreviation: 'IND', city: 'Indiana',        division: 'Central',      league: 'East' },
  { external_id: '15', name: 'Milwaukee Bucks',          abbreviation: 'MIL', city: 'Milwaukee',      division: 'Central',      league: 'East' },
  // Eastern - Southeast
  { external_id: '1',  name: 'Atlanta Hawks',            abbreviation: 'ATL', city: 'Atlanta',        division: 'Southeast',    league: 'East' },
  { external_id: '30', name: 'Charlotte Hornets',        abbreviation: 'CHA', city: 'Charlotte',      division: 'Southeast',    league: 'East' },
  { external_id: '14', name: 'Miami Heat',               abbreviation: 'MIA', city: 'Miami',          division: 'Southeast',    league: 'East' },
  { external_id: '19', name: 'Orlando Magic',            abbreviation: 'ORL', city: 'Orlando',        division: 'Southeast',    league: 'East' },
  { external_id: '27', name: 'Washington Wizards',       abbreviation: 'WSH', city: 'Washington',     division: 'Southeast',    league: 'East' },
  // Western - Northwest
  { external_id: '7',  name: 'Denver Nuggets',           abbreviation: 'DEN', city: 'Denver',         division: 'Northwest',    league: 'West' },
  { external_id: '16', name: 'Minnesota Timberwolves',   abbreviation: 'MIN', city: 'Minnesota',      division: 'Northwest',    league: 'West' },
  { external_id: '25', name: 'Oklahoma City Thunder',    abbreviation: 'OKC', city: 'Oklahoma City',  division: 'Northwest',    league: 'West' },
  { external_id: '22', name: 'Portland Trail Blazers',   abbreviation: 'POR', city: 'Portland',       division: 'Northwest',    league: 'West' },
  { external_id: '26', name: 'Utah Jazz',                abbreviation: 'UTA', city: 'Utah',           division: 'Northwest',    league: 'West' },
  // Western - Pacific
  { external_id: '9',  name: 'Golden State Warriors',    abbreviation: 'GSW', city: 'Golden State',   division: 'Pacific',      league: 'West' },
  { external_id: '12', name: 'Los Angeles Clippers',     abbreviation: 'LAC', city: 'Los Angeles',    division: 'Pacific',      league: 'West' },
  { external_id: '13', name: 'Los Angeles Lakers',       abbreviation: 'LAL', city: 'Los Angeles',    division: 'Pacific',      league: 'West' },
  { external_id: '21', name: 'Phoenix Suns',             abbreviation: 'PHX', city: 'Phoenix',        division: 'Pacific',      league: 'West' },
  { external_id: '23', name: 'Sacramento Kings',         abbreviation: 'SAC', city: 'Sacramento',     division: 'Pacific',      league: 'West' },
  // Western - Southwest
  { external_id: '6',  name: 'Dallas Mavericks',         abbreviation: 'DAL', city: 'Dallas',         division: 'Southwest',    league: 'West' },
  { external_id: '10', name: 'Houston Rockets',          abbreviation: 'HOU', city: 'Houston',        division: 'Southwest',    league: 'West' },
  { external_id: '29', name: 'Memphis Grizzlies',        abbreviation: 'MEM', city: 'Memphis',        division: 'Southwest',    league: 'West' },
  { external_id: '3',  name: 'New Orleans Pelicans',     abbreviation: 'NOP', city: 'New Orleans',    division: 'Southwest',    league: 'West' },
  { external_id: '24', name: 'San Antonio Spurs',        abbreviation: 'SAS', city: 'San Antonio',    division: 'Southwest',    league: 'West' },
];

const NHL_TEAMS = [
  // Eastern - Atlantic
  { external_id: 'BOS', name: 'Boston Bruins',           abbreviation: 'BOS', city: 'Boston',         division: 'Atlantic',     league: 'Eastern' },
  { external_id: 'BUF', name: 'Buffalo Sabres',          abbreviation: 'BUF', city: 'Buffalo',        division: 'Atlantic',     league: 'Eastern' },
  { external_id: 'DET', name: 'Detroit Red Wings',       abbreviation: 'DET', city: 'Detroit',        division: 'Atlantic',     league: 'Eastern' },
  { external_id: 'FLA', name: 'Florida Panthers',        abbreviation: 'FLA', city: 'Sunrise',        division: 'Atlantic',     league: 'Eastern' },
  { external_id: 'MTL', name: 'Montreal Canadiens',      abbreviation: 'MTL', city: 'Montreal',       division: 'Atlantic',     league: 'Eastern' },
  { external_id: 'OTT', name: 'Ottawa Senators',         abbreviation: 'OTT', city: 'Ottawa',         division: 'Atlantic',     league: 'Eastern' },
  { external_id: 'TBL', name: 'Tampa Bay Lightning',     abbreviation: 'TBL', city: 'Tampa Bay',      division: 'Atlantic',     league: 'Eastern' },
  { external_id: 'TOR', name: 'Toronto Maple Leafs',     abbreviation: 'TOR', city: 'Toronto',        division: 'Atlantic',     league: 'Eastern' },
  // Eastern - Metropolitan
  { external_id: 'CAR', name: 'Carolina Hurricanes',     abbreviation: 'CAR', city: 'Raleigh',        division: 'Metropolitan', league: 'Eastern' },
  { external_id: 'CBJ', name: 'Columbus Blue Jackets',   abbreviation: 'CBJ', city: 'Columbus',       division: 'Metropolitan', league: 'Eastern' },
  { external_id: 'NJD', name: 'New Jersey Devils',       abbreviation: 'NJD', city: 'New Jersey',     division: 'Metropolitan', league: 'Eastern' },
  { external_id: 'NYI', name: 'New York Islanders',      abbreviation: 'NYI', city: 'New York',       division: 'Metropolitan', league: 'Eastern' },
  { external_id: 'NYR', name: 'New York Rangers',        abbreviation: 'NYR', city: 'New York',       division: 'Metropolitan', league: 'Eastern' },
  { external_id: 'PHI', name: 'Philadelphia Flyers',     abbreviation: 'PHI', city: 'Philadelphia',   division: 'Metropolitan', league: 'Eastern' },
  { external_id: 'PIT', name: 'Pittsburgh Penguins',     abbreviation: 'PIT', city: 'Pittsburgh',     division: 'Metropolitan', league: 'Eastern' },
  { external_id: 'WSH', name: 'Washington Capitals',     abbreviation: 'WSH', city: 'Washington',     division: 'Metropolitan', league: 'Eastern' },
  // Western - Central
  { external_id: 'CHI', name: 'Chicago Blackhawks',      abbreviation: 'CHI', city: 'Chicago',        division: 'Central',      league: 'Western' },
  { external_id: 'COL', name: 'Colorado Avalanche',      abbreviation: 'COL', city: 'Denver',         division: 'Central',      league: 'Western' },
  { external_id: 'DAL', name: 'Dallas Stars',            abbreviation: 'DAL', city: 'Dallas',         division: 'Central',      league: 'Western' },
  { external_id: 'MIN', name: 'Minnesota Wild',          abbreviation: 'MIN', city: 'Saint Paul',     division: 'Central',      league: 'Western' },
  { external_id: 'NSH', name: 'Nashville Predators',     abbreviation: 'NSH', city: 'Nashville',      division: 'Central',      league: 'Western' },
  { external_id: 'STL', name: 'St. Louis Blues',         abbreviation: 'STL', city: 'St. Louis',      division: 'Central',      league: 'Western' },
  { external_id: 'UTA', name: 'Utah Hockey Club',        abbreviation: 'UTA', city: 'Salt Lake City', division: 'Central',      league: 'Western' },
  { external_id: 'WPG', name: 'Winnipeg Jets',           abbreviation: 'WPG', city: 'Winnipeg',       division: 'Central',      league: 'Western' },
  // Western - Pacific
  { external_id: 'ANA', name: 'Anaheim Ducks',           abbreviation: 'ANA', city: 'Anaheim',        division: 'Pacific',      league: 'Western' },
  { external_id: 'CGY', name: 'Calgary Flames',          abbreviation: 'CGY', city: 'Calgary',        division: 'Pacific',      league: 'Western' },
  { external_id: 'EDM', name: 'Edmonton Oilers',         abbreviation: 'EDM', city: 'Edmonton',       division: 'Pacific',      league: 'Western' },
  { external_id: 'LAK', name: 'Los Angeles Kings',       abbreviation: 'LAK', city: 'Los Angeles',    division: 'Pacific',      league: 'Western' },
  { external_id: 'SEA', name: 'Seattle Kraken',          abbreviation: 'SEA', city: 'Seattle',        division: 'Pacific',      league: 'Western' },
  { external_id: 'SJS', name: 'San Jose Sharks',         abbreviation: 'SJS', city: 'San Jose',       division: 'Pacific',      league: 'Western' },
  { external_id: 'VAN', name: 'Vancouver Canucks',       abbreviation: 'VAN', city: 'Vancouver',      division: 'Pacific',      league: 'Western' },
  { external_id: 'VGK', name: 'Vegas Golden Knights',    abbreviation: 'VGK', city: 'Las Vegas',      division: 'Pacific',      league: 'Western' },
];

// Add new sport team arrays above and register them here
const SEEDS = {
  mlb: MLB_TEAMS,
  nfl: NFL_TEAMS,
  nba: NBA_TEAMS,
  nhl: NHL_TEAMS,
};

function seedIfEmpty(db) {
  const insert = db.prepare(`
    INSERT OR IGNORE INTO teams (sport, name, abbreviation, city, division, league, external_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const insertAll = db.transaction((sport, teams) => {
    for (const t of teams) {
      insert.run(sport, t.name, t.abbreviation, t.city, t.division, t.league, t.external_id);
    }
  });

  for (const [sport, teams] of Object.entries(SEEDS)) {
    const count = db.prepare('SELECT COUNT(*) as n FROM teams WHERE sport = ?').get(sport).n;
    if (count > 0) continue;
    insertAll(sport, teams);
    console.log(`Seeded ${teams.length} ${sport.toUpperCase()} teams.`);
  }
}

module.exports = { seedIfEmpty };
