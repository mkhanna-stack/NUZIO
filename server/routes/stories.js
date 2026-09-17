import { Router } from 'express';
import { Stories } from '../db/db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

const RSS_URL = 'https://news.google.com/rss?hl=en-IN&gl=IN&ceid=IN:en';
const CATEGORY_QUERIES = {
  'AI & Tech': 'technology OR artificial intelligence',
  Markets: 'markets OR economy',
  Startups: 'startups OR business',
  'Global Politics': 'world politics',
};

function decodeHtml(value = '') {
  return value.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim();
}
function parseItems(xml) {
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((match) => {
    const item = match[1];
    const get = (tag) => {
      const cdata = item.match(new RegExp(`<${tag}[^>]*>\\s*<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>\\s*</${tag}>`, 'i'));
      if (cdata) return decodeHtml(cdata[1]);
      const plain = item.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'i'));
      return decodeHtml(plain?.[1] || '');
    };
    const title = get('title');
    const link = get('link');
    const pubDate = get('pubDate');
    const source = get('source');
    return title ? { title, summary: `Read the latest report from ${source || 'the news source'}.`, source: source || 'Google News', url: link, publishedAt: pubDate || new Date().toISOString() } : null;
  }).filter(Boolean);
}

async function fetchLiveStories(category) {
  const query = CATEGORY_QUERIES[category];
  const url = query ? `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-IN&gl=IN&ceid=IN:en` : RSS_URL;
  const response = await fetch(url, { headers: { 'User-Agent': 'Nuzio/1.0 news reader' } });
  if (!response.ok) throw new Error(`News source returned ${response.status}`);
  return parseItems(await response.text()).slice(0, 12).map((story) => ({ ...story, category: category || 'General' }));
}

router.get('/', (req, res) => {
  const { category } = req.query;
  res.json({ stories: Stories.listForUser(req.userId, { category }) });
});

router.get('/saved', (req, res) => res.json({ stories: Stories.saved(req.userId) }));

router.post('/refresh', async (req, res) => {
  try {
    const category = req.body?.category && req.body.category !== 'All' ? req.body.category : undefined;
    const liveStories = await fetchLiveStories(category);
    Stories.replaceForUser(req.userId, liveStories, category);
    res.json({ stories: Stories.listForUser(req.userId, { category }), live: true });
  } catch (error) {
    console.error('Live news refresh failed:', error);
    res.status(502).json({ error: error.message || 'Unable to fetch live news right now.' });
  }
});

router.post('/', (req, res) => {
  const { title, summary, category, source } = req.body || {};
  if (!title || typeof title !== 'string') return res.status(400).json({ error: 'A story title is required.' });
  const story = Stories.create(req.userId, { title, summary, category, source });
  res.status(201).json({ story });
});

router.post('/:id/toggle-save', (req, res) => {
  try { res.json({ story: Stories.toggleSave(req.userId, Number(req.params.id)) }); }
  catch (e) { res.status(404).json({ error: e.message }); }
});

export default router;
