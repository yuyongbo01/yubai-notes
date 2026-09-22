import { posts } from '@/lib/demo-content';
import { SITE_URL } from '@/lib/site';

export function GET() {
  const items = posts
    .map((post) => `<item><title><![CDATA[${post.title}]]></title><link>${SITE_URL}/posts/${post.slug}</link><guid>${SITE_URL}/posts/${post.slug}</guid><pubDate>${new Date(post.date).toUTCString()}</pubDate><description><![CDATA[${post.excerpt}]]></description></item>`)
    .join('');
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>余白手记</title><link>${SITE_URL}</link><description>记录产品、技术与日常观察</description>${items}</channel></rss>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
