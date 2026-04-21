const BASE_URL = 'https://site.api.espn.com/apis/v2/sports/football/nfl';

/**
 * Fetches win/loss records for all 32 NFL teams from the ESPN public API.
 * Returns an array of { externalId, wins, losses } objects.
 */
async function fetchStandings(seasonYear) {
  const url = `${BASE_URL}/standings?season=${seasonYear}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`ESPN NFL API responded with ${response.status} for season ${seasonYear}`);
  }

  const data = await response.json();
  const records = [];

  // Structure: data.children (conferences) → children (divisions) → standings.entries (teams)
  for (const conference of data.children ?? []) {
    for (const division of conference.children ?? []) {
      for (const entry of division.standings?.entries ?? []) {
        const stat = (name) => entry.stats?.find((s) => s.name === name)?.value ?? 0;
        records.push({
          externalId: String(entry.team.id),
          wins: stat('wins'),
          losses: stat('losses'),
        });
      }
    }
  }

  return records;
}

module.exports = { fetchStandings };
