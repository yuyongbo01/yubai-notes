import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Clock3 } from 'lucide-react';

import { PublicHeader } from '@/components/public-header';
import { buttonVariants } from '@/components/ui/button';
import { featuredPost, posts } from '@/lib/demo-content';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <a
        href="#content"
        className="sr-only z-50 rounded-md bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        跳到正文
      </a>
      <PublicHeader />

      <div id="content">
        <section className="paper-grid border-b border-border">
          <div className="mx-auto grid max-w-[1180px] gap-10 px-5 pb-14 pt-12 md:px-8 md:pb-20 md:pt-16 lg:grid-cols-[1.08fr_.92fr] lg:items-end lg:gap-16">
            <div>
              <div className="mb-7 flex items-center gap-3 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                <span className="inline-block size-2.5 rounded-full bg-lime shadow-[0_0_0_5px_var(--lime-soft)]" />
                个人博客 · 交互演示
              </div>
              <h1 className="max-w-[760px] font-editorial text-[clamp(3rem,7vw,6.2rem)] font-black leading-[.94] tracking-[-0.055em] text-balance">
                把复杂的事，
                <span className="relative inline-block text-primary">
                  写到可以慢慢读懂。
                  <span className="absolute -bottom-2 left-1 h-[7px] w-[82%] -rotate-1 rounded-full bg-lime" />
                </span>
              </h1>
              <p className="mt-8 max-w-2xl text-[1.08rem] leading-8 text-muted-foreground md:text-xl md:leading-9">
                这里记录产品、技术与日常观察。不是答案仓库，而是一份持续修订的思考现场。
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link
                  href="#latest"
                  className={cn(
                    buttonVariants({ size: 'lg' }),
                    'h-11 rounded-full px-5 text-[15px] shadow-[0_5px_0_var(--ink)] hover:translate-y-0.5 hover:shadow-[0_3px_0_var(--ink)]',
                  )}
                >
                  开始阅读 <ArrowRight />
                </Link>
                <Link
                  href="/about"
                  className={cn(
                    buttonVariants({ variant: 'outline', size: 'lg' }),
                    'h-11 rounded-full border-foreground/20 bg-background/80 px-5 text-[15px]',
                  )}
                >
                  关于这个站
                </Link>
              </div>
              <div className="mt-11 flex flex-wrap gap-x-8 gap-y-3 border-t border-foreground/10 pt-5 font-mono text-xs text-muted-foreground">
                <span>第 024 期 · 2026 秋</span>
                <span>每两周更新</span>
                <span>支持 RSS</span>
              </div>
            </div>

            <Link
              href={`/posts/${featuredPost.slug}`}
              className="group relative isolate min-h-[390px] overflow-hidden rounded-[2rem] bg-ink p-7 text-white shadow-[0_28px_80px_rgba(21,35,93,.2)] transition-transform duration-500 hover:-translate-y-1 md:p-9"
            >
              <img
                src="/images/ideas-constellation.png"
                alt=""
                width="1600"
                height="1000"
                className="absolute inset-0 size-full object-cover opacity-48 transition duration-700 group-hover:scale-[1.025] group-hover:opacity-58"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-ink via-ink/68 to-ink/5" aria-hidden="true" />
              <div className="absolute inset-0 opacity-90" aria-hidden="true">
                <span className="absolute -bottom-28 left-8 h-72 w-72 rotate-12 rounded-[3rem] border-[2px] border-white/20" />
                <span className="absolute bottom-20 right-16 h-px w-48 -rotate-[28deg] bg-white/35" />
                <span className="absolute bottom-28 right-16 h-px w-36 -rotate-[28deg] bg-white/20" />
              </div>
              <div className="relative flex h-full min-h-[326px] flex-col justify-between">
                <div className="flex items-start justify-between">
                  <span className="rounded-full bg-lime px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-[.14em] text-ink">
                    本期精选
                  </span>
                  <ArrowUpRight className="size-6 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>
                <div>
                  <p className="mb-3 font-mono text-xs uppercase tracking-[.16em] text-white/55">
                    {featuredPost.category} · {featuredPost.readTime}
                  </p>
                  <h2 className="max-w-xl font-editorial text-3xl font-bold leading-tight tracking-[-.025em] md:text-[2.55rem]">
                    {featuredPost.title}
                  </h2>
                  <p className="mt-4 max-w-lg text-[15px] leading-7 text-white/68">
                    {featuredPost.excerpt}
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </section>

        <section id="latest" className="mx-auto grid max-w-[1180px] gap-12 px-5 py-16 md:px-8 md:py-24 lg:grid-cols-[minmax(0,1fr)_270px]">
          <div>
            <div className="mb-8 flex items-end justify-between border-b-2 border-foreground pb-4">
              <div>
                <p className="mb-2 font-mono text-xs font-semibold uppercase tracking-[.16em] text-primary">
                  Latest notes
                </p>
                <h2 className="font-editorial text-3xl font-black tracking-[-.035em] md:text-4xl">最近写下的</h2>
              </div>
              <Link href="/posts" className="hidden items-center gap-1 text-sm font-semibold hover:text-primary sm:flex">
                全部文章 <ArrowRight className="size-4" />
              </Link>
            </div>

            <div className="divide-y divide-border">
              {posts.slice(1, 5).map((post, index) => (
                <article key={post.slug}>
                  <Link href={`/posts/${post.slug}`} className="group grid gap-4 py-7 sm:grid-cols-[68px_1fr_auto] sm:items-start">
                    <span className="font-mono text-xs text-muted-foreground">0{index + 1}</span>
                    <div>
                      <div className="mb-2 flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-[.12em] text-muted-foreground">
                        <span className="font-bold text-primary">{post.category}</span>
                        <span aria-hidden="true">/</span>
                        <time dateTime={post.date}>{post.dateLabel}</time>
                      </div>
                      <h3 className="font-editorial text-[1.55rem] font-bold leading-tight tracking-[-.02em] transition-colors group-hover:text-primary md:text-[1.8rem]">{post.title}</h3>
                      <p className="mt-3 max-w-2xl text-[15px] leading-7 text-muted-foreground">{post.excerpt}</p>
                    </div>
                    <span className="flex items-center gap-1.5 whitespace-nowrap pt-1 font-mono text-[11px] text-muted-foreground">
                      <Clock3 className="size-3.5" /> {post.readTime}
                    </span>
                  </Link>
                </article>
              ))}
            </div>
          </div>

          <aside className="lg:pt-[5.7rem]">
            <div className="sticky top-24 rounded-[1.5rem] border border-border bg-card p-6 shadow-[0_12px_40px_rgba(23,37,84,.07)]">
              <p className="font-mono text-[11px] font-bold uppercase tracking-[.15em] text-primary">正在关注</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {['产品手记', '独立网络', '创作系统', '设计观察', 'AI 与人'].map((topic) => (
                  <Link
                    key={topic}
                    href={`/posts?tag=${encodeURIComponent(topic)}`}
                    className="rounded-full border border-border bg-background px-3 py-1.5 text-sm transition hover:border-primary hover:text-primary"
                  >
                    {topic}
                  </Link>
                ))}
              </div>
              <div className="mt-7 border-t border-dashed border-border pt-6">
                <p className="font-editorial text-lg font-bold">用你喜欢的方式回来</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">首版不做打扰式弹窗。RSS 会安静地等在这里。</p>
                <a href="/rss.xml" className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:underline">
                  订阅 RSS <ArrowUpRight className="size-4" />
                </a>
              </div>
            </div>
          </aside>
        </section>
      </div>

      <footer className="border-t border-border bg-ink text-white">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-5 px-5 py-9 text-sm md:flex-row md:items-center md:justify-between md:px-8">
          <p className="text-white/62">© 2026 余白手记 · 演示内容</p>
          <div className="flex gap-5 text-white/72">
            <Link href="/about" className="hover:text-white">关于</Link>
            <Link href="/posts" className="hover:text-white">归档</Link>
            <a href="/rss.xml" className="hover:text-white">RSS</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
