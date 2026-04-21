import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchStandings, fetchPools, fetchPool } from '../services/api';
import { getTeamColor, getLogoUrl } from '../utils/teams';

function TeamBadge({ abbreviation, externalId, sport }) {
  const [imgError, setImgError] = useState(false);
  const bg = getTeamColor(sport, abbreviation);
  const logoUrl = getLogoUrl(sport, externalId);

  return (
    <span
      className="inline-flex items-center justify-center w-10 h-10 rounded-lg shrink-0 bg-white border-2"
      style={{ borderColor: bg }}
    >
      {logoUrl && !imgError ? (
        <img
          src={logoUrl}
          alt={abbreviation}
          className="w-7 h-7 object-contain"
          onError={() => setImgError(true)}
        />
      ) : (
        <span className="text-xs font-bold" style={{ color: bg }}>{abbreviation}</span>
      )}
    </span>
  );
}

function pct(wins, losses) {
  const total = wins + losses;
  if (total === 0) return '.000';
  return (wins / total).toFixed(3).replace(/^0/, '');
}

const usesPoints = (sport) => sport === 'nhl';

export default function LeagueStandings({ sport }) {
  const [standings, setStandings] = useState([]);
  const [pools, setPools] = useState([]);
  const [selectedPool, setSelectedPool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const navigate = useNavigate();

  const season = new Date().getFullYear();

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([fetchStandings(sport, season), fetchPools()])
      .then(([sData, pData]) => {
        setStandings(sData.standings);
        const sportPools = pData.pools.filter((p) => p.sport === sport);
        setPools(sportPools);
        if (sportPools.length > 0 && !selectedPool) setSelectedPool(sportPools[0].id);
        if (sData.standings.length > 0) setLastUpdated(sData.standings[0].last_updated);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [sport, season]);

  // Build a lookup of team_id → owner display_name for the selected pool
  const [ownerMap, setOwnerMap] = useState({});
  useEffect(() => {
    if (!selectedPool) { setOwnerMap({}); return; }
    fetchPool(selectedPool).then(({ leaderboard }) => {
      const map = {};
      for (const member of leaderboard) {
        for (const team of member.teams) map[team.id] = member.display_name;
      }
      setOwnerMap(map);
    }).catch(() => setOwnerMap({}));
  }, [selectedPool]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48 text-slate-400 text-sm">
        Loading standings…
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-900/30 border border-red-700/50 text-red-300 px-4 py-3 text-sm">
        {error}
      </div>
    );
  }

  const hasOwners = Object.keys(ownerMap).length > 0;

  return (
    <div className="space-y-4">
      {/* Header row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-white">
            {season} {sport.toUpperCase()} Standings
          </h1>
          {lastUpdated && (
            <p className="text-xs text-slate-500 mt-0.5">
              Updated {new Date(lastUpdated).toLocaleString()}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {pools.length > 0 && (
            <select
              value={selectedPool ?? ''}
              onChange={(e) => setSelectedPool(e.target.value ? Number(e.target.value) : null)}
              className="text-sm bg-surface-700 border border-white/10 rounded-md px-3 py-1.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">No pool selected</option>
              {pools.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          )}
          <Link
            to={`/${sport}/pools/new`}
            className="text-sm bg-blue-600 hover:bg-blue-500 text-white font-medium px-3 py-1.5 rounded-md transition-colors"
          >
            + New Pool
          </Link>
          {selectedPool && (
            <button
              onClick={() => navigate(`/${sport}/pools/${selectedPool}`)}
              className="text-sm bg-surface-700 hover:bg-surface-600 border border-white/10 text-slate-200 font-medium px-3 py-1.5 rounded-md transition-colors"
            >
              View Leaderboard
            </button>
          )}
        </div>
      </div>

      {/* Standings table */}
      <div className="rounded-xl overflow-hidden border border-white/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface-700 text-slate-400 text-xs uppercase tracking-wider">
              <th className="text-left px-4 py-3 w-10">#</th>
              <th className="text-left px-4 py-3">Team</th>
              <th className="text-right px-4 py-3 w-14">{usesPoints(sport) ? 'PTS' : 'W'}</th>
              <th className="text-right px-4 py-3 w-14">L</th>
              {!usesPoints(sport) && <th className="text-right px-4 py-3 w-16">PCT</th>}
              {hasOwners && <th className="text-left px-4 py-3 w-32">Owner</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {standings.map((team, idx) => {
              const owner = ownerMap[team.id];
              return (
                <tr key={team.id} className="table-row-hover bg-surface-800">
                  <td className="px-4 py-3 text-slate-500 font-mono text-xs">{idx + 1}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <TeamBadge abbreviation={team.abbreviation} externalId={team.external_id} sport={sport} />
                      <div>
                        <div className="font-medium text-slate-100">{team.name}</div>
                        <div className="text-xs text-slate-500">{team.division}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-green-400">
                    {usesPoints(sport) ? (team.points ?? 0) : team.wins}
                  </td>
                  <td className="px-4 py-3 text-right text-slate-400">{team.losses}</td>
                  {!usesPoints(sport) && (
                    <td className="px-4 py-3 text-right text-slate-300 font-mono text-xs">
                      {pct(team.wins, team.losses)}
                    </td>
                  )}
                  {hasOwners && (
                    <td className="px-4 py-3">
                      {owner ? (
                        <span className="text-blue-400 font-medium text-xs">{owner}</span>
                      ) : (
                        <span className="text-slate-600 text-xs">—</span>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
