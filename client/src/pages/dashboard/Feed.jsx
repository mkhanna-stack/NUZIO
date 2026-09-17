import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import StoryCard from '../../components/StoryCard';

export default function Feed() {
  const { token, user, profile } = useAuth();
  const [stories, setStories] = useState([]);
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const categories = ['All', ...(profile?.interests || [])];

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    api.getStories(token, category).then(async (data) => {
      if (!active) return;
      setStories(data.stories);
      if (!data.live && data.stories.length === 0) {
        setRefreshing(true);
        try { const live = await api.refreshStories(token, category); if (active) setStories(live.stories); }
        catch (error) { if (active) setError(error?.message || 'Live news is temporarily unavailable.'); }
        finally { if (active) setRefreshing(false); }
      }
    }).catch(() => active && setError('Unable to load stories.')).finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [token, category]);

  const toggleSave = async (id) => {
    const updated = await api.toggleSave(token, id);
    setStories((prev) => prev.map((s) => (s.id === id ? updated.story : s)));
  };

  const firstName = (user?.name || user?.email || '').split(' ')[0].split('@')[0];

  return (
    <div>
      <p className="text-xs text-violet-400 mb-1">
        {new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'short' })} · Morning brief
      </p>
      <h1 className="font-display text-2xl mb-1">
        Good morning, <span className="italic text-violet-400 capitalize">{firstName}</span> — {stories.length} things
      </h1>
      <div className="flex items-center justify-between gap-3 mb-6"><p className="text-xs text-white/40">
        Live news · Audio live · Voice {profile?.narrator_voice || 'Aria'} · {stories.length} stories
      </p><button onClick={async () => { setRefreshing(true); setError(''); try { const live = await api.refreshStories(token, category); setStories(live.stories); } catch (error) { setError(error?.message || 'Live news is temporarily unavailable.'); } finally { setRefreshing(false); } }} className="text-xs border border-white/15 rounded-full px-3 py-1.5" disabled={refreshing}>{refreshing ? 'Refreshing…' : 'Refresh news'}</button></div>
      {error && <p className="text-xs text-amber-300 mb-4">{error}</p>}

      <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium border focus-ring transition-colors ${
              category === c ? 'bg-violet-500/15 border-violet-500 text-white' : 'border-white/12 text-white/60'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-white/40">Loading your brief…</p>
      ) : stories.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-sm text-white/50">No stories in this category yet. Try another filter.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {stories.map((s) => (
            <StoryCard key={s.id} story={s} narratorVoice={profile?.narrator_voice || 'Aria'} onToggleSave={toggleSave} />
          ))}
        </div>
      )}
    </div>
  );
}
