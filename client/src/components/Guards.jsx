import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function RequireAuth({ children }) {
  const { token, loading } = useAuth();
  if (loading) return <FullScreenLoader />;
  if (!token) return <Navigate to="/onboarding/language" replace />;
  return children;
}

export function RequireOnboarded({ children }) {
  const { token, profile, loading } = useAuth();
  if (loading) return <FullScreenLoader />;
  if (!token) return <Navigate to="/onboarding/language" replace />;
  if (profile && !profile.onboarding_done) return <Navigate to="/onboarding/profession" replace />;
  return children;
}

function FullScreenLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-950">
      <div className="w-8 h-8 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
    </div>
  );
}
