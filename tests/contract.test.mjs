import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('exposes the shared commercial handoff contract', () => {
  const core = fs.readFileSync('app-core.js', 'utf8');
  const proposal = fs.readFileSync('proposal_A.html', 'utf8');
  assert.match(core, /Ask Francisco if you need a research/);
  assert.match(core, /Potential index \/ priority/);
  assert.match(core, /Price positioning and service breadth/);
  assert.match(proposal, /Francisco González/);
});
