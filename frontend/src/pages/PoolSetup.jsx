import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { createPool, fetchPool, fetchTeams, addMember, assignTeams } from '../services/api';

const TEAM_COLORS = {
  BAL: '#DF4601', BOS: '#BD3039', NYY: '#003087', TB: '#092C5C', TOR: '#134A8E',
  CWS: '#27251F', CLE: '#00385D', DET: '#0C2340', KC: '#004687', MIN: '#002B5C',
  HOU: '#002D62', LAA: '#003263', ATH: '#003831', SEA: '#0C2C56', TEX: '#003278',
  ATL: '#CE1141', MIA: '#00A3E0', NYM: '#002D72', PHI: '#E81828', WSH: '#AB0003',
  CHC: '#0E3386', CIN: '#C6011F', MIL: '#12284B', PIT: '#FDB827', STL: '#C41E3A',
  ARI: '#A71930', COL: '#333366', LAD: '#005A9C', SD: '#2F241D', SF: '#FD5A1E',
};

// Returns team IDs currently assigned to anyone else in the pool
function usedTeamIds(leaderboard, excludeMemberId) {
  const used = new Set();
  for (const member of leaderboard) {
    if (member.id === excludeMemberId) continue;
    for (const team of member.teams) used.add(team.id);
  }
  return used;
}

