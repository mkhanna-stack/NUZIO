import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PrimaryButton from '../../components/PrimaryButton';

const RECEIVE = [
  { title: 'Morning brief ready', sub: 'Your daily audio briefing is live', tag: 'Daily · 7:00' },
  { title: 'Breaking story', sub: 'A major story just broke in your niches', tag: 'When it happens' },
  { title: 'Weekly digest', sub: 'The most-loved stories from the week', tag: 'Sundays · 9:00 AM' },
];

export default function Notifications() {
  const navigate = useNavigate();
  const { updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);

  const finish = async (notificationsOn) => {
    setLoading(true);
    try {
      await updateProfile({ notifications_on: notificationsOn, onboarding_step: 7 });
      navigate('/onboarding/ready');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="screen flex flex-col px-6 pt-6 pb-8 max-w-md mx-auto">
      <div className="relative z-10 flex items-center justify-between mb-8">
        <span className="text-xs text-violet-400">STEP 5 OF 6</span>
        <button onClick={() => finish(false)} className="text-xs text-white/40 hover:text-white/70 focus-ring rounded">
          Skip
        </button>
      </div>

      <div className="relative z-10 flex-1 flex flex-col">
        <h1 className="font-display text-[26px] mb-1">
          Stay in <span className="italic text-violet-400">the loop.</span>
        </h1>
        <p className="text-sm text-white/50 mb-8">Turn on notifications so you never miss your brief.</p>

        <div className="space-y-3 mb-8">
          {RECEIVE.map((r) => (
            <div key={r.title} className="card px-4 py-3.5">
              <p className="text-sm font-medium">{r.title}</p>
              <p className="text-xs text-white/40 mb-1">{r.sub}</p>
              <p className="text-[11px] text-violet-400">{r.tag}</p>
            </div>
          ))}
        </div>

        <div className="mt-auto space-y-2.5">
          <PrimaryButton onClick={() => finish(true)} loading={loading}>
            Allow notifications
          </PrimaryButton>
          <button
            onClick={() => finish(false)}
            className="w-full py-3.5 rounded-xl2 text-sm text-white/50 hover:text-white/80 focus-ring"
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}
