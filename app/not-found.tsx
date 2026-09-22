import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { PublicHeader } from '@/components/public-header';

export default function NotFound() {
  return <main className="min-h-screen bg-background"><PublicHeader /><section className="paper-grid grid min-h-[calc(100vh-70px)] place-items-center px-5 py-16"><div className="max-w-2xl text-center"><p className="font-mono text-sm font-bold text-primary">404 / LOST NOTE</p><h1 className="mt-4 font-editorial text-6xl font-black tracking-[-.05em] md:text-8xl">这一页留白了。</h1><p className="mx-auto mt-5 max-w-lg text-lg leading-8 text-muted-foreground">也许链接已经移动，或者这篇笔记还没有写完。回到首页继续读点别的吧。</p><Link href="/" className="mt-8 inline-flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-white"><ArrowLeft className="size-4" /> 返回首页</Link></div></section></main>;
}
