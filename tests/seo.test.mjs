import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { getSession } from '../plan.mjs';

const site = 'https://cjinhuo.github.io/planche-practice/';
const root = new URL('../', import.meta.url);
const read = (path) => readFile(new URL(path, root), 'utf8');

test('sitemap declares both static pages with distinct canonicals and headings', async () => {
  const sitemap = await read('sitemap.xml');
  const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
  assert.deepEqual(urls, [site, new URL('guide/', site).href]);
  for (const url of urls) {
    const path = url.slice(site.length);
    const html = await read(path + 'index.html');
    assert.ok(html.includes('<link rel="canonical" href="' + url + '">'));
    assert.equal((html.match(/<h1>/g) || []).length, 1);
    assert.ok(html.includes('<html lang="zh-CN">'));
  }
  const home = await read('index.html');
  assert.ok(home.includes('href="guide/"'));
  assert.ok(home.includes('type="module" src="app.mjs"'));
});

test('JS-free guide and its relative assets work from the project subpath', async () => {
  const html = await read('guide/index.html');
  assert.ok(!html.includes('<script'));
  assert.ok(html.includes('href="../"'));
  for (const link of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const ref = link[1];
    if (ref.startsWith('#')) {
      assert.ok(html.includes('id="' + ref.slice(1) + '"'));
    } else if (!ref.startsWith('https://')) {
      await access(new URL(ref, new URL('guide/index.html', root)));
    }
  }
});

test('day one example matches the interactive tracker default dose', async () => {
  const guide = await read('guide/index.html');
  const matches = [...guide.matchAll(/<tr data-exercise="([^"]+)"><th scope="row">([^<]+)<\/th><td>(\d+) 组 × (\d+) (秒|次)<\/td><\/tr>/g)];
  assert.deepEqual(
    matches.map(([, id, name, sets, target, unit]) => ({ id, name, sets: +sets, target: +target, unit })),
    getSession(1).exercises.map(({ id, name, sets, target, unit }) => ({ id, name, sets, target, unit })),
  );
});
