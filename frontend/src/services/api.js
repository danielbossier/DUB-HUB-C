const DEFAULT_SEASON = new Date().getFullYear();

async function apiFetch(path, options = {}) {
  const res = await fetch(path, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

// --- Standings ---
export function fetchStandings(sport, season = DEFAULT_SEASON) {
  return apiFetch(`/api/sports/${sport}/standings?season=${season}`);
}

export function fetchTeams(sport) {
  return apiFetch(`/api/sports/${sport}/teams`);
}

// --- Pools ---
export function fetchPools() {
  return apiFetch('/api/pools');
}

export function fetchPool(poolId) {
  return apiFetch(`/api/pools/${poolId}`);
}

export function createPool(payload) {
  return apiFetch('/api/pools', { method: 'POST', body: payload });
}

export function deletePool(poolId) {
  return apiFetch(`/api/pools/${poolId}`, { method: 'DELETE' });
}

// --- Members ---
export function addMember(poolId, displayName) {
  return apiFetch(`/api/pools/${poolId}/members`, {
    method: 'POST',
    body: { display_name: displayName },
  });
}

// --- Assignments ---
export function assignTeams(poolId, memberId, teamIds) {
  return apiFetch(`/api/pools/${poolId}/members/${memberId}/assignments`, {
    method: 'POST',
    body: { team_ids: teamIds },
  });
}
