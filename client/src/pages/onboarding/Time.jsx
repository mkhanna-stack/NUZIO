import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import OnboardingShell from '../../components/OnboardingShell';
import PrimaryButton from '../../components/PrimaryButton';

const TIMES = ['6:00', '6:30', '7:00', '7:30', '8:00'];

export default function Time() {
  const navigate = useNavigate();
  const { updateProfile } = useAuth();
  const [time, setTime] = useState('7:00');
  const [ampm, setAmpm] = useState('AM');
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    setLoading(true);
    try {
      await updateProfile({ brief_time: `${time} ${ampm}`, onboarding_step: 6 });
      navigate('/onboarding/notifications');
    } finally {
      setLoading(false);
    }
  };

  return (
    <OnboardingShell step={4} eyebrow="STEP 4 OF 6" title="When do you" titleAccent="want your brief?" subtitle="Nuzio will have your brief ready and waiting each morning.">
      <div className="flex gap-2 mb-8 justify-center">
        <button
          onClick={() => setAmpm('AM')}
          className={`px-6 py-2 rounded-full text-sm font-medium border focus-ring ${
            ampm === 'AM' ? 'bg-violet-500/15 border-violet-500' : 'border-white/12 text-white/60'
          }`}
        >
          AM
        </button>
        <button
          onClick={() => setAmpm('PM')}
          className={`px-6 py-2 rounded-full text-sm font-medium border focus-ring ${
            ampm === 'PM' ? 'bg-violet-500/15 border-violet-500' : 'border-white/12 text-white/60'
          }`}
        >
          PM
        </button>
      </div>

      <div className="flex flex-col items-center gap-3 mb-10">
        {TIMES.map((t) => (
          <button
            key={t}
            onClick={() => setTime(t)}
            className={`focus-ring rounded transition-all ${
              t === time ? 'text-3xl font-display text-white' : 'text-lg text-white/25'
            }`}
          >
            {t} <span className="text-xs align-top">{ampm}</span>
          </button>
        ))}
      </div>

      <div className="mt-auto">
        <PrimaryButton onClick={handleContinue} loading={loading}>
          Continue
        </PrimaryButton>
      </div>
    </OnboardingShell>
  );
}
