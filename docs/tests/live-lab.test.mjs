import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { ROOMS, VAULT_ROUTE, createVisit, restoreVisit, answerRoom, openVault, creatureFor, creaturePixels, renderBadgeSVG, badgeFilename, validIP, missionPatches, recordHello, pixelCommand } from '../../lab/core.mjs';
import { lookupPublicIP } from '../../lab/network.mjs';

const fresh = () => createVisit('0123456789abcdef01234567', new Date('2026-10-18T12:00:00Z'));
const solved = () => ROOMS.reduce((v, r) => answerRoom(v, r.id, r.answer).visit, fresh());

test('a pass is stable, random-seed based, and independent of network information', () => {
  assert.deepEqual(fresh(), fresh());
  assert.notEqual(fresh().callsign, createVisit('ffffffffffffffffffffffff').callsign);
  assert.throws(() => createVisit('<script>'));
  assert.match(fresh().callsign, /^[A-Za-z]+-[A-Za-z]+-[A-F0-9]{3}$/);
});
test('wrong answers earn no fragment; retries and duplicate answers are safe', () => {
  const v = fresh();
  assert.equal(answerRoom(v, 'trace', 0).correct, false);
  assert.equal(answerRoom(v, 'unknown', 0).correct, false);
  assert.equal(answerRoom(v, 'trace', '1').correct, false);
  const answer = answerRoom(v, 'trace', 1);
  assert.equal(answer.correct, true);
  assert.deepEqual(answer.visit.completed, ['trace']);
  assert.deepEqual(answerRoom(answer.visit, 'trace', 1).visit.completed, ['trace']);
  assert.deepEqual(v.completed, []);
});
test('vault requires all fragments and the printed route, not collection order', () => {
  assert.equal(openVault(fresh(), '274').status, 'missing');
  const v = solved();
  assert.equal(openVault(v, '427').status, 'decoy');
  assert.equal(openVault(v, '274').status, 'open');
  assert.equal(openVault(v, '274').visit.vaultUnlocked, true);
  assert.deepEqual(VAULT_ROUTE, ['inspect', 'capture', 'trace']);
});
test('progress survives reload while unknown fields and IP data are discarded', () => {
  const v = openVault(solved(), '274').visit;
  const restored = restoreVisit(JSON.stringify({ ...v, ip: '192.0.2.42', callsign: '<script>', routeStep: 999 }));
  assert.equal(restored.callsign, fresh().callsign);
  assert.equal(restored.vaultUnlocked, true);
  assert.equal(restored.routeStep, 4);
  assert.equal('ip' in restored, false);
  assert.equal(restoreVisit(JSON.stringify({ ...fresh(), vaultUnlocked: true })).vaultUnlocked, false);
  assert.equal(restoreVisit('{broken'), null);
  assert.equal(restoreVisit(null), null);
  assert.equal(restoreVisit(JSON.stringify({ ...fresh(), createdAt: 'invalid' })), null);
});
test('creature art is reproducible, symmetric, and bounded', () => {
  const pixels = creaturePixels(fresh().seed);
  assert.deepEqual(pixels, creaturePixels(fresh().seed));
  assert.ok(pixels.length > 25);
  for (const p of pixels) {
    assert.ok(p.x >= 0 && p.x < 9 && p.y >= 0 && p.y < 9);
    assert.ok(pixels.some(other => other.x === 8 - p.x && other.y === p.y && other.color === p.color));
  }
});
test('both badge editions exclude the IP and all extra visitor fields', () => {
  for (const v of [fresh(), openVault(solved(), '274').visit]) {
    const art = renderBadgeSVG({ ...v, ip: '192.0.2.42', userAgent: 'SECRET_BROWSER' });
    assert.ok(art.includes(v.callsign));
    assert.ok(!art.includes('192.0.2.42') && !art.includes('SECRET_BROWSER'));
    assert.ok(!art.includes('<script') && !art.includes('https://'));
    assert.match(badgeFilename(v), /^harsim-lab-[a-z0-9-]+-(visitor|relic)\.png$/);
    if (v.vaultUnlocked) assert.ok(art.includes(creatureFor(v)));
  }
  assert.ok(renderBadgeSVG({ ...fresh(), callsign: '<img onerror="bad">' }).includes('&lt;img'));
});
test('IP validator accepts IPv4 and IPv6, rejects malformed addresses and HTML', () => {
  for (const ip of ['192.0.2.42', '2001:db8::1', '::', '::1', '::ffff:192.0.2.42', '1:2:3:4:5:6:7:8']) assert.equal(validIP(ip), true, ip);
  for (const ip of ['999.1.2.3', '1.2.3', '<script>', ':::', '1::2::3', ':1:2:3:4:5:6:7:8', '1:2:3:4:5:6:7:8:', null, { ip: '1.2.3.4' }]) assert.equal(validIP(ip), false, String(ip));
});
test('explicit IP lookup omits credentials, referrer and caching', async () => {
  let calls = 0;
  const ip = await lookupPublicIP({ fetcher: async (url, options) => {
    calls++; assert.equal(url, 'https://api64.ipify.org?format=json');
    assert.equal(options.credentials, 'omit'); assert.equal(options.referrerPolicy, 'no-referrer'); assert.equal(options.cache, 'no-store');
    assert.ok(options.signal instanceof AbortSignal);
    return { ok: true, text: async () => '{"ip":"2001:db8::1"}' };
  } });
  assert.equal(calls, 1); assert.equal(ip, '2001:db8::1');
});
test('IP failures, oversized responses and timeouts do not return made-up data', async () => {
  for (const response of [{ ok: false }, { ok: true, text: async () => 'x'.repeat(257) }, { ok: true, text: async () => '{"ip":"<script>"}' }]) {
    await assert.rejects(lookupPublicIP({ fetcher: async () => response }));
  }
  await assert.rejects(lookupPublicIP({ timeout: 5, fetcher: (_, options) => new Promise((_, reject) => options.signal.addEventListener('abort', () => reject(new Error('aborted')))) }));
});
test('IP lookup has only an explicit reveal trigger; main page has no tracking scripts', async () => {
  const app = await readFile(new URL('../../lab/app.mjs', import.meta.url), 'utf8');
  assert.equal(app.match(/await lookupPublicIP\(\)/g)?.length, 1);
  assert.ok(app.indexOf("$('ip-reveal').addEventListener('click'") < app.indexOf('await lookupPublicIP()'));
  const html = await readFile(new URL('../../lab/index.html', import.meta.url), 'utf8');
  assert.ok(!/googletagmanager|google-analytics|gtag\(/i.test(html));
  assert.match(html, /Hidden until you ask/);
  assert.match(html, /prefers-reduced-motion|motion-toggle/);
});

test('earlier passes keep their progress and gain empty mission fields', () => {
  const old = openVault(solved(), '274').visit;
  delete old.hellos; delete old.terminalUsed;
  const restored = restoreVisit(JSON.stringify(old));
  assert.equal(restored.callsign, old.callsign);
  assert.equal(restored.vaultUnlocked, true);
  assert.deepEqual(restored.completed, old.completed);
  assert.equal(restored.hellos, 0); assert.equal(restored.terminalUsed, false);
  assert.deepEqual(missionPatches(restored).filter(p => p.earned).map(p => p.id), ['evidence', 'vault']);
});
test('mission patches reflect completed interactions, not page views', () => {
  assert.equal(missionPatches(fresh()).filter(p => p.earned).length, 0);
  let v = recordHello(fresh());
  assert.deepEqual(missionPatches(v).filter(p => p.earned).map(p => p.id), ['contact']);
  assert.equal(missionPatches({ ...v, routeStep: 3 }).find(p => p.id === 'packet').earned, false);
  v = { ...openVault(solved(), '274').visit, hellos: 1, routeStep: 4, terminalUsed: true };
  assert.equal(missionPatches(v).filter(p => p.earned).length, 5);
  assert.deepEqual(missionPatches(v), missionPatches(restoreVisit(JSON.stringify(v))));
});
test('Pixel interactions are bounded and do not change completed game state', () => {
  const v = fresh(), next = recordHello(v);
  assert.equal(v.hellos, 0); assert.equal(next.hellos, 1);
  assert.deepEqual(next.completed, []);
  assert.equal(recordHello({ ...v, hellos: 99 }).hellos, 99);
  const restored = restoreVisit(JSON.stringify({ ...v, hellos: 999999, terminalUsed: 'yes', terminalHistory: ['private command'] }));
  assert.equal(restored.hellos, 99); assert.equal(restored.terminalUsed, false);
  assert.equal('terminalHistory' in restored, false);
});
test('Pixel hints follow current progress and never spill the vault answer', () => {
  assert.match(pixelCommand('hint', fresh()).lines.join(' '), /SwiftIOC/);
  const one = answerRoom(fresh(), 'trace', 1).visit;
  assert.match(pixelCommand('hint', one).lines.join(' '), /IOC Inspector/);
  const ready = pixelCommand('hint', solved()).lines.join(' ');
  assert.match(ready, /INSPECT → CAPTURE → TRACE/);
  assert.ok(!ready.includes('274'));
  const recovered = openVault(solved(), '274').visit;
  assert.match(pixelCommand('hint', recovered).lines.join(' '), /mission patches/);
});
test('terminal commands are a small local allowlist, not a shell or network client', () => {
  for (const command of ['curl https://example.com', 'rm -rf /', '<img src=x onerror=alert(1)>', 'fetch', 'reveal my ip']) {
    const result = pixelCommand(command, fresh());
    assert.equal(result.recognized, false); assert.equal(result.action, null);
    assert.ok(!result.lines.join(' ').includes(command));
  }
  for (const command of ['help', 'whoami', 'status', 'hint', 'route', 'cases', 'vault', 'badge', 'patches', 'pet', 'party', 'joke', 'clear']) {
    assert.equal(pixelCommand(command, fresh()).recognized, true, command);
  }
  assert.equal(pixelCommand(' ROUTE ', fresh()).action, 'journey');
  assert.equal(pixelCommand('sudo  make me a sandwich', fresh()).recognized, true);
});
test('terminal status uses the random callsign and public game progress only', () => {
  const v = { ...fresh(), ip: '192.0.2.42', terminalHistory: ['do not echo this'] };
  assert.ok(pixelCommand('whoami', v).lines[0].includes(v.callsign));
  assert.ok(!pixelCommand('status', v).lines.join(' ').includes(v.ip));
  assert.match(pixelCommand('status', openVault(solved(), '274').visit).lines.join(' '), /vault: open/);
});
