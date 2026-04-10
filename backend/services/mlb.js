const BASE_URL = 'https://statsapi.mlb.com/api/v1';

/**
 * Fetches win/loss records for all 30 MLB teams from the official MLB Stats API.
 * Returns an array of { externalId, wins, losses } objects.
 */
async function fetchStandings(seasonYear) {
  const url = `${BASE_URL}/standings?leagueId=103,104&season=${seasonYear}&standingsTypes=regularSeason`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`MLB Stats API responded with ${response.status} for season ${seasonYear}`);
  }

  const data = await response.json();

  const records = [];
  for (const divisionRecord of data.records ?? []) {
    for (const teamRecord of divisionRecord.teamRecords ?? []) {
      records.push({
        externalId: String(teamRecord.team.id),
        wins: teamRecord.wins ?? 0,
        losses: teamRecord.losses ?? 0,
      });
    }
  }

  return records;
}

module.exports = { fetchStandings };
