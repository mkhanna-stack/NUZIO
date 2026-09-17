import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api } from '../lib/api';

const AuthContext = createContext(null);
const STORAGE_KEY = 'nuzio_token';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_KEY));
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadMe = useCallback(async (t) => {
    if (!t) {
      setUser(null);
      setProfile(null);
      setLoading(false);
      return;
    }
    try {
      const data = await api.me(t);
      setUser(data.user);
      setProfile(data.profile);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      setToken(null);
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMe(token);
  }, [token, loadMe]);

  const persistToken = (t) => {
    localStorage.setItem(STORAGE_KEY, t);
    setToken(t);
  };

  const register = async (email, password, name) => {
    const data = await api.register(email, password, name);
    persistToken(data.token);
    setUser(data.user);
    setProfile(data.profile);
    return data;
  };

  const login = async (email, password) => {
    const data = await api.login(email, password);
    persistToken(data.token);
    setUser(data.user);
    setProfile(data.profile);
    return data;
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setToken(null);
    setUser(null);
    setProfile(null);
  };

  const updateProfile = async (patch) => {
    const data = await api.patchProfile(token, patch);
    setProfile(data.profile);
    return data.profile;
  };

  const completeOnboarding = async () => {
    const data = await api.completeOnboarding(token);
    setProfile(data.profile);
    return data.profile;
  };

  return (
    <AuthContext.Provider
      value={{ token, user, profile, loading, register, login, logout, updateProfile, completeOnboarding, setProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
