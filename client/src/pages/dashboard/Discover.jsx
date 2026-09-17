import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import StoryCard from '../../components/StoryCard';

export default function Discover() {
  const { token } = useAuth();
  const [stories, setStories] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getStories(token)
      .then((data) => setStories(data.stories))
      .finally(() => setLoading(false));
  }, [token]);

  const toggleSave = async (id) => {
    const updated = await api.toggleSave(token, id);
    setStories((prev) => prev.map((s) => (s.id === id ? updated.story : s)));
  };

  const filtered = stories.filter(
    (s) =>
      s.title.toLowerCase().includes(query.toLowerCase()) ||
      (s.category || '').toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <h1 className="font-display text-2xl mb-1">Discover</h1>
      <p className="text-xs text-white/40 mb-6">In-shorts style — swipe your world.</p>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search stories, sources, topics…"
        className="w-full card px-4 py-3 text-sm bg-transparent placeholder:text-white/30 focus-ring mb-6"
      />

      {loading ? (
        <p className="text-sm text-white/40">Loading…</p>
      ) : filtered.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-sm text-white/50">Nothing matches “{query}”.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {filtered.map((s) => (
            <StoryCard key={s.id} story={s} onToggleSave={toggleSave} />
          ))}
        </div>
      )}
    </div>
  );
}
