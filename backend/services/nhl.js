const BASE_URL = 'https://api-web.nhle.com/v1';

/**
 * Fetches win/loss records for all 32 NHL teams from the NHL Stats API.
 * Returns an array of { externalId, wins, losses } objects.
 * OTL (overtime losses) are counted as losses — update if scoring rules change.
 */
async function fetchStandings(seasonYear) {
  // Use April 15 of the season year to capture end-of-regular-season standings.
  // For the current year, use today if it's before April 15.
  const today = new Date();
  const cutoff = new Date(`${seasonYear}-04-15`);
  const date = today < cutoff ? today.toISOString().split('T')[0] : `${seasonYear}-04-15`;

  const url = `${BASE_URL}/standings/${date}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`NHL Stats API responded with ${response.status} for date ${date}`);
  }

  const data = await response.json();
  const records = [];

  for (const team of data.standings ?? []) {
    records.push({
      externalId: team.teamAbbrev?.default ?? '',
      wins: team.wins ?? 0,
      losses: (team.losses ?? 0) + (team.otLosses ?? 0),
    });
  }

  return records;
}

module.exports = { fetchStandings };
