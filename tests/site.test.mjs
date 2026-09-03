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

test('adapts map cities to an accessible multi-city selection', () => {
  const { KZ_PROSPECTS, KZCore } = load();
  const empty = KZCore.emptyFilters();
  assert.deepEqual([...KZCore.mapCities(empty)], ['Almaty', 'Astana', 'Shymkent']);

  const selected = KZCore.toggleCitySelection(empty.city, 'Astana');
  const compared = KZCore.toggleCitySelection(selected, 'Almaty');
  assert.deepEqual([...compared], ['Almaty', 'Astana']);
  assert.deepEqual([...KZCore.mapCities({ ...empty, city:compared })], ['Almaty', 'Astana']);

  const rows = KZCore.derive(KZ_PROSPECTS, { ...empty, city:compared }, { key:'score', dir:'desc' });
  assert.equal(rows.length, 60);
  assert.deepEqual([...new Set(rows.map((row) => row.city))].sort(), ['Almaty', 'Astana']);

  const deselected = KZCore.toggleCitySelection(compared, 'Astana');
  assert.deepEqual([...deselected], ['Almaty']);
  assert.match(read('base.css'), /grid-template-columns:repeat\(var\(--city-count,3\),minmax\(0,1fr\)\)/);
});

test('renders competitive intelligence only when research contains evidence', () => {
  const { KZ_PROSPECTS, KZCore } = load();
  const generic = KZ_PROSPECTS.find((row) => row.name === 'MK Mebel');
  const interstone = KZ_PROSPECTS.find((row) => row.city === 'Almaty' && row.name.startsWith('Interstone'));

  assert.equal(KZCore.hasCompetitiveEvidence(generic), false);
  assert.equal(KZCore.competitiveBlockHTML(generic), '');
  assert.equal(KZCore.hasCompetitiveEvidence(interstone), true);
  assert.match(KZCore.competitiveBlockHTML(interstone), /Competitive signal/);
  assert.match(KZCore.competitiveBlockHTML(interstone), /Caesarstone/);
});

test('builds an executive summary for the current filtered view', () => {
  const { KZ_PROSPECTS, KZCore } = load();
  const filters = { ...KZCore.emptyFilters(), city:['Almaty'] };
  const rows = KZCore.derive(KZ_PROSPECTS, filters, { key:'score', dir:'desc' });
  const summary = KZCore.executiveSummary(rows, filters);
  const expectedMetrics = KZCore.metrics(rows);

  assert.deepEqual({ ...summary }, {
    cities:'Almaty',
    prospects:31,
    high:expectedMetrics.high,
    showroom:expectedMetrics.showroom
  });
  assert.equal(KZCore.executiveSummary(KZ_PROSPECTS, KZCore.emptyFilters()).cities, 'All cities');
});

test('exports the filtered intelligence as an Excel-safe CSV', () => {
  const { KZ_PROSPECTS, KZCore } = load();
  const interstone = KZ_PROSPECTS.find((row) => row.city === 'Almaty' && row.name.startsWith('Interstone'));
  const csv = KZCore.prospectsCSV([interstone]);

  assert.ok(csv.startsWith('\ufeff'));
  assert.match(csv, /"Account","City","Profile","Priority","Potential index"/);
  assert.match(csv, /"Interstone \(Caesarstone \/ Grandex Quartz official dealer\)"/);
  assert.match(csv, /"Caesarstone; Avant Quartz; GRANDEX Quartz; NOBLLE Quartz"/);
  assert.equal(csv.trim().split(/\r?\n/).length, 2);
  assert.equal(KZCore.exportFilename({ city:['Astana','Almaty'] }), 'kazakhstan-partner-intelligence-almaty-astana-2026-09-03.csv');
});

test('ships the executive context, map guidance and emphatic city state', () => {
  const controller = read('app-core.js');
  const styles = read('base.css');
  assert.match(controller, /data-executive-context/);
  assert.match(controller, /Dashboard updated · 3 September 2026/);
  assert.match(controller, /Select any point to open the complete account dossier/);
  assert.match(controller, /data-export-csv/);
  assert.match(styles, /\[data-filter-button="city"\]\[aria-pressed="true"\]/);
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
  assert.match(launcher, /class="brand"[\s\S]*?<\/a><p class="top-ownership">Market research &amp; dashboard created by <strong>Francisco González<\/strong><\/p>/);
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
