import { STORAGE_KEY, ROOMS, VAULT_ROUTE, createVisit, restoreVisit, answerRoom, openVault, creatureFor, renderBadgeSVG, badgeFilename } from './core.mjs';
import { lookupPublicIP } from './network.mjs';

const $ = id => document.getElementById(id);
const motionMedia = matchMedia('(prefers-reduced-motion: reduce)');
const safeRead = key => { try { return localStorage.getItem(key); } catch { return null; } };
const safeWrite = (key, value) => { try { localStorage.setItem(key, value); return true; } catch { return false; } };
function freshVisit() {
  const bytes = crypto.getRandomValues(new Uint8Array(12));
  return createVisit([...bytes].map(b => b.toString(16).padStart(2, '0')).join(''));
}
let visit = restoreVisit(safeRead(STORAGE_KEY)) || freshVisit();
let manualPause = safeRead(STORAGE_KEY + '-motion') === 'paused';
let networkIP = null;
let ipRequest = 0;
let badgeSignature = '';
let storageAvailable = true;
let napTimer, celebrationTimer, pointerFrame;
let lastWake = 0;
const STATES = [
  { title: 'Hello from your browser.', text: 'Your callsign was made here. It is a random pass, not a fingerprint of your device. Next stop: a public doorway into the projects.', link: 'Meet the public projects ↗', url: 'https://github.com/PKHarsimran' },
  { title: 'Public-facing. Curiosity-friendly.', text: 'This site is a doorway to field notes, open-source tools, and a few experiments. The route is an illustration; no tracing or scanning is taking place.', link: 'Explore the field notes ↗', url: '/' },
  { title: 'Zima, and a crew of connected services.', text: 'Docker Compose connects requests, library automation, Jellyfin, photos, books, dashboards, and monitoring. The useful part is how the services work together.', link: 'Meet the service crew ↓', url: '#service-crew' },
  { title: 'Delivery complete. Three loose ends await.', text: 'SwiftIOC, IOC Inspector, and Website Downloader each have a small case for you. Solve the questions, keep the fragments, and follow the printed vault route.', link: 'Open the three case files ↓', url: '#cases' },
];
$('journey').querySelector('.service-drawer').id = 'service-crew';

function say(message) { $('mascot-speech').textContent = message; }
function celebrate(message) {
  say(message);
  $('mascot').classList.remove('sleeping');
  $('mascot').classList.add('celebrate');
  $('mascot-state').textContent = 'Very pleased with you';
  clearTimeout(celebrationTimer);
  celebrationTimer = setTimeout(() => { $('mascot').classList.remove('celebrate'); $('mascot-state').textContent = 'Curious & awake'; }, 1700);
}
function persist() {
  storageAvailable = safeWrite(STORAGE_KEY, JSON.stringify(visit));
  if (!storageAvailable) $('visit-greeting').textContent = 'Storage is unavailable; this pass lasts while the page is open.';
}

function mountCases() {
  const colors = ['#63e6c4', '#b7a1ff', '#f685bf'];
  for (const [index, room] of ROOMS.entries()) {
    const card = document.createElement('article');
    card.className = 'case-card'; card.id = `case-${room.id}`;
    card.style.setProperty('--case-color', colors[index]);
    const tag = document.createElement('p'); tag.className = 'room-tag'; tag.textContent = `${room.id.toUpperCase()} / ${room.project}`;
    const heading = document.createElement('h3'); heading.textContent = room.title;
    const evidence = document.createElement('pre'); evidence.textContent = room.evidence;
    const question = document.createElement('p'); question.className = 'case-question'; question.id = `question-${room.id}`; question.textContent = room.question;
    const options = document.createElement('fieldset'); options.className = 'answer-options';
    const legend = document.createElement('legend'); legend.className = 'sr-only'; legend.textContent = room.question; options.append(legend);
    room.options.forEach((label, option) => {
      const button = document.createElement('button'); button.type = 'button'; button.textContent = label;
      button.dataset.answer = String(option);
      button.addEventListener('click', () => {
        const result = answerRoom(visit, room.id, option);
        if (result.correct) {
          visit = result.visit; renderState(); persist();
          celebrate(visit.completed.length === 3 ? 'Three fragments! You know where to take those.' : 'Nice catch. One more piece of the trail.');
        } else {
          $(`feedback-${room.id}`).textContent = 'A little detour. Check the clue and try another answer.';
          say('A good investigator gets to change their mind.');
        }
      });
      options.append(button);
    });
    const feedback = document.createElement('p'); feedback.id = `feedback-${room.id}`; feedback.className = 'case-feedback'; feedback.setAttribute('role', 'status'); feedback.textContent = 'Solve the case to collect its fragment.';
    const hint = document.createElement('details'); const summary = document.createElement('summary'); summary.textContent = 'A small nudge?';
    const hintText = document.createElement('p'); hintText.textContent = room.hint; hint.append(summary, hintText);
    const link = document.createElement('a'); link.href = room.url; link.target = '_blank'; link.rel = 'noopener noreferrer'; link.textContent = `Meet ${room.project} ↗`;
    card.append(tag, heading, evidence, question, options, feedback, hint, link); $('case-grid').append(card);
  }
  for (const id of VAULT_ROUTE) {
    const item = document.createElement('li'); item.id = `fragment-${id}`;
    const digit = document.createElement('strong'); digit.textContent = '?';
    const label = document.createElement('span'); label.textContent = id.toUpperCase();
    item.append(digit, label); $('code-route').append(item);
  }
}

