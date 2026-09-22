import { copyFile, mkdir, readdir, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

const outputRoot = new URL('../dist/client/', import.meta.url);

async function collectHtmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await collectHtmlFiles(path));
    else if (entry.name.endsWith('.html')) files.push(path);
  }
  return files;
}

const rootPath = outputRoot.pathname.replace(/^\/([A-Za-z]:)/, '$1');
const htmlFiles = await collectHtmlFiles(rootPath);

for (const source of htmlFiles) {
  const route = relative(rootPath, source).replaceAll('\\', '/');
  if (route === 'index.html' || route === '404.html' || route.endsWith('/index.html')) continue;
  const targetDirectory = source.slice(0, -'.html'.length);
  await mkdir(targetDirectory, { recursive: true });
  await copyFile(source, join(targetDirectory, 'index.html'));
}

await writeFile(join(rootPath, '.nojekyll'), '', 'utf8');
console.log(`Prepared ${htmlFiles.length} HTML routes for static hosting`);