export default function PoolSetup({ sport }) {
  const { poolId } = useParams();
  const navigate = useNavigate();
  const isNew = !poolId;

  // --- New pool form state ---
  const [poolName, setPoolName] = useState('');
  const [teamsPerParticipant, setTeamsPerParticipant] = useState(4);
  const [creating, setCreating] = useState(false);

  // --- Existing pool state ---
  const [pool, setPool] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [allTeams, setAllTeams] = useState([]);
  const [loadingPool, setLoadingPool] = useState(!isNew);

  // --- Add member form ---
  const [newMemberName, setNewMemberName] = useState('');
  const [addingMember, setAddingMember] = useState(false);

  // --- Assignment state: memberId → selected team IDs ---
  const [assignments, setAssignments] = useState({});
  const [savingMember, setSavingMember] = useState(null);

  const season = new Date().getFullYear();

  useEffect(() => {
    if (isNew) return;
    setLoadingPool(true);
    Promise.all([fetchPool(poolId), fetchTeams(sport)])
      .then(([poolData, teamsData]) => {
        setPool(poolData.pool);
        setLeaderboard(poolData.leaderboard);
        setAllTeams(teamsData.teams);
        // Seed assignment state from existing data
        const init = {};
        for (const member of poolData.leaderboard) {
          init[member.id] = member.teams.map((t) => t.id);
        }
        setAssignments(init);
      })
      .catch((err) => alert(err.message))
      .finally(() => setLoadingPool(false));
  }, [poolId, isNew, sport]);

  // --- Create pool ---
  async function handleCreatePool(e) {
    e.preventDefault();
    if (!poolName.trim()) return;
    setCreating(true);
    try {
      const { pool: newPool } = await createPool({
        name: poolName.trim(),
        sport,
        season_year: season,
        teams_per_participant: teamsPerParticipant,
      });
      navigate(`/${sport}/pools/${newPool.id}/setup`);
    } catch (err) {
      alert(err.message);
    } finally {
      setCreating(false);
    }
  }

  // --- Add member ---
  async function handleAddMember(e) {
    e.preventDefault();
    if (!newMemberName.trim()) return;
    setAddingMember(true);
    try {
      const { member } = await addMember(poolId, newMemberName.trim());
      setLeaderboard((prev) => [...prev, { ...member, totalWins: 0, teams: [] }]);
      setAssignments((prev) => ({ ...prev, [member.id]: [] }));
      setNewMemberName('');
    } catch (err) {
      alert(err.message);
    } finally {
      setAddingMember(false);
    }
  }

  // --- Save assignments for a member ---
  async function handleSaveAssignments(memberId) {
    setSavingMember(memberId);
    try {
      await assignTeams(poolId, memberId, assignments[memberId] ?? []);
      // Refresh pool data
      const { leaderboard: fresh } = await fetchPool(poolId);
      setLeaderboard(fresh);
      const init = {};
      for (const m of fresh) init[m.id] = m.teams.map((t) => t.id);
      setAssignments(init);
    } catch (err) {
      alert(err.message);
    } finally {
      setSavingMember(null);
    }
  }

  function toggleTeam(memberId, teamId, limit) {
    setAssignments((prev) => {
      const current = prev[memberId] ?? [];
      if (current.includes(teamId)) {
        return { ...prev, [memberId]: current.filter((id) => id !== teamId) };
      }
      if (current.length >= limit) return prev; // at limit
      return { ...prev, [memberId]: [...current, teamId] };
    });
  }

  // --- Create new pool view ---
  if (isNew) {
    return (
      <div className="max-w-md space-y-4">
        <div>
          <Link to={`/${sport}`} className="text-slate-500 hover:text-slate-300 text-sm transition-colors">
            ← Standings
          </Link>
          <h1 className="text-xl font-bold text-white mt-1">Create New Pool</h1>
          <p className="text-sm text-slate-400">{season} {sport.toUpperCase()} season</p>
        </div>
        <form onSubmit={handleCreatePool} className="rounded-xl border border-white/10 bg-surface-800 p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Pool Name</label>
            <input
              type="text"
              value={poolName}
              onChange={(e) => setPoolName(e.target.value)}
              placeholder="e.g. Office MLB Pool 2026"
              className="w-full bg-surface-700 border border-white/10 rounded-md px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Teams per Participant</label>
            <input
              type="number"
              min={1}
              max={30}
              value={teamsPerParticipant}
              onChange={(e) => setTeamsPerParticipant(Number(e.target.value))}
              className="w-32 bg-surface-700 border border-white/10 rounded-md px-3 py-2 text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={creating}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold py-2 rounded-md transition-colors text-sm"
          >
            {creating ? 'Creating…' : 'Create Pool'}
          </button>
        </form>
      </div>
    );
  }

  // --- Loading existing pool ---
  if (loadingPool) {
    return (
      <div className="flex items-center justify-center h-48 text-slate-400 text-sm">
        Loading pool setup…
      </div>
    );
  }

  // --- Edit existing pool ---
  const teamsPerP = pool?.teams_per_participant ?? 4;

  // Group by division within each league
  const alByDivision = allTeams
    .filter((t) => t.league === 'AL')
    .reduce((acc, team) => { (acc[team.division] = acc[team.division] ?? []).push(team); return acc; }, {});
  const nlByDivision = allTeams
    .filter((t) => t.league === 'NL')
    .reduce((acc, team) => { (acc[team.division] = acc[team.division] ?? []).push(team); return acc; }, {});

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link to={`/${sport}/pools/${poolId}`} className="text-slate-500 hover:text-slate-300 text-sm transition-colors">
            ← Leaderboard
          </Link>
          <h1 className="text-xl font-bold text-white mt-1">{pool?.name} — Setup</h1>
          <p className="text-xs text-slate-500">
            {pool?.season_year} {sport.toUpperCase()} · {teamsPerP} teams per participant
          </p>
        </div>
      </div>

      {/* Add member */}
      <section className="rounded-xl border border-white/10 bg-surface-800 p-5 space-y-3">
        <h2 className="text-base font-semibold text-white">Participants</h2>
        <form onSubmit={handleAddMember} className="flex gap-2">
          <input
            type="text"
            value={newMemberName}
            onChange={(e) => setNewMemberName(e.target.value)}
            placeholder="Participant name"
            className="flex-1 bg-surface-700 border border-white/10 rounded-md px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
          />
          <button
            type="submit"
            disabled={addingMember}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium px-4 py-2 rounded-md transition-colors text-sm"
          >
            {addingMember ? '…' : 'Add'}
          </button>
        </form>
        {leaderboard.length === 0 && (
          <p className="text-xs text-slate-500">No participants yet. Add one above.</p>
        )}
      </section>

      {/* Team assignment per member */}
      {leaderboard.map((member) => {
        const selectedIds = assignments[member.id] ?? [];
        const taken = usedTeamIds(leaderboard, member.id);
        const isSaving = savingMember === member.id;

        return (
          <section key={member.id} className="rounded-xl border border-white/10 bg-surface-800 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-white">
                {member.display_name}
                <span className="ml-2 text-sm font-normal text-slate-400">
                  {selectedIds.length}/{teamsPerP} teams selected
                </span>
              </h2>
              <button
                onClick={() => handleSaveAssignments(member.id)}
                disabled={isSaving}
                className="text-sm bg-green-700 hover:bg-green-600 disabled:opacity-50 text-white font-medium px-3 py-1.5 rounded-md transition-colors"
              >
                {isSaving ? 'Saving…' : 'Save'}
              </button>
            </div>

            {/* Team grid: AL and NL side by side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[{ label: 'American League', byDivision: alByDivision }, { label: 'National League', byDivision: nlByDivision }].map(({ label, byDivision }) => (
                <div key={label}>
                  <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">{label}</p>
                  <div className="space-y-3">
                    {Object.entries(byDivision).map(([division, teams]) => (
                      <div key={division}>
                        <p className="text-xs text-slate-500 uppercase tracking-wider mb-1.5">{division}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {teams.map((team) => {
                            const isSelected = selectedIds.includes(team.id);
                            const isTaken = taken.has(team.id);
                            const bg = TEAM_COLORS[team.abbreviation] ?? '#334155';
                            return (
                              <button
                                key={team.id}
                                disabled={isTaken && !isSelected}
                                onClick={() => toggleTeam(member.id, team.id, teamsPerP)}
                                title={isTaken ? 'Already assigned to another participant' : team.name}
                                className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium transition-all border
                                  ${isSelected
                                    ? 'border-blue-500 bg-blue-600/20 text-white'
                                    : isTaken
                                    ? 'border-white/5 bg-surface-700/50 text-slate-600 cursor-not-allowed'
                                    : 'border-white/10 bg-surface-700 text-slate-300 hover:border-white/30 hover:text-white'
                                  }`}
                              >
                                <span
                                  className="inline-flex items-center justify-center w-5 h-5 rounded text-white font-bold"
                                  style={{ backgroundColor: isTaken && !isSelected ? '#374151' : bg, fontSize: '9px' }}
                                >
                                  {team.abbreviation}
                                </span>
                                {team.abbreviation}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