function renderRoute() {
  const step = visit.routeStep;
  $('route-map').style.setProperty('--packet-position', `${Math.max(0, step - 1) / 3 * 100}%`);
  [...document.querySelectorAll('.route-stops li')].forEach((node, i) => {
    node.classList.toggle('active', i === Math.max(0, step - 1));
    node.classList.toggle('visited', i < step - 1);
  });
  if (step > 0) {
    const story = STATES[step - 1];
    $('route-stage').textContent = `STOP ${String(step).padStart(2, '0')} / 04`;
    $('route-title').textContent = story.title; $('route-description').textContent = story.text;
    $('route-link').textContent = story.link; $('route-link').href = story.url;
    if (!story.url.startsWith('#')) { $('route-link').target = '_blank'; $('route-link').rel = 'noopener noreferrer'; }
    else { $('route-link').removeAttribute('target'); $('route-link').removeAttribute('rel'); }
  } else {
    $('route-stage').textContent = 'READY AT THE DEPARTURE GATE'; $('route-title').textContent = 'One packet. A few interesting stops.';
    $('route-description').textContent = 'Your visitor pass is ready. Send a packet to begin the tour, or head straight to the clues below.';
    $('route-link').textContent = 'Skip to the case files →'; $('route-link').href = '#cases'; $('route-link').removeAttribute('target');
  }
  $('route-next').textContent = step === 0 ? 'Send the packet →' : step === 4 ? 'Explore the case files ↓' : 'Next stop →';
  $('start-visit').textContent = step > 0 ? 'Continue my route →' : 'Check in & send my packet →';
}

function renderState() {
  $('callsign').textContent = visit.callsign; $('pass-serial').textContent = visit.seed.slice(0, 8).toUpperCase();
  for (const room of ROOMS) {
    const solved = visit.completed.includes(room.id); const card = $(`case-${room.id}`);
    card.classList.toggle('solved', solved);
    card.querySelectorAll('[data-answer]').forEach(button => {
      button.disabled = solved; button.classList.toggle('correct', solved && Number(button.dataset.answer) === room.answer);
    });
    if (solved) $(`feedback-${room.id}`).textContent = room.solved;
    else if (card.dataset.wasSolved === 'true') $(`feedback-${room.id}`).textContent = 'Solve the case to collect its fragment.';
    card.dataset.wasSolved = String(solved);
    const fragment = $(`fragment-${room.id}`); fragment.classList.toggle('found', solved); fragment.querySelector('strong').textContent = solved ? room.digit : '?';
  }
  $('fragment-progress').textContent = `${visit.completed.length} of 3 fragments collected${visit.completed.length === 3 ? ' · follow the route' : ''}`;
  $('unlock-vault').disabled = visit.completed.length < 3 || visit.vaultUnlocked;
  $('unlock-vault').textContent = visit.vaultUnlocked ? 'Vault open ✓' : visit.completed.length === 3 ? 'Open the vault →' : 'Collect the three fragments first';
  document.body.dataset.vault = visit.vaultUnlocked ? 'open' : 'closed';
  $('lock-mark').textContent = visit.vaultUnlocked ? '✦' : '◇';
  $('vault-code').disabled = visit.vaultUnlocked;
  if (visit.vaultUnlocked) $('vault-feedback').textContent = `${creatureFor(visit)} is waiting on your explorer badge below.`;
  $('badge-description').textContent = visit.vaultUnlocked ? `Meet ${creatureFor(visit)}, your tiny souvenir from the signal. Your explorer badge is ready to keep.` : 'Your visitor pass is ready to keep. Open the vault to meet your own pixel creature and upgrade it to an explorer badge.';
  $('download-badge').textContent = visit.vaultUnlocked ? 'Download explorer badge ↓' : 'Download visitor badge ↓';
  $('badge-caption').textContent = visit.vaultUnlocked ? 'EXPLORER EDITION / VAULT RECOVERED' : 'VISITOR EDITION / CURIOSITY CLEARED';
  const signature = visit.seed + visit.vaultUnlocked;
  if (signature !== badgeSignature) {
    $('badge-preview').src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(renderBadgeSVG(visit));
    $('badge-preview').alt = `${visit.callsign}: ${visit.vaultUnlocked ? creatureFor(visit) + ' explorer badge' : 'lab visitor badge'}`;
    badgeSignature = signature;
  }
  renderRoute();
}

