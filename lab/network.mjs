import { validIP } from './core.mjs?v=20261019-1';

// Importing this module makes no requests. The UI calls it only after the reveal button is pressed.
export async function lookupPublicIP({ fetcher = globalThis.fetch, timeout = 6000 } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetcher('https://api64.ipify.org?format=json', {
      signal: controller.signal, credentials: 'omit', cache: 'no-store', referrerPolicy: 'no-referrer',
    });
    if (!response.ok) throw new Error('Lookup unavailable');
    const raw = await response.text();
    if (raw.length > 256) throw new Error('Unexpected response');
    const data = JSON.parse(raw);
    if (!validIP(data.ip)) throw new Error('Unexpected response');
    return data.ip;
  } finally { clearTimeout(timer); }
}
