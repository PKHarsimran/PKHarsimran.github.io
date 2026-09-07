// Run with Node.js: node docs/tests/ioc-workbench.test.cjs
// Exercise the real UI handlers with a minimal DOM, no network or dependencies.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
class Element {
  constructor() { this.children = []; this.listeners = {}; this.value = ''; this.textContent = ''; this.style = { setProperty() {} }; this.hidden = false; }
  querySelector(selector) { return this.nodes?.[selector]; }
  addEventListener(name, fn) { this.listeners[name] = fn; }
  fire(name, event = {}) { this.listeners[name]?.(event); }
  click() { this.fire('click'); }
  append(...items) { this.children.push(...items); }
  appendChild(item) { this.append(item); }
  prepend(item) { this.children.unshift(item); }
  replaceChildren() { this.children = []; }
  setAttribute() {}
  focus() {}
  select() {}
  remove() {}
}
const root = new Element(); root.nodes = {};
const names = ['input', 'analyze', 'clear', 'sample', 'empty', 'output', 'summary', 'list', 'status', 'mode', 'copy', 'export', 'feedback', 'filter', 'search', 'more'];
const el = Object.fromEntries(names.map(name => {
  const node = new Element(); root.nodes['[data-ioc-' + name + ']'] = node; return [name, node];
}));
el.empty.nodes = { h3: new Element(), p: new Element() }; el.filter.value = 'all';
let copied = ''; let exported;
class TestURL extends URL {}
TestURL.createObjectURL = blob => { exported = blob; return 'blob:test'; };
TestURL.revokeObjectURL = () => {};
const context = { document: { querySelector: () => root, createElement: () => new Element(), body: new Element(), execCommand: () => false }, window: { setTimeout() {} }, navigator: { clipboard: { writeText: text => { copied = text; return Promise.resolve(); } } }, URL: TestURL, Blob };
const workbenchSource = fs.readFileSync(path.join(__dirname, '../../assets/js/ioc-workbench.js'), 'utf8');
assert.ok(!workbenchSource.includes('(?<!') && !workbenchSource.includes('(?<='), 'Workbench must avoid regex lookbehind for older Safari');
vm.runInNewContext(workbenchSource, context);
function analyze(text) { el.input.value = text; el.analyze.click(); }
function values() { return el.list.children.map(row => row.children[1].textContent); }
async function run() {
  const privacySource = fs.readFileSync(path.join(__dirname, '../../assets/js/privacy.js'), 'utf8');
  for (const disabled of [true, false]) {
    for (const choice of ['allow', 'reject']) {
      const head = new Element();
      const privacyWindow = { location: { hostname: 'harsim.ca', reload() {} }, localStorage: { getItem: () => choice, setItem() {} } };
      const privacyDocument = { currentScript: { dataset: { measurementId: 'G-TEST', measurementDisabled: String(disabled) } }, head, cookie: '', createElement: () => new Element() };
      vm.runInNewContext(privacySource, { window: privacyWindow, document: privacyDocument });
      assert.equal(head.children.length, !disabled && choice === 'allow' ? 1 : 0);
      privacyWindow.sitePrivacy.setChoice('allow');
      assert.equal(head.children.length, disabled ? 0 : 1, 'Only enabled pages load measurement after consent');
    }
  }
  analyze('https://EXAMPLE.test/A https://example.test/a https://example.test/A');
  assert.equal(values().length, 2, 'URL path case must distinguish indicators');
  assert.match(el.list.children[0].children[0].children[1].textContent, /2 occurrences/);
  analyze('(https://example.test/wiki/Foo_(bar)) https://example.test/?');
  assert.deepEqual(values(), ['hxxps[:]//example[.]test/wiki/Foo_(bar)', 'hxxps[:]//example[.]test/?']);
  analyze('Admin[@]EXAMPLE[.]test admin@example.test 203[.]0[.]113[.]24');
  assert.equal(values().length, 3, 'Preserve email local-part case');
  analyze('+tag@example.test,second@example.test\n(user+tag@example.test)');
  assert.deepEqual(values(), ['+tag@example[.]test', 'second@example[.]test', 'user+tag@example[.]test'], 'Email boundary prefixes are excluded from values');
  analyze('.bad@example.test bad..name@example.test bad@example..test @nested@example.test');
  assert.deepEqual(values(), [], 'Do not recover email fragments from malformed tokens');
  analyze('https://example.test/user@example.test person@example.test');
  assert.deepEqual(values(), ['hxxps[:]//example[.]test/user@example[.]test', 'person@example[.]test'], 'Email offsets still respect URL overlap');
  analyze('999.2.3.4 1.2.3.4.5 1234.2.3.4 bad..example.test -bad.test 203.0.113.1');
  assert.deepEqual(values(), ['203[.]0[.]113[.]1'], 'Do not extract valid fragments from malformed indicators');
  analyze('example.test EXAMPLE.TEST 203.0.113.1');
  el.filter.value = 'domain'; el.filter.fire('input');
  assert.equal(values().length, 1); el.copy.click();
  assert.equal(copied, 'example[.]test');
  el.export.click();
  const csv = await exported.text();
  assert.match(csv, /"Domain","example.test","example\[\.\]test","2"/);
  assert.ok(!csv.includes('203.0.113.1'), 'Export only matches');
  el.search.value = 'nomatch'; el.search.fire('input');
  assert.equal(values().length, 0); assert.equal(el.copy.disabled, true);
  el.input.fire('input'); assert.equal(el.output.hidden, true); assert.equal(values().length, 0);
  analyze('example.test'); el.sample.click(); assert.equal(el.output.hidden, true);
  analyze('x'.repeat(100001)); assert.match(el.feedback.textContent, /too large/);
  analyze('x'.repeat(100000)); assert.equal(values().length, 0, 'Large non-indicator tokens complete without partial matches');
  analyze(Array.from({length: 205}, (_, i) => 'host' + i + '.test').join('\n'));
  assert.equal(values().length, 100); assert.equal(el.more.hidden, false);
  el.copy.click(); assert.equal(copied.split('\n').length, 205, 'Copy includes undisplayed matches');
  el.more.click(); assert.equal(values().length, 200);
  el.more.click(); assert.equal(values().length, 205); assert.equal(el.more.hidden, true);
  el.clear.click(); assert.equal(el.input.value, ''); assert.equal(values().length, 0);
  console.log('IOC extraction, filtering, copy/export, stale results, input limit, pagination, and measurement privacy checks passed.');
}
run().catch(error => { console.error(error); process.exitCode = 1; });