function goTo(id) { $(id).scrollIntoView({ behavior: document.body.dataset.motion === 'off' ? 'instant' : 'smooth', block: 'start' }); }
function advanceRoute() {
  if (visit.routeStep === 4) { goTo('cases'); return; }
  visit = { ...visit, routeStep: visit.routeStep + 1 }; renderState(); persist();
  if (visit.routeStep === 4) say('Packet delivered. Your curiosity is in the right place.');
}
$('start-visit').addEventListener('click', () => { if (!visit.routeStep) advanceRoute(); goTo('journey'); say('Visitor checked in. Let’s see where this signal goes.'); });
$('route-next').addEventListener('click', advanceRoute);
$('route-link').addEventListener('click', () => { if ($('route-link').getAttribute('href') === '#service-crew') $('service-crew').open = true; });

$('vault-form').addEventListener('submit', event => {
  event.preventDefault(); const result = openVault(visit, $('vault-code').value);
  if (result.status === 'open') {
    visit = result.visit; renderState(); persist(); celebrate('You opened it! That creature is yours to keep.');
    $('badge-status').textContent = 'Explorer badge unlocked. Your creature is ready.';
    if (document.body.dataset.motion !== 'off') {
      $('celebration').replaceChildren();
      for (let i = 0; i < 22; i++) {
        const piece = document.createElement('i'); piece.className = 'confetti';
        piece.style.setProperty('--x', `${(i * 47) % 100}%`); piece.style.setProperty('--delay', `${i % 5 * .07}s`);
        piece.style.setProperty('--color', ['#63e6c4', '#b7a1ff', '#f685bf'][i % 3]); $('celebration').append(piece);
      }
      setTimeout(() => $('celebration').replaceChildren(), 2400);
    }
  } else {
    $('vault-feedback').textContent = result.status === 'missing' ? 'The three case files each hold a fragment. Collect them first.' : 'A decoy code. Read the fragments in INSPECT → CAPTURE → TRACE order.';
    say('Check the route. Order makes all the difference.');
  }
});

$('ip-reveal').addEventListener('click', async () => {
  if (networkIP !== null) {
    networkIP = null; $('public-ip').textContent = 'Hidden until you ask'; $('ip-reveal').textContent = 'Reveal my public IP ↗'; $('ip-status').textContent = ''; return;
  }
  const request = ++ipRequest; $('ip-reveal').disabled = true; $('ip-status').textContent = 'Asking ipify…';
  try {
    const ip = await lookupPublicIP();
    if (request !== ipRequest) return;
    networkIP = ip; $('public-ip').textContent = ip; $('ip-reveal').textContent = 'Hide my public IP';
    $('ip-status').textContent = 'Internet-facing address. A VPN or proxy can change what appears.';
    say('That’s your public doorway, not your identity.');
  } catch {
    if (request === ipRequest) { $('ip-status').textContent = 'Lookup unavailable. The rest of your adventure still works.'; $('ip-reveal').textContent = 'Try the IP lookup again ↗'; }
  } finally { if (request === ipRequest) $('ip-reveal').disabled = false; }
});

