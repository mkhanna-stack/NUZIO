import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import OnboardingShell from '../../components/OnboardingShell';
import PrimaryButton from '../../components/PrimaryButton';
import { canSpeak, speakStory, stopSpeaking } from '../../lib/speech';

const VOICES = [
  { name: 'Aria', tag: 'Warm, Unhurried', tag2: 'British, F', color: 'bg-violet-500' },
  { name: 'Kai', tag: 'Crisp, Focused', tag2: 'American, M', color: 'bg-indigo-500' },
  { name: 'Maara', tag: 'Bright, Curious', tag2: 'Indian, F', color: 'bg-mint-500' },
];

const LENGTHS = [5, 10, 15];

export default function Voice() {
  const navigate = useNavigate();
  const { updateProfile } = useAuth();
  const [voice, setVoice] = useState('Aria');
  const [length, setLength] = useState(5);
  const [loading, setLoading] = useState(false);
  const [previewing, setPreviewing] = useState(false);

  const previewVoice = (v) => {
    if (!canSpeak()) return window.alert('Speech playback is not supported in this browser.');
    if (previewing) stopSpeaking();
    const started = speakStory({ title: `Hello, I am ${v.name}`, summary: 'This is a preview of your Nuzio narrator voice.' }, v.name, () => setPreviewing(false));
    setPreviewing(started);
  };

  const handleContinue = async () => {
    setLoading(true);
    try {
      await updateProfile({ narrator_voice: voice, brief_length_min: length, onboarding_step: 5 });
      navigate('/onboarding/time');
    } finally {
      setLoading(false);
    }
  };

  return (
    <OnboardingShell step={3} eyebrow="STEP 3 OF 6" title="Pick a" titleAccent="narrator voice" subtitle="Tap ▶ to hear a 10 second sample.">
      <div className="space-y-2.5 mb-8">
        {VOICES.map((v) => (
          <button
            key={v.name}
            onClick={() => setVoice(v.name)}
            className={`w-full card px-4 py-3 flex items-center gap-3 text-left focus-ring transition-colors ${
              voice === v.name ? 'border-violet-500 bg-violet-500/10' : ''
            }`}
          >
            <span className={`w-9 h-9 rounded-full ${v.color} flex items-center justify-center text-xs font-semibold`}>
              {v.name[0]}
            </span>
            <span className="flex-1">
              <span className="block text-sm font-medium">{v.name}</span>
              <span className="block text-xs text-white/40">
                {v.tag} · {v.tag2}
              </span>
            </span>
            <span role="button" tabIndex={0} onClick={(e) => { e.stopPropagation(); previewVoice(v); }} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); previewVoice(v); } }} className="w-7 h-7 rounded-full border border-white/15 flex items-center justify-center text-[10px]">▶</span>
          </button>
        ))}
      </div>

      <p className="text-sm font-medium mb-1">
        How long is <span className="italic text-violet-400">your morning?</span>
      </p>
      <p className="text-xs text-white/40 mb-3">Set your ideal brief length.</p>
      <div className="flex gap-2 mb-8">
        {LENGTHS.map((l) => (
          <button
            key={l}
            onClick={() => setLength(l)}
            className={`px-4 py-2 rounded-full text-xs font-medium border focus-ring ${
              length === l ? 'bg-violet-500/15 border-violet-500 text-white' : 'border-white/12 text-white/70'
            }`}
          >
            {l} min
          </button>
        ))}
        <button
          onClick={() => setLength(20)}
          className={`px-4 py-2 rounded-full text-xs font-medium border focus-ring ${
            length === 20 ? 'bg-violet-500/15 border-violet-500 text-white' : 'border-white/12 text-white/70'
          }`}
        >
          Custom
        </button>
      </div>

      <div className="mt-auto">
        <PrimaryButton onClick={handleContinue} loading={loading}>
          Continue with {voice} · {length} min
        </PrimaryButton>
      </div>
    </OnboardingShell>
  );
}
