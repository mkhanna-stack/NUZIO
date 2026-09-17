import { useNavigate } from 'react-router-dom';
import PrimaryButton from '../../components/PrimaryButton';

export default function Splash() {
  const navigate = useNavigate();

  return (
    <div className="screen flex flex-col items-center justify-center px-6 text-center max-w-md mx-auto">
      <div className="relative z-10 flex flex-col items-center">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-full bg-nuzio-gradient flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-white" />
          </div>
          <span className="font-display text-lg">Nuzio</span>
        </div>
        <p className="italic text-white/60 mb-1">News on go</p>
        <p className="text-xs text-white/30 mb-12">Your audio brief, every morning</p>

        <div className="w-full">
          <PrimaryButton onClick={() => navigate('/onboarding/language')}>Get started</PrimaryButton>
        </div>
      </div>
    </div>
  );
}
