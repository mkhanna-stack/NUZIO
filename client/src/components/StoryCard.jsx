import { useEffect, useState } from 'react';
import { canSpeak, getVoiceLabel, speakStory, stopSpeaking } from '../lib/speech';

export default function StoryCard({ story, onToggleSave, narratorVoice = 'Aria' }) {
  const [playing, setPlaying] = useState(false);
  const minutes = Math.max(1, Math.round((story.audio_seconds || 0) / 60));

  useEffect(() => () => stopSpeaking(), []);

  const togglePlayback = () => {
    if (!canSpeak()) {
      window.alert('Speech playback is not supported in this browser. Try Chrome, Edge, or Safari.');
      return;
    }
    if (playing) {
      stopSpeaking();
      setPlaying(false);
      return;
    }
    const started = speakStory(story, narratorVoice, () => setPlaying(false));
    setPlaying(started);
  };

  return (
    <div className="card p-4">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-300 mb-2">
            {story.category || 'General'}
          </span>
          <h3 className="text-sm font-medium leading-snug">{story.title}</h3>
          {story.summary && <p className="text-xs text-white/40 mt-1">{story.summary}</p>}
        </div>
        <button onClick={() => onToggleSave?.(story.id)} className={`shrink-0 w-8 h-8 rounded-full border flex items-center justify-center focus-ring transition-colors ${story.is_saved ? 'border-mint-500 text-mint-400' : 'border-white/15 text-white/40'}`} aria-label={story.is_saved ? 'Unsave story' : 'Save story'}>
          {story.is_saved ? '✓' : '+'}
        </button>
      </div>
      <div className="flex items-center gap-3">
        <button onClick={togglePlayback} className="w-8 h-8 rounded-full bg-nuzio-gradient flex items-center justify-center focus-ring shrink-0" aria-label={playing ? 'Pause narration' : 'Play narration'}>
          {playing ? '❚❚' : '▶'}
        </button>
        <div className="flex-1 h-1 rounded-full bg-base-700 overflow-hidden"><div className={`h-full bg-violet-400 ${playing ? 'w-1/2 animate-pulse' : 'w-0'} transition-all duration-500`} /></div>
        <span className="text-[11px] text-white/30 shrink-0">{minutes} min</span>
      </div>
      <p className="text-[11px] text-white/25 mt-2">{story.source && `${story.source} · `}Browser voice: {getVoiceLabel(narratorVoice)}</p>
    </div>
  );
}