$('download-badge').addEventListener('click', async () => {
  const badgeVisit = visit;
  const button = $('download-badge'); button.disabled = true; $('badge-status').textContent = 'Preparing your PNG…';
  let sourceURL, downloadURL;
  try {
    sourceURL = URL.createObjectURL(new Blob([renderBadgeSVG(badgeVisit)], { type: 'image/svg+xml;charset=utf-8' }));
    const image = new Image(); image.src = sourceURL; await image.decode();
    const canvas = document.createElement('canvas'); canvas.width = 900; canvas.height = 520;
    const context = canvas.getContext('2d'); if (!context) throw new Error('Canvas unavailable'); context.drawImage(image, 0, 0);
    const png = await new Promise(resolve => canvas.toBlob(resolve, 'image/png')); if (!png) throw new Error('PNG unavailable');
    downloadURL = URL.createObjectURL(png); const link = document.createElement('a'); link.href = downloadURL; link.download = badgeFilename(badgeVisit);
    document.body.append(link); link.click(); link.remove(); $('badge-status').textContent = 'PNG ready. Your browser handles the download.';
  } catch { $('badge-status').textContent = 'The PNG could not be prepared. Try again in a browser with canvas support.'; }
  finally { button.disabled = false; if (sourceURL) URL.revokeObjectURL(sourceURL); if (downloadURL) setTimeout(() => URL.revokeObjectURL(downloadURL), 2000); }
});

function updateClock() {
  const now = new Date();
  $('local-time').textContent = new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit' }).format(now);
  $('local-zone').textContent = Intl.DateTimeFormat().resolvedOptions().timeZone.replaceAll('_', ' ');
  if (storageAvailable) {
    const hour = now.getHours(); $('visit-greeting').textContent = `Good ${hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening'}, fellow tinkerer.`;
  }
}
function applyMotion() {
  const paused = motionMedia.matches || manualPause;
  document.body.dataset.motion = paused ? 'off' : 'on';
  $('motion-toggle').setAttribute('aria-pressed', String(paused)); $('motion-toggle').textContent = motionMedia.matches ? 'Reduced motion on' : paused ? 'Resume motion' : 'Pause motion';
  $('motion-toggle').disabled = motionMedia.matches;
}
$('motion-toggle').addEventListener('click', () => { manualPause = !manualPause; safeWrite(STORAGE_KEY + '-motion', manualPause ? 'paused' : 'playing'); applyMotion(); });
motionMedia.addEventListener('change', applyMotion);
function wake() {
  $('mascot').classList.remove('sleeping');
  if (!$('mascot').classList.contains('celebrate')) $('mascot-state').textContent = 'Curious & awake';
  if (Date.now() - lastWake < 1000) return;
  lastWake = Date.now(); clearTimeout(napTimer);
  napTimer = setTimeout(() => { $('mascot').classList.add('sleeping'); $('mascot-state').textContent = 'Recharging curiosity'; say('Zzz… wake me when there’s a new clue.'); }, 45000);
}
document.addEventListener('pointermove', event => {
  wake(); if (pointerFrame || document.body.dataset.motion === 'off') return;
  pointerFrame = requestAnimationFrame(() => {
    const rect = $('mascot').getBoundingClientRect();
    const x = Math.max(-3, Math.min(3, (event.clientX - rect.x - rect.width / 2) / 70));
    const y = Math.max(-2, Math.min(2, (event.clientY - rect.y - rect.height / 2) / 90));
    $('mascot').style.setProperty('--eye-x', `${x}px`); $('mascot').style.setProperty('--eye-y', `${y}px`); pointerFrame = null;
  });
}, { passive: true });
document.addEventListener('keydown', wake);
document.addEventListener('pointerdown', wake, { passive: true });
$('mascot').addEventListener('click', () => { wake(); celebrate(visit.vaultUnlocked ? 'That creature badge looks good on you.' : visit.completed.length ? 'You’ve got a good eye. Keep following the clues.' : 'Hi! I’m Pixel. I handle morale and occasional naps.'); });
$('reset-visit').addEventListener('click', () => {
  visit = freshVisit(); networkIP = null; ++ipRequest; $('ip-reveal').disabled = false; $('ip-reveal').textContent = 'Reveal my public IP ↗';
  $('public-ip').textContent = 'Hidden until you ask'; $('ip-status').textContent = ''; $('vault-code').value = '';
  $('vault-feedback').textContent = 'The code route is INSPECT → CAPTURE → TRACE.'; $('badge-status').textContent = '';
  for (const room of ROOMS) $(`feedback-${room.id}`).textContent = 'Solve the case to collect its fragment.';
  renderState(); persist(); say('Fresh pass. Fresh possibilities. Welcome back.'); goTo('check-in');
});
mountCases(); updateClock(); applyMotion(); renderState(); persist(); wake(); setInterval(updateClock, 30000);
