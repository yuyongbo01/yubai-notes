import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { posts } from '../lib/demo-content.ts';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outputPath = resolve(projectRoot, 'public', 'rss.xml');
const siteUrl = (process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');

const cdata = (value) => String(value).replaceAll(']]>', ']]]]><![CDATA[>');
const items = posts
  .map(
    (post) =>
      `<item><title><![CDATA[${cdata(post.title)}]]></title><link>${siteUrl}/posts/${post.slug}</link><guid>${siteUrl}/posts/${post.slug}</guid><pubDate>${new Date(post.date).toUTCString()}</pubDate><description><![CDATA[${cdata(post.excerpt)}]]></description></item>`,
  )
  .join('');

const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>余白手记</title><link>${siteUrl}</link><description>记录产品、技术与日常观察</description>${items}</channel></rss>\n`;

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, xml, 'utf8');
console.log(`Generated ${outputPath}`);
