import type { MetadataRoute } from 'next';

import { posts } from '@/lib/demo-content';
import { SITE_URL } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const published = posts.map((post) => ({ url: `${SITE_URL}/posts/${post.slug}`, lastModified: new Date(post.date), changeFrequency: 'monthly' as const, priority: post.featured ? 0.9 : 0.7 }));
  return [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/posts`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/about`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
    ...published,
  ];
}
