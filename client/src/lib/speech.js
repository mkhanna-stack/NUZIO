export const VOICE_HINTS = {
  Aria: { lang: 'en-GB', rate: 0.94, pitch: 1.12, keywords: ['female', 'samantha', 'serena', 'kate'] },
  Kai: { lang: 'en-US', rate: 1.04, pitch: 0.82, keywords: ['male', 'alex', 'daniel', 'fred'] },
  Maara: { lang: 'en-IN', rate: 0.98, pitch: 1.02, keywords: ['india', 'rishi', 'heera', 'veena'] },
};

export function canSpeak() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
}

export function getAvailableVoices() {
  return canSpeak() ? window.speechSynthesis.getVoices() : [];
}

export function getPreferredVoice(name = 'Aria') {
  if (!canSpeak()) return null;
  const hint = VOICE_HINTS[name] || VOICE_HINTS.Aria;
  const voices = getAvailableVoices();
  return voices.find((v) => v.lang.toLowerCase() === hint.lang.toLowerCase())
    || voices.find((v) => v.lang.toLowerCase().startsWith(hint.lang.slice(0, 2)))
    || voices.find((v) => hint.keywords.some((k) => v.name.toLowerCase().includes(k)))
    || voices[0]
    || null;
}

export function getVoiceLabel(name = 'Aria') {
  const voice = getPreferredVoice(name);
  return voice ? `${voice.name} (${voice.lang})` : 'Browser default voice';
}

export function speakStory(story, voiceName = 'Aria', onEnd) {
  if (!canSpeak()) return false;
  window.speechSynthesis.cancel();
  const hint = VOICE_HINTS[voiceName] || VOICE_HINTS.Aria;
  const utterance = new SpeechSynthesisUtterance(`${story.title}. ${story.summary || ''}`);
  utterance.lang = hint.lang;
  utterance.rate = hint.rate;
  utterance.pitch = hint.pitch;
  const voice = getPreferredVoice(voiceName);
  if (voice) utterance.voice = voice;
  utterance.onend = onEnd;
  utterance.onerror = onEnd;
  window.speechSynthesis.speak(utterance);
  return true;
}

export function stopSpeaking() {
  if (canSpeak()) window.speechSynthesis.cancel();
}
