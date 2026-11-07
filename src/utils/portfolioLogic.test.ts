import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { filterProjects, buildWhatsAppUrl, ProjectEntry } from './portfolioLogic';

const projects: ProjectEntry[] = JSON.parse(
  fs.readFileSync(new URL('../data/projects.json', import.meta.url), 'utf8')
);

test('projects.json contains Tejas three core textile revival works', () => {
  assert.equal(projects.length, 3);
  assert.equal(projects[0].title, 'The Heritage Weave Revival');
  assert.equal(projects[1].title, 'Sustainable Artisan Collective');
  assert.equal(projects[2].title, 'Conscious Couture Edit');
});

test('filterProjects filters by category and search query accurately', () => {
  const all = filterProjects(projects, 'All', '');
  assert.equal(all.length, 3);

  const handloom = filterProjects(projects, 'Handloom', '');
  assert.equal(handloom.length, 1);
  assert.equal(handloom[0].title, 'The Heritage Weave Revival');

  const coutureSearch = filterProjects(projects, 'All', 'couture');
  assert.equal(coutureSearch.length, 1);
  assert.equal(coutureSearch[0].title, 'Conscious Couture Edit');

  const emptySearch = filterProjects(projects, 'All', 'nonexistent-xyz');
  assert.equal(emptySearch.length, 0);
});

test('buildWhatsAppUrl formats Tejas WhatsApp 919654330794 link properly', () => {
  const url = buildWhatsAppUrl(
    '919654330794',
    'Aarav',
    'Conscious Couture Edit (Bespoke Sarees)',
    'Looking for a bespoke zari saree capsule.'
  );
  assert.ok(url.startsWith('https://wa.me/919654330794?text='));
  assert.ok(decodeURIComponent(url).includes('Hello Tejas, I am Aarav.'));
  assert.ok(decodeURIComponent(url).includes('Conscious Couture Edit'));
});
