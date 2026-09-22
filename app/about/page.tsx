import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Rss } from 'lucide-react';

import { PublicFooter } from '@/components/public-footer';
import { PublicHeader } from '@/components/public-header';

export const metadata: Metadata = {
  title: '关于',
  description: '关于余白手记与这份个人博客演示。',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      <PublicHeader />
      <section className="paper-grid border-b border-border">
        <div className="mx-auto grid max-w-[1060px] gap-10 px-5 py-14 md:px-8 md:py-24 lg:grid-cols-[280px_1fr] lg:gap-20">
          <div>
            <div className="grid aspect-square max-w-[240px] rotate-2 place-items-center rounded-[2.25rem] bg-ink text-white shadow-[12px_12px_0_var(--lime)]">
              <span className="font-editorial text-8xl font-black">余</span>
            </div>
            <p className="mt-8 font-mono text-xs uppercase tracking-[.14em] text-muted-foreground">演示身份 · 非真实人物资料</p>
          </div>
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-[.16em] text-primary">About / 关于</p>
            <h1 className="mt-4 font-editorial text-[clamp(3rem,7vw,5.6rem)] font-black leading-[1.02] tracking-[-.05em]">在喧闹的网络里，留一块可以慢慢写的地方。</h1>
            <div className="mt-9 max-w-2xl space-y-6 text-lg leading-9 text-muted-foreground">
              <p>余白手记是一份个人博客的交互演示。它关注产品、技术、创作系统，以及这些东西如何改变我们的日常判断。</p>
              <p>这里不追逐即时更新，也不把订阅弹窗放在每一个转角。文章会被反复修改，旧问题也会在新的时间里重新出现。</p>
            </div>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/posts" className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground hover:bg-primary/85">去读文章 <ArrowRight className="size-4" /></Link>
              <a href="/rss.xml" className="inline-flex h-11 items-center gap-2 rounded-full border border-border bg-card px-5 text-sm font-bold hover:border-primary hover:text-primary"><Rss className="size-4" /> RSS</a>
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-[860px] px-5 py-16 md:px-8 md:py-24">
        <p className="font-mono text-xs font-bold uppercase tracking-[.16em] text-primary">Now / 此刻</p>
        <div className="mt-6 grid gap-px overflow-hidden rounded-[1.5rem] border border-border bg-border md:grid-cols-3">
          {[
            ['正在研究', '让个人工具既可靠，又保留手感。'],
            ['正在阅读', '关于独立网络、记忆与注意力的书。'],
            ['正在练习', '用更少的功能，表达更清楚的判断。'],
          ].map(([title, text]) => (
            <div key={title} className="bg-card p-6"><h2 className="font-editorial text-xl font-bold">{title}</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">{text}</p></div>
          ))}
        </div>
      </section>
      <PublicFooter />
    </main>
  );
}
