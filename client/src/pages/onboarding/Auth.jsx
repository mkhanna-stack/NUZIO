import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PrimaryButton from '../../components/PrimaryButton';

export default function Auth() {
  const navigate = useNavigate();
  const { register, login, updateProfile } = useAuth();
  const [mode, setMode] = useState('register'); // register | login
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'register') {
        await register(email, password, name);
      } else {
        await login(email, password);
      }

      const stored = JSON.parse(sessionStorage.getItem('nuzio_onboarding') || '{}');
      if (stored.language || stored.locationOn !== undefined) {
        await updateProfile({
          language: stored.language || 'en',
          location_enabled: !!stored.locationOn,
          onboarding_step: 2,
        });
      }

      navigate('/onboarding/profession');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="screen flex flex-col px-6 pt-10 pb-8 max-w-md mx-auto">
      <div className="relative z-10 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-6 h-6 rounded-full bg-nuzio-gradient" />
          <span className="font-display text-base">Nuzio</span>
        </div>

        <h1 className="font-display text-[30px] leading-tight mb-1">Good morning.</h1>
        <p className="font-display italic text-[26px] text-violet-400 mb-2">News on go.</p>
        <p className="text-sm text-white/50 mb-10 max-w-[32ch]">
          Personalised audio news for Indian professionals — curated every morning.
        </p>

        {!showForm ? (
          <div className="space-y-3">
            <button
              onClick={() => setShowForm(true)}
              className="w-full py-3.5 rounded-xl2 text-sm font-medium bg-white text-base-950 flex items-center justify-center gap-2 focus-ring"
            >
              <span className="text-base font-semibold">G</span> Continue with Google
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="w-full py-3.5 rounded-xl2 text-sm font-medium border border-white/15 text-white/80 focus-ring"
            >
              Continue with email
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === 'register' && (
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                className="w-full card px-4 py-3 text-sm bg-transparent placeholder:text-white/30 focus-ring"
              />
            )}
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              placeholder="Email"
              className="w-full card px-4 py-3 text-sm bg-transparent placeholder:text-white/30 focus-ring"
            />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
              minLength={6}
              placeholder="Password (min. 6 characters)"
              className="w-full card px-4 py-3 text-sm bg-transparent placeholder:text-white/30 focus-ring"
            />
            {error && <p className="text-xs text-red-400">{error}</p>}
            <PrimaryButton type="submit" loading={loading}>
              {mode === 'register' ? 'Create account' : 'Sign in'}
            </PrimaryButton>
            <button
              type="button"
              onClick={() => setMode(mode === 'register' ? 'login' : 'register')}
              className="w-full text-xs text-white/40 hover:text-white/70 pt-1 focus-ring rounded"
            >
              {mode === 'register' ? 'Already have an account? Sign in' : "New here? Create an account"}
            </button>
          </form>
        )}

        <p className="text-[11px] text-white/30 mt-auto pt-10">
          By continuing you agree to our Terms &amp; Privacy Policy.
        </p>
      </div>
    </div>
  );
}
