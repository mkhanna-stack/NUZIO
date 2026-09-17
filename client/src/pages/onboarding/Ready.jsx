import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PrimaryButton from '../../components/PrimaryButton';

export default function Ready() {
  const navigate = useNavigate();
  const { user, profile, completeOnboarding } = useAuth();

  const handleStart = async () => {
    await completeOnboarding();
    navigate('/dashboard');
  };

  const firstName = (user?.name || user?.email || 'there').split(' ')[0].split('@')[0];

  return (
    <div className="screen flex flex-col px-6 pt-10 pb-8 max-w-md mx-auto text-center">
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center">
        <div className="w-20 h-20 rounded-full border-2 border-mint-500 flex items-center justify-center mb-6 shadow-glow">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22d896" strokeWidth="2.5">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>

        <h1 className="font-display text-[26px] mb-1">You're ready,</h1>
        <p className="font-display italic text-[28px] text-mint-400 mb-6">{firstName}.</p>

        <p className="text-sm text-white/50 mb-8 max-w-[30ch]">
          Your first brief will be ready tomorrow at {profile?.brief_time || '7:00 AM'}. We're already curating.
        </p>

        <div className="w-full card p-4 mb-3 text-left">
          <p className="text-[11px] text-white/30 mb-2 tracking-wide">YOUR BRIEF PROFILE</p>
          <ProfileRow label="Profession" value={profile?.profession || '—'} />
          <ProfileRow label="Niches" value={profile?.interests?.slice(0, 2).join(', ') + (profile?.interests?.length > 2 ? ` +${profile.interests.length - 2}` : '') || '—'} />
          <ProfileRow label="Narrator" value={`${profile?.narrator_voice || 'Aria'} · ${profile?.brief_length_min || 5} min`} />
          <ProfileRow label="Delivery" value={`Daily at ${profile?.brief_time || '7:00 AM'}`} last />
        </div>
      </div>

      <div className="relative z-10">
        <PrimaryButton onClick={handleStart}>Start listening</PrimaryButton>
      </div>
    </div>
  );
}

function ProfileRow({ label, value, last }) {
  return (
    <div className={`flex items-center justify-between py-2 ${!last ? 'border-b border-white/5' : ''}`}>
      <span className="text-xs text-white/40">{label}</span>
      <span className="text-xs font-medium">{value}</span>
    </div>
  );
}
