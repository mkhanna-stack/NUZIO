import { Routes, Route, Navigate } from 'react-router-dom';
import Splash from './pages/onboarding/Splash';
import Language from './pages/onboarding/Language';
import Auth from './pages/onboarding/Auth';
import Profession from './pages/onboarding/Profession';
import Interests from './pages/onboarding/Interests';
import Voice from './pages/onboarding/Voice';
import Time from './pages/onboarding/Time';
import Notifications from './pages/onboarding/Notifications';
import Ready from './pages/onboarding/Ready';

import DashboardLayout from './pages/dashboard/DashboardLayout';
import Feed from './pages/dashboard/Feed';
import Discover from './pages/dashboard/Discover';
import Settings from './pages/dashboard/Settings';

import { RequireAuth, RequireOnboarded } from './components/Guards';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Splash />} />

      <Route path="/onboarding/language" element={<Language />} />
      <Route path="/onboarding/auth" element={<Auth />} />
      <Route
        path="/onboarding/profession"
        element={
          <RequireAuth>
            <Profession />
          </RequireAuth>
        }
      />
      <Route
        path="/onboarding/interests"
        element={
          <RequireAuth>
            <Interests />
          </RequireAuth>
        }
      />
      <Route
        path="/onboarding/voice"
        element={
          <RequireAuth>
            <Voice />
          </RequireAuth>
        }
      />
      <Route
        path="/onboarding/time"
        element={
          <RequireAuth>
            <Time />
          </RequireAuth>
        }
      />
      <Route
        path="/onboarding/notifications"
        element={
          <RequireAuth>
            <Notifications />
          </RequireAuth>
        }
      />
      <Route
        path="/onboarding/ready"
        element={
          <RequireAuth>
            <Ready />
          </RequireAuth>
        }
      />

      <Route
        path="/dashboard"
        element={
          <RequireOnboarded>
            <DashboardLayout />
          </RequireOnboarded>
        }
      >
        <Route index element={<Feed />} />
        <Route path="discover" element={<Discover />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
