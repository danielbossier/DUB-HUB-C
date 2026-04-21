import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import SportTabs from './components/SportTabs';
import LeagueStandings from './pages/LeagueStandings';
import PoolLeaderboard from './pages/PoolLeaderboard';
import PoolSetup from './pages/PoolSetup';

function Header() {
  return (
    <header className="bg-surface-800 border-b border-white/10 sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <Link to="/mlb" className="flex items-center gap-2 group">
            <span className="text-xl font-extrabold tracking-tight text-white group-hover:text-blue-400 transition-colors">
              DUB<span className="text-blue-500"> HUB</span>
            </span>
          </Link>
          <span className="text-xs text-slate-500 hidden sm:block">Wins Pool Tracker</span>
        </div>
        <SportTabs />
      </div>
    </header>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-surface-900 text-slate-100">
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Navigate to="/mlb" replace />} />
          <Route path="/mlb" element={<LeagueStandings sport="mlb" />} />
          <Route path="/mlb/pools/new" element={<PoolSetup sport="mlb" />} />
          <Route path="/mlb/pools/:poolId/setup" element={<PoolSetup sport="mlb" />} />
          <Route path="/mlb/pools/:poolId" element={<PoolLeaderboard sport="mlb" />} />
          <Route path="/nfl" element={<LeagueStandings sport="nfl" />} />
          <Route path="/nfl/pools/new" element={<PoolSetup sport="nfl" />} />
          <Route path="/nfl/pools/:poolId/setup" element={<PoolSetup sport="nfl" />} />
          <Route path="/nfl/pools/:poolId" element={<PoolLeaderboard sport="nfl" />} />
          <Route path="/nba" element={<LeagueStandings sport="nba" />} />
          <Route path="/nba/pools/new" element={<PoolSetup sport="nba" />} />
          <Route path="/nba/pools/:poolId/setup" element={<PoolSetup sport="nba" />} />
          <Route path="/nba/pools/:poolId" element={<PoolLeaderboard sport="nba" />} />
          <Route path="/nhl" element={<LeagueStandings sport="nhl" />} />
          <Route path="/nhl/pools/new" element={<PoolSetup sport="nhl" />} />
          <Route path="/nhl/pools/:poolId/setup" element={<PoolSetup sport="nhl" />} />
          <Route path="/nhl/pools/:poolId" element={<PoolLeaderboard sport="nhl" />} />
          <Route path="*" element={<Navigate to="/mlb" replace />} />
        </Routes>
      </main>
    </div>
  );
}
