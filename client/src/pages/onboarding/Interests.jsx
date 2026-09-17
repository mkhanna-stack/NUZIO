import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import OnboardingShell from '../../components/OnboardingShell';
import PrimaryButton from '../../components/PrimaryButton';

const MAX_PICKS = 7;
const INTERESTS = [
  'AI & Technology', 'Financial Markets', 'Indian Business', 'Global Politics',
  'Startups', 'Science', 'Geopolitics', 'Health & Medicine', 'Climate & Energy',
  'Sports', 'Culture & Arts', 'Legal & Policy',
];

export default function Interests() {
  const navigate = useNavigate();
  const { updateProfile } = useAuth();
  const [picked, setPicked] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggle = (item) => {
    setPicked((prev) => {
      if (prev.includes(item)) return prev.filter((i) => i !== item);
      if (prev.length >= MAX_PICKS) return prev;
      return [...prev, item];
    });
  };

  const handleContinue = async () => {
    setLoading(true);
    try {
      await updateProfile({ interests: picked, onboarding_step: 4 });
      navigate('/onboarding/voice');
    } finally {
      setLoading(false);
    }
  };

  return (
    <OnboardingShell
      step={2}
      eyebrow="STEP 2 OF 6"
      title="What moves"
      titleAccent="your world?"
      subtitle="Pick up to 7 niches."
      onSkip={() => navigate('/onboarding/voice')}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-white/40">{picked.length}/{MAX_PICKS}</span>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {INTERESTS.map((item) => {
          const active = picked.includes(item);
          return (
            <button
              key={item}
              onClick={() => toggle(item)}
              className={`px-3.5 py-2 rounded-full text-xs font-medium border focus-ring transition-colors ${
                active ? 'bg-violet-500/15 border-violet-500 text-white' : 'border-white/12 text-white/70'
              }`}
            >
              {item}
            </button>
          );
        })}
      </div>

      <div className="mt-auto">
        <PrimaryButton onClick={handleContinue} disabled={picked.length === 0} loading={loading}>
          Continue
        </PrimaryButton>
      </div>
    </OnboardingShell>
  );
}
