import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import OnboardingShell from '../../components/OnboardingShell';
import PrimaryButton from '../../components/PrimaryButton';

const PROFESSIONS = [
  'Finance & Trading', 'Legal', 'Technology', 'Healthcare', 'Consulting',
  'Marketing & Media', 'Government & Policy', 'Real Estate', 'Sports',
  'Education', 'Founder / Builder',
];

export default function Profession() {
  const navigate = useNavigate();
  const { updateProfile } = useAuth();
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    setLoading(true);
    try {
      await updateProfile({ profession: selected, onboarding_step: 3 });
      navigate('/onboarding/interests');
    } finally {
      setLoading(false);
    }
  };

  return (
    <OnboardingShell
      step={1}
      eyebrow="STEP 1 OF 6"
      title="What's your"
      titleAccent="profession?"
      subtitle="We'll tune every brief to what actually moves your day."
      onSkip={() => navigate('/onboarding/interests')}
    >
      <div className="grid grid-cols-2 gap-2.5 mb-8">
        {PROFESSIONS.map((p) => (
          <button
            key={p}
            onClick={() => setSelected(p)}
            className={`card px-3 py-3 text-xs font-medium text-left focus-ring transition-colors ${
              selected === p ? 'border-violet-500 bg-violet-500/10 text-white' : 'text-white/70'
            }`}
          >
            {p}
          </button>
        ))}
      </div>
      <div className="mt-auto">
        <PrimaryButton onClick={handleContinue} disabled={!selected} loading={loading}>
          Continue
        </PrimaryButton>
      </div>
    </OnboardingShell>
  );
}
