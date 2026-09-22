import Link from 'next/link';
import { PenLine } from 'lucide-react';

import { StudioPostsTable } from '@/components/studio-posts-table';
import { buttonVariants } from '@/components/ui/button';
import { studioPosts } from '@/lib/studio-data';
import { cn } from '@/lib/utils';

export default function StudioPostsPage() {
  return (
    <div className="mx-auto w-full max-w-[1220px] p-4 md:p-8">
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="font-mono text-xs uppercase tracking-[.14em] text-muted-foreground">Content library</p><h2 className="mt-2 font-editorial text-3xl font-black tracking-[-.03em]">文章管理</h2><p className="mt-2 text-sm text-muted-foreground">搜索、筛选并继续编辑你的内容。</p></div>
        <Link href="/studio/posts/new" className={cn(buttonVariants({ size: 'lg' }), 'h-10 rounded-full px-4')}><PenLine /> 写新文章</Link>
      </div>
      <StudioPostsTable posts={studioPosts} />
    </div>
  );
}
