// Browser-local game rules. The vault is a puzzle, not an authentication system.
export const STORAGE_KEY = 'harsim-live-lab-v1';
export const ROOMS = [
  {
    id: 'trace', title: 'Keep the trail', project: 'SwiftIOC', digit: '4',
    url: 'https://github.com/PKHarsimran/SwiftIOC-Automated-Threat-Intelligence-Collector',
    evidence: 'indicator  signal.example\nsource     community-feed.csv\ncollected  2026-10-18T09:00:00Z',
    question: 'You normalize this record. What should travel with the indicator?',
    options: ['Only its severity label', 'Its source and collection time', 'A dramatic filename'], answer: 1,
    hint: 'A future analyst needs to retrace your steps.',
    solved: 'Exactly. Keep the evidence attached. TRACE fragment: 4.',
  },
  {
    id: 'inspect', title: 'Read, don’t run', project: 'IOC Inspector', digit: '2',
    url: 'https://github.com/PKHarsimran/IOC-Inspector',
    evidence: 'file       training-note.pdf\nurl        https://signal.example/note\naddress    192.0.2.42',
    question: 'What is a sensible first move with this unfamiliar document?',
    options: ['Run anything embedded inside', 'Call every extracted address malicious', 'Inspect it without executing it'], answer: 2,
    hint: 'Extract the clues before deciding what they mean.',
    solved: 'Clues first. A URL alone is not a verdict. INSPECT fragment: 2.',
  },
  {
    id: 'capture', title: 'Take it offline', project: 'Website Downloader', digit: '7',
    url: 'https://github.com/PKHarsimran/website-downloader',
    evidence: 'saved      index.html + guide.html\nsource     server is now stopped\nnext       open the saved guide',
    question: 'Which link keeps working inside the saved copy?',
    options: ['./guide.html', 'https://signal.example/guide', 'https://signal.example/live'], answer: 0,
    hint: 'An offline copy needs a path to a local file.',
    solved: 'Local links keep the journey going. CAPTURE fragment: 7.',
  },
];
export const VAULT_ROUTE = ['inspect', 'capture', 'trace'];
const ADJECTIVES = ['Curious', 'Neon', 'Orbit', 'Quiet', 'Cosmic', 'Mint', 'Velvet', 'Bright'];
const CALLSIGNS = ['Packet', 'Moth', 'Nomad', 'Sprite', 'Comet', 'Fox', 'Signal', 'Scout'];
const CREATURES = ['Cache Goblin', 'Packet Pixie', 'Log Sprite', 'Port Nomad', 'Byte Moth', 'Signal Sprout'];

export function hashText(text) {
  let value = 2166136261;
  for (const char of text) value = Math.imul(value ^ char.charCodeAt(0), 16777619) >>> 0;
  return value;
}

export function createVisit(seed, now = new Date()) {
  if (!/^[a-f0-9]{24}$/.test(seed)) throw new Error('Invalid visit seed');
  const n = hashText(seed);
  return { version: 1, seed,
    callsign: `${ADJECTIVES[n % 8]}-${CALLSIGNS[(n >>> 4) % 8]}-${seed.slice(-3).toUpperCase()}`,
    createdAt: now.toISOString(), completed: [], routeStep: 0, vaultUnlocked: false };
}

export function restoreVisit(raw) {
  try {
    const data = JSON.parse(raw);
    if (!data || data.version !== 1 || !/^[a-f0-9]{24}$/.test(data.seed) ||
        typeof data.createdAt !== 'string' || !Number.isFinite(Date.parse(data.createdAt))) return null;
    const visit = createVisit(data.seed, new Date(data.createdAt));
    visit.completed = ROOMS.map(r => r.id).filter(id => Array.isArray(data.completed) && data.completed.includes(id));
    visit.routeStep = Number.isInteger(data.routeStep) ? Math.max(0, Math.min(4, data.routeStep)) : 0;
    visit.vaultUnlocked = data.vaultUnlocked === true && visit.completed.length === ROOMS.length;
    return visit;
  } catch { return null; }
}

export function answerRoom(visit, id, answer) {
  const room = ROOMS.find(r => r.id === id);
  if (!room || !Number.isInteger(answer) || answer !== room.answer) return { correct: false, visit };
  return { correct: true, visit: { ...visit, completed: [...new Set([...visit.completed, id])] } };
}

export function openVault(visit, code) {
  const ready = ROOMS.every(r => visit.completed.includes(r.id));
  const solution = VAULT_ROUTE.map(id => ROOMS.find(r => r.id === id).digit).join('');
  if (!ready) return { status: 'missing', visit };
  if (String(code).trim() !== solution) return { status: 'decoy', visit };
  return { status: 'open', visit: { ...visit, vaultUnlocked: true } };
}

