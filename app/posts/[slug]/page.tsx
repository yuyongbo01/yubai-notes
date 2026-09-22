import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, Clock3 } from 'lucide-react';

import { CopyLinkButton } from '@/components/copy-link-button';
import { PublicFooter } from '@/components/public-footer';
import { PublicHeader } from '@/components/public-header';
import { buttonVariants } from '@/components/ui/button';
import { getPostBySlug, postContent, posts } from '@/lib/demo-content';
import { cn } from '@/lib/utils';
import { SITE_URL } from '@/lib/site';

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: '文章未找到', robots: { index: false, follow: false } };
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/posts/${post.slug}` },
  };
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();
  const currentIndex = posts.findIndex((item) => item.slug === post.slug);
  const nextPost = posts[(currentIndex + 1) % posts.length];
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    author: { '@type': 'Person', name: '余白手记演示作者', url: `${SITE_URL}/about` },
    mainEntityOfPage: `${SITE_URL}/posts/${post.slug}`,
  };
  const sections = postContent[post.slug] ?? [
    {
      heading: '这是一篇演示文章',
      paragraphs: [post.excerpt, '正式版本会从编辑工作台读取完整正文、目录、图片与修订信息；当前页面用于确认长文排版、内容层级和移动端阅读体验。'],
    },
    {
      heading: '先把阅读做好',
      paragraphs: ['文章页尽量不打断阅读。导航、分享与相关推荐都存在，但它们不会抢走正文的视觉优先级。'],
    },
  ];

  return (
    <main className="min-h-screen bg-background">
      <PublicHeader />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <article>
        <header className="paper-grid border-b border-border">
          <div className="mx-auto max-w-[860px] px-5 pb-14 pt-12 md:px-8 md:pb-20 md:pt-20">
            <Link href="/posts" className="mb-10 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary">
              <ArrowLeft className="size-4" /> 返回所有文章
            </Link>
            <div className="flex flex-wrap items-center gap-3 font-mono text-xs uppercase tracking-[.11em] text-muted-foreground">
              <span className="rounded-full bg-primary px-3 py-1 font-bold text-primary-foreground">{post.category}</span>
              <time dateTime={post.date}>{post.dateLabel}</time>
              <span className="inline-flex items-center gap-1.5"><Clock3 className="size-3.5" /> {post.readTime}</span>
            </div>
            <h1 className="mt-7 font-editorial text-[clamp(2.8rem,7vw,5.7rem)] font-black leading-[1.04] tracking-[-.05em] text-balance">{post.title}</h1>
            <p className="mt-7 max-w-3xl text-xl leading-9 text-muted-foreground">{post.excerpt}</p>
            <div className="mt-9 flex items-center justify-between border-t border-foreground/10 pt-5 text-sm">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-full bg-ink font-editorial font-bold text-white">余</span>
                <span><strong className="block">余白手记</strong><span className="text-xs text-muted-foreground">演示作者 · 持续修订</span></span>
              </div>
              <CopyLinkButton />
            </div>
          </div>
        </header>

        {post.slug === 'notes-are-a-conversation' && (
          <figure className="mx-auto -mb-2 mt-10 max-w-[980px] px-5 md:mt-14 md:px-8">
            <img
              src="/images/ideas-constellation.png"
              alt="纸张、墨迹与蓝色光点连接成一片思考星图"
              width="1600"
              height="1000"
              className="aspect-[16/9] w-full rounded-[1.75rem] border border-border object-cover shadow-[0_24px_70px_rgba(20,35,90,.12)]"
            />
            <figcaption className="mt-3 text-center font-mono text-[11px] text-muted-foreground">一条笔记，会在新的连接里改变含义。</figcaption>
          </figure>
        )}

        <div className="mx-auto grid max-w-[1060px] gap-10 px-5 py-14 md:px-8 md:py-20 lg:grid-cols-[180px_minmax(0,720px)] lg:justify-center">
          <aside className="hidden lg:block">
            <nav className="sticky top-28 border-l border-border pl-5" aria-label="文章目录">
              <p className="mb-4 font-mono text-[10px] font-bold uppercase tracking-[.15em] text-muted-foreground">本文目录</p>
              <ol className="space-y-3 text-sm leading-5 text-muted-foreground">
                {sections.map((section, index) => (
                  <li key={section.heading}><a href={`#section-${index + 1}`} className="hover:text-primary">{section.heading}</a></li>
                ))}
              </ol>
            </nav>
          </aside>
          <div className="article-prose min-w-0">
            <p className="lead">写作不是把结论端出来，而是把一条思路如何长出来的过程保留下来。于是每篇文章都更像一封寄给未来自己的长信。</p>
            {sections.map((section, index) => (
              <section key={section.heading} id={`section-${index + 1}`}>
                <h2><a href={`#section-${index + 1}`}>{section.heading}</a></h2>
                {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                {section.quote && <blockquote>{section.quote}</blockquote>}
              </section>
            ))}
            <div className="mt-14 flex flex-wrap gap-2 border-t border-border pt-8">
              {post.tags.map((tag) => <Link key={tag} href={`/posts?tag=${encodeURIComponent(tag)}`} className="rounded-full bg-muted px-3 py-1.5 text-sm hover:bg-secondary hover:text-primary">#{tag}</Link>)}
            </div>
          </div>
        </div>
      </article>

      <section className="border-t border-border bg-card">
        <div className="mx-auto flex max-w-[860px] flex-col gap-5 px-5 py-12 sm:flex-row sm:items-center sm:justify-between md:px-8">
          <div>
            <p className="font-mono text-xs text-primary">NEXT NOTE</p>
            <h2 className="mt-2 font-editorial text-2xl font-bold">{nextPost.title}</h2>
          </div>
          <Link href={`/posts/${nextPost.slug}`} className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'rounded-full')}>
            继续阅读 <ArrowRight />
          </Link>
        </div>
      </section>
      <PublicFooter />
    </main>
  );
}
