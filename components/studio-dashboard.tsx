'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CalendarClock, Eye, FileEdit, PenLine, Sparkles } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { studioPosts, type StudioPost } from '@/lib/studio-data';
import { cn } from '@/lib/utils';

const originalIds = new Set(studioPosts.map((post) => post.id));

export function StudioDashboard() {
  const [posts, setPosts] = useState<StudioPost[]>(studioPosts);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem('yubai-demo-studio-posts');
      if (stored) {
        const parsed = JSON.parse(stored) as StudioPost[];
        if (Array.isArray(parsed)) setPosts(parsed);
      }
    } catch {
      // Keep the starter snapshot when local demo storage is unavailable.
    }
  }, []);

  const counts = useMemo(() => ({
    drafts: posts.filter((post) => post.status === '草稿').length,
    published: posts.filter((post) => post.status === '已发布').length,
    scheduled: posts.filter((post) => post.status === '定时').length,
  }), [posts]);
  const recent = posts.slice(0, 4);
  const latestDraft = posts.find((post) => post.status === '草稿');
  const editHref = (post: StudioPost) => originalIds.has(post.id) ? `/studio/posts/${post.id}/edit` : `/studio/posts/new?draft=${encodeURIComponent(post.id)}`;

  return (
    <div className="mx-auto w-full max-w-[1220px] p-4 md:p-8">
      <section className="relative overflow-hidden rounded-[1.75rem] bg-ink p-6 text-white md:p-9">
        <img src="/images/late-night-writing-desk.png" alt="" width="1600" height="1000" className="absolute inset-0 size-full object-cover object-center opacity-38" />
        <span className="absolute inset-0 bg-gradient-to-r from-ink via-ink/90 to-ink/15" aria-hidden="true" />
        <div className="relative max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[.14em] text-white/55">2026 年 9 月 4 日 · 星期五</p>
          <h2 className="mt-3 font-editorial text-3xl font-black tracking-[-.035em] md:text-4xl">今天想留下些什么？</h2>
          <p className="mt-3 text-sm leading-6 text-white/65">{latestDraft ? `最近草稿「${latestDraft.title}」更新于${latestDraft.updated}。` : '当前没有草稿，可以从一个新想法开始。'}</p>
          <Link href="/studio/posts/new" className={cn(buttonVariants({ size: 'lg' }), 'mt-7 h-11 rounded-full bg-lime px-5 text-ink hover:bg-lime/85')}>
            <PenLine /> 写新文章
          </Link>
        </div>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-3">
        {[
          { label: '草稿', value: counts.drafts, note: '当前演示列表', icon: FileEdit },
          { label: '已发布', value: counts.published, note: '当前演示列表', icon: Eye },
          { label: '定时', value: counts.scheduled, note: '当前演示列表', icon: CalendarClock },
        ].map((item) => (
          <Card key={item.label} className="gap-3 rounded-[1.35rem] border-border py-5 shadow-none">
            <CardHeader className="flex-row items-start justify-between px-5">
              <div><CardDescription>{item.label}</CardDescription><CardTitle className="mt-1 text-3xl font-black">{item.value}</CardTitle></div>
              <span className="grid size-9 place-items-center rounded-xl bg-secondary text-primary"><item.icon className="size-4" /></span>
            </CardHeader>
            <CardContent className="px-5 text-xs text-muted-foreground">{item.note}</CardContent>
          </Card>
        ))}
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_310px]">
        <Card className="rounded-[1.5rem] border-border py-0 shadow-none">
          <CardHeader className="flex-row items-center justify-between border-b border-border px-6 py-5">
            <div><CardTitle className="text-base">最近内容</CardTitle><CardDescription className="mt-1">与文章管理中的本地演示状态同步</CardDescription></div>
            <Link href="/studio/posts" className="flex items-center gap-1 text-xs font-bold text-primary">全部文章 <ArrowRight className="size-3.5" /></Link>
          </CardHeader>
          <CardContent className="divide-y divide-border px-6">
            {recent.map((post) => (
              <Link key={post.id} href={editHref(post)} className="flex items-center gap-4 py-4 hover:text-primary">
                <span className="min-w-0 flex-1"><strong className="block truncate text-sm">{post.title}</strong><span className="mt-1 block text-xs text-muted-foreground">{post.category} · {post.updated}</span></span>
                <Badge variant={post.status === '已发布' ? 'secondary' : post.status === '定时' ? 'outline' : 'default'}>{post.status}</Badge>
              </Link>
            ))}
            {!recent.length && <p className="py-10 text-center text-sm text-muted-foreground">列表为空，先写一篇新文章吧。</p>}
          </CardContent>
        </Card>

        <Card className="rounded-[1.5rem] border-border bg-primary text-primary-foreground shadow-none">
          <CardHeader className="px-6 pt-6"><span className="mb-3 grid size-10 place-items-center rounded-xl bg-white/15"><Sparkles className="size-5" /></span><CardTitle className="font-editorial text-2xl">本周写作提示</CardTitle></CardHeader>
          <CardContent className="px-6 pb-6 text-sm leading-7 text-white/75">从一条你最近改变过看法的旧笔记开始。先写发生了什么，再写是什么让判断移动。</CardContent>
        </Card>
      </section>
    </div>
  );
}
