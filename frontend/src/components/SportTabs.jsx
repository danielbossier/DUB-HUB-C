import { NavLink } from 'react-router-dom';

const SPORTS = [
  { key: 'mlb', label: 'MLB', available: true },
  { key: 'nfl', label: 'NFL', available: false },
  { key: 'nba', label: 'NBA', available: false },
  { key: 'nhl', label: 'NHL', available: false },
];

export default function SportTabs() {
  return (
    <div className="flex gap-1 border-b border-white/10">
      {SPORTS.map(({ key, label, available }) =>
        available ? (
          <NavLink
            key={key}
            to={`/${key}`}
            className={({ isActive }) =>
              `px-5 py-3 text-sm font-semibold tracking-wide transition-colors duration-150 border-b-2 -mb-px ` +
              (isActive
                ? 'text-white border-blue-500'
                : 'text-slate-400 border-transparent hover:text-white hover:border-white/30')
            }
          >
            {label}
          </NavLink>
        ) : (
          <span
            key={key}
            title="Coming soon"
            className="px-5 py-3 text-sm font-semibold tracking-wide text-slate-600 border-b-2 border-transparent cursor-not-allowed select-none"
          >
            {label}
          </span>
        )
      )}
    </div>
  );
}
