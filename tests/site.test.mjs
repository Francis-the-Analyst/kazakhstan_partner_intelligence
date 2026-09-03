import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const read = (path) => fs.readFileSync(path, 'utf8');

function load() {
  const context = { window: {} };
  vm.runInNewContext(read('data.js'), context);
  vm.runInNewContext(read('app-core.js'), context);
  return context.window;
}

test('publishes the complete market dataset', () => {
  const { KZ_PROSPECTS } = load();
  assert.equal(KZ_PROSPECTS.length, 70);
  assert.equal(new Set(KZ_PROSPECTS.map((row) => row.id)).size, 70);
  assert.deepEqual([...new Set(KZ_PROSPECTS.map((row) => row.city))].sort(), ['Almaty', 'Astana', 'Shymkent']);
});

test('keeps map points separated and faithful to their score', () => {
  const { KZ_PROSPECTS, KZCore } = load();
  for (const city of ['Almaty', 'Astana', 'Shymkent']) {
    const points = KZCore.layoutPoints(KZ_PROSPECTS.filter((row) => row.city === city), city);
    for (let i = 0; i < points.length; i += 1) {
      assert.ok(Math.abs(points[i].y - points[i].score) <= 16);
      for (let j = i + 1; j < points.length; j += 1) {
        const distance = Math.hypot((points[i].x - points[j].x) * 2.4, (points[i].y - points[j].y) * 4.55);
        assert.ok(distance >= 20, `${city}: ${points[i].id} overlaps ${points[j].id}`);
      }
    }
  }
});

test('supports KPI shortcuts and evidenced competitor dossiers', () => {
  const { KZ_PROSPECTS, KZCore } = load();
  const high = KZCore.derive(KZ_PROSPECTS, KZCore.filtersForKpi('high', KZCore.emptyFilters()), { key:'score', dir:'desc' });
  assert.equal(high.length, 34);
  const interstone = KZ_PROSPECTS.find((row) => row.city === 'Almaty' && row.name.startsWith('Interstone'));
  assert.match(interstone.brands, /Caesarstone/);
  assert.match(interstone.source, /research\/almaty\/interstone\.md/);
});

test('ships both proposals, local assets and production root rewrite', () => {
  const launcher = read('index_R_P.html');
  assert.match(launcher, /proposal_A\.html/);
  assert.match(launcher, /proposal_B\.html/);
  for (const file of ['proposal_A.html', 'proposal_B.html']) {
    const html = read(file);
    assert.match(html, /src="data\.js"/);
    assert.match(html, /src="app-core\.js"/);
    assert.match(html, /https:\/\/www\.cosentino\.com\//);
  }
  for (const brand of ['silestone', 'dekton', 'eclos', 'sensa']) {
    assert.ok(fs.statSync(`assets/${brand}.jpg`).size > 1000);
  }
  const config = JSON.parse(read('vercel.json'));
  assert.deepEqual(config.rewrites[0], { source:'/', destination:'/index_R_P.html' });
});
