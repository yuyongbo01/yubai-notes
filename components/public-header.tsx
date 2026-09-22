'use client';

import Link from 'next/link';
import { ArrowUpRight, Menu } from 'lucide-react';

import { Button, buttonVariants } from '@/components/ui/button';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const links = [
  { href: '/posts', label: '文章' },
  { href: '/about', label: '关于' },
  { href: '/rss.xml', label: 'RSS', native: true },
];

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/85 bg-background/88 backdrop-blur-xl">
      <div className="mx-auto flex h-[70px] max-w-[1180px] items-center justify-between px-5 md:px-8">
        <Link href="/" className="group flex items-center gap-3" aria-label="余白手记首页">
          <span className="grid size-9 rotate-2 place-items-center rounded-[10px] bg-primary font-editorial text-lg font-black text-primary-foreground transition-transform group-hover:-rotate-2">余</span>
          <span><span className="block font-editorial text-[17px] font-black tracking-[-.02em]">余白手记</span><span className="block font-mono text-[9px] uppercase tracking-[.2em] text-muted-foreground">Margin notes</span></span>
          <span className="ml-1 hidden rounded-full border border-primary/20 bg-primary/5 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[.12em] text-primary sm:inline-block">Demo</span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-semibold md:flex" aria-label="主要导航">
          {links.map((item) => item.native
            ? <a key={item.href} href={item.href} className="transition-colors hover:text-primary">{item.label}</a>
            : <Link key={item.href} href={item.href} className="transition-colors hover:text-primary">{item.label}</Link>)}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/studio/login" className={cn(buttonVariants({ variant: 'outline' }), 'hidden h-9 rounded-full border-foreground/15 bg-card px-3.5 text-sm font-bold sm:inline-flex')}>
            编辑工作台 <ArrowUpRight className="size-3.5" />
          </Link>
          <Sheet>
            <SheetTrigger render={<Button variant="outline" size="icon" className="rounded-full md:hidden" aria-label="打开导航" />}><Menu /></SheetTrigger>
            <SheetContent className="w-[min(86vw,360px)] bg-ink text-white">
              <SheetHeader className="border-b border-white/10 p-6"><SheetTitle className="font-editorial text-xl text-white">余白手记</SheetTitle><SheetDescription className="text-white/50">浏览演示站点</SheetDescription></SheetHeader>
              <nav className="flex flex-col px-4 py-4 text-2xl font-bold" aria-label="移动端导航">
                {links.map((item, index) => <SheetClose key={item.href} render={item.native ? <a href={item.href} className="flex items-center justify-between border-b border-white/10 px-2 py-5" /> : <Link href={item.href} className="flex items-center justify-between border-b border-white/10 px-2 py-5" />}><span>{item.label}</span><span className="font-mono text-xs text-white/35">0{index + 1}</span></SheetClose>)}
              </nav>
              <div className="mt-auto p-5"><SheetClose render={<Link href="/studio/login" className="flex h-11 items-center justify-center gap-2 rounded-full bg-lime text-sm font-bold text-ink" />}>进入编辑工作台 <ArrowUpRight className="size-4" /></SheetClose></div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
