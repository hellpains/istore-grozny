import { readFileSync, readdirSync, writeFileSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const read = path => readFileSync(new URL(path, root), 'utf8').replaceAll('\r\n', '\n');
const parts = ['header', 'footer'].map(name => [name, read('templates/' + name + '.html').trimEnd()]);
const pages = ['index.html', 'product.html'];
for (const directory of readdirSync(root, { withFileTypes: true })) {
  if (!directory.isDirectory() || directory.name.startsWith('.') || directory.name === 'mockups') continue;
  const entries = readdirSync(new URL(directory.name + '/', root));
  if (entries.includes('index.html')) pages.push(directory.name + '/index.html');
}

const check = process.argv.includes('--check');
for (const page of pages) {
  const original = read(page);
  let updated = original;
  const isHome = page === 'index.html';
  for (const [name, template] of parts) {
    const start = '  <!-- shared:' + name + ' -->';
    const end = '  <!-- /shared:' + name + ' -->';
    const from = updated.indexOf(start);
    const to = updated.indexOf(end, from + start.length);
    if (from === -1 || to === -1) throw new Error(page + ' is missing shared markers for ' + name);
    const markup = template.replaceAll('{{homePrefix}}', isHome ? '' : './')
      .replaceAll('{{deliveryPopup}}', isHome ? ' aria-haspopup="dialog"' : '');
    updated = updated.slice(0, from + start.length) + '\n' + markup + '\n' + updated.slice(to);
  }
  if (updated === original) continue;
  if (check) {
    process.exitCode = 1;
    console.error('Outdated shared markup: ' + page);
  } else {
    writeFileSync(new URL(page, root), updated, 'utf8');
    console.log('Updated ' + page);
  }
}
