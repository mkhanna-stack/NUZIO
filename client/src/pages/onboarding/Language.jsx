import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PrimaryButton from '../../components/PrimaryButton';

const LANGUAGES = [
  { code: 'en', label: 'English', sub: 'Briefings delivered in English' },
  { code: 'hi', label: 'हिन्दी', sub: 'हिंदी में ब्रीफिंग सुनें' },
];

export default function Language() {
  const navigate = useNavigate();
  const [language, setLanguage] = useState('en');
  const [locationOn, setLocationOn] = useState(false);

  const handleContinue = () => {
    sessionStorage.setItem('nuzio_onboarding', JSON.stringify({ language, locationOn }));
    navigate('/onboarding/auth');
  };

  return (
    <div className="screen flex flex-col px-6 pt-10 pb-8 max-w-md mx-auto">
      <div className="relative z-10">
        <h1 className="font-display text-[26px] mb-1">
          Choose your <span className="italic text-violet-400">language</span>
        </h1>
        <p className="text-sm text-white/50 mb-8">Select the language for your daily brief.</p>

        <div className="space-y-3 mb-6">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              onClick={() => setLanguage(l.code)}
              className={`w-full text-left card px-4 py-3.5 flex items-center justify-between focus-ring transition-colors ${
                language === l.code ? 'border-violet-500 bg-violet-500/10' : ''
              }`}
            >
              <div>
                <p className="text-sm font-medium">{l.label}</p>
                <p className="text-xs text-white/40">{l.sub}</p>
              </div>
              <span
                className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  language === l.code ? 'border-violet-400' : 'border-white/20'
                }`}
              >
                {language === l.code && <span className="w-2 h-2 rounded-full bg-violet-400" />}
              </span>
            </button>
          ))}
        </div>

        <div className="card px-4 py-3.5 flex items-center justify-between mb-8">
          <div>
            <p className="text-sm font-medium">Enable location</p>
            <p className="text-xs text-white/40">Get hyperlocal news tailored to your city.</p>
          </div>
          <button
            onClick={() => setLocationOn((v) => !v)}
            className={`w-10 h-6 rounded-full transition-colors relative focus-ring ${
              locationOn ? 'bg-violet-500' : 'bg-base-700'
            }`}
            aria-pressed={locationOn}
            aria-label="Toggle location access"
          >
            <span
              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${
                locationOn ? 'left-4' : 'left-0.5'
              }`}
            />
          </button>
        </div>

        <PrimaryButton onClick={handleContinue}>Continue</PrimaryButton>
      </div>
    </div>
  );
}
