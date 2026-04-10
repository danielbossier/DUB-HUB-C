import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchPool, deletePool } from '../services/api';

const TEAM_COLORS = {
  BAL: '#DF4601', BOS: '#BD3039', NYY: '#003087', TB: '#092C5C', TOR: '#134A8E',
  CWS: '#27251F', CLE: '#00385D', DET: '#0C2340', KC: '#004687', MIN: '#002B5C',
  HOU: '#002D62', LAA: '#003263', ATH: '#003831', SEA: '#0C2C56', TEX: '#003278',
  ATL: '#CE1141', MIA: '#00A3E0', NYM: '#002D72', PHI: '#E81828', WSH: '#AB0003',
  CHC: '#0E3386', CIN: '#C6011F', MIL: '#12284B', PIT: '#FDB827', STL: '#C41E3A',
  ARI: '#A71930', COL: '#333366', LAD: '#005A9C', SD: '#2F241D', SF: '#FD5A1E',
};

const RANK_STYLES = [
  'text-yellow-400',  // 1st
  'text-slate-300',   // 2nd
  'text-amber-600',   // 3rd
];

function TeamChip({ team }) {
  const bg = TEAM_COLORS[team.abbreviation] ?? '#334155';
  return (
    <div className="flex items-center gap-1.5 bg-surface-700 rounded-md px-2 py-1 border border-white/5">
      <span
        className="inline-flex items-center justify-center w-6 h-6 rounded text-xs font-bold text-white shrink-0"
        style={{ backgroundColor: bg }}
      >
        {team.abbreviation}
      </span>
      <span className="text-xs text-slate-300 font-medium">{team.wins}W</span>
    </div>
  );
}

export default function PoolLeaderboard({ sport }) {
  const { poolId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchPool(poolId)
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [poolId]);

  function handleDelete() {
    if (!confirm(`Delete pool "${data.pool.name}"? This cannot be undone.`)) return;
    deletePool(poolId)
      .then(() => navigate(`/${sport}`))
      .catch((err) => alert(err.message));
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48 text-slate-400 text-sm">
        Loading pool…
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

  const { pool, leaderboard } = data;
  const leader = leaderboard[0];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Link to={`/${sport}`} className="text-slate-500 hover:text-slate-300 text-sm transition-colors">
              ← Standings
            </Link>
          </div>
          <h1 className="text-xl font-bold text-white mt-1">{pool.name}</h1>
          <p className="text-xs text-slate-500">
            {pool.season_year} {pool.sport.toUpperCase()} · {pool.teams_per_participant} teams per participant
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            to={`/${sport}/pools/${poolId}/setup`}
            className="text-sm bg-surface-700 hover:bg-surface-600 border border-white/10 text-slate-200 font-medium px-3 py-1.5 rounded-md transition-colors"
          >
            Edit Pool
          </Link>
          <button
            onClick={handleDelete}
            className="text-sm bg-red-900/40 hover:bg-red-800/60 border border-red-700/40 text-red-300 font-medium px-3 py-1.5 rounded-md transition-colors"
          >
            Delete
          </button>
        </div>
      </div>

      {leaderboard.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-surface-800 px-6 py-10 text-center text-slate-400 text-sm">
          No participants yet.{' '}
          <Link to={`/${sport}/pools/${poolId}/setup`} className="text-blue-400 hover:underline">
            Set up the pool
          </Link>{' '}
          to add members and assign teams.
        </div>
      ) : (
        <div className="space-y-2">
          {leaderboard.map((member, idx) => {
            const rank = idx + 1;
            const isExpanded = expanded === member.id;
            const rankColor = RANK_STYLES[idx] ?? 'text-slate-500';
            const isLeader = idx === 0;

            return (
              <div
                key={member.id}
                className={`rounded-xl border transition-colors ${
                  isLeader
                    ? 'border-yellow-500/30 bg-yellow-500/5'
                    : 'border-white/10 bg-surface-800'
                }`}
              >
                <button
                  onClick={() => setExpanded(isExpanded ? null : member.id)}
                  className="w-full text-left px-4 py-3 flex items-center gap-4"
                >
                  {/* Rank */}
                  <span className={`w-8 text-lg font-extrabold ${rankColor} shrink-0`}>
                    {rank}
                  </span>

                  {/* Name */}
                  <span className="flex-1 font-semibold text-white text-base truncate">
                    {member.display_name}
                  </span>

                  {/* Team chips (collapsed preview) */}
                  {!isExpanded && (
                    <div className="hidden sm:flex items-center gap-1.5 flex-wrap">
                      {member.teams.map((t) => (
                        <TeamChip key={t.id} team={t} />
                      ))}
                    </div>
                  )}

                  {/* Total wins */}
                  <div className="text-right shrink-0 ml-2">
                    <div className="text-2xl font-extrabold text-green-400 leading-none">
                      {member.totalWins}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">wins</div>
                  </div>

                  {/* Expand indicator */}
                  <span className="text-slate-500 ml-1 shrink-0">
                    {isExpanded ? '▲' : '▼'}
                  </span>
                </button>

                {/* Expanded team breakdown */}
                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-white/5 pt-3">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-xs text-slate-500 uppercase tracking-wider">
                          <th className="text-left pb-2">Team</th>
                          <th className="text-right pb-2 w-16">W</th>
                          <th className="text-right pb-2 w-16">L</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {member.teams.map((team) => {
                          const bg = TEAM_COLORS[team.abbreviation] ?? '#334155';
                          return (
                            <tr key={team.id}>
                              <td className="py-2">
                                <div className="flex items-center gap-2">
                                  <span
                                    className="inline-flex items-center justify-center w-8 h-8 rounded text-xs font-bold text-white shrink-0"
                                    style={{ backgroundColor: bg }}
                                  >
                                    {team.abbreviation}
                                  </span>
                                  <span className="text-slate-200">{team.name}</span>
                                </div>
                              </td>
                              <td className="py-2 text-right font-semibold text-green-400">{team.wins}</td>
                              <td className="py-2 text-right text-slate-400">{team.losses}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                      <tfoot>
                        <tr className="border-t border-white/10">
                          <td className="pt-2 text-xs text-slate-500 font-semibold uppercase tracking-wider">Total</td>
                          <td className="pt-2 text-right font-extrabold text-green-400">{member.totalWins}</td>
                          <td className="pt-2 text-right text-slate-400">
                            {member.teams.reduce((s, t) => s + t.losses, 0)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