export function creatureFor(visit) {
  return CREATURES[hashText(visit.seed + ':creature') % CREATURES.length];
}

export function creaturePixels(seed) {
  const pixels = [];
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 5; col++) {
      const value = hashText(`${seed}:${row}:${col}`);
      if (value % 3 !== 0 || (row >= 2 && row <= 6 && col >= 2)) {
        for (const x of new Set([col, 8 - col])) pixels.push({ x, y: row, color: ['#63E6C4', '#B7A1FF', '#F685BF'][value % 3] });
      }
    }
  }
  return pixels;
}

export function xml(value) {
  return String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[c]);
}

export function badgeFilename(visit) {
  return `harsim-lab-${visit.callsign.toLowerCase()}-${visit.vaultUnlocked ? 'relic' : 'visitor'}.png`;
}

export function renderBadgeSVG(visit) {
  const unlocked = visit.vaultUnlocked;
  const name = unlocked ? creatureFor(visit) : 'Pixel, your lab guide';
  const art = unlocked
    ? creaturePixels(visit.seed).map(p => `<rect x="${p.x}" y="${p.y}" width="1" height="1" fill="${p.color}"/>`).join('')
    : '<path fill="#B7A1FF" d="M4 0H5V2H8V3H9V7H8V9H6V7H3V9H1V7H0V3H1V2H4Z"/><path fill="#0B1220" d="M2 3H7V6H2Z"/>';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="520" viewBox="0 0 900 520" role="img" aria-labelledby="badge-title">
  <title id="badge-title">${xml(visit.callsign)} — ${unlocked ? 'vault explorer' : 'lab visitor'} badge</title>
  <defs><pattern id="grid" width="28" height="28" patternUnits="userSpaceOnUse"><path d="M28 0H0V28" fill="none" stroke="#233044" stroke-opacity=".38"/></pattern></defs>
  <rect x="1" y="1" width="898" height="518" rx="30" fill="#0F1725" stroke="#3B4862" stroke-width="2"/><rect x="2" y="2" width="896" height="516" rx="29" fill="url(#grid)"/>
  <g font-family="monospace"><text x="36" y="49" fill="#63E6C4" font-size="17">HARSIM'S LIVE LAB / ${unlocked ? 'VAULT EXPLORER' : 'VISITOR PASS'}</text>
  <path d="M36 72H864" stroke="#34425A"/><circle cx="178" cy="253" r="118" fill="#B7A1FF" fill-opacity=".04" stroke="#B7A1FF" stroke-opacity=".25"/>
  <g transform="translate(97 172) scale(18)" shape-rendering="crispEdges">${art}<path fill="#0B1220" d="M2 3H4V5H2ZM5 3H7V5H5Z"/><path fill="#63E6C4" d="M2.5 3.5H3.5V4.5H2.5ZM5.5 3.5H6.5V4.5H5.5Z"/></g>
  <text x="340" y="157" fill="#9FACBF" font-size="15">CALLSIGN</text><text x="340" y="202" fill="#F1F5FC" font-weight="700" font-size="27">${xml(visit.callsign)}</text>
  <text x="340" y="265" fill="#B7A1FF" font-size="28">${xml(name)}</text><text x="340" y="301" fill="#B9C6D9" font-size="17">${unlocked ? 'Three clues found. One vault opened.' : 'Curiosity cleared for entry.'}</text>
  <text x="340" y="359" fill="#63E6C4" font-size="15">PASS / ${visit.seed.slice(0, 8).toUpperCase()} · ${xml(visit.createdAt.slice(0, 10))}</text>
  <path d="M36 420H864" stroke="#34425A"/><text x="36" y="461" fill="#B9C6D9" font-size="16">harsim.ca/lab/</text><text x="864" y="461" text-anchor="end" fill="#B7A1FF" font-size="16">KEEP TINKERING ↗</text></g></svg>`;
}

export function validIP(value) {
  if (typeof value !== 'string' || value.length > 45) return false;
  const v4 = s => /^\d{1,3}(\.\d{1,3}){3}$/.test(s) && s.split('.').every(n => Number(n) <= 255);
  if (!value.includes(':')) return v4(value);
  let address = value;
  if (address.includes('.')) {
    const tail = address.slice(address.lastIndexOf(':') + 1);
    if (!v4(tail)) return false;
    address = address.slice(0, address.lastIndexOf(':') + 1) + '0:0';
  }
  if (!/^[0-9a-f:]+$/i.test(address) || address.includes(':::') || address.split('::').length > 2) return false;
  const groups = address.split(':').filter(Boolean);
  if (groups.some(g => g.length > 4)) return false;
  return address.includes('::') ? groups.length < 8 : groups.length === 8 && !address.startsWith(':') && !address.endsWith(':');
}
