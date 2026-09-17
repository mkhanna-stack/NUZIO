const BASE = import.meta.env.VITE_API_URL || '/api';

async function request(path, { method = 'GET', body, token } = {}) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data;
}

export const api = {
  register: (email, password, name) => request('/auth/register', { method: 'POST', body: { email, password, name } }),
  login: (email, password) => request('/auth/login', { method: 'POST', body: { email, password } }),
  me: (token) => request('/auth/me', { token }),

  getProfile: (token) => request('/profile', { token }),
  patchProfile: (token, patch) => request('/profile', { method: 'PATCH', token, body: patch }),
  completeOnboarding: (token) => request('/profile/complete', { method: 'POST', token }),

  getStories: (token, category) => request(`/stories${category && category !== 'All' ? `?category=${encodeURIComponent(category)}` : ''}`, { token }),
  refreshStories: (token, category) => request('/stories/refresh', { method: 'POST', token, body: { category } }),
  getSavedStories: (token) => request('/stories/saved', { token }),
  toggleSave: (token, id) => request(`/stories/${id}/toggle-save`, { method: 'POST', token }),
};
