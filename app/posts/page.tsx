import type { Metadata } from 'next';

import { PostsExplorer } from '@/components/posts-explorer';
import { PublicFooter } from '@/components/public-footer';
import { PublicHeader } from '@/components/public-header';
import { posts } from '@/lib/demo-content';

export const metadata: Metadata = {
  title: '全部文章',
  description: '按时间和主题浏览余白手记的文章。',
  alternates: { canonical: '/posts' },
};

export const dynamic = 'force-static';

export default function PostsPage() {
  return (
    <main className="min-h-screen bg-background">
      <PublicHeader />
      <section className="paper-grid border-b border-border">
        <div className="mx-auto max-w-[1100px] px-5 py-14 md:px-8 md:py-20">
          <p className="font-mono text-xs font-bold uppercase tracking-[.16em] text-primary">Archive / 文章</p>
          <h1 className="mt-3 font-editorial text-5xl font-black tracking-[-.045em] md:text-7xl">所有写下来的，<br />都在这里。</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">按主题筛选，或者直接搜索一个正在困扰你的问题。</p>
        </div>
      </section>
      <section className="mx-auto max-w-[1100px] px-5 py-10 md:px-8 md:py-14">
        <PostsExplorer posts={posts} />
      </section>
      <PublicFooter />
    </main>
  );
}
