import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

function Toggle({ on, onChange }) {
  return (
    <button
      onClick={() => onChange(!on)}
      className={`w-10 h-6 rounded-full relative transition-colors focus-ring ${on ? 'bg-violet-500' : 'bg-base-700'}`}
      aria-pressed={on}
    >
      <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${on ? 'left-4' : 'left-0.5'}`} />
    </button>
  );
}

export default function Settings() {
  const { user, profile, updateProfile } = useAuth();
  const [offline, setOffline] = useState(false);
  const [autoAdvance, setAutoAdvance] = useState(true);
  const [appearance, setAppearance] = useState('dark');

  return (
    <div className="max-w-lg">
      <h1 className="font-display text-2xl mb-6">Settings</h1>

      <section className="card p-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-nuzio-gradient flex items-center justify-center font-semibold">
            {(user?.name || user?.email || '?')[0].toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-medium">{user?.name || 'Your profile'}</p>
            <p className="text-xs text-white/40">
              {profile?.profession || 'Profession not set'} · {profile?.city || 'Location off'}
            </p>
          </div>
        </div>
      </section>

      <p className="text-[11px] text-white/30 tracking-wide mb-2 mt-6">APPEARANCE</p>
      <section className="card p-4 mb-4">
        <div className="flex gap-2">
          <button
            onClick={() => setAppearance('dark')}
            className={`flex-1 py-2 rounded-lg text-xs font-medium border focus-ring ${
              appearance === 'dark' ? 'bg-violet-500/15 border-violet-500' : 'border-white/12 text-white/60'
            }`}
          >
            ● Dark
          </button>
          <button
            onClick={() => setAppearance('light')}
            className={`flex-1 py-2 rounded-lg text-xs font-medium border focus-ring ${
              appearance === 'light' ? 'bg-violet-500/15 border-violet-500' : 'border-white/12 text-white/60'
            }`}
          >
            ○ Light
          </button>
        </div>
        {appearance === 'light' && (
          <p className="text-[11px] text-white/30 mt-2">Light mode preview only — Nuzio ships dark-first for this build.</p>
        )}
      </section>

      <p className="text-[11px] text-white/30 tracking-wide mb-2 mt-6">PREFERENCES</p>
      <section className="card divide-y divide-white/5">
        <Row title="Offline mode" sub="Download briefs for the commute" control={<Toggle on={offline} onChange={setOffline} />} />
        <Row title="Auto-advance" sub="Play the next story automatically" control={<Toggle on={autoAdvance} onChange={setAutoAdvance} />} />
        <Row
          title="Push notifications"
          sub="Brief drops & breaking stories"
          control={<Toggle on={!!profile?.notifications_on} onChange={(v) => updateProfile({ notifications_on: v })} />}
        />
      </section>
    </div>
  );
}

function Row({ title, sub, control }) {
  return (
    <div className="flex items-center justify-between px-4 py-3.5">
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-white/40">{sub}</p>
      </div>
      {control}
    </div>
  );
}
