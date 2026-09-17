import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const TABS = [
  { to: '/dashboard', label: 'Feed', end: true },
  { to: '/dashboard/discover', label: 'Discover' },
  { to: '/dashboard/settings', label: 'Settings' },
  { to: '/dashboard/billing', label: 'Plan & billing' },
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-base-950">
      <header className="border-b border-line sticky top-0 bg-base-950/90 backdrop-blur z-20">
        <div className="max-w-5xl mx-auto px-6 py-3.5 flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-nuzio-gradient" />
            <span className="font-display text-base">Nuzio</span>
          </div>

          <nav className="flex items-center gap-1 flex-1">
            {TABS.map((t) => (
              <NavLink
                key={t.to}
                to={t.to}
                end={t.end}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-full text-xs font-medium transition-colors focus-ring ${
                    isActive ? 'bg-violet-500/15 text-white' : 'text-white/50 hover:text-white/80'
                  }`
                }
              >
                {t.label}
              </NavLink>
            ))}
          </nav>

          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="w-8 h-8 rounded-full bg-base-700 flex items-center justify-center text-xs font-semibold focus-ring"
            title={user?.email}
          >
            {(user?.name || user?.email || '?')[0].toUpperCase()}
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
