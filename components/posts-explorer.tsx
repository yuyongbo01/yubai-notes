'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Clock3, Search, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { DemoPost } from '@/lib/demo-content';

export function PostsExplorer({ posts, initialTag = '全部' }: { posts: DemoPost[]; initialTag?: string }) {
  const [query, setQuery] = useState('');
  const [tag, setTag] = useState(initialTag);

  const tags = ['全部', ...Array.from(new Set(posts.flatMap((post) => post.tags)))];
  useEffect(() => {
    const requestedTag = new URLSearchParams(window.location.search).get('tag');
    const availableTags = new Set(posts.flatMap((post) => post.tags));
    if (requestedTag && availableTags.has(requestedTag)) setTag(requestedTag);
  }, [posts]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return posts.filter((post) => {
      const matchesTag = tag === '全部' || post.tags.includes(tag);
      const haystack = `${post.title} ${post.excerpt} ${post.tags.join(' ')}`.toLowerCase();
      return matchesTag && (!normalized || haystack.includes(normalized));
    });
  }, [posts, query, tag]);

  return (
    <>
      <div className="grid gap-5 border-y border-border bg-card px-5 py-6 md:grid-cols-[minmax(240px,1fr)_2fr] md:items-start md:px-7">
        <label className="relative block">
          <span className="sr-only">搜索文章</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜索标题、摘要或标签…"
            className="h-11 rounded-full bg-background pl-9 pr-9"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="清除搜索"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:bg-muted"
            >
              <X className="size-4" />
            </button>
          )}
        </label>
        <div className="flex flex-wrap gap-2" aria-label="按标签筛选">
          {tags.map((item) => (
            <Button
              key={item}
              type="button"
              variant={tag === item ? 'default' : 'outline'}
              onClick={() => setTag(item)}
              className="h-9 rounded-full px-3.5"
            >
              {item}
            </Button>
          ))}
        </div>
      </div>

      <div className="mt-9" aria-live="polite">
        <p className="mb-4 font-mono text-xs text-muted-foreground">
          {filtered.length} 篇文章{tag !== '全部' ? ` · ${tag}` : ''}
        </p>
        {filtered.length ? (
          <div className="grid gap-4 md:grid-cols-2">
            {filtered.map((post, index) => (
              <article key={post.slug}>
                <Link
                  href={`/posts/${post.slug}`}
                  className="group flex min-h-[265px] flex-col justify-between rounded-[1.5rem] border border-border bg-card p-6 transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_18px_50px_rgba(30,50,120,.09)]"
                >
                  <div>
                    <div className="mb-6 flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-primary">{String(index + 1).padStart(2, '0')}</span>
                      <ArrowUpRight className="size-5 text-muted-foreground transition group-hover:text-primary" />
                    </div>
                    <p className="mb-2 font-mono text-[11px] uppercase tracking-[.12em] text-muted-foreground">
                      {post.category} · {post.dateLabel}
                    </p>
                    <h2 className="font-editorial text-2xl font-bold leading-tight tracking-[-.025em] group-hover:text-primary">{post.title}</h2>
                    <p className="mt-3 text-[15px] leading-7 text-muted-foreground">{post.excerpt}</p>
                  </div>
                  <div className="mt-6 flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
                    <Clock3 className="size-3.5" /> {post.readTime}
                  </div>
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-[1.5rem] border border-dashed border-border bg-card px-6 py-16 text-center">
            <p className="font-editorial text-2xl font-bold">这里暂时没有匹配的文章</p>
            <p className="mt-2 text-sm text-muted-foreground">换个关键词，或清除当前标签试试。</p>
            <Button className="mt-5 rounded-full" onClick={() => { setQuery(''); setTag('全部'); }}>
              查看全部文章
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
